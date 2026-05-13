const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "vaksin_db",
});

db.connect((err) => {
    if (err) {
        console.log("Database gagal connect");
        console.log(err);
    } else {
        console.log("Database berhasil connect");
    }
});

module.exports = db;