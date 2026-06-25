import { NextResponse } from 'next/server';
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  generateText,
  streamText,
  type UIMessage,
} from 'ai';
import { z } from 'zod';
import { getRetriever, type RetrievedChunk } from '@/lib/rag/retriever';
import { globalRatelimit } from '@/lib/ratelimit';
import { getProviders } from '@/lib/rag/providers';
import { parseLLMJSON } from '@/lib/rag/parse-llm-json';

/**
 * Copilot AGENTICO, affidabile su Groq (planner a output strutturato).
 *
 * NB: il function-calling nativo è ROTTO su Groq/Llama-3.3 (il modello emette
 * `<function=nome{args}>` che Groq rifiuta, sia in streamText sia in generateText).
 * Quindi l'agente NON usa l'API tool: pianifica via JSON strutturato — lo stesso
 * meccanismo robusto del router originale, qui potenziato a multi-query.
 *
 *   body { messages, queryVector? }
 *        │
 *        ├─ FASE 1 — Planner (8B, JSON, ~timeout 3.5s):
 *        │     decide intent, 1-3 query di ricerca autonome (decomposizione) e
 *        │     l'azione UI. Output validato con Zod, default sicuri.
 *        │
 *        ├─ Esecuzione: per ogni query → data-search (traccia "reasoning") +
 *        │     retrieval IBRIDA (BM25 + cosine + RRF); fonti deduplicate → data-sources.
 *        │     uiAction → data-uiAction (pilota la scena 3D / widget in chat).
 *        │
 *        └─ FASE 2 — Risposta (streamText 70B, NESSUN tool): risposta in streaming
 *              sul contesto raccolto.
 *
 * Le data part emesse sono le stesse di sempre → client e scena 3D invariati.
 */

export const maxDuration = 30;

const HISTORY_WINDOW = 8;
const TOP_K = 10;
const PLANNER_TIMEOUT_MS = 3500;

// ── Validazione del body ──────────────────────────────────────────────
const bodySchema = z.object({
  messages: z.array(z.unknown()).min(1),
  queryVector: z
    .array(z.number().finite())
    .min(8)
    .max(1024)
    .nullish(),
});

const plannerSchema = z.object({
  intent: z.enum(['smalltalk', 'portfolio']).default('portfolio'),
  searches: z.array(z.string().min(1)).max(3).default([]),
  uiAction: z
    .enum(['none', 'navigateToSection', 'showProject', 'showSkillsRadar'])
    .default('none'),
  uiActionTarget: z.string().optional(),
});
type PlannerDecision = z.infer<typeof plannerSchema>;

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

function buildPlannerPrompt(history: UIMessage[]): string {
  return `Sei il PIANIFICATORE del Copilot del portfolio di Vito Piccolini.
Rispondi SOLO ED ESCLUSIVAMENTE con un JSON valido che rispetta questo schema:
{
  "intent": "portfolio" | "smalltalk",
  "searches": ["query autonoma 1", "query autonoma 2"],
  "uiAction": "navigateToSection" | "showProject" | "showSkillsRadar" | "none",
  "uiActionTarget": "hero" | "about" | "projects" | "contact" | nome del progetto
}

REGOLE intent:
- "smalltalk": saluti, convenevoli, chiacchiere → "searches": [], "uiAction": "none".
- "portfolio": qualsiasi domanda su Vito, competenze, progetti, percorso, contatti.

REGOLE searches (decomposizione agentica):
- Genera da 1 a 3 query di ricerca AUTONOME (risolvi i riferimenti al contesto della conversazione).
- Se la domanda ha più parti distinte (es. "parlami della tesi E mostrami TerraNode"), genera una query per ciascuna parte.
- Query brevi e specifiche, in italiano.

REGOLE uiAction (pilota SEMPRE la scena, tranne smalltalk):
- "showSkillsRadar": competenze, stack, linguaggi, tecnologie.
- "showProject": un progetto specifico → "uiActionTarget" = nome del progetto (es. TerraNode, Zenith, EnLexi, The Pulse).
- "navigateToSection": altrimenti → "uiActionTarget" tra "hero" (chi è, info generali), "about" (percorso, formazione, esperienze), "projects" (lista progetti), "contact" (contatti).
- "none": solo se intent = smalltalk.

CONVERSAZIONE:
${recentDialogue(history)}`;
}

