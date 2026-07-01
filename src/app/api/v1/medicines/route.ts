import { NextResponse } from 'next/server';
import { timker4 } from '@/lib/timker4Db';

export async function GET() {
  try {
    const [rows] = await timker4.query(
      `SELECT id, no_urut AS noUrut, nama_obat AS name, satuan AS unit, stock FROM obat WHERE wilayah = 'pusat' ORDER BY no_urut ASC, nama_obat ASC`,
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error('GET /api/v1/medicines error', error);
    return NextResponse.json([]);
  }
}
