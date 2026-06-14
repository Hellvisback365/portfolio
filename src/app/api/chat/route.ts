import { NextResponse } from 'next/server';
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  generateObject,
  stepCountIs,
  streamText,
  tool,
  type LanguageModel,
  type UIMessage,
} from 'ai';
import { z } from 'zod';
import { getRetriever, type RetrievedChunk } from '@/lib/rag/retriever';
import { getProviders } from '@/lib/rag/providers';
import { SECTIONS } from '@/store/useAppStore';

/**
 * Pipeline per richiesta (budget ~quello di una sola chiamata LLM,
 * perché router e retrieval lessicale corrono in parallelo):
 *
 *   body { messages, queryVector? }
 *        │
 *        ├─ router (llama-3.1-8b-instant, ~100 ms, timeout 1.2 s) ──┐
 *        │    intent: smalltalk | portfolio | navigate              │
 *        │    standalone: domanda riscritta self-contained          │
 *        │                                                          ├─ join
 *        └─ HybridRetriever: BM25 + cosine(queryVector) + RRF ──────┘
 *        │
 *        ├─ writer.write('data-sources')  → chips fonti nella UI
 *        └─ streamText (llama-3.3-70b-versatile) + tools → merge
 *
 * Il vecchio route faceva multi-query expansion (3 riscritture LLM in
 * serie) su un corpus di ~20 chunk e poi `messages.slice(-1)`:
 * +1–2 s di latenza per perdere lo storico. Qui lo storico (ultimi 8
 * messaggi) arriva intero al modello e il rewrite è un solo step
 * piccolo, non bloccante oltre il timeout.
 */

export const maxDuration = 30;

const HISTORY_WINDOW = 8;
const TOP_K = 4;
const ROUTER_TIMEOUT_MS = 1200;

// ── Validazione del body ──────────────────────────────────────────────
const bodySchema = z.object({
  messages: z.array(z.unknown()).min(1),
  queryVector: z
    .array(z.number().finite())
    .min(8)
    .max(1024)
    .nullish(),
});

const routerSchema = z.object({
  intent: z.enum(['smalltalk', 'portfolio', 'navigate']),
  standalone: z
    .string()
    .describe('La domanda riscritta in forma autonoma, in italiano.'),
});

type RouterDecision = z.infer<typeof routerSchema>;

// ── Helpers ───────────────────────────────────────────────────────────
function textOf(message: UIMessage): string {
  return (message.parts ?? [])
    .map((p) => (p.type === 'text' ? p.text : ''))
    .filter(Boolean)
    .join(' ')
    .trim();
}

function lastUserText(messages: UIMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === 'user') {
      const t = textOf(messages[i]);
      if (t) return t;
    }
  }
  return '';
}

function recentDialogue(messages: UIMessage[], n = 6): string {
  return messages
    .slice(-n)
    .map((m) => `${m.role === 'user' ? 'Utente' : 'Copilot'}: ${textOf(m)}`)
    .filter((line) => !line.endsWith(': '))
    .join('\n');
}

function buildSystemPrompt(sources: RetrievedChunk[]): string {
  const context =
    sources.length > 0
      ? sources
          .map((s, i) => `[S${i + 1}] (${s.title})\n${s.text}`)
          .join('\n\n')
      : '(nessuna fonte recuperata per questa domanda)';

  return `Sei il copilot del portfolio di Vito Piccolini, AI engineer (Torino).
Rispondi SOLO sulla base delle fonti qui sotto e della conversazione. Se l'informazione non c'è, dillo con onestà e suggerisci cosa puoi raccontare invece: non inventare mai date, aziende, numeri o titoli.

REGOLE
- Rispondi in italiano (o nella lingua dell'utente), in modo conciso: 2-5 frasi in prosa, niente elenchi puntati se non richiesti.
- Quando usi una fonte, citala inline con il suo tag, es. [S1].
- Tono: competente e diretto, mai pomposo.
- Se l'utente vuole vedere una sezione del sito (progetti, skills, contatti...), chiama il tool navigateToSection.
- Se chiede di un progetto specifico, puoi affiancare alla risposta il tool showProject con il nome canonico (es. "LACAM-SWAP", "Zenith", "EnLexi", "TerraNode", "The Pulse", "BeFluent").
- Se chiede una panoramica delle competenze, puoi chiamare showSkillsRadar.
- Includi SEMPRE la risposta testuale completa nello STESSO messaggio in cui chiami un tool: prima scrivi la risposta in prosa, poi chiama il tool. Non chiamare mai un tool senza accompagnarlo dal testo e non ripetere due volte la stessa risposta.

CONTATTI PUBBLICI (puoi condividerli liberamente)
- Email: vitopiccolini@live.it
- LinkedIn: https://www.linkedin.com/in/vitopiccolini/
- GitHub: https://github.com/Hellvisback365

FONTI
${context}`;
}

