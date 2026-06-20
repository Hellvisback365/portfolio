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

class RerankerSingleton {
  static task = 'text-classification' as const;
  static model = 'Xenova/ms-marco-MiniLM-L-6-v2';
  static instance: any = null;

  static async getInstance(progress_callback?: any) {
    if (this.instance === null) {
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
      const p1 = PipelineSingleton.getInstance((x: any) => {
        self.postMessage({ type: 'progress', model: 'embedder', progress: x });
      });
      const p2 = RerankerSingleton.getInstance((x: any) => {
        self.postMessage({ type: 'progress', model: 'reranker', progress: x });
      });
      await Promise.all([p1, p2]);
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
      return;
    }

    if (type === 'rerank') {
      const reranker = await RerankerSingleton.getInstance();
      const pairs = event.data.pairs; // Array of { text: query, text_pair: document }
      const results = await reranker(pairs);
      
      self.postMessage({
        type: 'rerank_result',
        id,
        scores: results,
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
