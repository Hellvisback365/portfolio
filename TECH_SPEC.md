# TECH_SPEC — Portfolio RAG Copilot

Specifica tecnica dell'architettura attuale. Single source of truth: in caso di conflitto, vince il codice.

## Stack
- **Framework:** Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS 4.
- **AI SDK:** core `ai` v6 (`streamText`, `generateText`, `createUIMessageStream`, data parts); pacchetti `@ai-sdk/*` v3 (`@ai-sdk/groq`, `@ai-sdk/react`).
- **LLM (Groq-only, LPU):** `llama-3.3-70b-versatile` (generazione), `llama-3.1-8b-instant` (planner). Configurati in `src/lib/rag/providers.ts`. Nessun provider runtime alternativo.
- **Stato/3D:** Zustand (canale UI + canali transienti scroll/puntatore), React Three Fiber, Lenis, Framer Motion.
- **Voce:** Web Speech API nativa (STT `useSpeechRecognition` + TTS `useSpeechSynthesis`), zero dipendenze esterne.
- **Infra:** Vercel (serverless Node), Upstash Ratelimit (con mock no-op se le chiavi mancano), Langfuse (solo feedback).

## Copilot agentico (pipeline per richiesta)
1. Il client (`useCopilotChat`) calcola l'embedding della query **nel browser** via Web Worker (`worker.ts`, transformers.js, `multilingual-e5-small`); budget 1,5 s, altrimenti invia `null` e il server lavora in BM25-only. La chat non blocca mai sull'embedding.
2. `POST /api/chat` riceve `{ messages, queryVector? }` (validato con Zod).
3. **Fase 1 — Planner** (`generateText`, modello 8B, JSON-only, timeout 3,5 s): decide `intent` (`smalltalk` | `portfolio`), **1–3 query di ricerca autonome** (decomposizione agentica delle domande multi-parte) e l'azione UI (`navigateToSection` | `showProject` | `showSkillsRadar` | `none`). L'output è estratto con `parseLLMJSON` e **validato con `plannerSchema.safeParse`**; in caso di fallimento si usa un default sicuro (cerca l'ultima domanda dell'utente, nessuna azione UI).
4. **Esecuzione**: per ogni query pianificata si emette una data part **`data-search`** (traccia "reasoning" in chat) e si esegue il **retrieval ibrido** = BM25 Okapi + Cosine Similarity (sul `queryVector`) fusi con **Reciprocal Rank Fusion (RRF)**, più diversity cap per documento (`MAX_PER_DOC`). Le fonti sono **deduplicate** e pubblicate una sola volta come **`data-sources`** (chip nella UI). L'azione UI è emessa come **`data-uiAction`** e pilota la scena 3D / i widget in chat.
5. **Fase 2 — `streamText` (70B) SENZA strumenti**: genera la risposta in streaming sul contesto raccolto.

### Perché un planner JSON e non il function-calling nativo (scelta deliberata)
Il tool-calling nativo è **inaffidabile su Groq/Llama-3.3**: il modello emette spesso tool-call malformate (gli argomenti finiscono nel nome, formato `<function=nome{...}>`) che l'API Groq rifiuta — sia in `streamText` sia in `generateText`. La pipeline ottiene quindi lo stesso comportamento agentico (multi-query + controllo della scena) tramite **output JSON strutturato**, robusto al 100%. La retrieval ibrida è incapsulata ma **identica** alla precedente: nessuna regressione di qualità.

## Reranker — escluso in produzione (scelta deliberata)
Un Cross-Encoder (`ms-marco-MiniLM`) è stato valutato e benchmarkato in locale: migliora le metriche, ma su Vercel serverless causa cold-start di 3–10 s (ONNX Runtime Node + peso del modello). Dato il corpus ridotto (~18 chunk), la produzione usa il solo **Hybrid (BM25 + Semantic + RRF)**. La riga reranker resta nel benchmark a scopo comparativo. *(Altre ottimizzazioni valutate ed escluse — WebGPU/TSL, voice cloning, ecc.: vedi `README.md`.)*

## UI/UX & interazione 3D
- **Canale puntatore transiente** (`pointerState` nello store): un solo listener globale `pointermove` scrive le coordinate NDC, lette in `useFrame`. Necessario perché l'overlay HTML (`z-10`) copre il canvas (`z-0`) e R3F non riceverebbe gli eventi. Alimenta la **repulsione + vortice** delle particelle (`PhylloField`) e la parallasse della camera (`CameraRig`).
- **Command palette ⌘K** (`CommandPalette`): navigazione tastiera-first + trigger flottante per mobile; scroll isolato da Lenis.
- **Magnetic buttons** (`Magnetic`) sui CTA della hero; **barra di avanzamento** in **scroll-driven CSS nativo** (`animation-timeline: scroll()`), più il primitivo `.reveal-up` (`view-timeline`). Tutto rispetta `prefers-reduced-motion`.

## Voce
- **STT** (`useSpeechRecognition`): Web Speech API lingua-aware (it-IT / en-US), trascrizione live (interim) e **auto-invio** a fine frase.
- **TTS** (`useSpeechSynthesis`): attivo di default, **seleziona la voce neurale migliore** disponibile sul dispositivo (Natural/Neural/Google/online) con chunking per frasi (evita il taglio di Chrome sui testi lunghi); toggle 🔊 nell'header del copilot. Niente TTS cloud (vedi esclusioni nel README).

## Valutazione
- **Retrieval:** `npm run rag:eval` (Hit Rate / MRR). Numeri reali della pipeline Hybrid in produzione: **Hit Rate 70.0%, MRR 0.454**.
- **Generazione:** `npm run rag:judge` (LLM-as-a-Judge per la faithfulness). Il giudice usa un provider distinto dal generatore (`@ai-sdk/deepseek`, solo offline) per evitare bias di auto-valutazione.
- **Unit:** Vitest su BM25 e Hybrid Retriever.

## Lint & CI
- **ESLint flat config** nativa di `eslint-config-next` (niente `FlatCompat`, che su ESLint 9 va in crash). Script `lint`: `eslint .`. `@typescript-eslint/no-explicit-any` a `warn`, disattivato solo per `scripts/**`. Stato: **0 errori / 0 warning**.
- **CI** (`.github/workflows/deploy.yml`): lint → typecheck → test → build su push/PR verso `main`/`master`.

## Sicurezza & infra
- **Rate limiting:** `src/lib/ratelimit.ts` — `globalRatelimit` su `/api/chat` (sliding window), `feedbackRatelimit` sul feedback; mock no-op quando le chiavi Upstash sono assenti.
- **Headers/CSP:** in produzione niente `'unsafe-eval'` (solo `'wasm-unsafe-eval'` per il worker WASM); HSTS, Referrer-Policy, Permissions-Policy.
- **SEO:** dominio risolto da `getBaseUrl()` (`NEXT_PUBLIC_SITE_URL` → `VERCEL_PROJECT_PRODUCTION_URL` → fallback); `metadataBase`, `sitemap.ts`, `robots.ts`, JSON-LD allineati.

## Variabili d'ambiente
- **Richiesta:** `GROQ_API_KEY`.
- **Consigliate:** `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` (rate limiting reale); `NEXT_PUBLIC_LLM_PROVIDER` (label UI).
- **Opzionali:** `LANGFUSE_PUBLIC_KEY`, `LANGFUSE_SECRET_KEY`, `LANGFUSE_BASEURL` (feedback); `RAG_CHAT_MODEL`, `RAG_ROUTER_MODEL` (override dei default).
- **Solo locale:** `DEEPSEEK_API_KEY` (per `rag:judge`).
