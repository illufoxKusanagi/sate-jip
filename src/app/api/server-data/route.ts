import db from "@/lib/db/connection";
import { serverData } from "@/lib/db/schema";
import { ServerData } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const rawServerDatas = await db
      .select()
      .from(serverData)
      .orderBy(serverData.assetNumber);

    // Convert installedApps from object to array if needed
    const parsedServerData = rawServerDatas.map(
      (server: typeof serverData.$inferSelect) => ({
        ...server,
        installedApps:
          server.installedApps && typeof server.installedApps === "object"
            ? Array.isArray(server.installedApps)
              ? server.installedApps
              : Object.values(server.installedApps)
            : [],
      }),
    );

    return NextResponse.json({ success: true, data: parsedServerData });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch server datas" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const newServerData = {
      rackName: data.rackName,
      unitPosition: data.unitPosition,
      unitSize: data.unitSize,
      serverName: data.serverName,
      brand: data.brand || "",
      assetNumber: data.assetNumber,
      serialNumber: data.serialNumber || "",
      ipAddress: data.ipAddress || "",
      status: data.status,
      specification: data.specification || null,
      installedApps: data.installedApps || [],
      notes: data.notes || "",
    };
    const result = await db.insert(serverData).values(newServerData);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add server data" },
      { status: 500 },
    );
  }
}
