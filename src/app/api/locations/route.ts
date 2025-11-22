import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/connection";
import { locations } from "@/lib/db/schema";
import { verifyApiToken } from "@/lib/auth/verify-api-token";
import { z } from "zod";

const createLocationSchema = z.object({
  locationName: z.string().min(1).max(255),
  activationDate: z.string().min(1),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  opdPengampu: z.string().min(1).max(255),
  opdType: z.enum(["OPD Utama", "OPD Pendukung", "Publik", "Non OPD"]),
  ispName: z.string().min(1).max(255),
  internetSpeed: z.number().positive(),
  internetRatio: z.string().min(1).max(50),
  internetInfrastructure: z.enum(["KABEL", "WIRELESS"]),
  jip: z.enum(["checked", "unchecked"]),
  dropPoint: z.string().max(255).optional(),
  eCat: z.string().max(255).optional(),
  status: z.enum(["active", "inactive", "maintenance"]),
});

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
  const { authenticated, user } = await verifyApiToken(request);
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await request.json();
    const validatedData = createLocationSchema.parse(data);
    const newLocation = {
      locationName: validatedData.locationName,
      activationDate: validatedData.activationDate,
      latitude: validatedData.latitude?.toString(),
      longitude: validatedData.longitude?.toString(),
      opdPengampu: validatedData.opdPengampu,
      opdType: validatedData.opdType as
        | "OPD Utama"
        | "OPD Pendukung"
        | "Publik"
        | "Non OPD",
      ispName: validatedData.ispName,
      internetSpeed: validatedData.internetSpeed.toString(),
      internetRatio: validatedData.internetRatio,
      internetInfrastructure: validatedData.internetInfrastructure as
        | "KABEL"
        | "WIRELESS",
      jip: validatedData.jip as "checked" | "unchecked",
      dropPoint: validatedData.dropPoint || "",
      eCat: validatedData.eCat,
      status: "active" as "active" | "inactive" | "maintenance",
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
