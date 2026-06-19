import { NextResponse } from 'next/server';
import { Langfuse } from 'langfuse';

const langfuse = new Langfuse({
  publicKey: process.env.LANGFUSE_PUBLIC_KEY,
  secretKey: process.env.LANGFUSE_SECRET_KEY,
  baseUrl: process.env.LANGFUSE_BASEURL || 'https://cloud.langfuse.com',
});

export async function POST(req: Request) {
  try {
    const { messageId, score } = await req.json();

    if (!messageId || score === undefined) {
      return NextResponse.json({ error: 'Missing messageId or score' }, { status: 400 });
    }

    // Attach score in Langfuse. 
    // We use messageId as traceId/observationId so we can track the exact response.
    await langfuse.score({
      traceId: messageId,
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
