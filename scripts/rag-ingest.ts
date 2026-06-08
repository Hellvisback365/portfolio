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
