import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/connection";
import { tickets, ticketReplies, ticketAttachments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { sendEmail } from "@/lib/email";
import { ticketStatusChangedEmail } from "@/lib/email/templates";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const ticketId = (await params).id;

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

    const replies = await db
      .select()
      .from(ticketReplies)
      .where(eq(ticketReplies.ticketId, ticketId))
      .orderBy(ticketReplies.createdAt);

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
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const ticketId = (await params).id;
    const body = await request.json();

    const currentTicket = await db
      .select()
      .from(tickets)
      .where(eq(tickets.id, ticketId))
      .limit(1);

    if (currentTicket.length === 0) {
      return NextResponse.json(
        { success: false, error: "Ticket not found" },
        { status: 404 },
      );
    }

    const updateData: any = {};
    const oldStatus = currentTicket[0].status;

    if (body.status) updateData.status = body.status;
    if (body.priority) updateData.priority = body.priority;
    if (body.assignedTo !== undefined) updateData.assignedTo = body.assignedTo;
    if (body.categoryId !== undefined) updateData.categoryId = body.categoryId;

    if (body.status === "resolved" && !updateData.resolvedAt) {
      updateData.resolvedAt = new Date();
    }
    if (body.status === "closed" && !updateData.closedAt) {
      updateData.closedAt = new Date();
    }

    await db.update(tickets).set(updateData).where(eq(tickets.id, ticketId));

    if (body.status && body.status !== oldStatus) {
      const emailResult = await sendEmail({
        to: currentTicket[0].email,
        subject: `Ticket Status Updated - #${currentTicket[0].ticketNumber}`,
        html: ticketStatusChangedEmail({
          ticketNumber: currentTicket[0].ticketNumber,
          subject: currentTicket[0].subject,
          customerName: currentTicket[0].submittedBy,
          oldStatus: oldStatus,
          newStatus: body.status,
        }),
      });

      if (!emailResult.success) {
        console.error("Failed to send status change email:", emailResult.error);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Ticket updated successfully",
    });
  } catch (error) {
    console.error("Error updating ticket:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update ticket" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const ticketId = (await params).id;

    await db.delete(ticketReplies).where(eq(ticketReplies.ticketId, ticketId));
    await db
      .delete(ticketAttachments)
      .where(eq(ticketAttachments.ticketId, ticketId));
    await db.delete(tickets).where(eq(tickets.id, ticketId));

    return NextResponse.json({
      success: true,
      message: "Ticket deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete ticket" },
      { status: 500 },
    );
  }
}
