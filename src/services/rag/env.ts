export interface RagEnv {
  qdrantUrl: string;
  qdrantApiKey: string;
  qdrantCollection: string;
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
    QDRANT_URL,
    QDRANT_API_KEY,
    QDRANT_COLLECTION,
    OPENROUTER_API_KEY,
    OPENROUTER_BASE_URL,
    OPENROUTER_SITE_URL,
    OPENROUTER_APP_TITLE,
    RAG_LLM_MODEL,
    RAG_EMBEDDING_MODEL,
  } = process.env;

  if (!QDRANT_URL || !QDRANT_API_KEY || !QDRANT_COLLECTION) {
    throw new Error('RAG env vars missing: please set QDRANT_URL, QDRANT_API_KEY and QDRANT_COLLECTION.');
  }

  if (!OPENROUTER_API_KEY) {
    throw new Error('RAG env var missing: OPENROUTER_API_KEY must be provided.');
  }

  cachedEnv = {
    qdrantUrl: QDRANT_URL,
    qdrantApiKey: QDRANT_API_KEY,
    qdrantCollection: QDRANT_COLLECTION,
    openRouterApiKey: OPENROUTER_API_KEY,
    openRouterBaseUrl: OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
    openRouterSite: OPENROUTER_SITE_URL || 'https://vitopiccolini.dev',
    openRouterTitle: OPENROUTER_APP_TITLE || 'Vito Piccolini Copilot',
    llmModel: RAG_LLM_MODEL || 'openrouter/google/gemini-flash-1.5',
    embeddingModel: RAG_EMBEDDING_MODEL || 'openrouter/openai/text-embedding-3-large',
  };

  return cachedEnv;
}
