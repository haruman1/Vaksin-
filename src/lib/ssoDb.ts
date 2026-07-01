import mysql from 'mysql2/promise';

// Use the same server since they are likely hosted together,
// just use a different database name ('sso')

export const ssoDb = mysql.createPool({
  host: process.env.DB_HOST_sso,
  user: process.env.DB_USER_sso,
  password: process.env.DB_PASSWORD_sso,
  database: process.env.DB_NAME_sso,
  port: Number(process.env.DB_PORT),
  waitForConnections: true,
  connectionLimit: 10,
});
