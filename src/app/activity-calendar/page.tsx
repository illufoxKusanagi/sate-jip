"use client";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { TopBar } from "@/components/layout/top-bar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Calendar } from "@/modules/components/calendar/calendar";

export default function ActivityCalendar() {
  return (
    <SidebarProvider>
      <div className="flex flex-row h-screen w-full">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto relative w-full">
          <TopBar />
          <div className="p-4 lg:p-8 w-full">
            <div className="flex flex-col gap-4 w-full">
              <p className="heading-1 text-center">Kalender Kegiatan</p>
              <div className="w-full">
                <Calendar />
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
