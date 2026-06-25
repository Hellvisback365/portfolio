import { pipeline, env } from '@huggingface/transformers';

// Solo CDN HuggingFace: niente lookup di modelli locali inesistenti.
env.allowLocalModels = false;

const EMBED_MODEL = 'Xenova/multilingual-e5-small';

// Tipo strutturale minimo dell'extractor: i tipi di transformers.js sono
// molto larghi, qui descriviamo solo ciò che usiamo davvero.
type Extractor = (
  text: string,
  opts: { pooling: 'mean'; normalize: boolean },
) => Promise<{ data: ArrayLike<number> }>;

class PipelineSingleton {
  static task = 'feature-extraction' as const;
  static model = EMBED_MODEL;
  static instance: Promise<Extractor> | null = null;

  static getInstance(progress_callback?: (progress: unknown) => void): Promise<Extractor> {
    // Usiamo WebGPU se disponibile, altrimenti fallback a WASM.
    this.instance ??= pipeline(this.task, this.model, {
      dtype: 'q8',
      progress_callback,
    }) as unknown as Promise<Extractor>;
    return this.instance;
  }
}

// Ascolta i messaggi dal thread principale
self.addEventListener('message', async (event) => {
  const { id, text, type } = event.data;

  try {
    if (type === 'load') {
      const p1 = PipelineSingleton.getInstance((x: unknown) => {
        self.postMessage({ type: 'progress', model: 'embedder', progress: x });
      });
      await p1;
      self.postMessage({ type: 'ready', id });
      return;
    }

    if (type === 'embed') {
      const extractor = await PipelineSingleton.getInstance();
      const out = await extractor(`query: ${text.trim()}`, {
        pooling: 'mean',
        normalize: true,
      });

      // Arrotondiamo a 5 decimali
      const vector = Array.from(out.data, (v: number) => Math.round(v * 1e5) / 1e5);

      self.postMessage({
        type: 'result',
        id,
        vector,
      });
      return;
    }

  } catch (error) {
    self.postMessage({
      type: 'error',
      id,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});
