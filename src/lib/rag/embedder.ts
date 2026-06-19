'use client';

/**
 * Embedding della query NEL BROWSER del visitatore (via Web Worker).
 *
 * Il calcolo gira in un thread separato (`worker.ts`) usando WebGPU se
 * disponibile, o WASM come fallback. Questo garantisce ZERO lag sul
 * thread principale, mantenendo intatte le performance di R3F e Lenis.
 */

export const EMBED_MODEL = 'Xenova/multilingual-e5-small';
export const EMBED_DIM = 384;

export type EmbedderState = 'idle' | 'loading' | 'ready' | 'error';

let state: EmbedderState = 'idle';
const listeners = new Set<(s: EmbedderState) => void>();

let worker: Worker | null = null;
let resolveInit: ((value: boolean) => void) | null = null;
const pendingPromises = new Map<number, { resolve: (v: number[] | null) => void, reject: (r: any) => void }>();
let messageIdCounter = 0;

function setState(next: EmbedderState) {
  state = next;
  listeners.forEach((l) => l(next));
}

export function getEmbedderState(): EmbedderState {
  return state;
}

export function subscribeEmbedder(listener: (s: EmbedderState) => void): () => void {
  listeners.add(listener);
  listener(state);
  return () => listeners.delete(listener);
}

function initWorker() {
  if (typeof window === 'undefined') return;
  if (worker) return;

  try {
    setState('loading');
    worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });

    worker.addEventListener('message', (event) => {
      const { type, id, vector, error } = event.data;

      if (type === 'ready') {
        setState('ready');
        if (resolveInit) {
          resolveInit(true);
          resolveInit = null;
        }
      } else if (type === 'result') {
        const promise = pendingPromises.get(id);
        if (promise) {
          promise.resolve(vector);
          pendingPromises.delete(id);
        }
      } else if (type === 'error') {
        console.warn('[embedder] Worker error:', error);
        if (id !== undefined && pendingPromises.has(id)) {
          pendingPromises.get(id)?.resolve(null);
          pendingPromises.delete(id);
        } else {
          setState('error');
        }
      }
    });

    // Invia il preload trigger al worker
    worker.postMessage({ type: 'load' });
  } catch (err) {
    console.warn('[embedder] Errore inizializzazione worker:', err);
    setState('error');
  }
}

export function warmupEmbedder(): void {
  if (!worker) {
    initWorker();
  }
}

/**
 * Richiede il vettore di embedding al worker.
 */
export async function embedQuery(text: string): Promise<number[] | null> {
  if (!worker) {
    initWorker();
  }

  // Aspettiamo che sia ready se è ancora in caricamento
  if (state === 'loading') {
    await new Promise<boolean>((resolve) => {
      const prevResolve = resolveInit;
      resolveInit = (v) => {
        if (prevResolve) prevResolve(v);
        resolve(v);
      };
    });
  }

  if (state !== 'ready' || !worker) {
    return null; // Fallback al BM25-only del server
  }

  return new Promise((resolve, reject) => {
    const id = messageIdCounter++;
    pendingPromises.set(id, { resolve, reject });
    worker!.postMessage({ type: 'embed', id, text });
  });
}
