import { Router } from "express";
import { db } from "../config/db.js";

const router = Router();

router.get("/", async(req, res) => {
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

        const mapped = requests.map((request) => ({
            ...request,
            medicines: medicines
                .filter((item) => item.requestId === request.id)
                .map((item) => ({
                    id: `${request.id}-medicine-${item.medicine}`,
                    medicine: item.medicine,
                    stockRemaining: 0,
                    requestDate: item.requestDate,
                    requestQuantity: item.quantity,
                })),
            bmhp: bmhp
                .filter((item) => item.requestId === request.id)
                .map((item) => ({
                    id: `${request.id}-bmhp-${item.item}`,
                    item: item.item,
                    stockRemaining: 0,
                    requestDate: item.requestDate,
                    requestQuantity: item.quantity,
                })),
            medicalEquipment: equipment
                .filter((item) => item.requestId === request.id)
                .map((item) => ({
                    id: `${request.id}-equipment-${item.equipment}`,
                    equipment: item.equipment,
                    stockRemaining: 0,
                    requestDate: item.requestDate,
                    requestQuantity: item.quantity,
                })),
        }));

        res.json(mapped);
    } catch (error) {
        console.error("GET /requests error", error);
        res.status(500).json({ message: "Gagal memuat riwayat permintaan" });
    }
});

router.post("/", async(req, res) => {
    const connection = await db.getConnection();

    try {
        const {
            requestDate,
            unit,
            staffName,
            position,
            medicines = [],
            bmhp = [],
            medicalEquipment = [],
        } = req.body;

        await connection.beginTransaction();

        const [requestResult] = await connection.query(
            `INSERT INTO requests (request_date, unit, staff_name, position, status) VALUES (?, ?, ?, ?, 'pending')`, [requestDate, unit, staffName, position]
        );

        const requestId = requestResult.insertId;

        const medicinePromises = medicines.map((item) =>
            connection.query(
                `INSERT INTO request_medicines (request_id, medicine, quantity, request_date) VALUES (?, ?, ?, ?)`, [requestId, item.medicine, item.quantity, item.requestDate]
            )
        );

        const bmhpPromises = bmhp.map((item) =>
            connection.query(
                `INSERT INTO request_bmhp (request_id, item, quantity, request_date) VALUES (?, ?, ?, ?)`, [requestId, item.item, item.quantity, item.requestDate]
            )
        );

        const equipmentPromises = medicalEquipment.map((item) =>
            connection.query(
                `INSERT INTO request_medical_equipment (request_id, equipment, quantity, request_date) VALUES (?, ?, ?, ?)`, [requestId, item.equipment, item.quantity, item.requestDate]
            )
        );

        await Promise.all([
            ...medicinePromises,
            ...bmhpPromises,
            ...equipmentPromises,
        ]);

        await connection.commit();

        res.status(201).json({ id: requestId });
    } catch (error) {
        await connection.rollback();
        console.error("POST /requests error", error);
        res.status(500).json({ message: "Gagal menyimpan permintaan" });
    } finally {
        connection.release();
    }
});

router.patch("/:id/approve", async(req, res) => {
    try {
        const { id } = req.params;

        await db.query(`UPDATE requests SET status = 'approved' WHERE id = ?`, [id]);

        res.json({ message: "Permintaan disetujui" });
    } catch (error) {
        console.error("PATCH /requests/:id/approve error", error);
        res.status(500).json({ message: "Gagal menyetujui permintaan" });
    }
});

router.patch("/:id/reject", async(req, res) => {
    try {
        const { id } = req.params;

        await db.query(`UPDATE requests SET status = 'rejected' WHERE id = ?`, [id]);

        res.json({ message: "Permintaan ditolak" });
    } catch (error) {
        console.error("PATCH /requests/:id/reject error", error);
        res.status(500).json({ message: "Gagal menolak permintaan" });
    }
});

export default router;