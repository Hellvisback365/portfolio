import { NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { z } from 'zod';
import { getProviders } from '@/lib/rag/providers';
import ragIndex from '@/data/rag-index.json';

export const maxDuration = 30;

export async function GET() {
  try {
    const providers = getProviders();
    if (!providers) {
      return NextResponse.json(
        { error: 'Copilot non configurato.' },
        { status: 503 },
      );
    }

    // Estrai 3 chunk casuali dal RAG index per dare varietà al contesto
    const chunks = ragIndex.chunks;
    const sampleSize = Math.min(3, chunks.length);
    const shuffled = [...chunks].sort(() => 0.5 - Math.random());
    const randomChunks = shuffled.slice(0, sampleSize).map((c) => c.text).join('\n\n');

    const { object } = await generateObject({
      model: providers.router, // Usiamo il modello veloce (es. Llama 8B / Flash)
      schema: z.object({
        questions: z
          .array(z.string())
          .length(5)
          .describe('Array di 5 domande brevi e in italiano.'),
      }),
      system: `Sei l'assistente del portfolio di Vito Piccolini.
Il tuo compito è generare 5 domande molto brevi, naturali e interessanti che un utente potrebbe farti riguardo al background, alle competenze o ai progetti di Vito, basandoti SUL CONTESTO FORNITO.
Le domande devono sembrare poste da un utente umano (es. "Che linguaggi sa usare?", "Parlami di TerraNode", "Qual è stato il suo ruolo in Zenith?"). Non superare le 8 parole per domanda. Sii vario.`,
      prompt: `CONTESTO REALE DI VITO:\n${randomChunks}\n\nGenera 5 domande basate su questo contesto.`,
    });

    return NextResponse.json(object);
  } catch (error) {
    console.error('[Suggestions API Error]', error);
    return NextResponse.json(
      { error: 'Errore durante la generazione delle domande.' },
      { status: 500 },
    );
  }
}
