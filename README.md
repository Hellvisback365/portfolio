# 🌌 Portfolio 3D & AI Copilot

Il mio portfolio personale, costruito con tecnologie avanzate in ambito **Web 3D** e **Agentic AI**.  
Combina un motore 3D leggero (React Three Fiber) con un assistente virtuale alimentato da un sistema **RAG (Retrieval-Augmented Generation) Ibrido**, permettendo ai visitatori di esplorare i miei progetti e pormi domande in linguaggio naturale.

## 🚀 Funzionalità Principali

- **UI 3D Immersiva:** Sviluppata in React Three Fiber, con navigazione tramite particelle intelligenti, shader personalizzati e transizioni fluide.
- **Agentic RAG Copilot:** Un assistente AI integrato e deterministico, che risponde alle domande basandosi esclusivamente sul mio CV, sui miei progetti e sulle mie esperienze.
  - *Hybrid Retrieval & RRF:* Ricerca ibrida che combina **BM25 Okapi** (lessicale) e **Semantic Search** (Cosine Similarity vettoriale). I punteggi vengono fusi tramite Reciprocal Rank Fusion.
  - *Client-Side Cross-Encoder Reranking:* I risultati ibridi vengono ulteriormente riordinati sul browser tramite un modello Cross-Encoder (MS-MARCO) che gira in un Web Worker, minimizzando il carico serverless e migliorando drasticamente la precisione del recupero.
  - *Continuous Evaluation:* Il sistema include una suite di benchmark proprietaria (Hit Rate, MRR) e uno script di valutazione end-to-end "LLM-as-a-Judge", che certifica il **98% di assenza di allucinazioni** (Faithfulness).
  - *Tool-Calling & UI Automation:* L'assistente comprende l'intento dell'utente e guida autonomamente l'interfaccia (es. evidenziare progetti o aprire la sezione competenze).
- **SEO & Telemetria:** Metadata completi (JSON-LD, OpenGraph, sitemap), oltre a un tracciamento avanzato delle risposte AI e del feedback utente tramite Langfuse.

## 🛠️ Stack Tecnologico

- **Frontend / 3D:** Next.js 14 (App Router), React, Tailwind CSS, Framer Motion, React Three Fiber, Drei, Lenis (Smooth Scrolling).
- **AI / RAG Pipeline:** Vercel AI SDK, `@huggingface/transformers` (Embeddings e Reranker in Web Worker), API Provider flessibili (DeepSeek, OpenRouter, Groq).
- **Testing & Eval:** Vitest, script custom TSX per benchmark MRR/HitRate.
- **Analytics / Telemetry:** Langfuse.

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
   - `DEEPSEEK_API_KEY` o `OPENROUTER_API_KEY` (configurate in `src/lib/rag/providers.ts`).
   - `LANGFUSE_*` (opzionale, per la telemetria LLM).

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
- **Valutazione Retrieval (MRR):** `npx tsx scripts/rag-eval.mts`
- **Valutazione Generazione (LLM come Giudice):** `npx tsx scripts/rag-judge.mts`

---
*Progettato e sviluppato da [Vito Piccolini](https://www.linkedin.com/in/vitopiccolini/)*
