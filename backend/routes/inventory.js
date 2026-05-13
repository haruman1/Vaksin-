import { Router } from "express";
import { db } from "../config/db.js";

const router = Router();

router.get("/", async(req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT id, name, manufacturer, batch_number AS batchNumber, quantity, min_stock AS minStock, expiry_date AS expiryDate, storage_temp AS storageTemp, used_this_month AS usedThisMonth FROM inventory ORDER BY id DESC`
        );

        res.json(rows);
    } catch (error) {
        console.error("GET /inventory error", error);
        res.status(500).json({ message: "Gagal memuat inventory" });
    }
});

router.post("/", async(req, res) => {
    try {
        const {
            name,
            manufacturer,
            batchNumber,
            quantity,
            minStock,
            expiryDate,
            storageTemp,
            usedThisMonth,
        } = req.body;

        const [result] = await db.query(
            `INSERT INTO inventory (name, manufacturer, batch_number, quantity, min_stock, expiry_date, storage_temp, used_this_month) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
                name,
                manufacturer,
                batchNumber,
                quantity,
                minStock,
                expiryDate,
                storageTemp,
                usedThisMonth,
            ]
        );

        res.status(201).json({ id: result.insertId });
    } catch (error) {
        console.error("POST /inventory error", error);
        res.status(500).json({ message: "Gagal menyimpan inventory" });
    }
});

router.put("/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            manufacturer,
            batchNumber,
            quantity,
            minStock,
            expiryDate,
            storageTemp,
            usedThisMonth,
        } = req.body;

        await db.query(
            `UPDATE inventory SET name = ?, manufacturer = ?, batch_number = ?, quantity = ?, min_stock = ?, expiry_date = ?, storage_temp = ?, used_this_month = ? WHERE id = ?`, [
                name,
                manufacturer,
                batchNumber,
                quantity,
                minStock,
                expiryDate,
                storageTemp,
                usedThisMonth,
                id,
            ]
        );

        res.json({ message: "Inventory berhasil diperbarui" });
    } catch (error) {
        console.error("PUT /inventory/:id error", error);
        res.status(500).json({ message: "Gagal memperbarui inventory" });
    }
});

router.delete("/:id", async(req, res) => {
    try {
        const { id } = req.params;

        await db.query(`DELETE FROM inventory WHERE id = ?`, [id]);

        res.json({ message: "Inventory berhasil dihapus" });
    } catch (error) {
        console.error("DELETE /inventory/:id error", error);
        res.status(500).json({ message: "Gagal menghapus inventory" });
    }
});

export default router;