import { StateGraph, START, END, Annotation } from '@langchain/langgraph';
import { getRetriever } from '@/lib/rag/retriever';
import { getProviders } from '@/lib/rag/providers';
import { generateObject } from 'ai';
import { z } from 'zod';

export const StateAnnotation = Annotation.Root({
  messages: Annotation<any[]>({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
  queryVector: Annotation<number[] | null>({
    reducer: (x, y) => y ?? x,
    default: () => null,
  }),
  question: Annotation<string>({
    reducer: (x, y) => y,
    default: () => '',
  }),
  intent: Annotation<'smalltalk' | 'portfolio' | 'navigate'>({
    reducer: (x, y) => y,
    default: () => 'portfolio',
  }),
  standaloneQuestion: Annotation<string>({
    reducer: (x, y) => y,
    default: () => '',
  }),
  sources: Annotation<any[]>({
    reducer: (x, y) => y,
    default: () => [],
  }),
});

const routerSchema = z.object({
  intent: z.enum(['smalltalk', 'portfolio', 'navigate']),
  standalone: z.string().describe('La domanda riscritta in forma autonoma, in italiano.'),
});

/**
 * Node 1: Router
 * Analizza l'intento dell'utente e genera una query standalone
 */
async function routerNode(state: typeof StateAnnotation.State) {
  const providers = getProviders();
  if (!providers) throw new Error('Providers non configurati');

  const dialogue = state.messages
    .slice(-6)
    .map((m: any) => `${m.role}: ${m.content || m.text || ''}`)
    .join('\n');

  try {
    const { object } = await generateObject({
      model: providers.router,
      schema: routerSchema,
      temperature: 0,
      prompt: `Classifica l'ultimo messaggio dell'utente in una chat sul portfolio di Vito Piccolini.
intent:
- "smalltalk": saluti, ringraziamenti
- "navigate": richieste di aprire sezioni
- "portfolio": domande su progetti, skills, Vito

standalone: riscrivi l'ultimo messaggio come domanda autonoma.

CONVERSAZIONE:
${dialogue}`,
    });

    return {
      intent: object.intent,
      standaloneQuestion: object.standalone || state.question,
    };
  } catch (err) {
    // Fallback in caso di timeout o errore
    return {
      intent: 'portfolio' as const,
      standaloneQuestion: state.question,
    };
  }
}

/**
 * Node 2: Retriever
 * Recupera i documenti dal Vector Store (ibrido)
 */
async function retrieverNode(state: typeof StateAnnotation.State) {
  if (state.intent === 'smalltalk') {
    return { sources: [] };
  }

  const retriever = await getRetriever();
  const query = state.standaloneQuestion || state.question;
  
  let sources = retriever.retrieve(query, state.queryVector, 10);
  if (sources.length === 0 && query !== state.question) {
    sources = retriever.retrieve(state.question, state.queryVector, 10);
  }

  return { sources };
}

/**
 * Funzione per il routing condizionale post-router
 */
function shouldRetrieve(state: typeof StateAnnotation.State) {
  if (state.intent === 'smalltalk') {
    return 'generate';
  }
  return 'retrieve';
}

/**
 * Costruzione del grafo
 * Per ora il nodo finale 'generate' viene saltato nel grafo perché 
 * vogliamo usare streamText nella route nativa di Vercel AI SDK per 
 * supportare i React Tool Calls e lo stream alla UI.
 * Questo grafo si occupa del "Reasoning e Retrieval".
 */
const builder = new StateGraph(StateAnnotation)
  .addNode('router', routerNode)
  .addNode('retriever', retrieverNode)
  
  .addEdge(START, 'router')
  .addConditionalEdges('router', shouldRetrieve, {
    retrieve: 'retriever',
    generate: END,
  })
  .addEdge('retriever', END);

export const compileGraph = () => builder.compile();
