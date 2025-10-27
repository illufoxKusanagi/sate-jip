// src/lib/db/connection.ts
import { drizzle as drizzleMysql } from "drizzle-orm/mysql2";
import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import mysql from "mysql2/promise";
import postgres from "postgres";

// Determine which database to use
const DB_TYPE = process.env.DB_TYPE || "mysql";

let db: any;

if (DB_TYPE === "postgres") {
  // PostgreSQL connection (for Vercel/Render)
  const connectionString = process.env.DATABASE_URL!;
  const client = postgres(connectionString);

  // Import PostgreSQL schema
  const schema = require("./schema.postgres");
  db = drizzlePostgres(client, { schema });

  console.log("✅ Using PostgreSQL database");
} else {
  // MySQL connection (for company server)
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

  // Import MySQL schema
  const schema = require("./schema.mysql");
  db = drizzleMysql(connection, { schema, mode: "default" });

  console.log("✅ Using MySQL database");
}

export { db };
export default db;
