declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    GROQ_API_KEY: string;
    GOOGLE_GENERATIVE_AI_API_KEY: string;
    RAG_CHAT_MODEL: string;
    RAG_ROUTER_MODEL: string;
  }
} 