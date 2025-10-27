import { NextResponse } from "next/server";
import { db } from "@/lib/db/connection";
import { ticketCategories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const categories = await db
      .select()
      .from(ticketCategories)
      .where(eq(ticketCategories.isActive, true))
      .orderBy(ticketCategories.sortOrder);

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}
