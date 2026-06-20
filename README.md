# 🌌 Portfolio 3D & AI Copilot

Il mio portfolio personale, costruito con le tecnologie più recenti in ambito **Web 3D** e **Agentic AI**.  
Combina un motore 3D leggero (React Three Fiber) con un assistente virtuale alimentato da un sistema **RAG (Retrieval-Augmented Generation) Ibrido**, permettendo ai visitatori di esplorare i miei progetti e chiedermi domande in linguaggio naturale.

## 🚀 Funzionalità Principali

- **UI 3D Immersiva:** Sviluppata in React Three Fiber, con navigazione tramite particelle intelligenti e transizioni fluide.
- **Agentic RAG Copilot:** Un assistente AI integrato, multilingua, che risponde alle domande basandosi esclusivamente sul mio CV, sui miei progetti e sulla mia tesi.
  - *Parallel Routing:* Classificazione dell'intento (Llama-3.1-8B) in parallelo al retrieval lessicale per minimizzare la latenza.
  - *Hybrid Retrieval:* Ricerca ibrida avanzata. Utilizza **BM25 Okapi** per la ricerca testuale e **Semantic Search (Cosine Similarity)** eseguita lato client (grazie a `transformers.js` via Web Worker) senza costi API aggiuntivi.
  - *Reciprocal Rank Fusion (RRF):* Combinazione intelligente dei rank lessicali e semantici per trovare sempre i documenti più rilevanti.
  - *Tool-Calling Deterministico:* L'assistente capisce l'intento e guida autonomamente l'interfaccia utente (es. mostrare i progetti, aprire lo stack radar).
- **Prestazioni al Top:** Bundle analizzato e ottimizzato. Modello di embedding (`multilingual-e5-small`) caricato asincronamente in background sul browser.

## 🛠️ Stack Tecnologico

- **Frontend / 3D:** Next.js 14 (App Router), React, Tailwind CSS, Framer Motion, React Three Fiber, Drei, Lenis (Smooth Scrolling).
- **AI / RAG:** Vercel AI SDK, Groq (per Llama-3.3-70B e 8B), `@xenova/transformers` (Web Worker), TypeScript.
- **Analytics / Telemetry:** Langfuse (per il tracciamento delle risposte e feedback degli utenti).

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
   - `GROQ_API_KEY` (per l'inferenza LLM velocissima).
   - `LANGFUSE_*` (se desideri la telemetria).

4. **Avvia il server di sviluppo:**
   ```bash
   npm run dev
   ```
   Apri [http://localhost:3000](http://localhost:3000) nel browser.

## 📝 Script Utili
- `npm run build`: Compila l'applicazione per la produzione.
- `npm run rag:ingest`: Legge il file `codebase.md`, divide in chunk, estrae keywords e genera il `rag-index.json`.

---
*Progettato e sviluppato da [Vito Piccolini](https://www.linkedin.com/in/vitopiccolini/)*
