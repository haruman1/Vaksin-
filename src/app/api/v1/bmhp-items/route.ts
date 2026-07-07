import { NextResponse } from 'next/server';
import { db } from '@/lib/mainDb';

export async function GET() {
  try {
    const [rows] = await db.query(
      `SELECT id, 0 AS noUrut, nama_bmhp AS name, satuan AS unit, stok as stock FROM bmhp ORDER BY nama_bmhp ASC`,
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error('GET /api/v1/bmhp-items error', error);
    return NextResponse.json([]);
  }
}
