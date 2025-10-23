"use client";

import { TopBar } from "@/components/layout/top-bar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useState } from "react";
import { useAuth } from "../context/auth-context";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { LocationsTable } from "@/components/chart/locations-table";
import { LocationDialog } from "@/components/location-dialog";

export default function LocationsPage() {
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const { isLoading, isAdmin } = useAuth();

  const handleCreateLocation = () => {
    setIsLocationDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex flex-row h-screen w-full relative">
        <AppSidebar />

        <main className="flex-1 overflow-y-auto">
          <TopBar />
          <div className="flex flex-col gap-4 p-2 sm:p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl sm:text-2xl font-bold">
                Dasbor Titik Lokasi
              </h2>
              {isAdmin() && (
                <Button
                  onClick={handleCreateLocation}
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Tambahkan Lokasi
                </Button>
              )}
            </div>
            <LocationsTable />
          </div>
        </main>
        <LocationDialog
          isOpen={isLocationDialogOpen}
          onOpenChange={setIsLocationDialogOpen}
          editingItem={null}
        />
      </div>
    </SidebarProvider>
  );
}
