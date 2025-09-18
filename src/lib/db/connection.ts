// src/lib/db/connection.ts
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

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

// Add the mode: "default" here
export const db = drizzle(connection, {
  schema,
  mode: "default", // This is what was missing!
});

export default db;
