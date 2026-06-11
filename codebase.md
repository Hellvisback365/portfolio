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

# ({

```

```

# {

```

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

# models.json

```json

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
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "dev:turbo": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "rag:ingest": "tsx scripts/rag-ingest.ts"
  },
  "dependencies": {
    "@ai-sdk/openai": "^3.0.68",
    "@ai-sdk/react": "^3.0.200",
    "@getbrevo/brevo": "^3.0.1",
    "@gsap/react": "^2.1.2",
    "@headlessui/react": "^2.2.2",
    "@langchain/core": "^1.1.8",
    "@langchain/openai": "^1.1.3",
    "@langchain/textsplitters": "^1.0.1",
    "@react-three/drei": "^10.7.7",
    "@react-three/fiber": "^9.6.1",
    "@react-three/postprocessing": "^3.0.4",
    "@vercel/analytics": "^1.5.0",
    "@vercel/speed-insights": "^1.2.0",
    "ai": "^6.0.198",
    "clsx": "^2.1.1",
    "dotenv": "^16.4.5",
    "framer-motion": "^12.7.4",
    "fuse.js": "^7.4.2",
    "gsap": "^3.15.0",
    "langchain": "^1.2.3",
    "lenis": "^1.3.23",
    "maath": "^0.10.8",
    "next": "16.1.5",
    "next-themes": "^0.4.6",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-icons": "^5.5.0",
    "react-intersection-observer": "^9.16.0",
    "three": "^0.184.0",
    "web-vitals": "^3.5.2",
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

# scripts\generate-vectorstore.mjs

```mjs
/**
 * Generate vectorStore.json from profile documents WITHOUT requiring embedding APIs.
 * Uses zero-vectors as placeholders — the HybridRetriever will rely on
 * Fuse.js keyword search for retrieval, which works perfectly for a small corpus.
 * 
 * Run: node scripts/generate-vectorstore.mjs
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// Read the source documents
const docsPath = join(rootDir, 'src', 'content', 'profile', 'documents.json');
const documents = JSON.parse(readFileSync(docsPath, 'utf-8'));

console.log(`[VectorStore] Loaded ${documents.length} profile documents.`);

// Simple text chunking (similar to RecursiveCharacterTextSplitter)
function chunkText(text, chunkSize = 750, overlap = 120) {
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end).trim());
    if (end >= text.length) break;
    start = end - overlap;
  }
  return chunks.filter(c => c.length > 0);
}

// Dimension for the zero-vector (matches text-embedding-3-large default)
const VECTOR_DIM = 3072;
const zeroVector = new Array(VECTOR_DIM).fill(0);

const points = [];

for (const doc of documents) {
  const fullText = `${doc.title}\n\n${doc.body}`;
  const chunks = chunkText(fullText);

  for (let i = 0; i < chunks.length; i++) {
    points.push({
      id: randomUUID(),
      vector: zeroVector,
      pageContent: chunks[i],
      metadata: {
        id: doc.id,
        category: doc.category,
        title: doc.title,
        summary: doc.summary,
        tags: doc.tags || [],
        updatedAt: doc.updatedAt,
        chunkIndex: i,
      },
    });
  }
}

// Write the vector store
const outPath = join(rootDir, 'src', 'data', 'vectorStore.json');
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(points, null, 2), 'utf-8');

console.log(`[VectorStore] Generated ${points.length} chunks → ${outPath}`);

```

# scripts\rag-ingest.ts

```ts
import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import { Document } from '@langchain/core/documents';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { getProfileDocuments } from '@/lib/profileDocuments';
import { createEmbeddings } from '@/services/rag/embeddings';
import fs from 'node:fs/promises';
import path from 'node:path';

async function main() {
  const documents = getProfileDocuments();
  if (!documents.length) {
    throw new Error('No profile documents found. Please add entries to src/content/profile/documents.json.');
  }
  console.log(`[RAG] Loaded ${documents.length} profile documents.`);

  const langchainDocs = documents.map(
    (doc) =>
      new Document({
        pageContent: `${doc.title}\n\n${doc.body}`,
        metadata: {
          id: doc.id,
          category: doc.category,
          title: doc.title,
          summary: doc.summary,
          tags: doc.tags,
          updatedAt: doc.updatedAt,
        },
      })
  );

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 750,
    chunkOverlap: 120,
  });
  const splitDocs = await splitter.splitDocuments(langchainDocs);
  if (!splitDocs.length) {
    throw new Error('Chunking produced no documents. Check the splitter configuration.');
  }
  console.log(`[RAG] Created ${splitDocs.length} chunks.`);

  const embeddings = createEmbeddings();
  const chunkContents = splitDocs.map((doc) => doc.pageContent);
  const vectors = await embeddings.embedDocuments(chunkContents);
  
  const vectorStorePath = path.join(process.cwd(), 'src', 'data', 'vectorStore.json');
  await fs.mkdir(path.dirname(vectorStorePath), { recursive: true });

  const points = splitDocs.map((doc, idx) => {
    const metadata = {
      ...(doc.metadata ?? {}),
      chunkIndex: idx,
    };

    return {
      id: randomUUID(),
      vector: vectors[idx],
      pageContent: doc.pageContent,
      metadata,
    };
  });

  await fs.writeFile(vectorStorePath, JSON.stringify(points, null, 2), 'utf-8');
  console.log(`[RAG] Written ${points.length} chunks to ${vectorStorePath}.`);
}

main().catch((error) => {
  console.error('[RAG] Ingestion failed:', error);
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
import { z } from 'zod';
import { getVectorStore } from '@/services/rag/vectorStore';
import { streamText, generateObject, tool } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { semanticCache } from '@/services/rag/semanticCache';

export const maxDuration = 30;

const requestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system', 'data', 'tool']),
    content: z.string().optional().default(''),
    id: z.string().optional(),
    toolInvocations: z.array(z.any()).optional(),
  })).min(1),
});

function getEnvSafe() {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  const isStandardOpenAi = !process.env.OPENROUTER_API_KEY && !!process.env.OPENAI_API_KEY;
  return {
    apiKey,
    baseURL: process.env.OPENROUTER_BASE_URL || (isStandardOpenAi ? 'https://api.openai.com/v1' : 'https://openrouter.ai/api/v1'),
    site: process.env.OPENROUTER_SITE_URL || 'https://vitopiccolini.dev',
    title: process.env.OPENROUTER_APP_TITLE || 'Vito Piccolini Copilot',
    llmModel: process.env.RAG_LLM_MODEL || (isStandardOpenAi ? 'gpt-4o-mini' : 'google/gemini-2.0-flash-exp:free'),
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Richiesta non valida.' }, { status: 400 });
    }

    const { messages } = parsed.data;
    
    // We only need to run RAG retrieval if the last message is from the user and not a tool response.
    const lastMessage = messages[messages.length - 1];
    const isUserMessage = lastMessage.role === 'user';
    const question = lastMessage.content;

    const env = getEnvSafe();
    if (!env) {
      return NextResponse.json({ error: 'Il copilot non è configurato. Chiave API mancante.' }, { status: 503 });
    }

    const aiProvider = createOpenAI({
      apiKey: env.apiKey,
      baseURL: env.baseURL,
      headers: {
        'HTTP-Referer': env.site,
        'X-Title': env.title,
      }
    });

    const llmModel = aiProvider(env.llmModel);

    let context = '';
    let sources: { id: string; title: string; summary?: string; tags: string[] }[] = [];

    // RAG Pipeline (only triggered on new user questions)
    if (isUserMessage && question && question.trim().length > 0) {
      // 1. Generate query vector for cache & vector search
      let queryVector: number[] | null = null;
      try {
        const { createEmbeddings } = await import('@/services/rag/embeddings');
        const embeddings = createEmbeddings();
        queryVector = await embeddings.embedQuery(question);
        
        // 2. Semantic Cache Check
        const cached = await semanticCache.get(queryVector, 0.95);
        if (cached) {
            context = `[CACHED ANSWER]: ${cached.answer}`;
            sources = cached.sources;
        }
      } catch (e) {
        console.error('[RAG] Embeddings/Cache error:', e);
      }

      // 3. Retrieval Pipeline if no cache hit
      if (!context) {
        try {
          let allQueries = [question];

          // Multi-Query Expansion (wrapped in its own try/catch to prevent catastrophic failure)
          try {
            const { object: queryVariants } = await generateObject({
              model: llmModel,
              schema: z.object({
                queries: z.array(z.string()).length(3),
              }),
              prompt: `Genera 3 varianti diverse della seguente query per ottimizzare la ricerca in un database vettoriale sul portfolio di Vito Piccolini (es. risolvi acronimi, estrai l'intento principale). Query originale: "${question}"`,
            });
            allQueries = [question, ...queryVariants.queries];
          } catch (expansionError) {
            console.error('[RAG] Multi-Query Expansion failed, falling back to original query only.', expansionError);
          }

          // Parallel Retrieval with K=15
          const vectorStore = await getVectorStore({ k: 15 });
          
          const results = await Promise.all(allQueries.map(q => vectorStore.invoke(q)));
          const allDocs = results.flat();

          // Deduplicate
          const uniqueDocsMap = new Map();
          allDocs.forEach(doc => {
            if (!uniqueDocsMap.has(doc.metadata.id)) uniqueDocsMap.set(doc.metadata.id, doc);
          });
          const uniqueDocs = Array.from(uniqueDocsMap.values());

          // Take top 3 directly (Skipping LLM Reranking for lower latency)
          if (uniqueDocs.length > 0) {
             const finalDocs = uniqueDocs.slice(0, 3);
             
             context = finalDocs
                 .map((doc, idx) => {
                 const title = (doc.metadata?.title as string) || `Fonte ${idx + 1}`;
                 return `### ${title}\n${doc.pageContent}`;
                 })
                 .join('\n\n');

             sources = finalDocs.map((doc, idx) => ({
                 id: (doc.metadata?.id as string) || `source-${idx + 1}`,
                 title: (doc.metadata?.title as string) || `Fonte ${idx + 1}`,
                 summary: doc.metadata?.summary as string | undefined,
                 tags: (doc.metadata?.tags as string[]) || [],
             }));
          }
        } catch (vectorError) {
          console.error('[RAG] Vector store error, continuing without context', vectorError);
        }
      }
    }

    const systemPrompt = `Sei il copilot AI ufficiale del portfolio di Vito Piccolini, un Agente Spaziale avanzato.

REGOLE ASSOLUTE:
1. Usa lo storico della chat SOLO per capire il contesto (es. se l'utente dice "e quanto è durato?"). NON ripetere MAI risposte che hai già dato, non fare riassunti delle discussioni precedenti e non rispondere di nuovo a vecchie domande. Rispondi DIRETTAMENTE e UNICAMENTE all'ultima richiesta.
2. I contatti pubblici di Vito sono:
- Email: vitopiccolini@live.it
- LinkedIn: https://www.linkedin.com/in/vito-p-9120028a/
- GitHub: https://github.com/Hellvisback365
Se l'utente chiede questi dati, SCRIVI I LINK DIRETTAMENTE NELLA RISPOSTA TESTUALE e poi usa il tool per portarlo alla sezione contatti. Non fornire numeri di telefono privati.
2. Rispondi in italiano in modo conciso, brillante e professionale.
3. Se appropriato, usa il tool 'MapsPortfolioSection' per muovere la telecamera verso la sezione giusta (ad esempio "contatti", "progetti", "home"). ATTENZIONE: devi SEMPRE scrivere la tua risposta discorsiva PRIMA di invocare il tool. Scrivi tutto quello che hai da dire e solo alla fine chiama il tool.
4. Se l'utente chiede le tue competenze o stack tecnologico, USA IL TOOL 'showSkillsRadar'.
5. Se l'utente chiede un progetto specifico, USA IL TOOL 'showProjectCard'.

Contesto disponibile dal portfolio di Vito:
${context || 'Nessun contesto specifico trovato per questa domanda.'}
`;

    const coreMessages = messages
      .slice(-1) // Prendi SOLO l'ultimo messaggio per evitare allucinazioni e riassunti
      .filter((m: any) => m.role === 'user')
      .map((m: any) => {
        return { role: m.role, content: m.content || '' };
      }).filter((m: any) => m.content.trim().length > 0);

    const result = streamText({
      model: llmModel,
      messages: coreMessages,
      system: systemPrompt,
      tools: {
        MapsPortfolioSection: tool({
          description: 'Naviga e muovi la telecamera 3D verso una specifica sezione del portfolio (home, about, skills, projects, contact).',
          parameters: z.object({
            section: z.string().describe('Il nome della sezione a cui navigare. Valori supportati: hero, about, skills, projects, contact.').optional(),
          }),
          execute: async (args: any) => `Comando di navigazione 3D inviato al client per la sezione: ${args.section || 'sconosciuta'}`,
        } as any),
        showSkillsRadar: tool({
          description: 'Mostra un grafico radar visuale con le competenze (skills) di Vito.',
          parameters: z.object({}),
          execute: async () => 'Radar competenze mostrato al client.',
        } as any),
        showProjectCard: tool({
          description: 'Mostra la card dettagliata di un progetto specifico richiesto dall\'utente.',
          parameters: z.object({
            projectName: z.string().describe('Il nome del progetto da visualizzare.'),
          }),
          execute: async (args: any) => `Card progetto inviata al client per: ${args.projectName}`,
        } as any),
      },
    });

    // @ts-ignore
    return result.toUIMessageStreamResponse({
      headers: {
        'x-rag-sources': Buffer.from(JSON.stringify(sources)).toString('base64')
      }
    });

  } catch (error: any) {
    console.error('[RAG] API error:', error?.message || error);
    const message = error?.message || 'Errore interno sconosciuto.';
    return NextResponse.json({ error: `Errore del copilot: ${message}` }, { status: 500 });
  }
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

# src\app\api\metrics\route.ts

```ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const metric = await request.json();
    
    // Qui potresti inviare i dati a un database o a un servizio di analytics
    console.log('Web Vitals Metric:', metric);
    
    // In un'implementazione reale, potresti utilizzare:
    // - Database come MongoDB o PostgreSQL per archiviare
    // - Servizi come Google Analytics, Vercel Analytics, o custom analytics
    
    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error logging metrics:', error);
    return NextResponse.json(
      { error: 'Failed to log metrics' },
      { status: 500 }
    );
  }
} 
```

# src\app\api\profile\route.ts

```ts
import { NextResponse } from 'next/server';
import { getProfileDocuments } from '@/lib/profileDocuments';

export async function GET() {
  const documents = getProfileDocuments();
  return NextResponse.json({ documents });
}

```

# src\app\api\test-brevo\route.ts

```ts
import { NextResponse } from 'next/server';
import { sendEmail } from '@/services/brevo';

export async function GET() {
  try {
    console.log('Test endpoint per Brevo API');
    console.log('BREVO_API_KEY presente:', Boolean(process.env.BREVO_API_KEY));
    
    // Verifica che l'API key sia configurata
    if (!process.env.BREVO_API_KEY || process.env.BREVO_API_KEY === 'tuaApiKeyQuiSenzaVirgolette') {
      console.error('API key Brevo non valida o non configurata');
      return NextResponse.json({
        error: 'API key Brevo non configurata correttamente',
        hint: 'Aggiorna il file .env.local con una vera API key di Brevo'
      }, { status: 500 });
    }

    try {
      const result = await sendEmail({
        to: [{ email: 'vitopiccolini@live.it', name: 'Vito Piccolini' }],
        subject: 'Test di Brevo API',
        htmlContent: `
          <html>
            <body>
              <h2>Test di invio email tramite Brevo API</h2>
              <p>Questo è un test per verificare l'integrazione con Brevo.</p>
              <p>Data e ora: ${new Date().toLocaleString()}</p>
            </body>
          </html>
        `
      });
      
      return NextResponse.json({
        success: true,
        message: 'Email di test inviata con successo',
        details: result
      });
    } catch (error) {
      console.error('Errore nel test di Brevo:', error);
      return NextResponse.json({
        error: error instanceof Error ? error.message : 'Errore sconosciuto',
        stack: error instanceof Error ? error.stack : undefined
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Errore generale nel test endpoint:', error);
    return NextResponse.json({
      error: 'Errore durante il test di Brevo API'
    }, { status: 500 });
  }
} 
```

# src\app\globals.css

```css
/* Importazioni prima di tutto il resto */
@import "tailwindcss";
@import "../styles/breakpoints.css";

/* ═══════════════════════════════════════════════
   3D IMMERSIVE PORTFOLIO — DARK-ONLY THEME
   ═══════════════════════════════════════════════ */

:root {
  --scene-bg: #030303;
  --accent-white: #FFFFFF;
  --glass-bg: rgba(255, 255, 255, 0.03);
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-border-hover: rgba(255, 255, 255, 0.2);
  --text-primary: #FFFFFF;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --text-muted: rgba(255, 255, 255, 0.4);

  /* Overlays */
  --overlay-bg: rgba(0, 0, 0, 0.4);
}

/* ─── Full-screen lockdown for 3D canvas ─── */
html,
body {
  margin: 0;
  padding: 0;
  width: 100vw;
  min-height: 100vh;
  background: var(--scene-bg);
  color: var(--text-primary);
  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-tap-highlight-color: transparent;
}

/* ─── Glassmorphism Utility Classes ─── */
@layer utilities {
  .glass-panel {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }

  .glass-holographic {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    box-shadow:
      0 0 30px rgba(255, 255, 255, 0.05),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }

  .glass-holographic:hover {
    border-color: var(--glass-border-hover);
    box-shadow:
      0 0 40px rgba(255, 255, 255, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.12);
  }

  .glow-white {
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.1),
                0 0 60px rgba(255, 255, 255, 0.05);
  }

  .glow-text-white {
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.2),
                 0 0 40px rgba(255, 255, 255, 0.1);
  }

  .animate-blink {
    @apply inline-block;
    animation: blink-cursor 0.8s steps(2) infinite;
  }

  .neural-grid-overlay::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: linear-gradient(
        rgba(255, 255, 255, 0.02) 1px,
        transparent 1px
      ),
      linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
    background-size: 40px 40px;
    opacity: 0.25;
    pointer-events: none;
  }
}

/* ─── Animations ─── */
@keyframes blink-cursor {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@keyframes glow-pulse {
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.05),
                0 0 60px rgba(255, 255, 255, 0.02);
  }
  50% {
    box-shadow: 0 0 30px rgba(255, 255, 255, 0.1),
                0 0 80px rgba(255, 255, 255, 0.05);
  }
}

@keyframes border-glow {
  0%, 100% { border-color: rgba(255, 255, 255, 0.1); }
  50% { border-color: rgba(255, 255, 255, 0.2); }
}

/* ─── Scrollbar (for overlay panels with internal scroll) ─── */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* ─── Fix for iOS input zooming ─── */
input, select, textarea {
  font-size: 16px;
}

/* ─── Canvas container ─── */
.canvas-container {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
}

/* ─── Overlay container (outside Canvas, above it) ─── */
.overlay-fixed {
  position: fixed;
  pointer-events: none;
  z-index: 10;
}

.overlay-fixed > * {
  pointer-events: auto;
}

```

# src\app\layout.tsx

```tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import PerformanceMonitor from "@/components/PerformanceMonitor";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";


export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Vito Piccolini - Sviluppatore AI",
  description: "Portfolio di Vito Piccolini, Sviluppatore AI orientato all'utente",
  authors: [{ name: "Vito Piccolini" }],
  keywords: ["AI", "Machine Learning", "LLM", "Developer", "Frontend", "React", "Next.js"],
  creator: "Vito Piccolini",
  icons: {
    icon: '/vp.svg',
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: "Vito Piccolini - Sviluppatore AI",
    description: "Portfolio di Vito Piccolini, Sviluppatore AI orientato all'utente",
    type: "website",
    locale: "it_IT",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className="dark" suppressHydrationWarning>
      <head>
        {/* Metadata handled by Next.js App Router */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#050505] text-white">
        {children}
        {process.env.NODE_ENV === 'production' && <PerformanceMonitor />}
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

import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect } from 'react';
import Scene from '@/components/canvas/Scene';
import HtmlOverlay from '@/components/overlay/HtmlOverlay';
import RagChatOverlay from '@/components/overlay/RagChatOverlay';
import NavigationOverlay from '@/components/overlay/NavigationOverlay';
import { ReactLenis } from 'lenis/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Main page — 3D immersive portfolio.
 *
 * Architecture Refactored:
 * - ReactLenis for native smooth scrolling
 * - Full-screen fixed <Canvas> as background
 * - Normal HTML flow for overlays (no longer inside <ScrollControls>)
 */
export default function Home() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  return (
    <ReactLenis root options={{ lerp: 0.05, wheelMultiplier: 1 }}>
      <div className="relative w-full">
        
        {/* Fixed 3D Canvas Background */}
        <div className="fixed inset-0 z-0 h-screen w-screen">
          <Canvas
            camera={{ fov: 50, position: [0, 0, 20], near: 0.1, far: 150 }}
            gl={{
              antialias: true,
              alpha: false,
              powerPreference: 'high-performance',
            }}
            dpr={[1, 1.5]}
            style={{ background: '#030303' }}
          >
            <Suspense fallback={null}>
              <Scene />
            </Suspense>
          </Canvas>
        </div>

        {/* Scrollable DOM Overlay */}
        <div className="relative z-10 w-full pointer-events-none">
          <div className="pointer-events-auto">
            <HtmlOverlay />
          </div>
        </div>

        {/* Overlays (fixed position, above everything) */}
        <div className="pointer-events-auto">
          <NavigationOverlay />
          <RagChatOverlay />
        </div>
      </div>
    </ReactLenis>
  );
}

```

# src\app\reset-theme.js

```js
// Script per forzare il reset del tema
console.log('[RESET-THEME] Resetting theme state');
try {
  // Forza la classe dark sull'HTML per corrispondere al tema predefinito
  document.documentElement.classList.add('dark');
  
  // Rimuovi il tema da localStorage perché verrà usato quello predefinito
  localStorage.removeItem('theme');
  
  // Forza aggiornamento stile
  document.body.style.backgroundColor = '#000';
  document.body.style.color = 'white';
  
  console.log('[RESET-THEME] Theme reset to default dark theme completed');
} catch (e) {
  console.error('[RESET-THEME] Error:', e);
} 
```

# src\app\test-brevo\page.tsx

```tsx
'use client';

import { useState } from 'react';

interface TestResult {
  success?: boolean;
  message?: string;
  error?: string;
  hint?: string;
  details?: Record<string, unknown>;
  stack?: string;
}

export default function TestBrevoPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const testBrevoApi = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Invio richiesta di test a Brevo API...');
      const response = await fetch('/api/test-brevo');
      
      console.log('Risposta ricevuta:', {
        status: response.status,
        statusText: response.statusText
      });
      
      const data = await response.json() as TestResult;
      console.log('Dati risposta:', data);
      
      setResult(data);
      
      if (!response.ok) {
        setError(data.error || 'Errore durante il test');
      }
    } catch (err) {
      console.error('Errore durante il test:', err);
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">Test Integrazione Brevo API</h1>
      
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
        <p className="mb-4">
          Questa pagina ti permette di testare l&apos;integrazione con Brevo API e verificare se l&apos;invio di email funziona correttamente.
        </p>
        <button
          onClick={testBrevoApi}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Test in corso...' : 'Esegui Test'}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <h2 className="font-bold">Errore:</h2>
          <p>{error}</p>
        </div>
      )}
      
      {result && !error && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <h2 className="font-bold">Test completato con successo!</h2>
          <p>Controlla la tua email per confermare la ricezione.</p>
        </div>
      )}
      
      {result && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Risultato del test:</h2>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-x-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
      
      <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Istruzioni:</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>
            Assicurati di aver configurato correttamente la tua API key di Brevo nel file <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">.env.local</code>
          </li>
          <li>
            L&apos;API key dovrebbe iniziare con &quot;xkeysib-&quot; e non essere un placeholder
          </li>
          <li>
            Se il test fallisce, verifica i log nella console del browser e del server
          </li>
          <li>
            Controlla che l&apos;indirizzo email di destinazione sia corretto
          </li>
          <li>
            Verifica che non ci siano restrizioni di rete che impediscono le connessioni a Brevo
          </li>
        </ol>
      </div>
    </div>
  );
} 
```

# src\components\AnimatedTitle.tsx

```tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface AnimatedTitleProps {
  text: string;
  /** index from which to apply highlightClass */
  highlightFrom?: number;
  /** Tailwind classes to apply for highlighted chars */
  highlightClass?: string;
}

const AnimatedTitle: React.FC<AnimatedTitleProps> = ({ text, highlightFrom = 0, highlightClass = '' }) => {
  const letters = React.useMemo(() => Array.from(text), [text]);
  const [displayed, setDisplayed] = useState<string[]>([]);

  useEffect(() => {
    setDisplayed([]); // reset before starting
    const timeoutIds: NodeJS.Timeout[] = [];
    letters.forEach((_, index) => {
      const timeoutId = setTimeout(() => {
        setDisplayed((prev) => [...prev, letters[index]]);
      }, index * 100);
      timeoutIds.push(timeoutId);
    });
    return () => timeoutIds.forEach(clearTimeout);
  }, [text, letters]);

  return (
    <h1 className="text-4xl md:text-6xl font-bold text-white whitespace-pre-wrap">
      {displayed.map((char, idx) =>
        char === '\n' ? (
          <br key={idx} />
        ) : (
          <motion.span
            key={idx}
            className={idx >= highlightFrom ? highlightClass : ''}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'tween', duration: 0.1, ease: 'easeOut' }}
          >
            {char}
          </motion.span>
        )
      )}
      <motion.span
        className="ml-1 w-1 bg-gray-800 dark:bg-gray-200 animate-blink"
        initial={{ opacity: 1 }}
        animate={{ opacity: [1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut' }}
      >
        &nbsp;
      </motion.span>
    </h1>
  );
};

export default AnimatedTitle; 
```

# src\components\canvas\AbstractCore.tsx

```tsx
'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface AbstractCoreProps {
  zCenter?: number;
}

export default function AbstractCore({ zCenter = 15 }: AbstractCoreProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!groupRef.current || !ring1Ref.current || !ring2Ref.current || !ring3Ref.current || !coreRef.current) return;
    const t = state.clock.elapsedTime;
    
    // Smooth, cinematic rotation of the rings (like a high-tech gyroscope)
    ring1Ref.current.rotation.x = t * 0.2;
    ring1Ref.current.rotation.y = t * 0.1;
    
    ring2Ref.current.rotation.y = t * 0.15;
    ring2Ref.current.rotation.z = t * 0.25;
    
    ring3Ref.current.rotation.x = t * 0.3;
    ring3Ref.current.rotation.z = t * 0.1;

    // Core pulsing effect
    const pulse = 1 + Math.sin(t * 2) * 0.05;
    coreRef.current.scale.setScalar(pulse);
    
    // Entire group subtle interaction with pointer
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      state.pointer.y * 0.2,
      0.05
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      state.pointer.x * 0.2,
      0.05
    );
  });

  return (
    <group position={[0, 0, zCenter]} ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        
        {/* Core Glowing Orb */}
        <mesh ref={coreRef} scale={0.8}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshPhysicalMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.5}
            roughness={0.2}
            metalness={0.8}
            clearcoat={1}
          />
        </mesh>

        {/* Ring 1 - Deep Titanium */}
        <mesh ref={ring1Ref}>
          <torusGeometry args={[2.5, 0.05, 32, 100]} />
          <meshPhysicalMaterial
            color="#111111"
            metalness={1}
            roughness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* Ring 2 - Frosted Glass */}
        <mesh ref={ring2Ref}>
          <torusGeometry args={[3.2, 0.08, 32, 100]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transmission={0.9}
            opacity={1}
            metalness={0.1}
            roughness={0.2}
            ior={1.5}
            thickness={0.5}
            clearcoat={1}
          />
        </mesh>

        {/* Ring 3 - Outer Thin Titanium */}
        <mesh ref={ring3Ref}>
          <torusGeometry args={[4, 0.02, 16, 100]} />
          <meshPhysicalMaterial
            color="#333333"
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>

      </Float>
      
      {/* Dynamic light casting from the core onto the rings */}
      <pointLight intensity={2} color="#ffffff" distance={10} position={[0, 0, 0]} />
    </group>
  );
}

```

