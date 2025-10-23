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
import { PageStructure } from "@/components/layout/page-structure";

export default function LocationsPage() {
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const { isLoading, isAdmin } = useAuth();

  const handleCreateLocation = () => {
    setIsLocationDialogOpen(true);
  };

  return (
    <PageStructure>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold">Dasbor Titik Lokasi</h2>
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
      <LocationDialog
        isOpen={isLocationDialogOpen}
        onOpenChange={setIsLocationDialogOpen}
        editingItem={null}
      />
    </PageStructure>
  );
}
