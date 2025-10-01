import { NextResponse } from "next/server";
import { db } from "@/lib/db/connection";
import { locations } from "@/lib/db/schema";
import { count, eq } from "drizzle-orm";

export async function GET() {
  try {
    const infrastructureDistribution = await db
      .select({
        internetInfra: locations.internetInfrastructure,
        count: count(),
      })
      .from(locations)
      .where(eq(locations.status, "active"))
      .groupBy(locations.internetInfrastructure)
      .orderBy(count());

    return NextResponse.json({ infrastructureDistribution });
  } catch (error) {
    console.error("Error fetching infrastructure distribution:", error);
    return NextResponse.json(
      { error: "Failed to fetch infrastructure distribution" },
      { status: 500 }
    );
  }
}
