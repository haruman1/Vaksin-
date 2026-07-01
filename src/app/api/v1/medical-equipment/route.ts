import { NextResponse } from 'next/server';
import { db } from '@/lib/mainDb';

export async function GET() {
  try {
    return NextResponse.json([]);
  } catch (error) {
    console.error('GET /api/v1/medical-equipment error', error);
    return NextResponse.json([]);
  }
}
