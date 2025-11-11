# Native Ticketing System - Complete Implementation Guide

## 📚 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Overview](#project-overview)
3. [Phase 1: MVP (Weeks 1-3)](#phase-1-mvp-weeks-1-3)
4. [Phase 2: Enhanced Features (Weeks 4-6)](#phase-2-enhanced-features-weeks-4-6)
5. [Phase 3: Advanced Features (Weeks 7-8)](#phase-3-advanced-features-weeks-7-8)
6. [Testing Strategy](#testing-strategy)
7. [Deployment Guide](#deployment-guide)
8. [Maintenance & Monitoring](#maintenance--monitoring)

---

## Prerequisites

### Technical Requirements

#### Already Installed ✅
- ✅ Node.js 18+ (You have this)
- ✅ MySQL 8.0+ (You have this)
- ✅ Next.js 15 (You have this)
- ✅ Drizzle ORM (You have this)
- ✅ shadcn/ui components (You have this)
- ✅ React Hook Form + Zod (You have this)
- ✅ TanStack Table (You have this)

#### Need to Install 📦
```bash
# File upload support
npm install uploadthing @uploadthing/react

# Rich text editor
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-image

# Email notifications
npm install nodemailer resend
npm install -D @types/nodemailer

# Date utilities
npm install date-fns

# Charts for analytics (optional)
npm install recharts

# Real-time updates (optional - Phase 3)
npm install pusher pusher-js

# PDF generation (optional - Phase 3)
npm install jspdf html2canvas
```

### Environment Variables

Add to your `.env.local`:

```bash
# Existing variables...

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=support@yourdomain.com

# File Upload (UploadThing)
UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id

# Alternative: Resend for emails
RESEND_API_KEY=your_resend_api_key

# Pusher (Real-time - Optional)
NEXT_PUBLIC_PUSHER_KEY=your_pusher_key
PUSHER_SECRET=your_pusher_secret
NEXT_PUBLIC_PUSHER_CLUSTER=your_cluster

# Ticket Configuration
NEXT_PUBLIC_TICKET_PREFIX=TKT
TICKETS_PER_PAGE=20
```

### Team Skills Required

- ✅ TypeScript/JavaScript
- ✅ React/Next.js
- ✅ Database design (SQL)
- ✅ REST API development
- 🔄 Email integration (will learn)
- 🔄 File handling (will learn)

### Time Allocation

**Full Team (2-3 developers):**
- MVP: 1-2 weeks
- Full System: 4-6 weeks

**Solo Developer:**
- MVP: 2-3 weeks
- Full System: 6-8 weeks

---

## Project Overview

### What We're Building

A complete help desk/ticketing system with:
- 🎫 Public ticket submission
- 📋 Admin ticket management
- 💬 Reply/conversation system
- 📎 File attachments
- 📧 Email notifications
- 📊 Analytics dashboard
- 🔍 Search and filtering
- 📚 Knowledge base (optional)

### Architecture

```
┌─────────────────────────────────────────────┐
│           Next.js Application               │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────────┐      ┌─────────────────┐ │
│  │   Public     │      │   Admin Panel   │ │
│  │   Ticket     │      │   - Manage      │ │
│  │   Form       │      │   - Replies     │ │
│  │              │      │   - Analytics   │ │
│  └──────────────┘      └─────────────────┘ │
│                                             │
│  ┌─────────────────────────────────────────┤
│  │         API Routes (/api/tickets)       │
│  ├─────────────────────────────────────────┤
│  │         Drizzle ORM (Database)          │
│  └─────────────────────────────────────────┘
│                                             │
│  ┌─────────────────────────────────────────┤
│  │      External Services (Optional)        │
│  │  - UploadThing (Files)                  │
│  │  - Resend/Nodemailer (Email)            │
│  │  - Pusher (Real-time)                   │
│  └─────────────────────────────────────────┘
│                                             │
└─────────────────────────────────────────────┘
                    ↓
            ┌───────────────┐
            │  MySQL DB     │
            │  - tickets    │
            │  - replies    │
            │  - categories │
            └───────────────┘
```

---

## Phase 1: MVP (Weeks 1-3)

### Week 1: Database & API Foundation

#### Day 1-2: Database Schema

**Step 1: Create Schema File**

Create `src/lib/db/schema/tickets.ts`:

```typescript
import { mysqlTable, varchar, text, timestamp, int, boolean, mysqlEnum } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

// Ticket Categories
export const ticketCategories = mysqlTable("ticket_categories", {
  id: varchar("id", { length: 50 }).primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  color: varchar("color", { length: 7 }).default("#3b82f6"), // hex color
  icon: varchar("icon", { length: 50 }), // lucide icon name
  sortOrder: int("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Main Tickets Table
export const tickets = mysqlTable("tickets", {
  id: varchar("id", { length: 50 }).primaryKey(),
  ticketNumber: varchar("ticket_number", { length: 20 }).notNull().unique(),

  // Content
  subject: varchar("subject", { length: 255 }).notNull(),
  description: text("description").notNull(),

  // Submitter Information
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
  assignedTo: varchar("assigned_to", { length: 50 }), // admin user ID

  // Metadata
  source: varchar("source", { length: 50 }).default("web"), // web, email, api
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  firstResponseAt: timestamp("first_response_at"),
  resolvedAt: timestamp("resolved_at"),
  closedAt: timestamp("closed_at"),
});

// Ticket Replies
export const ticketReplies = mysqlTable("ticket_replies", {
  id: varchar("id", { length: 50 }).primaryKey(),
  ticketId: varchar("ticket_id", { length: 50 }).notNull(),

  // Content
  message: text("message").notNull(),
  messageHtml: text("message_html"), // rich text HTML

  // Author
  authorId: varchar("author_id", { length: 50 }).notNull(),
  authorName: varchar("author_name", { length: 100 }).notNull(),
  authorEmail: varchar("author_email", { length: 255 }).notNull(),
  isStaffReply: boolean("is_staff_reply").default(false),

  // Metadata
  isInternal: boolean("is_internal").default(false), // internal notes vs customer-visible
  ipAddress: varchar("ip_address", { length: 45 }),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// File Attachments
export const ticketAttachments = mysqlTable("ticket_attachments", {
  id: varchar("id", { length: 50 }).primaryKey(),
  ticketId: varchar("ticket_id", { length: 50 }).notNull(),
  replyId: varchar("reply_id", { length: 50 }), // null if attached to main ticket

  // File Info
  fileName: varchar("file_name", { length: 255 }).notNull(),
  originalName: varchar("original_name", { length: 255 }).notNull(),
  fileUrl: varchar("file_url", { length: 500 }).notNull(),
  fileSize: int("file_size").notNull(), // bytes
  mimeType: varchar("mime_type", { length: 100 }).notNull(),

  // Upload Info
  uploadedBy: varchar("uploaded_by", { length: 50 }).notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

// Relations
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

**Step 2: Generate Migration**

```bash
# Generate migration
npm run db:generate

# Apply migration
npm run db:push
```

**Step 3: Seed Categories**

Create `scripts/seed-ticket-categories.ts`:

```typescript
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

  console.log("✅ Categories seeded successfully!");
}

seed().catch(console.error);
```

Run seed:
```bash
npx tsx scripts/seed-ticket-categories.ts
```

#### Day 3-4: API Routes

**Step 1: Create Ticket API**

Create `src/app/api/tickets/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tickets, ticketCategories } from "@/lib/db/schema/tickets";
import { nanoid } from "nanoid";
import { eq, desc, and, like, or } from "drizzle-orm";
import { z } from "zod";

// Validation schema
const createTicketSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  description: z.string().min(20, "Please provide more details"),
  email: z.string().email("Invalid email address"),
  submittedBy: z.string().min(2, "Name is required"),
  phone: z.string().optional(),
  categoryId: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
});

// GET /api/tickets - List all tickets
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const categoryId = searchParams.get("categoryId");
    const assignedTo = searchParams.get("assignedTo");

    let query = db
      .select()
      .from(tickets)
      .leftJoin(ticketCategories, eq(tickets.categoryId, ticketCategories.id))
      .orderBy(desc(tickets.createdAt));

    // Apply filters
    const conditions = [];
    if (status) conditions.push(eq(tickets.status, status as any));
    if (categoryId) conditions.push(eq(tickets.categoryId, categoryId));
    if (assignedTo) conditions.push(eq(tickets.assignedTo, assignedTo));
    if (search) {
      conditions.push(
        or(
          like(tickets.subject, `%${search}%`),
          like(tickets.ticketNumber, `%${search}%`),
          like(tickets.email, `%${search}%`)
        )
      );
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const result = await query;

    return NextResponse.json({
      success: true,
      data: result,
      count: result.length,
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tickets" },
      { status: 500 }
    );
  }
}

// POST /api/tickets - Create new ticket
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = createTicketSchema.parse(body);

    // Generate ticket number
    const ticketNumber = await generateTicketNumber();

    // Get client IP and user agent
    const ipAddress = request.headers.get("x-forwarded-for") ||
                     request.headers.get("x-real-ip") ||
                     "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Create ticket
    const newTicket = {
      id: nanoid(),
      ticketNumber,
      subject: validatedData.subject,
      description: validatedData.description,
      email: validatedData.email,
      submittedBy: validatedData.submittedBy,
      phone: validatedData.phone,
      categoryId: validatedData.categoryId,
      priority: validatedData.priority,
      status: "open" as const,
      source: "web",
      ipAddress,
      userAgent,
    };

    await db.insert(tickets).values(newTicket);

    // TODO: Send email notification

    return NextResponse.json({
      success: true,
      data: newTicket,
      message: "Ticket created successfully",
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating ticket:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create ticket" },
      { status: 500 }
    );
  }
}

// Helper function to generate unique ticket number
async function generateTicketNumber(): Promise<string> {
  const prefix = process.env.NEXT_PUBLIC_TICKET_PREFIX || "TKT";
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");

  // Get count of tickets created today
  const startOfDay = new Date(date.setHours(0, 0, 0, 0));
  const endOfDay = new Date(date.setHours(23, 59, 59, 999));

  const todayTickets = await db
    .select()
    .from(tickets)
    .where(
      and(
        gte(tickets.createdAt, startOfDay),
        lte(tickets.createdAt, endOfDay)
      )
    );

  const sequence = (todayTickets.length + 1).toString().padStart(4, "0");

  return `${prefix}-${year}${month}-${sequence}`;
}
```

**Step 2: Single Ticket API**

Create `src/app/api/tickets/[id]/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tickets, ticketReplies, ticketAttachments } from "@/lib/db/schema/tickets";
import { eq } from "drizzle-orm";
import { z } from "zod";

