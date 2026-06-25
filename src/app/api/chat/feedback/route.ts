import { NextResponse } from 'next/server';
import { Langfuse } from 'langfuse';
import { z } from 'zod';
import { feedbackRatelimit } from '@/lib/ratelimit';

const langfuse = new Langfuse({
  publicKey: process.env.LANGFUSE_PUBLIC_KEY?.replace(/^"|"$/g, '').trim(),
  secretKey: process.env.LANGFUSE_SECRET_KEY?.replace(/^"|"$/g, '').trim(),
  baseUrl: process.env.LANGFUSE_BASEURL?.replace(/^"|"$/g, '').trim() || 'https://cloud.langfuse.com',
});

const feedbackSchema = z.object({
  messageId: z.string().min(1),
  score: z.union([z.literal(0), z.literal(1)]),
});

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';
    const { success } = await feedbackRatelimit.limit(ip);
    if (!success) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const body = await req.json();
    const parsed = feedbackSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const { messageId, score } = parsed.data;

    // Attach score in Langfuse. 
    // We use messageId as traceId/observationId so we can track the exact response.
    const trace = langfuse.trace({
      id: messageId,
      name: 'User Feedback Trace',
      tags: ['feedback'],
    });

    trace.score({
      name: 'user-feedback',
      value: score,
      comment: score === 1 ? 'Pollice in su (Utente soddisfatto)' : 'Pollice in giù (Risposta errata o allucinata)',
    });

    await langfuse.flushAsync();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Feedback API Error]', err);
    const message = err instanceof Error ? err.message : 'Errore interno';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
