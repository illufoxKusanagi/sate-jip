import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

// Log connection configuration (without sensitive data)
console.log("Database connection config:", {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  database: process.env.DB_NAME || "sate_jip_db",
  hasPassword: !!(process.env.DB_PASSWORD || "12345678Haha"),
});

const connection = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "12345678Haha",
  database: process.env.DB_NAME || "sate_jip_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection on startup
connection
  .getConnection()
  .then((conn) => {
    console.log("Database connection established successfully");
    conn.release();
  })
  .catch((err) => {
    console.error("Failed to establish database connection:", err);
  });

export const db = drizzle(connection, {
  schema,
  mode: "default",
});

export default db;
