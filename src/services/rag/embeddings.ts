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
