import db from "@/lib/db/connection";
import { eventCalendar } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  opdName: z.string().min(1, "OPD Name is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  color: z.string().default("#3b82f6"),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Missing id parameter" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validated = eventSchema.parse(body);

    const updateData: any = {};
    if (validated.title) updateData.title = validated.title;
    if (validated.description !== undefined)
      updateData.description = validated.description;
    if (validated.opdName) updateData.opdName = validated.opdName;
    if (validated.startDate)
      updateData.startDate = new Date(validated.startDate);
    if (validated.endDate) updateData.endDate = new Date(validated.endDate);
    if (validated.color) updateData.color = validated.color;

    await db
      .update(eventCalendar)
      .set(updateData)
      .where(eq(eventCalendar.id, id));

    return NextResponse.json({
      success: true,
      message: "Success editing event",
    });
  } catch (error) {
    console.error("Error editing event: ", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Missing id parameter" },
        { status: 400 }
      );
    }

    console.log("Attempting to delete event with ID:", id);

    // First, check if the record exists
    const existingEvent = await db
      .select()
      .from(eventCalendar)
      .where(eq(eventCalendar.id, id))
      .limit(1);

    console.log("Existing event found:", existingEvent);

    if (existingEvent.length === 0) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Perform the delete
    const deleteResult = await db
      .delete(eventCalendar)
      .where(eq(eventCalendar.id, id));

    console.log("Delete executed, result:", deleteResult);

    return NextResponse.json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting event: ", error);

    // Return more detailed error info
    return NextResponse.json(
      {
        error: "Failed to delete event",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await params;

//     if (!id) {
//       return NextResponse.json(
//         { error: "Missing id parameter" },
//         { status: 400 }
//       );
//     }

//     await db.delete(eventCalendar).where(eq(eventCalendar.id, id));

//     return NextResponse.json({
//       success: true,
//       message: "Event deleted successfully",
//     });
//   } catch (error) {
//     console.error("Error deleting event: ", error);
//     return NextResponse.json(
//       { error: "Failed to delete event" },
//       { status: 500 }
//     );
//   }
// }
