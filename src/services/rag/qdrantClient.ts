import { QdrantClient } from '@qdrant/js-client-rest';
import { getRagEnv } from './env';

let cachedClient: QdrantClient | null = null;

export function getQdrantClient(): QdrantClient {
  if (!cachedClient) {
    const { qdrantUrl, qdrantApiKey } = getRagEnv();
    cachedClient = new QdrantClient({
      url: qdrantUrl,
      apiKey: qdrantApiKey,
    });
  }
  return cachedClient;
}