// GET /api/tickets/[id] - Get single ticket with replies
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ticketId = params.id;

    // Get ticket
    const ticket = await db
      .select()
      .from(tickets)
      .where(eq(tickets.id, ticketId))
      .limit(1);

    if (ticket.length === 0) {
      return NextResponse.json(
        { success: false, error: "Ticket not found" },
        { status: 404 }
      );
    }

    // Get replies
    const replies = await db
      .select()
      .from(ticketReplies)
      .where(eq(ticketReplies.ticketId, ticketId))
      .orderBy(ticketReplies.createdAt);

    // Get attachments
    const attachments = await db
      .select()
      .from(ticketAttachments)
      .where(eq(ticketAttachments.ticketId, ticketId));

    return NextResponse.json({
      success: true,
      data: {
        ...ticket[0],
        replies,
        attachments,
      },
    });
  } catch (error) {
    console.error("Error fetching ticket:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch ticket" },
      { status: 500 }
    );
  }
}

// PUT /api/tickets/[id] - Update ticket
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ticketId = params.id;
    const body = await request.json();

    const updateData: any = {};

    if (body.status) updateData.status = body.status;
    if (body.priority) updateData.priority = body.priority;
    if (body.assignedTo !== undefined) updateData.assignedTo = body.assignedTo;
    if (body.categoryId !== undefined) updateData.categoryId = body.categoryId;

    // Handle status-specific timestamps
    if (body.status === "resolved" && !updateData.resolvedAt) {
      updateData.resolvedAt = new Date();
    }
    if (body.status === "closed" && !updateData.closedAt) {
      updateData.closedAt = new Date();
    }

    await db
      .update(tickets)
      .set(updateData)
      .where(eq(tickets.id, ticketId));

    return NextResponse.json({
      success: true,
      message: "Ticket updated successfully",
    });
  } catch (error) {
    console.error("Error updating ticket:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update ticket" },
      { status: 500 }
    );
  }
}

