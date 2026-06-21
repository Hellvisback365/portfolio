This file is a merged representation of the entire codebase, combined into a single document by Repomix.

<file_summary>
This section contains a summary of this file.

<purpose>
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.
</purpose>

<file_format>
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  - File path as an attribute
  - Full contents of the file
</file_format>

<usage_guidelines>
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.
</usage_guidelines>

<notes>
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)
</notes>

</file_summary>

<directory_structure>
.aidigestignore
.env.example
.github/dependabot.yml
.github/workflows/deploy.yml
.gitignore
.repomixignore
eslint.config.mjs
next.config.js
package.json
postcss.config.mjs
README.md
scripts/eval-dataset.json
scripts/rag-eval.mts
scripts/rag-ingest.mts
scripts/rag-judge.mts
src/__tests__/bm25.test.ts
src/__tests__/retriever.test.ts
src/app/api/chat/feedback/route.ts
src/app/api/chat/route.ts
src/app/api/suggestions/route.ts
src/app/globals.css
src/app/layout.tsx
src/app/opengraph-image.tsx
src/app/page.tsx
src/app/robots.ts
src/app/sitemap.ts
src/components/canvas/CameraRig.tsx
src/components/canvas/Experience.tsx
src/components/canvas/PhylloField.tsx
src/components/canvas/targets.ts
src/components/overlay/AboutOverlay.tsx
src/components/overlay/ContactOverlay.tsx
src/components/overlay/CopilotOverlay.tsx
src/components/overlay/HeroOverlay.tsx
src/components/overlay/HtmlOverlay.tsx
src/components/overlay/NavigationOverlay.tsx
src/components/overlay/ProjectsOverlay.tsx
src/components/overlay/SkillsOverlay.tsx
src/components/ProjectModal.tsx
src/components/ui/Badge.tsx
src/components/ui/contact/FileDropzone.tsx
src/components/ui/copilot/CopilotInput.tsx
src/components/ui/copilot/CopilotMessage.tsx
src/components/ui/CTAButton.tsx
src/components/ui/NeuralCard.tsx
src/components/ui/rag/ProjectCard.tsx
src/components/ui/rag/SkillsRadar.tsx
src/components/ui/SectionHeader.tsx
src/constants/contactConfig.tsx
src/constants/site.ts
src/data/about.ts
src/data/projects.ts
src/data/rag-index.json
src/data/skills.ts
src/hooks/useContactForm.ts
src/hooks/useCopilotChat.ts
src/hooks/useResponsive.ts
src/hooks/useSpeechRecognition.ts
src/lib/rag/bm25.ts
src/lib/rag/embedder.ts
src/lib/rag/parse-llm-json.ts
src/lib/rag/providers.ts
src/lib/rag/retriever.ts
src/lib/rag/worker.ts
src/lib/ratelimit.ts
src/store/useAppStore.ts
src/styles/breakpoints.css
src/types/env.d.ts
TECH_SPEC.md
tsconfig.json
vercel.json
vitest.config.ts
</directory_structure>

<files>
This section contains the contents of the repository's files.

<file path="src/constants/site.ts">
export const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
};
</file>

<file path="src/lib/rag/parse-llm-json.ts">
export function parseLLMJSON<T>(text: string, fallback: T): T {
  try { return JSON.parse(text) as T; } catch (e) {}
  try {
    const blockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (blockMatch && blockMatch[1]) return JSON.parse(blockMatch[1].trim()) as T;
  } catch (e) {}
  try {
    const first = text.indexOf('{');
    const last = text.lastIndexOf('}');
    if (first !== -1 && last !== -1 && last > first) {
      return JSON.parse(text.substring(first, last + 1)) as T;
    }
  } catch (e) {}
  return fallback;
}
</file>

<file path=".aidigestignore">
node_modules
.next
out
public
.git
package-lock.json
yarn.lock
pnpm-lock.yaml
*.log
.DS_Store
dist
build
coverage
*.mp4
*.glb
*.gltf
*.jpg
*.jpeg
*.png
*.gif
*.svg
*.ico`ntsconfig.tsbuildinfo
src/data/vectorStore.json
test*.tsx
test-usechat.js
temp_old_ragchat.tsx
*.old

tsconfig.tsbuildinfo
src/data/vectorStore.json
</file>

<file path=".env.example">
# RAG & API Providers
GROQ_API_KEY="your-groq-api-key"
DEEPSEEK_API_KEY="your-deepseek-api-key" # Usato solo per rag:judge offline

# Ratelimit (Upstash)
UPSTASH_REDIS_REST_URL="https://your-upstash-url"
UPSTASH_REDIS_REST_TOKEN="your-upstash-token"

# Public
NEXT_PUBLIC_LLM_PROVIDER="Groq"
</file>

<file path=".repomixignore">
node_modules
.next
out
public
.git
package-lock.json
yarn.lock
pnpm-lock.yaml
*.log
.DS_Store
dist
build
coverage
*.mp4
*.glb
*.gltf
*.jpg
*.jpeg
*.png
*.gif
*.svg
*.ico
tsconfig.tsbuildinfo
src/data/vectorStore.json
test*.tsx
test-usechat.js
temp_old_ragchat.tsx
*.old
</file>

<file path="eslint.config.mjs">
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
</file>

<file path="postcss.config.mjs">
const config = {
  plugins: ["@tailwindcss/postcss"],
};

export default config;
</file>

<file path="scripts/eval-dataset.json">
[
  { "query": "Quale progetto usa la Retrieval-Augmented Generation?", "expectedDocId": "project-1" },
  { "query": "Hai mai costruito un e-commerce 3D?", "expectedDocId": "project-2" },
  { "query": "Parlami del sistema di raccomandazione per il settore farmaceutico.", "expectedDocId": "project-3" },
  { "query": "Cosa hai fatto in NTT DATA?", "expectedDocId": "timeline-1" },
  { "query": "In quale hackathon hai vinto usando RAG?", "expectedDocId": "timeline-3" },
  { "query": "Dove vive e lavora Vito?", "expectedDocId": "bio-vision" },
  { "query": "Quale scuola superiore o liceo ha frequentato?", "expectedDocId": "education-track" },
  { "query": "Dove si è laureato in Informatica?", "expectedDocId": "education-track" },
  { "query": "Ha esperienza con Next.js e React?", "expectedDocId": "skill-track-web-development" },
  { "query": "Conosce Python per il Machine Learning?", "expectedDocId": "skill-track-ai-ml-data-science" },
  { "query": "Sa usare Docker o strumenti di CI/CD?", "expectedDocId": "tool-devops-automation" },
  { "query": "Parla inglese?", "expectedDocId": "lang-inglese" },
  { "query": "Che stack tecnologico ha usato per i grafi di conoscenza?", "expectedDocId": "project-4" },
  { "query": "Ha mai lavorato con architetture serverless?", "expectedDocId": "skill-track-web-development" },
  { "query": "Quali database vettoriali utilizza per l'AI?", "expectedDocId": "tool-ai-ml-stack" },
  { "query": "Cosa ha sviluppato per Fastweb?", "expectedDocId": "timeline-5" },
  { "query": "Qual è il suo ruolo attuale?", "expectedDocId": "bio-vision" },
  { "query": "Ha mai usato LangChain o LangGraph?", "expectedDocId": "tool-ai-ml-stack" },
  { "query": "Ha partecipato all'Hackathon del Sole 24 Ore?", "expectedDocId": "timeline-4" },
  { "query": "Conosce Postgres e MongoDB?", "expectedDocId": "tool-web-database" }
]
</file>

<file path="scripts/rag-eval.mts">
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
</file>

<file path="scripts/rag-judge.mts">
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
</file>

<file path="src/__tests__/bm25.test.ts">
import { describe, it, expect } from 'vitest';
import { Bm25Index } from '@/lib/rag/bm25';

describe('Bm25Index', () => {
  it('should rank documents containing the exact query higher', () => {
    const docs = [
      { id: '1', text: 'Vito ha partecipato a vari hackathon.' },
      { id: '2', text: 'Vito ama la pizza e il mare.' },
      { id: '3', text: 'Nessun riferimento alla competizione.' },
    ];
    
    const index = new Bm25Index(docs);
    const results = index.search('hackathon', 3);
    
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].id).toBe('1');
  });

  it('should be case-insensitive and handle accents', () => {
    const docs = [
      { id: '1', text: 'L\'università di Bari è ottima.' },
    ];
    
    const index = new Bm25Index(docs);
    const results = index.search('Universita', 3); // Senza accento, maiuscolo
    
    expect(results.length).toBe(1);
    expect(results[0].id).toBe('1');
  });
});
</file>

<file path="src/__tests__/retriever.test.ts">
import { describe, it, expect } from 'vitest';
import { HybridRetriever, type RagChunk } from '@/lib/rag/retriever';

describe('HybridRetriever', () => {
  const mockChunks: RagChunk[] = [
    { id: 'c1', docId: 'doc1', title: 'A', category: 'cat', tags: [], text: 'Apple test', vec: [1, 0] },
    { id: 'c2', docId: 'doc1', title: 'B', category: 'cat', tags: [], text: 'Banana test', vec: [0, 1] },
    { id: 'c3', docId: 'doc1', title: 'C', category: 'cat', tags: [], text: 'Cherry test', vec: [0.5, 0.5] },
    { id: 'c4', docId: 'doc2', title: 'D', category: 'cat', tags: [], text: 'Apple test 2', vec: [1, 0] },
  ];

  it('should fuse lexical and semantic rankings with RRF', () => {
    const retriever = new HybridRetriever(mockChunks);
    
    const lexRank = new Map<string, number>();
    lexRank.set('c1', 1); // c1 è #1 lessicale
    
    // queryVector = [1,0], max cosine con c1 e c4
    const result = retriever.semanticAndFuse(lexRank, [1, 0], 4);
    
    // c1 dovrebbe vincere perché top lessicale E top semantico
    expect(result[0].id).toBe('c1');
  });

  it('should cap diversity to MAX_PER_DOC', () => {
    const retriever = new HybridRetriever(mockChunks);
    
    const lexRank = new Map<string, number>();
    lexRank.set('c1', 1);
    lexRank.set('c2', 2);
    lexRank.set('c3', 3);
    
    const result = retriever.semanticAndFuse(lexRank, null, 4);
    
    // doc1 ha c1, c2, c3. Il cap è 2 per doc. Quindi c3 dovrebbe essere scartato.
    const doc1Count = result.filter(r => r.docId === 'doc1').length;
    expect(doc1Count).toBeLessThanOrEqual(2);
  });
});
</file>

<file path="src/app/opengraph-image.tsx">
import { ImageResponse } from 'next/og';

export const alt = 'Vito Piccolini - AI & Software Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: 'linear-gradient(to bottom right, #04060C, #1A1A24)',
          color: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(to right, #ffffff, #a1a1aa)', backgroundClip: 'text', color: 'transparent' }}>
            Vito Piccolini
          </h1>
          <p style={{ marginTop: 24, fontSize: 32, color: '#a1a1aa', fontWeight: 500 }}>
            AI & Software Engineer
          </p>
          <div style={{ marginTop: 48, display: 'flex', gap: 24, fontSize: 24, color: '#71717a' }}>
            <span>TypeScript</span>
            <span>·</span>
            <span>React</span>
            <span>·</span>
            <span>Python</span>
            <span>·</span>
            <span>RAG</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
</file>

<file path="src/app/robots.ts">
import { MetadataRoute } from 'next';
import { getBaseUrl } from '@/constants/site';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
</file>

<file path="src/app/sitemap.ts">
import { MetadataRoute } from 'next';
import { getBaseUrl } from '@/constants/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
</file>

<file path="src/components/canvas/PhylloField.tsx">
'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { buildAllTargets } from './targets';
import { scrollProgress } from '@/store/useAppStore';

/**
 * PhylloField — la firma del sito.
 *
 * Un unico THREE.Points (1 draw call) con N particelle che morphano tra
 * 5 stati matematici nel vertex shader. I target sono attributi del
 * buffer: la CPU non tocca mai le posizioni dopo il mount, la GPU fa
 * tutto. Nessuna allocazione nel loop, nessuna texture, nessuna luce.
 *
 * Tuning rapido: COUNT / COUNT_MOBILE / uSize qui sotto.
 */
const COUNT = 14000;
const COUNT_MOBILE = 6500;

const VERTEX = /* glsl */ `
  attribute vec3 aT1;
  attribute vec3 aT2;
  attribute vec3 aT3;
  attribute vec3 aT4;
  attribute vec4 aSeed; // x: fase drift · y: tinta · z: taglia · w: stagger

  uniform float uTime;
  uniform float uProgress;   // 0 → 4, continuo
  uniform float uSize;       // px, già moltiplicato per il dpr
  uniform float uDrift;      // 0 con prefers-reduced-motion

  varying float vTint;
  varying float vAlpha;

  void main() {
    float p = clamp(uProgress, 0.0, 3.999);
    float seg = floor(p);
    float f = p - seg;

    // Stagger per-particella: il morphing è una cascata organica,
    // non una transizione monolitica.
    float local = smoothstep(0.0, 1.0, clamp((f - aSeed.w * 0.18) / 0.82, 0.0, 1.0));

    // Selezione branch-free dei target (niente indexing dinamico in GLSL).
    vec3 a = position;                 // target 0 vive in 'position'
    a = mix(a, aT1, step(0.5, seg));
    a = mix(a, aT2, step(1.5, seg));
    a = mix(a, aT3, step(2.5, seg));

    vec3 b = aT1;
    b = mix(b, aT2, step(0.5, seg));
    b = mix(b, aT3, step(1.5, seg));
    b = mix(b, aT4, step(2.5, seg));

    vec3 pos = mix(a, b, local);

    // Respiro: deriva trigonometrica minima, fase per-particella.
    float t = uTime * 0.6;
    pos += uDrift * 0.07 * vec3(
      sin(t + aSeed.x * 6.2831),
      cos(t * 0.8 + aSeed.x * 12.566),
      sin(t * 0.9 + aSeed.x * 9.42)
    );

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    float dist = -mv.z;
    gl_PointSize = clamp(uSize * mix(0.55, 1.5, aSeed.z) * (13.0 / dist), 1.0, 22.0);

    vTint = aSeed.y;
    // Fade atmosferico in profondità + variazione per-particella.
    vAlpha = smoothstep(30.0, 9.0, dist) * mix(0.35, 1.0, aSeed.y);
  }
`;

const FRAGMENT = /* glsl */ `
  uniform vec3 uColorA; // blu sistema
  uniform vec3 uColorB; // blu chiaro

  varying float vTint;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float disc = smoothstep(0.5, 0.06, d);
    float alpha = disc * vAlpha;
    if (alpha < 0.004) discard;
    vec3 color = mix(uColorA, uColorB, vTint);
    gl_FragColor = vec4(color * alpha, alpha); // premoltiplicato per l'additive
  }
`;

export default function PhylloField({
  reducedMotion = false,
  isCoarsePointer = false,
}: {
  reducedMotion?: boolean;
  isCoarsePointer?: boolean;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const count = isCoarsePointer ? COUNT_MOBILE : COUNT;

  const geometry = useMemo(() => {
    const [t0, t1, t2, t3, t4] = buildAllTargets(count);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(t0, 3));
    geo.setAttribute('aT1', new THREE.BufferAttribute(t1, 3));
    geo.setAttribute('aT2', new THREE.BufferAttribute(t2, 3));
    geo.setAttribute('aT3', new THREE.BufferAttribute(t3, 3));
    geo.setAttribute('aT4', new THREE.BufferAttribute(t4, 3));

    const seed = new Float32Array(count * 4);
    // PRNG locale per i seed (deterministico).
    let s = 7;
    const rnd = () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
    for (let i = 0; i < count; i++) {
      seed[i * 4 + 0] = rnd();
      seed[i * 4 + 1] = rnd();
      seed[i * 4 + 2] = rnd();
      seed[i * 4 + 3] = rnd();
    }
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 4));
    // Il campo riempie sempre il frustum: bounding sphere statica,
    // evita il ricalcolo e il culling accidentale durante il morph.
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 12);
    return geo;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uSize: { value: 3.0 },
      uDrift: { value: reducedMotion ? 0 : 1 },
      uColorA: { value: new THREE.Color('#0a84ff') },
      uColorB: { value: new THREE.Color('#9ecbff') },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    uniforms.uDrift.value = reducedMotion ? 0 : 1;
  }, [reducedMotion, uniforms]);

  // Cleanup esplicito: niente leak GPU all'unmount.
  useEffect(() => {
    const mat = materialRef.current;
    return () => {
      geometry.dispose();
      mat?.dispose();
    };
  }, [geometry]);

  useFrame((state, delta) => {
    const mat = materialRef.current;
    const pts = pointsRef.current;
    if (!mat || !pts) return;

    mat.uniforms.uTime.value = state.clock.elapsedTime;
    // dpr incluso nella size: i point sprite sono in pixel device.
    mat.uniforms.uSize.value = 3.0 * state.gl.getPixelRatio();

    const target = scrollProgress.stage;
    if (reducedMotion) {
      mat.uniforms.uProgress.value = target;
    } else {
      // damp framerate-independent: lo scrub resta burroso a 60 e a 120 Hz.
      mat.uniforms.uProgress.value = THREE.MathUtils.damp(
        mat.uniforms.uProgress.value,
        target,
        3.2,
        delta,
      );
      // Rotazione lenta + offset legato allo stage: lo scroll "gira" il campo.
      pts.rotation.y = state.clock.elapsedTime * 0.035 + target * 0.45;
      pts.rotation.x = Math.sin(target * 0.8) * 0.08;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        transparent
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
</file>

<file path="src/components/ui/Badge.tsx">
import clsx from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'glow';
  className?: string;
}

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants: Record<NonNullable<BadgeProps['variant']>, string> = {
    default: 'bg-neural-accent text-black shadow-neural-glow border border-transparent',
    outline: 'border border-white/30 text-white/80',
    glow: 'bg-white/5 text-neural-cyan border border-neural-cyan/40 shadow-neural-glow',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em]',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
</file>

<file path="src/components/ui/contact/FileDropzone.tsx">
import { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCloudUploadAlt, FaTimes, FaFilePdf, FaFileWord, FaFileImage, FaFileAlt } from 'react-icons/fa';
import { MAX_FILES, ALLOWED_EXTENSIONS } from '@/constants/contactConfig';
import type { AttachedFile } from '@/hooks/useContactForm';
import { useAppStore } from '@/store/useAppStore';

function getFileIcon(type: string) {
  if (type.includes('pdf')) return <FaFilePdf className="text-red-400" />;
  if (type.includes('word') || type.includes('document')) return <FaFileWord className="text-blue-400" />;
  if (type.startsWith('image/')) return <FaFileImage className="text-emerald-400" />;
  return <FaFileAlt className="text-white/50" />;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface FileDropzoneProps {
  files: AttachedFile[];
  fileError: string;
  addFiles: (files: FileList | File[]) => void;
  removeFile: (id: string) => void;
}

export default function FileDropzone({ files, fileError, addFiles, removeFile }: FileDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const isEn = useAppStore((s) => s.language === 'en');

  const onDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }, []);
  const onDragLeave = useCallback(() => setIsDragging(false), []);
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const totalFileSize = files.reduce((sum, f) => sum + f.file.size, 0);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-medium text-white/60">
          📎 {isEn ? 'Attachments' : 'Allegati'}
          <span className="ml-1.5 text-[0.6rem] text-white/30">
            ({files.length}/{MAX_FILES} · max 10 MB)
          </span>
        </p>
        {files.length < MAX_FILES && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-[0.65rem] font-medium text-[var(--color-accent-soft)] transition-colors hover:text-[var(--color-accent)]"
          >
            + {isEn ? 'Browse' : 'Sfoglia'}
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={ALLOWED_EXTENSIONS.join(',')}
        className="hidden"
        onChange={(e) => { if (e.target.files?.length) addFiles(e.target.files); e.target.value = ''; }}
      />

      {files.length < MAX_FILES && (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-5 transition-all duration-200 ${isDragging
              ? 'border-[var(--color-accent)]/50 bg-[var(--color-accent)]/5'
              : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
            }`}
        >
          <FaCloudUploadAlt className={`mb-2 text-xl ${isDragging ? 'text-[var(--color-accent-soft)]' : 'text-white/20'}`} />
          <p className="text-xs text-white/40">
            {isDragging ? (isEn ? 'Drop here' : 'Rilascia qui') : (isEn ? 'Drag files or click to browse' : 'Trascina file o clicca per sfogliare')}
          </p>
          <p className="mt-1 text-[0.6rem] text-white/20">
            {isEn ? 'PDF, Office, Markdown, Media, JSON, Archives — max 10 MB' : 'PDF, Office, Markdown, Media, JSON, Archivi — max 10 MB'}
          </p>
        </div>
      )}

      <AnimatePresence>
        {fileError && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-2 text-[0.65rem] text-amber-400"
          >
            {fileError}
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {files.map((af) => (
          <motion.div
            key={af.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-2 flex items-center gap-3 rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2.5">
              <span className="text-sm">{getFileIcon(af.file.type)}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-white/80">{af.file.name}</p>
                <p className="text-[0.6rem] text-white/30">{formatFileSize(af.file.size)}</p>
              </div>
              <button
                type="button"
                onClick={() => removeFile(af.id)}
                className="rounded p-1 text-white/30 transition-colors hover:bg-white/10 hover:text-red-400"
              >
                <FaTimes className="text-[0.6rem]" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {files.length > 0 && (
        <p className="mt-1.5 text-[0.6rem] text-white/25">
          {isEn ? 'Total:' : 'Totale:'} {formatFileSize(totalFileSize)}
        </p>
      )}
    </div>
  );
}
</file>

<file path="src/components/ui/copilot/CopilotInput.tsx">
import { useRef, useEffect } from 'react';
import { FiMic, FiArrowUp } from 'react-icons/fi';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

interface CopilotInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: () => void;
  busy: boolean;
  copilotOpen: boolean;
}

export default function CopilotInput({
  input,
  setInput,
  onSubmit,
  busy,
  copilotOpen
}: CopilotInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isListening, toggleListening, hasSupport } = useSpeechRecognition({
    onTranscript: (transcript) => setInput(input + (input ? ' ' : '') + transcript)
  });

  useEffect(() => {
    if (copilotOpen) textareaRef.current?.focus();
  }, [copilotOpen]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="border-t border-white/10 p-3"
    >
      <div className="flex items-end gap-2 rounded-xl bg-white/5 px-3 py-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onWheel={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSubmit();
            }
          }}
          rows={2}
          placeholder="Scrivi una domanda…"
          aria-label="Messaggio per il copilot"
          className="max-h-32 flex-1 resize-none bg-transparent text-sm text-white outline-none placeholder:text-white/35 overscroll-contain"
        />
        {hasSupport && (
          <button
            type="button"
            onClick={toggleListening}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
              isListening ? 'bg-red-500/20 text-red-400 animate-pulse' : 'text-white/50 hover:bg-white/10 hover:text-white'
            }`}
            aria-label="Microfono"
          >
            <FiMic className="h-4 w-4" />
          </button>
        )}
        <button
          type="submit"
          disabled={busy || (!input.trim() && !isListening)}
          aria-label="Invia"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-white transition-opacity disabled:opacity-30"
        >
          <FiArrowUp className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}
</file>

<file path="src/components/ui/copilot/CopilotMessage.tsx">
import { Fragment, type ReactNode } from 'react';
import { FiThumbsUp, FiThumbsDown } from 'react-icons/fi';
import ProjectCard from '@/components/ui/rag/ProjectCard';
import SkillsRadar from '@/components/ui/rag/SkillsRadar';
import type { UIMessage } from 'ai';

type AnyPart = { type: string } & Record<string, unknown>;

interface CopilotMessageProps {
  message: UIMessage;
  messages: UIMessage[];
  flyToSection: (section: string) => void;
  setCopilotOpen: (open: boolean) => void;
  feedbackGiven: Record<string, boolean>;
  onFeedback: (messageId: string, score: number, aiResponseText: string, userQuestionText: string) => void;
}

function renderMarkdownBold(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-white">
        {part}
      </strong>
    ) : (
      part
    )
  );
}

export default function CopilotMessage({
  message,
  messages,
  flyToSection,
  setCopilotOpen,
  feedbackGiven,
  onFeedback
}: CopilotMessageProps) {
  const renderPart = (part: AnyPart, index: number): ReactNode => {
    const key = `${message.id}-${index}`;
    switch (part.type) {
      case 'text': {
        const clean = (part.text as string).trim();
        return clean ? (
          <p key={key + '-text'} className="whitespace-pre-wrap break-words leading-relaxed">
            {renderMarkdownBold(clean)}
          </p>
        ) : null;
      }
      case 'data-uiAction': {
        const embeddedAction = part.data as any;
        if (!embeddedAction) return null;

        if (embeddedAction.action === 'showProject' && embeddedAction.target) {
          return (
            <ProjectCard
              key={key + '-widget'}
              projectName={embeddedAction.target}
              onExplore={() => {
                flyToSection('projects');
                setCopilotOpen(false);
              }}
            />
          );
        } else if (embeddedAction.action === 'showSkillsRadar') {
          return <SkillsRadar key={key + '-widget'} />;
        } else if (embeddedAction.action === 'navigateToSection' && embeddedAction.target) {
          return (
            <p key={key + '-widget'} className="font-mono text-[11px] text-accent-soft mt-2">
              → ti porto alla sezione {embeddedAction.target}
            </p>
          );
        }
        return null;
      }
      case 'data-sources': {
        const sources = part.data as any[];
        if (!sources || sources.length === 0) return null;
        return (
          <div key={key + '-sources'} className="mt-2 flex flex-wrap gap-1.5">
            <span className="text-[10px] text-white/40 mr-1 self-center">Fonti:</span>
            {sources.map((s, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded text-[10px] border border-white/10 bg-white/5 text-white/60">
                {s.title || s.tag}
              </span>
            ))}
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div
      className={
        message.role === 'user'
          ? 'ml-8 rounded-2xl rounded-br-sm bg-accent/15 px-3.5 py-2.5'
          : 'mr-4 space-y-2'
      }
    >
      {(message.parts as AnyPart[]).map((part, i) => renderPart(part, i))}
      {message.role === 'assistant' && (() => {
        const idx = messages.findIndex(m => m.id === message.id);
        const prevMsg: any = messages[idx - 1];
        const msg: any = message;
        const userQ = prevMsg?.role === 'user' ? prevMsg.content || (prevMsg.parts || []).map((p: any) => p.text || '').join('') : 'Unknown';
        const aiA = msg.content || (msg.parts || []).map((p: any) => p.text || '').join('');
        return (
          <div className="flex gap-2 pt-1 opacity-40 hover:opacity-100 transition-opacity">
            <button onClick={() => onFeedback(message.id, 1, aiA, userQ)} disabled={feedbackGiven[message.id]} className="hover:text-emerald-400 disabled:opacity-30"><FiThumbsUp className="w-3 h-3" /></button>
            <button onClick={() => onFeedback(message.id, 0, aiA, userQ)} disabled={feedbackGiven[message.id]} className="hover:text-red-400 disabled:opacity-30"><FiThumbsDown className="w-3 h-3" /></button>
          </div>
        );
      })()}
    </div>
  );
}
</file>

<file path="src/components/ui/CTAButton.tsx">
import { motion } from 'framer-motion';
import clsx from 'clsx';
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react';

type CTAButtonProps = {
  href?: string;
  icon?: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
  children?: ReactNode;
} & (
  | (ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined })
  | (AnchorHTMLAttributes<HTMLAnchorElement> & { href: string })
);

const variantMap: Record<NonNullable<CTAButtonProps['variant']>, string> = {
  primary:
    'bg-gradient-to-r from-neural-cyan to-neural-magenta text-white shadow-neural-glow ring-1 ring-white/20 drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)] hover:from-neural-magenta hover:to-neural-cyan',
  secondary:
    'border border-white/35 bg-white/5 text-white/85 backdrop-blur-sm hover:border-neural-cyan/70 hover:bg-white/10 hover:text-white',
  ghost: 'text-white/75 hover:text-white',
};

export default function CTAButton({ href, icon, variant = 'primary', className, children, ...props }: CTAButtonProps) {
  const isAnchor = typeof href === 'string';
  
  const commonProps = {
    className: clsx(
      'relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neural-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-black',
      variantMap[variant],
      className,
    )
  };

  if (isAnchor) {
    return (
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <a href={href} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)} {...commonProps}>
          {icon && <span className="text-base">{icon}</span>}
          {children}
        </a>
      </motion.div>
    );
  }

  return (
    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
      <button type={(props as ButtonHTMLAttributes<HTMLButtonElement>).type ?? 'button'} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)} {...commonProps}>
        {icon && <span className="text-base">{icon}</span>}
        {children}
      </button>
    </motion.div>
  );
}
</file>

<file path="src/components/ui/NeuralCard.tsx">
import { forwardRef, type HTMLAttributes } from 'react';
import clsx from 'clsx';

interface NeuralCardProps extends HTMLAttributes<HTMLDivElement> {
  tone?: 'default' | 'primary' | 'accent';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingMap: Record<NonNullable<NeuralCardProps['padding']>, string> = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const toneMap: Record<NonNullable<NeuralCardProps['tone']>, string> = {
  default:
    'glass-panel border border-white/10 bg-white/5 text-white shadow-neural-card',
  primary:
    'glass-panel border border-neural-cyan/30 bg-gradient-to-br from-neural-blue/80 to-neural-indigo/60 text-white shadow-neural-glow',
  accent:
    'glass-panel border border-neural-magenta/25 bg-gradient-to-br from-neural-magenta/30 to-neural-cyan/30 text-white shadow-neural-glow',
};

export const NeuralCard = forwardRef<HTMLDivElement, NeuralCardProps>(
  (
    {
      className,
      tone = 'default',
      padding = 'md',
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'relative overflow-hidden rounded-3xl backdrop-blur-lg transition-all duration-300',
          toneMap[tone],
          paddingMap[padding],
          className,
        )}
        {...props}
      >
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(93,224,230,0.25),_transparent_50%)]" />
        </div>
        <div className="relative z-10">{children}</div>
      </div>
    );
  },
);

NeuralCard.displayName = 'NeuralCard';

export default NeuralCard;
</file>

<file path="src/components/ui/rag/SkillsRadar.tsx">
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';

export default function SkillsRadar() {
  const isEn = useAppStore(s => s.language === 'en');

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mt-2 rounded-xl border border-neural-cyan/30 bg-black/40 p-4 shadow-[0_0_20px_rgba(0,255,255,0.1)] backdrop-blur-md"
    >
      <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-neural-cyan">
        {isEn ? 'AI & Web Engineering Stack' : 'Stack AI & Web Engineering'}
      </h4>
      <div className="grid grid-cols-2 gap-2 text-xs text-white/80">
        <div className="rounded-lg border border-white/5 bg-white/5 p-2">
          <span className="block font-medium text-white">AI / LLM</span>
          <span className="text-[0.65rem] opacity-70">LangChain, LangGraph, Vercel AI, Gemini, OpenAI</span>
        </div>
        <div className="rounded-lg border border-white/5 bg-white/5 p-2">
          <span className="block font-medium text-white">Frontend</span>
          <span className="text-[0.65rem] opacity-70">Next.js 15+, React 19, Three.js, GSAP</span>
        </div>
        <div className="rounded-lg border border-white/5 bg-white/5 p-2">
          <span className="block font-medium text-white">Backend</span>
          <span className="text-[0.65rem] opacity-70">Node.js, Vector DBs, Edge Functions</span>
        </div>
        <div className="rounded-lg border border-white/5 bg-white/5 p-2">
          <span className="block font-medium text-white">Ops / Tools</span>
          <span className="text-[0.65rem] opacity-70">n8n, Vercel, Docker, Git</span>
        </div>
      </div>
    </motion.div>
  );
}
</file>

<file path="src/components/ui/SectionHeader.tsx">
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}: SectionHeaderProps) {
  const alignment = align === 'center' ? 'items-center text-center' : 'items-start text-left';

  return (
    <div className={clsx('flex flex-col gap-4', alignment, className)}>
      {eyebrow && (
        <motion.span
          initial={{ opacity: 0, y: -6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.35em] text-neural-cyan"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-neural-cyan" />
          {eyebrow}
        </motion.span>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-semibold tracking-tight text-white md:text-4xl"
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl text-base text-white/70 md:text-lg"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
</file>

<file path="src/constants/contactConfig.tsx">
import {
  FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaCalendarAlt,
  FaGithub, FaLinkedin
} from 'react-icons/fa';

export const FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/vitopiccolini@live.it';
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
export const MAX_FILES = 3;
export const MAX_MESSAGE_LENGTH = 2000;

export const ALLOWED_EXTENSIONS = [
  '.pdf', '.doc', '.docx', '.txt', '.csv', '.md',
  '.xls', '.xlsx', '.ppt', '.pptx', '.key',
  '.json', '.xml', '.yaml', '.yml',
  '.png', '.jpg', '.jpeg', '.webp', '.gif', '.mp4',
  '.zip', '.rar',
];

export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain', 'text/csv', 'text/markdown',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/x-iwork-keynote-sffkey',
  'application/json', 'application/xml', 'text/xml', 'application/x-yaml', 'text/yaml',
  'image/png', 'image/jpeg', 'image/webp', 'image/gif',
  'video/mp4',
  'application/zip', 'application/x-rar-compressed',
];

export const categories = [
  { id: 'job', label: { it: 'Proposta lavorativa', en: 'Job proposal' }, emoji: '💼' },
  { id: 'collab', label: { it: 'Collaborazione', en: 'Collaboration' }, emoji: '🤝' },
  { id: 'freelance', label: { it: 'Freelance', en: 'Freelance' }, emoji: '🚀' },
  { id: 'info', label: { it: 'Informazioni', en: 'Information' }, emoji: '💡' },
  { id: 'other', label: { it: 'Altro', en: 'Other' }, emoji: '💬' },
];

export const getContactDetails = (isEn: boolean) => [
  {
    label: 'Email',
    value: 'vitopiccolini@live.it',
    helper: isEn ? 'Preferred for structured briefs (response within 24h).' : 'Preferita per brief strutturati (risposta entro 24h).',
    icon: <FaEnvelope className="text-white" />,
    href: 'mailto:vitopiccolini@live.it',
  },
  {
    label: isEn ? 'Phone' : 'Telefono',
    value: '+39 3937382774',
    helper: isEn ? 'Available 9:00–18:00, WhatsApp too.' : 'Disponibile 9:00–18:00, anche WhatsApp.',
    icon: <FaPhoneAlt className="text-white" />,
    href: 'tel:+393937382774',
  },
  {
    label: isEn ? 'Location' : 'Base operativa',
    value: 'Bari · Remote EU',
    helper: isEn ? 'Driving license B, day trips on request.' : 'Patente B, trasferte in giornata su richiesta.',
    icon: <FaMapMarkerAlt className="text-white" />,
  },
  {
    label: isEn ? 'Availability' : 'Disponibilità',
    value: isEn ? 'Immediate - June 2026' : 'Immediata - Giugno 2026',
    helper: isEn ? 'LM-18 curricular internship or AI-first collaboration.' : 'Stage curriculare LM-18 o collaborazione AI-first.',
    icon: <FaCalendarAlt className="text-white" />,
  },
];

export const socialLinks = [
  { icon: <FaGithub className="h-4 w-4" />, href: 'https://github.com/Hellvisback365', label: 'GitHub' },
  { icon: <FaLinkedin className="h-4 w-4" />, href: 'https://www.linkedin.com/in/vitopiccolini/', label: 'LinkedIn' },
  { icon: <FaEnvelope className="h-4 w-4" />, href: 'mailto:vitopiccolini@live.it', label: 'Email' },
];
</file>

<file path="src/hooks/useContactForm.ts">
import { useState, useCallback } from 'react';
import {
  MAX_FILE_SIZE, MAX_FILES, MAX_MESSAGE_LENGTH,
  ALLOWED_EXTENSIONS, ALLOWED_MIME_TYPES, categories, FORMSUBMIT_ENDPOINT
} from '@/constants/contactConfig';
import { useAppStore } from '@/store/useAppStore';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
}

export interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export interface AttachedFile {
  file: File;
  id: string;
}

function isAllowedFile(file: File): boolean {
  if (ALLOWED_MIME_TYPES.includes(file.type)) return true;
  const ext = '.' + file.name.split('.').pop()?.toLowerCase();
  return ALLOWED_EXTENSIONS.includes(ext);
}

export function useContactForm() {
  const isEn = useAppStore(s => s.language === 'en');

  const [formData, setFormData] = useState<ContactFormData>({
    name: '', email: '', subject: '', category: '', message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [files, setFiles] = useState<AttachedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [fileError, setFileError] = useState('');

  const validateForm = (): boolean => {
    const e: FormErrors = {};
    if (!formData.name.trim()) e.name = isEn ? 'Name is required' : 'Il nome è richiesto';
    if (!formData.email.trim()) {
      e.email = isEn ? 'Email is required' : "L'email è richiesta";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      e.email = isEn ? 'Invalid email format' : 'Formato email non valido';
    }
    if (!formData.subject.trim()) e.subject = isEn ? 'Subject is required' : "L'oggetto è richiesto";
    if (!formData.message.trim()) {
      e.message = isEn ? 'Message is required' : 'Il messaggio è richiesto';
    } else if (formData.message.trim().length < 10) {
      e.message = isEn ? 'At least 10 characters' : 'Almeno 10 caratteri';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (
    ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = ev.target;
    if (name === 'message' && value.length > MAX_MESSAGE_LENGTH) return;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((p) => ({ ...p, [name]: undefined }));
    }
  };

  const selectCategory = (id: string) => {
    setFormData((p) => ({ ...p, category: p.category === id ? '' : id }));
  };

  const addFiles = useCallback((incoming: FileList | File[]) => {
    setFileError('');
    const newFiles: AttachedFile[] = [];
    const list = Array.from(incoming);

    for (const file of list) {
      if (files.length + newFiles.length >= MAX_FILES) {
        setFileError(isEn ? `Max ${MAX_FILES} attachments.` : `Massimo ${MAX_FILES} allegati.`);
        break;
      }
      if (file.size > MAX_FILE_SIZE) {
        setFileError(isEn ? `"${file.name}" exceeds the 10 MB limit.` : `"${file.name}" supera il limite di 10 MB.`);
        continue;
      }
      if (!isAllowedFile(file)) {
        setFileError(isEn ? `"${file.name}": unsupported type.` : `"${file.name}": tipo non supportato.`);
        continue;
      }
      newFiles.push({ file, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}` });
    }
    if (newFiles.length) setFiles((p) => [...p, ...newFiles]);
  }, [files.length, isEn]);

  const removeFile = (id: string) => {
    setFiles((p) => p.filter((f) => f.id !== id));
    setFileError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const categoryObj = categories.find((c) => c.id === formData.category);
      const categoryLabel = categoryObj ? categoryObj.label.it : '—'; // Always send italian in email for internal consistency
      const categoryEmoji = categoryObj ? categoryObj.emoji : '';

      const formElement = e.currentTarget as HTMLFormElement;
      const honeyValue = new FormData(formElement).get('_honey') as string || '';

      const endpoint = FORMSUBMIT_ENDPOINT.replace('/ajax/', '/');

      const iframeName = `formsubmit-frame-${Date.now()}`;
      const iframe = document.createElement('iframe');
      iframe.name = iframeName;
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = endpoint;
      form.enctype = 'multipart/form-data';
      form.target = iframeName;
      form.style.display = 'none';

      const addField = (name: string, value: string) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        form.appendChild(input);
      };

      addField('_subject', `📩 ${formData.subject}`);
      addField('_replyto', formData.email);
      addField('_template', 'table');
      addField('_captcha', 'false');
      addField('_honey', honeyValue);

      addField('Nome', formData.name);
      addField('Email', formData.email);
      addField('Categoria', `${categoryEmoji} ${categoryLabel}`);
      addField('Oggetto', formData.subject);
      addField('Messaggio', formData.message);

      if (files.length > 0) {
        files.forEach((af, index) => {
          const dt = new DataTransfer();
          dt.items.add(af.file);
          const fileInput = document.createElement('input');
          fileInput.type = 'file';
          fileInput.name = `attachment_${index + 1}`;
          fileInput.files = dt.files;
          form.appendChild(fileInput);
        });
      }

      document.body.appendChild(form);

      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          cleanup();
          reject(new Error(isEn ? 'Timeout: service did not respond in time.' : 'Timeout: il servizio non ha risposto in tempo.'));
        }, 15000);

        const cleanup = () => {
          clearTimeout(timeout);
          iframe.removeEventListener('load', onLoad);
          setTimeout(() => {
            if (document.body.contains(form)) document.body.removeChild(form);
            if (document.body.contains(iframe)) document.body.removeChild(iframe);
          }, 500);
        };

        const onLoad = () => {
          cleanup();
          resolve();
        };

        iframe.addEventListener('load', onLoad);
        form.submit();
      });

      setSubmitSuccess(true);
      setFormData({ name: '', email: '', subject: '', category: '', message: '' });
      setFiles([]);
      setTimeout(() => setSubmitSuccess(false), 6000);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : (isEn ? 'An error occurred' : 'Si è verificato un errore'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    files,
    isSubmitting,
    submitSuccess,
    submitError,
    setSubmitError,
    fileError,
    handleChange,
    selectCategory,
    addFiles,
    removeFile,
    handleSubmit
  };
}
</file>

<file path="src/hooks/useCopilotChat.ts">
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useAppStore } from '@/store/useAppStore';
import {
  embedQuery,
  getEmbedderState,
  subscribeEmbedder,
  warmupEmbedder,
  type EmbedderState,
} from '@/lib/rag/embedder';

export const ALL_SUGGESTIONS_IT = [
  'Di cosa parla la tesi di Vito?',
  'Raccontami del progetto Zenith',
  'Che esperienza ha con i sistemi RAG?',
  'Mostrami i contatti di Vito',
  'Quali linguaggi usa nel backend?',
  'Parlami dell\'hackathon Space Edition',
  'Come è fatto TerraNode?',
  'Che università frequenta?',
  'Vito ha esperienza lavorativa?',
  'Portami alla sezione progetti',
];

export const ALL_SUGGESTIONS_EN = [
  'What is Vito\'s thesis about?',
  'Tell me about the Zenith project',
  'What experience does he have with RAG systems?',
  'Show me Vito\'s contacts',
  'What languages does he use in the backend?',
  'Tell me about the Space Edition hackathon',
  'How is TerraNode built?',
  'What university does he attend?',
  'Does Vito have work experience?',
  'Take me to the projects section',
];

function withTimeout<T>(p: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}

type AnyPart = { type: string } & Record<string, unknown>;

export function useCopilotChat() {
  const language = useAppStore((s) => s.language);
  const isEn = language === 'en';
  const copilotOpen = useAppStore((s) => s.copilotOpen);
  const flyToSection = useAppStore((s) => s.flyToSection);
  
  const [embedderState, setEmbedderState] = useState<EmbedderState>(() => getEmbedderState());
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true);
  
  const poolsRef = useRef<Record<string, string[]>>({});
  const clickedSuggestionsRef = useRef<Set<string>>(new Set());
  const processedTools = useRef<Set<string>>(new Set());
  const inFlightRef = useRef(false);

  const transport = useMemo(() => new DefaultChatTransport({ api: '/api/chat' }), []);
  const { messages, sendMessage, status, error } = useChat({ transport });
  const busy = status === 'submitted' || status === 'streaming';

  // Subscriptions & Warmup
  useEffect(() => subscribeEmbedder(setEmbedderState), []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const w = window as typeof window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    let idleId = 0;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    if (w.requestIdleCallback) {
      idleId = w.requestIdleCallback(() => warmupEmbedder(), { timeout: 4000 });
    } else {
      timeoutId = setTimeout(() => warmupEmbedder(), 2500);
    }
    return () => {
      if (idleId && w.cancelIdleCallback) w.cancelIdleCallback(idleId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // Fetch suggestions
  useEffect(() => {
    if (!copilotOpen) return;
    
    if (poolsRef.current[language]) {
      // Già fetchato per questa lingua
      const pool = poolsRef.current[language];
      setSuggestions(pool.slice(0, 3));
      return;
    }

    setIsLoadingSuggestions(true);
    fetch(`/api/suggestions?lang=${language}`)
      .then((res) => {
        if (!res.ok) throw new Error('API error');
        return res.json();
      })
      .then((data) => {
        if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
          poolsRef.current[language] = data.questions;
          setSuggestions(data.questions.slice(0, 3));
        } else {
          throw new Error('Invalid schema');
        }
      })
      .catch((err) => {
        console.error('[Copilot] Fallback to static suggestions:', err);
        const fallbacks = isEn ? ALL_SUGGESTIONS_EN : ALL_SUGGESTIONS_IT;
        const shuffled = [...fallbacks].sort(() => 0.5 - Math.random());
        poolsRef.current[language] = shuffled;
        setSuggestions(shuffled.slice(0, 3));
      })
      .finally(() => {
        setIsLoadingSuggestions(false);
      });
  }, [copilotOpen, language, isEn]);

  // Process UI actions
  useEffect(() => {
    for (const message of messages) {
      if (processedTools.current.has(message.id)) continue;
      
      let actionFound = false;
      for (const part of message.parts as AnyPart[]) {
        if (part.type === 'data-uiAction') {
          const actionData = part.data as any;
          actionFound = true;
          
          if (actionData.action === 'navigateToSection' && actionData.target) {
            flyToSection(actionData.target);
          } else if (actionData.action === 'showProject') {
            flyToSection('projects');
          } else if (actionData.action === 'showSkillsRadar') {
            flyToSection('skills');
          }
        }
      }
      if (actionFound) {
        processedTools.current.add(message.id);
      }
    }
  }, [messages, flyToSection]);

  const submit = useCallback(
    (text: string): boolean => {
      text = text.trim();
      if (!text || busy || inFlightRef.current) return false;
      inFlightRef.current = true;
      
      const attachVector = getEmbedderState() === 'ready';
      void (async () => {
        try {
          const queryVector = attachVector
            ? await withTimeout(embedQuery(text), 1500, null)
            : null;

          sendMessage({ text }, { body: { queryVector } });
        } finally {
          inFlightRef.current = false;
        }
      })();
      return true;
    },
    [busy, sendMessage],
  );

  const handleSuggestionClick = useCallback((q: string) => {
    submit(q);
    clickedSuggestionsRef.current.add(q);
    setSuggestions((prev) => {
      const pool = poolsRef.current[language] || (isEn ? ALL_SUGGESTIONS_EN : ALL_SUGGESTIONS_IT);
      const clicked = clickedSuggestionsRef.current;
      const remaining = pool.filter((s) => !prev.includes(s) && !clicked.has(s));
      
      if (remaining.length === 0) {
        const fallbacks = isEn ? ALL_SUGGESTIONS_EN : ALL_SUGGESTIONS_IT;
        const fallbackRemaining = fallbacks.filter((s) => !prev.includes(s) && !clicked.has(s) && !pool.includes(s));
        if (fallbackRemaining.length === 0) return prev;
        const next = fallbackRemaining[Math.floor(Math.random() * fallbackRemaining.length)];
        return prev.map((s) => (s === q ? next : s));
      }
      
      const next = remaining[Math.floor(Math.random() * remaining.length)];
      return prev.map((s) => (s === q ? next : s));
    });
  }, [submit, isEn, language]);

  return {
    messages,
    status,
    error,
    busy,
    submit,
    embedderState,
    suggestions,
    isLoadingSuggestions,
    handleSuggestionClick
  };
}
</file>

<file path="src/hooks/useResponsive.ts">
'use client';

import { useState, useEffect } from 'react';

/**
 * Custom hook for responsive design
 * 
 * @returns Object containing:
 * - isMobile: true if screen width is < 640px
 * - isTablet: true if screen width is >= 640px and < 1024px
 * - isDesktop: true if screen width is >= 1024px
 * - breakpoint: current breakpoint as string ('xs', 'sm', 'md', 'lg', 'xl', '2xl')
 */
export function useResponsive() {
  // Initialize with a default for server-side rendering
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  // Update screen size on resize
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Initial call
    handleResize();

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Tailwind CSS breakpoints
  const isMobile = screenSize.width < 640; // xs
  const isTablet = screenSize.width >= 640 && screenSize.width < 1024; // sm, md
  const isDesktop = screenSize.width >= 1024; // lg, xl, 2xl
  
  // Determine current breakpoint
  let breakpoint = 'xs';
  if (screenSize.width >= 1536) breakpoint = '2xl';
  else if (screenSize.width >= 1280) breakpoint = 'xl';
  else if (screenSize.width >= 1024) breakpoint = 'lg';
  else if (screenSize.width >= 768) breakpoint = 'md';
  else if (screenSize.width >= 640) breakpoint = 'sm';

  return {
    isMobile,
    isTablet,
    isDesktop,
    breakpoint,
    screenWidth: screenSize.width,
    screenHeight: screenSize.height,
  };
}

export default useResponsive;
</file>

<file path="src/hooks/useSpeechRecognition.ts">
import { useState, useRef, useEffect, useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';

interface UseSpeechRecognitionOptions {
  onTranscript: (transcript: string) => void;
}

export function useSpeechRecognition({ onTranscript }: UseSpeechRecognitionOptions) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const onTranscriptRef = useRef(onTranscript);

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        
        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          onTranscriptRef.current(transcript);
        };
        
        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      const language = useAppStore.getState().language;
      recognitionRef.current.lang = language === 'en' ? 'en-US' : 'it-IT';
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, [isListening]);

  return {
    isListening,
    toggleListening,
    hasSupport: typeof window !== 'undefined' && !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
  };
}
</file>

<file path="src/lib/rag/bm25.ts">
/**
 * BM25 Okapi — implementazione completa, zero dipendenze.
 * (Quella che il vecchio stack dichiarava ma delegava a Fuse.js,
 * che è fuzzy matching Bitap, non un ranking lessicale.)
 *
 * Su un corpus di ~20 chunk l'indice si costruisce in <1 ms al cold
 * start: nessun bisogno di precomputarlo nello script di ingest.
 */

const K1 = 1.5;
const B = 0.75;

// Stoplist minimale IT + EN: solo funzionali ad altissima frequenza.
const STOPWORDS = new Set([
  // it
  'di', 'a', 'da', 'in', 'con', 'su', 'per', 'tra', 'fra', 'il', 'lo', 'la',
  'i', 'gli', 'le', 'un', 'uno', 'una', 'e', 'ed', 'o', 'che', 'chi', 'cui',
  'non', 'come', 'dove', 'quando', 'quale', 'quali', 'del', 'dello', 'della',
  'dei', 'degli', 'delle', 'al', 'allo', 'alla', 'ai', 'agli', 'alle', 'dal',
  'dallo', 'dalla', 'dai', 'dagli', 'dalle', 'nel', 'nello', 'nella', 'nei',
  'negli', 'nelle', 'sul', 'sullo', 'sulla', 'sui', 'sugli', 'sulle', 'è',
  'sono', 'sei', 'siamo', 'siete', 'ha', 'hai', 'ho', 'hanno', 'mi', 'ti',
  'si', 'ci', 'vi', 'suo', 'sua', 'suoi', 'sue', 'tuo', 'tua', 'mio', 'mia',
  'questo', 'questa', 'questi', 'queste', 'quello', 'quella', 'più', 'anche',
  'ma', 'se', 'cosa', 'qual',
  // en
  'the', 'a', 'an', 'of', 'to', 'in', 'on', 'for', 'and', 'or', 'is', 'are',
  'was', 'were', 'what', 'which', 'who', 'how', 'with', 'about', 'his', 'her',
  'it', 'its', 'at', 'by', 'from', 'as', 'be', 'has', 'have', 'had', 'do',
  'does', 'did', 'not',
]);

/** lowercase + accent folding + split su non-alfanumerico (unicode). */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(/[^\p{L}\p{N}]+/u)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

export interface Bm25Doc {
  id: string;
  text: string;
}

export class Bm25Index {
  private docTokens: Map<string, Map<string, number>> = new Map();
  private docLen: Map<string, number> = new Map();
  private df: Map<string, number> = new Map();
  private avgdl = 0;
  private n = 0;

  constructor(docs: Bm25Doc[]) {
    let totalLen = 0;
    for (const doc of docs) {
      const tokens = tokenize(doc.text);
      const tf = new Map<string, number>();
      for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
      this.docTokens.set(doc.id, tf);
      this.docLen.set(doc.id, tokens.length);
      totalLen += tokens.length;
      for (const term of tf.keys()) this.df.set(term, (this.df.get(term) ?? 0) + 1);
    }
    this.n = docs.length;
    this.avgdl = this.n > 0 ? totalLen / this.n : 0;
  }

  /** Ranking BM25 dei documenti per la query. score > 0 soltanto. */
  search(query: string, k = 10): Array<{ id: string; score: number }> {
    const qTerms = tokenize(query);
    if (qTerms.length === 0) return [];

    const scores = new Map<string, number>();
    for (const term of qTerms) {
      const df = this.df.get(term);
      if (!df) continue;
      // IDF di Robertson-Sparck Jones con smoothing (sempre ≥ 0)
      const idf = Math.log(1 + (this.n - df + 0.5) / (df + 0.5));
      for (const [docId, tf] of this.docTokens) {
        const f = tf.get(term);
        if (!f) continue;
        const dl = this.docLen.get(docId) ?? 0;
        const denom = f + K1 * (1 - B + (B * dl) / this.avgdl);
        const s = idf * ((f * (K1 + 1)) / denom);
        scores.set(docId, (scores.get(docId) ?? 0) + s);
      }
    }

    return [...scores.entries()]
      .map(([id, score]) => ({ id, score }))
      .sort((a, b) => b.score - a.score)
      .slice(0, k);
  }
}
</file>

<file path="src/lib/ratelimit.ts">
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Utilizza un mock fittizio se le chiavi Redis non sono configurate (es. in locale/sviluppo)
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL.replace(/^['"]|['"]$/g, ''),
        token: process.env.UPSTASH_REDIS_REST_TOKEN.replace(/^['"]|['"]$/g, ''),
      })
    : null;

// Riferimento condiviso del rate limiter: 5 richieste ogni 10 secondi per gli endpoint principali
export const globalRatelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '10 s'),
      analytics: true,
      prefix: '@upstash/ratelimit/portfolio',
    })
  : {
      limit: async () => ({ success: true, limit: 10, remaining: 9, reset: 0 }),
    };

// Rate limiter più permissivo per feedback / piccoli endpoint non LLM
export const feedbackRatelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '60 s'),
      analytics: false,
      prefix: '@upstash/ratelimit/feedback',
    })
  : {
      limit: async () => ({ success: true, limit: 10, remaining: 9, reset: 0 }),
    };
</file>

<file path="src/styles/breakpoints.css">
/* Mobile first approach with breakpoints */

/* 
  Breakpoints:
  - xs: 0px and up (default, no media query needed)
  - sm: 640px and up
  - md: 768px and up
  - lg: 1024px and up
  - xl: 1280px and up
  - 2xl: 1536px and up

  Usage with Tailwind CSS:
  - Default (mobile): text-sm
  - Small screens: sm:text-base
  - Medium screens: md:text-lg
  - Large screens: lg:text-xl
  - Extra large screens: xl:text-2xl
*/

:root {
  /* Responsive spacing variables */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;
  
  /* Base mobile padding */
  --container-padding: 1rem;
}

@media (min-width: 640px) {
  :root {
    --container-padding: 1.5rem;
  }
}

@media (min-width: 768px) {
  :root {
    --container-padding: 2rem;
  }
}

@media (min-width: 1024px) {
  :root {
    --container-padding: 3rem;
  }
}

/* Mobile-specific fixes */
@media (max-width: 640px) {
  /* Prevent unwanted zoom on inputs in iOS */
  input[type="text"],
  input[type="email"],
  input[type="password"],
  input[type="number"],
  input[type="tel"],
  textarea,
  select {
    font-size: 16px !important;
  }
  
  /* Improve tap targets for mobile */
  button, 
  a {
    min-height: 44px;
    min-width: 44px;
  }
}
</file>

<file path="vitest.config.ts">
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
</file>

<file path=".github/dependabot.yml">
# To get started with Dependabot version updates, you'll need to specify which
# package ecosystems to update and where the package manifests are located.
# Please see the documentation for all configuration options:
# https://docs.github.com/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file

version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
</file>

<file path=".github/workflows/deploy.yml">
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  validate-and-build:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Type check
        run: npx tsc --noEmit
      
      - name: Test
        run: npm run test
      
      - name: Build
        run: npm run build
      
      - name: Cache build
        uses: actions/cache@v4
        with:
          path: .next
          key: ${{ runner.os }}-nextjs-${{ hashFiles('**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx') }}
</file>

<file path="src/components/canvas/Experience.tsx">
'use client';

import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import PhylloField from './PhylloField';
import CameraRig from './CameraRig';

function useMediaQuery(query: string): boolean {
  const [matches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  );
  return matches;
}

/**
 * Setup del renderer.
 * - antialias: false — i point sprite hanno bordi morbidi nello shader,
 *   il MSAA sarebbe solo costo.
 * - dpr adattivo [1 → 1.75]: PerformanceMonitor lo alza se il frame
 *   budget regge, lo abbassa se no. Mai sopra 1.75: oltre, su un campo
 *   di punti, è risoluzione sprecata.
 * - prefers-reduced-motion: scena statica, niente drift né scrub.
 */
export default function Experience() {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const isCoarse = useMediaQuery('(pointer: coarse)');
  const [dpr, setDpr] = useState(1.25);

  return (
    <Canvas
      camera={{ fov: 42, position: [0, 0.3, 14], near: 0.1, far: 60 }}
      dpr={dpr}
      gl={{
        antialias: false,
        alpha: false,
        powerPreference: 'high-performance',
        stencil: false,
        depth: false, // un solo oggetto additive senza depth: il buffer non serve
      }}
      style={{ background: '#04060c' }}
    >
      <Suspense fallback={null}>
        <PerformanceMonitor
          onIncline={() => setDpr((d) => Math.min(1.75, d + 0.25))}
          onDecline={() => setDpr((d) => Math.max(1, d - 0.25))}
        >
          <CameraRig reducedMotion={reducedMotion} />
          <PhylloField reducedMotion={reducedMotion} isCoarsePointer={isCoarse} />
        </PerformanceMonitor>
      </Suspense>
    </Canvas>
  );
}
</file>

<file path="src/components/canvas/targets.ts">
/**
 * I cinque stati del campo di particelle. Ogni generatore restituisce
 * un Float32Array di N*3 posizioni, calcolato una volta sola al mount.
 *
 * Il filo conduttore è il brief: precisione matematica + organico.
 * Lo stato hero è una sfera a fillotassi — l'angolo aureo che dispone
 * i semi del girasole — cioè il punto esatto in cui la matematica
 * incontra l'agricoltura.
 */

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5)); // ≈ 2.39996 rad

/** PRNG deterministico (mulberry32): stessa scena ad ogni load. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 0 · HERO — Sfera a fillotassi (reticolo di Fibonacci sferico). */
export function phylloSphere(n: number, radius = 4.6): Float32Array {
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n;
    const y = 1 - 2 * t;                    // da +1 a −1
    const r = Math.sqrt(1 - y * y);
    const phi = GOLDEN_ANGLE * i;
    out[i * 3 + 0] = Math.cos(phi) * r * radius;
    out[i * 3 + 1] = y * radius;
    out[i * 3 + 2] = Math.sin(phi) * r * radius;
  }
  return out;
}

/** 1 · ABOUT — Campo d'onda a filari: superficie sinusoidale con
 *  le particelle agganciate a righe regolari, come una semina. */
export function waveField(n: number): Float32Array {
  const out = new Float32Array(n * 3);
  const rand = rng(11);
  const ROWS = 16;
  for (let i = 0; i < n; i++) {
    const x = (rand() * 2 - 1) * 8.2;
    const row = Math.floor(rand() * ROWS);
    const z = (row / (ROWS - 1) - 0.5) * 7.0 + (rand() - 0.5) * 0.12;
    const y =
      Math.sin(x * 0.55 + z * 1.25) * 1.05 +
      Math.sin(z * 1.7 + 1.3) * 0.45 -
      0.4;
    out[i * 3 + 0] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z * 0.62; // compresso verso la camera
  }
  return out;
}

/** 2 · SKILLS — Anello planetario frontale (inclusivo): un cerchio di stelle che abbraccia le skills. */
export function lattice(n: number): Float32Array {
  const out = new Float32Array(n * 3);
  const rand = rng(23);
  for (let i = 0; i < n; i++) {
    const angle = rand() * Math.PI * 2;
    
    // Il frustum della camera a Z=14 copre circa X: [-9.5, 9.5] e Y: [-5.3, 5.3].
    // Per far sì che l'anello sia visibile e denso, i raggi devono stare in questi limiti.
    const radiusFactor = Math.pow(rand(), 1.5); 
    
    // Raggio X: da 2.5 (buco centrale) a 8.5 (bordo schermo)
    const rx = 3.0 + radiusFactor * 6.5; 
    // Raggio Y: da 1.5 a 4.8 (bordo verticale schermo)
    const ry = 1.8 + radiusFactor * 3.5;  
    
    // Spessore 3D dell'anello: maggiore al centro della fascia, minore ai bordi
    const thickness = (rand() - 0.5) * 4.0 * (1 - radiusFactor);

    out[i * 3 + 0] = Math.cos(angle) * rx;
    out[i * 3 + 1] = Math.sin(angle) * ry;
    out[i * 3 + 2] = thickness;
  }
  return out;
}

/** 3 · PROJECTS — Quattro costellazioni orbitali, una per progetto. */
export function clusters(n: number): Float32Array {
  const out = new Float32Array(n * 3);
  const rand = rng(47);
  const centers: Array<[number, number, number]> = [
    [-3.4, 1.7, -0.6],
    [3.4, 1.5, 0.4],
    [-3.1, -1.8, 0.5],
    [3.2, -1.7, -0.5],
  ];
  const dust = Math.floor(n * 0.08);
  const perCluster = Math.floor((n - dust) / centers.length);
  let i = 0;
  for (let c = 0; c < centers.length; c++) {
    const [cx, cy, cz] = centers[c];
    const count = c === centers.length - 1 ? n - dust - perCluster * 3 : perCluster;
    for (let k = 0; k < count; k++, i++) {
      // mini-fillotassi locale: ogni progetto è un piccolo seme
      const t = (k + 0.5) / count;
      const y = 1 - 2 * t;
      const r = Math.sqrt(1 - y * y);
      const phi = GOLDEN_ANGLE * k;
      const radius = 1.45 * (0.55 + 0.45 * rand());
      out[i * 3 + 0] = cx + Math.cos(phi) * r * radius;
      out[i * 3 + 1] = cy + y * radius * 0.9;
      out[i * 3 + 2] = cz + Math.sin(phi) * r * radius;
    }
  }
  for (; i < n; i++) {
    out[i * 3 + 0] = (rand() * 2 - 1) * 7.5;
    out[i * 3 + 1] = (rand() * 2 - 1) * 4.0;
    out[i * 3 + 2] = (rand() * 2 - 1) * 2.5;
  }
  return out;
}

/** 4 · CONTACT — Anello di convergenza: quiete, un cerchio aperto. */
export function ring(n: number): Float32Array {
  const out = new Float32Array(n * 3);
  const rand = rng(89);
  const R = 4.3;
  for (let i = 0; i < n; i++) {
    const theta = (i / n) * Math.PI * 2;
    const jitter = 0.16;
    const wobble = Math.sin(theta * 3) * 0.18;
    out[i * 3 + 0] = Math.cos(theta) * (R + (rand() - 0.5) * jitter);
    out[i * 3 + 1] = wobble + (rand() - 0.5) * jitter * 1.6;
    out[i * 3 + 2] = Math.sin(theta) * (R + (rand() - 0.5) * jitter) * 0.55;
  }
  return out;
}

export function buildAllTargets(n: number): Float32Array[] {
  return [phylloSphere(n), waveField(n), lattice(n), clusters(n), ring(n)];
}
</file>

<file path="src/components/overlay/HtmlOverlay.tsx">
'use client';

import HeroOverlay from './HeroOverlay';
import AboutOverlay from './AboutOverlay';
import SkillsOverlay from './SkillsOverlay';
import ProjectsOverlay from './ProjectsOverlay';
import ContactOverlay from './ContactOverlay';

export default function HtmlOverlay() {
  return (
    <div className="flex flex-col w-full text-white">
      {/* Page 1: Hero */}
      <section id="hero" className="w-full relative z-10">
        <HeroOverlay />
      </section>

      {/* Page 2: About */}
      <section id="about" className="w-full relative z-10">
        <AboutOverlay />
      </section>

      {/* Page 3: Skills */}
      <section id="skills" className="w-full relative z-10">
        <SkillsOverlay />
      </section>

      {/* Page 4: Projects */}
      <section id="projects" className="w-full relative z-10">
        <ProjectsOverlay />
      </section>

      {/* Page 5: Contact */}
      <section id="contact" className="w-full relative z-10">
        <ContactOverlay />
      </section>
    </div>
  );
}
</file>

<file path="src/components/ui/rag/ProjectCard.tsx">
'use client';

import { motion } from 'framer-motion';

interface ProjectCardProps {
  projectName: string;
  /** Azione del bottone "Esplora progetto". Se assente, il bottone non è mostrato. */
  onExplore?: () => void;
}

export default function ProjectCard({ projectName, onExplore }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-2 flex flex-col gap-2 rounded-xl border border-accent/30 bg-accent/[0.06] p-4 backdrop-blur-md"
    >
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-white">{projectName}</h4>
        <span className="rounded-full bg-accent/20 px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-widest text-accent-soft">
          Case Study
        </span>
      </div>
      <p className="text-xs text-white/70">
        Vai alla sezione progetti per i dettagli completi di {projectName}: ruolo,
        stack e risultati.
      </p>
      {onExplore && (
        <button
          type="button"
          onClick={onExplore}
          className="mt-2 w-full rounded-lg bg-accent py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90"
        >
          Esplora progetto
        </button>
      )}
    </motion.div>
  );
}
</file>

<file path="tsconfig.json">
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": [
        "./src/*"
      ]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}
</file>

<file path=".gitignore">
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# env files (can opt-in for committing if needed)
.env*
!.env.example

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

.vercel
</file>

<file path="src/data/skills.ts">
export type SkillIconKey =
  | 'python'
  | 'javascript'
  | 'typescript'
  | 'tensorflow'
  | 'scikitlearn'
  | 'llms'
  | 'nlp'
  | 'react'
  | 'node'
  | 'mongodb'
  | 'tailwind'
  | 'framer'
  | 'code'
  | 'brain'
  | 'web'
  | 'robot'
  | 'translate'
  | 'globe';

export interface CapabilityTrack {
  title: string;
  icon: SkillIconKey;
  description: { it: string; en: string };
  focusAreas: string[];
  stack: string[];
}

export interface ExperienceMetric {
  label: string;
  value: string;
  caption: { it: string; en: string };
}

export interface ToolHighlight {
  area: string;
  category: string;
  description: { it: string; en: string };
  tools: string[];
}

export interface Language {
  name: { it: string; en: string };
  level: { it: string; en: string };
  description: { it: string; en: string };
}

export const capabilityTracks: CapabilityTrack[] = [
  {
    title: 'AI/ML & Data Science',
    icon: 'brain',
    description: {
      it: 'Sviluppo di sistemi di raccomandazione LLM-driven, architetture multi-agente e soluzioni NLP con focus su explainability e RAG.',
      en: 'Development of LLM-driven recommendation systems, multi-agent architectures, and NLP solutions with a focus on explainability and RAG.',
    },
    focusAreas: ['Recommender Systems', 'Multi-agent orchestration', 'Hybrid RAG', 'Explainability'],
    stack: ['LangGraph', 'LangChain', 'LLMs', 'Python', 'FAISS', 'BM25'],
  },
  {
    title: 'Web Development',
    icon: 'web',
    description: {
      it: 'Sviluppo full-stack con React e Next.js, API backend con Node.js/Express e integrazione con servizi AI.',
      en: 'Full-stack development with React and Next.js, backend APIs with Node.js/Express, and integration with AI services.',
    },
    focusAreas: ['Frontend React/Next.js', 'Backend Node.js', 'API Integration', 'Responsive Design'],
    stack: ['React', 'Next.js 15', 'Node.js', 'Express', 'Vite', 'Tailwind CSS', 'HTML/CSS'],
  },
  {
    title: 'DevOps & Integration',
    icon: 'code',
    description: {
      it: 'Automazione workflow, gestione database relazionali e NoSQL, metodologie Agile e version control.',
      en: 'Workflow automation, relational and NoSQL database management, Agile methodologies, and version control.',
    },
    focusAreas: ['Workflow Automation', 'Database Management', 'Agile/Scrum', 'CI/CD'],
    stack: ['n8n', 'GitHub', 'MySQL', 'MongoDB', 'Docker', 'npm/yarn'],
  },
];

export const experienceMetrics: ExperienceMetric[] = [
  {
    label: 'Briefing time',
    value: 'ore → secondi',
    caption: {
      it: 'Riduzione tempi report con AI generativa (B.Future Challenge).',
      en: 'Reduction of report times with generative AI (B.Future Challenge).',
    },
  },
  {
    label: 'Recsys novelty',
    value: '+12%',
    caption: {
      it: 'Miglioramento diversità/novelty con Llama 3.2 e Multi-Agent.',
      en: 'Improvement in diversity/novelty with Llama 3.2 and Multi-Agent.',
    },
  },
  {
    label: 'Precision@1',
    value: '-0.5%',
    caption: {
      it: 'L\'agente aggregatore ha mantenuto quasi intatta la precisione del baseline.',
      en: 'The aggregator agent kept the baseline precision almost intact.',
    },
  },
  {
    label: 'Laurea triennale',
    value: '107/110',
    caption: {
      it: 'Informatica e Tecnologie per la Produzione del Software (UniBa).',
      en: 'Computer Science and Software Production Technologies (UniBa).',
    },
  },
];

export const toolHighlights: ToolHighlight[] = [
  {
    area: 'Programming Languages',
    category: 'Core',
    description: {
      it: 'Linguaggi di programmazione per sviluppo AI, web e sistemi enterprise.',
      en: 'Programming languages for AI, web, and enterprise systems development.',
    },
    tools: ['C', 'Python', 'Java', 'JavaScript', 'SQL', 'HTML/CSS'],
  },
  {
    area: 'AI/ML Stack',
    category: 'AI-first',
    description: {
      it: 'Framework e librerie per machine learning, LLM e sistemi di raccomandazione.',
      en: 'Frameworks and libraries for machine learning, LLMs, and recommendation systems.',
    },
    tools: ['LangGraph', 'LangChain', 'FAISS', 'BM25', 'Pandas', 'NumPy', 'Jupyter'],
  },
  {
    area: 'Web & Database',
    category: 'Full-stack',
    description: {
      it: 'Tecnologie per sviluppo web moderno e gestione dati.',
      en: 'Technologies for modern web development and data management.',
    },
    tools: ['React', 'Next.js', 'Node.js', 'Express', 'MySQL', 'MongoDB'],
  },
  {
    area: 'DevOps & Automation',
    category: 'Platform',
    description: {
      it: 'Strumenti per automazione, version control e metodologie di sviluppo.',
      en: 'Tools for automation, version control, and development methodologies.',
    },
    tools: ['n8n', 'GitHub', 'npm/yarn', 'VS Code', 'Eclipse', 'Agile/Scrum'],
  },
];

export const languages: Language[] = [
  {
    name: { it: 'Italiano', en: 'Italian' },
    level: { it: 'Madrelingua', en: 'Native' },
    description: {
      it: 'Lingua madre, comunicazione professionale e tecnica.',
      en: 'Native language, professional and technical communication.',
    },
  },
  {
    name: { it: 'Inglese', en: 'English' },
    level: { it: 'B1 - Base', en: 'B1 - Basic' },
    description: {
      it: 'Lettura documentazione tecnica, comunicazione scritta e meeting internazionali.',
      en: 'Reading technical documentation, written communication, and international meetings.',
    },
  },
];
</file>

<file path="src/lib/rag/providers.ts">
import { createGroq } from '@ai-sdk/groq';
import type { LanguageModel } from 'ai';

/**
 * Astrazione per l'utilizzo di LLM.
 * Configurato in modo esclusivo per utilizzare Groq (LLaMA-3.3) per
 * massimizzare la velocità (LPU) e rispettare i requisiti di deployment in EU.
 */

export interface Providers {
  /** Modello principale per la generazione delle risposte. */
  chat: LanguageModel;
  /** Modello piccolo e velocissimo per il routing/rewrite. */
  router: LanguageModel;
  name: 'groq';
}

export function getProviders(): Providers | null {
  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey) {
    return null;
  }

  const groq = createGroq({ apiKey: groqKey });
  return {
    chat: groq(process.env.RAG_CHAT_MODEL ?? 'llama-3.3-70b-versatile'),
    router: groq(process.env.RAG_ROUTER_MODEL ?? 'llama-3.1-8b-instant'),
    name: 'groq',
  };
}
</file>

<file path="src/lib/rag/worker.ts">
import { pipeline, env } from '@huggingface/transformers';

// Solo CDN HuggingFace: niente lookup di modelli locali inesistenti.
env.allowLocalModels = false;

const EMBED_MODEL = 'Xenova/multilingual-e5-small';

class PipelineSingleton {
  static task = 'feature-extraction' as const;
  static model = EMBED_MODEL;
  static instance: any = null;

  static async getInstance(progress_callback?: any) {
    if (this.instance === null) {
      // Usiamo WebGPU se disponibile, altrimenti fallback a WASM.
      this.instance = pipeline(this.task, this.model, {
        dtype: 'q8',
        progress_callback,
      });
    }
    return this.instance;
  }
}

// Ascolta i messaggi dal thread principale
self.addEventListener('message', async (event) => {
  const { id, text, type } = event.data;

  try {
    if (type === 'load') {
      const p1 = PipelineSingleton.getInstance((x: any) => {
        self.postMessage({ type: 'progress', model: 'embedder', progress: x });
      });
      await p1;
      self.postMessage({ type: 'ready', id });
      return;
    }

    if (type === 'embed') {
      const extractor = await PipelineSingleton.getInstance();
      const out = await extractor(`query: ${text.trim()}`, {
        pooling: 'mean',
        normalize: true,
      });

      // Arrotondiamo a 5 decimali
      const vector = Array.from(out.data, (v: any) => Math.round(v * 1e5) / 1e5);

      self.postMessage({
        type: 'result',
        id,
        vector,
      });
      return;
    }

  } catch (error) {
    self.postMessage({
      type: 'error',
      id,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});
</file>

<file path="src/store/useAppStore.ts">
import { create } from 'zustand';

/**
 * Due canali, una sola dipendenza:
 *
 * 1) Stato UI reattivo (Zustand classico): copilot aperto, navigazione.
 * 2) Canale "transiente" per lo scroll: `scrollProgress` è un oggetto
 *    mutabile letto via ref dentro useFrame. Lo scroll a 60–120 Hz NON
 *    deve mai attraversare React: niente setState per frame, niente
 *    re-render, niente letture di layout nel loop WebGL.
 */

export const SECTIONS = ['hero', 'about', 'skills', 'projects', 'contact'] as const;
export type SectionId = (typeof SECTIONS)[number];

/** Canale ad alta frequenza: scritto da Lenis, letto da useFrame. */
export const scrollProgress = {
  /** 0 → 1 sull'intera pagina */
  value: 0,
  /** 0 → SECTIONS.length - 1, continuo (input del morphing) */
  stage: 0,
};

interface AppState {
  copilotOpen: boolean;
  setCopilotOpen: (open: boolean) => void;
  language: 'it' | 'en';
  setLanguage: (lang: 'it' | 'en') => void;
  /** Naviga la pagina (e quindi la scena) verso una sezione. */
  flyToSection: (section: SectionId | string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  copilotOpen: false,
  setCopilotOpen: (open) => set({ copilotOpen: open }),
  language: 'it',
  setLanguage: (lang) => set({ language: lang }),
  flyToSection: (section) => {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(
      new CustomEvent('navigate-section', { detail: { section } }),
    );
  },
}));
</file>

<file path="TECH_SPEC.md">
# Tech Spec — Refactoring Portfolio v2 ("Phyllotaxis")

Data: 2026-06-11 · Target: Next.js 16 / React 19 / Vercel · Autore della spec: Claude (analisi statica dell'intero repo)

---

## 1 · Diagnosi: perché oggi non tiene i 60 FPS

Il collo di bottiglia non è "il 3D in sé", è **come** è costruito.

**P0 — Transmission pass moltiplicate.** La scena contiene ~13 `MeshPhysicalMaterial` con `transmission > 0` (anello in `AbstractCore`, 4 lenti in `SkillLenses`, 8 mesh in `ProjectCards3D`). In three.js ogni materiale trasmissivo costringe il renderer a renderizzare la scena opaca in un render target dedicato: di fatto la scena viene ridisegnata più volte per frame. Su iGPU questo da solo dimezza il framerate.

**P1 — Doppio `<Environment>` + HDRI runtime.** `Scene.tsx` carica il preset `studio`, `CustomModel.tsx` il preset `night`: due HDRI scaricate a runtime da CDN esterna + doppia generazione PMREM. Dipendenza di rete in produzione e costo GPU inutile (con il nuovo materiale shader l'IBL non serve affatto).

**P2 — Layout thrashing nel render loop.** `CameraRig` legge `document.documentElement.scrollHeight` dentro `useFrame` (forza reflow ad ogni frame) e alloca 2 `new THREE.Vector3()` per frame → pressione GC e micro-stutter.

**P3 — Draw call e testo SDF.** 10+ `<Text>` troika (un draw call + font ciascuno), 2 sistemi `Sparkles` (1.000 particelle in 2 draw call separati), `antialias: true` (MSAA) a dpr 1.5 su scena già pesante.

**P4 — Nessuna degradazione adattiva.** Niente scaling del dpr, niente `prefers-reduced-motion`, niente budget per mobile.

**P5 — ~40% di dead code.** `sections/*`, `RagChat.tsx` (legacy, 314 righe), `NeuralBackground`, `Header`, `Footer`, `Layout`, `TechStack`, `AnimatedTitle`, `ScrollToTopButton`, `reset-theme.js` non sono importati da nessuna pagina viva. Vengono comunque lintati/typecheckati e confondono la manutenzione.

**P6 — Design system rotto in silenzio.** Le classi `neural-cyan`, `neural-glow`, `shadow-neural-glow`, ecc. sono usate ~110 volte ma **non esistono**: il progetto è su Tailwind v4 senza `@theme` né `tailwind.config` che le definisca. Generano CSS vuoto. L'estetica attuale (nero + bianco + cyan/magenta "space agent") è inoltre lontana dal brief: blu dominante, minimale, Apple.

### Diagnosi RAG (perché oggi non è reale)

- **R0 — I vettori sono zeri.** `generate-vectorstore.mjs` riempie vettori 3072-dim di `0`: ogni cosine similarity vale 0. La ricerca "vettoriale" è decorativa.
- **R1 — Le embeddings non possono funzionare.** Il default punta a `openai/text-embedding-3-large` via OpenRouter, che **non espone un endpoint embeddings**: la chiamata fallisce sempre, viene catturata in silenzio e si degrada a Fuse.js.
- **R2 — Fuse.js non è BM25.** È fuzzy matching Bitap con `threshold: 0.6`: su chunk da 750 caratteri produce ranking rumoroso. La tua tesi usa BM25+FAISS: il portfolio deve dimostrarlo davvero.
- **R3 — Semantic cache write-never.** `semanticCache.set()` non viene mai chiamata in `route.ts`; ed essendo in-memory per istanza serverless sarebbe comunque inutile su Vercel.
- **R4 — Multi-query expansion a ROI negativo.** Un round-trip LLM extra (~1–2 s) prima del retrieval su un corpus di 7 documenti (~20 chunk).
- **R5 — Dedup e ranking rotti.** Dedup per `metadata.id` (id del documento, non del chunk) collassa tutti i chunk dello stesso doc; poi `.slice(0,3)` prende i primi in ordine arbitrario, ignorando gli score RRF calcolati.
- **R6 — Storico distrutto.** `messages.slice(-1)` elimina la cronologia: i follow-up ("e quanto è durato?") non possono funzionare, in contraddizione con la regola 1 del system prompt stesso.
- **R7 — API AI SDK sbagliata.** Con `ai@^6` i tool richiedono `inputSchema`; il codice usa `parameters` + `as any` + `@ts-ignore`, e l'overlay contiene shim di compatibilità v4/v5 con `console.log` di debug in render.

---

## 2 · Nuovo stack

### Frontend 3D — "Phyllotaxis"

Una sola idea, eseguita con precisione: **un unico campo di ~14.000 punti istanziati (1 draw call) che morpha tra 5 stati matematici** guidato dallo scroll. Lo stato hero è una **sfera a fillotassi (angolo aureo)**: lo stesso pattern dei semi di girasole — è letteralmente il punto d'incontro tra precisione matematica e agricoltura, il tuo brief in una formula. Gli altri stati: campo d'onda a filari (semina), reticolo (conoscenza strutturata), 4 costellazioni orbitali (progetti), anello di convergenza (contatto).

- **Rendering:** `THREE.Points` + `ShaderMaterial` custom. I 5 target sono attributi del buffer; il morphing avviene nel vertex shader (`uProgress` 0→4) con stagger per-particella. Zero geometrie fisiche, zero transmission, zero HDRI, zero luci. Costo per frame: 1 draw call, nessuna allocazione JS.
- **Camera:** quasi ferma (stile Apple: si muove l'oggetto, non l'osservatore), parallasse dal puntatore con damping, vettori preallocati.
- **Scroll:** Lenis resta, ma diventa l'**unica** fonte di verità: scrive `progress` in uno store Zustand vanilla letto via ref nel loop (zero re-render React, zero letture di layout in rAF).
- **Adattività:** `antialias: false` (i point sprite non ne hanno bisogno), dpr [1 → 1.75] governato da `PerformanceMonitor` di drei (sale se il frame budget regge, scende se no), ~6.500 punti su pointer coarse, `prefers-reduced-motion` → scena statica e niente smooth scroll.
- **Design system:** Tailwind v4 `@theme` con palette blu (`#0A84FF` accent su ink `#04060C`), tipografia `next/font` self-hosted (Inter variable a pesi disciplinati + JetBrains Mono per label/dati — la voce "engineer"). Le classi legacy `neural-*` vengono **definite come alias** dei nuovi token: le ~110 occorrenze negli overlay esistenti ereditano la nuova palette senza toccare quei file.

Eliminati: `AbstractCore`, `SkillLenses`, `ProjectCards3D`, `FloatingParticles`, `CustomModel`, `Scene`, entrambi gli `Environment`, GSAP (registrato ma mai usato nella pagina viva).

### Backend RAG — ibrido reale, costo zero, EU-safe

```
Browser ──(testo + query-vector*)──▶ /api/chat (Node)
   │                                   ├─ Promise.allSettled() in parallelo
   │  *embedding calcolata             │    ├─ Router agent (Llama 8B) ──▶ produce intent, uiAction, e query standalone
   │   client-side con                 │    └─ Retrieval Lessicale (BM25)
   │   multilingual-e5-small           │
   │   (Transformers.js, lazy,         ├─ Retrieval Semantico (Cosine Similarity con standalone question)
   │   ~30MB quantizzato, cache        │
   │   del browser)                    ├─ Fusione RRF diretta lato server
   │                                   ├─ streamText (Groq Llama-3.3-70B)
   ◀──(UIMessage stream + data-sources + UI action deterministica)──┘
```

Scelte e perché:

- **Embeddings senza API:** `Xenova/multilingual-e5-small` (384-dim, forte sull'italiano) gira via Transformers.js sia nello script di ingest (build time, vettori scritti in `rag-index.json`) sia **nel browser** del visitatore (lazy, solo all'apertura della chat, cache HTTP del browser). Zero costi, zero rate limit, zero latenza server, e nessun dato del visitatore inviato a terzi per l'embedding. Se il modello client non è ancora pronto → il server lavora in BM25-only, che su questo corpus copre già la maggior parte delle query: degradazione progressiva, mai rottura.
- **Generazione: Groq free tier** (verificato a giugno 2026: `llama-3.3-70b-versatile` ~30 RPM/1.000 req/giorno; `llama-3.1-8b-instant` fino a ~14.400 req/giorno — perfetto per il router). Endpoint OpenAI-compatibile, latenze da LPU (centinaia di token/s): l'esperienza percepita è "istantanea".
- **Nota EU importante:** il free tier dell'API Gemini, da ToS, non è utilizzabile per servire utenti in EU/EEA/UK/CH in produzione. Per questo Gemini è solo **fallback opzionale** dietro env var, e le embeddings runtime non dipendono da Google. Con il solo `GROQ_API_KEY` il sistema è completo e conforme.
- **BM25 vero**, Okapi (k1=1.5, b=0.75), tokenizzazione accent-fold + stoplist IT/EN, ~80 righe senza dipendenze. L'indice si costruisce a cold start in <1 ms (corpus piccolo).
- **Reranker escluso in prod**: Nonostante i vantaggi metrici (testati in locale), l'uso di un Cross-Encoder su Vercel Serverless causava cold-start estremi (3-10s) a causa di ONNX Runtime Node e del peso del bundle. Dato il corpus limitato (~18 chunk), la pipeline si limita al solo Hybrid (BM25 + Semantic) con risultati eccellenti.
- **RRF corretta a livello di chunk** + cap di 2 chunk per documento (diversità tipo MMR-lite) → top-4 nel contesto con id citabili `[S1]…[S4]`.
- **Storico ripristinato:** ultime 8 UIMessage convertite con `convertToModelMessages`; il router produce la *standalone question* per il retrieval, così i follow-up funzionano.
- **AI SDK v6 nativo:** `inputSchema` nei tool, `createUIMessageStream` con data part `data-sources` (basta header base64), client `useChat` v3 con `parts` tipizzate. Niente `@ts-ignore`.
- **Cache:** rimossa la semantic cache fittizia; al suo posto una LRU exact-match (query normalizzata → risultati retrieval) per istanza, dichiaratamente best-effort.

---

## 3 · Budget di performance (criteri di accettazione)

| Metrica | Prima (stimato dal codice) | Dopo (target) |
|---|---|---|
| Draw call scena | ~35–45 + N pass transmission | **1–2** |
| Render pass per frame | 1 + ~13 transmission RT | **1** |
| Allocazioni JS nel loop | 2 Vector3/frame + closure | **0** |
| Richieste di rete runtime per il 3D | 2 HDRI + font troika | **0** |
| Particelle | 1.000 (2 sistemi) | 14.000 (1 sistema) / 6.500 mobile |
| TTI chat → primo token | ~2,5–4 s (expansion seriale) | **< 1 s** su Groq (router in parallelo) |
| Costo API mensile | dipendente da OpenRouter | **0 €** |

Questi numeri derivano dall'architettura (conteggio di pass/call/allocazioni), non da una misura: vedi §6.

## 4 · File consegnati (drop-in)

```
src/app/layout.tsx                    riscritto · next/font, metadata, niente <link> bloccanti
src/app/page.tsx                      riscritto · wiring Lenis→store, canvas, overlay
src/app/globals.css                   riscritto · @theme blu + alias legacy neural-*
src/app/api/chat/route.ts            riscritto · pipeline RAG v2 completa
src/components/canvas/Experience.tsx  nuovo · Canvas + adaptive dpr + reduced motion
src/components/canvas/PhylloField.tsx nuovo · points + shader morphing (firma del sito)
src/components/canvas/targets.ts      nuovo · generatori dei 5 stati matematici
src/components/canvas/CameraRig.tsx   riscritto · alloc-free, parallasse damped
src/components/overlay/HeroOverlay.tsx     riscritto · tipografia Apple-like, CTA→copilot
src/components/overlay/CopilotOverlay.tsx  nuovo · chat AI SDK v6 (sostituisce RagChatOverlay)
src/components/overlay/NavigationOverlay.tsx riscritto · rAF-throttled, offsets cached
src/store/useAppStore.ts              riscritto · scroll transiente + stato copilot
src/lib/rag/embedder.ts               nuovo · embedding client-side (Transformers.js)
src/lib/rag/bm25.ts                   nuovo · BM25 Okapi IT/EN
src/lib/rag/retriever.ts              nuovo · ibrido + RRF + diversità + LRU
src/lib/rag/providers.ts              nuovo · selezione Groq/Gemini
scripts/rag-ingest.mts                riscritto · chunking semantico + e5 locale
package.json                          aggiornato · −14 dipendenze, +3
.env.example                          nuovo
```

## 5 · Migrazione

1. Copia i file sopra nelle stesse posizioni (sovrascrivi).
2. **Elimina:** `src/components/sections/`, `RagChat.tsx`, `NeuralBackground.tsx`, `Header.tsx`, `Footer.tsx`, `Layout.tsx`, `TechStack.tsx`, `AnimatedTitle.tsx`, `ScrollToTopButton.tsx`, `PerformanceMonitor.tsx`, `src/app/reset-theme.js`, `src/app/test-brevo/` (e la route `api/test-brevo` — endpoint di debug che in prod permette a chiunque di farti inviare email), `src/app/api/metrics/` (ridondante con SpeedInsights), `src/services/rag/`, `src/components/overlay/RagChatOverlay.tsx`, `scripts/generate-vectorstore.mjs`, `scripts/rag-ingest.ts`, `models.json`, `src/data/vectorStore.json`.
3. `npm install` — il nuovo `package.json` rimuove 14 dipendenze (langchain ×4, fuse.js, @ai-sdk/openai, gsap, @gsap/react, maath, next-themes, web-vitals, @headlessui/react, react-intersection-observer, @react-three/postprocessing) e ne aggiunge 3 (@ai-sdk/groq, @ai-sdk/google, @huggingface/transformers).
4. `cp .env.example .env.local` e inserisci `GROQ_API_KEY` (gratuita su console.groq.com).
5. `npm run rag:ingest` → genera `src/data/rag-index.json` (al primo run scarica il modello e5 in cache locale `~/.cache/huggingface`).
6. `npm run dev`.

I quattro overlay di contenuto (About/Skills/Projects/Contact) e i loro componenti UI restano com'erano: ereditano automaticamente la nuova palette via alias `@theme`. `ProjectCard`/`SkillsRadar` della chat restano riusati dal nuovo Copilot.

## 6 · Verifica — cosa è stato controllato e cosa resta a te

Fatto qui (statico): coerenza import/percorsi tra tutti i file consegnati; contratti AI SDK v6 (`inputSchema`, `convertToModelMessages`, `createUIMessageStream`, parts `data-*`/`tool-*`); GLSL compatibile WebGL2 senza branching dinamico su attributi; nessuna allocazione nel loop rAF; conteggio pass/draw call; free tier Groq/Gemini verificati via ricerca (giugno 2026).

Da fare al primo avvio (5 minuti, non posso eseguire la rete da qui): `npm run build` (typecheck), apertura su Chrome con DevTools → Rendering → FPS meter (atteso: 60 stabile, GPU memory piatta), una domanda in chat con e senza `rag-index.json` per vedere la degradazione BM25-only, un test su viewport mobile. Se qualcosa scricchiola, i punti di taratura sono tre costanti in testa a `PhylloField.tsx` (COUNT, SIZE, dpr max).
</file>

<file path="vercel.json">
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install"
}
</file>

<file path="src/components/canvas/CameraRig.tsx">
'use client';

import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollProgress } from '@/store/useAppStore';

/**
 * Stile Apple: la camera è quasi ferma, è l'oggetto a trasformarsi.
 * Qui solo una parallasse sottile dal puntatore, con damping
 * framerate-independent e vettori preallocati (zero GC nel loop).
 */
export default function CameraRig({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const target = useMemo(() => new THREE.Vector3(0, 0.15, 0), []);
  const basePos = useMemo(() => new THREE.Vector3(0, 0.3, 14), []);

  useFrame((state, delta) => {
    if (reducedMotion) {
      state.camera.position.copy(basePos);
      state.camera.lookAt(target);
      return;
    }
    const px = state.pointer.x * 0.85;
    const py = state.pointer.y * 0.5;
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, basePos.x + px, 2.4, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, basePos.y + py, 2.4, delta);
    state.camera.position.z = basePos.z;
    state.camera.lookAt(target);
  });

  return null;
}
</file>

<file path="src/components/overlay/NavigationOverlay.tsx">
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { SECTIONS, type SectionId, useAppStore } from '@/store/useAppStore';

const LABELS: Record<SectionId, string> = {
  hero: 'Home',
  about: 'About',
  skills: 'Skills',
  projects: 'Projects',
  contact: 'Contact',
};

/**
 * Stessa UX di prima, costo diverso: gli offsetTop delle sezioni sono
 * misurati una volta (e su resize), non a ogni evento di scroll; lo
 * scroll handler è coalizzato in un singolo rAF. Niente reflow nel
 * percorso caldo.
 */
export default function NavigationOverlay() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const offsets = useRef<number[]>([]);
  const ticking = useRef(false);
  const lenis = useLenis();
  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const isEn = language === 'en';

  const measure = useCallback(() => {
    offsets.current = SECTIONS.map((id) => {
      const el = document.getElementById(id);
      return el ? el.offsetTop : 0;
    });
  }, []);

  useEffect(() => {
    measure();
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        ticking.current = false;
        const y = window.scrollY;
        const limit = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(limit > 0 ? y / limit : 0);
        const threshold = y + window.innerHeight / 2;
        let current = 0;
        for (let i = 0; i < offsets.current.length; i++) {
          if (threshold >= offsets.current[i]) current = i;
        }
        setActiveIndex(current);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  const scrollToSection = useCallback(
    (index: number) => {
      const el = document.getElementById(SECTIONS[index]);
      if (!el) return;
      if (lenis) {
        lenis.scrollTo(el.offsetTop, {
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      } else {
        window.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
      }
    },
    [lenis],
  );

  // Canale per la navigazione programmata (copilot, CTA).
  useEffect(() => {
    const handler = (event: Event) => {
      const section = (event as CustomEvent).detail?.section as string | undefined;
      const index = SECTIONS.indexOf(section as SectionId);
      if (index !== -1) scrollToSection(index);
    };
    window.addEventListener('navigate-section', handler);
    return () => window.removeEventListener('navigate-section', handler);
  }, [scrollToSection]);

  return (
    <>
      {/* Barra di avanzamento */}
      <div className="fixed left-0 right-0 top-0 z-40 h-px bg-white/5">
        <div
          className="h-full bg-accent transition-[width] duration-150 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* Language Toggle */}
      <div className="fixed top-5 right-5 z-[100] pointer-events-auto">
        <button
          onClick={() => setLanguage(isEn ? 'it' : 'en')}
          className="glass-panel flex h-9 w-[4.5rem] items-center justify-between rounded-full p-1 text-[10px] font-bold uppercase tracking-widest text-white/50 transition-colors cursor-pointer"
        >
          <span className={`flex-1 text-center transition-colors ${!isEn ? 'text-white' : 'hover:text-white/80'}`}>IT</span>
          <span className="h-full w-[1px] bg-white/20"></span>
          <span className={`flex-1 text-center transition-colors ${isEn ? 'text-white' : 'hover:text-white/80'}`}>EN</span>
        </button>
      </div>

      {/* Monogramma */}
      <div className="fixed left-6 top-4 z-40">
        <motion.p
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="font-mono text-xs tracking-[0.3em] text-[var(--text-secondary)]"
        >
          VP
        </motion.p>
      </div>

      {/* Dot di sezione */}
      <nav className="fixed right-6 top-1/2 z-40 -translate-y-1/2" aria-label="Sezioni">
        <div className="flex flex-col items-end gap-4">
          {SECTIONS.map((id, index) => (
            <button
              key={id}
              type="button"
              onClick={() => scrollToSection(index)}
              className="group flex min-h-0 min-w-0 items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              aria-label={`Vai a ${LABELS[id]}`}
              aria-current={activeIndex === index ? 'true' : undefined}
            >
              <span
                className={`font-mono text-[0.58rem] uppercase tracking-[0.3em] transition-all duration-300 ${
                  activeIndex === index
                    ? 'text-accent-soft opacity-100'
                    : 'text-white/0 group-hover:text-white/50'
                }`}
              >
                {LABELS[id]}
              </span>
              <span className="relative flex items-center justify-center">
                {activeIndex === index && (
                  <motion.span
                    layoutId="active-dot"
                    className="absolute h-4 w-4 rounded-full border border-accent/50"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span
                  className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                    activeIndex === index
                      ? 'bg-accent shadow-[0_0_10px_rgb(10_132_255/0.6)]'
                      : 'bg-white/20 group-hover:bg-white/50'
                  }`}
                />
              </span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
</file>

<file path="src/components/overlay/SkillsOverlay.tsx">
'use client';

import { motion } from 'framer-motion';
import { capabilityTracks } from '@/data/skills';
import { useAppStore } from '@/store/useAppStore';

export default function SkillsOverlay() {
  const language = useAppStore((s) => s.language);
  const isEn = language === 'en';

  // Extract tracks for easy radial placement
  const aiTrack = capabilityTracks[0];
  const webTrack = capabilityTracks[1];
  const devopsTrack = capabilityTracks[2];

  // Animation variants for entering the section
  const fadeIn = {
    hidden: { opacity: 0, filter: 'blur(10px)' },
    visible: (i: number) => ({
      opacity: 1,
      filter: 'blur(0px)',
      transition: { delay: i * 0.15, duration: 0.8, ease: "easeOut" },
    }),
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center pointer-events-none">
      
      {/* Vignette background to darken edges and make text readable against particles */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 55% 55% at 50% 50%, transparent 20%, rgba(4,6,12,0.9) 100%)',
        }}
      />

      <div className="relative z-10 w-full max-w-7xl h-full flex items-center justify-center pointer-events-none p-4 md:p-8">
        
        {/* TOP CENTER: Title */}
        <motion.div
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={fadeIn}
          className="absolute top-[10%] md:top-[12%] left-1/2 -translate-x-1/2 text-center pointer-events-auto w-full px-4"
        >
          <p className="text-[0.6rem] uppercase tracking-[0.5em] text-white/50 mb-2">
            Skill Matrix
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-wide drop-shadow-lg">
            {isEn ? 'AI-first Capabilities' : 'Capacità AI-first'}
          </h2>
        </motion.div>

        {/* MIDDLE LEFT: AI/ML */}
        <motion.div
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={fadeIn}
          className="absolute left-[4%] md:left-[8%] lg:left-[12%] top-[30%] md:top-[35%] max-w-[180px] md:max-w-[260px] pointer-events-auto text-left"
        >
          <h3 className="text-[0.7rem] md:text-sm font-bold text-white uppercase tracking-widest mb-2 flex items-center gap-2 drop-shadow-md">
            <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981]"></span>
            {aiTrack.title}
          </h3>
          <p className="text-[0.55rem] md:text-xs text-white/60 mb-3 leading-relaxed hidden sm:block">
            {isEn && typeof aiTrack.description !== 'string' ? aiTrack.description.en : (typeof aiTrack.description !== 'string' ? aiTrack.description.it : aiTrack.description)}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {aiTrack.stack.slice(0, 5).map(tool => (
              <span key={tool} className="text-[0.5rem] md:text-[0.55rem] border border-white/10 bg-white/5 backdrop-blur-sm rounded px-1.5 py-0.5 text-white/50">{tool}</span>
            ))}
          </div>
        </motion.div>

        {/* MIDDLE RIGHT: Web Dev */}
        <motion.div
          custom={2}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={fadeIn}
          className="absolute right-[4%] md:right-[8%] lg:right-[12%] top-[25%] md:top-[28%] max-w-[180px] md:max-w-[260px] pointer-events-auto text-right flex flex-col items-end"
        >
          <h3 className="text-[0.7rem] md:text-sm font-bold text-white uppercase tracking-widest mb-2 flex items-center gap-2 justify-end drop-shadow-md">
            {webTrack.title}
            <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-[#60A5FA] shadow-[0_0_8px_#60A5FA]"></span>
          </h3>
          <p className="text-[0.55rem] md:text-xs text-white/60 mb-3 leading-relaxed hidden sm:block">
            {isEn ? webTrack.description.en : webTrack.description.it}
          </p>
          <div className="flex flex-wrap gap-1.5 justify-end">
            {webTrack.stack.slice(0, 5).map(tool => (
              <span key={tool} className="text-[0.5rem] md:text-[0.55rem] border border-white/10 bg-white/5 backdrop-blur-sm rounded px-1.5 py-0.5 text-white/50">{tool}</span>
            ))}
          </div>
        </motion.div>

        {/* BOTTOM LEFT: DevOps */}
        <motion.div
          custom={3}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={fadeIn}
          className="absolute left-[6%] md:left-[10%] lg:left-[16%] bottom-[25%] md:bottom-[20%] max-w-[180px] md:max-w-[260px] pointer-events-auto text-left"
        >
          <h3 className="text-[0.7rem] md:text-sm font-bold text-white uppercase tracking-widest mb-2 flex items-center gap-2 drop-shadow-md">
            <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.8)]"></span>
            {devopsTrack.title}
          </h3>
          <p className="text-[0.55rem] md:text-xs text-white/60 mb-3 leading-relaxed hidden sm:block">
            {isEn ? devopsTrack.description.en : devopsTrack.description.it}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {devopsTrack.stack.slice(0, 4).map(tool => (
              <span key={tool} className="text-[0.5rem] md:text-[0.55rem] border border-white/10 bg-white/5 backdrop-blur-sm rounded px-1.5 py-0.5 text-white/50">{tool}</span>
            ))}
          </div>
        </motion.div>

        {/* BOTTOM RIGHT: Toolchain & Langs */}
        <motion.div
          custom={4}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={fadeIn}
          className="absolute right-[6%] md:right-[10%] lg:right-[16%] bottom-[20%] md:bottom-[15%] max-w-[180px] md:max-w-[260px] pointer-events-auto text-right flex flex-col items-end"
        >
          <h3 className="text-[0.7rem] md:text-sm font-bold text-white uppercase tracking-widest mb-2 flex items-center gap-2 justify-end drop-shadow-md">
            Ecosystem
            <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-white/40 shadow-[0_0_8px_rgba(255,255,255,0.4)]"></span>
          </h3>
          <p className="text-[0.55rem] md:text-xs text-white/60 mb-3 leading-relaxed hidden sm:block">
            {isEn ? 'Core tools and language mastery to operate in international teams.' : 'Strumenti core e padronanza linguistica per operare in team internazionali.'}
          </p>
          <div className="flex flex-wrap gap-1.5 justify-end">
             <span className="text-[0.5rem] md:text-[0.55rem] border border-white/10 bg-white/5 backdrop-blur-sm rounded px-1.5 py-0.5 text-white/50">Git/GitHub</span>
             <span className="text-[0.5rem] md:text-[0.55rem] border border-white/10 bg-white/5 backdrop-blur-sm rounded px-1.5 py-0.5 text-white/50">VS Code</span>
             <span className="text-[0.5rem] md:text-[0.55rem] border border-white/10 bg-white/5 backdrop-blur-sm rounded px-1.5 py-0.5 text-[#60A5FA]/60">English B1</span>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
</file>

<file path="src/data/projects.ts">
export interface ProjectMetric {
  label: { it: string; en: string } | string;
  value: { it: string; en: string } | string;
  caption: { it: string; en: string };
}

export interface ProjectLink {
  label: string;
  href: string;
  type?: 'github' | 'live' | 'case-study';
}

export interface ProjectData {
  id: number;
  title: string;
  subtitle: { it: string; en: string };
  description: { it: string; en: string };
  image: string;
  longDescription: { it: string; en: string };
  tags: ({ it: string; en: string } | string)[];
  timeline: { it: string; en: string } | string;
  role: { it: string; en: string } | string;
  stack: ({ it: string; en: string } | string)[];
  pillars: ({ it: string; en: string } | string)[];
  metrics: ProjectMetric[];
  links?: ProjectLink[];
}

export const projects: ProjectData[] = [
  {
    id: 1,
    title: 'Talent Program "Next Pulse"',
    subtitle: {
      it: 'EnLexi: AI Sales Assistant multi-sorgente per Engine S.p.A.',
      en: 'EnLexi: Multi-source AI Sales Assistant for Engine S.p.A.',
    },
    description: {
      it: 'Sviluppo backend in team per un AI Sales Assistant nel settore Traffic Enforcement e Smart City (Hackathon nazionale).',
      en: 'Team backend development for an AI Sales Assistant in the Traffic Enforcement and Smart City sector (National Hackathon).',
    },
    image: '/next-pulse-polaroid.jpg',
    longDescription: {
      it: 'Durante il bootcamp selettivo intensivo (48h) su scala nazionale (320 candidati), ho contribuito allo sviluppo di EnLexi in un team di 5 persone. '
        + 'EnLexi è un AI Sales Assistant multi-sorgente per Engine S.p.A. Mi sono occupato del backend con focus sulla pipeline di retrieval e '
        + 'sull\'implementazione della ricerca ibrida (BM25 + ChromaDB/FAISS), gestendo anche l\'organizzazione del team e collaborando alla presentazione finale.',
      en: 'During the intensive selective bootcamp (48h) on a national scale (320 candidates), I contributed to the development of EnLexi in a 5-person team. '
        + 'EnLexi is a multi-source AI Sales Assistant for Engine S.p.A. I worked on the backend focusing on the retrieval pipeline and '
        + 'implementing hybrid search (BM25 + ChromaDB/FAISS), while also managing team organization and collaborating on the final presentation.',
    },
    tags: ['Hackathon', 'Python', 'FastAPI', 'RAG', 'ChromaDB', 'FAISS'],
    timeline: { it: 'Giugno 2026', en: 'June 2026' },
    role: { it: 'Backend Developer / Team Organizer', en: 'Backend Developer / Team Organizer' },
    stack: ['Python', 'FastAPI', 'BM25', 'ChromaDB', 'FAISS'],
    pillars: ['Hybrid RAG', 'AI Sales Assistant', 'Team Management', 'Backend'],
    metrics: [
      { label: { it: 'Candidati', en: 'Candidates' }, value: '320', caption: { it: 'Bootcamp selettivo nazionale.', en: 'National selective bootcamp.' } },
      { label: { it: 'Durata', en: 'Duration' }, value: '48h', caption: { it: 'Hackathon intensivo.', en: 'Intensive hackathon.' } },
      { label: 'Retrieval', value: { it: 'Ibrido', en: 'Hybrid' }, caption: { it: 'Integrazione BM25 + FAISS/ChromaDB.', en: 'BM25 + FAISS/ChromaDB integration.' } },
    ],
  },
  {
    id: 2,
    title: 'PugliaHack 2026',
    subtitle: {
      it: 'TerraNode: Piattaforma per smart agri-tourism',
      en: 'TerraNode: Smart agri-tourism platform',
    },
    description: {
      it: 'Sviluppo in autonomia di TerraNode, piattaforma con prenotazioni, gamification, tracciamento CO2 e dashboard real-time.',
      en: 'Solo development of TerraNode, a platform with bookings, gamification, CO2 tracking, and a real-time dashboard.',
    },
    image: '/pugliahack-2026.png',
    longDescription: {
      it: 'Nell\'ambito dell\'hackathon PugliaHack 2026 (finestra di sviluppo: 2 ore, piattaforma Lovable), ho sviluppato in autonomia TerraNode, '
        + 'una piattaforma per lo smart agri-tourism pugliese. La soluzione prevede ruoli distinti per turisti, agricoltori e Pubblica Amministrazione, '
        + 'includendo prenotazione di esperienze, gamification con crediti, tracciamento della CO2 e dashboard con KPI in tempo reale.',
      en: 'During the PugliaHack 2026 hackathon (development window: 2 hours, Lovable platform), I independently developed TerraNode, '
        + 'a platform for smart agri-tourism in Puglia. The solution features distinct roles for tourists, farmers, and Public Administration, '
        + 'including experience booking, credit-based gamification, CO2 tracking, and real-time KPI dashboards.',
    },
    tags: ['Hackathon', 'React 19', 'TailwindCSS', 'Supabase', 'Agri-tourism'],
    timeline: { it: 'Maggio 2026', en: 'May 2026' },
    role: { it: 'Solo Developer', en: 'Solo Developer' },
    stack: ['React 19', 'TanStack Query', 'TailwindCSS', 'Supabase (PostgreSQL)'],
    pillars: ['Smart Tourism', 'Gamification', 'CO2 Tracking', 'Real-time Dashboards'],
    metrics: [
      { label: { it: 'Tempo dev.', en: 'Dev time' }, value: { it: '2 ore', en: '2 hours' }, caption: { it: 'Finestra di sviluppo estremamente ridotta.', en: 'Extremely short development window.' } },
      { label: { it: 'Ruoli', en: 'Roles' }, value: '3', caption: { it: 'Turisti, Agricoltori, PA.', en: 'Tourists, Farmers, PA.' } },
      { label: 'Stack', value: 'Modern Web', caption: { it: 'React 19 + Supabase.', en: 'React 19 + Supabase.' } },
    ],
  },
  {
    id: 3,
    title: 'Hackathon "Space Edition"',
    subtitle: {
      it: 'The Pulse: Monitoraggio agricolo globale satellitare',
      en: 'The Pulse: Global satellite agricultural monitoring',
    },
    description: {
      it: '2° Classificato. Collaborazione all\'ideazione di un progetto per una costellazione di piccoli satelliti dedicati all\'agricoltura.',
      en: '2nd Place. Collaboration on the design of a small satellite constellation project dedicated to agriculture.',
    },
    image: '/leonardo-hackathon.jpg',
    longDescription: {
      it: 'Hackathon organizzato da Talent Garden e Leonardo a Milano. Mi sono classificato al 2° posto collaborando all\'ideazione di "The Pulse", '
        + 'un progetto per una costellazione di piccoli satelliti dedicata al monitoraggio agricolo globale, integrando logiche di telerilevamento e AI.',
      en: 'Hackathon organized by Talent Garden and Leonardo in Milan. I placed 2nd collaborating on the conception of "The Pulse", '
        + 'a small satellite constellation project dedicated to global agricultural monitoring, integrating remote sensing and AI logic.',
    },
    tags: ['Hackathon', 'Space Tech', 'Agri-Tech', 'Innovation'],
    timeline: { it: 'Maggio 2026', en: 'May 2026' },
    role: { it: 'Team Member', en: 'Team Member' },
    stack: ['Ideation', 'Team Collaboration', 'Space/Agri Tech'],
    pillars: ['Space Technology', 'Agriculture', 'Teamwork', 'Innovation'],
    metrics: [
      { label: { it: 'Piazzamento', en: 'Placement' }, value: { it: '2° Posto', en: '2nd Place' }, caption: { it: 'Hackathon nazionale Talent Garden x Leonardo.', en: 'National Hackathon Talent Garden x Leonardo.' } },
      { label: 'Focus', value: { it: 'Satelliti', en: 'Satellites' }, caption: { it: 'Monitoraggio agricolo globale.', en: 'Global agricultural monitoring.' } },
    ],
  },
  {
    id: 4,
    title: 'LACAM-SWAP · Orchestratore Multi-Agente',
    subtitle: {
      it: 'Ottimizzazione Multi-Metrica nei Sistemi di Raccomandazione',
      en: 'Multi-Metric Optimization in Recommendation Systems',
    },
    description: {
      it: 'Progetto di tesi: architettura multi-agente LLM orchestrata con LangGraph per raccomandazioni. Include RAG ibrido (BM25 + FAISS).',
      en: 'Thesis project: LLM multi-agent architecture orchestrated with LangGraph for recommendations. Includes hybrid RAG (BM25 + FAISS).',
    },
    image: '/SWAP.jpg',
    longDescription: {
      it: 'Progetto di tesi sviluppato durante il tirocinio curriculare (marzo–giugno 2025) presso il laboratorio LACAM-SWAP dell\'Università di Bari. '
        + 'Ho implementato un\'architettura multi-agente basata su LLM (Llama 3.2 3B Instruct), orchestrata con LangGraph, che coordina agenti specializzati '
        + 'su precisione e copertura del catalogo tramite un agente aggregatore. L\'architettura include anche un sistema RAG ibrido (BM25 + FAISS).',
      en: 'Thesis project developed during the curricular internship (March–June 2025) at the LACAM-SWAP lab, University of Bari. '
        + 'I implemented an LLM-based multi-agent architecture (Llama 3.2 3B Instruct), orchestrated with LangGraph, which coordinates specialized agents '
        + 'for precision and catalog coverage via an aggregator agent. The architecture also includes a hybrid RAG system (BM25 + FAISS).',
    },
    tags: ['LangGraph', 'Multi-Agent', 'Recommender Systems', 'RAG', 'Thesis'],
    timeline: { it: 'Marzo–Giugno 2025 · 3 mesi', en: 'March–June 2025 · 3 months' },
    role: { it: 'AI Research Intern', en: 'AI Research Intern' },
    stack: ['LangGraph', 'Python', 'Llama 3.2', 'FAISS', 'BM25'],
    pillars: ['Precision & Coverage Agents', 'Hybrid RAG', 'Aggregated-Agent', 'Llama 3.2'],
    metrics: [
      { label: { it: 'Novità', en: 'Novelty' }, value: '+12%', caption: { it: 'Miglioramento novità del catalogo raccomandato.', en: 'Improvement in recommended catalog novelty.' } },
      { label: { it: 'Precisione', en: 'Precision' }, value: '-0.5%', caption: { it: 'Delta minimo rispetto al baseline massimizzato.', en: 'Minimal delta compared to maximized baseline.' } },
      { label: 'Dataset', value: 'MovieLens 1M', caption: { it: 'Testato su benchmark standard.', en: 'Tested on standard benchmarks.' } },
    ],
    links: [
      { label: 'GitHub', href: 'https://github.com/Hellvisback365/LLM.git', type: 'github' },
    ],
  },
  {
    id: 5,
    title: 'B.Future Challenge 2025 · BOOM (CRIF)',
    subtitle: {
      it: 'Zenith: Assistente AI per digitalizzare la consulenza',
      en: 'Zenith: AI Assistant for digitalizing consulting',
    },
    description: {
      it: 'Sviluppo backend in team di Zenith, assistente AI con workflow automatizzato per la digitalizzazione della consulenza aziendale.',
      en: 'Team backend development of Zenith, an AI assistant with automated workflow for the digitalization of corporate consulting.',
    },
    image: '/b-future-challenge-2025.png',
    longDescription: {
      it: 'Hackathon multidisciplinare in team di 6 persone per VAR Group. Abbiamo sviluppato Zenith, assistente AI per automatizzare '
        + 'il processo di consulenza aziendale. Mi sono occupato della pipeline backend: orchestrazione tramite n8n, integrazione con Google Gemini '
        + 'e archiviazione su Google Drive. Il prototipo stimava un abbattimento drastico dei tempi di lavorazione.',
      en: 'Multidisciplinary hackathon in a 6-person team for VAR Group. We developed Zenith, an AI assistant to automate '
        + 'the corporate consulting process. I handled the backend pipeline: orchestration via n8n, integration with Google Gemini '
        + 'and storage on Google Drive. The prototype estimated a drastic reduction in processing times.',
    },
    tags: ['n8n', 'Gemini', 'API', 'Workflow Automation'],
    timeline: { it: 'Settembre–Novembre 2025', en: 'September–November 2025' },
    role: { it: 'Backend AI Developer', en: 'Backend AI Developer' },
    stack: ['n8n', 'Google Gemini', 'Google Drive API'],
    pillars: [{ it: 'Orchestrazione workflow', en: 'Workflow orchestration' }, { it: 'Automazione API', en: 'API automation' }, { it: 'Digitalizzazione', en: 'Digitalization' }, { it: 'Riduzione tempi', en: 'Time reduction' }],
    metrics: [
      { label: { it: 'Tempo report', en: 'Report time' }, value: '7gg → 1gg', caption: { it: 'Riduzione drastica stimata dei tempi di produzione.', en: 'Estimated drastic reduction in production times.' } },
      { label: 'Team', value: { it: '6 persone', en: '6 people' }, caption: { it: 'Collaborazione multidisciplinare.', en: 'Multidisciplinary collaboration.' } },
      { label: 'Stack', value: 'n8n + Gemini', caption: { it: 'Pipeline backend automatizzata.', en: 'Automated backend pipeline.' } },
    ],
    links: [
      { label: 'GitHub', href: 'https://github.com/Hellvisback365/ChallengeBoomVarGroup2025.git', type: 'github' },
    ],
  },
  {
    id: 6,
    title: 'BeFluent',
    subtitle: {
      it: 'Web app per supporto alla dislessia',
      en: 'Web app for dyslexia support',
    },
    description: {
      it: 'Applicazione web React+Node.js progettata per aiutare bambini con dislessia attraverso un\'interfaccia intuitiva e accessibile.',
      en: 'React+Node.js web application designed to help children with dyslexia through an intuitive and accessible interface.',
    },
    image: '/BeFluent_logo.png',
    longDescription: {
      it: 'BeFluent è un\'applicazione web progettata per aiutare bambini con dislessia attraverso un\'interfaccia intuitiva e accessibile. '
        + 'L\'app utilizza tecnologie React per il frontend e Node.js per il backend, offrendo esercizi personalizzati e feedback adattivi. '
        + 'La soluzione è stata progettata con un focus sull\'accessibilità e sulla facilità d\'uso, '
        + 'permettendo un\'esperienza di apprendimento inclusiva e coinvolgente.',
      en: 'BeFluent is a web application designed to help children with dyslexia through an intuitive and accessible interface. '
        + 'The app uses React for the frontend and Node.js for the backend, offering personalized exercises and adaptive feedback. '
        + 'The solution was designed with a focus on accessibility and ease of use, '
        + 'allowing for an inclusive and engaging learning experience.',
    },
    tags: ['React', 'Node.js', { it: 'Accessibilità', en: 'Accessibility' }, 'JavaScript', 'UX Design'],
    timeline: { it: 'Progetto Universitario', en: 'University Project' },
    role: { it: 'Developer', en: 'Developer' },
    stack: ['React', 'Node.js', 'JavaScript', 'CSS', 'Express'],
    pillars: [{ it: 'Accessibilità', en: 'Accessibility' }, { it: 'UX per bambini', en: 'UX for children' }, { it: 'Supporto dislessia', en: 'Dyslexia support' }, { it: 'Design inclusivo', en: 'Inclusive design' }],
    metrics: [
      { label: 'Target', value: { it: 'Bambini', en: 'Children' }, caption: { it: 'Interfaccia pensata per utenti con dislessia.', en: 'Interface designed for users with dyslexia.' } },
      { label: 'Stack', value: 'React + Node.js', caption: { it: 'Frontend moderno e backend robusto.', en: 'Modern frontend and robust backend.' } },
      { label: 'Focus', value: { it: 'Accessibilità', en: 'Accessibility' }, caption: { it: 'Design inclusivo e facilità d\'uso.', en: 'Inclusive design and ease of use.' } },
    ],
    links: [
      { label: 'GitHub', href: 'https://github.com/Hellvisback365/BeFluentVITO.git', type: 'github' },
    ],
  },
  {
    id: 7,
    title: 'POSD System',
    subtitle: {
      it: 'Privacy-Oriented System Design conforme GDPR',
      en: 'GDPR compliant Privacy-Oriented System Design',
    },
    description: {
      it: 'Soluzione software privacy-oriented con architettura MVC, progettata per garantire conformità GDPR e sicurezza dei dati.',
      en: 'Privacy-oriented software solution with MVC architecture, designed to ensure GDPR compliance and data security.',
    },
    image: '/POSD.png',
    longDescription: {
      it: 'POSD System (Privacy-Oriented System Design) è una soluzione software che implementa un\'architettura MVC con focus sulla conformità GDPR. '
        + 'Il sistema è progettato per garantire la sicurezza dei dati utente end-to-end, con crittografia avanzata e controlli di accesso granulari. '
        + 'La piattaforma include funzionalità per la gestione del consenso degli utenti e strumenti per l\'analisi dell\'impatto sulla privacy.',
      en: 'POSD System (Privacy-Oriented System Design) is a software solution that implements an MVC architecture focusing on GDPR compliance. '
        + 'The system is designed to ensure end-to-end user data security, with advanced encryption and granular access controls. '
        + 'The platform includes features for managing user consent and tools for analyzing privacy impact.',
    },
    tags: ['Privacy', 'GDPR', 'MVC', { it: 'Sicurezza', en: 'Security' }, 'Python'],
    timeline: { it: 'Progetto Universitario', en: 'University Project' },
    role: { it: 'Developer', en: 'Developer' },
    stack: ['Python', 'MVC Architecture', { it: 'Crittografia', en: 'Cryptography' }, 'GDPR Compliance'],
    pillars: ['Privacy by Design', 'GDPR Compliance', { it: 'Crittografia E2E', en: 'E2E Cryptography' }, { it: 'Gestione consenso', en: 'Consent Management' }],
    metrics: [
      { label: { it: 'Standard', en: 'Standard' }, value: 'GDPR', caption: { it: 'Piena conformità alle normative europee.', en: 'Full compliance with European regulations.' } },
      { label: { it: 'Sicurezza', en: 'Security' }, value: 'End-to-End', caption: { it: 'Crittografia avanzata dei dati.', en: 'Advanced data encryption.' } },
      { label: { it: 'Architettura', en: 'Architecture' }, value: 'MVC', caption: { it: 'Design modulare e manutenibile.', en: 'Modular and maintainable design.' } },
    ],
  },
];
</file>

<file path="src/lib/rag/embedder.ts">
'use client';

/**
 * Embedding della query NEL BROWSER del visitatore (via Web Worker).
 *
 * Il calcolo gira in un thread separato (`worker.ts`) usando WebGPU se
 * disponibile, o WASM come fallback. Questo garantisce ZERO lag sul
 * thread principale, mantenendo intatte le performance di R3F e Lenis.
 */

export const EMBED_MODEL = 'Xenova/multilingual-e5-small';
export const EMBED_DIM = 384;

export type EmbedderState = 'idle' | 'loading' | 'ready' | 'error';

let state: EmbedderState = 'idle';
const listeners = new Set<(s: EmbedderState) => void>();

let worker: Worker | null = null;
let resolveInit: ((value: boolean) => void) | null = null;
const pendingPromises = new Map<number, { resolve: (v: number[] | null) => void, reject: (r: any) => void }>();
let messageIdCounter = 0;

function setState(next: EmbedderState) {
  state = next;
  listeners.forEach((l) => l(next));
}

export function getEmbedderState(): EmbedderState {
  return state;
}

export function subscribeEmbedder(listener: (s: EmbedderState) => void): () => void {
  listeners.add(listener);
  listener(state);
  return () => listeners.delete(listener);
}

function initWorker() {
  if (typeof window === 'undefined') return;
  if (worker) return;

  try {
    setState('loading');
    worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });

    worker.addEventListener('message', (event) => {
      const { type, id, vector, error } = event.data;

      if (type === 'ready') {
        setState('ready');
        if (resolveInit) {
          resolveInit(true);
          resolveInit = null;
        }
      } else if (type === 'result') {
        const promise = pendingPromises.get(id);
        if (promise) {
          promise.resolve(vector);
          pendingPromises.delete(id);
        }

      } else if (type === 'error') {
        console.warn('[embedder] Worker error:', error);
        if (id !== undefined && pendingPromises.has(id)) {
          pendingPromises.get(id)?.resolve(null);
          pendingPromises.delete(id);
        } else {
          setState('error');
        }
      }
    });

    // Invia il preload trigger al worker
    worker.postMessage({ type: 'load' });
  } catch (err) {
    console.warn('[embedder] Errore inizializzazione worker:', err);
    setState('error');
  }
}

export function warmupEmbedder(): void {
  if (!worker) {
    initWorker();
  }
}

/**
 * Richiede il vettore di embedding al worker.
 */
export async function embedQuery(text: string): Promise<number[] | null> {
  if (!worker) {
    initWorker();
  }

  // Aspettiamo che sia ready se è ancora in caricamento
  if (state === 'loading') {
    await new Promise<boolean>((resolve) => {
      const prevResolve = resolveInit;
      resolveInit = (v) => {
        if (prevResolve) prevResolve(v);
        resolve(v);
      };
    });
  }

  if (state !== 'ready' || !worker) {
    return null; // Fallback al BM25-only del server
  }

  return new Promise((resolve, reject) => {
    const id = messageIdCounter++;
    pendingPromises.set(id, { resolve, reject });
    worker!.postMessage({ type: 'embed', id, text });
  });
}
</file>

<file path="src/lib/rag/retriever.ts">
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
</file>

<file path="scripts/rag-ingest.mts">
/**
 * Ingest RAG v2 — `npm run rag:ingest`
 *
 * 1. Legge src/data/projects.ts, src/data/about.ts, src/data/skills.ts
 * 2. Chunking paragraph-aware (~480 caratteri, overlap di una frase)
 * 3. Embeddings con `Xenova/multilingual-e5-small` via Transformers.js,
 *    eseguito LOCALMENTE in Node: nessuna API, nessuna chiave, nessun
 *    rate limit. Al primo run il modello (~30 MB quantizzato) viene
 *    scaricato nella cache HuggingFace locale; i run successivi sono
 *    offline. Lo STESSO modello gira nel browser del visitatore per la
 *    query (prefissi e5: "passage:" qui, "query:" lato client).
 * 4. Scrive src/data/rag-index.json
 *
 * Se l'ambiente non riesce a caricare il modello (es. CI senza rete),
 * lo script scrive comunque l'indice senza vettori: il retriever
 * lavorerà in BM25-only. Mai un indice rotto, mai vettori-zero finti.
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

const EMBEDDING_MODEL = 'Xenova/multilingual-e5-small';
const CHUNK_SIZE = 480;

interface ProfileDocument {
  id: string;
  category: string;
  title: string;
  summary: string;
  body: string;
  tags?: string[];
  updatedAt: string;
}

/** Split per paragrafi/frasi, ricomposto fino a CHUNK_SIZE con overlap
 *  dell'ultima frase: i confini semantici battono il taglio a byte. */
function chunkText(text: string): string[] {
  const sentences = text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  let current = '';
  let lastSentence = '';

  for (const sentence of sentences) {
    if (current && (current + ' ' + sentence).length > CHUNK_SIZE) {
      chunks.push(current);
      // overlap vero: prependi l'ultima frase del chunk precedente
      current = lastSentence ? `${lastSentence} ${sentence}` : sentence;
    } else {
      current = current ? `${current} ${sentence}` : sentence;
    }
    lastSentence = sentence;
  }
  if (current) chunks.push(current);
  return chunks;
}

async function tryLoadEmbedder() {
  try {
    const { pipeline } = await import('@huggingface/transformers');
    const extractor = await pipeline('feature-extraction', EMBEDDING_MODEL, {
      dtype: 'q8',
    });
    return async (texts: string[]): Promise<number[][]> => {
      const output = await extractor(texts, { pooling: 'mean', normalize: true });
      const list = output.tolist() as number[][];
      // 5 decimali: dimezza il peso del JSON senza effetti sul ranking
      return list.map((v) => v.map((x) => Math.round(x * 1e5) / 1e5));
    };
  } catch (err) {
    console.warn(
      '[ingest] Modello di embedding non disponibile, indice in modalità BM25-only.',
      err instanceof Error ? err.message : err,
    );
    return null;
  }
}

/** Trasforma un progetto del sito in un documento RAG */
function projectToDocument(p: any): ProfileDocument {
  const metrics = p.metrics
    .map((m: { label: string; value: string; caption: string }) => `${m.label}: ${m.value} (${m.caption})`)
    .join('; ');
  const links = p.links?.length
    ? ` Link: ${p.links.map((l: { label: string; href: string }) => `${l.label} ${l.href}`).join(', ')}.`
    : '';
  const body =
    `${p.subtitle}. ${p.longDescription} ` +
    `Ruolo di Vito: ${p.role}. Periodo: ${p.timeline}. ` +
    `Stack: ${p.stack.join(', ')}. ` +
    `Risultati: ${metrics}.${links}`;
  return {
    id: `project-${p.id}`,
    category: 'project',
    title: p.title,
    summary: p.description,
    body,
    tags: p.tags,
    updatedAt: new Date().toISOString(),
  };
}

/** Trasforma le skills in documenti RAG */
function trackToDocument(t: any): ProfileDocument {
  return {
    id: `skill-track-${t.title.replace(/\W+/g, '-').toLowerCase()}`,
    category: 'skills',
    title: `Competenze: ${t.title}`,
    summary: t.description,
    body: `Aree di focus: ${t.focusAreas.join(', ')}. Stack tecnologico: ${t.stack.join(', ')}.`,
    tags: t.stack,
    updatedAt: new Date().toISOString(),
  };
}

function toolHighlightToDocument(t: any): ProfileDocument {
  return {
    id: `tool-${t.area.replace(/\W+/g, '-').toLowerCase()}`,
    category: 'tools',
    title: `Strumenti e Tecnologie: ${t.area} (${t.category})`,
    summary: t.description,
    body: `Strumenti utilizzati: ${t.tools.join(', ')}.`,
    tags: t.tools,
    updatedAt: new Date().toISOString(),
  };
}

function languageToDocument(l: any): ProfileDocument {
  return {
    id: `lang-${l.name.toLowerCase()}`,
    category: 'languages',
    title: `Lingua: ${l.name}`,
    summary: `Livello: ${l.level}`,
    body: l.description,
    tags: ['language', l.name.toLowerCase()],
    updatedAt: new Date().toISOString(),
  };
}

/** Crea documenti per about/bio */
function aboutToDocuments(personalInfo: any, formationItems: any[], timelineMilestones: any[]): ProfileDocument[] {
  const docs: ProfileDocument[] = [];
  
  // Bio
  docs.push({
    id: 'bio-vision',
    category: 'bio',
    title: 'Profilo professionale e Informazioni Personali',
    summary: personalInfo.shortBio,
    body: `Nome: ${personalInfo.name}. Ruolo: ${personalInfo.role}. Vive a: ${personalInfo.location}. ${personalInfo.longBio}`,
    tags: ['bio', 'vision', 'location'],
    updatedAt: new Date().toISOString(),
  });

  // Education
  docs.push({
    id: 'education-track',
    category: 'education',
    title: 'Percorso formativo e Istruzione',
    summary: 'Laurea in Informatica, Laurea Magistrale in AI, Diploma (Maturità).',
    body: formationItems.map((f: any) => `${f.label} (${f.detail})`).join('. '),
    tags: ['education', 'degree', 'diploma', 'maturità', 'scuola', 'voto'],
    updatedAt: new Date().toISOString(),
  });

  // Timeline
  timelineMilestones.forEach((m: any) => {
    docs.push({
      id: `timeline-${m.id}`,
      category: 'experience',
      title: `Esperienza: ${m.title}`,
      summary: m.description,
      body: `Data: ${m.date}. Luogo: ${m.location}. Dettagli: ${m.highlights.join(' ')}`,
      tags: ['experience', 'work', 'hackathon'],
      updatedAt: new Date().toISOString(),
    });
  });

  return docs;
}

async function main() {
  const projectsData: any = await import('../src/data/projects.ts');
  const skillsData: any = await import('../src/data/skills.ts');
  const aboutData: any = await import('../src/data/about.ts');
  
  const projects = projectsData.projects;
  const capabilityTracks = skillsData.capabilityTracks;
  const toolHighlights = skillsData.toolHighlights;
  const languages = skillsData.languages;
  
  const personalInfo = aboutData.personalInfo;
  const formationItems = aboutData.formationItems;
  const timelineMilestones = aboutData.timelineMilestones;

  const projectDocs = projects.map(projectToDocument);
  const skillDocs = [
    ...capabilityTracks.map(trackToDocument),
    ...toolHighlights.map(toolHighlightToDocument),
    ...languages.map(languageToDocument)
  ];
  const aboutDocs = aboutToDocuments(personalInfo, formationItems, timelineMilestones);

  const documents = [...projectDocs, ...skillDocs, ...aboutDocs];
  console.log(
    `[ingest] ${aboutDocs.length} about docs + ${skillDocs.length} skill docs + ${projectDocs.length} progetti = ${documents.length} documenti.`,
  );

  const chunks: Array<{
    id: string;
    docId: string;
    title: string;
    category: string;
    tags: string[];
    text: string;
    vec?: number[];
  }> = [];

  for (const doc of documents) {
    // summary nel primo chunk: è la riga più densa di segnale del doc
    const pieces = chunkText(`${doc.summary} ${doc.body}`);
    pieces.forEach((text, i) => {
      chunks.push({
        id: `${doc.id}#${i}`,
        docId: doc.id,
        title: doc.title,
        category: doc.category,
        tags: doc.tags ?? [],
        text,
      });
    });
  }
  console.log(`[ingest] ${chunks.length} chunk generati.`);

  const embed = await tryLoadEmbedder();
  if (embed) {
    // Convenzione e5: i documenti si embeddano con prefisso "passage: "
    const vectors = await embed(chunks.map((c) => `passage: ${c.title}. ${c.text}`));
    vectors.forEach((vec, i) => {
      chunks[i].vec = vec;
    });
    console.log(`[ingest] Embeddings ${EMBEDDING_MODEL} (${vectors[0].length} dim) calcolate localmente.`);
  }

  const outPath = join(rootDir, 'src', 'data', 'rag-index.json');
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(
    outPath,
    JSON.stringify(
      {
        model: embed ? EMBEDDING_MODEL : 'none',
        dim: embed && chunks[0]?.vec ? chunks[0].vec.length : 0,
        createdAt: new Date().toISOString(),
        chunks,
      },
      null,
      0,
    ),
    'utf-8',
  );
  console.log(`[ingest] Indice scritto in ${outPath}.`);
}

main().catch((err) => {
  console.error('[ingest] Errore:', err);
  process.exit(1);
});
</file>

<file path="src/components/overlay/ProjectsOverlay.tsx">
'use client';

import { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { projects as projectsData, type ProjectData } from '@/data/projects';
import Badge from '@/components/ui/Badge';
import CTAButton from '@/components/ui/CTAButton';
import { useAppStore } from '@/store/useAppStore';

const ProjectModal = dynamic(() => import('@/components/ProjectModal'), {
  ssr: false,
});

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export default function ProjectsOverlay() {
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const language = useAppStore((s) => s.language);
  const isEn = language === 'en';

  return (
    <>
      <div className="flex min-h-screen w-screen items-start justify-center px-4 py-16 sm:px-8">
        <div className="w-full max-w-5xl">
          {/* Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fadeIn}
            className="mb-10 text-center"
          >
            <p className="text-[0.65rem] uppercase tracking-[0.5em] text-[white]/70">
              Case Studies
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
              {isEn ? 'AI & Platform Experiences' : 'Esperienze AI & Platform'}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-white/60">
              {isEn ? 'Each project combines discovery, technical design, and an observability layer for frictionless delivery.' : 'Ogni progetto combina discovery, progettazione tecnica e un layer di osservabilità per consegne senza attriti.'}
            </p>
          </motion.div>

          {/* Project cards */}
          <div className="space-y-8">
            {projectsData.map((project, index) => (
              <motion.article
                key={project.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                custom={1 + index}
                variants={fadeIn}
                className="glass-holographic rounded-2xl p-5 transition-all duration-300 hover:border-[white]/25"
              >
                <div className="flex flex-col gap-6 lg:flex-row">
                  {/* Image */}
                  <div className="flex flex-col lg:w-2/5">
                    <div className="relative flex-1 min-h-[16rem] overflow-hidden rounded-xl border border-white/8 bg-[#05060d]">
                      {/* Blurred background */}
                      <Image
                        src={project.image}
                        alt={`${project.title} blur`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="object-cover blur-2xl opacity-40 scale-110"
                      />
                      {/* Foreground image */}
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="object-contain p-4 relative z-10 drop-shadow-2xl transition-transform duration-500 hover:scale-105"
                      />
                      <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-[#05060d]/60 via-transparent to-transparent" />
                    </div>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.tags.map((tag, idx) => {
                        const tagLabel = typeof tag !== 'string' ? (isEn ? tag.en : tag.it) : tag;
                        return (
                          <span
                            key={`tag-${idx}`}
                            className="rounded-full border border-white/8 bg-white/5 px-2.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-white/60"
                          >
                            {tagLabel}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-[0.6rem] uppercase tracking-[0.35em] text-white/50">
                          {typeof project.timeline !== 'string' ? (isEn ? project.timeline.en : project.timeline.it) : project.timeline}
                        </p>
                        <h3 className="text-xl font-semibold text-white">{typeof project.title !== 'string' ? (isEn ? (project.title as any).en : (project.title as any).it) : project.title}</h3>
                        <p className="text-xs text-white/60">{isEn ? project.subtitle.en : project.subtitle.it}</p>
                      </div>
                      <Badge variant="glow" className="text-[0.6rem]">
                        {typeof project.role !== 'string' ? (isEn ? project.role.en : project.role.it) : project.role}
                      </Badge>
                    </div>

                    <p className="text-sm text-white/70">{isEn ? project.description.en : project.description.it}</p>

                    {/* Metrics */}
                    <div className="grid gap-3 sm:grid-cols-3">
                      {project.metrics.map((metric, idx) => {
                        const mLabel = typeof metric.label !== 'string' ? (isEn ? metric.label.en : metric.label.it) : metric.label;
                        const mValue = typeof metric.value !== 'string' ? (isEn ? metric.value.en : metric.value.it) : metric.value;
                        const mCaption = typeof metric.caption !== 'string' ? (isEn ? metric.caption.en : metric.caption.it) : metric.caption;
                        return (
                          <div
                            key={`${project.id}-metric-${idx}`}
                            className="rounded-xl border border-white/8 bg-white/5 p-3"
                          >
                            <p className="text-[0.55rem] uppercase tracking-[0.3em] text-white/50">
                              {mLabel}
                            </p>
                            <p className="mt-1 text-xl font-semibold text-white">{mValue}</p>
                            <p className="mt-0.5 text-[0.6rem] text-white/60">
                              {mCaption}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Stack */}
                    <div className="flex flex-wrap gap-1.5">
                      {project.stack.map((tech, idx) => {
                        const techLabel = typeof tech !== 'string' ? (isEn ? tech.en : tech.it) : tech;
                        return (
                          <span
                            key={`stack-${idx}`}
                            className="rounded-full bg-white/5 px-2.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-white/50"
                          >
                            {techLabel}
                          </span>
                        );
                      })}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <CTAButton variant="primary" onClick={() => setSelectedProject(project)}>
                        {isEn ? 'Open case study' : 'Apri case study'}
                      </CTAButton>
                      {project.links?.map((link) => (
                        <CTAButton
                          key={link.href}
                          href={link.href}
                          variant="secondary"
                          target="_blank"
                          rel="noreferrer"
                        >
                          {link.label}
                        </CTAButton>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.pillars.map((pillar, idx) => {
                    const pillarLabel = typeof pillar !== 'string' ? (isEn ? pillar.en : pillar.it) : pillar;
                    return (
                      <Badge key={`pillar-${idx}`} variant="outline" className="text-[0.55rem]">
                        {pillarLabel}
                      </Badge>
                    );
                  })}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>

      {/* Project Modal (reused from original) */}
      <Suspense fallback={null}>
        <AnimatePresence>
          {selectedProject && (
            <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
          )}
        </AnimatePresence>
      </Suspense>
    </>
  );
}
</file>

<file path="src/data/about.ts">
export const personalInfo = {
  name: 'Vito Piccolini',
  role: 'AI Developer / Studente in Computer Science – AI',
  location: 'Noicattaro, Provincia di Bari (Italia)',
  shortBio: {
    it: 'Sviluppo sistemi di raccomandazione LLM-driven, architetture multi-agente e automazioni workflow con Python e LangGraph.',
    en: 'I develop LLM-driven recommendation systems, multi-agent architectures, and workflow automations with Python and LangGraph.'
  },
  longBio: {
    it: 'Dopo la laurea triennale in Informatica (107/110) sto proseguendo con la LM-18 in Computer Science – Artificial Intelligence presso l\'Università di Bari. Durante il tirocinio nel laboratorio LACAM-SWAP ho sviluppato un\'architettura multi-agente basata su LLM, orchestrata con LangGraph, ottenendo +12% di diversità e +53% precision@1. Competenze in Python, LangChain, LangGraph, React, Node.js e n8n per prototipazione rapida in team multidisciplinari.',
    en: 'After my Bachelor\'s degree in Computer Science (107/110), I am pursuing a Master\'s degree in Computer Science – Artificial Intelligence at the University of Bari. During my internship at the LACAM-SWAP lab, I developed an LLM-based multi-agent architecture, orchestrated with LangGraph, achieving +12% diversity and +53% precision@1. Skills in Python, LangChain, LangGraph, React, Node.js, and n8n for rapid prototyping in multidisciplinary teams.'
  },
  focusPills: {
    it: ['Assistenti enterprise', 'Multi-agent Recsys', 'Workflow automation', 'AI compliance'],
    en: ['Enterprise assistants', 'Multi-agent Recsys', 'Workflow automation', 'AI compliance']
  },
};

export const formationItems = [
  {
    label: { it: 'LM-18 · Computer Science – AI', en: 'Master\'s · Computer Science – AI' },
    detail: { it: 'Università degli Studi di Bari Aldo Moro · Da Ottobre 2025', en: 'University of Bari Aldo Moro · From October 2025' },
  },
  {
    label: { it: 'Laurea L-31 · 107/110', en: 'Bachelor\'s L-31 · 107/110' },
    detail: { it: 'Informatica e Tecnologia per la Produzione del Software · UniBa (2022-2025)', en: 'Computer Science and Software Production Technology · UniBa (2022-2025)' },
  },
  {
    label: { it: 'Diploma · Amministrazione, Finanza e Marketing · 75/100', en: 'High School Diploma · Administration, Finance and Marketing · 75/100' },
    detail: { it: 'I.I.S.S Alpi-Montale, Rutigliano (BA) · 2011-2016', en: 'I.I.S.S Alpi-Montale, Rutigliano (BA) · 2011-2016' },
  },
];

export const timelineMilestones = [
  {
    id: 1,
    date: { it: 'Giugno 2026', en: 'June 2026' },
    title: 'Talent Program "Next Pulse"',
    location: 'Chieti',
    description: {
      it: 'Sviluppo backend in team per EnLexi: un AI Sales Assistant multi-sorgente.',
      en: 'Backend development in a team for EnLexi: a multi-source AI Sales Assistant.',
    },
    highlights: {
      it: [
        'Bootcamp selettivo intensivo su scala nazionale (320 candidati).',
        'Implementazione pipeline di retrieval ibrida (BM25 + ChromaDB/FAISS) con FastAPI.',
      ],
      en: [
        'Intensive selective bootcamp on a national scale (320 candidates).',
        'Implementation of a hybrid retrieval pipeline (BM25 + ChromaDB/FAISS) with FastAPI.',
      ],
    },
  },
  {
    id: 2,
    date: { it: 'Maggio 2026', en: 'May 2026' },
    title: 'PugliaHack 2026',
    location: 'Bari',
    description: {
      it: 'Sviluppo in autonomia di TerraNode, piattaforma per lo smart agri-tourism.',
      en: 'Solo development of TerraNode, a smart agri-tourism platform.',
    },
    highlights: {
      it: [
        'Stack React 19, TailwindCSS, Supabase (PostgreSQL).',
        'Sviluppato in sole 2 ore. Gamification, tracciamento CO2 e dashboard KPI in tempo reale.',
      ],
      en: [
        'React 19, TailwindCSS, Supabase (PostgreSQL) stack.',
        'Developed in just 2 hours. Gamification, CO2 tracking, and real-time KPI dashboard.',
      ],
    },
  },
  {
    id: 3,
    date: { it: 'Maggio 2026', en: 'May 2026' },
    title: 'Hackathon "Space Edition"',
    location: 'Milano · Talent Garden x Leonardo',
    description: {
      it: '2° Classificato all\'hackathon nazionale per l\'ideazione di The Pulse.',
      en: '2nd Place at the national hackathon for the conception of The Pulse.',
    },
    highlights: {
      it: [
        'Progetto per una costellazione di piccoli satelliti dedicati al monitoraggio agricolo globale.',
        'Integrazione di logiche di telerilevamento e Artificial Intelligence.',
      ],
      en: [
        'Project for a constellation of small satellites dedicated to global agricultural monitoring.',
        'Integration of remote sensing and Artificial Intelligence logic.',
      ],
    },
  },
  {
    id: 4,
    date: { it: 'Settembre–Novembre 2025', en: 'September–November 2025' },
    title: 'B.Future Challenge 2025 · VAR Group x CRIF',
    location: 'Bologna · Remote',
    description: {
      it: 'Partecipante alla challenge aziendale: sviluppo in team di Zenith, assistente AI per consulenza.',
      en: 'Participant in the corporate challenge: team development of Zenith, an AI consultant assistant.',
    },
    highlights: {
      it: [
        'Workflow automatizzato con n8n, Gemini e Google Drive API.',
        'Riduzione stimata dei tempi di reportistica da 7 giorni a 1.',
      ],
      en: [
        'Automated workflow with n8n, Gemini, and Google Drive API.',
        'Estimated reduction in reporting times from 7 days to 1.',
      ],
    },
  },
  {
    id: 5,
    date: { it: 'Marzo–Giugno 2025', en: 'March–June 2025' },
    title: { it: 'Tirocinio Curriculare · LACAM-SWAP', en: 'Curricular Internship · LACAM-SWAP' },
    location: { it: 'Università di Bari', en: 'University of Bari' },
    description: {
      it: 'Progetto di tesi: Orchestrazione di Agenti LLM per l\'Ottimizzazione Multi-Metrica nei Sistemi di Raccomandazione.',
      en: 'Thesis project: Orchestration of LLM Agents for Multi-Metric Optimization in Recommendation Systems.',
    },
    highlights: {
      it: [
        'Architettura multi-agente LangGraph + RAG Ibrido (BM25 e FAISS).',
        '+12% novelty mantenendo inalterata la precisione media del baseline con Llama 3.2 3B.',
      ],
      en: [
        'Multi-agent architecture LangGraph + Hybrid RAG (BM25 and FAISS).',
        '+12% novelty while maintaining the average precision of the baseline with Llama 3.2 3B.',
      ],
    },
  },
  {
    id: 6,
    date: { it: 'Settembre 2022–Luglio 2025', en: 'September 2022–July 2025' },
    title: { it: 'Laurea Triennale L-31 · 107/110', en: 'Bachelor\'s Degree L-31 · 107/110' },
    location: { it: 'Università degli Studi di Bari Aldo Moro', en: 'University of Bari Aldo Moro' },
    description: {
      it: 'Informatica e Tecnologia per la Produzione del Software.',
      en: 'Computer Science and Software Production Technology.',
    },
    highlights: {
      it: [
        'Tesi su orchestrazione multi-agente LLM applicata ai sistemi di raccomandazione.',
        'Prosecuzione in LM-18 Computer Science – Artificial Intelligence.',
      ],
      en: [
        'Thesis on multi-agent LLM orchestration applied to recommendation systems.',
        'Continuation in LM-18 Computer Science – Artificial Intelligence.',
      ],
    },
  },
  {
    id: 7,
    date: '2016–2022',
    title: { it: 'Operaio Generico e Retail', en: 'General Worker and Retail' },
    location: 'Bari',
    description: {
      it: 'Esperienza lavorativa in settori trasversali (edilizia, agricoltura, reception, gestione negozio).',
      en: 'Work experience in transversal sectors (construction, agriculture, reception, shop management).',
    },
    highlights: {
      it: [
        '6 anni di esperienza prima di intraprendere il percorso in Informatica.',
        'Forte focus su resilienza, problem-solving, e capacità di adattamento in team.',
      ],
      en: [
        '6 years of experience before embarking on the Computer Science path.',
        'Strong focus on resilience, problem-solving, and adaptability in teams.',
      ],
    },
  },
];
</file>

<file path="src/components/overlay/HeroOverlay.tsx">
'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';

const STACK = ['Python', 'LangGraph', 'RAG ibrido · BM25 + FAISS', 'React · Next.js', 'n8n'];

/**
 * La hero è una tesi: nome, una frase che dice cosa costruisci,
 * e la prova interattiva (il copilot) a un tap di distanza.
 * Una sola famiglia tipografica a pesi disciplinati, mono per le label.
 */
export default function HeroOverlay() {
  const setCopilotOpen = useAppStore((s) => s.setCopilotOpen);
  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const reduced = useReducedMotion();

  const isEn = language === 'en';

  return (
    <>

      <div className="flex min-h-dvh w-full items-center justify-center px-6">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="flex max-w-3xl flex-col items-center gap-7 text-center"
        >
          <p className="eyebrow">AI Engineer — RecSys · RAG · Agents</p>

          <h1 className="text-5xl font-extralight leading-[1.05] tracking-[-0.03em] text-white sm:text-6xl md:text-7xl">
            Vito Piccolini
            <span className="text-accent">.</span>
          </h1>

          <p className="max-w-xl text-balance text-base font-light leading-relaxed text-[var(--text-secondary)] sm:text-lg">
            {isEn
              ? 'I build recommendation systems and AI copilots that reason on real-world data - from multi-agent orchestration to hybrid retrieval.'
              : "Costruisco sistemi di raccomandazione e copiloti AI che ragionano su dati reali - dall'orchestrazione multi-agente al retrieval ibrido."}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-[var(--text-muted)]">
            {STACK.map((item, i) => (
              <span key={item} className="flex items-center gap-5">
                {i > 0 && <span className="text-accent/40">·</span>}
                {item}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-3 pt-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setCopilotOpen(true)}
              className="rounded-full bg-accent px-7 py-3 text-sm font-medium text-white transition-all hover:bg-accent-soft hover:shadow-[0_0_32px_rgb(10_132_255/0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {isEn ? 'Talk to my Copilot' : 'Parla con il mio copilot'}
            </button>
            <a
              href="#projects"
              className="rounded-full border border-line px-7 py-3 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:border-accent-soft/50 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {isEn ? 'View Projects' : 'Vedi i progetti'}
            </a>
          </div>

        <motion.div
          className="mt-10 flex flex-col items-center gap-2 text-[var(--text-muted)]"
          animate={reduced ? undefined : { y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          <span className="font-mono text-[0.58rem] uppercase tracking-[0.5em]">{isEn ? 'Scroll' : 'Scorri'}</span>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.25} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </div>
    </>
  );
}
</file>

<file path="src/data/rag-index.json">
{"model":"Xenova/multilingual-e5-small","dim":384,"createdAt":"2026-06-20T11:19:54.134Z","chunks":[{"id":"project-1#0","docId":"project-1","title":"Talent Program \"Next Pulse\"","category":"project","tags":["Hackathon","Python","FastAPI","RAG","ChromaDB","FAISS"],"text":"Sviluppo backend in team per un AI Sales Assistant nel settore Traffic Enforcement e Smart City (Hackathon nazionale). EnLexi: AI Sales Assistant multi-sorgente per Engine S.p.A.. Durante il bootcamp selettivo intensivo (48h) su scala nazionale (320 candidati), ho contribuito allo sviluppo di EnLexi in un team di 5 persone. EnLexi è un AI Sales Assistant multi-sorgente per Engine S.p.A.","vec":[0.04618,-0.01827,-0.05405,-0.04997,0.05714,-0.02589,-0.00795,0.01082,0.0183,-0.02239,0.09158,0.00716,0.07892,-0.0286,-0.02914,0.05504,0.05333,-0.06502,-0.05539,-0.06119,-0.01904,0.01151,-0.06172,0.02375,0.07545,0.05806,-0.02307,0.05042,0.04851,-0.05987,-0.01689,-0.03665,0.06324,-0.09738,0.04776,0.02279,-0.06173,-0.06264,0.05453,-0.08983,-0.01821,0.01456,0.04286,0.06425,0.05752,0.07917,0.0007,0.09302,-0.06666,-0.03271,-0.0183,0.05704,0.04685,0.04047,0.01276,-0.00414,-0.06586,-0.09761,-0.03961,-0.0215,0.01791,-0.04102,-0.00441,0.06036,0.06758,0.05501,0.02257,0.05997,-0.0859,-0.05529,-0.078,0.07742,0.042,-0.0645,-0.01481,0.0422,0.06864,-0.07317,0.04949,-0.02166,-0.10655,-0.02083,-0.01972,0.04444,-0.04584,0.03688,0.06083,-0.10517,0.04214,-0.00942,0.08605,0.03308,-0.04454,-0.02992,-0.06266,-0.0795,-0.0111,0.05507,0.04561,-0.06071,0.03227,-0.05485,0.04942,-0.09412,-0.03808,0.03455,0.04363,-0.07434,0.04456,-0.06658,-0.04821,0.0491,0.05619,0.03737,-0.07163,-0.01045,-0.0039,-0.05985,0.01484,-0.02295,0.06002,-0.01932,-0.06114,-0.08303,-0.06086,-0.04115,-0.02395,0.0534,0.0231,0.00559,-0.00678,0.06681,0.00962,0.04587,0.05908,0.05389,-0.06853,0.00428,-0.03259,-0.04139,-0.04335,0.05028,-0.02585,0.05072,0.02388,0.02808,0.08745,-0.07062,0.03713,-0.06063,0.08509,-0.01715,0.01483,0.00066,0.03475,-0.03134,-0.1054,0.00064,0.05769,0.095,-0.03573,-0.08836,-0.02641,-0.02151,-0.08798,-0.03382,-0.02152,0.05013,-0.06427,-0.01287,-0.0461,0.04069,-0.09527,0.08912,-0.01032,0.04651,-0.0886,0.07416,0.08185,0.02252,-0.01863,-0.0184,-0.08578,-0.04824,-0.09663,-0.03049,-0.07456,0.0366,0.00771,-0.0142,0.02384,0.04357,-0.02947,-0.06789,-0.02172,0.05734,-0.02845,0.01309,0.06796,0.03874,0.00682,-0.02303,0.0408,0.01804,0.0757,-0.00342,-0.06754,0.04548,-0.04926,0.08326,0.01059,-0.05565,-0.03167,0.04079,-0.00348,-0.02343,-0.03545,0.05203,-0.03001,-0.02265,0.08005,-0.01057,0.01967,-0.03937,0.02386,0.05686,0.05081,-0.07941,-0.03528,0.05206,-0.06014,0.00274,-0.05382,-0.08053,-0.05154,-0.05114,0.01719,0.03684,0.00523,-0.01382,-0.05505,-0.03558,0.03465,-0.03081,0.05941,-0.08423,0.00945,-0.02185,-0.03279,0.06505,0.06115,-0.0957,-0.06739,-0.02772,0.0123,0.04818,0.04619,0.06434,-0.10369,0.02103,0.03682,-0.04823,0.09445,0.03957,0.06988,-0.00278,-0.06975,0.04766,-0.03751,-0.0024,-0.06525,0.02485,0.04366,-0.02391,-0.04445,-0.02113,0.01099,0.10608,-0.04854,-0.03011,0.0738,0.05026,0.05479,0.06199,0.06173,-0.05503,-0.03456,0.05562,-0.05177,-0.0361,-0.03982,-0.04731,0.02773,-0.01754,0.07581,0.03246,0.04165,0.0384,-0.01137,0.07533,0.04769,-0.02508,0.06515,0.05855,-0.06397,0.04149,-0.00519,-0.00574,0.02037,0.05205,0.06856,0.05079,-0.05036,-0.03477,0.04498,0.07306,-0.01695,0.03776,-0.06757,-0.03491,-0.05881,-0.10977,-0.01591,-0.02524,0.02649,0.03671,-0.08726,-0.03153,0.02796,-0.00015,0.01816,-0.03595,-0.06486,0.02603,-0.04436,-0.03371,-0.04523,0.0655,-0.04185,-0.03992,0.02769,0.02787,-0.04805,0.05308,-0.01192,-0.03832,0.06829,-0.0214,-0.05061,0.02352,0.00916,-0.11531,0.09261,0.04811,-0.05172,0.06578,-0.09627,0.03323,0.05873,0.04417,-0.03224,-0.06581,0.03112,0.00157,0.04092,0.03365,0.01566,0.01545,0.01564,-0.01534,0.05275,0.08241,0.00994,-0.0277,-0.0343,-0.03972,-0.01661,0.01054,-0.04311,-0.04865,0.04356,0.03971,0.08223,0.05934]},{"id":"project-1#1","docId":"project-1","title":"Talent Program \"Next Pulse\"","category":"project","tags":["Hackathon","Python","FastAPI","RAG","ChromaDB","FAISS"],"text":"EnLexi è un AI Sales Assistant multi-sorgente per Engine S.p.A. Mi sono occupato del backend con focus sulla pipeline di retrieval e sull'implementazione della ricerca ibrida (BM25 + ChromaDB/FAISS), gestendo anche l'organizzazione del team e collaborando alla presentazione finale. Ruolo di Vito: Backend Developer / Team Organizer. Periodo: Giugno 2026. Stack: Python, FastAPI, BM25, ChromaDB, FAISS.","vec":[0.04064,0.00531,-0.03671,-0.03585,0.0753,-0.03009,-0.00135,0.02193,0.02434,-0.01667,0.08514,-0.00737,0.09732,-0.02838,0.01507,0.02765,0.09099,-0.06622,-0.04502,-0.0625,-0.00765,0.02568,-0.07525,0.04953,0.07328,0.03277,-0.03059,0.03442,0.07079,-0.03412,-0.04334,-0.05392,0.07449,-0.12362,0.04892,0.02007,-0.06078,-0.04584,0.04243,-0.06775,-0.02548,0.02725,0.01396,0.04951,0.05379,0.07513,0.00289,0.06144,-0.04772,-0.03824,-0.01489,0.09037,0.05092,0.0368,0.01849,-0.01478,-0.08134,-0.08441,-0.04416,-0.01329,0.02564,-0.03179,-0.01556,0.04389,0.05694,0.02858,-0.00062,0.0438,-0.08476,-0.03908,-0.05766,0.05388,0.00695,-0.055,-0.02351,0.03541,0.05121,-0.06759,0.02892,-0.0258,-0.10007,-0.05301,-0.02233,0.01843,-0.03972,0.04173,0.04895,-0.11616,0.03507,-0.02236,0.09092,0.04912,-0.01829,-0.06203,-0.05933,-0.08367,-0.02551,0.05987,0.04956,-0.04645,0.01667,-0.07235,0.03441,-0.11276,-0.04249,0.03762,0.01025,-0.07208,0.06738,-0.05925,-0.0448,0.04263,0.04332,0.05734,-0.07341,-0.01533,-0.01148,-0.05768,0.0333,-0.01679,0.0868,-0.01449,-0.06099,-0.12367,-0.06507,-0.0582,-0.01557,0.05693,0.02448,0.0119,0.00925,0.05567,0.02991,0.04578,0.05383,0.06894,-0.04031,-0.00588,-0.01761,-0.04625,-0.04354,0.04104,-0.06024,0.03695,0.03533,0.02571,0.0992,-0.05712,0.04861,-0.07098,0.08899,-0.02656,0.0379,0.01162,0.04662,-0.04511,-0.09403,-0.00693,0.05197,0.09942,-0.06934,-0.07676,-0.06722,-0.0027,-0.11406,-0.02696,0.01287,0.05486,-0.07411,0.00109,-0.06287,0.0616,-0.07338,0.10035,0.02369,0.01663,-0.06181,0.05691,0.09863,0.05578,-0.03697,-0.03126,-0.09835,-0.05752,-0.06588,-0.03356,-0.05971,0.02924,-0.00952,-0.02176,0.02111,0.06832,-0.02646,-0.06427,-0.01949,0.06485,-0.00802,0.03665,0.04349,0.02327,-0.01404,-0.03839,0.04854,0.04087,0.04598,0.00542,-0.06429,0.03582,-0.04034,0.08762,0.05825,-0.04105,-0.0463,0.03258,-0.00314,-0.02153,-0.01616,0.05491,-0.0282,0.00674,0.0774,-0.01055,0.04915,-0.04828,0.00139,0.04777,0.05404,-0.09286,-0.03931,0.0782,-0.03363,-0.00649,-0.05206,-0.05839,-0.01212,-0.04199,0.01945,0.02908,0.01641,-0.03028,-0.06668,-0.03796,0.04817,-0.04214,0.06134,-0.09632,0.00406,0.0135,-0.03998,0.06073,0.07086,-0.08398,-0.07855,-0.03726,-0.00237,0.07779,0.03463,0.06179,-0.09337,0.03568,0.02158,-0.03778,0.08799,0.05636,0.03958,0.00671,-0.07304,0.04052,-0.0494,-0.00869,-0.03973,0.01192,0.02026,-0.01745,-0.03131,-0.00337,0.03673,0.08597,-0.06073,-0.05988,0.06734,0.03992,0.02547,0.0477,0.05183,-0.05821,-0.06316,0.05251,-0.04108,-0.05283,-0.05367,-0.03929,0.04054,-0.01473,0.07656,0.03268,0.04068,0.03039,-0.03203,0.08146,0.04066,-0.01035,0.05757,0.05345,-0.07332,0.02809,0.01743,0.0252,0.0493,0.042,0.06384,0.05669,-0.0662,-0.02891,0.05604,0.03891,-0.02011,0.05296,-0.06953,-0.03535,-0.06383,-0.10968,-0.02225,-0.03516,0.02258,0.05455,-0.08998,-0.04095,0.06292,-0.02552,0.03786,-0.02775,-0.06728,0.04838,-0.03044,-0.03212,-0.00838,0.04287,-0.02792,-0.01967,-0.00944,0.02947,-0.01447,0.05569,-0.03898,-0.03131,0.07019,-0.02196,-0.04553,0.04308,0.01648,-0.11094,0.07776,0.05672,-0.03004,0.0607,-0.05709,0.03499,0.02342,0.01954,-0.02692,-0.06523,0.01162,-0.01042,0.04406,0.01356,0.00385,0.0167,0.00784,-0.03549,0.04714,0.06626,-0.02884,-0.02437,-0.04989,-0.04608,-0.01446,0.02061,-0.05101,-0.04981,0.04208,0.04117,0.06845,0.07178]},{"id":"project-1#2","docId":"project-1","title":"Talent Program \"Next Pulse\"","category":"project","tags":["Hackathon","Python","FastAPI","RAG","ChromaDB","FAISS"],"text":"Stack: Python, FastAPI, BM25, ChromaDB, FAISS. Risultati: Candidati: 320 (Bootcamp selettivo nazionale.); Durata: 48h (Hackathon intensivo.); Retrieval: Ibrido (Integrazione BM25 + FAISS/ChromaDB.).","vec":[0.0392,-0.01011,0.02933,-0.06247,0.07111,-0.05415,-0.00952,0.02599,0.04022,-0.00154,0.0769,-0.01546,0.08873,-0.04508,-0.01622,0.02153,0.1077,-0.0396,-0.03451,-0.05211,0.01424,-0.01905,-0.07709,0.02547,0.08484,0.01331,-0.01211,0.05111,0.08422,-0.03941,-0.02014,-0.04804,0.0875,-0.10395,0.07427,-0.00779,-0.06745,-0.06044,0.04997,-0.08177,-0.0096,0.04915,0.02163,0.05838,0.05036,0.0646,-0.0371,0.02882,-0.01319,-0.01142,-0.03192,0.10009,0.04662,0.0345,0.02435,-0.03067,-0.06733,-0.08452,-0.07234,0.01174,0.01391,-0.03256,-0.01222,0.03685,0.08415,0.06516,0.00791,0.0569,-0.07229,-0.02678,-0.06684,0.02999,-0.02073,-0.06794,-0.02028,0.04421,0.07112,-0.03251,0.03302,-0.05381,-0.10009,-0.0489,-0.03112,-0.01566,-0.05109,0.03678,0.06991,-0.06435,0.02752,-0.04634,0.07458,0.0428,-0.04707,-0.04372,-0.07839,-0.07286,-0.04699,0.03812,0.02008,-0.00449,0.01389,-0.06366,0.02048,-0.10322,-0.04299,0.04215,0.02223,-0.04217,0.07053,-0.03219,-0.05881,0.03653,0.04487,0.03565,-0.05004,-0.02195,-0.01393,-0.07711,0.04106,-0.02905,0.08855,0.01688,-0.04599,-0.07862,-0.08654,-0.02928,0.03759,0.03163,0.00548,0.02823,0.00276,0.04382,0.02237,0.03841,0.04943,0.06752,-0.04922,-0.00286,-0.00162,-0.06772,-0.03054,0.05962,-0.069,0.00746,0.05097,0.05148,0.08337,-0.08884,0.05415,-0.07087,0.05198,-0.05636,0.04566,0.04252,0.0466,-0.03422,-0.06435,-0.02477,0.04579,0.08571,-0.0506,-0.04235,-0.06763,-0.02005,-0.0816,-0.05203,0.02676,0.05288,-0.07909,-0.0292,-0.05236,0.11272,-0.04473,0.10034,0.01748,0.02328,-0.04451,0.05241,0.07463,0.03558,-0.03145,-0.01717,-0.09012,-0.0505,-0.05773,-0.0253,-0.02314,-0.00291,0.01877,-0.0532,0.02013,0.06177,-0.04102,-0.04168,-0.01992,0.07593,0.00715,0.06227,0.06225,0.02942,-0.02593,-0.03817,0.06551,0.03369,0.05354,0.00503,-0.06537,0.00193,-0.06262,0.08549,0.08584,-0.03714,-0.07785,0.01776,-0.02794,-0.03224,-0.01287,0.03533,-0.00186,0.03545,0.07669,-0.01833,0.06114,-0.07905,0.01817,0.0419,0.02112,-0.08372,-0.04103,0.06221,-0.05703,0.00538,-0.06633,-0.05446,-0.03562,-0.04613,0.02545,0.02975,0.00567,-0.04193,-0.07775,-0.02224,0.05089,-0.07323,0.0323,-0.07201,0.00922,0.03905,-0.0048,0.07818,0.06406,-0.09395,-0.06499,-0.05226,-0.01823,0.05331,0.05122,0.04239,-0.05388,0.02848,0.03726,-0.04624,0.08858,0.08448,0.05797,0.0094,-0.05733,0.01003,-0.05395,-0.04534,-0.01502,0.02409,0.03261,-0.03085,-0.05759,-0.05014,0.03737,0.06057,-0.06417,-0.06523,0.05275,-0.00425,0.0534,0.05764,0.06398,-0.01595,-0.07145,0.04933,-0.04435,-0.02253,-0.06701,-0.03064,0.03495,-0.01489,0.05627,0.01494,0.05044,0.04213,-0.03012,0.06094,0.02548,0.00035,0.07508,0.04034,-0.06189,0.04244,0.04297,0.03692,0.05597,0.02273,0.08349,0.05687,-0.06981,-0.01474,0.03686,0.01761,-0.01211,0.04072,-0.07112,-0.02188,-0.10647,-0.10235,-0.01196,-0.03576,0.01866,0.04675,-0.08243,-0.06211,0.03058,-0.01238,0.04829,-0.02264,-0.05562,0.03645,-0.04725,-0.04338,0.00768,0.08296,-0.03146,-0.04287,0.02939,0.03381,-0.03879,0.05581,-0.05647,-0.04518,0.07114,-0.02515,-0.02927,0.02935,0.03161,-0.10761,0.07917,0.04305,-0.04795,0.06969,-0.06345,-0.01096,0.03851,0.02046,-0.0554,-0.08022,0.04012,0.01303,0.05884,0.02274,-0.00107,-0.00286,0.01249,-0.03228,0.06343,0.05617,-0.00905,-0.01859,-0.03882,-0.03851,-0.02956,0.0347,-0.04768,-0.0908,0.05681,0.03165,0.08276,0.05367]},{"id":"project-2#0","docId":"project-2","title":"PugliaHack 2026","category":"project","tags":["Hackathon","React 19","TailwindCSS","Supabase","Agri-tourism"],"text":"Sviluppo in autonomia di TerraNode, piattaforma con prenotazioni, gamification, tracciamento CO2 e dashboard real-time. TerraNode: Piattaforma per smart agri-tourism. Nell'ambito dell'hackathon PugliaHack 2026 (finestra di sviluppo: 2 ore, piattaforma Lovable), ho sviluppato in autonomia TerraNode, una piattaforma per lo smart agri-tourism pugliese.","vec":[0.02811,-0.0015,-0.01301,-0.04704,0.04695,-0.07561,0.04128,0.03487,0.00841,0.00261,0.03928,0.04558,0.03483,-0.03622,-0.06355,0.08035,0.04682,-0.01561,-0.03412,-0.05698,0.01624,-0.00785,-0.07143,0.0253,0.10319,0.03689,-0.04963,0.03237,0.03111,-0.02727,-0.02437,-0.0475,0.04486,-0.08649,0.06808,0.01556,-0.02459,-0.02006,0.0242,-0.08448,0.01136,0.06437,0.06062,0.02724,-0.01414,0.11289,-0.04316,0.04466,-0.06028,-0.01603,-0.01688,0.03217,0.05943,0.03815,0.02142,-0.06695,-0.06564,-0.07482,-0.01767,0.04259,0.0869,-0.00219,-0.00987,0.0086,0.09774,0.06424,0.03106,0.04695,-0.05228,-0.04557,-0.02936,0.0538,0.02566,-0.05128,-0.01359,-0.00417,0.06205,-0.05813,0.01635,-0.07636,-0.09429,-0.06174,-0.04929,0.03827,-0.04922,0.03987,0.07067,-0.05026,0.05163,-0.01496,0.0899,0.01459,-0.06051,-0.0858,-0.05097,-0.06921,-0.00008,0.08113,0.0659,-0.07063,0.04802,-0.02044,0.0207,-0.1161,-0.03855,0.04761,0.05486,-0.03315,0.0669,-0.03954,-0.04303,0.03659,0.0349,0.01362,-0.08758,-0.05463,0.00018,-0.08527,0.02461,-0.10561,0.09739,-0.02014,-0.06326,-0.06844,-0.04064,-0.04239,0.03349,0.06621,0.01656,0.07469,-0.01008,0.03256,0.05021,0.03943,0.029,0.06108,-0.05012,-0.03186,-0.00157,-0.03644,-0.0061,0.08268,-0.04151,0.02136,0.04216,0.03092,0.11891,-0.03108,0.05741,-0.03024,0.03789,-0.043,0.07585,0.01549,0.07157,-0.00284,-0.11075,-0.07059,0.06334,0.06863,-0.05189,-0.05326,-0.04205,-0.04095,-0.05536,-0.06325,0.0228,0.02325,-0.09451,-0.00418,-0.05859,0.10822,-0.01961,0.10948,0.00377,0.06634,-0.03386,0.03388,0.07572,0.01819,-0.00657,-0.05379,-0.08255,-0.06043,-0.04593,-0.04621,-0.07662,0.00986,0.01467,-0.02463,0.0083,0.04973,-0.05047,-0.03608,-0.01065,0.08432,-0.02739,0.03709,0.04021,0.05983,0.0023,-0.05516,0.02333,0.04542,0.05871,0.00198,-0.07324,0.03443,-0.0593,0.02247,0.06836,-0.0529,-0.04516,0.00799,-0.0093,-0.01993,-0.01671,0.14184,-0.02983,0.0452,0.05807,-0.04085,0.05864,-0.07178,-0.00066,0.04273,0.00084,-0.08118,-0.01913,0.07715,-0.03785,-0.0079,-0.08245,-0.11083,-0.01896,-0.05284,0.01711,0.02717,0.02857,-0.03009,-0.05555,-0.02932,0.04712,-0.01536,0.04892,-0.02427,-0.01083,-0.00421,-0.0632,0.021,0.069,-0.0985,-0.06126,-0.03941,0.02121,0.0322,0.02842,0.02279,-0.0516,0.00359,0.04153,-0.04853,0.05882,0.04425,0.06132,-0.02325,-0.06615,-0.02628,-0.0418,-0.0088,-0.06138,-0.00552,0.02278,-0.03559,-0.0514,-0.05551,0.0119,0.0407,-0.06488,-0.04216,0.09105,0.06091,0.04588,0.07877,0.0898,-0.00154,-0.00379,0.07837,-0.01933,-0.04627,-0.06369,-0.02808,0.04873,-0.03446,0.06797,0.04817,0.03711,0.07427,-0.05283,0.06098,-0.00015,-0.06554,-0.01119,0.01526,-0.0438,0.02961,0.03285,0.03185,0.03931,0.02295,0.04048,0.00445,-0.03725,0.00999,0.03982,0.10251,-0.02809,0.03733,-0.07985,-0.0094,-0.06802,-0.08474,0.01868,-0.05308,0.05022,0.04582,-0.07184,-0.02874,0.02035,-0.01008,0.06519,0.01192,-0.06941,0.04181,-0.02249,-0.07282,0.01331,0.0727,-0.07387,-0.02899,0.01747,0.00941,-0.08266,0.06226,-0.0531,-0.05035,-0.00712,-0.03205,-0.06136,-0.01453,-0.01799,-0.09176,0.03128,0.03649,-0.03441,0.0465,-0.06582,-0.01693,0.08548,0.05182,-0.02979,0.01504,0.03094,0.01326,0.04483,0.04099,-0.0172,-0.01722,0.01595,-0.03758,0.04502,0.07114,-0.02028,-0.00716,-0.00915,-0.06634,-0.02968,0.06598,-0.05983,-0.09946,0.04861,0.03831,0.0475,0.04979]},{"id":"project-2#1","docId":"project-2","title":"PugliaHack 2026","category":"project","tags":["Hackathon","React 19","TailwindCSS","Supabase","Agri-tourism"],"text":"Nell'ambito dell'hackathon PugliaHack 2026 (finestra di sviluppo: 2 ore, piattaforma Lovable), ho sviluppato in autonomia TerraNode, una piattaforma per lo smart agri-tourism pugliese. La soluzione prevede ruoli distinti per turisti, agricoltori e Pubblica Amministrazione, includendo prenotazione di esperienze, gamification con crediti, tracciamento della CO2 e dashboard con KPI in tempo reale. Ruolo di Vito: Solo Developer. Periodo: Maggio 2026.","vec":[0.02176,-0.02348,-0.02042,-0.03642,0.06539,-0.08243,0.01999,0.05797,0.01552,0.01033,0.03103,0.03303,0.02719,-0.0454,-0.05378,0.06574,0.06162,-0.01886,-0.04957,-0.05861,0.03426,0.00038,-0.08786,0.03363,0.09692,0.03693,-0.06043,0.01714,0.03544,-0.02249,-0.02748,-0.03605,0.03129,-0.10591,0.06925,0.01486,-0.03462,-0.02111,0.02666,-0.08215,-0.01679,0.04404,0.05125,0.01785,0.00567,0.09498,-0.05347,0.03828,-0.03596,-0.00706,-0.02472,0.04359,0.05682,0.02143,0.01106,-0.05475,-0.06737,-0.06883,-0.01841,0.03789,0.0858,0.01544,-0.00389,0.0126,0.07536,0.0573,0.01974,0.02566,-0.05165,-0.04999,-0.03414,0.03702,0.02887,-0.03781,-0.01315,0.00906,0.07315,-0.05451,0.02028,-0.07493,-0.09134,-0.0719,-0.05896,0.04615,-0.05103,0.03156,0.08025,-0.06992,0.07434,-0.02789,0.08553,0.04177,-0.04993,-0.10165,-0.05013,-0.05454,0.00634,0.09053,0.07215,-0.06054,0.03833,-0.03931,0.03027,-0.13183,-0.03069,0.03651,0.06338,-0.03449,0.06661,-0.05971,-0.03677,0.05381,0.0341,0.01665,-0.09435,-0.0458,-0.01782,-0.0749,0.02232,-0.10521,0.09124,-0.02894,-0.05162,-0.07118,-0.03495,-0.04135,0.02445,0.08236,0.02065,0.05549,-0.0107,0.03437,0.04952,0.02623,0.02956,0.04985,-0.03799,-0.04136,-0.00684,-0.03464,-0.00612,0.07558,-0.04088,0.01493,0.03045,0.02519,0.1006,-0.02586,0.05223,-0.03381,0.05551,-0.05445,0.06985,0.00477,0.07574,-0.01029,-0.10983,-0.0843,0.05567,0.08897,-0.05037,-0.03921,-0.04104,-0.03441,-0.06004,-0.05505,0.01748,0.0261,-0.08015,0.00085,-0.04821,0.11142,-0.01609,0.13155,0.00721,0.06872,-0.03713,0.03931,0.08066,0.03407,0.00277,-0.04613,-0.09573,-0.06495,-0.03745,-0.0447,-0.07428,0.01236,0.01376,-0.04182,-0.00572,0.07984,-0.04781,-0.03162,-0.01291,0.08073,-0.03582,0.0466,0.04353,0.05955,0.00537,-0.05198,0.028,0.04765,0.04912,-0.00047,-0.07117,0.01776,-0.05693,0.03274,0.07707,-0.05683,-0.06008,0.02153,0.01213,-0.00649,-0.01303,0.12937,-0.02584,0.04191,0.06058,-0.03035,0.05724,-0.0742,0.01514,0.04373,0.01413,-0.07367,-0.02261,0.08343,-0.03823,-0.00766,-0.08385,-0.10382,-0.01732,-0.04214,0.02462,0.03417,0.01159,-0.03447,-0.06603,-0.01834,0.05055,-0.01029,0.07423,-0.02409,-0.01927,0.00628,-0.07053,0.0239,0.07081,-0.10081,-0.05761,-0.04926,0.0186,0.04316,0.02032,0.01269,-0.06706,-0.00263,0.03987,-0.04472,0.05525,0.02839,0.04834,-0.02266,-0.0552,-0.02872,-0.04086,-0.01405,-0.06661,0.00318,0.01792,-0.03063,-0.04942,-0.05126,0.00389,0.03884,-0.07847,-0.05685,0.09512,0.05074,0.04715,0.07121,0.08717,-0.02669,0.00109,0.09059,-0.01466,-0.06208,-0.05469,-0.02976,0.0531,-0.04525,0.05029,0.05496,0.03227,0.07546,-0.0465,0.06116,-0.00013,-0.04314,-0.00935,0.02042,-0.04606,0.01009,0.03265,0.01982,0.03121,0.03971,0.04897,0.00855,-0.03024,0.01939,0.03587,0.09295,-0.01577,0.03685,-0.05936,-0.01991,-0.06093,-0.08324,-0.00091,-0.0513,0.0469,0.05453,-0.07358,-0.01885,0.02345,-0.01697,0.06488,0.00731,-0.08012,0.05367,-0.01822,-0.05931,-0.0002,0.04555,-0.05443,-0.02564,0.00622,0.02031,-0.06214,0.05724,-0.04437,-0.05261,0.01058,-0.01247,-0.08234,-0.0042,-0.01275,-0.09923,0.03278,0.02256,-0.03492,0.04588,-0.06861,-0.00524,0.08488,0.04939,-0.02252,0.0087,0.03102,0.0265,0.0601,0.02872,-0.01634,-0.01877,0.03609,-0.03679,0.03854,0.07054,0.00077,-0.00295,-0.03003,-0.08657,-0.02689,0.04899,-0.04378,-0.09207,0.06806,0.02414,0.06509,0.06672]},{"id":"project-2#2","docId":"project-2","title":"PugliaHack 2026","category":"project","tags":["Hackathon","React 19","TailwindCSS","Supabase","Agri-tourism"],"text":"Periodo: Maggio 2026. Stack: React 19, TanStack Query, TailwindCSS, Supabase (PostgreSQL). Risultati: Tempo dev.: 2 ore (Finestra di sviluppo estremamente ridotta.); Ruoli: 3 (Turisti, Agricoltori, PA.); Stack: Modern Web (React 19 + Supabase.).","vec":[0.02292,0.00189,-0.02563,-0.04902,0.05724,-0.10105,0.00815,0.02323,0.04435,0.01629,0.03511,0.01343,0.03331,-0.05068,-0.02829,0.08198,0.07408,-0.0437,-0.04424,-0.07142,0.00372,0.02773,-0.056,0.00381,0.1076,0.034,-0.04909,0.01354,0.05403,-0.01364,-0.0459,-0.01639,0.04115,-0.09266,0.02855,0.03002,-0.03196,-0.0378,0.06185,-0.041,-0.0056,0.02508,0.04638,0.02235,0.0294,0.08089,-0.02894,0.03296,-0.03862,-0.0126,-0.00092,0.05507,0.07587,0.04198,0.04224,-0.04255,-0.04845,-0.08838,-0.02788,0.04364,0.08925,-0.00574,0.00511,0.04407,0.10889,0.04657,0.00724,0.04855,-0.06459,-0.03779,-0.00502,0.04448,0.00655,-0.05525,-0.03482,0.02134,0.09996,-0.03538,0.01075,-0.07907,-0.06174,-0.07286,-0.05152,0.03641,-0.0712,0.03773,0.04613,-0.06774,0.08086,-0.02843,0.07202,0.06587,-0.03752,-0.04682,-0.02869,-0.05405,0.00857,0.0752,0.04528,-0.02398,0.04334,-0.03053,0.06142,-0.14226,-0.03127,0.04258,0.02339,-0.05914,0.10923,-0.04571,-0.07424,0.07194,0.02831,0.02263,-0.06378,-0.03932,-0.01182,-0.08349,0.00961,-0.05241,0.04511,-0.03381,-0.08085,-0.0392,-0.05046,-0.03543,0.04009,0.05947,-0.00362,0.02355,0.00022,-0.00009,0.02429,0.04539,0.02185,0.04061,-0.07331,-0.03508,-0.01234,-0.05857,-0.02265,0.07791,-0.06426,0.00831,0.02234,0.04508,0.0992,-0.02448,0.06943,-0.05918,0.06186,-0.05665,0.08053,0.00108,0.05682,-0.03776,-0.08404,-0.06284,0.06549,0.07543,-0.05704,-0.03705,-0.05518,-0.04623,-0.06733,-0.0541,0.03419,0.01091,-0.04425,-0.02874,-0.04278,0.10865,-0.02851,0.14871,0.01426,0.05764,-0.0542,0.06366,0.08846,0.03747,-0.00916,-0.04304,-0.05972,-0.08067,-0.04868,-0.0287,-0.07435,0.01159,0.01303,-0.01282,0.00314,0.07131,-0.02973,-0.04086,-0.03244,0.07713,-0.02578,0.05228,0.0478,0.05735,0.02712,-0.05628,0.02646,0.01269,0.05637,-0.02227,-0.05539,0.003,-0.05008,0.05086,0.06424,-0.05311,-0.06528,0.03532,0.02294,0,-0.04121,0.11261,-0.01855,0.07916,0.04159,-0.02126,0.05292,-0.0493,-0.02002,0.04081,-0.00419,-0.06838,-0.05434,0.0636,-0.00637,-0.02388,-0.07432,-0.08699,-0.01018,-0.05102,0.02397,0.02051,-0.00066,-0.04679,-0.05416,0.0241,0.03208,-0.01225,0.05915,-0.02545,0.01566,0.02384,-0.06036,0.03284,0.05511,-0.08529,-0.0914,-0.06648,-0.00476,0.04374,0.03149,0.04424,-0.04783,0.04002,0.01839,-0.02678,0.08672,0.04967,0.04847,-0.06339,-0.02276,-0.04116,-0.02161,-0.05002,-0.07452,0.01126,0.02757,-0.06671,-0.06914,-0.03084,0.01733,0.09608,-0.08903,-0.0716,0.07505,0.03268,0.03654,0.04545,0.05077,-0.03068,-0.00807,0.07741,-0.02196,-0.08539,-0.03393,-0.03446,0.07236,-0.07483,0.06411,0.04597,0.01529,0.04024,-0.07064,0.05165,-0.00501,-0.04639,0.01977,0.04979,-0.08292,0.01012,0.00521,0.0316,0.05477,0.04507,0.07079,0.00344,-0.06091,-0.02852,0.06062,0.09771,-0.02063,0.08243,-0.04909,-0.05107,-0.05369,-0.09463,0.00577,-0.05802,0.01807,0.06843,-0.06436,-0.04962,0.00758,-0.01749,0.065,-0.01899,-0.06357,0.07685,-0.04533,-0.05893,-0.01196,0.03022,-0.05819,-0.03362,0.01699,0.0326,-0.06496,0.03762,-0.00729,-0.05248,0.02226,0.02833,-0.05673,0.03108,0.02044,-0.08926,0.03026,0.01807,-0.02938,0.05068,-0.06218,-0.03921,0.05348,0.01623,-0.01784,-0.03278,0.02698,0.01736,0.06332,0.00741,-0.03553,-0.02852,0.03694,-0.04725,0.06746,0.06359,-0.02399,-0.00464,-0.02548,-0.04311,-0.02489,0.03678,-0.04484,-0.08423,0.06043,0.02619,0.05267,0.08079]},{"id":"project-3#0","docId":"project-3","title":"Hackathon \"Space Edition\"","category":"project","tags":["Hackathon","Space Tech","Agri-Tech","Innovation"],"text":"2° Classificato. Collaborazione all'ideazione di un progetto per una costellazione di piccoli satelliti dedicati all'agricoltura. The Pulse: Monitoraggio agricolo globale satellitare. Hackathon organizzato da Talent Garden e Leonardo a Milano. Mi sono classificato al 2° posto collaborando all'ideazione di \"The Pulse\", un progetto per una costellazione di piccoli satelliti dedicata al monitoraggio agricolo globale, integrando logiche di telerilevamento e AI.","vec":[0.05155,0.00081,-0.03661,-0.06903,0.07703,-0.04451,0.01146,0.04957,0.00679,-0.00509,0.05783,0.01902,0.03779,-0.00511,-0.01662,0.07918,0.06431,-0.01248,-0.04053,-0.07737,0.01682,0.01659,-0.05998,0.04241,0.06824,0.04514,-0.03515,0.03134,0.01974,-0.01671,-0.02881,-0.04327,0.05015,-0.06379,0.07461,0.02937,-0.02821,-0.07761,0.05084,-0.06031,-0.00733,0.03249,0.03353,0.04562,0.04519,0.08211,-0.0636,0.07804,-0.06974,0.01316,-0.05089,0.05537,0.07163,0.04743,0.0609,-0.04399,-0.06119,-0.10386,-0.05428,0.01935,0.04604,0.0089,0.02657,0.0649,0.07903,0.05091,0.043,0.07995,-0.05815,-0.05418,-0.06747,0.0522,0.01572,-0.07038,0.05587,0.02525,0.05438,-0.0806,0.02155,-0.05424,-0.08343,-0.0675,-0.05438,0.0485,-0.0668,0.03767,0.089,-0.08382,0.0565,-0.05103,0.05528,-0.01153,-0.05501,-0.07956,-0.08779,-0.06518,-0.00377,0.08248,0.03893,-0.04413,0.04194,-0.03828,0.01783,-0.0694,-0.03782,0.02069,0.07292,-0.0472,0.05229,-0.0436,-0.03177,0.03214,0.06056,0.01203,-0.0635,-0.05853,-0.02203,-0.11824,0.06041,-0.05808,0.09672,-0.06444,-0.04203,-0.07243,-0.08049,-0.01438,-0.00611,0.07512,0.03369,0.03865,-0.01071,0.04832,0.00039,0.03267,0.04161,0.07184,-0.05075,-0.00834,0.0089,-0.06054,-0.05608,0.09393,-0.02047,0.03408,0.05436,0.04351,0.09554,-0.03654,0.05239,-0.02084,0.02948,-0.0557,0.04957,0.02979,0.046,-0.00367,-0.06889,-0.03939,0.07233,0.09514,-0.05354,-0.03695,-0.04885,-0.04342,-0.06485,-0.0842,-0.02007,0.03215,-0.0912,-0.01805,-0.0513,0.08976,-0.03951,0.10645,0.01727,0.06094,-0.03549,0.02456,0.07728,0.01769,-0.01335,-0.02877,-0.096,-0.02688,-0.03516,-0.07346,-0.01749,0.00852,0.00257,-0.04004,-0.00849,0.06906,-0.0277,-0.08345,-0.04503,0.09412,-0.01851,0.01336,0.05345,0.07749,0.00228,-0.08626,0.02548,0.05954,0.07519,0.00433,-0.05045,0.00813,-0.05789,0.03398,0.05022,-0.04367,-0.03208,0.0399,-0.01335,-0.02607,-0.02995,0.09464,-0.03631,0.01703,0.0794,-0.0231,0.09536,-0.06224,0.00865,0.07984,0.00759,-0.07016,-0.00037,0.06427,-0.02796,-0.02463,-0.07574,-0.0781,-0.02309,-0.05508,0.01425,0.00271,0.01156,-0.03479,-0.04839,-0.02456,0.01897,-0.05382,0.05201,-0.05268,-0.00062,0.01505,-0.07551,0.04089,0.06253,-0.10732,-0.04435,-0.06055,-0.01384,0.06332,0.03425,0.02058,-0.09305,0.03158,0.023,-0.08051,0.08629,0.06728,0.0497,0.01069,-0.06715,-0.0033,-0.03844,-0.02058,-0.04788,0.01286,-0.00331,-0.0307,-0.01448,-0.04809,0.03998,0.06548,-0.03247,-0.00611,0.03897,0.04043,0.07246,0.05239,0.08581,-0.0129,-0.05336,0.08523,-0.01536,0.00091,-0.06743,-0.0229,0.00398,-0.02749,0.08586,0.03223,0.02741,0.0622,-0.04591,0.08213,0.009,-0.03816,0.01011,0.03299,-0.05124,0.04715,0.01045,-0.00728,0.03072,0.05054,0.05043,0.04395,-0.07489,-0.01725,0.0513,0.06052,-0.02074,0.01397,-0.05664,-0.03732,-0.09656,-0.0766,0.00444,-0.04436,-0.01997,0.05132,-0.05102,-0.06131,-0.00792,0.00588,0.03821,-0.0218,-0.05561,0.02667,-0.04152,-0.03458,-0.01664,0.08068,-0.06288,-0.01762,0.05952,0.02222,-0.06792,0.06607,-0.02455,-0.04852,0.02443,-0.05418,-0.05858,0.01678,0.02736,-0.07795,0.04082,0.04223,-0.06239,0.05101,-0.079,-0.00869,0.04081,0.0336,-0.06055,-0.07612,0.04198,0.01089,0.05586,0.03473,-0.02293,-0.03881,0.01754,-0.0059,0.01179,0.04771,-0.00364,-0.03622,-0.0216,-0.01191,-0.02574,0.02246,-0.03468,-0.07078,0.05083,0.03449,0.07193,0.04687]},{"id":"project-3#1","docId":"project-3","title":"Hackathon \"Space Edition\"","category":"project","tags":["Hackathon","Space Tech","Agri-Tech","Innovation"],"text":"Mi sono classificato al 2° posto collaborando all'ideazione di \"The Pulse\", un progetto per una costellazione di piccoli satelliti dedicata al monitoraggio agricolo globale, integrando logiche di telerilevamento e AI. Ruolo di Vito: Team Member. Periodo: Maggio 2026. Stack: Ideation, Team Collaboration, Space/Agri Tech. Risultati: Piazzamento: 2° Posto (Hackathon nazionale Talent Garden x Leonardo.); Focus: Satelliti (Monitoraggio agricolo globale.).","vec":[0.04988,0.00057,-0.03833,-0.05064,0.09211,-0.0631,-0.00529,0.0411,0.04892,0.00241,0.03799,-0.013,0.04286,-0.02835,-0.00232,0.05439,0.06986,-0.01664,-0.05073,-0.07368,0.02834,0.02185,-0.06386,0.02993,0.07564,0.06006,-0.06521,0.01622,0.03271,-0.0287,-0.02472,-0.02912,0.04644,-0.0728,0.07134,0.02208,-0.04469,-0.06869,0.02531,-0.06556,-0.01281,0.02054,0.02399,0.03308,0.06433,0.09069,-0.06824,0.07082,-0.05848,-0.01209,-0.04852,0.04866,0.06294,0.03177,0.02269,-0.0172,-0.05979,-0.07701,-0.03913,0.04284,0.04606,0.02395,0.00158,0.0425,0.07065,0.05776,0.0336,0.04657,-0.06657,-0.03108,-0.07307,0.04144,0.02626,-0.04416,0.03033,0.0476,0.08983,-0.06989,0.041,-0.05302,-0.07605,-0.0574,-0.07238,0.03124,-0.0548,0.01785,0.08703,-0.09226,0.09086,-0.04475,0.06204,0.02371,-0.05741,-0.07343,-0.06775,-0.05126,0.00712,0.07707,0.02854,-0.02049,0.04188,-0.03466,0.03234,-0.10114,-0.04178,0.0241,0.05292,-0.04318,0.05381,-0.03539,-0.00559,0.05855,0.03931,0.01157,-0.07102,-0.05915,-0.01968,-0.11891,0.03869,-0.06991,0.09753,-0.06006,-0.02557,-0.07686,-0.08101,-0.03326,0.00459,0.0978,0.0293,0.04452,-0.00211,0.04924,-0.00154,0.04464,0.03594,0.05649,-0.04529,-0.00644,0.01196,-0.02893,-0.04912,0.07506,-0.06003,0.01272,0.04122,0.03668,0.07741,-0.02779,0.05701,-0.05286,0.02502,-0.06937,0.05537,0.01921,0.06414,-0.0272,-0.06179,-0.0538,0.05921,0.12511,-0.0498,-0.0506,-0.05436,-0.04286,-0.05223,-0.08779,-0.00767,0.03834,-0.06705,0.01606,-0.06306,0.10132,-0.02568,0.10488,0.01371,0.06624,-0.04338,0.01566,0.10268,0.0397,-0.02905,-0.00871,-0.10723,-0.0431,-0.05224,-0.06949,-0.04533,0.00321,-0.00245,-0.04245,0.01071,0.08355,-0.03769,-0.06643,-0.03653,0.0845,-0.0209,0.04112,0.06374,0.07417,-0.01825,-0.07759,0.01515,0.0435,0.07191,-0.01411,-0.03577,-0.00921,-0.03972,0.03505,0.03799,-0.04659,-0.06513,0.02083,0.00528,0.00828,-0.01775,0.10264,-0.03586,0.02774,0.08573,-0.01092,0.09871,-0.06723,0.00355,0.08017,-0.00497,-0.05816,-0.03031,0.06115,-0.0215,0.00842,-0.08969,-0.07183,-0.00622,-0.03852,0.01928,0.00856,0.04144,-0.04133,-0.06528,-0.01142,0.00112,-0.05193,0.06689,-0.01379,-0.00846,0.03237,-0.07484,0.04644,0.04682,-0.10945,-0.0542,-0.09568,-0.0137,0.06101,0.0297,0.02008,-0.11218,0.02535,0.0114,-0.04303,0.07662,0.04644,0.04739,-0.00268,-0.06524,-0.002,-0.03763,-0.01306,-0.05478,0.01001,0.01053,-0.0395,-0.00578,-0.05392,0.04154,0.06265,-0.05857,-0.019,0.05243,0.01405,0.06487,0.03775,0.09226,-0.03046,-0.03247,0.07438,-0.02844,-0.05397,-0.06168,-0.03645,0.02189,-0.04139,0.07357,0.04616,0.00526,0.04761,-0.05917,0.06637,-0.02254,-0.02183,0.03247,0.0268,-0.03419,0.03888,0.03393,0.01222,0.04622,0.05419,0.05653,0.03505,-0.06999,0.00123,0.05791,0.06922,-0.00377,0.03732,-0.06744,-0.05388,-0.09242,-0.05866,-0.02338,-0.03603,0.0013,0.06574,-0.0499,-0.05294,0.00588,-0.00273,0.04109,-0.04368,-0.06303,0.04587,-0.04234,-0.04846,0.00146,0.05255,-0.0647,-0.02728,0.04604,0.02385,-0.06227,0.06766,-0.01417,-0.04354,0.03971,-0.03956,-0.05968,0.03206,0.01196,-0.09402,0.03012,0.03118,-0.05176,0.0703,-0.06907,-0.00784,0.03511,0.03326,-0.0406,-0.048,0.04589,0.02693,0.05642,0.04034,0.00855,-0.05113,0.03984,-0.01603,0.00298,0.06124,-0.0079,-0.02188,-0.0563,-0.02692,-0.02105,0.00483,-0.04141,-0.07297,0.05246,0.04004,0.0824,0.04849]},{"id":"project-4#0","docId":"project-4","title":"LACAM-SWAP · Orchestratore Multi-Agente","category":"project","tags":["LangGraph","Multi-Agent","Recommender Systems","RAG","Thesis"],"text":"Progetto di tesi: architettura multi-agente LLM orchestrata con LangGraph per raccomandazioni. Include RAG ibrido (BM25 + FAISS). Ottimizzazione Multi-Metrica nei Sistemi di Raccomandazione. Progetto di tesi sviluppato durante il tirocinio curriculare (marzo–giugno 2025) presso il laboratorio LACAM-SWAP dell'Università di Bari.","vec":[0.03623,0.00119,-0.06237,-0.07142,0.08064,-0.03984,0.06497,0.05708,0.0077,-0.00463,0.07741,0.00863,0.06781,-0.00771,0.00833,0.04952,0.08185,-0.06125,-0.0605,-0.06417,0.02188,0.0095,-0.05195,0.0149,0.07055,0.03638,-0.02626,-0.00029,0.0521,-0.01124,-0.03681,-0.04861,0.07782,-0.03143,0.04257,0.0367,-0.02614,-0.05717,0.05077,-0.07096,0.02048,0.03342,0.05275,0.08432,0.0194,0.06319,-0.02433,0.02641,-0.00936,-0.039,-0.04929,0.05902,0.08953,0.05964,0.05476,-0.05912,-0.06194,-0.1114,-0.0501,0.02645,0.04706,-0.02093,-0.01015,0.02999,0.07707,0.08659,0.04199,0.04787,-0.08623,-0.09151,-0.08924,0.0441,-0.04568,-0.10038,-0.00609,0.02971,0.09821,-0.07006,0.04482,-0.00525,-0.06946,-0.02311,-0.05004,0.0324,-0.03541,0.07755,0.06633,-0.08339,-0.00386,-0.00703,0.02345,0.05469,-0.05292,-0.06244,-0.04827,-0.08052,-0.02886,0.10471,0.07655,-0.06708,0.01405,-0.06961,0.01988,-0.07887,-0.04434,0.00116,0.03417,-0.05922,0.03672,-0.03727,-0.01232,0.05067,0.04089,0.04284,-0.03002,-0.07091,-0.03839,-0.0046,0.05467,-0.04709,0.02242,-0.02915,-0.07258,-0.07417,-0.03422,-0.02428,0.00687,0.05627,0.03857,0.02734,-0.01257,0.01565,0.02586,0.07592,0.07895,0.07455,-0.059,0.01894,-0.04499,-0.01817,-0.06608,0.04456,-0.09491,0.04132,0.05416,0.03294,0.1096,-0.04611,0.06417,-0.02862,0.0288,-0.00672,0.07677,0.05781,0.02962,-0.01433,-0.07081,-0.05718,0.05894,0.05978,-0.05036,-0.04669,-0.04804,-0.04423,-0.02762,-0.01874,0.03043,0.04703,-0.01465,-0.03329,-0.05233,0.10322,-0.00412,0.08317,0.00972,0.05207,-0.07888,0.02895,0.10925,0.07133,-0.04627,-0.00359,-0.09433,-0.06365,-0.07999,-0.0699,-0.05457,-0.00341,0.00606,-0.06096,-0.01012,0.03795,-0.06835,-0.05315,-0.0084,0.06711,-0.02565,0.02171,0.02873,0.05529,0.01586,-0.07362,-0.03272,0.04018,0.05308,0.06251,-0.07199,0.01273,-0.04696,0.02391,0.00287,-0.03007,-0.02168,0.03246,-0.0168,-0.02236,-0.00766,0.04691,-0.01352,0.02207,0.0626,-0.04197,0.05297,-0.04196,-0.00774,0.02722,0.05434,-0.06191,-0.06758,0.02743,-0.03937,-0.03634,-0.09489,-0.0612,-0.01997,-0.05417,0.01911,0.05727,0.01084,-0.04574,-0.06911,-0.01556,-0.01933,-0.04791,0.02479,-0.07315,-0.04091,0.02946,-0.05805,0.09275,0.0585,-0.05321,-0.04606,-0.02794,0.00417,0.02151,0.0489,0.01769,-0.04125,0.04422,0.06172,-0.04747,0.06975,0.00932,0.06368,0.04953,-0.08557,-0.02415,-0.02052,-0.05573,0.02122,0.04076,0.00577,-0.01638,-0.04157,-0.07674,0.00606,0.1063,-0.03843,-0.04623,0.05015,0.04424,0.05329,0.04837,0.03331,0.02449,-0.02336,0.06018,-0.03099,-0.02178,-0.03631,-0.03456,0.08452,-0.02697,0.09127,0.06502,0.02171,0.04865,-0.08358,0.04298,0.01186,-0.0007,0.02074,0.03248,-0.04683,0.05842,0.00301,0.01053,0.05422,0.05193,0.07057,0.02498,-0.07797,-0.00649,0.04953,0.04698,0.03388,0.04253,-0.09576,-0.05958,-0.05826,-0.07452,-0.02627,-0.06086,0.06438,0.05402,-0.09022,-0.04701,0.0472,-0.04493,0.04815,-0.01996,-0.06496,0.04729,-0.04398,-0.04958,-0.00668,0.06681,-0.05146,-0.03359,0.04264,0.01495,-0.09705,0.06155,-0.03087,-0.0576,0.04316,-0.01557,0.00662,-0.00083,0.03888,-0.13469,0.0596,0.04064,-0.05379,0.04593,-0.07579,-0.01222,0.06913,0.05282,-0.04373,-0.07343,0.01783,0.02709,0.03411,0.0082,-0.02232,-0.0196,-0.01368,-0.03207,0.05605,0.03877,-0.03217,-0.0113,-0.01337,-0.03884,-0.02725,0.05449,-0.04321,-0.08211,0.02271,0.01795,0.04005,0.06476]},{"id":"project-4#1","docId":"project-4","title":"LACAM-SWAP · Orchestratore Multi-Agente","category":"project","tags":["LangGraph","Multi-Agent","Recommender Systems","RAG","Thesis"],"text":"Progetto di tesi sviluppato durante il tirocinio curriculare (marzo–giugno 2025) presso il laboratorio LACAM-SWAP dell'Università di Bari. Ho implementato un'architettura multi-agente basata su LLM (Llama 3.2 3B Instruct), orchestrata con LangGraph, che coordina agenti specializzati su precisione e copertura del catalogo tramite un agente aggregatore. L'architettura include anche un sistema RAG ibrido (BM25 + FAISS). Ruolo di Vito: AI Research Intern.","vec":[0.02988,-0.02373,-0.07376,-0.06418,0.08954,-0.04623,0.06078,0.0599,0.00857,0.00831,0.06002,0.012,0.06059,0.00233,0.02585,0.05478,0.09004,-0.05568,-0.06094,-0.05926,0.00102,0.01546,-0.04893,0.00311,0.06676,0.043,-0.02202,0.00738,0.06876,-0.03262,-0.03126,-0.05031,0.06284,-0.03654,0.02891,0.04695,-0.03539,-0.05133,0.06049,-0.06892,0.01398,0.03893,0.05537,0.08261,0.01091,0.05263,-0.03078,0.03242,-0.03738,-0.03272,-0.02055,0.05695,0.09347,0.06286,0.05879,-0.04772,-0.06409,-0.11208,-0.03231,0.02508,0.04907,-0.01546,-0.0215,0.04161,0.06922,0.08043,0.04011,0.0452,-0.10794,-0.0832,-0.09928,0.03251,-0.03045,-0.10037,-0.00697,0.02522,0.08359,-0.0632,0.0557,-0.0199,-0.05738,-0.02364,-0.04156,0.04066,-0.03331,0.07381,0.06954,-0.0835,0.01603,-0.03218,0.01841,0.06003,-0.05138,-0.0809,-0.04596,-0.07107,-0.02431,0.08915,0.07715,-0.06548,0.00975,-0.07196,0.03784,-0.08031,-0.02468,0.0064,0.03948,-0.07952,0.04359,-0.04676,-0.01663,0.06349,0.03783,0.04757,-0.04427,-0.0812,-0.02448,-0.01428,0.04852,-0.03701,0.01645,-0.04769,-0.07237,-0.06924,-0.0194,-0.01596,0.00175,0.07126,0.03747,0.0119,0.00188,0.02213,0.01222,0.06599,0.07904,0.07108,-0.04464,0.02994,-0.05276,-0.03106,-0.0559,0.02604,-0.07753,0.02536,0.06137,0.04172,0.09127,-0.05374,0.06193,-0.01746,0.03258,-0.01174,0.06591,0.06403,0.02145,-0.03662,-0.05371,-0.06474,0.04882,0.05977,-0.06326,-0.05565,-0.05152,-0.05897,-0.02194,-0.00741,0.01219,0.07443,-0.0152,-0.0346,-0.05949,0.10206,-0.00014,0.08682,-0.00899,0.05427,-0.08205,0.01837,0.11478,0.06284,-0.04379,-0.01133,-0.11044,-0.06848,-0.0918,-0.06062,-0.05202,-0.00377,-0.02155,-0.04812,-0.0107,0.02288,-0.06721,-0.0576,-0.01885,0.0618,-0.02211,0.02095,0.03771,0.06827,0.01348,-0.05904,-0.04371,0.03738,0.05448,0.05746,-0.07595,0.01937,-0.03409,0.00918,0.00613,-0.0274,-0.0198,0.04523,-0.00915,-0.02473,0.01149,0.04781,-0.02944,0.02407,0.05879,-0.02654,0.04883,-0.03259,-0.00066,0.01652,0.03856,-0.05688,-0.06449,0.041,-0.04825,-0.03216,-0.08786,-0.07623,-0.01381,-0.0499,0.03366,0.07225,0.00821,-0.05048,-0.0564,-0.02368,-0.02447,-0.01492,0.02012,-0.05879,-0.03019,0.00555,-0.05142,0.11389,0.04826,-0.07734,-0.03127,-0.01476,-0.00733,0.03698,0.03696,0.03447,-0.04001,0.03042,0.05752,-0.0331,0.06438,0.00338,0.04421,0.03975,-0.09163,-0.02605,-0.00415,-0.07601,0.02065,0.03962,0.00718,-0.00587,-0.0415,-0.07317,0.00893,0.12497,-0.04972,-0.04681,0.06074,0.04675,0.0524,0.06765,0.0488,0.0091,-0.02436,0.06493,-0.02528,-0.03762,-0.02231,-0.03487,0.09295,-0.03713,0.08455,0.06,0.02502,0.05685,-0.08089,0.04214,0.00775,0.00824,0.013,0.01972,-0.06008,0.04071,0.00529,0.00758,0.03026,0.04865,0.07382,0.02724,-0.05582,0.00245,0.04539,0.04292,0.03161,0.04607,-0.06966,-0.07064,-0.06756,-0.07115,-0.0425,-0.05173,0.05751,0.0675,-0.08061,-0.04725,0.04014,-0.03657,0.04528,-0.01837,-0.06089,0.05122,-0.06077,-0.0372,-0.00793,0.06367,-0.05001,-0.04617,0.04615,0.01334,-0.12046,0.05767,-0.02624,-0.0628,0.05439,-0.02264,-0.0042,-0.01422,0.04437,-0.12032,0.06741,0.03972,-0.04614,0.03516,-0.08428,-0.01145,0.05852,0.06302,-0.03613,-0.07942,0.02674,0.03468,0.0367,0.01387,-0.01106,-0.02107,-0.00686,-0.02011,0.06021,0.03997,-0.02696,-0.02423,-0.00775,-0.02717,-0.01441,0.04404,-0.039,-0.08243,0.04281,0.0233,0.06153,0.06064]},{"id":"project-4#2","docId":"project-4","title":"LACAM-SWAP · Orchestratore Multi-Agente","category":"project","tags":["LangGraph","Multi-Agent","Recommender Systems","RAG","Thesis"],"text":"Ruolo di Vito: AI Research Intern. Periodo: Marzo–Giugno 2025 · 3 mesi. Stack: LangGraph, Python, Llama 3.2, FAISS, BM25. Risultati: Novelty: +12% (Miglioramento novità del catalogo raccomandato.); Precisione: -0.5% (Delta minimo rispetto al baseline massimizzato.); Dataset: MovieLens 1M (Testato su benchmark standard.). Link: GitHub https://github.com/Hellvisback365/LLM.git.","vec":[0.02643,-0.00215,-0.04065,-0.05113,0.08255,-0.05361,0.02287,0.03326,0.04226,-0.02299,0.05698,0.00024,0.05785,-0.03092,0.0189,0.049,0.08255,-0.04786,-0.07589,-0.05468,0.02637,0.01698,-0.04266,0.00035,0.09022,0.05459,-0.02632,0.01314,0.07455,-0.05448,-0.00106,-0.05616,0.04339,-0.04121,0.00603,0.02675,-0.0449,-0.04615,0.05587,-0.06271,-0.01211,0.04692,0.00912,0.05718,0.07317,0.01648,-0.01688,0.03292,-0.02456,-0.02656,-0.04313,0.07423,0.06981,0.05038,0.05348,-0.0294,-0.04121,-0.09752,-0.00488,-0.02182,0.04345,-0.00685,-0.021,0.06156,0.0652,0.09029,0.00743,0.03584,-0.10818,-0.05475,-0.0723,0.03074,-0.01766,-0.08112,0.00027,0.03609,0.07286,-0.06286,-0.00555,-0.04565,-0.05111,-0.0588,-0.03137,0.01594,-0.03827,0.06616,0.05256,-0.10357,0.04545,-0.03619,0.02611,0.10194,-0.05443,-0.0515,-0.03805,-0.07365,-0.02643,0.09698,0.08316,-0.04507,0.01948,-0.05488,0.03059,-0.09372,-0.03728,0.02563,0.03205,-0.06762,0.08789,-0.049,-0.04869,0.06711,0.05423,0.04703,-0.05183,-0.06413,-0.0088,-0.05521,0.0548,-0.05947,0.06225,-0.04012,-0.04031,-0.08021,-0.03909,-0.02997,0.01959,0.04306,-0.00346,0.00191,0.0021,0.01973,-0.00336,0.07858,0.05273,0.06671,-0.02275,0.01653,-0.04538,-0.053,-0.04194,0.01512,-0.06419,0.0029,0.03755,0.02033,0.09035,-0.05727,0.08168,-0.03665,0.06134,-0.05109,0.07141,0.05211,0.05386,-0.04692,-0.05176,-0.0555,0.0468,0.09077,-0.07756,-0.05196,-0.06058,-0.0578,-0.02865,-0.02307,0.03143,0.08282,-0.05353,-0.02825,-0.09024,0.10799,-0.00149,0.06684,0.00299,0.05185,-0.07639,0.02348,0.13049,0.04295,-0.05608,-0.04599,-0.09389,-0.03247,-0.08522,-0.06125,-0.06149,-0.00647,-0.01345,-0.01617,-0.00191,0.03336,-0.053,-0.0678,-0.00643,0.04763,-0.01961,0.01636,0.05343,0.05762,-0.00993,-0.0577,-0.01908,0.02332,0.05274,0.02643,-0.06694,0.02279,-0.01038,0.02591,0.04371,-0.01756,-0.06425,0.03781,0.00271,-0.02223,-0.00797,0.06788,-0.04761,0.02568,0.07443,-0.02553,0.04567,-0.04799,0.0051,0.04072,0.02839,-0.0815,-0.06164,0.05363,-0.01917,-0.03041,-0.08042,-0.09949,-0.01619,-0.03961,0.0482,0.05502,0.00822,-0.04287,-0.0853,-0.02024,0.01207,-0.01594,0.01819,-0.06124,-0.02709,0.02334,-0.02562,0.08067,0.0609,-0.07148,-0.05628,-0.04643,-0.00127,0.03641,0.02881,0.03134,-0.04902,0.04961,0.03206,-0.01878,0.0736,0.01836,0.02076,0.0209,-0.07723,-0.02019,-0.02876,-0.04356,-0.00877,0.01234,0.02337,-0.00265,-0.0788,-0.03807,0.02249,0.12045,-0.09415,-0.06442,0.0889,0.04815,0.02145,0.04981,0.04554,-0.0361,-0.04225,0.06152,-0.03233,-0.07766,-0.0103,-0.02968,0.08681,-0.04118,0.06897,0.05798,0.02625,0.05683,-0.07526,0.0261,0.00605,0.00078,0.01838,0.05554,-0.04271,0.04838,0.02913,0.00713,0.07411,0.03569,0.10291,0.00912,-0.05699,-0.00478,0.05043,0.04177,0.02177,0.04508,-0.05321,-0.06751,-0.06547,-0.087,-0.03549,-0.05464,0.03848,0.08009,-0.07788,-0.0302,0.04836,-0.03902,0.04338,-0.02088,-0.05046,0.04253,-0.02029,-0.06328,-0.0146,0.06329,-0.03917,-0.00584,0.02586,0.0344,-0.07923,0.0609,-0.04027,-0.04831,0.08155,-0.03079,-0.03018,0.02066,0.01443,-0.11958,0.07294,0.04009,-0.04365,0.04957,-0.02924,-0.01462,0.05027,0.06852,-0.0365,-0.06312,0.03291,0.06677,0.0485,0.00843,-0.00959,-0.02738,0.02128,-0.04096,0.04233,0.06433,-0.02998,-0.00971,-0.02637,-0.04083,-0.04447,0.01916,-0.04088,-0.0841,0.06082,0.02864,0.0883,0.07482]},{"id":"project-5#0","docId":"project-5","title":"B.Future Challenge 2025 · BOOM (CRIF)","category":"project","tags":["n8n","Gemini","API","Workflow Automation"],"text":"Sviluppo backend in team di Zenith, assistente AI con workflow automatizzato per la digitalizzazione della consulenza aziendale. Zenith: Assistente AI per digitalizzare la consulenza. Hackathon multidisciplinare in team di 6 persone per VAR Group. Abbiamo sviluppato Zenith, assistente AI per automatizzare il processo di consulenza aziendale. Mi sono occupato della pipeline backend: orchestrazione tramite n8n, integrazione con Google Gemini e archiviazione su Google Drive.","vec":[0.01305,0.00858,-0.07649,-0.06143,0.06766,-0.04159,0.03344,0.02563,0.0269,0.04048,0.0483,0.00931,0.02888,-0.05258,-0.0088,0.02958,0.05061,-0.01847,-0.07382,-0.10083,0.02745,-0.023,-0.05692,0.06119,0.04341,0.04595,-0.06935,0.00873,0.05267,-0.04034,-0.05925,-0.05621,0.08547,-0.09498,0.0828,0.02442,-0.05866,-0.01694,0.0524,-0.06691,-0.02262,0.02998,-0.00321,0.02819,0.03461,0.07584,-0.02936,0.02576,-0.03993,-0.02662,-0.03082,0.06055,0.02635,0.01376,0.06528,-0.03787,-0.04579,-0.09184,-0.03919,0.01004,0.04724,-0.04285,0.03839,0.0255,0.05805,0.08829,-0.00148,0.04735,-0.06486,-0.06251,-0.0579,0.09833,0.0181,-0.0717,0.02632,0.01339,0.02967,-0.07169,0.04641,-0.06312,-0.11512,-0.01155,-0.02152,0.07032,-0.07419,0.04949,0.01341,-0.07191,0.06637,0.00483,0.05891,0.05007,-0.06347,-0.03294,-0.05601,-0.04102,-0.09707,0.10449,0.07157,-0.03781,0.03306,-0.08916,0.04032,-0.07498,0.00214,0.04523,-0.02014,-0.06916,0.05311,-0.04161,-0.04724,0.075,0.05799,0.03632,-0.08583,-0.00048,-0.04565,-0.05464,0.05164,-0.05426,0.04955,0.0076,-0.05718,-0.07766,-0.07459,-0.07817,-0.00928,0.0727,0.07416,0.00699,0.00733,0.03666,0.02123,0.04188,0.07107,0.12664,-0.05843,-0.00831,-0.03766,-0.06046,-0.03718,0.07047,-0.0155,0.03591,0.069,0.03228,0.12061,-0.02196,0.03584,-0.03732,0.0388,-0.02951,0.08696,0.03657,0.04354,-0.02919,-0.0653,0.01272,0.06723,0.04896,-0.04039,-0.06612,-0.04186,-0.00868,-0.03831,0.00081,0.02,0.02396,-0.08042,-0.02432,-0.05014,0.10616,-0.04629,0.05459,0.02136,0.05672,-0.06454,0.04915,0.0568,0.03425,-0.02914,-0.01318,-0.06353,-0.06245,-0.06422,-0.00732,-0.05293,0.03763,-0.03491,-0.05649,0.02692,0.03256,-0.01109,-0.06904,-0.03237,0.05459,-0.05427,0.06573,0.06225,0.02716,0.00242,-0.04334,0.04254,0.01069,0.03778,-0.01078,-0.05669,0.05838,-0.09659,0.04266,0.06558,-0.03986,-0.06553,0.02218,-0.02629,-0.04086,0.01357,0.02906,-0.03569,0.00341,0.06616,-0.02619,0.04944,-0.0838,0.00783,0.02643,0.01808,-0.10409,-0.07847,0.04981,-0.06117,-0.0153,-0.07443,-0.05137,-0.00712,-0.07829,-0.00072,0.04178,0.03603,-0.00051,-0.0472,-0.03703,0.03689,-0.02813,0.04005,-0.05683,-0.0051,0.04527,-0.02751,0.07814,0.09668,-0.09783,-0.07426,-0.04888,0.0117,0.04769,0.04901,0.03155,-0.07586,0.05786,0.0438,-0.05783,0.05218,0.03052,0.0336,0.02826,-0.0421,0.00976,-0.01579,-0.0009,-0.04499,-0.00566,0.01798,-0.02846,-0.06532,-0.04325,0.01082,0.08215,-0.05813,-0.07095,0.07211,0.01129,0.03447,0.10846,0.08155,-0.00248,-0.01868,0.05113,-0.00808,-0.01804,-0.04313,-0.00954,0.0474,-0.02199,0.07879,0.00726,-0.00961,0.05333,-0.04225,0.07746,0.03344,0.00297,0.01399,0.00948,-0.06631,0.02077,0.00058,0.01078,0.00549,0.00479,0.06298,0.04103,0.00366,-0.03343,0.03754,0.04764,-0.02737,0.00103,-0.08639,-0.04265,-0.09926,-0.06147,-0.0022,-0.03428,0.02046,0.06461,-0.05999,0.00071,0.06092,0.04051,-0.00187,-0.09908,-0.08203,0.05302,-0.0272,-0.02667,0.01164,0.10169,-0.02854,-0.01317,0.02849,-0.00026,-0.05459,0.056,-0.01054,-0.03935,0.0315,-0.03544,-0.08539,0.00701,0.07832,-0.10895,0.0458,0.01183,-0.04663,0.04019,-0.04668,0.00093,0.02212,0.02096,-0.04867,-0.0422,0.06543,0.00779,0.0084,0.02179,0.01373,-0.03448,0.033,-0.05972,0.06418,0.07607,-0.02705,-0.03478,-0.00817,-0.05542,-0.04418,0.0219,-0.05132,-0.07002,0.06156,0.0532,0.08798,0.08402]},{"id":"project-5#1","docId":"project-5","title":"B.Future Challenge 2025 · BOOM (CRIF)","category":"project","tags":["n8n","Gemini","API","Workflow Automation"],"text":"Mi sono occupato della pipeline backend: orchestrazione tramite n8n, integrazione con Google Gemini e archiviazione su Google Drive. Il prototipo stimava un abbattimento drastico dei tempi di lavorazione. Ruolo di Vito: Backend AI Developer. Periodo: Settembre–Novembre 2025. Stack: n8n, Google Gemini, Google Drive API.","vec":[-0.02714,-0.00176,-0.04542,-0.0428,0.0588,-0.06377,0.01781,0.0259,0.03085,0.01173,0.05097,-0.00783,0.04056,-0.03561,-0.00316,0.04165,0.06513,0.00812,-0.06214,-0.09224,0.0512,0.01884,-0.06833,0.04761,0.0697,0.02601,-0.07657,0.02916,0.05851,-0.03387,-0.05393,-0.06319,0.04466,-0.09643,0.06391,-0.00187,-0.06525,-0.02631,0.05841,-0.03986,-0.04159,0.03642,-0.04067,0.03428,0.04094,0.06367,-0.02541,0.04524,-0.05038,-0.04821,-0.03691,0.07606,0.04435,0.018,0.04543,0.00561,-0.0557,-0.04847,-0.03276,0.02257,0.0771,-0.03108,0.01904,0.02111,0.06939,0.0948,-0.00658,0.04759,-0.05387,-0.05222,-0.04847,0.08362,0.01451,-0.06253,0.02645,0.03935,0.04942,-0.08604,0.03316,-0.07777,-0.06904,-0.03459,-0.04377,0.04881,-0.07057,0.04094,0.03638,-0.08283,0.04864,-0.00884,0.03103,0.0999,-0.09764,-0.03079,-0.03774,-0.07476,-0.0705,0.08637,0.05701,0.01172,0.05634,-0.08131,0.05839,-0.11631,-0.00435,0.01382,-0.01608,-0.07066,0.09976,-0.06426,-0.04357,0.06948,0.02719,0.07237,-0.09819,-0.049,-0.02847,-0.04402,0.01528,-0.05396,0.06735,-0.00079,-0.04654,-0.08563,-0.06739,-0.07071,0.01915,0.06822,0.03471,0.02942,0.02395,0.03676,0.02152,0.05371,0.04779,0.07039,-0.05047,-0.02921,-0.00768,-0.03541,-0.02508,0.07631,-0.04504,0.02417,0.05271,0.02083,0.10086,-0.01816,0.03354,-0.03477,0.04301,-0.05504,0.07998,0.02897,0.05925,-0.03954,-0.09021,-0.00914,0.0641,0.08082,-0.05692,-0.04461,-0.05525,-0.01259,-0.0455,-0.0068,0.02245,0.03785,-0.07166,-0.01522,-0.0378,0.08988,-0.01405,0.07011,0.00672,0.05218,-0.02997,0.0413,0.06009,0.0546,-0.02926,-0.03625,-0.10079,-0.07091,-0.05541,-0.00368,-0.05557,0.02424,-0.01797,-0.02392,0.03235,0.04942,-0.0544,-0.05522,-0.01588,0.0292,-0.02552,0.04447,0.03761,0.00045,0.0091,-0.02916,0.03224,0.02443,0.0382,0.00913,-0.06379,0.03762,-0.03835,0.07481,0.07168,-0.05,-0.07746,0.03684,-0.01204,-0.04679,0.00304,0.02939,-0.02212,0.0391,0.05615,-0.04014,0.04847,-0.08327,-0.01679,0.03179,-0.00941,-0.11858,-0.06343,0.0262,-0.04562,-0.0194,-0.05675,-0.0461,-0.01146,-0.06352,0.03604,0.05323,0.0318,0.00351,-0.04381,-0.03373,0.02672,-0.02517,0.04411,-0.04102,-0.02722,0.03231,-0.01913,0.04223,0.09177,-0.11438,-0.08644,-0.06846,-0.00602,0.07235,0.02355,0.05027,-0.08753,0.07113,0.02178,-0.0464,0.07506,0.0543,0.01074,-0.00362,-0.04836,0.00362,-0.05693,0.00272,-0.02164,0.0049,-0.00953,-0.04605,-0.06092,-0.03463,0.03865,0.08152,-0.08558,-0.07365,0.097,0.04152,0.04403,0.09615,0.07836,-0.01512,-0.05484,0.07137,-0.00997,-0.05604,-0.0271,-0.02605,0.07956,-0.02119,0.07584,0.00929,0.01575,0.04053,-0.06804,0.04139,-0.01684,-0.00493,0.0381,0.02165,-0.08115,0.02978,0.013,0.0228,0.02281,0.02018,0.07023,0.06576,-0.00975,-0.01814,0.04605,0.06599,-0.00547,0.04897,-0.07488,-0.05476,-0.08251,-0.0811,0.00306,-0.05848,0.03731,0.05742,-0.07046,0.01288,0.11947,0.00967,0.01015,-0.05029,-0.05755,0.04741,-0.02537,-0.04957,-0.00415,0.07271,-0.01924,0.00871,0.04975,0.02889,-0.0479,0.04913,-0.03739,-0.05243,0.00651,-0.04456,-0.064,0.00753,0.02784,-0.10441,0.06603,0.02819,-0.03068,0.03572,-0.04572,-0.0255,0.03627,0.02192,-0.0515,-0.03658,0.06285,0.01597,0.00846,0.01969,-0.01753,-0.01749,0.02894,-0.05334,0.05222,0.06525,-0.02684,-0.02509,-0.04117,-0.02334,-0.00355,0.00808,-0.06543,-0.09718,0.06815,0.05099,0.08139,0.0934]},{"id":"project-5#2","docId":"project-5","title":"B.Future Challenge 2025 · BOOM (CRIF)","category":"project","tags":["n8n","Gemini","API","Workflow Automation"],"text":"Stack: n8n, Google Gemini, Google Drive API. Risultati: Tempo report: 7gg → 1gg (Riduzione drastica stimata dei tempi di produzione.); Team: 6 persone (Collaborazione multidisciplinare.); Stack: n8n + Gemini (Pipeline backend automatizzata.). Link: GitHub https://github.com/Hellvisback365/ChallengeBoomVarGroup2025.git.","vec":[-0.00938,0.00403,-0.03518,-0.06043,0.07066,-0.04777,0.00372,0.01639,0.03915,-0.00475,0.04571,-0.01333,0.04469,-0.04904,-0.01098,0.04474,0.04811,0.01125,-0.04723,-0.09697,0.0285,-0.00678,-0.052,0.0544,0.06862,0.03496,-0.06648,0.01941,0.05547,-0.03729,-0.05293,-0.05572,0.04376,-0.07019,0.06282,0.00459,-0.05671,-0.02273,0.06573,-0.05107,-0.0235,0.02301,-0.04921,0.04415,0.03174,0.04694,-0.02507,0.06559,-0.03892,-0.03583,-0.00614,0.07513,0.06014,0.0259,0.05715,-0.00944,-0.04504,-0.06201,-0.03432,0.01426,0.07756,-0.05361,-0.00393,0.03535,0.10121,0.089,-0.00996,0.04909,-0.05871,-0.05339,-0.05457,0.07396,0.01712,-0.06628,0.01308,0.06817,0.03025,-0.06311,0.04905,-0.0699,-0.07563,-0.02581,-0.04561,0.03303,-0.09045,0.03606,0.0181,-0.0543,0.04233,-0.02341,0.03526,0.07279,-0.11556,-0.01284,-0.03493,-0.05363,-0.06512,0.08537,0.05762,0.02473,0.07732,-0.08461,0.05448,-0.0882,0.00409,0.02727,-0.00056,-0.0562,0.09474,-0.03846,-0.07019,0.03852,0.02583,0.05098,-0.07664,-0.03239,-0.01457,-0.05778,0.02359,-0.07138,0.07133,0.01474,-0.04982,-0.07478,-0.09033,-0.06269,0.01437,0.06492,0.0342,0.02758,0.03712,0.03906,0.00781,0.05006,0.03233,0.07991,-0.06502,-0.02392,-0.00953,-0.06681,-0.04463,0.08199,-0.02866,0.05749,0.06087,0.02068,0.09085,-0.02348,0.03083,-0.03542,0.02627,-0.06467,0.06485,0.05719,0.05831,-0.03561,-0.0579,-0.01038,0.04298,0.07778,-0.03475,-0.07237,-0.06486,-0.03094,-0.03433,-0.02061,0.01741,0.05014,-0.07778,-0.04032,-0.03975,0.09956,-0.02299,0.04961,0.01953,0.05789,-0.03403,0.06537,0.06994,0.05638,-0.03022,-0.04031,-0.08252,-0.06994,-0.03416,-0.00338,-0.05587,0.00437,-0.00932,-0.02656,0.02202,0.04031,-0.03527,-0.04474,-0.03608,0.03044,-0.02706,0.03735,0.04651,-0.0148,0.00532,-0.03075,0.02845,0.03045,0.03329,-0.00531,-0.06026,0.0475,-0.05346,0.08009,0.07444,-0.05954,-0.07591,0.02658,-0.02901,-0.03925,-0.01456,0.03513,-0.00375,0.0575,0.06317,-0.04274,0.05446,-0.10141,-0.00266,0.02863,0.00147,-0.10344,-0.05308,0.02971,-0.03274,-0.0086,-0.0593,-0.03783,-0.00751,-0.06616,0.02211,0.02602,0.01398,0.0108,-0.04872,-0.04555,0.04303,-0.01319,0.01894,-0.06611,-0.04317,0.03001,-0.01017,0.03964,0.07101,-0.10983,-0.09104,-0.06374,-0.00946,0.04505,0.03441,0.06108,-0.06591,0.07921,0.01398,-0.05285,0.06099,0.04743,0.03853,-0.01945,-0.02662,-0.0138,-0.05863,-0.00412,-0.03352,0.00519,0.02218,-0.04246,-0.07019,-0.02372,0.02516,0.11128,-0.07324,-0.09821,0.07887,0.01215,0.06138,0.09604,0.08318,-0.00023,-0.04734,0.06704,-0.01959,-0.04019,-0.03748,-0.04647,0.07211,-0.01135,0.06728,0.00563,0.0101,0.04746,-0.06012,0.04392,-0.02335,0.00306,0.04602,0.01707,-0.07614,0.06697,0.02583,0.03123,0.01042,0.0225,0.07108,0.06607,-0.00675,-0.02947,0.04614,0.08803,-0.00342,0.04557,-0.09386,-0.06177,-0.09139,-0.08075,0.01597,-0.07705,0.04042,0.05565,-0.06473,0.0101,0.09894,0.0106,0.00889,-0.0408,-0.05731,0.03712,-0.05264,-0.05792,0.00679,0.08394,-0.04285,0.00478,0.07666,0.02473,-0.05719,0.03343,-0.03867,-0.0558,0.02081,-0.02982,-0.06489,0.00499,0.0335,-0.10125,0.06234,0.0449,-0.0517,0.04806,-0.04686,-0.04303,0.03818,0.01851,-0.05518,-0.02327,0.07822,0.00473,0.01155,0.0273,-0.0141,-0.02171,0.03798,-0.05229,0.04582,0.07081,-0.02282,-0.01726,-0.02681,-0.03153,-0.00337,0.00843,-0.07458,-0.10698,0.06936,0.04353,0.08741,0.08497]},{"id":"project-6#0","docId":"project-6","title":"BeFluent","category":"project","tags":["React","Node.js","Accessibilità","JavaScript","UX Design"],"text":"Applicazione web React+Node.js progettata per aiutare bambini con dislessia attraverso un'interfaccia intuitiva e accessibile. Web app per supporto alla dislessia. BeFluent è un'applicazione web progettata per aiutare bambini con dislessia attraverso un'interfaccia intuitiva e accessibile. L'app utilizza tecnologie React per il frontend e Node.js per il backend, offrendo esercizi personalizzati e feedback adattivi.","vec":[0.03628,0.02247,-0.04436,-0.09911,0.09924,-0.02345,0.04009,0.03668,-0.01561,0.02336,0.06976,-0.02241,0.07959,-0.02613,-0.03488,0.06394,0.05263,-0.0538,-0.06696,-0.07999,0.04535,-0.00145,-0.0829,0.00714,0.09495,0.02654,-0.0061,0.02499,-0.00777,-0.04268,-0.06066,-0.06102,0.04975,-0.0721,0.07217,0.02959,-0.01194,-0.06273,0.0877,-0.09292,0.00978,0.03783,0.05875,0.05001,0.04572,0.04735,-0.00994,0.02708,-0.02197,-0.03229,0.01191,0.08933,0.00743,0.03621,0.05478,-0.0629,-0.04394,-0.0404,-0.08125,-0.03504,0.07176,-0.01518,0.01164,0.01917,0.06737,0.08402,-0.01599,0.01538,-0.06335,-0.06834,-0.02551,0.08774,0.03652,-0.02501,0.00261,0.01029,-0.00728,-0.05965,0.0464,-0.06115,-0.07782,-0.0571,-0.03684,0.015,-0.04969,0.07098,0.02431,-0.08543,0.0563,0.00036,0.07392,0.01878,-0.11319,-0.04918,-0.11293,-0.02289,-0.01254,0.09234,0.03194,-0.04756,0.01,-0.04592,0.04205,-0.10611,-0.04063,0.01359,0.0509,-0.05844,0.05673,-0.03796,-0.04824,0.07191,0.10145,0.02988,-0.0672,-0.03076,-0.01779,-0.04768,0.03761,-0.03349,0.03537,-0.01343,-0.10027,-0.0958,-0.06784,-0.05604,0.012,0.05352,0.01851,0.05787,0.03609,0.06212,0.04823,0.07413,0.01801,0.06631,-0.06387,0.00004,-0.02952,-0.04932,-0.0241,0.08983,-0.02255,0.0517,0.06429,0.08031,0.11579,-0.03465,0.05451,-0.04694,0.03045,-0.00142,0.03299,0.00896,0.06643,-0.05772,-0.05319,-0.02547,0.08055,0.10135,-0.08877,-0.03914,-0.05945,-0.0111,-0.05757,-0.04109,0.00089,0.06642,-0.02631,-0.05095,-0.0475,0.06673,-0.03118,0.09757,0.04819,0.06007,-0.06431,0.07094,0.02998,0.01229,-0.00305,0.01249,-0.074,-0.07524,-0.08938,-0.03374,-0.05841,0.04154,0.00595,-0.0399,0.02397,0.00853,0.00114,-0.07184,-0.04323,0.06807,-0.04754,0.05466,0.03142,-0.01058,0.01353,-0.05941,0.03237,-0.00517,0.09377,-0.01743,-0.09434,0.0092,-0.06978,0.03039,0.02845,-0.03566,-0.05897,-0.00577,-0.03023,-0.01866,-0.01416,0.03434,-0.0302,-0.00005,0.03268,-0.02293,0.02964,-0.06793,-0.03374,0.05941,0.03798,-0.0718,-0.03598,0.04292,-0.03026,-0.01432,-0.01324,-0.05074,-0.01662,-0.08399,0.00723,0.01431,0.03194,-0.06486,-0.02748,-0.0551,0.0395,-0.06304,0.0268,-0.05478,0.01446,0.03784,-0.04052,0.0275,0.08869,-0.08125,-0.0251,-0.05304,-0.01722,0.09275,0.02794,0.08478,-0.09171,0.07137,-0.01105,-0.02957,0.04006,0.0834,0.07187,-0.01075,-0.06748,-0.02031,-0.05021,-0.02131,-0.05612,0.01452,0.00993,-0.04571,-0.04006,0.00564,-0.00851,0.04806,-0.04112,-0.0523,0.03843,0.06391,0.02519,0.08997,0.01634,-0.00585,0.00832,0.05509,-0.00999,-0.01449,-0.04429,-0.03805,0.04093,0.00902,0.0367,0.00638,0.021,0.02846,-0.06883,0.10989,0.01382,-0.06079,-0.00318,0.04946,-0.08948,0.05256,0.03528,0.00799,0.04852,0.0206,0.03949,0.04857,-0.04133,-0.0505,-0.00032,0.08056,-0.02433,0.02526,-0.07596,-0.04248,-0.05924,-0.06497,0.01542,-0.044,0.02193,0.02003,-0.07163,-0.01288,0.07265,-0.02562,0.05747,-0.04705,-0.03173,0.08278,-0.06699,-0.01708,-0.00786,0.03249,-0.04263,-0.00761,0.04177,0.02613,-0.0881,-0.02161,0.01275,-0.0655,0.05381,-0.05266,-0.03989,0.02124,0.01973,-0.07876,0.07822,0.03771,-0.04952,0.07166,-0.05946,-0.05066,0.06988,0.05415,-0.02703,-0.04095,0.01949,0.01233,0.08554,0.02827,-0.0419,0.00424,0.03246,-0.0361,0.05384,0.10539,-0.0136,-0.01604,-0.01016,0.00705,-0.03548,0.03347,-0.05845,-0.04332,0.06678,0.03427,0.05749,0.05453]},{"id":"project-6#1","docId":"project-6","title":"BeFluent","category":"project","tags":["React","Node.js","Accessibilità","JavaScript","UX Design"],"text":"L'app utilizza tecnologie React per il frontend e Node.js per il backend, offrendo esercizi personalizzati e feedback adattivi. La soluzione è stata progettata con un focus sull'accessibilità e sulla facilità d'uso, permettendo un'esperienza di apprendimento inclusiva e coinvolgente. Ruolo di Vito: Developer. Periodo: Progetto Universitario. Stack: React, Node.js, JavaScript, CSS, Express.","vec":[0.00652,0.00626,-0.02085,-0.0754,0.09295,-0.03979,0.03239,0.05912,0.01064,0.01432,0.06391,0.00181,0.08619,-0.01811,-0.03128,0.08035,0.06339,-0.02712,-0.07143,-0.06045,0.0639,0.0037,-0.05703,0.01647,0.09378,0.04691,-0.00911,0.01958,0.01298,-0.0539,-0.03895,-0.0523,0.03579,-0.09505,0.06987,0.01608,-0.03909,-0.06875,0.05977,-0.09307,0.01816,0.05952,0.04251,0.03594,0.04007,0.04732,-0.00258,0.00579,-0.02945,-0.04755,-0.01212,0.11103,0.03567,0.02351,0.03675,-0.03209,-0.06113,-0.02443,-0.05081,-0.00939,0.07664,-0.00067,0.00707,-0.00237,0.07624,0.06969,-0.01038,-0.00328,-0.07537,-0.06514,-0.03348,0.07671,0.0073,-0.01635,0.00802,0.02737,0.01844,-0.07584,0.04295,-0.05107,-0.08405,-0.06287,-0.04477,0.02454,-0.03493,0.04148,0.02829,-0.10824,0.09616,0.01202,0.06882,0.0403,-0.0931,-0.05827,-0.0985,-0.02061,0.01799,0.09022,0.01892,-0.01957,0.00659,-0.0478,0.05317,-0.10425,-0.02925,0.01882,0.03535,-0.04473,0.06295,-0.03813,-0.04078,0.06539,0.08886,0.03295,-0.08481,-0.03699,0.01005,-0.04881,0.02922,-0.04491,0.04286,-0.02513,-0.05891,-0.09914,-0.05899,-0.05824,0.00804,0.08114,0.02247,0.0492,0.02172,0.05609,0.04512,0.04901,0.00279,0.0864,-0.03525,0.00363,-0.03957,-0.03,-0.00819,0.07803,-0.03011,0.04512,0.06191,0.07103,0.11462,-0.03585,0.04545,-0.04577,0.03236,-0.00655,0.02962,0.03037,0.06952,-0.07997,-0.07112,-0.04131,0.08577,0.11364,-0.08228,-0.03406,-0.05174,-0.00462,-0.06231,-0.03935,-0.00654,0.04877,-0.03236,-0.01079,-0.05668,0.06629,-0.00913,0.1113,0.05404,0.04229,-0.06272,0.06137,0.04871,0.02359,0.00848,0.00224,-0.0745,-0.09691,-0.09099,-0.03277,-0.07455,0.03329,-0.00991,-0.04085,0.01704,0.01487,-0.0092,-0.08791,-0.02997,0.05809,-0.06125,0.05328,0.02832,0.01311,0.00245,-0.0518,0.02095,-0.00366,0.07551,-0.00422,-0.09989,0.02764,-0.06251,0.03291,0.03442,-0.05501,-0.08005,-0.00503,0.00396,-0.00341,-0.03144,0.02546,-0.04098,0.02884,0.02901,-0.00086,0.01011,-0.05515,-0.04567,0.05498,0.05228,-0.08626,-0.03584,0.05931,-0.03507,-0.01746,-0.05273,-0.0588,-0.01206,-0.09385,0.00798,0.03349,-0.00199,-0.04635,-0.02094,-0.07981,0.03842,-0.07174,0.04102,-0.04018,-0.00587,0.07328,-0.03074,0.04408,0.09478,-0.08325,-0.03946,-0.02165,-0.01979,0.06276,0.00546,0.09622,-0.11671,0.06129,-0.00767,-0.045,0.04568,0.05463,0.06602,-0.0148,-0.06993,-0.03438,-0.05496,-0.02121,-0.04439,0.01121,0.02072,-0.04557,-0.00948,-0.01341,0.03147,0.06371,-0.05907,-0.06085,0.05103,0.05871,0.03697,0.07461,0.02057,-0.00994,0.00559,0.05911,0.00495,-0.04949,-0.05185,-0.05285,0.03455,-0.02042,0.07875,0.0222,0.02368,0.04419,-0.04248,0.07999,0.02529,-0.03909,0.03939,0.02298,-0.11867,0.05011,0.00555,-0.01029,0.02612,0.06077,0.03447,0.04498,-0.04999,-0.03635,0.02565,0.08159,-0.01416,0.02026,-0.0548,-0.05978,-0.0458,-0.07931,0.02211,-0.02174,0.00583,0.03784,-0.08217,-0.03511,0.08187,-0.01629,0.04873,-0.03894,-0.05129,0.04587,-0.07108,-0.04305,-0.02555,0.03378,-0.0482,-0.00431,0.0093,0.0115,-0.05972,-0.00832,0.02372,-0.05747,0.02604,-0.03754,-0.03201,0.031,0.04955,-0.09979,0.08412,0.04014,-0.04102,0.06138,-0.07512,-0.02839,0.06681,0.0588,-0.02352,-0.05349,0.01705,0.00107,0.04644,0.02214,-0.00324,0.00525,0.03933,-0.03877,0.07323,0.08664,-0.03616,-0.00002,-0.01409,-0.03845,-0.04101,0.02913,-0.06165,-0.04871,0.06331,0.01921,0.08315,0.0647]},{"id":"project-6#2","docId":"project-6","title":"BeFluent","category":"project","tags":["React","Node.js","Accessibilità","JavaScript","UX Design"],"text":"Stack: React, Node.js, JavaScript, CSS, Express. Risultati: Target: Bambini (Interfaccia pensata per utenti con dislessia.); Stack: React + Node.js (Frontend moderno e backend robusto.); Focus: Accessibilità (Design inclusivo e facilità d'uso.). Link: GitHub https://github.com/Hellvisback365/BeFluentVITO.git.","vec":[0.01339,0.028,-0.0337,-0.07008,0.07257,-0.05211,0.03709,0.03354,0.01336,0.00513,0.05713,-0.02279,0.09458,-0.02786,-0.02102,0.06881,0.04945,-0.03061,-0.06486,-0.04624,0.05264,0.01218,-0.04527,0.00005,0.10901,0.05897,-0.00746,0.03379,0.02403,-0.02601,-0.04654,-0.05529,-0.00126,-0.09994,0.06126,0.03212,-0.03952,-0.05342,0.06114,-0.08363,0.02439,0.0403,0.03927,0.04519,0.03999,0.03457,-0.0042,0.02568,-0.00726,-0.02065,-0.0071,0.11784,0.03492,0.02112,0.05752,-0.06787,-0.03791,-0.03903,-0.05206,-0.02625,0.07228,-0.006,-0.00101,0.03281,0.07826,0.05894,-0.0022,-0.00183,-0.06744,-0.03785,-0.02389,0.07234,0.02293,-0.00329,-0.00074,-0.00087,0.02571,-0.05886,0.04798,-0.07191,-0.08152,-0.08852,-0.04516,0.02344,-0.04521,0.05765,0.03275,-0.10464,0.07977,0.0141,0.05526,0.04695,-0.10929,-0.04471,-0.08911,-0.02451,0.01371,0.09248,0.04502,-0.03631,0.01911,-0.04179,0.05793,-0.09423,-0.05516,0.01152,0.04412,-0.04215,0.07997,-0.03837,-0.04735,0.05885,0.07008,0.05099,-0.06569,-0.02455,0.0165,-0.05834,0.01581,-0.0535,0.03586,-0.00074,-0.0612,-0.08833,-0.06467,-0.04421,0.02077,0.07329,-0.00104,0.03345,0.00252,0.04992,0.05723,0.06281,-0.00686,0.09757,-0.05919,-0.00009,-0.01936,-0.0378,-0.03897,0.0711,-0.042,0.06392,0.07495,0.07477,0.10563,-0.04358,0.07555,-0.04909,0.05143,-0.02374,0.03495,0.0296,0.07054,-0.06272,-0.06221,-0.02378,0.09031,0.11952,-0.05944,-0.03755,-0.06267,-0.00167,-0.07585,-0.03609,0.01431,0.06109,-0.0219,-0.03713,-0.04813,0.06721,-0.01878,0.1212,0.04472,0.04145,-0.07087,0.05273,0.04396,0.03083,-0.0193,-0.01855,-0.09203,-0.06228,-0.09995,-0.03125,-0.06829,0.03026,0.00347,-0.03012,0.01949,0.02278,-0.0165,-0.07628,-0.02048,0.03054,-0.05489,0.04477,0.03099,0.01422,-0.0125,-0.06229,0.01502,0.00419,0.0955,-0.02749,-0.10407,0.00385,-0.05245,0.01695,0.02785,-0.07265,-0.08465,-0.00912,-0.04632,-0.01429,-0.03142,0.03705,-0.02619,0.02034,0.02364,-0.0181,0.04118,-0.05344,-0.0301,0.06554,0.03003,-0.07191,-0.0437,0.04307,-0.02715,-0.03161,-0.04918,-0.05759,-0.00739,-0.08654,0.0159,0.0319,0.0016,-0.03397,-0.01852,-0.06611,0.04225,-0.06095,0.01905,-0.03925,0.00787,0.06804,-0.01234,0.05451,0.0757,-0.07486,-0.05574,-0.03508,-0.0252,0.05989,0.0288,0.08179,-0.10364,0.07479,-0.03056,-0.0427,0.04152,0.04662,0.0618,-0.0092,-0.05839,-0.03628,-0.04996,-0.02701,-0.04992,0.00577,0.04284,-0.05649,-0.02853,-0.00855,0.00968,0.06839,-0.06177,-0.06305,0.04197,0.03898,0.03378,0.07041,0.03977,-0.01806,0.01266,0.04817,0.01678,-0.02346,-0.04231,-0.05528,0.0237,-0.02645,0.05811,0.02814,0.00729,0.04136,-0.07472,0.10724,0.0171,-0.06005,0.03716,0.01547,-0.13136,0.06589,0.02245,-0.0035,0.04404,0.04218,0.06287,0.05138,-0.05258,-0.0605,0.0417,0.07363,-0.04146,0.02949,-0.05936,-0.05373,-0.0736,-0.07616,-0.00288,-0.02012,0.0053,0.03364,-0.06188,-0.03096,0.0801,-0.02136,0.05506,-0.02977,-0.04117,0.0427,-0.0787,-0.03113,-0.02603,0.04393,-0.05304,-0.02253,0.01885,0.01081,-0.07443,-0.0262,0.01762,-0.05984,0.06221,-0.04594,-0.03526,0.06932,0.0261,-0.07094,0.08071,0.0471,-0.02838,0.071,-0.05573,-0.03049,0.0742,0.05137,-0.04214,-0.06268,0.00306,0.01371,0.0446,0.036,-0.02478,0.0148,0.03162,-0.02715,0.07082,0.09565,-0.03161,-0.02029,-0.02129,-0.01643,-0.02937,0.02844,-0.05924,-0.06474,0.06824,0.02279,0.07284,0.04062]},{"id":"project-7#0","docId":"project-7","title":"POSD System","category":"project","tags":["Privacy","GDPR","MVC","Sicurezza","Python"],"text":"Soluzione software privacy-oriented con architettura MVC, progettata per garantire conformità GDPR e sicurezza dei dati. Privacy-Oriented System Design conforme GDPR. POSD System (Privacy-Oriented System Design) è una soluzione software che implementa un'architettura MVC con focus sulla conformità GDPR. Il sistema è progettato per garantire la sicurezza dei dati utente end-to-end, con crittografia avanzata e controlli di accesso granulari.","vec":[0.04981,-0.01944,-0.07517,-0.07224,0.02143,-0.07249,0.05315,0.03201,0.05132,-0.0078,0.02734,0.00355,0.08729,-0.03402,-0.02255,0.08435,0.06145,-0.02836,-0.03087,-0.05789,0.03801,-0.01529,-0.05442,-0.01712,0.11166,0.05023,-0.00608,-0.00994,0.03685,-0.02768,-0.10423,0.00923,0.07982,-0.09093,0.04413,0.06455,-0.03368,-0.02869,0.04809,-0.08785,-0.0217,0.04856,0.05834,0.0996,0.01151,0.04167,-0.04484,0.01472,-0.04594,0.03644,-0.00169,0.05272,0.06658,0.03663,0.06317,-0.01685,-0.04682,-0.05848,-0.09797,0.01123,0.06114,0.00758,0.03803,0.04606,0.08167,0.05272,0.03337,0.04357,-0.02701,-0.08432,-0.06219,0.05044,0.0327,-0.05156,-0.03039,-0.03034,0.04546,-0.06048,0.02791,-0.04321,-0.08311,0.02075,-0.03743,0.0803,-0.05871,0.04232,0.07232,-0.06105,0.0335,-0.04808,0.05024,0.01386,-0.05744,-0.09164,-0.06362,-0.07364,-0.03686,0.09494,0.04512,-0.04142,0.04338,-0.06366,0.07689,-0.07234,-0.02456,0.00241,0.01831,-0.06365,0.0456,-0.06617,-0.033,0.02279,0.04113,0.06777,-0.09084,-0.0148,-0.01735,-0.05454,0.0025,0.0047,0.04244,-0.01924,-0.0895,-0.0619,-0.05947,-0.06112,0.02367,0.01595,0.03471,0.03544,-0.00081,0.04185,0.02072,0.05618,0.10742,0.09644,-0.06198,0.0457,-0.07088,-0.00607,-0.03323,0.09197,-0.06363,0.05648,0.01578,0.00743,0.04866,-0.03373,0.046,-0.03333,0.07863,0.01284,0.10671,0.01447,0.07909,-0.00449,-0.04388,-0.03471,0.08906,0.05734,-0.03537,-0.0619,-0.06771,-0.01275,-0.02714,-0.05236,0.02366,0.03822,-0.04679,-0.06465,-0.06876,0.05673,-0.04013,0.10501,-0.02917,0.04861,-0.04204,0.01274,0.04364,0.02966,-0.01443,-0.02179,-0.05959,-0.08488,-0.05425,-0.05293,-0.04897,0.00792,-0.00125,-0.03787,-0.00259,0.0316,-0.01829,-0.07156,-0.0399,0.01619,-0.06071,0.02597,0.03742,0.0297,0.00552,-0.0939,-0.00486,0.02675,0.05148,0.03862,-0.04635,-0.00505,-0.08318,0.03234,0.07282,-0.04223,-0.06541,0.03251,-0.00395,-0.01011,-0.00649,0.0538,-0.0312,-0.01941,0.08176,-0.01437,0.04564,-0.09571,-0.07387,0.04949,0.01038,-0.09777,-0.03849,0.0356,-0.00745,-0.05812,-0.06848,-0.07016,-0.06519,-0.08372,-0.01124,-0.0009,0.06432,-0.02912,-0.07996,-0.04123,0.0049,-0.03858,0.02893,0.00166,0.00058,0.03149,-0.0234,0.06502,0.0221,-0.07042,-0.05964,-0.04976,-0.03495,0.06291,0.02992,0.03466,-0.04243,0.08668,0.02939,-0.02726,0.0806,0.06993,0.00833,-0.00519,-0.07829,-0.01534,-0.01368,-0.02477,-0.0048,0.0174,-0.00018,-0.02488,-0.00939,-0.07379,0.01047,0.0729,-0.0131,-0.08401,0.06587,0.03555,0.10154,0.08227,0.01057,-0.02812,0.01673,0.05589,-0.04014,-0.0161,-0.00682,-0.06244,0.05642,-0.04747,0.09169,0.05742,0.05397,0.04051,-0.02697,0.08474,0.03472,-0.04165,-0.04265,0.02627,-0.05871,0.00791,-0.02362,-0.01442,0.02855,0.0631,0.01173,0.04341,-0.03653,-0.04495,0.04311,0.0792,-0.00153,0.03601,-0.06957,-0.03856,-0.05299,-0.09382,0.0038,-0.04714,0.04715,0.05287,-0.05438,-0.01761,0.05111,-0.01199,0.05612,-0.01954,-0.03096,0.03145,-0.07997,-0.04479,0.0032,0.08586,-0.10646,-0.00597,0.05953,0.04447,-0.08529,0.03417,-0.01631,-0.07292,0.04007,-0.07159,-0.01529,0.00292,0.07868,-0.09439,0.04111,0.07095,-0.03488,0.06759,-0.02889,-0.00284,0.06567,0.03918,-0.03997,-0.0878,0.02869,0.03015,0.06665,0.04771,-0.03086,0.02362,-0.00977,-0.01263,0.01884,0.06515,-0.03575,0.01149,0.0156,-0.00708,-0.02916,0.04787,-0.04101,-0.07474,0.02381,0.04016,0.02867,0.07032]},{"id":"project-7#1","docId":"project-7","title":"POSD System","category":"project","tags":["Privacy","GDPR","MVC","Sicurezza","Python"],"text":"Il sistema è progettato per garantire la sicurezza dei dati utente end-to-end, con crittografia avanzata e controlli di accesso granulari. La piattaforma include funzionalità per la gestione del consenso degli utenti e strumenti per l'analisi dell'impatto sulla privacy. Ruolo di Vito: Developer. Periodo: Progetto Universitario. Stack: Python, MVC Architecture, Crittografia, GDPR Compliance.","vec":[0.04062,-0.0322,-0.06092,-0.05811,0.01898,-0.0758,0.05167,0.04493,0.07332,-0.02233,0.02904,0.00191,0.10583,-0.03788,-0.00763,0.05282,0.09534,-0.04497,-0.00714,-0.05728,0.06694,0.01453,-0.07644,0.01546,0.1308,0.04998,-0.01593,-0.02164,0.011,-0.0345,-0.0963,0.00121,0.07494,-0.10536,0.06035,0.04432,-0.03709,-0.01278,0.02503,-0.09813,-0.03749,0.02973,0.03528,0.08032,0.01298,0.07393,-0.06277,-0.01274,-0.03691,0.01491,0.00269,0.04593,0.0546,0.03997,0.06732,-0.00727,-0.02903,-0.03708,-0.05397,-0.00598,0.0571,0.00828,0.04458,0.03009,0.06811,0.05758,0.02692,0.01965,-0.03848,-0.07543,-0.06535,0.05245,0.04148,-0.04645,0.00137,0.01143,0.04977,-0.04584,0.03255,-0.06771,-0.08986,0.00478,-0.01819,0.09315,-0.04179,0.02962,0.0729,-0.08751,0.07106,-0.05183,0.04309,0.00909,-0.0402,-0.07188,-0.0805,-0.08035,-0.02495,0.102,0.04071,-0.05396,0.01602,-0.03206,0.08931,-0.08486,-0.0198,0.03133,0.01553,-0.04545,0.05142,-0.07517,-0.04651,0.03805,0.04578,0.06368,-0.09624,-0.01325,-0.00079,-0.07615,0.00052,-0.02222,0.0356,-0.03411,-0.05732,-0.08705,-0.04735,-0.08362,0.03745,0.06707,0.0382,0.03663,0.01873,0.07572,0.04416,0.06507,0.04963,0.08577,-0.04444,0.02631,-0.03034,-0.01569,-0.03996,0.07881,-0.05235,0.03251,0.00764,0.00363,0.04192,-0.03681,0.05007,-0.05202,0.06735,0.00147,0.07732,0.01055,0.05634,-0.0172,-0.05562,-0.06071,0.10909,0.0823,-0.06578,-0.0602,-0.04957,-0.00545,-0.0371,-0.03511,0.01967,0.07504,-0.06957,-0.04224,-0.09182,0.06199,-0.01656,0.10715,-0.01842,0.03021,-0.02964,0.0292,0.08161,0.04514,0.00595,-0.01582,-0.05338,-0.09952,-0.03863,-0.05879,-0.03618,-0.02148,-0.02581,-0.03297,-0.00416,0.05067,0.00476,-0.08029,-0.04487,0.01825,-0.07365,0.03167,0.0243,0.02699,0.00011,-0.03796,0.025,0.04365,0.03417,0.03005,-0.0545,-0.00079,-0.07425,0.04764,0.0618,-0.05055,-0.06102,0.0449,0.02048,-0.01831,-0.02705,0.06555,-0.02195,-0.01036,0.08998,-0.00273,0.03724,-0.08837,-0.03745,0.03362,0.00636,-0.10961,-0.0337,0.04408,-0.00791,-0.0483,-0.06747,-0.07832,-0.05547,-0.08078,0.02308,0.02321,0.04413,-0.04036,-0.07669,-0.02338,0.00791,-0.02999,0.04868,-0.00464,-0.01801,0.07742,-0.02628,0.07056,0.02164,-0.07154,-0.03676,-0.07168,-0.03917,0.06903,0.03858,0.04946,-0.07353,0.04841,0.01991,-0.03188,0.06769,0.04184,0.02614,-0.02094,-0.09461,0.00343,-0.01955,-0.00238,0.00148,0.00487,-0.00216,-0.03665,-0.01964,-0.06727,0.0365,0.07979,-0.05414,-0.0922,0.06166,0.02106,0.0864,0.07514,0.0263,-0.03981,-0.00423,0.02491,-0.05454,-0.04188,-0.03655,-0.06622,0.05937,-0.04175,0.08347,0.08184,0.04279,0.04521,-0.01291,0.06334,0.04234,-0.05399,-0.03557,0.01826,-0.06084,0.00752,-0.02428,-0.00337,0.0247,0.06708,0.01845,0.05356,-0.03422,-0.04648,0.05931,0.05498,0.00007,0.03619,-0.07269,-0.04903,-0.05292,-0.08966,0.00948,-0.05333,0.04271,0.05868,-0.03338,-0.00235,0.06024,-0.0094,0.06539,-0.00533,-0.0232,0.01123,-0.07516,-0.0726,0.00817,0.04472,-0.08384,0.00561,0.03418,0.03551,-0.08733,0.01448,-0.02945,-0.04787,0.03876,-0.06697,-0.02055,0.01907,0.09702,-0.09315,0.03621,0.06544,-0.02902,0.04882,-0.02956,-0.00904,0.06323,0.03605,-0.02998,-0.09125,0.01718,0.00641,0.0488,0.06041,-0.03683,0.01602,-0.00194,-0.0051,0.02687,0.0535,-0.02563,0.01049,-0.01529,-0.01157,-0.02936,0.02793,-0.07,-0.0752,0.05045,0.00887,0.04949,0.07099]},{"id":"project-7#2","docId":"project-7","title":"POSD System","category":"project","tags":["Privacy","GDPR","MVC","Sicurezza","Python"],"text":"Stack: Python, MVC Architecture, Crittografia, GDPR Compliance. Risultati: Standard: GDPR (Piena conformità alle normative europee.); Sicurezza: End-to-End (Crittografia avanzata dei dati.); Architettura: MVC (Design modulare e manutenibile.).","vec":[0.05087,-0.02443,-0.06229,-0.06652,-0.01089,-0.09868,0.05645,0.05855,0.06594,-0.0222,0.01751,0.01256,0.1073,-0.033,-0.02761,0.05558,0.06588,-0.00912,-0.00831,-0.04968,0.04103,-0.02745,-0.03571,0.00751,0.09948,0.02748,0.00182,0.01085,0.01535,-0.02185,-0.08497,0.00854,0.07287,-0.07126,0.04399,0.03793,-0.05113,-0.03311,0.0306,-0.08721,-0.04133,0.04643,0.04434,0.07425,0.00706,0.07174,-0.06473,0.03239,-0.03192,0.01533,-0.02394,0.02966,0.06474,0.05296,0.08634,-0.00729,-0.01332,-0.0739,-0.07384,-0.01959,0.0588,-0.00529,0.02555,0.05357,0.0933,0.04135,0.03772,0.04952,-0.0509,-0.08407,-0.06571,0.05327,0.0015,-0.06473,-0.01804,0.00197,0.04678,-0.05307,-0.00275,-0.06449,-0.09057,-0.00078,-0.0236,0.06904,-0.06028,0.07102,0.08391,-0.06674,0.03627,-0.07218,0.02586,0.02141,-0.02882,-0.07659,-0.07641,-0.07823,-0.0309,0.09382,0.05892,-0.02355,0.01612,-0.05287,0.04121,-0.065,-0.03715,0.02044,0.01148,-0.03425,0.05487,-0.04431,-0.04421,0.01819,0.03601,0.0581,-0.09919,-0.01672,-0.00886,-0.06928,-0.00879,-0.02572,0.02345,-0.01053,-0.06953,-0.06641,-0.04643,-0.05326,0.0434,0.03812,0.03547,0.02816,-0.00255,0.07138,0.01132,0.08426,0.06684,0.07138,-0.05193,0.01904,-0.04585,-0.03637,-0.04501,0.07189,-0.05033,0.04875,0.00984,0.01441,0.07318,-0.04295,0.06387,-0.04137,0.06665,0.00769,0.10786,0.01392,0.063,-0.01887,-0.08065,-0.0407,0.10707,0.07855,-0.04649,-0.05738,-0.06094,-0.02127,-0.02618,-0.04152,0.02657,0.05041,-0.06627,-0.03438,-0.06048,0.0656,-0.0446,0.08387,-0.01054,0.02757,-0.02504,-0.00624,0.06621,0.0434,-0.01716,-0.03553,-0.04358,-0.09883,-0.05436,-0.03983,-0.02169,-0.04011,-0.00818,-0.03757,0.0216,0.04063,0.0002,-0.08071,-0.05344,0.03324,-0.06718,0.01526,0.0407,-0.00152,-0.00571,-0.06767,0.03339,0.02864,0.05303,0.02859,-0.06769,0.00646,-0.0813,0.05845,0.08118,-0.05011,-0.06829,0.05779,-0.02812,-0.00807,-0.03281,0.04638,-0.0305,0.00001,0.10702,-0.02558,0.06585,-0.10222,-0.0408,0.05199,0.01401,-0.08,-0.06242,0.02344,-0.02541,-0.065,-0.07099,-0.05451,-0.05672,-0.05753,0.0033,0.03013,0.06556,-0.01605,-0.05936,-0.03142,0.03237,-0.02405,0.03525,-0.02795,-0.00311,0.07693,-0.04194,0.06439,0.0315,-0.06077,-0.04642,-0.04528,-0.04295,0.07187,0.06357,0.05037,-0.05451,0.05063,0.03397,-0.02607,0.07207,0.04549,0.04883,-0.01532,-0.06199,-0.01293,-0.02837,-0.01635,-0.0282,0.00857,0.02484,-0.03552,-0.02367,-0.05031,0.01317,0.10502,-0.03691,-0.08748,0.09032,0.01892,0.09601,0.065,0.04145,-0.03304,-0.0105,0.04338,-0.04143,-0.04131,-0.03886,-0.07066,0.05356,-0.05719,0.09247,0.07189,0.04516,0.03733,-0.06268,0.05777,0.04129,-0.03362,-0.01551,0.04546,-0.06768,0.00331,-0.0183,-0.00579,0.02326,0.03914,0.0384,0.06149,-0.02136,-0.04964,0.06578,0.05413,-0.00698,0.03136,-0.05374,-0.05008,-0.04626,-0.10255,0.00782,-0.03543,0.06059,0.0564,-0.0424,-0.02779,0.04548,-0.00011,0.04874,-0.02651,-0.02261,0.02904,-0.08404,-0.05342,0.00769,0.06936,-0.09156,0.0082,0.06272,0.01766,-0.08458,0.02469,-0.04337,-0.06587,0.04631,-0.05482,-0.01474,0.03164,0.09694,-0.10062,0.04456,0.06525,-0.01902,0.06195,-0.04564,-0.03511,0.06471,0.0418,-0.0439,-0.08277,0.04126,0.01412,0.03933,0.06049,-0.02586,0.00403,-0.00731,-0.01068,0.03652,0.08712,-0.03692,-0.02629,0.00154,-0.00517,-0.01531,0.04414,-0.06771,-0.08468,0.02592,0.0274,0.03744,0.0689]},{"id":"skill-track-ai-ml-data-science#0","docId":"skill-track-ai-ml-data-science","title":"Competenze: AI/ML & Data Science","category":"skills","tags":["LangGraph","LangChain","LLMs","Python","FAISS","BM25"],"text":"Sviluppo di sistemi di raccomandazione LLM-driven, architetture multi-agente e soluzioni NLP con focus su explainability e RAG. Aree di focus: Recommender Systems, Multi-agent orchestration, Hybrid RAG, Explainability. Stack tecnologico: LangGraph, LangChain, LLMs, Python, FAISS, BM25.","vec":[0.04737,0.0009,-0.04672,-0.09345,0.07228,-0.06719,0.02447,0.0676,0.03319,-0.01842,0.06451,-0.01875,0.08889,-0.01528,-0.01307,0.04589,0.07824,-0.06071,-0.03534,-0.04696,0.03205,-0.00081,-0.03338,0.02962,0.0769,0.03788,-0.00228,0.01828,0.02512,-0.01056,-0.03368,-0.05969,0.07159,-0.04155,0.02781,0.01116,-0.02124,-0.07182,0.02187,-0.08028,0.00488,0.01537,0.04524,0.03838,0.05215,0.06382,-0.04103,0.06113,-0.03274,-0.03443,-0.0568,0.05315,0.0638,0.06112,0.05915,-0.04526,-0.0406,-0.08022,-0.05264,-0.01721,0.02587,-0.01473,0.02476,0.02283,0.06994,0.0481,0.04699,0.04675,-0.09849,-0.10617,-0.05425,0.055,-0.01591,-0.0826,0.00307,0.0243,0.06319,-0.05451,0.04572,-0.03862,-0.06704,-0.00527,-0.0309,0.04573,-0.05348,0.03423,0.07243,-0.06901,0.0497,-0.03281,0.03769,0.02522,-0.04912,-0.00745,-0.06989,-0.09143,-0.05723,0.11651,0.06947,-0.0032,0.00233,-0.03254,0.02197,-0.06851,-0.04477,0.01076,0.00539,-0.0883,0.04532,-0.03519,-0.05823,0.04942,0.03816,0.02852,-0.06527,-0.03941,-0.0418,-0.05907,0.05812,-0.0308,0.08492,-0.05414,-0.06315,-0.10454,-0.05284,-0.04127,0.01294,0.0787,0.03393,0.01567,0.00291,0.06697,0.01992,0.0642,0.06087,0.0941,-0.04198,0.02698,-0.02647,-0.01913,-0.03928,0.03636,-0.07071,0.0402,0.02858,0.00986,0.1063,-0.0553,0.069,-0.02423,0.0372,-0.00219,0.05469,0.03911,0.04666,0.00313,-0.06282,-0.04099,0.06669,0.07162,-0.07278,-0.03686,-0.05089,-0.04566,-0.05875,-0.04086,0.01508,0.05402,-0.05602,0.00015,-0.04737,0.08941,-0.03225,0.06162,0.01974,0.0209,-0.1119,0.04423,0.09504,0.05199,-0.04637,-0.03021,-0.06547,-0.07508,-0.08245,-0.05316,-0.06833,0.00942,-0.01896,-0.06847,0.01694,0.03718,-0.07469,-0.10448,-0.03364,0.06479,-0.051,0.02952,0.03295,0.05974,0.00536,-0.05495,-0.00104,0.01115,0.03403,0.0127,-0.0453,0.02314,-0.04863,0.04132,0.01681,-0.02306,-0.02421,0.0266,-0.01224,-0.03928,-0.00819,0.0637,-0.02308,0.01551,0.08922,-0.04929,0.0597,-0.0515,-0.01042,0.05695,0.05531,-0.07746,-0.06016,-0.00096,-0.03864,-0.01373,-0.07102,-0.07976,-0.00789,-0.08057,0.02769,0.04131,0.0143,-0.05332,-0.07826,-0.02402,0.00724,-0.04915,0.04261,-0.07129,-0.00833,0.04788,-0.00523,0.0893,0.06902,-0.07059,-0.08199,-0.01326,0.0027,0.04978,0.06438,0.03638,-0.06165,0.03536,0.01379,-0.06376,0.04685,0.01852,0.03667,0.0247,-0.03552,-0.00568,-0.03774,-0.01599,0.01331,0.01734,0.02799,-0.01178,-0.03245,-0.07748,0.017,0.1099,-0.04182,-0.0683,0.06522,0.01224,0.04561,0.05857,0.06576,-0.0004,-0.02357,0.05644,-0.01162,-0.05365,-0.05904,-0.04288,0.04622,-0.01466,0.11069,0.02927,0.01546,0.05893,-0.05949,0.06936,0.01067,-0.02194,0.04568,0.01919,-0.06647,0.04297,0.02809,0.00107,0.08244,0.02362,0.05233,0.05223,-0.05789,-0.01732,0.02683,0.06667,0.01801,0.04741,-0.07945,-0.06611,-0.03648,-0.0964,-0.01657,-0.04765,0.04296,0.08515,-0.08107,-0.02159,0.06572,-0.02385,0.04085,0.01171,-0.04344,0.03254,-0.08705,-0.05183,0.00076,0.08311,-0.03722,-0.02897,0.06696,0.02578,-0.04296,0.0603,-0.06114,-0.04815,0.05854,-0.0065,-0.01403,0.01228,0.03601,-0.08636,0.04519,0.07218,-0.04407,0.05954,-0.06625,0.0264,0.03087,0.07207,-0.04954,-0.10484,0.02992,0.03626,0.01228,-0.00296,-0.0185,-0.02825,0.0082,-0.036,0.09455,0.08515,-0.06157,-0.05378,0.00493,-0.03699,-0.03933,0.00126,-0.03998,-0.07034,0.04679,0.01721,0.06877,0.07064]},{"id":"skill-track-web-development#0","docId":"skill-track-web-development","title":"Competenze: Web Development","category":"skills","tags":["React","Next.js 15","Node.js","Express","Vite","Tailwind CSS","HTML/CSS"],"text":"Sviluppo full-stack con React e Next.js, API backend con Node.js/Express e integrazione con servizi AI. Aree di focus: Frontend React/Next.js, Backend Node.js, API Integration, Responsive Design. Stack tecnologico: React, Next.js 15, Node.js, Express, Vite, Tailwind CSS, HTML/CSS.","vec":[0.05502,0.01995,-0.04036,-0.06534,0.06498,-0.0467,-0.0084,0.03524,0.03973,-0.01929,0.07263,0.02134,0.07825,-0.03377,-0.02281,0.0427,0.06789,-0.02905,-0.07766,-0.04174,0.03389,0.02169,-0.04914,0.01622,0.06689,0.04446,-0.01809,0.05232,0.00944,-0.06376,-0.04502,-0.03432,0.0054,-0.10832,0.02955,0.02853,-0.02281,-0.0712,0.05892,-0.10747,0.0339,0.03668,0.04892,0.03015,0.04897,0.05517,-0.01494,0.04728,-0.01196,-0.01679,-0.03316,0.06644,0.06181,0.04804,0.03799,-0.0141,-0.05759,-0.05791,-0.01784,0.00166,0.07068,0.01904,0.01348,0.05788,0.08399,0.06334,0.01294,0.0184,-0.07707,-0.03542,-0.03721,0.05491,0.00447,-0.05058,-0.01731,0.03442,0.03452,-0.05333,0.05487,-0.05601,-0.09189,-0.07131,-0.01688,0.02893,-0.05236,0.05881,0.03279,-0.10408,0.08189,0.01858,0.07266,0.05305,-0.06859,-0.02952,-0.08733,-0.0277,-0.01444,0.09168,0.02937,-0.02331,0.0245,-0.01941,0.05832,-0.101,-0.05162,0.03691,0.01538,-0.04853,0.04697,-0.0671,-0.04788,0.04762,0.03963,0.04984,-0.08251,-0.0448,0.00745,-0.0789,0.0287,-0.05468,0.03907,-0.02753,-0.0632,-0.10502,-0.06701,-0.07068,0.01161,0.05755,-0.00363,0.01784,0.01791,0.08595,0.0467,0.0529,0.02195,0.09634,-0.06523,0.00416,-0.02564,-0.02332,-0.02584,0.05481,-0.07139,0.03689,0.04348,0.04097,0.10448,-0.03746,0.05511,-0.05728,0.04332,-0.01593,0.02137,-0.01572,0.04337,-0.0517,-0.05537,-0.02184,0.07991,0.07061,-0.03218,-0.03489,-0.0511,-0.03262,-0.07886,-0.05821,-0.00945,0.06108,-0.05296,-0.00729,-0.04675,0.08059,-0.02001,0.13801,0.03306,0.02248,-0.06299,0.0522,0.06742,0.05053,-0.03126,-0.02135,-0.08522,-0.05633,-0.09324,-0.03172,-0.0826,-0.01279,-0.00992,-0.03024,0.05404,0.03104,-0.04368,-0.06906,-0.035,0.06866,-0.06604,0.05034,0.03212,0.02358,0.01305,-0.01023,0.02277,0.01128,0.07112,0.00259,-0.06957,0.03916,-0.0429,0.05302,0.01723,-0.03665,-0.08179,0.01643,-0.00479,0.01331,-0.06045,0.03377,-0.0654,0.03485,0.05259,-0.01398,0.05788,-0.06528,-0.03375,0.06598,0.01761,-0.07282,-0.0497,0.03429,-0.03318,-0.04122,-0.05514,-0.08571,-0.0445,-0.08434,-0.0053,0.06807,-0.0008,-0.0121,-0.03074,-0.0555,0.05549,-0.04226,0.04723,-0.01014,-0.03163,0.07762,-0.02629,0.05969,0.07017,-0.08317,-0.07605,-0.02269,-0.0062,0.07768,0.02474,0.04355,-0.08653,0.04607,0.02602,-0.03103,0.04626,0.02887,0.06893,-0.02105,-0.04555,-0.00246,-0.02979,-0.01754,-0.05553,0.02119,0.02916,-0.06713,-0.02951,-0.05083,0.04033,0.06091,-0.06692,-0.04209,0.03213,0.04114,0.03896,0.09466,0.07584,-0.00721,-0.01807,0.07082,0.01162,-0.05292,-0.05985,-0.02907,0.0254,-0.04954,0.09396,0.02562,0.00372,0.04994,-0.04642,0.05634,0.02481,-0.04438,0.03748,0.03994,-0.12315,0.05219,-0.01535,-0.02,0.0648,0.01653,0.06313,0.03123,-0.07661,-0.0338,0.04928,0.07515,-0.01103,0.04402,-0.05079,-0.06417,-0.06603,-0.06959,0.00198,-0.03243,0.02848,0.05766,-0.08108,-0.05981,0.06084,-0.01339,0.03832,-0.00638,-0.07606,0.03021,-0.06648,-0.03563,-0.034,0.07239,-0.02227,-0.0191,0.00442,0.04326,-0.0387,0.00939,-0.00187,-0.07745,0.02352,0.00804,-0.01778,0.05094,0.05992,-0.0876,0.05389,0.03948,-0.0063,0.0772,-0.07394,-0.01441,0.04216,0.03005,-0.03787,-0.07738,0.05559,-0.0026,0.02946,0.02992,-0.02025,0.00322,0.06039,-0.01681,0.11291,0.09833,-0.04833,-0.02276,-0.03934,-0.03569,-0.03269,0.01611,-0.06731,-0.08066,0.03955,0.03658,0.08684,0.04122]},{"id":"skill-track-devops-integration#0","docId":"skill-track-devops-integration","title":"Competenze: DevOps & Integration","category":"skills","tags":["n8n","GitHub","MySQL","MongoDB","Docker","npm/yarn"],"text":"Automazione workflow, gestione database relazionali e NoSQL, metodologie Agile e version control. Aree di focus: Workflow Automation, Database Management, Agile/Scrum, CI/CD. Stack tecnologico: n8n, GitHub, MySQL, MongoDB, Docker, npm/yarn.","vec":[0.04117,-0.00683,-0.05342,-0.05936,0.04663,-0.06441,0.01943,0.04129,0.03939,0.0091,0.066,0.01861,0.03147,-0.0353,-0.00292,0.06274,0.07786,-0.04112,-0.01123,-0.04445,-0.00471,0.01708,-0.05222,-0.01493,0.06137,0.03046,0.00309,0.02744,0.02041,-0.05675,-0.0741,-0.06468,0.00966,-0.08202,0.05308,0.03074,-0.05997,-0.05877,0.03554,-0.05556,0.00351,0.0183,0.01973,0.05719,0.03088,0.05905,-0.02715,0.04729,-0.04054,0.00034,-0.0597,0.10548,0.04399,0.04481,0.05121,-0.00697,-0.08836,-0.0159,-0.04081,0.02205,0.05413,0.00461,0.00295,0.01661,0.11019,0.06557,0.04217,0.04823,-0.06153,-0.04104,-0.05361,0.07435,-0.00158,-0.03623,-0.0274,0.05189,0.03283,-0.05863,0.03518,-0.06519,-0.08681,-0.02628,-0.02631,0.06793,-0.04121,0.03698,0.04235,-0.05598,0.07975,-0.03508,0.05036,0.01942,-0.07995,-0.06466,-0.0987,-0.10615,-0.02591,0.09832,0.02256,-0.01322,0.02775,-0.04592,0.06361,-0.09717,-0.05736,0.05656,-0.00066,-0.06558,0.03606,-0.05242,-0.0317,0.0474,0.05428,0.03341,-0.03077,-0.04102,-0.0083,-0.06751,0.06304,-0.03428,0.07348,-0.02407,-0.05565,-0.07264,-0.0613,-0.09124,0.04379,0.07535,0.01661,0.03179,0.03338,0.05459,-0.01414,0.00924,0.02488,0.07583,-0.05086,-0.01739,-0.03079,-0.00808,-0.06544,0.08746,-0.07314,0.03075,0.06686,0.05388,0.07236,-0.05744,0.05089,-0.03999,0.02869,-0.01687,0.06611,0.02495,0.03208,-0.0332,-0.04541,-0.03731,0.04945,0.06292,-0.04279,-0.05468,-0.03486,-0.03106,-0.07042,-0.04319,0.02211,0.04993,-0.05464,-0.00128,-0.03671,0.08022,-0.05087,0.08878,0.00535,0.04351,-0.05772,0.05074,0.05481,0.04684,-0.04087,-0.0072,-0.05382,-0.04202,-0.07923,-0.03928,-0.08511,-0.03457,-0.03588,-0.0449,0.01513,0.04621,-0.03088,-0.10238,-0.08097,0.02938,-0.06851,0.07557,0.02535,0.03061,-0.01251,-0.04477,0.03361,0.02044,0.04955,0.03061,-0.09134,0.06663,-0.04648,0.05846,0.03328,-0.02981,-0.03985,0.0296,0.0085,0.00501,-0.00922,0.05696,-0.01644,0.03129,0.04522,-0.01202,0.04451,-0.08252,-0.0343,0.04364,0.03051,-0.07854,-0.08653,0.05767,-0.02165,-0.00358,-0.04116,-0.08387,-0.04597,-0.08911,0.00555,0.02491,0.03653,-0.042,-0.06476,-0.03319,0.02898,-0.06523,0.04546,-0.02344,-0.03923,0.03804,-0.01884,0.07875,0.09427,-0.10026,-0.10606,-0.02658,-0.0132,0.06671,0.09424,0.06109,-0.05985,0.03776,0.00131,-0.04507,0.0249,0.03171,0.0625,-0.00498,-0.0242,-0.04522,-0.02478,-0.03899,-0.04559,0.01038,0.00653,-0.01605,-0.0429,-0.03722,0.04888,0.08891,-0.02972,-0.04087,0.05705,0.02291,0.06101,0.07759,0.12341,-0.02757,-0.04806,0.07056,0.00015,-0.05779,-0.07106,-0.03408,0.08123,-0.02393,0.06491,0.02279,0.04424,0.01696,-0.04491,0.08598,0.00649,-0.03823,0.0414,0.01307,-0.09668,0.02195,-0.00783,-0.00223,0.03559,0.00622,0.07574,0.03039,-0.02876,-0.02407,0.00936,0.05893,0.01777,0.07026,-0.03479,-0.05807,-0.06266,-0.09626,0.03542,-0.07672,0.03064,0.08862,-0.08921,-0.04211,0.05274,0.00214,0.03321,-0.02105,-0.03846,0.01398,-0.07341,-0.0483,-0.03352,0.08681,-0.01779,-0.00555,0.07751,0.02886,-0.07262,0.02169,-0.02181,-0.0657,0.01039,-0.0213,-0.03322,0.0401,0.02899,-0.09977,0.04678,0.05498,-0.01936,0.0812,-0.05394,-0.01268,0.06769,0.05037,-0.02809,-0.06399,0.04319,-0.01531,0.02822,0.02186,-0.01125,-0.02577,0.04604,-0.04628,0.07595,0.11117,-0.03992,-0.02211,-0.02449,-0.00687,-0.02158,0.00722,-0.04134,-0.06522,0.0637,0.00095,0.09689,0.07927]},{"id":"tool-programming-languages#0","docId":"tool-programming-languages","title":"Strumenti e Tecnologie: Programming Languages (Core)","category":"tools","tags":["C","Python","Java","JavaScript","SQL","HTML/CSS"],"text":"Linguaggi di programmazione per sviluppo AI, web e sistemi enterprise. Strumenti utilizzati: C, Python, Java, JavaScript, SQL, HTML/CSS.","vec":[0.03396,-0.01339,-0.0339,-0.05149,0.04089,-0.04006,0.04619,0.03116,0.05878,-0.03137,0.06826,-0.01997,0.07377,0.005,-0.01338,0.07059,0.04528,-0.00099,-0.02262,-0.03454,0.07095,0.01893,-0.02861,0.06412,0.1063,0.03526,0.00671,0.02814,0.03245,-0.05335,-0.00889,-0.03027,0.05963,-0.06637,0.00329,0.03291,-0.0354,-0.03169,0.01807,-0.10082,0.00873,0.01052,0.04504,0.03134,-0.00035,0.09337,-0.04191,0.03379,-0.0598,-0.0149,-0.00291,0.06431,0.06898,0.07382,0.0662,-0.02895,-0.0505,-0.07225,-0.02897,0.0043,0.0317,0.00151,0.03424,0.065,0.10881,0.02272,0.0148,0.04513,-0.08619,-0.06026,-0.05925,0.03866,0.03546,-0.07272,0.01698,0.00363,0.02499,-0.08198,0.05408,-0.06825,-0.09622,-0.01108,-0.05867,0.02046,-0.03633,0.03263,0.04193,-0.06641,0.05199,-0.05092,0.07953,0.01879,-0.10016,-0.00336,-0.0752,-0.08104,-0.05104,0.08881,0.06649,-0.04091,-0.01408,-0.00747,0.07009,-0.05763,-0.04795,0.02369,0.01255,-0.03621,0.06126,-0.08358,-0.05023,0.01059,0.0595,0.02381,-0.05302,-0.05694,-0.0092,-0.06543,0.04654,-0.07516,0.05907,-0.0095,-0.06036,-0.0949,-0.04745,-0.07066,0.03893,0.03324,-0.01037,0.03379,0.04418,0.07174,0.01744,0.04196,0.04838,0.0918,-0.05061,-0.02188,-0.01307,-0.02345,-0.05465,0.06773,-0.03438,0.03352,0.02681,0.01986,0.04244,-0.01994,-0.01037,-0.04024,0.01231,-0.0155,0.05122,0.01479,0.03864,-0.02472,-0.07191,-0.03467,0.06987,0.0637,-0.05298,-0.02319,-0.04793,-0.03368,-0.06211,0.00465,-0.02315,0.04228,-0.03573,-0.03185,-0.04532,0.0632,-0.06936,0.09007,0.00581,0.00973,-0.06387,0.04265,0.06439,0.03101,-0.01462,0.02176,-0.05942,-0.04689,-0.09335,-0.06818,-0.06777,0.01359,0.018,-0.04134,0.04794,0.02382,-0.04836,-0.11517,-0.04462,0.02133,-0.07381,0.01265,0.03369,0.078,-0.03857,-0.04248,0.06348,0.01028,0.03576,0.02349,-0.08965,0.06877,-0.07246,0.03077,0.0489,0.00043,-0.09269,0.04276,0.00648,-0.01198,-0.03954,0.06817,-0.05872,0.05514,0.03743,-0.02856,0.05799,-0.05705,-0.07108,0.05142,0.04309,-0.10827,-0.03599,0.04965,-0.00888,-0.00708,-0.05251,-0.0719,-0.05611,-0.0305,0.00414,0.01921,-0.02065,-0.04701,-0.03546,-0.04392,0.02912,-0.00659,0.05809,-0.05739,-0.01174,0.04254,-0.0283,0.03259,0.09106,-0.0746,-0.03888,-0.01041,-0.0063,0.0828,0.05917,0.09847,-0.06746,0.02758,0.01738,-0.04786,0.0268,0.05503,0.07584,0.00584,-0.0483,-0.04443,-0.04013,-0.03636,-0.02094,0.01618,0.03606,-0.01313,-0.03905,-0.03385,0.03771,0.09146,-0.04733,-0.03429,0.03249,0.04645,0.09552,0.08949,0.05004,-0.01484,-0.02692,0.04287,-0.00617,-0.05934,-0.04892,-0.08975,0.02209,-0.01641,0.09524,0.00622,0.04,0.00958,-0.08115,0.0562,0.03621,-0.07088,0.05503,0.02517,-0.06693,0.06465,0.00594,0.00176,0.0346,0.0082,0.03839,0.02457,-0.04941,-0.0589,0.0487,0.06381,-0.00117,0.06675,-0.10923,-0.05753,-0.03825,-0.08816,0.00185,-0.02,0.00813,0.04532,-0.05842,-0.00198,0.05877,0.00828,0.04392,-0.00561,-0.03769,-0.00464,-0.06269,-0.02457,0.00636,0.07827,-0.05231,-0.04832,0.04363,0.03971,-0.07019,0.04727,-0.06138,-0.08017,0.02692,-0.03771,-0.02067,0.05476,0.06105,-0.09026,0.01607,0.07427,-0.0078,0.04048,-0.10298,0.0287,0.05926,0.04036,-0.0386,-0.09185,0.01126,0.05308,0.04602,0.03816,0.01195,-0.00285,0.04837,-0.05818,0.07976,0.09274,-0.07819,0.0032,-0.08112,-0.02145,-0.02886,0.04248,-0.04594,-0.09509,0.04294,0.07528,0.0805,0.07627]},{"id":"tool-ai-ml-stack#0","docId":"tool-ai-ml-stack","title":"Strumenti e Tecnologie: AI/ML Stack (AI-first)","category":"tools","tags":["LangGraph","LangChain","FAISS","BM25","Pandas","NumPy","Jupyter"],"text":"Framework e librerie per machine learning, LLM e sistemi di raccomandazione. Strumenti utilizzati: LangGraph, LangChain, FAISS, BM25, Pandas, NumPy, Jupyter.","vec":[0.06631,0.00642,-0.02915,-0.06185,0.05622,-0.02335,0.03768,0.02419,0.03526,-0.05615,0.07667,-0.01939,0.08759,0.00587,-0.02236,0.09637,0.0406,-0.05228,-0.0514,-0.02654,0.03079,0.03652,-0.02787,0.01258,0.09349,0.05278,0.01518,-0.00484,0.05848,-0.04848,-0.02599,-0.04719,0.08527,-0.07059,0.03842,0.00724,-0.01132,-0.06293,0.03427,-0.0806,0.02066,0.02096,0.01678,0.03058,0.02649,0.04324,-0.03192,0.04404,-0.04262,-0.01797,-0.06268,0.0877,0.06368,0.04734,0.0632,-0.02176,-0.03713,-0.08685,-0.04498,-0.01476,0.0268,-0.04401,-0.00154,0.00904,0.08301,0.04713,0.02994,0.01243,-0.11662,-0.08048,-0.05477,0.05754,-0.0132,-0.06654,0.02626,0.01335,0.04256,-0.04243,0.04132,-0.04995,-0.10601,-0.04799,-0.02814,0.0325,-0.05969,0.02236,0.05673,-0.04679,0.04237,-0.06535,0.06314,0.05167,-0.08539,-0.01685,-0.05612,-0.04338,-0.0418,0.10022,0.07511,-0.02102,-0.00918,-0.04038,0.04089,-0.05266,-0.05837,0.02308,0.00262,-0.09222,0.09323,-0.04132,-0.07665,0.05926,0.04884,0.03253,-0.07879,-0.02137,0.00768,-0.07781,0.06006,-0.04503,0.06725,-0.0578,-0.07621,-0.09033,-0.05978,-0.06292,0.03683,0.05257,0.02394,0.0258,0.01504,0.04458,0.02552,0.08,0.07727,0.08617,-0.0401,0.03115,-0.03711,-0.04301,-0.0455,0.0784,-0.04353,0.02273,0.05161,0.02157,0.08698,-0.0467,0.04171,-0.04507,0.04196,0.00036,0.03865,0.0465,0.05115,-0.02653,-0.06134,-0.04852,0.04701,0.04699,-0.06828,-0.05562,-0.07692,-0.04457,-0.05956,-0.02134,0.00897,0.0461,-0.02955,-0.01719,-0.03295,0.08666,-0.05637,0.05866,-0.01404,0.04176,-0.08765,0.00719,0.08126,0.06708,-0.02149,0.0085,-0.07465,-0.07122,-0.07763,-0.05097,-0.02877,0.01852,-0.04405,-0.04045,0.03599,-0.00176,-0.04008,-0.06885,-0.05544,0.0479,-0.03981,0.05378,0.03259,0.07012,-0.02764,-0.04594,0.05118,0.03254,0.05517,0.01445,-0.07712,0.04686,-0.03895,0.03755,0.05014,-0.00897,-0.06451,0.05382,-0.02822,-0.03493,0.00348,0.04487,-0.05184,0.01583,0.06008,-0.04655,0.05432,-0.06321,-0.01762,0.10045,0.08142,-0.11724,-0.08485,0.06517,-0.03846,0.0051,-0.10117,-0.08582,-0.0283,-0.06261,-0.00811,-0.00477,0.01863,-0.06587,-0.05542,-0.00802,0.01334,-0.02101,0.00909,-0.05469,-0.02034,0.02067,-0.0148,0.06095,0.08296,-0.03765,-0.04852,0.00399,0.02078,0.05444,0.06382,0.04935,-0.05801,0.03121,-0.00862,-0.04095,0.04962,0.02973,0.04263,0.00798,-0.03928,0.0086,-0.04816,-0.0212,0.00493,0.01254,0.01445,-0.00072,-0.03709,-0.05053,0.01872,0.10208,-0.01387,-0.04858,0.0754,0.0307,0.04367,0.04676,0.03127,-0.01639,-0.02059,0.05498,0.00656,-0.07826,-0.04932,-0.07403,0.03835,-0.00564,0.11277,0.06192,0.00103,0.04375,-0.06204,0.04331,0.00039,-0.03966,0.05211,0.01967,-0.0427,0.0681,0.01763,-0.01381,0.09718,0.02875,0.03747,0.05875,-0.08277,-0.02295,0.02506,0.03863,0.01508,0.055,-0.08948,-0.06496,-0.07407,-0.11914,0.01016,-0.04363,0.03265,0.04951,-0.06869,-0.00676,0.06169,-0.00341,0.06082,0.01273,-0.01894,0.00259,-0.0517,-0.05273,-0.01309,0.06725,-0.04012,-0.03547,0.03209,0.0347,-0.06977,0.0373,-0.07087,-0.02651,0.06636,-0.01114,-0.015,0.04133,0.04753,-0.08432,0.02974,0.06231,-0.02619,0.04818,-0.06109,-0.00674,0.04578,0.08359,-0.02498,-0.0857,0.01077,0.02931,0.02846,0.04118,-0.019,-0.01667,0.01949,-0.03617,0.05064,0.09494,-0.0796,-0.02917,-0.02457,-0.01178,-0.04541,-0.01273,-0.08256,-0.0734,0.03663,0.02061,0.05377,0.10746]},{"id":"tool-web-database#0","docId":"tool-web-database","title":"Strumenti e Tecnologie: Web & Database (Full-stack)","category":"tools","tags":["React","Next.js","Node.js","Express","MySQL","MongoDB"],"text":"Tecnologie per sviluppo web moderno e gestione dati. Strumenti utilizzati: React, Next.js, Node.js, Express, MySQL, MongoDB.","vec":[0.00667,0.01377,-0.06105,-0.05191,0.01895,-0.03385,0.0401,0.01104,0.04296,-0.01657,0.06672,0.02258,0.07736,-0.00129,-0.01505,0.05581,0.06234,-0.00323,-0.01603,-0.02718,0.0472,0.02804,-0.04783,0.00971,0.06732,0.0431,0.00328,0.00778,0.03426,-0.03616,-0.04517,-0.03906,0.07232,-0.07548,0.04101,0.03588,-0.03645,-0.04742,0.08261,-0.04754,-0.00372,0.00769,0.0311,0.01348,-0.02487,0.05543,-0.01405,0.01897,-0.03141,-0.00638,-0.02567,0.10669,0.06139,0.06375,0.05098,-0.03113,-0.07779,-0.07141,-0.04773,-0.00451,0.04705,-0.00921,-0.02525,0.02407,0.11862,0.04077,0.02417,0.04173,-0.05805,-0.04459,-0.05307,0.07996,-0.01484,-0.05629,-0.03031,0.03096,0.01393,-0.05396,0.05941,-0.05029,-0.09959,-0.04181,-0.03375,0.05504,-0.04412,0.03946,0.05807,-0.06615,0.04462,-0.03204,0.08454,0.03301,-0.08049,-0.04095,-0.07257,-0.02674,-0.02278,0.10252,0.02362,-0.05212,0.0453,-0.03792,0.06596,-0.06584,-0.07122,0.06884,0.01747,-0.05742,0.08282,-0.06923,-0.0319,0.04611,0.05707,0.04451,-0.03745,-0.02731,0.00946,-0.0755,0.04162,-0.05412,0.03999,0.00532,-0.06818,-0.09317,-0.06824,-0.06984,-0.00582,0.05921,0.01685,0.03328,0.0113,0.05167,0.02565,0.0346,0.03349,0.08324,-0.05524,0.01833,-0.04073,-0.02617,-0.02085,0.108,-0.0432,0.05417,0.06943,0.05165,0.03516,-0.01292,0.06624,-0.04182,0.03487,-0.01888,0.04381,0.02825,0.03848,-0.06432,-0.06659,-0.01622,0.08325,0.07988,-0.04073,-0.04001,-0.08635,-0.01943,-0.10988,-0.01768,0.02057,0.05847,-0.05008,-0.0228,-0.02937,0.0749,-0.06257,0.10722,0.06912,0.03479,-0.06553,0.0513,0.065,0.06503,-0.02015,-0.01941,-0.06606,-0.05505,-0.07555,-0.0269,-0.06995,-0.00146,-0.03326,-0.01311,0.05186,0.02337,-0.03082,-0.08485,-0.06763,0.04501,-0.04731,0.05469,0.0133,0.0519,-0.02759,-0.00467,0.03602,0.01308,0.06747,0.00579,-0.10407,0.06381,-0.0715,0.03583,0.03461,-0.02457,-0.07305,-0.00708,0.01061,-0.01555,-0.03474,0.02792,-0.03683,0.04319,0.0403,-0.02919,0.0567,-0.08089,-0.07249,0.08556,0.0301,-0.11397,-0.07179,0.0657,-0.00887,-0.01389,-0.03003,-0.0678,-0.06784,-0.04317,-0.01654,0.0358,0.00214,-0.06271,-0.06818,-0.03318,0.07252,-0.04377,0.0292,-0.02446,-0.02735,0.07662,-0.03785,0.06382,0.08917,-0.06656,-0.07642,-0.00012,0.0089,0.06463,0.06388,0.09711,-0.0911,0.05362,0.01516,-0.04552,0.03059,0.05201,0.05607,-0.05059,-0.06512,-0.03286,-0.04945,-0.04137,-0.046,-0.00405,0.01663,-0.00065,-0.04475,-0.02967,0.01064,0.07828,-0.01609,-0.04542,0.02826,0.05096,0.04392,0.10235,0.04042,0.01063,-0.04015,0.06337,0.01325,-0.08326,-0.05569,-0.05188,0.03271,-0.03936,0.06062,0.0411,0.05086,0.03341,-0.07378,0.03754,0.00504,-0.07514,0.04529,0.0184,-0.09557,0.08012,-0.00574,-0.00266,0.04862,0.01912,0.03257,0.05264,-0.05263,-0.06847,0.05421,0.06439,-0.00892,0.06203,-0.0731,-0.11261,-0.06238,-0.05822,0.016,-0.02766,0.05295,0.05482,-0.07136,-0.02572,0.05088,-0.00418,0.05182,-0.00761,-0.03233,-0.00976,-0.08162,-0.02754,-0.01335,0.05636,-0.0605,-0.03801,0.01326,0.04442,-0.08483,0.01602,-0.0399,-0.06757,0.0378,-0.01194,0.02018,0.07271,0.04815,-0.0879,0.03847,0.05681,0.00236,0.05453,-0.0576,-0.02086,0.04706,0.02696,-0.03863,-0.07429,0.04018,0.0078,0.04146,0.02838,-0.02774,-0.00764,0.04736,-0.03714,0.05278,0.04549,-0.04391,0.00012,-0.03074,-0.01571,-0.03372,0.02184,-0.05968,-0.10651,0.0527,0.01227,0.07361,0.04768]},{"id":"tool-devops-automation#0","docId":"tool-devops-automation","title":"Strumenti e Tecnologie: DevOps & Automation (Platform)","category":"tools","tags":["n8n","GitHub","npm/yarn","VS Code","Eclipse","Agile/Scrum"],"text":"Strumenti per automazione, version control e metodologie di sviluppo. Strumenti utilizzati: n8n, GitHub, npm/yarn, VS Code, Eclipse, Agile/Scrum.","vec":[0.01674,-0.0303,-0.07062,-0.04801,0.04695,-0.05253,0.02841,0.00577,0.05719,-0.0292,0.09086,0.02411,0.03478,-0.01777,-0.02808,0.10842,0.04865,-0.0241,-0.02021,-0.03445,0.00871,0.01717,-0.05289,-0.00705,0.08029,-0.00723,-0.01043,-0.02799,0.0365,-0.02117,-0.04057,-0.04899,0.04401,-0.08337,0.03231,0.03249,-0.04379,-0.00659,0.04346,-0.07153,0.02802,0.02886,0.00598,0.05235,0.00944,0.03753,-0.02749,0.00848,-0.05294,0.01081,-0.00508,0.06491,0.04849,0.05791,0.04472,-0.03803,-0.06942,-0.0486,-0.02928,0.02207,0.03948,-0.03856,0.01352,0.04318,0.11903,0.02911,0.01315,0.05915,-0.06168,-0.05808,-0.06919,0.07796,0.01134,-0.03683,0.0084,0.02403,0.03618,-0.05886,0.07431,-0.06454,-0.10762,-0.04832,-0.01214,0.05237,-0.04295,-0.00079,0.11973,-0.06713,0.08064,-0.06257,0.05179,0.0106,-0.1031,-0.04593,-0.08858,-0.1135,-0.00087,0.0874,0.0289,-0.034,0.04646,-0.04716,0.07808,-0.07863,-0.04669,0.06207,0.0211,-0.07824,0.0472,-0.06674,-0.04121,0.01527,0.05615,0.0161,-0.03755,-0.03581,0.01189,-0.0772,0.04798,-0.06548,0.06338,0.00684,-0.0624,-0.08527,-0.06502,-0.0701,0.06112,0.05589,0.00684,0.03394,0.04417,0.05658,0.02499,0.03166,0.03144,0.05397,-0.0322,-0.01402,-0.0271,0.00847,-0.06885,0.09158,-0.02689,0.01704,0.0542,0.03274,0.04766,-0.01378,0.03899,-0.0154,0.01762,-0.00094,0.07286,0.0129,0.02184,-0.03698,-0.03242,-0.04239,0.05639,0.06465,-0.00837,-0.03943,-0.02742,-0.01813,-0.06398,-0.01015,-0.00535,0.06341,-0.07015,0.00176,-0.03026,0.05976,-0.02392,0.08395,0.01133,0.05983,-0.06586,0.05045,0.04371,0.06671,-0.01316,0.00329,-0.05938,-0.03712,-0.07202,-0.05562,-0.07747,-0.01618,-0.06079,-0.01029,0.00593,0.04902,-0.0471,-0.09654,-0.01391,-0.00516,-0.06979,0.08157,0.00522,0.03316,-0.02339,-0.03414,0.05042,0.01893,0.04568,0.02365,-0.06946,0.08689,-0.03623,0.04279,0.03325,-0.04536,-0.07573,0.01809,0.01499,-0.00016,0.00258,0.04927,-0.0309,-0.00575,0.04119,-0.00706,0.03852,-0.07942,-0.06633,0.07683,0.05958,-0.09522,-0.07023,0.06235,-0.01938,0.01143,-0.03343,-0.08801,-0.08285,-0.07482,-0.00948,0.03713,0.0219,-0.07028,-0.04087,-0.04239,0.03628,-0.03925,0.03534,-0.06122,-0.07227,0.0414,-0.04279,0.04369,0.07447,-0.06354,-0.04487,-0.01827,-0.00937,0.08336,0.08923,0.07851,-0.07061,0.04731,0.02632,-0.05755,0.02974,0.03066,0.0649,0.00382,-0.06957,-0.04788,-0.02993,-0.03348,-0.08106,0.03184,-0.02146,-0.00642,-0.0358,-0.03799,0.06111,0.06728,-0.04501,-0.04562,0.06543,0.03725,0.08373,0.10684,0.07928,-0.03845,-0.01013,0.05774,0.012,-0.0719,-0.04092,-0.07796,0.06607,0.00542,0.09259,0.03959,0.05035,-0.01072,-0.05004,0.05122,-0.00527,-0.08624,0.02054,0.02392,-0.09772,0.03372,-0.00606,0.02233,0.01937,0.02075,0.04461,0.03817,-0.03311,-0.0157,0.0482,0.06771,0.0096,0.063,-0.07615,-0.05872,-0.07611,-0.07386,0.00539,-0.0741,0.03078,0.05211,-0.06335,-0.00931,0.05938,-0.00165,0.05615,-0.04503,-0.02502,-0.00572,-0.04342,-0.04762,-0.03374,0.09357,-0.00158,-0.00887,0.04906,0.03533,-0.07225,0.03218,-0.05972,-0.03626,0.02741,-0.06113,-0.03562,0.05153,0.04429,-0.10848,0.02812,0.03985,0.00335,0.06523,-0.08599,-0.01069,0.05267,0.05398,-0.0505,-0.04537,0.03877,0.01319,0.03484,0.03929,-0.04302,-0.00125,0.06783,-0.02512,0.07227,0.07459,-0.03873,-0.00175,-0.06612,-0.00244,-0.02882,0.03191,-0.06326,-0.08937,0.07989,0.04798,0.08604,0.05206]},{"id":"lang-italiano#0","docId":"lang-italiano","title":"Lingua: Italiano","category":"languages","tags":["language","italiano"],"text":"Livello: Madrelingua Lingua madre, comunicazione professionale e tecnica.","vec":[0.07105,-0.04829,-0.05736,-0.0649,0.07779,-0.02975,0.00051,0.04642,0.06559,-0.00231,0.05398,-0.02593,0.08265,-0.03716,0.03296,0.07749,0.06137,-0.03431,-0.02179,-0.0339,0.06645,-0.01459,-0.06848,0.03871,0.06185,0.01187,0.03251,0.01954,0.03046,-0.06152,-0.01061,-0.01764,0.05911,-0.06114,0.04599,0.03224,-0.03855,-0.08593,0.06554,-0.13127,-0.01863,0.02377,0.08199,0.07608,0.04697,0.08025,-0.01002,0.06392,-0.04909,0.0022,-0.02001,0.05173,0.07014,0.07248,0.05362,-0.06345,-0.03868,-0.00631,-0.01594,-0.00376,0.04639,-0.01804,-0.00425,0.05806,0.08147,0.04296,0.02444,0.06974,-0.03043,-0.0481,-0.05547,0.04225,-0.02488,-0.03865,-0.01573,-0.01882,0.06348,-0.10916,0.07742,-0.0933,-0.06386,-0.07215,-0.04074,0.04056,-0.07898,0.05994,0.02243,-0.02956,0.05709,0.01322,0.05987,0.0618,-0.0321,-0.05656,-0.06386,-0.03376,-0.0418,0.09476,0.06245,-0.01489,0.02542,-0.0202,0.05759,-0.06848,-0.04915,0.0226,0.07088,-0.0587,0.07325,-0.05984,-0.00037,0.01803,0.05495,0.02965,-0.07551,-0.06705,-0.01692,-0.06623,0.01114,-0.07732,0.03075,-0.0089,-0.02771,-0.07472,-0.06592,-0.06657,0.05742,0.01274,0.02174,0.02919,0.00507,0.05247,-0.00499,0.06326,0.03887,0.08519,-0.02785,0.00067,-0.00428,-0.02973,-0.05174,0.04485,-0.07226,0.03565,0.0295,-0.01076,0.05869,-0.00502,0.07719,-0.0851,0.00207,-0.02326,0.0614,0.03917,0.03586,-0.03984,-0.06491,-0.06569,0.04831,0.06901,-0.05662,-0.03705,-0.07243,-0.03819,-0.058,-0.10022,0.05161,0.03224,-0.06157,0.00144,-0.01961,0.04441,-0.04521,0.05235,0.03645,0.00679,-0.09558,0.05499,0.08949,0.0299,-0.00712,-0.05878,-0.04582,-0.04872,-0.11105,-0.08421,-0.03503,0.02046,0.02711,-0.07076,0.00087,0.04269,-0.00968,-0.06592,-0.05419,0.05019,-0.09921,0.04539,0.02585,0.04171,-0.05793,-0.05294,0.03333,0.00729,0.03108,0.0558,-0.08964,0.03583,-0.0475,0.0837,0.02324,-0.03952,-0.05676,0.03421,-0.03496,0.0043,0.00294,0.05309,-0.01747,0.0461,0.04165,-0.03368,0.08299,-0.05702,-0.03143,0.04465,0.03451,-0.05428,-0.04384,0.01981,-0.02198,0.00363,-0.06812,-0.06605,-0.05245,-0.06356,0.04981,0.01491,0.00593,-0.01935,0.00399,-0.03273,0.03063,-0.05428,0.05257,-0.06801,-0.05458,0.07806,-0.0208,0.11368,0.05716,-0.08131,-0.04309,-0.04843,0.03224,0.01008,0.06555,0.07832,-0.05879,-0.01689,0.00917,-0.04333,0.04413,0.04041,0.08037,0.04197,-0.07365,-0.03407,-0.03963,-0.0717,-0.03914,0.01051,0.03113,-0.0185,-0.05171,-0.04169,0.01741,0.04447,-0.04199,-0.00146,-0.0083,-0.01162,0.0366,0.05746,0.05938,-0.03627,-0.02471,-0.00494,-0.00964,-0.07119,-0.03685,-0.0405,0.0632,-0.03445,0.01199,0.00742,0.02891,0.03678,-0.06049,0.04688,0.00796,-0.01775,0.00487,0.01332,-0.09038,0.00157,0.0033,0.00343,0.01812,0.02112,0.07021,0.0411,-0.03699,0.017,0.07664,0.00145,-0.0038,0.09612,-0.03473,-0.0593,-0.09826,-0.07484,0.00912,-0.03305,0.01917,0.05754,-0.07776,-0.01391,0.06515,-0.00697,0.02975,0.00046,-0.00314,0.01503,-0.0071,-0.0157,-0.08256,0.06578,-0.06093,-0.05072,0.06894,0.03845,-0.04939,0.06001,0.00582,-0.04693,0.04493,-0.00378,0.00984,0.07606,0.04804,-0.10475,0.04475,0.04744,0.032,0.08504,-0.05638,0.04125,0.04466,0.05489,-0.05728,-0.09481,0.02131,0.08571,0.0513,0.00555,0.02302,-0.05794,0.03597,-0.06473,0.02687,0.07463,-0.06222,-0.0457,-0.01398,-0.02961,-0.08064,0.02867,-0.06549,-0.05197,0.02633,0.04348,0.12045,0.05715]},{"id":"lang-inglese#0","docId":"lang-inglese","title":"Lingua: Inglese","category":"languages","tags":["language","inglese"],"text":"Livello: B1 - Base Lettura documentazione tecnica, comunicazione scritta e meeting internazionali.","vec":[0.04515,-0.04492,-0.06042,-0.06286,0.08177,-0.03981,-0.0227,0.07291,0.05579,-0.02375,0.06882,-0.02183,0.07001,-0.01786,0.00683,0.06186,0.05008,-0.04435,-0.04151,-0.03228,0.03311,-0.0167,-0.06423,0.02118,0.06637,0.01897,0.01614,0.02657,0.00944,-0.06163,-0.03578,-0.02654,0.06145,-0.09602,0.06343,0.04197,0.0002,-0.08396,0.04118,-0.09628,-0.01333,0.02065,0.01553,0.0714,0.05654,0.10528,-0.01622,0.06926,-0.03001,-0.02468,0.00538,0.05887,0.08089,0.04878,0.04154,-0.05391,-0.0431,-0.04081,-0.04066,-0.00163,0.05439,-0.05083,0.01602,0.03171,0.05651,0.05628,0.04008,0.04955,-0.03327,-0.05475,-0.06768,0.06373,-0.02961,-0.05296,0.01902,0.01183,0.05932,-0.07335,0.03058,-0.06658,-0.10783,-0.07601,-0.05629,0.04916,-0.0979,0.07216,0.011,-0.04096,0.07509,-0.01729,0.04029,0.06462,-0.04827,-0.02048,-0.0831,-0.03711,-0.03168,0.08738,0.03981,-0.00162,0.03291,-0.05252,0.06549,-0.05565,-0.06283,0.03492,0.02952,-0.05147,0.0497,-0.05282,-0.01376,0.02513,0.02583,0.02676,-0.03188,-0.05871,-0.00473,-0.04983,0.0268,-0.03213,0.01834,0.00304,-0.02773,-0.06018,-0.07547,-0.04781,0.0369,0.04856,-0.00487,-0.00894,0.00524,0.06895,-0.00451,0.06139,0.01488,0.10297,-0.04573,0.01679,0.01833,-0.01681,-0.04761,0.04163,-0.05515,0.04236,0.01073,0.01616,0.07087,-0.00103,0.068,-0.07024,-0.00799,-0.06687,0.05797,0.0451,0.02423,-0.02935,-0.06301,-0.06457,0.07573,0.09028,-0.09005,-0.04065,-0.06428,-0.07183,-0.08233,-0.05772,0.03107,0.04656,-0.05812,0.01942,-0.02691,0.06842,-0.0423,0.05533,0.02342,0.01881,-0.08279,0.031,0.09772,0.04201,0.02557,-0.0155,-0.03703,-0.05216,-0.09028,-0.07561,-0.01804,0.00885,0.01149,-0.05836,0.01911,0.02929,-0.00017,-0.08962,-0.0683,0.03116,-0.07438,0.07642,0.05068,0.03425,-0.05934,-0.02885,0.04587,0.00276,0.06574,0.05935,-0.07092,0.0311,-0.05781,0.06505,0.0225,-0.03836,-0.04583,0.03974,-0.00322,0.00437,-0.02949,0.01908,-0.03219,0.05622,0.0809,-0.0079,0.05684,-0.05159,-0.03264,0.00737,0.07131,-0.08595,-0.06236,0.04322,-0.01387,-0.01817,-0.08364,-0.09211,-0.02577,-0.0389,0.02874,0.03882,0.01783,-0.03425,-0.00472,-0.03347,0.04164,-0.08676,0.03018,-0.03748,-0.02796,0.06732,-0.02957,0.09241,0.04923,-0.10295,-0.07035,-0.03155,0.04514,0.03994,0.06609,0.05695,-0.03631,0.00547,0.02031,-0.08086,0.05823,0.04463,0.04723,0.08963,-0.08149,-0.00458,-0.05433,-0.06684,-0.02683,0.02218,0.0386,-0.04706,-0.04398,-0.05563,0.01845,0.03037,-0.04364,-0.02807,0.04722,0.00344,0.05017,0.06834,0.05518,-0.00157,-0.03503,0.05205,-0.02004,-0.04825,-0.02835,-0.05746,0.0519,-0.02416,0.04659,0.02214,0.01507,0.01804,-0.05568,0.0528,0.00058,-0.05392,0.01693,0.02729,-0.07818,-0.00536,0.02228,-0.01835,0.02638,0.03725,0.05395,0.04907,-0.03828,-0.03326,0.09884,0.05585,0.00403,0.08265,-0.07752,-0.08082,-0.07078,-0.0802,0.01147,-0.01569,0.03204,0.07428,-0.06323,-0.04231,0.07915,-0.00885,0.04594,0.0049,-0.04775,-0.00116,-0.01049,-0.02393,-0.05791,0.07136,-0.05556,-0.03477,0.01552,0.06614,-0.05315,0.05894,-0.02814,-0.05852,0.02846,-0.03073,-0.00274,0.06541,0.05323,-0.1198,0.06885,0.06354,-0.00328,0.09645,-0.06645,0.0273,0.06931,0.04655,-0.06424,-0.0769,0.01365,0.06025,0.049,0.01949,0.01389,-0.0447,0.04603,-0.0458,0.0341,0.08088,-0.06388,-0.03575,-0.04004,-0.06746,-0.04929,0.03839,-0.06317,-0.04052,0.02234,0.07396,0.05438,0.06649]},{"id":"bio-vision#0","docId":"bio-vision","title":"Profilo professionale e Informazioni Personali","category":"bio","tags":["bio","vision","location"],"text":"Sviluppo sistemi di raccomandazione LLM-driven, architetture multi-agente e automazioni workflow con Python e LangGraph. Nome: Vito Piccolini. Ruolo: AI Developer / Studente in Computer Science – AI. Vive a: Noicattaro, Provincia di Bari (Italia). Dopo la laurea triennale in Informatica (107/110) sto proseguendo con la LM-18 in Computer Science – Artificial Intelligence presso l'Università di Bari.","vec":[0.0074,-0.01894,-0.06177,-0.07145,0.03434,-0.03515,0.00907,0.07283,0.03048,-0.02038,0.05957,-0.00233,0.04935,-0.03512,-0.01564,0.05693,0.09534,-0.05469,-0.06624,-0.05215,0.04202,0.04204,-0.07301,0.05122,0.08126,0.03061,-0.05808,0.0182,0.02816,-0.05355,-0.02355,-0.02509,0.06688,-0.07125,0.05383,0.02444,-0.03206,-0.09278,-0.00119,-0.07954,-0.02334,0.00449,0.05344,0.03666,0.02084,0.05588,-0.00315,0.0161,-0.02655,0.01436,-0.05073,0.07953,0.0486,0.02111,0.06531,-0.02522,-0.04998,-0.05223,-0.04271,0.02524,0.05097,-0.0262,0.01371,0.03754,0.0375,0.05144,0.01668,0.06122,-0.1117,-0.07824,-0.07838,0.02552,0.02855,-0.06103,0.03497,0.01608,0.03651,-0.06671,0.03968,-0.05892,-0.06389,-0.05779,-0.00109,0.09184,-0.05391,0.03727,0.08767,-0.10646,0.06605,-0.05216,0.04485,0.07939,-0.09232,-0.04078,-0.04973,-0.0472,-0.0451,0.10221,0.07716,-0.02613,0.02115,-0.04338,0.05779,-0.09727,-0.01907,0,0.02026,-0.05903,0.0526,-0.09996,-0.03449,0.07154,0.02485,0.04029,-0.12046,-0.02353,-0.01728,-0.02026,0.05832,-0.07642,0.08572,-0.05955,-0.06829,-0.07854,-0.02455,-0.05675,0.00203,0.08903,0.06699,0.02802,0.02684,0.05271,0.01992,0.03886,0.06428,0.05601,-0.04253,-0.01406,-0.04693,-0.03823,-0.00389,0.03928,-0.05347,0.01149,0.03296,0.01403,0.06926,-0.04994,0.07826,-0.0259,0.03751,-0.03722,0.0222,0.04311,0.08196,-0.04017,-0.04881,-0.08718,0.05963,0.07576,-0.06169,-0.05177,-0.00526,-0.03429,-0.04177,-0.0502,0.01462,0.07606,-0.03925,-0.01982,-0.02447,0.05641,-0.05721,0.09316,-0.01002,0.04392,-0.06697,0.02877,0.09583,0.02359,-0.02738,-0.02246,-0.10091,-0.0647,-0.04336,-0.08857,-0.01748,0.02551,0.01901,-0.07702,0.01565,0.06367,-0.05943,-0.09146,-0.015,0.06091,-0.03973,0.033,0.02935,0.06397,-0.00167,-0.02921,0.04065,0.04902,0.06377,0.02236,-0.04684,0.03182,-0.01886,0.04685,0.02526,-0.04232,-0.02266,0.04368,0.02317,-0.00949,-0.00163,0.08357,-0.05492,0.05203,0.07099,-0.02039,0.03353,-0.01506,-0.0059,0.03023,0.05631,-0.07902,-0.04946,0.03452,-0.06877,0.00423,-0.10487,-0.13698,-0.02524,-0.0634,0.03994,0.06716,0.02886,-0.06631,-0.05039,-0.05939,-0.00402,-0.0048,0.05064,-0.02807,-0.03292,0.04876,-0.00035,0.06872,0.0932,-0.08247,0.00938,-0.0311,-0.04693,0.04635,0.06506,0.02801,-0.05584,0.01146,0.00225,-0.04979,0.05666,0.00045,0.04138,0.00856,-0.07268,-0.00681,-0.03704,-0.0502,-0.02594,0.02326,0.00956,-0.07385,-0.03723,-0.03528,0.04625,0.06059,-0.05797,-0.05192,0.07314,0.05469,0.05262,0.10171,0.05389,-0.04817,-0.01692,0.07553,-0.01798,-0.04136,-0.03004,-0.04658,0.04003,-0.02499,0.07452,0.02102,0.00419,0.06409,-0.01812,0.07624,0.00709,-0.04403,0.04271,0.00233,-0.05428,0.03091,0.01105,0.02433,0.04869,0.02684,0.0461,0.03353,-0.03141,0.01413,0.03984,0.04047,-0.03054,0.03394,-0.07116,-0.01604,-0.05145,-0.06477,-0.0507,-0.05715,0.02906,0.078,-0.1011,0.00432,0.04337,-0.00447,0.00437,0.00844,-0.0493,0.06463,-0.05368,-0.0501,-0.03149,0.04492,-0.02954,-0.02272,0.03394,0.03434,-0.05467,0.02735,-0.04251,-0.07684,0.02884,-0.01327,-0.05917,-0.00363,0.02834,-0.1023,0.07995,0.04144,-0.01834,0.07904,-0.04537,0.04133,0.05237,0.04002,-0.01914,-0.09718,0.00245,0.05599,0.03949,0.00264,-0.00215,-0.02149,0.03741,-0.03042,0.04983,0.06317,-0.02072,-0.01192,-0.04079,-0.05031,-0.04534,-0.02448,-0.03928,-0.07078,0.09421,0.001,0.07454,0.06153]},{"id":"bio-vision#1","docId":"bio-vision","title":"Profilo professionale e Informazioni Personali","category":"bio","tags":["bio","vision","location"],"text":"Dopo la laurea triennale in Informatica (107/110) sto proseguendo con la LM-18 in Computer Science – Artificial Intelligence presso l'Università di Bari. Durante il tirocinio nel laboratorio LACAM-SWAP ho sviluppato un'architettura multi-agente basata su LLM, orchestrata con LangGraph, ottenendo +12% di diversità e +53% precision@1. Competenze in Python, LangChain, LangGraph, React, Node.js e n8n per prototipazione rapida in team multidisciplinari.","vec":[0.01794,-0.00822,-0.06133,-0.04389,0.07906,-0.07907,0.03519,0.06426,0.02279,-0.0197,0.06407,0.03082,0.05724,-0.01904,-0.00316,0.08353,0.08928,-0.07024,-0.07808,-0.03921,0.0154,0.02228,-0.04062,0.01876,0.05848,0.03183,-0.00433,0.02088,0.0367,-0.05307,-0.03031,-0.03493,0.08119,-0.03119,0.03389,0.0412,-0.03094,-0.05289,0.04602,-0.07823,-0.00542,0.0368,0.07204,0.06355,0.00573,0.05888,-0.02839,0.04304,-0.03961,-0.0256,-0.03805,0.06517,0.07596,0.06572,0.0504,-0.03378,-0.05517,-0.08566,-0.04107,0.04251,0.05865,-0.04965,0.00648,0.02646,0.07945,0.0807,0.0222,0.04001,-0.12686,-0.09227,-0.05974,0.02552,0.01019,-0.08098,-0.01411,0.02158,0.05835,-0.05982,0.02876,-0.05488,-0.085,-0.02236,-0.02675,0.04176,-0.06482,0.03783,0.0469,-0.06957,0.03896,-0.03121,0.0431,0.0516,-0.03478,-0.02932,-0.0334,-0.0771,-0.05379,0.09641,0.04793,-0.03302,0.01886,-0.03788,0.04961,-0.08241,-0.0306,0.00517,-0.00093,-0.0397,0.0272,-0.06068,-0.0067,0.08969,0.03111,0.03617,-0.07887,-0.06952,-0.01123,-0.02842,0.07314,-0.07558,0.07468,-0.06909,-0.08653,-0.05587,-0.03828,-0.00728,0.01742,0.09376,0.04743,0.02294,0.02295,0.03728,0.00662,0.05906,0.10069,0.08585,-0.0596,0.02292,-0.0268,-0.06836,-0.04929,0.0445,-0.08747,0.02067,0.05386,0.047,0.09599,-0.07113,0.06864,-0.07677,0.03164,-0.00804,0.02567,0.03515,0.04672,-0.03161,-0.06464,-0.0604,0.05422,0.04047,-0.07095,-0.05636,-0.02519,-0.03202,-0.04644,-0.04933,0.02688,0.06107,-0.03204,-0.00354,-0.044,0.06903,-0.02444,0.08024,-0.03968,0.01014,-0.05849,0.04323,0.09099,0.02314,-0.0609,-0.0192,-0.09875,-0.0446,-0.06092,-0.06055,-0.04949,0.00613,0.01463,-0.04052,0.02374,0.01677,-0.04399,-0.09458,-0.00555,0.05525,-0.03163,0.03672,0.05309,0.08508,0.0063,-0.02889,-0.00576,0.01133,0.0646,0.04672,-0.09221,0.02214,-0.02679,0.00595,0.02016,-0.01684,-0.0453,0.0455,0.02326,-0.03764,-0.02107,0.04912,-0.02973,0.03001,0.05335,-0.05358,0.04234,-0.02518,-0.02008,0.02365,0.04559,-0.06021,-0.05937,0.02782,-0.07613,-0.00108,-0.04478,-0.10477,-0.01713,-0.07738,0.02628,0.05427,0.02402,-0.0393,-0.07663,-0.06667,-0.00117,-0.00265,0.03942,-0.02983,-0.01261,0.01683,-0.02837,0.0773,0.09148,-0.09087,-0.02878,-0.03736,0.00034,0.02756,0.06059,0.02612,-0.04719,0.02892,0.01846,-0.02875,0.06245,0.04044,0.05866,0.01733,-0.08659,-0.02233,-0.02191,-0.09437,-0.02051,0.00515,0.02041,-0.02783,-0.03537,-0.07354,0.03206,0.08875,-0.05558,-0.04934,0.08053,0.04262,0.05868,0.09166,0.04916,-0.00781,-0.02115,0.06142,0.01368,-0.04958,-0.02171,-0.0425,0.0772,-0.03765,0.10723,0.03311,0.00679,0.04896,-0.03492,0.03763,0.01072,-0.00034,0.02557,0.02303,-0.03763,0.05188,0.02012,0.00704,0.0512,-0.00904,0.06567,0.02384,-0.04543,-0.00351,0.04435,0.03905,0.00742,0.01855,-0.08839,-0.05579,-0.06079,-0.0576,-0.02788,-0.06206,0.0056,0.09118,-0.10281,-0.03367,0.08292,-0.03479,0.0365,0.00894,-0.05555,0.041,-0.06752,-0.035,-0.01041,0.08365,-0.0202,-0.00811,0.06178,0.05437,-0.09125,0.04109,-0.02605,-0.08139,0.0501,-0.00161,-0.03364,0.00261,0.05733,-0.12243,0.05405,0.06183,-0.04244,0.04993,-0.0602,0.02994,0.07579,0.06791,-0.02686,-0.07726,0.02024,0.03221,0.02227,-0.00521,-0.01065,-0.0393,0.02591,-0.02745,0.07317,0.06593,-0.04699,-0.05909,-0.0336,-0.01421,-0.02952,0.01864,-0.04735,-0.09036,0.04781,0.00417,0.07564,0.03372]},{"id":"education-track#0","docId":"education-track","title":"Percorso formativo e Istruzione","category":"education","tags":["education","degree","diploma","maturità","scuola","voto"],"text":"Laurea in Informatica, Laurea Magistrale in AI, Diploma (Maturità). LM-18 · Computer Science – AI (Università degli Studi di Bari Aldo Moro · Da Ottobre 2025). Laurea L-31 · 107/110 (Informatica e Tecnologia per la Produzione del Software · UniBa (2022-2025)). Diploma · Amministrazione, Finanza e Marketing · 75/100 (I.I.S.S Alpi-Montale, Rutigliano (BA) · 2011-2016)","vec":[0.02078,-0.01213,-0.04704,-0.07341,0.03486,-0.05967,-0.02634,0.07204,0.07001,-0.00406,0.06083,-0.0094,0.04942,-0.02995,0.00636,0.02228,0.06497,-0.03984,-0.02255,0.00965,0.04006,0.01025,-0.06016,0.0249,0.04723,0.02817,0.00404,-0.01413,0.00955,-0.03678,-0.07661,-0.0412,0.07313,-0.09173,0.06631,0.01339,-0.06422,-0.00884,0.0017,-0.06306,-0.02488,0.01246,0.05811,0.09176,0.00489,0.08212,-0.0504,0.0285,-0.04212,-0.03568,-0.05543,0.08051,0.09772,0.06791,0.03754,-0.04338,-0.02283,-0.091,-0.019,0.01678,0.05388,-0.02097,0.00278,0.04519,0.0649,0.02538,0.03631,0.03208,-0.08353,-0.09454,-0.02686,0.0122,0.02694,-0.06257,-0.00173,0.03316,0.07067,-0.03199,0.00353,-0.06356,-0.08795,-0.02586,-0.04899,0.04938,-0.05998,0.05449,0.04225,-0.01976,0.04724,-0.00799,0.06042,0.07986,-0.06343,-0.04623,-0.02916,-0.03205,-0.05374,0.08879,0.02889,-0.00517,0.00636,-0.07312,0.0889,-0.08635,-0.02427,0.03047,0.01152,-0.05209,0.05334,-0.08608,-0.0494,0.056,0.02373,0.07616,-0.10412,-0.0507,-0.06566,-0.05424,0.07042,-0.06813,0.06767,-0.06444,-0.08531,-0.07738,-0.08384,-0.03744,0.03235,0.04464,0.03198,0.03294,0.04696,0.05455,0.00236,0.05666,0.06152,0.08244,-0.08053,0.0034,-0.018,-0.05668,-0.02809,0.02581,-0.05378,0.01648,0.02751,0.02405,0.10875,-0.04116,0.04317,-0.07945,0.01182,-0.01945,0.01659,0.04805,0.06526,-0.05869,-0.09957,-0.06923,0.05617,0.03049,-0.04939,-0.01622,-0.01852,-0.0669,-0.04996,-0.00286,0.02898,0.01801,-0.05409,-0.0351,-0.03635,0.05187,-0.05895,0.09842,0.00794,0.01503,-0.06624,0.0431,0.11617,0.05357,-0.01412,-0.05458,-0.07564,-0.03295,-0.08691,-0.07656,-0.02124,0.0227,0.00098,-0.092,0.01089,0.01591,-0.03511,-0.0842,-0.02644,0.06381,-0.07406,0.0622,0.02977,0.05741,-0.02754,-0.00677,0.07328,-0.00745,0.03266,0.05415,-0.03942,0.053,-0.02615,0.04003,0.03677,-0.01262,-0.05108,0.0149,0.0023,0.00216,0.02007,0.04233,-0.02008,0.05249,0.02754,-0.02519,0.07088,-0.05487,0.00371,0.01134,0.06408,-0.08952,-0.07642,0.07513,-0.05863,-0.02092,-0.03236,-0.08973,-0.03583,-0.03394,0.02501,0.07198,0.03912,-0.04164,-0.05754,-0.05307,-0.01597,-0.02574,0.03711,-0.03477,-0.01069,0.01479,-0.00485,0.04717,0.11448,-0.10322,-0.07139,-0.03232,0.00876,0.01128,0.0339,0.02732,-0.02305,0.01455,0.02717,-0.01517,0.08639,0.0696,0.06471,0.02024,-0.05655,-0.02026,-0.06019,-0.07692,-0.04142,0.0025,0.06932,-0.03226,-0.045,-0.03745,0.02691,0.07903,-0.04407,-0.01987,0.05973,0.02612,0.07684,0.08999,0.03733,-0.02334,-0.0225,0.07111,-0.01202,-0.07267,-0.05886,0,0.04215,-0.0279,0.0703,0.01748,0.00987,0.02836,-0.05991,0.06941,0.00445,-0.04913,0.06906,0.03282,-0.07893,0.03045,0.02424,-0.00396,0.00448,0.00092,0.04665,0.04481,-0.05482,-0.00428,0.03143,0.0539,0.01339,0.0918,-0.05025,-0.03839,-0.04688,-0.08523,-0.0161,-0.03446,0.04802,0.08256,-0.09535,0.01538,0.04044,-0.03685,0.04075,-0.02683,-0.04467,0.0606,-0.02569,-0.02264,0.01675,0.07643,-0.03654,-0.03455,0.01807,0.07723,-0.06631,0.03523,-0.04356,-0.07311,0.03323,-0.0128,-0.04121,0.03221,-0.0009,-0.10042,0.05364,0.07295,-0.06336,0.04193,-0.06602,0.03947,0.06412,0.06269,-0.0302,-0.06615,0.02997,0.05301,0.01408,0.02857,0.04518,-0.03079,0.05159,-0.06739,0.03021,0.08047,-0.057,-0.02623,-0.02699,-0.04452,-0.03598,-0.00165,-0.05492,-0.06769,0.06042,0.03268,0.09381,0.0364]},{"id":"timeline-1#0","docId":"timeline-1","title":"Esperienza: Talent Program \"Next Pulse\"","category":"experience","tags":["experience","work","hackathon"],"text":"Sviluppo backend in team per EnLexi: un AI Sales Assistant multi-sorgente. Data: Giugno 2026. Luogo: Chieti. Dettagli: Bootcamp selettivo intensivo su scala nazionale (320 candidati). Implementazione pipeline di retrieval ibrida (BM25 + ChromaDB/FAISS) con FastAPI.","vec":[0.05281,-0.01057,-0.02089,-0.05394,0.08604,-0.04894,0.00099,0.02097,0.00357,-0.02246,0.08737,-0.01034,0.08823,-0.04253,-0.0013,0.00995,0.07477,-0.05773,-0.06036,-0.06827,-0.00635,0.01558,-0.07574,0.02541,0.06728,0.01554,-0.04235,0.04377,0.06803,-0.04268,-0.02671,-0.04204,0.05642,-0.11042,0.0611,0.00579,-0.05087,-0.05935,0.03857,-0.07964,-0.01045,0.02067,0.01851,0.04964,0.05835,0.08038,0.01526,0.07053,-0.04733,-0.02599,-0.03386,0.07228,0.04079,0.04461,0.00782,0.00551,-0.078,-0.08757,-0.05428,0.0076,0.0216,-0.02791,-0.00372,0.06734,0.07644,0.06898,0.00321,0.03562,-0.0739,-0.02077,-0.04243,0.06141,-0.00822,-0.06416,-0.03271,0.03954,0.06296,-0.061,0.04893,-0.02004,-0.12504,-0.03754,-0.00482,0.00175,-0.02419,0.04558,0.05831,-0.083,0.04178,-0.00823,0.07619,0.04953,-0.02677,-0.05759,-0.05547,-0.09029,-0.04531,0.05763,0.05624,-0.04174,0.02977,-0.06347,0.04689,-0.12113,-0.03735,0.04681,0.0246,-0.07381,0.07241,-0.05014,-0.0589,0.06127,0.03013,0.0466,-0.0855,-0.02407,-0.00898,-0.0657,0.04637,-0.02288,0.0797,0.00422,-0.05546,-0.11124,-0.07287,-0.03215,0.00596,0.05672,0.0195,-0.00841,-0.00388,0.06088,0.01231,0.04736,0.07009,0.07735,-0.07258,-0.00984,-0.01066,-0.05909,-0.03106,0.047,-0.05253,0.02392,0.03748,0.03968,0.09554,-0.0699,0.0355,-0.06088,0.06552,-0.03609,0.03043,0.015,0.04301,-0.049,-0.09609,-0.00885,0.05822,0.09642,-0.06306,-0.05294,-0.05899,-0.00133,-0.08626,-0.02594,0.01048,0.04707,-0.08889,-0.00343,-0.07719,0.06548,-0.06355,0.1054,-0.0084,0.0192,-0.06324,0.07037,0.07793,0.04969,-0.03968,-0.02963,-0.08306,-0.07206,-0.07001,-0.02324,-0.04276,0.03183,-0.00618,-0.03303,0.01981,0.05867,-0.04093,-0.04201,-0.00587,0.06,-0.01522,0.03754,0.05178,0.01975,0.01475,-0.02414,0.03861,0.01937,0.0525,0.0149,-0.05664,0.01742,-0.06254,0.09697,0.00807,-0.02864,-0.0151,0.04001,-0.00589,-0.01187,-0.02295,0.0387,-0.03291,0.01381,0.08136,-0.00001,0.05217,-0.05121,0.02905,0.04251,0.03999,-0.09302,-0.05271,0.06435,-0.03876,-0.01197,-0.04762,-0.06155,-0.03046,-0.03585,0.02344,0.05102,0.02251,-0.02129,-0.05298,-0.0262,0.04397,-0.04083,0.05871,-0.07722,0.01441,0.00884,-0.02618,0.07156,0.05354,-0.1052,-0.06987,-0.04769,0.00709,0.07678,0.03103,0.05961,-0.10489,0.02849,0.02736,-0.05848,0.10298,0.05866,0.05579,-0.00792,-0.07298,0.04601,-0.04917,-0.01433,-0.03306,0.01868,0.03709,-0.03715,-0.04781,-0.02578,0.03643,0.07216,-0.06482,-0.05226,0.07023,0.0213,0.04195,0.05125,0.05492,-0.02967,-0.0537,0.05324,-0.04641,-0.04546,-0.04281,-0.02884,0.0464,-0.01994,0.07405,0.02441,0.05386,0.04798,-0.03787,0.08857,0.0122,-0.00243,0.05197,0.06102,-0.06502,0.02866,0.01773,0.01431,0.03601,0.04317,0.05368,0.06235,-0.06115,-0.03436,0.05379,0.05662,-0.01082,0.03706,-0.07685,-0.01652,-0.08399,-0.11989,-0.02172,-0.02915,0.03871,0.0533,-0.08221,-0.03655,0.05097,-0.00228,0.04054,-0.0368,-0.07178,0.02695,-0.03327,-0.04203,-0.01609,0.06401,-0.0485,-0.02907,0.0037,0.03394,-0.02776,0.06496,-0.02079,-0.04221,0.04591,-0.01855,-0.02542,0.04611,0.00089,-0.11372,0.08132,0.04011,-0.03549,0.09358,-0.08644,0.01491,0.04092,0.00226,-0.04072,-0.05388,0.03416,-0.00178,0.04028,0.01572,0.00374,0.00255,0.01648,-0.0552,0.05133,0.07638,-0.01806,-0.04274,-0.03784,-0.04448,-0.01067,0.00174,-0.02996,-0.05277,0.04581,0.04794,0.06738,0.06363]},{"id":"timeline-2#0","docId":"timeline-2","title":"Esperienza: PugliaHack 2026","category":"experience","tags":["experience","work","hackathon"],"text":"Sviluppo in autonomia di TerraNode, piattaforma per lo smart agri-tourism. Data: Maggio 2026. Luogo: Bari. Dettagli: Stack React 19, TailwindCSS, Supabase (PostgreSQL). Sviluppato in sole 2 ore. Gamification, tracciamento CO2 e dashboard KPI in tempo reale.","vec":[0.02208,-0.00154,-0.01514,-0.04026,0.06568,-0.07891,0.02438,0.01467,-0.01035,-0.00808,0.03666,0.03315,0.04044,-0.04666,-0.02865,0.07806,0.06524,-0.02686,-0.04915,-0.0445,0.01536,0.02739,-0.05688,0.01941,0.10068,0.0607,-0.04535,0.02283,0.04073,-0.03018,-0.03306,-0.02904,0.05708,-0.10158,0.04402,0.02583,-0.03363,-0.05099,0.05113,-0.06921,-0.01203,0.03656,0.04178,0.02581,0.00923,0.11213,-0.02264,0.03642,-0.04766,-0.01282,-0.01912,0.05546,0.08694,0.04819,0.03887,-0.05275,-0.0562,-0.08604,-0.0177,0.03977,0.08089,-0.00763,0.00145,0.03359,0.11355,0.06348,0.02327,0.05932,-0.05482,-0.044,-0.0085,0.04109,0.02327,-0.04793,-0.01367,0.00188,0.08675,-0.0247,0.03224,-0.07273,-0.07978,-0.08106,-0.05557,0.03315,-0.03846,0.04982,0.04986,-0.05857,0.07879,-0.00149,0.06461,0.04364,-0.03957,-0.05744,-0.03258,-0.06296,-0.00431,0.08822,0.03886,-0.05822,0.0637,-0.02712,0.0426,-0.13791,-0.04438,0.03318,0.05898,-0.04439,0.0744,-0.04915,-0.06052,0.04055,0.04804,0.03941,-0.09055,-0.05842,0.00582,-0.09083,0.01013,-0.07248,0.08385,-0.03943,-0.08868,-0.05807,-0.04008,-0.02992,0.03627,0.06063,0.00298,0.03721,-0.00151,0.03153,0.03496,0.04819,0.01739,0.04956,-0.05975,-0.03946,-0.016,-0.03565,-0.00931,0.10028,-0.06447,0.01477,0.0469,0.03542,0.1161,-0.06024,0.07531,-0.01803,0.03083,-0.05191,0.06748,-0.00931,0.07769,-0.03797,-0.09918,-0.06964,0.0645,0.06851,-0.05871,-0.04352,-0.04634,-0.04633,-0.068,-0.05738,0.03861,0.03528,-0.07695,0.00677,-0.0416,0.09616,-0.02381,0.12292,0.00401,0.0463,-0.038,0.04009,0.07099,0.01654,-0.01047,-0.06526,-0.05845,-0.05733,-0.03691,-0.04796,-0.06661,0.00549,0.01142,-0.01229,-0.00261,0.05244,-0.04599,-0.05657,-0.02534,0.07789,-0.02708,0.05658,0.02336,0.05766,0.01876,-0.08131,0.01518,0.03157,0.04667,-0.01462,-0.06068,0.02866,-0.06796,0.03403,0.05031,-0.02861,-0.0466,0.00844,-0.00318,-0.00888,-0.04235,0.12263,-0.01811,0.0817,0.01553,-0.02261,0.03823,-0.05835,0.0082,0.02493,-0.00874,-0.08401,-0.04168,0.06733,-0.00525,-0.0248,-0.08237,-0.11116,-0.0211,-0.03555,0.01797,0.04129,0.02869,-0.04584,-0.05051,-0.00761,0.03913,-0.01469,0.03977,-0.00117,0.02154,0.00153,-0.06688,0.03494,0.07124,-0.09162,-0.07303,-0.04898,-0.01109,0.04187,0.02649,0.02355,-0.05561,0.02233,0.02725,-0.0418,0.08468,0.05366,0.05491,-0.04946,-0.04351,-0.03437,-0.02086,-0.03566,-0.07124,0.01324,0.02453,-0.06853,-0.07648,-0.03769,0.04416,0.08371,-0.07354,-0.03899,0.09307,0.04537,0.04241,0.06896,0.07892,-0.00769,-0.02576,0.08768,-0.0253,-0.05967,-0.05178,-0.02875,0.06351,-0.04846,0.08591,0.03359,0.04003,0.04952,-0.07032,0.0612,0.001,-0.06146,-0.0009,0.03037,-0.06852,0.0273,0.03367,0.03423,0.05463,0.03118,0.04661,0.00507,-0.06683,-0.00348,0.05926,0.10107,-0.03045,0.04194,-0.07037,-0.03042,-0.06329,-0.07737,0.01233,-0.0468,0.03503,0.06089,-0.04687,-0.04174,0.01924,-0.02272,0.05521,0.00038,-0.05987,0.04929,-0.03329,-0.06848,-0.0052,0.06537,-0.06019,-0.02165,0.00078,0.0253,-0.0593,0.05145,-0.02627,-0.06248,0.00033,0.00523,-0.04299,0.01232,-0.0073,-0.10587,0.03811,0.04171,-0.03301,0.05188,-0.07606,-0.038,0.07446,0.03085,-0.02132,-0.00536,0.0296,0.00847,0.03788,0.03619,-0.01986,-0.04342,0.03019,-0.04327,0.0443,0.07631,-0.03155,0.00745,-0.02143,-0.05408,-0.02945,0.04096,-0.06378,-0.08947,0.0448,0.03452,0.04282,0.05015]},{"id":"timeline-3#0","docId":"timeline-3","title":"Esperienza: Hackathon \"Space Edition\"","category":"experience","tags":["experience","work","hackathon"],"text":"2° Classificato all'hackathon nazionale per l'ideazione di The Pulse. Data: Maggio 2026. Luogo: Milano · Talent Garden x Leonardo. Dettagli: Progetto per una costellazione di piccoli satelliti dedicati al monitoraggio agricolo globale. Integrazione di logiche di telerilevamento e Artificial Intelligence.","vec":[0.05318,0.00163,-0.03383,-0.04989,0.09447,-0.05178,-0.00121,0.04383,0.00738,-0.00239,0.04385,0.02512,0.03732,-0.0396,0.0015,0.06956,0.05509,0.00055,-0.06001,-0.06844,0.02112,0.01752,-0.06614,0.03373,0.07054,0.04104,-0.02728,-0.00096,0.03786,-0.01766,-0.01866,-0.02479,0.04317,-0.06981,0.07074,0.01673,-0.04565,-0.07638,0.03091,-0.05414,-0.01803,0.02948,0.02488,0.04335,0.04916,0.09242,-0.04864,0.07762,-0.05226,0.00551,-0.06038,0.06067,0.07401,0.04316,0.06371,-0.01837,-0.05335,-0.09452,-0.04659,0.02577,0.03482,0.01406,-0.00546,0.06493,0.08425,0.0566,0.0558,0.07605,-0.05987,-0.03876,-0.06146,0.04843,0.02078,-0.0532,0.02997,0.01034,0.05322,-0.06747,0.01522,-0.06937,-0.0899,-0.05157,-0.05175,0.01517,-0.0587,0.03073,0.09423,-0.08352,0.0801,-0.04161,0.04584,0.01278,-0.04318,-0.06798,-0.07896,-0.06536,0.00404,0.08485,0.03076,-0.03611,0.04646,-0.03555,0.0325,-0.09342,-0.05001,0.02517,0.06423,-0.05665,0.07328,-0.04498,-0.03598,0.04763,0.03908,0.01473,-0.07398,-0.04883,-0.00843,-0.13195,0.03883,-0.05136,0.09565,-0.0585,-0.04481,-0.06381,-0.08512,0.00036,0.00835,0.07447,0.03023,0.02064,-0.01047,0.04492,-0.00537,0.04362,0.0304,0.06498,-0.05055,-0.02267,0.00508,-0.06158,-0.0439,0.09263,-0.04094,0.01815,0.04418,0.05777,0.09993,-0.05262,0.05032,-0.0326,0.02898,-0.05349,0.03928,0.0228,0.03395,-0.01542,-0.07457,-0.05022,0.07307,0.1156,-0.06466,-0.02657,-0.0495,-0.04763,-0.04642,-0.07667,0.0039,0.02576,-0.08312,0.00129,-0.05415,0.10366,-0.02327,0.10958,-0.00862,0.05484,-0.03716,0.02069,0.08416,0.03347,-0.02299,0.0034,-0.10624,-0.05684,-0.03642,-0.07351,-0.04622,0.00336,0.00413,-0.02881,0.00838,0.06341,-0.03312,-0.05486,-0.03292,0.10073,-0.02573,0.02451,0.06375,0.07985,0.00079,-0.06971,0.00781,0.05231,0.06219,-0.00537,-0.04758,-0.00661,-0.05906,0.04181,0.02456,-0.03532,-0.02535,0.04218,-0.02674,-0.0162,-0.03089,0.08908,-0.03039,0.03454,0.08001,-0.00572,0.08912,-0.06437,-0.00063,0.08147,-0.00483,-0.08497,-0.02005,0.05548,-0.00531,-0.00706,-0.06465,-0.07095,-0.01205,-0.04666,0.01233,0.00901,0.03323,-0.05443,-0.07481,-0.01177,0.00906,-0.05183,0.06274,-0.03863,0.01253,0.02879,-0.06981,0.03952,0.06638,-0.12217,-0.06607,-0.07337,0.0036,0.06278,0.04254,0.02754,-0.0961,0.02112,0.00989,-0.07374,0.09387,0.06968,0.03829,-0.00618,-0.06876,0.01368,-0.04535,-0.01479,-0.04563,0.00723,0.00685,-0.04272,-0.02371,-0.05778,0.0436,0.0706,-0.04925,-0.01529,0.06835,0.03185,0.06399,0.03708,0.09017,-0.03319,-0.04815,0.0579,-0.02578,-0.03152,-0.06212,-0.04077,0.00104,-0.0125,0.0634,0.04418,0.02822,0.05086,-0.05657,0.07747,-0.00877,-0.02601,0.01594,0.03368,-0.0431,0.04697,0.03418,-0.0042,0.05187,0.04931,0.05624,0.01293,-0.07437,0.00652,0.0587,0.0752,-0.01083,0.03738,-0.06447,-0.03669,-0.11687,-0.07818,0.00836,-0.02857,0.00398,0.03758,-0.04458,-0.05905,-0.00325,-0.00068,0.04049,-0.0141,-0.05283,0.04155,-0.01439,-0.05045,-0.02226,0.06459,-0.04994,-0.00187,0.04779,0.04109,-0.0625,0.06422,-0.03239,-0.0537,0.02206,-0.04857,-0.05934,0.01352,-0.01193,-0.09188,0.02897,0.03978,-0.05849,0.06313,-0.09232,-0.02931,0.05968,0.03398,-0.04124,-0.06075,0.02917,0.0249,0.04917,0.03992,-0.00793,-0.05335,0.03655,-0.0133,0.01787,0.05167,-0.02981,-0.0447,-0.01646,-0.01204,-0.00649,0.0141,-0.02632,-0.08455,0.04325,0.04916,0.08239,0.05914]},{"id":"timeline-4#0","docId":"timeline-4","title":"Esperienza: B.Future Challenge 2025 · VAR Group x CRIF","category":"experience","tags":["experience","work","hackathon"],"text":"Partecipante alla challenge aziendale: sviluppo in team di Zenith, assistente AI per consulenza. Data: Settembre–Novembre 2025. Luogo: Bologna · Remote. Dettagli: Workflow automatizzato con n8n, Gemini e Google Drive API. Riduzione stimata dei tempi di reportistica da 7 giorni a 1.","vec":[-0.00579,0.00004,-0.0487,-0.05501,0.08426,-0.06666,0.01689,0.02308,0.01093,0.00399,0.04698,0.00442,0.03791,-0.06369,-0.00405,0.051,0.03472,-0.0207,-0.07613,-0.09143,0.00913,-0.01515,-0.0655,0.07675,0.06294,0.04194,-0.06331,0.00404,0.03548,-0.05258,-0.06953,-0.06866,0.04682,-0.08677,0.07099,-0.00516,-0.03586,-0.04905,0.05124,-0.06041,-0.05597,-0.00058,-0.02389,0.05453,0.03557,0.07751,-0.02527,0.04085,-0.00923,-0.03724,-0.03936,0.05885,0.04664,0.02394,0.06171,-0.01304,-0.02952,-0.08459,-0.04183,0.03287,0.0696,-0.01979,0.03471,0.04178,0.0593,0.07571,-0.01579,0.03634,-0.06603,-0.06451,-0.06138,0.07147,0.02204,-0.06279,0.01982,0.04844,0.0439,-0.06396,0.07583,-0.07306,-0.111,-0.00512,0.0052,0.02747,-0.08179,0.04208,0.01338,-0.03486,0.04691,-0.02451,0.0379,0.0709,-0.07397,-0.06555,-0.05546,-0.05954,-0.05307,0.10096,0.07545,0.02106,0.04054,-0.09994,0.02949,-0.10068,-0.00803,0.03024,-0.0043,-0.06534,0.08646,-0.03728,-0.0792,0.05995,0.03324,0.02725,-0.10693,-0.01591,-0.02681,-0.08787,0.00868,-0.06059,0.08599,-0.00065,-0.03678,-0.0762,-0.07707,-0.06343,0.02437,0.08959,0.04285,0.01031,0.02839,0.03285,0.02039,0.02445,0.07654,0.07186,-0.06089,-0.02475,-0.02556,-0.07294,-0.04389,0.08116,-0.00943,0.05042,0.05856,0.02333,0.10708,-0.02369,0.06076,-0.02711,0.03585,-0.06118,0.05476,0.03619,0.05152,-0.03058,-0.06623,-0.02118,0.04009,0.06747,-0.06818,-0.06146,-0.05021,-0.02926,-0.0198,0.00803,0.03146,0.03034,-0.08511,-0.00902,-0.06664,0.08798,-0.03427,0.1066,0.03642,0.04309,-0.03042,0.06062,0.07919,0.03003,-0.0445,-0.01585,-0.05935,-0.06011,-0.03546,-0.00251,-0.05411,0.00986,-0.00392,-0.04322,0.02136,0.02969,-0.01531,-0.05692,-0.03226,0.0758,-0.06998,0.04192,0.08231,-0.00492,0.00284,-0.05309,0.05742,0.02388,-0.00123,-0.00071,-0.03639,0.02864,-0.08497,0.03892,0.03469,-0.04011,-0.04355,0.02446,-0.03191,-0.04419,-0.01944,0.05359,-0.006,0.03597,0.06481,-0.01618,0.03361,-0.11026,0.01292,0.0165,0.01899,-0.08688,-0.05851,0.04534,-0.04052,0.00301,-0.0654,-0.05103,0.00617,-0.07434,0.03191,0.02429,0.02987,-0.00688,-0.06391,-0.03596,0.02815,-0.01731,0.05812,-0.0455,-0.04423,0.02601,-0.02704,0.03964,0.08389,-0.10431,-0.10227,-0.07847,-0.00645,0.03665,0.01834,0.04692,-0.04188,0.03986,0.02897,-0.03846,0.05982,0.03138,0.05626,0.00555,-0.04531,0.01271,-0.05074,-0.01341,-0.04333,0.01562,0.043,-0.0538,-0.07886,-0.0117,0.01703,0.09863,-0.06213,-0.06786,0.08903,0.0116,0.04241,0.09471,0.06444,0.01431,-0.0272,0.08211,-0.02018,-0.02933,-0.03295,-0.01857,0.06574,-0.00378,0.06873,0.02015,-0.01287,0.05256,-0.04471,0.04991,-0.01607,0.00975,0.02422,0.0265,-0.07782,0.04206,0.02155,0.02261,0.02403,0.00943,0.06934,0.04565,-0.01077,-0.00784,0.0382,0.05679,0.02487,0.04314,-0.08975,-0.05608,-0.07367,-0.03913,-0.01531,-0.06946,0.05543,0.09531,-0.05103,0.00069,0.06019,0.00214,0.0122,-0.04184,-0.082,0.04135,-0.02513,-0.06328,0.00528,0.09611,-0.03028,-0.01789,0.0552,0.04324,-0.05976,0.04852,-0.02227,-0.04188,0.02101,-0.00839,-0.09201,0.01352,0.05046,-0.10757,0.05345,0.0385,-0.02631,0.04801,-0.05307,-0.01817,0.03851,0.02156,-0.04789,-0.01776,0.08005,0.02171,0.03505,0.04513,0.01638,-0.04297,0.03993,-0.0763,0.04674,0.07731,-0.03413,-0.03531,-0.01136,-0.04946,-0.02051,0.01481,-0.06099,-0.074,0.07469,0.05718,0.06631,0.07522]},{"id":"timeline-5#0","docId":"timeline-5","title":"Esperienza: Tirocinio Curriculare · LACAM-SWAP","category":"experience","tags":["experience","work","hackathon"],"text":"Progetto di tesi: Orchestrazione di Agenti LLM per l'Ottimizzazione Multi-Metrica nei Sistemi di Raccomandazione. Data: Marzo–Giugno 2025. Luogo: Università di Bari. Dettagli: Architettura multi-agente LangGraph + RAG Ibrido (BM25 e FAISS). +12% novelty mantenendo inalterata la precisione media del baseline con Llama 3.2 3B.","vec":[0.02359,0.00303,-0.05417,-0.05835,0.09761,-0.05394,0.04884,0.06817,0.01149,-0.02669,0.09053,0.00214,0.05684,-0.02714,0.00398,0.04683,0.08247,-0.05439,-0.07489,-0.053,0.0142,0.01843,-0.05743,0.02979,0.06276,0.03426,-0.0235,0.02392,0.03979,-0.02275,-0.03714,-0.04646,0.08003,-0.03368,0.03049,0.03369,-0.02571,-0.05346,0.01596,-0.06129,-0.00519,0.03012,0.05169,0.0761,0.03441,0.07623,-0.02559,0.03239,-0.00436,-0.02825,-0.0607,0.07873,0.08667,0.06493,0.03706,-0.0539,-0.04504,-0.10977,-0.02815,0.03677,0.05182,-0.02279,-0.00771,0.03783,0.07577,0.094,0.0341,0.05485,-0.08005,-0.09104,-0.06943,0.04327,-0.02941,-0.09068,-0.00019,0.02189,0.08673,-0.07394,0.03353,-0.01607,-0.05938,-0.02373,-0.03412,0.04589,-0.04226,0.07664,0.05357,-0.08127,0.0114,-0.03121,0.02599,0.07233,-0.04005,-0.06059,-0.02268,-0.08205,-0.03713,0.09531,0.06829,-0.03739,0.00346,-0.06189,0.03875,-0.09996,-0.04195,0.00075,0.04342,-0.05729,0.0637,-0.04926,-0.02709,0.04789,0.03102,0.0397,-0.04778,-0.08383,-0.02909,-0.02623,0.04364,-0.07112,0.04877,-0.02703,-0.07358,-0.06905,-0.0406,-0.00803,-0.00545,0.05184,0.0311,0.01135,0.00646,0.01238,0.02325,0.07476,0.08266,0.0702,-0.06102,-0.00105,-0.03837,-0.03115,-0.04774,0.04053,-0.11173,0.02004,0.0457,0.04061,0.10833,-0.04208,0.06511,-0.0273,0.02624,-0.01462,0.0541,0.05932,0.03959,-0.03432,-0.08462,-0.06047,0.06123,0.07221,-0.07765,-0.0385,-0.05386,-0.04796,-0.0405,-0.02865,0.03777,0.0438,-0.04352,-0.02418,-0.05105,0.101,-0.00793,0.08231,0.00851,0.03507,-0.0698,0.03901,0.10041,0.06331,-0.03835,-0.01867,-0.08376,-0.05188,-0.07341,-0.07398,-0.04423,0.00713,0.00461,-0.06166,0.01093,0.04312,-0.06394,-0.05968,-0.00557,0.06449,-0.02465,0.01618,0.0368,0.05159,0.00662,-0.08333,-0.03212,0.038,0.02813,0.06376,-0.06954,0.01933,-0.03892,0.02798,0.01536,-0.01616,-0.02827,0.04097,-0.00697,-0.00711,-0.028,0.05045,-0.01904,0.04296,0.0567,-0.01844,0.0524,-0.05606,0.00886,0.00235,0.05497,-0.07771,-0.07532,0.04384,-0.03337,-0.02249,-0.08929,-0.06912,-0.01087,-0.05105,0.02064,0.07646,0.02345,-0.04744,-0.09355,-0.01879,-0.01876,-0.03247,0.0245,-0.05927,-0.03318,0.03255,-0.0522,0.10452,0.08047,-0.06158,-0.05774,-0.04819,0.00937,0.02666,0.05345,0.01035,-0.0417,0.03942,0.05091,-0.03084,0.07859,0.01897,0.07324,0.0266,-0.08234,-0.02994,-0.04575,-0.05278,0.01026,0.02087,0.01124,-0.02938,-0.04934,-0.05308,0.00785,0.10161,-0.04209,-0.06468,0.07408,0.04184,0.05629,0.04552,0.04713,0.01316,-0.01804,0.0719,-0.03157,-0.05282,-0.04105,-0.00743,0.08497,-0.03493,0.09695,0.06505,0.0098,0.02763,-0.08714,0.0283,-0.01836,-0.00025,0.0207,0.03078,-0.04883,0.03285,0.02517,0.01258,0.07484,0.04741,0.06146,0.02046,-0.07985,0.00605,0.0443,0.03692,0.02941,0.05479,-0.09973,-0.05693,-0.06844,-0.05793,-0.02542,-0.05261,0.06925,0.05069,-0.07813,-0.03522,0.05188,-0.04761,0.03954,-0.00264,-0.05581,0.03647,-0.04157,-0.06507,0.00107,0.06964,-0.05084,-0.00627,0.04328,0.02875,-0.06166,0.08624,-0.0397,-0.0669,0.02771,-0.02009,-0.006,-0.00105,0.01861,-0.13109,0.07722,0.06076,-0.0479,0.06167,-0.0848,-0.00476,0.05705,0.0498,-0.04474,-0.04225,0.02588,0.03778,0.04466,0.01269,-0.0171,-0.04534,0.00679,-0.04306,0.05364,0.02547,-0.05267,-0.01216,-0.00041,-0.0481,-0.02302,0.02142,-0.03752,-0.07019,0.03595,0.00415,0.03536,0.06082]},{"id":"timeline-6#0","docId":"timeline-6","title":"Esperienza: Laurea Triennale L-31 · 107/110","category":"experience","tags":["experience","work","hackathon"],"text":"Informatica e Tecnologia per la Produzione del Software. Data: Settembre 2022–Luglio 2025. Luogo: Università degli Studi di Bari Aldo Moro. Dettagli: Tesi su orchestrazione multi-agente LLM applicata ai sistemi di raccomandazione. Prosecuzione in LM-18 Computer Science – Artificial Intelligence.","vec":[0.01973,-0.00965,-0.06787,-0.08214,0.06453,-0.04445,0.02949,0.03779,0.05239,0.00045,0.06259,0.00107,0.05269,-0.03498,0.00914,0.05368,0.07407,-0.05075,-0.05147,-0.01758,0.05369,0.01476,-0.0493,0.04036,0.06797,0.04544,-0.03909,-0.00113,0.03591,-0.0311,-0.03987,-0.03212,0.04816,-0.07182,0.05787,0.01324,-0.03263,-0.02813,0.00906,-0.02047,-0.02546,-0.00086,0.04772,0.0856,0.01717,0.09863,-0.02551,0.0395,-0.03608,-0.06084,-0.05284,0.06489,0.09035,0.07088,0.03528,-0.01674,-0.04951,-0.07817,-0.02972,0.04823,0.0507,-0.03006,-0.01022,0.05277,0.05783,0.05254,0.03502,0.0332,-0.12487,-0.08856,-0.04743,0.02407,0.02335,-0.07834,0.00518,0.03413,0.07946,-0.06748,0.01858,-0.0592,-0.0711,-0.02921,-0.05214,0.03661,-0.05474,0.02169,0.05645,-0.03296,0.0513,-0.00162,0.03047,0.09581,-0.0453,-0.06759,-0.00386,-0.07202,-0.03792,0.1134,0.02897,-0.02813,-0.00012,-0.05921,0.07531,-0.10825,-0.02501,0.00935,0.02552,-0.07904,0.08799,-0.10269,-0.07019,0.07914,0.05538,0.04081,-0.08202,-0.07043,-0.08139,-0.07367,0.04821,-0.08092,0.10304,-0.06324,-0.08256,-0.08752,-0.05403,-0.04312,0.03408,0.05,0.0597,0.02693,0.02698,0.04099,0.01466,0.05463,0.07242,0.06168,-0.06449,0.00097,-0.04207,-0.04675,-0.05584,0.03211,-0.06574,0.02181,0.03036,0.03728,0.10588,-0.06386,0.05641,-0.0699,0.02039,-0.01757,0.03438,0.04163,0.00482,-0.01895,-0.10548,-0.05906,0.06572,0.02555,-0.0639,-0.02029,-0.02798,-0.05318,-0.0504,0.01064,0.03102,0.03681,-0.04114,-0.00167,-0.03369,0.05953,-0.03568,0.10967,0.01125,0.03612,-0.06911,0.02637,0.12528,0.08087,-0.04615,-0.01459,-0.07107,-0.04003,-0.04953,-0.07985,-0.0364,0.03742,-0.00113,-0.05006,0.00216,0.01897,-0.03048,-0.04935,-0.00504,0.06781,-0.06469,0.04334,0.02387,0.05815,0.01405,-0.03662,0.03709,0.02354,0.02207,0.08074,-0.04532,0.01291,-0.02945,0.03544,0.01767,-0.01012,-0.05898,0.02006,-0.01599,-0.01536,0.00382,0.06742,-0.0231,0.02818,0.04008,-0.03945,0.04816,-0.04191,-0.00923,0.02086,0.04246,-0.08731,-0.06337,0.05188,0.00062,-0.02946,-0.06296,-0.06494,-0.01499,-0.02998,0.04319,0.07708,0.03356,-0.076,-0.09379,-0.03412,-0.01184,-0.02888,0.07476,-0.02096,-0.01328,0.01616,-0.03668,0.05017,0.09023,-0.09319,-0.08151,-0.04445,-0.01067,0.03888,0.07008,0.02431,-0.01863,0.00344,0.02674,-0.03606,0.06732,0.0496,0.05143,-0.01213,-0.08667,-0.01867,-0.05369,-0.06984,0.00541,0.00478,0.06108,-0.04566,-0.04927,-0.05199,0.05578,0.09709,-0.04302,-0.05732,0.09479,0.01631,0.04874,0.06393,0.02105,0.00078,-0.02138,0.0754,-0.0283,-0.06489,-0.02966,-0.014,0.03811,-0.03491,0.07065,0.05439,0.00023,0.04719,-0.07925,0.03075,-0.00262,-0.03473,0.05155,-0.00275,-0.05916,0.04014,-0.00012,0.00711,-0.00122,0.0177,0.05019,0.04221,-0.04785,-0.0027,0.05409,0.07703,0.01294,0.06801,-0.07955,-0.07701,-0.06615,-0.05463,-0.04315,-0.04398,0.03896,0.07963,-0.10995,-0.02181,0.03179,-0.03277,0.03837,-0.00489,-0.05589,0.05333,-0.01647,-0.05651,0.01189,0.06343,-0.03373,0.00602,0.04514,0.05618,-0.07451,0.06895,-0.03411,-0.0416,0.03021,-0.02459,-0.03345,-0.00939,0.00214,-0.09031,0.05005,0.06357,-0.06185,0.0362,-0.09502,0.01568,0.08797,0.02848,-0.02127,-0.04786,0.02113,0.04218,0.02247,0.02238,0.01723,-0.01325,0.03009,-0.04364,0.0299,0.05128,-0.05172,-0.01476,0.00394,-0.03297,-0.01417,0.01675,-0.04519,-0.06479,0.04704,0.03731,0.06192,0.05141]},{"id":"timeline-7#0","docId":"timeline-7","title":"Esperienza: Operaio Generico e Retail","category":"experience","tags":["experience","work","hackathon"],"text":"Esperienza lavorativa in settori trasversali (edilizia, agricoltura, reception, gestione negozio). Data: 2016–2022. Luogo: Bari. Dettagli: 6 anni di esperienza prima di intraprendere il percorso in Informatica. Forte focus su resilienza, problem-solving, e capacità di adattamento in team.","vec":[0.0141,-0.03498,-0.04429,-0.05282,0.08819,-0.06934,-0.018,0.03375,0.00782,0.02052,0.03522,0.04513,0.03561,-0.02124,-0.00246,0.03941,0.06706,-0.0608,-0.10871,-0.04188,0.00338,0.00888,-0.05533,0.0633,0.05971,0.0294,-0.0142,0.04329,0.04885,-0.05787,-0.07695,-0.04268,0.03298,-0.09144,0.04875,0.03617,-0.04528,-0.04638,0.06627,-0.07252,-0.09345,0.00645,0.05624,0.07624,-0.00356,0.08798,-0.03026,0.04248,-0.05987,-0.00186,-0.04942,0.08093,0.0571,0.11343,0.0382,-0.03182,-0.05007,-0.0667,-0.02002,0.02293,0.0328,-0.04319,0.01948,0.05144,0.06473,0.03851,0.0353,0.01724,-0.07547,-0.05793,-0.00273,0.05254,-0.0013,-0.069,-0.00723,0.03543,0.04299,-0.06929,0.01995,-0.08043,-0.08372,-0.02971,-0.01373,0.06037,-0.05997,0.06898,0.03461,-0.03721,0.04651,-0.01111,0.06671,0.07935,-0.00999,-0.06451,-0.05111,-0.0859,-0.03926,0.10066,0.04186,-0.02784,0.0357,-0.06085,0.06473,-0.08485,-0.04911,0.02347,-0.00117,-0.04857,0.04834,-0.07491,-0.05698,0.05025,-0.00363,0.038,-0.10353,-0.03227,0.00221,-0.0516,0.03322,-0.011,0.08453,-0.04167,-0.05451,-0.03511,-0.0893,-0.03997,-0.00937,0.08829,0.0133,0.01619,0.01842,0.02382,0.00748,0.04324,0.01719,0.06047,-0.04587,-0.01006,-0.01997,-0.03857,-0.03448,0.06075,-0.07049,0.04962,0.05265,0.03763,0.06656,-0.00114,0.06299,-0.06386,0.04359,-0.03261,0.06405,0.03252,0.03808,-0.04277,-0.09186,-0.05566,0.06552,0.04905,-0.05304,-0.04502,-0.03419,-0.02956,-0.07234,-0.00608,0.03175,0.04762,-0.03427,-0.00691,-0.03962,0.07451,-0.04411,0.09297,-0.01806,-0.02605,-0.06554,0.04896,0.05764,0.07149,-0.05673,-0.04485,-0.05509,-0.07034,-0.09223,-0.05828,-0.09505,-0.00889,-0.00554,-0.02482,0.03109,0.02607,-0.01707,-0.0636,-0.04535,0.01974,-0.06252,0.07622,0.02725,0.05246,0.02824,-0.03448,0.03377,0.02442,0.04366,0.03929,-0.05034,0.03733,-0.07863,0.06201,0.0156,-0.03975,-0.02705,0.0518,-0.01091,0.0007,-0.00654,0.08061,-0.03382,0.04157,0.01923,0.00742,0.04637,-0.06163,0.00439,0.01266,0.05451,-0.04369,-0.04247,0.08908,-0.09107,-0.02679,-0.04855,-0.07855,-0.04265,-0.05665,0.03598,0.07827,0.0254,-0.02856,-0.06489,-0.03945,0.00841,0.00321,0.0194,-0.06616,-0.02363,0.01219,-0.04307,0.04223,0.08505,-0.10912,-0.08692,-0.05161,-0.0059,0.0626,0.04454,0.03991,-0.06987,0.05182,0.05164,-0.01099,0.05847,0.05292,0.07159,-0.01691,-0.06563,-0.03106,-0.03156,-0.05456,-0.02991,0.0093,0.00371,-0.05684,-0.06244,-0.03748,0.06159,0.04628,-0.05465,-0.03246,0.05075,0.01196,0.03064,0.09452,0.06235,-0.03119,-0.00734,0.09045,-0.0014,-0.03953,-0.05035,-0.01909,0.02665,-0.0461,0.04598,0.02491,-0.01723,0.09541,-0.09576,0.07174,0.01674,-0.01447,0.01065,0.04414,-0.05004,0.035,0.02782,0.00653,0.01996,0.06181,0.02572,0.04882,-0.02414,-0.02304,0.0944,0.06302,-0.01357,0.06539,-0.06333,-0.03472,-0.04289,-0.03738,-0.02669,-0.08196,0.03402,0.08632,-0.08457,-0.0152,0.02525,-0.00795,0.04638,-0.01348,-0.05287,0.02513,-0.03661,-0.04305,-0.00553,0.08434,-0.03437,0.01672,0.04215,0.08043,-0.04661,0.06218,-0.01085,-0.08023,0.04767,-0.00636,-0.0476,0.02741,-0.0207,-0.07481,0.02147,0.06235,-0.03696,0.04126,-0.09707,0.01823,0.0984,-0.00836,-0.02797,-0.0521,0.04089,0.0027,0.07526,0.02231,0.01538,-0.02894,0.05111,-0.04855,0.03992,0.12305,-0.04028,-0.03669,-0.01459,-0.04126,-0.02449,-0.00453,-0.04641,-0.08018,0.04785,0.09729,0.07892,0.04507]}]}
</file>

<file path="src/types/env.d.ts">
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    GROQ_API_KEY: string;
    DEEPSEEK_API_KEY?: string;
    RAG_CHAT_MODEL: string;
    RAG_ROUTER_MODEL: string;
    UPSTASH_REDIS_REST_URL?: string;
    UPSTASH_REDIS_REST_TOKEN?: string;
    LANGFUSE_PUBLIC_KEY?: string;
    LANGFUSE_SECRET_KEY?: string;
    LANGFUSE_BASEURL?: string;
  }
}
</file>

<file path="README.md">
# 🌌 Portfolio 3D & AI Copilot

Il mio portfolio personale, costruito con tecnologie avanzate in ambito **Web 3D** e **Agentic AI**.  
Combina un motore 3D leggero (React Three Fiber) con un assistente virtuale alimentato da un sistema **RAG (Retrieval-Augmented Generation) Ibrido**, permettendo ai visitatori di esplorare i miei progetti e pormi domande in linguaggio naturale.

## 🚀 Funzionalità Principali

- **UI 3D Immersiva:** Sviluppata in React Three Fiber, con navigazione tramite particelle intelligenti, shader personalizzati e transizioni fluide.
- **Agentic RAG Copilot:** Un assistente AI integrato e deterministico, che risponde alle domande basandosi esclusivamente sul mio CV, sui miei progetti e sulle mie esperienze.
  - *Hybrid Retrieval & RRF:* Ricerca ibrida che combina **BM25 Okapi** (lessicale) e **Semantic Search** (Cosine Similarity vettoriale). I punteggi vengono fusi tramite Reciprocal Rank Fusion direttamente lato server, garantendo bassissima latenza (TTFT). Il Reranker (Cross-Encoder) è stato valutato ma rimosso intenzionalmente in produzione per via dei tempi di cold-start eccessivi in ambienti serverless, a fronte di un guadagno trascurabile su un corpus ridotto.
  - *Continuous Evaluation:* Il sistema include una suite di benchmark proprietaria misurata sul reale approccio ibrido in produzione (Hit Rate: 70.0%, MRR: 0.454) e uno script di valutazione end-to-end "LLM-as-a-Judge", che certifica il **98% di assenza di allucinazioni** (Faithfulness).
  - *Data Stream Automation:* L'assistente comprende l'intento dell'utente e guida autonomamente l'interfaccia (es. evidenziare progetti o aprire la sezione competenze) tramite Data Streams.
- **SEO & Telemetria:** Metadata completi (JSON-LD, OpenGraph, sitemap), e limitazione avanzata del rate tramite Upstash Redis.

## 🛠️ Stack Tecnologico

- **Frontend / 3D:** Next.js 16 (App Router), React 19, Tailwind CSS 4, Framer Motion, React Three Fiber, Drei, Lenis (Smooth Scrolling).
- **AI / RAG Pipeline:** Vercel AI SDK, `@huggingface/transformers` (Embeddings in Web Worker), API Provider **Groq** per inference ultra-veloce.
- **Testing & Eval:** Vitest, script custom TSX per benchmark MRR/HitRate.
- **Sicurezza:** `@upstash/ratelimit` per limitare l'abuso degli endpoint LLM.

## 🏃‍♂️ Come Avviare il Progetto

1. **Clona la repository:**
   ```bash
   git clone https://github.com/Hellvisback365/portfolio.git
   cd portfolio
   ```

2. **Installa le dipendenze:**
   ```bash
   npm install
   ```

3. **Configura le variabili d'ambiente:**
   Copia il file `.env.example` in `.env.local` e inserisci le tue API Key:
   - `GROQ_API_KEY` (configurata in `src/lib/rag/providers.ts`).
   - `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN`.

4. **Genera l'Indice RAG Locale:**
   Se hai modificato i documenti sorgente (es. `codebase.md` o i file JSON), esegui l'ingestione per aggiornare i chunk:
   ```bash
   npm run rag:ingest
   ```

5. **Avvia il server di sviluppo:**
   ```bash
   npm run dev
   ```
   Apri [http://localhost:3000](http://localhost:3000) nel browser.

## 📝 Script di Valutazione

- **Test Unitari:** `npm run test` (verifica degli algoritmi BM25 e Hybrid Retriever).
- **Valutazione Retrieval (MRR/Hit Rate):** `npm run rag:eval`
- **Valutazione Generazione (LLM come Giudice):** `npm run rag:judge`

---
*Progettato e sviluppato da [Vito Piccolini](https://www.linkedin.com/in/vitopiccolini/)*
</file>

<file path="src/app/api/suggestions/route.ts">
import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { z } from 'zod';
import { getProviders } from '@/lib/rag/providers';
import { parseLLMJSON } from '@/lib/rag/parse-llm-json';
import ragIndex from '@/data/rag-index.json';

export const maxDuration = 30;
export const revalidate = 0; // Disable cache so it refetches dynamically


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lang = searchParams.get('lang') || 'it';
  const isEn = lang === 'en';

  try {
    const providers = getProviders();
    if (!providers) {
      return NextResponse.json(
        { error: 'Copilot non configurato.' },
        { status: 503 },
      );
    }

    // Estrai 3 chunk casuali dal RAG index per dare varietà al contesto
    const chunks = ragIndex.chunks;
    const sampleSize = Math.min(3, chunks.length);
    const shuffled = [...chunks].sort(() => 0.5 - Math.random());
    const randomChunks = shuffled.slice(0, sampleSize).map((c) => c.text).join('\n\n');



    const { text } = await generateText({
      model: providers.router, // Usiamo il modello veloce (es. Llama 8B / Flash)
      temperature: 0.8,
      system: isEn 
        ? `You are the virtual assistant of Vito Piccolini's portfolio.
Your task is to generate 8 very short, natural, and interesting questions that a user might ask you regarding Vito's background, skills, or projects, based on the PROVIDED CONTEXT.
The questions must strictly be in the THIRD PERSON because the user is talking to you (the assistant) ABOUT Vito (e.g., "What languages does Vito know?", "Tell me about TerraNode", "What was his role in Zenith?"). Never use the second person ("What languages do you use?"). Do not exceed 8 words per question. Be varied.

You MUST respond ONLY with a valid JSON object matching this schema:
{ "questions": ["Question 1", "Question 2", ...] }`
        : `Sei l'assistente virtuale del portfolio di Vito Piccolini.
Il tuo compito è generare 8 domande molto brevi, naturali e interessanti che un utente potrebbe farti riguardo al background, alle competenze o ai progetti di Vito, basandoti SUL CONTESTO FORNITO.
Le domande devono essere rigorosamente IN TERZA PERSONA perché l'utente sta parlando con te (l'assistente) DI Vito (es. "Che linguaggi sa usare Vito?", "Parlami di TerraNode", "Qual è stato il suo ruolo in Zenith?"). Non usare MAI la seconda persona ("Che linguaggi usi?"). Non superare le 8 parole per domanda. Sii vario.

Devi rispondere SOLO ED ESCLUSIVAMENTE con un JSON valido che rispetta questo schema:
{ "questions": ["Domanda 1", "Domanda 2", ...] }`,
      prompt: isEn
        ? `REAL CONTEXT ABOUT VITO:\n${randomChunks}\n\nGenerate 8 questions based on this context.`
        : `CONTESTO REALE DI VITO:\n${randomChunks}\n\nGenera 8 domande basate su questo contesto.`,
    });

    const typedObject = parseLLMJSON<{ questions: string[] }>(text, { questions: [] });
    
    // Validazione extra: se il JSON parse è andato ma manca l'array 'questions'
    if (!typedObject.questions || !Array.isArray(typedObject.questions)) {
      throw new Error('Formato JSON non valido: array questions mancante');
    }
    
    return NextResponse.json(typedObject);
  } catch (error: any) {
    console.error('[Suggestions API Error]', error?.message || error);
    // Invece di restituire 500 e causare un errore sulla UI, facciamo fallback nativo
    return NextResponse.json({
      questions: isEn ? [
        'What are Vito\'s most recent projects?',
        'What technologies does Vito mainly use?',
        'Tell me about Vito\'s experience in Zenith.',
        'What is his thesis about?',
      ] : [
        'Quali sono i progetti più recenti di Vito?',
        'Che tecnologie usa principalmente Vito?',
        'Parlami dell\'esperienza di Vito in Zenith.',
        'Di cosa parla la sua tesi di laurea?',
      ],
    });
  }
}
</file>

<file path="src/app/globals.css">
@import "tailwindcss";
@import "../styles/breakpoints.css";

/* ═══════════════════════════════════════════════════════════
   DESIGN SYSTEM v2 — "Phyllotaxis"
   Ink-blue scuro, accento blu sistema, hairline, niente neon.
   I token legacy `neural-*` (usati ~110 volte negli overlay
   esistenti) sono definiti qui come alias dei nuovi token:
   prima di questa @theme NON esistevano e generavano CSS vuoto.
   ═══════════════════════════════════════════════════════════ */

@theme {
  /* — Palette — */
  --color-ink: #04060c;            /* fondo scena, blu-nero profondo */
  --color-surface: #0a0f1c;        /* pannelli */
  --color-accent: #0a84ff;         /* blu sistema (dominante) */
  --color-accent-soft: #64a8ff;    /* blu chiaro, hover/dettagli */
  --color-accent-deep: #1d4ed8;    /* blu profondo, gradienti */
  --color-leaf: #34d399;           /* tocco organico, usato con parsimonia */
  --color-line: rgb(148 178 255 / 0.14);  /* hairline */

  /* — Alias legacy (retro-compatibilità overlay esistenti) — */
  --color-neural-cyan: var(--color-accent-soft);
  --color-neural-magenta: var(--color-accent-deep);
  --color-neural-blue: var(--color-accent);
  --color-neural-indigo: var(--color-accent-deep);
  --color-neural-accent: var(--color-accent);
  --color-neural-card: rgb(10 15 28 / 0.7);
  --color-neural-void: var(--color-ink);

  --shadow-neural-glow: 0 0 24px rgb(10 132 255 / 0.25);

  /* — Tipografia (iniettata da next/font in layout.tsx) — */
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-jetbrains), ui-monospace, "SF Mono", monospace;
}

:root {
  --scene-bg: var(--color-ink);
  --glass-bg: rgb(13 20 38 / 0.55);
  --glass-border: var(--color-line);
  --glass-border-hover: rgb(100 168 255 / 0.35);
  --text-primary: #f2f6ff;
  --text-secondary: rgb(214 226 255 / 0.72);
  --text-muted: rgb(214 226 255 / 0.4);
}

html,
body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background: var(--scene-bg);
  color: var(--text-primary);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-tap-highlight-color: transparent;
  text-rendering: optimizeLegibility;
}

::selection {
  background: rgb(10 132 255 / 0.35);
}

/* ─── Utility ─── */
@layer utilities {
  .glass-panel {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    backdrop-filter: blur(20px) saturate(1.3);
    -webkit-backdrop-filter: blur(20px) saturate(1.3);
  }

  /* alias legacy mantenuto: stessa resa del nuovo glass */
  .glass-holographic {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    backdrop-filter: blur(24px) saturate(1.3);
    -webkit-backdrop-filter: blur(24px) saturate(1.3);
    box-shadow: 0 0 30px rgb(10 132 255 / 0.06),
      inset 0 1px 0 rgb(160 196 255 / 0.08);
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }
  .glass-holographic:hover {
    border-color: var(--glass-border-hover);
    box-shadow: 0 0 40px rgb(10 132 255 / 0.12),
      inset 0 1px 0 rgb(160 196 255 / 0.12);
  }

  .glow-white { box-shadow: 0 0 24px rgb(10 132 255 / 0.18); }
  .glow-text-white,
  .glow-text-cyan { text-shadow: 0 0 28px rgb(100 168 255 / 0.35); }

  /* etichetta "engineer": mono, maiuscolo, tracking largo */
  .eyebrow {
    font-family: var(--font-mono);
    font-size: 0.66rem;
    letter-spacing: 0.42em;
    text-transform: uppercase;
    color: var(--color-accent-soft);
  }

  .hairline { border-color: var(--color-line); }

  .animate-blink {
    display: inline-block;
    animation: blink-cursor 0.8s steps(2) infinite;
  }

  .neural-grid-overlay::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: linear-gradient(rgb(100 168 255 / 0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgb(100 168 255 / 0.04) 1px, transparent 1px);
    background-size: 48px 48px;
    opacity: 0.35;
    pointer-events: none;
  }
}

@keyframes blink-cursor {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* ─── Scrollbar ─── */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb {
  background: rgb(100 168 255 / 0.22);
  border-radius: 2px;
}
::-webkit-scrollbar-thumb:hover { background: rgb(100 168 255 / 0.45); }

/* ─── iOS input zoom fix ─── */
input, select, textarea { font-size: 16px; }

/* ─── Accessibilità: riduzione movimento ─── */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</file>

<file path="src/components/overlay/AboutOverlay.tsx">
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  FaGraduationCap,
  FaBrain,
  FaLanguage,
  FaShieldAlt,
  FaGithub,
  FaLinkedin,
  FaEnvelope,
} from 'react-icons/fa';
import Badge from '@/components/ui/Badge';
import { useAppStore } from '@/store/useAppStore';

import { personalInfo, formationItems, timelineMilestones } from '@/data/about';

const focusPills = personalInfo.focusPills;

const getInterestItems = (isEn: boolean) => [
  { label: isEn ? 'Recommender Systems & Multi-Agent LLM' : 'Recommender Systems & Multi-Agent LLM', icon: <FaBrain className="text-[white]" /> },
  { label: isEn ? 'NLP, Transformer & Explainability' : 'NLP, Transformer & Explainability', icon: <FaLanguage className="text-[white]" /> },
  { label: isEn ? 'Workflow Automation (n8n · API Integration)' : 'Workflow Automation (n8n · API Integration)', icon: <FaShieldAlt className="text-[white]" /> },
];

const socialLinks = [
  { icon: <FaGithub />, href: 'https://github.com/Hellvisback365', label: 'GitHub' },
  { icon: <FaLinkedin />, href: 'https://www.linkedin.com/in/vitopiccolini/', label: 'LinkedIn' },
  { icon: <FaEnvelope />, href: 'mailto:vitopiccolini@live.it', label: 'Email' },
];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const getPortraitImages = (isEn: boolean) => [
  { id: 'me', src: '/me.jpg', label: isEn ? 'Bachelor\'s degree · Bari 2025' : 'Laurea triennale · Bari 2025', position: 'center 18%' },
  { id: 'next', src: '/next-pulse-polaroid.jpg', label: 'Next Pulse · Chieti 2026', position: 'center' },
  { id: 'leonardo', src: '/leonardo-hackathon.jpg', label: isEn ? 'Leonardo Hackathon · Milan' : 'Hackathon Leonardo · Milano', position: 'center' },
];

export default function AboutOverlay() {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const language = useAppStore((s) => s.language);
  const isEn = language === 'en';

  const portraitImages = getPortraitImages(isEn);
  const interestItems = getInterestItems(isEn);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % portraitImages.length);
    }, 6000); // Cambia immagine ogni 6 secondi
    return () => clearInterval(interval);
  }, [portraitImages.length]);

  return (
    <div className="flex min-h-screen w-screen items-start justify-center px-4 py-20 sm:px-8">
      <div className="w-full max-w-5xl space-y-10">
        {/* Section header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
          variants={fadeIn}
        >
          <p className="text-[0.65rem] uppercase tracking-[0.5em] text-[white]/70">{isEn ? 'About me' : 'Chi sono'}</p>
          <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
            {personalInfo.role}
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-white/60">
            {isEn ? personalInfo.shortBio.en : personalInfo.shortBio.it}
          </p>
        </motion.div>

        {/* Main grid: portrait + bio */}
        <div className="grid gap-8 lg:grid-cols-[0.8fr,1.2fr] lg:items-start">
          {/* Portrait card */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            variants={fadeIn}
            whileHover={{ y: -4 }}
            className="w-full max-w-3xl mx-auto lg:max-w-none glass-holographic overflow-hidden rounded-2xl transition-all duration-500 hover:border-white/25 hover:shadow-[0_10px_40px_-10px_rgba(255,255,255,0.05)]"
          >
            <div className="relative w-full overflow-hidden bg-[#05060d] aspect-video lg:aspect-[4/5] max-h-[500px]">
              {/* Cinematic Carousel */}
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={portraitImages[currentImgIndex].id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: 'easeInOut' }}
                  className="absolute inset-0"
                >
                  {/* Sfondo sfocato per riempire gli spazi vuoti senza croppare */}
                  <Image
                    src={portraitImages[currentImgIndex].src}
                    alt="Background blur"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover blur-2xl opacity-40 scale-125"
                  />
                  {/* Immagine in primo piano contenuta perfettamente (non croppata) */}
                  <motion.div
                    initial={{ scale: 1.02 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 8, ease: 'linear' }} // Leggero Ken Burns solo sul foreground
                    className="absolute inset-0 z-10"
                  >
                    <Image
                      src={portraitImages[currentImgIndex].src}
                      alt={portraitImages[currentImgIndex].label}
                      fill
                      priority={currentImgIndex === 0}
                      quality={95}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-contain p-2 pb-12 sm:pb-2" // Spazio in basso per le etichette su mobile
                    />
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* Improved Gradient: dark only at the bottom, transparent top */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#05060d] via-[#05060d]/80 to-transparent z-20 pointer-events-none" />

              {/* Labels & Pagination */}
              <div className="absolute bottom-4 left-5 right-5 flex flex-wrap items-end justify-between gap-2 z-30">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={portraitImages[currentImgIndex].id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.3em] text-white drop-shadow-md font-semibold"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent-soft)] animate-pulse shadow-[0_0_8px_var(--color-accent)]" />
                    {portraitImages[currentImgIndex].label}
                  </motion.div>
                </AnimatePresence>

                {/* Dots indicator */}
                <div className="flex gap-1.5">
                  {portraitImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImgIndex(idx)}
                      className={`h-1 rounded-full transition-all duration-300 ${idx === currentImgIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/30 hover:bg-white/50'
                        }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="border-t border-white/10 bg-[#05060d]/90 px-5 py-5 backdrop-blur-md">
              <p className="text-[0.6rem] uppercase tracking-[0.4em] text-white/50">AI Developer</p>
              <h3 className="mt-1 text-xl font-semibold text-white">{personalInfo.name}</h3>
              <p className="mt-1 text-xs text-white/60">
                {isEn ? personalInfo.shortBio.en : personalInfo.shortBio.it}
              </p>
              <div className="mt-3 flex gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition-colors hover:border-[white]/50 hover:text-[white]"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Bio + Formation + Interests */}
          <div className="space-y-5">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={2}
              variants={fadeIn}
              className="glass-holographic rounded-2xl p-5"
            >
              <div className="space-y-3 text-sm text-white/70">
                <p>{isEn ? personalInfo.longBio.en : personalInfo.longBio.it}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {(isEn ? personalInfo.focusPills.en : personalInfo.focusPills.it).map((pill) => (
                  <Badge key={pill} variant="outline" className="text-[0.6rem]">
                    {pill}
                  </Badge>
                ))}
              </div>
            </motion.div>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Formation */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={3}
                variants={fadeIn}
                className="glass-holographic rounded-2xl p-5"
              >
                <p className="text-[0.6rem] uppercase tracking-[0.4em] text-white/50">{isEn ? 'Education' : 'Formazione'}</p>
                <div className="mt-3 space-y-3">
                  {formationItems.map((item) => (
                    <div
                      key={isEn ? item.label.en : item.label.it}
                      className="flex items-start gap-2 rounded-xl border border-white/8 bg-white/5 p-3"
                    >
                      <FaGraduationCap className="mt-0.5 shrink-0 text-[white] text-sm" />
                      <div>
                        <p className="text-xs font-semibold text-white">{isEn ? item.label.en : item.label.it}</p>
                        <p className="text-[0.65rem] text-white/60">{isEn ? item.detail.en : item.detail.it}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Interests */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={4}
                variants={fadeIn}
                className="glass-holographic rounded-2xl p-5"
              >
                <p className="text-[0.6rem] uppercase tracking-[0.4em] text-white/50">{isEn ? 'Interests' : 'Interessi'}</p>
                <div className="mt-3 space-y-2">
                  {interestItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/5 px-3 py-2.5"
                    >
                      {item.icon}
                      <span className="text-xs text-white/80">{item.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={5}
          variants={fadeIn}
        >
          <p className="text-[0.65rem] uppercase tracking-[0.5em] text-[white]/70">{isEn ? 'Journey' : 'Percorso'}</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">{isEn ? 'Research, challenges and delivery' : 'Ricerca, challenge e delivery'}</h3>
        </motion.div>

        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-[white]/30 via-white/10 to-[white]/20" />
          <div className="space-y-6">
            {timelineMilestones.map((item, index) => (
              <motion.div
                key={item.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                custom={6 + index}
                variants={fadeIn}
                className="relative pl-14"
              >
                <div className="absolute left-0 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/60 text-xs font-semibold text-white">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="glass-holographic rounded-2xl p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="text-[0.6rem]">
                      {isEn && typeof item.date !== 'string' ? item.date.en : (typeof item.date !== 'string' ? item.date.it : item.date)}
                    </Badge>
                    <span className="text-[0.6rem] uppercase tracking-[0.3em] text-white/40">
                      {isEn && typeof item.location !== 'string' ? (item.location as any).en : (typeof item.location !== 'string' ? (item.location as any).it : item.location)}
                    </span>
                  </div>
                  <h4 className="mt-3 text-lg font-semibold text-white">
                    {isEn && typeof item.title !== 'string' ? (item.title as any).en : (typeof item.title !== 'string' ? (item.title as any).it : item.title)}
                  </h4>
                  <p className="mt-1 text-xs text-white/70">
                    {isEn ? item.description.en : item.description.it}
                  </p>
                  <ul className="mt-3 space-y-1.5">
                    {(isEn ? item.highlights.en : item.highlights.it).map((h) => (
                      <li key={h} className="flex items-start gap-2 text-xs text-white/60">
                        <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[white]" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
</file>

<file path="next.config.js">
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  images: {
    remotePatterns: [],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
    qualities: [50, 70, 75, 80, 85, 90, 95, 100],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  async headers() {
    const isDev = process.env.NODE_ENV !== 'production';
    const scriptSrc = isDev 
      ? "'self' 'wasm-unsafe-eval' 'unsafe-eval' 'unsafe-inline'" 
      : "'self' 'wasm-unsafe-eval' 'unsafe-inline'";

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `default-src 'self'; script-src ${scriptSrc} https://va.vercel-scripts.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; worker-src 'self' blob:; connect-src 'self' https://formsubmit.co https://cloud.langfuse.com https://api.groq.com https://generativelanguage.googleapis.com https://huggingface.co https://*.huggingface.co https://*.hf.co https://cdn.jsdelivr.net https://vitals.vercel-insights.com; img-src 'self' blob: data:; font-src 'self' data:; frame-src 'self' https://formsubmit.co;`,
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(self), geolocation=()',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
</file>

<file path="src/components/overlay/ContactOverlay.tsx">
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaTimes, FaEnvelope } from 'react-icons/fa';
import useResponsive from '@/hooks/useResponsive';
import { useAppStore } from '@/store/useAppStore';
import { categories, getContactDetails, socialLinks, MAX_MESSAGE_LENGTH } from '@/constants/contactConfig';
import { useContactForm } from '@/hooks/useContactForm';
import FileDropzone from '@/components/ui/contact/FileDropzone';

/* ───────────────────── Shared styles ───────────────────── */
const inputClasses =
  'w-full rounded-lg border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white ' +
  'placeholder-white/25 outline-none transition-all duration-200 ' +
  'focus:border-[var(--color-accent)]/50 focus:ring-1 focus:ring-[var(--color-accent)]/20 ' +
  'hover:border-white/20';

const errorInputClasses =
  'border-red-400/40 focus:border-red-400/60 focus:ring-red-400/20';

/* ═══════════════════════════════════════════════════════ */
export default function ContactOverlay() {
  const { isMobile } = useResponsive();
  const language = useAppStore((s) => s.language);
  const isEn = language === 'en';
  
  const contactDetails = getContactDetails(isEn);

  const {
    formData,
    errors,
    files,
    isSubmitting,
    submitSuccess,
    submitError,
    setSubmitError,
    fileError,
    handleChange,
    selectCategory,
    addFiles,
    removeFile,
    handleSubmit
  } = useContactForm();

  const currentYear = new Date().getFullYear();
  const charsLeft = MAX_MESSAGE_LENGTH - formData.message.length;

  /* ═══════════════════════════ Render ═══════════════════════════ */
  return (
    <div className="flex min-h-screen w-screen flex-col items-center justify-center px-4 py-16 sm:px-8">
      <div className="w-full max-w-5xl space-y-8">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-[0.65rem] uppercase tracking-[0.5em] text-white/70">{isEn ? 'Contact' : 'Contatto'}</p>
          <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">{isEn ? 'Contact Me' : 'Contattami'}</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/60">
            {isEn ? 'I am entering my Master\'s degree in Computer Science – AI (UniBa) and I am available for internships, R&D or AI-first projects.' : 'Sto entrando nella Laurea Magistrale in Computer Science – AI (UniBa) e sono disponibile per stage, R&D o progetti AI-first.'}
          </p>
        </motion.div>

        {/* ── Contact cards ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          {contactDetails.map((item) => (
            <div key={item.label} className="glass-holographic rounded-xl p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/40">
                  {item.icon}
                </span>
                <div>
                  <p className="text-[0.55rem] uppercase tracking-[0.3em] text-white/50">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="text-sm font-semibold text-white transition-colors hover:text-[var(--color-accent-soft)]">
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm font-semibold text-white">{item.value}</p>
                  )}
                </div>
              </div>
              <p className="mt-2 text-[0.65rem] text-white/50">{item.helper}</p>
            </div>
          ))}
        </motion.div>

        {/* ── Form ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Success banner */}
          <AnimatePresence>
            {submitSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20">
                  <FaCheck className="text-emerald-400 text-sm" />
                </span>
                <div>
                  <p className="text-sm font-medium text-emerald-300">{isEn ? 'Message sent!' : 'Messaggio inviato!'}</p>
                  <p className="text-xs text-emerald-300/60">{isEn ? 'I will reply as soon as possible.' : 'Ti risponderò al più presto.'}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error banner */}
          <AnimatePresence>
            {submitError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-5 flex items-center justify-between rounded-xl border border-red-400/20 bg-red-500/10 p-4"
              >
                <p className="text-xs text-red-300">{submitError}</p>
                <button onClick={() => setSubmitError('')} className="ml-3 shrink-0 text-red-300/50 hover:text-red-300">
                  <FaTimes className="text-xs" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="glass-holographic rounded-2xl p-5 sm:p-7 space-y-5">

            {/* Honeypot anti-spam (hidden from users, catches bots) */}
            <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" />

            {/* Category chips */}
            <div>
              <p className="mb-2.5 text-xs font-medium text-white/60">{isEn ? 'Reason for contact' : 'Motivo del contatto'}</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => selectCategory(cat.id)}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${formData.category === cat.id
                        ? 'border-[var(--color-accent)]/50 bg-[var(--color-accent)]/15 text-[var(--color-accent-soft)]'
                        : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white/70'
                      }`}
                  >
                    <span className="mr-1.5">{cat.emoji}</span>{isEn ? cat.label.en : cat.label.it}
                  </button>
                ))}
              </div>
            </div>

            {/* Name + Email row */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="contact-name" className="mb-1.5 block text-xs font-medium text-white/60">
                  {isEn ? 'Name *' : 'Nome *'}
                </label>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`${inputClasses} ${errors.name ? errorInputClasses : ''}`}
                  placeholder={isEn ? 'Your name' : 'Il tuo nome'}
                  aria-required="true"
                  aria-invalid={Boolean(errors.name)}
                />
                {errors.name && <p className="mt-1 text-[0.65rem] text-red-400">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="contact-email" className="mb-1.5 block text-xs font-medium text-white/60">
                  Email *
                </label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`${inputClasses} ${errors.email ? errorInputClasses : ''}`}
                  placeholder={isEn ? 'Your email' : 'La tua email'}
                  aria-required="true"
                  aria-invalid={Boolean(errors.email)}
                />
                {errors.email && <p className="mt-1 text-[0.65rem] text-red-400">{errors.email}</p>}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="contact-subject" className="mb-1.5 block text-xs font-medium text-white/60">
                {isEn ? 'Subject *' : 'Oggetto *'}
              </label>
              <input
                type="text"
                id="contact-subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={`${inputClasses} ${errors.subject ? errorInputClasses : ''}`}
                placeholder={isEn ? 'e.g. Collaboration proposal on AI project' : 'es. Proposta di collaborazione su progetto AI'}
                aria-required="true"
                aria-invalid={Boolean(errors.subject)}
              />
              {errors.subject && <p className="mt-1 text-[0.65rem] text-red-400">{errors.subject}</p>}
            </div>

            {/* Message */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="contact-message" className="text-xs font-medium text-white/60">
                  {isEn ? 'Message *' : 'Messaggio *'}
                </label>
                <span className={`text-[0.6rem] tabular-nums ${charsLeft < 100 ? 'text-amber-400' : 'text-white/30'}`}>
                  {formData.message.length}/{MAX_MESSAGE_LENGTH}
                </span>
              </div>
              <textarea
                id="contact-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={isMobile ? 4 : 6}
                className={`${inputClasses} resize-none ${errors.message ? errorInputClasses : ''}`}
                placeholder={isEn ? 'Describe the project, role, timelines…' : 'Descrivi il progetto, il ruolo, le tempistiche…'}
                aria-required="true"
                aria-invalid={Boolean(errors.message)}
              />
              {errors.message && <p className="mt-1 text-[0.65rem] text-red-400">{errors.message}</p>}
            </div>

            {/* ── File attachments ── */}
            <FileDropzone
              files={files}
              fileError={fileError}
              addFiles={addFiles}
              removeFile={removeFile}
            />

            {/* Divider */}
            <div className="border-t border-white/[0.06]" />

            {/* Submit */}
            <div className="flex items-center justify-between gap-4">
              <p className="hidden text-[0.6rem] text-white/25 sm:block">
                {isEn ? 'Your data will not be shared with third parties.' : 'I tuoi dati non saranno condivisi con terzi.'}
              </p>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`group relative ml-auto flex items-center gap-2.5 rounded-lg border px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.25em] transition-all duration-300 ${isSubmitting
                    ? 'cursor-not-allowed border-white/10 bg-white/5 text-white/30'
                    : 'border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 text-[var(--color-accent-soft)] hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-accent)]/20 hover:shadow-[0_0_24px_rgba(10,132,255,0.15)]'
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/20 border-t-white/60" />
                    {isEn ? 'Sending...' : 'Invio in corso…'}
                  </>
                ) : (
                  <>
                    <FaEnvelope className="text-[0.65rem] transition-transform duration-300 group-hover:-translate-y-0.5" />
                    {isEn ? 'Send Message' : 'Invia Messaggio'}
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* ── Mini footer ── */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col items-center gap-4 pt-8 text-center"
        >
          <div className="flex gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 text-white/50 transition-all hover:border-[var(--color-accent)]/40 hover:text-[var(--color-accent-soft)]"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
          <p className="text-[0.6rem] text-white/30">
            © {currentYear} Vito Piccolini. All rights reserved.
          </p>
        </motion.footer>
      </div>
    </div>
  );
}
</file>

<file path="src/app/api/chat/feedback/route.ts">
import { NextResponse } from 'next/server';
import { Langfuse } from 'langfuse';
import { z } from 'zod';
import { feedbackRatelimit } from '@/lib/ratelimit';

const langfuse = new Langfuse({
  publicKey: process.env.LANGFUSE_PUBLIC_KEY?.replace(/^"|"$/g, '').trim(),
  secretKey: process.env.LANGFUSE_SECRET_KEY?.replace(/^"|"$/g, '').trim(),
  baseUrl: process.env.LANGFUSE_BASEURL?.replace(/^"|"$/g, '').trim() || 'https://cloud.langfuse.com',
});

const feedbackSchema = z.object({
  messageId: z.string().min(1),
  score: z.union([z.literal(0), z.literal(1)]),
});

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';
    const { success } = await feedbackRatelimit.limit(ip);
    if (!success) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const body = await req.json();
    const parsed = feedbackSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const { messageId, score } = parsed.data;

    // Attach score in Langfuse. 
    // We use messageId as traceId/observationId so we can track the exact response.
    const trace = langfuse.trace({
      id: messageId,
      name: 'User Feedback Trace',
      tags: ['feedback'],
    });

    trace.score({
      name: 'user-feedback',
      value: score,
      comment: score === 1 ? 'Pollice in su (Utente soddisfatto)' : 'Pollice in giù (Risposta errata o allucinata)',
    });

    await langfuse.flushAsync();

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[Feedback API Error]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
</file>

<file path="src/app/page.tsx">
'use client';

import dynamic from 'next/dynamic';
import { ReactLenis, useLenis } from 'lenis/react';
import HtmlOverlay from '@/components/overlay/HtmlOverlay';
import NavigationOverlay from '@/components/overlay/NavigationOverlay';
import CopilotOverlay from '@/components/overlay/CopilotOverlay';
import { scrollProgress, SECTIONS } from '@/store/useAppStore';

// Il canvas è client-only e fuori dal critical path: la pagina (testo,
// SEO, a11y) è servita subito, il WebGL arriva un istante dopo.
const Experience = dynamic(() => import('@/components/canvas/Experience'), {
  ssr: false,
});

/**
 * Unica fonte di verità dello scroll: il callback di Lenis scrive nel
 * canale transiente dello store. Il loop WebGL legge `scrollProgress`
 * via ref — nessuna lettura di layout dentro requestAnimationFrame,
 * nessun re-render React per frame.
 */
import { useEffect, useRef } from 'react';

function ScrollBridge() {
  const offsetsRef = useRef<number[]>([]);

  useEffect(() => {
    function computeOffsets() {
      const offsets = SECTIONS.map(id => {
        const el = document.getElementById(id);
        return el ? el.offsetTop : 0;
      });
      offsetsRef.current = offsets;
    }
    
    computeOffsets();
    
    // Ricalcola solo quando la finestra cambia dimensioni
    window.addEventListener('resize', computeOffsets);
    return () => window.removeEventListener('resize', computeOffsets);
  }, []);

  useLenis((lenis) => {
    const p = lenis.limit > 0 ? lenis.scroll / lenis.limit : 0;
    scrollProgress.value = p;
    
    const offsets = offsetsRef.current;
    if (offsets.length === SECTIONS.length) {
      let currentStage = 0;
      for (let i = 0; i < SECTIONS.length - 1; i++) {
        const currentTop = offsets[i];
        const nextTop = offsets[i + 1];
        
        if (lenis.scroll >= currentTop && lenis.scroll < nextTop) {
          const sectionProgress = (lenis.scroll - currentTop) / (nextTop - currentTop);
          currentStage = i + sectionProgress;
          break;
        } else if (lenis.scroll >= nextTop && i === SECTIONS.length - 2) {
           currentStage = SECTIONS.length - 1;
        }
      }
      scrollProgress.stage = currentStage;
    } else {
      scrollProgress.stage = p * (SECTIONS.length - 1);
    }
  });
  return null;
}

export default function Home() {
  return (
    <ReactLenis root options={{ lerp: 0.08, wheelMultiplier: 1 }}>
      <ScrollBridge />
      <div className="relative w-full">
        {/* Sfondo 3D fisso */}
        <div className="fixed inset-0 z-0 h-dvh w-screen" aria-hidden="true">
          <Experience />
          {/* Vignettatura: lega i punti al fondale e protegge la leggibilità */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 80% 60% at 50% 45%, transparent 35%, rgba(4,6,12,0.55) 100%)',
            }}
          />
        </div>

        {/* Contenuto DOM scrollabile */}
        <div className="relative z-10 w-full">
          <HtmlOverlay />
        </div>

        {/* Layer fissi */}
        <NavigationOverlay />
        <CopilotOverlay />
      </div>
    </ReactLenis>
  );
}
</file>

<file path="src/app/layout.tsx">
import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import './globals.css';
import { getBaseUrl } from '@/constants/site';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

/**
 * Tipografia self-hosted via next/font: niente <link> render-blocking,
 * niente FOUT, subset latino. Inter variable copre display e body con
 * pesi disciplinati (300/450/600); JetBrains Mono è la voce "engineer"
 * per eyebrow, label e dati.
 */
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-jetbrains",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#04060c",
};

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: "Vito Piccolini — AI Engineer",
  description:
    "Sistemi di raccomandazione, architetture multi-agente e RAG ibridi. Portfolio di Vito Piccolini, AI Engineer.",
  authors: [{ name: "Vito Piccolini" }],
  keywords: ["AI", "Machine Learning", "RAG", "LangGraph", "Recommender Systems", "Next.js"],
  creator: "Vito Piccolini",
  icons: { icon: "/vp.svg", apple: "/apple-icon.png" },
  openGraph: {
    title: "Vito Piccolini — AI Engineer",
    description:
      "Sistemi di raccomandazione, architetture multi-agente e RAG ibridi.",
    type: "website",
    locale: "it_IT",
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Vito Piccolini',
  jobTitle: 'AI & Software Engineer',
  url: getBaseUrl(),
  sameAs: [
    'https://www.linkedin.com/in/vitopiccolini/',
    'https://github.com/Hellvisback365',
  ],
  knowsAbout: ['Machine Learning', 'Artificial Intelligence', 'React', 'Next.js', 'TypeScript', 'Retrieval-Augmented Generation'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`dark ${inter.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <body className="bg-ink text-[var(--text-primary)]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
</file>

<file path="src/components/ProjectModal.tsx">
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import type { ProjectData } from '@/data/projects';
import Badge from '@/components/ui/Badge';
import CTAButton from '@/components/ui/CTAButton';
import { useAppStore } from '@/store/useAppStore';

interface ProjectModalProps {
  project: ProjectData;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const language = useAppStore((s) => s.language);
  const isEn = language === 'en';

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        type: 'spring',
        stiffness: 300,
        damping: 25
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      y: 20,
      transition: { duration: 0.2 }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: 0.1 + (i * 0.1),
        duration: 0.4
      }
    })
  };

  const modalContent = (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={backdropVariants}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur"
      onClick={onClose}
    >
      <motion.div
        variants={modalVariants}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#05060d]"
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent="true"
      >
        <div className="relative h-64 sm:h-80 overflow-hidden rounded-t-3xl border-b border-white/10 bg-[#05060d]">
          {/* Blurred Background */}
          <Image 
            src={project.image}
            alt="Background blur"
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover blur-2xl opacity-30 scale-110"
          />
          <motion.div 
            className="absolute inset-0 overflow-hidden z-10"
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ 
              scale: imageLoaded ? 1 : 1.1, 
              opacity: imageLoaded ? 1 : 0 
            }}
            transition={{ duration: 0.6 }}
          >
            <Image 
              src={project.image}
              alt={project.title}
              className="object-contain p-6 drop-shadow-2xl"
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              onLoad={() => setImageLoaded(true)}
            />
          </motion.div>
          <motion.div 
            className="absolute inset-0 z-20 bg-gradient-to-t from-[#05060d] to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          />
        </div>

        <div className="space-y-6 px-6 py-8">
          <motion.div 
            custom={0}
            variants={contentVariants}
            className="flex flex-col gap-2"
          >
            <p className="text-xs uppercase tracking-[0.35em] text-white/60">
              {typeof project.timeline !== 'string' ? (isEn ? project.timeline.en : project.timeline.it) : project.timeline}
            </p>
            <h2 className="text-3xl font-semibold text-white">
              {typeof project.title !== 'string' ? (isEn ? (project.title as any).en : (project.title as any).it) : project.title}
            </h2>
            <p className="text-base text-white/70">
              {isEn ? project.subtitle.en : project.subtitle.it}
            </p>
            <Badge variant="glow" className="w-fit text-[0.65rem]">
              {typeof project.role !== 'string' ? (isEn ? project.role.en : project.role.it) : project.role}
            </Badge>
          </motion.div>
          
          <motion.p 
            custom={1}
            variants={contentVariants}
            className="text-base text-white/80"
          >
            {isEn ? project.longDescription.en : project.longDescription.it}
          </motion.p>
          
          <motion.div 
            custom={2}
            variants={contentVariants}
            className="grid gap-4 sm:grid-cols-3"
          >
            {project.metrics.map((metric, idx) => {
              const mLabel = typeof metric.label !== 'string' ? (isEn ? metric.label.en : metric.label.it) : metric.label;
              const mValue = typeof metric.value !== 'string' ? (isEn ? metric.value.en : metric.value.it) : metric.value;
              const mCaption = typeof metric.caption !== 'string' ? (isEn ? metric.caption.en : metric.caption.it) : metric.caption;
              return (
                <div
                  key={`${project.id}-metric-${idx}`}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60">{mLabel}</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{mValue}</p>
                  <p className="mt-1 text-xs text-white/70">
                    {mCaption}
                  </p>
                </div>
              );
            })}
          </motion.div>

          <motion.div
            custom={3}
            variants={contentVariants}
            className="space-y-3"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">Stack</p>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tool, idx) => {
                const toolLabel = typeof tool !== 'string' ? (isEn ? tool.en : tool.it) : tool;
                return (
                  <span
                    key={`modal-stack-${idx}`}
                    className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/70"
                  >
                    {toolLabel}
                  </span>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            custom={4}
            variants={contentVariants}
            className="space-y-3"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">Focus</p>
            <div className="flex flex-wrap gap-2">
              {project.pillars.map((pillar, idx) => {
                const pillarLabel = typeof pillar !== 'string' ? (isEn ? pillar.en : pillar.it) : pillar;
                return (
                  <Badge key={`modal-pillar-${idx}`} variant="outline" className="text-[0.6rem]">
                    {pillarLabel}
                  </Badge>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            custom={5}
            variants={contentVariants}
            className="flex flex-wrap gap-3"
          >
            {project.links?.map((link) => (
              <CTAButton key={link.href} href={link.href} variant="secondary">
                {link.label}
              </CTAButton>
            ))}
            <CTAButton variant="primary" onClick={onClose}>
              {isEn ? 'Close' : 'Chiudi'}
            </CTAButton>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(modalContent, document.body);
}
</file>

<file path="src/app/api/chat/route.ts">
import { NextResponse } from 'next/server';
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  generateText,
  stepCountIs,
  streamText,
  type UIMessage,
} from 'ai';
import { z } from 'zod';
import { getRetriever, type RetrievedChunk } from '@/lib/rag/retriever';
import { globalRatelimit } from '@/lib/ratelimit';
import { getProviders } from '@/lib/rag/providers';
import { parseLLMJSON } from '@/lib/rag/parse-llm-json';

/**
 * Pipeline per richiesta (budget ~quello di una sola chiamata LLM,
 * perché router e retrieval lessicale corrono in parallelo):
 *
 *   body { messages, queryVector? }
 *        │
 *        ├─ router (llama-3.1-8b-instant, ~100 ms, timeout 1.2 s) ──┐
 *        │    intent: smalltalk | portfolio | navigate              │
 *        │    standalone: domanda riscritta self-contained          │
 *        │                                                          ├─ join
 *        └─ HybridRetriever: BM25 + cosine(queryVector) + RRF ──────┘
 *        │
 *        ├─ writer.write('data-sources')  → chips fonti nella UI
 *        └─ streamText (llama-3.3-70b-versatile) + tools → merge
 *
 * Il vecchio route faceva multi-query expansion (3 riscritture LLM in
 * serie) su un corpus di ~20 chunk e poi `messages.slice(-1)`:
 * +1–2 s di latenza per perdere lo storico. Qui lo storico (ultimi 8
 * messaggi) arriva intero al modello e il rewrite è un solo step
 * piccolo, non bloccante oltre il timeout.
 */

export const maxDuration = 30;

const HISTORY_WINDOW = 8;
const TOP_K = 10;
const ROUTER_TIMEOUT_MS = 3500;

// ── Validazione del body ──────────────────────────────────────────────
const bodySchema = z.object({
  messages: z.array(z.unknown()).min(1),
  queryVector: z
    .array(z.number().finite())
    .min(8)
    .max(1024)
    .nullish(),
});

const routerSchema = z.object({
  intent: z.enum(['smalltalk', 'portfolio']),
  standalone: z.string().describe('La domanda riscritta in forma autonoma, in italiano.'),
  uiAction: z.enum(['none', 'navigateToSection', 'showProject', 'showSkillsRadar']).default('none').describe('Azione UI da eseguire.'),
  uiActionTarget: z.string().optional().describe('Se uiAction è navigateToSection usa una tra about, skills, projects, contact. Se showProject usa il nome del progetto.'),
});

export type RouterDecision = z.infer<typeof routerSchema>;

// ── Helpers ───────────────────────────────────────────────────────────

function textOf(message: UIMessage): string {
  return (message.parts ?? [])
    .map((p) => (p.type === 'text' ? p.text : ''))
    .filter(Boolean)
    .join(' ')
    .trim();
}

function lastUserText(messages: UIMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === 'user') {
      const t = textOf(messages[i]);
      if (t) return t;
    }
  }
  return '';
}

function recentDialogue(messages: UIMessage[], n = 6): string {
  return messages
    .slice(-n)
    .map((m) => `${m.role === 'user' ? 'Utente' : 'Copilot'}: ${textOf(m)}`)
    .filter((line) => !line.endsWith(': '))
    .join('\n');
}

function buildSystemPrompt(sources: RetrievedChunk[]): string {
  const context =
    sources.length > 0
      ? sources
          .map((s, i) => `[S${i + 1}] (${s.title})\n${s.text}`)
          .join('\n\n')
      : '(nessuna fonte recuperata per questa domanda)';

  const SYSTEM_PROMPT = `
Sei il Copilot AI del portfolio di Vito Piccolini, un brillante sviluppatore AI/Software Engineer italiano.
Il tuo scopo è assistere recruiter, aziende e colleghi nel comprendere le competenze e le esperienze di Vito.

REGOLE FONDAMENTALI:
1. MULTILINGUISMO: Rispondi SEMPRE NELLA LINGUA DELL'UTENTE.
2. BASATI SUL CONTESTO: Usa *solo* le informazioni fornite nel blocco [CONTESTO RAG]. Se l'informazione non c'è, ammettilo gentilmente. NON inventare.
3. TONO DI VOCE: Professionale, brillante e conciso. Sei un assistente, non Vito stesso. Parla di lui in terza persona.
4. Sii ESTREMAMENTE conciso e dritto al punto (1-2 frasi al massimo).
5. Tono: elegante, minimale, competente.
6. VIETATO usare convenevoli o filler ("Certamente!", "Certo!", "Ecco a te!").
7. VIETATO annunciare le azioni della UI ("Ti porto alla sezione", "Ecco la scheda"). L'interfaccia si muove da sola in background, tu limitati a rispondere a parole.
8. Non inserire MAI tag o riferimenti grezzi come [S1] o [S2] nel testo.

[CONTESTO RAG (Fonti Recuperate)]
${context}

CONTATTI PUBBLICI (puoi condividerli liberamente)
- Email: vitopiccolini@live.it
- LinkedIn: https://www.linkedin.com/in/vitopiccolini/
- GitHub: https://github.com/Hellvisback365`;
  return SYSTEM_PROMPT;
}



// ── Route ─────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const { success } = await globalRatelimit.limit(ip);
  if (!success) {
    return NextResponse.json({ error: 'Rate limit superato. Riprova più tardi.' }, { status: 429 });
  }

  const providers = getProviders();
  if (!providers) {
    return NextResponse.json(
      {
        error:
          'Copilot non configurato: aggiungi GROQ_API_KEY alle variabili d\'ambiente.',
      },
      { status: 503 },
    );
  }

  let parsed: z.infer<typeof bodySchema>;
  try {
    parsed = bodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: 'Body non valido.' }, { status: 400 });
  }



  const messages = parsed.messages as UIMessage[];
  const queryVector = parsed.queryVector ?? null;
  const question = lastUserText(messages);
  const history = messages.slice(-HISTORY_WINDOW);

  const retriever = await getRetriever();

  const routerPrompt = `Sei il router di sistema. Classifica l'intento dell'utente.
Devi rispondere SOLO ED ESCLUSIVAMENTE con un JSON valido che rispetta questo schema:
{
  "intent": "portfolio" | "smalltalk",
  "standalone": "La query riformulata senza contesto",
  "uiAction": "navigateToSection" | "showProject" | "showSkillsRadar" | "none",
  "uiActionTarget": "skills" | "projects" | "hero" | o il nome del progetto (se applicabile)
}

Regole per intent:
- "smalltalk": saluti generici, chiacchiere.
- "portfolio": qualsiasi domanda su Vito, competenze, progetti o carriera.

Regole per standalone:
Riscrivi la domanda dell'utente in modo che sia comprensibile da sola (coreference resolution).

Regole per uiAction:
Devi SEMPRE pilotare il sito verso la sezione più pertinente per qualsiasi domanda sul portfolio. Usa "none" SOLO per lo smalltalk.
- "showProject": se la domanda riguarda un progetto specifico (es. TerraNode). uiActionTarget = nome del progetto.
- "showSkillsRadar": se la domanda riguarda linguaggi, tecnologie, stack o competenze.
- "navigateToSection": per qualsiasi altra domanda. uiActionTarget DEVE ESSERE uno tra: "hero" (info generali, studio, chi è), "about" (percorso, località), "projects" (lista progetti generica), "contact" (contatti, email).
- "none": solo se intent = smalltalk.

CONVERSAZIONE:
${recentDialogue(history)}`;

  // Esecuzione parallela: Router (LLM) e Retrieval Lessicale (BM25)
  const routerPromise = generateText({
    model: providers.router,
    temperature: 0,
    prompt: routerPrompt,
    abortSignal: AbortSignal.timeout(ROUTER_TIMEOUT_MS),
  }).catch((err: any) => {
    console.error('[Router] Fallito o andato in timeout:', err);
    return null;
  });

  // Avvio la ricerca lessicale (BM25) in parallelo al router LLM
  const lexPromise = retriever.lexicalSearch(question);

  let sources: RetrievedChunk[] = [];
  const routerRes = await routerPromise;
  
  let routerState: RouterDecision = { intent: 'portfolio', standalone: question, uiAction: 'none' };
  if (routerRes?.text) {
    const parsedJson = parseLLMJSON<unknown>(routerRes.text, null);
    const validated = routerSchema.safeParse(parsedJson);
    if (validated.success) routerState = validated.data;
  }

  if (routerState.intent !== 'smalltalk') {
    const lexRank = await lexPromise;
    sources = retriever.semanticAndFuse(lexRank, queryVector ?? null, TOP_K);
  }

  const result = streamText({
    model: providers.chat,
    system: buildSystemPrompt(sources),
    messages: await convertToModelMessages(history),
    temperature: 0.4,
    stopWhen: stepCountIs(1),
  });

  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      writer.write({ type: 'start' });
      if (sources.length > 0) {
        writer.write({
          type: 'data-sources' as any,
          data: sources.map((s, i) => ({
            tag: `S${i + 1}`,
            id: s.id,
            title: s.title,
            category: s.category,
            score: Math.round(s.score * 1e4) / 1e4,
          })),
        });
      }
      
      if (routerState.uiAction && routerState.uiAction !== 'none') {
        writer.write({
          type: 'data-uiAction' as any,
          data: { action: routerState.uiAction, target: routerState.uiActionTarget },
        });
      }

      writer.merge(result.toUIMessageStream({ sendStart: false }));
    },
  });

  return createUIMessageStreamResponse({ stream });
}
</file>

<file path="src/components/overlay/CopilotOverlay.tsx">
'use client';

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FiMessageCircle, FiX, FiCpu } from 'react-icons/fi';
import { useAppStore } from '@/store/useAppStore';
import type { EmbedderState } from '@/lib/rag/embedder';
import { useCopilotChat } from '@/hooks/useCopilotChat';
import CopilotMessage from '@/components/ui/copilot/CopilotMessage';
import CopilotInput from '@/components/ui/copilot/CopilotInput';

function prettyError(err: Error | undefined, isEn: boolean): string {
  if (!err) return isEn ? 'An error occurred.' : 'Si è verificato un errore.';
  try {
    const parsed = JSON.parse(err.message) as { error?: string };
    if (parsed.error) return parsed.error;
  } catch {
    /* il body non era JSON */
  }
  return err.message || (isEn ? 'An error occurred.' : 'Si è verificato un errore.');
}

function EmbedderDot({ state, isEn }: { state: EmbedderState, isEn: boolean }) {
  if (state === 'error') return null; // degradazione silenziosa
  const label =
    state === 'ready'
      ? (isEn ? 'semantic retrieval active' : 'retrieval semantico attivo')
      : (isEn ? 'loading semantic model…' : 'carico il modello semantico…');
  return (
    <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-white/40">
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          state === 'ready' ? 'bg-leaf' : 'animate-pulse bg-accent-soft'
        }`}
      />
      {label}
    </span>
  );
}

export default function CopilotOverlay() {
  const copilotOpen = useAppStore((s) => s.copilotOpen);
  const setCopilotOpen = useAppStore((s) => s.setCopilotOpen);
  const flyToSection = useAppStore((s) => s.flyToSection);
  const reduceMotion = useReducedMotion();
  const language = useAppStore((s) => s.language);
  const isEn = language === 'en';

  const [input, setInput] = useState('');
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, boolean>>({});
  const endRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    status,
    error,
    busy,
    submit,
    embedderState,
    suggestions,
    isLoadingSuggestions,
    handleSuggestionClick
  } = useCopilotChat();

  // Auto-scroll in fondo a ogni aggiornamento.
  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'end',
    });
  }, [messages, status, reduceMotion]);

  const handleFeedback = async (messageId: string, score: number, aiResponseText: string, userQuestionText: string) => {
    if (feedbackGiven[messageId]) return;
    setFeedbackGiven(prev => ({ ...prev, [messageId]: true }));
    try {
      await fetch('/api/chat/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, score, aiResponseText, userQuestionText })
      });
    } catch (err) {
      console.error('Failed to submit feedback', err);
    }
  };

  const handleSubmit = () => {
    if (submit(input)) {
      setInput('');
    }
  };

  return (
    <>
      {/* Launcher flottante */}
      <AnimatePresence>
        {!copilotOpen && (
          <motion.button
            key="launcher"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            onClick={() => setCopilotOpen(true)}
            aria-label={isEn ? 'Open portfolio copilot' : 'Apri il copilot del portfolio'}
            className="glass-panel fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full text-accent-soft transition-colors hover:text-white"
          >
            <FiMessageCircle className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Pannello */}
      <AnimatePresence>
        {copilotOpen && (
          <motion.aside
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-label={isEn ? 'Portfolio copilot' : 'Copilot del portfolio'}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 48 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 48 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="glass-panel bg-zinc-950/95 backdrop-blur-xl shadow-2xl fixed inset-y-0 right-0 z-50 flex w-full flex-col sm:inset-y-3 sm:right-3 sm:w-[420px] sm:rounded-2xl"
            onWheel={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex flex-col gap-0.5">
                <span className="flex items-center gap-2 text-sm font-medium text-white">
                  <FiCpu className="h-4 w-4 text-accent" />
                  Copilot
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                    BM25 + e5 · {process.env.NEXT_PUBLIC_LLM_PROVIDER || 'AI'}
                  </span>
                </span>
                <EmbedderDot state={embedderState} isEn={isEn} />
              </div>
              <button
                onClick={() => setCopilotOpen(false)}
                aria-label={isEn ? 'Close copilot' : 'Chiudi il copilot'}
                className="rounded-full p-2 text-white/50 transition-colors hover:text-white"
              >
                <FiX className="h-4 w-4" />
              </button>
            </header>

            {/* Messaggi */}
            <div className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-4 text-sm text-white/85">
              {messages.length === 0 && (
                <div className="flex h-full flex-col justify-end gap-3 pb-2">
                  <p className="text-white/55">
                    {isEn ? "Ask me about Vito's thesis, projects, or background: I only answer based on portfolio documents, citing sources." : 'Chiedimi della tesi, dei progetti o del percorso di Vito: rispondo solo sulla base dei documenti del portfolio, citando le fonti.'}
                  </p>
                  <div className="flex flex-col items-start gap-2">
                    {isLoadingSuggestions ? (
                      // Skeleton loader per i suggerimenti
                      Array.from({ length: 3 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-6 w-48 animate-pulse rounded-full bg-white/5"
                        />
                      ))
                    ) : (
                      suggestions.map((q) => (
                        <button
                          key={q}
                          onClick={() => handleSuggestionClick(q)}
                          className="hairline rounded-full border bg-white/5 px-3 py-1.5 text-left text-xs text-white/75 transition-colors hover:bg-accent/15 hover:text-white"
                        >
                          {q}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <CopilotMessage
                  key={message.id}
                  message={message}
                  messages={messages}
                  flyToSection={flyToSection}
                  setCopilotOpen={setCopilotOpen}
                  feedbackGiven={feedbackGiven}
                  onFeedback={handleFeedback}
                />
              ))}

              {status === 'submitted' && (
                <p className="font-mono text-[11px] text-white/40">
                  <span className="animate-pulse">{isEn ? 'retrieval in progress…' : 'retrieval in corso…'}</span>
                </p>
              )}
              {status === 'error' && (
                <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-3 py-2 text-xs text-red-200">
                  {prettyError(error, isEn)}
                </p>
              )}

              {/* Suggerimenti persistenti */}
              {messages.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {suggestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSuggestionClick(q)}
                      className="hairline rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5 text-left text-[11px] text-white/70 transition-colors hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-accent)]/10 hover:text-[var(--color-accent-soft)]"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              <div ref={endRef} />
            </div>

            {/* Input */}
            <CopilotInput
              input={input}
              setInput={setInput}
              onSubmit={handleSubmit}
              busy={busy}
              copilotOpen={copilotOpen}
            />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
</file>

<file path="package.json">
{
  "name": "portfolio",
  "version": "0.2.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "dev:turbo": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "rag:ingest": "tsx scripts/rag-ingest.mts",
    "rag:eval": "tsx scripts/rag-eval.mts",
    "rag:judge": "tsx scripts/rag-judge.mts"
  },
  "dependencies": {
    "@ai-sdk/deepseek": "^2.0.39",
    "@ai-sdk/groq": "^3.0.42",
    "@ai-sdk/react": "^3.0.200",
    "@huggingface/transformers": "^3.7.0",
    "@react-three/drei": "^10.7.7",
    "@react-three/fiber": "^9.6.1",
    "@upstash/ratelimit": "^2.0.8",
    "@upstash/redis": "^1.38.0",
    "@vercel/analytics": "^1.5.0",
    "@vercel/speed-insights": "^1.2.0",
    "ai": "^6.0.198",
    "clsx": "^2.1.1",
    "dotenv": "^16.4.5",
    "framer-motion": "^12.7.4",
    "langfuse": "^3.38.20",
    "lenis": "^1.3.23",
    "next": "^16.2.9",
    "react": "^19.0.0",
    "react-dom": "^19.2.7",
    "react-icons": "^5.6.0",
    "three": "^0.184.0",
    "zod": "^4.1.13",
    "zustand": "^5.0.14"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3.3.5",
    "@tailwindcss/postcss": "^4",
    "@types/node": "^22",
    "@types/react": "^19",
    "@types/react-dom": "^19.2.3",
    "@types/three": "^0.184.1",
    "eslint": "^9",
    "eslint-config-next": "16.2.9",
    "tailwindcss": "^4",
    "tsx": "^4.20.6",
    "typescript": "^6.0.3",
    "vitest": "^4.1.9"
  },
  "overrides": {
    "postcss": "^8.5.10"
  },
  "engines": {
    "node": "22.x"
  }
}
</file>

</files>
