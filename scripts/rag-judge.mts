import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pipeline } from '@huggingface/transformers';
import { HybridRetriever, type RagChunk } from '../src/lib/rag/retriever';
import { generateText, generateObject } from 'ai';
import { createDeepSeek } from '@ai-sdk/deepseek';
import { z } from 'zod';
import * as dotenv from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
dotenv.config({ path: join(rootDir, '.env.local') });

// Configuration
const EMBEDDING_MODEL = 'Xenova/multilingual-e5-small';
const RERANKER_MODEL = 'Xenova/ms-marco-MiniLM-L-6-v2';
const TOP_K = 4;
const NUM_QUERIES = 10; // Sottoinsieme per non hittare limiti API

const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY,
});

const GENERATOR_MODEL = deepseek('deepseek-chat');
const JUDGE_MODEL = deepseek('deepseek-chat');

const evaluationSchema = z.object({
  faithfulness_score: z.number().min(1).max(5).describe("1=allucinazione totale, 5=completamente supportato dal contesto"),
  relevance_score: z.number().min(1).max(5).describe("1=non risponde alla domanda, 5=risponde perfettamente alla domanda"),
  reasoning: z.string().describe("Breve motivazione dei punteggi")
});

async function delay(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

async function loadIndex(): Promise<RagChunk[]> {
  const path = join(rootDir, 'src', 'data', 'rag-index.json');
  const data = JSON.parse(readFileSync(path, 'utf-8'));
  return data.chunks;
}

async function main() {
  console.log('🔄 Caricamento Dataset e Modelli Locali (Embedder/Reranker)...');
  const datasetPath = join(__dirname, 'eval-dataset.json');
  const dataset: any[] = JSON.parse(readFileSync(datasetPath, 'utf-8')).slice(0, NUM_QUERIES);

  const chunks = await loadIndex();
  const retriever = new HybridRetriever(chunks);

  const embedder = await pipeline('feature-extraction', EMBEDDING_MODEL, { dtype: 'q8' });
  const reranker = await pipeline('text-classification', RERANKER_MODEL, { dtype: 'q8' });

  let totalFaithfulness = 0;
  let totalRelevance = 0;
  const reports = [];

  console.log(`\n⚖️ Inizio LLM-as-a-Judge su ${NUM_QUERIES} queries...\n`);

  for (let i = 0; i < dataset.length; i++) {
    const query = dataset[i].query;
    console.log(`[${i + 1}/${NUM_QUERIES}] Valutazione: "${query}"`);

    // --- FASE 1: RETRIEVAL (SOTA Pipeline) ---
    const lexRank = retriever.lexicalSearch(query);
    const out = await embedder([`query: ${query}`], { pooling: 'mean', normalize: true });
    const vec = (out.tolist() as number[][])[0];
    const hybridResults = retriever.semanticAndFuse(lexRank, vec, 8);
    const pairs = hybridResults.map(c => ({ text: query, text_pair: c.text }));
    const scores = await (reranker as any)(pairs) as any[];
    const topChunks = hybridResults.map((c, idx) => ({ ...c, rerankScore: scores[idx].score }))
      .sort((a, b) => b.rerankScore - a.rerankScore)
      .slice(0, TOP_K);

    const contextText = topChunks.map(c => c.text).join('\n---\n');

    // --- FASE 2: GENERAZIONE ---
    const systemPrompt = `Sei l'assistente AI di Vito Piccolini. Rispondi in italiano in modo conciso usando SOLO questo contesto:\n\n${contextText}`;
    
    const { text: generatedResponse } = await generateText({
      model: GENERATOR_MODEL,
      system: systemPrompt,
      prompt: query,
    });

    // --- FASE 3: GIUDIZIO ---
    const judgePrompt = `Sei un giudice imparziale che valuta un sistema RAG.
Domanda dell'utente: "${query}"
Contesto fornito dal DB: "${contextText}"
Risposta generata dall'AI: "${generatedResponse}"

Valuta due metriche da 1 a 5:
- faithfulness_score: Quanto la risposta è supportata dal contesto (senza invenzioni)?
- relevance_score: Quanto la risposta soddisfa la domanda dell'utente?`;

    let evaluation;
    try {
      const { object } = await generateObject({
        model: JUDGE_MODEL,
        schema: evaluationSchema,
        prompt: judgePrompt,
      });
      evaluation = object;
    } catch (e: any) {
      console.warn(`\n⚠️ Errore API del Giudice (Groq): ${e.message}. Riprovo tra 5 secondi...`);
      await delay(5000);
      const { object } = await generateObject({
        model: JUDGE_MODEL,
        schema: evaluationSchema,
        prompt: judgePrompt,
      });
      evaluation = object;
    }

    totalFaithfulness += evaluation.faithfulness_score;
    totalRelevance += evaluation.relevance_score;

    reports.push({
      Query: query,
      Faith: `${evaluation.faithfulness_score}/5`,
      Relev: `${evaluation.relevance_score}/5`,
      Reasoning: evaluation.reasoning.substring(0, 50) + "..."
    });

    // Rispetta i limiti rate di Groq free tier
    await delay(3000); 
  }

  const avgFaith = ((totalFaithfulness / (NUM_QUERIES * 5)) * 100).toFixed(1);
  const avgRelev = ((totalRelevance / (NUM_QUERIES * 5)) * 100).toFixed(1);

  console.log(`\n✅ Valutazione completata.\n`);
  console.log(`📊 Faithfulness Globale: ${avgFaith}% (Assenza di allucinazioni)`);
  console.log(`📊 Relevance Globale:   ${avgRelev}% (Utilità della risposta)\n`);
  
  console.table(reports);
}

main().catch(console.error);