// DELETE /api/tickets/[id] - Delete ticket
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ticketId = params.id;

    // Delete replies first (foreign key)
    await db.delete(ticketReplies).where(eq(ticketReplies.ticketId, ticketId));

    // Delete attachments
    await db.delete(ticketAttachments).where(eq(ticketAttachments.ticketId, ticketId));

    // Delete ticket
    await db.delete(tickets).where(eq(tickets.id, ticketId));

    return NextResponse.json({
      success: true,
      message: "Ticket deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete ticket" },
      { status: 500 }
    );
  }
}
```

**Step 3: Replies API**

Create `src/app/api/tickets/[id]/replies/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ticketReplies, tickets } from "@/lib/db/schema/tickets";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { z } from "zod";

const replySchema = z.object({
  message: z.string().min(1, "Message is required"),
  authorId: z.string(),
  authorName: z.string(),
  authorEmail: z.string().email(),
  isStaffReply: z.boolean().default(false),
  isInternal: z.boolean().default(false),
});

// POST /api/tickets/[id]/replies - Add reply
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ticketId = params.id;
    const body = await request.json();

    const validatedData = replySchema.parse(body);

    // Check if ticket exists
    const ticket = await db
      .select()
      .from(tickets)
      .where(eq(tickets.id, ticketId))
      .limit(1);

    if (ticket.length === 0) {
      return NextResponse.json(
        { success: false, error: "Ticket not found" },
        { status: 404 }
      );
    }

    // Get IP address
    const ipAddress = request.headers.get("x-forwarded-for") || "unknown";

    // Create reply
    const newReply = {
      id: nanoid(),
      ticketId,
      message: validatedData.message,
      authorId: validatedData.authorId,
      authorName: validatedData.authorName,
      authorEmail: validatedData.authorEmail,
      isStaffReply: validatedData.isStaffReply,
      isInternal: validatedData.isInternal,
      ipAddress,
    };

    await db.insert(ticketReplies).values(newReply);

    // Update ticket status if needed
    if (validatedData.isStaffReply && ticket[0].status === "waiting_response") {
      await db
        .update(tickets)
        .set({ status: "in_progress" })
        .where(eq(tickets.id, ticketId));
    }

    // Update firstResponseAt if this is first staff reply
    if (validatedData.isStaffReply && !ticket[0].firstResponseAt) {
      await db
        .update(tickets)
        .set({ firstResponseAt: new Date() })
        .where(eq(tickets.id, ticketId));
    }

    // TODO: Send email notification

    return NextResponse.json({
      success: true,
      data: newReply,
      message: "Reply added successfully",
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      );
    }

    console.error("Error adding reply:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add reply" },
      { status: 500 }
    );
  }
}
```

#### Day 5: Public Ticket Submission Form

**Step 1: Create Ticket Form Component**

Create `src/components/tickets/ticket-form.tsx`:

```typescript
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  description: z.string().min(20, "Please provide more details (min 20 characters)"),
  email: z.string().email("Invalid email address"),
  submittedBy: z.string().min(2, "Name is required"),
  phone: z.string().optional(),
  categoryId: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
});

