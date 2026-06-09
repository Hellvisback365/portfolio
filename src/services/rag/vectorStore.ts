import { Document } from '@langchain/core/documents';
import type { EmbeddingsInterface } from '@langchain/core/embeddings';
import Fuse from 'fuse.js';
import fs from 'node:fs/promises';
import path from 'node:path';

export type VectorPoint = {
  id: string;
  vector: number[];
  pageContent: string;
  metadata: Record<string, unknown>;
};

function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Reciprocal Rank Fusion
function computeRRF(vectorRanks: Map<string, number>, keywordRanks: Map<string, number>, k = 60): Map<string, number> {
  const rrfScores = new Map<string, number>();
  const allIds = new Set([...vectorRanks.keys(), ...keywordRanks.keys()]);
  
  for (const id of allIds) {
    let score = 0;
    if (vectorRanks.has(id)) {
      score += 1 / (k + vectorRanks.get(id)!);
    }
    if (keywordRanks.has(id)) {
      score += 1 / (k + keywordRanks.get(id)!);
    }
    rrfScores.set(id, score);
  }
  return rrfScores;
}

/** Check if all stored vectors are zero (keyword-only mode) */
function areVectorsZero(points: VectorPoint[]): boolean {
  if (points.length === 0) return true;
  // Check first point only for performance
  const first = points[0].vector;
  return !first || first.length === 0 || first.every(v => v === 0);
}

export type RetrieverOptions = {
  k?: number;
};

export class HybridRetriever {
  private fuse: Fuse<VectorPoint>;
  private keywordOnly: boolean;

  constructor(
    private readonly embeddings: EmbeddingsInterface | null,
    private readonly points: VectorPoint[],
    private readonly options?: RetrieverOptions
  ) {
    this.fuse = new Fuse(points, {
      keys: ['pageContent', 'metadata.title', 'metadata.tags'],
      includeScore: true,
      threshold: 0.6,
    });
    this.keywordOnly = areVectorsZero(points) || !embeddings;
  }

  async invoke(query: string): Promise<Document[]> {
    const k = this.options?.k ?? 4;

    // Keyword Search (always runs)
    const keywordResults = this.fuse.search(query);
    const keywordRanks = new Map<string, number>();
    keywordResults.forEach((res, idx) => keywordRanks.set(res.item.id, idx + 1));

    let vectorRanks = new Map<string, number>();

    // Vector Search — only if we have real embeddings
    if (!this.keywordOnly && this.embeddings) {
      try {
        const queryVector = await this.embeddings.embedQuery(query);
        const vectorResults = this.points
          .map(point => ({
            id: point.id,
            score: cosineSimilarity(queryVector, point.vector)
          }))
          .sort((a, b) => b.score - a.score);

        vectorResults.forEach((res, idx) => vectorRanks.set(res.id, idx + 1));
      } catch (err) {
        console.error('[RAG] Embedding query failed, using keyword-only', err);
      }
    }

    // If keyword-only or vector search failed, just use keyword results
    if (vectorRanks.size === 0) {
      const topIds = keywordResults.slice(0, k).map(r => r.item.id);
      return topIds.map(id => {
        const point = this.points.find(p => p.id === id)!;
        return new Document({
          pageContent: point.pageContent,
          metadata: point.metadata,
        });
      });
    }

    // RRF Fusion
    const rrfScores = computeRRF(vectorRanks, keywordRanks);
    
    const finalIds = Array.from(rrfScores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, k)
      .map(entry => entry[0]);

    return finalIds.map(id => {
      const point = this.points.find(p => p.id === id)!;
      return new Document({
        pageContent: point.pageContent,
        metadata: point.metadata,
      });
    });
  }
}

let pointsCache: VectorPoint[] | null = null;
let retrieverCache: HybridRetriever | null = null;

export async function getVectorStore(options?: { embeddings?: EmbeddingsInterface; k?: number }) {
  if (!pointsCache) {
    const filePath = path.join(process.cwd(), 'src', 'data', 'vectorStore.json');
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      pointsCache = JSON.parse(data) as VectorPoint[];
    } catch (err) {
      console.error('[RAG] Failed to load vectorStore.json', err);
      pointsCache = [];
    }
  }

  if (!retrieverCache || options?.k) {
    // Try to create embeddings, but don't crash if env vars are missing
    let embeddings: EmbeddingsInterface | null = options?.embeddings ?? null;
    if (!embeddings && !areVectorsZero(pointsCache ?? [])) {
      try {
        const { createEmbeddings } = await import('./embeddings');
        embeddings = createEmbeddings();
      } catch (err) {
        console.error('[RAG] Failed to create embeddings, using keyword-only mode', err);
      }
    }
    
    const retriever = new HybridRetriever(embeddings, pointsCache ?? [], { k: options?.k ?? 4 });
    if (!options?.k || options.k === 4) {
      retrieverCache = retriever;
    }
    return retriever;
  }

  return retrieverCache;
}