function buildAnswerPrompt(sources: RetrievedChunk[]): string {
  const context =
    sources.length > 0
      ? sources
          .map((s, i) => `[S${i + 1}] (${s.title})\n${s.text}`)
          .join('\n\n')
      : '(nessuna fonte recuperata per questa domanda)';

  return `
Sei il Copilot AI del portfolio di Vito Piccolini, un brillante sviluppatore AI/Software Engineer italiano.
Il tuo scopo è assistere recruiter, aziende e colleghi nel comprendere le competenze e le esperienze di Vito.

REGOLE FONDAMENTALI:
1. MULTILINGUISMO: Rispondi SEMPRE NELLA LINGUA DELL'UTENTE.
2. BASATI SUL CONTESTO: Usa *solo* le informazioni fornite nel blocco [CONTESTO RAG]. Se l'informazione non c'è, ammettilo gentilmente. NON inventare.
3. TONO DI VOCE: Professionale, brillante e conciso. Sei un assistente, non Vito stesso. Parla di lui in terza persona.
4. LUNGHEZZA: Sii conciso e diretto di default. Tuttavia, se l'utente chiede un "racconto", di essere "prolisso", o chiede il percorso "completo", ignora la brevità e scrivi un racconto dettagliato. In questo caso, DEVI ASSOLUTAMENTE includere e valorizzare le esperienze lavorative pre-universitarie (6 anni da operaio, retail, ecc. tra il diploma e la laurea), in quanto dimostrano forte resilienza e determinazione.
5. Tono: elegante, professionale, competente. Adattati alla lunghezza richiesta dall'utente.
6. VIETATO usare convenevoli o filler ("Certamente!", "Certo!", "Ecco a te!").
7. VIETATO annunciare le azioni della UI ("Ti porto alla sezione", "Ecco la scheda"). L'interfaccia si muove da sola in background, tu limitati a rispondere a parole.
8. Non inserire MAI tag o riferimenti grezzi come [S1] o [S2] nel testo.

[CONTESTO RAG (Fonti Recuperate)]
${context}

CONTATTI PUBBLICI (puoi condividerli liberamente)
- Email: vitopiccolini@live.it
- LinkedIn: https://www.linkedin.com/in/vitopiccolini/
- GitHub: https://github.com/Hellvisback365`;
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
  const history = messages.slice(-HISTORY_WINDOW);
  const question = lastUserText(history);

  const retriever = await getRetriever();
  const modelMessages = await convertToModelMessages(history);

  // ── FASE 1 — Planner (JSON strutturato, affidabile su Groq) ──
  const plannerRes = await generateText({
    model: providers.router,
    temperature: 0,
    prompt: buildPlannerPrompt(history),
    abortSignal: AbortSignal.timeout(PLANNER_TIMEOUT_MS),
  }).catch((err: unknown) => {
    console.error('[Copilot] Planner fallito o in timeout:', err);
    return null;
  });

  // Default sicuro: cerca la domanda dell'utente, nessuna azione UI.
  let plan: PlannerDecision = {
    intent: 'portfolio',
    searches: question ? [question] : [],
    uiAction: 'none',
  };
  if (plannerRes?.text) {
    const validated = plannerSchema.safeParse(parseLLMJSON<unknown>(plannerRes.text, null));
    if (validated.success) {
      plan = validated.data;
      // Se è portfolio ma il planner non ha proposto query, ripiega sulla domanda.
      if (plan.intent === 'portfolio' && plan.searches.length === 0 && question) {
        plan.searches = [question];
      }
    }
  }

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      writer.write({ type: 'start' });

      // Esecuzione delle ricerche pianificate (dedup per id).
      const sourcesById = new Map<string, RetrievedChunk>();
      if (plan.intent !== 'smalltalk') {
        for (const q of plan.searches) {
          writer.write({ type: 'data-search' as never, data: { query: q } });
          const lexRank = retriever.lexicalSearch(q);
          const found = retriever.semanticAndFuse(lexRank, queryVector, TOP_K);
          for (const c of found) if (!sourcesById.has(c.id)) sourcesById.set(c.id, c);
        }
      }

      const finalSources = [...sourcesById.values()].slice(0, TOP_K);
      if (finalSources.length > 0) {
        writer.write({
          type: 'data-sources' as never,
          data: finalSources.map((s, i) => ({
            tag: `S${i + 1}`,
            id: s.id,
            title: s.title,
            category: s.category,
            score: Math.round(s.score * 1e4) / 1e4,
          })),
        });
      }

      // Azione UI decisa dal planner → pilota la scena 3D / widget in chat.
      if (plan.uiAction !== 'none') {
        writer.write({
          type: 'data-uiAction' as never,
          data: { action: plan.uiAction, target: plan.uiActionTarget },
        });
      }

      // ── FASE 2 — Risposta in streaming (NESSUN tool) ──
      const result = streamText({
        model: providers.chat,
        system: buildAnswerPrompt(finalSources),
        messages: modelMessages,
        temperature: 0.4,
      });

      writer.merge(result.toUIMessageStream({ sendStart: false }));
    },
  });

  return createUIMessageStreamResponse({ stream });
}
