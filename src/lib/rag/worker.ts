import { pipeline, env } from '@huggingface/transformers';

// Solo CDN HuggingFace: niente lookup di modelli locali inesistenti.
env.allowLocalModels = false;

const EMBED_MODEL = 'Xenova/multilingual-e5-small';

class PipelineSingleton {
  static task = 'feature-extraction' as const;
  static model = EMBED_MODEL;
  static instance: any = null;

  static async getInstance(progress_callback?: any) {
    if (this.instance === null) {
      // Usiamo WebGPU se disponibile, altrimenti fallback a WASM.
      this.instance = pipeline(this.task, this.model, {
        dtype: 'q8',
        progress_callback,
      });
    }
    return this.instance;
  }
}

// Ascolta i messaggi dal thread principale
self.addEventListener('message', async (event) => {
  const { id, text, type } = event.data;

  try {
    if (type === 'load') {
      await PipelineSingleton.getInstance((x: any) => {
        // Possiamo comunicare il progresso del download
        self.postMessage({ type: 'progress', progress: x });
      });
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
      const vector = Array.from(out.data, (v: any) => Math.round(v * 1e5) / 1e5);

      self.postMessage({
        type: 'result',
        id,
        vector,
      });
    }
  } catch (error) {
    self.postMessage({
      type: 'error',
      id,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});
