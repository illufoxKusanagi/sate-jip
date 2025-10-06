import db from "@/lib/db/connection";
import { eventCalendar } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  opdName: z.string().min(1, "OPD Name is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  color: z.string().default("#3b82f6"),
});

export async function GET(request: NextRequest) {
  try {
    const events = await db.select().from(eventCalendar);
    // .groupBy(eventCalendar.opdName)
    // .orderBy(eventCalendar.startDate);

    const formattedEvents = events.map((event) => ({
      id: event.id,
      opdName: event.opdName,
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString(),
      title: event.title,
      description: event.description || "",
      color: event.color,
    }));
    return NextResponse.json(formattedEvents);
  } catch (error) {
    console.error("Error fetching events: ", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const event = await request.json();

    const validated = eventSchema.parse(event);

    const newEvent = {
      title: validated.title || "",
      opdName: validated.opdName || "",
      description: validated.description || "",
      startDate: new Date(validated.startDate),
      endDate: new Date(validated.endDate),
      color: validated.color || "",
    };

    const result = await db.insert(eventCalendar).values(newEvent);
    return NextResponse.json(
      { success: true, message: "Event created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding event: ", error);
    return NextResponse.json(
      { error: "Failed to create new event" },
      { status: 400 }
    );
  }
}
