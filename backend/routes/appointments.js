import { Router } from "express";
import { db } from "../config/db.js";

const router = Router();

router.get("/", async(req, res) => {
            try {
                const { search = "", status } = req.query;
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

    res.json(rows);
  } catch (error) {
    console.error("GET /appointments error", error);
    res.status(500).json({ message: "Gagal memuat jadwal vaksinasi" });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      patientName,
      patientNIK,
      vaccineType,
      date,
      time,
      notes,
      status = "scheduled",
    } = req.body;

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

    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error("POST /appointments error", error);
    res.status(500).json({ message: "Gagal menyimpan jadwal vaksinasi" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      patientName,
      patientNIK,
      vaccineType,
      date,
      time,
      status,
      notes,
    } = req.body;

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

    res.json({ message: "Jadwal berhasil diperbarui" });
  } catch (error) {
    console.error("PUT /appointments/:id error", error);
    res.status(500).json({ message: "Gagal memperbarui jadwal" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(`DELETE FROM appointments WHERE id = ?`, [id]);

    res.json({ message: "Jadwal berhasil dihapus" });
  } catch (error) {
    console.error("DELETE /appointments/:id error", error);
    res.status(500).json({ message: "Gagal menghapus jadwal" });
  }
});