import { NextResponse } from 'next/server';
import { Langfuse } from 'langfuse';
import { z } from 'zod';
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL.replace(/^"|"$/g, '').trim(),
      token: process.env.UPSTASH_REDIS_REST_TOKEN.replace(/^"|"$/g, '').trim(),
    })
  : null;

const ratelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, '1 m'),
      analytics: true,
    })
  : null;

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
    if (ratelimit) {
      const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';
      const { success } = await ratelimit.limit(ip);
      if (!success) {
        return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
      }
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
  } catch (err: any) {
    console.error('[Feedback API Error]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
