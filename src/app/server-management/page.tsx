"use client";

import { PageStructure } from "@/components/layout/page-structure";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServerRackVisual } from "@/components/server-rack-visual";
import { ServerTable } from "@/components/chart/server-table";
import { mockServerData } from "@/lib/data/mock-servers";
import { ServerData } from "@/lib/types";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Server, HardDrive, Cpu, Database, Network } from "lucide-react";

export default function ServerManagement() {
  const [selectedServer, setSelectedServer] = useState<ServerData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleServerClick = (server: ServerData) => {
    setSelectedServer(server);
    setIsDialogOpen(true);
  };

  const handleUnitClick = (unit: number, server?: ServerData) => {
    if (server) {
      handleServerClick(server);
    }
  };

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
    <PageStructure>
      <div className="flex flex-col gap-6 w-full">
        <h1 className="heading-1 text-center">Manajemen Server</h1>

        <Tabs defaultValue="visualization" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="visualization" className="gap-2">
              <Server className="h-4 w-4" />
              Visualisasi Rak
            </TabsTrigger>
            <TabsTrigger value="table" className="gap-2">
              <Database className="h-4 w-4" />
              Data Server
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visualization" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              <ServerRackVisual
                rackName="Rak A"
                servers={mockServerData}
                onUnitClick={handleUnitClick}
              />
              <ServerRackVisual
                rackName="Rak B"
                servers={mockServerData}
                onUnitClick={handleUnitClick}
              />
              <ServerRackVisual
                rackName="Rak C"
                servers={mockServerData}
                onUnitClick={handleUnitClick}
              />
              <ServerRackVisual
                rackName="Rak D"
                servers={mockServerData}
                onUnitClick={handleUnitClick}
              />
            </div>

            {/* Legend */}
            <div className="mt-6 p-4 bg-card border border-border rounded-lg">
              <h3 className="heading-3 mb-3">Status Legend</h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border-2 border-green-500 bg-green-500/20"></div>
                  <span className="text-sm">Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border-2 border-red-500 bg-red-500/20"></div>
                  <span className="text-sm">Offline</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border-2 border-yellow-500 bg-yellow-500/20"></div>
                  <span className="text-sm">Maintenance</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border-2 border-blue-500 bg-blue-500/20"></div>
                  <span className="text-sm">Standby</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border border-border bg-card"></div>
                  <span className="text-sm">Empty</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="table" className="mt-6">
            <ServerTable
              data={mockServerData}
              onServerClick={handleServerClick}
            />
          </TabsContent>
        </Tabs>

        {/* Server Detail Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Server className="h-5 w-5" />
                {selectedServer?.serverName}
              </DialogTitle>
              <DialogDescription>
                Detail informasi server dan aplikasi yang terinstall
              </DialogDescription>
            </DialogHeader>

            {selectedServer && (
              <div className="space-y-6 mt-4">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Rack Location
                    </label>
                    <p className="text-base font-semibold">
                      {selectedServer.rackName} - U
                      {String(selectedServer.unitPosition).padStart(2, "0")}
                      {selectedServer.unitSize > 1 &&
                        ` (${selectedServer.unitSize}U)`}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Status
                    </label>
                    <div className="mt-1">
                      <Badge
                        className={getStatusColor(selectedServer.status)}
                        variant="outline"
                      >
                        {selectedServer.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Brand
                    </label>
                    <p className="text-base font-semibold">
                      {selectedServer.brand}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Serial Number
                    </label>
                    <p className="font-mono text-sm">
                      {selectedServer.serialNumber}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Asset Number
                    </label>
                    <p className="font-mono text-sm">
                      {selectedServer.assetNumber}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      IP Address
                    </label>
                    <p className="font-mono text-sm">
                      {selectedServer.ipAddress}
                    </p>
                  </div>
                </div>

                {/* Specifications */}
                {Object.keys(selectedServer.specifications).length > 0 && (
                  <div className="border-t border-border pt-4">
                    <h3 className="heading-3 mb-3 flex items-center gap-2">
                      <HardDrive className="h-4 w-4" />
                      Specifications
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {selectedServer.specifications.cpu && (
                        <div className="flex items-start gap-3 bg-muted/50 p-3 rounded-md">
                          <Cpu className="h-4 w-4 mt-0.5 text-primary-600" />
                          <div>
                            <label className="text-xs font-medium text-muted-foreground">
                              CPU
                            </label>
                            <p className="text-sm">
                              {selectedServer.specifications.cpu}
                            </p>
                          </div>
                        </div>
                      )}
                      {selectedServer.specifications.ram && (
                        <div className="flex items-start gap-3 bg-muted/50 p-3 rounded-md">
                          <Network className="h-4 w-4 mt-0.5 text-primary-600" />
                          <div>
                            <label className="text-xs font-medium text-muted-foreground">
                              RAM
                            </label>
                            <p className="text-sm">
                              {selectedServer.specifications.ram}
                            </p>
                          </div>
                        </div>
                      )}
                      {selectedServer.specifications.storage && (
                        <div className="flex items-start gap-3 bg-muted/50 p-3 rounded-md">
                          <Database className="h-4 w-4 mt-0.5 text-primary-600" />
                          <div>
                            <label className="text-xs font-medium text-muted-foreground">
                              Storage
                            </label>
                            <p className="text-sm">
                              {selectedServer.specifications.storage}
                            </p>
                          </div>
                        </div>
                      )}
                      {selectedServer.specifications.os && (
                        <div className="flex items-start gap-3 bg-muted/50 p-3 rounded-md">
                          <Server className="h-4 w-4 mt-0.5 text-primary-600" />
                          <div>
                            <label className="text-xs font-medium text-muted-foreground">
                              Operating System
                            </label>
                            <p className="text-sm">
                              {selectedServer.specifications.os}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Installed Apps */}
                {selectedServer.installedApps.length > 0 && (
                  <div className="border-t border-border pt-4">
                    <h3 className="heading-3 mb-3">
                      Installed Applications (
                      {selectedServer.installedApps.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedServer.installedApps.map((app, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {app}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedServer.notes && (
                  <div className="border-t border-border pt-4">
                    <h3 className="heading-3 mb-2">Notes</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedServer.notes}
                    </p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </PageStructure>
  );
}
