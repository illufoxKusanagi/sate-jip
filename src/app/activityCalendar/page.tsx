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
      <div className="flex flex-row h-screen w-full">
        <AppSidebar />
        <SidebarTrigger className="ml-4 mt-4" size={"lg"} />
        <div className="absolute top-4 right-4 flex flex-row gap-4">
          <ModeToggle />
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex flex-row gap-3 px-4 items-center hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    className="rounded-full"
                    src="https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_1.png"
                    alt={user?.username || "Admin"}
                  />
                  <AvatarFallback className="rounded-lg">IK</AvatarFallback>
                </Avatar>
                <div className="flex text-left justify-center">
                  <span className="truncate body-small-regular">
                    Selamat Datang, {user?.username}
                  </span>
                </div>
                <ChevronDown className="ml-auto size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
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
        <div className="m-20 flex flex-col gap-4">
          <p className="heading-1">Kalender Kegiatan</p>
          <Calendar />
        </div>
      </div>
    </SidebarProvider>
  );
}
