'use client';

/**
 * Embedding della query NEL BROWSER del visitatore.
 *
 * Perché qui e non sul server:
 * - zero API di embedding (il vecchio stack puntava a un endpoint
 *   OpenRouter inesistente e produceva vettori-zero);
 * - zero rate limit e zero costi: il calcolo è del client;
 * - EU-safe: nessun testo dell'utente lascia il browser prima della
 *   chiamata a /api/chat, che riceve solo il vettore (384 float).
 *
 * Modello: Xenova/multilingual-e5-small quantizzato q8 (~30 MB on-disk,
 * cache HTTP del browser dopo il primo load). E5 è ASIMMETRICO:
 * le query vanno prefissate con "query: ", i passaggi con "passage: "
 * (lo script di ingest usa il prefisso speculare).
 *
 * Tutto è lazy: il pacchetto @huggingface/transformers (~1 MB di JS)
 * viene importato solo alla prima apertura del copilot, mai nel
 * bundle critico della pagina.
 */

export const EMBED_MODEL = 'Xenova/multilingual-e5-small';
export const EMBED_DIM = 384;

export type EmbedderState = 'idle' | 'loading' | 'ready' | 'error';

type FeatureExtractor = (
  text: string,
  opts: { pooling: 'mean'; normalize: boolean },
) => Promise<{ data: Float32Array }>;

let state: EmbedderState = 'idle';
let extractorPromise: Promise<FeatureExtractor | null> | null = null;
const listeners = new Set<(s: EmbedderState) => void>();

function setState(next: EmbedderState) {
  state = next;
  listeners.forEach((l) => l(next));
}

export function getEmbedderState(): EmbedderState {
  return state;
}

/** Sottoscrizione leggera per l'indicatore "semantic ready" nella UI. */
export function subscribeEmbedder(listener: (s: EmbedderState) => void): () => void {
  listeners.add(listener);
  listener(state);
  return () => listeners.delete(listener);
}

async function loadExtractor(): Promise<FeatureExtractor | null> {
  if (typeof window === 'undefined') return null;
  try {
    setState('loading');
    const { pipeline, env } = await import('@huggingface/transformers');
    // Solo CDN HuggingFace: niente lookup di modelli locali inesistenti.
    env.allowLocalModels = false;
    const extractor = (await pipeline('feature-extraction', EMBED_MODEL, {
      dtype: 'q8',
    })) as unknown as FeatureExtractor;
    setState('ready');
    return extractor;
  } catch (err) {
    console.warn('[embedder] load fallito, si prosegue in BM25-only:', err);
    setState('error');
    return null;
  }
}

/**
 * Pre-carica il modello (chiamata all'apertura del copilot, così il
 * primo messaggio dell'utente trova l'estrattore già caldo).
 */
export function warmupEmbedder(): void {
  if (!extractorPromise) extractorPromise = loadExtractor();
}

/**
 * Vettore 384-dim normalizzato della query, o null se il modello non è
 * (ancora) disponibile. Il chiamante manda null e il server degrada a
 * BM25-only: la chat non si blocca mai sull'embedding.
 */
export async function embedQuery(text: string): Promise<number[] | null> {
  if (!extractorPromise) extractorPromise = loadExtractor();
  const extractor = await extractorPromise;
  if (!extractor) return null;
  try {
    const out = await extractor(`query: ${text.trim()}`, {
      pooling: 'mean',
      normalize: true,
    });
    // Arrotondiamo come nell'indice: payload più piccolo, cosine invariata.
    return Array.from(out.data, (v) => Math.round(v * 1e5) / 1e5);
  } catch (err) {
    console.warn('[embedder] embed fallito per questa query:', err);
    return null;
  }
}
