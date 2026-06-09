import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getVectorStore } from '@/services/rag/vectorStore';
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

export const maxDuration = 25;

const requestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system', 'data']),
    content: z.string().optional().default(''),
    parts: z.array(z.any()).optional(),
  })).min(1),
});

function getEnvSafe() {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  const isStandardOpenAi = !process.env.OPENROUTER_API_KEY && !!process.env.OPENAI_API_KEY;
  return {
    apiKey,
    baseURL: process.env.OPENROUTER_BASE_URL || (isStandardOpenAi ? 'https://api.openai.com/v1' : 'https://openrouter.ai/api/v1'),
    site: process.env.OPENROUTER_SITE_URL || 'https://vitopiccolini.dev',
    title: process.env.OPENROUTER_APP_TITLE || 'Vito Piccolini Copilot',
    llmModel: process.env.RAG_LLM_MODEL || (isStandardOpenAi ? 'gpt-4o-mini' : 'google/gemini-2.0-flash-exp:free'),
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Richiesta non valida.' },
        { status: 400 }
      );
    }

    const { messages } = parsed.data;
    const lastMessage = messages[messages.length - 1];
    const question = lastMessage.content;

    if (!question || question.trim().length === 0) {
      return NextResponse.json({ answer: 'Per favore, scrivi una domanda.', sources: [] });
    }

    const env = getEnvSafe();
    if (!env) {
      return NextResponse.json(
        { error: 'Il copilot non è configurato. Chiave API mancante.' },
        { status: 503 }
      );
    }

    const aiProvider = createOpenAI({
      apiKey: env.apiKey,
      baseURL: env.baseURL,
      headers: {
        'HTTP-Referer': env.site,
        'X-Title': env.title,
      }
    });

    const llmModel = aiProvider(env.llmModel.replace('openrouter/', ''));

    // --- RAG: sempre recupera contesto dal portfolio ---
    let context = '';
    let sources: { id: string; title: string; summary?: string; tags: string[] }[] = [];

    try {
      const vectorStore = await getVectorStore({ k: 4 });
      const docs = await vectorStore.invoke(question);

      context = docs
        .map((doc, idx) => {
          const title = (doc.metadata?.title as string) || `Fonte ${idx + 1}`;
          return `### ${title}\n${doc.pageContent}`;
        })
        .join('\n\n');

      sources = docs.map((doc, idx) => ({
        id: (doc.metadata?.id as string) || `source-${idx + 1}`,
        title: (doc.metadata?.title as string) || `Fonte ${idx + 1}`,
        summary: doc.metadata?.summary as string | undefined,
        tags: (doc.metadata?.tags as string[]) || [],
      }));
    } catch (vectorError) {
      console.error('[RAG] Vector store error, continuing without context', vectorError);
    }

    // --- System prompt BLINDATO: rispondi SOLO sul portfolio di Vito ---
    const systemPrompt = `Sei il copilot ufficiale del portfolio di Vito Piccolini.

REGOLE ASSOLUTE (non violarle MAI):
1. Rispondi ESCLUSIVAMENTE a domande su Vito Piccolini, il suo portfolio, le sue competenze, esperienze, progetti e percorso professionale.
2. Se l'utente ti saluta (es. "Ciao", "Come stai"), rispondi con un breve saluto e invitalo a chiederti qualcosa su Vito.
3. Se l'utente fa una domanda che NON riguarda Vito (es. matematica, cultura generale, programmazione generica, qualsiasi altro argomento), rispondi SEMPRE con: "Posso rispondere solo a domande sul portfolio e il percorso di Vito. Chiedimi qualcosa su di lui! 😊"
4. NON fare MAI calcoli, traduzioni, o risposte su argomenti generici. Sei un assistente di portfolio, non un chatbot generico.
5. Rispondi in italiano, in modo conciso e professionale. Usa elenchi puntati con trattini (-) quando utile.
6. Basa le tue risposte SOLO sul contesto fornito qui sotto. Se non trovi la risposta nel contesto, dillo chiaramente.

Contesto disponibile dal portfolio:
${context || 'Nessun contesto trovato.'}
`;

    const result = await generateText({
      model: llmModel,
      prompt: question,
      system: systemPrompt,
    });

    return NextResponse.json({ answer: result.text, sources });

  } catch (error: any) {
    console.error('[RAG] API error:', error?.message || error);
    const message = error?.message || 'Errore interno sconosciuto.';
    return NextResponse.json(
      { error: `Errore del copilot: ${message}` },
      { status: 500 }
    );
  }
}
