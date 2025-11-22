import { db } from "@/lib/db/connection";
import { serverData } from "@/lib/db/schema";
import { and, eq, not } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
} from "@/lib/api/response";
import {
  handleApiError,
  safeParseJson,
  validateSchema,
} from "@/lib/api/errors";
import { updateServerSchema } from "@/lib/validations/server";
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
      return errorResponse("Missing id parameter", 400);
    }

    // Check if server exists
    const existingServer = await db
      .select()
      .from(serverData)
      .where(eq(serverData.id, id))
      .limit(1);

    if (existingServer.length === 0) {
      return notFoundResponse("Server");
    }

    // Parse and validate request body
    const body = await safeParseJson(request);
    const validatedData = validateSchema(updateServerSchema, body);

    // Check for duplicate position if rack/unit changed
    if (validatedData.rackName || validatedData.unitPosition) {
      const rackName = validatedData.rackName || existingServer[0].rackName;
      const unitPosition =
        validatedData.unitPosition || existingServer[0].unitPosition;

      const duplicate = await db
        .select()
        .from(serverData)
        .where(
          and(
            eq(serverData.rackName, rackName),
            eq(serverData.unitPosition, unitPosition),
            not(eq(serverData.id, id))
          )
        )
        .limit(1);

      if (duplicate.length > 0) {
        return errorResponse(
          `Unit position ${unitPosition} in ${rackName} is already occupied by ${duplicate[0].serverName}`,
          409
        );
      }
    }

    // Check for duplicate asset number if changed
    if (
      validatedData.assetNumber &&
      validatedData.assetNumber !== existingServer[0].assetNumber
    ) {
      const duplicateAsset = await db
        .select()
        .from(serverData)
        .where(
          and(
            eq(serverData.assetNumber, validatedData.assetNumber),
            not(eq(serverData.id, id))
          )
        )
        .limit(1);

      if (duplicateAsset.length > 0) {
        return errorResponse(
          `Asset number ${validatedData.assetNumber} is already in use`,
          409
        );
      }
    }

    // Update server
    await db.update(serverData).set(validatedData).where(eq(serverData.id, id));

    return successResponse(null, "Server data updated successfully");
  } catch (error) {
    return handleApiError(error, "PUT /api/server-data/[id]");
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

    // Check if server exists
    const existingServer = await db
      .select()
      .from(serverData)
      .where(eq(serverData.id, id))
      .limit(1);

    if (existingServer.length === 0) {
      return notFoundResponse("Server");
    }

    // Delete server
    await db.delete(serverData).where(eq(serverData.id, id));

    return successResponse(null, "Server deleted successfully");
  } catch (error) {
    return handleApiError(error, "DELETE /api/server-data/[id]");
  }
}
