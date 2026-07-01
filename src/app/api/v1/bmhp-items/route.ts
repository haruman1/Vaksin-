import { NextResponse } from 'next/server';
import { timker4 } from '@/lib/timker4Db';

export async function GET() {
  try {
    const [rows] = await timker4.query(
      `SELECT id, no_urut AS noUrut, nama_bmhp AS name, satuan AS unit, stock FROM bmhp WHERE wilayah = 'pusat' ORDER BY no_urut ASC, nama_bmhp ASC`,
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error('GET /api/v1/bmhp-items error', error);
    return NextResponse.json([]);
  }
}
