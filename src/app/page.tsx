"use client";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LocationsTable } from "@/components/chart/locations-table";
import { AdminTable } from "@/components/chart/admin-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import MainMap from "@/components/map/main-map";
import { ChartPie } from "@/components/chart/chart-pie";
import { useAuth } from "./context/auth-context";

import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { ChevronDown, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Home() {
  const { isAuthenticated, isLoading, logout, user } = useAuth();
  const isMobile = useIsMobile();

  const handleLogout = () => {
    logout();
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
      <SidebarProvider defaultOpen={!isMobile}>
        <div className="flex flex-row h-screen w-full">
          <AppSidebar />
          <SidebarTrigger className="ml-4 mt-4" size={"lg"} />
          <main className="flex-1 overflow-y-auto relative">
            <div className="absolute top-4 right-4 flex flex-row gap-4">
              <ModeToggle />
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex flex-row gap-3 px-4 items-center hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        className="rounded-full"
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                          user?.username || "default"
                        )}`}
                        alt={user?.username || "Admin"}
                      />
                      <AvatarFallback className="rounded-lg">IK</AvatarFallback>
                    </Avatar>
                    <div className="flex text-left justify-center">
                      <span className="truncate body-small-regular">
                        halo, {user?.username}
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
            <div className="flex flex-col md:mx-20 mx-4 my-10 rounded-lg">
              <Tabs defaultValue="map">
                <TabsList>
                  {isAuthenticated ? (
                    <>
                      <TabsTrigger value="map">Dashboard</TabsTrigger>
                      <TabsTrigger value="admins">Penanggungjawab</TabsTrigger>
                      <TabsTrigger value="locations">Titik Lokasi</TabsTrigger>
                    </>
                  ) : (
                    <TabsTrigger value="map">Dashboard</TabsTrigger>
                  )}
                </TabsList>
                <TabsContent value="map">
                  <div className="flex flex-col gap-4">
                    <div className="w-full h-[60vh] rounded-4xl">
                      <MainMap />
                    </div>
                    <div className="flex flex-col md:flex-row w-full gap-4">
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
                      <div className="flex flex-col gap-4 p-4">
                        <div className="flex justify-between items-center">
                          <p className="heading-3">Dasbor Penanggungjawab</p>
                          <Button asChild>
                            <Link href="/adminData">Tambahkan PIC</Link>
                          </Button>
                        </div>
                        <AdminTable />
                      </div>
                    </TabsContent>
                    <TabsContent value="locations">
                      <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                          <h2 className="text-2xl font-bold">
                            Dasbor Titik Lokasi
                          </h2>
                          <Button asChild>
                            <Link href="/internetData">Tambahkan Lokasi</Link>
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
        </div>
      </SidebarProvider>
    </>
  );
}
