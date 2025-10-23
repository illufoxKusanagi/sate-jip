"use client";

import ConfigTable from "@/components/chart/config-table";
import { ConfigDialog } from "@/components/config-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
} from "@tanstack/react-table";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../context/auth-context";
import { ConfigData } from "@/lib/types";
import { TopBar } from "@/components/layout/top-bar";
import { PageStructure } from "@/components/layout/page-structure";

export default function InputDataConfigPage() {
  const { logout, isAdmin } = useAuth();
  const [isConfigLoading, setIsConfigLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ConfigData | null>(null);
  const [formData, setFormData] = useState({
    dataType: "",
    name: "",
    address: "",
    opdType: "",
    pic: "",
  });

  const [opdData, setOpdData] = useState<ConfigData[]>([]);
  const [ispData, setIspData] = useState<ConfigData[]>([]);
  const [opdSorting, setOpdSorting] = useState<SortingState>([]);
  const [ispSorting, setIspSorting] = useState<SortingState>([]);
  const [opdFilter, setOpdFilter] = useState<ColumnFiltersState>([]);
  const [ispFilter, setIspFilter] = useState<ColumnFiltersState>([]);

  const handleEdit = (item: ConfigData) => {
    setEditingItem(item);
    setFormData({
      dataType: item.dataType,
      name: item.dataConfig.name,
      address: item.dataConfig.address || "",
      opdType: item.dataConfig.opdType || "",
      pic: item.dataConfig.pic || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (item: ConfigData) => {
    if (!confirm("Are you sure you want to delete this configuration?")) {
      return;
    }

    try {
      const response = await fetch(`/api/configs/${item.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP Error! status: ${response.status}`);
      }

      await fetchAllData();
      toast.success("Configuration deleted successfully!");
    } catch (error) {
      console.error("Delete error: ", error);
      toast.error("Failed to delete configuration");
    }
  };

  const actionColumns: ColumnDef<ConfigData>[] = [
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEdit(row.original)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDelete(row.original)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        </div>
      ),
    },
  ];

  const baseOpdColumns: ColumnDef<ConfigData>[] = [
    {
      accessorKey: "dataConfig",
      header: "Nama OPD",
      cell: ({ row }) => row.original.dataConfig.name ?? "-",
    },
    {
      id: "opdType",
      header: "Jenis OPD",
      cell: ({ row }) => (
        <Badge>{row.original.dataConfig.opdType ?? "N/A"}</Badge>
      ),
    },
    {
      id: "address",
      header: "Alamat",
      cell: ({ row }) => row.original.dataConfig.address ?? "-",
    },
  ];

  const baseIspColumns: ColumnDef<ConfigData>[] = [
    {
      accessorKey: "dataConfig",
      header: "Nama ISP",
      cell: ({ row }) => row.original.dataConfig.name ?? "-",
    },
    {
      id: "address",
      header: "Alamat",
      cell: ({ row }) => row.original.dataConfig.address ?? "-",
    },
    {
      id: "pic",
      header: "Penanggung-jawab",
      cell: ({ row }) => row.original.dataConfig.pic ?? "-",
    },
  ];

  const opdColumns: ColumnDef<ConfigData>[] = isAdmin()
    ? [...baseOpdColumns, ...actionColumns]
    : baseOpdColumns;

  const ispColumns: ColumnDef<ConfigData>[] = isAdmin()
    ? [...baseIspColumns, ...actionColumns]
    : baseIspColumns;

  const fetchAllData = async () => {
    try {
      setIsConfigLoading(true);
      console.log("Fetching config data...");
      const response = await fetch("/api/configs");

      if (!response.ok) {
        throw new Error(`HTTP Error! status: ${response.status}`);
      }

      const rawData = await response.json();
      const allData: ConfigData[] = rawData.map((item: any) => ({
        ...item,
        dataConfig:
          typeof item.dataConfig === "string"
            ? JSON.parse(item.dataConfig)
            : item.dataConfig,
      }));
      console.log("Fetched config data:", allData);

      const opdConfigs = allData.filter((item) => item.dataType === "OPD");
      const ispConfigs = allData.filter((item) => item.dataType === "ISP");

      setOpdData(opdConfigs);
      setIspData(ispConfigs);
      console.log(
        "OPD configs:",
        opdConfigs.length,
        "ISP configs:",
        ispConfigs.length
      );
    } catch (error) {
      console.error("Fetch error details:", error);
      toast.error(
        "Failed to fetch configurations. Please check your connection."
      );
    } finally {
      setIsConfigLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    (async () => {
      await fetchAllData();
    })();
  }, []);

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({
      dataType: "",
      name: "",
      address: "",
      opdType: "",
      pic: "",
    });
    setIsDialogOpen(true);
  };

  const resetFormData = async () => {
    setFormData({
      dataType: "",
      name: "",
      address: "",
      opdType: "",
      pic: "",
    });
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Submitting form data:", formData);

      let payload: any;
      if (formData.dataType === "OPD") {
        payload = {
          dataType: formData.dataType,
          dataConfig: {
            name: formData.name,
            ...(formData.address && { address: formData.address }),
            ...(formData.opdType && { opdType: formData.opdType }),
          },
        };
      } else if (formData.dataType === "ISP") {
        payload = {
          dataType: formData.dataType,
          dataConfig: {
            name: formData.name,
            ...(formData.address && { address: formData.address }),
            ...(formData.pic && { pic: formData.pic }),
          },
        };
      }

      console.log("Payload:", payload);

      const url = editingItem
        ? `/api/configs/${editingItem.id}`
        : "/api/configs";
      const method = editingItem ? "PUT" : "POST";

      console.log(`Making ${method} request to ${url}`);

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Server response error:", response.status, errorData);
        throw new Error(
          `HTTP Error! status: ${response.status} - ${errorData}`
        );
      }

      const result = await response.json();
      console.log("Submit result:", result);

      await fetchAllData();
      resetFormData();
      toast.success(
        editingItem
          ? "Configuration updated successfully!"
          : "Configuration created successfully!"
      );
    } catch (error) {
      console.error("Submit error details:", error);
      toast.error(
        editingItem
          ? "Failed to update configuration. Please check your connection."
          : "Failed to create configuration. Please check your connection."
      );
    }
  };

  return (
    <PageStructure>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Konfigurasi Data</h1>
          <p className="text-muted-foreground text-sm">
            Untuk informasi OPD dan ISP
          </p>
        </div>
        {isAdmin() && (
          <Button onClick={handleCreate} size="sm" className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Konfigurasi Data
          </Button>
        )}
      </div>

      <Tabs defaultValue="opd">
        <TabsList className="grid w-full grid-cols-2 gap-1">
          <TabsTrigger value="opd" className="text-xs sm:text-sm">
            Data OPD pengampu
          </TabsTrigger>
          <TabsTrigger value="isp" className="text-xs sm:text-sm">
            Data ISP
          </TabsTrigger>
        </TabsList>
        <TabsContent value="opd">
          {isConfigLoading ? (
            <div className="flex items-center justify-center p-8">
              <div>Memuat Konfigurasi...</div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 p-2 sm:p-4">
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
              <ConfigDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                editingItem={editingItem}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
              />
            </div>
          )}
        </TabsContent>
        <TabsContent value="isp">
          {isConfigLoading ? (
            <div className="flex items-center justify-center p-8">
              <div>Loading Configs...</div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 p-2 sm:p-4">
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
              <ConfigDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                editingItem={editingItem}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </PageStructure>
  );
}
