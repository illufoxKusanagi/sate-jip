import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/connection";
import { locations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const { id } = params;

    const updatedLocation = {
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
    };

    const result = await db
      .update(locations)
      .set(updatedLocation)
      .where(eq(locations.id, id));

    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (error) {
    console.error("Error updating location:", error);
    return NextResponse.json(
      { error: "Failed to update location" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const result = await db.delete(locations).where(eq(locations.id, id));

    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (error) {
    console.error("Error deleting location:", error);
    return NextResponse.json(
      { error: "Failed to delete location" },
      { status: 500 }
    );
  }
}
