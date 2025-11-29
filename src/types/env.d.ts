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