interface Category {
  id: string;
  name: string;
  description: string;
}

export function TicketForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [ticketNumber, setTicketNumber] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      description: "",
      email: "",
      submittedBy: "",
      phone: "",
      priority: "medium",
    },
  });

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/tickets/categories");
        const result = await response.json();
        if (result.success) {
          setCategories(result.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchCategories();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit ticket");
      }

      toast.success(`Ticket #${result.data.ticketNumber} created successfully!`);
      setTicketNumber(result.data.ticketNumber);
      form.reset();
    } catch (error: any) {
      toast.error(error.message || "Failed to submit ticket");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (ticketNumber) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="rounded-lg border-2 border-green-500 bg-green-50 dark:bg-green-950 p-8">
          <h2 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-4">
            Ticket Submitted Successfully!
          </h2>
          <p className="text-lg mb-4">
            Your ticket number is:
            <span className="font-mono font-bold text-xl ml-2">
              {ticketNumber}
            </span>
          </p>
          <p className="text-muted-foreground mb-6">
            We've sent a confirmation email to your address.
            You can track your ticket status using the ticket number above.
          </p>
          <Button onClick={() => setTicketNumber(null)}>
            Submit Another Ticket
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="heading-1 mb-2">Submit Support Ticket</h1>
      <p className="text-muted-foreground mb-6">
        Please provide as much detail as possible to help us assist you quickly.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="submittedBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="+62 812 3456 7890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">🟢 Low - General inquiry</SelectItem>
                    <SelectItem value="medium">🟡 Medium - Normal issue</SelectItem>
                    <SelectItem value="high">🟠 High - Important issue</SelectItem>
                    <SelectItem value="urgent">🔴 Urgent - Critical issue</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  How urgent is your issue?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Brief description of your issue"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Please describe your issue in detail..."
                    rows={8}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Minimum 20 characters. Include any error messages or steps to reproduce.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting} size="lg">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Submitting..." : "Submit Ticket"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
