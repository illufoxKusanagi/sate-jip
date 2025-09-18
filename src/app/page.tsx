"use client";

import MapSearch from "@/components/map/map-search";
import MapStyles from "@/components/map/map-styles";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartBarLabel } from "@/components/chart/chart-bar-label";
import { ChartAreaInteractive } from "@/components/chart/chart-area-label";
import { DataTableDemo } from "@/components/chart/data-table-demo";
import { LocationsTable } from "@/components/chart/locations-table";
import { AdminTable } from "@/components/chart/admin-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import MainMap from "@/components/map/main-map";

export default function Home() {
  return (
    <>
      <SidebarProvider defaultOpen={true}>
        <div className="flex flex-row h-screen w-full">
          <AppSidebar />
          <SidebarTrigger className="ml-4 mt-4" size={"lg"} />
          <main className="flex-1 overflow-y-auto relative">
            <div className="absolute top-4 right-4">
              <ModeToggle />
            </div>
            <div className="flex flex-col mx-20 my-10 rounded-lg">
              <Tabs defaultValue="map">
                <TabsList>
                  <TabsTrigger value="map">Map</TabsTrigger>
                  <TabsTrigger value="admins">Admin</TabsTrigger>
                  <TabsTrigger value="locations">Locations</TabsTrigger>
                </TabsList>
                <TabsContent value="map">
                  <div className="flex flex-col gap-4">
                    <div className="w-full h-[40rem] rounded-4xl">
                      <MainMap />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <ChartBarLabel />
                      <ChartAreaInteractive />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="admins">
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold">Admin Management</h2>
                      <Button asChild>
                        <Link href="/internetData">Add Admin</Link>
                      </Button>
                    </div>
                    <AdminTable />
                  </div>
                </TabsContent>
                <TabsContent value="locations">
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold">
                        Location Management
                      </h2>
                      <Button asChild>
                        <Link href="/internetData">Add Location</Link>
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
