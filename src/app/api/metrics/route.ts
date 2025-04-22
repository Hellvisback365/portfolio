import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const metric = await request.json();
    
    // Qui potresti inviare i dati a un database o a un servizio di analytics
    console.log('Web Vitals Metric:', metric);
    
    // In un'implementazione reale, potresti utilizzare:
    // - Database come MongoDB o PostgreSQL per archiviare
    // - Servizi come Google Analytics, Vercel Analytics, o custom analytics
    
    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error logging metrics:', error);
    return NextResponse.json(
      { error: 'Failed to log metrics' },
      { status: 500 }
    );
  }
} 