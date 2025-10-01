import { NextResponse } from "next/server";
import { db } from "@/lib/db/connection";
import { locations } from "@/lib/db/schema";
import { count, eq } from "drizzle-orm";

export async function GET() {
  try {
    const internetSpeed = await db
      .select({
        internetSpeed: locations.internetSpeed,
        count: count(),
      })
      .from(locations)
      .where(eq(locations.status, "active"))
      .groupBy(locations.internetSpeed)
      .orderBy(count());

    return NextResponse.json({ internetSpeed });
  } catch (error) {
    console.error("Error fetching internet speed distribution:", error);
    return NextResponse.json(
      { error: "Failed to fetch internet speed distribution" },
      { status: 500 }
    );
  }
}
