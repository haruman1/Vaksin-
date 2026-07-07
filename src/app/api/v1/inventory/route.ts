import { NextResponse } from 'next/server';
import { db } from '@/lib/mainDb';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

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
    // Note: wilayah is removed from schema, ignoring filter for now.

    const [medicines] = await db.query(
      `SELECT id, 0 AS noUrut, nama_obat AS name, satuan AS unit, stok as stock, 'pusat' AS wilayah, 'obat' AS category FROM obat`
    );
    const [bmhp] = await db.query(
      `SELECT id, 0 AS noUrut, nama_bmhp AS name, satuan AS unit, stok as stock, 'pusat' AS wilayah, 'bmhp' AS category FROM bmhp`
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
    const { category = 'obat', name, unit, stock = 0 } = body;
    
    const tableName = category === 'bmhp' ? 'bmhp' : 'obat';
    const nameColumn = category === 'bmhp' ? 'nama_bmhp' : 'nama_obat';
    const kodePrefix = category === 'bmhp' ? 'BMHP-' : 'OBAT-';
    
    const id = crypto.randomUUID();
    const kode = kodePrefix + Math.floor(Math.random() * 1000000);

    await db.query(
      `INSERT INTO ${tableName} (id, kode_${tableName}, ${nameColumn}, satuan, stok) VALUES (?, ?, ?, ?, ?)`,
      [id, kode, name, unit, stock],
    );

    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    console.error('POST /api/v1/inventory error', error);
    return NextResponse.json(
      { message: 'Gagal menyimpan inventori' },
      { status: 500 },
    );
  }
}
