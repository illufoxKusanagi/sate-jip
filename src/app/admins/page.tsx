"use client";

import { useAuth } from "@/app/context/auth-context";
import { AdminTable } from "@/components/chart/admin-table";
import { TopBar } from "@/components/layout/top-bar";
import { PicDialog } from "@/components/pic-dialog";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function AdminPage() {
  const { isAuthenticated, isLoading, logout, isAdmin } = useAuth();
  const [isPicDialogOpen, setIsPicDialogOpen] = useState(false);

  const handleCreatePic = () => {
    setIsPicDialogOpen(true);
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex flex-row h-screen w-full relative">
        <AppSidebar />

        <main className="flex-1 overflow-y-auto">
          <TopBar />
          <div className="flex flex-col mx-4 sm:mx-8 lg:mx-20 my-16 sm:my-10 rounded-lg">
            <div className="flex flex-col gap-4 p-2 sm:p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl sm:text-2xl font-bold">
                  Dasbor Penanggungjawab
                </h2>
                {isAdmin() && (
                  <Button
                    onClick={handleCreatePic}
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Tambahkan PIC
                  </Button>
                )}
              </div>
              <AdminTable />
            </div>
          </div>
        </main>
        <PicDialog
          isOpen={isPicDialogOpen}
          onOpenChange={setIsPicDialogOpen}
          editingItem={null}
        />
      </div>
    </SidebarProvider>
  );
}
