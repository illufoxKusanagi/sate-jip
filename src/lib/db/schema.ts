import {
  mysqlTable,
  varchar,
  decimal,
  mysqlEnum,
  timestamp,
  json,
} from "drizzle-orm/mysql-core";
import { v4 as uuidv4 } from "uuid";
export const locations = mysqlTable("locations", {
  id: varchar("id", { length: 50 })
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  locationName: varchar("location_name", { length: 255 }).notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  opdPengampu: varchar("opd_pengampu", { length: 255 }).notNull(),
  opdType: mysqlEnum("opd_type", [
    "OPD Utama",
    "OPD Pendukung",
    "Publik",
    "Non OPD",
  ]).notNull(),
  ispName: varchar("isp_name", { length: 100 }).notNull(),
  internetSpeed: varchar("internet_speed", { length: 50 }).notNull(),
  internetRatio: varchar("internet_ratio", { length: 50 }).notNull(),
  internetInfrastructure: mysqlEnum("internet_infrastructure", [
    "KABEL",
    "WIRELESS",
  ]).notNull(),
  jip: mysqlEnum("jip", ["checked", "unchecked"]).default("unchecked"),
  dropPoint: varchar("drop_point", { length: 100 }),
  eCat: varchar("e_cat", { length: 255 }),
  status: mysqlEnum("status", ["active", "inactive", "maintenance"]).default(
    "active"
  ),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const admins = mysqlTable("admins", {
  id: varchar("id", { length: 50 })
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  nama: varchar("nama", { length: 255 }).notNull(),
  nip: varchar("nip", { length: 100 }),
  jabatan: varchar("jabatan", { length: 255 }).notNull(),
  instansi: varchar("instansi", { length: 255 }).notNull(),
  whatsapp: varchar("whatsapp", { length: 20 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const users = mysqlTable("users", {
  id: varchar("id", { length: 50 })
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const dataConfig = mysqlTable("answer_config", {
  id: varchar("id", { length: 50 })
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  dataType: varchar("data_type", { length: 50 }).notNull(),
  dataConfig: json("data_config").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const activityCalendar = mysqlTable("activity_calendar", {
  id: varchar("id", { length: 50 })
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  title: varchar("title", { length: 255 }).notNull(),
  opdName: varchar("opd_name", { length: 100 }).notNull(),
  description: varchar("description", { length: 255 }),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  color: varchar("color", { length: 20 }).default("#3b82f6"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Export types
export type Location = typeof locations.$inferSelect;
export type NewLocation = typeof locations.$inferInsert;
export type Admin = typeof admins.$inferSelect;
export type NewAdmin = typeof admins.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type AnswerConfig = typeof dataConfig.$inferSelect;
export type NewAnswerConfig = typeof dataConfig.$inferInsert;
export type CalendarEvent = typeof activityCalendar.$inferSelect;
export type NewCalendarEvent = typeof activityCalendar.$inferInsert;
