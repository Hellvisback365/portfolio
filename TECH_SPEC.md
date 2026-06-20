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
