/**
 * BM25 Okapi — implementazione completa, zero dipendenze.
 * (Quella che il vecchio stack dichiarava ma delegava a Fuse.js,
 * che è fuzzy matching Bitap, non un ranking lessicale.)
 *
 * Su un corpus di ~20 chunk l'indice si costruisce in <1 ms al cold
 * start: nessun bisogno di precomputarlo nello script di ingest.
 */

const K1 = 1.5;
const B = 0.75;

// Stoplist minimale IT + EN: solo funzionali ad altissima frequenza.
const STOPWORDS = new Set([
  // it
  'di', 'a', 'da', 'in', 'con', 'su', 'per', 'tra', 'fra', 'il', 'lo', 'la',
  'i', 'gli', 'le', 'un', 'uno', 'una', 'e', 'ed', 'o', 'che', 'chi', 'cui',
  'non', 'come', 'dove', 'quando', 'quale', 'quali', 'del', 'dello', 'della',
  'dei', 'degli', 'delle', 'al', 'allo', 'alla', 'ai', 'agli', 'alle', 'dal',
  'dallo', 'dalla', 'dai', 'dagli', 'dalle', 'nel', 'nello', 'nella', 'nei',
  'negli', 'nelle', 'sul', 'sullo', 'sulla', 'sui', 'sugli', 'sulle', 'è',
  'sono', 'sei', 'siamo', 'siete', 'ha', 'hai', 'ho', 'hanno', 'mi', 'ti',
  'si', 'ci', 'vi', 'suo', 'sua', 'suoi', 'sue', 'tuo', 'tua', 'mio', 'mia',
  'questo', 'questa', 'questi', 'queste', 'quello', 'quella', 'più', 'anche',
  'ma', 'se', 'cosa', 'qual',
  // en
  'the', 'a', 'an', 'of', 'to', 'in', 'on', 'for', 'and', 'or', 'is', 'are',
  'was', 'were', 'what', 'which', 'who', 'how', 'with', 'about', 'his', 'her',
  'it', 'its', 'at', 'by', 'from', 'as', 'be', 'has', 'have', 'had', 'do',
  'does', 'did', 'not',
]);

/** lowercase + accent folding + split su non-alfanumerico (unicode). */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(/[^\p{L}\p{N}]+/u)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

export interface Bm25Doc {
  id: string;
  text: string;
}

export class Bm25Index {
  private docTokens: Map<string, Map<string, number>> = new Map();
  private docLen: Map<string, number> = new Map();
  private df: Map<string, number> = new Map();
  private avgdl = 0;
  private n = 0;

  constructor(docs: Bm25Doc[]) {
    let totalLen = 0;
    for (const doc of docs) {
      const tokens = tokenize(doc.text);
      const tf = new Map<string, number>();
      for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
      this.docTokens.set(doc.id, tf);
      this.docLen.set(doc.id, tokens.length);
      totalLen += tokens.length;
      for (const term of tf.keys()) this.df.set(term, (this.df.get(term) ?? 0) + 1);
    }
    this.n = docs.length;
    this.avgdl = this.n > 0 ? totalLen / this.n : 0;
  }

  /** Ranking BM25 dei documenti per la query. score > 0 soltanto. */
  search(query: string, k = 10): Array<{ id: string; score: number }> {
    const qTerms = tokenize(query);
    if (qTerms.length === 0) return [];

    const scores = new Map<string, number>();
    for (const term of qTerms) {
      const df = this.df.get(term);
      if (!df) continue;
      // IDF di Robertson-Sparck Jones con smoothing (sempre ≥ 0)
      const idf = Math.log(1 + (this.n - df + 0.5) / (df + 0.5));
      for (const [docId, tf] of this.docTokens) {
        const f = tf.get(term);
        if (!f) continue;
        const dl = this.docLen.get(docId) ?? 0;
        const denom = f + K1 * (1 - B + (B * dl) / this.avgdl);
        const s = idf * ((f * (K1 + 1)) / denom);
        scores.set(docId, (scores.get(docId) ?? 0) + s);
      }
    }

    return [...scores.entries()]
      .map(([id, score]) => ({ id, score }))
      .sort((a, b) => b.score - a.score)
      .slice(0, k);
  }
}
