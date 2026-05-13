<<<<<<< HEAD
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import inventoryRoutes from "./routes/inventory.js";
import appointmentRoutes from "./routes/appointments.js";
import requestRoutes from "./routes/requests.js";
import reportRoutes from "./routes/reports.js";

dotenv.config();
=======
require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
>>>>>>> 334e0553976a6426ab56c748959a9b4bdde8f660

const app = express();

app.use(cors());
app.use(express.json());

<<<<<<< HEAD
app.get("/", (req, res) => {
    res.json({
        message: "API Running",
    });
});

app.use("/api/v1/inventory", inventoryRoutes);
app.use("/api/v1/appointments", appointmentRoutes);
app.use("/api/v1/requests", requestRoutes);
app.use("/api/v1/reports", reportRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(
        `Server running on http://localhost:${port}`
    );
});

export default app;
=======
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

/*
====================================
APPOINTMENTS
====================================
*/

app.get("/api/appointments", (req, res) => {
    db.query(
        "SELECT * FROM appointments ORDER BY date DESC,time DESC",
        (err, result) => {
            if (err) return res.status(500).json(err);

            res.json(result);
        }
    );
});

app.post("/api/appointments", (req, res) => {
    const {
        patientName,
        patientNIK,
        vaccineType,
        date,
        time,
        status,
        notes,
    } = req.body;

    db.query(
        `
      INSERT INTO appointments
      (
        patient_name,
        patient_nik,
        vaccine_type,
        date,
        time,
        status,
        notes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
            patientName,
            patientNIK,
            vaccineType,
            date,
            time,
            status,
            notes,
        ],
        (err, result) => {
            if (err) return res.status(500).json(err);

            res.json({
                success: true,
            });
        }
    );
});

app.put("/api/appointments/:id", (req, res) => {
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

    db.query(
        `
      UPDATE appointments
      SET
      patient_name=?,
      patient_nik=?,
      vaccine_type=?,
      date=?,
      time=?,
      status=?,
      notes=?
      WHERE id=?
    `, [
            patientName,
            patientNIK,
            vaccineType,
            date,
            time,
            status,
            notes,
            id,
        ],
        (err, result) => {
            if (err) return res.status(500).json(err);

            res.json({
                success: true,
            });
        }
    );
});

app.delete("/api/appointments/:id", (req, res) => {
    db.query(
        "DELETE FROM appointments WHERE id=?", [req.params.id],
        (err, result) => {
            if (err) return res.status(500).json(err);

            res.json({
                success: true,
            });
        }
    );
});

/*
====================================
INVENTORY
====================================
*/

app.get("/api/inventory", (req, res) => {
    db.query(
        "SELECT * FROM inventory ORDER BY id DESC",
        (err, result) => {
            if (err) return res.status(500).json(err);

            res.json(result);
        }
    );
});

app.post("/api/inventory", (req, res) => {
    const {
        name,
        manufacturer,
        batchNumber,
        quantity,
        minStock,
        expiryDate,
        storageTemp,
    } = req.body;

    db.query(
        `
      INSERT INTO inventory
      (
        name,
        manufacturer,
        batch_number,
        quantity,
        min_stock,
        expiry_date,
        storage_temp
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
            name,
            manufacturer,
            batchNumber,
            quantity,
            minStock,
            expiryDate,
            storageTemp,
        ],
        (err, result) => {
            if (err) return res.status(500).json(err);

            res.json({
                success: true,
            });
        }
    );
});

app.put("/api/inventory/:id", (req, res) => {
    const { id } = req.params;

    const {
        name,
        manufacturer,
        batchNumber,
        quantity,
        minStock,
        expiryDate,
        storageTemp,
    } = req.body;

    db.query(
        `
      UPDATE inventory
      SET
      name=?,
      manufacturer=?,
      batch_number=?,
      quantity=?,
      min_stock=?,
      expiry_date=?,
      storage_temp=?
      WHERE id=?
    `, [
            name,
            manufacturer,
            batchNumber,
            quantity,
            minStock,
            expiryDate,
            storageTemp,
            id,
        ],
        (err, result) => {
            if (err) return res.status(500).json(err);

            res.json({
                success: true,
            });
        }
    );
});

app.delete("/api/inventory/:id", (req, res) => {
    db.query(
        "DELETE FROM inventory WHERE id=?", [req.params.id],
        (err, result) => {
            if (err) return res.status(500).json(err);

            res.json({
                success: true,
            });
        }
    );
});

/*
====================================
TRANSACTIONS
====================================
*/

app.get("/api/transactions", (req, res) => {
    db.query(
        "SELECT * FROM transactions ORDER BY date DESC",
        (err, result) => {
            if (err) return res.status(500).json(err);

            res.json(result);
        }
    );
});

app.post("/api/transactions", (req, res) => {
    const {
        date,
        type,
        item,
        category,
        quantity,
        unit,
        source,
        destination,
        notes,
    } = req.body;

    db.query(
        `
      INSERT INTO transactions
      (
        date,
        type,
        item,
        category,
        quantity,
        unit,
        source,
        destination,
        notes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
            date,
            type,
            item,
            category,
            quantity,
            unit,
            source,
            destination,
            notes,
        ],
        (err, result) => {
            if (err) return res.status(500).json(err);

            res.json({
                success: true,
            });
        }
    );
});

/*
====================================
DASHBOARD
====================================
*/

app.get("/api/dashboard", (req, res) => {
    db.query(
        `
      SELECT
      (SELECT COUNT(*) FROM appointments) as totalAppointments,
      (SELECT COUNT(*) FROM inventory) as totalInventory,
      (SELECT COUNT(*) FROM transactions) as totalTransactions
    `,
        (err, result) => {
            if (err) return res.status(500).json(err);

            res.json(result[0]);
        }
    );
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log("SERVER RUNNING");
});
>>>>>>> 334e0553976a6426ab56c748959a9b4bdde8f660
