import { NextResponse } from 'next/server';
import { timker4 } from '@/lib/timker4Db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    let userRole = '';
    let userWilayah = '';

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        userRole = decoded.role || '';
        userWilayah = decoded.wilayah || '';
      } catch (err) {
        // ignore invalid token
      }
    }

    let filterQuery = '';
    let filterParams: any[] = [];
    
    // Admin or pusat sees all ONLY if their wilayah is pusat. Otherwise they only see their wilayah.
    if (userWilayah !== 'pusat' && userWilayah) {
      filterQuery = ' WHERE wilayah LIKE ?';
      filterParams = [`${userWilayah}%`];
    }

    const [medicines] = await timker4.query(
      `SELECT id, no_urut AS noUrut, nama_obat AS name, satuan AS unit, stock, wilayah, 'obat' AS category FROM obat${filterQuery}`,
      filterParams
    );
    const [bmhp] = await timker4.query(
      `SELECT id, no_urut AS noUrut, nama_bmhp AS name, satuan AS unit, stock, wilayah, 'bmhp' AS category FROM bmhp${filterQuery}`,
      filterParams
    );

    const combined = [...(medicines as any[]), ...(bmhp as any[])].sort(
      (left, right) => {
        const leftOrder = Number(left.noUrut ?? 0);
        const rightOrder = Number(right.noUrut ?? 0);
        if (leftOrder !== rightOrder) return leftOrder - rightOrder;
        return String(left.name).localeCompare(String(right.name));
      },
    );

    return NextResponse.json(combined);
  } catch (error) {
    console.error('GET /api/v1/inventory error', error);
    return NextResponse.json(
      { message: 'Gagal memuat inventori timker4' },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    let userRole = '';
    let userWilayah = 'pusat'; // default

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        userRole = decoded.role || '';
        if (decoded.wilayah) userWilayah = decoded.wilayah;
      } catch (err) {
        // ignore invalid token
      }
    }

    const body = await req.json();
    const { category = 'obat', name, unit, stock = 0, noUrut, wilayah } = body;
    
    const finalWilayah = (userRole === 'admin' && wilayah) ? wilayah : userWilayah;

    const tableName = category === 'bmhp' ? 'bmhp' : 'obat';
    const nameColumn = category === 'bmhp' ? 'nama_bmhp' : 'nama_obat';

    const [result] = await timker4.query(
      `INSERT INTO ${tableName} (no_urut, ${nameColumn}, satuan, stock, wilayah) VALUES (?, ?, ?, ?, ?)`,
      [noUrut ?? 0, name, unit, stock, finalWilayah],
    );

    return NextResponse.json({ id: (result as any).insertId }, { status: 201 });
  } catch (error) {
    console.error('POST /api/v1/inventory error', error);
    return NextResponse.json(
      { message: 'Gagal menyimpan inventori' },
      { status: 500 },
    );
  }
}
