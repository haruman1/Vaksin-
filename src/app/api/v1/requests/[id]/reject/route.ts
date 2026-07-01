import { NextResponse } from "next/server";
import { db } from "@/lib/mainDb";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await db.query(`UPDATE requests SET status = 'rejected' WHERE id = ?`, [id]);

    return NextResponse.json({ message: "Permintaan ditolak" });
  } catch (error) {
    console.error("PATCH /requests/[id]/reject error", error);
    return NextResponse.json(
      { message: "Gagal menolak permintaan" },
      { status: 500 }
    );
  }
}
