import { NextResponse } from 'next/server';
import { timker4 } from '@/lib/timker4Db';

export async function GET() {
  try {
    const [rows] = await timker4.query(`
      SELECT
      (SELECT COUNT(*) FROM obat) as totalMedicines,
      (SELECT COUNT(*) FROM bmhp) as totalBmhp,
      (SELECT COUNT(*) FROM registrasi_pasien) as totalRegistrations
    `);
    return NextResponse.json((rows as any[])[0]);
  } catch (error) {
    console.error('GET /api/v1/dashboard error', error);
    return NextResponse.json({
      totalMedicines: 0,
      totalBmhp: 0,
      totalRegistrations: 0,
    });
  }
}