```

**Step 2: Create Public Ticket Page**

Create `src/app/tickets/page.tsx`:

```typescript
import { PageStructure } from "@/components/layout/page-structure";
import { TicketForm } from "@/components/tickets/ticket-form";

export const metadata = {
  title: "Submit Support Ticket",
  description: "Submit a support ticket to our help desk team",
};

export default function SubmitTicketPage() {
  return (
    <PageStructure>
      <TicketForm />
    </PageStructure>
  );
}
```

**🎉 Checkpoint: You now have a working ticket submission system!**

---

### Week 2: Admin Dashboard & Management

#### Day 6-7: Admin Tickets List & Filters

**Step 1: Create Tickets Table Component**

Create `src/components/tickets/tickets-table.tsx`:

```typescript
"use client";

import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDistanceToNow } from "date-fns";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

// Priority badge colors
const priorityColors = {
  low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  urgent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

// Status badge colors
const statusColors = {
  open: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  in_progress: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  waiting_response: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  resolved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  closed: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
};

export type Ticket = {
  id: string;
  ticketNumber: string;
  subject: string;
  submittedBy: string;
  email: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "waiting_response" | "resolved" | "closed";
  categoryId?: string;
  createdAt: Date;
};

interface TicketsTableProps {
  data: Ticket[];
  onRowClick?: (ticket: Ticket) => void;
}

export function TicketsTable({ data, onRowClick }: TicketsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const columns: ColumnDef<Ticket>[] = [
    {
      accessorKey: "ticketNumber",
      header: "Ticket #",
      cell: ({ row }) => (
        <span className="font-mono font-semibold">
          {row.getValue("ticketNumber")}
        </span>
      ),
    },
    {
      accessorKey: "subject",
      header: "Subject",
      cell: ({ row }) => (
        <div className="max-w-[300px] truncate">{row.getValue("subject")}</div>
      ),
    },
    {
      accessorKey: "submittedBy",
      header: "Customer",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.getValue("submittedBy")}</div>
          <div className="text-sm text-muted-foreground">{row.original.email}</div>
        </div>
      ),
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => {
        const priority = row.getValue("priority") as string;
        return (
          <Badge className={priorityColors[priority as keyof typeof priorityColors]}>
            {priority.toUpperCase()}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge className={statusColors[status as keyof typeof statusColors]}>
            {status.replace("_", " ").toUpperCase()}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as Date;
        return (
          <span className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(date), { addSuffix: true })}
          </span>
        );
      },
    },
  ];

  // Apply filters
  const filteredData = data.filter((ticket) => {
    if (statusFilter !== "all" && ticket.status !== statusFilter) return false;
    if (priorityFilter !== "all" && ticket.priority !== priorityFilter) return false;
    return true;
  });

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tickets..."
            value={(table.getColumn("subject")?.getFilterValue() as string) ?? ""}
            onChange={(e) =>
              table.getColumn("subject")?.setFilterValue(e.target.value)
            }
            className="pl-9"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="waiting_response">Waiting Response</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => onRowClick?.(row.original)}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No tickets found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            filteredData.length
          )}{" "}
          of {filteredData.length} tickets
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Create Admin Tickets Page**

Create `src/app/help-desk/page.tsx`:

```typescript
"use client";

import { useEffect, useState } from "react";
import { PageStructure } from "@/components/layout/page-structure";
import { TicketsTable, Ticket } from "@/components/tickets/tickets-table";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCcw } from "lucide-react";
import { toast } from "sonner";

export default function HelpDeskPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchTickets() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/tickets");
      const result = await response.json();

      if (result.success) {
        setTickets(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch tickets");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleRowClick = (ticket: Ticket) => {
    // Navigate to ticket detail page
    window.location.href = `/help-desk/${ticket.id}`;
  };

  return (
    <PageStructure>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="heading-1">Help Desk</h1>
            <p className="text-muted-foreground">
              Manage customer support tickets
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={fetchTickets}
              disabled={isLoading}
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => (window.location.href = "/tickets")}>
              <Plus className="h-4 w-4 mr-2" />
              New Ticket
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <TicketsTable data={tickets} onRowClick={handleRowClick} />
        )}
      </div>
    </PageStructure>
  );
}
```

