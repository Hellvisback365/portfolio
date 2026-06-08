import { Document } from '@langchain/core/documents';
import type { EmbeddingsInterface } from '@langchain/core/embeddings';
import { createEmbeddings } from './embeddings';
import fs from 'node:fs/promises';
import path from 'node:path';
import Fuse from 'fuse.js';

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

export type RetrieverOptions = {
  k?: number;
};

export class HybridRetriever {
  private fuse: Fuse<VectorPoint>;

  constructor(
    private readonly embeddings: EmbeddingsInterface,
    private readonly points: VectorPoint[],
    private readonly options?: RetrieverOptions
  ) {
    this.fuse = new Fuse(points, {
      keys: ['pageContent', 'metadata.title', 'metadata.tags'],
      includeScore: true,
      threshold: 0.6,
    });
  }

  async invoke(query: string): Promise<Document[]> {
    const k = this.options?.k ?? 4;
    
    // 1. Vector Search
    const queryVector = await this.embeddings.embedQuery(query);
    const vectorResults = this.points
      .map(point => ({
        id: point.id,
        score: cosineSimilarity(queryVector, point.vector)
      }))
      .sort((a, b) => b.score - a.score);
    
    const vectorRanks = new Map<string, number>();
    vectorResults.forEach((res, idx) => vectorRanks.set(res.id, idx + 1));

    // 2. Keyword Search
    const keywordResults = this.fuse.search(query);
    const keywordRanks = new Map<string, number>();
    keywordResults.forEach((res, idx) => keywordRanks.set(res.item.id, idx + 1));

    // 3. RRF Fusion
    const rrfScores = computeRRF(vectorRanks, keywordRanks);
    
    // Sort by RRF
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
    const embeddings = options?.embeddings ?? createEmbeddings();
    const retriever = new HybridRetriever(embeddings, pointsCache, { k: options?.k ?? 4 });
    if (!options?.k || options.k === 4) {
      retrieverCache = retriever;
    }
    return retriever;
  }

  return retrieverCache;
}
