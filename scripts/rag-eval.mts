import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pipeline } from '@huggingface/transformers';
import { HybridRetriever, type RagChunk } from '../src/lib/rag/retriever';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

const EMBEDDING_MODEL = 'Xenova/multilingual-e5-small';
const RERANKER_MODEL = 'Xenova/ms-marco-MiniLM-L-6-v2';
const TOP_K = 4;

interface EvalCase {
  query: string;
  expectedDocId: string;
}

async function loadIndex(): Promise<RagChunk[]> {
  const path = join(rootDir, 'src', 'data', 'rag-index.json');
  const data = JSON.parse(readFileSync(path, 'utf-8'));
  return data.chunks;
}

async function main() {
  console.log('🔄 Caricamento Dataset e Modelli...');
  const datasetPath = join(__dirname, 'eval-dataset.json');
  const dataset: EvalCase[] = JSON.parse(readFileSync(datasetPath, 'utf-8'));

  const chunks = await loadIndex();
  const retriever = new HybridRetriever(chunks);

  console.log('🔄 Caricamento Embedder...');
  const embedder = await pipeline('feature-extraction', EMBEDDING_MODEL, { dtype: 'q8' });
  
  console.log('🔄 Caricamento Reranker...');
  const reranker = await pipeline('text-classification', RERANKER_MODEL, { dtype: 'q8' });

  let bm25Hits = 0;
  let bm25Mrr = 0;

  let hybridHits = 0;
  let hybridMrr = 0;

  let rerankerHits = 0;
  let rerankerMrr = 0;

  console.log(`\n🚀 Inizio Benchmark (${dataset.length} queries) -- Top K: ${TOP_K}\n`);

  for (let i = 0; i < dataset.length; i++) {
    const { query, expectedDocId } = dataset[i];

    // 1. Lexical (BM25 Only)
    const lexRank = retriever.lexicalSearch(query);
    // Simula semanticAndFuse fornendo vettore nullo
    const bm25Results = retriever.semanticAndFuse(lexRank, null, TOP_K);
    const bm25Idx = bm25Results.findIndex(r => r.docId === expectedDocId);
    if (bm25Idx !== -1) {
      bm25Hits++;
      bm25Mrr += 1 / (bm25Idx + 1);
    }

    // 2. Embeddings (E5)
    const out = await embedder([`query: ${query}`], { pooling: 'mean', normalize: true });
    const vec = (out.tolist() as number[][])[0];
    
    // Hybrid Fusion (BM25 + Cosine)
    const hybridResults = retriever.semanticAndFuse(lexRank, vec, 8); // Recupera 8 per il reranker
    const hybridTop4 = hybridResults.slice(0, TOP_K);
    const hybridIdx = hybridTop4.findIndex(r => r.docId === expectedDocId);
    if (hybridIdx !== -1) {
      hybridHits++;
      hybridMrr += 1 / (hybridIdx + 1);
    }

    // 3. Reranker (Cross-Encoder)
    const pairs = hybridResults.map(c => ({ text: query, text_pair: c.text }));
    const scores = await (reranker as any)(pairs) as any[];
    
    const scoredCandidates = hybridResults.map((c, idx) => ({
      ...c,
      rerankScore: scores[idx].score
    })).sort((a, b) => b.rerankScore - a.rerankScore).slice(0, TOP_K);

    const rerankIdx = scoredCandidates.findIndex(r => r.docId === expectedDocId);
    if (rerankIdx !== -1) {
      rerankerHits++;
      rerankerMrr += 1 / (rerankIdx + 1);
    }
  }

  const n = dataset.length;

  console.table({
    "1. BM25 Only": {
      "Hit Rate @ 4": `${((bm25Hits / n) * 100).toFixed(1)}%`,
      "MRR @ 4": (bm25Mrr / n).toFixed(3)
    },
    "2. Hybrid (BM25 + Cosine)": {
      "Hit Rate @ 4": `${((hybridHits / n) * 100).toFixed(1)}%`,
      "MRR @ 4": (hybridMrr / n).toFixed(3)
    },
    "3. SOTA (Hybrid + Reranker)": {
      "Hit Rate @ 4": `${((rerankerHits / n) * 100).toFixed(1)}%`,
      "MRR @ 4": (rerankerMrr / n).toFixed(3)
    }
  });
  
  console.log('\n✅ Benchmark completato.');
}

main().catch(console.error);
