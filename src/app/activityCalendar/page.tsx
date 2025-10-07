"use client";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "../context/auth-context";
import { Calendar } from "@/modules/components/calendar/calendar";

export default function ActivityCalendar() {
  const { isAuthenticated, logout, user } = useAuth();
  const handleLogout = () => {
    logout();
  };
  return (
    <SidebarProvider>
      <div className="flex flex-row h-screen">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto relative">
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
          <div className="mt-24 mx-4 lg:m-20 flex flex-col gap-4 justify-center items-center">
            <p className="heading-1 text-center">Kalender Kegiatan</p>
            <Calendar />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}