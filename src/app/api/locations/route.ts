import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/connection";
import { locations } from "@/lib/db/schema";

export async function GET() {
  try {
    const allLocations = await db
      .select()
      .from(locations)
      .orderBy(locations.createdAt);

    return NextResponse.json(allLocations);
  } catch (error) {
    console.error("Error fetching locations:", error);
    return NextResponse.json(
      { error: "Failed to fetch locations" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const newLocation = {
      locationName: data.locationName,
      latitude: data.latitude,
      longitude: data.longitude,
      opdPengampu: data.opdPengampu,
      opdType: data.opdType,
      ispName: data.ispName,
      internetSpeed: data.internetSpeed,
      internetRatio: data.internetRatio,
      internetInfrastructure: data.internetInfrastructure,
      jip: data.jip || "unchecked",
      dropPoint: data.dropPoint || "",
      eCat: data.eCat,
      status: "active",
    };

    const result = await db.insert(locations).values(newLocation);

    return NextResponse.json({ success: true, result }, { status: 201 });
  } catch (error) {
    console.error("Error creating location:", error);
    return NextResponse.json(
      { error: "Failed to create location" },
      { status: 500 }
    );
  }
}
