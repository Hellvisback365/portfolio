declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    GROQ_API_KEY: string;
    DEEPSEEK_API_KEY?: string;
    RAG_CHAT_MODEL: string;
    RAG_ROUTER_MODEL: string;
    UPSTASH_REDIS_REST_URL?: string;
    UPSTASH_REDIS_REST_TOKEN?: string;
    LANGFUSE_PUBLIC_KEY?: string;
    LANGFUSE_SECRET_KEY?: string;
    LANGFUSE_BASEURL?: string;
  }
}