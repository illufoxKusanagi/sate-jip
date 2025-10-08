import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/connection";
import { admins } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const { id } = params;

    const updatedAdmin = {
      nama: data.nama,
      nip: data.nip,
      jabatan: data.jabatan,
      instansi: data.instansi,
      whatsapp: data.whatsapp,
    };

    const result = await db
      .update(admins)
      .set(updatedAdmin)
      .where(eq(admins.id, id));

    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (error) {
    console.error("Error updating admin:", error);
    return NextResponse.json(
      { error: "Failed to update admin" },
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

    const result = await db.delete(admins).where(eq(admins.id, id));

    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (error) {
    console.error("Error deleting admin:", error);
    return NextResponse.json(
      { error: "Failed to delete admin" },
      { status: 500 }
    );
  }
}
