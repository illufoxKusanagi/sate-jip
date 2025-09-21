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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChartPie } from "@/components/chart/chart-pie";

export default function Home() {
  const user = {
    name: "arief",
    email: "ariefsatria@gmail.com",
    avatar: "",
  };

  return (
    <>
      <SidebarProvider defaultOpen={true}>
        <div className="flex flex-row h-screen w-full">
          <AppSidebar />
          <SidebarTrigger className="ml-4 mt-4" size={"lg"} />
          <main className="flex-1 overflow-y-auto relative">
            <div className="absolute top-4 right-4 flex flex-row gap-4">
              <ModeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger className="flex flex-row gap-3 px-4 items-center hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-lg">IK</AvatarFallback>
                  </Avatar>
                  <div className="flex text-left justify-center">
                    <span className="truncate body-small-regular">
                      halo, {user.name}
                    </span>
                  </div>
                  <ChevronDown className="ml-auto size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                  <DropdownMenuItem>Team</DropdownMenuItem>
                  <DropdownMenuItem>Subscription</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex flex-col mx-20 my-10 rounded-lg">
              <Tabs defaultValue="map">
                <TabsList>
                  <TabsTrigger value="map">Dashboard</TabsTrigger>
                  <TabsTrigger value="admins">Penanggungjawab</TabsTrigger>
                  <TabsTrigger value="locations">Titik Lokasi</TabsTrigger>
                </TabsList>
                <TabsContent value="map">
                  <div className="flex flex-col gap-4">
                    <div className="w-full h-[40rem] rounded-4xl">
                      <MainMap />
                    </div>
                    <div className="flex flex-row w-full gap-4">
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
              </Tabs>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </>
  );
}

// // filepath: src/app/page.tsx
// "use client";

// import MapSearch from "@/components/map/map-search";
// import MapStyles from "@/components/map/map-styles";
// import { AppSidebar } from "@/components/ui/app-sidebar";
// import { ModeToggle } from "@/components/ui/mode-toggle";
// import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { ChartBarLabel } from "@/components/chart/chart-bar-label";
// import { ChartAreaInteractive } from "@/components/chart/chart-area-label";
// import { DataTableDemo } from "@/components/chart/data-table-demo";
// import { LocationsTable } from "@/components/chart/locations-table";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import MainMap from "@/components/map/main-map";

// export default function Home() {
//   return (
//     <>
//       <SidebarProvider defaultOpen={true}>
//         <div className="flex flex-row h-screen w-full">
//           <AppSidebar />
//           <SidebarTrigger className="ml-4 mt-4" size={"lg"} />
//           <main className="flex-1 overflow-y-auto relative">
//             <div className="absolute top-4 right-4">
//               <ModeToggle />
//             </div>
//             <div className="flex flex-col mx-20 my-10 rounded-lg">
//               <Tabs defaultValue="map">
//                 <TabsList>
//                   <TabsTrigger value="map">Map</TabsTrigger>
//                   <TabsTrigger value="admint">Admin</TabsTrigger>
//                   <TabsTrigger value="locations">Locations</TabsTrigger>
//                 </TabsList>
//                 <TabsContent value="map">
//                   <div className="flex flex-col gap-4">
//                     <div className="w-full h-[40rem] rounded-4xl">
//                       <MainMap />
//                     </div>
//                     <div className="grid grid-cols-2 gap-4">
//                       <ChartBarLabel />
//                       <ChartAreaInteractive />
//                     </div>
//                   </div>
//                 </TabsContent>
//                 <TabsContent value="admint">
//                   <div className="flex flex-col gap-4">
//                     <DataTableDemo />
//                     <div className="flex justify-start">
//                       <Button asChild>
//                         <Link href="/internetData">Add Data</Link>
//                       </Button>
//                     </div>
//                   </div>
//                 </TabsContent>
//                 <TabsContent value="locations">
//                   <div className="flex flex-col gap-4">
//                     <div className="flex justify-between items-center">
//                       <h2 className="text-2xl font-bold">
//                         Location Management
//                       </h2>
//                       <Button asChild>
//                         <Link href="/internetData">Add Location</Link>
//                       </Button>
//                     </div>
//                     <LocationsTable />
//                   </div>
//                 </TabsContent>
//               </Tabs>
//             </div>
//           </main>
//         </div>
//       </SidebarProvider>
//     </>
//   );
// }

// // "use client";

// // import MapSearch from "@/components/map/map-search";
// // import MapStyles from "@/components/map/map-styles";
// // import { AppSidebar } from "@/components/ui/app-sidebar";
// // import { ModeToggle } from "@/components/ui/mode-toggle";
// // import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
// // import MapProvider from "@/lib/mapbox/provider";
// // import { useRef } from "react";
// // import MapControls from "@/components/map/map-control";
// // import MainMap from "@/components/map/main-map";
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// // import { ChartBarLabel } from "@/components/chart/chart-bar-label";
// // import { ChartAreaInteractive } from "@/components/chart/chart-area-label";
// // import { DataTableDemo } from "@/components/chart/data-table-demo";
// // import { Button } from "@/components/ui/button";
// // import Link from "next/link";

// // export default function Home() {
// //   return (
// //     <>
// //       <SidebarProvider defaultOpen={true}>
// //         <div className="flex flex-row h-screen w-full">
// //           <AppSidebar />
// //           <SidebarTrigger className="ml-4 mt-4" size={"lg"} />
// //           <main className="flex-1 overflow-y-auto relative">
// //             <div className="absolute top-4 right-4">
// //               <ModeToggle />
// //             </div>
// //             <div className="flex flex-col mx-20 my-10 rounded-lg">
// //               <Tabs defaultValue="map">
// //                 <TabsList>
// //                   <TabsTrigger value="map">Map</TabsTrigger>
// //                   <TabsTrigger value="admint">Admint</TabsTrigger>
// //                 </TabsList>
// //                 <TabsContent value="map">
// //                   <div className="flex flex-col gap-4">
// //                     <div className="w-full h-96 rounded-4xl">
// //                       <MainMap />
// //                     </div>
// //                     <div className="grid grid-cols-2 gap-4">
// //                       <ChartBarLabel />
// //                       <ChartAreaInteractive />
// //                     </div>
// //                   </div>
// //                 </TabsContent>
// //                 <TabsContent value="admint">
// //                   <div className="flex flex-col gap-4">
// //                     <DataTableDemo />
// //                     <Link href={"/internetData"}>
// //                       <Button variant={"outline"} size={"lg"}>
// //                         test
// //                       </Button>
// //                     </Link>
// //                   </div>
// //                 </TabsContent>
// //               </Tabs>
// //             </div>
// //           </main>
// //         </div>
// //       </SidebarProvider>
// //     </>
// //   );
// // }
