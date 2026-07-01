import { NextResponse } from "next/server";
import { db } from "@/lib/mainDb";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";

    const filters = [];
    const values = [];

    if (search) {
      filters.push(
        `(patient_name LIKE ? OR patient_nik LIKE ? OR vaccine_type LIKE ?)`
      );
      const term = `%${search}%`;
      values.push(term, term, term);
    }

    if (status && status !== "all") {
      filters.push(`status = ?`);
      values.push(status);
    }

    const sql = `SELECT id, patient_name AS patientName, patient_nik AS patientNIK, vaccine_type AS vaccineType, date, time, status, notes FROM appointments ${
      filters.length ? `WHERE ${filters.join(" AND ")}` : ""
    } ORDER BY date ASC, time ASC`;

    const [rows] = await db.query(sql, values);
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
    console.error("GET /api/v1/appointments error", error);
    return NextResponse.json(
      { message: "Gagal memuat jadwal vaksinasi" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      patientName,
      patientNIK,
      vaccineType,
      date,
      time,
      notes,
      status = "scheduled",
    } = body;

    const [result] = await db.query(
      `INSERT INTO appointments (patient_name, patient_nik, vaccine_type, date, time, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        patientName,
        patientNIK,
        vaccineType,
        date,
        time,
        status,
        notes,
      ]
    );

    return NextResponse.json({ id: (result as any).insertId }, { status: 201 });
  } catch (error) {
    console.error("POST /api/v1/appointments error", error);
    return NextResponse.json(
      { message: "Gagal menyimpan jadwal vaksinasi" },
      { status: 500 }
    );
  }
}
