import { Document } from '@langchain/core/documents';
import type { EmbeddingsInterface } from '@langchain/core/embeddings';
import type { QdrantClient, Schemas } from '@qdrant/js-client-rest';
import { createEmbeddings } from './embeddings';
import { getQdrantClient } from './qdrantClient';
import { getRagEnv } from './env';

type Retriever = {
  invoke: (query: string) => Promise<Document[]>;
};

type RetrieverOptions = {
  k?: number;
  scoreThreshold?: number;
};

type QdrantPayload = {
  pageContent?: string;
  metadata?: Record<string, unknown>;
};

class QdrantRetriever implements Retriever {
  private readonly limit: number;
  private readonly scoreThreshold?: number;

  constructor(
    private readonly embeddings: EmbeddingsInterface,
    private readonly client: QdrantClient,
    private readonly collectionName: string,
    options?: RetrieverOptions
  ) {
    this.limit = Math.max(1, options?.k ?? 4);
    this.scoreThreshold = options?.scoreThreshold;
  }

  async invoke(query: string) {
    const vector = await this.embeddings.embedQuery(query);
    const results: Schemas['ScoredPoint'][] = await this.client.search(this.collectionName, {
      vector,
      limit: this.limit,
      with_payload: true,
    });

    return results
      .filter((point) => {
        if (typeof this.scoreThreshold !== 'number') return true;
        return (point.score ?? 0) >= this.scoreThreshold;
      })
      .map((point) => {
        const payload = (point.payload ?? {}) as QdrantPayload;
        const pageContent = typeof payload.pageContent === 'string' ? payload.pageContent : '';
        if (!pageContent) {
          return null;
        }

        return new Document({
          pageContent,
          metadata: payload.metadata ?? {},
        });
      })
      .filter((doc): doc is Document => doc !== null);
  }
}

class LightweightQdrantVectorStore {
  private retrieverCache = new Map<string, QdrantRetriever>();

  constructor(
    private readonly embeddings: EmbeddingsInterface,
    private readonly client: QdrantClient,
    private readonly collectionName: string
  ) {}

  asRetriever(options?: RetrieverOptions): Retriever {
    const cacheKey = `${options?.k ?? '4'}:${options?.scoreThreshold ?? 'none'}`;
    if (!this.retrieverCache.has(cacheKey)) {
      this.retrieverCache.set(
        cacheKey,
        new QdrantRetriever(this.embeddings, this.client, this.collectionName, options)
      );
    }
    return this.retrieverCache.get(cacheKey)!;
  }
}

let vectorStorePromise: Promise<LightweightQdrantVectorStore> | null = null;

export async function getVectorStore(options?: { embeddings?: EmbeddingsInterface }) {
  if (!vectorStorePromise || options?.embeddings) {
    const buildStore = async () => {
      const embeddings = options?.embeddings ?? createEmbeddings();
      const client = getQdrantClient();
      const { qdrantCollection } = getRagEnv();
      return new LightweightQdrantVectorStore(embeddings, client, qdrantCollection);
    };

    if (options?.embeddings) {
      return buildStore();
    }

    vectorStorePromise = buildStore();
  }

  return vectorStorePromise;
}