# src\components\canvas\CameraRig.tsx

```tsx
'use client';

import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CAMERA_PATH = [
  { pos: new THREE.Vector3(0, 0, 25), lookAt: new THREE.Vector3(0, 0, 15) },     // Hero
  { pos: new THREE.Vector3(-10, 2, 5), lookAt: new THREE.Vector3(0, 0, 0) },      // About
  { pos: new THREE.Vector3(10, -2, -5), lookAt: new THREE.Vector3(0, 0, -10) },   // Skills (stay in front of portals)
  { pos: new THREE.Vector3(0, 2, -28), lookAt: new THREE.Vector3(0, 0, -35) },   // Projects
  { pos: new THREE.Vector3(-5, 0, -50), lookAt: new THREE.Vector3(0, 0, -60) },   // Contact
];

export default function CameraRig() {
  useFrame((state) => {
    // Read global scroll progress directly for zero latency
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const offset = h > 0 ? window.scrollY / h : 0;

    // Map scroll offset (0→1) to camera path segments
    const totalSegments = CAMERA_PATH.length - 1;
    const progress = offset * totalSegments;
    const segmentIndex = Math.min(Math.floor(progress), totalSegments - 1);
    const segmentProgress = progress - segmentIndex;

    const from = CAMERA_PATH[segmentIndex];
    const to = CAMERA_PATH[Math.min(segmentIndex + 1, CAMERA_PATH.length - 1)];

    // Extremely smooth easing for the camera path (ease-in-out)
    const eased = smootherstep(segmentProgress);

    // Target position
    const targetPos = new THREE.Vector3().lerpVectors(from.pos, to.pos, eased);
    const targetLookAt = new THREE.Vector3().lerpVectors(from.lookAt, to.lookAt, eased);

    // Subtle, elegant floating motion (like a drone)
    const time = state.clock.elapsedTime;
    targetPos.x += Math.sin(time * 0.2) * 0.2;
    targetPos.y += Math.cos(time * 0.15) * 0.2;

    state.camera.position.copy(targetPos);
    state.camera.lookAt(targetLookAt);
  });

  return null;
}

// Ken Perlin's smootherstep for butter-smooth transitions
function smootherstep(t: number): number {
  t = Math.max(0, Math.min(1, t));
  return t * t * t * (t * (t * 6 - 15) + 10);
}

```

# src\components\canvas\CustomModel.tsx

```tsx
'use client';

import { useRef, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface CustomModelProps {
  /** Path to the .glb file (relative to /public) */
  path?: string;
  /** Scale multiplier */
  scale?: number;
  /** Position in the scene */
  position?: [number, number, number];
  /** Rotation speed (radians per frame) */
  rotationSpeed?: number;
}

/** Placeholder geometry shown when no .glb is provided */
function PlaceholderGeometry({ scale = 1, rotationSpeed = 0.003 }: { scale: number; rotationSpeed: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += rotationSpeed;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
  });

  return (
    <mesh ref={meshRef} scale={scale}>
      <torusKnotGeometry args={[1, 0.35, 128, 16]} />
      <meshBasicMaterial
        color="#5DE0E6"
        wireframe
        transparent
        opacity={0.35}
        depthWrite={false}
      />
    </mesh>
  );
}

/** Loaded GLB model */
function GLBModel({ path, scale = 1, rotationSpeed = 0.003 }: { path: string; scale: number; rotationSpeed: number }) {
  const { scene } = useGLTF(path);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += rotationSpeed;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
  });

  return (
    <group ref={groupRef} scale={scale}>
      <primitive object={scene} />
    </group>
  );
}

export default function CustomModel({
  path,
  scale = 1.5,
  position = [0, 0, 0],
  rotationSpeed = 0.003,
}: CustomModelProps) {
  return (
    <group position={position}>
      {/* Dedicated lighting for the model */}
      <spotLight
        position={[5, 5, 5]}
        angle={0.4}
        penumbra={0.8}
        intensity={1.5}
        color="#5DE0E6"
        castShadow={false}
      />
      <spotLight
        position={[-5, 3, -3]}
        angle={0.5}
        penumbra={1}
        intensity={0.8}
        color="#C084FC"
        castShadow={false}
      />
      <pointLight position={[0, -3, 2]} intensity={0.4} color="#3B82F6" />

      <Suspense fallback={null}>
        {path ? (
          <GLBModel path={path} scale={scale} rotationSpeed={rotationSpeed} />
        ) : (
          <PlaceholderGeometry scale={scale} rotationSpeed={rotationSpeed} />
        )}
      </Suspense>

      <Environment preset="night" />
    </group>
  );
}

```

# src\components\canvas\FloatingParticles.tsx

```tsx
'use client';

import { Sparkles } from '@react-three/drei';

export default function FloatingParticles({ zRange }: { zRange?: [number, number] }) {
  // Place sparkles across the entire camera path
  return (
    <group position={[0, 0, -20]}>
      {/* Dense core of tiny particles */}
      <Sparkles 
        count={800} 
        scale={[40, 30, 150]} 
        size={1.5} 
        speed={0.2} 
        opacity={0.3} 
        color="#ffffff" 
        noise={1}
      />
      
      {/* Sparser, larger bokeh particles */}
      <Sparkles 
        count={200} 
        scale={[30, 20, 120]} 
        size={4} 
        speed={0.4} 
        opacity={0.1} 
        color="#ffffff" 
        noise={2}
      />
    </group>
  );
}

```

# src\components\canvas\ProjectCards3D.tsx

```tsx
'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';

const PROJECTS = [
  { id: 1, title: 'B.Future Challenge', url: '/projects/bfuture.png' },
  { id: 2, title: 'LACAM Copilot', url: '/projects/lacam.png' },
  { id: 3, title: 'Marketing Automation', url: '/projects/n8n.png' },
  { id: 4, title: 'Explainable AI Dashboard', url: '/projects/dashboard.png' }
];

interface CardProps {
  position: [number, number, number];
  rotation: [number, number, number];
  title: string;
}

function CurvedGlassCard({ position, rotation, title }: CardProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    // Gentle breathing
    groupRef.current.position.y = position[1] + Math.sin(t + position[0]) * 0.1;
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <Float floatIntensity={0.5} rotationIntensity={0.1}>
        <mesh>
          {/* Curved screen: radius=5, height=3, radialSegments=32, heightSegments=1, openEnded=true, thetaStart=0, thetaLength=PI/3 */}
          <cylinderGeometry args={[4, 4, 2.5, 32, 1, true, -Math.PI / 6, Math.PI / 3]} />
          <meshPhysicalMaterial 
            color="#ffffff"
            metalness={0.8}
            roughness={0.1}
            transmission={0.9}
            thickness={0.05}
            envMapIntensity={2}
            side={THREE.DoubleSide}
            clearcoat={1}
          />
        </mesh>
        
        {/* Placeholder for project image (dark glass) */}
        <mesh position={[0, 0, 0.02]}>
          <cylinderGeometry args={[3.95, 3.95, 2.3, 32, 1, true, -Math.PI / 6.2, Math.PI / 3.1]} />
          <meshPhysicalMaterial color="#050505" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
        
        {/* Curved Text? Text component doesn't curve natively, so we position it slightly in front */}
        <Text
          position={[0, -0.8, 3.8]} // Pushed out to roughly radius
          fontSize={0.15}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.05}
        >
          {title}
        </Text>
      </Float>
    </group>
  );
}

export default function ProjectCards3D() {
  const cards = useMemo(() => {
    return PROJECTS.map((proj, i) => {
      // Distribute them in a semicircle around the viewer at z=-35
      const angle = (i / PROJECTS.length) * Math.PI - Math.PI / 2; // -90 to +90 deg
      const radius = 6;
      
      const x = Math.sin(angle) * radius;
      const z = -Math.cos(angle) * radius; // Negative to push them further down the Z axis
      
      // Face the center (0,0,0 local)
      const rotationY = -angle; 
      
      return (
        <CurvedGlassCard 
          key={proj.id} 
          position={[x, 0, z]} 
          rotation={[0, rotationY, 0]} 
          title={proj.title} 
        />
      );
    });
  }, []);

  return (
    // We place the group at z=-35. Camera will arrive at z=-35 to see them.
    <group position={[0, 0, -35]}>
      {cards}
    </group>
  );
}

```

# src\components\canvas\Scene.tsx

```tsx
'use client';

import CameraRig from './CameraRig';
import AbstractCore from './AbstractCore';
import FloatingParticles from './FloatingParticles';
import SkillLenses from './SkillLenses';
import ProjectCards3D from './ProjectCards3D';
import { Environment } from '@react-three/drei';

export default function Scene() {
  return (
    <>
      {/* Camera controller */}
      <CameraRig />

      {/* Global studio lighting - Apple Vision Pro style (High contrast, soft shadows) */}
      <ambientLight intensity={0.5} color="#ffffff" />
      <Environment preset="studio" environmentIntensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#ffffff" />

      {/* Volumetric fog */}
      <fog attach="fog" args={['#030303', 10, 60]} />

      {/* Ambient particles */}
      <FloatingParticles />

      {/* ── Section 1: Hero (z ~15) ── */}
      <AbstractCore zCenter={15} />

      {/* ── Section 3: Skills (z ~-10) ── */}
      <SkillLenses />

      {/* ── Section 4: Projects (z ~-35) ── */}
      <ProjectCards3D />
    </>
  );
}

```

# src\components\canvas\SkillLenses.tsx

```tsx
'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import * as THREE from 'three';

const SKILLS = [
  ['AI & Machine', 'Learning'],
  ['React &', 'Next.js'],
  ['3D Web', 'Experiences'],
  ['Cloud &', 'Architecture'],
];

function PortalRing({ position, scale, textLines, rotation }: any) {
  return (
    <Float floatIntensity={2} rotationIntensity={0.5} speed={2}>
      <group position={position} rotation={rotation} scale={scale}>
        <mesh>
          {/* A thin, elegant ring */}
          <torusGeometry args={[3, 0.05, 16, 100]} />
          <meshPhysicalMaterial 
            color="#ffffff" 
            metalness={0.9} 
            roughness={0.1} 
            envMapIntensity={2} 
            clearcoat={1}
          />
        </mesh>
        {/* Subtle glass pane inside the ring */}
        <mesh>
          <circleGeometry args={[2.95, 64]} />
          <meshPhysicalMaterial 
            color="#ffffff" 
            transmission={1} 
            transparent 
            opacity={1}
            roughness={0.05} 
            ior={1.2} 
            thickness={0.5} 
          />
        </mesh>
        
        <Text
          position={[0, 0.3, 0.1]}
          fontSize={0.4}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.1}
          fontWeight={300}
        >
          {textLines[0]}
        </Text>
        <Text
          position={[0, -0.3, 0.1]}
          fontSize={0.4}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.1}
          fontWeight={300}
        >
          {textLines[1]}
        </Text>
      </group>
    </Float>
  );
}

export default function SkillLenses() {
  const portals = useMemo(() => {
    return SKILLS.map((skill, i) => {
      // Position portals along the Z axis so we fly through them
      const z = - (i * 8); 
      // Slight offset in X and Y
      const x = Math.sin(i * Math.PI) * 2;
      const y = Math.cos(i * Math.PI) * 1;
      
      // Slight rotation to make it dynamic
      const rotation = [0, Math.sin(i) * 0.2, 0];
      
      return (
        <PortalRing 
          key={i} 
          position={[x, y, z]} 
          rotation={rotation}
          scale={1 + (i * 0.1)} 
          textLines={skill} 
        />
      );
    });
  }, []);

  return (
    <group position={[0, 0, -10]}>
      {portals}
    </group>
  );
}

```

# src\components\Footer.tsx

```tsx
'use client';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative w-full border-t border-white/10 bg-black/40 py-8 backdrop-blur-xl">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neural-cyan to-transparent" />
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-center md:text-left">
            <p className="text-sm text-white/60 md:text-base">
              © {currentYear} Vito Piccolini. All rights reserved.
            </p>
          </div>
          
          <div className="flex space-x-4 md:space-x-6">
            <a
              href="https://github.com/Hellvisback365"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all hover:border-neural-cyan/60 hover:text-neural-cyan"
              aria-label="GitHub"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/vito-p-9120028a/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all hover:border-neural-cyan/60 hover:text-neural-cyan"
              aria-label="LinkedIn"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            <a
              href="mailto:vitopiccolini@live.it"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all hover:border-neural-cyan/60 hover:text-neural-cyan"
              aria-label="Email"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </a>
            <a
              href="tel:+393937382774"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all hover:border-neural-cyan/60 hover:text-neural-cyan"
              aria-label="Telefono"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3l2 4-2 2a14 14 0 006 6l2-2 4 2v3a2 2 0 01-2 2h-1C9.82 20 4 14.18 4 7V6a1 1 0 01-1-1z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
} 
```

# src\components\Header.tsx

```tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Navigation links
  const navItems = [
    { name: 'Home', href: '#hero' },
    { name: 'Copilot', href: '#copilot' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  // Initialize component and check for dark mode preference
  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen) {
        const header = document.querySelector('header');
        if (header && !header.contains(event.target as Node)) {
          setIsMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/30 backdrop-blur-xl transition-colors duration-300">
      <div className="container mx-auto flex items-center justify-between px-4 py-3 md:py-4">
        <Link href="/" className="text-xl font-semibold tracking-widest text-neural-cyan md:text-2xl">
          Vito Piccolini
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 lg:space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium uppercase tracking-[0.2em] text-white/60 transition-colors duration-200 hover:text-neural-cyan"
            >
              {item.name}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            className="rounded-md border border-white/15 p-2 text-white/80 transition-colors hover:border-neural-cyan/50 md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-white/10 bg-black/60 backdrop-blur"
          >
            <nav className="flex flex-col w-full p-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="border-b border-white/5 py-3 text-center text-white/70 transition-colors duration-200 hover:text-neural-cyan"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
} 
```

# src\components\Layout.tsx

```tsx
'use client';

import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import ScrollToTopButton from './ScrollToTopButton';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
      <Header />
      <main className="flex-grow w-full">
        {children}
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
} 
```

# src\components\NeuralBackground.tsx

```tsx
'use client';
import React, { useRef, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

interface Particle {
  x: number;
  y: number;
  size: number;
  density: number;
  color: string;
  alpha: number;
  angle: number;
  speed: number;
}

export default function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Premium colors configuration
    const isDark = theme === 'dark';
    // Brighter, more visible elegant colors
    const particleColor = isDark ? '224, 231, 255' : '79, 70, 229'; // Indigo-100 : Indigo-600
    const lineColor = isDark ? '199, 210, 254' : '99, 102, 241'; // Indigo-200 : Indigo-500

    let animationFrameId: number;
    let particlesArray: Particle[] = [];
    const mouse = { x: -1000, y: -1000, radius: 200 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', resizeCanvas);
    
    // Initial setup
    resizeCanvas();

    function initParticles() {
      particlesArray = [];
      // Balanced density for elegance
      const numberOfParticles = Math.floor((canvas!.width * canvas!.height) / 16000);
      
      for (let i = 0; i < numberOfParticles; i++) {
        const size = Math.random() * 2.0 + 1.0; // Visible but elegant size
        const x = Math.random() * canvas!.width;
        const y = Math.random() * canvas!.height;
        
        particlesArray.push({
          x,
          y,
          size,
          density: (Math.random() * 20) + 1,
          color: particleColor,
          alpha: Math.random() * 0.5 + 0.2, // Better visibility
          angle: Math.random() * 360,
          speed: Math.random() * 0.15 + 0.05 // Slower, graceful movement
        });
      }
    }

    function updateParticles() {
      for (let i = 0; i < particlesArray.length; i++) {
        const p = particlesArray[i];
        
        // Organic floating movement
        p.angle += 0.005; // Slowly change direction
        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed;

        // Mouse interaction: Gentle repulsion
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distance = Math.hypot(dx, dy);
        
        if (distance < mouse.radius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouse.radius - distance) / mouse.radius;
            const directionX = forceDirectionX * force * p.density * 0.5;
            const directionY = forceDirectionY * force * p.density * 0.5;
            
            p.x -= directionX;
            p.y -= directionY;
        }

        // Wrap around screen
        if (p.x > canvas!.width + 20) p.x = -20;
        else if (p.x < -20) p.x = canvas!.width + 20;
        
        if (p.y > canvas!.height + 20) p.y = -20;
        else if (p.y < -20) p.y = canvas!.height + 20;
      }
    }

    function drawParticles() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      
      connectParticles();

      for (let i = 0; i < particlesArray.length; i++) {
        const p = particlesArray[i];
        ctx!.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function connectParticles() {
      const maxDistance = 150;
      
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = Math.hypot(dx, dy);

          if (distance < maxDistance) {
            const opacity = 1 - (distance / maxDistance);
            ctx!.strokeStyle = `rgba(${lineColor}, ${opacity * 0.3})`;
            ctx!.lineWidth = 1.0;
            ctx!.beginPath();
            ctx!.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx!.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx!.stroke();
          }
        }
      }
    }

    const animate = () => {
      updateParticles();
      drawParticles();
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, mounted]);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        aria-hidden="true"
      />
    </div>
  );
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
  { icon: <FaLinkedin />, href: 'https://www.linkedin.com/in/vito-p-9120028a/', label: 'LinkedIn' },
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
  { icon: <FaLinkedin className="h-4 w-4" />, href: 'https://www.linkedin.com/in/vito-p-9120028a/', label: 'LinkedIn' },
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

# src\components\overlay\HeroOverlay.tsx

```tsx
'use client';

import { motion } from 'framer-motion';
import Badge from '@/components/ui/Badge';
import CTAButton from '@/components/ui/CTAButton';

const text = `Ciao, mi chiamo`;
const name = `Vito Piccolini`;

const stackBadges = [
  'Python',
  'LangGraph · LangChain',
  'n8n Automations',
  'React · Next.js',
  'Gemini · Ollama',
];

