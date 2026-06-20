import { NextResponse } from 'next/server';
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  generateObject,
  generateText,
  stepCountIs,
  streamText,
  type UIMessage,
} from 'ai';
import { z } from 'zod';
import { getRetriever, type RetrievedChunk } from '@/lib/rag/retriever';
import { globalRatelimit } from '@/lib/ratelimit';
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
const TOP_K = 10;
const ROUTER_TIMEOUT_MS = 3500;

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
  standalone: z.string().describe('La domanda riscritta in forma autonoma, in italiano.'),
  uiAction: z.enum(['none', 'navigateToSection', 'showProject', 'showSkillsRadar']).default('none').describe('Azione UI da eseguire.'),
  uiActionTarget: z.string().optional().describe('Se uiAction è navigateToSection usa una tra about, skills, projects, contact. Se showProject usa il nome del progetto.'),
});

export type RouterDecision = z.infer<typeof routerSchema>;

// ── Helpers ───────────────────────────────────────────────────────────
function parseLLMJSON<T>(text: string, fallback: T): T {
  try { return JSON.parse(text) as T; } catch (e) {}
  try {
    const blockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (blockMatch && blockMatch[1]) return JSON.parse(blockMatch[1].trim()) as T;
  } catch (e) {}
  try {
    const first = text.indexOf('{');
    const last = text.lastIndexOf('}');
    if (first !== -1 && last !== -1 && last > first) {
      return JSON.parse(text.substring(first, last + 1)) as T;
    }
  } catch (e) {}
  return fallback;
}

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

  const SYSTEM_PROMPT = `
Sei il Copilot AI del portfolio di Vito Piccolini, un brillante sviluppatore AI/Software Engineer italiano.
Il tuo scopo è assistere recruiter, aziende e colleghi nel comprendere le competenze e le esperienze di Vito.

REGOLE FONDAMENTALI:
1. MULTILINGUISMO: Rispondi SEMPRE NELLA LINGUA DELL'UTENTE.
2. BASATI SUL CONTESTO: Usa *solo* le informazioni fornite nel blocco [CONTESTO RAG]. Se l'informazione non c'è, ammettilo gentilmente. NON inventare.
3. TONO DI VOCE: Professionale, brillante e conciso. Sei un assistente, non Vito stesso. Parla di lui in terza persona.
4. Sii ESTREMAMENTE conciso e dritto al punto (1-2 frasi al massimo).
5. Tono: elegante, minimale, competente.
6. VIETATO usare convenevoli o filler ("Certamente!", "Certo!", "Ecco a te!").
7. VIETATO annunciare le azioni della UI ("Ti porto alla sezione", "Ecco la scheda"). L'interfaccia si muove da sola in background, tu limitati a rispondere a parole.
8. Non inserire MAI tag o riferimenti grezzi come [S1] o [S2] nel testo.

[CONTESTO RAG (Fonti Recuperate)]
${context}

CONTATTI PUBBLICI (puoi condividerli liberamente)
- Email: vitopiccolini@live.it
- LinkedIn: https://www.linkedin.com/in/vitopiccolini/
- GitHub: https://github.com/Hellvisback365`;
  return SYSTEM_PROMPT;
}



// ── Route ─────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const { success } = await globalRatelimit.limit(ip);
  if (!success) {
    return NextResponse.json({ error: 'Rate limit superato. Riprova più tardi.' }, { status: 429 });
  }

  const providers = getProviders();
  if (!providers) {
    return NextResponse.json(
      {
        error:
          'Copilot non configurato: aggiungi GROQ_API_KEY alle variabili d\'ambiente.',
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

  const retriever = await getRetriever();

  const routerPrompt = `Sei il router di sistema. Classifica l'intento dell'utente.
Devi rispondere SOLO ED ESCLUSIVAMENTE con un JSON valido che rispetta questo schema:
{
  "intent": "portfolio" | "smalltalk",
  "standalone": "La query riformulata senza contesto",
  "uiAction": "navigateToSection" | "showProject" | "showSkillsRadar" | "none",
  "uiActionTarget": "skills" | "projects" | "hero" | o il nome del progetto (se applicabile)
}

Regole per intent:
- "smalltalk": saluti generici, chiacchiere.
- "portfolio": qualsiasi domanda su Vito, competenze, progetti o carriera.

Regole per standalone:
Riscrivi la domanda dell'utente in modo che sia comprensibile da sola (coreference resolution).

Regole per uiAction:
Devi SEMPRE pilotare il sito verso la sezione più pertinente per qualsiasi domanda sul portfolio. Usa "none" SOLO per lo smalltalk.
- "showProject": se la domanda riguarda un progetto specifico (es. TerraNode). uiActionTarget = nome del progetto.
- "showSkillsRadar": se la domanda riguarda linguaggi, tecnologie, stack o competenze.
- "navigateToSection": per qualsiasi altra domanda. uiActionTarget DEVE ESSERE uno tra: "hero" (info generali, studio, chi è), "about" (percorso, località), "projects" (lista progetti generica), "contact" (contatti, email).
- "none": solo se intent = smalltalk.

CONVERSAZIONE:
${recentDialogue(history)}`;

  // Esecuzione parallela: Router (LLM) e Retrieval Lessicale (BM25)
  const routerPromise = generateText({
    model: providers.router,
    temperature: 0,
    prompt: routerPrompt,
    abortSignal: AbortSignal.timeout(ROUTER_TIMEOUT_MS),
  }).catch((err: any) => {
    console.error('[Router] Fallito o andato in timeout:', err);
    return null;
  });

  // Avvio la ricerca lessicale (BM25) in parallelo al router LLM
  const lexPromise = retriever.lexicalSearch(question);

  let sources: RetrievedChunk[] = [];
  const routerRes = await routerPromise;
  
  let routerState: RouterDecision = { intent: 'portfolio', standalone: question, uiAction: 'none' };
  if (routerRes && routerRes.text) {
    routerState = parseLLMJSON<RouterDecision>(routerRes.text, routerState);
  }

  if (routerState.intent !== 'smalltalk') {
    const lexRank = await lexPromise;
    sources = retriever.semanticAndFuse(lexRank, queryVector ?? null, TOP_K);
  }

  const result = streamText({
    model: providers.chat,
    system: buildSystemPrompt(sources),
    messages: await convertToModelMessages(history),
    temperature: 0.4,
    stopWhen: stepCountIs(1),
  });

  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      writer.write({ type: 'start' });
      if (sources.length > 0) {
        writer.write({
          type: 'data-sources' as any,
          data: sources.map((s, i) => ({
            tag: `S${i + 1}`,
            id: s.id,
            title: s.title,
            category: s.category,
            score: Math.round(s.score * 1e4) / 1e4,
          })),
        });
      }
      
      if (routerState.uiAction && routerState.uiAction !== 'none') {
        const actionPayload = JSON.stringify({
          action: routerState.uiAction,
          target: routerState.uiActionTarget,
        });
        const actionId = `ui-action-${Date.now()}`;
        
        writer.write({ type: 'text-start', id: actionId } as any);
        writer.write({
          type: 'text-delta',
          delta: `\n\n__UI_ACTION__${actionPayload}__UI_ACTION__\n\n`,
          id: actionId,
        } as any);
        writer.write({ type: 'text-end', id: actionId } as any);
      }

      writer.merge(result.toUIMessageStream({ sendStart: false }));
    },
  });

  return createUIMessageStreamResponse({ stream });
}
