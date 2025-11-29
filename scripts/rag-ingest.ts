import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import { Document } from '@langchain/core/documents';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { getProfileDocuments } from '@/lib/profileDocuments';
import { createEmbeddings } from '@/services/rag/embeddings';
import { getQdrantClient } from '@/services/rag/qdrantClient';
import { getRagEnv } from '@/services/rag/env';

async function recreateCollection(vectorSize: number) {
  const client = getQdrantClient();
  const { qdrantCollection } = getRagEnv();
  console.log(`[RAG] Preparing collection ${qdrantCollection} (size ${vectorSize}).`);
  await client.recreateCollection(qdrantCollection, {
    vectors: {
      size: vectorSize,
      distance: 'Cosine',
    },
  });
}

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
  const vectorSize = vectors[0]?.length ?? 0;
  if (!vectorSize) {
    throw new Error('Embedding model returned empty vectors. Verify RAG_EMBEDDING_MODEL.');
  }

  await recreateCollection(vectorSize);

  const { qdrantCollection } = getRagEnv();
  const client = getQdrantClient();
  const points = splitDocs.map((doc, idx) => {
    const metadata = {
      ...(doc.metadata ?? {}),
      chunkIndex: idx,
    };

    return {
      id: randomUUID(),
      vector: vectors[idx],
      payload: {
        pageContent: doc.pageContent,
        metadata,
      },
    };
  });

  console.log(`[RAG] Upserting ${points.length} points...`);
  await client.upsert(qdrantCollection, {
    wait: true,
    points,
  });

  console.log(`[RAG] Upserted ${points.length} chunks into ${qdrantCollection}.`);
}

main().catch((error) => {
  console.error('[RAG] Ingestion failed:', error);
  process.exit(1);
});
