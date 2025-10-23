"use client";

import { useAuth } from "@/app/context/auth-context";
import { AdminTable } from "@/components/chart/admin-table";
import { PageStructure } from "@/components/layout/page-structure";
import { PicDialog } from "@/components/pic-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function AdminPage() {
  const { isAdmin } = useAuth();
  const [isPicDialogOpen, setIsPicDialogOpen] = useState(false);

  const handleCreatePic = () => {
    setIsPicDialogOpen(true);
  };

  return (
    <PageStructure>
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
      <PicDialog
        isOpen={isPicDialogOpen}
        onOpenChange={setIsPicDialogOpen}
        editingItem={null}
      />
    </PageStructure>
  );
}
