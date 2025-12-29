import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/connection";
import { admins } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { verifyApiToken } from "@/lib/auth/verify-api-token";
import { z } from "zod";

const createAdminSchema = z.object({
  fullName: z.string().min(1).max(255),
  idNumber: z.string().min(1).max(50),
  position: z.string().min(1).max(255),
  opdName: z.string().min(1).max(255),
  whatsappNumber: z.string().regex(/^\+?[0-9]{10,15}$/),
});

export async function GET(request: NextRequest) {
  const { authenticated, user } = await verifyApiToken(request);
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const allAdmins = await db.select().from(admins).orderBy(asc(admins.nama));

    return NextResponse.json(allAdmins);
  } catch (error) {
    console.error("Error fetching admins:", error);
    return NextResponse.json(
      { error: "Failed to fetch admins" },
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
    const validatedData = createAdminSchema.parse(data);
    const newAdmin = {
      nama: validatedData.fullName || "",
      nip: validatedData.idNumber || "",
      jabatan: validatedData.position || "",
      instansi: validatedData.opdName || "",
      whatsapp: data.whatsappNumber || "",
    };

    const result = await db.insert(admins).values(newAdmin);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error creating admin:", error);
    return NextResponse.json(
      { error: "Failed to create admin" },
      { status: 500 }
    );
  }
}
