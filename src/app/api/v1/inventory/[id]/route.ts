import { NextResponse } from 'next/server';
import { timker4 } from '@/lib/timker4Db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

    const { id } = await params;
    const body = await req.json();
    const { category = 'obat', name, unit, stock = 0, noUrut, wilayah, quantityUsed } = body;
    const tableName = category === 'bmhp' ? 'bmhp' : 'obat';
    const nameColumn = category === 'bmhp' ? 'nama_bmhp' : 'nama_obat';

    if (userRole !== 'admin') {
      // Normal user: can only decrease stock, cannot change other fields.
      const [currentRows] = await timker4.query(
        `SELECT stock, wilayah, ${nameColumn} FROM ${tableName} WHERE id = ?`,
        [id]
      );
      
      const currentItem = (currentRows as any[])[0];
      if (!currentItem) {
        return NextResponse.json({ message: 'Item tidak ditemukan' }, { status: 404 });
      }

      if (currentItem.wilayah !== userWilayah) {
        return NextResponse.json({ message: 'Akses ditolak' }, { status: 403 });
      }

      if (quantityUsed === undefined || quantityUsed < 0) {
        return NextResponse.json({ message: 'Jumlah penggunaan tidak valid' }, { status: 400 });
      }

      if (quantityUsed > currentItem.stock) {
        return NextResponse.json({ message: 'Jumlah penggunaan melebihi stok yang ada' }, { status: 400 });
      }

      if (quantityUsed > 0) {
        // Insert into inventory_movements
        const { db } = await import('@/lib/mainDb');
        await db.query(
          `INSERT INTO inventory_movements (date, type, item, category, quantity, unit, source, destination, notes) 
           VALUES (NOW(), 'keluar', ?, ?, ?, ?, ?, ?, ?)`,
          [
            currentItem[nameColumn],
            category,
            quantityUsed,
            unit,
            'Pusat/Inventori',
            userWilayah || 'Lainnya',
            body.notes || 'Penggunaan Rutin'
          ]
        );
      }

      const newStock = currentItem.stock - quantityUsed;

      // Only update the stock
      await timker4.query(
        `UPDATE ${tableName} SET stock = ? WHERE id = ?`,
        [newStock, id],
      );
    } else {
      // Admin: can update all fields
      await timker4.query(
        `UPDATE ${tableName} SET no_urut = ?, ${nameColumn} = ?, satuan = ?, stock = ?, wilayah = ? WHERE id = ?`,
        [noUrut ?? 0, name, unit, stock, wilayah || 'pusat', id],
      );
    }

    return NextResponse.json({ message: 'Inventori berhasil diperbarui' });
  } catch (error) {
    console.error('PUT /api/v1/inventory/[id] error', error);
    return NextResponse.json(
      { message: 'Gagal memperbarui inventori' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authHeader = req.headers.get('Authorization');
    let userRole = '';

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        userRole = decoded.role || '';
      } catch (err) {
        // ignore invalid token
      }
    }

    if (userRole !== 'admin') {
      return NextResponse.json({ message: 'Hanya admin yang dapat menghapus item' }, { status: 403 });
    }

    const { id } = await params;

    const [medicineRows] = await timker4.query(
      `SELECT id FROM obat WHERE id = ? LIMIT 1`,
      [id],
    );
    const [bmhpRows] = await timker4.query(
      `SELECT id FROM bmhp WHERE id = ? LIMIT 1`,
      [id],
    );

    if ((medicineRows as any[]).length > 0) {
      await timker4.query(`DELETE FROM obat WHERE id = ?`, [id]);
    } else if ((bmhpRows as any[]).length > 0) {
      await timker4.query(`DELETE FROM bmhp WHERE id = ?`, [id]);
    }

    return NextResponse.json({ message: 'Inventori berhasil dihapus' });
  } catch (error) {
    console.error('DELETE /api/v1/inventory/[id] error', error);
    return NextResponse.json(
      { message: 'Gagal menghapus inventori' },
      { status: 500 },
    );
  }
}
