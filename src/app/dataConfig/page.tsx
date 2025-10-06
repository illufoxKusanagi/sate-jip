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
import { ChevronDown, LogOut, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../context/auth-context";
import { ConfigData } from "@/lib/types";

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
];

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

  const fetchAllData = async () => {
    try {
      setIsConfigLoading(true);
      const response = await fetch("/api/configs");
      const allData: ConfigData[] = await response.json();

      const opdConfigs = allData.filter((item) => item.dataType === "OPD");
      const ispConfigs = allData.filter((item) => item.dataType === "ISP");

      setOpdData(opdConfigs);
      setIspData(ispConfigs);
    } catch (error) {
      console.error("Unexpected error: ", error);
    } finally {
      setIsConfigLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    fetchAllData();
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

      const url = editingItem
        ? `/api/configs/${editingItem.id}`
        : "/api/configs";
      const method = editingItem ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`HTTP Error! status: ${response.status}`);
      }
      const result = await response.json();

      await fetchAllData();
      resetFormData();
      toast.success(
        editingItem
          ? "Configuration updated successfully!"
          : "Configuration created successfully!"
      );
    } catch (error) {
      console.error("Submit error: ", error);
      toast.error("Failed to create config");
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
            <Button onClick={handleCreate}>
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
