import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getVectorStore } from '@/services/rag/vectorStore';
import { streamText, generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { getRagEnv } from '@/services/rag/env';

export const maxDuration = 30;

const requestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string(),
  })).min(1),
});

export async function POST(req: Request) {
  try {
    const { messages } = requestSchema.parse(await req.json());
    const lastMessage = messages[messages.length - 1];
    
    const env = getRagEnv();
    const aiProvider = createOpenAI({
      apiKey: env.openRouterApiKey,
      baseURL: env.openRouterBaseUrl,
      headers: {
        'HTTP-Referer': env.openRouterSite,
        'X-Title': env.openRouterTitle,
      }
    });

    const llmModel = aiProvider(env.llmModel.replace('openrouter/', ''));
    
    // Semantic Router: Classify intent
    const { object } = await generateObject({
      model: llmModel,
      schema: z.object({
        intent: z.enum(['portfolio_query', 'general_chat']).describe('Se la domanda riguarda Vito Piccolini, il suo portfolio, le sue competenze, o se chiede di cosa sei capace, scegli "portfolio_query". Se è un saluto generico (es. Ciao, Come stai), scegli "general_chat".'),
      }),
      prompt: `Classifica l'intento del seguente messaggio dell'utente: "${lastMessage.content}"`,
    });

    if (object.intent === 'general_chat') {
      const result = streamText({
        model: llmModel,
        messages,
        system: "Sei l'assistente del portfolio di Vito Piccolini. Rispondi in modo amichevole, conciso e in italiano.",
      });
      return result.toDataStreamResponse();
    }

    // Portfolio Query: RAG execution
    const vectorStore = await getVectorStore({ k: 4 });
    const docs = await vectorStore.invoke(lastMessage.content);
    
    const context = docs
      .map((doc, idx) => {
        const title = (doc.metadata?.title as string) || `Fonte ${idx + 1}`;
        return `### ${title}\n${doc.pageContent}`;
      })
      .join('\n\n');

    const sources = docs.map((doc, idx) => ({
      id: (doc.metadata?.id as string) || `source-${idx + 1}`,
      title: (doc.metadata?.title as string) || `Fonte ${idx + 1}`,
      summary: doc.metadata?.summary as string | undefined,
      tags: (doc.metadata?.tags as string[]) || [],
    }));

    const systemPrompt = `Sei un copilot per il portfolio di Vito Piccolini. 
Usa il contesto fornito per rispondere in italiano. Sii conciso e usa elenchi puntati se utile (con trattini -).
Cita esclusivamente il contesto fornito. Se non trovi la risposta nel contesto, dillo chiaramente.

Contesto disponibile:
${context || 'Nessun contesto trovato.'}
`;

    const result = streamText({
      model: llmModel,
      messages,
      system: systemPrompt,
    });

    return result.toDataStreamResponse({
      headers: {
        'x-rag-sources': Buffer.from(JSON.stringify(sources)).toString('base64'),
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Richiesta non valida.' }, { status: 400 });
    }
    console.error('[RAG] API error', error);
    return NextResponse.json({ error: 'Errore interno.' }, { status: 500 });
  }
}
