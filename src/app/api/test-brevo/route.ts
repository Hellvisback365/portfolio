import { NextResponse } from 'next/server';
import { sendEmail } from '@/services/brevo';

export async function GET() {
  try {
    console.log('Test endpoint per Brevo API');
    console.log('BREVO_API_KEY presente:', Boolean(process.env.BREVO_API_KEY));
    
    // Verifica che l'API key sia configurata
    if (!process.env.BREVO_API_KEY || process.env.BREVO_API_KEY === 'tuaApiKeyQuiSenzaVirgolette') {
      console.error('API key Brevo non valida o non configurata');
      return NextResponse.json({
        error: 'API key Brevo non configurata correttamente',
        hint: 'Aggiorna il file .env.local con una vera API key di Brevo'
      }, { status: 500 });
    }

    try {
      const result = await sendEmail({
        to: [{ email: 'vitopiccolini@live.it', name: 'Vito Piccolini' }],
        subject: 'Test di Brevo API',
        htmlContent: `
          <html>
            <body>
              <h2>Test di invio email tramite Brevo API</h2>
              <p>Questo è un test per verificare l'integrazione con Brevo.</p>
              <p>Data e ora: ${new Date().toLocaleString()}</p>
            </body>
          </html>
        `
      });
      
      return NextResponse.json({
        success: true,
        message: 'Email di test inviata con successo',
        details: result
      });
    } catch (error) {
      console.error('Errore nel test di Brevo:', error);
      return NextResponse.json({
        error: error instanceof Error ? error.message : 'Errore sconosciuto',
        stack: error instanceof Error ? error.stack : undefined
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Errore generale nel test endpoint:', error);
    return NextResponse.json({
      error: 'Errore durante il test di Brevo API'
    }, { status: 500 });
  }
} 