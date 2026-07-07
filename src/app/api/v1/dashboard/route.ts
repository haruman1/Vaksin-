import { NextResponse } from 'next/server';
import { db } from '@/lib/mainDb';
import { timker4 } from '@/lib/timker4Db';

export async function GET() {
  try {
    const [obatRows] = await db.query(`SELECT COALESCE(SUM(stok), 0) as totalMedicines FROM obat`);
    const [bmhpRows] = await db.query(`SELECT COALESCE(SUM(stok), 0) as totalBmhp FROM bmhp`);
    const [regRows] = await timker4.query(`SELECT COUNT(*) as totalRegistrations FROM registrasi_pasien`);
    
    return NextResponse.json({
      totalMedicines: (obatRows as any[])[0].totalMedicines,
      totalBmhp: (bmhpRows as any[])[0].totalBmhp,
      totalRegistrations: (regRows as any[])[0].totalRegistrations
    });
  } catch (error) {
    console.error('GET /api/v1/dashboard error', error);
    return NextResponse.json({
      totalMedicines: 0,
      totalBmhp: 0,
      totalRegistrations: 0,
    });
  }
}
