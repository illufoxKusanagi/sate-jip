"use client";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LocationsTable } from "@/components/chart/locations-table";
import { AdminTable } from "@/components/chart/admin-table";
import { Button } from "@/components/ui/button";
import MainMap from "@/components/map/main-map";
import { ChartPie } from "@/components/chart/chart-pie";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { ChevronDown, LogOut, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "../context/auth-context";
import { PicDialog } from "@/components/pic-dialog";
import { LocationDialog } from "@/components/location-dialog";
import { useState } from "react";

export default function Home() {
  const { isAuthenticated, isLoading, logout, user } = useAuth();
  const [isPicDialogOpen, setIsPicDialogOpen] = useState(false);
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const handleCreatePic = () => {
    setIsPicDialogOpen(true);
  };

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
    <>
      <SidebarProvider defaultOpen={true}>
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
              <Tabs defaultValue="map">
                <TabsList className="grid w-full grid-cols-3 gap-1">
                  {isAuthenticated ? (
                    <>
                      <TabsTrigger value="map" className="text-xs sm:text-sm">
                        Dashboard
                      </TabsTrigger>
                      <TabsTrigger
                        value="admins"
                        className="text-xs sm:text-sm"
                      >
                        Penanggungjawab
                      </TabsTrigger>
                      <TabsTrigger
                        value="locations"
                        className="text-xs sm:text-sm"
                      >
                        Titik Lokasi
                      </TabsTrigger>
                    </>
                  ) : (
                    <TabsTrigger value="map">Dashboard</TabsTrigger>
                  )}
                </TabsList>

                <TabsContent value="map">
                  <div className="flex flex-col gap-4">
                    <div className="w-full h-[300px] sm:h-[500px] lg:h-[40rem] rounded-4xl">
                      <MainMap />
                    </div>
                    <div className="flex flex-col lg:flex-row w-full gap-4">
                      <ChartPie
                        dataKey="infrastructureDistribution"
                        title="Diagram Infrastruktur Jaringan"
                        className="w-full"
                      />
                      <ChartPie
                        dataKey="ispDistributions"
                        title="Diagram Persebaran ISP"
                        className="w-full"
                      />
                      <ChartPie
                        dataKey="internetSpeed"
                        title="Diagram Kecepatan Internet"
                        className="w-full"
                      />
                    </div>
                  </div>
                </TabsContent>

                {isAuthenticated && (
                  <>
                    <TabsContent value="admins">
                      <div className="flex flex-col gap-4 p-2 sm:p-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <h2 className="text-xl sm:text-2xl font-bold">
                            Dasbor Penanggungjawab
                          </h2>
                          <Button
                            onClick={handleCreatePic}
                            size="sm"
                            className="w-full sm:w-auto"
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Tambahkan PIC
                          </Button>
                        </div>
                        <AdminTable />
                      </div>
                    </TabsContent>

                    <TabsContent value="locations">
                      <div className="flex flex-col gap-4 p-2 sm:p-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <h2 className="text-xl sm:text-2xl font-bold">
                            Dasbor Titik Lokasi
                          </h2>
                          <Button
                            onClick={handleCreateLocation}
                            size="sm"
                            className="w-full sm:w-auto"
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Tambahkan Lokasi
                          </Button>
                        </div>
                        <LocationsTable />
                      </div>
                    </TabsContent>
                  </>
                )}
              </Tabs>
            </div>
          </main>

          {/* Add PIC Dialog */}
          <PicDialog
            isOpen={isPicDialogOpen}
            onOpenChange={setIsPicDialogOpen}
            editingItem={null}
          />

          {/* Add Location Dialog */}
          <LocationDialog
            isOpen={isLocationDialogOpen}
            onOpenChange={setIsLocationDialogOpen}
            editingItem={null}
          />
        </div>
      </SidebarProvider>
    </>
  );
}
