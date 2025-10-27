"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ServerData } from "@/lib/types";
import { Server, HardDrive, Cpu, Database, Network } from "lucide-react";

interface ServerInfoDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  server: ServerData | null;
}

export function ServerInfoDialog({
  isOpen,
  onOpenChange,
  server,
}: ServerInfoDialogProps) {
  if (!server) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
      case "offline":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
      case "maintenance":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
      case "standby":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Server className="h-5 w-5" />
            {server.serverName}
          </DialogTitle>
          <DialogDescription>
            Detail informasi server dan aplikasi yang terinstall
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Rack Location
              </p>
              <p className="text-base font-semibold">
                {server.rackName} - U
                {String(server.unitPosition).padStart(2, "0")}
                {server.unitSize > 1 && ` (${server.unitSize}U)`}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Status
              </p>
              <div className="mt-1">
                <Badge
                  className={getStatusColor(server.status)}
                  variant="outline"
                >
                  {server.status}
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Brand</p>
              <p className="text-base font-semibold">{server.brand}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Serial Number
              </p>
              <p className="font-mono text-sm">{server.serialNumber}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Asset Number
              </p>
              <p className="font-mono text-sm">{server.assetNumber}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                IP Address
              </p>
              <p className="font-mono text-sm">{server.ipAddress}</p>
            </div>
          </div>

          {/* Specifications */}
          {server.specifications &&
            Object.keys(server.specifications).length > 0 && (
              <div className="border-t border-border pt-4">
                <p className="heading-3 mb-3 flex items-center gap-2">
                  <HardDrive className="h-4 w-4" />
                  Specifications
                </p>
                <div className="grid grid-cols-1 gap-3">
                  {(server.specifications as any).cpu && (
                    <div className="flex items-start gap-3 bg-muted/50 p-3 rounded-md">
                      <Cpu className="h-4 w-4 mt-0.5 text-primary-600" />
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">
                          CPU
                        </p>
                        <p className="text-sm">
                          {(server.specifications as any).cpu}
                        </p>
                      </div>
                    </div>
                  )}
                  {(server.specifications as any).ram && (
                    <div className="flex items-start gap-3 bg-muted/50 p-3 rounded-md">
                      <Network className="h-4 w-4 mt-0.5 text-primary-600" />
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">
                          RAM
                        </p>
                        <p className="text-sm">
                          {(server.specifications as any).ram}
                        </p>
                      </div>
                    </div>
                  )}
                  {(server.specifications as any).storage && (
                    <div className="flex items-start gap-3 bg-muted/50 p-3 rounded-md">
                      <Database className="h-4 w-4 mt-0.5 text-primary-600" />
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">
                          Storage
                        </p>
                        <p className="text-sm">
                          {(server.specifications as any).storage}
                        </p>
                      </div>
                    </div>
                  )}
                  {(server.specifications as any).os && (
                    <div className="flex items-start gap-3 bg-muted/50 p-3 rounded-md">
                      <Server className="h-4 w-4 mt-0.5 text-primary-600" />
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">
                          Operating System
                        </p>
                        <p className="text-sm">
                          {(server.specifications as any).os}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          {/* Installed Apps */}
          {server.installedApps && server.installedApps.length > 0 && (
            <div className="border-t border-border pt-4">
              <p className="heading-3 mb-3">
                Installed Applications ({server.installedApps.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {server.installedApps.map((app, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {app}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {server.notes && (
            <div className="border-t border-border pt-4">
              <p className="heading-3 mb-2">Notes</p>
              <p className="text-sm text-muted-foreground">{server.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
