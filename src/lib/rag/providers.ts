import { createGroq } from '@ai-sdk/groq';
import type { LanguageModel } from 'ai';

/**
 * Astrazione per l'utilizzo di LLM.
 * Configurato in modo esclusivo per utilizzare Groq (LLaMA-3.3) per
 * massimizzare la velocità (LPU) e rispettare i requisiti di deployment in EU.
 */

export interface Providers {
  /** Modello principale per la generazione delle risposte. */
  chat: LanguageModel;
  /** Modello piccolo e velocissimo per il routing/rewrite. */
  router: LanguageModel;
  name: 'groq';
}

export function getProviders(): Providers | null {
  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey) {
    return null;
  }

  const groq = createGroq({ apiKey: groqKey });
  return {
    chat: groq(process.env.RAG_CHAT_MODEL ?? 'llama-3.3-70b-versatile'),
    router: groq(process.env.RAG_ROUTER_MODEL ?? 'llama-3.1-8b-instant'),
    name: 'groq',
  };
}
