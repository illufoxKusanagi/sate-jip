import { relations } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { nanoid } from "nanoid";
import {
  boolean,
  timestamp,
  decimal,
  integer,
  json,
  pgEnum,
  pgTable,
  text,
  varchar,
} from "drizzle-orm/pg-core";

export const opdTypeEnum = pgEnum("opd_type", [
  "OPD Utama",
  "OPD Pendukung",
  "Publik",
  "Non OPD",
]);

export const internetInfrastructureEnum = pgEnum("internet_infrastructure", [
  "KABEL",
  "WIRELESS",
]);

export const jipEnum = pgEnum("jip", ["checked", "unchecked"]);

export const locationStatusEnum = pgEnum("location_status", [
  "active",
  "inactive",
  "maintenance",
]);

export const userRoleEnum = pgEnum("user_role", ["admin", "user"]);

export const serverStatusEnum = pgEnum("server_status", [
  "online",
  "offline",
  "maintenance",
  "standby",
]);

export const ticketPriorityEnum = pgEnum("ticket_priority", [
  "rendah",
  "sedang",
  "tinggi",
  "urgent",
]);

export const ticketStatusEnum = pgEnum("ticket_status", [
  "terbuka",
  "dalam_progress",
  "menunggu_jawaban",
  "selesai",
  "ditutup",
]);

