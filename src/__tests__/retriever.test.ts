import { describe, it, expect } from 'vitest';
import { HybridRetriever, type RagChunk } from '@/lib/rag/retriever';

describe('HybridRetriever', () => {
  const mockChunks: RagChunk[] = [
    { id: 'c1', docId: 'doc1', title: 'A', category: 'cat', tags: [], text: 'Apple test', vec: [1, 0] },
    { id: 'c2', docId: 'doc1', title: 'B', category: 'cat', tags: [], text: 'Banana test', vec: [0, 1] },
    { id: 'c3', docId: 'doc1', title: 'C', category: 'cat', tags: [], text: 'Cherry test', vec: [0.5, 0.5] },
    { id: 'c4', docId: 'doc2', title: 'D', category: 'cat', tags: [], text: 'Apple test 2', vec: [1, 0] },
  ];

  it('should fuse lexical and semantic rankings with RRF', () => {
    const retriever = new HybridRetriever(mockChunks);
    
    const lexRank = new Map<string, number>();
    lexRank.set('c1', 1); // c1 è #1 lessicale
    
    // queryVector = [1,0], max cosine con c1 e c4
    const result = retriever.semanticAndFuse(lexRank, [1, 0], 4);
    
    // c1 dovrebbe vincere perché top lessicale E top semantico
    expect(result[0].id).toBe('c1');
  });

  it('should cap diversity to MAX_PER_DOC', () => {
    const retriever = new HybridRetriever(mockChunks);
    
    const lexRank = new Map<string, number>();
    lexRank.set('c1', 1);
    lexRank.set('c2', 2);
    lexRank.set('c3', 3);
    
    const result = retriever.semanticAndFuse(lexRank, null, 4);
    
    // doc1 ha c1, c2, c3. Il cap è 2 per doc. Quindi c3 dovrebbe essere scartato.
    const doc1Count = result.filter(r => r.docId === 'doc1').length;
    expect(doc1Count).toBeLessThanOrEqual(2);
  });
});
