import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getVectorStore } from '@/services/rag/vectorStore';
import { generateText, generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

export const maxDuration = 30;

const requestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system', 'data']),
    content: z.string().optional().default(''),
    parts: z.array(z.any()).optional(),
  })).min(1),
});

function getEnvSafe() {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }
  const isStandardOpenAi = !process.env.OPENROUTER_API_KEY && !!process.env.OPENAI_API_KEY;
  return {
    apiKey,
    baseURL: process.env.OPENROUTER_BASE_URL || (isStandardOpenAi ? 'https://api.openai.com/v1' : 'https://openrouter.ai/api/v1'),
    site: process.env.OPENROUTER_SITE_URL || 'https://vitopiccolini.dev',
    title: process.env.OPENROUTER_APP_TITLE || 'Vito Piccolini Copilot',
    llmModel: process.env.RAG_LLM_MODEL || (isStandardOpenAi ? 'gpt-4o-mini' : 'openrouter/google/gemini-flash-1.5'),
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Richiesta non valida.', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { messages } = parsed.data;
    const lastMessage = messages[messages.length - 1];
    const question = lastMessage.content;

    if (!question || question.trim().length === 0) {
      return NextResponse.json({ answer: 'Per favore, scrivi una domanda.', sources: [] });
    }

    // Check for API key
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

    // Semantic Router: Classify intent
    let intent: 'portfolio_query' | 'general_chat' = 'portfolio_query';
    try {
      const { object } = await generateObject({
        model: llmModel,
        schema: z.object({
          intent: z.enum(['portfolio_query', 'general_chat']).describe('Se la domanda riguarda Vito Piccolini, il suo portfolio, le sue competenze, o se chiede di cosa sei capace, scegli "portfolio_query". Se è un saluto generico (es. Ciao, Come stai), scegli "general_chat".'),
        }),
        prompt: `Classifica l'intento del seguente messaggio dell'utente: "${question}"`,
      });
      intent = object.intent;
    } catch (classifyError) {
      console.error('[RAG] Intent classification failed, defaulting to general_chat', classifyError);
      intent = 'general_chat';
    }

    if (intent === 'general_chat') {
      const result = await generateText({
        model: llmModel,
        messages: messages as any,
        system: "Sei l'assistente del portfolio di Vito Piccolini. Rispondi in modo amichevole, conciso e in italiano.",
      });
      return NextResponse.json({ answer: result.text, sources: [] });
    }

    // Portfolio Query: RAG execution
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

    const systemPrompt = `Sei un copilot per il portfolio di Vito Piccolini. 
Usa il contesto fornito per rispondere in italiano. Sii conciso e usa elenchi puntati se utile (con trattini -).
Cita esclusivamente il contesto fornito. Se non trovi la risposta nel contesto, dillo chiaramente.

Contesto disponibile:
${context || 'Nessun contesto trovato.'}
`;

    const result = await generateText({
      model: llmModel,
      messages: messages as any,
      system: systemPrompt,
    });

    return NextResponse.json({ answer: result.text, sources });

  } catch (error: any) {
    console.error('[RAG] API error:', error?.message || error);
    const message = error?.message || 'Errore interno sconosciuto.';
    // Return a user-friendly error with the actual cause
    return NextResponse.json(
      { error: `Errore del copilot: ${message}` },
      { status: 500 }
    );
  }
}

