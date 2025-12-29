import db from "@/lib/db/connection";
import { locations } from "@/lib/db/schema";
import { count } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const ispDistributions = await db
      .select({
        ispName: locations.ispName,
        count: count(),
      })
      .from(locations)
      .groupBy(locations.ispName)
      .orderBy(count());

    const infrastructureDistribution = await db
      .select({
        internetInfra: locations.internetInfrastructure,
        count: count(),
      })
      .from(locations)
      .groupBy(locations.internetInfrastructure)
      .orderBy(count());

    const internetSpeed = await db
      .select({
        internetSpeed: locations.internetSpeed,
        count: count(),
      })
      .from(locations)
      .groupBy(locations.internetSpeed)
      .orderBy(count());

    return NextResponse.json({
      ispDistributions,
      infrastructureDistribution,
      internetSpeed,
    });
  } catch (error) {
    console.error("Error fetching locations statistic: ", error);
    return NextResponse.json(
      { message: "Error fetch locations statistic, ", error },
      { status: 500 }
    );
  }
}
