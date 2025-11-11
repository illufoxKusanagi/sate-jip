"use client";

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
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "@/app/context/auth-context";

export function TopBar() {
  const { isAuthenticated, logout, user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between p-4">
        <SidebarTrigger />
        <div className="flex flex-row gap-2 sm:gap-4">
          <ModeToggle />
          {isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex flex-row gap-1 sm:gap-3 px-2 sm:px-4 items-center hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 rounded-md transition-colors">
                <Avatar className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg">
                  <AvatarImage
                    className="rounded-full"
                    src="https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_1.png"
                    alt={user?.username || "Admin"}
                  />
                  <AvatarFallback className="rounded-lg text-xs">
                    {user?.username?.slice(0, 2).toUpperCase() || "IK"}
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
          )}
        </div>
      </div>
    </div>
  );
}
