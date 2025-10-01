// src/app/dataConfig/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  Trash,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

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

// Define table columns
const columns: ColumnDef<ConfigData>[] = [
  {
    accessorKey: "dataType",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("dataType") as string;
      const variant =
        type === "OPD"
          ? "bg-blue-100 text-blue-800 border-blue-300"
          : "bg-green-100 text-green-800 border-green-300";
      return (
        <Badge variant="outline" className={variant}>
          {type}
        </Badge>
      );
    },
  },
  {
    accessorKey: "dataConfig",
    header: "Name",
    cell: ({ row }) => {
      const config = row.getValue("dataConfig") as ConfigData["dataConfig"];
      return (
        <div className="font-medium w-[200px] text-wrap">{config.name}</div>
      );
    },
  },
  {
    id: "address",
    header: "Address",
    cell: ({ row }) => {
      const config = row.original.dataConfig;
      return (
        <div className="w-[250px] text-wrap text-muted-foreground">
          {config.address || "-"}
        </div>
      );
    },
  },
  {
    id: "opdType",
    header: "OPD Type",
    cell: ({ row }) => {
      const config = row.original.dataConfig;
      return config.opdType ? (
        <Badge variant="secondary">{config.opdType}</Badge>
      ) : (
        <span className="text-muted-foreground">-</span>
      );
    },
  },
  {
    id: "pic",
    header: "PIC",
    cell: ({ row }) => {
      const config = row.original.dataConfig;
      return <div>{config.pic || "-"}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div className="text-sm text-muted-foreground">
          {date.toLocaleDateString()}
        </div>
      );
    },
  },
];

export default function DataConfigPage() {
  const [data, setData] = useState<ConfigData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ConfigData | null>(null);
  const [formData, setFormData] = useState({
    dataType: "",
    name: "",
    address: "",
    opdType: "",
    pic: "",
  });

  // Table state
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/configs");
      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        console.error("Failed to fetch configuration data");
        toast.error("Failed to load configuration data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load configuration data");
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this configuration?")) {
      return;
    }

    try {
      const response = await fetch(`/api/configs/${id}`, { method: "DELETE" });
      if (response.ok) {
        setData(data.filter((item) => item.id !== id));
        toast.success("Configuration deleted successfully");
      } else {
        toast.error("Failed to delete configuration");
      }
    } catch (error) {
      console.error("Error deleting configuration:", error);
      toast.error("Failed to delete configuration");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        dataType: formData.dataType,
        dataConfig: {
          name: formData.name,
          ...(formData.address && { address: formData.address }),
          ...(formData.opdType && { opdType: formData.opdType }),
          ...(formData.pic && { pic: formData.pic }),
        },
      };

      if (editingItem) {
        // Update existing
        const response = await fetch(`/api/configs/${editingItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          await fetchData();
          toast.success("Configuration updated successfully");
        } else {
          toast.error("Failed to update configuration");
        }
      } else {
        // Create new
        const response = await fetch("/api/configs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          await fetchData();
          toast.success("Configuration created successfully");
        } else {
          toast.error("Failed to create configuration");
        }
      }

      setIsDialogOpen(false);
      setFormData({
        dataType: "",
        name: "",
        address: "",
        opdType: "",
        pic: "",
      });
    } catch (error) {
      console.error("Error saving configuration:", error);
      toast.error("Failed to save configuration");
    }
  };

  // Add actions column
  const columnsWithActions: ColumnDef<ConfigData>[] = [
    ...columns,
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(item.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns: columnsWithActions,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading configuration data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
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

      {/* Filters and Column Visibility */}
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Filter by name..."
          value={
            (table.getColumn("dataConfig")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("dataConfig")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columnsWithActions.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} row(s) total.
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1">
            <div className="text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Edit Configuration" : "Add Configuration"}
            </DialogTitle>
            <DialogDescription>
              {editingItem
                ? "Update the configuration settings below."
                : "Create a new configuration setting."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="dataType">Data Type *</Label>
                <Select
                  value={formData.dataType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, dataType: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OPD">OPD</SelectItem>
                    <SelectItem value="ISP">ISP</SelectItem>
                    <SelectItem value="Location">Location</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Enter address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="opdType">OPD Type</Label>
                <Input
                  id="opdType"
                  value={formData.opdType}
                  onChange={(e) =>
                    setFormData({ ...formData, opdType: e.target.value })
                  }
                  placeholder="Enter OPD type"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pic">PIC</Label>
                <Input
                  id="pic"
                  value={formData.pic}
                  onChange={(e) =>
                    setFormData({ ...formData, pic: e.target.value })
                  }
                  placeholder="Enter PIC name"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">{editingItem ? "Update" : "Create"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
