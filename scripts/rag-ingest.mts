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
