import { NextResponse } from "next/server";
import { db } from "@/lib/mainDb";
import { timker4 } from "@/lib/timker4Db";

const mapUnitToWilayah = (unitName: string) => {
  const lower = unitName.toLowerCase();
  if (lower.includes('1 a') || lower.includes('1a')) return 'terminal1a';
  if (lower.includes('1 b') || lower.includes('1b')) return 'terminal1b';
  if (lower.includes('1 c') || lower.includes('1c')) return 'terminal1c';
  if (lower.includes('2 a') || lower.includes('2a')) return 'terminal2a';
  if (lower.includes('2 b') || lower.includes('2b')) return 'terminal2b';
  if (lower.includes('2 c') || lower.includes('2c')) return 'terminal2c';
  if (lower.includes('2 d') || lower.includes('2d')) return 'terminal2d';
  if (lower.includes('2 e') || lower.includes('2e')) return 'terminal2e';
  if (lower.includes('2 f') || lower.includes('2f')) return 'terminal2f';
  if (lower.includes('3 internasional') || lower.includes('3 inter')) return 'terminal3inter';
  if (lower.includes('3 domestik') || lower.includes('3 dom')) return 'terminal3dom';
  if (lower.includes('igd') || lower.includes('gawat darurat')) return 'igd';
  return 'pusat'; // Default fallback
};

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Get request details
    const [reqRows] = await db.query(`SELECT * FROM requests WHERE id = ?`, [id]);
    const request = (reqRows as any[])[0];
    if (!request) {
       return NextResponse.json({ message: "Permintaan tidak ditemukan" }, { status: 404 });
    }
    
    const targetWilayah = mapUnitToWilayah(request.unit || '');

    // 2. Get requested items
    const [medicines] = await db.query(`SELECT medicine, quantity FROM request_medicines WHERE request_id = ?`, [id]);
    const [bmhp] = await db.query(`SELECT item, quantity FROM request_bmhp WHERE request_id = ?`, [id]);

    const transferStock = async (tableName: string, nameColumn: string, itemName: string, quantity: number) => {
       // Deduct from pusat (if exists)
       await timker4.query(`UPDATE ${tableName} SET stock = GREATEST(0, stock - ?) WHERE ${nameColumn} = ? AND wilayah = 'pusat'`, [quantity, itemName]);
       
       let satuan = '-';
       let noUrut = 0;
       const [pusatRows] = await timker4.query(`SELECT satuan, no_urut FROM ${tableName} WHERE ${nameColumn} = ? AND wilayah = 'pusat' LIMIT 1`, [itemName]);
       if ((pusatRows as any[]).length > 0) {
           satuan = (pusatRows as any)[0].satuan || '-';
           noUrut = (pusatRows as any)[0].no_urut || 0;
       }

       // Add to target wilayah
       const [targetRows] = await timker4.query(`SELECT id FROM ${tableName} WHERE ${nameColumn} = ? AND wilayah = ?`, [itemName, targetWilayah]);
       if ((targetRows as any[]).length > 0) {
           await timker4.query(`UPDATE ${tableName} SET stock = stock + ? WHERE ${nameColumn} = ? AND wilayah = ?`, [quantity, itemName, targetWilayah]);
       } else {
           // Insert new row for wilayah
           await timker4.query(`INSERT INTO ${tableName} (no_urut, ${nameColumn}, satuan, stock, wilayah) VALUES (?, ?, ?, ?, ?)`, [noUrut, itemName, satuan, quantity, targetWilayah]);
       }

       // Insert into inventory_movements (Masuk)
       const category = tableName === 'bmhp' ? 'bmhp' : 'obat';
       await db.query(
          `INSERT INTO inventory_movements (date, type, item, category, quantity, unit, source, destination, notes) 
           VALUES (NOW(), 'masuk', ?, ?, ?, ?, ?, ?, ?)`,
          [
            itemName,
            category,
            quantity,
            satuan,
            'Pusat/Inventori',
            targetWilayah || 'Lainnya',
            'Permintaan Disetujui'
          ]
       );
    };

    // Execute transfers
    for (const med of (medicines as any[])) {
       await transferStock('obat', 'nama_obat', med.medicine, med.quantity);
    }
    
    for (const b of (bmhp as any[])) {
       await transferStock('bmhp', 'nama_bmhp', b.item, b.quantity);
    }

    await db.query(`UPDATE requests SET status = 'approved' WHERE id = ?`, [id]);

    return NextResponse.json({ message: "Permintaan disetujui dan stok berhasil ditransfer" });
  } catch (error) {
    console.error("PATCH /requests/[id]/approve error", error);
    return NextResponse.json(
      { message: "Gagal menyetujui permintaan" },
      { status: 500 }
    );
  }
}
