export type CacheEntry = {
  vector: number[];
  answer: string;
  sources: { id: string; title: string; summary?: string; tags: string[] }[];
  timestamp: number;
};

// In-memory cache for demo/fast access.
// Can be replaced with Vercel KV / Redis.
const cache: Map<string, CacheEntry> = new Map();

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

export const semanticCache = {
  async get(queryVector: number[], threshold = 0.95): Promise<Omit<CacheEntry, 'vector'> | null> {
    for (const [, entry] of cache.entries()) {
      const similarity = cosineSimilarity(queryVector, entry.vector);
      if (similarity >= threshold) {
        return {
          answer: entry.answer,
          sources: entry.sources,
          timestamp: entry.timestamp,
        };
      }
    }
    return null;
  },

  async set(query: string, queryVector: number[], answer: string, sources: any[]): Promise<void> {
    cache.set(query, {
      vector: queryVector,
      answer,
      sources,
      timestamp: Date.now(),
    });
  },
};
