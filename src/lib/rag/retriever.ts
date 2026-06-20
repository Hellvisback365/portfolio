import { Bm25Index } from './bm25';

export interface RagChunk {
  id: string;
  docId: string;
  title: string;
  category: string;
  tags: string[];
  text: string;
  vec?: number[];
}

export interface RagIndexFile {
  model: string;
  dim: number;
  createdAt: string;
  chunks: RagChunk[];
}

export interface RetrievedChunk extends RagChunk {
  score: number;
}

const RRF_K = 60;
const MAX_PER_DOC = 2;

function cosine(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return (na === 0 || nb === 0) ? 0 : dot / (Math.sqrt(na) * Math.sqrt(nb));
}

function performVectorSearch(
  queryVector: number[] | null,
  hasVectors: boolean,
  chunks: RagChunk[]
): Map<string, number> {
  const vecRank = new Map<string, number>();
  if (!queryVector || !hasVectors) return vecRank;

  const scored = chunks
    .filter((c) => c.vec && c.vec.length > 0)
    .map((c) => ({ id: c.id, score: cosine(queryVector, c.vec!) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 24);

  scored.forEach((r, i) => vecRank.set(r.id, i + 1));
  return vecRank;
}

function fuseResultsRRF(lexRank: Map<string, number>, vecRank: Map<string, number>): Array<{ id: string; score: number }> {
  const ids = new Set([...lexRank.keys(), ...vecRank.keys()]);
  const fused: Array<{ id: string; score: number }> = [];
  
  for (const id of ids) {
    let score = 0;
    const lr = lexRank.get(id);
    const vr = vecRank.get(id);
    if (lr) score += 1 / (RRF_K + lr);
    if (vr) score += 1 / (RRF_K + vr);
    fused.push({ id, score });
  }
  
  return fused.sort((a, b) => b.score - a.score);
}

function applyDiversityCap(
  fused: Array<{ id: string; score: number }>,
  byId: Map<string, RagChunk>,
  topK: number
): RetrievedChunk[] {
  const perDoc = new Map<string, number>();
  const result: RetrievedChunk[] = [];
  
  for (const { id, score } of fused) {
    const chunk = byId.get(id);
    if (!chunk) continue;
    
    const used = perDoc.get(chunk.docId) ?? 0;
    if (used >= MAX_PER_DOC) continue;
    
    perDoc.set(chunk.docId, used + 1);
    result.push({ ...chunk, score });
    if (result.length >= topK) break;
  }
  
  return result;
}

export class HybridRetriever {
  private bm25: Bm25Index;
  private byId: Map<string, RagChunk>;
  private cache = new Map<string, RetrievedChunk[]>();
  readonly hasVectors: boolean;

  constructor(private readonly chunks: RagChunk[]) {
    this.bm25 = new Bm25Index(
      chunks.map((c) => ({
        id: c.id,
        text: `${c.title} ${c.tags.join(' ')} ${c.text}`,
      })),
    );
    this.byId = new Map(chunks.map((c) => [c.id, c]));
    this.hasVectors = chunks.some((c) => Array.isArray(c.vec) && c.vec.length > 0);
  }

  lexicalSearch(query: string): Map<string, number> {
    const lexical = this.bm25.search(query, 24);
    const lexRank = new Map<string, number>();
    lexical.forEach((r, i) => lexRank.set(r.id, i + 1));
    return lexRank;
  }

  semanticAndFuse(lexRank: Map<string, number>, queryVector: number[] | null, topK = 4): RetrievedChunk[] {
    const vecRank = performVectorSearch(queryVector, this.hasVectors, this.chunks);
    const fused = fuseResultsRRF(lexRank, vecRank);
    return applyDiversityCap(fused, this.byId, topK);
  }

  private manageCacheLRU(cacheKey: string, result: RetrievedChunk[]) {
    this.cache.set(cacheKey, result);
    if (this.cache.size > 64) {
      const oldest = this.cache.keys().next().value;
      if (oldest !== undefined) this.cache.delete(oldest);
    }
  }

  retrieve(query: string, queryVector: number[] | null, topK = 4): RetrievedChunk[] {
    const cacheKey = `${query.trim().toLowerCase()}|${queryVector ? 'v' : 't'}|${topK}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached) {
      this.cache.delete(cacheKey);
      this.cache.set(cacheKey, cached);
      return cached;
    }

    const lexRank = this.lexicalSearch(query);
    const result = this.semanticAndFuse(lexRank, queryVector, topK);

    this.manageCacheLRU(cacheKey, result);
    return result;
  }
}

let retriever: HybridRetriever | null = null;

export async function getRetriever(): Promise<HybridRetriever> {
  if (retriever) return retriever;
  const index = (await import('@/data/rag-index.json')) as unknown as {
    default?: RagIndexFile;
  } & RagIndexFile;
  const data = (index.default ?? index) as RagIndexFile;
  retriever = new HybridRetriever(data.chunks);
  return retriever;
}
