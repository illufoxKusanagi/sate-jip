import { NextRequest, NextResponse } from "next/server";
import { eq, desc, and, like, or, lte, gte } from "drizzle-orm";
import { z } from "zod";
import db from "@/lib/db/connection";
import { tickets } from "@/lib/db/schema";
import { sendEmail } from "@/lib/email";
import { ticketCreatedEmail } from "@/lib/email/templates";

const createTicketSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  description: z.string().min(20, "Please provide more details"),
  email: z.email("Invalid email address"),
  submittedBy: z.string().min(2, "Name is required"),
  phone: z.string().optional(),
  categoryId: z.string(),
  priority: z.enum(["rendah", "sedang", "tinggi", "urgent"]).default("sedang"),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const categoryId = searchParams.get("categoryId");
    const assignedTo = searchParams.get("assignedTo");
    const priority = searchParams.get("priority");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    let query;

    query = db.select().from(tickets).orderBy(desc(tickets.createdAt));
    const conditions = [];
    if (status && status !== "all") {
      conditions.push(eq(tickets.status, status as any));
    }
    if (priority && priority !== "all") {
      conditions.push(eq(tickets.priority, priority as any));
    }
    if (categoryId) {
      conditions.push(eq(tickets.categoryId, categoryId));
    }
    if (assignedTo) {
      conditions.push(eq(tickets.assignedTo, assignedTo));
    }
    if (search) {
      conditions.push(
        or(
          like(tickets.subject, `%${search}%`),
          like(tickets.ticketNumber, `%${search}%`),
          like(tickets.email, `%${search}%`),
        ),
      );
    }

    if (dateFrom) {
      conditions.push(gte(tickets.createdAt, new Date(dateFrom)));
    }

    if (dateTo) {
      conditions.push(lte(tickets.createdAt, new Date(dateTo)));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    query = query.limit(100);
    const result = await query;

    return NextResponse.json({
      success: true,
      data: result,
      count: result?.length,
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tickets" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createTicketSchema.parse(body);
    const ticketNumber = await generateTicketNumber();
    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    const newTicket = {
      ticketNumber,
      subject: validatedData.subject,
      description: validatedData.description,
      email: validatedData.email,
      submittedBy: validatedData.submittedBy,
      phone: validatedData.phone,
      categoryId: validatedData.categoryId,
      priority: validatedData.priority,
      status: "terbuka" as const,
      source: "web" as const,
      ipAddress,
      userAgent,
    };

    await db.insert(tickets).values(newTicket);

    const fullTicket = await db
      .select()
      .from(tickets)
      .where(eq(tickets.ticketNumber, ticketNumber))
      .limit(1);

    const emailResult = await sendEmail({
      to: validatedData.email,
      subject: `Ticket #${ticketNumber} Created - ${validatedData.subject}`,
      html: ticketCreatedEmail({
        ticketNumber,
        subject: validatedData.subject,
        customerName: validatedData.submittedBy,
      }),
    });

    if (!emailResult.success) {
      console.error("Failed to send ticket creation email:", emailResult.error);
    }

    return NextResponse.json(
      {
        success: true,
        data: fullTicket,
        message: "Ticket created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error },
        { status: 400 },
      );
    }

    console.error("Error creating ticket:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create ticket" },
      { status: 500 },
    );
  }
}

async function generateTicketNumber(): Promise<string> {
  const prefix = process.env.NEXT_PUBLIC_TICKET_PREFIX || "TKT";
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const startOfDay = new Date(date.setHours(0, 0, 0, 0));
  const endOfDay = new Date(date.setHours(23, 59, 59, 999));

  const todayTickets = await db
    .select()
    .from(tickets)
    .where(
      and(gte(tickets.createdAt, startOfDay), lte(tickets.createdAt, endOfDay)),
    );

  const sequence = (todayTickets.length + 1).toString().padStart(4, "0");

  return `${prefix}-${year}${month}${day}-${sequence}`;
}
