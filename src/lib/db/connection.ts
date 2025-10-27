// src/lib/db/connection.ts
import { drizzle as drizzleMysql } from "drizzle-orm/mysql2";
import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import mysql from "mysql2/promise";
import postgres from "postgres";
import * as mysqlSchema from "./schema.mysql";
import * as postgresSchema from "./schema.postgres";

// Determine which database to use
const DB_TYPE = process.env.DB_TYPE || "mysql";

let connectionString;

let db: any;

if (DB_TYPE === "postgres") {
  // PostgreSQL connection (for Vercel/Render)
  connectionString = process.env.DATABASE_URL || "";
  const client = postgres(connectionString);
  db = drizzlePostgres(client, { schema: postgresSchema });
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

  db = drizzleMysql(connection, { schema: mysqlSchema, mode: "default" });
  console.log("✅ Using MySQL database");
}

if (
  connectionString &&
  connectionString !== "mysql://build:build@localhost:3306/build"
) {
  const client = postgres(connectionString);
  db = drizzlePostgres(client, { schema: postgresSchema });
  console.log("✅ Using PostgreSQL database");
} else {
  // Build time - create a dummy db object
  console.log("⚠️ Build mode - database not initialized");
}
// } else {
// // MySQL connection (for company server)
// const dbHost = process.env.DB_HOST || "localhost";

// if (dbHost !== "localhost" || process.env.NODE_ENV === "production") {
//   const connection = mysql.createPool({
//     host: dbHost,
//     port: parseInt(process.env.DB_PORT || "3306"),
//     user: process.env.DB_USER || "root",
//     password: process.env.DB_PASSWORD || "12345678Haha",
//     database: process.env.DB_NAME || "sate_jip_db",
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0,
//   });

//   db = drizzleMysql(connection, { schema: mysqlSchema, mode: "default" });
//   console.log("✅ Using MySQL database");
// } else {
//   // Build time - create a dummy db object
//   console.log("⚠️ Build mode - database not initialized");
// }
// }

export { db };
export default db;
