import { NextResponse } from 'next/server';
import { db } from '@/lib/mainDb';

export async function GET() {
  try {
    const [rows] = await db.query(
      `SELECT id, 0 AS noUrut, nama_obat AS name, satuan AS unit, stok as stock FROM obat ORDER BY nama_obat ASC`,
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error('GET /api/v1/medicines error', error);
    return NextResponse.json([]);
  }
}