async function routeQuery(
  router: LanguageModel,
  dialogue: string,
  fallbackQuestion: string,
): Promise<RouterDecision> {
  const fallback: RouterDecision = {
    intent: 'portfolio',
    standalone: fallbackQuestion,
  };
  if (!fallbackQuestion) return { intent: 'smalltalk', standalone: '' };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ROUTER_TIMEOUT_MS);
  try {
    const { object } = await generateObject({
      model: router,
      schema: routerSchema,
      abortSignal: controller.signal,
      temperature: 0,
      prompt: `Classifica l'ultimo messaggio dell'utente in una chat sul portfolio di Vito Piccolini.

intent:
- "smalltalk": saluti, ringraziamenti, chiacchiere non legate al portfolio
- "navigate": l'utente chiede esplicitamente di vedere/aprire una sezione del sito
- "portfolio": domande su Vito (progetti, tesi, esperienze, skills, formazione, contatti)

standalone: riscrivi l'ultimo messaggio come domanda autonoma e completa in italiano, risolvendo i pronomi con il contesto della conversazione (es. "e in quel progetto?" -> "Che ruolo ha avuto Vito nel progetto Zenith?"). Per smalltalk usa stringa vuota.

CONVERSAZIONE
${dialogue}`,
    });
    return object;
  } catch {
    // Timeout o errore del router: la chat non deve accorgersene.
    return fallback;
  } finally {
    clearTimeout(timer);
  }
}

// ── Route ─────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  const providers = getProviders();
  if (!providers) {
    return NextResponse.json(
      {
        error:
          'Copilot non configurato: aggiungi GROQ_API_KEY (gratuita su console.groq.com) alle variabili d\'ambiente.',
      },
      { status: 503 },
    );
  }

  let parsed: z.infer<typeof bodySchema>;
  try {
    parsed = bodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: 'Body non valido.' }, { status: 400 });
  }

  const messages = parsed.messages as UIMessage[];
  const queryVector = parsed.queryVector ?? null;
  const question = lastUserText(messages);
  const history = messages.slice(-HISTORY_WINDOW);

  // Router e retriever partono insieme: il retrieval lessicale sulla
  // domanda grezza copre il caso in cui il router scada in timeout.
  const retrieverPromise = getRetriever();
  const decisionPromise = routeQuery(
    providers.router,
    recentDialogue(history),
    question,
  );

  const [retriever, decision] = await Promise.all([
    retrieverPromise,
    decisionPromise,
  ]);

  let sources: RetrievedChunk[] = [];
  if (decision.intent !== 'smalltalk' && question) {
    const rewritten = decision.standalone.trim();
    // Il vettore è stato calcolato dal client sulla domanda originale:
    // lo usiamo com'è; la gamba BM25 beneficia invece del rewrite.
    sources = retriever.retrieve(rewritten || question, queryVector, TOP_K);
    if (sources.length === 0 && rewritten && rewritten !== question) {
      sources = retriever.retrieve(question, queryVector, TOP_K);
    }
  }

  const result = streamText({
    model: providers.chat,
    system: buildSystemPrompt(sources),
    messages: await convertToModelMessages(history),
    temperature: 0.4,
    stopWhen: stepCountIs(1),
    tools: {
      navigateToSection: tool({
        description:
          'Scorri il sito verso una sezione. Usalo quando l\'utente chiede di vedere o aprire una parte del portfolio.',
        inputSchema: z.object({
          section: z.enum(SECTIONS),
        }),
        execute: async ({ section }) => ({ ok: true, section }),
      }),
      showProject: tool({
        description:
          'Mostra una card riassuntiva di un progetto specifico accanto alla risposta.',
        inputSchema: z.object({
          projectName: z
            .string()
            .describe('Nome canonico del progetto, es. "LACAM-SWAP" o "Zenith".'),
        }),
        execute: async ({ projectName }) => ({ ok: true, projectName }),
      }),
      showSkillsRadar: tool({
        description:
          'Mostra una panoramica visuale dello stack di competenze di Vito.',
        inputSchema: z.object({}),
        execute: async () => ({ ok: true }),
      }),
    },
  });

  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      writer.write({ type: 'start' });
      if (sources.length > 0) {
        writer.write({
          type: 'data-sources',
          data: sources.map((s, i) => ({
            tag: `S${i + 1}`,
            id: s.id,
            title: s.title,
            category: s.category,
            score: Math.round(s.score * 1e4) / 1e4,
          })),
        });
      }
      writer.merge(result.toUIMessageStream({ sendStart: false }));
    },
  });

  return createUIMessageStreamResponse({ stream });
}
