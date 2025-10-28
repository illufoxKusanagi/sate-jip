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
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const newLocation = {
      locationName: data.locationName,
      activationDate: data.activationDate,
      latitude: data.latitude?.toString(),
      longitude: data.longitude?.toString(),
      opdPengampu: data.opdPengampu,
      opdType: data.opdType as
        | "OPD Utama"
        | "OPD Pendukung"
        | "Publik"
        | "Non OPD",
      ispName: data.ispName,
      internetSpeed: data.internetSpeed.toString(),
      internetRatio: data.internetRatio,
      internetInfrastructure: data.internetInfrastructure as
        | "KABEL"
        | "WIRELESS",
      jip: (data.jip ? "checked" : "unchecked") as "checked" | "unchecked",
      dropPoint: data.dropPoint || "",
      eCat: data.eCat,
      status: "active" as "active" | "inactive" | "maintenance",
    };

    const result = await db.insert(locations).values(newLocation);

    return NextResponse.json({ success: true, result }, { status: 201 });
  } catch (error) {
    console.error("Error creating location:", error);
    return NextResponse.json(
      { error: "Failed to create location" },
      { status: 500 },
    );
  }
}
