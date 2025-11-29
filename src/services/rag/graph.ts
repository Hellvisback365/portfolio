import { Annotation, END, START, StateGraph } from '@langchain/langgraph';
import type { DocumentInterface } from '@langchain/core/documents';
import { HumanMessage, SystemMessage, type BaseMessage } from '@langchain/core/messages';
import { getVectorStore } from './vectorStore';
import { getChatModel } from './model';

export interface RagSourceMeta {
  id: string;
  title: string;
  summary?: string;
  tags?: string[];
}

export interface RagResult {
  answer: string;
  sources: RagSourceMeta[];
}

const RagState = Annotation.Root({
  question: Annotation<string>(),
  documents: Annotation<DocumentInterface[]>({
    reducer: (_, update) => update ?? [],
    default: () => [],
  }),
  answer: Annotation<string | null>(),
  sources: Annotation<RagSourceMeta[]>({
    reducer: (_, update) => update ?? [],
    default: () => [],
  }),
});

type RagGraphState = typeof RagState.State;

function normalizeAnswerContent(content: BaseMessage['content']): string {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === 'string') return part;
        if ('text' in part && part.text) return part.text;
        return '';
      })
      .join('\n');
  }
  if (content && typeof content === 'object' && 'text' in content) {
    return (content as { text?: string }).text ?? '';
  }
  return '';
}

async function buildGraph() {
  const vectorStore = await getVectorStore();
  const retriever = vectorStore.asRetriever({ k: 4 });
  const model = getChatModel();

  const workflow = new StateGraph(RagState)
    .addNode('retrieve', async (state: RagGraphState) => {
      const docs = await retriever.invoke(state.question);
      return { documents: docs };
    })
    .addNode('respond', async (state: RagGraphState) => {
      const docs = (state.documents ?? []) as DocumentInterface[];
      const context = docs
        .map((doc, idx) => {
          const title = (doc.metadata?.title as string) || `Fonte ${idx + 1}`;
          return `### ${title}\n${doc.pageContent}`;
        })
        .join('\n\n');

      const prompt = [
        new SystemMessage(
          'Sei un copilot per il portfolio di Vito Piccolini. Rispondi in italiano usando questo formato:\n1) Riga "Sintesi:" con una frase breve.\n2) Sezione "Punti chiave:" con un elenco che usa solo trattini (-) e nessun Markdown, asterischi o grassetto.\nCita esclusivamente il contesto fornito, proponi azioni concrete e chiudi sempre invitando a contattare Vito.'
        ),
        new HumanMessage(
          `Domanda:\n${state.question}\n\nContesto disponibile:\n${context || 'Nessun contesto disponibile.'}`
        ),
      ];

      const response = await model.invoke(prompt);
      const answer = normalizeAnswerContent(response.content);
      const sources = docs.map((doc, idx) => ({
        id: (doc.metadata?.id as string) || `source-${idx + 1}`,
        title: (doc.metadata?.title as string) || `Fonte ${idx + 1}`,
        summary: doc.metadata?.summary as string | undefined,
        tags: (doc.metadata?.tags as string[]) || [],
      }));

      return { answer, sources };
    })
    .addEdge(START, 'retrieve')
    .addEdge('retrieve', 'respond')
    .addEdge('respond', END);

  return workflow.compile();
}

let graphPromise: ReturnType<typeof buildGraph> | null = null;

export async function getRagGraph() {
  if (!graphPromise) {
    graphPromise = buildGraph();
  }
  return graphPromise;
}

export async function runRag(question: string): Promise<RagResult> {
  const graph = await getRagGraph();
  const result = await graph.invoke({ question });
  return {
    answer: result.answer ?? 'Non ho trovato informazioni sufficienti.',
    sources: (result.sources as RagSourceMeta[]) ?? [],
  };
}
