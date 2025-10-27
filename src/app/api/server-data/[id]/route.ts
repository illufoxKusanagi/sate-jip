import db from "@/lib/db/connection";
import { serverData } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "Missing id parameter" },
        { status: 400 }
      );
    }

    const data = await request.json();
    const updatedServerData = {
      rackName: data.rackName,
      unitPosition: data.unitPosition,
      unitSize: data.unitSize,
      serverName: data.serverName,
      brand: data.brand,
      assetNumber: data.assetNumber,
      serialNumber: data.serialNumber,
      ipAddress: data.ipAddress,
      status: data.status,
      specification: data.specification,
      installedApps: data.installedApps,
      notes: data.notes,
    };

    await db
      .update(serverData)
      .set(updatedServerData)
      .where(eq(serverData.id, id));

    return NextResponse.json({
      message: "Server data updated successfully",
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
  try {
    const { id } = await params;
    await db.delete(serverData).where(eq(serverData.id, id));

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
