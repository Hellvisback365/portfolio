import { describe, it, expect } from 'vitest';
import { Bm25Index } from '@/lib/rag/bm25';

describe('Bm25Index', () => {
  it('should rank documents containing the exact query higher', () => {
    const docs = [
      { id: '1', text: 'Vito ha partecipato a vari hackathon.' },
      { id: '2', text: 'Vito ama la pizza e il mare.' },
      { id: '3', text: 'Nessun riferimento alla competizione.' },
    ];
    
    const index = new Bm25Index(docs);
    const results = index.search('hackathon', 3);
    
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].id).toBe('1');
  });

  it('should be case-insensitive and handle accents', () => {
    const docs = [
      { id: '1', text: 'L\'università di Bari è ottima.' },
    ];
    
    const index = new Bm25Index(docs);
    const results = index.search('Universita', 3); // Senza accento, maiuscolo
    
    expect(results.length).toBe(1);
    expect(results[0].id).toBe('1');
  });
});
