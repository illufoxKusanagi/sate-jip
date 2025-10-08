"use client";

import { PicDialog } from "@/components/pic-dialog";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ChevronDown, LogOut, Plus } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/auth-context";
import { AdminTable } from "@/components/chart/admin-table";

export default function AdminDataPage() {
  const { isAuthenticated, logout, user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const handleCreate = () => {
    setIsDialogOpen(true);
  };

  return (
    <SidebarProvider>
      <div className="flex flex-row h-screen w-full relative">
        <AppSidebar />

        {/* Fixed positioned controls */}
        <div className="fixed top-5 left-4 z-50 md:relative md:top-4 md:left-2 md:z-auto">
          <SidebarTrigger />
        </div>

        <div className="fixed top-4 right-4 z-50 flex flex-row gap-2 sm:gap-4">
          <ModeToggle />
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex flex-row gap-1 sm:gap-3 px-2 sm:px-4 items-center hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 rounded-md">
                <Avatar className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg">
                  <AvatarImage
                    className="rounded-full"
                    src="https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_1.png"
                    alt={user?.username || "Admin"}
                  />
                  <AvatarFallback className="rounded-lg text-xs">
                    IK
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex text-left justify-center">
                  <span className="truncate body-small-regular">
                    halo, {user?.username}
                  </span>
                </div>
                <ChevronDown className="ml-auto size-3 sm:size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>

        <main className="flex-1 my-12 overflow-y-auto">
          <div className="flex flex-col mx-4 sm:mx-8 lg:mx-20 my-16 sm:my-10 rounded-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">
                  Data Admin/PIC
                </h1>
                <p className="text-muted-foreground text-sm">
                  Kelola data admin dan penanggung jawab
                </p>
              </div>
              <Button
                onClick={handleCreate}
                size="sm"
                className="w-full sm:w-auto"
              >
                <Plus className="mr-2 h-4 w-4" />
                Tambah Admin/PIC
              </Button>
            </div>

            <div className="flex flex-col gap-4 p-2 sm:p-4">
              <AdminTable />
            </div>
          </div>
        </main>

        {/* Add Dialog */}
        <PicDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          editingItem={null}
        />
      </div>
    </SidebarProvider>
  );
}
