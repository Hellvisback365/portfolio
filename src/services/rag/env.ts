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
    embeddingModel: RAG_EMBEDDING_MODEL || (isStandardOpenAi ? 'text-embedding-3-small' : 'openrouter/openai/text-embedding-3-large'),
  };

  return cachedEnv;
}
