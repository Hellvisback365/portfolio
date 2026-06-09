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
