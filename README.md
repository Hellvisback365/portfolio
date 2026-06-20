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
