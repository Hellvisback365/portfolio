import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

// Initialize Redis only if keys are present (fallback gracefull if not configured)
export const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL.replace(/^"|"$/g, '').trim(),
        token: process.env.UPSTASH_REDIS_REST_TOKEN.replace(/^"|"$/g, '').trim(),
      })
    : null;

// Ratelimiter: 20 requests per minute per IP
export const ratelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, '1 m'),
      analytics: true,
    })
  : null;

/**
 * Funzione helper per calcolare la Cosine Similarity tra due vettori
 */
function cosineSimilarity(A: number[], B: number[]): number {
  if (A.length !== B.length || A.length === 0) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < A.length; i++) {
    dotProduct += A[i] * B[i];
    normA += A[i] * A[i];
    normB += B[i] * B[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// In una vera implementazione Upstash Vector o Pinecone sarebbe ideale
// per la vector search, ma per mantenere zero costi aggiuntivi e usare
// solo Redis base, salviamo le tuple [vector, response] delle ultime 50 query.
// Questo è un approccio semplificato per dimostrare il Semantic Caching su Edge.

interface CacheEntry {
  vector: number[];
  response: string;
}

const CACHE_KEY = 'rag:semantic_cache';
const SIMILARITY_THRESHOLD = 0.95; // Molto alto per evitare falsi positivi

export async function getSemanticCache(
  queryVector: number[] | null,
): Promise<string | null> {
  if (!redis || !queryVector || queryVector.length === 0) return null;

  try {
    const entries: CacheEntry[] | null = await redis.get(CACHE_KEY);
    if (!entries || !Array.isArray(entries)) return null;

    for (const entry of entries) {
      const sim = cosineSimilarity(queryVector, entry.vector);
      if (sim >= SIMILARITY_THRESHOLD) {
        console.log(`[Edge Cache] Hit with similarity ${sim.toFixed(3)}`);
        return entry.response; // Restituiamo la risposta cacheata
      }
    }
  } catch (err) {
    console.warn('[Edge Cache] Read Error:', err);
  }
  return null;
}

export async function setSemanticCache(
  queryVector: number[] | null,
  response: string,
): Promise<void> {
  if (!redis || !queryVector || queryVector.length === 0) return;

  try {
    let entries: CacheEntry[] | null = await redis.get(CACHE_KEY);
    if (!entries || !Array.isArray(entries)) entries = [];

    entries.push({ vector: queryVector, response });

    // Manteniamo solo le ultime 50 entry per non saturare la memoria Redis gratuita
    if (entries.length > 50) {
      entries = entries.slice(-50);
    }

    await redis.set(CACHE_KEY, entries);
  } catch (err) {
    console.warn('[Edge Cache] Write Error:', err);
  }
}
