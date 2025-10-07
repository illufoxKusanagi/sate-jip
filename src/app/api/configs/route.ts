import { NextResponse } from "next/server";
import { db } from "@/lib/db/connection";
import { dataConfig } from "@/lib/db/schema";

export async function GET() {
  try {
    console.log("GET /api/configs - Fetching configurations...");
    const configs = await db.select().from(dataConfig);
    console.log("GET /api/configs - Found", configs.length, "configurations");
    return NextResponse.json(configs);
  } catch (error) {
    console.error("GET /api/configs - Error fetching configs:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    return NextResponse.json(
      {
        error: "Failed to fetch configurations",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log("POST /api/configs - Creating new configuration...");
    const body = await request.json();
    console.log("POST /api/configs - Request body:", body);

    const { dataType, dataConfig: config } = body;

    if (!dataType || !config) {
      console.error("POST /api/configs - Missing required fields:", {
        dataType,
        config,
      });
      return NextResponse.json(
        {
          error:
            "Missing required fields: dataType and dataConfig are required",
        },
        { status: 400 }
      );
    }

    console.log("POST /api/configs - Inserting to database...");
    const newConfig = await db.insert(dataConfig).values({
      dataType,
      dataConfig: config,
    });

    console.log(
      "POST /api/configs - Configuration created successfully:",
      newConfig
    );
    return NextResponse.json(
      { message: "Configuration created successfully", id: newConfig },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/configs - Error creating config:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    return NextResponse.json(
      {
        error: "Failed to create configuration",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