export default function HeroOverlay() {
  return (
    <div className="flex min-h-screen w-screen items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="flex max-w-3xl flex-col items-center gap-6 text-center"
      >
        <Badge variant="glow">Disponibile per progetti AI</Badge>

        <h1 className="text-4xl font-light leading-tight tracking-tight text-white/90 sm:text-5xl md:text-6xl lg:text-7xl">
          {text}
          <br />
          <span className="font-semibold glow-text-cyan text-white">{name}</span>
        </h1>

        <p className="max-w-2xl text-base text-white/60 sm:text-lg">
          Laureando magistrale in{' '}
          <span className="text-[white]">Computer Science – Artificial Intelligence</span>,
          appassionato di IA e Machine Learning con esperienza in sistemi di raccomandazione
          LLM-driven.
        </p>

        <div className="flex flex-wrap justify-center gap-2">
          {stackBadges.map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium tracking-wide text-white/70 backdrop-blur-sm"
            >
              {badge}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <CTAButton href="#contact" variant="primary">
            Contattami
          </CTAButton>
          <CTAButton href="#projects" variant="secondary">
            Vedi i progetti
          </CTAButton>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="mt-8 flex flex-col items-center gap-2 text-white/40"
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        >
          <span className="text-[0.6rem] uppercase tracking-[0.5em]">Scorri</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 9l-7 7-7-7"
            />
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

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

import { useLenis } from 'lenis/react';

const SECTIONS = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

export default function NavigationOverlay() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const lenis = useLenis();

  // Listen for native window scroll events
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (scrollHeight <= 0) return;

      const progress = scrollTop / scrollHeight;
      setScrollProgress(progress);

      // Find the currently active section based on actual scroll position
      let currentSection = 0;
      for (let i = 0; i < SECTIONS.length; i++) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el && scrollTop >= el.offsetTop - window.innerHeight / 2) {
          currentSection = i;
        }
      }
      setActiveIndex(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);



  const scrollToSection = useCallback((index: number) => {
    const el = document.getElementById(SECTIONS[index].id);
    if (!el) return;
    
    const targetScroll = el.offsetTop;

    if (lenis) {
      lenis.scrollTo(targetScroll, { duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    } else {
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth',
      });
    }
  }, [lenis]);

  useEffect(() => {
    const handleNavigate = (event: Event) => {
      const customEvent = event as CustomEvent;
      const sectionId = customEvent.detail?.section;
      const index = SECTIONS.findIndex(s => s.id === sectionId);
      if (index !== -1) {
        scrollToSection(index);
      }
    };
    window.addEventListener('navigate-section', handleNavigate);
    return () => window.removeEventListener('navigate-section', handleNavigate);
  }, [scrollToSection]);

  return (
    <>
      {/* ─── Top progress bar ─── */}
      <div className="fixed left-0 right-0 top-0 z-40 h-[2px] bg-white/5">
        <motion.div
          className="h-full bg-white"
          style={{ width: `${scrollProgress * 100}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </div>

      {/* ─── Top name / logo ─── */}
      <div className="fixed left-6 top-4 z-40">
        <motion.p
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="text-sm font-semibold tracking-[0.2em] text-[white]/70"
        >
          VP
        </motion.p>
      </div>

      {/* ─── Navigation dots (right side) ─── */}
      <nav className="fixed right-6 top-1/2 z-40 -translate-y-1/2" aria-label="Sezioni">
        <div className="flex flex-col items-end gap-4">
          {SECTIONS.map((section, index) => (
            <button
              key={section.id}
              type="button"
              onClick={() => scrollToSection(index)}
              className="group flex items-center gap-3"
              aria-label={`Vai a ${section.label}`}
              aria-current={activeIndex === index ? 'true' : undefined}
            >
              {/* Label (visible on hover) */}
              <span
                className={`text-[0.6rem] uppercase tracking-[0.3em] transition-all duration-300 ${
                  activeIndex === index
                    ? 'text-[white] opacity-100'
                    : 'text-white/0 group-hover:text-white/50'
                }`}
              >
                {section.label}
              </span>

              {/* Dot */}
              <span className="relative flex items-center justify-center">
                {/* Active ring */}
                {activeIndex === index && (
                  <motion.span
                    layoutId="active-dot"
                    className="absolute h-4 w-4 rounded-full border border-[white]/40"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                {/* Inner dot */}
                <span
                  className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                    activeIndex === index
                      ? 'bg-[white] shadow-[0_0_8px_rgba(255,255,255,0.5)]'
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

# src\components\overlay\RagChatOverlay.tsx

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Badge from '@/components/ui/Badge';
import { useChat } from '@ai-sdk/react';
import { useAppStore } from '@/store/useAppStore';
import SkillsRadar from '@/components/ui/rag/SkillsRadar';
import ProjectCard from '@/components/ui/rag/ProjectCard';

const suggestionPool = [
  'Quali metriche hai raggiunto durante la B.Future Challenge?',
  'Raccontami il tirocinio al laboratorio LACAM.',
  'Come puoi aiutare un team a integrare un copilot AI?',
  'Mostrami le tue competenze in ambito AI.',
  'Portami alla sezione dei tuoi progetti!',
];

function pickRandomSuggestion(exclude: string[] = []) {
  const available = suggestionPool.filter((item) => !exclude.includes(item));
  const pool = available.length > 0 ? available : suggestionPool;
  return pool[Math.floor(Math.random() * pool.length)];
}

function getInitialSuggestions(count: number) {
  const selections: string[] = [];
  for (let i = 0; i < count; i += 1) {
    selections.push(pickRandomSuggestion(selections));
  }
  return selections;
}

export default function RagChatOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>(() => suggestionPool.slice(0, 3));
  const [sources, setSources] = useState<any[]>([]);
  const scrollAnchor = useRef<HTMLDivElement | null>(null);
  const isMounted = useRef(false);
  const [showGlow, setShowGlow] = useState(false);
  
  const flyToSection = useAppStore(state => state.flyToSection);
  const [localInput, setLocalInput] = useState('');
  const processedTools = useRef<Set<string>>(new Set());

  // @ts-ignore
  const { messages, isLoading, error, append, sendMessage } = useChat({
    // @ts-ignore
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Ciao! Sono il copilot del portfolio, un agente spaziale. Chiedimi qualsiasi cosa sul percorso di Vito, oppure chiedimi di navigare verso una sezione specifica!',
      }
    ],
    onResponse: (response: any) => {
      const sourcesHeader = response.headers.get('x-rag-sources');
      if (sourcesHeader) {
        try {
          const parsedSources = JSON.parse(atob(sourcesHeader));
          if (parsedSources.length > 0) {
            setSources(parsedSources);
            setShowGlow(true);
            setTimeout(() => setShowGlow(false), 5000);
          }
        } catch (e) {
          console.error("Failed to parse sources", e);
        }
      }
    }
  });

  useEffect(() => {
    messages.forEach((m: any) => {
      const invocations = (m.toolInvocations && m.toolInvocations.length > 0) 
        ? m.toolInvocations 
        : (m.parts?.filter((p: any) => p.type === 'tool-invocation' || p.toolCallId).map((p: any) => {
            if (p.toolInvocation) return p.toolInvocation;
            return {
              toolCallId: p.toolCallId,
              toolName: p.type?.startsWith('tool-') ? p.type.substring(5) : p.toolName,
              args: p.input || p.args || {},
              state: p.state === 'output-available' ? 'result' : p.state || 'call'
            };
          }) || []);
      
      invocations.forEach((inv: any) => {
        if (!inv) return;
        if (inv.state === 'call' || inv.state === 'result') {
          if (!processedTools.current.has(inv.toolCallId)) {
            processedTools.current.add(inv.toolCallId);
            if (inv.toolName === 'MapsPortfolioSection') {
              const section = inv.args?.section;
              if (section) {
                flyToSection(section);
              } else {
                // LLM generated empty args, fallback to guessing based on last user message
                const lastUserMessage = [...messages].reverse().find((m: any) => m.role === 'user');
                const lastUserMessageContent = (lastUserMessage as any)?.content || '';
                const text = lastUserMessageContent.toLowerCase();
                const guessedSection = 
                  (text.includes('home') || text.includes('inizio') || text.includes('hero')) ? 'hero' :
                  (text.includes('about') || text.includes('chi sono') || text.includes('esperienza') || text.includes('lavoro')) ? 'about' : 
                  (text.includes('skills') || text.includes('competenze') || text.includes('tecnolog')) ? 'skills' : 
                  (text.includes('contat') || text.includes('contart') || text.includes('mail') || text.includes('linkedin') || text.includes('telef')) ? 'contact' : 
                  'projects';
                
                flyToSection(guessedSection);
              }
            }
          }
        }
      });
    });
  }, [messages, flyToSection]);

  const sendQuestion = (question: string) => {
      const sendMsg = append || sendMessage;
      if (sendMsg) {
          sendMsg({
              role: 'user',
              content: question
          });
      }
  };

  const cycleSuggestion = (index: number) => {
    setSuggestions((prev) => {
      const next = [...prev];
      const exclude = next.filter((_, idx) => idx !== index);
      next[index] = pickRandomSuggestion(exclude);
      return next;
    });
  };

  useEffect(() => {
    setSuggestions(getInitialSuggestions(3));
  }, []);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    if (scrollAnchor.current) {
      scrollAnchor.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, isLoading]);

  return (
    <>
      {/* Floating trigger button */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-black/80 text-white shadow-[0_0_30px_rgba(255,255,255,0.05)] backdrop-blur-2xl transition-all hover:border-white/40 hover:shadow-[0_0_40px_rgba(255,255,255,0.1)]"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: isOpen
            ? '0 0 30px rgba(255, 255, 255, 0.1)'
            : [
                '0 0 20px rgba(255, 255, 255, 0.05)',
                '0 0 30px rgba(255, 255, 255, 0.1)',
                '0 0 20px rgba(255, 255, 255, 0.05)',
              ],
        }}
        transition={isOpen ? {} : { repeat: Infinity, duration: 2 }}
        aria-label="Apri Copilot Chat"
      >
        {isOpen ? (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9h.01M12 9h.01M16 9h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`fixed bottom-24 right-6 z-50 flex w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl border bg-white/5 backdrop-blur-2xl transition-all duration-700 sm:w-[420px] ${
              showGlow
                ? 'border-neural-cyan/50 shadow-[0_0_80px_rgba(0,255,255,0.15)]'
                : 'border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.5)]'
            }`}
            style={{ maxHeight: 'calc(100vh - 8rem)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 px-5 py-3 relative overflow-hidden">
              {showGlow && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-neural-cyan/20 to-transparent"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                />
              )}
              <div className="z-10 flex items-center gap-2">
                <div>
                  <p className="text-[0.55rem] uppercase tracking-[0.5em] text-neural-cyan/80">
                    Spatial Agent
                  </p>
                  <p className="text-sm font-semibold text-white">Copilot</p>
                </div>
              </div>
              <div className="z-10 flex flex-col items-end">
                <div className="flex items-center gap-1.5 text-[0.6rem] text-white/50">
                  <span className="h-1.5 w-1.5 rounded-full bg-neural-cyan" />
                  Online
                </div>
                <AnimatePresence>
                  {showGlow && sources.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-1 flex items-center gap-1 rounded-full border border-neural-cyan/30 bg-neural-cyan/10 px-2 py-0.5 text-[0.55rem] text-neural-cyan"
                    >
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Retrieved {sources.length} docs
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Suggestions */}
            <div className="border-b border-white/5 px-5 py-3">
              <p className="text-[0.55rem] uppercase tracking-[0.3em] text-white/30">
                Suggerimenti
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => {
                      cycleSuggestion(index);
                      sendQuestion(suggestion);
                    }}
                    className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[0.65rem] text-white/70 transition hover:border-neural-cyan/50 hover:text-white"
                    disabled={isLoading}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-5 py-4 overscroll-contain" style={{ maxHeight: '320px' }} data-lenis-prevent="true">
              {messages.map((rawMessage, index) => {
                const message = rawMessage as any;
                const isAssistant = message.role === 'assistant';
                const content = message.content || message.parts?.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('') || '';
                const invocations = (message.toolInvocations && message.toolInvocations.length > 0) 
                  ? message.toolInvocations 
                  : (message.parts?.filter((p: any) => p.type === 'tool-invocation' || p.toolCallId).map((p: any) => {
                      if (p.toolInvocation) return p.toolInvocation;
                      return {
                        toolCallId: p.toolCallId,
                        toolName: p.type?.startsWith('tool-') ? p.type.substring(5) : p.toolName,
                        args: p.input || p.args || {},
                        state: p.state === 'output-available' ? 'result' : p.state || 'call'
                      };
                    }) || []);

                if (isAssistant) {
                  console.log('DEBUG MSG:', { id: message.id, content, invocations, raw: message });
                }

                return (
                  <div
                    key={`${message.id}-${index}`}
                    className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                  >
                    {content && (
                      <div
                        className={`max-w-[90%] rounded-xl px-3 py-2.5 text-xs leading-relaxed ${
                          isAssistant
                            ? 'bg-white/10 text-white/90 shadow-[0_10px_30px_rgba(0,0,0,0.35)]'
                            : 'bg-neural-cyan/20 border border-neural-cyan/30 text-white shadow-[0_10px_25px_rgba(0,0,0,0.4)]'
                        }`}
                      >
                        <p className="mb-1 text-[0.5rem] uppercase tracking-[0.4em] opacity-50">
                          {isAssistant ? 'Copilot' : 'Tu'}
                        </p>
                        <div className="space-y-2">
                          {content.split('\n').filter(Boolean).map((paragraph: any, idx: any) => (
                            <p key={idx}>{paragraph}</p>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Generative UI based on Tool Invocations */}
                    {invocations.map((toolInvocation: any) => {
                      const { toolName, toolCallId, args } = toolInvocation;

                      if (toolName === 'showSkillsRadar') {
                        return <SkillsRadar key={toolCallId} />;
                      }
                      
                      if (toolName === 'showProjectCard') {
                        return <ProjectCard key={toolCallId} projectName={(args as any)?.projectName || ''} />;
                      }
                      
                      if (toolName === 'MapsPortfolioSection') {
                        const sectionName = (args as any)?.section || 'una sezione pertinente';
                        return (
                          <div key={toolCallId} className="mt-2 text-[0.6rem] text-neural-cyan italic">
                            🚀 Navigazione spaziale verso {sectionName}
                          </div>
                        );
                      }

                      return null;
                    })}

                    {isAssistant && message.id === messages[messages.length - 1].id && sources.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1 text-[0.5rem] text-white/50">
                        {sources.map((source) => (
                          <Badge
                            key={source.id}
                            variant="outline"
                            className="border-white/20 text-[0.5rem] text-white/70"
                          >
                            {source.title}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              {isLoading && (
                <motion.div
                  className="flex items-center gap-2 text-xs text-neural-cyan/70"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <span className="h-2 w-2 rounded-full bg-neural-cyan" />
                  Sto analizzando lo spazio latente...
                </motion.div>
              )}
              {error && (
                <div className="text-xs text-red-400">
                  Si è verificato un errore: {error.message}
                </div>
              )}
              <div ref={scrollAnchor} />
            </div>

            {/* Input */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (!localInput.trim() || isLoading) return;
                const sendMsg = append || sendMessage;
                if (sendMsg) sendMsg({ role: 'user', content: localInput });
                setLocalInput('');
              }}
              className="border-t border-white/5 px-5 py-3"
            >
              <div className="rounded-xl border border-white/10 bg-white/5 focus-within:border-neural-cyan/50 transition-colors">
                <textarea
                  value={localInput}
                  onChange={(e) => setLocalInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      e.currentTarget.form?.requestSubmit();
                    }
                  }}
                  placeholder="Invia comando al copilot..."
                  rows={2}
                  className="h-16 w-full resize-none bg-transparent px-3 py-2 text-xs text-white placeholder-white/30 outline-none caret-neural-cyan"
                  style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}
                />
                <div className="flex items-center justify-between px-3 pb-2">
                  <div className="ml-auto">
                    <button
                      type="submit"
                      disabled={isLoading || !localInput || localInput.trim().length < 3}
                      className="rounded-full border border-neural-cyan/30 bg-neural-cyan/10 px-4 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-neural-cyan transition hover:bg-neural-cyan hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Invia
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
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

# src\components\PerformanceMonitor.tsx

```tsx
'use client';

import { useEffect } from 'react';
import type { WebVitalsMetric, ReportHandler } from 'web-vitals';

// Componente per tracciare le web vitals
export default function PerformanceMonitor() {
  useEffect(() => {
    // Importiamo la libreria web-vitals solo sul client
    if (typeof window !== 'undefined') {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        // Funzione per inviare i dati di performance
        const sendToAnalytics: ReportHandler = (metric: WebVitalsMetric) => {
          // Log alla console per debug
          if (process.env.NODE_ENV !== 'production') {
            console.log(metric);
          }
          
          // Invia i dati all'endpoint API
          const body = JSON.stringify({
            name: metric.name,
            value: metric.value,
            id: metric.id,
            delta: metric.delta,
            navigation: metric.entries && metric.entries[0]?.name,
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: Date.now(),
          });

          // Utilizzo dell'API di Beacon quando disponibile per non bloccare la navigazione
          // Altrimenti fallback su fetch
          const sendBeacon = navigator.sendBeacon && navigator.sendBeacon('/api/metrics', body);
          
          if (!sendBeacon) {
            fetch('/api/metrics', {
              keepalive: true,
              method: 'POST',
              body,
              headers: { 'Content-Type': 'application/json' },
            });
          }
        };

        // Monitoraggio delle Core Web Vitals
        getCLS(sendToAnalytics); // Cumulative Layout Shift
        getFID(sendToAnalytics); // First Input Delay
        getFCP(sendToAnalytics); // First Contentful Paint
        getLCP(sendToAnalytics); // Largest Contentful Paint
        getTTFB(sendToAnalytics); // Time to First Byte
      });
    }
  }, []);

  // Questo componente non renderizza nulla
  return null;
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

# src\components\RagChat.tsx

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Badge from '@/components/ui/Badge';
import { useChat } from '@ai-sdk/react';
import { useAppStore } from '@/store/useAppStore';
import SkillsRadar from '@/components/ui/rag/SkillsRadar';
import ProjectCard from '@/components/ui/rag/ProjectCard';

const suggestionPool = [
  'Quali metriche hai raggiunto durante la B.Future Challenge?',
  'Raccontami il tirocinio al laboratorio LACAM.',
  'Come puoi aiutare un team a integrare un copilot AI?',
  'Mostrami le tue competenze in ambito AI.',
  'Portami alla sezione dei tuoi progetti!',
];

function pickRandomSuggestion(exclude: string[] = []) {
  const available = suggestionPool.filter((item) => !exclude.includes(item));
  const pool = available.length > 0 ? available : suggestionPool;
  return pool[Math.floor(Math.random() * pool.length)];
}

function getInitialSuggestions(count: number) {
  const selections: string[] = [];
  for (let i = 0; i < count; i += 1) {
    selections.push(pickRandomSuggestion(selections));
  }
  return selections;
}

export default function RagChat() {
  const [suggestions, setSuggestions] = useState<string[]>(() => suggestionPool.slice(0, 3));
  const [sources, setSources] = useState<any[]>([]);
  const scrollAnchor = useRef<HTMLDivElement | null>(null);
  const isMounted = useRef(false);
  const [showGlow, setShowGlow] = useState(false);
  
  const flyToSection = useAppStore(state => state.flyToSection);
  const [localInput, setLocalInput] = useState('');

  // @ts-ignore
  const { messages, isLoading, error, append, sendMessage } = useChat({
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Ciao! Sono il copilot del portfolio, un agente spaziale. Chiedimi qualsiasi cosa sul percorso di Vito, oppure chiedimi di navigare verso una sezione specifica!',
      }
    ],
    onResponse: (response) => {
      const sourcesHeader = response.headers.get('x-rag-sources');
      if (sourcesHeader) {
        try {
          const parsedSources = JSON.parse(atob(sourcesHeader));
          if (parsedSources.length > 0) {
            setSources(parsedSources);
            setShowGlow(true);
            setTimeout(() => setShowGlow(false), 5000);
          }
        } catch (e) {
          console.error("Failed to parse sources", e);
        }
      }
    },
    onToolCall: ({ toolCall }) => {
       if (toolCall.toolName === 'MapsPortfolioSection') {
           const section = (toolCall.args as any).section;
           if (section) {
               flyToSection(section);
           }
       }
    }
  });

  const sendQuestion = (question: string) => {
      const sendMsg = append || sendMessage;
      if (sendMsg) {
          sendMsg({
              role: 'user',
              content: question
          });
      }
  };

  const cycleSuggestion = (index: number) => {
    setSuggestions((prev) => {
      const next = [...prev];
      const exclude = next.filter((_, idx) => idx !== index);
      next[index] = pickRandomSuggestion(exclude);
      return next;
    });
  };

  useEffect(() => {
    setSuggestions(getInitialSuggestions(3));
  }, []);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    if (scrollAnchor.current) {
      const rect = scrollAnchor.current.getBoundingClientRect();
      const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
      if (!isVisible) {
        scrollAnchor.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [messages, isLoading]);

  return (
    <div className={`flex flex-col overflow-hidden rounded-3xl border bg-white/5 backdrop-blur-2xl transition-all duration-700 w-full h-full ${
      showGlow
        ? 'border-neural-cyan/50 shadow-[0_0_80px_rgba(0,255,255,0.15)]'
        : 'border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.45)]'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 px-6 py-4 relative overflow-hidden">
        {showGlow && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-neural-cyan/20 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        )}
        <div className="z-10 flex items-center gap-2">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-neural-cyan/80">
              Spatial Agent
            </p>
            <p className="text-lg font-semibold text-white">Copilot</p>
          </div>
        </div>
        <div className="z-10 flex flex-col items-end">
          <div className="flex items-center gap-2 text-xs text-white/50">
            <span className="h-2 w-2 rounded-full bg-neural-cyan" />
            Online
          </div>
          {showGlow && sources.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 flex items-center gap-1 rounded-full border border-neural-cyan/30 bg-neural-cyan/10 px-2 py-0.5 text-xs text-neural-cyan"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Retrieved {sources.length} docs
            </motion.div>
          )}
        </div>
      </div>

      {/* Suggestions */}
      <div className="border-b border-white/5 px-6 py-4">
        <p className="text-xs uppercase tracking-[0.3em] text-white/30">
          Suggerimenti
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => {
                cycleSuggestion(index);
                sendQuestion(suggestion);
              }}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/80 transition hover:border-neural-cyan/50 hover:text-white"
              disabled={isLoading}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-6 max-h-[28rem]">
        {messages.map((message) => {
          const isAssistant = message.role === 'assistant';

          return (
            <div
              key={message.id}
              className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
            >
              {message.content && (
                <div
                  className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    isAssistant
                      ? 'bg-white/10 text-white/90 shadow-[0_10px_30px_rgba(0,0,0,0.35)]'
                      : 'bg-neural-cyan/20 border border-neural-cyan/30 text-white shadow-[0_10px_25px_rgba(0,0,0,0.4)]'
                  }`}
                >
                  <p className="mb-1 text-[0.65rem] uppercase tracking-[0.4em] opacity-50">
                    {isAssistant ? 'Copilot' : 'Tu'}
                  </p>
                  <div className="space-y-3">
                    {message.content.split('\n').filter(Boolean).map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Generative UI based on Tool Invocations */}
              {message.toolInvocations?.map((toolInvocation) => {
                const { toolName, toolCallId, args } = toolInvocation;

                if (toolName === 'showSkillsRadar') {
                  return <SkillsRadar key={toolCallId} />;
                }
                
                if (toolName === 'showProjectCard') {
                  return <ProjectCard key={toolCallId} projectName={(args as any).projectName} />;
                }
                
                if (toolName === 'MapsPortfolioSection') {
                  return (
                    <div key={toolCallId} className="mt-2 text-xs text-neural-cyan italic">
                      🚀 Navigazione spaziale verso {(args as any).section}...
                    </div>
                  );
                }

                return null;
              })}

              {isAssistant && message.id === messages[messages.length - 1].id && sources.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-white/50">
                  {sources.map((source) => (
                    <Badge
                      key={source.id}
                      variant="outline"
                      className="border-white/20 text-[0.6rem] text-white/70"
                    >
                      {source.title}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {isLoading && (
          <motion.div
            className="flex items-center gap-3 text-sm text-neural-cyan/70"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <span className="h-3 w-3 rounded-full bg-neural-cyan" />
            Sto analizzando lo spazio latente...
          </motion.div>
        )}
        {error && (
          <div className="text-sm text-red-400">
            Si è verificato un errore: {error.message}
          </div>
        )}
        <div ref={scrollAnchor} />
      </div>

      {/* Input */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (!localInput.trim() || isLoading) return;
            const sendMsg = append || sendMessage;
            if (sendMsg) sendMsg({ role: 'user', content: localInput });
            setLocalInput('');
          }}
          className="px-6 py-5"
        >
        <div className="rounded-2xl border border-white/10 bg-white/5 focus-within:border-neural-cyan/50 transition-colors">
          <textarea
            value={localInput}
            onChange={(e) => setLocalInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                e.currentTarget.form?.requestSubmit();
              }
            }}
            placeholder="Invia comando al copilot..."
            rows={3}
            className="h-28 w-full resize-none bg-transparent px-4 py-3 text-sm text-white placeholder-white/30 outline-none caret-neural-cyan"
            style={{ color: '#ffffff', WebkitTextFillColor: '#ffffff' }}
          />
          <div className="flex items-center justify-between px-4 pb-3">
            <div className="ml-auto">
              <button
                type="submit"
                disabled={isLoading || !localInput || localInput.trim().length < 3}
                className="rounded-full border border-neural-cyan/30 bg-neural-cyan/10 px-6 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-neural-cyan transition hover:bg-neural-cyan hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
              >
                Invia
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

```

# src\components\ScrollToTopButton.tsx

```tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Framer Motion variants for wow effect
  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.5, rotate: -45 },
    visible: { opacity: 1, scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 500, damping: 30 } },
    hover: { scale: 1.1, rotate: 10, transition: { yoyo: Infinity, duration: 0.4 } },
    tap: { scale: 0.9, rotate: -10, transition: { duration: 0.1 } },
    exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial="hidden"
          animate="visible"
          whileHover="hover"
          whileTap="tap"
          exit="exit"
          variants={buttonVariants}
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 p-3 sm:p-4 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-2xl backdrop-blur-lg text-white z-50"
          style={{
            width: '46px',
            height: '46px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 sm:h-6 sm:w-6"
            initial={{ y: 0 }}
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          >
            <path d="M5 15l7-7 7 7" />
          </motion.svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

```

# src\components\sections\AboutSection.tsx

```tsx
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import portraitImg from '@/../public/me.jpg';
import {
  FaGraduationCap,
  FaBrain,
  FaLanguage,
  FaShieldAlt,
  FaGithub,
  FaLinkedin,
  FaEnvelope,
} from 'react-icons/fa';
import SectionHeader from '@/components/ui/SectionHeader';
import NeuralCard from '@/components/ui/NeuralCard';
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
  { label: 'Recommender Systems & Multi-Agent LLM', icon: <FaBrain className="text-neural-cyan" /> },
  { label: 'NLP, Transformer & Explainability', icon: <FaLanguage className="text-neural-cyan" /> },
  { label: 'Workflow Automation (n8n · API Integration)', icon: <FaShieldAlt className="text-neural-cyan" /> },
];

const socialLinks = [
  { icon: <FaGithub className="text-white" />, href: 'https://github.com/Hellvisback365', label: 'GitHub' },
  {
    icon: <FaLinkedin className="text-white" />,
    href: 'https://www.linkedin.com/in/vito-p-9120028a/',
    label: 'LinkedIn',
  },
  { icon: <FaEnvelope className="text-white" />, href: 'mailto:vitopiccolini@live.it', label: 'Email' },
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

export default function AboutSection() {
  return (
    <section id='about' className='container mx-auto px-4 py-16' aria-labelledby='about-title'>
      <span id='about-title' className='sr-only'>
        Chi sono
      </span>

      <div className='space-y-12'>
        <SectionHeader
          eyebrow='Chi sono'
          title='Studente in Computer Science – Artificial Intelligence'
          description='Laureando magistrale appassionato di IA e Machine Learning, con esperienza in sistemi di raccomandazione LLM-driven e automazione workflow.'
          align='left'
        />

        <div className='grid gap-10 lg:grid-cols-[0.9fr,1.1fr]'>
          <NeuralCard tone='primary' padding='none' className='overflow-hidden'>
            <div className='group relative isolate mx-auto w-full max-w-[360px] overflow-hidden sm:max-w-[420px] lg:max-w-[440px]'>
              <div className='relative aspect-[4/5] w-full overflow-hidden sm:aspect-[5/6]'>
                <Image
                  src={portraitImg}
                  alt='Vito Piccolini'
                  fill
                  priority
                  quality={90}
                  placeholder='blur'
                  sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw'
                  className='object-cover transition duration-700 ease-out group-hover:scale-[1.04]'
                  style={{ objectPosition: 'center 18%' }}
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent' />
                <div className='absolute inset-0 border border-white/15 mix-blend-screen opacity-70' />
                <div className='absolute bottom-4 left-4 flex items-center gap-3 text-[0.6rem] uppercase tracking-[0.45em] text-white/70 sm:text-xs'>
                  <span className='h-2 w-2 rounded-full bg-neural-cyan' />
                  Ritratto · Bari 2025
                </div>
              </div>
              <div className='pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100'>
                <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(93,224,230,0.18),_transparent_60%)]' />
              </div>
            </div>
            <div className='border-t border-white/10 bg-black/40 px-6 py-6 backdrop-blur'>
              <p className='text-xs uppercase tracking-[0.35em] text-white/60'>AI Developer</p>
              <h3 className='mt-2 text-2xl font-semibold text-white'>Vito Piccolini</h3>
              <p className='mt-1 text-sm text-white/70'>
                Sviluppo sistemi di raccomandazione LLM-driven, architetture multi-agente e automazioni workflow con Python e LangGraph.
              </p>
              <div className='mt-4 flex gap-3'>
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target='_blank'
                    rel='noreferrer'
                    className='flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 transition-colors hover:border-neural-cyan/70'
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </NeuralCard>

          <NeuralCard padding='lg'>
            <div className='space-y-5 text-sm text-white/80'>
              <p>
                Dopo la laurea triennale in Informatica (107/110) sto proseguendo con la LM-18 in Computer Science – Artificial Intelligence 
                presso l&apos;Università degli Studi di Bari Aldo Moro. Ho partecipato alla B.Future Challenge 2025 con il team VAR Group.
              </p>
              <p>
                Durante il tirocinio nel laboratorio LACAM-SWAP ho sviluppato un&apos;architettura multi-agente basata su LLM, orchestrata con 
                LangGraph, ottenendo +12% di diversità e +53% precision@1 nei sistemi di raccomandazione.
              </p>
              <p>
                Sono appassionato di AI, Machine Learning e automazione workflow. Competenze in Python, LangChain, LangGraph, React, Node.js 
                e n8n per prototipazione rapida in team multidisciplinari.
              </p>
              <div className='flex flex-wrap gap-2 pt-1'>
                {focusPills.map((pill) => (
                  <Badge key={pill} variant='outline' className='text-[0.6rem]'>
                    {pill}
                  </Badge>
                ))}
              </div>
            </div>
          </NeuralCard>
        </div>

        <div className='grid gap-6 md:grid-cols-2'>
          <NeuralCard padding='lg'>
            <p className='text-xs uppercase tracking-[0.35em] text-white/60'>Formazione</p>
            <div className='mt-4 space-y-4'>
              {formationItems.map((item) => (
                <div key={item.label} className='flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4'>
                  <FaGraduationCap className='mt-1 text-neural-cyan' />
                  <div>
                    <p className='text-sm font-semibold text-white'>{item.label}</p>
                    <p className='text-xs text-white/70'>{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </NeuralCard>

          <NeuralCard padding='lg'>
            <p className='text-xs uppercase tracking-[0.35em] text-white/60'>Interessi</p>
            <div className='mt-4 space-y-3'>
              {interestItems.map((interest) => (
                <div
                  key={interest.label}
                  className='flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3'
                >
                  {interest.icon}
                  <span className='text-sm text-white'>{interest.label}</span>
                </div>
              ))}
            </div>
          </NeuralCard>
        </div>
      </div>

      <div className='mt-20'>
        <SectionHeader
          eyebrow='Percorso'
          title='Ricerca, challenge e delivery'
          description='Esperienze che raccontano come unisco studio accademico, competizioni AI e implementazione di sistemi pronti alla produzione.'
          align='center'
        />

        <div className='relative mt-12'>
          <div className='absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-neural-cyan/40 via-white/15 to-neural-magenta/30' />
          <div className='space-y-10'>
            {timelineMilestones.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className='relative pl-16'
              >
                <div className='absolute left-0 top-4 flex flex-col items-center'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-black/60 text-sm font-semibold text-white shadow-neural-card'>
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>
                <NeuralCard padding='lg' className='w-full'>
                  <div className='flex flex-wrap items-center gap-3'>
                    <Badge variant='outline' className='text-[0.65rem]'>
                      {item.date}
                    </Badge>
                    <p className='text-xs uppercase tracking-[0.3em] text-white/50'>{item.location}</p>
                  </div>
                  <h4 className='mt-4 text-2xl font-semibold text-white'>{item.title}</h4>
                  <p className='mt-2 text-sm text-white/80'>{item.description}</p>
                  <ul className='mt-4 space-y-2 text-sm text-white/70'>
                    {item.highlights.map((highlight) => (
                      <li key={highlight} className='flex items-start gap-2'>
                        <span className='mt-1 h-1.5 w-1.5 rounded-full bg-neural-cyan' />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </NeuralCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

```

# src\components\sections\ContactSection.tsx

```tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
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
    icon: <FaEnvelope className='text-neural-cyan' />,
    href: 'mailto:vitopiccolini@live.it',
  },
  {
    label: 'Telefono',
    value: '+39 3937382774',
    helper: 'Disponibile 9:00–18:00, anche WhatsApp.',
    icon: <FaPhoneAlt className='text-neural-cyan' />,
    href: 'tel:+393937382774',
  },
  {
    label: 'Base operativa',
    value: 'Bari · Remote EU',
    helper: 'Patente B, trasferte in giornata su richiesta.',
    icon: <FaMapMarkerAlt className='text-neural-cyan' />,
  },
  {
    label: 'Disponibilità',
    value: 'Novembre 2025',
    helper: 'Stage curriculare LM-18 o collaborazione AI-first.',
    icon: <FaCalendarAlt className='text-neural-cyan' />,
  },
];

export default function ContactSection() {
  const { isMobile } = useResponsive();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Il nome è richiesto';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email è richiesta';
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
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setSubmitError('');
    try {
      console.log('Invio form di contatto...');
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      // Log della risposta completa
      console.log('Risposta del server:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      const data = await response.json();
      console.log('Dati risposta:', data);
      
      if (!response.ok) {
        const errorMsg = data.error || 'Errore invio del messaggio';
        console.error('Errore dal server:', errorMsg);
        throw new Error(errorMsg);
      }
      
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      console.error('Errore completo:', err);
      setSubmitError(err instanceof Error ? err.message : 'Si è verificato un errore');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="container mx-auto px-4 py-10 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 md:mb-12 text-center"
      >
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 text-gray-900 dark:text-white">
          Contattami
        </h2>
        <p className="text-base md:text-lg max-w-3xl mx-auto text-gray-700 dark:text-gray-300">
          Sto entrando nella Laurea Magistrale in Computer Science – AI (UniBa) e da novembre 2025 sono disponibile per stage, R&D o progetti che coinvolgono assistenti enterprise e workflow automation.
        </p>
      </motion.div>

      <div className="mb-10 grid gap-4 md:grid-cols-2">
        {contactDetails.map((item) => (
          <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-neural-card">
            <div className="flex items-center gap-3 text-white">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40">
                {item.icon}
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">{item.label}</p>
                {item.href ? (
                  <a
                    href={item.href}
                    className="text-lg font-semibold text-neural-cyan transition-colors hover:text-white"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-lg font-semibold">{item.value}</p>
                )}
              </div>
            </div>
            <p className="mt-3 text-sm text-white/70">{item.helper}</p>
          </div>
        ))}
      </div>

      <div className="max-w-2xl mx-auto">
        {submitSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 md:mb-8 rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm text-emerald-300 md:p-4"
            role="status"
            aria-live="polite"
          >
            Grazie per il tuo messaggio! Ti risponderò al più presto.
          </motion.div>
        )}
        {submitError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 md:mb-8 rounded-lg border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200 md:p-4"
            role="alert"
            aria-live="assertive"
          >
            {submitError}
          </motion.div>
        )}
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="glass-panel rounded-2xl p-4 shadow-neural-card md:p-8"
        >
          <div className="mb-4 md:mb-6">
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
              Nome
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 md:px-4 py-2 md:py-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/40 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-light dark:focus-visible:ring-offset-gray-800 dark:focus-visible:ring-primary-dark"
              placeholder="Il tuo nome"
              aria-required="true"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && (
              <p id="name-error" className="mt-1 text-xs md:text-sm text-red-600 dark:text-red-400" role="alert">
                {errors.name}
              </p>
            )}
          </div>
          <div className="mb-4 md:mb-6">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 md:px-4 py-2 md:py-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/40 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-light dark:focus-visible:ring-offset-gray-800 dark:focus-visible:ring-primary-dark"
              placeholder="La tua email"
              aria-required="true"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p id="email-error" className="mt-1 text-xs md:text-sm text-red-600 dark:text-red-400" role="alert">
                {errors.email}
              </p>
            )}
          </div>
          <div className="mb-4 md:mb-6">
            <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
              Messaggio
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={isMobile ? 4 : 5}
              className="w-full px-3 md:px-4 py-2 md:py-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/40 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-light dark:focus-visible:ring-offset-gray-800 dark:focus-visible:ring-primary-dark"
              placeholder="Il tuo messaggio"
              aria-required="true"
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? 'message-error' : undefined}
            />
            {errors.message && (
              <p id="message-error" className="mt-1 text-xs md:text-sm text-red-600 dark:text-red-400" role="alert">
                {errors.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 md:py-3 px-4 rounded-md bg-primary-light dark:bg-primary-dark text-white font-medium hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-light dark:focus-visible:ring-offset-gray-800 dark:focus-visible:ring-primary-dark ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Invio in corso...' : 'Invia Messaggio'}
          </button>
        </motion.form>
      </div>
    </section>
  );
} 
```

# src\components\sections\HeroSection.tsx

```tsx

'use client';

import { motion } from 'framer-motion';
import AnimatedTitle from '@/components/AnimatedTitle';
import Badge from '@/components/ui/Badge';
import CTAButton from '@/components/ui/CTAButton';

interface HeroSectionProps {
  onScrollToNext: () => void;
}

const text = `Ciao, mi chiamo\nVito Piccolini`;
const startPiccolini = text.indexOf('Piccolini');

const stackBadges = [
  'Python',
  'LangGraph · LangChain',
  'n8n Automations',
  'React · Next.js',
  'Gemini · Ollama',
];

export default function HeroSection({ onScrollToNext }: HeroSectionProps) {

  return (
    <section
      id="hero"
      className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-neural-grid text-white"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-neural-blue/60 to-black/80" />
      <div className="absolute inset-0 neural-grid-overlay" />
      <div className="absolute -left-20 top-10 w-72 h-72 rounded-full bg-neural-accent opacity-30 blur-3xl" />
      <div className="absolute right-0 bottom-0 w-80 h-80 rounded-full bg-neural-accent opacity-20 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mx-auto w-full max-w-4xl px-6 py-16 md:px-12"
      >
        <div className="flex flex-col gap-8 text-center items-center">
          <Badge variant="glow">
            Disponibile per progetti AI
          </Badge>

          <AnimatedTitle
            text={text}
            highlightFrom={startPiccolini}
            highlightClass="text-neural-magenta"
          />

          <p className="text-lg text-white/80 max-w-2xl">
            Laureando magistrale in <span className="text-neural-cyan">Computer Science – Artificial Intelligence</span>, 
            appassionato di IA e Machine Learning con esperienza in sistemi di raccomandazione LLM-driven.
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            {stackBadges.map((badge) => (
              <Badge key={badge} variant="outline">
                {badge}
              </Badge>
            ))}
          </div>

          <div className="flex flex-col gap-4 pt-2 sm:flex-row">
            <CTAButton href="#contact" variant="primary">
              Contattami
            </CTAButton>
            <CTAButton href="#projects" variant="secondary">
              Vedi i progetti
            </CTAButton>
          </div>
        </div>

        <motion.button
          type="button"
          onClick={onScrollToNext}
          className="mx-auto mt-12 flex flex-col items-center gap-2 text-white/70 transition-colors hover:text-white"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <span className="text-sm font-medium tracking-[0.4em]">SCORRI</span>
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, repeatType: 'loop', duration: 1.2, ease: 'easeInOut' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </motion.button>
      </motion.div>
    </section>
  );
} 
```

# src\components\sections\ProjectsSection.tsx

```tsx
'use client';

import { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { projects as projectsData, type ProjectData } from '@/data/projects';
import SectionHeader from '@/components/ui/SectionHeader';
import NeuralCard from '@/components/ui/NeuralCard';
import Badge from '@/components/ui/Badge';
import CTAButton from '@/components/ui/CTAButton';

const ProjectModal = dynamic(() => import('@/components/ProjectModal'), {
  ssr: false,
});

export default function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  const openProject = (project: ProjectData) => setSelectedProject(project);
  const closeProject = () => setSelectedProject(null);

  return (
    <>
      <section id="projects" className="relative z-10 mx-auto max-w-6xl px-6 py-20">
        <SectionHeader
          eyebrow="Case Studies"
          title="Esperienze AI & Platform consegnate end-to-end"
          description="Ogni progetto combina discovery, progettazione tecnica e un layer di osservabilità per consegne senza attriti. Ne seleziono alcuni che mostrano la cura per UX, privacy e integrazione LLM."
          align="center"
        />

        <div className="mt-12 space-y-10">
          {projectsData.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <NeuralCard padding="lg">
                <div className="flex flex-col gap-8 lg:flex-row">
                  <div className="lg:w-2/5">
                    <div className="relative h-64 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-contain p-6"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-neural-cyan/20 to-neural-magenta/20" />
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/70"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 space-y-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-white/60">{project.timeline}</p>
                        <h3 className="text-2xl font-semibold text-white">{project.title}</h3>
                        <p className="text-sm text-white/70">{project.subtitle}</p>
                      </div>
                      <Badge variant="glow" className="text-[0.65rem]">
                        {project.role}
                      </Badge>
                    </div>

                    <p className="text-sm text-white/80">{project.description}</p>

                    <div className="grid gap-4 sm:grid-cols-3">
                      {project.metrics.map((metric) => (
                        <div
                          key={`${project.id}-${metric.label}`}
                          className="rounded-2xl border border-white/10 bg-white/5 p-4"
                        >
                          <p className="text-xs uppercase tracking-[0.3em] text-white/60">{metric.label}</p>
                          <p className="mt-2 text-2xl font-semibold text-white">{metric.value}</p>
                          <p className="mt-1 text-xs text-white/70">{metric.caption}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {project.stack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white/60"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <CTAButton variant="primary" onClick={() => openProject(project)}>
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

                <div className="mt-6 flex flex-wrap gap-2">
                  {project.pillars.map((pillar) => (
                    <Badge key={pillar} variant="outline" className="text-[0.6rem]">
                      {pillar}
                    </Badge>
                  ))}
                </div>
              </NeuralCard>
            </motion.article>
          ))}
        </div>
      </section>

      <Suspense fallback={null}>
        <AnimatePresence>
          {selectedProject && (
            <ProjectModal project={selectedProject} onClose={closeProject} />
          )}
        </AnimatePresence>
      </Suspense>
    </>
  );
}
```

# src\components\sections\RagSection.tsx

```tsx
'use client';

import SectionHeader from '@/components/ui/SectionHeader';
import RagChat from '@/components/RagChat';

export default function RagSection() {
  return (
    <section id="copilot" className="container mx-auto px-4 py-16" aria-labelledby="copilot-title">
      <span id="copilot-title" className="sr-only">
        Copilot CV
      </span>
      <SectionHeader
        eyebrow="Copilot"
        title="Chat con il mio profilo"
        description="Questo RAG assistant indicizza CV, progetti e metriche direttamente da Qdrant. Usa le domande rapide oppure scrivi la tua per ricevere risposte con fonti verificabili."
        align="center"
      />

      <div className="mt-10">
        <RagChat />
      </div>
    </section>
  );
}

```

# src\components\sections\SkillsSection.tsx

```tsx
'use client';

import { motion } from 'framer-motion';
import type { ReactElement } from 'react';
import {
  SiPython,
  SiJavascript,
  SiTypescript,
  SiTensorflow,
  SiScikitlearn,
  SiReact,
  SiNodedotjs,
  SiMongodb,
  SiTailwindcss,
  SiFramer,
} from 'react-icons/si';
import { BsRobot, BsTranslate, BsGlobe } from 'react-icons/bs';
import { HiCode } from 'react-icons/hi';
import { FaBrain } from 'react-icons/fa';
import { TbWorldWww } from 'react-icons/tb';
import SectionHeader from '@/components/ui/SectionHeader';
import NeuralCard from '@/components/ui/NeuralCard';
import Badge from '@/components/ui/Badge';
import {
  capabilityTracks,
  toolHighlights,
  languages,
  type SkillIconKey,
} from '@/data/skills';

export default function SkillsSection() {
  const iconMap: Record<SkillIconKey, ReactElement> = {
    python: <SiPython className="text-lg" />,
    javascript: <SiJavascript className="text-lg" />,
    typescript: <SiTypescript className="text-lg" />,
    tensorflow: <SiTensorflow className="text-lg" />,
    scikitlearn: <SiScikitlearn className="text-lg" />,
    llms: <BsRobot className="text-lg" />,
    nlp: <BsTranslate className="text-lg" />,
    react: <SiReact className="text-lg" />,
    node: <SiNodedotjs className="text-lg" />,
    mongodb: <SiMongodb className="text-lg" />,
    tailwind: <SiTailwindcss className="text-lg" />,
    framer: <SiFramer className="text-lg" />,
    code: <HiCode className="text-2xl" />,
    brain: <FaBrain className="text-2xl" />,
    web: <TbWorldWww className="text-2xl" />,
    robot: <BsRobot className="text-lg" />,
    translate: <BsTranslate className="text-lg" />,
    globe: <BsGlobe className="text-2xl" />,
  };

  return (
    <section id="skills" className="relative z-10 mx-auto max-w-6xl px-6 py-20">
      <SectionHeader
        eyebrow="Skill Matrix"
        title="Capacità trasversali per prodotti AI-first"
        description="Dal brief al roll-out: combino ricerca, orchestrazione LangGraph, UX spiegabile e automazioni n8n per ridurre il time-to-impact dei progetti AI."
        align="center"
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.25fr,0.75fr]">
        <div className="space-y-6">
          {capabilityTracks.map((track, index) => (
            <motion.div
              key={track.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <NeuralCard padding="lg">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-neural-cyan">
                        {iconMap[track.icon]}
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-white/60">Capability</p>
                        <h3 className="text-2xl font-semibold text-white">{track.title}</h3>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.3em] text-white/50">
                      {track.stack.map((tool) => (
                        <span key={tool} className="rounded-full border border-white/15 px-3 py-1 text-white/70">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-white/80">{track.description}</p>
                  <div className="flex flex-wrap gap-3">
                    {track.focusAreas.map((focus) => (
                      <Badge key={focus} variant="outline" className="text-[0.65rem]">
                        {focus}
                      </Badge>
                    ))}
                  </div>
                </div>
              </NeuralCard>
            </motion.div>
          ))}
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <NeuralCard padding="lg">
              <p className="text-xs uppercase tracking-[0.35em] text-white/60">Toolchain</p>
              <div className="mt-6 space-y-5">
                {toolHighlights.map((cluster) => (
                  <div
                    key={cluster.area}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Badge variant="glow" className="text-[0.6rem]">
                        {cluster.area}
                      </Badge>
                      <span className="text-xs uppercase tracking-[0.3em] text-white/50">
                        {cluster.category}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-white/80">{cluster.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {cluster.tools.map((tool) => (
                        <span
                          key={tool}
                          className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/60"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </NeuralCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <NeuralCard tone="primary" padding="lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-neural-cyan">
                  <BsGlobe className="text-2xl" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-white/60">Competenze</p>
                  <h3 className="text-2xl font-semibold text-white">Lingue</h3>
                </div>
              </div>
              <div className="space-y-4">
                {languages.map((lang) => (
                  <div
                    key={lang.name}
                    className="rounded-2xl border border-white/15 bg-white/5 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-semibold text-white">{lang.name}</p>
                      <Badge variant="outline" className="text-[0.65rem]">
                        {lang.level}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm text-white/70">{lang.description}</p>
                  </div>
                ))}
              </div>
            </NeuralCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
```

# src\components\TechStack.tsx

```tsx
'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';

export default function TechStack() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Dark mode detection
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if dark mode is active on initial load
    setIsDarkMode(document.documentElement.classList.contains('dark'));
    
    // Set up a MutationObserver to watch for class changes on the html element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDarkMode(document.documentElement.classList.contains('dark'));
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => {
      observer.disconnect();
    };
  }, []);

  const headingStyle = {
    color: isDarkMode ? '#ffffff' : '#000000',  // white in dark mode, black in light mode
  };
  
  // Force white color for tech stack items
  const whiteTextStyle = {
    color: '#ffffff',
  };

  const technologies = [
    { name: 'Python', icon: '🐍' },
    { name: 'LLaMA', icon: '🦙' },
    { name: 'Mistral', icon: '🌪️' },
    { name: 'TensorFlow', icon: '📊' },

    { name: 'React', icon: '⚛️' },
    { name: 'Node.js', icon: '🟢' },
    { name: 'LangChain', icon: '🔗' },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-10 md:py-16 bg-transparent dark:bg-transparent transition-colors duration-200">
      <div className="container mx-auto px-4">
        <h2 className="text-xl md:text-3xl font-bold mb-8 md:mb-12 text-center" style={headingStyle}>
          Stack Tecnologico
        </h2>
        
        <motion.div
          ref={ref}
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 justify-items-center"
        >
          {technologies.map((tech, index) => (
            <motion.div
              key={index}
              variants={item}
              className="flex flex-col items-center p-3 md:p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow w-[90%] sm:w-28"
            >
              <span className="text-2xl md:text-3xl mb-1 md:mb-2 text-white" style={whiteTextStyle} role="img" aria-label={tech.name}>
                {tech.icon}
              </span>
              <span className="font-medium text-xs md:text-sm text-center text-white" style={whiteTextStyle}>
                {tech.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
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
import { motion } from 'framer-motion';

interface ProjectCardProps {
  projectName: string;
}

export default function ProjectCard({ projectName }: ProjectCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-2 flex flex-col gap-2 rounded-xl border border-neural-cyan/30 bg-black/40 p-4 shadow-[0_0_20px_rgba(0,255,255,0.1)] backdrop-blur-md"
    >
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-white">{projectName}</h4>
        <span className="rounded-full bg-neural-cyan/20 px-2 py-0.5 text-[0.6rem] uppercase tracking-widest text-neural-cyan">
          Case Study
        </span>
      </div>
      <p className="text-xs text-white/70">
        Sto recuperando le informazioni per il progetto {projectName}. Puoi trovare maggiori dettagli scorrendo la pagina o visitando la sezione progetti!
      </p>
      <button className="mt-2 w-full rounded-lg bg-white/10 py-1.5 text-xs text-white transition hover:bg-neural-cyan hover:text-black">
        Esplora Progetto
      </button>
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

# src\lib\profileDocuments.ts

```ts
import documents from '@/content/profile/documents.json';

export interface ProfileDocument {
  id: string;
  category: string;
  title: string;
  summary: string;
  body: string;
  tags: string[];
  updatedAt: string;
}

export function getProfileDocuments(): ProfileDocument[] {
  return (documents as ProfileDocument[]).map((doc) => ({
    ...doc,
    body: doc.body.trim(),
    tags: doc.tags ?? [],
  }));
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

# src\services\rag\embeddings.ts

```ts
import { OpenAIEmbeddings } from '@langchain/openai';
import type { EmbeddingsInterface } from '@langchain/core/embeddings';
import { getRagEnv } from './env';

export function createEmbeddings(): EmbeddingsInterface {
  const { openRouterApiKey, embeddingModel, openRouterBaseUrl, openRouterSite, openRouterTitle } = getRagEnv();
  return new OpenAIEmbeddings({
    apiKey: openRouterApiKey,
    model: embeddingModel,
    configuration: {
      baseURL: openRouterBaseUrl,
      defaultHeaders: {
        'HTTP-Referer': openRouterSite,
        'X-Title': openRouterTitle,
      },
    },
  });
}

```

# src\services\rag\env.ts

```ts
export interface RagEnv {
  openRouterApiKey: string;
  openRouterBaseUrl: string;
  openRouterSite: string;
  openRouterTitle: string;
  llmModel: string;
  embeddingModel: string;
}

let cachedEnv: RagEnv | null = null;

export function getRagEnv(): RagEnv {
  if (cachedEnv) return cachedEnv;

  const {
    OPENROUTER_API_KEY,
    OPENROUTER_BASE_URL,
    OPENROUTER_SITE_URL,
    OPENROUTER_APP_TITLE,
    RAG_LLM_MODEL,
    RAG_EMBEDDING_MODEL,
    OPENAI_API_KEY,
  } = process.env;

  const apiKey = OPENROUTER_API_KEY || OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('RAG env var missing: OPENROUTER_API_KEY or OPENAI_API_KEY must be provided.');
  }

  const isStandardOpenAi = !OPENROUTER_API_KEY && !!OPENAI_API_KEY;

  cachedEnv = {
    openRouterApiKey: apiKey,
    openRouterBaseUrl: OPENROUTER_BASE_URL || (isStandardOpenAi ? 'https://api.openai.com/v1' : 'https://openrouter.ai/api/v1'),
    openRouterSite: OPENROUTER_SITE_URL || 'https://vitopiccolini.dev',
    openRouterTitle: OPENROUTER_APP_TITLE || 'Vito Piccolini Copilot',
    llmModel: RAG_LLM_MODEL || (isStandardOpenAi ? 'gpt-4o-mini' : 'openrouter/google/gemini-flash-1.5'),
    embeddingModel: RAG_EMBEDDING_MODEL || (isStandardOpenAi ? 'text-embedding-3-small' : 'openai/text-embedding-3-large'),
  };

  return cachedEnv;
}

```

# src\services\rag\model.ts

```ts
import { ChatOpenAI } from '@langchain/openai';
import { getRagEnv } from './env';

let cachedModel: ChatOpenAI | null = null;

export function getChatModel() {
  if (!cachedModel) {
    const { openRouterApiKey, llmModel, openRouterBaseUrl, openRouterSite, openRouterTitle } = getRagEnv();
    cachedModel = new ChatOpenAI({
      apiKey: openRouterApiKey,
      modelName: llmModel,
      temperature: 0.2,
      configuration: {
        baseURL: openRouterBaseUrl,
        defaultHeaders: {
          'HTTP-Referer': openRouterSite,
          'X-Title': openRouterTitle,
        },
      },
    });
  }
  return cachedModel;
}

```

# src\services\rag\semanticCache.ts

```ts
export type CacheEntry = {
  vector: number[];
  answer: string;
  sources: { id: string; title: string; summary?: string; tags: string[] }[];
  timestamp: number;
};

// In-memory cache for demo/fast access.
// Can be replaced with Vercel KV / Redis.
const cache: Map<string, CacheEntry> = new Map();

function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export const semanticCache = {
  async get(queryVector: number[], threshold = 0.95): Promise<Omit<CacheEntry, 'vector'> | null> {
    for (const [, entry] of cache.entries()) {
      const similarity = cosineSimilarity(queryVector, entry.vector);
      if (similarity >= threshold) {
        return {
          answer: entry.answer,
          sources: entry.sources,
          timestamp: entry.timestamp,
        };
      }
    }
    return null;
  },

  async set(query: string, queryVector: number[], answer: string, sources: any[]): Promise<void> {
    cache.set(query, {
      vector: queryVector,
      answer,
      sources,
      timestamp: Date.now(),
    });
  },
};

```

# src\services\rag\vectorStore.ts

```ts
import { Document } from '@langchain/core/documents';
import type { EmbeddingsInterface } from '@langchain/core/embeddings';
import Fuse from 'fuse.js';
// Direct import so Vercel bundles the JSON automatically without fs.readFile paths failing
import vectorData from '@/data/vectorStore.json';

export type VectorPoint = {
  id: string;
  vector: number[];
  pageContent: string;
  metadata: Record<string, unknown>;
};

function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Reciprocal Rank Fusion
function computeRRF(vectorRanks: Map<string, number>, keywordRanks: Map<string, number>, k = 60): Map<string, number> {
  const rrfScores = new Map<string, number>();
  const allIds = new Set([...vectorRanks.keys(), ...keywordRanks.keys()]);
  
  for (const id of allIds) {
    let score = 0;
    if (vectorRanks.has(id)) {
      score += 1 / (k + vectorRanks.get(id)!);
    }
    if (keywordRanks.has(id)) {
      score += 1 / (k + keywordRanks.get(id)!);
    }
    rrfScores.set(id, score);
  }
  return rrfScores;
}

export type RetrieverOptions = {
  k?: number;
};

export class HybridRetriever {
  private fuse: Fuse<VectorPoint>;

  constructor(
    private readonly embeddings: EmbeddingsInterface | null,
    private readonly points: VectorPoint[],
    private readonly options?: RetrieverOptions
  ) {
    this.fuse = new Fuse(points, {
      keys: ['pageContent', 'metadata.title', 'metadata.tags'],
      includeScore: true,
      threshold: 0.6,
    });
  }

  async invoke(query: string): Promise<Document[]> {
    const k = this.options?.k ?? 15;

    // Keyword Search (always runs)
    const keywordResults = this.fuse.search(query);
    const keywordRanks = new Map<string, number>();
    keywordResults.forEach((res, idx) => keywordRanks.set(res.item.id, idx + 1));

    let vectorRanks = new Map<string, number>();

    // Vector Search (if embeddings available)
    if (this.embeddings) {
      try {
        const queryVector = await this.embeddings.embedQuery(query);
        const vectorResults = this.points
          .map(point => ({
            id: point.id,
            score: cosineSimilarity(queryVector, point.vector)
          }))
          .sort((a, b) => b.score - a.score);

        vectorResults.forEach((res, idx) => vectorRanks.set(res.id, idx + 1));
      } catch (err) {
        console.error('[RAG] Embedding query failed, falling back to keyword-only', err);
      }
    }

    // If no vector embeddings available/successful, just use keyword results
    if (vectorRanks.size === 0) {
      const topIds = keywordResults.slice(0, k).map(r => r.item.id);
      return topIds.map(id => {
        const point = this.points.find(p => p.id === id)!;
        return new Document({
          pageContent: point.pageContent,
          metadata: point.metadata,
        });
      });
    }

    // RRF Fusion (Combines Semantic + Keyword Search)
    const rrfScores = computeRRF(vectorRanks, keywordRanks);
    
    const finalIds = Array.from(rrfScores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, k)
      .map(entry => entry[0]);

    return finalIds.map(id => {
      const point = this.points.find(p => p.id === id)!;
      return new Document({
        pageContent: point.pageContent,
        metadata: point.metadata,
      });
    });
  }
}

let retrieverCache: HybridRetriever | null = null;

export async function getVectorStore(options?: { embeddings?: EmbeddingsInterface; k?: number }) {
  if (!retrieverCache || options?.k) {
    let embeddings: EmbeddingsInterface | null = options?.embeddings ?? null;
    
    // Try to init embeddings dynamically if none provided
    if (!embeddings) {
      try {
        const { createEmbeddings } = await import('./embeddings');
        embeddings = createEmbeddings();
      } catch (err) {
        console.error('[RAG] Failed to init embeddings, using keyword-only mode', err);
      }
    }

    const pointsCache = vectorData as VectorPoint[];
    const retriever = new HybridRetriever(embeddings, pointsCache, { k: options?.k ?? 15 });
    
    if (!options?.k || options.k === 15) {
      retrieverCache = retriever;
    }
    return retriever;
  }

  return retrieverCache;
}


```

# src\store\useAppStore.ts

```ts
import { create } from 'zustand';

interface AppState {
  targetSection: string | null;
  setTargetSection: (section: string | null) => void;
  flyToSection: (section: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  targetSection: null,
  setTargetSection: (section) => set({ targetSection: section }),
  flyToSection: (section) => {
    set({ targetSection: section });
    // Evento per scollegare eventuali logiche lenis o scroll manuale
    // Dispatchamo un evento custom che HtmlOverlay o NavigationOverlay possono ascoltare
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('navigate-section', { detail: { section } });
      window.dispatchEvent(event);
    }
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
    OPENROUTER_API_KEY: string;
    OPENROUTER_BASE_URL?: string;
    OPENROUTER_SITE_URL?: string;
    OPENROUTER_APP_TITLE?: string;
    QDRANT_URL: string;
    QDRANT_API_KEY: string;
    QDRANT_COLLECTION: string;
    RAG_LLM_MODEL?: string;
    RAG_EMBEDDING_MODEL?: string;
  }
} 
```

# src\types\web-vitals.d.ts

```ts
// Dichiarazione di tipi per il modulo web-vitals
declare module 'web-vitals' {
  // Tipi per le metriche Web Vitals
  export interface WebVitalsMetric {
    id: string;
    name: string;
    value: number;
    delta: number;
    entries: PerformanceEntry[];
    navigationType?: string;
  }

  // Tipi per le funzioni di misurazione
  export type ReportHandler = (metric: WebVitalsMetric) => void;

  // Funzioni principali esportate dal modulo
  export function getCLS(onReport: ReportHandler, reportAllChanges?: boolean): void;
  export function getFCP(onReport: ReportHandler): void;
  export function getFID(onReport: ReportHandler): void;
  export function getLCP(onReport: ReportHandler, reportAllChanges?: boolean): void;
  export function getTTFB(onReport: ReportHandler): void;
} 
```

# tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#FFFFFF',
        'primary-dark': '#E2E8F0',
        'neural-blue': '#050505',
        'neural-indigo': '#080808',
        'neural-cyan': '#FFFFFF',
        'neural-magenta': '#FFFFFF',
        'neural-void': '#030303',
      },
      backgroundImage: {
        'neural-grid': 'radial-gradient(circle at center, rgba(255, 255, 255, 0.05) 0, transparent 45%), linear-gradient(120deg, rgba(255,255,255,0.02), rgba(3,3,3,0.9))',
        'neural-card': 'linear-gradient(135deg, rgba(10,10,10,0.8), rgba(25,25,25,0.6))',
        'neural-accent': 'linear-gradient(120deg, #FFFFFF, #E2E8F0)',
      },
      boxShadow: {
        'neural-glow': '0 10px 40px rgba(255, 255, 255, 0.05)',
        'neural-card': '0 20px 60px rgba(0, 0, 0, 0.8)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

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

