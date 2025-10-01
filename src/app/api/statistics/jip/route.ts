import { NextResponse } from "next/server";
import { db } from "@/lib/db/connection";
import { locations } from "@/lib/db/schema";
import { count, eq } from "drizzle-orm";

export async function GET() {
  try {
    const jipStatusDistribution = await db
      .select({
        jipStatus: locations.jip,
        count: count(),
      })
      .from(locations)
      .where(eq(locations.status, "active"))
      .groupBy(locations.jip)
      .orderBy(count());

    return NextResponse.json({ jipStatusDistribution });
  } catch (error) {
    console.error("Error fetching JIP status distribution:", error);
    return NextResponse.json(
      { error: "Failed to fetch JIP status distribution" },
      { status: 500 }
    );
  }
}
