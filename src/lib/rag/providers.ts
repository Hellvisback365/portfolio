import { createGroq } from '@ai-sdk/groq';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { createDeepSeek } from '@ai-sdk/deepseek';
import type { LanguageModel } from 'ai';

/**
 * Astrazione per l'utilizzo di LLM.
 * Consente un rapido fallback tra Groq (default), Google o OpenRouter in base
 * alle chiavi configurate nell'ambiente.
 */

export interface Providers {
  /** Modello principale per la generazione delle risposte. */
  chat: LanguageModel;
  /** Modello piccolo e velocissimo per il routing/rewrite. */
  router: LanguageModel;
  name: 'groq' | 'google' | 'openrouter' | 'deepseek';
}

export function getProviders(): Providers | null {
  const deepseekKey = process.env.DEEPSEEK_API_KEY;
  if (deepseekKey) {
    const deepseek = createDeepSeek({ apiKey: deepseekKey });
    return {
      chat: deepseek(process.env.RAG_CHAT_MODEL ?? 'deepseek-chat'),
      router: deepseek(process.env.RAG_ROUTER_MODEL ?? 'deepseek-chat'),
      name: 'deepseek',
    };
  }

  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey) {
    const groq = createGroq({ apiKey: groqKey });
    return {
      chat: groq(process.env.RAG_CHAT_MODEL ?? 'llama-3.3-70b-versatile'),
      router: groq(process.env.RAG_ROUTER_MODEL ?? 'llama-3.1-8b-instant'),
      name: 'groq',
    };
  }

  const googleKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (googleKey) {
    const google = createGoogleGenerativeAI({ apiKey: googleKey });
    const model = google(process.env.RAG_CHAT_MODEL ?? 'gemini-1.5-flash');
    return { chat: model, router: model, name: 'google' };
  }

  const openRouterKey = process.env.OPENROUTER_API_KEY;
  if (openRouterKey) {
    const openrouter = createOpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: openRouterKey,
    });
    return {
      chat: openrouter(process.env.RAG_CHAT_MODEL ?? 'meta-llama/llama-3.3-70b-instruct:free'),
      router: openrouter(process.env.RAG_ROUTER_MODEL ?? 'google/gemini-2.5-flash-free'),
      name: 'openrouter',
    };
  }

  return null;
}
