import { NextResponse } from "next/server";
import { db } from "@/lib/mainDb";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const {
      patientName,
      patientNIK,
      vaccineType,
      date,
      time,
      status,
      notes,
    } = body;

    await db.query(
      `UPDATE appointments SET patient_name = ?, patient_nik = ?, vaccine_type = ?, date = ?, time = ?, status = ?, notes = ? WHERE id = ?`,
      [
        patientName,
        patientNIK,
        vaccineType,
        date,
        time,
        status,
        notes,
        id,
      ]
    );

    return NextResponse.json({ message: "Jadwal berhasil diperbarui" });
  } catch (error) {
    console.error("PUT /api/v1/appointments/[id] error", error);
    return NextResponse.json(
      { message: "Gagal memperbarui jadwal" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await db.query(`DELETE FROM appointments WHERE id = ?`, [id]);

    return NextResponse.json({ message: "Jadwal berhasil dihapus" });
  } catch (error) {
    console.error("DELETE /api/v1/appointments/[id] error", error);
    return NextResponse.json(
      { message: "Gagal menghapus jadwal" },
      { status: 500 }
    );
  }
}