#### Day 8-9: Ticket Detail View & Reply System

**Step 1: Create Ticket Detail Component**

Create `src/components/tickets/ticket-detail.tsx`:

```typescript
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow, format } from "date-fns";
import {
  Clock,
  Mail,
  Phone,
  User,
  Tag,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  Send,
} from "lucide-react";
import { toast } from "sonner";

interface Reply {
  id: string;
  message: string;
  authorName: string;
  authorEmail: string;
  isStaffReply: boolean;
  isInternal: boolean;
  createdAt: Date;
}

interface TicketDetailProps {
  ticket: {
    id: string;
    ticketNumber: string;
    subject: string;
    description: string;
    submittedBy: string;
    email: string;
    phone?: string;
    priority: string;
    status: string;
    createdAt: Date;
    replies?: Reply[];
  };
  onUpdate?: () => void;
}

export function TicketDetail({ ticket, onUpdate }: TicketDetailProps) {
  const [replyMessage, setReplyMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInternal, setIsInternal] = useState(false);
  const [newStatus, setNewStatus] = useState(ticket.status);
  const [newPriority, setNewPriority] = useState(ticket.priority);

  async function handleReply() {
    if (!replyMessage.trim()) {
      toast.error("Please enter a reply message");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/tickets/${ticket.id}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: replyMessage,
          authorId: "admin-1", // TODO: Get from auth context
          authorName: "Support Agent", // TODO: Get from auth context
          authorEmail: "support@company.com", // TODO: Get from auth context
          isStaffReply: true,
          isInternal,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to add reply");
      }

      toast.success("Reply added successfully");
      setReplyMessage("");
      setIsInternal(false);
      onUpdate?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to add reply");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdateTicket() {
    try {
      const response = await fetch(`/api/tickets/${ticket.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          priority: newPriority,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update ticket");
      }

      toast.success("Ticket updated successfully");
      onUpdate?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to update ticket");
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">
                {ticket.subject}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Ticket #{ticket.ticketNumber}
              </p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline">{ticket.priority}</Badge>
              <Badge>{ticket.status.replace("_", " ")}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Customer:</span>
              <span>{ticket.submittedBy}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Email:</span>
              <span>{ticket.email}</span>
            </div>
            {ticket.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Phone:</span>
                <span>{ticket.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Created:</span>
              <span>
                {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {ticket.description}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Update Ticket</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="waiting_response">Waiting Response</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={newPriority} onValueChange={setNewPriority}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleUpdateTicket}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Update
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Conversation ({ticket.replies?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {ticket.replies && ticket.replies.length > 0 ? (
            ticket.replies.map((reply) => (
              <div
                key={reply.id}
                className={`flex gap-3 p-4 rounded-lg ${
                  reply.isStaffReply
                    ? "bg-blue-50 dark:bg-blue-950"
                    : "bg-gray-50 dark:bg-gray-900"
                }`}
              >
                <Avatar>
                  <AvatarFallback>
                    {reply.authorName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{reply.authorName}</span>
                    {reply.isStaffReply && (
                      <Badge variant="outline" className="text-xs">
                        Staff
                      </Badge>
                    )}
                    {reply.isInternal && (
                      <Badge variant="secondary" className="text-xs">
                        Internal Note
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground ml-auto">
                      {format(new Date(reply.createdAt), "PPp")}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{reply.message}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No replies yet
            </p>
          )}

          <Separator />

          <div className="space-y-3">
            <Textarea
              placeholder="Type your reply..."
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              rows={4}
            />
            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={isInternal}
                  onChange={(e) => setIsInternal(e.target.checked)}
                  className="rounded"
                />
                <span>Internal note (not visible to customer)</span>
              </label>
              <Button onClick={handleReply} disabled={isSubmitting}>
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Reply
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

**Step 2: Create Ticket Detail Page**

Create `src/app/help-desk/[id]/page.tsx`:

```typescript
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageStructure } from "@/components/layout/page-structure";
import { TicketDetail } from "@/components/tickets/ticket-detail";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id as string;

  const [ticket, setTicket] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchTicket() {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/tickets/${ticketId}`);
      const result = await response.json();

      if (result.success) {
        setTicket(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch ticket");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  if (isLoading) {
    return (
      <PageStructure>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </PageStructure>
    );
  }

  if (!ticket) {
    return (
      <PageStructure>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Ticket Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The ticket you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.push("/help-desk")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tickets
          </Button>
        </div>
      </PageStructure>
    );
  }

  return (
    <PageStructure>
      <div className="space-y-4">
        <Button
          variant="ghost"
          onClick={() => router.push("/help-desk")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tickets
        </Button>

        <TicketDetail ticket={ticket} onUpdate={fetchTicket} />
      </div>
    </PageStructure>
  );
}
```

**🎉 Checkpoint: Admin can now view and respond to tickets!**

---

### Week 3: Email Notifications & File Attachments

#### Day 10-11: Email Integration

**Step 1: Create Email Utility**

Create `src/lib/utils/email.ts`:

```typescript
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM || "support@yourdomain.com",
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Email error:", error);
      return { success: false, error };
    }

    console.log("Email sent successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
}

// Email templates
export function ticketCreatedEmail(ticketNumber: string, subject: string, customerName: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .ticket-number { font-size: 24px; font-weight: bold; color: #3b82f6; }
          .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Support Ticket Created</h1>
          </div>
          <div class="content">
            <p>Hi ${customerName},</p>
            <p>Thank you for contacting us. Your support ticket has been successfully created.</p>
            <p><strong>Ticket Number:</strong> <span class="ticket-number">${ticketNumber}</span></p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p>Our support team will review your request and respond as soon as possible. You can track the status of your ticket using the ticket number above.</p>
            <p>If you have any additional information to add, please reply to this email.</p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply directly to this email.</p>
            <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function ticketReplyEmail(
  ticketNumber: string,
  subject: string,
  customerName: string,
  replyMessage: string,
  staffName: string
) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .reply-box { background: white; padding: 15px; border-left: 4px solid #10b981; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Reply on Your Ticket</h1>
          </div>
          <div class="content">
            <p>Hi ${customerName},</p>
            <p>Your support ticket <strong>#${ticketNumber}</strong> has a new reply from our team.</p>
            <div class="reply-box">
              <p><strong>${staffName} wrote:</strong></p>
              <p>${replyMessage.replace(/\n/g, "<br>")}</p>
            </div>
            <p>If you have any questions or need further assistance, feel free to reply to this email.</p>
          </div>
          <div class="footer">
            <p>Ticket #${ticketNumber} - ${subject}</p>
            <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function ticketStatusChangedEmail(
  ticketNumber: string,
  subject: string,
  customerName: string,
  oldStatus: string,
  newStatus: string
) {
  const statusColors: Record<string, string> = {
    open: "#3b82f6",
    in_progress: "#8b5cf6",
    resolved: "#10b981",
    closed: "#6b7280",
  };

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: ${statusColors[newStatus] || "#3b82f6"}; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .status-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-weight: bold; }
          .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Ticket Status Updated</h1>
          </div>
          <div class="content">
            <p>Hi ${customerName},</p>
            <p>The status of your support ticket <strong>#${ticketNumber}</strong> has been updated.</p>
            <p>
              <span class="status-badge" style="background: #ef4444; color: white;">${oldStatus.toUpperCase()}</span>
              →
              <span class="status-badge" style="background: ${statusColors[newStatus]}; color: white;">${newStatus.toUpperCase()}</span>
            </p>
            <p><strong>Subject:</strong> ${subject}</p>
            ${newStatus === "resolved" ? "<p>If your issue has been resolved, you can close this ticket. If you need further assistance, please let us know.</p>" : ""}
            ${newStatus === "closed" ? "<p>This ticket has been closed. If you have any additional questions, feel free to submit a new ticket.</p>" : ""}
          </div>
          <div class="footer">
            <p>Ticket #${ticketNumber}</p>
            <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
```

**Step 2: Update API Routes to Send Emails**

Update `src/app/api/tickets/route.ts` POST handler:

```typescript
// After creating ticket, add:
await sendEmail({
  to: validatedData.email,
  subject: `Ticket #${ticketNumber} Created - ${validatedData.subject}`,
  html: ticketCreatedEmail(ticketNumber, validatedData.subject, validatedData.submittedBy),
});
```

Update `src/app/api/tickets/[id]/replies/route.ts` POST handler:

```typescript
// After creating reply, add:
if (!validatedData.isInternal) {
  await sendEmail({
    to: ticket[0].email,
    subject: `Re: Ticket #${ticket[0].ticketNumber} - ${ticket[0].subject}`,
    html: ticketReplyEmail(
      ticket[0].ticketNumber,
      ticket[0].subject,
      ticket[0].submittedBy,
      validatedData.message,
      validatedData.authorName
    ),
  });
}
```

#### Day 12-13: File Upload Integration

**Step 1: Configure UploadThing**

Create `src/app/api/uploadthing/core.ts`:

```typescript
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  ticketAttachment: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
    pdf: { maxFileSize: "8MB", maxFileCount: 3 },
    text: { maxFileSize: "2MB", maxFileCount: 5 },
  })
    .middleware(async ({ req }) => {
      // Add authentication check here if needed
      return { userId: "user-id" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete:", file.url);
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
```

Create `src/app/api/uploadthing/route.ts`:

```typescript
import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
```

**Step 2: Create File Upload Component**

Create `src/components/tickets/file-upload.tsx`:

```typescript
"use client";

import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { toast } from "sonner";
import { X, FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  files: Array<{ name: string; url: string; size: number }>;
  onFilesChange: (files: Array<{ name: string; url: string; size: number }>) => void;
  maxFiles?: number;
}

export function FileUpload({ files, onFilesChange, maxFiles = 5 }: FileUploadProps) {
  const handleRemove = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="space-y-4">
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-muted rounded-lg"
            >
              <div className="flex items-center gap-2">
                <FileIcon className="h-4 w-4" />
                <span className="text-sm">{file.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({formatFileSize(file.size)})
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {files.length < maxFiles && (
        <UploadButton<OurFileRouter, "ticketAttachment">
          endpoint="ticketAttachment"
          onClientUploadComplete={(res) => {
            if (res) {
              const newFiles = res.map((file) => ({
                name: file.name,
                url: file.url,
                size: file.size,
              }));
              onFilesChange([...files, ...newFiles]);
              toast.success("Files uploaded successfully");
            }
          }}
          onUploadError={(error: Error) => {
            toast.error(`Upload failed: ${error.message}`);
          }}
        />
      )}

      <p className="text-xs text-muted-foreground">
        Upload up to {maxFiles} files. Supported: Images (4MB), PDF (8MB), Text files (2MB)
      </p>
    </div>
  );
}
```

**🎉 Phase 1 Complete! You now have a functional MVP ticketing system.**

---

## Phase 2: Enhanced Features (Weeks 4-6)

### Week 4: Advanced Filtering & Assignment

#### Categories API

Create `src/app/api/tickets/categories/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ticketCategories } from "@/lib/db/schema/tickets";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const categories = await db
      .select()
      .from(ticketCategories)
      .where(eq(ticketCategories.isActive, true))
      .orderBy(ticketCategories.sortOrder);

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
```

### Week 5: Rich Text Editor Integration

Install TipTap:

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-link
```

Create rich text editor component at `src/components/tickets/rich-text-editor.tsx` and integrate into reply system.

### Week 6: Email Templates & Auto-responders

Create customizable email templates system with variables support.

---

## Phase 3: Advanced Features (Weeks 7-8)

### Week 7: Analytics Dashboard

Create analytics page showing:
- Tickets by status (pie chart)
- Tickets over time (line chart)
- Average response time
- Resolution rate
- Top categories

### Week 8: Knowledge Base (Optional)

Create a simple knowledge base system with articles to help reduce ticket volume.

---

## Testing Strategy

### Unit Tests

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

Test API routes, components, and utilities.

### Integration Tests

Test complete workflows:
- Submit ticket → Receive email
- Admin reply → Customer receives notification
- Status change → Email sent

---

## Deployment Guide

### Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Email service configured
- [ ] File upload service configured
- [ ] Error monitoring setup (Sentry)
- [ ] Rate limiting implemented
- [ ] CORS configured
- [ ] Authentication secured

### Deploy to Vercel

```bash
vercel --prod
```

---

## Maintenance & Monitoring

### Regular Tasks

1. **Weekly:**
   - Review ticket metrics
   - Check email delivery rates
   - Monitor response times

2. **Monthly:**
   - Database cleanup (old closed tickets)
   - Performance optimization
   - Security updates

3. **Quarterly:**
   - User feedback review
   - Feature prioritization
   - Capacity planning

---

**🎉 Congratulations! You've built a complete ticketing system!**
