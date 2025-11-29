import { NextResponse } from 'next/server';
import { getProfileDocuments } from '@/lib/profileDocuments';

export async function GET() {
  const documents = getProfileDocuments();
  return NextResponse.json({ documents });
}
