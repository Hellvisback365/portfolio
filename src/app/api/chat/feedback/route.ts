import { NextResponse } from 'next/server';
import { Langfuse } from 'langfuse';

const langfuse = new Langfuse({
  publicKey: process.env.LANGFUSE_PUBLIC_KEY?.replace(/^"|"$/g, '').trim(),
  secretKey: process.env.LANGFUSE_SECRET_KEY?.replace(/^"|"$/g, '').trim(),
  baseUrl: process.env.LANGFUSE_BASEURL?.replace(/^"|"$/g, '').trim() || 'https://cloud.langfuse.com',
});

export async function POST(req: Request) {
  try {
    const { messageId, score, aiResponseText, userQuestionText } = await req.json();

    if (!messageId || score === undefined) {
      return NextResponse.json({ error: 'Missing messageId or score' }, { status: 400 });
    }

    // Attach score in Langfuse. 
    // We use messageId as traceId/observationId so we can track the exact response.
    const trace = langfuse.trace({
      id: messageId,
      name: 'User Feedback Trace',
      tags: ['feedback'],
    });

    trace.generation({
      name: 'Assistant Response',
      input: userQuestionText || 'No question text provided',
      output: aiResponseText || 'No response text provided',
      model: 'unknown',
      startTime: new Date(),
      endTime: new Date()
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
