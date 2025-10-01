import { NextResponse } from "next/server";
import { db } from "@/lib/db/connection";
import { dataConfig } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// PUT update config
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { dataType, dataConfig: config } = body;

    await db
      .update(dataConfig)
      .set({
        dataType,
        dataConfig: config,
      })
      .where(eq(dataConfig.id, params.id));

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

// DELETE config
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await db.delete(dataConfig).where(eq(dataConfig.id, params.id));

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
