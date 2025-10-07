import { NextResponse } from "next/server";
import { db } from "@/lib/db/connection";
import { dataConfig } from "@/lib/db/schema";

export async function GET() {
  try {
    const configs = await db.select().from(dataConfig);
    return NextResponse.json(configs);
  } catch (error) {
    console.error("Error fetching configs:", error);
    return NextResponse.json(
      { error: "Failed to fetch configurations" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { dataType, dataConfig: config } = body;

    if (!dataType || !config) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newConfig = await db.insert(dataConfig).values({
      dataType,
      dataConfig: config,
    });

    return NextResponse.json(
      { message: "Configuration created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating config:", error);
    return NextResponse.json(
      { error: "Failed to create configuration" },
      { status: 500 }
    );
  }
}
