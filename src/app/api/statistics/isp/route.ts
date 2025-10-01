import { NextResponse } from "next/server";
import { db } from "@/lib/db/connection";
import { locations } from "@/lib/db/schema";
import { count, eq } from "drizzle-orm";

export async function GET() {
  try {
    const ispDistributions = await db
      .select({
        ispName: locations.ispName,
        count: count(),
      })
      .from(locations)
      .where(eq(locations.status, "active"))
      .groupBy(locations.ispName)
      .orderBy(count());

    return NextResponse.json({ ispDistributions });
  } catch (error) {
    console.error("Error fetching ISP distribution:", error);
    return NextResponse.json(
      { error: "Failed to fetch ISP distribution" },
      { status: 500 }
    );
  }
}
