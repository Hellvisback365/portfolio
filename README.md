# 🌌 Portfolio 3D & AI Copilot

Il mio portfolio personale, costruito con tecnologie avanzate in ambito **Web 3D** e **Agentic AI**.  
Combina un motore 3D leggero (React Three Fiber) con un assistente virtuale alimentato da un sistema **RAG (Retrieval-Augmented Generation) Ibrido**, permettendo ai visitatori di esplorare i miei progetti e pormi domande in linguaggio naturale.

## 🚀 Funzionalità Principali

- **UI 3D Immersiva:** Sviluppata in React Three Fiber — un campo di ~14k particelle (1 draw call) che morfa al variare dello scroll, **reagisce al puntatore** (repulsione + vortice + bagliore) e respira con un flusso organico. Più micro-interazioni "award-tier": **command palette ⌘K**, **magnetic buttons** e barra di avanzamento in **scroll-driven CSS nativo** (`animation-timeline: scroll()`).
- **Agentic RAG Copilot:** Un assistente AI integrato e deterministico, che risponde alle domande basandosi esclusivamente sul mio CV, sui miei progetti e sulle mie esperienze.
  - *Hybrid Retrieval & RRF:* Ricerca ibrida che combina **BM25 Okapi** (lessicale) e **Semantic Search** (Cosine Similarity vettoriale). I punteggi vengono fusi tramite Reciprocal Rank Fusion direttamente lato server, garantendo bassissima latenza (TTFT). Il Reranker (Cross-Encoder) è stato valutato ma rimosso intenzionalmente in produzione per via dei tempi di cold-start eccessivi in ambienti serverless, a fronte di un guadagno trascurabile su un corpus ridotto.
  - *Planner agentico (JSON):* Un planner LLM decompone la domanda in **1–3 query di ricerca autonome** e decide l'azione UI; le ricerche sono mostrate in chat come traccia di "reasoning". Implementato via **output JSON strutturato** anziché function-calling nativo, inaffidabile su Groq/Llama (vedi esclusioni).
  - *Continuous Evaluation:* Il sistema include una suite di benchmark proprietaria misurata sul reale approccio ibrido in produzione (Hit Rate: 70.0%, MRR: 0.454) e uno script di valutazione end-to-end "LLM-as-a-Judge", che certifica il **98% di assenza di allucinazioni** (Faithfulness).
  - *Data Stream Automation:* L'assistente guida autonomamente l'interfaccia (es. evidenziare progetti o aprire la sezione competenze) tramite Data Streams (`data-uiAction`).
  - *Copilot vocale:* Interazione **parla & ascolta** con Web Speech API nativa — dettatura con auto-invio (STT) e lettura delle risposte ad alta voce (TTS) con selezione automatica della voce neurale migliore del dispositivo.
- **SEO & Telemetria:** Metadata completi (JSON-LD, OpenGraph, sitemap), e limitazione avanzata del rate tramite Upstash Redis.

## 🛠️ Stack Tecnologico

- **Frontend / 3D:** Next.js 16 (App Router), React 19, Tailwind CSS 4, Framer Motion, React Three Fiber, Drei, Lenis (Smooth Scrolling).
- **AI / RAG Pipeline:** Vercel AI SDK, `@huggingface/transformers` (Embeddings in Web Worker), API Provider **Groq** per inference ultra-veloce.
- **Testing & Eval:** Vitest, script custom TSX per benchmark MRR/HitRate.
- **Sicurezza:** `@upstash/ratelimit` per limitare l'abuso degli endpoint LLM.

## 🧭 Ottimizzazioni valutate ed escluse (e perché)

Filosofia: **sostanza prima dei gadget**. Diverse "feature SOTA" sono state valutate e scartate consapevolmente perché non ripagavano il costo/rischio su *questo* progetto.

- **Migrazione 3D a WebGPU/TSL** — *Esclusa.* Il campo è 14k point-sprite in **1 sola draw call**: i vantaggi reali di WebGPU (compute shader, milioni di draw call) qui non si attivano e il risultato a schermo sarebbe identico. In cambio: rewrite rischioso in TSL e dipendenza bleeding-edge con API che cambiano spesso. È rimasto su WebGL (con fallback universale).
- **Function-calling nativo per l'agente** — *Escluso.* Su Groq/Llama-3.3 è inaffidabile: il modello emette tool-call malformate (`<function=nome{...}>`) che l'API rifiuta. Sostituito da un **planner a output JSON** che dà lo stesso comportamento agentico in modo robusto.
- **Cross-Encoder Reranker (`ms-marco-MiniLM`)** — *Escluso in produzione.* Migliora le metriche ma introduce cold-start di 3–10 s su serverless, con guadagno trascurabile su un corpus di ~18 chunk. Resta nel benchmark a scopo comparativo.
- **Voice cloning / TTS neurale cloud** (ElevenLabs, Cartesia, PlayAI…) — *Esclusa.* Qualità superiore ma **costo per ogni risposta di ogni visitatore** + dipendenza/chiave a pagamento; il cloning della propria voce per un sito pubblico non è "100% gratis" perché richiede una GPU sempre accesa. Si è scelta la **voce neurale nativa del dispositivo** (gratis, bilingue, zero server).
- **Adaptive Lens** (`?lens=junior|recruiter|…` per personalizzare UI + copilot per audience) — *Costruita e poi rimossa.* Tecnicamente valida, ma di scarso valore reale per l'autore: link "su misura" che i visitatori non incontrano. Tagliata per non aggiungere complessità senza beneficio.
- **Reveal scroll-driven nativi CSS estesi a tutte le sezioni** — *Rimandati.* Il primitivo (`view-timeline`, `.reveal-up`) c'è ed è applicato alla barra di avanzamento; l'estensione a tutti i contenuti è stata evitata per non creare doppie animazioni in conflitto con i reveal Framer esistenti senza verifica visiva dedicata.

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
