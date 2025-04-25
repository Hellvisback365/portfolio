/**
 * Service for Brevo API integration
 */

export interface EmailContact {
  email: string;
  name?: string;
}

export interface SendEmailParams {
  to: EmailContact[];
  subject: string;
  htmlContent: string;
  sender?: EmailContact;
  replyTo?: EmailContact;
  params?: Record<string, unknown>;
}

interface BrevoApiResponse {
  messageId?: string;
  code?: string;
  message?: string;
  [key: string]: unknown;
}

/**
 * Send a transactional email using Brevo API
 */
export async function sendEmail({
  to,
  subject,
  htmlContent,
  sender = {
    name: 'Portfolio Contact Form',
    email: 'noreply@brevo.com'
  },
  replyTo,
  params
}: SendEmailParams): Promise<BrevoApiResponse> {
  const apiKey = process.env.BREVO_API_KEY;
  
  if (!apiKey) {
    console.error('API key Brevo non trovata nei file .env');
    throw new Error('API key Brevo mancante');
  }
  
  const data = {
    sender,
    to,
    subject,
    htmlContent,
    replyTo,
    params
  };
  
  console.log('Invio email tramite Brevo API:', {
    sender,
    to,
    subject,
    replyTo
  });

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    const responseData = await response.json() as BrevoApiResponse;
    console.log('Risposta da Brevo API:', responseData);
    
    if (!response.ok) {
      console.error('Errore da Brevo API:', responseData);
      throw new Error(responseData.message || 'Errore durante l\'invio dell\'email');
    }
    
    return responseData;
  } catch (error) {
    console.error('Errore durante l\'invio dell\'email con Brevo:', error);
    throw error;
  }
} 