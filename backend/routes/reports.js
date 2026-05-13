import { Router } from "express";
import { db } from "../config/db.js";

const router = Router();

router.get("/inventory-movement", async(req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT id, date, type, item, category, quantity, unit, source, destination, notes FROM inventory_movements ORDER BY date DESC`
        );

        res.json(rows);
    } catch (error) {
        console.error("GET /reports/inventory-movement error", error);
        res.status(500).json({ message: "Gagal memuat laporan keluar masuk" });
    }
});

export default router;