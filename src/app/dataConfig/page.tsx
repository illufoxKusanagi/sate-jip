"use client";

import ConfigTable from "@/components/chart/config-table";
import { ConfigDialog } from "@/components/config-dialog";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
} from "@tanstack/react-table";
import { ChevronDown, LogOut, Plus, Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../context/auth-context";
import { ConfigData } from "@/lib/types";

export default function InputDataConfigPage() {
  const { isAuthenticated, logout, user } = useAuth();
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

  const handleHealthCheck = async () => {
    try {
      console.log("Running health check...");
      toast.info("Running health check...");

      const response = await fetch("/api/health");
      const healthData = await response.json();

      console.log("Health check result:", healthData);

      if (healthData.status === "healthy") {
        toast.success("Health check passed! Database connection is working.");
      } else {
        toast.error(
          `Health check failed: ${
            healthData.database?.error || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Health check error:", error);
      toast.error("Health check failed - unable to reach server");
    }
  };

  const opdColumns: ColumnDef<ConfigData>[] = [
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
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
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
        </div>
      ),
    },
  ];

  const ispColumns: ColumnDef<ConfigData>[] = [
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
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
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
        </div>
      ),
    },
  ];

  const fetchAllData = async () => {
    try {
      setIsConfigLoading(true);
      console.log("Fetching config data...");
      const response = await fetch("/api/configs");

      if (!response.ok) {
        throw new Error(`HTTP Error! status: ${response.status}`);
      }

      const allData: ConfigData[] = await response.json();
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
    <SidebarProvider>
      <div className="flex flex-row h-screen w-full">
        <AppSidebar />
        <SidebarTrigger className="ml-4 mt-4" size={"lg"} />
        <div className="absolute top-4 right-4 flex flex-row gap-4">
          <ModeToggle />
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex flex-row gap-3 px-4 items-center hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    className="rounded-full"
                    src="https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_1.png"
                    alt={user?.username || "Admin"}
                  />
                  <AvatarFallback className="rounded-lg">IK</AvatarFallback>
                </Avatar>
                <div className="flex text-left justify-center">
                  <span className="truncate body-small-regular">
                    Selamat Datang, {user?.username}
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
        <div className="container lg:m-20">
          <div className="flex items-center justify-between lg:mb-6">
            <div>
              <h1 className="text-3xl font-bold">Data Configuration</h1>
              <p className="text-muted-foreground mt-2">
                Manage system configuration settings
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleHealthCheck}>
                Health Check
              </Button>
              <Button onClick={handleCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Add Configuration
              </Button>
            </div>
          </div>

          <Tabs defaultValue="opd">
            <TabsList className="mb-4">
              <TabsTrigger value="opd">Data OPD pengampu</TabsTrigger>
              <TabsTrigger value="isp">Data ISP</TabsTrigger>
            </TabsList>
            <TabsContent value="opd">
              {isConfigLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div>Loading Configs...</div>
                </div>
              ) : (
                <>
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
                </>
              )}
            </TabsContent>
            <TabsContent value="isp">
              {isConfigLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div>Loading Configs...</div>
                </div>
              ) : (
                <>
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
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </SidebarProvider>
  );
}
