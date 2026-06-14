# .github\dependabot.yml

```yml
# To get started with Dependabot version updates, you'll need to specify which
# package ecosystems to update and where the package manifests are located.
# Please see the documentation for all configuration options:
# https://docs.github.com/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file

version: 2
updates:
  - package-ecosystem: "" # See documentation for possible values
    directory: "/" # Location of package manifests
    schedule:
      interval: "weekly"

```

# .github\workflows\deploy.yml

```yml
name: Deploy Portfolio

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
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Type check
        run: npx tsc --noEmit
      
      - name: Build
        run: npm run build
      
      - name: Analyze bundle size
        run: npx next-bundle-analyzer
        env:
          ANALYZE: true
          NODE_ENV: production
      
      - name: Cache build
        uses: actions/cache@v3
        with:
          path: .next
          key: ${{ runner.os }}-nextjs-${{ hashFiles('**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx') }}
  
  deploy:
    needs: validate-and-build
    if: success() && github.event_name == 'push'
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Restore build cache
        uses: actions/cache@v3
        with:
          path: .next
          key: ${{ runner.os }}-nextjs-${{ hashFiles('**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx') }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./
          vercel-args: '--prod'
      
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            https://portfolio-vitopiccolini.vercel.app/
          uploadArtifacts: true
          temporaryPublicStorage: true 
```

# .gitignore

```
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

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

.vercel

```

# eslint.config.mjs

```mjs
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

```

# netlify.toml

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NETLIFY_NEXT_PLUGIN_SKIP = "true"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[functions]
  directory = "netlify/functions" 
```

# next-env.d.ts

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />
import "./.next/dev/types/routes.d.ts";

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.

```

# next.config.js

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        pathname: '/**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
    qualities: [50, 70, 75, 80, 85, 90, 95, 100],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // experimental: {
  //   scrollRestoration: true,
  // },
};

module.exports = nextConfig;
```

# package.json

```json
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
    "rag:ingest": "tsx scripts/rag-ingest.mts"
  },
  "dependencies": {
    "@ai-sdk/google": "^3.0.0",
    "@ai-sdk/groq": "^3.0.0",
    "@ai-sdk/react": "^3.0.200",
    "@getbrevo/brevo": "^3.0.1",
    "@huggingface/transformers": "^3.7.0",
    "@react-three/drei": "^10.7.7",
    "@react-three/fiber": "^9.6.1",
    "@vercel/analytics": "^1.5.0",
    "@vercel/speed-insights": "^1.2.0",
    "ai": "^6.0.198",
    "clsx": "^2.1.1",
    "dotenv": "^16.4.5",
    "framer-motion": "^12.7.4",
    "lenis": "^1.3.23",
    "next": "16.1.5",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-icons": "^5.5.0",
    "three": "^0.184.0",
    "zod": "^4.1.13",
    "zustand": "^5.0.14"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3",
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@types/three": "^0.184.1",
    "eslint": "^9",
    "eslint-config-next": "15.5.6",
    "tailwindcss": "^4",
    "tsx": "^4.20.6",
    "typescript": "^5"
  },
  "engines": {
    "node": ">=18.17.0"
  }
}

```

# postcss.config.mjs

```mjs
const config = {
  plugins: ["@tailwindcss/postcss"],
};

export default config;

```

# README.md

```md
# Portfolio di Vito Piccolini

Un sito portfolio moderno e reattivo costruito con Next.js, TypeScript, Tailwind CSS e Framer Motion.

## Caratteristiche

- 🌓 Tema chiaro/scuro con persistenza
- 📱 Design completamente responsive
- 🎯 Animazioni fluide con Framer Motion
- 📊 Barre di progresso animate per le competenze
- 📝 Modulo di contatto funzionante
- 🔄 CI/CD con GitHub Actions per deploy automatico su Vercel
- ⚡ Ottimizzazione delle performance con code splitting, lazy loading e immagini ottimizzate

## Struttura del Progetto

- `/src/components`: Componenti riutilizzabili
- `/src/app`: Pagine dell'applicazione (routing basato su cartelle)
- `/src/styles`: Fogli di stile globali
- `/public`: Asset statici

## Sviluppo Locale

\`\`\`bash
# Clona il repository
git clone https://github.com/username/portfolio.git
cd portfolio

# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev
\`\`\`

Ora puoi visitare `http://localhost:3000` nel tuo browser per vedere il sito in azione.

## Script Disponibili

- `npm run dev`: Avvia il server di sviluppo con hot reload
- `npm run build`: Crea una build ottimizzata per la produzione
- `npm run start`: Avvia il server di produzione con la build
- `npm run lint`: Esegue il linting del codice

## Ottimizzazioni Performance

Il sito include numerose ottimizzazioni per la performance:

- **Lazy Loading**: Componenti caricati dinamicamente con `next/dynamic`
- **Immagini Ottimizzate**: Utilizzo di `next/image` per ottimizzazione automatica
- **Code Splitting**: Caricamento del codice on-demand
- **Minificazione**: CSS e JS minificati in produzione
- **Prefetching**: Prefetching automatico di pagine per navigazione istantanea
- **Animazioni efficienti**: Utilizzo di Framer Motion con animazioni hardware-accelerated

## Deployment

Il sito è configurato per il deployment automatico su Vercel attraverso GitHub Actions.

Per eseguire un deploy manuale:

