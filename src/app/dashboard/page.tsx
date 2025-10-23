"use client";

import MainMap from "@/components/map/main-map";
import { ChartPie } from "@/components/chart/chart-pie";
import { PageStructure } from "@/components/layout/page-structure";

export default function Dashboard() {
  return (
    <PageStructure>
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
    </PageStructure>
  );
}
