import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { getProviders } from '@/lib/rag/providers';
import { parseLLMJSON } from '@/lib/rag/parse-llm-json';
import ragIndex from '@/data/rag-index.json';

export const maxDuration = 30;
export const revalidate = 0; // Disable cache so it refetches dynamically


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lang = searchParams.get('lang') || 'it';
  const isEn = lang === 'en';

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



    const { text } = await generateText({
      model: providers.router, // Usiamo il modello veloce (es. Llama 8B / Flash)
      temperature: 0.8,
      system: isEn 
        ? `You are the virtual assistant of Vito Piccolini's portfolio.
Your task is to generate 8 very short, natural, and interesting questions that a user might ask you regarding Vito's background, skills, or projects, based on the PROVIDED CONTEXT.
The questions must strictly be in the THIRD PERSON because the user is talking to you (the assistant) ABOUT Vito (e.g., "What languages does Vito know?", "Tell me about TerraNode", "What was his role in Zenith?"). Never use the second person ("What languages do you use?"). Do not exceed 8 words per question. Be varied.

You MUST respond ONLY with a valid JSON object matching this schema:
{ "questions": ["Question 1", "Question 2", ...] }`
        : `Sei l'assistente virtuale del portfolio di Vito Piccolini.
Il tuo compito è generare 8 domande molto brevi, naturali e interessanti che un utente potrebbe farti riguardo al background, alle competenze o ai progetti di Vito, basandoti SUL CONTESTO FORNITO.
Le domande devono essere rigorosamente IN TERZA PERSONA perché l'utente sta parlando con te (l'assistente) DI Vito (es. "Che linguaggi sa usare Vito?", "Parlami di TerraNode", "Qual è stato il suo ruolo in Zenith?"). Non usare MAI la seconda persona ("Che linguaggi usi?"). Non superare le 8 parole per domanda. Sii vario.

Devi rispondere SOLO ED ESCLUSIVAMENTE con un JSON valido che rispetta questo schema:
{ "questions": ["Domanda 1", "Domanda 2", ...] }`,
      prompt: isEn
        ? `REAL CONTEXT ABOUT VITO:\n${randomChunks}\n\nGenerate 8 questions based on this context.`
        : `CONTESTO REALE DI VITO:\n${randomChunks}\n\nGenera 8 domande basate su questo contesto.`,
    });

    const typedObject = parseLLMJSON<{ questions: string[] }>(text, { questions: [] });
    
    // Validazione extra: se il JSON parse è andato ma manca l'array 'questions'
    if (!typedObject.questions || !Array.isArray(typedObject.questions)) {
      throw new Error('Formato JSON non valido: array questions mancante');
    }
    
    return NextResponse.json(typedObject);
  } catch (error) {
    console.error('[Suggestions API Error]', error instanceof Error ? error.message : error);
    // Invece di restituire 500 e causare un errore sulla UI, facciamo fallback nativo
    return NextResponse.json({
      questions: isEn ? [
        'What are Vito\'s most recent projects?',
        'What technologies does Vito mainly use?',
        'Tell me about Vito\'s experience in Zenith.',
        'What is his thesis about?',
      ] : [
        'Quali sono i progetti più recenti di Vito?',
        'Che tecnologie usa principalmente Vito?',
        'Parlami dell\'esperienza di Vito in Zenith.',
        'Di cosa parla la sua tesi di laurea?',
      ],
    });
  }
}
