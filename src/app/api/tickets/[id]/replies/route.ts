import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/connection";
import { ticketReplies, tickets } from "@/lib/db/schema";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { sendEmail } from "@/lib/email";
import { ticketReplyEmail } from "@/lib/email/templates";

const replySchema = z.object({
  message: z.string().min(1, "Message is required"),
  authorId: z.string(),
  authorName: z.string(),
  authorEmail: z.email(),
  isStaffReply: z.boolean().default(false),
  isInternal: z.boolean().default(false),
});

// POST /api/tickets/[id]/replies - Add reply
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const ticketId = (await params).id;
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
        { status: 404 },
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
    if (validatedData.isStaffReply && ticket[0].status === "menunggu_jawaban") {
      await db
        .update(tickets)
        .set({ status: "dalam_progress" })
        .where(eq(tickets.id, ticketId));
    }

    // Update firstResponseAt if this is first staff reply
    if (validatedData.isStaffReply && !ticket[0].firstResponseAt) {
      await db
        .update(tickets)
        .set({ firstResponseAt: new Date() })
        .where(eq(tickets.id, ticketId));
    }

    // Send email notification to customer if not internal reply
    if (!validatedData.isInternal && validatedData.isStaffReply) {
      const emailResult = await sendEmail({
        to: ticket[0].email,
        subject: `New Reply on Ticket #${ticket[0].ticketNumber}`,
        html: ticketReplyEmail({
          ticketNumber: ticket[0].ticketNumber,
          subject: ticket[0].subject,
          customerName: ticket[0].submittedBy,
          replyMessage: validatedData.message,
          staffName: validatedData.authorName,
        }),
      });

      if (!emailResult.success) {
        console.error(
          "Failed to send reply notification email:",
          emailResult.error,
        );
        // Don't fail the request if email fails, just log it
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: newReply,
        message: "Reply added successfully",
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

    console.error("Error adding reply:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add reply" },
      { status: 500 },
    );
  }
}