\`\`\`bash
# Installa Vercel CLI (se non già installato)
npm install -g vercel

# Login su Vercel
vercel login

# Deploy in modalità produzione
vercel --prod
\`\`\`

In alternativa, è possibile utilizzare Netlify:

\`\`\`bash
# Installa Netlify CLI (se non già installato)
npm install -g netlify-cli

# Login su Netlify
netlify login

# Deploy in modalità produzione
netlify deploy --prod
\`\`\`

## Tecnologie Utilizzate

- [Next.js](https://nextjs.org/) - Framework React
- [TypeScript](https://www.typescriptlang.org/) - JavaScript tipizzato
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utility-first
- [Framer Motion](https://www.framer.com/motion/) - Libreria di animazioni
- [React Intersection Observer](https://github.com/thebuilder/react-intersection-observer) - Animazioni on-scroll
- [Brevo](https://www.brevo.com/) - API per l'invio di email del form contatti

## Architettura & Integrazioni

- **App Router + Edge-ready API**: le route in `src/app/api/*` gestiscono il form contatti (`contact`), l'endpoint di test (`test-brevo`) e il logging dei Web Vitals (`metrics`) in modo indipendente dal layer di UI.
- **Dark mode dichiarativo**: il tema viene gestito da Tailwind e dal `ThemeProviderWrapper`, eliminando logiche imperative e MutationObserver dal layer di presentazione.
- **Performance surfaces**: `PerformanceMonitor`, immagini ottimizzate e componenti caricati dinamicamente mantengono il TTFB basso su Vercel/Netlify.
- **CI/CD ibrido**: il repo è configurato per deploy automatici su Vercel (GitHub Actions) ma può usare Netlify come fallback grazie ai file `vercel.json` e `netlify.toml` già pronti.

## AI Engineering Journey

- **BeFluent** ([repo](https://github.com/Hellvisback365/BeFluentVITO)): piattaforma React + Node.js pensata per bambini con DSA che integra LLM via LangChain per creare tutoring conversazionale adattivo.
- **POSD System** ([repo](https://github.com/Hellvisback365/POSD-System)): architettura MVC con focus su compliance GDPR, crittografia dei dati e tracciabilità del consenso.
- **LLM Tooling**: esperienza pratica con LLaMA/Mistral locali, prompt chaining e ottimizzazione dei tempi di inferenza; il portfolio funge da hub per future feature intelligenti (es. “Chat with my Resume” basata su RAG).

## Backend & Deployment Details

- `src/app/api/contact/route.ts`: gestisce la validazione dei dati del form, richiama `services/brevo.ts` e invia email verso l'indirizzo configurato.
- `src/app/api/metrics/route.ts`: endpoint pensato per tracciare i Web Vitals inviati dal componente `PerformanceMonitor` (estendibile a qualsiasi data store).
- `src/app/api/test-brevo/route.ts`: diagnostica rapida per verificare la corretta configurazione dell'API key Brevo durante lo sviluppo.
- **Hosting**: progettato per girare su Vercel (edge runtime + analytics native) ma pienamente compatibile con Netlify; basta configurare le stesse variabili d'ambiente (`BREVO_API_KEY`) sui due provider.

## Contatti

Vito Piccolini - [contatto@example.com](mailto:contatto@example.com)

## Modulo di Contatto con Brevo

Il form di contatto utilizza [Brevo API](https://www.brevo.com/) per inviare le email. Per configurarlo:

1. Crea un account gratuito su [Brevo](https://www.brevo.com/)
2. Vai su SMTP & API e genera una nuova API key
3. Crea un file `.env.local` nella radice del progetto con il seguente contenuto:
   \`\`\`
   BREVO_API_KEY=tua_api_key_qui
   \`\`\`
4. Registra un mittente verificato in Brevo o configura un dominio personalizzato
5. Aggiorna l'email di destinazione in `src/app/api/contact/route.ts` con la tua email

Se non hai accesso alla configurazione delle variabili d'ambiente (ad esempio su Vercel), aggiungile tramite il pannello di controllo del tuo provider di hosting.

```

# scripts\rag-ingest.mts

```mts
/**
 * Ingest RAG v2 — `npm run rag:ingest`
 *
 * 1. Legge src/content/profile/documents.json
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

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
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
  for (const sentence of sentences) {
    if (current && (current + ' ' + sentence).length > CHUNK_SIZE) {
      chunks.push(current);
      // overlap: la frase di confine apre anche il chunk successivo
      current = sentence;
    } else {
      current = current ? `${current} ${sentence}` : sentence;
    }
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

async function main() {
  const docsPath = join(rootDir, 'src', 'content', 'profile', 'documents.json');
  const documents = JSON.parse(readFileSync(docsPath, 'utf-8')) as ProfileDocument[];
  if (!documents.length) throw new Error('Nessun documento in documents.json');
  console.log(`[ingest] ${documents.length} documenti di profilo.`);

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

```

# SECURITY.md

```md
# Security Policy

## Supported Versions

Use this section to tell people about which versions of your project are
currently being supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 5.1.x   | :white_check_mark: |
| 5.0.x   | :x:                |
| 4.0.x   | :white_check_mark: |
| < 4.0   | :x:                |

## Reporting a Vulnerability

Use this section to tell people how to report a vulnerability.

Tell them where to go, how often they can expect to get an update on a
reported vulnerability, what to expect if the vulnerability is accepted or
declined, etc.

```

# src\app\api\chat\route.ts

```ts
import { NextResponse } from 'next/server';
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  generateObject,
  stepCountIs,
  streamText,
  tool,
  type LanguageModel,
  type UIMessage,
} from 'ai';
import { z } from 'zod';
import { getRetriever, type RetrievedChunk } from '@/lib/rag/retriever';
import { getProviders } from '@/lib/rag/providers';
import { SECTIONS } from '@/store/useAppStore';

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
const TOP_K = 4;
const ROUTER_TIMEOUT_MS = 1200;

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
  intent: z.enum(['smalltalk', 'portfolio', 'navigate']),
  standalone: z
    .string()
    .describe('La domanda riscritta in forma autonoma, in italiano.'),
});

type RouterDecision = z.infer<typeof routerSchema>;

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

  return `Sei il copilot del portfolio di Vito Piccolini, AI engineer (Torino).
Rispondi SOLO sulla base delle fonti qui sotto e della conversazione. Se l'informazione non c'è, dillo con onestà e suggerisci cosa puoi raccontare invece: non inventare mai date, aziende, numeri o titoli.

REGOLE
- Rispondi in italiano (o nella lingua dell'utente), in modo conciso: 2-5 frasi in prosa, niente elenchi puntati se non richiesti.
- Quando usi una fonte, citala inline con il suo tag, es. [S1].
- Tono: competente e diretto, mai pomposo.
- Se l'utente vuole vedere una sezione del sito (progetti, skills, contatti...), chiama il tool navigateToSection.
- Se chiede di un progetto specifico, puoi affiancare alla risposta il tool showProject con il nome canonico (es. "LACAM-SWAP", "Zenith", "EnLexi", "TerraNode", "The Pulse", "BeFluent").
- Se chiede una panoramica delle competenze, puoi chiamare showSkillsRadar.
- Includi SEMPRE la risposta testuale completa nello STESSO messaggio in cui chiami un tool: prima scrivi la risposta in prosa, poi chiama il tool. Non chiamare mai un tool senza accompagnarlo dal testo e non ripetere due volte la stessa risposta.

CONTATTI PUBBLICI (puoi condividerli liberamente)
- Email: vitopiccolini@live.it
- LinkedIn: https://www.linkedin.com/in/vitopiccolini/
- GitHub: https://github.com/Hellvisback365

FONTI
${context}`;
}

async function routeQuery(
  router: LanguageModel,
  dialogue: string,
  fallbackQuestion: string,
): Promise<RouterDecision> {
  const fallback: RouterDecision = {
    intent: 'portfolio',
    standalone: fallbackQuestion,
  };
  if (!fallbackQuestion) return { intent: 'smalltalk', standalone: '' };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ROUTER_TIMEOUT_MS);
  try {
    const { object } = await generateObject({
      model: router,
      schema: routerSchema,
      abortSignal: controller.signal,
      temperature: 0,
      prompt: `Classifica l'ultimo messaggio dell'utente in una chat sul portfolio di Vito Piccolini.

intent:
- "smalltalk": saluti, ringraziamenti, chiacchiere non legate al portfolio
- "navigate": l'utente chiede esplicitamente di vedere/aprire una sezione del sito
- "portfolio": domande su Vito (progetti, tesi, esperienze, skills, formazione, contatti)

standalone: riscrivi l'ultimo messaggio come domanda autonoma e completa in italiano, risolvendo i pronomi con il contesto della conversazione (es. "e in quel progetto?" -> "Che ruolo ha avuto Vito nel progetto Zenith?"). Per smalltalk usa stringa vuota.

CONVERSAZIONE
${dialogue}`,
    });
    return object;
  } catch {
    // Timeout o errore del router: la chat non deve accorgersene.
    return fallback;
  } finally {
    clearTimeout(timer);
  }
}

// ── Route ─────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  const providers = getProviders();
  if (!providers) {
    return NextResponse.json(
      {
        error:
          'Copilot non configurato: aggiungi GROQ_API_KEY (gratuita su console.groq.com) alle variabili d\'ambiente.',
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

  // Router e retriever partono insieme: il retrieval lessicale sulla
  // domanda grezza copre il caso in cui il router scada in timeout.
  const retrieverPromise = getRetriever();
  const decisionPromise = routeQuery(
    providers.router,
    recentDialogue(history),
    question,
  );

  const [retriever, decision] = await Promise.all([
    retrieverPromise,
    decisionPromise,
  ]);

  let sources: RetrievedChunk[] = [];
  if (decision.intent !== 'smalltalk' && question) {
    const rewritten = decision.standalone.trim();
    // Il vettore è stato calcolato dal client sulla domanda originale:
    // lo usiamo com'è; la gamba BM25 beneficia invece del rewrite.
    sources = retriever.retrieve(rewritten || question, queryVector, TOP_K);
    if (sources.length === 0 && rewritten && rewritten !== question) {
      sources = retriever.retrieve(question, queryVector, TOP_K);
    }
  }

  const result = streamText({
    model: providers.chat,
    system: buildSystemPrompt(sources),
    messages: await convertToModelMessages(history),
    temperature: 0.4,
    stopWhen: stepCountIs(1),
    tools: {
      navigateToSection: tool({
        description:
          'Scorri il sito verso una sezione. Usalo quando l\'utente chiede di vedere o aprire una parte del portfolio.',
        inputSchema: z.object({
          section: z.enum(SECTIONS),
        }),
        execute: async ({ section }) => ({ ok: true, section }),
      }),
      showProject: tool({
        description:
          'Mostra una card riassuntiva di un progetto specifico accanto alla risposta.',
        inputSchema: z.object({
          projectName: z
            .string()
            .describe('Nome canonico del progetto, es. "LACAM-SWAP" o "Zenith".'),
        }),
        execute: async ({ projectName }) => ({ ok: true, projectName }),
      }),
      showSkillsRadar: tool({
        description:
          'Mostra una panoramica visuale dello stack di competenze di Vito.',
        inputSchema: z.object({}),
        execute: async () => ({ ok: true }),
      }),
    },
  });

  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      writer.write({ type: 'start' });
      if (sources.length > 0) {
        writer.write({
          type: 'data-sources',
          data: sources.map((s, i) => ({
            tag: `S${i + 1}`,
            id: s.id,
            title: s.title,
            category: s.category,
            score: Math.round(s.score * 1e4) / 1e4,
          })),
        });
      }
      writer.merge(result.toUIMessageStream({ sendStart: false }));
    },
  });

  return createUIMessageStreamResponse({ stream });
}

```

# src\app\api\contact\route.ts

```ts
import { NextResponse } from 'next/server';
import { sendEmail } from '@/services/brevo';

export async function POST(request: Request) {
  try {
    console.log('Ricevuta richiesta form contatti');
    const data = await request.json();
    const { name, email, message } = data;
    
    console.log('Dati form:', { name, email });
    
    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Tutti i campi sono obbligatori' },
        { status: 400 }
      );
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Formato email non valido' },
        { status: 400 }
      );
    }

    // Verifica che l'API key sia configurata correttamente
    if (!process.env.BREVO_API_KEY) {
      console.error('BREVO_API_KEY non è definita nelle variabili d\'ambiente');
      return NextResponse.json(
        { error: 'Configurazione server incompleta (API key mancante)' },
        { status: 500 }
      );
    }

    // Send email using Brevo service
    try {
      console.log('Inizio invio email tramite Brevo');
      const result = await sendEmail({
        to: [
          {
            email: 'vitopiccolini@live.it', // Replace with your actual email
            name: 'Vito Piccolini'
          }
        ],
        subject: `Nuovo messaggio dal form contatti da ${name}`,
        htmlContent: `
          <html>
            <body>
              <h2>Nuovo messaggio dal form contatti</h2>
              <p><strong>Nome:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Messaggio:</strong></p>
              <p>${message.replace(/\n/g, '<br>')}</p>
            </body>
          </html>
        `,
        replyTo: {
          email: email,
          name: name
        }
      });
      
      console.log('Email inviata con successo:', result);
      return NextResponse.json(
        { success: true, message: 'Messaggio inviato con successo' },
        { status: 200 }
      );
    } catch (emailError) {
      console.error('Errore dettagliato durante invio email:', emailError);
      return NextResponse.json(
        { error: emailError instanceof Error ? emailError.message : 'Errore durante l\'invio dell\'email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Errore generale form contatti:', error);
    return NextResponse.json(
      { error: 'Si è verificato un errore durante l\'invio del messaggio' },
      { status: 500 }
    );
  }
} 
```

# src\app\globals.css

```css
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

```

# src\app\layout.tsx

```tsx
import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`dark ${inter.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <body className="bg-ink text-[var(--text-primary)]">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

```

# src\app\page.tsx

```tsx
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
function ScrollBridge() {
  useLenis((lenis) => {
    const p = lenis.limit > 0 ? lenis.scroll / lenis.limit : 0;
    scrollProgress.value = p;
    scrollProgress.stage = p * (SECTIONS.length - 1);
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

```

# src\components\canvas\CameraRig.tsx

```tsx
'use client';

import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

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

```

# src\components\canvas\Experience.tsx

```tsx
'use client';

import { useState } from 'react';
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
      <PerformanceMonitor
        onIncline={() => setDpr((d) => Math.min(1.75, d + 0.25))}
        onDecline={() => setDpr((d) => Math.max(1, d - 0.25))}
      >
        <CameraRig reducedMotion={reducedMotion} />
        <PhylloField reducedMotion={reducedMotion} isCoarsePointer={isCoarse} />
      </PerformanceMonitor>
    </Canvas>
  );
}

```

# src\components\canvas\PhylloField.tsx

```tsx
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

```

# src\components\canvas\targets.ts

```ts
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

/** 2 · SKILLS — Reticolo: conoscenza strutturata, jitter minimo. */
export function lattice(n: number): Float32Array {
  const out = new Float32Array(n * 3);
  const rand = rng(23);
  const side = Math.floor(Math.cbrt(n));
  const spacing = 0.36;
  const half = ((side - 1) * spacing) / 2;
  let i = 0;
  for (let x = 0; x < side && i < n; x++) {
    for (let y = 0; y < side && i < n; y++) {
      for (let z = 0; z < side && i < n; z++) {
        out[i * 3 + 0] = x * spacing - half + (rand() - 0.5) * 0.05;
        out[i * 3 + 1] = (y * spacing - half) * 0.72 + (rand() - 0.5) * 0.05;
        out[i * 3 + 2] = (z * spacing - half) * 0.72 + (rand() - 0.5) * 0.05;
        i++;
      }
    }
  }
  // punti residui (n non è un cubo perfetto): polvere interna
  for (; i < n; i++) {
    out[i * 3 + 0] = (rand() * 2 - 1) * half;
    out[i * 3 + 1] = (rand() * 2 - 1) * half * 0.72;
    out[i * 3 + 2] = (rand() * 2 - 1) * half * 0.72;
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

```

# src\components\overlay\AboutOverlay.tsx

```tsx
'use client';

import { motion } from 'framer-motion';
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

const focusPills = ['Assistenti enterprise', 'Multi-agent Recsys', 'Workflow automation', 'AI compliance'];

const formationItems = [
  {
    label: 'LM-18 · Computer Science – AI',
    detail: 'Università degli Studi di Bari Aldo Moro · Da Ottobre 2025',
  },
  {
    label: 'Laurea L-31 · 107/110',
    detail: 'Informatica e Tecnologia per la Produzione del Software · UniBa (2022-2025)',
  },
  {
    label: 'Diploma · Amministrazione, Finanza e Marketing',
    detail: 'I.I.S.S Alpi-Montale, Rutigliano (BA) · 2011-2016',
  },
];

const interestItems = [
  { label: 'Recommender Systems & Multi-Agent LLM', icon: <FaBrain className="text-[white]" /> },
  { label: 'NLP, Transformer & Explainability', icon: <FaLanguage className="text-[white]" /> },
  { label: 'Workflow Automation (n8n · API Integration)', icon: <FaShieldAlt className="text-[white]" /> },
];

const socialLinks = [
  { icon: <FaGithub />, href: 'https://github.com/Hellvisback365', label: 'GitHub' },
  { icon: <FaLinkedin />, href: 'https://www.linkedin.com/in/vitopiccolini/', label: 'LinkedIn' },
  { icon: <FaEnvelope />, href: 'mailto:vitopiccolini@live.it', label: 'Email' },
];

const timelineMilestones = [
  {
    id: 1,
    date: 'Giugno 2026',
    title: 'Talent Program "Next Pulse"',
    location: 'Chieti',
    description: 'Sviluppo backend in team per EnLexi: un AI Sales Assistant multi-sorgente.',
    highlights: [
      'Bootcamp selettivo intensivo su scala nazionale (320 candidati).',
      'Implementazione pipeline di retrieval ibrida (BM25 + ChromaDB/FAISS) con FastAPI.',
    ],
  },
  {
    id: 2,
    date: 'Maggio 2026',
    title: 'PugliaHack 2026',
    location: 'Bari',
    description: 'Sviluppo in autonomia di TerraNode, piattaforma per lo smart agri-tourism.',
    highlights: [
      'Stack React 19, TailwindCSS, Supabase (PostgreSQL).',
      'Sviluppato in sole 2 ore. Gamification, tracciamento CO2 e dashboard KPI in tempo reale.',
    ],
  },
  {
    id: 3,
    date: 'Maggio 2026',
    title: 'Hackathon "Space Edition"',
    location: 'Milano · Talent Garden x Leonardo',
    description: '2° Classificato all\'hackathon nazionale per l\'ideazione di The Pulse.',
    highlights: [
      'Progetto per una costellazione di piccoli satelliti dedicati al monitoraggio agricolo globale.',
      'Integrazione di logiche di telerilevamento e Artificial Intelligence.',
    ],
  },
  {
    id: 4,
    date: 'Settembre–Novembre 2025',
    title: 'B.Future Challenge 2025 · VAR Group x CRIF',
    location: 'Bologna · Remote',
    description: 'Partecipante alla challenge aziendale: sviluppo in team di Zenith, assistente AI per consulenza.',
    highlights: [
      'Workflow automatizzato con n8n, Gemini e Google Drive API.',
      'Riduzione stimata dei tempi di reportistica da 7 giorni a 1.',
    ],
  },
  {
    id: 5,
    date: 'Marzo–Giugno 2025',
    title: 'Tirocinio Curriculare · LACAM-SWAP',
    location: 'Università di Bari',
    description: 'Progetto di tesi: Orchestrazione di Agenti LLM per l\'Ottimizzazione Multi-Metrica nei Sistemi di Raccomandazione.',
    highlights: [
      'Architettura multi-agente LangGraph + RAG Ibrido (BM25 e FAISS).',
      '+12% novelty mantenendo inalterata la precisione media del baseline con Llama 3.2 3B.',
    ],
  },
  {
    id: 6,
    date: 'Settembre 2022–Luglio 2025',
    title: 'Laurea Triennale L-31 · 107/110',
    location: 'Università degli Studi di Bari Aldo Moro',
    description: 'Informatica e Tecnologia per la Produzione del Software.',
    highlights: [
      'Tesi su orchestrazione multi-agente LLM applicata ai sistemi di raccomandazione.',
      'Prosecuzione in LM-18 Computer Science – Artificial Intelligence.',
    ],
  },
  {
    id: 7,
    date: '2016–2022',
    title: 'Operaio Generico e Retail',
    location: 'Bari',
    description: 'Esperienza lavorativa in settori trasversali (edilizia, agricoltura, reception, gestione negozio).',
    highlights: [
      '6 anni di esperienza prima di intraprendere il percorso in Informatica.',
      'Forte focus su resilienza, problem-solving, e capacità di adattamento in team.',
    ],
  },
];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export default function AboutOverlay() {
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
          <p className="text-[0.65rem] uppercase tracking-[0.5em] text-[white]/70">Chi sono</p>
          <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
            Studente in Computer Science – AI
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-white/60">
            Laureando magistrale appassionato di IA e Machine Learning, con esperienza in sistemi di
            raccomandazione LLM-driven e automazione workflow.
          </p>
        </motion.div>

        {/* Main grid: portrait + bio */}
        <div className="grid gap-6 lg:grid-cols-[0.8fr,1.2fr]">
          {/* Portrait card */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            variants={fadeIn}
            className="glass-holographic overflow-hidden rounded-2xl"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[5/6]">
              <Image
                src="/me.jpg"
                alt="Vito Piccolini"
                fill
                priority
                quality={90}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                className="object-cover"
                style={{ objectPosition: 'center 18%' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.4em] text-white/60">
                <span className="h-1.5 w-1.5 rounded-full bg-[white]" />
                Ritratto · Bari 2025
              </div>
            </div>
            <div className="border-t border-white/10 bg-black/40 px-5 py-5 backdrop-blur">
              <p className="text-[0.6rem] uppercase tracking-[0.4em] text-white/50">AI Developer</p>
              <h3 className="mt-1 text-xl font-semibold text-white">Vito Piccolini</h3>
              <p className="mt-1 text-xs text-white/60">
                Sviluppo sistemi di raccomandazione LLM-driven, architetture multi-agente e automazioni
                workflow con Python e LangGraph.
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
                <p>
                  Dopo la laurea triennale in Informatica (107/110) sto proseguendo con la LM-18 in
                  Computer Science – Artificial Intelligence presso l&apos;Università di Bari.
                </p>
                <p>
                  Durante il tirocinio nel laboratorio LACAM-SWAP ho sviluppato un&apos;architettura
                  multi-agente basata su LLM, orchestrata con LangGraph, ottenendo +12% di diversità e
                  +53% precision@1.
                </p>
                <p>
                  Competenze in Python, LangChain, LangGraph, React, Node.js e n8n per prototipazione
                  rapida in team multidisciplinari.
                </p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {focusPills.map((pill) => (
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
                <p className="text-[0.6rem] uppercase tracking-[0.4em] text-white/50">Formazione</p>
                <div className="mt-3 space-y-3">
                  {formationItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-start gap-2 rounded-xl border border-white/8 bg-white/5 p-3"
                    >
                      <FaGraduationCap className="mt-0.5 shrink-0 text-[white] text-sm" />
                      <div>
                        <p className="text-xs font-semibold text-white">{item.label}</p>
                        <p className="text-[0.65rem] text-white/60">{item.detail}</p>
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
                <p className="text-[0.6rem] uppercase tracking-[0.4em] text-white/50">Interessi</p>
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
          <p className="text-[0.65rem] uppercase tracking-[0.5em] text-[white]/70">Percorso</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Ricerca, challenge e delivery</h3>
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
                      {item.date}
                    </Badge>
                    <span className="text-[0.6rem] uppercase tracking-[0.3em] text-white/40">
                      {item.location}
                    </span>
                  </div>
                  <h4 className="mt-3 text-lg font-semibold text-white">{item.title}</h4>
                  <p className="mt-1 text-xs text-white/70">{item.description}</p>
                  <ul className="mt-3 space-y-1.5">
                    {item.highlights.map((h) => (
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

```

# src\components\overlay\ContactOverlay.tsx

```tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaCalendarAlt, FaGithub, FaLinkedin } from 'react-icons/fa';
import useResponsive from '@/hooks/useResponsive';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const contactDetails = [
  {
    label: 'Email',
    value: 'vitopiccolini@live.it',
    helper: 'Preferita per brief strutturati (risposta entro 24h).',
    icon: <FaEnvelope className="text-[white]" />,
    href: 'mailto:vitopiccolini@live.it',
  },
  {
    label: 'Telefono',
    value: '+39 3937382774',
    helper: 'Disponibile 9:00–18:00, anche WhatsApp.',
    icon: <FaPhoneAlt className="text-[white]" />,
    href: 'tel:+393937382774',
  },
  {
    label: 'Base operativa',
    value: 'Bari · Remote EU',
    helper: 'Patente B, trasferte in giornata su richiesta.',
    icon: <FaMapMarkerAlt className="text-[white]" />,
  },
  {
    label: 'Disponibilità',
    value: 'Novembre 2025',
    helper: 'Stage curriculare LM-18 o collaborazione AI-first.',
    icon: <FaCalendarAlt className="text-[white]" />,
  },
];

const socialLinks = [
  { icon: <FaGithub className="h-4 w-4" />, href: 'https://github.com/Hellvisback365', label: 'GitHub' },
  { icon: <FaLinkedin className="h-4 w-4" />, href: 'https://www.linkedin.com/in/vitopiccolini/', label: 'LinkedIn' },
  { icon: <FaEnvelope className="h-4 w-4" />, href: 'mailto:vitopiccolini@live.it', label: 'Email' },
];

export default function ContactOverlay() {
  const { isMobile } = useResponsive();
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Il nome è richiesto';
    if (!formData.email.trim()) {
      newErrors.email = "L'email è richiesta";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Formato email non valido';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Il messaggio è richiesto';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Il messaggio deve contenere almeno 10 caratteri';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Errore invio del messaggio');
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Si è verificato un errore');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="flex min-h-screen w-screen flex-col items-center justify-center px-4 py-16 sm:px-8">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-[0.65rem] uppercase tracking-[0.5em] text-[white]/70">Contatto</p>
          <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Contattami</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/60">
            Sto entrando nella Laurea Magistrale in Computer Science – AI (UniBa) e sono disponibile
            per stage, R&D o progetti AI-first.
          </p>
        </motion.div>

        {/* Contact cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid gap-3 sm:grid-cols-2"
        >
          {contactDetails.map((item) => (
            <div
              key={item.label}
              className="glass-holographic rounded-xl p-4"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/40">
                  {item.icon}
                </span>
                <div>
                  <p className="text-[0.55rem] uppercase tracking-[0.3em] text-white/50">
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-sm font-semibold text-[white] transition-colors hover:text-white"
                    >
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

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto max-w-lg"
        >
          {submitSuccess && (
            <div className="mb-4 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-xs text-emerald-300">
              Grazie per il tuo messaggio! Ti risponderò al più presto.
            </div>
          )}
          {submitError && (
            <div className="mb-4 rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-xs text-red-300">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="glass-holographic rounded-2xl p-5 space-y-4">
            <div>
              <label htmlFor="contact-name" className="mb-1 block text-xs font-medium text-white/60">
                Nome
              </label>
              <input
                type="text"
                id="contact-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-[white]/40"
                placeholder="Il tuo nome"
                aria-required="true"
                aria-invalid={Boolean(errors.name)}
              />
              {errors.name && (
                <p className="mt-1 text-[0.65rem] text-red-400">{errors.name}</p>
              )}
            </div>
            <div>
              <label htmlFor="contact-email" className="mb-1 block text-xs font-medium text-white/60">
                Email
              </label>
              <input
                type="email"
                id="contact-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-[white]/40"
                placeholder="La tua email"
                aria-required="true"
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email && (
                <p className="mt-1 text-[0.65rem] text-red-400">{errors.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="contact-message" className="mb-1 block text-xs font-medium text-white/60">
                Messaggio
              </label>
              <textarea
                id="contact-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={isMobile ? 3 : 4}
                className="w-full resize-none rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-[white]/40"
                placeholder="Il tuo messaggio"
                aria-required="true"
                aria-invalid={Boolean(errors.message)}
              />
              {errors.message && (
                <p className="mt-1 text-[0.65rem] text-red-400">{errors.message}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg border border-[white]/30 bg-[white]/10 py-2.5 text-xs font-semibold uppercase tracking-[0.3em] text-[white] transition-all hover:bg-[white]/20 hover:shadow-[0_0_20px_rgba(93,224,230,0.15)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Invio in corso...' : 'Invia Messaggio'}
            </button>
          </form>
        </motion.div>

        {/* Mini footer */}
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
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 text-white/50 transition-all hover:border-[white]/40 hover:text-[white]"
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

```

# src\components\overlay\CopilotOverlay.tsx

```tsx
'use client';

import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FiArrowUp, FiCpu, FiMessageCircle, FiX } from 'react-icons/fi';
import { useAppStore } from '@/store/useAppStore';
import {
  embedQuery,
  getEmbedderState,
  subscribeEmbedder,
  warmupEmbedder,
  type EmbedderState,
} from '@/lib/rag/embedder';
import ProjectCard from '@/components/ui/rag/ProjectCard';
import SkillsRadar from '@/components/ui/rag/SkillsRadar';

/**
 * Copilot del portfolio — client del nuovo stack RAG.
 *
 * - useChat (AI SDK v6): messaggi a `parts`, streaming nativo, storico
 *   completo inviato al server (il vecchio client perdeva tutto con
 *   `messages.slice(-1)` lato API).
 * - All'apertura parte il warmup di multilingual-e5-small nel browser;
 *   ogni invio prova a calcolare il query vector con un budget di 2 s:
 *   se il modello non è pronto si manda null e il server lavora in
 *   BM25-only. La chat non aspetta mai l'embedding.
 * - Le parts vengono renderizzate per tipo: testo, chips fonti
 *   (`data-sources`), card progetto, radar skills, navigazione.
 */

interface SourceChip {
  tag: string;
  id: string;
  title: string;
  category: string;
  score: number;
}

const SUGGESTIONS = [
  'Di cosa parla la tesi di Vito?',
  'Raccontami del progetto Zenith',
  'Che esperienza ha con i sistemi RAG?',
];

// Narrowing helper: con UIMessage non parametrizzato le parts custom
// arrivano come union larga; concentriamo qui i cast controllati.
type AnyPart = { type: string } & Record<string, unknown>;

function withTimeout<T>(p: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}

function prettyError(err: Error | undefined): string {
  if (!err) return 'Si è verificato un errore.';
  try {
    const parsed = JSON.parse(err.message) as { error?: string };
    if (parsed.error) return parsed.error;
  } catch {
    /* il body non era JSON */
  }
  return err.message || 'Si è verificato un errore.';
}

function EmbedderDot({ state }: { state: EmbedderState }) {
  if (state === 'error') return null; // degradazione silenziosa
  const label =
    state === 'ready'
      ? 'retrieval semantico attivo'
      : 'carico il modello semantico…';
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

function SourceChips({ sources }: { sources: SourceChip[] }) {
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {sources.map((s) => (
        <span
          key={s.id}
          title={`${s.category} · score ${s.score}`}
          className="hairline rounded-full border bg-accent/10 px-2 py-0.5 font-mono text-[10px] text-accent-soft"
        >
          {s.tag} · {s.title}
        </span>
      ))}
    </div>
  );
}

export default function CopilotOverlay() {
  const copilotOpen = useAppStore((s) => s.copilotOpen);
  const setCopilotOpen = useAppStore((s) => s.setCopilotOpen);
  const flyToSection = useAppStore((s) => s.flyToSection);
  const reduceMotion = useReducedMotion();

  const [input, setInput] = useState('');
  const [embedderState, setEmbedderState] = useState<EmbedderState>(() =>
    getEmbedderState(),
  );
  const processedTools = useRef<Set<string>>(new Set());
  const endRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const transport = useMemo(
    () => new DefaultChatTransport({ api: '/api/chat' }),
    [],
  );
  const { messages, sendMessage, status, error } = useChat({ transport });
  const busy = status === 'submitted' || status === 'streaming';

  // Warmup del modello di embedding all'apertura del pannello.
  useEffect(() => {
    if (!copilotOpen) return;
    warmupEmbedder();
    textareaRef.current?.focus();
    return subscribeEmbedder(setEmbedderState);
  }, [copilotOpen]);

  // Side-effect dei tool di navigazione: una sola volta per toolCallId.
  useEffect(() => {
    for (const message of messages) {
      for (const part of message.parts as AnyPart[]) {
        if (
          part.type === 'tool-navigateToSection' &&
          part.state === 'output-available' &&
          typeof part.toolCallId === 'string' &&
          !processedTools.current.has(part.toolCallId)
        ) {
          processedTools.current.add(part.toolCallId);
          const args = part.input as { section?: string } | undefined;
          if (args?.section) flyToSection(args.section);
        }
      }
    }
  }, [messages, flyToSection]);

  // Auto-scroll in fondo a ogni aggiornamento.
  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'end',
    });
  }, [messages, status, reduceMotion]);

  const submit = useCallback(
    async (raw?: string) => {
      const text = (raw ?? input).trim();
      if (!text || busy) return;
      setInput('');
      // Budget di 2 s per il vettore: oltre, si degrada a BM25-only.
      const queryVector = await withTimeout(embedQuery(text), 2000, null);
      sendMessage({ text }, { body: { queryVector } });
    },
    [input, busy, sendMessage],
  );

  const renderPart = (
    messageId: string,
    part: AnyPart,
    index: number,
  ): ReactNode => {
    const key = `${messageId}-${index}`;
    switch (part.type) {
      case 'text':
        return (
          <p key={key} className="whitespace-pre-wrap leading-relaxed">
            {part.text as string}
          </p>
        );
      case 'data-sources':
        return <SourceChips key={key} sources={part.data as SourceChip[]} />;
      case 'tool-showProject': {
        if (part.state !== 'output-available') return null;
        const args = part.input as { projectName?: string } | undefined;
        return args?.projectName ? (
          <ProjectCard
            key={key}
            projectName={args.projectName}
            onExplore={() => {
              flyToSection('projects');
              setCopilotOpen(false);
            }}
          />
        ) : null;
      }
      case 'tool-showSkillsRadar':
        return part.state === 'output-available' ? (
          <SkillsRadar key={key} />
        ) : null;
      case 'tool-navigateToSection': {
        if (part.state !== 'output-available') return null;
        const args = part.input as { section?: string } | undefined;
        return (
          <p key={key} className="font-mono text-[11px] text-accent-soft">
            → ti porto alla sezione {args?.section}
          </p>
        );
      }
      default:
        return null;
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
            aria-label="Apri il copilot del portfolio"
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
            aria-label="Copilot del portfolio"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 48 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 48 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="glass-panel fixed inset-y-0 right-0 z-50 flex w-full flex-col sm:inset-y-3 sm:right-3 sm:w-[420px] sm:rounded-2xl"
          >
            {/* Header */}
            <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex flex-col gap-0.5">
                <span className="flex items-center gap-2 text-sm font-medium text-white">
                  <FiCpu className="h-4 w-4 text-accent" />
                  Copilot
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                    BM25 + e5 · Groq
                  </span>
                </span>
                <EmbedderDot state={embedderState} />
              </div>
              <button
                onClick={() => setCopilotOpen(false)}
                aria-label="Chiudi il copilot"
                className="rounded-full p-2 text-white/50 transition-colors hover:text-white"
              >
                <FiX className="h-4 w-4" />
              </button>
            </header>

            {/* Messaggi */}
            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 text-sm text-white/85">
              {messages.length === 0 && (
                <div className="flex h-full flex-col justify-end gap-3 pb-2">
                  <p className="text-white/55">
                    Chiedimi della tesi, dei progetti o del percorso di Vito:
                    rispondo solo sulla base dei documenti del portfolio,
                    citando le fonti.
                  </p>
                  <div className="flex flex-col items-start gap-2">
                    {SUGGESTIONS.map((q) => (
                      <button
                        key={q}
                        onClick={() => submit(q)}
                        className="hairline rounded-full border bg-white/5 px-3 py-1.5 text-left text-xs text-white/75 transition-colors hover:bg-accent/15 hover:text-white"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={
                    message.role === 'user'
                      ? 'ml-8 rounded-2xl rounded-br-sm bg-accent/15 px-3.5 py-2.5'
                      : 'mr-4 space-y-2'
                  }
                >
                  {(message.parts as AnyPart[]).map((part, i) =>
                    renderPart(message.id, part, i),
                  )}
                </div>
              ))}

              {status === 'submitted' && (
                <p className="font-mono text-[11px] text-white/40">
                  <span className="animate-pulse">retrieval in corso…</span>
                </p>
              )}
              {status === 'error' && (
                <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-3 py-2 text-xs text-red-200">
                  {prettyError(error)}
                </p>
              )}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void submit();
              }}
              className="border-t border-white/10 p-3"
            >
              <div className="flex items-end gap-2 rounded-xl bg-white/5 px-3 py-2">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      void submit();
                    }
                  }}
                  rows={1}
                  placeholder="Scrivi una domanda…"
                  aria-label="Messaggio per il copilot"
                  className="max-h-28 flex-1 resize-none bg-transparent text-sm text-white outline-none placeholder:text-white/35"
                />
                <button
                  type="submit"
                  disabled={busy || !input.trim()}
                  aria-label="Invia"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-white transition-opacity disabled:opacity-30"
                >
                  <FiArrowUp className="h-4 w-4" />
                </button>
              </div>
            </form>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

```

# src\components\overlay\HeroOverlay.tsx

```tsx
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
  const reduced = useReducedMotion();

  return (
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
          Costruisco sistemi di raccomandazione e copiloti AI che ragionano
          su dati reali — dall'orchestrazione multi-agente al retrieval ibrido.
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
            Parla con il mio copilot
          </button>
          <a
            href="#projects"
            className="rounded-full border border-line px-7 py-3 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:border-accent-soft/50 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Vedi i progetti
          </a>
        </div>

        <motion.div
          className="mt-10 flex flex-col items-center gap-2 text-[var(--text-muted)]"
          animate={reduced ? undefined : { y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          <span className="font-mono text-[0.58rem] uppercase tracking-[0.5em]">Scorri</span>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.25} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}

```

# src\components\overlay\HtmlOverlay.tsx

```tsx
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

```

# src\components\overlay\NavigationOverlay.tsx

```tsx
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { SECTIONS, type SectionId } from '@/store/useAppStore';

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

```

# src\components\overlay\ProjectsOverlay.tsx

```tsx
'use client';

import { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { projects as projectsData, type ProjectData } from '@/data/projects';
import Badge from '@/components/ui/Badge';
import CTAButton from '@/components/ui/CTAButton';

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
              Esperienze AI & Platform
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-white/60">
              Ogni progetto combina discovery, progettazione tecnica e un layer di osservabilità per
              consegne senza attriti.
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
                  <div className="lg:w-2/5">
                    <div className="relative h-48 overflow-hidden rounded-xl border border-white/8 bg-white/5">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-contain p-4"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[white]/10 to-[white]/10" />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/8 bg-white/5 px-2.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-white/60"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-[0.6rem] uppercase tracking-[0.35em] text-white/50">
                          {project.timeline}
                        </p>
                        <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                        <p className="text-xs text-white/60">{project.subtitle}</p>
                      </div>
                      <Badge variant="glow" className="text-[0.6rem]">
                        {project.role}
                      </Badge>
                    </div>

                    <p className="text-sm text-white/70">{project.description}</p>

                    {/* Metrics */}
                    <div className="grid gap-3 sm:grid-cols-3">
                      {project.metrics.map((metric) => (
                        <div
                          key={`${project.id}-${metric.label}`}
                          className="rounded-xl border border-white/8 bg-white/5 p-3"
                        >
                          <p className="text-[0.55rem] uppercase tracking-[0.3em] text-white/50">
                            {metric.label}
                          </p>
                          <p className="mt-1 text-xl font-semibold text-white">{metric.value}</p>
                          <p className="mt-0.5 text-[0.6rem] text-white/60">{metric.caption}</p>
                        </div>
                      ))}
                    </div>

                    {/* Stack */}
                    <div className="flex flex-wrap gap-1.5">
                      {project.stack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full bg-white/5 px-2.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-white/50"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <CTAButton variant="primary" onClick={() => setSelectedProject(project)}>
                        Apri case study
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

                {/* Pillars */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.pillars.map((pillar) => (
                    <Badge key={pillar} variant="outline" className="text-[0.55rem]">
                      {pillar}
                    </Badge>
                  ))}
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

```

# src\components\overlay\SkillsOverlay.tsx

```tsx
'use client';

import { motion } from 'framer-motion';
import Badge from '@/components/ui/Badge';
import { capabilityTracks, toolHighlights, languages } from '@/data/skills';

const CATEGORY_LEGEND = [
  { label: 'AI/ML & Data Science', color: 'white' },
  { label: 'Web Development', color: '#60A5FA' },
  { label: 'DevOps & Integration', color: 'white' },
];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5 },
  }),
};

export default function SkillsOverlay() {
  return (
    <div className="flex min-h-screen w-screen items-start justify-center px-4 py-16 sm:px-8">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
          variants={fadeIn}
          className="mb-8 text-center"
        >
          <p className="text-[0.65rem] uppercase tracking-[0.5em] text-[white]/70">
            Skill Matrix
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
            Capacità trasversali per prodotti AI-first
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/60">
            Dal brief al roll-out: combino ricerca, orchestrazione LangGraph, UX spiegabile e
            automazioni n8n per ridurre il time-to-impact dei progetti AI.
          </p>
        </motion.div>

        {/* Legend */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={1}
          variants={fadeIn}
          className="mb-10 flex flex-wrap justify-center gap-6"
        >
          {CATEGORY_LEGEND.map((cat) => (
            <div key={cat.label} className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              <span className="text-xs text-white/60">{cat.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Main grid */}
        <div className="grid gap-6 lg:grid-cols-[1.3fr,0.7fr]">
          {/* Left: Capability tracks */}
          <div className="space-y-5">
            {capabilityTracks.map((track, index) => (
              <motion.div
                key={track.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                custom={2 + index}
                variants={fadeIn}
                className="glass-holographic rounded-2xl p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[0.6rem] uppercase tracking-[0.4em] text-white/40">
                      Capability
                    </p>
                    <h3 className="text-xl font-semibold text-white">{track.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {track.stack.map((tool) => (
                      <span
                        key={tool}
                        className="rounded-full border border-white/12 px-2.5 py-0.5 text-[0.6rem] uppercase tracking-[0.2em] text-white/60"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="mt-3 text-sm text-white/70">{track.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {track.focusAreas.map((focus) => (
                    <Badge key={focus} variant="outline" className="text-[0.6rem]">
                      {focus}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right: Toolchain + Languages */}
          <div className="space-y-5">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={5}
              variants={fadeIn}
              className="glass-holographic rounded-2xl p-5"
            >
              <p className="text-[0.6rem] uppercase tracking-[0.4em] text-white/40">
                Toolchain
              </p>
              <div className="mt-4 space-y-4">
                {toolHighlights.map((cluster) => (
                  <div
                    key={cluster.area}
                    className="rounded-xl border border-white/8 bg-white/5 p-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Badge variant="glow" className="text-[0.55rem]">
                        {cluster.area}
                      </Badge>
                      <span className="text-[0.55rem] uppercase tracking-[0.3em] text-white/40">
                        {cluster.category}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-white/60">{cluster.description}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {cluster.tools.map((tool) => (
                        <span
                          key={tool}
                          className="rounded-full bg-white/5 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-white/50"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={6}
              variants={fadeIn}
              className="glass-holographic rounded-2xl p-5"
            >
              <p className="text-[0.6rem] uppercase tracking-[0.4em] text-white/40">
                Lingue
              </p>
              <div className="mt-4 space-y-3">
                {languages.map((lang) => (
                  <div
                    key={lang.name}
                    className="rounded-xl border border-white/10 bg-white/5 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-base font-semibold text-white">{lang.name}</p>
                      <Badge variant="outline" className="text-[0.6rem]">
                        {lang.level}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-white/60">{lang.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

```

# src\components\ProjectModal.tsx

```tsx
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import type { ProjectData } from '@/data/projects';
import Badge from '@/components/ui/Badge';
import CTAButton from '@/components/ui/CTAButton';

interface ProjectModalProps {
  project: ProjectData;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

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
      >
        <div className="relative h-48 overflow-hidden rounded-t-3xl border-b border-white/10">
          <motion.div 
            className="absolute inset-0 overflow-hidden"
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
              className="object-contain p-4"
              fill
              onLoad={() => setImageLoaded(true)}
            />
          </motion.div>
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-neural-cyan/30 to-neural-magenta/30"
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
            <p className="text-xs uppercase tracking-[0.35em] text-white/60">{project.timeline}</p>
            <h2 className="text-3xl font-semibold text-white">{project.title}</h2>
            <p className="text-base text-white/70">{project.subtitle}</p>
            <Badge variant="glow" className="w-fit text-[0.65rem]">{project.role}</Badge>
          </motion.div>
          
          <motion.p 
            custom={1}
            variants={contentVariants}
            className="text-base text-white/80"
          >
            {project.longDescription}
          </motion.p>
          
          <motion.div 
            custom={2}
            variants={contentVariants}
            className="grid gap-4 sm:grid-cols-3"
          >
            {project.metrics.map((metric) => (
              <div
                key={`${project.id}-metric-${metric.label}`}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">{metric.label}</p>
                <p className="mt-2 text-2xl font-semibold text-white">{metric.value}</p>
                <p className="mt-1 text-xs text-white/70">{metric.caption}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            custom={3}
            variants={contentVariants}
            className="space-y-3"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">Stack</p>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tool) => (
                <span
                  key={tool}
                  className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/70"
                >
                  {tool}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            custom={4}
            variants={contentVariants}
            className="space-y-3"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">Focus</p>
            <div className="flex flex-wrap gap-2">
              {project.pillars.map((pillar) => (
                <Badge key={pillar} variant="outline" className="text-[0.6rem]">
                  {pillar}
                </Badge>
              ))}
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
            <CTAButton variant="ghost" onClick={onClose}>
              Chiudi
            </CTAButton>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(modalContent, document.body);
} 
```

# src\components\ui\Badge.tsx

```tsx
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

```

# src\components\ui\CTAButton.tsx

```tsx
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

```

# src\components\ui\NeuralCard.tsx

```tsx
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

```

# src\components\ui\rag\ProjectCard.tsx

```tsx
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

```

# src\components\ui\rag\SkillsRadar.tsx

```tsx
import { motion } from 'framer-motion';

export default function SkillsRadar() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mt-2 rounded-xl border border-neural-cyan/30 bg-black/40 p-4 shadow-[0_0_20px_rgba(0,255,255,0.1)] backdrop-blur-md"
    >
      <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-neural-cyan">
        AI & Web Engineering Stack
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

```

# src\components\ui\SectionHeader.tsx

```tsx
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

```

# src\content\profile\documents.json

```json
[
  {
    "id": "bio-vision",
    "category": "bio",
    "title": "Profilo professionale",
    "summary": "Laureato in Informatica appassionato di IA e Machine Learning, con background lavorativo poliedrico.",
    "body": "Sono Vito Piccolini. Prima di laurearmi in Informatica ho lavorato anni tra cantieri, fabbrica, hotel, steward, scegliendo poi consapevolmente di cambiare strada. Mi sono laureato in Informatica (107/110) con una tesi sull'orchestrazione di agenti LLM applicata ai sistemi di raccomandazione. Ho lavorato con Python, LangGraph e architetture multi-agente, portando risultati misurabili in ambiente di ricerca e includendo sistemi RAG ibridi. Mi sono classificato secondo in un'hackathon nazionale organizzata da Talent Garden e Leonardo. Il mio obiettivo è crescere nel campo dell'AI/ML, ma sono flessibile e aperto a tutte le opportunità.",
    "tags": ["ai", "machine-learning", "langgraph", "resilience"],
    "updatedAt": "2026-06-09T00:00:00Z"
  },
  {
    "id": "experience-lacam",
    "category": "experience",
    "title": "Tirocinio curriculare LACAM-SWAP",
    "summary": "Progetto di tesi: Orchestrazione di Agenti LLM per l'Ottimizzazione Multi-Metrica nei Sistemi di Raccomandazione.",
    "body": "Da marzo a giugno 2025 ho progettato e implementato un sistema di raccomandazione multi-metrica basato su LLM e architetture ad agenti, nell'ambito della tesi triennale. L'architettura, orchestrata con LangGraph, coordina agenti specializzati su precisione e copertura del catalogo attraverso un agente aggregatore. Il sistema include un RAG ibrido (BM25 + FAISS). Testato su MovieLens 1M con Llama 3.2 3B Instruct: l'agente aggregatore ha mantenuto la precisione del baseline (∆ = -0.5%) migliorando la novelty del 12%.",
    "tags": ["research", "langgraph", "multi-agent", "rag", "faiss", "bm25"],
    "updatedAt": "2026-06-09T00:00:00Z"
  },
  {
    "id": "experience-bfuture",
    "category": "experience",
    "title": "Hackathon B.Future Challenge 2025 – BOOM",
    "summary": "Sviluppo di Zenith, assistente AI per digitalizzare e automatizzare il processo di consulenza aziendale.",
    "body": "Da settembre a novembre 2025 ho partecipato alla B.Future Challenge in un team di 6 persone (Gruppo VAR Group). Abbiamo sviluppato Zenith, un assistente AI per consulenza enterprise. Mi sono occupato della pipeline backend: orchestrazione del workflow tramite n8n, integrazione con Google Gemini via API e archiviazione documenti su Google Drive. Il prototipo ha stimato una riduzione dei tempi di produzione di un report da 7 giorni a 1.",
    "tags": ["challenge", "n8n", "gemini", "backend"],
    "updatedAt": "2026-06-09T00:00:00Z"
  },
  {
    "id": "experience-work",
    "category": "experience",
    "title": "Esperienza lavorativa trasversale",
    "summary": "Operaio generico dal 2016 al 2022 in settori diversi.",
    "body": "Dal 2016 al 2022 ho lavorato in settori molto diversi: agricoltura, edilizia, fabbrica, reception alberghiera, steward eventi, e gestione di un negozio al dettaglio (cosmetici e attrezzatura professionale). Sei anni che hanno formato una forte resilienza e capacità di adattamento, prima di decidere di cambiare strada e iscrivermi a Informatica.",
    "tags": ["work", "experience", "resilience", "management"],
    "updatedAt": "2026-06-09T00:00:00Z"
  },
  {
    "id": "education-track",
    "category": "education",
    "title": "Percorso formativo",
    "summary": "Laurea in Informatica (107/110) e Diploma in Ragioneria.",
    "body": "Ho conseguito la Laurea Triennale in Informatica e Tecnologie per la Produzione del Software presso l'Università di Bari (10/2022 - 07/2025) con votazione 107/110. Tesi: Orchestrazione di Agenti LLM per l'Ottimizzazione Multi-Metrica nei Sistemi di Raccomandazione. Precedentemente, ho ottenuto il Diploma di Scuola Superiore in Ragioneria (09/2011 - 07/2016) presso l'I.T.C Eugenio Montale di Rutigliano, con voto 75.",
    "tags": ["education", "uniba", "degree", "diploma"],
    "updatedAt": "2026-06-09T00:00:00Z"
  },
  {
    "id": "services-stack",
    "category": "services",
    "title": "Competenze e tecnologie",
    "summary": "Sviluppo AI/ML, web development, architetture multi-agente e RAG.",
    "body": "Le mie competenze includono linguaggi come Python, Java, C, JavaScript, HTML/CSS, SQL; framework e tool AI come LangGraph, LangChain, FAISS, BM25, Embeddings, Pandas, NumPy; sviluppo web e backend con React, FastAPI; database MySQL, MongoDB; e automazione con n8n.",
    "tags": ["skills", "python", "react", "n8n", "langgraph", "rag"],
    "updatedAt": "2026-06-09T00:00:00Z"
  },
  {
    "id": "languages",
    "category": "languages",
    "title": "Competenze linguistiche",
    "summary": "Italiano madrelingua, Inglese livello B1.",
    "body": "Parlo italiano come lingua madre e ho una conoscenza dell'inglese di livello B1.",
    "tags": ["languages", "italian", "english"],
    "updatedAt": "2026-06-09T00:00:00Z"
  }
]

```

# src\data\projects.ts

```ts
export interface ProjectMetric {
  label: string;
  value: string;
  caption: string;
}

export interface ProjectLink {
  label: string;
  href: string;
  type?: 'github' | 'live' | 'case-study';
}

export interface ProjectData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  longDescription: string;
  tags: string[];
  timeline: string;
  role: string;
  stack: string[];
  pillars: string[];
  metrics: ProjectMetric[];
  links?: ProjectLink[];
}

export const projects: ProjectData[] = [
  {
    id: 1,
    title: 'Talent Program "Next Pulse"',
    subtitle: 'EnLexi: AI Sales Assistant multi-sorgente per Engine S.p.A.',
    description:
      'Sviluppo backend in team per un AI Sales Assistant nel settore Traffic Enforcement e Smart City (Hackathon nazionale).',
    image: '/EnLexi.png',
    longDescription:
      'Durante il bootcamp selettivo intensivo (48h) su scala nazionale (320 candidati), ho contribuito allo sviluppo di EnLexi in un team di 5 persone. '
      + 'EnLexi è un AI Sales Assistant multi-sorgente per Engine S.p.A. Mi sono occupato del backend con focus sulla pipeline di retrieval e '
      + 'sull\'implementazione della ricerca ibrida (BM25 + ChromaDB/FAISS), gestendo anche l\'organizzazione del team e collaborando alla presentazione finale.',
    tags: ['Hackathon', 'Python', 'FastAPI', 'RAG', 'ChromaDB', 'FAISS'],
    timeline: 'Giugno 2026',
    role: 'Backend Developer / Team Organizer',
    stack: ['Python', 'FastAPI', 'BM25', 'ChromaDB', 'FAISS'],
    pillars: ['Hybrid RAG', 'AI Sales Assistant', 'Team Management', 'Backend'],
    metrics: [
      { label: 'Candidati', value: '320', caption: 'Bootcamp selettivo nazionale.' },
      { label: 'Durata', value: '48h', caption: 'Hackathon intensivo.' },
      { label: 'Retrieval', value: 'Ibrido', caption: 'Integrazione BM25 + FAISS/ChromaDB.' },
    ],
  },
  {
    id: 2,
    title: 'PugliaHack 2026',
    subtitle: 'TerraNode: Piattaforma per smart agri-tourism',
    description:
      'Sviluppo in autonomia di TerraNode, piattaforma con prenotazioni, gamification, tracciamento CO2 e dashboard real-time.',
    image: '/TerraNode.png',
    longDescription:
      'Nell\'ambito dell\'hackathon PugliaHack 2026 (finestra di sviluppo: 2 ore, piattaforma Lovable), ho sviluppato in autonomia TerraNode, '
      + 'una piattaforma per lo smart agri-tourism pugliese. La soluzione prevede ruoli distinti per turisti, agricoltori e Pubblica Amministrazione, '
      + 'includendo prenotazione di esperienze, gamification con crediti, tracciamento della CO2 e dashboard con KPI in tempo reale.',
    tags: ['Hackathon', 'React 19', 'TailwindCSS', 'Supabase', 'Agri-tourism'],
    timeline: 'Maggio 2026',
    role: 'Solo Developer',
    stack: ['React 19', 'TanStack Query', 'TailwindCSS', 'Supabase (PostgreSQL)'],
    pillars: ['Smart Tourism', 'Gamification', 'CO2 Tracking', 'Real-time Dashboards'],
    metrics: [
      { label: 'Tempo dev.', value: '2 ore', caption: 'Finestra di sviluppo estremamente ridotta.' },
      { label: 'Ruoli', value: '3', caption: 'Turisti, Agricoltori, PA.' },
      { label: 'Stack', value: 'Modern Web', caption: 'React 19 + Supabase.' },
    ],
  },
  {
    id: 3,
    title: 'Hackathon "Space Edition"',
    subtitle: 'The Pulse: Monitoraggio agricolo globale satellitare',
    description:
      '2° Classificato. Collaborazione all\'ideazione di un progetto per una costellazione di piccoli satelliti dedicati all\'agricoltura.',
    image: '/ThePulse.png',
    longDescription:
      'Hackathon organizzato da Talent Garden e Leonardo a Milano. Mi sono classificato al 2° posto collaborando all\'ideazione di "The Pulse", '
      + 'un progetto per una costellazione di piccoli satelliti dedicata al monitoraggio agricolo globale, integrando logiche di telerilevamento e AI.',
    tags: ['Hackathon', 'Space Tech', 'Agri-Tech', 'Innovation'],
    timeline: 'Maggio 2026',
    role: 'Team Member',
    stack: ['Ideation', 'Team Collaboration', 'Space/Agri Tech'],
    pillars: ['Space Technology', 'Agriculture', 'Teamwork', 'Innovation'],
    metrics: [
      { label: 'Piazzamento', value: '2° Posto', caption: 'Hackathon nazionale Talent Garden x Leonardo.' },
      { label: 'Focus', value: 'Satelliti', caption: 'Monitoraggio agricolo globale.' },
    ],
  },
  {
    id: 4,
    title: 'LACAM-SWAP · Orchestratore Multi-Agente',
    subtitle: 'Ottimizzazione Multi-Metrica nei Sistemi di Raccomandazione',
    description:
      'Progetto di tesi: architettura multi-agente LLM orchestrata con LangGraph per raccomandazioni. Include RAG ibrido (BM25 + FAISS).',
    image: '/SWAP.jpg',
    longDescription:
      'Progetto di tesi sviluppato durante il tirocinio curriculare (marzo–giugno 2025) presso il laboratorio LACAM-SWAP dell\'Università di Bari. '
      + 'Ho implementato un\'architettura multi-agente basata su LLM (Llama 3.2 3B Instruct), orchestrata con LangGraph, che coordina agenti specializzati '
      + 'su precisione e copertura del catalogo tramite un agente aggregatore. L\'architettura include anche un sistema RAG ibrido (BM25 + FAISS).',
    tags: ['LangGraph', 'Multi-Agent', 'Recommender Systems', 'RAG', 'Thesis'],
    timeline: 'Marzo–Giugno 2025 · 3 mesi',
    role: 'AI Research Intern',
    stack: ['LangGraph', 'Python', 'Llama 3.2', 'FAISS', 'BM25'],
    pillars: ['Precision & Coverage Agents', 'Hybrid RAG', 'Aggregated-Agent', 'Llama 3.2'],
    metrics: [
      { label: 'Novelty', value: '+12%', caption: 'Miglioramento novità del catalogo raccomandato.' },
      { label: 'Precisione', value: '-0.5%', caption: 'Delta minimo rispetto al baseline massimizzato.' },
      { label: 'Dataset', value: 'MovieLens 1M', caption: 'Testato su benchmark standard.' },
    ],
    links: [
      { label: 'GitHub', href: 'https://github.com/Hellvisback365/LLM.git', type: 'github' },
    ],
  },
  {
    id: 5,
    title: 'B.Future Challenge 2025 · BOOM (CRIF)',
    subtitle: 'Zenith: Assistente AI per digitalizzare la consulenza',
    description:
      'Sviluppo backend in team di Zenith, assistente AI con workflow automatizzato per la digitalizzazione della consulenza aziendale.',
    image: '/b-future-challenge-2025.png',
    longDescription:
      'Hackathon multidisciplinare in team di 6 persone per VAR Group. Abbiamo sviluppato Zenith, assistente AI per automatizzare '
      + 'il processo di consulenza aziendale. Mi sono occupato della pipeline backend: orchestrazione tramite n8n, integrazione con Google Gemini '
      + 'e archiviazione su Google Drive. Il prototipo stimava un abbattimento drastico dei tempi di lavorazione.',
    tags: ['n8n', 'Gemini', 'API', 'Workflow Automation'],
    timeline: 'Settembre–Novembre 2025',
    role: 'Backend AI Developer',
    stack: ['n8n', 'Google Gemini', 'Google Drive API'],
    pillars: ['Orchestrazione workflow', 'Automazione API', 'Digitalizzazione', 'Riduzione tempi'],
    metrics: [
      { label: 'Tempo report', value: '7gg → 1gg', caption: 'Riduzione drastica stimata dei tempi di produzione.' },
      { label: 'Team', value: '6 persone', caption: 'Collaborazione multidisciplinare.' },
      { label: 'Stack', value: 'n8n + Gemini', caption: 'Pipeline backend automatizzata.' },
    ],
    links: [
      { label: 'GitHub', href: 'https://github.com/Hellvisback365/ChallengeBoomVarGroup2025.git', type: 'github' },
    ],
  },
  {
    id: 6,
    title: 'BeFluent',
    subtitle: 'Web app per supporto alla dislessia',
    description:
      'Applicazione web React+Node.js progettata per aiutare bambini con dislessia attraverso un\'interfaccia intuitiva e accessibile.',
    image: '/BeFluent_logo.png',
    longDescription:
      'BeFluent è un\'applicazione web progettata per aiutare bambini con dislessia attraverso un\'interfaccia intuitiva e accessibile. '
      + 'L\'app utilizza tecnologie React per il frontend e Node.js per il backend, offrendo esercizi personalizzati e feedback adattivi. '
      + 'La soluzione è stata progettata con un focus sull\'accessibilità e sulla facilità d\'uso, '
      + 'permettendo un\'esperienza di apprendimento inclusiva e coinvolgente.',
    tags: ['React', 'Node.js', 'Accessibilità', 'JavaScript', 'UX Design'],
    timeline: 'Progetto Universitario',
    role: 'Developer',
    stack: ['React', 'Node.js', 'JavaScript', 'CSS', 'Express'],
    pillars: ['Accessibilità', 'UX per bambini', 'Supporto dislessia', 'Design inclusivo'],
    metrics: [
      { label: 'Target', value: 'Bambini', caption: 'Interfaccia pensata per utenti con dislessia.' },
      { label: 'Stack', value: 'React + Node.js', caption: 'Frontend moderno e backend robusto.' },
      { label: 'Focus', value: 'Accessibilità', caption: 'Design inclusivo e facilità d\'uso.' },
    ],
    links: [
      { label: 'GitHub', href: 'https://github.com/Hellvisback365/BeFluentVITO.git', type: 'github' },
    ],
  },
  {
    id: 7,
    title: 'POSD System',
    subtitle: 'Privacy-Oriented System Design conforme GDPR',
    description:
      'Soluzione software privacy-oriented con architettura MVC, progettata per garantire conformità GDPR e sicurezza dei dati.',
    image: '/POSD.png',
    longDescription:
      'POSD System (Privacy-Oriented System Design) è una soluzione software che implementa un\'architettura MVC con focus sulla conformità GDPR. '
      + 'Il sistema è progettato per garantire la sicurezza dei dati utente end-to-end, con crittografia avanzata e controlli di accesso granulari. '
      + 'La piattaforma include funzionalità per la gestione del consenso degli utenti e strumenti per l\'analisi dell\'impatto sulla privacy.',
    tags: ['Privacy', 'GDPR', 'MVC', 'Sicurezza', 'Python'],
    timeline: 'Progetto Universitario',
    role: 'Developer',
    stack: ['Python', 'MVC Architecture', 'Crittografia', 'GDPR Compliance'],
    pillars: ['Privacy by Design', 'GDPR Compliance', 'Crittografia E2E', 'Gestione consenso'],
    metrics: [
      { label: 'Standard', value: 'GDPR', caption: 'Piena conformità alle normative europee.' },
      { label: 'Sicurezza', value: 'End-to-End', caption: 'Crittografia avanzata dei dati.' },
      { label: 'Architettura', value: 'MVC', caption: 'Design modulare e manutenibile.' },
    ],
  },
];

```

# src\data\rag-index.json

```json
{"model":"Xenova/multilingual-e5-small","dim":384,"createdAt":"2026-06-12T13:28:02.161Z","chunks":[{"id":"bio-vision#0","docId":"bio-vision","title":"Profilo professionale","category":"bio","tags":["ai","machine-learning","langgraph","resilience"],"text":"Laureato in Informatica appassionato di IA e Machine Learning, con background lavorativo poliedrico. Sono Vito Piccolini. Prima di laurearmi in Informatica ho lavorato anni tra cantieri, fabbrica, hotel, steward, scegliendo poi consapevolmente di cambiare strada. Mi sono laureato in Informatica (107/110) con una tesi sull'orchestrazione di agenti LLM applicata ai sistemi di raccomandazione.","vec":[0.02333,-0.02842,-0.07007,-0.062,0.04381,-0.04502,0.01367,0.06338,0.06864,0.03271,0.04504,-0.01222,0.06096,-0.01137,0.01289,0.0731,0.10788,-0.05806,-0.09638,-0.02456,0.0341,0.02294,-0.06716,0.04896,0.05999,0.01832,-0.04823,0.01285,0.01805,-0.05087,-0.02902,-0.04794,0.02748,-0.05649,0.03401,0.0205,-0.00207,-0.11311,0.00367,-0.07513,-0.04813,0.00631,0.05793,0.03592,0.01213,0.06555,-0.0194,0.00901,-0.03318,-0.01332,-0.02219,0.09084,0.06797,0.02746,0.04852,-0.04335,-0.07152,-0.02423,-0.0684,0.03104,0.05085,-0.03314,0.0285,0.05251,0.051,0.04884,0.01755,0.06009,-0.11557,-0.08553,-0.07099,0.04442,0.01762,-0.07304,0.0434,0.03031,0.045,-0.05195,0.02131,-0.06916,-0.0662,-0.05601,-0.02207,0.10812,-0.03981,0.01628,0.04495,-0.11824,0.06184,-0.01761,0.06204,0.08304,-0.06521,-0.06163,-0.07788,-0.02267,-0.0415,0.07102,0.0514,-0.01661,0.02408,-0.04551,0.04704,-0.07706,-0.02419,0.02215,0.05378,-0.06704,0.04616,-0.08195,-0.02459,0.06814,0.04343,0.03585,-0.10048,-0.00449,-0.03411,-0.01965,0.08155,-0.06881,0.05777,-0.05302,-0.05629,-0.06036,-0.01784,-0.04203,-0.02224,0.09605,0.07184,0.03151,0.0234,0.07577,0.01373,0.04124,0.05397,0.05083,-0.02692,0.00889,-0.04618,-0.02424,-0.04706,0.04725,-0.05543,0.01711,0.02529,0.05159,0.04844,-0.03282,0.08371,-0.08424,0.03751,-0.02521,0.02329,0.06131,0.05908,-0.01904,-0.06914,-0.08567,0.06651,0.08634,-0.05429,-0.05822,-0.02724,0.00199,-0.02449,-0.05416,0.00543,0.06811,-0.04156,-0.00481,-0.00919,0.04018,-0.04782,0.11154,-0.0071,0.02493,-0.07967,0.02029,0.10131,0.03253,-0.05788,-0.00157,-0.08717,-0.06624,-0.06233,-0.08479,-0.03928,0.0251,0.01382,-0.05438,0.02071,0.05398,-0.03157,-0.08157,-0.02213,0.04408,-0.05257,0.04602,0.05172,0.0415,-0.01167,-0.03427,0.04493,0.05714,0.06716,0.0347,-0.0601,0.01249,-0.03359,0.04841,0.06025,-0.06664,-0.02432,0.04736,0.0034,0.00683,0.01419,0.0653,-0.05577,0.01513,0.06342,-0.04478,0.04711,-0.02262,-0.0133,0.04093,0.05267,-0.06951,-0.06649,0.02321,-0.07804,-0.03654,-0.06936,-0.10355,-0.04509,-0.04934,0.02631,0.05644,0.01666,-0.06168,-0.04395,-0.04388,-0.01487,0.00335,0.08117,-0.03462,-0.04957,0.05143,-0.02482,0.05044,0.09184,-0.08721,0.00339,-0.0193,-0.03099,0.04247,0.04432,0.02992,-0.0667,0.01051,0.00139,-0.00703,0.06085,0.03287,0.04088,0.01383,-0.09144,-0.00138,-0.02539,-0.07511,-0.00789,-0.00381,-0.00081,-0.03024,-0.05455,-0.05018,0.03684,0.06211,-0.02904,-0.06552,0.07139,0.04248,0.03343,0.08544,0.02862,-0.05857,-0.0355,0.08246,-0.00424,-0.01828,-0.00351,-0.03897,0.03546,-0.04097,0.09677,0.0436,-0.01614,0.09044,-0.06168,0.06266,0.02502,-0.02763,0.03424,0.00842,-0.07329,0.04622,-0.00325,0.00311,0.03357,0.03651,0.04459,0.04816,-0.03476,0.00519,0.02247,0.03616,-0.01923,0.04218,-0.07422,-0.0462,-0.0524,-0.06461,-0.06589,-0.07077,0.04016,0.08957,-0.1017,0.00426,0.04459,0.01411,0.02714,-0.01769,-0.05389,0.06092,-0.05796,-0.01813,-0.00409,0.05039,-0.0294,-0.03177,0.02596,0.05764,-0.04185,0.03349,-0.01178,-0.09493,0.05082,-0.01899,-0.07336,0.02648,0.02839,-0.09222,0.02926,0.03641,-0.05188,0.03341,-0.047,0.03988,0.05792,0.00557,-0.03454,-0.09947,-0.00332,0.0592,0.03074,0.00771,-0.00095,-0.02031,0.05818,-0.00019,0.07177,0.06241,-0.02306,-0.01025,-0.02782,-0.05833,-0.03784,-0.00025,-0.0541,-0.06968,0.10266,0.01879,0.06804,0.06478]},{"id":"bio-vision#1","docId":"bio-vision","title":"Profilo professionale","category":"bio","tags":["ai","machine-learning","langgraph","resilience"],"text":"Ho lavorato con Python, LangGraph e architetture multi-agente, portando risultati misurabili in ambiente di ricerca e includendo sistemi RAG ibridi. Mi sono classificato secondo in un'hackathon nazionale organizzata da Talent Garden e Leonardo. Il mio obiettivo è crescere nel campo dell'AI/ML, ma sono flessibile e aperto a tutte le opportunità.","vec":[0.04276,-0.00921,-0.07498,-0.04588,0.07615,-0.08006,0.02045,0.0545,0.02899,0.00139,0.04699,0.03028,0.10159,-0.00162,-0.01776,0.06336,0.07861,-0.04824,-0.07484,-0.07481,0.02845,0.03986,-0.0435,0.04414,0.06105,0.04317,-0.00833,0.0092,0.0084,-0.03874,-0.01637,-0.03668,0.06465,-0.01853,0.069,0.01127,-0.04023,-0.0656,0.00022,-0.0739,0.00023,0.01514,0.0572,0.02885,0.02479,0.04563,-0.05091,0.05558,-0.05315,0.01469,-0.03764,0.03565,0.0424,0.06303,0.06644,-0.03331,-0.06122,-0.09254,-0.05955,0.01625,0.03412,-0.05512,0.02743,0.0337,0.05992,0.05808,0.057,0.05782,-0.09905,-0.09556,-0.07131,0.07242,-0.00431,-0.07557,0.00411,0.03444,0.04715,-0.0665,0.04739,-0.0474,-0.0939,-0.04147,-0.04739,0.04303,-0.03657,0.03405,0.07808,-0.08111,0.06598,-0.07018,0.07728,0.00408,-0.01548,-0.01841,-0.07595,-0.09932,-0.0331,0.0881,0.04715,-0.03016,0.03899,-0.02741,0.01388,-0.04865,-0.05419,0.02987,0.05103,-0.06896,0.01459,-0.05543,-0.01793,0.06012,0.04554,0.04464,-0.07163,-0.03698,-0.01895,-0.06721,0.05355,-0.03783,0.07751,-0.04103,-0.07053,-0.08973,-0.0961,0.00961,0.01269,0.07501,0.0716,0.03208,0.00443,0.05527,0.01952,0.05526,0.0675,0.09612,-0.0318,0.00999,-0.01551,-0.05653,-0.03415,0.06543,-0.05296,-0.00034,0.05722,0.05079,0.08716,-0.04486,0.04717,-0.03644,0.01072,-0.02215,0.04282,0.00199,0.0455,-0.00412,-0.05203,-0.03364,0.042,0.06417,-0.05698,-0.05501,-0.03229,-0.02983,-0.04258,-0.05786,0.01054,0.0254,-0.03199,-0.03571,-0.04281,0.10968,-0.04639,0.08015,-0.00563,0.03684,-0.0974,0.0266,0.08512,0.0398,-0.05838,-0.03566,-0.10119,-0.05772,-0.06541,-0.04718,-0.08725,0.01034,0.00862,-0.05023,0.03237,0.05484,-0.0652,-0.09773,-0.03639,0.07165,-0.02339,0.01264,0.05145,0.06607,0.0067,-0.06136,0.02025,0.01266,0.05019,0.03089,-0.08126,0.0181,-0.04301,0.00863,0.03551,-0.04871,-0.03028,0.07125,0.01264,-0.0126,-0.01739,0.08613,-0.04837,0.0097,0.08976,-0.03355,0.03844,-0.03054,-0.01507,0.0478,0.04214,-0.0801,-0.03746,0.03745,-0.08787,-0.02402,-0.06415,-0.09538,-0.00984,-0.06758,0.0094,0.03651,0.03139,-0.02425,-0.04556,-0.03365,-0.01272,-0.01636,0.03694,-0.07489,-0.0309,0.01357,-0.04328,0.0555,0.09817,-0.11822,-0.02783,-0.02553,-0.00456,0.03563,0.06315,0.05073,-0.04906,0.02996,0.00565,-0.02819,0.03437,0.03306,0.04885,0.01347,-0.04732,-0.00289,-0.05251,-0.01445,-0.02577,0.00625,0.02475,-0.01044,0.00252,-0.05853,0.03775,0.10452,-0.03659,-0.0434,0.06723,0.05899,0.0439,0.06865,0.08852,-0.02087,-0.01404,0.07743,0.00111,-0.01271,-0.04847,-0.04353,0.04741,-0.03871,0.07258,0.03842,-0.01043,0.0434,-0.04939,0.06493,0.02823,-0.00929,0.01404,0.0131,-0.02534,0.04551,0.03166,0.00451,0.07221,0.03149,0.06143,0.03561,-0.08411,-0.01589,0.03141,0.00927,-0.00298,0.00811,-0.09553,-0.06331,-0.04368,-0.08096,-0.02957,-0.06476,0.00955,0.0712,-0.06087,-0.03883,0.04327,0.0052,0.0396,-0.0197,-0.04944,0.049,-0.06471,-0.03138,-0.03837,0.09731,-0.04274,0.03603,0.08898,0.03977,-0.06208,0.07528,-0.06207,-0.08338,0.04433,-0.02734,-0.04326,-0.00553,0.04677,-0.08094,0.03617,0.05626,-0.0468,0.03828,-0.06884,0.02916,0.02382,0.06307,-0.03721,-0.08457,0.03711,0.05363,0.0324,0.02262,-0.00966,-0.04777,-0.00182,0.01313,0.06963,0.05568,-0.01855,-0.07701,-0.04566,-0.01076,-0.05546,-0.00904,-0.02625,-0.08094,0.06356,0.02106,0.08117,0.05272]},{"id":"experience-lacam#0","docId":"experience-lacam","title":"Tirocinio curriculare LACAM-SWAP","category":"experience","tags":["research","langgraph","multi-agent","rag","faiss","bm25"],"text":"Progetto di tesi: Orchestrazione di Agenti LLM per l'Ottimizzazione Multi-Metrica nei Sistemi di Raccomandazione. Da marzo a giugno 2025 ho progettato e implementato un sistema di raccomandazione multi-metrica basato su LLM e architetture ad agenti, nell'ambito della tesi triennale. L'architettura, orchestrata con LangGraph, coordina agenti specializzati su precisione e copertura del catalogo attraverso un agente aggregatore. Il sistema include un RAG ibrido (BM25 + FAISS).","vec":[0.02796,0.00545,-0.06419,-0.07117,0.09376,-0.06201,0.06913,0.0634,0.03103,0.00169,0.09029,0.00383,0.0777,-0.01142,0.00841,0.05953,0.09572,-0.05547,-0.05527,-0.08039,0.00578,0.01969,-0.07297,0.00501,0.07275,0.0393,-0.02044,0.03354,0.0513,-0.00094,-0.02745,-0.06354,0.07995,-0.03069,0.03764,0.02927,-0.00503,-0.06136,0.03139,-0.06748,0.01167,0.03651,0.04655,0.06486,0.03394,0.06134,-0.04987,0.05045,-0.02918,-0.04797,-0.04128,0.06237,0.0732,0.04362,0.05793,-0.05994,-0.04489,-0.09575,-0.04362,0.00965,0.05456,-0.0227,0.01159,0.04388,0.0898,0.08789,0.02048,0.05344,-0.08561,-0.11084,-0.07134,0.04016,-0.02501,-0.0836,-0.0055,0.02622,0.08488,-0.07104,0.02283,-0.01539,-0.05567,-0.02516,-0.03475,0.05626,-0.03133,0.05022,0.06674,-0.0853,-0.00129,-0.03097,0.02478,0.05898,-0.05101,-0.06961,-0.04967,-0.07547,-0.02627,0.07005,0.07202,-0.06001,0.01582,-0.07257,0.00878,-0.09178,-0.04093,-0.00637,0.03071,-0.07772,0.05942,-0.03787,-0.03502,0.05004,0.05314,0.02685,-0.02176,-0.07687,-0.03995,-0.02174,0.04354,-0.05109,0.05091,-0.04341,-0.08047,-0.07694,-0.02321,-0.00439,0.01138,0.04745,0.02452,0.02474,0.00219,0.0219,0.02995,0.08632,0.07418,0.08527,-0.06329,0.01156,-0.03295,-0.02194,-0.05704,0.04571,-0.10053,0.01673,0.05158,0.05329,0.10172,-0.04181,0.06099,-0.03774,0.03561,0.00347,0.0644,0.0508,0.03976,-0.03576,-0.07342,-0.06609,0.06855,0.06317,-0.05431,-0.04371,-0.07255,-0.05545,-0.02278,-0.02552,0.01596,0.05758,-0.02764,-0.02705,-0.06388,0.09518,0.00209,0.08313,0.01592,0.04341,-0.06195,0.0329,0.0975,0.0514,-0.04793,-0.01842,-0.08244,-0.0704,-0.08518,-0.05929,-0.05433,0.01352,-0.00227,-0.06051,0.02063,0.04623,-0.06741,-0.06064,-0.00905,0.06929,-0.03245,0.01932,0.04585,0.04312,0.01074,-0.06307,-0.01703,0.04502,0.02836,0.05032,-0.06804,0.01729,-0.02709,0.01761,0.01761,-0.04033,-0.02182,0.02834,0.00033,-0.02623,-0.00108,0.05642,-0.0276,0.0111,0.06548,-0.03627,0.05725,-0.05267,-0.00588,0.03456,0.05898,-0.08271,-0.05497,0.02413,-0.03036,-0.04428,-0.08561,-0.05186,-0.0147,-0.05974,0.02481,0.07325,0.00748,-0.03245,-0.08418,-0.00896,-0.02111,-0.03335,0.03389,-0.05408,-0.04072,0.02529,-0.05712,0.09837,0.0548,-0.05061,-0.04401,-0.02594,-0.0103,0.03926,0.06634,0.01483,-0.04729,0.03566,0.05265,-0.02726,0.06655,0.01115,0.06334,0.01493,-0.08527,-0.02108,-0.033,-0.05346,0.02468,0.03654,0.01255,-0.02026,-0.05179,-0.06643,0.00058,0.09319,-0.03538,-0.06578,0.06304,0.05975,0.04462,0.04713,0.05291,-0.00282,-0.00616,0.08189,-0.02455,-0.0452,-0.01487,-0.02547,0.09135,-0.03157,0.10396,0.04999,0.00165,0.04455,-0.06762,0.0166,-0.00778,-0.00952,0.01523,0.02398,-0.0595,0.04604,0.00992,-0.00313,0.05046,0.05174,0.07243,0.01382,-0.06755,0.00739,0.0288,0.05048,0.03457,0.06191,-0.09185,-0.05148,-0.06126,-0.06975,-0.02929,-0.06376,0.08069,0.05468,-0.06999,-0.04518,0.04209,-0.04537,0.04397,-0.01478,-0.05927,0.04076,-0.05455,-0.07598,0.00165,0.05974,-0.04733,-0.01969,0.06606,0.01159,-0.09604,0.06849,-0.02444,-0.05716,0.03874,-0.02113,-0.03735,-0.01562,0.03241,-0.12234,0.06556,0.06634,-0.05861,0.05264,-0.07751,-0.00839,0.06801,0.05368,-0.03262,-0.05383,0.01944,0.04069,0.06637,0.00062,-0.02566,-0.02418,-0.02421,-0.01321,0.06064,0.01756,-0.04706,-0.00564,-0.00443,-0.04465,-0.03458,0.0369,-0.02871,-0.07444,0.03407,0.02521,0.01755,0.07091]},{"id":"experience-lacam#1","docId":"experience-lacam","title":"Tirocinio curriculare LACAM-SWAP","category":"experience","tags":["research","langgraph","multi-agent","rag","faiss","bm25"],"text":"Testato su MovieLens 1M con Llama 3.2 3B Instruct: l'agente aggregatore ha mantenuto la precisione del baseline (∆ = -0.5%) migliorando la novelty del 12%.","vec":[0.04473,-0.01663,-0.06834,-0.07581,0.04812,-0.03069,0.04829,0.05628,0.06224,0.00504,0.06661,0.03233,0.07827,0.00294,0.01483,0.05825,0.07887,-0.02613,-0.10756,-0.04499,0.00275,-0.02196,-0.04149,0.00112,0.0639,0.0179,0.00858,0.04447,0.05464,-0.02238,0.01695,-0.04302,0.07993,-0.04713,-0.00198,0.02588,-0.03515,-0.04652,0.05035,-0.0655,0.0222,0.0313,0.04101,0.0684,0.04369,0.05658,-0.02972,0.07721,-0.02179,-0.03655,0.00534,0.05867,0.07446,0.03803,0.06561,-0.06573,-0.04623,-0.09585,-0.02548,0.00571,0.08456,-0.04293,-0.00046,0.05219,0.10138,0.12404,0.02102,0.06557,-0.0963,-0.06237,-0.08094,0.05944,0.01227,-0.11174,0.01834,-0.00193,0.04343,-0.06316,0.01063,-0.01811,-0.02146,-0.03666,-0.01224,0.02223,-0.03361,0.03638,0.03346,-0.08381,0.03835,-0.05305,0.00779,0.07398,-0.06669,-0.055,-0.06313,-0.05107,0.00316,0.06512,0.02997,-0.03837,0.00221,-0.05176,0.03362,-0.07896,0.00282,0.03123,0.06088,-0.03347,0.05374,-0.0513,-0.03896,0.02826,0.0502,0.02978,-0.02899,-0.08299,-0.00392,-0.02819,0.05373,-0.0593,0.06381,-0.01341,-0.05906,-0.07565,-0.02934,0.02353,0.01649,0.04974,0.02221,0.00821,0.02532,0.03195,-0.0294,0.07741,0.0569,0.05926,-0.04311,0.01772,-0.02756,-0.05006,-0.07837,0.04042,-0.05518,0.01015,0.05873,0.02683,0.08346,-0.03236,0.03893,-0.04537,0.03005,-0.02734,0.03841,0.04926,0.04184,-0.04121,-0.07918,-0.05091,0.0428,0.05715,-0.06584,-0.06719,-0.03908,-0.08546,-0.0239,-0.05285,0.02291,0.06793,-0.04237,-0.01221,-0.04642,0.07633,0.01962,0.05485,-0.0021,0.06799,-0.0423,0.04767,0.07957,0.02376,-0.02689,-0.0499,-0.05761,-0.03957,-0.06853,-0.07889,-0.05597,0.01635,-0.01846,-0.0182,-0.01283,0.00277,-0.02708,-0.08866,-0.05053,0.01043,-0.01758,0.02507,0.06533,0.03062,-0.01173,-0.05689,-0.0126,0.02126,0.0465,0.06661,-0.09436,0.02366,-0.00984,0.04529,0.04569,-0.06441,-0.05334,0.0418,-0.02615,-0.01826,-0.01222,0.03655,-0.0433,0.04219,0.06578,-0.0275,0.06139,-0.08152,-0.02147,0.05175,0.04465,-0.07112,-0.06466,0.04831,-0.03681,-0.05553,-0.06916,-0.08528,-0.02529,-0.04906,0.02229,0.02919,-0.00403,-0.06027,-0.07394,-0.03355,0.01588,-0.00543,0.02042,-0.03055,-0.0188,0.04885,-0.02652,0.11053,0.0582,-0.08004,-0.00432,-0.02053,-0.01331,0.01857,0.05181,0.01347,-0.01856,0.046,0.05849,-0.05055,0.05717,0.04946,0.05053,0.03027,-0.0979,-0.02891,-0.06305,-0.06379,-0.02145,0.01203,0.01459,-0.02012,-0.07607,-0.02791,0.00524,0.13404,-0.09071,-0.06708,0.06744,0.02935,0.04787,0.07958,0.08261,-0.01277,-0.02334,0.07202,-0.00708,-0.03312,-0.05299,-0.04412,0.07636,-0.03159,0.12063,0.05077,0.01893,0.07213,-0.04037,0.01229,-0.01274,-0.00302,0.03694,0.06063,-0.05358,0.02818,0.01243,-0.02393,0.04695,0.04162,0.06728,-0.01358,-0.03248,-0.00661,0.03925,0.03281,0.01337,0.06429,-0.07644,-0.05549,-0.07411,-0.05964,-0.01201,-0.0447,0.0355,0.07776,-0.07441,-0.04589,0.05499,-0.03201,0.01626,-0.0378,-0.06057,0.02487,-0.04552,-0.06135,-0.02913,0.06033,-0.07607,0.00748,0.03734,0.02509,-0.10502,0.06395,-0.00996,-0.08741,0.03937,-0.04548,-0.01486,0.00069,0.02713,-0.12716,0.10433,0.06029,-0.07696,0.04239,-0.08052,-0.03229,0.05566,0.07522,-0.05252,-0.06055,0.02869,0.05824,0.07403,0.02773,-0.03143,-0.05334,-0.01407,-0.03133,0.07326,0.02623,-0.04844,-0.01449,-0.00565,-0.0295,-0.02634,0.04164,-0.04099,-0.05272,0.02421,0.01318,0.09235,0.08147]},{"id":"experience-bfuture#0","docId":"experience-bfuture","title":"Hackathon B.Future Challenge 2025 – BOOM","category":"experience","tags":["challenge","n8n","gemini","backend"],"text":"Sviluppo di Zenith, assistente AI per digitalizzare e automatizzare il processo di consulenza aziendale. Da settembre a novembre 2025 ho partecipato alla B.Future Challenge in un team di 6 persone (Gruppo VAR Group). Abbiamo sviluppato Zenith, un assistente AI per consulenza enterprise. Mi sono occupato della pipeline backend: orchestrazione del workflow tramite n8n, integrazione con Google Gemini via API e archiviazione documenti su Google Drive.","vec":[0.00368,0.00805,-0.05766,-0.05359,0.07725,-0.05275,0.01667,0.02492,0.02538,0.02191,0.04851,0.00973,0.02578,-0.05452,-0.01619,0.01419,0.04195,-0.02729,-0.06515,-0.1022,0.02469,-0.00925,-0.06561,0.05965,0.04585,0.06404,-0.06762,0.01083,0.04089,-0.04282,-0.05277,-0.0515,0.08262,-0.07156,0.08154,0.01042,-0.03758,-0.05228,0.02966,-0.06943,-0.02086,0.023,-0.01278,0.01126,0.04061,0.07823,-0.03406,0.01885,-0.04542,-0.01606,-0.03167,0.07328,0.04816,0.02834,0.04676,-0.02749,-0.0361,-0.08004,-0.03838,0.02672,0.04326,-0.03109,0.00971,0.02927,0.05884,0.09236,-0.00132,0.06231,-0.06302,-0.0482,-0.03194,0.0821,0.03565,-0.07771,0.01347,0.04863,0.04417,-0.06269,0.05272,-0.0429,-0.10621,-0.0257,-0.01832,0.04123,-0.08779,0.04027,0.03039,-0.07202,0.06756,-0.01959,0.06766,0.06456,-0.06384,-0.03478,-0.06003,-0.03981,-0.07673,0.10115,0.08525,-0.01034,0.04033,-0.09441,0.01111,-0.09156,-0.02738,0.03191,-0.02047,-0.06849,0.06777,-0.05088,-0.05281,0.07722,0.07099,0.01172,-0.08065,-0.01282,-0.04271,-0.06778,0.0269,-0.06321,0.05803,-0.00258,-0.03745,-0.06577,-0.07944,-0.06493,-0.00773,0.09629,0.07649,0.01855,0.01536,0.04854,0.00653,0.04872,0.0627,0.10219,-0.06716,-0.01,-0.01665,-0.07403,-0.03921,0.0864,-0.00714,0.03768,0.06939,0.02894,0.12617,-0.04127,0.06009,-0.05331,0.03303,-0.05075,0.08378,0.0266,0.05121,-0.02094,-0.07095,-0.00519,0.05729,0.05284,-0.06699,-0.06481,-0.04944,-0.01198,-0.05344,0.0124,0.01364,0.03767,-0.07296,-0.0293,-0.07393,0.10718,-0.05094,0.08703,0.01809,0.04671,-0.05803,0.05182,0.06661,0.02921,-0.0139,-0.00292,-0.07791,-0.05064,-0.06042,-0.01955,-0.03108,0.03066,-0.02508,-0.04815,0.02448,0.03157,-0.02599,-0.06851,-0.0159,0.07406,-0.05851,0.04454,0.07429,0.03711,0.00733,-0.03522,0.04784,0.00721,0.03871,-0.00127,-0.03571,0.04098,-0.10221,0.01396,0.03503,-0.04333,-0.0541,0.03816,-0.02479,-0.04379,-0.00249,0.05416,-0.01645,-0.00055,0.06839,-0.02315,0.04143,-0.07564,0.00411,0.03328,0.00728,-0.10801,-0.05699,0.05007,-0.06643,-0.01754,-0.06578,-0.06443,-0.01406,-0.0726,0.00932,0.04126,0.03467,-0.00771,-0.05342,-0.02831,0.04363,-0.02789,0.03884,-0.0341,-0.02109,0.0294,-0.0284,0.05492,0.09954,-0.09249,-0.09122,-0.04735,-0.00911,0.04394,0.04944,0.05133,-0.07163,0.05946,0.04394,-0.03498,0.04739,0.04985,0.04516,0.01654,-0.05087,0.01004,-0.02277,0.01195,-0.0372,-0.02463,0.04033,-0.01982,-0.06674,-0.05291,0.01332,0.08983,-0.0639,-0.08164,0.09663,0.02927,0.02623,0.09467,0.05638,-0.01102,-0.02334,0.05133,-0.00454,-0.03032,-0.0429,-0.01288,0.04761,-0.00976,0.07196,0.02297,0.01099,0.06864,-0.06014,0.05908,0.00873,0.00886,-0.00641,0.01769,-0.07654,0.02432,0.0163,0.01624,0.02358,-0.00053,0.05855,0.05224,0.00093,-0.01379,0.03221,0.05919,-0.01232,0.01042,-0.07908,-0.04695,-0.08419,-0.07627,-0.00778,-0.03924,0.03396,0.08325,-0.06515,-0.00912,0.03155,0.03525,-0.00791,-0.08196,-0.09871,0.05014,-0.02953,-0.03471,0.00566,0.08766,-0.01161,-0.03017,0.03874,0.02677,-0.06524,0.05524,-0.01807,-0.04716,0.01653,-0.02124,-0.10359,0.00436,0.06711,-0.10266,0.03448,0.01592,-0.04545,0.04039,-0.05763,-0.00295,0.03004,0.02898,-0.05858,-0.02839,0.06911,0.00232,0.02876,0.0245,0.02797,-0.04389,0.05132,-0.05405,0.04262,0.08337,-0.03074,-0.04196,-0.00306,-0.05814,-0.03215,0.01489,-0.03821,-0.06613,0.08268,0.0461,0.09485,0.0597]},{"id":"experience-bfuture#1","docId":"experience-bfuture","title":"Hackathon B.Future Challenge 2025 – BOOM","category":"experience","tags":["challenge","n8n","gemini","backend"],"text":"Il prototipo ha stimato una riduzione dei tempi di produzione di un report da 7 giorni a 1.","vec":[-0.01373,-0.01631,-0.00608,-0.05105,0.07375,-0.05782,-0.02289,0.00492,0.07387,0.01076,0.05423,-0.00526,0.06374,-0.05143,-0.00447,0.03097,0.01876,-0.04522,-0.04982,-0.09154,0.04971,0.00334,-0.05648,0.03681,0.08733,0.0548,-0.05314,0.01283,0.04919,-0.09429,-0.03674,-0.06575,0.05341,-0.02811,0.06372,-0.01522,-0.0266,-0.06448,0.03208,-0.04314,0.00636,0.03386,-0.04596,0.04002,0.04078,0.05612,-0.05162,0.04656,-0.02943,-0.05063,-0.01318,0.07969,0.05538,0.03341,0.0342,-0.00904,-0.00439,-0.08302,-0.05905,0.04353,0.07177,-0.01836,-0.01445,0.04703,0.10075,0.09605,0.01038,0.05589,-0.04009,-0.04186,-0.06686,0.04248,0.03221,-0.06267,-0.00973,0.0561,0.05855,-0.06412,0.03201,-0.06468,-0.08821,-0.03703,-0.04622,0.031,-0.08991,0.03922,0.02459,-0.05757,0.07973,-0.0265,0.05493,0.10191,-0.08424,-0.04456,-0.05921,-0.04563,-0.0469,0.0339,0.05108,0.01685,0.04899,-0.08443,0.03786,-0.1101,-0.04843,0.04784,0.00372,-0.03015,0.08235,-0.04102,-0.07574,0.03556,0.06926,-0.00972,-0.04141,-0.03346,-0.0211,-0.06396,0.02157,-0.08489,0.07091,-0.02682,-0.01599,-0.05596,-0.06061,-0.02206,0.01731,0.07316,0.02508,0.05017,0.02497,0.04079,0.02438,0.08142,0.04634,0.02865,-0.05915,0.00789,-0.01832,-0.06018,-0.05116,0.05389,-0.01248,0.03732,0.04135,0.04461,0.09972,-0.05229,0.05809,-0.05285,0.00743,-0.06304,0.07944,0.03611,0.05246,-0.00063,-0.1184,-0.03371,0.06066,0.058,-0.05856,-0.03228,-0.04305,-0.05585,-0.04569,-0.01575,0.00821,0.06576,-0.08204,-0.01807,-0.07845,0.10986,0.00596,0.07626,0.0191,0.04899,-0.03817,0.05833,0.08921,0.04589,-0.01312,-0.02124,-0.05795,-0.03964,-0.04834,-0.0383,-0.01648,0.03093,0.01431,-0.0145,0.01925,0.04748,-0.02025,-0.02539,-0.0162,0.01907,-0.05134,0.04847,0.07784,0.03606,0.0104,-0.02864,0.03841,-0.00643,0.07163,0.01795,-0.01967,0.01522,-0.07181,0.05123,0.05844,-0.07364,-0.06203,0.01543,-0.02113,-0.0577,-0.03745,0.06519,-0.01993,0.03882,0.05964,-0.01172,0.01229,-0.09709,-0.02191,0.03538,-0.01547,-0.1032,-0.00895,0.02281,-0.04491,0.00477,-0.05648,-0.06952,-0.01354,-0.06034,0.01645,0.01801,0.01369,-0.02914,-0.05878,-0.03651,0.01088,-0.03024,0.00858,-0.04788,-0.02232,0.0286,-0.02981,0.03546,0.09557,-0.09825,-0.0837,-0.0618,-0.01768,0.04799,0.03116,0.07602,-0.055,0.0593,0.03262,-0.0151,0.06091,0.07424,0.05415,-0.0142,-0.07169,0.00582,-0.06676,-0.05023,-0.04402,0.02398,0.04062,-0.0166,-0.08134,-0.0606,0.02377,0.08014,-0.09023,-0.08492,0.0662,0.03357,0.04752,0.07268,0.05579,-0.02354,-0.03397,0.04863,0.00585,-0.03788,-0.05268,-0.04002,0.06144,0.00118,0.06923,0.01725,0.0064,0.07134,-0.06383,0.03655,0.00165,-0.00065,-0.00525,0.02227,-0.06675,0.06457,0.04635,0.02032,0.02606,0.00654,0.064,0.05856,-0.02791,-0.00701,0.03001,0.09354,-0.00118,0.07281,-0.08448,-0.07463,-0.07914,-0.09402,0.00604,-0.06234,0.05433,0.06537,-0.07567,-0.00584,0.04113,0.00603,0.04867,-0.03601,-0.05354,0.03302,-0.02129,-0.0414,0.01771,0.07568,-0.02984,-0.00151,0.05826,0.01581,-0.09106,0.0889,-0.05493,-0.06838,0.01946,-0.03379,-0.0668,0.01358,0.01512,-0.10187,0.06983,0.02392,-0.0503,0.02682,-0.05439,0.00391,0.02581,0.03589,-0.07325,-0.01286,0.07316,0.02182,0.05524,0.05334,0.01086,-0.02214,0.05086,-0.05972,0.02922,0.04815,-0.0134,-0.03606,-0.00709,-0.05563,-0.01191,0.0181,-0.06155,-0.09591,0.06316,0.03298,0.09698,0.06787]},{"id":"experience-work#0","docId":"experience-work","title":"Esperienza lavorativa trasversale","category":"experience","tags":["work","experience","resilience","management"],"text":"Operaio generico dal 2016 al 2022 in settori diversi. Dal 2016 al 2022 ho lavorato in settori molto diversi: agricoltura, edilizia, fabbrica, reception alberghiera, steward eventi, e gestione di un negozio al dettaglio (cosmetici e attrezzatura professionale). Sei anni che hanno formato una forte resilienza e capacità di adattamento, prima di decidere di cambiare strada e iscrivermi a Informatica.","vec":[0.01853,-0.03242,-0.04701,-0.05646,0.06168,-0.05814,0.00863,0.05157,0.00035,0.04307,0.02088,0.03841,0.0411,-0.02451,0.01164,0.04017,0.05697,-0.0443,-0.11062,-0.06118,0.01593,0.02794,-0.07044,0.07747,0.07986,0.00869,-0.01903,-0.00137,0.04366,-0.04525,-0.06513,-0.05366,-0.01199,-0.07617,0.02911,0.03304,-0.01986,-0.062,0.06187,-0.0838,-0.09203,-0.00481,0.04812,0.05409,-0.00075,0.09298,-0.02665,0.04344,-0.06543,-0.02735,-0.0439,0.05511,0.0439,0.10622,0.02922,-0.04862,-0.06884,-0.04395,-0.03007,0.02381,0.03771,-0.01262,-0.00516,0.02124,0.05926,0.03021,0.03955,0.02884,-0.06643,-0.04462,-0.00972,0.06371,-0.00616,-0.08224,-0.01438,0.05027,0.05052,-0.07536,0.03628,-0.1033,-0.08531,-0.03734,-0.00409,0.0676,-0.05491,0.07656,0.03494,-0.05625,0.06717,-0.02306,0.05679,0.0449,-0.0393,-0.0436,-0.05703,-0.07584,-0.03823,0.0808,0.05163,-0.01661,0.0638,-0.03785,0.03999,-0.07425,-0.0372,0.0256,0.0214,-0.04811,0.05707,-0.06571,-0.06127,0.04492,-0.00301,0.02778,-0.09135,-0.03056,-0.01277,-0.06325,0.06728,-0.03257,0.07569,-0.02234,-0.06375,-0.04856,-0.08821,0.00822,0.01524,0.1084,0.02971,0.02144,0.00551,0.0265,-0.00255,0.06017,0.00957,0.09216,-0.03139,-0.00918,-0.00594,-0.04843,-0.04288,0.06157,-0.06571,0.03209,0.04342,0.07999,0.05587,0.01428,0.06654,-0.05178,0.03101,-0.03146,0.07744,0.02382,0.04224,-0.02617,-0.08502,-0.0291,0.06099,0.049,-0.0404,-0.04138,-0.04479,-0.00521,-0.05271,-0.00762,0.03301,0.0365,-0.06175,-0.00422,-0.04081,0.0542,-0.05915,0.09227,-0.00349,-0.02514,-0.06926,0.03123,0.07157,0.07808,-0.0601,-0.02744,-0.05037,-0.05894,-0.07849,-0.06746,-0.10196,0.03089,0.0037,-0.00241,0.02538,0.00627,-0.01652,-0.09997,-0.03015,0.0386,-0.06038,0.0508,0.03717,0.03099,-0.00069,-0.0554,0.0084,0.04577,0.0589,0.02426,-0.05415,0.03785,-0.05248,0.04396,0.05188,-0.07882,-0.04614,0.04231,-0.01932,0.01041,0.01259,0.07044,-0.03465,0.02366,0.05083,-0.0356,0.06127,-0.05904,-0.00345,0.05105,0.05526,-0.05739,-0.04992,0.07482,-0.10263,-0.01896,-0.05469,-0.06204,-0.05303,-0.07799,0.02882,0.04904,0.04126,0.00265,-0.04843,-0.0386,0.03118,-0.03087,0.05019,-0.06915,-0.02993,0.01511,-0.05157,0.04507,0.09227,-0.12147,-0.07641,-0.05883,0.01805,0.04404,0.04712,0.04591,-0.05795,0.04298,0.0512,-0.00827,0.07522,0.05619,0.07661,-0.02905,-0.03348,-0.02448,-0.03285,-0.05696,-0.03891,0.02071,-0.02472,-0.01311,-0.05228,-0.00965,0.04192,0.04713,-0.03575,-0.03931,0.04799,0.03628,0.02759,0.09275,0.03863,-0.06745,-0.01931,0.0969,0.00528,-0.03569,-0.02793,-0.02243,0.06557,-0.04656,0.06434,0.03241,0.01375,0.09145,-0.08598,0.04878,0.01262,-0.00601,0.00969,0.03677,-0.03918,0.05588,-0.00114,-0.03582,0.0134,0.04417,0.05687,0.0605,-0.02382,-0.02044,0.08242,0.03952,0.00643,0.03841,-0.07467,-0.04804,-0.06962,-0.05729,-0.05672,-0.09171,0.05089,0.07612,-0.08838,-0.03577,0.02951,-0.01132,0.03312,-0.0428,-0.04767,0.03231,-0.04273,-0.05209,0.00705,0.09791,-0.01759,0.01201,0.07095,0.07617,-0.07522,0.07899,-0.00248,-0.09582,0.05304,-0.02664,-0.07979,0.03628,0.02233,-0.07573,0.02535,0.06412,-0.01405,0.04622,-0.05589,0.01945,0.06651,0.00574,-0.03848,-0.04207,0.03318,0.00358,0.0764,0.03301,-0.01365,-0.02388,0.02081,-0.03127,0.04133,0.10143,-0.04938,-0.0241,-0.03732,-0.04438,-0.04683,0.00341,-0.02181,-0.07035,0.05116,0.07987,0.0611,0.05681]},{"id":"education-track#0","docId":"education-track","title":"Percorso formativo","category":"education","tags":["education","uniba","degree","diploma"],"text":"Laurea in Informatica (107/110) e Diploma in Ragioneria. Ho conseguito la Laurea Triennale in Informatica e Tecnologie per la Produzione del Software presso l'Università di Bari (10/2022 - 07/2025) con votazione 107/110. Tesi: Orchestrazione di Agenti LLM per l'Ottimizzazione Multi-Metrica nei Sistemi di Raccomandazione. Precedentemente, ho ottenuto il Diploma di Scuola Superiore in Ragioneria (09/2011 - 07/2016) presso l'I.T.C Eugenio Montale di Rutigliano, con voto 75.","vec":[0.01734,-0.00739,-0.05129,-0.09933,0.0403,-0.09034,-0.00598,0.05792,0.0682,-0.0152,0.05116,-0.00364,0.08804,-0.0249,-0.00333,0.06369,0.08024,-0.08563,-0.07502,-0.06603,0.01818,0.01952,-0.06287,0.03712,0.04564,0.03878,-0.0083,0.01156,0.01189,-0.04315,-0.07284,-0.05051,0.06856,-0.06702,0.03958,0.04235,-0.03837,-0.04088,0.02727,-0.03744,-0.03713,0.00148,0.05136,0.08477,-0.00232,0.07761,-0.03614,0.04009,-0.02707,-0.03328,-0.03698,0.08771,0.08513,0.07062,0.03194,-0.03227,-0.02317,-0.06414,-0.04547,0.04185,0.05881,-0.03059,0.0177,0.04231,0.05682,0.06232,0.03539,0.07234,-0.09196,-0.1218,-0.03293,0.02168,0.00643,-0.05356,0.01142,0.06337,0.0803,-0.06153,-0.00126,-0.0669,-0.06852,-0.03556,-0.03765,0.06035,-0.02662,0.03784,0.06207,-0.05548,0.02287,-0.03506,0.05547,0.04731,-0.04708,-0.06062,-0.02978,-0.02677,-0.01628,0.09584,0.0551,-0.00784,0.01911,-0.06683,0.06192,-0.09213,-0.08592,0.00402,-0.00715,-0.05155,0.05305,-0.08574,-0.02411,0.05009,0.01475,0.03122,-0.08466,-0.05862,-0.07144,-0.05411,0.02792,-0.0816,0.07369,-0.05183,-0.07275,-0.06912,-0.02904,-0.0098,0.00181,0.05037,0.06434,0.02762,0.03056,0.04368,-0.00191,0.06444,0.06377,0.06312,-0.08563,0.02065,-0.02195,-0.02931,-0.03818,0.04588,-0.06207,0.01803,0.04557,0.03773,0.12025,-0.03313,0.05278,-0.05548,0.02305,-0.0013,0.03026,0.04881,0.02903,-0.02753,-0.07141,-0.04846,0.06255,0.02895,-0.04345,-0.05536,-0.02719,-0.04475,-0.02873,-0.02304,0.03244,0.04306,-0.05579,-0.03495,-0.00093,0.07205,-0.0409,0.12682,-0.00706,0.02072,-0.0418,0.02879,0.10796,0.05965,-0.03182,-0.01089,-0.07165,-0.06354,-0.07577,-0.09614,-0.03128,0.01416,0.034,-0.07352,0.02005,0.03471,-0.03213,-0.07861,-0.04582,0.03928,-0.03693,0.0755,0.04057,0.04698,-0.01419,-0.02478,0.01409,0.01568,0.06566,0.06637,-0.09336,0.04276,-0.0053,0.02818,0.01472,-0.0345,-0.03616,0.02563,0.04917,0.01939,-0.00025,0.05781,-0.01687,0.03519,0.01898,-0.02999,0.06406,-0.03228,0.00888,0.02898,0.05785,-0.06028,-0.0677,0.04765,-0.0607,-0.03037,-0.07459,-0.08042,-0.0473,-0.05233,0.03804,0.06609,0.02997,-0.01088,-0.09222,-0.07011,0.00805,-0.03517,0.04437,-0.02465,-0.01734,0.03745,-0.02707,0.09244,0.08742,-0.09491,-0.02748,-0.02307,0.01643,0.01512,0.06553,-0.00272,-0.03422,0.02224,0.03208,-0.02299,0.03134,0.03034,0.06524,0.03134,-0.07106,-0.04897,-0.04086,-0.07139,-0.00264,0.00724,0.03691,-0.03278,-0.0387,-0.04266,0.04608,0.08709,-0.01447,-0.05293,0.06686,0.03704,0.09555,0.06476,0.05264,-0.00043,-0.0219,0.10075,-0.01525,-0.06554,-0.05006,0.00763,0.06574,-0.05027,0.06715,0.04423,-0.0351,0.03068,-0.04061,0.04071,-0.00784,-0.04516,0.05178,0.01477,-0.09323,0.01913,-0.01515,-0.00803,0.0328,0.02269,0.04255,0.01986,-0.06072,-0.00411,0.03357,0.08261,0.02493,0.07654,-0.06869,-0.03679,-0.05418,-0.07176,-0.04317,-0.07779,0.03795,0.07645,-0.07819,0.00086,0.05766,-0.02134,0.0368,-0.0061,-0.06739,0.05201,-0.03424,-0.06166,-0.00483,0.07865,-0.05567,-0.0166,0.06623,0.05122,-0.06183,0.03516,-0.03224,-0.0709,0.01067,-0.00739,-0.06157,0.00133,0.01027,-0.10452,0.03175,0.06285,-0.05399,0.07196,-0.09408,0.01086,0.07172,0.02125,-0.02952,-0.07388,0.02849,0.0338,0.04698,0.02285,-0.01282,-0.01536,0.03666,-0.02981,0.04902,0.05219,-0.07468,-0.01586,-0.02738,-0.0385,-0.04562,0.00181,-0.06399,-0.08098,0.06745,0.03659,0.0403,0.0346]},{"id":"services-stack#0","docId":"services-stack","title":"Competenze e tecnologie","category":"services","tags":["skills","python","react","n8n","langgraph","rag"],"text":"Sviluppo AI/ML, web development, architetture multi-agente e RAG. Le mie competenze includono linguaggi come Python, Java, C, JavaScript, HTML/CSS, SQL; framework e tool AI come LangGraph, LangChain, FAISS, BM25, Embeddings, Pandas, NumPy; sviluppo web e backend con React, FastAPI; database MySQL, MongoDB; e automazione con n8n.","vec":[0.0509,0.00119,-0.05116,-0.07253,0.07444,-0.08291,0.03266,0.06834,0.0145,-0.00942,0.07911,0.00502,0.07326,-0.04266,-0.01459,0.01573,0.06159,-0.05832,-0.05089,-0.03416,0.03034,0.02971,-0.05534,0.03427,0.05807,0.03346,-0.00488,0.01017,0.01843,-0.04789,-0.02971,-0.02269,0.078,-0.04511,0.03432,0.02625,-0.02026,-0.07283,0.02812,-0.08676,-0.01003,0.03572,0.06232,0.01994,0.05848,0.07095,-0.01915,0.04855,-0.0528,0.00362,-0.02743,0.04524,0.03415,0.05801,0.04211,-0.03926,-0.04023,-0.07897,-0.0608,0.01102,0.05108,-0.03259,0.01766,0.00793,0.0621,0.04347,0.02867,0.05019,-0.08174,-0.0667,-0.03657,0.08363,-0.01735,-0.06614,-0.0167,0.04237,0.01261,-0.078,0.04014,-0.04924,-0.0996,-0.04027,-0.0294,0.04547,-0.04389,0.05927,0.06617,-0.08916,0.06759,-0.01759,0.06938,0.01368,-0.02678,-0.02459,-0.09893,-0.07703,-0.04779,0.10472,0.06213,-0.02095,0.02897,-0.02657,0.03334,-0.07707,-0.08809,0.02725,-0.00782,-0.04403,0.02285,-0.04179,-0.03121,0.03287,0.06123,0.03095,-0.08636,-0.04376,-0.01624,-0.04636,0.05038,-0.05115,0.0345,-0.01466,-0.08564,-0.07286,-0.04844,-0.04608,0.02241,0.05649,0.0295,0.0294,0.02716,0.07677,0.00906,0.04646,0.05733,0.10417,-0.02781,-0.00554,0.00336,-0.0312,-0.04215,0.05168,-0.09133,0.00976,0.07424,0.01735,0.0868,-0.02703,0.01587,-0.03667,0.00097,-0.02697,0.04032,0.02748,0.04801,-0.02237,-0.04517,-0.02235,0.08766,0.05476,-0.06641,-0.04012,-0.04,-0.02156,-0.07081,-0.06802,-0.00596,0.06033,-0.04426,0.00515,-0.04327,0.07673,-0.05661,0.04613,0.0118,0.00522,-0.07177,0.06281,0.09177,0.05578,-0.03151,-0.01384,-0.08687,-0.05741,-0.06514,-0.03996,-0.0678,-0.01096,-0.00248,-0.04581,0.03823,0.03694,-0.05201,-0.11716,-0.03532,0.05625,-0.04373,0.04146,0.04203,0.08079,-0.00818,-0.04487,0.01932,0.01251,0.05957,0.01347,-0.08736,0.05419,-0.05216,0.02699,0.02123,-0.01123,-0.06166,0.06997,0.02038,-0.00455,-0.02481,0.07083,-0.02386,0.04607,0.07542,-0.06534,0.05579,-0.0431,-0.02534,0.04667,0.05543,-0.0879,-0.07346,0.04444,-0.06133,-0.00733,-0.02134,-0.08129,-0.02491,-0.09029,0.00278,0.03144,0.02777,-0.04154,-0.06902,-0.03278,0.00564,-0.03896,0.03146,-0.06146,-0.01108,0.05373,-0.04453,0.09648,0.09819,-0.06543,-0.07417,-0.01149,0.00517,0.0504,0.07106,0.0539,-0.0669,0.02842,0.04694,-0.04715,0.04522,0.0427,0.04365,0.04003,-0.03506,-0.03237,-0.0651,-0.00239,-0.03336,0.02726,0.00033,-0.0173,-0.00461,-0.0625,0.00731,0.09138,-0.0432,-0.04781,0.04905,0.05673,0.06672,0.06807,0.06192,-0.00934,-0.00448,0.05742,0.00763,-0.05442,-0.06216,-0.04701,0.04863,-0.02478,0.09961,0.01301,0.03435,0.03827,-0.06484,0.04491,0.0203,-0.02283,0.0463,0.0548,-0.04226,0.05963,-0.01074,-0.0025,0.08421,0.02125,0.06214,0.02466,-0.02636,-0.03485,0.02306,0.04054,0.02302,0.04765,-0.06852,-0.07853,-0.06315,-0.09194,-0.02,-0.05626,0.02735,0.08095,-0.1025,-0.02231,0.06239,-0.0179,0.05665,-0.00887,-0.04011,0.02079,-0.06973,-0.04799,-0.03063,0.10597,-0.00458,-0.01556,0.05172,0.03634,-0.05919,0.03871,-0.05053,-0.08568,0.01658,0.00815,-0.01217,0.03903,0.04489,-0.11024,0.02967,0.03538,-0.02499,0.04444,-0.07632,0.02329,0.00901,0.05219,-0.04093,-0.08293,0.04656,0.02046,0.01689,0.0156,-0.0226,-0.0156,0.03984,-0.04077,0.07224,0.10067,-0.06749,-0.07015,-0.04947,-0.05312,-0.04612,-0.00114,-0.05713,-0.07484,0.05289,0.03398,0.09815,0.08279]},{"id":"languages#0","docId":"languages","title":"Competenze linguistiche","category":"languages","tags":["languages","italian","english"],"text":"Italiano madrelingua, Inglese livello B1. Parlo italiano come lingua madre e ho una conoscenza dell'inglese di livello B1.","vec":[0.05162,-0.0259,-0.05571,-0.08465,0.09224,-0.06917,0.00312,0.07245,0.06971,-0.02681,0.06052,-0.00663,0.07627,-0.02511,0.04152,0.05617,0.09036,-0.08475,-0.06328,-0.05938,0.03113,0.00221,-0.05185,0.01463,0.05171,-0.02115,0.03515,0.02728,-0.00591,-0.04194,-0.01383,0.01311,0.07202,-0.05324,0.03721,-0.00023,-0.01096,-0.11995,0.06252,-0.10087,-0.02778,0.02443,0.07462,0.06394,0.05431,0.07461,-0.0461,0.07203,-0.02313,-0.01527,-0.0141,0.04564,0.0764,0.06666,0.05796,-0.05926,-0.04767,-0.04805,-0.02716,-0.01489,0.07975,-0.04205,0.03925,0.0118,0.0233,0.0596,0.00549,0.04072,-0.02102,-0.0611,-0.0196,0.07383,0.00699,-0.04332,0.0494,0.01062,0.00251,-0.10952,0.03302,-0.09229,-0.08885,-0.0517,-0.03147,0.01331,-0.1073,0.07381,0.01589,-0.04276,0.03126,-0.02821,0.06785,0.03749,-0.0198,-0.06276,-0.07656,-0.06789,-0.01488,0.11188,0.03309,-0.03032,0.0583,-0.0488,0.03694,-0.08266,-0.06504,0.02121,-0.00013,-0.05491,0.02378,-0.04916,-0.00694,0.04716,0.05726,0.03757,-0.09791,-0.0646,-0.0617,-0.05597,0.04789,-0.04242,0.03973,-0.05438,-0.04745,-0.05442,-0.06605,-0.01121,0.00521,0.03969,-0.00324,0.01959,0.02368,0.045,-0.00505,0.03892,0.02007,0.0691,-0.04336,-0.00404,0.01082,-0.03431,-0.04934,0.02856,-0.03548,0.06471,0.02151,0.0075,0.07298,-0.01782,0.07546,-0.05723,0.00204,-0.02847,0.02068,0.05449,0.01271,0.00557,-0.06976,-0.03611,0.07225,0.08593,-0.1008,-0.06263,-0.05573,-0.04869,-0.05894,-0.07067,0.03456,0.02567,-0.02361,-0.0029,-0.01531,0.06393,-0.05239,0.04313,0.02081,0.0187,-0.06364,0.06331,0.06278,0.03666,-0.01864,-0.05962,-0.05577,-0.02101,-0.07828,-0.04816,-0.00039,0.01756,0.06879,-0.03942,0.0236,0.04287,-0.05033,-0.12728,-0.06385,0.03284,-0.04051,0.06528,0.01214,0.03895,-0.03532,-0.04443,0.03249,-0.00024,0.04006,0.01917,-0.09998,0.01777,-0.01524,0.07942,0.01388,-0.03519,-0.03872,0.05235,0.0382,0.01528,-0.01108,0.03205,-0.04028,-0.00507,0.04033,-0.02712,0.06723,-0.03601,-0.01531,0.02533,0.07234,-0.05757,-0.04077,0.04656,-0.07189,-0.00423,-0.03608,-0.06737,-0.03191,-0.06372,0.05271,-0.02052,0.00919,-0.01937,-0.00636,-0.01979,0.0435,-0.07777,0.03652,-0.06264,-0.00122,0.05494,-0.01773,0.04554,0.07846,-0.08661,-0.06007,-0.0256,0.02756,0.07383,0.09658,0.05366,-0.03677,-0.01212,0.03903,-0.06428,0.08993,0.06835,0.05712,0.0282,-0.05795,-0.0362,-0.05101,-0.02175,-0.00517,0.02848,0.02189,-0.02543,-0.03782,-0.05337,0.0219,0.05448,-0.05043,-0.02255,0.03424,0.01292,0.01757,0.06098,0.02811,-0.02358,-0.01966,0.01671,0.00526,-0.03236,-0.01041,-0.03661,0.06111,-0.03737,0.08809,0.05884,0.01485,0.05312,-0.06846,0.04214,-0.0193,-0.03611,0.02124,0.05543,-0.05794,0.00226,-0.00659,-0.01035,0.02336,0.0151,0.0681,0.04743,-0.04444,-0.02601,0.0388,0.0367,0.01855,0.11015,-0.02777,-0.04512,-0.04402,-0.11374,-0.04812,-0.02164,0.02595,0.09986,-0.06838,-0.02637,0.05803,-0.0152,0.02429,0.00358,-0.03669,0.01085,-0.01996,0.01584,-0.06701,0.11615,-0.04559,-0.03942,0.0532,0.06759,-0.06274,0.04047,-0.04857,-0.07117,0.04829,-0.03129,-0.00785,0.02373,0.05749,-0.06385,0.038,0.05976,-0.02588,0.0664,-0.09848,0.03768,0.05256,0.06254,-0.05452,-0.09817,0.02805,0.08552,0.04344,0.06136,0.01304,-0.04591,0.059,-0.05562,0.05188,0.08899,-0.07432,-0.06546,-0.05004,-0.02813,-0.09455,0.03854,-0.06269,-0.06105,0.04787,0.0483,0.08702,0.05665]}]}
```

# src\data\skills.ts

```ts
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
  description: string;
  focusAreas: string[];
  stack: string[];
}

export interface ExperienceMetric {
  label: string;
  value: string;
  caption: string;
}

export interface ToolHighlight {
  area: string;
  category: string;
  description: string;
  tools: string[];
}

export interface Language {
  name: string;
  level: string;
  description: string;
}

export const capabilityTracks: CapabilityTrack[] = [
  {
    title: 'AI/ML & Data Science',
    icon: 'brain',
    description:
      'Sviluppo di sistemi di raccomandazione LLM-driven, architetture multi-agente e soluzioni NLP con focus su explainability e RAG.',
    focusAreas: ['Recommender Systems', 'Multi-agent orchestration', 'Hybrid RAG', 'Explainability'],
    stack: ['LangGraph', 'LangChain', 'LLMs', 'Python', 'FAISS', 'BM25'],
  },
  {
    title: 'Web Development',
    icon: 'web',
    description:
      'Sviluppo full-stack con React e Next.js, API backend con Node.js/Express e integrazione con servizi AI.',
    focusAreas: ['Frontend React/Next.js', 'Backend Node.js', 'API Integration', 'Responsive Design'],
    stack: ['React', 'Next.js 15', 'Node.js', 'Express', 'Vite', 'Tailwind CSS', 'HTML/CSS'],
  },
  {
    title: 'DevOps & Integration',
    icon: 'code',
    description:
      'Automazione workflow, gestione database relazionali e NoSQL, metodologie Agile e version control.',
    focusAreas: ['Workflow Automation', 'Database Management', 'Agile/Scrum', 'CI/CD'],
    stack: ['n8n', 'GitHub', 'MySQL', 'MongoDB', 'Docker', 'npm/yarn'],
  },
];

export const experienceMetrics: ExperienceMetric[] = [
  {
    label: 'Briefing time',
    value: 'ore → secondi',
    caption: 'Riduzione tempi report con AI generativa (B.Future Challenge).',
  },
  {
    label: 'Recsys novelty',
    value: '+12%',
    caption: 'Miglioramento diversità/novelty con Llama 3.2 e Multi-Agent.',
  },
  {
    label: 'Precision@1',
    value: '-0.5%',
    caption: 'L\'agente aggregatore ha mantenuto quasi intatta la precisione del baseline.',
  },
  {
    label: 'Laurea triennale',
    value: '107/110',
    caption: 'Informatica e Tecnologie per la Produzione del Software (UniBa).',
  },
];

export const toolHighlights: ToolHighlight[] = [
  {
    area: 'Programming Languages',
    category: 'Core',
    description: 'Linguaggi di programmazione per sviluppo AI, web e sistemi enterprise.',
    tools: ['C', 'Python', 'Java', 'JavaScript', 'SQL', 'HTML/CSS'],
  },
  {
    area: 'AI/ML Stack',
    category: 'AI-first',
    description: 'Framework e librerie per machine learning, LLM e sistemi di raccomandazione.',
    tools: ['LangGraph', 'LangChain', 'FAISS', 'BM25', 'Pandas', 'NumPy', 'Jupyter'],
  },
  {
    area: 'Web & Database',
    category: 'Full-stack',
    description: 'Tecnologie per sviluppo web moderno e gestione dati.',
    tools: ['React', 'Next.js', 'Node.js', 'Express', 'MySQL', 'MongoDB'],
  },
  {
    area: 'DevOps & Automation',
    category: 'Platform',
    description: 'Strumenti per automazione, version control e metodologie di sviluppo.',
    tools: ['n8n', 'GitHub', 'npm/yarn', 'VS Code', 'Eclipse', 'Agile/Scrum'],
  },
];

export const languages: Language[] = [
  {
    name: 'Italiano',
    level: 'Madrelingua',
    description: 'Lingua madre, comunicazione professionale e tecnica.',
  },
  {
    name: 'Inglese',
    level: 'B1 - Base',
    description: 'Lettura documentazione tecnica, comunicazione scritta e meeting internazionali.',
  },
];

```

# src\hooks\useResponsive.ts

```ts
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
```

# src\lib\rag\bm25.ts

```ts
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

```

# src\lib\rag\embedder.ts

```ts
'use client';

/**
 * Embedding della query NEL BROWSER del visitatore.
 *
 * Perché qui e non sul server:
 * - zero API di embedding (il vecchio stack puntava a un endpoint
 *   OpenRouter inesistente e produceva vettori-zero);
 * - zero rate limit e zero costi: il calcolo è del client;
 * - EU-safe: nessun testo dell'utente lascia il browser prima della
 *   chiamata a /api/chat, che riceve solo il vettore (384 float).
 *
 * Modello: Xenova/multilingual-e5-small quantizzato q8 (~30 MB on-disk,
 * cache HTTP del browser dopo il primo load). E5 è ASIMMETRICO:
 * le query vanno prefissate con "query: ", i passaggi con "passage: "
 * (lo script di ingest usa il prefisso speculare).
 *
 * Tutto è lazy: il pacchetto @huggingface/transformers (~1 MB di JS)
 * viene importato solo alla prima apertura del copilot, mai nel
 * bundle critico della pagina.
 */

export const EMBED_MODEL = 'Xenova/multilingual-e5-small';
export const EMBED_DIM = 384;

export type EmbedderState = 'idle' | 'loading' | 'ready' | 'error';

type FeatureExtractor = (
  text: string,
  opts: { pooling: 'mean'; normalize: boolean },
) => Promise<{ data: Float32Array }>;

let state: EmbedderState = 'idle';
let extractorPromise: Promise<FeatureExtractor | null> | null = null;
const listeners = new Set<(s: EmbedderState) => void>();

function setState(next: EmbedderState) {
  state = next;
  listeners.forEach((l) => l(next));
}

export function getEmbedderState(): EmbedderState {
  return state;
}

/** Sottoscrizione leggera per l'indicatore "semantic ready" nella UI. */
export function subscribeEmbedder(listener: (s: EmbedderState) => void): () => void {
  listeners.add(listener);
  listener(state);
  return () => listeners.delete(listener);
}

async function loadExtractor(): Promise<FeatureExtractor | null> {
  if (typeof window === 'undefined') return null;
  try {
    setState('loading');
    const { pipeline, env } = await import('@huggingface/transformers');
    // Solo CDN HuggingFace: niente lookup di modelli locali inesistenti.
    env.allowLocalModels = false;
    const extractor = (await pipeline('feature-extraction', EMBED_MODEL, {
      dtype: 'q8',
    })) as unknown as FeatureExtractor;
    setState('ready');
    return extractor;
  } catch (err) {
    console.warn('[embedder] load fallito, si prosegue in BM25-only:', err);
    setState('error');
    return null;
  }
}

/**
 * Pre-carica il modello (chiamata all'apertura del copilot, così il
 * primo messaggio dell'utente trova l'estrattore già caldo).
 */
export function warmupEmbedder(): void {
  if (!extractorPromise) extractorPromise = loadExtractor();
}

/**
 * Vettore 384-dim normalizzato della query, o null se il modello non è
 * (ancora) disponibile. Il chiamante manda null e il server degrada a
 * BM25-only: la chat non si blocca mai sull'embedding.
 */
export async function embedQuery(text: string): Promise<number[] | null> {
  if (!extractorPromise) extractorPromise = loadExtractor();
  const extractor = await extractorPromise;
  if (!extractor) return null;
  try {
    const out = await extractor(`query: ${text.trim()}`, {
      pooling: 'mean',
      normalize: true,
    });
    // Arrotondiamo come nell'indice: payload più piccolo, cosine invariata.
    return Array.from(out.data, (v) => Math.round(v * 1e5) / 1e5);
  } catch (err) {
    console.warn('[embedder] embed fallito per questa query:', err);
    return null;
  }
}

```

# src\lib\rag\providers.ts

```ts
import { createGroq } from '@ai-sdk/groq';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import type { LanguageModel } from 'ai';

/**
 * Strategia provider (verificata giugno 2026):
 *
 * 1. Groq free tier — primario. `llama-3.3-70b-versatile` per le
 *    risposte (~30 RPM / ~1.000 req/giorno), `llama-3.1-8b-instant`
 *    per il router (fino a ~14.400 req/giorno, latenza ~100 ms su LPU).
 * 2. Gemini — solo fallback opzionale dietro env var: i ToS del free
 *    tier Google escludono il serving di utenti EU/EEA/UK/CH in
 *    produzione, quindi non può essere il default per un sito .it.
 *
 * Con il solo GROQ_API_KEY il sistema è completo e a costo zero.
 */

export interface Providers {
  /** Modello principale per la generazione delle risposte. */
  chat: LanguageModel;
  /** Modello piccolo e velocissimo per il routing/rewrite. */
  router: LanguageModel;
  name: 'groq' | 'google';
}

export function getProviders(): Providers | null {
  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey) {
    const groq = createGroq({ apiKey: groqKey });
    return {
      chat: groq(process.env.RAG_CHAT_MODEL ?? 'llama-3.3-70b-versatile'),
      router: groq(process.env.RAG_ROUTER_MODEL ?? 'llama-3.1-8b-instant'),
      name: 'groq',
    };
  }

  const googleKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (googleKey) {
    const google = createGoogleGenerativeAI({ apiKey: googleKey });
    const model = google(process.env.RAG_CHAT_MODEL ?? 'gemini-2.5-flash');
    return { chat: model, router: model, name: 'google' };
  }

  return null;
}

```

# src\lib\rag\retriever.ts

```ts
import { Bm25Index } from './bm25';

/**
 * Retrieval ibrido a livello di CHUNK (il vecchio stack deduplicava per
 * id di documento, collassando chunk distinti dello stesso doc):
 *
 *   BM25 (sempre) ─┐
 *                  ├─ RRF (k=60) ─ cap di diversità per documento ─ top-K
 *   cosine (se c'è ├
 *   il query vector)┘
 *
 * Il query vector arriva dal browser (Transformers.js, multilingual-e5-
 * small): nessuna API di embedding lato server, nessun rate limit.
 * Se manca, si lavora in BM25-only: degradazione progressiva, mai errore.
 */

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
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

export class HybridRetriever {
  private bm25: Bm25Index;
  private byId: Map<string, RagChunk>;
  private cache = new Map<string, RetrievedChunk[]>(); // LRU exact-match
  readonly hasVectors: boolean;

  constructor(private readonly chunks: RagChunk[]) {
    // Titolo e tag entrano nel testo indicizzato: il lessico delle
    // domande ("LACAM", "hackathon") spesso vive lì.
    this.bm25 = new Bm25Index(
      chunks.map((c) => ({
        id: c.id,
        text: `${c.title} ${c.tags.join(' ')} ${c.text}`,
      })),
    );
    this.byId = new Map(chunks.map((c) => [c.id, c]));
    this.hasVectors = chunks.some((c) => Array.isArray(c.vec) && c.vec.length > 0);
  }

  retrieve(query: string, queryVector: number[] | null, topK = 4): RetrievedChunk[] {
    const cacheKey = `${query.trim().toLowerCase()}|${queryVector ? 'v' : 't'}|${topK}`;
    const cached = this.cache.get(cacheKey);
    if (cached) {
      // LRU touch
      this.cache.delete(cacheKey);
      this.cache.set(cacheKey, cached);
      return cached;
    }

    // ── Gamba lessicale ──
    const lexical = this.bm25.search(query, 12);
    const lexRank = new Map<string, number>();
    lexical.forEach((r, i) => lexRank.set(r.id, i + 1));

    // ── Gamba semantica (solo se il client ha mandato il vettore
    //    e l'indice è stato generato con le embeddings) ──
    const vecRank = new Map<string, number>();
    if (queryVector && this.hasVectors) {
      const scored = this.chunks
        .filter((c) => c.vec && c.vec.length > 0)
        .map((c) => ({ id: c.id, score: cosine(queryVector, c.vec!) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 12);
      scored.forEach((r, i) => vecRank.set(r.id, i + 1));
    }

    // ── Fusione RRF a livello di chunk ──
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
    fused.sort((a, b) => b.score - a.score);

    // ── Diversità: max 2 chunk per documento nel contesto finale ──
    const perDoc = new Map<string, number>();
    const result: RetrievedChunk[] = [];
    for (const { id, score } of fused) {
      const chunk = this.byId.get(id);
      if (!chunk) continue;
      const used = perDoc.get(chunk.docId) ?? 0;
      if (used >= MAX_PER_DOC) continue;
      perDoc.set(chunk.docId, used + 1);
      result.push({ ...chunk, score });
      if (result.length >= topK) break;
    }

    this.cache.set(cacheKey, result);
    if (this.cache.size > 64) {
      const oldest = this.cache.keys().next().value;
      if (oldest !== undefined) this.cache.delete(oldest);
    }
    return result;
  }
}

// ── Singleton per istanza serverless ──
let retriever: HybridRetriever | null = null;

export async function getRetriever(): Promise<HybridRetriever> {
  if (retriever) return retriever;
  // Import statico del JSON: Next lo bundla, niente fs a runtime
  // (stesso accorgimento del vecchio vectorStore, mantenuto).
  const index = (await import('@/data/rag-index.json')) as unknown as {
    default?: RagIndexFile;
  } & RagIndexFile;
  const data = (index.default ?? index) as RagIndexFile;
  retriever = new HybridRetriever(data.chunks);
  return retriever;
}

```

# src\services\brevo.ts

```ts
/**
 * Service for Brevo API integration
 */

export interface EmailContact {
  email: string;
  name?: string;
}

export interface SendEmailParams {
  to: EmailContact[];
  subject: string;
  htmlContent: string;
  sender?: EmailContact;
  replyTo?: EmailContact;
  params?: Record<string, unknown>;
}

interface BrevoApiResponse {
  messageId?: string;
  code?: string;
  message?: string;
  [key: string]: unknown;
}

/**
 * Send a transactional email using Brevo API
 */
export async function sendEmail({
  to,
  subject,
  htmlContent,
  sender = {
    name: 'Portfolio Contact Form',
    email: 'noreply@brevo.com'
  },
  replyTo,
  params
}: SendEmailParams): Promise<BrevoApiResponse> {
  const apiKey = process.env.BREVO_API_KEY;
  
  if (!apiKey) {
    console.error('API key Brevo non trovata nei file .env');
    throw new Error('API key Brevo mancante');
  }
  
  const data = {
    sender,
    to,
    subject,
    htmlContent,
    replyTo,
    params
  };
  
  console.log('Invio email tramite Brevo API:', {
    sender,
    to,
    subject,
    replyTo
  });

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    const responseData = await response.json() as BrevoApiResponse;
    console.log('Risposta da Brevo API:', responseData);
    
    if (!response.ok) {
      console.error('Errore da Brevo API:', responseData);
      throw new Error(responseData.message || 'Errore durante l\'invio dell\'email');
    }
    
    return responseData;
  } catch (error) {
    console.error('Errore durante l\'invio dell\'email con Brevo:', error);
    throw error;
  }
} 
```

# src\store\useAppStore.ts

```ts
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
  /** Naviga la pagina (e quindi la scena) verso una sezione. */
  flyToSection: (section: SectionId | string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  copilotOpen: false,
  setCopilotOpen: (open) => set({ copilotOpen: open }),
  flyToSection: (section) => {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(
      new CustomEvent('navigate-section', { detail: { section } }),
    );
  },
}));

```

# src\styles\breakpoints.css

```css
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
```

# src\types\env.d.ts

```ts
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    BREVO_API_KEY: string;
    GROQ_API_KEY: string;
    GOOGLE_GENERATIVE_AI_API_KEY: string;
    RAG_CHAT_MODEL: string;
    RAG_ROUTER_MODEL: string;
  }
} 
```

# TECH_SPEC.md

```md
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

\`\`\`
Browser ──(testo + query-vector*)──▶ /api/chat (Node)
   │                                   ├─ Router agent (Groq 8B, ~150ms, timeout 1.2s, in parallelo)
   │  *embedding calcolata             │    └─ intent: smalltalk | portfolio | navigate + query standalone
   │   client-side con                 ├─ Retrieval ibrido in parallelo
   │   multilingual-e5-small           │    ├─ BM25 Okapi (implementato in TS, stoplist IT/EN, ~0ms)
   │   (Transformers.js, lazy,         │    └─ Cosine sui vettori precomputati a build time
   │   ~30MB quantizzato, cache        │         (stesso modello e5, prefissi query:/passage:)
   │   del browser)                    ├─ Fusione RRF (k=60) + cap di diversità per documento
   │                                   ├─ streamText (Groq Llama-3.3-70B; fallback Gemini 2.5 Flash)
   ◀──(UIMessage stream + data-sources + tool parts)──┘    tools: navigate / showProject / showSkills
\`\`\`

Scelte e perché:

- **Embeddings senza API:** `Xenova/multilingual-e5-small` (384-dim, forte sull'italiano) gira via Transformers.js sia nello script di ingest (build time, vettori scritti in `rag-index.json`) sia **nel browser** del visitatore (lazy, solo all'apertura della chat, cache HTTP del browser). Zero costi, zero rate limit, zero latenza server, e nessun dato del visitatore inviato a terzi per l'embedding. Se il modello client non è ancora pronto → il server lavora in BM25-only, che su questo corpus copre già la maggior parte delle query: degradazione progressiva, mai rottura.
- **Generazione: Groq free tier** (verificato a giugno 2026: `llama-3.3-70b-versatile` ~30 RPM/1.000 req/giorno; `llama-3.1-8b-instant` fino a ~14.400 req/giorno — perfetto per il router). Endpoint OpenAI-compatibile, latenze da LPU (centinaia di token/s): l'esperienza percepita è "istantanea".
- **Nota EU importante:** il free tier dell'API Gemini, da ToS, non è utilizzabile per servire utenti in EU/EEA/UK/CH in produzione. Per questo Gemini è solo **fallback opzionale** dietro env var, e le embeddings runtime non dipendono da Google. Con il solo `GROQ_API_KEY` il sistema è completo e conforme.
- **BM25 vero**, Okapi (k1=1.5, b=0.75), tokenizzazione accent-fold + stoplist IT/EN, ~80 righe senza dipendenze. L'indice si costruisce a cold start in <1 ms (corpus piccolo).
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

\`\`\`
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
\`\`\`

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

```

# tsconfig.json

```json
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

```

# vercel.json

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install"
}
```

