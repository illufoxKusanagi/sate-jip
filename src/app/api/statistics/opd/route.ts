import { NextResponse } from "next/server";
import { db } from "@/lib/db/connection";
import { locations } from "@/lib/db/schema";
import { count, eq } from "drizzle-orm";

export async function GET() {
  try {
    const opdTypeDistribution = await db
      .select({
        opdType: locations.opdType,
        count: count(),
      })
      .from(locations)
      .where(eq(locations.status, "active"))
      .groupBy(locations.opdType)
      .orderBy(count());

    return NextResponse.json({ opdTypeDistribution });
  } catch (error) {
    console.error("Error fetching OPD type distribution:", error);
    return NextResponse.json(
      { error: "Failed to fetch OPD type distribution" },
      { status: 500 }
    );
  }
}
