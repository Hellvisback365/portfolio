import { NextResponse } from 'next/server';
import { z } from 'zod';
import { runRag } from '@/services/rag/graph';

const requestSchema = z.object({
  question: z.string().min(3).max(600),
});

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { question } = requestSchema.parse(payload);

    const result = await runRag(question);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Domanda non valida.' }, { status: 400 });
    }
    console.error('[RAG] API error', error);
    return NextResponse.json({ error: 'Impossibile generare una risposta ora.' }, { status: 500 });
  }
}
