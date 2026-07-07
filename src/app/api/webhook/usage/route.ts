import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.SYNC_TOKEN || 'mediva_secure_sync_token_2026_xyz'}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, data } = body;

    if (!type || !Array.isArray(data)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'perberkes',
    });

    try {
      await connection.beginTransaction();

      for (const item of data) {
        if (type === 'obat') {
          await connection.execute(
            `UPDATE obat SET stok = stok - ? WHERE id = ? OR kode_obat = ?`,
            [item.jumlah, item.id, item.id] // Allow ID or Kode
          );
        } else if (type === 'bmhp') {
          await connection.execute(
            `UPDATE bmhp SET stok = stok - ? WHERE id = ? OR kode_bmhp = ?`,
            [item.jumlah, item.id, item.id] // Allow ID or Kode
          );
        }
      }

      await connection.commit();
      return NextResponse.json({ success: true, message: `${type} usage synced successfully` });
    } catch (error) {
      await connection.rollback();
      console.error('Error updating stock in Mediva:', error);
      return NextResponse.json({ error: 'Failed to update stock' }, { status: 500 });
    } finally {
      await connection.end();
    }
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
