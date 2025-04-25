import { NextResponse } from 'next/server';
import { sendEmail } from '@/services/brevo';

export async function POST(request: Request) {
  try {
    console.log('Ricevuta richiesta form contatti');
    const data = await request.json();
    const { name, email, message } = data;
    
    console.log('Dati form:', { name, email });
    
    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Tutti i campi sono obbligatori' },
        { status: 400 }
      );
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Formato email non valido' },
        { status: 400 }
      );
    }

    // Verifica che l'API key sia configurata correttamente
    if (!process.env.BREVO_API_KEY) {
      console.error('BREVO_API_KEY non è definita nelle variabili d\'ambiente');
      return NextResponse.json(
        { error: 'Configurazione server incompleta (API key mancante)' },
        { status: 500 }
      );
    }

    // Send email using Brevo service
    try {
      console.log('Inizio invio email tramite Brevo');
      const result = await sendEmail({
        to: [
          {
            email: 'vitopiccolini@live.it', // Replace with your actual email
            name: 'Vito Piccolini'
          }
        ],
        subject: `Nuovo messaggio dal form contatti da ${name}`,
        htmlContent: `
          <html>
            <body>
              <h2>Nuovo messaggio dal form contatti</h2>
              <p><strong>Nome:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Messaggio:</strong></p>
              <p>${message.replace(/\n/g, '<br>')}</p>
            </body>
          </html>
        `,
        replyTo: {
          email: email,
          name: name
        }
      });
      
      console.log('Email inviata con successo:', result);
      return NextResponse.json(
        { success: true, message: 'Messaggio inviato con successo' },
        { status: 200 }
      );
    } catch (emailError) {
      console.error('Errore dettagliato durante invio email:', emailError);
      return NextResponse.json(
        { error: emailError instanceof Error ? emailError.message : 'Errore durante l\'invio dell\'email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Errore generale form contatti:', error);
    return NextResponse.json(
      { error: 'Si è verificato un errore durante l\'invio del messaggio' },
      { status: 500 }
    );
  }
} 