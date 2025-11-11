import { db } from "@/lib/db/connection";
import { serverData } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { successResponse, errorResponse } from "@/lib/api/response";
import {
  handleApiError,
  safeParseJson,
  validateSchema,
} from "@/lib/api/errors";
import { serverSchema } from "@/lib/validations/server";
import { and, eq } from "drizzle-orm";

export async function GET() {
  try {
    const rawServerDatas = await db
      .select()
      .from(serverData)
      .orderBy(serverData.assetNumber);

    const parsedServerData = rawServerDatas.map(
      (server: typeof serverData.$inferSelect) => ({
        ...server,
        installedApps:
          server.installedApps && typeof server.installedApps === "object"
            ? Array.isArray(server.installedApps)
              ? server.installedApps
              : Object.values(server.installedApps)
            : [],
      })
    );

    return successResponse(
      parsedServerData,
      undefined,
      parsedServerData.length
    );
  } catch (error) {
    return handleApiError(error, "GET /api/server-data");
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await safeParseJson(request);
    const validatedData = validateSchema(serverSchema, body);

    // Check for duplicate server in same rack/unit position
    const existingServer = await db
      .select()
      .from(serverData)
      .where(
        and(
          eq(serverData.rackName, validatedData.rackName),
          eq(serverData.unitPosition, validatedData.unitPosition)
        )
      )
      .limit(1);

    if (existingServer.length > 0) {
      return errorResponse(
        `Unit position ${validatedData.unitPosition} in ${validatedData.rackName} is already occupied by ${existingServer[0].serverName}`,
        409 // Conflict
      );
    }

    // Check for duplicate asset number
    const existingAsset = await db
      .select()
      .from(serverData)
      .where(eq(serverData.assetNumber, validatedData.assetNumber))
      .limit(1);

    if (existingAsset.length > 0) {
      return errorResponse(
        `Asset number ${validatedData.assetNumber} is already in use`,
        409 // Conflict
      );
    }

    // Insert new server
    const result = await db.insert(serverData).values(validatedData);

    return successResponse(result, "Server added successfully");
  } catch (error) {
    return handleApiError(error, "POST /api/server-data");
  }
}
