"use client";

import ConfigTable from "@/components/chart/config-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
} from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

interface ConfigData {
  id: string;
  dataType: string;
  dataConfig: {
    name: string;
    address?: string;
    opdType?: string;
    pic?: string;
  };
  createdAt: string;
}
const opdColumns: ColumnDef<ConfigData>[] = [
  {
    accessorKey: "dataConfig",
    header: "Nama OPD",
    cell: ({ row }) => row.original.dataConfig.name,
  },
  {
    id: "opdType",
    header: "Jenis OPD",
    cell: ({ row }) => <Badge>{row.original.dataConfig.opdType}</Badge>,
  },
  {
    id: "address",
    header: "Alamat",
    cell: ({ row }) => row.original.dataConfig.address,
  },
];

const ispColumns: ColumnDef<ConfigData>[] = [
  {
    accessorKey: "dataConfig",
    header: "Nama ISP",
    cell: ({ row }) => row.original.dataConfig.name,
  },
  {
    id: "address",
    header: "Alamat",
    cell: ({ row }) => row.original.dataConfig.address,
  },
  {
    id: "pic",
    header: "Penanggung-jawab",
    cell: ({ row }) => row.original.dataConfig.pic,
  },
];

export default function InputDataConfigPage() {
  const [opdData, setOpdData] = useState<ConfigData[]>([]);
  const [ispData, setIspData] = useState<ConfigData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [opdSorting, setOpdSorting] = useState<SortingState>([]);
  const [ispSorting, setIspSorting] = useState<SortingState>([]);
  const [opdFilter, setOpdFilter] = useState<ColumnFiltersState>([]);
  const [ispFilter, setIspFilter] = useState<ColumnFiltersState>([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/configs");
        const allData: ConfigData[] = await response.json();

        const opdConfigs = allData.filter((item) => item.dataType === "OPD");
        const ispConfigs = allData.filter((item) => item.dataType === "ISP");

        setOpdData(opdConfigs);
        setIspData(ispConfigs);
      } catch (error) {
        console.error("Unexpected error: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Data Configuration</h1>
          <p className="text-muted-foreground mt-2">
            Manage system configuration settings
          </p>
        </div>
        <Button
        // onClick={handleCreate}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Configuration
        </Button>
      </div>

      <Tabs defaultValue="opd">
        <TabsList className="mb-4">
          <TabsTrigger value="opd">Data OPD pengampu</TabsTrigger>
          <TabsTrigger value="isp">Data ISP</TabsTrigger>
        </TabsList>
        <TabsContent value="opd">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div>Loading Configs...</div>
            </div>
          ) : (
            <ConfigTable
              data={opdData}
              columns={opdColumns}
              sorting={opdSorting}
              setSorting={setOpdSorting}
              columnFilters={opdFilter}
              setColumnFilters={setOpdFilter}
              searchPlaceholder="Cari OPD..."
              searchColumn="dataConfig"
            />
          )}
        </TabsContent>
        <TabsContent value="isp">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div>Loading Configs...</div>
            </div>
          ) : (
            <ConfigTable
              data={ispData}
              columns={ispColumns}
              sorting={ispSorting}
              setSorting={setIspSorting}
              columnFilters={ispFilter}
              setColumnFilters={setIspFilter}
              searchPlaceholder="Cari Penyedia Internet..."
              searchColumn="dataConfig"
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
