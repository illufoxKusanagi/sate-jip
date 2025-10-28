import { defineConfig } from "drizzle-kit";

const DB_TYPE = process.env.DB_TYPE || "mysql";

const config =
  DB_TYPE === "postgres"
    ? defineConfig({
        dialect: "postgresql",
        schema: "./src/lib/db/schema.postgres.ts",
        out: "./drizzle/postgres",
        dbCredentials: {
          url: process.env.DATABASE_URL!,
        },
      })
    : defineConfig({
        dialect: "mysql",
        schema: "./src/lib/db/schema.mysql.ts",
        out: "./drizzle/mysql",
        dbCredentials: {
          host: process.env.DB_HOST || "localhost",
          port: parseInt(process.env.DB_PORT || "3306"),
          user: process.env.DB_USER || "root",
          password: process.env.DB_PASSWORD || "12345678Haha",
          database: process.env.DB_NAME || "sate_jip_db",
        },
      });

export default config;
