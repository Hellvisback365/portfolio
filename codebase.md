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
import projectsModule from '../src/data/projects.ts';
const { projects } = projectsModule as any;

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

/** Trasforma un progetto del sito (src/data/projects.ts) in un documento
 *  RAG citabile: il corpo include sia il nome dell'evento sia quello del
 *  prodotto, così il retrieval risponde a entrambi (es. "Next Pulse" o
 *  "EnLexi", "PugliaHack" o "TerraNode"). */
function projectToDocument(p: (typeof projects)[number]): ProfileDocument {
  const metrics = p.metrics
    .map((m) => `${m.label}: ${m.value} (${m.caption})`)
    .join('; ');
  const links = p.links?.length
    ? ` Link: ${p.links.map((l) => `${l.label} ${l.href}`).join(', ')}.`
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

async function main() {
  const docsPath = join(rootDir, 'src', 'content', 'profile', 'documents.json');
  const profileDocs = JSON.parse(readFileSync(docsPath, 'utf-8')) as ProfileDocument[];
  if (!profileDocs.length) throw new Error('Nessun documento in documents.json');

  // I progetti del sito diventano documenti RAG: una sola fonte di verità
  // (projects.ts), nessuna duplicazione manuale, nessun disallineamento tra
  // ciò che il sito mostra e ciò che il copilot sa raccontare.
  const projectDocs = projects.map(projectToDocument);
  const documents = [...profileDocs, ...projectDocs];
  console.log(
    `[ingest] ${profileDocs.length} doc. di profilo + ${projectDocs.length} progetti = ${documents.length} documenti.`,
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
- Non scrivere MAI le chiamate ai tool come testo (per esempio tag tipo <function=...>): usa esclusivamente il meccanismo nativo di tool calling.

CONTATTI PUBBLICI (puoi condividerli liberamente)
- Email: vitopiccolini@live.it
- LinkedIn: https://www.linkedin.com/in/vito-p-9120028a/
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

function sanitizeText(t: string): string {
  // Llama su Groq a volte emette la tool call come testo invece di eseguirla
  // (es. <function=showProject>{...}</function>). La rimuoviamo dalla bolla:
  // l'esecuzione vera passa dal canale di tool calling, questo è solo testo.
  return t
    .replace(/<function=[^>]*>[\s\S]*?<\/function>/gi, '')
    .replace(/<\|python_tag\|>/gi, '')
    .replace(/<\/?function[^>]*>/gi, '')
    .trim();
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
  const inFlightRef = useRef(false);

  const transport = useMemo(
    () => new DefaultChatTransport({ api: '/api/chat' }),
    [],
  );
  const { messages, sendMessage, status, error } = useChat({ transport });
  const busy = status === 'submitted' || status === 'streaming';

  // Sottoscrizione permanente allo stato dell'embedder.
  useEffect(() => subscribeEmbedder(setEmbedderState), []);

  // Warmup in background appena la pagina è idle (non all'apertura del
  // pannello): così il modello è quasi sempre già caldo quando l'utente
  // scrive, e la prima risposta è già ibrida invece che solo-BM25.
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

  // Focus sulla textarea quando il pannello si apre.
  useEffect(() => {
    if (copilotOpen) textareaRef.current?.focus();
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
    (raw?: string) => {
      const text = (raw ?? input).trim();
      // Lock sincrono: il guard `busy` diventa true solo DOPO sendMessage,
      // quindi durante il calcolo dell'embedding non protegge da un doppio
      // invio. Questo ref si imposta subito e rende submit idempotente.
      if (!text || busy || inFlightRef.current) return;
      inFlightRef.current = true;
      setInput('');
      // Non blocchiamo l'invio sull'embedding: se il modello è già caldo
      // alleghiamo il vettore (attesa breve e limitata), altrimenti partiamo
      // subito in BM25-only. Niente freeze in attesa del download del modello.
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
      case 'text': {
        const clean = sanitizeText(part.text as string);
        if (!clean) return null;
        return (
          <p key={key} className="whitespace-pre-wrap leading-relaxed">
            {clean}
          </p>
        );
      }
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
                  <div className="flex flex-col lg:w-2/5">
                    <div className="relative flex-1 min-h-[16rem] overflow-hidden rounded-xl border border-white/8 bg-[#05060d]">
                      {/* Blurred background */}
                      <Image
                        src={project.image}
                        alt={`${project.title} blur`}
                        fill
                        className="object-cover blur-2xl opacity-40 scale-110"
                      />
                      {/* Foreground image */}
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-contain p-4 relative z-10 drop-shadow-2xl transition-transform duration-500 hover:scale-105"
                      />
                      <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-[#05060d]/60 via-transparent to-transparent" />
                    </div>
                    <div className="mt-4 flex flex-wrap gap-1.5">
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
        <div className="relative h-64 sm:h-80 overflow-hidden rounded-t-3xl border-b border-white/10 bg-[#05060d]">
          {/* Blurred Background */}
          <Image 
            src={project.image}
            alt="Background blur"
            fill
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
    image: '/next-pulse-polaroid.jpg',
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
    image: '/pugliahack-2026.png',
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
    image: '/leonardo-hackathon.jpg',
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
{"model":"Xenova/multilingual-e5-small","dim":384,"createdAt":"2026-06-14T12:11:41.150Z","chunks":[{"id":"bio-vision#0","docId":"bio-vision","title":"Profilo professionale","category":"bio","tags":["ai","machine-learning","langgraph","resilience"],"text":"Laureato in Informatica appassionato di IA e Machine Learning, con background lavorativo poliedrico. Sono Vito Piccolini. Prima di laurearmi in Informatica ho lavorato anni tra cantieri, fabbrica, hotel, steward, scegliendo poi consapevolmente di cambiare strada. Mi sono laureato in Informatica (107/110) con una tesi sull'orchestrazione di agenti LLM applicata ai sistemi di raccomandazione.","vec":[0.02523,-0.02668,-0.07794,-0.06213,0.0404,-0.0418,0.01091,0.06635,0.06721,0.03059,0.04485,-0.01292,0.06103,-0.01073,0.01261,0.07253,0.10774,-0.05548,-0.09541,-0.0273,0.03305,0.0214,-0.07036,0.04993,0.06407,0.01346,-0.04328,0.01176,0.01772,-0.05043,-0.03391,-0.04834,0.02941,-0.05236,0.03269,0.01946,-0.00412,-0.10867,0.00733,-0.07208,-0.04631,0.00705,0.05263,0.03431,0.01944,0.06174,-0.0233,0.01241,-0.02904,-0.01827,-0.02414,0.08666,0.0713,0.028,0.04998,-0.04384,-0.07333,-0.02616,-0.06475,0.02561,0.05174,-0.03101,0.02978,0.05298,0.05416,0.04539,0.02287,0.06571,-0.11958,-0.08605,-0.07404,0.04218,0.01417,-0.07836,0.04441,0.03212,0.04664,-0.05529,0.01897,-0.06663,-0.06137,-0.05347,-0.02511,0.10863,-0.03733,0.01953,0.0432,-0.11277,0.0641,-0.01781,0.05823,0.08532,-0.06722,-0.05968,-0.07808,-0.02755,-0.04108,0.07887,0.04886,-0.02513,0.02649,-0.04094,0.04959,-0.0712,-0.02172,0.02281,0.0564,-0.06043,0.04925,-0.08419,-0.03131,0.06569,0.04146,0.04142,-0.10152,-0.00294,-0.0366,-0.02728,0.08175,-0.06593,0.06033,-0.04856,-0.05914,-0.05869,-0.0158,-0.04338,-0.01845,0.09084,0.0736,0.03698,0.02389,0.07668,0.00776,0.04369,0.05046,0.04796,-0.02722,0.01174,-0.05011,-0.02952,-0.04504,0.04432,-0.0567,0.00885,0.02925,0.04916,0.05209,-0.03335,0.08689,-0.08204,0.03627,-0.02319,0.02521,0.0614,0.05509,-0.01606,-0.06838,-0.0862,0.06873,0.08401,-0.05525,-0.05615,-0.03158,0.00516,-0.02654,-0.05101,0.00747,0.07701,-0.04697,-0.00534,-0.00856,0.03686,-0.04686,0.10755,-0.00625,0.02529,-0.08215,0.02017,0.10205,0.03393,-0.06231,-0.00771,-0.08545,-0.06433,-0.05766,-0.08628,-0.03928,0.02667,0.01668,-0.06068,0.01989,0.04922,-0.02839,-0.0815,-0.02601,0.04635,-0.05601,0.04559,0.0568,0.04532,-0.01244,-0.03445,0.039,0.05489,0.06734,0.03909,-0.05595,0.00947,-0.03864,0.04968,0.06383,-0.06477,-0.02552,0.04818,0.00107,0.00635,0.01382,0.06297,-0.05905,0.01405,0.05808,-0.04113,0.04453,-0.01862,-0.01329,0.03952,0.04934,-0.06825,-0.06693,0.01909,-0.07589,-0.03303,-0.07086,-0.10565,-0.041,-0.05112,0.03279,0.05539,0.01474,-0.06145,-0.04347,-0.04086,-0.0156,0.00267,0.08016,-0.03151,-0.04571,0.04936,-0.02069,0.05462,0.08727,-0.08494,0.001,-0.01702,-0.03335,0.04215,0.0519,0.03147,-0.06486,0.0156,-0.00258,-0.01104,0.05606,0.03607,0.04276,0.01552,-0.09545,0.00049,-0.02131,-0.07288,-0.00972,-0.00566,-0.0078,-0.03337,-0.06008,-0.04857,0.03763,0.05998,-0.02875,-0.07093,0.07086,0.04387,0.03549,0.08836,0.02822,-0.05746,-0.03694,0.08559,-0.00247,-0.0168,-0.00881,-0.03857,0.03585,-0.03185,0.09539,0.04202,-0.01723,0.08891,-0.06318,0.06359,0.02896,-0.02394,0.03598,0.00651,-0.07626,0.04839,-0.00414,0.00523,0.03732,0.03641,0.04048,0.04519,-0.03012,0.00409,0.02226,0.04106,-0.01921,0.04296,-0.07829,-0.04383,-0.05107,-0.06814,-0.0647,-0.07161,0.03951,0.09278,-0.09863,0.00634,0.04761,0.0168,0.0204,-0.01762,-0.04769,0.05862,-0.05776,-0.02528,0.00205,0.05191,-0.0296,-0.03169,0.02531,0.05878,-0.0464,0.0331,-0.0142,-0.09089,0.05372,-0.02366,-0.07717,0.02705,0.02424,-0.09518,0.03008,0.03708,-0.05344,0.04024,-0.04751,0.03531,0.05044,0.01594,-0.03228,-0.1021,-0.00313,0.05783,0.02617,0.01124,-0.00951,-0.01917,0.05183,-0.00257,0.0731,0.06497,-0.01905,-0.01269,-0.02741,-0.06212,-0.03786,-0.00351,-0.05217,-0.0635,0.10538,0.01797,0.06397,0.05517]},{"id":"bio-vision#1","docId":"bio-vision","title":"Profilo professionale","category":"bio","tags":["ai","machine-learning","langgraph","resilience"],"text":"Ho lavorato con Python, LangGraph e architetture multi-agente, portando risultati misurabili in ambiente di ricerca e includendo sistemi RAG ibridi. Mi sono classificato secondo in un'hackathon nazionale organizzata da Talent Garden e Leonardo. Il mio obiettivo è crescere nel campo dell'AI/ML, ma sono flessibile e aperto a tutte le opportunità.","vec":[0.04141,-0.01196,-0.07096,-0.04083,0.07647,-0.08523,0.02497,0.05146,0.03283,0.0045,0.04037,0.02563,0.10079,-0.00207,-0.01597,0.06709,0.07802,-0.04868,-0.07643,-0.07197,0.0272,0.04205,-0.04817,0.04568,0.06197,0.04575,-0.00964,0.0082,0.00611,-0.03511,-0.01809,-0.04333,0.06898,-0.01686,0.07611,0.01684,-0.04406,-0.06986,0.00079,-0.07663,-0.00077,0.01658,0.05805,0.03133,0.02791,0.04288,-0.05194,0.06108,-0.05529,0.01594,-0.03812,0.03937,0.04504,0.06111,0.06445,-0.02886,-0.06352,-0.09291,-0.05775,0.01816,0.03257,-0.05539,0.02922,0.03558,0.05337,0.06595,0.0555,0.05764,-0.09161,-0.09401,-0.06738,0.06587,-0.00295,-0.07575,0.00635,0.0353,0.04172,-0.07081,0.04935,-0.05086,-0.10221,-0.03922,-0.04987,0.02831,-0.04307,0.02381,0.07935,-0.0752,0.06413,-0.06585,0.07145,0.00777,-0.01966,-0.01972,-0.07507,-0.09536,-0.02953,0.08737,0.04313,-0.03496,0.04347,-0.02973,0.01941,-0.05517,-0.05274,0.03007,0.04173,-0.06501,0.01854,-0.05472,-0.01708,0.05962,0.05104,0.04309,-0.07699,-0.04433,-0.02004,-0.07435,0.05615,-0.04317,0.0759,-0.04116,-0.07042,-0.09015,-0.09231,0.00669,0.01278,0.07286,0.06571,0.03421,0.00438,0.05753,0.0208,0.05235,0.07051,0.09172,-0.02949,0.0137,-0.01384,-0.05494,-0.03373,0.06804,-0.05975,0.00517,0.05453,0.04923,0.08106,-0.03938,0.04317,-0.04166,0.0146,-0.02289,0.03854,0.00547,0.03756,0.00207,-0.0481,-0.03424,0.04604,0.06834,-0.05366,-0.05841,-0.03604,-0.02897,-0.04583,-0.0653,0.01396,0.02312,-0.03479,-0.03047,-0.04782,0.10714,-0.05313,0.07747,-0.00536,0.03594,-0.09997,0.0324,0.08433,0.03711,-0.06252,-0.03551,-0.10639,-0.05561,-0.06244,-0.0544,-0.08511,0.01124,0.00961,-0.05377,0.02621,0.05152,-0.06047,-0.09994,-0.03445,0.0732,-0.01406,0.01458,0.05284,0.06316,0.00731,-0.06093,0.02112,0.01675,0.05064,0.03104,-0.07768,0.0111,-0.03743,0.00959,0.03045,-0.05462,-0.03333,0.07178,0.00877,-0.01518,-0.01146,0.08422,-0.04588,0.00737,0.09505,-0.03171,0.03886,-0.02644,-0.02043,0.0439,0.04598,-0.08161,-0.04142,0.03925,-0.08324,-0.02182,-0.06496,-0.09654,-0.008,-0.07117,0.01787,0.03716,0.04186,-0.02586,-0.04886,-0.03827,-0.01352,-0.01907,0.03667,-0.07508,-0.02889,0.01068,-0.03937,0.05584,0.09875,-0.11369,-0.0273,-0.0259,-0.00744,0.04064,0.06417,0.04133,-0.05727,0.03095,0.01206,-0.03486,0.03558,0.03609,0.04531,0.01225,-0.04565,-0.00252,-0.05183,-0.01505,-0.02306,0.00217,0.02498,-0.0124,0.00467,-0.05205,0.03799,0.09988,-0.03347,-0.04062,0.0664,0.05557,0.0407,0.07463,0.08984,-0.01815,-0.0193,0.06991,-0.00739,-0.02035,-0.04552,-0.04496,0.05214,-0.03297,0.08216,0.0422,-0.01441,0.04155,-0.04705,0.06846,0.02577,-0.00988,0.01448,0.01537,-0.0234,0.04334,0.03436,0.00339,0.06331,0.02946,0.05767,0.03763,-0.08312,-0.02101,0.03102,0.01306,0.00005,0.00685,-0.09256,-0.06263,-0.04991,-0.08438,-0.02458,-0.06569,0.01421,0.07524,-0.06071,-0.03797,0.04474,0.00958,0.04593,-0.01506,-0.05081,0.04738,-0.06635,-0.02937,-0.03873,0.09791,-0.04503,0.03564,0.09095,0.04502,-0.06583,0.07658,-0.0575,-0.08082,0.04799,-0.02807,-0.04043,-0.00026,0.03897,-0.07146,0.03853,0.05744,-0.03797,0.04741,-0.066,0.02958,0.02284,0.05249,-0.03659,-0.08466,0.03418,0.05714,0.03469,0.01923,-0.01394,-0.04632,0.00483,0.01319,0.0706,0.06237,-0.01643,-0.08146,-0.04294,-0.01281,-0.0597,-0.0127,-0.02674,-0.07435,0.05758,0.02645,0.07981,0.05236]},{"id":"experience-lacam#0","docId":"experience-lacam","title":"Tirocinio curriculare LACAM-SWAP","category":"experience","tags":["research","langgraph","multi-agent","rag","faiss","bm25"],"text":"Progetto di tesi: Orchestrazione di Agenti LLM per l'Ottimizzazione Multi-Metrica nei Sistemi di Raccomandazione. Da marzo a giugno 2025 ho progettato e implementato un sistema di raccomandazione multi-metrica basato su LLM e architetture ad agenti, nell'ambito della tesi triennale. L'architettura, orchestrata con LangGraph, coordina agenti specializzati su precisione e copertura del catalogo attraverso un agente aggregatore. Il sistema include un RAG ibrido (BM25 + FAISS).","vec":[0.02497,0.00259,-0.06362,-0.07456,0.08998,-0.05741,0.067,0.06351,0.02881,-0.00044,0.08793,0.00432,0.07716,-0.0086,0.00216,0.06556,0.09941,-0.05727,-0.05935,-0.0774,0.01144,0.01713,-0.0651,0.01107,0.07652,0.04148,-0.02623,0.0302,0.05027,-0.00001,-0.02258,-0.06054,0.07675,-0.03001,0.03368,0.03232,0.00079,-0.06069,0.03147,-0.06996,0.01092,0.03365,0.05029,0.06488,0.03493,0.06239,-0.04342,0.04752,-0.02711,-0.04687,-0.04246,0.0579,0.07385,0.04308,0.05795,-0.06089,-0.04607,-0.09526,-0.04427,0.00824,0.05729,-0.02738,0.00779,0.03976,0.08925,0.09236,0.02498,0.05209,-0.08869,-0.11222,-0.06613,0.04446,-0.01971,-0.08039,-0.00162,0.02421,0.08354,-0.07784,0.01893,-0.02074,-0.05422,-0.0244,-0.03404,0.05444,-0.0295,0.04869,0.06983,-0.08806,0.00317,-0.03287,0.02559,0.05729,-0.05013,-0.06656,-0.04587,-0.07588,-0.02857,0.07812,0.07407,-0.05787,0.01277,-0.06867,0.00643,-0.09519,-0.04321,-0.0051,0.02983,-0.07447,0.0641,-0.03855,-0.03409,0.05311,0.05613,0.02698,-0.02587,-0.08289,-0.04527,-0.02138,0.05159,-0.05364,0.05438,-0.04895,-0.07465,-0.07318,-0.01971,-0.00324,0.0102,0.05293,0.03093,0.02705,-0.00341,0.02446,0.02866,0.08504,0.07297,0.08285,-0.05989,0.00999,-0.0334,-0.02624,-0.06099,0.04633,-0.10189,0.01934,0.04751,0.05235,0.09854,-0.04187,0.05419,-0.0431,0.0385,-0.00032,0.066,0.0536,0.03103,-0.02609,-0.06772,-0.06343,0.0685,0.05773,-0.05992,-0.04469,-0.07277,-0.05479,-0.02326,-0.02083,0.01454,0.05739,-0.02275,-0.02576,-0.06719,0.09867,-0.00283,0.08062,0.01598,0.04328,-0.06967,0.03356,0.09145,0.05443,-0.04989,-0.01815,-0.08536,-0.06983,-0.07903,-0.06077,-0.05247,0.0132,0.0048,-0.05982,0.02081,0.04418,-0.06454,-0.05867,-0.01102,0.06489,-0.03232,0.02328,0.04558,0.04651,0.01677,-0.05772,-0.01981,0.04908,0.03159,0.05707,-0.07062,0.01176,-0.03064,0.01259,0.01672,-0.03979,-0.01954,0.03038,-0.00518,-0.03105,-0.00214,0.05463,-0.0291,0.01389,0.06909,-0.03581,0.05807,-0.04815,-0.00489,0.03467,0.05809,-0.07835,-0.05275,0.02376,-0.02652,-0.03972,-0.08944,-0.05258,-0.01248,-0.06365,0.02524,0.07861,0.00216,-0.03353,-0.08685,-0.0124,-0.01989,-0.03485,0.03971,-0.05874,-0.03865,0.03021,-0.05328,0.09591,0.05503,-0.04646,-0.04126,-0.023,-0.00766,0.03383,0.07082,0.02029,-0.04779,0.03484,0.05438,-0.03238,0.06711,0.00917,0.06126,0.01527,-0.08619,-0.01628,-0.03459,-0.0525,0.02458,0.03592,0.01539,-0.02039,-0.05054,-0.07204,-0.01071,0.0919,-0.03599,-0.06819,0.06466,0.06087,0.04523,0.04846,0.04936,0.00028,-0.00405,0.0813,-0.02281,-0.0477,-0.01697,-0.03192,0.08932,-0.02687,0.10622,0.0575,0.00096,0.04262,-0.07034,0.01494,-0.01024,-0.0114,0.01359,0.02637,-0.06443,0.04689,0.0083,-0.00186,0.04813,0.04875,0.0705,0.01045,-0.06836,0.00253,0.02852,0.05221,0.03143,0.05622,-0.08805,-0.05177,-0.06553,-0.06925,-0.03005,-0.06013,0.08056,0.04823,-0.07111,-0.04768,0.03569,-0.04192,0.04366,-0.01318,-0.05476,0.03689,-0.05147,-0.07604,0.00192,0.06058,-0.04819,-0.01269,0.0623,0.01215,-0.09593,0.07615,-0.02315,-0.0565,0.03671,-0.01756,-0.0346,-0.01389,0.02997,-0.12287,0.06279,0.06424,-0.05958,0.05407,-0.0817,-0.00755,0.06769,0.0515,-0.033,-0.05533,0.02149,0.03634,0.06308,-0.00481,-0.02397,-0.02783,-0.02257,-0.01757,0.06147,0.01559,-0.05226,-0.00707,-0.0013,-0.04663,-0.03134,0.03664,-0.02987,-0.06839,0.03852,0.02084,0.01954,0.07464]},{"id":"experience-lacam#1","docId":"experience-lacam","title":"Tirocinio curriculare LACAM-SWAP","category":"experience","tags":["research","langgraph","multi-agent","rag","faiss","bm25"],"text":"Testato su MovieLens 1M con Llama 3.2 3B Instruct: l'agente aggregatore ha mantenuto la precisione del baseline (∆ = -0.5%) migliorando la novelty del 12%.","vec":[0.04842,-0.01309,-0.06944,-0.07204,0.04845,-0.03286,0.05063,0.06175,0.06218,0.00213,0.06444,0.03085,0.07495,0.00711,0.01147,0.05823,0.07827,-0.02562,-0.10941,-0.04272,0.00074,-0.02408,-0.04366,-0.00192,0.06359,0.01753,0.00142,0.04858,0.05186,-0.03092,0.0123,-0.04672,0.07672,-0.05172,-0.00082,0.03051,-0.03403,-0.04011,0.04988,-0.071,0.01834,0.03292,0.04314,0.06065,0.04132,0.06275,-0.02511,0.07312,-0.022,-0.03801,0.00822,0.06066,0.0687,0.04207,0.06528,-0.06461,-0.04317,-0.09857,-0.01973,0.00897,0.08315,-0.04114,0.00597,0.05802,0.098,0.12348,0.0211,0.067,-0.10136,-0.05506,-0.08625,0.06245,0.01351,-0.11238,0.01483,-0.0021,0.044,-0.06487,0.00587,-0.02144,-0.02116,-0.04147,-0.00957,0.02258,-0.02884,0.0328,0.02957,-0.09101,0.04183,-0.05192,0.00712,0.07504,-0.05927,-0.05636,-0.0651,-0.04849,0.00025,0.06066,0.02719,-0.04058,0,-0.05484,0.03733,-0.07876,0.00349,0.0335,0.06034,-0.03517,0.05617,-0.05023,-0.03702,0.02333,0.05575,0.02996,-0.03348,-0.08631,-0.00259,-0.03566,0.05558,-0.06371,0.06143,-0.01653,-0.05582,-0.07659,-0.02197,0.02501,0.02013,0.04453,0.02383,0.00672,0.02466,0.03103,-0.02836,0.07475,0.06566,0.05869,-0.04172,0.01896,-0.02589,-0.04626,-0.07544,0.03904,-0.05479,0.01793,0.05752,0.02959,0.09116,-0.0341,0.03414,-0.04692,0.033,-0.03183,0.04007,0.04468,0.04625,-0.03784,-0.08152,-0.05289,0.04195,0.04825,-0.06189,-0.06427,-0.03909,-0.08308,-0.02886,-0.05093,0.02009,0.06578,-0.04168,-0.01679,-0.04679,0.07887,0.02175,0.05992,-0.00192,0.06814,-0.03878,0.04865,0.07391,0.02433,-0.02857,-0.05476,-0.05026,-0.03596,-0.06875,-0.07414,-0.05032,0.01436,-0.02037,-0.01085,-0.01511,-0.00263,-0.02514,-0.09513,-0.04241,0.00783,-0.01981,0.02273,0.06821,0.03774,-0.00902,-0.04959,-0.0091,0.02602,0.04385,0.06673,-0.09565,0.02208,-0.01491,0.03991,0.05021,-0.06245,-0.05397,0.03782,-0.02138,-0.01981,-0.00748,0.04157,-0.0402,0.04001,0.06932,-0.02822,0.05965,-0.07996,-0.02118,0.04506,0.0424,-0.06873,-0.06136,0.04905,-0.04026,-0.0564,-0.06939,-0.08688,-0.01752,-0.05511,0.02573,0.03068,-0.00575,-0.06381,-0.07817,-0.03449,0.01272,-0.00074,0.02263,-0.03239,-0.01571,0.04622,-0.0282,0.10053,0.0554,-0.08161,-0.00046,-0.0234,-0.01585,0.0213,0.04928,0.01444,-0.01342,0.04642,0.05965,-0.04994,0.05329,0.04808,0.05222,0.02974,-0.10162,-0.0278,-0.06517,-0.06791,-0.02326,0.01081,0.01892,-0.02319,-0.07524,-0.02967,0.00203,0.12894,-0.09131,-0.0651,0.06097,0.03091,0.04526,0.08145,0.09188,-0.02049,-0.02358,0.0688,-0.00766,-0.03982,-0.05346,-0.03729,0.08299,-0.04039,0.12188,0.05481,0.01935,0.07361,-0.03497,0.00849,-0.00994,-0.00576,0.04102,0.062,-0.05035,0.03033,0.01341,-0.02591,0.0483,0.03657,0.07079,-0.015,-0.02686,-0.01117,0.03791,0.03356,0.01112,0.06421,-0.07655,-0.05199,-0.07846,-0.05581,-0.01073,-0.0472,0.03961,0.07698,-0.07145,-0.0486,0.0557,-0.03227,0.0206,-0.03352,-0.05988,0.0251,-0.04224,-0.0626,-0.0288,0.05533,-0.07192,0.00882,0.03039,0.01744,-0.1023,0.06135,-0.00611,-0.08969,0.04387,-0.0492,-0.01092,0.00104,0.02955,-0.13038,0.10115,0.05953,-0.07333,0.0428,-0.07766,-0.03859,0.05976,0.0744,-0.0577,-0.06512,0.03178,0.04721,0.08261,0.0312,-0.03119,-0.05038,-0.01398,-0.02756,0.07327,0.02882,-0.04923,-0.01607,0.00003,-0.03483,-0.02841,0.0413,-0.04056,-0.05041,0.02555,0.01921,0.08216,0.08383]},{"id":"experience-bfuture#0","docId":"experience-bfuture","title":"Hackathon B.Future Challenge 2025 – BOOM","category":"experience","tags":["challenge","n8n","gemini","backend"],"text":"Sviluppo di Zenith, assistente AI per digitalizzare e automatizzare il processo di consulenza aziendale. Da settembre a novembre 2025 ho partecipato alla B.Future Challenge in un team di 6 persone (Gruppo VAR Group). Abbiamo sviluppato Zenith, un assistente AI per consulenza enterprise. Mi sono occupato della pipeline backend: orchestrazione del workflow tramite n8n, integrazione con Google Gemini via API e archiviazione documenti su Google Drive.","vec":[0.00497,0.00744,-0.05703,-0.04851,0.07351,-0.05522,0.01686,0.02712,0.03061,0.01574,0.04973,0.01344,0.02253,-0.05429,-0.01791,0.01762,0.04403,-0.02228,-0.06749,-0.09513,0.02619,-0.00406,-0.07402,0.06387,0.04095,0.06677,-0.07054,0.00944,0.03659,-0.04734,-0.04944,-0.05058,0.08446,-0.07559,0.08296,0.00722,-0.03894,-0.04935,0.03506,-0.06543,-0.02481,0.03013,-0.01198,0.01377,0.04211,0.0816,-0.03066,0.02391,-0.04431,-0.00916,-0.03883,0.07595,0.04573,0.02654,0.04163,-0.0273,-0.0359,-0.08103,-0.03658,0.02649,0.04649,-0.02976,0.01571,0.03324,0.05456,0.08694,0.00033,0.06032,-0.06571,-0.05055,-0.03141,0.08271,0.03109,-0.07513,0.01332,0.03968,0.04322,-0.06274,0.05653,-0.0403,-0.11081,-0.0278,-0.01828,0.02942,-0.0879,0.03876,0.02862,-0.07069,0.06404,-0.0168,0.06453,0.0678,-0.06525,-0.03461,-0.05713,-0.04046,-0.07348,0.10457,0.08681,-0.00416,0.04033,-0.09363,0.00507,-0.09341,-0.02927,0.02932,-0.01284,-0.07463,0.07115,-0.05734,-0.06119,0.07789,0.0671,0.01567,-0.08662,-0.01151,-0.04032,-0.07174,0.02044,-0.05824,0.05836,-0.00287,-0.03482,-0.07103,-0.07629,-0.06047,-0.00767,0.10148,0.07949,0.01422,0.01541,0.05158,0.00718,0.04863,0.06656,0.10873,-0.07052,-0.00882,-0.01892,-0.07257,-0.03843,0.08698,-0.00718,0.0392,0.07218,0.02753,0.12962,-0.03557,0.06255,-0.05554,0.03737,-0.04965,0.07712,0.02277,0.05025,-0.01714,-0.0763,-0.00231,0.05555,0.05418,-0.07056,-0.06253,-0.0485,-0.01293,-0.0459,0.01234,0.00963,0.03972,-0.07216,-0.02901,-0.06877,0.1009,-0.05407,0.08994,0.01192,0.04289,-0.05599,0.04438,0.06526,0.02247,-0.01203,-0.00559,-0.07917,-0.05376,-0.05528,-0.01861,-0.03606,0.03121,-0.02858,-0.03803,0.0274,0.02445,-0.02344,-0.07026,-0.01772,0.07298,-0.05203,0.04097,0.07148,0.03632,0.0044,-0.03963,0.05485,0.01032,0.03702,-0.00653,-0.03569,0.04501,-0.10254,0.01497,0.02906,-0.04113,-0.05239,0.04779,-0.02291,-0.04151,-0.00337,0.05625,-0.01158,-0.0021,0.07127,-0.01699,0.03613,-0.07683,0.00842,0.03338,0.01245,-0.10545,-0.05831,0.04346,-0.06632,-0.02134,-0.06333,-0.06153,-0.01546,-0.06919,0.01169,0.03657,0.03685,-0.00034,-0.0546,-0.02819,0.04049,-0.02687,0.03983,-0.03555,-0.02455,0.024,-0.02932,0.05495,0.10053,-0.09418,-0.0912,-0.04752,-0.01513,0.04662,0.04708,0.04964,-0.0757,0.05677,0.04616,-0.03377,0.05283,0.04476,0.0466,0.01153,-0.04985,0.01102,-0.02446,0.01979,-0.0331,-0.03262,0.04572,-0.02078,-0.06117,-0.05618,0.01338,0.09415,-0.06028,-0.07968,0.09816,0.02864,0.02629,0.09464,0.05291,-0.0139,-0.01997,0.05602,-0.01202,-0.03305,-0.03667,-0.01456,0.04608,-0.00866,0.07272,0.01703,0.00839,0.0686,-0.0611,0.05682,0.01229,0.00661,-0.00297,0.0195,-0.08149,0.02465,0.00855,0.02039,0.02759,0.00155,0.06103,0.0519,-0.00662,-0.01167,0.03112,0.05562,-0.01198,0.01301,-0.08237,-0.0404,-0.0871,-0.07025,-0.01165,-0.04768,0.02769,0.08409,-0.06228,-0.00797,0.03753,0.03176,-0.01041,-0.07596,-0.09599,0.05366,-0.02943,-0.03427,0.00664,0.0844,-0.01287,-0.03101,0.04419,0.02884,-0.05948,0.05378,-0.00902,-0.04342,0.01603,-0.0186,-0.10508,-0.00057,0.06755,-0.10873,0.0342,0.01253,-0.04173,0.04048,-0.05808,-0.00587,0.01984,0.02752,-0.05581,-0.03241,0.07366,0.0002,0.02723,0.02121,0.02838,-0.04184,0.04338,-0.05934,0.04471,0.08749,-0.03356,-0.04362,0.00312,-0.05237,-0.02747,0.00963,-0.03822,-0.06456,0.08955,0.0473,0.09136,0.05554]},{"id":"experience-bfuture#1","docId":"experience-bfuture","title":"Hackathon B.Future Challenge 2025 – BOOM","category":"experience","tags":["challenge","n8n","gemini","backend"],"text":"Il prototipo ha stimato una riduzione dei tempi di produzione di un report da 7 giorni a 1.","vec":[-0.00917,-0.01435,-0.01255,-0.05566,0.06781,-0.05397,-0.02993,0.01068,0.07947,0.01113,0.06156,-0.00279,0.0653,-0.05677,-0.00969,0.04265,0.02448,-0.04415,-0.04666,-0.0922,0.05042,0.00775,-0.05625,0.03674,0.08388,0.05714,-0.04498,0.01068,0.05264,-0.09549,-0.03101,-0.06319,0.0535,-0.0209,0.05589,-0.01993,-0.02335,-0.06742,0.02905,-0.042,0.0048,0.03008,-0.03951,0.03834,0.03993,0.05675,-0.05362,0.05388,-0.02028,-0.04598,-0.01829,0.08217,0.0563,0.02865,0.03521,-0.00447,-0.00703,-0.08854,-0.06215,0.03716,0.06781,-0.01452,-0.01297,0.04944,0.10068,0.09333,0.00532,0.05792,-0.03418,-0.04615,-0.06769,0.03988,0.04032,-0.06231,-0.00429,0.05347,0.05777,-0.0694,0.03172,-0.06112,-0.09373,-0.04121,-0.05008,0.02854,-0.09209,0.03386,0.02445,-0.05455,0.0791,-0.03036,0.05929,0.09962,-0.08555,-0.04473,-0.06363,-0.04687,-0.04199,0.03424,0.0519,0.0158,0.05454,-0.07446,0.03924,-0.10693,-0.04698,0.04146,0.00385,-0.02805,0.08248,-0.04275,-0.07906,0.03537,0.07169,-0.0153,-0.04154,-0.0359,-0.02052,-0.06408,0.02252,-0.08247,0.06782,-0.02405,-0.01698,-0.05907,-0.06149,-0.01751,0.01065,0.07004,0.02856,0.04886,0.02176,0.0419,0.01894,0.0815,0.03826,0.02638,-0.05934,0.00385,-0.01269,-0.0607,-0.05562,0.0505,-0.00818,0.04198,0.04366,0.05275,0.09546,-0.05141,0.05793,-0.04977,0.00996,-0.06494,0.0798,0.03502,0.05395,-0.00027,-0.11545,-0.03401,0.05676,0.05813,-0.06413,-0.03655,-0.0445,-0.05409,-0.04065,-0.01724,0.00628,0.06911,-0.07821,-0.02263,-0.07,0.10993,0.00014,0.08749,0.01704,0.05092,-0.04041,0.0578,0.08994,0.04088,-0.01368,-0.02488,-0.06513,-0.04223,-0.04382,-0.03506,-0.02411,0.02598,0.01419,-0.01332,0.02502,0.04112,-0.01889,-0.01755,-0.01693,0.0176,-0.04812,0.04505,0.07941,0.03561,0.01649,-0.02938,0.03965,-0.00367,0.0739,0.02028,-0.02154,0.01341,-0.06559,0.04732,0.05764,-0.08408,-0.05906,0.01557,-0.0231,-0.05533,-0.0399,0.06488,-0.01943,0.03494,0.06939,-0.00098,0.01118,-0.09359,-0.02316,0.03079,-0.02406,-0.10709,-0.01183,0.02894,-0.04306,-0.00147,-0.0548,-0.07392,-0.01694,-0.06169,0.01997,0.01377,0.01002,-0.02941,-0.06425,-0.04049,0.00489,-0.03214,0.00779,-0.03756,-0.02033,0.02602,-0.0343,0.03193,0.08788,-0.10207,-0.0882,-0.06217,-0.02314,0.05245,0.0332,0.06825,-0.0536,0.05434,0.03343,-0.01694,0.06024,0.07493,0.05679,-0.01006,-0.07485,0.00352,-0.07341,-0.04843,-0.04423,0.01788,0.04622,-0.01389,-0.073,-0.05711,0.01456,0.07783,-0.08472,-0.0905,0.0626,0.036,0.04378,0.07548,0.0607,-0.02416,-0.03767,0.05029,0.00117,-0.03526,-0.04475,-0.04605,0.06491,0.0035,0.07342,0.01529,0.00698,0.07109,-0.06433,0.03679,0.00055,-0.00352,-0.00855,0.02796,-0.06579,0.05987,0.04387,0.01938,0.02972,0.00579,0.06111,0.05774,-0.02582,-0.00774,0.0298,0.09525,-0.00157,0.07892,-0.08351,-0.07054,-0.07319,-0.09486,0.00052,-0.05989,0.05174,0.06419,-0.07975,-0.01753,0.04382,0.00313,0.04971,-0.039,-0.05461,0.02959,-0.02098,-0.04446,0.0202,0.07661,-0.03729,-0.00064,0.06355,0.02303,-0.07978,0.09846,-0.05775,-0.06906,0.01618,-0.03317,-0.06078,0.01436,0.01779,-0.09848,0.06881,0.02539,-0.04652,0.01976,-0.05814,0.00821,0.02201,0.03981,-0.06835,-0.01065,0.07187,0.02592,0.05798,0.0594,0.0154,-0.02611,0.04886,-0.05824,0.02849,0.05341,-0.01227,-0.02919,-0.00538,-0.04405,-0.0094,0.02343,-0.06058,-0.09974,0.06521,0.0259,0.0924,0.07205]},{"id":"experience-work#0","docId":"experience-work","title":"Esperienza lavorativa trasversale","category":"experience","tags":["work","experience","resilience","management"],"text":"Operaio generico dal 2016 al 2022 in settori diversi. Dal 2016 al 2022 ho lavorato in settori molto diversi: agricoltura, edilizia, fabbrica, reception alberghiera, steward eventi, e gestione di un negozio al dettaglio (cosmetici e attrezzatura professionale). Sei anni che hanno formato una forte resilienza e capacità di adattamento, prima di decidere di cambiare strada e iscrivermi a Informatica.","vec":[0.01408,-0.02586,-0.04699,-0.05485,0.06554,-0.06128,0.00377,0.0519,-0.00095,0.04291,0.018,0.03618,0.043,-0.01758,0.01117,0.04095,0.05921,-0.04964,-0.10898,-0.06706,0.01675,0.02592,-0.0645,0.07258,0.0731,0.01455,-0.01788,0.00546,0.04251,-0.04985,-0.07191,-0.05148,-0.00949,-0.07477,0.026,0.03401,-0.0218,-0.06328,0.0594,-0.08128,-0.08968,-0.00615,0.05197,0.05568,-0.00168,0.08932,-0.03211,0.02998,-0.06803,-0.02541,-0.03786,0.05792,0.04728,0.10322,0.02959,-0.04871,-0.06695,-0.04422,-0.02801,0.0232,0.03659,-0.01705,-0.00467,0.01645,0.05907,0.0269,0.03633,0.02641,-0.06342,-0.04535,-0.00877,0.06281,-0.00674,-0.08282,-0.01566,0.04925,0.04954,-0.07488,0.03764,-0.10179,-0.08138,-0.03968,-0.00084,0.06921,-0.05215,0.07359,0.04008,-0.05818,0.06533,-0.02058,0.05727,0.04579,-0.03888,-0.04233,-0.06041,-0.0755,-0.0379,0.07857,0.04951,-0.01632,0.06533,-0.03524,0.04579,-0.06873,-0.04668,0.0282,0.01513,-0.04736,0.0597,-0.06639,-0.05975,0.04374,-0.00184,0.02677,-0.09592,-0.03144,-0.01121,-0.06773,0.06558,-0.03224,0.07284,-0.02811,-0.06266,-0.04312,-0.08513,0.00753,0.01088,0.11035,0.03242,0.01581,0.00167,0.02895,-0.00684,0.05848,0.00977,0.09526,-0.03496,-0.00741,-0.00498,-0.05124,-0.04478,0.06547,-0.06618,0.02848,0.04521,0.07655,0.05243,0.01386,0.06914,-0.0578,0.03778,-0.0268,0.07504,0.02797,0.04298,-0.02599,-0.0835,-0.03138,0.06086,0.05181,-0.04223,-0.04393,-0.03743,-0.00692,-0.05503,-0.01151,0.03077,0.03669,-0.05805,-0.00366,-0.03954,0.05324,-0.05791,0.08936,-0.00393,-0.02827,-0.06403,0.03405,0.07425,0.07548,-0.06191,-0.03134,-0.05309,-0.05878,-0.08032,-0.07077,-0.10403,0.03073,0.00312,0.00351,0.02576,0.00737,-0.0164,-0.09919,-0.03634,0.03639,-0.06501,0.05297,0.03626,0.03315,-0.00031,-0.04719,0.00785,0.04196,0.06055,0.02672,-0.05374,0.04173,-0.04915,0.04761,0.05456,-0.07758,-0.04365,0.04287,-0.00747,0.00664,0.00891,0.0718,-0.03518,0.01968,0.04373,-0.03511,0.06376,-0.05985,-0.00811,0.04762,0.0622,-0.06526,-0.0483,0.07278,-0.11024,-0.02279,-0.04418,-0.0645,-0.05067,-0.07462,0.03396,0.05173,0.04196,-0.00069,-0.05252,-0.03827,0.03109,-0.03307,0.05307,-0.06299,-0.02572,0.02185,-0.04933,0.04639,0.08958,-0.12382,-0.07944,-0.05574,0.01774,0.04861,0.04326,0.04857,-0.06145,0.0405,0.04687,-0.00176,0.07554,0.05562,0.07318,-0.02513,-0.03582,-0.02847,-0.03144,-0.05602,-0.04067,0.01542,-0.02704,-0.01354,-0.05539,-0.00977,0.04557,0.04524,-0.03685,-0.03908,0.05249,0.03782,0.02498,0.09394,0.03729,-0.06241,-0.01879,0.09605,0.00754,-0.03504,-0.02431,-0.02397,0.06637,-0.04812,0.06038,0.03202,0.01531,0.09852,-0.08605,0.05187,0.01386,-0.01143,0.0106,0.03675,-0.04231,0.06168,-0.00096,-0.03649,0.01663,0.04488,0.05394,0.05868,-0.02341,-0.02216,0.08598,0.04316,0.00307,0.03649,-0.07426,-0.04979,-0.06263,-0.05546,-0.05639,-0.0928,0.05015,0.07646,-0.08704,-0.03364,0.01976,-0.01011,0.03938,-0.03398,-0.05257,0.03309,-0.03891,-0.04821,0.00747,0.09955,-0.02255,0.01223,0.06767,0.08293,-0.0738,0.07273,-0.00752,-0.09997,0.05479,-0.02376,-0.07819,0.03535,0.02338,-0.0732,0.02476,0.0641,-0.01571,0.04172,-0.05467,0.02054,0.06618,0.005,-0.04203,-0.03759,0.03372,-0.00178,0.07384,0.03172,-0.01347,-0.02243,0.02463,-0.03225,0.04981,0.1038,-0.05321,-0.03197,-0.03219,-0.04799,-0.03584,0.00566,-0.02209,-0.06458,0.04987,0.08231,0.06517,0.05876]},{"id":"education-track#0","docId":"education-track","title":"Percorso formativo","category":"education","tags":["education","uniba","degree","diploma"],"text":"Laurea in Informatica (107/110) e Diploma in Ragioneria. Ho conseguito la Laurea Triennale in Informatica e Tecnologie per la Produzione del Software presso l'Università di Bari (10/2022 - 07/2025) con votazione 107/110. Tesi: Orchestrazione di Agenti LLM per l'Ottimizzazione Multi-Metrica nei Sistemi di Raccomandazione. Precedentemente, ho ottenuto il Diploma di Scuola Superiore in Ragioneria (09/2011 - 07/2016) presso l'I.T.C Eugenio Montale di Rutigliano, con voto 75.","vec":[0.023,-0.0085,-0.05313,-0.10023,0.04343,-0.09465,-0.00232,0.06219,0.06642,-0.01312,0.05049,0.00239,0.08531,-0.02024,0.00102,0.06933,0.08313,-0.08666,-0.07821,-0.06826,0.01112,0.0168,-0.06609,0.03416,0.04621,0.04308,-0.00064,0.01245,0.00967,-0.03582,-0.07065,-0.04972,0.07207,-0.06995,0.03277,0.04984,-0.03567,-0.04375,0.02904,-0.04052,-0.03667,0.00278,0.05668,0.08023,-0.00586,0.07884,-0.02812,0.0337,-0.02218,-0.03206,-0.03075,0.08067,0.08195,0.064,0.03548,-0.04515,-0.01928,-0.06323,-0.03809,0.0449,0.05184,-0.02867,0.01528,0.03517,0.05413,0.05806,0.03996,0.07414,-0.09024,-0.12818,-0.02472,0.02114,0.00022,-0.05642,0.01138,0.06539,0.07603,-0.05992,0.00345,-0.06383,-0.06421,-0.03033,-0.03144,0.06836,-0.03241,0.03924,0.06104,-0.05403,0.01926,-0.03759,0.05691,0.04044,-0.04535,-0.06199,-0.02933,-0.03387,-0.01409,0.09448,0.05794,-0.0085,0.02399,-0.06632,0.05753,-0.09211,-0.08676,0.00926,-0.00576,-0.05263,0.05383,-0.07749,-0.0185,0.05147,0.01793,0.03422,-0.0904,-0.04964,-0.06774,-0.04606,0.02459,-0.07917,0.06923,-0.05108,-0.07575,-0.06266,-0.02672,-0.01044,-0.00121,0.05082,0.06495,0.0268,0.03309,0.04449,-0.00569,0.06341,0.06669,0.05983,-0.08891,0.02323,-0.02489,-0.03288,-0.03917,0.04347,-0.06823,0.01798,0.04479,0.03752,0.1162,-0.03406,0.05363,-0.05345,0.0235,-0.00083,0.03205,0.04991,0.03348,-0.02884,-0.06903,-0.0508,0.06331,0.02961,-0.03891,-0.05744,-0.02729,-0.04349,-0.02373,-0.02298,0.03432,0.04024,-0.05362,-0.04681,0.00418,0.07777,-0.05039,0.12199,-0.01013,0.01642,-0.03797,0.03071,0.10864,0.05634,-0.02706,-0.01158,-0.07616,-0.06263,-0.07568,-0.09291,-0.03104,0.00531,0.04391,-0.06936,0.02172,0.03806,-0.03195,-0.0847,-0.05141,0.03855,-0.03575,0.07167,0.03868,0.05398,-0.01412,-0.02923,0.01252,0.01705,0.06761,0.06343,-0.08882,0.03675,-0.00912,0.02457,0.00885,-0.04336,-0.02722,0.02251,0.04438,0.01978,0.00612,0.05936,-0.01791,0.03776,0.0201,-0.03288,0.06614,-0.02773,0.00489,0.02687,0.05768,-0.05471,-0.06348,0.05088,-0.06479,-0.02604,-0.07018,-0.07697,-0.05713,-0.04953,0.03979,0.07012,0.03115,-0.01022,-0.09557,-0.05887,0.01048,-0.03326,0.0514,-0.02464,-0.02585,0.03467,-0.0275,0.09221,0.08415,-0.09525,-0.02556,-0.02466,0.01771,0.01246,0.06206,-0.00179,-0.03614,0.02246,0.03385,-0.01265,0.03826,0.03329,0.06282,0.04083,-0.0689,-0.05455,-0.04377,-0.06788,-0.00635,0.01046,0.03737,-0.02785,-0.0401,-0.04457,0.05062,0.08574,-0.01311,-0.05224,0.06578,0.04547,0.09584,0.0682,0.05307,-0.00212,-0.02093,0.09618,-0.02292,-0.06345,-0.04639,0.00543,0.06435,-0.05371,0.06455,0.03359,-0.03788,0.03005,-0.04637,0.03905,-0.00399,-0.04442,0.05404,0.01812,-0.09207,0.01801,-0.01244,-0.00818,0.03648,0.02245,0.04316,0.01359,-0.0667,-0.00583,0.03263,0.07691,0.02996,0.07066,-0.07182,-0.04013,-0.05549,-0.07206,-0.0403,-0.08273,0.03522,0.07336,-0.07481,0.00398,0.05183,-0.02318,0.03557,-0.00838,-0.06712,0.05625,-0.03672,-0.06136,-0.00832,0.07338,-0.05817,-0.02113,0.0721,0.04875,-0.05985,0.02811,-0.03599,-0.07467,0.01279,-0.00747,-0.0637,0.00092,0.01845,-0.11062,0.03088,0.05907,-0.05513,0.06891,-0.09795,0.01994,0.06746,0.02225,-0.03557,-0.08145,0.02937,0.02979,0.0494,0.02395,-0.01467,-0.0106,0.04503,-0.02725,0.05441,0.04409,-0.07179,-0.01674,-0.02815,-0.04863,-0.04534,0.00139,-0.05709,-0.08603,0.07191,0.04012,0.04028,0.04196]},{"id":"services-stack#0","docId":"services-stack","title":"Competenze e tecnologie","category":"services","tags":["skills","python","react","n8n","langgraph","rag"],"text":"Sviluppo AI/ML, web development, architetture multi-agente e RAG. Le mie competenze includono linguaggi come Python, Java, C, JavaScript, HTML/CSS, SQL; framework e tool AI come LangGraph, LangChain, FAISS, BM25, Embeddings, Pandas, NumPy; sviluppo web e backend con React, FastAPI; database MySQL, MongoDB; e automazione con n8n.","vec":[0.04992,-0.00032,-0.04487,-0.06808,0.07449,-0.08316,0.02696,0.0664,0.01332,-0.00749,0.07737,0.00369,0.07738,-0.04356,-0.0202,0.01884,0.06076,-0.06267,-0.04728,-0.03707,0.03222,0.02997,-0.05846,0.03273,0.05743,0.03176,-0.00167,0.00825,0.02123,-0.05241,-0.03057,-0.0224,0.07584,-0.04482,0.03837,0.02563,-0.01796,-0.07318,0.02852,-0.087,-0.00976,0.03875,0.06367,0.02801,0.05591,0.07018,-0.01787,0.05021,-0.04804,0.00259,-0.02421,0.04376,0.0413,0.06608,0.04349,-0.03915,-0.0347,-0.07976,-0.06055,0.01138,0.04629,-0.02902,0.02295,0.01174,0.0571,0.04436,0.02663,0.04777,-0.08224,-0.06354,-0.03436,0.08604,-0.01721,-0.06849,-0.01719,0.03988,0.01025,-0.0796,0.04116,-0.04537,-0.10089,-0.03456,-0.02901,0.0399,-0.04082,0.05709,0.06602,-0.08795,0.07383,-0.01625,0.06261,0.0148,-0.03084,-0.024,-0.09634,-0.07722,-0.05276,0.10057,0.06393,-0.0192,0.02338,-0.02894,0.0349,-0.07529,-0.09059,0.0273,-0.01045,-0.04667,0.02416,-0.04418,-0.02942,0.03568,0.05709,0.03369,-0.08597,-0.04198,-0.02101,-0.04626,0.05027,-0.04619,0.03484,-0.01822,-0.08911,-0.0707,-0.04471,-0.04749,0.02517,0.05574,0.03203,0.02469,0.02579,0.075,0.01169,0.04779,0.05642,0.10501,-0.02682,-0.00355,-0.00258,-0.03248,-0.04379,0.05297,-0.09393,0.01211,0.07282,0.02242,0.08633,-0.03312,0.01814,-0.04151,0.00346,-0.02778,0.0372,0.01867,0.04556,-0.02121,-0.04033,-0.02742,0.08644,0.05455,-0.06546,-0.04149,-0.03994,-0.01793,-0.06903,-0.06549,-0.00605,0.06264,-0.04283,0.00412,-0.04652,0.07824,-0.05753,0.04927,0.00539,0.00289,-0.06878,0.05864,0.09107,0.0517,-0.03204,-0.01868,-0.08406,-0.05475,-0.06567,-0.03553,-0.06797,-0.01244,-0.00126,-0.04232,0.03758,0.03885,-0.05217,-0.11243,-0.03106,0.05718,-0.0444,0.04319,0.04508,0.08048,-0.00828,-0.04021,0.02225,0.01719,0.06107,0.01315,-0.09198,0.05487,-0.05621,0.02173,0.01512,-0.01414,-0.06192,0.0747,0.01911,-0.00846,-0.02796,0.07069,-0.02131,0.0529,0.07391,-0.06643,0.0535,-0.04305,-0.02139,0.04082,0.05838,-0.0862,-0.07776,0.04428,-0.06527,-0.01415,-0.02111,-0.08443,-0.02301,-0.08623,0.0034,0.03077,0.02863,-0.03687,-0.06868,-0.03306,0.00068,-0.03592,0.03211,-0.05899,-0.01587,0.04829,-0.04411,0.09427,0.09917,-0.06754,-0.0784,-0.0094,0.00714,0.05369,0.07134,0.04677,-0.06789,0.02807,0.05165,-0.05053,0.05161,0.04187,0.04717,0.04534,-0.02941,-0.03226,-0.05959,-0.00482,-0.02996,0.02738,0.0048,-0.01552,-0.00061,-0.06282,0.00952,0.08699,-0.04626,-0.04639,0.0492,0.05029,0.07043,0.07103,0.06167,-0.01305,-0.00647,0.05543,0.01114,-0.05073,-0.06147,-0.04371,0.05716,-0.02202,0.09972,0.01242,0.03163,0.03803,-0.06287,0.04761,0.02036,-0.02373,0.04392,0.0518,-0.0451,0.06275,-0.00901,-0.00398,0.08559,0.01906,0.06529,0.0273,-0.02253,-0.03432,0.02071,0.04277,0.02433,0.04623,-0.0688,-0.07691,-0.06712,-0.09526,-0.01755,-0.05812,0.02518,0.08026,-0.10121,-0.02524,0.05957,-0.02018,0.05706,-0.00577,-0.04,0.02338,-0.07713,-0.04555,-0.0305,0.09649,-0.00709,-0.02075,0.05118,0.03373,-0.06183,0.04113,-0.04749,-0.08286,0.01842,0.00819,-0.01379,0.03954,0.04646,-0.11549,0.03279,0.03498,-0.02451,0.04392,-0.073,0.02202,0.01167,0.05686,-0.04032,-0.08252,0.04371,0.02308,0.01943,0.0117,-0.02254,-0.01757,0.04359,-0.04648,0.07758,0.09933,-0.06285,-0.07441,-0.04918,-0.05444,-0.044,-0.00947,-0.0561,-0.0785,0.05463,0.04195,0.09944,0.0802]},{"id":"languages#0","docId":"languages","title":"Competenze linguistiche","category":"languages","tags":["languages","italian","english"],"text":"Italiano madrelingua, Inglese livello B1. Parlo italiano come lingua madre e ho una conoscenza dell'inglese di livello B1.","vec":[0.05287,-0.02662,-0.05534,-0.08829,0.09579,-0.07251,-0.00162,0.07045,0.07094,-0.02842,0.06203,-0.00843,0.08325,-0.02596,0.03765,0.05474,0.09161,-0.07854,-0.0633,-0.05888,0.03279,0.00156,-0.05213,0.01192,0.05102,-0.01989,0.04329,0.02444,-0.00534,-0.05225,-0.01155,0.01239,0.06626,-0.05453,0.03969,0.00142,-0.01017,-0.11844,0.05958,-0.097,-0.0275,0.02551,0.07605,0.06357,0.05733,0.07887,-0.04189,0.07623,-0.01987,-0.01954,-0.00375,0.04144,0.07518,0.06322,0.05902,-0.05443,-0.04514,-0.0453,-0.02902,-0.01338,0.07566,-0.04521,0.04336,0.01155,0.02481,0.06654,0.00707,0.04235,-0.01533,-0.05778,-0.02256,0.07123,0.00402,-0.03927,0.05135,0.01583,0.00101,-0.10919,0.03098,-0.08419,-0.09143,-0.05109,-0.03131,0.01185,-0.10437,0.07462,0.01915,-0.04533,0.03923,-0.02718,0.06738,0.03066,-0.01701,-0.05904,-0.08466,-0.06274,-0.0113,0.111,0.03496,-0.02682,0.05963,-0.04435,0.04004,-0.08344,-0.06778,0.01797,0.00267,-0.05544,0.0259,-0.04704,-0.005,0.04352,0.05181,0.02915,-0.09308,-0.06748,-0.06095,-0.05441,0.04773,-0.03991,0.0401,-0.05113,-0.04242,-0.0602,-0.06126,-0.01103,0.0049,0.04141,0.00173,0.01699,0.02344,0.04972,-0.01052,0.0457,0.01696,0.06904,-0.0403,-0.00235,0.01319,-0.0345,-0.0504,0.03011,-0.04296,0.06044,0.0233,0.00935,0.07236,-0.0158,0.075,-0.06364,0.00034,-0.03311,0.01881,0.05265,0.01257,0.00495,-0.06075,-0.03517,0.07487,0.08244,-0.097,-0.06365,-0.05989,-0.05569,-0.05763,-0.07205,0.02976,0.033,-0.02909,0.00068,-0.01284,0.0601,-0.05292,0.04505,0.02049,0.0201,-0.07118,0.05935,0.06983,0.03354,-0.01895,-0.05911,-0.05627,-0.0254,-0.07373,-0.05058,-0.00145,0.01126,0.06252,-0.04485,0.02097,0.04667,-0.05154,-0.12165,-0.06361,0.03164,-0.04359,0.06338,0.00786,0.04259,-0.03244,-0.0424,0.03068,-0.00284,0.03904,0.01724,-0.10419,0.01824,-0.01022,0.08427,0.01283,-0.0385,-0.04395,0.05522,0.03893,0.01775,-0.00884,0.03679,-0.0392,-0.00487,0.03876,-0.03181,0.06935,-0.03714,-0.01843,0.0239,0.06786,-0.05897,-0.03848,0.04502,-0.07691,-0.00235,-0.03635,-0.07053,-0.03968,-0.07038,0.04979,-0.01894,0.00473,-0.0129,-0.01096,-0.02716,0.04076,-0.08152,0.04293,-0.06069,-0.00832,0.05716,-0.01394,0.04696,0.07781,-0.0864,-0.05776,-0.02229,0.02804,0.06945,0.09026,0.05039,-0.03271,-0.00969,0.03051,-0.06745,0.0919,0.07403,0.06076,0.03291,-0.06058,-0.04132,-0.05139,-0.02411,-0.00685,0.02938,0.03099,-0.0267,-0.03739,-0.05063,0.01993,0.05161,-0.04093,-0.01982,0.02948,0.01689,0.02237,0.0569,0.03394,-0.02908,-0.01089,0.01415,0.01316,-0.02971,-0.01366,-0.03907,0.06507,-0.03891,0.08693,0.05507,0.01213,0.05437,-0.0642,0.04232,-0.02057,-0.03579,0.02127,0.04902,-0.05965,0.00424,-0.00692,-0.01151,0.02496,0.01641,0.07032,0.04474,-0.0454,-0.02456,0.0387,0.03477,0.01651,0.11301,-0.03194,-0.05064,-0.04877,-0.11462,-0.05038,-0.01662,0.02347,0.09668,-0.07107,-0.02754,0.05671,-0.01438,0.02521,0.00759,-0.03658,0.01585,-0.02406,0.01098,-0.06753,0.11287,-0.04786,-0.03168,0.05243,0.0681,-0.06676,0.03855,-0.04893,-0.07488,0.04391,-0.02812,-0.01002,0.02735,0.06256,-0.06508,0.03453,0.05978,-0.02718,0.0684,-0.09277,0.03625,0.05428,0.06363,-0.05472,-0.09007,0.02495,0.087,0.04378,0.05996,0.01389,-0.04843,0.05731,-0.05398,0.0528,0.08746,-0.08105,-0.05842,-0.0481,-0.03333,-0.08957,0.0362,-0.0622,-0.06341,0.04594,0.05224,0.09152,0.05878]},{"id":"project-1#0","docId":"project-1","title":"Talent Program \"Next Pulse\"","category":"project","tags":["Hackathon","Python","FastAPI","RAG","ChromaDB","FAISS"],"text":"Sviluppo backend in team per un AI Sales Assistant nel settore Traffic Enforcement e Smart City (Hackathon nazionale). EnLexi: AI Sales Assistant multi-sorgente per Engine S.p.A.. Durante il bootcamp selettivo intensivo (48h) su scala nazionale (320 candidati), ho contribuito allo sviluppo di EnLexi in un team di 5 persone. EnLexi è un AI Sales Assistant multi-sorgente per Engine S.p.A.","vec":[0.04913,-0.01472,-0.05463,-0.05192,0.05492,-0.02589,-0.00666,0.01298,0.01741,-0.02401,0.09449,0.00524,0.07859,-0.02759,-0.033,0.05825,0.04929,-0.05784,-0.05822,-0.05953,-0.01184,0.01439,-0.06543,0.02355,0.07622,0.06158,-0.02305,0.05301,0.04939,-0.05652,-0.01669,-0.03596,0.07067,-0.0994,0.05018,0.0253,-0.06599,-0.06141,0.04919,-0.0962,-0.01666,0.01791,0.04309,0.05479,0.05832,0.08201,0.00064,0.09127,-0.06723,-0.03309,-0.01887,0.05359,0.04576,0.03803,0.01032,-0.00661,-0.0657,-0.09814,-0.04185,-0.01787,0.01267,-0.03517,-0.00607,0.06003,0.06169,0.05603,0.02496,0.05654,-0.08953,-0.05879,-0.07511,0.0791,0.03635,-0.06273,-0.01328,0.04122,0.06596,-0.07515,0.05278,-0.02201,-0.10067,-0.0135,-0.02292,0.04363,-0.04633,0.03712,0.06269,-0.10149,0.04188,-0.00562,0.08256,0.03447,-0.04575,-0.0279,-0.06794,-0.08424,-0.01066,0.05423,0.04324,-0.06312,0.02816,-0.05382,0.05195,-0.09022,-0.03781,0.03582,0.04199,-0.08104,0.04194,-0.0644,-0.05006,0.04556,0.05804,0.04109,-0.07234,-0.01,-0.00842,-0.06098,0.0085,-0.02693,0.05762,-0.01632,-0.0537,-0.08443,-0.06585,-0.04192,-0.0292,0.05395,0.02312,0.00793,-0.00338,0.06158,0.01117,0.04294,0.06107,0.0554,-0.06718,0.00617,-0.03145,-0.04281,-0.0413,0.05214,-0.02742,0.05074,0.02582,0.02507,0.08662,-0.06442,0.04081,-0.05286,0.08336,-0.022,0.01722,-0.00143,0.03547,-0.02701,-0.09847,0.00779,0.05823,0.09171,-0.03481,-0.0887,-0.02353,-0.02051,-0.086,-0.03379,-0.02213,0.05412,-0.06512,-0.01885,-0.05364,0.04295,-0.09582,0.09111,-0.01051,0.04797,-0.08796,0.08031,0.07673,0.02287,-0.0204,-0.01272,-0.09002,-0.04603,-0.09451,-0.03221,-0.06991,0.03144,0.00676,-0.01501,0.02671,0.04412,-0.03168,-0.06942,-0.02382,0.05914,-0.0237,0.01967,0.07222,0.04788,0.00403,-0.02467,0.04651,0.02172,0.07349,-0.00298,-0.06831,0.04582,-0.05321,0.07978,0.01006,-0.05882,-0.02806,0.03737,-0.00571,-0.02455,-0.03416,0.05475,-0.02911,-0.03089,0.07508,-0.00375,0.02216,-0.04323,0.01945,0.05796,0.05123,-0.07656,-0.03447,0.05363,-0.06531,0.0046,-0.05584,-0.07909,-0.051,-0.05052,0.01579,0.03433,0.00765,-0.00663,-0.05274,-0.03022,0.03646,-0.04029,0.05397,-0.0822,0.00647,-0.02419,-0.03272,0.06953,0.05751,-0.09624,-0.06383,-0.02522,0.00951,0.04889,0.04462,0.06612,-0.10698,0.0224,0.03239,-0.0514,0.09046,0.0362,0.0708,-0.00652,-0.07309,0.04493,-0.03848,-0.00084,-0.06237,0.02373,0.04241,-0.02162,-0.04187,-0.02648,0.00862,0.10655,-0.04988,-0.02902,0.07521,0.04618,0.04883,0.06578,0.06386,-0.04977,-0.03984,0.06174,-0.05463,-0.03207,-0.03769,-0.04752,0.02468,-0.01936,0.07329,0.02897,0.03691,0.04814,-0.00871,0.07869,0.04701,-0.02373,0.0554,0.05283,-0.06172,0.04105,0.0043,-0.00558,0.01565,0.04677,0.0705,0.05356,-0.05195,-0.03209,0.04536,0.07538,-0.01921,0.03566,-0.0591,-0.03932,-0.06158,-0.11321,-0.01518,-0.02096,0.02675,0.04064,-0.08781,-0.03427,0.02327,0.00271,0.01618,-0.03248,-0.06782,0.0297,-0.04359,-0.03392,-0.03996,0.06851,-0.0399,-0.04257,0.02017,0.02472,-0.05484,0.05446,-0.01172,-0.03676,0.07062,-0.02222,-0.04549,0.01998,0.00882,-0.11665,0.09045,0.04784,-0.05398,0.06666,-0.09355,0.0316,0.06076,0.0477,-0.03488,-0.07009,0.02988,-0.00077,0.04187,0.0402,0.01439,0.01353,0.02165,-0.01582,0.05531,0.08007,0.00864,-0.02845,-0.03143,-0.03987,-0.0158,0.00768,-0.0437,-0.04884,0.0454,0.04187,0.08467,0.06244]},{"id":"project-1#1","docId":"project-1","title":"Talent Program \"Next Pulse\"","category":"project","tags":["Hackathon","Python","FastAPI","RAG","ChromaDB","FAISS"],"text":"Mi sono occupato del backend con focus sulla pipeline di retrieval e sull'implementazione della ricerca ibrida (BM25 + ChromaDB/FAISS), gestendo anche l'organizzazione del team e collaborando alla presentazione finale. Ruolo di Vito: Backend Developer / Team Organizer. Periodo: Giugno 2026. Stack: Python, FastAPI, BM25, ChromaDB, FAISS.","vec":[0.01952,0.00671,-0.01134,-0.03679,0.07993,-0.06508,0.01223,0.04257,0.05083,0.00135,0.08181,-0.00924,0.07238,-0.03386,0.00239,0.02539,0.11747,-0.0428,-0.04801,-0.0676,0.02519,0.02673,-0.09381,0.06122,0.07304,0.01339,-0.04442,0.04377,0.08164,-0.01958,-0.04207,-0.05101,0.04972,-0.10889,0.05517,0.00091,-0.05491,-0.04206,0.04748,-0.06837,-0.01912,0.03675,0.00546,0.03109,0.033,0.07476,-0.0261,0.00888,-0.03105,-0.01331,-0.02566,0.10697,0.05177,0.03754,0.00219,-0.02034,-0.07293,-0.08067,-0.06182,0.01604,0.0475,-0.00402,-0.00353,0.03368,0.06577,0.04644,-0.009,0.0289,-0.07622,-0.04567,-0.04406,0.03135,-0.02688,-0.03661,-0.0031,0.03653,0.06267,-0.07294,0.02386,-0.04866,-0.10442,-0.08097,-0.03719,0.00852,-0.04328,0.01942,0.06379,-0.11298,0.05451,-0.03876,0.08533,0.05411,-0.02327,-0.07908,-0.06923,-0.07374,-0.02305,0.054,0.04068,-0.02576,-0.00027,-0.05592,0.04706,-0.14197,-0.03969,0.0421,-0.00478,-0.03781,0.07607,-0.05339,-0.04031,0.05407,0.0434,0.04007,-0.08094,-0.02542,-0.02024,-0.05678,0.04977,-0.03383,0.09051,-0.02193,-0.05263,-0.11136,-0.06712,-0.05133,0.01753,0.05263,0.02637,0.02131,-0.00146,0.04225,0.02621,0.03015,0.03275,0.07452,-0.04199,-0.02257,-0.00342,-0.04678,-0.03194,0.04983,-0.07866,0.02079,0.04424,0.02948,0.10724,-0.04805,0.03998,-0.06198,0.06885,-0.04446,0.06512,0.02026,0.05056,-0.04577,-0.07426,-0.04486,0.05181,0.09806,-0.07232,-0.03851,-0.07165,-0.0093,-0.08074,-0.03546,0.03169,0.04389,-0.06609,0.00417,-0.06079,0.09054,-0.04108,0.11085,0.04352,0.03822,-0.04416,0.03644,0.07099,0.07803,-0.05327,-0.02432,-0.10294,-0.06576,-0.05048,-0.02481,-0.03825,0.00068,-0.01898,-0.0451,0.03497,0.0673,-0.02468,-0.03404,-0.02554,0.07319,-0.01034,0.04788,0.04041,0.0215,0.00198,-0.0629,0.0445,0.0436,0.04339,0.02117,-0.05052,0.01415,-0.04522,0.08797,0.076,-0.04179,-0.08659,0.03807,0.00842,-0.02748,0.00019,0.07293,-0.02059,0.02412,0.07066,-0.00239,0.07359,-0.05941,0.00582,0.06055,0.02132,-0.08911,-0.0312,0.08538,-0.02441,-0.01452,-0.06262,-0.02795,-0.01679,-0.04183,0.03501,0.05071,0.01998,-0.03966,-0.06203,-0.02336,0.03968,-0.05576,0.05889,-0.07255,-0.01455,0.04734,-0.03898,0.05447,0.06775,-0.10066,-0.06758,-0.06043,-0.0178,0.08743,0.0366,0.04597,-0.08506,0.02772,0.03935,-0.02514,0.06719,0.04939,0.02725,-0.00986,-0.07454,0.01254,-0.04727,-0.02792,-0.02026,0.01729,-0.00169,-0.03204,-0.04328,-0.03853,0.03863,0.04909,-0.0691,-0.07488,0.04972,0.00886,0.00915,0.0807,0.0594,-0.03412,-0.05022,0.05469,-0.02951,-0.05455,-0.06817,-0.01852,0.06003,-0.03356,0.07611,0.03241,0.03338,0.03311,-0.05807,0.04943,0.00903,-0.0142,0.05545,0.03889,-0.08146,0.02822,0.01833,0.02448,0.04483,0.04679,0.07146,0.06204,-0.06001,-0.00808,0.05995,0.01553,-0.0264,0.0448,-0.07379,-0.02152,-0.0873,-0.08383,-0.03763,-0.03581,0.00855,0.0655,-0.09342,-0.04261,0.06636,-0.0258,0.04426,-0.03027,-0.06247,0.05754,-0.03676,-0.03596,0.00976,0.0714,-0.02114,0.00209,0.00819,0.03673,-0.01332,0.05883,-0.0404,-0.0508,0.04955,-0.03176,-0.05471,0.0369,0.04164,-0.10061,0.04989,0.05091,-0.01132,0.05769,-0.06494,0.02175,0.01601,0.01186,-0.02535,-0.06064,0.02302,0.00295,0.04555,0.01066,-0.00876,0.00508,0.01953,-0.0324,0.06227,0.05519,-0.03425,-0.00706,-0.06137,-0.04553,-0.01401,0.02566,-0.03761,-0.07291,0.05847,0.03763,0.07813,0.06553]},{"id":"project-1#2","docId":"project-1","title":"Talent Program \"Next Pulse\"","category":"project","tags":["Hackathon","Python","FastAPI","RAG","ChromaDB","FAISS"],"text":"Risultati: Candidati: 320 (Bootcamp selettivo nazionale.); Durata: 48h (Hackathon intensivo.); Retrieval: Ibrido (Integrazione BM25 + FAISS/ChromaDB.).","vec":[0.03318,-0.01859,0.0117,-0.07773,0.08001,-0.04667,-0.00322,0.02884,0.04902,0.00729,0.05744,-0.01404,0.06549,-0.04463,-0.03078,0.02942,0.09114,-0.03705,-0.05109,-0.06034,0.00867,-0.0165,-0.06795,0.01466,0.07952,0.0131,-0.01247,0.04441,0.07467,-0.05276,-0.00971,-0.05517,0.07979,-0.09275,0.09362,0.00382,-0.06527,-0.05364,0.03693,-0.09004,0.00483,0.02742,0.02861,0.04946,0.06625,0.08512,-0.0393,0.02295,-0.01715,-0.00867,-0.04105,0.08708,0.04218,0.03704,0.00872,-0.05028,-0.06131,-0.0844,-0.07371,0.03192,0.00881,-0.02978,-0.01814,0.03606,0.09363,0.08437,0.01896,0.05541,-0.05863,-0.01989,-0.06326,0.02513,-0.01936,-0.06033,-0.01079,0.04829,0.0848,-0.02523,0.04367,-0.02912,-0.11011,-0.04234,-0.04752,-0.02229,-0.04931,0.02665,0.06675,-0.04724,0.03109,-0.04451,0.07563,0.05298,-0.05966,-0.05026,-0.08592,-0.07918,-0.02982,0.01237,0.00938,-0.00323,0.03111,-0.08011,0.02838,-0.08906,-0.03961,0.04517,0.02537,-0.03892,0.06435,-0.04297,-0.05221,0.03742,0.05186,0.04761,-0.03692,-0.03013,-0.01357,-0.08054,0.03845,-0.02182,0.07533,0.0132,-0.04657,-0.06999,-0.08978,-0.01792,0.0378,0.02664,0.00946,0.01757,-0.01503,0.05876,0.03462,0.05091,0.05741,0.05216,-0.04261,-0.00123,0.01741,-0.06935,-0.03019,0.05661,-0.08097,0.01045,0.0498,0.07217,0.07422,-0.07367,0.04078,-0.07124,0.03471,-0.06074,0.04019,0.04458,0.02859,-0.0251,-0.05691,-0.01911,0.03387,0.08351,-0.0193,-0.04604,-0.05186,-0.03391,-0.06963,-0.0568,0.02107,0.03742,-0.07093,-0.02674,-0.05989,0.10427,-0.03358,0.1033,0.00675,0.03408,-0.05356,0.06634,0.06285,0.03607,-0.02694,-0.01773,-0.07439,-0.05089,-0.07579,-0.02516,-0.0269,0.00902,0.02674,-0.06189,0.02723,0.06322,-0.04933,-0.03105,-0.03401,0.07473,0.0011,0.0618,0.06463,0.03697,-0.01502,-0.05052,0.07355,0.0333,0.04024,0.00331,-0.05366,0.00241,-0.06266,0.09384,0.06532,-0.03721,-0.07596,0.01982,-0.02043,-0.03643,-0.02513,0.02781,-0.00356,0.02266,0.08385,-0.01402,0.05397,-0.08845,0.01612,0.04608,0.01252,-0.07078,-0.04505,0.05191,-0.05672,-0.00261,-0.06406,-0.05984,-0.05828,-0.04655,0.02486,0.04683,0.0068,-0.05057,-0.08342,-0.02263,0.0355,-0.08015,0.02928,-0.06031,0.00134,0.03028,-0.00234,0.08033,0.06127,-0.10451,-0.06911,-0.06378,-0.01001,0.05072,0.05419,0.04814,-0.06212,0.01722,0.06045,-0.06067,0.10277,0.09319,0.06403,-0.0052,-0.06225,0.00722,-0.05681,-0.04574,-0.0097,0.03059,0.05451,-0.04275,-0.0575,-0.03967,0.03445,0.0467,-0.0527,-0.04474,0.05608,-0.02337,0.0649,0.05818,0.05727,-0.01473,-0.03741,0.05466,-0.03564,-0.01403,-0.03873,-0.01916,0.039,-0.02182,0.03757,0.01429,0.02529,0.0473,-0.03026,0.05049,0.00719,-0.00469,0.08165,0.04806,-0.05849,0.04056,0.03903,0.02499,0.05321,0.03867,0.07941,0.05288,-0.06747,-0.003,0.04722,0.03899,-0.00696,0.05484,-0.0548,-0.0161,-0.101,-0.10426,-0.01087,-0.03455,0.02886,0.04646,-0.08097,-0.05667,0.02414,-0.00458,0.05022,-0.02219,-0.07374,0.02736,-0.05442,-0.02927,-0.00113,0.09261,-0.03301,-0.04605,0.03777,0.03263,-0.04112,0.05442,-0.03339,-0.04891,0.06594,-0.03767,-0.04932,0.00926,0.02851,-0.10725,0.08362,0.04225,-0.04518,0.07672,-0.07467,0.00012,0.04894,0.01873,-0.09709,-0.06524,0.05373,0.02996,0.08806,0.03359,0.0044,-0.02121,0.01007,-0.04529,0.05765,0.06693,0.01746,-0.01665,-0.03933,-0.05157,-0.03305,0.03001,-0.03861,-0.09357,0.05131,0.03548,0.07233,0.03734]},{"id":"project-2#0","docId":"project-2","title":"PugliaHack 2026","category":"project","tags":["Hackathon","React 19","TailwindCSS","Supabase","Agri-tourism"],"text":"Sviluppo in autonomia di TerraNode, piattaforma con prenotazioni, gamification, tracciamento CO2 e dashboard real-time. TerraNode: Piattaforma per smart agri-tourism. Nell'ambito dell'hackathon PugliaHack 2026 (finestra di sviluppo: 2 ore, piattaforma Lovable), ho sviluppato in autonomia TerraNode, una piattaforma per lo smart agri-tourism pugliese.","vec":[0.02558,-0.00404,-0.01209,-0.04628,0.04748,-0.07652,0.0372,0.03012,0.00546,0.00482,0.03361,0.04534,0.03577,-0.0371,-0.06486,0.07936,0.05021,-0.01312,-0.04008,-0.05834,0.01757,-0.00797,-0.07132,0.02312,0.0993,0.03837,-0.05635,0.02818,0.03352,-0.02284,-0.02533,-0.0467,0.04252,-0.08489,0.06917,0.01553,-0.02983,-0.01767,0.02415,-0.08552,0.01114,0.06596,0.06332,0.02776,-0.00997,0.11024,-0.04194,0.04612,-0.06123,-0.01654,-0.01754,0.03165,0.05883,0.03954,0.02011,-0.06863,-0.06166,-0.07325,-0.0166,0.04227,0.08577,-0.00623,-0.01198,0.00676,0.09853,0.06737,0.02983,0.04791,-0.05137,-0.04877,-0.02647,0.05344,0.0282,-0.05271,-0.0145,-0.00021,0.06122,-0.05601,0.01413,-0.07466,-0.08947,-0.05868,-0.05483,0.03687,-0.04673,0.03957,0.06832,-0.04913,0.04572,-0.01133,0.08858,0.01602,-0.05854,-0.08746,-0.0526,-0.06303,-0.00096,0.08217,0.06624,-0.07016,0.04746,-0.02155,0.01747,-0.11575,-0.03764,0.0515,0.0601,-0.03804,0.06774,-0.03713,-0.0473,0.0395,0.0327,0.01924,-0.09135,-0.05143,-0.00199,-0.08335,0.02638,-0.10924,0.09348,-0.02063,-0.06302,-0.06923,-0.03854,-0.03743,0.03611,0.06914,0.01772,0.07954,-0.01006,0.03522,0.04988,0.0392,0.02849,0.0618,-0.04786,-0.03002,-0.00173,-0.02718,-0.00707,0.08531,-0.04609,0.02412,0.04049,0.03067,0.12056,-0.0309,0.05576,-0.02954,0.04185,-0.04644,0.0728,0.01742,0.07856,-0.00008,-0.10837,-0.06974,0.06011,0.0711,-0.05466,-0.05815,-0.04123,-0.04213,-0.05377,-0.06229,0.02568,0.0242,-0.09391,-0.00628,-0.05592,0.10865,-0.0215,0.11475,0.00233,0.07213,-0.03547,0.03776,0.07074,0.01867,-0.00299,-0.05374,-0.07555,-0.06201,-0.04446,-0.04621,-0.07778,0.00989,0.01316,-0.0218,0.00839,0.04998,-0.05207,-0.03258,-0.01341,0.08144,-0.02753,0.03557,0.04367,0.05747,0.0034,-0.05951,0.02554,0.04761,0.05751,0.0052,-0.07241,0.03109,-0.06002,0.02322,0.06838,-0.05223,-0.04125,0.01092,-0.01242,-0.01902,-0.01863,0.13983,-0.03386,0.04513,0.05794,-0.04637,0.05663,-0.07609,-0.00342,0.04557,-0.00053,-0.07856,-0.02084,0.08029,-0.03718,-0.00532,-0.08461,-0.10974,-0.02127,-0.04845,0.01944,0.02828,0.02745,-0.02962,-0.05809,-0.03095,0.05092,-0.01519,0.04833,-0.02811,-0.01585,-0.00023,-0.06496,0.02399,0.07134,-0.09927,-0.05898,-0.03868,0.01898,0.0332,0.02873,0.02293,-0.05349,0.00188,0.03818,-0.05003,0.06154,0.04349,0.06214,-0.02324,-0.06466,-0.03023,-0.04195,-0.01073,-0.05964,-0.00928,0.02176,-0.03533,-0.0489,-0.05454,0.01143,0.0447,-0.06521,-0.04131,0.08779,0.05577,0.04804,0.07825,0.09081,-0.00551,0.0006,0.08272,-0.01841,-0.0501,-0.06563,-0.02437,0.0531,-0.03462,0.0675,0.05254,0.03528,0.07369,-0.05216,0.05829,-0.00085,-0.06357,-0.00658,0.01431,-0.04544,0.02413,0.03245,0.03291,0.03344,0.02626,0.04037,0.00386,-0.03592,0.01479,0.0415,0.10152,-0.0288,0.04098,-0.07894,-0.01014,-0.06569,-0.08517,0.0157,-0.05115,0.04856,0.04614,-0.07378,-0.03093,0.0173,-0.01046,0.06497,0.00956,-0.07041,0.04032,-0.02139,-0.07008,0.00993,0.07265,-0.07361,-0.03102,0.01387,0.00869,-0.07884,0.06226,-0.0523,-0.05246,-0.00919,-0.03396,-0.06295,-0.01751,-0.02131,-0.09301,0.03041,0.03601,-0.03452,0.04944,-0.06704,-0.01516,0.08031,0.04915,-0.03,0.02013,0.02948,0.01429,0.04481,0.03852,-0.01161,-0.01888,0.01134,-0.03936,0.03928,0.06955,-0.01694,-0.00586,-0.01163,-0.06743,-0.02805,0.06505,-0.05846,-0.09602,0.05424,0.03859,0.04356,0.05233]},{"id":"project-2#1","docId":"project-2","title":"PugliaHack 2026","category":"project","tags":["Hackathon","React 19","TailwindCSS","Supabase","Agri-tourism"],"text":"La soluzione prevede ruoli distinti per turisti, agricoltori e Pubblica Amministrazione, includendo prenotazione di esperienze, gamification con crediti, tracciamento della CO2 e dashboard con KPI in tempo reale. Ruolo di Vito: Solo Developer. Periodo: Maggio 2026. Stack: React 19, TanStack Query, TailwindCSS, Supabase (PostgreSQL).","vec":[0.01889,-0.01886,-0.03183,-0.05145,0.06234,-0.06981,-0.00885,0.04544,0.04225,0.01422,0.05255,-0.00313,0.03238,-0.03407,-0.01449,0.05993,0.08934,-0.03794,-0.04364,-0.05535,0.04221,0.01418,-0.05107,0.03439,0.09645,0.03508,-0.05482,0.01492,0.04809,-0.00804,-0.04599,-0.01431,0.03285,-0.1176,0.04884,0.02369,-0.05062,-0.03859,0.04844,-0.07334,-0.04189,0.02169,0.04782,0.01486,0.02448,0.08582,-0.03667,0.01212,-0.03725,-0.00712,-0.02324,0.05727,0.05781,0.01247,0.02432,-0.03595,-0.0623,-0.05769,-0.01044,0.03041,0.06825,0.02145,0.003,0.02899,0.08102,0.04835,0.00769,0.02882,-0.0608,-0.04919,-0.02262,0.03971,0.01297,-0.03561,-0.02057,0.03001,0.09008,-0.04493,0.02952,-0.08306,-0.06127,-0.06883,-0.05774,0.06896,-0.06035,0.0239,0.08942,-0.10204,0.09613,-0.03134,0.0784,0.06914,-0.03735,-0.06669,-0.0414,-0.04649,0.01786,0.09044,0.05296,-0.04283,0.03331,-0.04174,0.05337,-0.15542,-0.02464,0.01348,0.04768,-0.04332,0.08073,-0.07119,-0.02972,0.06214,0.02549,0.03506,-0.09497,-0.03773,-0.01565,-0.0725,0.02082,-0.06512,0.05458,-0.04972,-0.04897,-0.07838,-0.04119,-0.04952,0.00595,0.09148,-0.00418,0.01224,0.00215,0.01927,0.04472,0.02935,0.02553,0.04887,-0.03777,-0.03688,-0.01566,-0.03818,-0.00944,0.05726,-0.06646,0.00546,0.01666,0.03775,0.09162,-0.03414,0.04378,-0.04123,0.05728,-0.06386,0.0685,-0.01467,0.06729,-0.04862,-0.08745,-0.07839,0.06138,0.09217,-0.06295,-0.03863,-0.04332,-0.0434,-0.06911,-0.04374,0.03957,0.02652,-0.06446,-0.00711,-0.03254,0.11184,-0.02677,0.16462,0.00112,0.06558,-0.05563,0.06421,0.08367,0.0361,0.00314,-0.04353,-0.06738,-0.08089,-0.06291,-0.03566,-0.06279,0.01591,-0.00594,-0.04426,-0.0059,0.08101,-0.04032,-0.05374,-0.02868,0.06871,-0.04611,0.06911,0.04789,0.07642,0.01523,-0.06392,0.02799,0.04145,0.049,-0.01784,-0.05274,0.00418,-0.04939,0.04587,0.06984,-0.05251,-0.07302,0.04587,0.03845,0.00548,-0.03717,0.11385,-0.01941,0.06085,0.04412,-0.00573,0.04799,-0.07059,0.00624,0.0272,0.02356,-0.06896,-0.02884,0.07994,-0.00797,-0.01782,-0.07944,-0.0955,-0.01203,-0.05159,0.01181,0.023,0.0057,-0.03678,-0.06585,0.0151,0.03729,-0.02142,0.07349,-0.01597,-0.00859,0.02773,-0.05459,0.03239,0.05338,-0.08352,-0.07181,-0.05375,-0.01194,0.05806,0.02617,0.02221,-0.07378,0.03003,0.03213,-0.03956,0.07521,0.04005,0.02836,-0.0457,-0.02694,-0.03257,-0.02521,-0.04246,-0.06334,0.0073,0.02133,-0.04401,-0.05833,-0.01868,0.01363,0.06746,-0.10847,-0.06477,0.07385,0.03922,0.03769,0.04695,0.05078,-0.05528,-0.02671,0.09068,-0.02785,-0.0771,-0.05238,-0.03081,0.05898,-0.05794,0.05943,0.05858,0.0256,0.05746,-0.04441,0.06221,0.00007,-0.0364,0.0181,0.02197,-0.0764,-0.00626,0.01619,0.01518,0.0397,0.06858,0.06471,0.0115,-0.05197,0.00342,0.05492,0.08884,-0.00734,0.07314,-0.0497,-0.05909,-0.03658,-0.08316,-0.00551,-0.05856,0.04358,0.05481,-0.06839,-0.0402,0.02664,-0.01087,0.06244,-0.02771,-0.06782,0.07475,-0.02245,-0.05909,-0.00282,0.02476,-0.05383,-0.02848,0.01694,0.03199,-0.03427,0.03344,-0.00377,-0.05127,0.0339,0.02854,-0.07033,0.01245,0.02765,-0.10045,0.03808,0.02456,-0.04338,0.04042,-0.06002,-0.00504,0.05868,0.02605,-0.01784,-0.0358,0.03816,0.02203,0.06807,0.01661,-0.02843,-0.02221,0.02729,-0.04392,0.04538,0.06377,-0.00384,0.01191,-0.04103,-0.07409,-0.0313,0.02901,-0.02363,-0.08535,0.06731,0.02251,0.05439,0.07748]},{"id":"project-2#2","docId":"project-2","title":"PugliaHack 2026","category":"project","tags":["Hackathon","React 19","TailwindCSS","Supabase","Agri-tourism"],"text":"Risultati: Tempo dev.: 2 ore (Finestra di sviluppo estremamente ridotta.); Ruoli: 3 (Turisti, Agricoltori, PA.); Stack: Modern Web (React 19 + Supabase.).","vec":[0.01906,-0.01283,-0.01727,-0.04519,0.07401,-0.06322,0.02291,0.03588,0.04881,0.01909,0.02562,0.02988,0.02373,-0.05308,-0.04607,0.08029,0.05828,-0.04015,-0.04384,-0.06993,0.02926,0.02601,-0.06894,0.00884,0.09456,0.01796,-0.05733,0.01598,0.02823,-0.03567,-0.01228,-0.02951,0.05019,-0.0948,0.02962,0.00873,-0.0188,-0.02013,0.03698,-0.06022,-0.02124,0.03268,0.06262,0.0346,0.0143,0.0852,-0.04363,0.06418,-0.03501,-0.02408,0.00187,0.04217,0.07597,0.03452,0.01932,-0.0519,-0.02084,-0.10559,-0.04287,0.04266,0.07484,-0.00108,0.00639,0.03931,0.09014,0.05498,0.01912,0.02322,-0.06444,-0.04935,-0.00891,0.04549,-0.00225,-0.06193,-0.03926,0.01426,0.07966,-0.05836,0.01242,-0.06882,-0.08228,-0.05288,-0.05859,0.05373,-0.06675,0.03514,0.08057,-0.06737,0.07911,-0.04574,0.10597,0.07991,-0.05345,-0.06903,-0.03826,-0.04777,0.00998,0.06947,0.07083,-0.01513,0.0349,-0.05394,0.0485,-0.11101,-0.03217,0.05288,0.03961,-0.05565,0.09454,-0.02425,-0.07109,0.04543,0.01781,0.0151,-0.06923,-0.02978,0.005,-0.0587,-0.00518,-0.08844,0.06802,-0.0123,-0.05598,-0.05033,-0.0473,-0.0277,0.03615,0.05703,-0.00405,0.01931,-0.00708,-0.00471,0.02436,0.0316,0.0158,0.05269,-0.0703,-0.02983,-0.00375,-0.06616,-0.0234,0.07438,-0.01948,0.01697,0.03416,0.0495,0.07311,-0.02202,0.04663,-0.05595,0.05803,-0.08122,0.06469,0.00373,0.05075,-0.01913,-0.10385,-0.06494,0.06553,0.09029,-0.06108,-0.02601,-0.04187,-0.03825,-0.05636,-0.04641,0.02494,0.03937,-0.03567,-0.01198,-0.03734,0.10807,-0.01227,0.13198,0.02148,0.04963,-0.05889,0.06151,0.10357,0.0591,-0.02691,-0.04729,-0.07042,-0.07217,-0.04595,-0.01022,-0.07715,-0.00675,-0.00094,-0.03768,0.01343,0.08124,-0.03704,-0.01978,-0.02818,0.06092,-0.03925,0.03735,0.03808,0.05704,0.01204,-0.05107,0.05273,0.01406,0.07207,-0.00201,-0.05517,0.01672,-0.05848,0.05459,0.06032,-0.05994,-0.0793,0.01901,0.02816,0.0107,-0.03455,0.10821,-0.01577,0.06157,0.05832,-0.01907,0.06364,-0.06379,0.0162,0.05892,0.00858,-0.08106,-0.03965,0.08647,-0.03418,-0.02834,-0.07189,-0.08474,-0.01009,-0.04806,0.02299,0.02613,-0.01077,-0.04807,-0.05298,0.01564,0.04428,0.00118,0.05566,-0.04371,-0.01952,0.0142,-0.03748,0.02731,0.06799,-0.0976,-0.09912,-0.0731,0.01295,0.04048,0.02833,0.03023,-0.03654,0.01263,0.02087,-0.03953,0.06779,0.03765,0.05943,-0.04828,-0.03662,-0.03398,-0.03791,-0.04597,-0.08709,0.01988,0.04809,-0.03662,-0.05798,-0.05554,-0.0111,0.07503,-0.07639,-0.08317,0.08442,0.04611,0.04997,0.04326,0.0495,-0.02573,-0.00815,0.08185,-0.02297,-0.07254,-0.03155,-0.02557,0.05543,-0.046,0.05413,0.03819,0.01157,0.04836,-0.06422,0.06514,-0.01144,-0.04742,0.00106,0.03708,-0.06853,0.02154,0.01396,0.01623,0.03921,0.04173,0.06865,-0.01038,-0.02428,-0.00934,0.05735,0.11604,-0.03174,0.07612,-0.04718,-0.03862,-0.05692,-0.09549,-0.00147,-0.07536,0.01606,0.07137,-0.07276,-0.02477,-0.00327,-0.00108,0.0755,-0.00205,-0.06484,0.07109,-0.05397,-0.04435,-0.01359,0.03189,-0.03735,-0.03102,0.03004,0.02708,-0.05668,0.03401,-0.05545,-0.05203,0.00324,0.0125,-0.05697,0.01141,0.01318,-0.10037,0.03711,0.01666,-0.03039,0.03538,-0.08236,-0.0454,0.08054,0.01006,-0.04418,-0.01725,0.04484,0.03932,0.07043,0.03462,0.00451,-0.02727,0.03423,-0.06341,0.05816,0.06823,-0.0095,-0.0032,-0.01618,-0.07592,-0.01835,0.05735,-0.04293,-0.09725,0.05388,0.02696,0.08996,0.05829]},{"id":"project-3#0","docId":"project-3","title":"Hackathon \"Space Edition\"","category":"project","tags":["Hackathon","Space Tech","Agri-Tech","Innovation"],"text":"2° Classificato. Collaborazione all'ideazione di un progetto per una costellazione di piccoli satelliti dedicati all'agricoltura. The Pulse: Monitoraggio agricolo globale satellitare. Hackathon organizzato da Talent Garden e Leonardo a Milano. Mi sono classificato al 2° posto collaborando all'ideazione di \"The Pulse\", un progetto per una costellazione di piccoli satelliti dedicata al monitoraggio agricolo globale, integrando logiche di telerilevamento e AI.","vec":[0.04694,-0.00153,-0.03729,-0.06752,0.07749,-0.04569,0.00828,0.04908,0.0065,-0.00117,0.05688,0.02081,0.03706,-0.00589,-0.01123,0.07744,0.06784,-0.01161,-0.03958,-0.08009,0.02092,0.01395,-0.05891,0.03845,0.07236,0.0496,-0.03114,0.02792,0.02592,-0.01462,-0.0285,-0.0377,0.05059,-0.06408,0.06901,0.03085,-0.02554,-0.0775,0.04904,-0.05886,-0.00309,0.03415,0.038,0.04353,0.03919,0.08669,-0.06576,0.07611,-0.06951,0.01303,-0.05094,0.05334,0.06927,0.04708,0.05991,-0.03694,-0.0657,-0.09688,-0.05341,0.01891,0.04415,0.00951,0.0234,0.0601,0.07629,0.05,0.04538,0.07934,-0.05874,-0.05778,-0.06776,0.04945,0.0189,-0.06939,0.0535,0.0287,0.0558,-0.08139,0.02623,-0.05602,-0.08273,-0.06438,-0.05675,0.04694,-0.06631,0.04087,0.09188,-0.08151,0.05243,-0.05057,0.06042,-0.00939,-0.05462,-0.08004,-0.08616,-0.06443,-0.00364,0.07728,0.0396,-0.0429,0.04266,-0.03607,0.01892,-0.07287,-0.03659,0.01769,0.0726,-0.04865,0.04326,-0.04035,-0.03219,0.03649,0.06092,0.01598,-0.06545,-0.05569,-0.02318,-0.11761,0.05853,-0.05944,0.09437,-0.06626,-0.04642,-0.072,-0.07992,-0.01238,-0.00983,0.07719,0.03133,0.04155,-0.00901,0.04448,-0.00201,0.03765,0.03991,0.07776,-0.05058,-0.00728,0.01029,-0.05922,-0.05808,0.09261,-0.01967,0.03403,0.05604,0.04436,0.09275,-0.03536,0.05349,-0.01945,0.02701,-0.05202,0.04906,0.03043,0.0479,-0.00525,-0.06972,-0.0387,0.07244,0.10114,-0.05062,-0.03391,-0.04672,-0.04559,-0.06651,-0.08465,-0.0198,0.02878,-0.09416,-0.01752,-0.04928,0.09383,-0.03846,0.10405,0.0132,0.06188,-0.038,0.02198,0.07976,0.01841,-0.01029,-0.02142,-0.09962,-0.03343,-0.03922,-0.07589,-0.02249,0.00622,0.00261,-0.04105,-0.00773,0.07107,-0.03175,-0.08506,-0.04175,0.09399,-0.01574,0.0156,0.0531,0.08459,-0.00067,-0.08088,0.02267,0.05905,0.07283,0.00432,-0.04673,0.0089,-0.0646,0.03178,0.04911,-0.0445,-0.03172,0.04122,-0.00876,-0.02256,-0.0322,0.09568,-0.03261,0.01923,0.07219,-0.01797,0.09306,-0.06252,0.00871,0.07663,0.00929,-0.06938,-0.00483,0.06429,-0.02758,-0.02668,-0.07765,-0.07457,-0.01849,-0.0544,0.01507,0.00186,0.01807,-0.03878,-0.04849,-0.02595,0.01463,-0.05577,0.0483,-0.04968,0.00347,0.01717,-0.0816,0.03308,0.06145,-0.11025,-0.04704,-0.06275,-0.01158,0.06364,0.03458,0.02118,-0.09176,0.03397,0.02627,-0.07758,0.08743,0.0638,0.04567,0.00947,-0.06646,-0.00631,-0.03539,-0.02034,-0.04996,0.0151,-0.00422,-0.03033,-0.01404,-0.0528,0.0452,0.06725,-0.03153,-0.00431,0.04487,0.04304,0.08067,0.05189,0.08807,-0.01471,-0.0578,0.08375,-0.01789,-0.00126,-0.06906,-0.0292,-0.00036,-0.02917,0.08888,0.03318,0.03049,0.06394,-0.0406,0.08373,0.01361,-0.03886,0.00639,0.03225,-0.04635,0.0487,0.01154,-0.00944,0.02612,0.04857,0.0485,0.04324,-0.07945,-0.02037,0.05086,0.06399,-0.01779,0.01447,-0.05613,-0.04059,-0.09657,-0.0734,0.00576,-0.04401,-0.01815,0.04672,-0.0508,-0.06635,-0.01024,0.00708,0.03902,-0.02149,-0.05927,0.02256,-0.04275,-0.03241,-0.01367,0.07966,-0.06175,-0.01883,0.05869,0.02216,-0.0699,0.07166,-0.0342,-0.04997,0.02197,-0.05282,-0.05907,0.01098,0.03019,-0.07252,0.03795,0.03958,-0.06753,0.04592,-0.07807,-0.014,0.04056,0.03503,-0.05156,-0.0749,0.04163,0.0093,0.05547,0.03681,-0.02081,-0.03688,0.01353,-0.00221,0.01213,0.04679,-0.00563,-0.03566,-0.02083,-0.01068,-0.02438,0.01673,-0.03108,-0.07808,0.0507,0.03351,0.07121,0.04444]},{"id":"project-3#1","docId":"project-3","title":"Hackathon \"Space Edition\"","category":"project","tags":["Hackathon","Space Tech","Agri-Tech","Innovation"],"text":"Ruolo di Vito: Team Member. Periodo: Maggio 2026. Stack: Ideation, Team Collaboration, Space/Agri Tech. Risultati: Piazzamento: 2° Posto (Hackathon nazionale Talent Garden x Leonardo.); Focus: Satelliti (Monitoraggio agricolo globale.).","vec":[0.04517,-0.01032,-0.03755,-0.03367,0.09949,-0.05447,-0.02165,0.03953,0.06612,0.02081,0.03958,-0.00619,0.04427,-0.05265,0.00393,0.06237,0.06571,-0.02286,-0.04636,-0.07479,0.03807,0.01129,-0.05098,0.02633,0.07146,0.06127,-0.05502,0.00151,0.04135,-0.04328,-0.02707,-0.0418,0.05425,-0.05195,0.06267,0.00489,-0.04207,-0.05881,0.01165,-0.07274,-0.0067,0.03179,0.01027,0.022,0.04471,0.06659,-0.06919,0.05825,-0.044,-0.02358,-0.0517,0.04705,0.06173,0.02469,0.03094,-0.00616,-0.06678,-0.05052,-0.02894,0.03125,0.03109,0.02308,0.00136,0.05114,0.0593,0.05202,0.04452,0.04427,-0.07737,-0.03636,-0.08719,0.0424,0.02412,-0.03526,0.0143,0.0461,0.09311,-0.06542,0.03182,-0.0612,-0.08559,-0.05354,-0.07316,0.03513,-0.06588,0.02015,0.08921,-0.08019,0.09299,-0.02456,0.05669,0.03827,-0.06148,-0.06992,-0.05526,-0.05426,0.01302,0.07175,0.02497,-0.02775,0.04271,-0.03666,0.04152,-0.0923,-0.02984,0.02451,0.05776,-0.03782,0.06309,-0.03023,-0.02133,0.06382,0.03921,0.02487,-0.06336,-0.05335,-0.02586,-0.12779,0.01217,-0.05771,0.09019,-0.05661,-0.009,-0.08938,-0.07742,-0.04282,0.01037,0.10639,0.01711,0.05259,-0.00263,0.02635,0.0119,0.03904,0.03277,0.05275,-0.04509,-0.00687,0.00642,-0.01914,-0.04258,0.08166,-0.07478,0.01314,0.04594,0.03612,0.07571,-0.02604,0.06292,-0.05454,0.01796,-0.07292,0.05715,0.0312,0.06634,-0.03823,-0.0672,-0.04537,0.0651,0.11533,-0.03599,-0.04801,-0.04993,-0.05104,-0.04508,-0.0747,0.00524,0.03745,-0.06151,0.02023,-0.06436,0.11273,-0.02261,0.11282,0.00294,0.08005,-0.05958,0.03519,0.10409,0.03978,-0.02399,-0.00368,-0.0998,-0.039,-0.06633,-0.05757,-0.05696,0.00594,-0.00999,-0.03968,0.00972,0.08618,-0.04365,-0.05618,-0.03318,0.05811,-0.02373,0.05988,0.05844,0.06439,-0.04156,-0.07499,0.02244,0.04101,0.05917,-0.00344,-0.0365,-0.00838,-0.04612,0.02779,0.03958,-0.05064,-0.06389,0.00913,-0.00196,0.02078,-0.02188,0.10815,-0.04245,0.05105,0.06542,-0.00044,0.09875,-0.06348,-0.00099,0.06836,-0.00349,-0.04944,-0.04065,0.0619,-0.01516,0.0034,-0.09513,-0.07374,-0.01155,-0.03843,0.0308,0.0036,0.0307,-0.02889,-0.07452,-0.00033,-0.00878,-0.05774,0.0576,-0.0171,-0.01621,0.03853,-0.05205,0.04826,0.03288,-0.09931,-0.05962,-0.09217,-0.02063,0.04229,0.0368,0.02531,-0.09798,0.03205,0.0093,-0.01497,0.0641,0.02624,0.04885,-0.0104,-0.06638,-0.01223,-0.05206,-0.02045,-0.05111,-0.00217,0.02715,-0.04842,-0.02729,-0.05103,0.02231,0.07882,-0.06806,-0.02814,0.06281,0.00354,0.06857,0.04486,0.10953,-0.03431,-0.03334,0.05629,-0.0473,-0.06536,-0.06969,-0.04585,0.04769,-0.05136,0.0698,0.05291,0.01354,0.06407,-0.04491,0.07105,-0.02499,-0.03099,0.03376,0.01913,-0.04575,0.03651,0.03675,0.0086,0.04547,0.05416,0.04619,0.02613,-0.05914,0.01651,0.08881,0.06321,0.01934,0.05621,-0.06296,-0.06741,-0.08973,-0.05593,-0.02395,-0.03653,0.02319,0.05802,-0.06585,-0.05617,0.02218,0.00006,0.04362,-0.05683,-0.06669,0.04637,-0.02607,-0.06352,-0.00801,0.05475,-0.05581,-0.02782,0.05363,0.04153,-0.05477,0.08358,-0.01184,-0.05068,0.05494,-0.04597,-0.06056,0.03006,0.01937,-0.10264,0.03184,0.02739,-0.04233,0.05422,-0.04542,-0.0322,0.03866,0.02012,-0.03398,-0.03779,0.03507,0.02625,0.04766,0.04491,0.01128,-0.05735,0.04943,-0.01334,0.00835,0.06669,-0.01101,-0.03254,-0.05307,-0.03489,-0.01342,0.01262,-0.0309,-0.07215,0.05717,0.03194,0.07484,0.07032]},{"id":"project-4#0","docId":"project-4","title":"LACAM-SWAP · Orchestratore Multi-Agente","category":"project","tags":["LangGraph","Multi-Agent","Recommender Systems","RAG","Thesis"],"text":"Progetto di tesi: architettura multi-agente LLM orchestrata con LangGraph per raccomandazioni. Include RAG ibrido (BM25 + FAISS). Ottimizzazione Multi-Metrica nei Sistemi di Raccomandazione. Progetto di tesi sviluppato durante il tirocinio curriculare (marzo–giugno 2025) presso il laboratorio LACAM-SWAP dell'Università di Bari.","vec":[0.03467,-0.00334,-0.06121,-0.07111,0.08217,-0.04379,0.06527,0.05283,0.00354,0.00066,0.07895,0.01179,0.06598,-0.00526,0.00717,0.05332,0.07818,-0.05968,-0.06668,-0.06154,0.01986,0.0085,-0.04928,0.01002,0.06563,0.04259,-0.02475,0.00215,0.05906,-0.01128,-0.03459,-0.05038,0.07201,-0.03112,0.04028,0.03452,-0.02389,-0.05654,0.05493,-0.07104,0.01983,0.03693,0.05437,0.08085,0.0225,0.06121,-0.02285,0.02553,-0.01342,-0.03805,-0.04364,0.05953,0.09039,0.05412,0.05513,-0.05825,-0.06028,-0.11381,-0.04668,0.02425,0.04536,-0.01879,-0.01245,0.02813,0.082,0.08732,0.03918,0.04357,-0.09091,-0.09124,-0.08914,0.04631,-0.03977,-0.09674,-0.00822,0.02646,0.09714,-0.07209,0.04523,-0.00504,-0.06828,-0.02495,-0.05202,0.02959,-0.03636,0.07497,0.06372,-0.08561,-0.00599,-0.00806,0.02318,0.05606,-0.05126,-0.06325,-0.04937,-0.0817,-0.02778,0.10744,0.07613,-0.06629,0.01442,-0.06896,0.01673,-0.08289,-0.04038,-0.00124,0.03462,-0.0599,0.04159,-0.03688,-0.0132,0.04896,0.04066,0.0385,-0.02815,-0.07099,-0.04138,-0.00704,0.05918,-0.04938,0.02386,-0.0312,-0.06994,-0.07374,-0.03788,-0.01901,0.00938,0.05266,0.03789,0.02667,-0.0108,0.0148,0.02542,0.07423,0.07926,0.077,-0.055,0.01961,-0.03952,-0.01935,-0.06778,0.04223,-0.0943,0.04277,0.05019,0.03468,0.1063,-0.04672,0.06093,-0.02803,0.03115,-0.00184,0.07763,0.06039,0.02673,-0.01743,-0.07047,-0.05761,0.06613,0.06234,-0.04816,-0.04908,-0.04971,-0.0465,-0.02675,-0.01896,0.03524,0.04866,-0.02015,-0.03048,-0.05395,0.10834,-0.0053,0.08144,0.00732,0.05372,-0.07908,0.02769,0.1096,0.06898,-0.04525,-0.01174,-0.09458,-0.06053,-0.07994,-0.07287,-0.05194,-0.00931,0.00541,-0.05894,-0.01023,0.03978,-0.07032,-0.04842,-0.01037,0.06164,-0.02334,0.02258,0.02433,0.0573,0.01764,-0.07276,-0.03227,0.04346,0.05417,0.05998,-0.06787,0.00809,-0.04884,0.0238,0.00329,-0.02573,-0.01638,0.03446,-0.01528,-0.02016,-0.00599,0.04877,-0.0204,0.01902,0.066,-0.04172,0.05438,-0.03654,-0.00451,0.02747,0.06073,-0.06339,-0.0662,0.02768,-0.03964,-0.0393,-0.09649,-0.06134,-0.01831,-0.0534,0.02563,0.05813,0.00901,-0.03978,-0.06912,-0.0149,-0.01531,-0.0497,0.02843,-0.077,-0.03758,0.02655,-0.05688,0.09417,0.05303,-0.05204,-0.04413,-0.02571,0.00385,0.02383,0.05355,0.02153,-0.03864,0.04034,0.05921,-0.04663,0.07351,0.01145,0.06508,0.05021,-0.08608,-0.02027,-0.0189,-0.05575,0.02483,0.03517,0.00268,-0.01503,-0.04212,-0.07407,0.00381,0.10791,-0.04133,-0.04623,0.05121,0.04029,0.05001,0.05174,0.03484,0.0223,-0.02101,0.05815,-0.03083,-0.02396,-0.03462,-0.03694,0.08565,-0.03062,0.08942,0.06042,0.01893,0.05391,-0.08272,0.04368,0.00932,-0.0016,0.01627,0.02982,-0.05115,0.05541,0.0061,0.00837,0.05367,0.0476,0.07364,0.02228,-0.07366,0.00057,0.04635,0.04828,0.03578,0.04246,-0.0948,-0.06428,-0.06265,-0.07546,-0.02769,-0.06119,0.06741,0.05713,-0.08712,-0.04588,0.04815,-0.04498,0.04752,-0.02369,-0.06312,0.04974,-0.05006,-0.04861,-0.00566,0.06679,-0.04889,-0.03467,0.04165,0.01578,-0.09855,0.06185,-0.02726,-0.06089,0.04193,-0.01652,0.00548,0.00161,0.03354,-0.13672,0.06156,0.04219,-0.05318,0.04733,-0.0734,-0.01339,0.06953,0.0499,-0.04417,-0.07498,0.01955,0.02985,0.04237,0.01049,-0.02363,-0.01723,-0.01043,-0.03274,0.05917,0.03702,-0.03337,-0.01216,-0.01343,-0.0432,-0.03123,0.05633,-0.0416,-0.08149,0.02071,0.01865,0.0386,0.06235]},{"id":"project-4#1","docId":"project-4","title":"LACAM-SWAP · Orchestratore Multi-Agente","category":"project","tags":["LangGraph","Multi-Agent","Recommender Systems","RAG","Thesis"],"text":"Ho implementato un'architettura multi-agente basata su LLM (Llama 3.2 3B Instruct), orchestrata con LangGraph, che coordina agenti specializzati su precisione e copertura del catalogo tramite un agente aggregatore. L'architettura include anche un sistema RAG ibrido (BM25 + FAISS). Ruolo di Vito: AI Research Intern. Periodo: Marzo–Giugno 2025 · 3 mesi. Stack: LangGraph, Python, Llama 3.2, FAISS, BM25.","vec":[0.02216,-0.01541,-0.05942,-0.04724,0.08908,-0.05151,0.0389,0.04911,0.013,0.00239,0.05708,-0.00207,0.05697,-0.01449,0.03266,0.0446,0.09654,-0.06868,-0.05751,-0.06767,0.01355,0.01216,-0.04315,0.00766,0.08215,0.04765,-0.00151,0.00995,0.07521,-0.02827,-0.03159,-0.0657,0.0646,-0.03142,0.02767,0.0306,-0.02438,-0.05595,0.05156,-0.06827,0.01068,0.04953,0.03633,0.07272,0.02983,0.04368,-0.03771,0.02717,-0.0374,-0.01834,-0.02849,0.06679,0.08396,0.05795,0.05562,-0.04932,-0.05998,-0.12043,-0.02615,0.00115,0.0494,-0.0133,-0.02253,0.03791,0.05537,0.07632,0.03341,0.04535,-0.10109,-0.09119,-0.08592,0.03519,-0.03519,-0.09271,-0.00886,0.02008,0.07781,-0.05192,0.03499,-0.02219,-0.07026,-0.03758,-0.04115,0.03624,-0.02773,0.07328,0.06328,-0.09338,0.02261,-0.04124,0.02541,0.06815,-0.03063,-0.07404,-0.04729,-0.0728,-0.03075,0.08609,0.07764,-0.05684,-0.00281,-0.06317,0.02942,-0.08426,-0.02612,0.01329,0.03645,-0.08023,0.05734,-0.04282,-0.03163,0.05837,0.03838,0.04258,-0.04344,-0.049,-0.02101,-0.02592,0.04413,-0.03062,0.0294,-0.04482,-0.07229,-0.0807,-0.0368,-0.01917,0.00686,0.05637,0.0204,0.02137,-0.00609,0.02044,0.01885,0.06828,0.07593,0.07616,-0.03267,0.02554,-0.0481,-0.03577,-0.04701,0.01075,-0.07503,0.00589,0.04917,0.04242,0.08917,-0.04527,0.06858,-0.02015,0.03678,-0.01747,0.07752,0.05852,0.03328,-0.03692,-0.05964,-0.06007,0.05589,0.07837,-0.07403,-0.05059,-0.06118,-0.05227,-0.0274,-0.00381,0.02392,0.07599,-0.03545,-0.01772,-0.07728,0.11262,0.00353,0.08591,-0.0038,0.0613,-0.08396,0.02135,0.12634,0.05579,-0.06564,-0.02347,-0.10413,-0.06704,-0.09656,-0.03944,-0.06499,-0.01615,-0.02331,-0.03628,0.00643,0.03132,-0.0658,-0.05603,-0.01522,0.06145,-0.02479,0.03081,0.04262,0.06938,0.00754,-0.07419,-0.02192,0.03136,0.05526,0.05002,-0.07582,0.02243,-0.03632,0.00834,0.02575,-0.02721,-0.04027,0.02874,-0.00018,-0.03283,0.01229,0.0649,-0.03314,0.02894,0.0772,-0.03121,0.05423,-0.05409,-0.00664,0.02261,0.04412,-0.0664,-0.06753,0.04193,-0.03787,-0.02299,-0.07127,-0.07637,-0.01924,-0.03941,0.0352,0.05726,0.01934,-0.04156,-0.06688,-0.00527,-0.01904,-0.02342,0.01352,-0.0671,-0.02333,0.0204,-0.03251,0.10081,0.04367,-0.07272,-0.05221,-0.02481,-0.00909,0.03543,0.02261,0.0457,-0.05049,0.04821,0.04579,-0.02046,0.06912,0.00293,0.03332,0.03303,-0.08672,-0.02107,-0.00733,-0.06141,0.02492,0.03903,0.0104,-0.00619,-0.05603,-0.06025,0.01377,0.11955,-0.04451,-0.04928,0.07642,0.05152,0.0346,0.04261,0.0414,-0.00614,-0.03784,0.05226,-0.02832,-0.0549,-0.01597,-0.02559,0.10225,-0.02879,0.08514,0.04572,0.03394,0.05213,-0.09343,0.04187,0.00619,0.01917,0.01979,0.02703,-0.05013,0.04508,0.02215,0.02569,0.05517,0.04823,0.08499,0.0157,-0.06335,0.00959,0.04709,0.03303,0.03691,0.04684,-0.05991,-0.07358,-0.06396,-0.0763,-0.03646,-0.05537,0.05814,0.06707,-0.08084,-0.04611,0.04471,-0.03145,0.05505,-0.0199,-0.06444,0.05519,-0.05689,-0.0429,-0.00787,0.07611,-0.0495,-0.02838,0.05081,0.01787,-0.0971,0.0609,-0.03193,-0.06229,0.0705,-0.0305,-0.01341,-0.01106,0.04396,-0.12359,0.07132,0.03884,-0.04483,0.04075,-0.05802,-0.01821,0.04622,0.06525,-0.0382,-0.08397,0.02447,0.04676,0.03766,0.01206,-0.0129,-0.02416,-0.01112,-0.01494,0.0499,0.04929,-0.03748,-0.03027,-0.0162,-0.03713,-0.03081,0.04364,-0.03761,-0.0961,0.0485,0.02648,0.06548,0.07005]},{"id":"project-4#2","docId":"project-4","title":"LACAM-SWAP · Orchestratore Multi-Agente","category":"project","tags":["LangGraph","Multi-Agent","Recommender Systems","RAG","Thesis"],"text":"Risultati: Novelty: +12% (Miglioramento novità del catalogo raccomandato.); Precisione: -0.5% (Delta minimo rispetto al baseline massimizzato.); Dataset: MovieLens 1M (Testato su benchmark standard.). Link: GitHub https://github.com/Hellvisback365/LLM.git.","vec":[0.0446,-0.01322,-0.07659,-0.0677,0.04587,-0.03738,0.06708,0.02422,0.0272,0.0006,0.06742,0.03587,0.06947,-0.01388,0.01186,0.06835,0.07343,-0.0342,-0.0764,-0.06901,0.01446,0.01128,-0.05876,-0.03943,0.07892,0.04916,-0.01847,0.00922,0.06151,-0.04587,0.00816,-0.0489,0.04307,-0.0523,-0.01123,0.04724,-0.02755,-0.0494,0.08521,-0.07311,0.01052,0.02377,0.01102,0.06088,0.03278,0.01714,0.00292,0.03503,-0.02693,-0.03335,-0.01816,0.05541,0.0736,0.04422,0.05727,-0.05272,-0.06618,-0.10159,-0.02563,-0.0263,0.03864,-0.04162,-0.01501,0.05371,0.09103,0.11972,0.0339,0.04659,-0.11955,-0.04739,-0.10352,0.04497,-0.00736,-0.08359,0.01027,0.03006,0.05155,-0.07155,-0.00229,-0.04349,-0.06367,-0.02599,-0.03638,0.0234,-0.04376,0.07456,0.06443,-0.09101,0.01165,-0.0011,-0.00166,0.05286,-0.06409,-0.07249,-0.05522,-0.07289,0.00803,0.09772,0.05449,-0.0606,0.03952,-0.06268,0.03337,-0.04231,-0.0319,0.03333,0.06417,-0.05556,0.05117,-0.04148,-0.05046,0.05787,0.04952,0.03818,-0.02907,-0.08733,-0.02196,-0.0188,0.06071,-0.04994,0.02848,-0.00771,-0.05681,-0.07585,-0.03832,-0.01362,0.01616,0.04788,-0.01134,-0.0065,0.00313,0.01514,-0.02377,0.10087,0.05227,0.06755,-0.02293,0.04182,-0.05067,-0.05781,-0.07088,0.0198,-0.05239,0.03436,0.0512,0.02128,0.10497,-0.05448,0.07757,-0.04625,0.04581,-0.05646,0.07464,0.06139,0.04556,-0.03742,-0.04673,-0.03534,0.04013,0.08354,-0.05404,-0.07007,-0.04506,-0.063,-0.01203,-0.03511,0.02195,0.10399,-0.04686,-0.03757,-0.05109,0.09998,-0.01324,0.08312,0.00644,0.05926,-0.06954,0.01733,0.10313,0.05522,-0.0551,-0.05161,-0.07036,-0.03909,-0.08537,-0.07046,-0.06602,0.00413,-0.01989,-0.02129,-0.02043,0.0193,-0.04678,-0.05414,-0.01864,0.02342,-0.00279,0.02576,0.018,0.05488,-0.00046,-0.067,-0.01948,0.02514,0.08053,0.04572,-0.09071,0.05059,-0.00946,0.02931,0.02149,-0.02908,-0.03866,0.03003,-0.03244,-0.01405,0.00217,0.03662,-0.04017,0.03088,0.0664,-0.01555,0.05404,-0.04514,-0.02843,0.05471,0.03042,-0.06907,-0.06205,0.05014,-0.03607,-0.06058,-0.05366,-0.06537,-0.04166,-0.05166,0.00995,0.03288,0.00381,-0.04978,-0.05593,-0.03882,0.0183,-0.03182,0.02503,-0.05276,-0.04129,0.02403,-0.02979,0.12992,0.03055,-0.0738,-0.02181,-0.02065,-0.00598,-0.00394,0.0439,-0.00639,-0.04112,0.02325,0.03704,-0.03842,0.07903,0.01814,0.03321,0.02896,-0.07494,-0.02541,-0.0222,-0.06987,-0.04907,0.02875,0.01479,-0.00147,-0.07521,-0.02934,0.03054,0.10899,-0.09835,-0.05951,0.08315,-0.00125,0.04769,0.07276,0.06701,-0.03211,-0.02028,0.06985,-0.00508,-0.03801,-0.01677,-0.04135,0.0551,-0.04052,0.06829,0.0462,0.02261,0.0794,-0.03946,0.03537,0.0208,0.02072,0.01957,0.04099,-0.04911,0.0502,0.00129,-0.01667,0.04929,0.05987,0.10567,0.01857,-0.03562,0.00001,0.06292,0.05325,0.00679,0.04776,-0.04021,-0.06478,-0.0743,-0.08771,-0.01879,-0.0451,0.04995,0.07722,-0.09381,-0.03043,0.06851,-0.03345,0.02326,-0.02988,-0.04939,0.05276,-0.04631,-0.04861,-0.02474,0.05886,-0.07757,-0.02023,0.04786,0.03469,-0.09851,0.04182,-0.02445,-0.05982,0.07023,-0.03652,-0.01875,0.02516,0.03638,-0.12276,0.06503,0.03971,-0.02882,0.05348,-0.05451,-0.03514,0.06347,0.07252,-0.07092,-0.0869,0.0339,0.06997,0.06718,0.02365,-0.01552,-0.00607,0.00698,-0.03289,0.05767,0.04199,-0.01536,0.007,-0.00562,-0.02542,-0.02316,0.02859,-0.04328,-0.06677,0.02383,0.01201,0.07836,0.07122]},{"id":"project-5#0","docId":"project-5","title":"B.Future Challenge 2025 · BOOM (CRIF)","category":"project","tags":["n8n","Gemini","API","Workflow Automation"],"text":"Sviluppo backend in team di Zenith, assistente AI con workflow automatizzato per la digitalizzazione della consulenza aziendale. Zenith: Assistente AI per digitalizzare la consulenza. Hackathon multidisciplinare in team di 6 persone per VAR Group. Abbiamo sviluppato Zenith, assistente AI per automatizzare il processo di consulenza aziendale. Mi sono occupato della pipeline backend: orchestrazione tramite n8n, integrazione con Google Gemini e archiviazione su Google Drive.","vec":[0.01714,0.0066,-0.07334,-0.06313,0.06812,-0.04403,0.02912,0.0204,0.02641,0.0374,0.05208,0.00682,0.03317,-0.05582,-0.00607,0.03659,0.04318,-0.01882,-0.07324,-0.1021,0.02977,-0.02203,-0.06044,0.06291,0.03635,0.04762,-0.06714,0.00855,0.05058,-0.03877,-0.06235,-0.05044,0.08186,-0.09619,0.08605,0.0212,-0.05713,-0.02134,0.04911,-0.0669,-0.02076,0.02859,-0.00279,0.03128,0.04033,0.07568,-0.03556,0.02713,-0.04091,-0.02852,-0.03181,0.0642,0.02732,0.01676,0.06593,-0.03809,-0.04674,-0.09204,-0.04235,0.00964,0.04953,-0.04109,0.04114,0.02495,0.06367,0.08372,-0.00542,0.04856,-0.06334,-0.06753,-0.06458,0.09896,0.01842,-0.06985,0.02873,0.01046,0.02981,-0.06629,0.04141,-0.06064,-0.11363,-0.01095,-0.01735,0.06789,-0.0731,0.05277,0.01103,-0.06833,0.0652,-0.00051,0.0656,0.05132,-0.06501,-0.02871,-0.05854,-0.03733,-0.09138,0.09899,0.07744,-0.0367,0.03362,-0.08803,0.03791,-0.07923,0.00382,0.04065,-0.01595,-0.07316,0.058,-0.03983,-0.05247,0.07538,0.05824,0.03365,-0.08735,0.00155,-0.04723,-0.05086,0.04866,-0.0559,0.04994,0.00733,-0.05822,-0.07483,-0.07077,-0.0778,-0.0095,0.07131,0.0795,0.00605,0.01411,0.03529,0.02398,0.03507,0.07262,0.13027,-0.06141,-0.00829,-0.04246,-0.06009,-0.03898,0.0685,-0.01482,0.04177,0.06838,0.03052,0.122,-0.02731,0.03624,-0.03647,0.04031,-0.03512,0.08646,0.03358,0.04667,-0.03221,-0.06733,0.01085,0.07117,0.04649,-0.04664,-0.06446,-0.04365,-0.00746,-0.03686,0.001,0.02098,0.02002,-0.07819,-0.02415,-0.05335,0.10859,-0.04068,0.05492,0.03056,0.05279,-0.06296,0.0496,0.05982,0.03256,-0.02733,-0.01933,-0.06398,-0.06264,-0.06847,-0.00731,-0.05004,0.03525,-0.03828,-0.05429,0.02475,0.03212,-0.01058,-0.07403,-0.03071,0.05544,-0.05494,0.06432,0.0632,0.0273,0.0039,-0.04839,0.04869,0.00439,0.03968,-0.01034,-0.05105,0.05662,-0.09981,0.04733,0.06268,-0.03989,-0.06195,0.02145,-0.02962,-0.04411,0.01202,0.03007,-0.03344,0.0022,0.06559,-0.02333,0.05141,-0.08572,0.00717,0.02836,0.01987,-0.10323,-0.07543,0.04819,-0.06032,-0.01003,-0.07221,-0.05346,-0.01258,-0.07635,-0.00573,0.04252,0.03857,-0.00012,-0.04694,-0.03332,0.04223,-0.02827,0.04073,-0.06188,-0.00627,0.04287,-0.02911,0.07777,0.09472,-0.09664,-0.07266,-0.05367,0.00941,0.04676,0.04492,0.03014,-0.07472,0.0577,0.04547,-0.0543,0.04932,0.03036,0.03866,0.02889,-0.04326,0.01215,-0.01801,-0.00129,-0.05097,-0.00918,0.02247,-0.02761,-0.06583,-0.04002,0.00634,0.0808,-0.05276,-0.06699,0.07472,0.01467,0.03348,0.1083,0.07588,-0.00173,-0.01414,0.04332,-0.00759,-0.01603,-0.04172,-0.00975,0.04762,-0.01869,0.08416,0.00766,-0.01057,0.05229,-0.04482,0.06996,0.0291,-0.00022,0.01584,0.00967,-0.07,0.02813,-0.00361,0.01389,0.00419,0.0071,0.06088,0.0445,0.0001,-0.03148,0.04001,0.03984,-0.03355,0.00746,-0.08557,-0.03597,-0.095,-0.05844,-0.00633,-0.03398,0.02014,0.06929,-0.05661,-0.00109,0.05873,0.04067,-0.00321,-0.09609,-0.08558,0.05153,-0.02547,-0.0268,0.00882,0.10236,-0.02624,-0.01311,0.02289,0.00006,-0.05686,0.05576,-0.00651,-0.03798,0.03475,-0.0291,-0.08161,0.01041,0.07758,-0.1083,0.043,0.01412,-0.04442,0.03864,-0.05253,-0.00134,0.02007,0.02257,-0.04814,-0.04284,0.06964,0.00435,0.01395,0.02381,0.01495,-0.03155,0.03249,-0.06208,0.06074,0.07949,-0.02971,-0.03411,-0.00491,-0.05546,-0.04212,0.02333,-0.05779,-0.06549,0.06654,0.05166,0.08435,0.08315]},{"id":"project-5#1","docId":"project-5","title":"B.Future Challenge 2025 · BOOM (CRIF)","category":"project","tags":["n8n","Gemini","API","Workflow Automation"],"text":"Il prototipo stimava un abbattimento drastico dei tempi di lavorazione. Ruolo di Vito: Backend AI Developer. Periodo: Settembre–Novembre 2025. Stack: n8n, Google Gemini, Google Drive API. Risultati: Tempo report: 7gg → 1gg (Riduzione drastica stimata dei tempi di produzione.); Team: 6 persone (Collaborazione multidisciplinare.); Stack: n8n + Gemini (Pipeline backend automatizzata.). Link: GitHub https://github.com/Hellvisback365/ChallengeBoomVarGroup2025.git.","vec":[-0.01413,-0.01013,-0.03602,-0.04653,0.06737,-0.0604,0.00594,0.01621,0.04255,-0.0067,0.05916,-0.0154,0.04761,-0.05303,0.00981,0.0394,0.0585,-0.00756,-0.06792,-0.091,0.04437,-0.00051,-0.0617,0.06803,0.0821,0.04141,-0.07987,0.01568,0.05224,-0.03634,-0.05102,-0.05293,0.04159,-0.07961,0.06675,-0.00161,-0.05349,-0.03068,0.04718,-0.06496,-0.03727,0.01528,-0.05276,0.04076,0.03581,0.05684,-0.0206,0.04339,-0.04032,-0.04406,-0.02849,0.0809,0.05341,0.00478,0.04631,0.01584,-0.02924,-0.05543,-0.04423,0.03003,0.08523,-0.01812,0.00728,0.04249,0.07958,0.09079,-0.0115,0.04595,-0.05795,-0.05879,-0.05347,0.06938,0.02863,-0.05123,0.01688,0.06718,0.04426,-0.07351,0.0345,-0.0749,-0.06978,-0.03826,-0.03826,0.03856,-0.07216,0.03482,0.02922,-0.07731,0.079,-0.01873,0.04246,0.09868,-0.09081,-0.02741,-0.04201,-0.05809,-0.05972,0.08643,0.06023,0.0124,0.05969,-0.09385,0.05974,-0.11007,-0.01459,0.01921,-0.00606,-0.06345,0.09606,-0.05304,-0.05907,0.05004,0.03166,0.05523,-0.08781,-0.02414,-0.01919,-0.05021,0.02343,-0.07912,0.06961,-0.01351,-0.04636,-0.07739,-0.07249,-0.05949,0.01463,0.07282,0.02944,0.02956,0.03669,0.029,0.02144,0.05416,0.03934,0.06328,-0.05127,-0.03657,-0.01804,-0.04877,-0.03686,0.06554,-0.03492,0.04687,0.04903,0.02009,0.09999,-0.03326,0.03002,-0.03925,0.02924,-0.06737,0.07119,0.04126,0.06424,-0.04132,-0.08917,-0.01964,0.05023,0.08613,-0.0442,-0.05963,-0.05289,-0.02941,-0.04432,-0.01281,0.0188,0.04131,-0.07995,-0.01861,-0.06662,0.10406,-0.01524,0.06054,0.02176,0.04381,-0.03894,0.06482,0.07159,0.05934,-0.02653,-0.02759,-0.08371,-0.0642,-0.05618,-0.01498,-0.03886,0.01604,0.00167,-0.02424,0.02753,0.06311,-0.03965,-0.04404,-0.02283,0.03177,-0.04875,0.05034,0.05327,-0.00044,0.0094,-0.01564,0.04005,0.01504,0.04876,0.00678,-0.04764,0.03194,-0.0457,0.07358,0.07041,-0.05453,-0.08324,0.0271,-0.01618,-0.02105,-0.0092,0.03483,-0.01124,0.05258,0.05724,-0.03202,0.04321,-0.08848,0.00412,0.03216,0.00025,-0.11206,-0.05886,0.02346,-0.02532,0.0009,-0.06365,-0.05635,0.00067,-0.06025,0.03177,0.04428,0.01407,-0.00476,-0.06322,-0.04083,0.01659,-0.01856,0.03815,-0.04663,-0.04059,0.03527,-0.01671,0.0375,0.08524,-0.10652,-0.08549,-0.07179,-0.00376,0.05854,0.02598,0.06063,-0.07695,0.07947,0.0322,-0.03648,0.06418,0.03248,0.02054,-0.01253,-0.04315,-0.00423,-0.06325,-0.00986,-0.037,0.01886,0.01605,-0.04669,-0.06126,-0.03237,0.0258,0.07737,-0.08893,-0.08242,0.08401,0.03231,0.05163,0.08556,0.06331,-0.02222,-0.05763,0.06641,-0.0143,-0.0574,-0.03889,-0.02741,0.08151,-0.01625,0.06377,0.01387,0.00991,0.03787,-0.06524,0.04364,-0.01479,-0.00876,0.02652,0.01726,-0.08172,0.06091,0.02366,0.01737,0.01216,0.02891,0.06803,0.06519,-0.01884,-0.00562,0.03992,0.07598,-0.0067,0.05653,-0.08689,-0.06929,-0.08293,-0.06801,-0.00672,-0.06847,0.0428,0.05302,-0.0731,0.01445,0.10591,0.0034,0.02546,-0.04072,-0.06248,0.04984,-0.02396,-0.07046,0.01429,0.0643,-0.03065,0.00132,0.05221,0.0206,-0.049,0.04481,-0.03837,-0.05046,0.01196,-0.03136,-0.08879,0.01716,0.02047,-0.11474,0.06922,0.03474,-0.03692,0.03872,-0.04681,-0.01833,0.03477,0.02572,-0.05376,-0.02052,0.07585,0.02515,0.01481,0.02251,0.00254,-0.01888,0.05315,-0.05303,0.02854,0.06802,-0.01557,-0.01929,-0.03414,-0.03635,-0.00033,0.00051,-0.06625,-0.10192,0.07003,0.03776,0.09287,0.0826]},{"id":"project-6#0","docId":"project-6","title":"BeFluent","category":"project","tags":["React","Node.js","Accessibilità","JavaScript","UX Design"],"text":"Applicazione web React+Node.js progettata per aiutare bambini con dislessia attraverso un'interfaccia intuitiva e accessibile. Web app per supporto alla dislessia. BeFluent è un'applicazione web progettata per aiutare bambini con dislessia attraverso un'interfaccia intuitiva e accessibile. L'app utilizza tecnologie React per il frontend e Node.js per il backend, offrendo esercizi personalizzati e feedback adattivi.","vec":[0.0348,0.02219,-0.04162,-0.10071,0.09456,-0.02766,0.039,0.03559,-0.00921,0.02232,0.07056,-0.02163,0.07922,-0.0241,-0.03926,0.06588,0.04512,-0.05294,-0.0666,-0.08315,0.04738,-0.00553,-0.08023,0.00275,0.09336,0.02781,-0.00807,0.02816,-0.00962,-0.03746,-0.06438,-0.06363,0.04829,-0.07326,0.07198,0.03154,-0.01265,-0.06294,0.08543,-0.09378,0.01338,0.03936,0.06136,0.05125,0.04501,0.04973,-0.01401,0.02832,-0.02302,-0.03628,0.00972,0.08624,0.00554,0.03748,0.0536,-0.06533,-0.04525,-0.03781,-0.08393,-0.03238,0.07354,-0.01544,0.0076,0.01518,0.0707,0.08366,-0.01567,0.01679,-0.06384,-0.07121,-0.02298,0.08948,0.03529,-0.02105,0.00179,0.00915,-0.0035,-0.06044,0.04601,-0.05924,-0.08061,-0.05882,-0.03986,0.01666,-0.04773,0.07545,0.02133,-0.08599,0.06102,0.00336,0.07722,0.02289,-0.11085,-0.04592,-0.11392,-0.02298,-0.01135,0.09034,0.02601,-0.04371,0.0085,-0.05158,0.04192,-0.10183,-0.04311,0.00935,0.05097,-0.05723,0.05633,-0.03807,-0.05402,0.06915,0.10069,0.02957,-0.06769,-0.02922,-0.01618,-0.0476,0.03703,-0.03485,0.03257,-0.00968,-0.09785,-0.10101,-0.06757,-0.05375,0.01417,0.05204,0.01806,0.05692,0.03661,0.06349,0.05067,0.072,0.02192,0.06936,-0.06449,0.00467,-0.02592,-0.0519,-0.02842,0.08634,-0.01944,0.04968,0.06421,0.08584,0.1153,-0.0316,0.0541,-0.05012,0.02621,-0.0051,0.03233,0.01112,0.06745,-0.05732,-0.05222,-0.02449,0.07395,0.10057,-0.08926,-0.0387,-0.06246,-0.01349,-0.05872,-0.04041,-0.00047,0.06491,-0.0286,-0.05263,-0.04951,0.06741,-0.03403,0.09889,0.0491,0.06567,-0.06233,0.07229,0.03377,0.01436,0.00047,0.01573,-0.06941,-0.07499,-0.089,-0.03574,-0.05395,0.04339,0.00309,-0.03916,0.02413,0.00886,-0.00194,-0.0739,-0.03959,0.07078,-0.04397,0.05795,0.03116,-0.00806,0.00733,-0.06109,0.0345,-0.00187,0.08725,-0.02114,-0.09007,0.00926,-0.07088,0.02906,0.02122,-0.03637,-0.05578,-0.00657,-0.03473,-0.01723,-0.01516,0.03104,-0.03009,-0.00393,0.03484,-0.01807,0.02884,-0.06339,-0.03841,0.05994,0.03675,-0.07211,-0.03123,0.03887,-0.02805,-0.01887,-0.0118,-0.0518,-0.01466,-0.08001,0.00574,0.01838,0.02972,-0.06323,-0.02974,-0.0546,0.03411,-0.06463,0.02442,-0.05597,0.00919,0.04183,-0.03759,0.02344,0.0886,-0.07894,-0.02297,-0.05929,-0.01565,0.09082,0.03089,0.08743,-0.09072,0.07062,-0.00819,-0.03032,0.04096,0.08194,0.07015,-0.00648,-0.06602,-0.01627,-0.05554,-0.01681,-0.0576,0.00965,0.0145,-0.04659,-0.03577,0.00816,-0.01348,0.051,-0.04126,-0.05375,0.04215,0.061,0.02165,0.09174,0.02128,-0.00447,0.00817,0.05579,-0.00836,-0.01376,-0.04323,-0.03856,0.04342,0.00564,0.03988,0.00737,0.01951,0.02755,-0.06765,0.1076,0.0107,-0.06336,-0.00393,0.0504,-0.09297,0.05245,0.03714,0.00889,0.04798,0.02615,0.03724,0.05105,-0.03965,-0.04662,0.00001,0.08689,-0.02624,0.02507,-0.07473,-0.04831,-0.05605,-0.06311,0.01567,-0.04413,0.01878,0.01856,-0.07403,-0.01896,0.07484,-0.02525,0.05684,-0.04776,-0.03002,0.08139,-0.06741,-0.02027,-0.00416,0.03604,-0.04167,-0.00651,0.03842,0.02403,-0.08506,-0.02407,0.00842,-0.06682,0.05678,-0.05134,-0.04018,0.02177,0.0202,-0.07836,0.07807,0.04662,-0.04686,0.07357,-0.0576,-0.0462,0.06902,0.05518,-0.0314,-0.04558,0.02062,0.01252,0.08278,0.02791,-0.03572,0.00177,0.03748,-0.03658,0.0543,0.10249,-0.01311,-0.01567,-0.01171,0.00512,-0.03563,0.03385,-0.05927,-0.04601,0.0663,0.03684,0.05764,0.05274]},{"id":"project-6#1","docId":"project-6","title":"BeFluent","category":"project","tags":["React","Node.js","Accessibilità","JavaScript","UX Design"],"text":"La soluzione è stata progettata con un focus sull'accessibilità e sulla facilità d'uso, permettendo un'esperienza di apprendimento inclusiva e coinvolgente. Ruolo di Vito: Developer. Periodo: Progetto Universitario. Stack: React, Node.js, JavaScript, CSS, Express. Risultati: Target: Bambini (Interfaccia pensata per utenti con dislessia.); Stack: React + Node.js (Frontend moderno e backend robusto.); Focus: Accessibilità (Design inclusivo e facilità d'uso.).","vec":[0.00245,0.014,-0.02537,-0.06371,0.08978,-0.05657,0.02372,0.03755,0.02719,0.0136,0.06012,-0.01788,0.09516,-0.01421,-0.0293,0.05775,0.06831,-0.04779,-0.08625,-0.05654,0.07202,-0.00504,-0.05392,0.0253,0.10436,0.0493,-0.01269,0.03183,0.00126,-0.04018,-0.04744,-0.05773,0.02492,-0.09002,0.06864,0.02266,-0.04587,-0.05542,0.05486,-0.09826,-0.00146,0.02997,0.03409,0.05259,0.0511,0.06032,-0.01233,0.02559,-0.01905,-0.03723,-0.00398,0.10392,0.03135,0.03073,0.05004,-0.05628,-0.03671,-0.02933,-0.05497,-0.03009,0.07832,0.01479,0.00938,0.02011,0.06242,0.05876,-0.01214,-0.00881,-0.05672,-0.05688,-0.03133,0.06352,0.02044,-0.00583,-0.01281,0.03391,0.02563,-0.07269,0.04308,-0.07014,-0.07331,-0.06706,-0.05349,0.03275,-0.04816,0.04584,0.04081,-0.10599,0.09285,0.00251,0.06073,0.0417,-0.11563,-0.06464,-0.10361,-0.02412,0.01733,0.09792,0.03705,-0.02877,-0.01154,-0.04615,0.05886,-0.09866,-0.0411,0.00584,0.03927,-0.04005,0.07384,-0.05023,-0.03916,0.06286,0.05907,0.0455,-0.07977,-0.02119,0.01088,-0.05558,0.02986,-0.05552,0.04466,-0.02909,-0.0554,-0.08681,-0.06472,-0.03524,0.01806,0.06649,0.00713,0.04986,0.0277,0.06045,0.04418,0.04965,0.02782,0.0954,-0.06305,0.00186,-0.01527,-0.02928,-0.02603,0.0625,-0.04409,0.04615,0.05801,0.06516,0.07195,-0.04088,0.06286,-0.05602,0.04357,-0.02168,0.02196,0.02456,0.05849,-0.07023,-0.05634,-0.042,0.08424,0.12575,-0.07307,-0.02454,-0.05525,-0.00255,-0.07891,-0.03776,0.00151,0.06859,-0.02607,-0.03371,-0.05346,0.07869,-0.0237,0.12443,0.04261,0.04459,-0.06049,0.06654,0.05814,0.03003,-0.00144,-0.01259,-0.10019,-0.0661,-0.09951,-0.03972,-0.06277,0.02615,0.01782,-0.03658,0.01686,0.0263,0.00157,-0.0811,-0.02769,0.04727,-0.05327,0.06379,0.04383,0.02003,0.00193,-0.05609,0.0227,-0.01301,0.08034,-0.02644,-0.09054,-0.00477,-0.05399,0.02887,0.0222,-0.05908,-0.07886,-0.00656,-0.02145,0.01627,-0.01394,0.04173,-0.02594,0.01971,0.03349,-0.00905,0.03816,-0.06394,-0.04247,0.04377,0.03333,-0.0776,-0.03031,0.05596,-0.02658,-0.01862,-0.04894,-0.06644,-0.01273,-0.08379,0.03424,0.02718,0.00346,-0.04886,-0.02743,-0.05703,0.01231,-0.06193,0.03287,-0.04409,-0.00756,0.06841,-0.03815,0.04405,0.08369,-0.08874,-0.05736,-0.05022,-0.02707,0.05715,0.03014,0.08814,-0.09868,0.05477,-0.01888,-0.03357,0.04435,0.05942,0.06394,0.01296,-0.07406,-0.04085,-0.05169,-0.01485,-0.03954,0.00857,0.04549,-0.03089,-0.01925,-0.00551,0.00616,0.06833,-0.06745,-0.06685,0.03516,0.04991,0.03492,0.07728,0.01451,-0.01843,-0.00273,0.05612,0.00943,-0.02688,-0.05205,-0.04222,0.05,-0.00893,0.07018,0.01399,0.01681,0.03286,-0.05495,0.10959,0.01743,-0.04821,0.03451,0.02284,-0.11979,0.03951,0.01963,0.0058,0.03543,0.05559,0.03855,0.04675,-0.04665,-0.04185,0.03455,0.08687,-0.01807,0.03618,-0.07059,-0.05407,-0.05393,-0.08112,0.0102,-0.02214,-0.00018,0.03244,-0.06724,-0.01188,0.08373,-0.03187,0.0643,-0.0381,-0.04871,0.04778,-0.07344,-0.04172,-0.02517,0.04015,-0.0444,-0.00716,0.03564,0.02893,-0.06664,-0.02353,0.01867,-0.04503,0.04374,-0.04251,-0.049,0.03819,0.02189,-0.0842,0.09746,0.04693,-0.04385,0.06511,-0.0681,-0.02375,0.07971,0.06415,-0.0376,-0.05336,0.00905,0.00404,0.06065,0.02356,-0.00871,-0.0146,0.03734,-0.03843,0.05525,0.09124,-0.02567,-0.01458,-0.01743,-0.04013,-0.0293,0.01855,-0.04976,-0.04511,0.06371,0.02483,0.0862,0.0617]},{"id":"project-6#2","docId":"project-6","title":"BeFluent","category":"project","tags":["React","Node.js","Accessibilità","JavaScript","UX Design"],"text":"Link: GitHub https://github.com/Hellvisback365/BeFluentVITO.git.","vec":[0.02549,-0.0136,-0.05469,-0.06805,0.08418,-0.01786,0.02278,0.02321,0.03995,-0.04221,0.05305,-0.01929,0.10229,-0.06376,-0.03648,0.04776,0.07322,-0.05921,-0.05678,-0.0563,0.05079,-0.01637,-0.04783,0.0269,0.08193,0.06482,-0.01736,0.01098,0.08016,-0.07182,-0.00853,-0.01671,0.01016,-0.07312,0.06913,0.01596,-0.04094,-0.06185,0.05511,-0.06822,-0.00091,0.04039,0.03873,0.06325,0.02969,0.02651,-0.01028,0.00801,-0.00418,-0.00952,-0.01398,0.11865,0.01832,0.00465,0.06275,-0.0719,-0.02722,-0.04629,-0.07316,0.02261,0.07129,-0.00564,0.03158,0.00913,0.08672,0.06154,0.00882,0.01681,-0.04389,-0.00498,-0.06542,0.07801,0.01556,-0.00222,0.0754,0.01503,0.0118,-0.07031,0.03264,-0.04953,-0.10195,-0.06838,-0.04586,0.03012,-0.05171,0.06719,0.06767,-0.0911,0.09177,-0.01554,0.03523,0.03509,-0.08075,-0.04147,-0.0997,-0.08522,-0.01421,0.09098,0.0489,-0.01705,0.0595,-0.05965,0.0655,-0.11438,-0.08241,0.0377,0.06349,-0.08103,0.0221,-0.04735,-0.03128,0.04208,0.06777,0.04467,-0.06781,-0.01388,-0.03596,-0.04038,0.02458,-0.05718,0.03715,-0.0066,-0.04032,-0.07233,-0.04773,-0.02545,0.03626,0.07436,0.01846,-0.01231,0.01768,0.07448,0.0379,0.07266,0.01423,0.08939,-0.0422,0.00247,-0.01237,-0.02403,-0.05326,0.02539,-0.01292,0.05187,0.0525,0.0585,0.09679,-0.05997,0.06001,-0.0305,0.04986,-0.03129,0.02765,0.03329,0.07071,-0.06059,-0.0273,-0.06743,0.04797,0.11825,-0.07288,-0.07149,-0.04788,0.0086,-0.07255,-0.01077,0.00386,0.06139,-0.07322,-0.03084,-0.04131,0.05693,-0.01032,0.06514,0.02436,0.07136,-0.06139,0.04882,0.07118,0.04333,-0.01802,-0.03854,-0.02669,-0.04084,-0.0745,-0.0214,-0.02152,0.04489,0.00775,-0.04751,-0.02399,0.03939,-0.05627,-0.05179,-0.06632,-0.00755,-0.04874,0.05576,0.03877,0.04274,-0.03269,-0.05308,0.03433,0.04279,0.08723,0.00521,-0.07604,0.02851,-0.06699,0.00002,0.05106,-0.07637,-0.08223,0.01956,-0.06729,-0.00035,-0.03571,0.07183,-0.01499,0.01908,0.03677,0.0005,0.02503,-0.06679,-0.07528,0.04592,0.05329,-0.0676,-0.05117,0.03283,-0.07652,-0.02323,-0.04298,-0.06392,-0.05106,-0.0656,-0.02481,0.03417,0.03889,-0.02,-0.0198,-0.07226,0.0384,-0.10051,0.07038,-0.02048,-0.01287,0.04453,0.01345,0.03691,0.06831,-0.05155,-0.03729,-0.01469,-0.01075,0.08769,0.04349,0.06296,-0.07145,0.06222,-0.03059,-0.03479,0.07882,0.03091,0.03912,0.0425,-0.07654,-0.06698,-0.06272,-0.03661,-0.05906,-0.00495,0.03841,-0.08887,-0.02683,-0.02289,0.01111,0.07773,-0.06934,-0.04493,0.0397,0.02758,0.05096,0.03952,0.02525,-0.02913,-0.00773,0.04037,0.00073,-0.03791,-0.02944,-0.05473,0.03064,-0.03153,0.05197,0.07142,0.00304,0.05553,-0.0694,0.0628,-0.02407,-0.05189,0.02963,0.01763,-0.1112,0.05552,0.01436,0.04089,0.03683,0.04978,0.08314,0.08492,-0.06072,-0.04021,0.03692,0.04678,-0.01648,0.0386,-0.04382,-0.01904,-0.05179,-0.04585,-0.03227,-0.04939,0.00799,0.05202,-0.06648,-0.01107,0.04902,0.00916,0.03621,-0.03902,-0.0513,0.03798,-0.04993,-0.01545,-0.00678,0.03068,-0.06194,-0.05736,0.01934,0.00503,-0.04986,0.01814,-0.03892,-0.08814,0.07488,-0.04117,-0.03193,0.03045,0.04831,-0.07736,0.01712,0.03436,-0.02438,0.10375,-0.0681,-0.03031,0.05561,0.05653,-0.05112,-0.0102,0.01116,0.06957,0.06198,0.05664,-0.02238,0.02299,0.02604,-0.04162,0.06878,0.0817,-0.02857,-0.00904,-0.04619,-0.04091,-0.03651,0.01707,-0.06309,-0.07967,0.05509,0.03104,0.04887,0.06671]},{"id":"project-7#0","docId":"project-7","title":"POSD System","category":"project","tags":["Privacy","GDPR","MVC","Sicurezza","Python"],"text":"Soluzione software privacy-oriented con architettura MVC, progettata per garantire conformità GDPR e sicurezza dei dati. Privacy-Oriented System Design conforme GDPR. POSD System (Privacy-Oriented System Design) è una soluzione software che implementa un'architettura MVC con focus sulla conformità GDPR. Il sistema è progettato per garantire la sicurezza dei dati utente end-to-end, con crittografia avanzata e controlli di accesso granulari.","vec":[0.05058,-0.01501,-0.07185,-0.06885,0.02397,-0.07322,0.05483,0.03135,0.05699,-0.00457,0.02659,0.00351,0.09207,-0.03227,-0.02056,0.08484,0.0643,-0.03622,-0.02848,-0.05978,0.03909,-0.01267,-0.05918,-0.01647,0.11405,0.04932,-0.01112,-0.01018,0.0394,-0.02308,-0.10357,0.00696,0.07952,-0.09174,0.04017,0.05899,-0.03403,-0.02229,0.04893,-0.09212,-0.02175,0.04848,0.05885,0.10249,0.00971,0.04125,-0.04843,0.0142,-0.04607,0.03601,-0.00171,0.05122,0.06195,0.03737,0.0645,-0.01748,-0.04561,-0.05844,-0.10169,0.01744,0.05598,0.00655,0.03857,0.04559,0.08266,0.05272,0.03055,0.04061,-0.02945,-0.0841,-0.06316,0.05268,0.0338,-0.05357,-0.03386,-0.02714,0.04323,-0.05092,0.02932,-0.04232,-0.08186,0.02234,-0.03479,0.08368,-0.06024,0.04335,0.07178,-0.05728,0.03071,-0.05147,0.05315,0.01211,-0.05416,-0.08875,-0.06846,-0.07733,-0.0383,0.09013,0.04456,-0.03672,0.04194,-0.06029,0.07575,-0.06785,-0.02636,0.00102,0.01963,-0.06486,0.04163,-0.06615,-0.03141,0.01828,0.03974,0.06869,-0.08782,-0.01502,-0.02172,-0.05354,0.00199,0.00672,0.04393,-0.022,-0.09019,-0.06058,-0.05986,-0.0589,0.02214,0.02373,0.03918,0.03872,0.00183,0.04456,0.02195,0.05762,0.10237,0.09457,-0.06115,0.04183,-0.06779,-0.00626,-0.03572,0.09204,-0.0592,0.05397,0.01467,0.00734,0.05263,-0.03201,0.04532,-0.03515,0.08101,0.01647,0.10519,0.01223,0.07566,-0.00141,-0.0448,-0.03218,0.09274,0.06245,-0.03793,-0.06448,-0.06532,-0.01854,-0.02378,-0.05134,0.02039,0.0412,-0.05131,-0.06162,-0.0698,0.05571,-0.03434,0.10186,-0.02609,0.04684,-0.04184,0.01142,0.04828,0.03345,-0.01006,-0.02133,-0.05937,-0.08402,-0.05692,-0.05152,-0.04948,0.00618,-0.00264,-0.03612,-0.00193,0.03293,-0.01903,-0.07256,-0.03574,0.01977,-0.06008,0.02491,0.03615,0.02814,0.00849,-0.09274,-0.00172,0.0215,0.0487,0.03914,-0.04462,-0.00115,-0.08044,0.03366,0.07333,-0.04343,-0.06503,0.03661,-0.00325,-0.01013,-0.00933,0.05513,-0.02625,-0.01598,0.08166,-0.01118,0.04542,-0.10002,-0.06776,0.04736,0.01171,-0.09914,-0.03976,0.0355,-0.00562,-0.06048,-0.06429,-0.06638,-0.06593,-0.08908,-0.01449,-0.006,0.06863,-0.03244,-0.07681,-0.03959,0.00375,-0.03983,0.02105,-0.00446,0.00139,0.03399,-0.02748,0.06601,0.02371,-0.07201,-0.05663,-0.04636,-0.03547,0.06246,0.0311,0.03335,-0.0445,0.08363,0.03325,-0.03056,0.08023,0.06835,0.01375,-0.00599,-0.08134,-0.01347,-0.01242,-0.02279,-0.0053,0.02003,0.00051,-0.02649,-0.01151,-0.07389,0.01821,0.07612,-0.01395,-0.07859,0.06744,0.03526,0.09745,0.08457,0.01464,-0.03329,0.01311,0.05408,-0.04312,-0.01663,-0.00914,-0.06118,0.05357,-0.04711,0.09247,0.06313,0.05481,0.0437,-0.03096,0.08697,0.03198,-0.03856,-0.04349,0.02281,-0.05944,0.00909,-0.0261,-0.01219,0.02517,0.06205,0.00926,0.0432,-0.03587,-0.0457,0.04886,0.07748,-0.00251,0.03302,-0.06798,-0.03992,-0.0497,-0.10004,0.00409,-0.04549,0.04844,0.05194,-0.04905,-0.01245,0.05203,-0.0145,0.05558,-0.02288,-0.02453,0.02785,-0.0791,-0.04846,0.01025,0.08496,-0.1047,-0.00746,0.0563,0.04198,-0.08639,0.0328,-0.01826,-0.07339,0.04039,-0.07017,-0.0188,0.00218,0.08044,-0.09693,0.03908,0.07433,-0.03342,0.06131,-0.03286,-0.00783,0.06666,0.03678,-0.04436,-0.09413,0.03217,0.03198,0.06259,0.04384,-0.04109,0.0193,-0.00888,-0.01226,0.01862,0.06614,-0.03813,0.01278,0.01735,-0.00527,-0.03194,0.04513,-0.04659,-0.07664,0.02439,0.04317,0.03074,0.06769]},{"id":"project-7#1","docId":"project-7","title":"POSD System","category":"project","tags":["Privacy","GDPR","MVC","Sicurezza","Python"],"text":"La piattaforma include funzionalità per la gestione del consenso degli utenti e strumenti per l'analisi dell'impatto sulla privacy. Ruolo di Vito: Developer. Periodo: Progetto Universitario. Stack: Python, MVC Architecture, Crittografia, GDPR Compliance. Risultati: Standard: GDPR (Piena conformità alle normative europee.); Sicurezza: End-to-End (Crittografia avanzata dei dati.); Architettura: MVC (Design modulare e manutenibile.).","vec":[0.04462,-0.02109,-0.06549,-0.05317,0.01159,-0.08162,0.04439,0.06244,0.08367,-0.03181,0.02219,0.00892,0.09997,-0.03073,-0.01992,0.0565,0.07984,-0.02093,-0.01356,-0.05849,0.057,-0.01317,-0.05974,0.02018,0.10596,0.04249,-0.02296,-0.00123,0.00967,-0.03129,-0.0878,0.00071,0.07434,-0.09318,0.06581,0.03623,-0.04481,-0.02276,0.03715,-0.10517,-0.05101,0.03292,0.03084,0.08252,0.01088,0.07538,-0.04507,0.00004,-0.02631,0.0091,-0.01057,0.05441,0.06736,0.03828,0.06665,-0.01254,-0.00604,-0.03626,-0.05998,-0.0122,0.0505,0.00409,0.0445,0.04529,0.06569,0.05703,0.0229,0.03303,-0.04718,-0.08264,-0.06315,0.05002,0.01725,-0.03437,-0.00483,0.01435,0.05466,-0.05797,0.01382,-0.07769,-0.08853,-0.00955,-0.03808,0.0841,-0.03341,0.03902,0.0904,-0.09226,0.07602,-0.05599,0.04096,0.02646,-0.03758,-0.08509,-0.08294,-0.06894,-0.02227,0.11672,0.0548,-0.03511,0.00512,-0.04929,0.0566,-0.09011,-0.02745,0.01732,0.00294,-0.03889,0.05708,-0.07067,-0.04284,0.03965,0.0257,0.06934,-0.10188,-0.00902,0.00133,-0.06914,0.0111,-0.04894,0.0453,-0.02574,-0.05119,-0.09298,-0.05277,-0.08041,0.03325,0.05278,0.02992,0.03987,0.01094,0.07675,0.03137,0.06602,0.06794,0.08139,-0.0439,0.02132,-0.03325,-0.02267,-0.02838,0.07153,-0.03765,0.03778,-0.00154,0.00596,0.04719,-0.04577,0.0522,-0.05386,0.06063,-0.0057,0.08391,-0.00051,0.05249,-0.0246,-0.05647,-0.05582,0.09581,0.0897,-0.05517,-0.05204,-0.04544,-0.00746,-0.03689,-0.04144,0.02978,0.06091,-0.06751,-0.03263,-0.07463,0.07117,-0.02752,0.11215,0.0061,0.03439,-0.0382,0.01514,0.08387,0.04606,-0.00033,-0.03765,-0.04334,-0.10375,-0.04401,-0.06136,-0.03217,-0.03206,-0.01979,-0.03465,-0.00628,0.04825,-0.00475,-0.08284,-0.04524,0.02694,-0.07342,0.03039,0.03898,0.03128,-0.00326,-0.05104,0.03438,0.04812,0.05863,0.01635,-0.05519,-0.00172,-0.07873,0.04675,0.06438,-0.04857,-0.087,0.04789,0.01115,0.00427,-0.02607,0.05231,-0.02494,0.0077,0.10097,-0.00474,0.06505,-0.09589,-0.03095,0.05002,0.02273,-0.0928,-0.05328,0.03536,-0.02193,-0.04159,-0.08345,-0.07157,-0.05807,-0.06894,0.01764,0.02723,0.04947,-0.03355,-0.06883,-0.01952,0.02448,-0.02654,0.05179,-0.01494,-0.02472,0.07919,-0.03251,0.0726,0.02361,-0.08148,-0.03786,-0.06238,-0.04071,0.06478,0.04999,0.04212,-0.07206,0.05884,0.02636,-0.04066,0.0646,0.04137,0.03031,-0.01619,-0.08512,-0.008,-0.0327,-0.00286,-0.02304,0.00241,0.01485,-0.02455,-0.01481,-0.04247,0.01827,0.07895,-0.05995,-0.08518,0.0727,0.01943,0.08617,0.06372,0.03787,-0.03828,-0.01931,0.03598,-0.05552,-0.05068,-0.04455,-0.06426,0.04766,-0.05459,0.08058,0.08008,0.03953,0.03768,-0.04725,0.0668,0.03714,-0.03837,-0.01187,0.0285,-0.06835,-0.0063,-0.00672,0.00164,0.01624,0.05311,0.03317,0.04851,-0.03599,-0.03641,0.06821,0.05981,-0.00015,0.02327,-0.06765,-0.04936,-0.05287,-0.09013,-0.00046,-0.04992,0.03545,0.06326,-0.04286,-0.00593,0.06035,-0.01656,0.0605,-0.01777,-0.0324,0.01481,-0.06924,-0.07352,-0.00147,0.04833,-0.08699,0.0129,0.05118,0.02577,-0.07306,0.01748,-0.03134,-0.04477,0.02731,-0.05587,-0.01361,0.02219,0.09594,-0.09861,0.04844,0.05633,-0.02283,0.05792,-0.04242,-0.00297,0.06488,0.0493,-0.01991,-0.0782,0.02522,0.01263,0.04475,0.04693,-0.01892,0.01205,0.00897,-0.0139,0.01777,0.0758,-0.01522,0.00884,-0.02657,-0.02556,-0.02724,0.01743,-0.06517,-0.08201,0.05321,0.00509,0.06231,0.07611]}]}
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

