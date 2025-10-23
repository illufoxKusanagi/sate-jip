"use client";

import { Calendar } from "@/modules/components/calendar/calendar";
import { PageStructure } from "@/components/layout/page-structure";

export default function ActivityCalendar() {
  return (
    <PageStructure>
      <div className="flex flex-col gap-4 w-full">
        <p className="heading-1 text-center">Dashboard Pusat Data Pemeritah</p>
        <div className="w-full"></div>
      </div>
    </PageStructure>
  );
}
