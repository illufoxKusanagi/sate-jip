# Ticketing System - Complete Database Schema

## 📊 Schema Overview

The ticketing system uses **4 main tables** with foreign key relationships:

```
ticketCategories (1) ──────┐
                          ├──> tickets (1) ──┬──> ticketReplies (N)
                          │                  │
                          │                  └──> ticketAttachments (N)
                          │
ticketReplies (1) ─────────┴──> ticketAttachments (N)
```

---

## 🗃️ Table Definitions

### 1. `ticket_categories`

**Purpose:** Organize tickets by type (Technical Support, Billing, etc.)

**Columns:**

| Column        | Type         | Constraints       | Description                 |
| ------------- | ------------ | ----------------- | --------------------------- |
| `id`          | VARCHAR(50)  | PRIMARY KEY       | Unique category ID (nanoid) |
| `name`        | VARCHAR(100) | NOT NULL          | Category display name       |
| `description` | TEXT         | NULL              | Detailed description        |
| `color`       | VARCHAR(7)   | DEFAULT '#3b82f6' | Hex color for UI (#RRGGBB)  |
| `icon`        | VARCHAR(50)  | NULL              | Lucide icon name            |
| `sort_order`  | INT          | DEFAULT 0         | Display order (ASC)         |
| `is_active`   | BOOLEAN      | DEFAULT TRUE      | Enable/disable category     |
| `created_at`  | TIMESTAMP    | DEFAULT NOW()     | Creation timestamp          |
| `updated_at`  | TIMESTAMP    | ON UPDATE NOW()   | Last update timestamp       |

**Drizzle Schema:**

```typescript
export const ticketCategories = mysqlTable("ticket_categories", {
  id: varchar("id", { length: 50 }).primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  color: varchar("color", { length: 7 }).default("#3b82f6"),
  icon: varchar("icon", { length: 50 }),
  sortOrder: int("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});
```

**Indexes:**

```sql
CREATE INDEX idx_categories_active ON ticket_categories(is_active);
CREATE INDEX idx_categories_sort ON ticket_categories(sort_order);
```

**Sample Data:**

```typescript
{
  id: "cat-1",
  name: "Technical Support",
  description: "Hardware, software, or system issues",
  color: "#3b82f6",
  icon: "Wrench",
  sortOrder: 1,
  isActive: true
}
```

---

### 2. `tickets`

**Purpose:** Main ticket records with submitter info, content, and status

**Columns:**

| Column              | Type         | Constraints      | Description                                       |
| ------------------- | ------------ | ---------------- | ------------------------------------------------- |
| `id`                | VARCHAR(50)  | PRIMARY KEY      | Unique ticket ID (nanoid)                         |
| `ticket_number`     | VARCHAR(20)  | UNIQUE, NOT NULL | Human-readable ID (TKT-2412-0001)                 |
| **Content**         |
| `subject`           | VARCHAR(255) | NOT NULL         | Brief description                                 |
| `description`       | TEXT         | NOT NULL         | Full problem description                          |
| **Submitter**       |
| `submitted_by`      | VARCHAR(100) | NOT NULL         | Customer name                                     |
| `email`             | VARCHAR(255) | NOT NULL         | Contact email                                     |
| `phone`             | VARCHAR(20)  | NULL             | Optional phone                                    |
| **Classification**  |
| `category_id`       | VARCHAR(50)  | FOREIGN KEY      | Link to category                                  |
| `priority`          | ENUM         | NOT NULL         | low/medium/high/urgent                            |
| `status`            | ENUM         | NOT NULL         | open/in_progress/waiting_response/resolved/closed |
| **Assignment**      |
| `assigned_to`       | VARCHAR(50)  | NULL             | Admin user ID                                     |
| **Metadata**        |
| `source`            | VARCHAR(50)  | DEFAULT 'web'    | web/email/api                                     |
| `ip_address`        | VARCHAR(45)  | NULL             | IPv4/IPv6 address                                 |
| `user_agent`        | TEXT         | NULL             | Browser info                                      |
| **Timestamps**      |
| `created_at`        | TIMESTAMP    | DEFAULT NOW()    | Submission time                                   |
| `updated_at`        | TIMESTAMP    | ON UPDATE NOW()  | Last modification                                 |
| `first_response_at` | TIMESTAMP    | NULL             | First staff reply time                            |
| `resolved_at`       | TIMESTAMP    | NULL             | Resolution time                                   |
| `closed_at`         | TIMESTAMP    | NULL             | Closure time                                      |

**Drizzle Schema:**

```typescript
export const tickets = mysqlTable("tickets", {
  id: varchar("id", { length: 50 }).primaryKey(),
  ticketNumber: varchar("ticket_number", { length: 20 }).notNull().unique(),
  
  // Content
  subject: varchar("subject", { length: 255 }).notNull(),
  description: text("description").notNull(),
  
  // Submitter
  submittedBy: varchar("submitted_by", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  
  // Classification
  categoryId: varchar("category_id", { length: 50 }),
  priority: mysqlEnum("priority", ["low", "medium", "high", "urgent"]).default("medium"),
  status: mysqlEnum("status", [
    "open",
    "in_progress", 
    "waiting_response",
    "resolved",
    "closed"
  ]).default("open"),
  
  // Assignment
  assignedTo: varchar("assigned_to", { length: 50 }),
  
  // Metadata
  source: varchar("source", { length: 50 }).default("web"),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  firstResponseAt: timestamp("first_response_at"),
  resolvedAt: timestamp("resolved_at"),
  closedAt: timestamp("closed_at"),
});
```

**Indexes:**

```sql
CREATE INDEX idx_tickets_number ON tickets(ticket_number);
CREATE INDEX idx_tickets_email ON tickets(email);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_priority ON tickets(priority);
CREATE INDEX idx_tickets_category ON tickets(category_id);
CREATE INDEX idx_tickets_assigned ON tickets(assigned_to);
CREATE INDEX idx_tickets_created ON tickets(created_at DESC);

-- Composite indexes for common queries
CREATE INDEX idx_tickets_status_priority ON tickets(status, priority);
CREATE INDEX idx_tickets_assigned_status ON tickets(assigned_to, status);
```

**Foreign Keys:**

```sql
ALTER TABLE tickets 
  ADD CONSTRAINT fk_tickets_category 
  FOREIGN KEY (category_id) 
  REFERENCES ticket_categories(id) 
  ON DELETE SET NULL;
```

**Sample Data:**

```typescript
{
  id: "tkt-abc123",
  ticketNumber: "TKT-2412-0001",
  subject: "Cannot access admin dashboard",
  description: "Getting 403 error when trying to access /admin page",
  submittedBy: "John Doe",
  email: "john@example.com",
  phone: "+62 812 3456 7890",
  categoryId: "cat-1",
  priority: "high",
  status: "open",
  assignedTo: null,
  source: "web",
  ipAddress: "192.168.1.100",
  userAgent: "Mozilla/5.0...",
  createdAt: new Date("2024-12-15T10:30:00"),
  updatedAt: new Date("2024-12-15T10:30:00"),
  firstResponseAt: null,
  resolvedAt: null,
  closedAt: null
}
```

---

### 3. `ticket_replies`

**Purpose:** Conversation thread between customer and staff

**Columns:**

| Column           | Type         | Constraints           | Description                             |
| ---------------- | ------------ | --------------------- | --------------------------------------- |
| `id`             | VARCHAR(50)  | PRIMARY KEY           | Unique reply ID                         |
| `ticket_id`      | VARCHAR(50)  | FOREIGN KEY, NOT NULL | Parent ticket                           |
| **Content**      |
| `message`        | TEXT         | NOT NULL              | Plain text message                      |
| `message_html`   | TEXT         | NULL                  | Rich HTML content                       |
| **Author**       |
| `author_id`      | VARCHAR(50)  | NOT NULL              | User/Admin ID                           |
| `author_name`    | VARCHAR(100) | NOT NULL              | Display name                            |
| `author_email`   | VARCHAR(255) | NOT NULL              | Contact email                           |
| `is_staff_reply` | BOOLEAN      | DEFAULT FALSE         | Staff vs customer                       |
| **Metadata**     |
| `is_internal`    | BOOLEAN      | DEFAULT FALSE         | Internal note (not visible to customer) |
| `ip_address`     | VARCHAR(45)  | NULL                  | Reply IP address                        |
| **Timestamps**   |
| `created_at`     | TIMESTAMP    | DEFAULT NOW()         | Reply time                              |
| `updated_at`     | TIMESTAMP    | ON UPDATE NOW()       | Last edit time                          |

**Drizzle Schema:**

```typescript
export const ticketReplies = mysqlTable("ticket_replies", {
  id: varchar("id", { length: 50 }).primaryKey(),
  ticketId: varchar("ticket_id", { length: 50 }).notNull(),
  
  // Content
  message: text("message").notNull(),
  messageHtml: text("message_html"),
  
  // Author
  authorId: varchar("author_id", { length: 50 }).notNull(),
  authorName: varchar("author_name", { length: 100 }).notNull(),
  authorEmail: varchar("author_email", { length: 255 }).notNull(),
  isStaffReply: boolean("is_staff_reply").default(false),
  
  // Metadata
  isInternal: boolean("is_internal").default(false),
  ipAddress: varchar("ip_address", { length: 45 }),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});
```

**Indexes:**

```sql
CREATE INDEX idx_replies_ticket ON ticket_replies(ticket_id);
CREATE INDEX idx_replies_author ON ticket_replies(author_id);
CREATE INDEX idx_replies_created ON ticket_replies(created_at);
CREATE INDEX idx_replies_staff ON ticket_replies(is_staff_reply);
```

**Foreign Keys:**

```sql
ALTER TABLE ticket_replies 
  ADD CONSTRAINT fk_replies_ticket 
  FOREIGN KEY (ticket_id) 
  REFERENCES tickets(id) 
  ON DELETE CASCADE;
```

**Sample Data:**

```typescript
{
  id: "reply-xyz789",
  ticketId: "tkt-abc123",
  message: "We are investigating this issue. Can you provide more details about when this started?",
  messageHtml: "<p>We are investigating this issue. Can you provide <strong>more details</strong> about when this started?</p>",
  authorId: "admin-1",
  authorName: "Support Agent",
  authorEmail: "support@company.com",
  isStaffReply: true,
  isInternal: false,
  ipAddress: "10.0.0.50",
  createdAt: new Date("2024-12-15T11:00:00")
}
```

---

### 4. `ticket_attachments`

**Purpose:** Store file uploads (screenshots, logs, documents)

**Columns:**

| Column          | Type         | Constraints           | Description             |
| --------------- | ------------ | --------------------- | ----------------------- |
| `id`            | VARCHAR(50)  | PRIMARY KEY           | Unique attachment ID    |
| `ticket_id`     | VARCHAR(50)  | FOREIGN KEY, NOT NULL | Parent ticket           |
| `reply_id`      | VARCHAR(50)  | FOREIGN KEY, NULL     | Parent reply (optional) |
| **File Info**   |
| `file_name`     | VARCHAR(255) | NOT NULL              | Stored filename         |
| `original_name` | VARCHAR(255) | NOT NULL              | Original filename       |
| `file_url`      | VARCHAR(500) | NOT NULL              | CDN/storage URL         |
| `file_size`     | INT          | NOT NULL              | Size in bytes           |
| `mime_type`     | VARCHAR(100) | NOT NULL              | Content type            |
| **Upload Info** |
| `uploaded_by`   | VARCHAR(50)  | NOT NULL              | Uploader user ID        |
| `uploaded_at`   | TIMESTAMP    | DEFAULT NOW()         | Upload time             |

**Drizzle Schema:**

```typescript
export const ticketAttachments = mysqlTable("ticket_attachments", {
  id: varchar("id", { length: 50 }).primaryKey(),
  ticketId: varchar("ticket_id", { length: 50 }).notNull(),
  replyId: varchar("reply_id", { length: 50 }),
  
  // File Info
  fileName: varchar("file_name", { length: 255 }).notNull(),
  originalName: varchar("original_name", { length: 255 }).notNull(),
  fileUrl: varchar("file_url", { length: 500 }).notNull(),
  fileSize: int("file_size").notNull(),
  mimeType: varchar("mime_type", { length: 100 }).notNull(),
  
  // Upload Info
  uploadedBy: varchar("uploaded_by", { length: 50 }).notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});
```

**Indexes:**

```sql
CREATE INDEX idx_attachments_ticket ON ticket_attachments(ticket_id);
CREATE INDEX idx_attachments_reply ON ticket_attachments(reply_id);
CREATE INDEX idx_attachments_uploaded ON ticket_attachments(uploaded_at);
```

**Foreign Keys:**

```sql
ALTER TABLE ticket_attachments 
  ADD CONSTRAINT fk_attachments_ticket 
  FOREIGN KEY (ticket_id) 
  REFERENCES tickets(id) 
  ON DELETE CASCADE;

ALTER TABLE ticket_attachments 
  ADD CONSTRAINT fk_attachments_reply 
  FOREIGN KEY (reply_id) 
  REFERENCES ticket_replies(id) 
  ON DELETE CASCADE;
```

**Sample Data:**

```typescript
{
  id: "att-file123",
  ticketId: "tkt-abc123",
  replyId: null,
  fileName: "1671104400000-screenshot.png",
  originalName: "error-screenshot.png",
  fileUrl: "https://utfs.io/f/abc123-screenshot.png",
  fileSize: 245678,
  mimeType: "image/png",
  uploadedBy: "john-user-id",
  uploadedAt: new Date("2024-12-15T10:35:00")
}
```

---

## 🔗 Relationships

### Drizzle Relations:

```typescript
export const ticketCategoriesRelations = relations(ticketCategories, ({ many }) => ({
  tickets: many(tickets),
}));

export const ticketsRelations = relations(tickets, ({ one, many }) => ({
  category: one(ticketCategories, {
    fields: [tickets.categoryId],
    references: [ticketCategories.id],
  }),
  replies: many(ticketReplies),
  attachments: many(ticketAttachments),
}));

export const ticketRepliesRelations = relations(ticketReplies, ({ one, many }) => ({
  ticket: one(tickets, {
    fields: [ticketReplies.ticketId],
    references: [tickets.id],
  }),
  attachments: many(ticketAttachments),
}));

export const ticketAttachmentsRelations = relations(ticketAttachments, ({ one }) => ({
  ticket: one(tickets, {
    fields: [ticketAttachments.ticketId],
    references: [tickets.id],
  }),
  reply: one(ticketReplies, {
    fields: [ticketAttachments.replyId],
    references: [ticketReplies.id],
  }),
}));
```

---

## 📝 Common Queries

### Get Ticket with Full Thread

```typescript
const ticketWithThread = await db
  .select()
  .from(tickets)
  .leftJoin(ticketCategories, eq(tickets.categoryId, ticketCategories.id))
  .leftJoin(ticketReplies, eq(ticketReplies.ticketId, tickets.id))
  .leftJoin(ticketAttachments, eq(ticketAttachments.ticketId, tickets.id))
  .where(eq(tickets.id, ticketId));
```

### Get Open Tickets by Priority

```typescript
const urgentTickets = await db
  .select()
  .from(tickets)
  .where(
    and(
      eq(tickets.status, "open"),
      eq(tickets.priority, "urgent")
    )
  )
  .orderBy(desc(tickets.createdAt));
```

### Get Tickets Assigned to Admin

```typescript
const myTickets = await db
  .select()
  .from(tickets)
  .where(
    and(
      eq(tickets.assignedTo, adminId),
      notInArray(tickets.status, ["closed", "resolved"])
    )
  );
```

### Search Tickets

```typescript
const results = await db
  .select()
  .from(tickets)
  .where(
    or(
      like(tickets.subject, `%${searchTerm}%`),
      like(tickets.ticketNumber, `%${searchTerm}%`),
      like(tickets.email, `%${searchTerm}%`)
    )
  );
```

---

## 🚀 Migration Scripts

### Complete Schema Migration

Create `drizzle/ticketing-schema.sql`:

```sql
-- Ticket Categories
CREATE TABLE IF NOT EXISTS ticket_categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#3b82f6',
  icon VARCHAR(50),
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_categories_active (is_active),
  INDEX idx_categories_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tickets
CREATE TABLE IF NOT EXISTS tickets (
  id VARCHAR(50) PRIMARY KEY,
  ticket_number VARCHAR(20) NOT NULL UNIQUE,
  subject VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  submitted_by VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  category_id VARCHAR(50),
  priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  status ENUM('open', 'in_progress', 'waiting_response', 'resolved', 'closed') DEFAULT 'open',
  assigned_to VARCHAR(50),
  source VARCHAR(50) DEFAULT 'web',
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  first_response_at TIMESTAMP NULL,
  resolved_at TIMESTAMP NULL,
  closed_at TIMESTAMP NULL,
  
  INDEX idx_tickets_number (ticket_number),
  INDEX idx_tickets_email (email),
  INDEX idx_tickets_status (status),
  INDEX idx_tickets_priority (priority),
  INDEX idx_tickets_category (category_id),
  INDEX idx_tickets_assigned (assigned_to),
  INDEX idx_tickets_created (created_at DESC),
  INDEX idx_tickets_status_priority (status, priority),
  
  FOREIGN KEY (category_id) REFERENCES ticket_categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Ticket Replies
CREATE TABLE IF NOT EXISTS ticket_replies (
  id VARCHAR(50) PRIMARY KEY,
  ticket_id VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  message_html TEXT,
  author_id VARCHAR(50) NOT NULL,
  author_name VARCHAR(100) NOT NULL,
  author_email VARCHAR(255) NOT NULL,
  is_staff_reply BOOLEAN DEFAULT FALSE,
  is_internal BOOLEAN DEFAULT FALSE,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_replies_ticket (ticket_id),
  INDEX idx_replies_author (author_id),
  INDEX idx_replies_created (created_at),
  INDEX idx_replies_staff (is_staff_reply),
  
  FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Ticket Attachments
CREATE TABLE IF NOT EXISTS ticket_attachments (
  id VARCHAR(50) PRIMARY KEY,
  ticket_id VARCHAR(50) NOT NULL,
  reply_id VARCHAR(50),
  file_name VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_url VARCHAR(500) NOT NULL,
  file_size INT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  uploaded_by VARCHAR(50) NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_attachments_ticket (ticket_id),
  INDEX idx_attachments_reply (reply_id),
  INDEX idx_attachments_uploaded (uploaded_at),
  
  FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
  FOREIGN KEY (reply_id) REFERENCES ticket_replies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Seed Categories

```typescript
// scripts/seed-ticket-categories.ts
import { db } from "@/lib/db";
import { ticketCategories } from "@/lib/db/schema/tickets";
import { nanoid } from "nanoid";

const categories = [
  {
    id: nanoid(),
    name: "Technical Support",
    description: "Hardware, software, or system issues",
    color: "#3b82f6",
    icon: "Wrench",
    sortOrder: 1,
  },
  {
    id: nanoid(),
    name: "Account Issues",
    description: "Login, password, or account access problems",
    color: "#8b5cf6",
    icon: "User",
    sortOrder: 2,
  },
  {
    id: nanoid(),
    name: "Feature Request",
    description: "Suggestions for new features",
    color: "#10b981",
    icon: "Lightbulb",
    sortOrder: 3,
  },
  {
    id: nanoid(),
    name: "Bug Report",
    description: "Report software bugs or errors",
    color: "#ef4444",
    icon: "Bug",
    sortOrder: 4,
  },
  {
    id: nanoid(),
    name: "General Inquiry",
    description: "Questions or general information",
    color: "#6b7280",
    icon: "HelpCircle",
    sortOrder: 5,
  },
];

async function seed() {
  console.log("Seeding ticket categories...");
  await db.insert(ticketCategories).values(categories);
  console.log("✅ Done!");
}

seed().catch(console.error);
```

---

## 📊 Expected Table Sizes

### Small-Medium Business (< 1000 tickets/month)
- `tickets`: ~12,000 rows/year
- `ticket_replies`: ~36,000 rows/year (avg 3 replies/ticket)
- `ticket_attachments`: ~18,000 rows/year (avg 1.5 files/ticket)
- `ticket_categories`: 5-20 rows (static)

**Storage:** ~500MB/year

### Medium-Large Business (5000 tickets/month)
- `tickets`: ~60,000 rows/year
- `ticket_replies`: ~180,000 rows/year
- `ticket_attachments`: ~90,000 rows/year

**Storage:** ~2-3GB/year

---

**✅ Schema Complete → Proceed to API Implementation**
