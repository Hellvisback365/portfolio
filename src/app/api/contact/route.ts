import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, message } = data;
    
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
    
    // In a real application, you would send an email here
    // For example, using nodemailer or a service like SendGrid
    
    // Example:
    // const transporter = nodemailer.createTransport({
    //   host: process.env.EMAIL_HOST,
    //   port: parseInt(process.env.EMAIL_PORT || '587'),
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASSWORD,
    //   },
    // });
    
    // await transporter.sendMail({
    //   from: process.env.EMAIL_FROM,
    //   to: process.env.EMAIL_TO,
    //   subject: `Nuovo messaggio da ${name}`,
    //   text: `Nome: ${name}\nEmail: ${email}\nMessaggio: ${message}`,
    //   html: `<p><strong>Nome:</strong> ${name}</p>
    //          <p><strong>Email:</strong> ${email}</p>
    //          <p><strong>Messaggio:</strong> ${message}</p>`,
    // });
    
    // Just log the contact information for now
    console.log('Contact form submission:', { name, email, message });
    
    return NextResponse.json(
      { success: true, message: 'Messaggio inviato con successo' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Si è verificato un errore durante l\'invio del messaggio' },
      { status: 500 }
    );
  }
} 