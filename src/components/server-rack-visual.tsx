"use client";

import { ServerData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Server } from "lucide-react";

interface ServerRackVisualProps {
  rackName: string;
  servers: ServerData[];
  onUnitClick?: (unit: number, server?: ServerData) => void;
}

export function ServerRackVisual({
  rackName,
  servers,
  onUnitClick,
}: ServerRackVisualProps) {
  const occupiedUnits = new Map<number, ServerData>();
  const unitStatus = new Map<
    number,
    { server: ServerData; isMaster: boolean }
  >();

  servers.forEach((server) => {
    if (server.rackName === rackName) {
      occupiedUnits.set(server.unitPosition, server);
      unitStatus.set(server.unitPosition, { server, isMaster: true });
      for (let i = 1; i < server.unitSize; i++) {
        const occupiedUnit = server.unitPosition - i;
        if (occupiedUnit > 0) {
          unitStatus.set(occupiedUnit, { server, isMaster: false });
        }
      }
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500/20 border-green-500 hover:bg-green-500/30";
      case "offline":
        return "bg-red-500/20 border-red-500 hover:bg-red-500/30";
      case "maintenance":
        return "bg-yellow-500/20 border-yellow-500 hover:bg-yellow-500/30";
      case "standby":
        return "bg-blue-500/20 border-blue-500 hover:bg-blue-500/30";
      default:
        return "bg-muted border-muted-foreground hover:bg-muted/80";
    }
  };

  const units = [];
  for (let u = 42; u >= 1; u--) {
    const unitInfo = unitStatus.get(u);
    const isOccupied = unitInfo !== undefined;
    const server = unitInfo?.server;
    const isMaster = unitInfo?.isMaster;

    units.push(
      <div
        key={u}
        className={cn(
          "relative h-5 border-b border-border flex items-center text-[10px] transition-colors cursor-pointer group",
          isOccupied
            ? cn(
                getStatusColor(server?.status || ""),
                "border-l-4 text-foreground font-medium",
              )
            : "bg-card hover:bg-muted/50 text-muted-foreground",
        )}
        onClick={() => onUnitClick?.(u, server)}
      >
        <span className="pl-2 font-mono font-bold">
          U{String(u).padStart(2, "0")}
        </span>
        {isMaster && server && (
          <div className="flex items-center gap-1 ml-2 truncate">
            <Server className="h-3 w-3 flex-shrink-0" />
            <span className="truncate text-[9px]">{server.serverName}</span>
          </div>
        )}

        {isOccupied && server && (
          <div className="absolute left-full ml-2 top-0 bg-popover border border-border rounded-md shadow-lg p-3 min-w-[280px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
            <h4 className="heading-4 mb-2 border-b border-border pb-2">
              {server.serverName}
            </h4>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Unit:</span>
                <span className="font-mono font-medium">
                  U{String(server.unitPosition).padStart(2, "0")}
                  {server.unitSize > 1 && ` (${server.unitSize}U)`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Brand:</span>
                <span className="font-medium">{server.brand}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Asset:</span>
                <span className="font-mono text-[10px]">
                  {server.assetNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">IP:</span>
                <span className="font-mono text-[10px]">
                  {server.ipAddress}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span
                  className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-medium",
                    server.status === "online" &&
                      "bg-green-500/20 text-green-700 dark:text-green-400",
                    server.status === "offline" &&
                      "bg-red-500/20 text-red-700 dark:text-red-400",
                    server.status === "maintenance" &&
                      "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
                    server.status === "standby" &&
                      "bg-blue-500/20 text-blue-700 dark:text-blue-400",
                  )}
                >
                  {server.status}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>,
    );
  }

  return (
    <div className="flex flex-col items-center">
      <h3 className="heading-3 mb-3">{rackName}</h3>
      <div className="w-full max-w-[320px] bg-card border-4 border-primary-900 dark:border-primary-800 rounded-lg p-2 shadow-lg">
        <div className="flex flex-col-reverse">{units}</div>
      </div>
    </div>
  );
}
