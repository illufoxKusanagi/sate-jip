import { drizzle as drizzleMysql } from "drizzle-orm/mysql2";
import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import mysql from "mysql2/promise";
import postgres from "postgres";
import * as mysqlSchema from "./schema.mysql";
import * as postgresSchema from "./schema.postgres";

const DB_TYPE = process.env.DB_TYPE || "mysql";
let db: any;
const isBuildMode =
  process.env.NODE_ENV === "production" &&
  !process.env.DATABASE_URL &&
  !process.env.DB_HOST;

if (isBuildMode) {
  console.log("⚠️  Build mode - database not initialized");
  db = {} as any;
} else if (DB_TYPE === "postgres") {
  const connectionString = process.env.DATABASE_URL || "";

  if (
    connectionString &&
    connectionString !== "postgresql://build:build@localhost:5432/build"
  ) {
    const client = postgres(connectionString, {
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    });
    db = drizzlePostgres(client, { schema: postgresSchema });
    console.log("✅ Using PostgreSQL database");
  } else {
    console.log("⚠️  PostgreSQL connection string not configured");
    db = {} as any;
  }
} else {
  const dbHost = process.env.DB_HOST || "localhost";
  const dbPort = parseInt(process.env.DB_PORT || "3306");
  const dbUser = process.env.DB_USER || "root";
  const dbPassword = process.env.DB_PASSWORD || "12345678Haha";
  const dbName = process.env.DB_NAME || "sate_jip_db";
  if (dbHost && dbName && dbPassword) {
    try {
      const connection = mysql.createPool({
        host: dbHost,
        port: dbPort,
        user: dbUser,
        password: dbPassword,
        database: dbName,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
      });

      db = drizzleMysql(connection, { schema: mysqlSchema, mode: "default" });
      console.log("✅ Using MySQL database");
    } catch (error) {
      console.error("❌ Failed to initialize MySQL:", error);
      db = {} as any;
    }
  } else {
    console.log("⚠️  MySQL configuration incomplete");
    db = {} as any;
  }
}

export { db };
export default db;
