import { NextResponse } from "next/server";
import { db } from "@/lib/mainDb";

export async function GET() {
  try {
    const [rows] = await db.query(
      `SELECT id, date, type, item, category, quantity, unit, source, destination, notes FROM inventory_movements ORDER BY date DESC`
    );
    const formatted = (rows as any[]).map((row) => {
      if (row.date) {
        const d = new Date(row.date);
        if (!isNaN(d.getTime())) {
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          row.date = `${year}-${month}-${day}`;
        }
      }
      return row;
    });
    return NextResponse.json(formatted);
  } catch (error) {
    console.error("GET /reports/inventory-movement error", error);
    return NextResponse.json(
      { message: "Gagal memuat laporan keluar masuk" },
      { status: 500 }
    );
  }
}
