"use client";

import { PageStructure } from "@/components/layout/page-structure";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServerRackVisual } from "@/components/server-rack-visual";
import { ServerTable } from "@/components/chart/server-table";
import { ServerDialog } from "@/components/server-dialog";
import { ServerData } from "@/lib/types";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Server, Database, Plus } from "lucide-react";

export default function ServerManagement() {
  const [serverData, setServerData] = useState<ServerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Fetch server data from API
  const fetchServerData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/server-data");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setServerData(result.data);
      } else {
        throw new Error("Failed to fetch server data");
      }
    } catch (error) {
      console.error("Error fetching server data:", error);
      toast.error("Failed to load server data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServerData();
  }, []);

  const handleUnitClick = (unit: number, server?: ServerData) => {
    // Unit click handled by table actions now
  };

  if (loading) {
    return (
      <PageStructure>
        <div className="flex flex-col gap-6 w-full">
          <h1 className="heading-1 text-center">Manajemen Server</h1>
          <div className="flex items-center justify-center p-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading server data...</p>
            </div>
          </div>
        </div>
      </PageStructure>
    );
  }

  return (
    <PageStructure>
      <div className="flex flex-col gap-6 w-full">
        <div className="flex items-center justify-between">
          <h1 className="heading-1">Manajemen Server</h1>
          <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Server
          </Button>
        </div>

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
                servers={serverData}
                onUnitClick={handleUnitClick}
              />
              <ServerRackVisual
                rackName="Rak B"
                servers={serverData}
                onUnitClick={handleUnitClick}
              />
              <ServerRackVisual
                rackName="Rak C"
                servers={serverData}
                onUnitClick={handleUnitClick}
              />
              <ServerRackVisual
                rackName="Rak D"
                servers={serverData}
                onUnitClick={handleUnitClick}
              />
            </div>

            {/* Legend */}
            <div className="mt-6 p-4 bg-card border border-border rounded-lg">
              <p className="heading-3 mb-3">Status Legend</p>
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
            <ServerTable data={serverData} onDataChange={fetchServerData} />
          </TabsContent>
        </Tabs>

        {/* Add Server Dialog */}
        <ServerDialog
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onSuccess={fetchServerData}
        />
      </div>
    </PageStructure>
  );
}
