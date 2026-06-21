/**
 * Ingest RAG v2 — `npm run rag:ingest`
 *
 * 1. Legge src/data/projects.ts, src/data/about.ts, src/data/skills.ts
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

import { writeFileSync, mkdirSync } from 'node:fs';
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
  let lastSentence = '';

  for (const sentence of sentences) {
    if (current && (current + ' ' + sentence).length > CHUNK_SIZE) {
      chunks.push(current);
      // overlap vero: prependi l'ultima frase del chunk precedente
      current = lastSentence ? `${lastSentence} ${sentence}` : sentence;
    } else {
      current = current ? `${current} ${sentence}` : sentence;
    }
    lastSentence = sentence;
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

function getStr(field: any): string {
  if (!field) return '';
  if (typeof field === 'string') return field;
  if (field.it) return field.it;
  if (field.en) return field.en;
  return String(field);
}

/** Trasforma un progetto del sito in un documento RAG */
function projectToDocument(p: any): ProfileDocument {
  const metrics = p.metrics
    .map((m: any) => `${getStr(m.label)}: ${getStr(m.value)} (${getStr(m.caption)})`)
    .join('; ');
  const links = p.links?.length
    ? ` Link: ${p.links.map((l: any) => `${l.label} ${l.href}`).join(', ')}.`
    : '';
  
  const stack = p.stack?.map(getStr).join(', ') || '';
  const tags = p.tags?.map(getStr) || [];

  const body =
    `${getStr(p.subtitle)}. ${getStr(p.longDescription)} ` +
    `Ruolo di Vito: ${getStr(p.role)}. Periodo: ${getStr(p.timeline)}. ` +
    `Stack: ${stack}. ` +
    `Risultati: ${metrics}.${links}`;
  return {
    id: `project-${p.id}`,
    category: 'project',
    title: getStr(p.title),
    summary: getStr(p.description),
    body,
    tags,
    updatedAt: new Date().toISOString(),
  };
}

/** Trasforma le skills in documenti RAG */
function trackToDocument(t: any): ProfileDocument {
  const stack = t.stack?.map(getStr) || [];
  const focusAreas = t.focusAreas?.map(getStr) || [];
  return {
    id: `skill-track-${getStr(t.title).replace(/\W+/g, '-').toLowerCase()}`,
    category: 'skills',
    title: `Competenze: ${getStr(t.title)}`,
    summary: getStr(t.description),
    body: `Aree di focus: ${focusAreas.join(', ')}. Stack tecnologico: ${stack.join(', ')}.`,
    tags: stack,
    updatedAt: new Date().toISOString(),
  };
}

function toolHighlightToDocument(t: any): ProfileDocument {
  const tools = t.tools?.map(getStr) || [];
  return {
    id: `tool-${getStr(t.area).replace(/\W+/g, '-').toLowerCase()}`,
    category: 'tools',
    title: `Strumenti e Tecnologie: ${getStr(t.area)} (${getStr(t.category)})`,
    summary: getStr(t.description),
    body: `Strumenti utilizzati: ${tools.join(', ')}.`,
    tags: tools,
    updatedAt: new Date().toISOString(),
  };
}

function languageToDocument(l: any): ProfileDocument {
  const langName = getStr(l.name);
  return {
    id: `lang-${langName.toLowerCase()}`,
    category: 'languages',
    title: `Lingua: ${langName}`,
    summary: `Livello: ${getStr(l.level)}`,
    body: getStr(l.description),
    tags: ['language', langName.toLowerCase()],
    updatedAt: new Date().toISOString(),
  };
}

/** Crea documenti per about/bio */
function aboutToDocuments(personalInfo: any, formationItems: any[], timelineMilestones: any[]): ProfileDocument[] {
  const docs: ProfileDocument[] = [];
  
  // Bio
  docs.push({
    id: 'bio-vision',
    category: 'bio',
    title: 'Profilo professionale e Informazioni Personali',
    summary: typeof personalInfo.shortBio === 'string' ? personalInfo.shortBio : personalInfo.shortBio.it,
    body: `Nome: ${personalInfo.name}. Data di nascita: ${personalInfo.birthDate}. Luogo di nascita: ${personalInfo.birthPlace}. Ruolo: ${personalInfo.role}. Disponibilità lavorativa: ${typeof personalInfo.jobStatus === 'string' ? personalInfo.jobStatus : personalInfo.jobStatus.it}. Vive a: ${personalInfo.location}. ${typeof personalInfo.longBio === 'string' ? personalInfo.longBio : personalInfo.longBio.it}`,
    tags: ['bio', 'vision', 'location', 'birth', 'job'],
    updatedAt: new Date().toISOString(),
  });

  // Education
  docs.push({
    id: 'education-track',
    category: 'education',
    title: 'Percorso formativo e Istruzione',
    summary: 'Laurea in Informatica, Laurea Magistrale in AI, Diploma (Maturità).',
    body: formationItems.map((f: any) => `${getStr(f.label)} (${getStr(f.detail)})`).join('. '),
    tags: ['education', 'degree', 'diploma', 'maturità', 'scuola', 'voto'],
    updatedAt: new Date().toISOString(),
  });

  // Timeline
  timelineMilestones.forEach((m: any) => {
    const highlights = m.highlights?.it?.join(' ') || m.highlights?.join(' ') || '';
    docs.push({
      id: `timeline-${m.id}`,
      category: 'experience',
      title: `Esperienza: ${getStr(m.title)}`,
      summary: getStr(m.description),
      body: `Data: ${getStr(m.date)}. Luogo: ${getStr(m.location)}. Dettagli: ${highlights}`,
      tags: ['experience', 'work', 'hackathon'],
      updatedAt: new Date().toISOString(),
    });
  });

  return docs;
}

async function main() {
  const projectsData: any = await import('../src/data/projects.ts');
  const skillsData: any = await import('../src/data/skills.ts');
  const aboutData: any = await import('../src/data/about.ts');
  
  const projects = projectsData.projects;
  const capabilityTracks = skillsData.capabilityTracks;
  const toolHighlights = skillsData.toolHighlights;
  const languages = skillsData.languages;
  
  const personalInfo = aboutData.personalInfo;
  const formationItems = aboutData.formationItems;
  const timelineMilestones = aboutData.timelineMilestones;

  const projectDocs = projects.map(projectToDocument);
  const skillDocs = [
    ...capabilityTracks.map(trackToDocument),
    ...toolHighlights.map(toolHighlightToDocument),
    ...languages.map(languageToDocument)
  ];
  const aboutDocs = aboutToDocuments(personalInfo, formationItems, timelineMilestones);

  const documents = [...projectDocs, ...skillDocs, ...aboutDocs];
  console.log(
    `[ingest] ${aboutDocs.length} about docs + ${skillDocs.length} skill docs + ${projectDocs.length} progetti = ${documents.length} documenti.`,
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

