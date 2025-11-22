import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/connection";
import { dataConfig } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { verifyApiToken } from "@/lib/auth/verify-api-token";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { authenticated, user } = await verifyApiToken(request);
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "Missing id parameter" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { dataType, dataConfig: config } = body;

    if (!dataType || !config) {
      return NextResponse.json(
        { error: "Missing required fields: dataType, dataConfig" },
        { status: 400 }
      );
    }

    await db
      .update(dataConfig)
      .set({
        dataType,
        dataConfig: config,
      })
      .where(eq(dataConfig.id, id));

    return NextResponse.json({
      message: "Configuration updated successfully",
    });
  } catch (error) {
    console.error("Error updating config:", error);
    return NextResponse.json(
      { error: "Failed to update configuration" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { authenticated, user } = await verifyApiToken(request);
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    await db.delete(dataConfig).where(eq(dataConfig.id, id));

    return NextResponse.json({
      message: "Configuration deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting config:", error);
    return NextResponse.json(
      { error: "Failed to delete configuration" },
      { status: 500 }
    );
  }
}
