import { NextResponse } from 'next/server';
import { z } from 'zod';
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import Fuse from 'fuse.js';
import profileDocs from '@/content/profile/documents.json';

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

// --- Fuse.js index built at module load (once per cold start) ---
interface ProfileDoc {
  id: string;
  category: string;
  title: string;
  summary: string;
  body: string;
  tags: string[];
  updatedAt: string;
}

const fuseIndex = new Fuse<ProfileDoc>(profileDocs as ProfileDoc[], {
  keys: [
    { name: 'title', weight: 0.3 },
    { name: 'body', weight: 0.5 },
    { name: 'tags', weight: 0.15 },
    { name: 'summary', weight: 0.05 },
  ],
  includeScore: true,
  threshold: 0.5,
  ignoreLocation: true,
  minMatchCharLength: 2,
});

function retrieveContext(query: string, k = 4) {
  const results = fuseIndex.search(query);
  
  // If Fuse finds relevant results, return them
  if (results.length > 0) {
    return results.slice(0, k).map(r => r.item);
  }
  
  // Fallback: return ALL documents (the corpus is small enough)
  return (profileDocs as ProfileDoc[]).slice(0, k);
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

    // --- RAG: recupera contesto dal portfolio ---
    const relevantDocs = retrieveContext(question, 4);

    const context = relevantDocs
      .map(doc => `### ${doc.title}\n${doc.body}`)
      .join('\n\n');

    const sources = relevantDocs.map(doc => ({
      id: doc.id,
      title: doc.title,
      summary: doc.summary,
      tags: doc.tags || [],
    }));

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
${context}
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

