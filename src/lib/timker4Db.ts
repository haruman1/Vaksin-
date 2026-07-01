import mysql from 'mysql2/promise';

const globalForDb = global as unknown as { timker4: mysql.Pool };

export const timker4 =
  globalForDb.timker4 ||
  mysql.createPool({
    host: process.env.DB_HOST_timker4,
    user: process.env.DB_USER_timker4,
    password: process.env.DB_PASSWORD_timker4,
    database: process.env.DB_NAME_timker4,
    port: Number(process.env.DB_PORT),
    waitForConnections: true,
    connectionLimit: 10,
  });

if (process.env.NODE_ENV !== 'production') globalForDb.timker4 = timker4;
