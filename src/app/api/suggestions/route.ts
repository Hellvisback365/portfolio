import { NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { z } from 'zod';
import { getProviders } from '@/lib/rag/providers';
import ragIndex from '@/data/rag-index.json';

export const maxDuration = 30;
export const dynamic = 'force-dynamic';

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
      temperature: 0.8,
      schema: z.object({
        questions: z
          .array(z.string())
          .length(8)
          .describe('Array di 8 domande brevi e in italiano.'),
      }),
      system: `Sei l'assistente virtuale del portfolio di Vito Piccolini.
Il tuo compito è generare 8 domande molto brevi, naturali e interessanti che un utente potrebbe farti riguardo al background, alle competenze o ai progetti di Vito, basandoti SUL CONTESTO FORNITO.
Le domande devono essere rigorosamente IN TERZA PERSONA perché l'utente sta parlando con te (l'assistente) DI Vito (es. "Che linguaggi sa usare Vito?", "Parlami di TerraNode", "Qual è stato il suo ruolo in Zenith?"). Non usare MAI la seconda persona ("Che linguaggi usi?"). Non superare le 8 parole per domanda. Sii vario.`,
      prompt: `CONTESTO REALE DI VITO:\n${randomChunks}\n\nGenera 8 domande basate su questo contesto.`,
      experimental_telemetry: {
        isEnabled: true,
        functionId: 'suggestions',
      },
    });

    return NextResponse.json(object);
  } catch (error: any) {
    console.error('[Suggestions API Error]', error?.message || error);
    // Invece di restituire 500 e causare un errore sulla UI, facciamo fallback nativo
    return NextResponse.json({
      questions: [
        'Quali sono i progetti più recenti di Vito?',
        'Che tecnologie usa principalmente Vito?',
        'Parlami dell\'esperienza di Vito in Zenith.',
        'Di cosa parla la sua tesi di laurea?',
      ],
    });
  }
}
