import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getVectorStore } from '@/services/rag/vectorStore';
import { streamText, generateObject, tool } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { semanticCache } from '@/services/rag/semanticCache';

export const maxDuration = 30;

const requestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system', 'data', 'tool']),
    content: z.string().optional().default(''),
    id: z.string().optional(),
    toolInvocations: z.array(z.any()).optional(),
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
      return NextResponse.json({ error: 'Richiesta non valida.' }, { status: 400 });
    }

    const { messages } = parsed.data;
    
    // We only need to run RAG retrieval if the last message is from the user and not a tool response.
    const lastMessage = messages[messages.length - 1];
    const isUserMessage = lastMessage.role === 'user';
    const question = lastMessage.content;

    const env = getEnvSafe();
    if (!env) {
      return NextResponse.json({ error: 'Il copilot non è configurato. Chiave API mancante.' }, { status: 503 });
    }

    const aiProvider = createOpenAI({
      apiKey: env.apiKey,
      baseURL: env.baseURL,
      headers: {
        'HTTP-Referer': env.site,
        'X-Title': env.title,
      }
    });

    const llmModel = aiProvider(env.llmModel);

    let context = '';
    let sources: { id: string; title: string; summary?: string; tags: string[] }[] = [];

    // RAG Pipeline (only triggered on new user questions)
    if (isUserMessage && question && question.trim().length > 0) {
      // 1. Generate query vector for cache & vector search
      let queryVector: number[] | null = null;
      try {
        const { createEmbeddings } = await import('@/services/rag/embeddings');
        const embeddings = createEmbeddings();
        queryVector = await embeddings.embedQuery(question);
        
        // 2. Semantic Cache Check
        const cached = await semanticCache.get(queryVector, 0.95);
        if (cached) {
            context = `[CACHED ANSWER]: ${cached.answer}`;
            sources = cached.sources;
        }
      } catch (e) {
        console.error('[RAG] Embeddings/Cache error:', e);
      }

      // 3. Retrieval Pipeline if no cache hit
      if (!context) {
        try {
          let allQueries = [question];

          // Multi-Query Expansion (wrapped in its own try/catch to prevent catastrophic failure)
          try {
            const { object: queryVariants } = await generateObject({
              model: llmModel,
              schema: z.object({
                queries: z.array(z.string()).length(3),
              }),
              prompt: `Genera 3 varianti diverse della seguente query per ottimizzare la ricerca in un database vettoriale sul portfolio di Vito Piccolini (es. risolvi acronimi, estrai l'intento principale). Query originale: "${question}"`,
            });
            allQueries = [question, ...queryVariants.queries];
          } catch (expansionError) {
            console.error('[RAG] Multi-Query Expansion failed, falling back to original query only.', expansionError);
          }

          // Parallel Retrieval with K=15
          const vectorStore = await getVectorStore({ k: 15 });
          
          const results = await Promise.all(allQueries.map(q => vectorStore.invoke(q)));
          const allDocs = results.flat();

          // Deduplicate
          const uniqueDocsMap = new Map();
          allDocs.forEach(doc => {
            if (!uniqueDocsMap.has(doc.metadata.id)) uniqueDocsMap.set(doc.metadata.id, doc);
          });
          const uniqueDocs = Array.from(uniqueDocsMap.values());

          // Take top 3 directly (Skipping LLM Reranking for lower latency)
          if (uniqueDocs.length > 0) {
             const finalDocs = uniqueDocs.slice(0, 3);
             
             context = finalDocs
                 .map((doc, idx) => {
                 const title = (doc.metadata?.title as string) || `Fonte ${idx + 1}`;
                 return `### ${title}\n${doc.pageContent}`;
                 })
                 .join('\n\n');

             sources = finalDocs.map((doc, idx) => ({
                 id: (doc.metadata?.id as string) || `source-${idx + 1}`,
                 title: (doc.metadata?.title as string) || `Fonte ${idx + 1}`,
                 summary: doc.metadata?.summary as string | undefined,
                 tags: (doc.metadata?.tags as string[]) || [],
             }));
          }
        } catch (vectorError) {
          console.error('[RAG] Vector store error, continuing without context', vectorError);
        }
      }
    }

    const systemPrompt = `Sei il copilot AI ufficiale del portfolio di Vito Piccolini, un Agente Spaziale avanzato.

REGOLE ASSOLUTE:
1. Usa lo storico della chat SOLO per capire il contesto (es. se l'utente dice "e quanto è durato?"). NON ripetere MAI risposte che hai già dato, non fare riassunti delle discussioni precedenti e non rispondere di nuovo a vecchie domande. Rispondi DIRETTAMENTE e UNICAMENTE all'ultima richiesta.
2. I contatti pubblici di Vito sono:
- Email: vitopiccolini@live.it
- LinkedIn: https://www.linkedin.com/in/vito-p-9120028a/
- GitHub: https://github.com/Hellvisback365
Se l'utente chiede questi dati, SCRIVI I LINK DIRETTAMENTE NELLA RISPOSTA TESTUALE e poi usa il tool per portarlo alla sezione contatti. Non fornire numeri di telefono privati.
2. Rispondi in italiano in modo conciso, brillante e professionale.
3. Se appropriato, usa il tool 'MapsPortfolioSection' per muovere la telecamera verso la sezione giusta (ad esempio "contatti", "progetti", "home"). ATTENZIONE: devi SEMPRE scrivere la tua risposta discorsiva PRIMA di invocare il tool. Scrivi tutto quello che hai da dire e solo alla fine chiama il tool.
4. Se l'utente chiede le tue competenze o stack tecnologico, USA IL TOOL 'showSkillsRadar'.
5. Se l'utente chiede un progetto specifico, USA IL TOOL 'showProjectCard'.

Contesto disponibile dal portfolio di Vito:
${context || 'Nessun contesto specifico trovato per questa domanda.'}
`;

    const coreMessages = messages
      .slice(-1) // Prendi SOLO l'ultimo messaggio per evitare allucinazioni e riassunti
      .filter((m: any) => m.role === 'user')
      .map((m: any) => {
        return { role: m.role, content: m.content || '' };
      }).filter((m: any) => m.content.trim().length > 0);

    const result = streamText({
      model: llmModel,
      messages: coreMessages,
      system: systemPrompt,
      tools: {
        MapsPortfolioSection: tool({
          description: 'Naviga e muovi la telecamera 3D verso una specifica sezione del portfolio (home, about, skills, projects, contact).',
          parameters: z.object({
            section: z.string().describe('Il nome della sezione a cui navigare. Valori supportati: hero, about, skills, projects, contact.').optional(),
          }),
          execute: async (args: any) => `Comando di navigazione 3D inviato al client per la sezione: ${args.section || 'sconosciuta'}`,
        } as any),
        showSkillsRadar: tool({
          description: 'Mostra un grafico radar visuale con le competenze (skills) di Vito.',
          parameters: z.object({}),
          execute: async () => 'Radar competenze mostrato al client.',
        } as any),
        showProjectCard: tool({
          description: 'Mostra la card dettagliata di un progetto specifico richiesto dall\'utente.',
          parameters: z.object({
            projectName: z.string().describe('Il nome del progetto da visualizzare.'),
          }),
          execute: async (args: any) => `Card progetto inviata al client per: ${args.projectName}`,
        } as any),
      },
    });

    // @ts-ignore
    return result.toUIMessageStreamResponse({
      headers: {
        'x-rag-sources': Buffer.from(JSON.stringify(sources)).toString('base64')
      }
    });

  } catch (error: any) {
    console.error('[RAG] API error:', error?.message || error);
    const message = error?.message || 'Errore interno sconosciuto.';
    return NextResponse.json({ error: `Errore del copilot: ${message}` }, { status: 500 });
  }
}
