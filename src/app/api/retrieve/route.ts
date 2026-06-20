import { NextResponse } from 'next/server';
import { getRetriever } from '@/lib/rag/retriever';
import { z } from 'zod';

const retrieveSchema = z.object({
  question: z.string(),
  queryVector: z.array(z.number()).nullable().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { question, queryVector } = retrieveSchema.parse(body);

    const retriever = await getRetriever();
    // Return top 8 for client-side reranking
    const candidates = retriever.retrieve(question, queryVector || null, 8);

    return NextResponse.json({ candidates });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
