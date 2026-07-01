import { NextResponse } from "next/server";
import { db } from "@/lib/mainDb";

export async function GET() {
  try {
    const [requests] = await db.query(
      `SELECT id, request_date AS requestDate, unit, staff_name AS staffName, position, status, created_at AS createdAt FROM requests ORDER BY created_at DESC`
    );

    const [medicines] = await db.query(
      `SELECT request_id AS requestId, medicine, quantity, request_date AS requestDate FROM request_medicines`
    );
    const [bmhp] = await db.query(
      `SELECT request_id AS requestId, item, quantity, request_date AS requestDate FROM request_bmhp`
    );
    const [equipment] = await db.query(
      `SELECT request_id AS requestId, equipment, quantity, request_date AS requestDate FROM request_medical_equipment`
    );

    const mapped = (requests as any[]).map((request) => {
      if (request.requestDate) {
        const d = new Date(request.requestDate);
        if (!isNaN(d.getTime())) {
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          request.requestDate = `${year}-${month}-${day}`;
        }
      }
      if (request.createdAt) {
        const d = new Date(request.createdAt);
        if (!isNaN(d.getTime())) {
          request.createdAt = d.toLocaleString();
        }
      }

      return {
        ...request,
        medicines: (medicines as any[])
          .filter((item) => item.requestId === request.id)
          .map((item) => {
            if (item.requestDate) {
              const d = new Date(item.requestDate);
              if (!isNaN(d.getTime())) {
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                item.requestDate = `${year}-${month}-${day}`;
              }
            }
            return {
              id: `${request.id}-medicine-${item.medicine}`,
              medicine: item.medicine,
              stockRemaining: 0,
              requestDate: item.requestDate,
              requestQuantity: item.quantity,
            };
          }),
        bmhp: (bmhp as any[])
          .filter((item) => item.requestId === request.id)
          .map((item) => {
            if (item.requestDate) {
              const d = new Date(item.requestDate);
              if (!isNaN(d.getTime())) {
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                item.requestDate = `${year}-${month}-${day}`;
              }
            }
            return {
              id: `${request.id}-bmhp-${item.item}`,
              item: item.item,
              stockRemaining: 0,
              requestDate: item.requestDate,
              requestQuantity: item.quantity,
            };
          }),
        medicalEquipment: (equipment as any[])
          .filter((item) => item.requestId === request.id)
          .map((item) => {
            if (item.requestDate) {
              const d = new Date(item.requestDate);
              if (!isNaN(d.getTime())) {
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                item.requestDate = `${year}-${month}-${day}`;
              }
            }
            return {
              id: `${request.id}-equipment-${item.equipment}`,
              equipment: item.equipment,
              stockRemaining: 0,
              requestDate: item.requestDate,
              requestQuantity: item.quantity,
            };
          }),
      };
    });

    return NextResponse.json(mapped);
  } catch (error) {
    console.error("GET /api/v1/requests error", error);
    return NextResponse.json(
      { message: "Gagal memuat riwayat permintaan" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const connection = await db.getConnection();
  try {
    const body = await req.json();
    const {
      requestDate,
      unit,
      staffName,
      position,
      medicines = [],
      bmhp = [],
      medicalEquipment = [],
    } = body;

    await connection.beginTransaction();

    const [requestResult] = await connection.query(
      `INSERT INTO requests (request_date, unit, staff_name, position, status) VALUES (?, ?, ?, ?, 'pending')`,
      [requestDate, unit, staffName, position]
    );

    const requestId = (requestResult as any).insertId;

    const medicinePromises = medicines.map((item: any) =>
      connection.query(
        `INSERT INTO request_medicines (request_id, medicine, quantity, request_date) VALUES (?, ?, ?, ?)`,
        [requestId, item.medicine, item.quantity, item.requestDate]
      )
    );

    const bmhpPromises = bmhp.map((item: any) =>
      connection.query(
        `INSERT INTO request_bmhp (request_id, item, quantity, request_date) VALUES (?, ?, ?, ?)`,
        [requestId, item.item, item.quantity, item.requestDate]
      )
    );

    const equipmentPromises = medicalEquipment.map((item: any) =>
      connection.query(
        `INSERT INTO request_medical_equipment (request_id, equipment, quantity, request_date) VALUES (?, ?, ?, ?)`,
        [requestId, item.equipment, item.quantity, item.requestDate]
      )
    );

    await Promise.all([
      ...medicinePromises,
      ...bmhpPromises,
      ...equipmentPromises,
    ]);

    await connection.commit();

    return NextResponse.json({ id: requestId }, { status: 201 });
  } catch (error) {
    await connection.rollback();
    console.error("POST /api/v1/requests error", error);
    return NextResponse.json(
      { message: "Gagal menyimpan permintaan" },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}
