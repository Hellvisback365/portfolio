import { createGroq } from '@ai-sdk/groq';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import type { LanguageModel } from 'ai';

/**
 * Strategia provider (verificata giugno 2026):
 *
 * 1. Groq free tier — primario. `llama-3.3-70b-versatile` per le
 *    risposte (~30 RPM / ~1.000 req/giorno), `llama-3.1-8b-instant`
 *    per il router (fino a ~14.400 req/giorno, latenza ~100 ms su LPU).
 * 2. Gemini — solo fallback opzionale dietro env var: i ToS del free
 *    tier Google escludono il serving di utenti EU/EEA/UK/CH in
 *    produzione, quindi non può essere il default per un sito .it.
 *
 * Con il solo GROQ_API_KEY il sistema è completo e a costo zero.
 */

export interface Providers {
  /** Modello principale per la generazione delle risposte. */
  chat: LanguageModel;
  /** Modello piccolo e velocissimo per il routing/rewrite. */
  router: LanguageModel;
  name: 'groq' | 'google';
}

export function getProviders(): Providers | null {
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
    const model = google(process.env.RAG_CHAT_MODEL ?? 'gemini-2.5-flash');
    return { chat: model, router: model, name: 'google' };
  }

  return null;
}