export const locations = pgTable("locations", {
  id: varchar("id", { length: 50 })
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  locationName: varchar("location_name", { length: 255 }).notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),

  activationDate: varchar("activation_date", { length: 10 }),
  opdPengampu: varchar("opd_pengampu", { length: 255 }).notNull(),
  opdType: opdTypeEnum("opd_type").notNull(),

  ispName: varchar("isp_name", { length: 100 }).notNull(),
  internetSpeed: varchar("internet_speed", { length: 50 }).notNull(),
  internetRatio: varchar("internet_ratio", { length: 50 }).notNull(),
  internetInfrastructure: internetInfrastructureEnum(
    "internet_infrastructure",
  ).notNull(),
  jip: jipEnum("jip").default("unchecked").notNull(),

  dropPoint: varchar("drop_point", { length: 100 }),
  eCat: varchar("e_cat", { length: 255 }),
  status: locationStatusEnum("status").default("active").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const admins = pgTable("admins", {
  id: varchar("id", { length: 50 })
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  nama: varchar("nama", { length: 255 }).notNull(),
  nip: varchar("nip", { length: 100 }),
  jabatan: varchar("jabatan", { length: 255 }).notNull(),
  instansi: varchar("instansi", { length: 255 }).notNull(),
  whatsapp: varchar("whatsapp", { length: 20 }).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: varchar("id", { length: 50 })
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: userRoleEnum("role").default("user").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const dataConfig = pgTable("answer_config", {
  id: varchar("id", { length: 50 })
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  dataType: varchar("data_type", { length: 50 }).notNull(),
  dataConfig: json("data_config").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const eventCalendar = pgTable("activity_calendar", {
  id: varchar("id", { length: 50 })
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  title: varchar("title", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),

  opdName: varchar("opd_name", { length: 100 }).notNull(),
  color: varchar("color", { length: 20 }).default("#3b82f6"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const serverData = pgTable("server_data", {
  id: varchar("id", { length: 50 })
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  serverName: varchar("server_name", { length: 255 }).notNull(),
  unitPosition: integer("unit_position").notNull(),
  unitSize: integer("unit_size").notNull(),
  brand: varchar("brand", { length: 50 }).notNull(),

  rackName: varchar("rack_name", { length: 50 }).notNull(),
  assetNumber: varchar("asset_number", { length: 50 }).notNull(),
  serialNumber: varchar("serial_number", { length: 50 }),
  ipAddress: varchar("ip_address", { length: 50 }),

  status: serverStatusEnum("status").default("offline").notNull(),
  specification: json("specification"),
  installedApps: json("installed_apps").$type<string[]>(),

  notes: varchar("notes", { length: 255 }),
});

export const ticketCategories = pgTable("ticket_categories", {
  id: varchar("id", { length: 50 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),

  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),

  color: varchar("color", { length: 7 }).default("#3b82f6"),
  icon: varchar("icon", { length: 50 }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const tickets = pgTable("tickets", {
  id: varchar("id", { length: 50 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  ticketNumber: varchar("ticket_number", { length: 20 }).notNull().unique(),

  subject: varchar("subject", { length: 255 }).notNull(),
  description: text("description").notNull(),

  submittedBy: varchar("submitted_by", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),

  categoryId: varchar("category_id", { length: 50 })
    .references(() => ticketCategories.id)
    .notNull(),
  priority: ticketPriorityEnum("priority").default("sedang").notNull(),
  status: ticketStatusEnum("status").default("terbuka").notNull(),

  assignedTo: varchar("assigned_to", { length: 50 }),

  source: varchar("source", { length: 50 }).default("web"),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),

  firstResponseAt: timestamp("first_response_at"),
  resolvedAt: timestamp("resolved_at"),
  closedAt: timestamp("closed_at"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const ticketReplies = pgTable("ticket_replies", {
  id: varchar("id", { length: 50 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  ticketId: varchar("ticket_id", { length: 50 })
    .references(() => tickets.id)
    .notNull(),

  message: text("message").notNull(),
  messageHtml: text("message_html"),

  authorId: varchar("author_id", { length: 50 }).notNull(),
  authorName: varchar("author_name", { length: 100 }).notNull(),
  authorEmail: varchar("author_email", { length: 255 }).notNull(),
  isStaffReply: boolean("is_staff_reply").default(false),

  isInternal: boolean("is_internal").default(false),
  ipAddress: varchar("ip_address", { length: 45 }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const ticketAttachments = pgTable("ticket_attachments", {
  id: varchar("id", { length: 50 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  ticketId: varchar("ticket_id", { length: 50 })
    .references(() => tickets.id)
    .notNull(),
  replyId: varchar("reply_id", { length: 50 }).references(
    () => ticketReplies.id,
  ),

  fileName: varchar("file_name", { length: 255 }).notNull(),
  originalName: varchar("original_name", { length: 255 }).notNull(),
  fileUrl: varchar("file_url", { length: 500 }).notNull(),
  fileSize: integer("file_size").notNull(),
  mimeType: varchar("mime_type", { length: 100 }).notNull(),

  uploadedBy: varchar("uploaded_by", { length: 50 }).notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

export const ticketCategoriesRelations = relations(
  ticketCategories,
  ({ many }) => ({
    tickets: many(tickets),
  }),
);

export const ticketsRelations = relations(tickets, ({ one, many }) => ({
  category: one(ticketCategories, {
    fields: [tickets.categoryId],
    references: [ticketCategories.id],
  }),
  replies: many(ticketReplies),
  attachments: many(ticketAttachments),
}));

export const ticketRepliesRelations = relations(
  ticketReplies,
  ({ one, many }) => ({
    ticket: one(tickets, {
      fields: [ticketReplies.ticketId],
      references: [tickets.id],
    }),
    attachments: many(ticketAttachments),
  }),
);

export const ticketAttachmentsRelations = relations(
  ticketAttachments,
  ({ one }) => ({
    ticket: one(tickets, {
      fields: [ticketAttachments.ticketId],
      references: [tickets.id],
    }),
    reply: one(ticketReplies, {
      fields: [ticketAttachments.replyId],
      references: [ticketReplies.id],
    }),
  }),
);

export type Location = typeof locations.$inferSelect;
export type NewLocation = typeof locations.$inferInsert;
export type Admin = typeof admins.$inferSelect;
export type NewAdmin = typeof admins.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type AnswerConfig = typeof dataConfig.$inferSelect;
export type NewAnswerConfig = typeof dataConfig.$inferInsert;
export type CalendarEvent = typeof eventCalendar.$inferSelect;
export type NewCalendarEvent = typeof eventCalendar.$inferInsert;
export type ServerData = typeof serverData.$inferSelect;
export type NewServerData = typeof serverData.$inferInsert;
export type Tickets = typeof tickets.$inferSelect;
export type NewTickets = typeof tickets.$inferInsert;
export type TicketCategories = typeof ticketCategories.$inferSelect;
export type NewTicketCategories = typeof ticketCategories.$inferInsert;
export type TicketReplies = typeof ticketReplies.$inferSelect;
export type NewTicketReplies = typeof ticketReplies.$inferInsert;
export type TicketAttachments = typeof ticketAttachments.$inferSelect;
export type NewTicketAttachments = typeof ticketAttachments.$inferInsert;
