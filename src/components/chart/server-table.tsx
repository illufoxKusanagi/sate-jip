"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Edit,
  Trash2,
  Info,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ServerData } from "@/lib/types";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ServerDialog } from "../dialogs/server-dialog";
import { ServerInfoDialog } from "../dialogs/server-info-dialog";

const getStatusColor = (status: string) => {
  switch (status) {
    case "online":
      return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
    case "offline":
      return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
    case "maintenance":
      return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
    case "standby":
      return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
    default:
      return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20";
  }
};

export const serverColumns: ColumnDef<ServerData>[] = [
  {
    accessorKey: "rackName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto font-semibold"
        >
          Rack
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium px-3">{row.getValue("rackName")}</div>
    ),
  },
  {
    accessorKey: "unitPosition",
    header: "Unit",
    cell: ({ row }) => (
      <div className="font-mono text-sm">
        U{String(row.getValue("unitPosition")).padStart(2, "0")}
      </div>
    ),
  },
  {
    accessorKey: "serverName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto font-semibold"
        >
          Server Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium text-wrap px-3">
        {row.getValue("serverName")}
      </div>
    ),
  },
  {
    accessorKey: "brand",
    header: "Brand",
    cell: ({ row }) => <div className="text-wrap">{row.getValue("brand")}</div>,
  },
  {
    accessorKey: "assetNumber",
    header: "Asset Number",
    cell: ({ row }) => (
      <div className="font-mono text-sm">{row.getValue("assetNumber")}</div>
    ),
  },
  {
    accessorKey: "ipAddress",
    header: "IP Address",
    cell: ({ row }) => (
      <div className="font-mono text-sm">{row.getValue("ipAddress")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge className={getStatusColor(status)} variant="outline">
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "installedApps",
    header: "Apps",
    cell: ({ row }) => {
      const apps = row.getValue("installedApps") as string[];
      return <div className="text-sm">{apps?.length || 0} installed</div>;
    },
  },
];

interface ServerTableProps {
  data: ServerData[];
  onServerClick?: (server: ServerData) => void;
  onDataChange?: () => void;
}

export function ServerTable({
  data,
  onServerClick,
  onDataChange,
}: ServerTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [editingServer, setEditingServer] = useState<ServerData | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [infoServer, setInfoServer] = useState<ServerData | null>(null);
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
  const [deletingServer, setDeletingServer] = useState<ServerData | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleEdit = (server: ServerData) => {
    setIsInfoDialogOpen(false);
    setInfoServer(null);

    setEditingServer(server);
    setIsEditDialogOpen(true);
  };

  const handleViewInfo = (server: ServerData) => {
    setIsEditDialogOpen(false);
    setEditingServer(null);

    setInfoServer(server);
    setIsInfoDialogOpen(true);
  };

  const handleDelete = (server: ServerData) => {
    setIsInfoDialogOpen(false);
    setInfoServer(null);
    setIsEditDialogOpen(false);
    setEditingServer(null);

    setDeletingServer(server);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingServer) return;

    try {
      const response = await fetch(`/api/server-data/${deletingServer.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete server");
      }

      toast.success("Server deleted successfully!");
      if (onDataChange) onDataChange();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete server");
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingServer(null);
    }
  };

  const handleDialogSuccess = () => {
    setIsEditDialogOpen(false);
    setEditingServer(null);
    if (onDataChange) onDataChange();
  };

  const columnsWithActions: ColumnDef<ServerData>[] = [
    ...serverColumns,
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const server = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(server.id)}
              >
                Copy Server ID
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(server.ipAddress || "")
                }
              >
                Copy IP Address
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleViewInfo(server)}>
                <Info className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(server)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Server
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDelete(server)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Server
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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

  return (
    <div className="w-full space-y-3 sm:space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Cari nama server..."
          value={
            (table.getColumn("serverName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("serverName")?.setFilterValue(event.target.value)
          }
          className="w-full sm:max-w-xs text-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">Columns</span>
              <span className="sm:hidden">Cols</span>
              <ChevronDown className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 sm:w-48">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize text-xs sm:text-sm"
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

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="font-semibold p-1 sm:p-2 text-xs sm:text-sm whitespace-nowrap"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
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
                  className="hover:bg-muted/50 cursor-pointer"
                  onClick={(e) => {
                    const target = e.target as HTMLElement;
                    if (
                      target.closest("button") ||
                      target.closest('[role="menu"]')
                    )
                      return;
                    handleViewInfo(row.original);
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="p-1 sm:p-2 text-xs sm:text-sm"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
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
                  No servers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex items-center justify-between sm:justify-start gap-2">
            <p className="font-medium whitespace-nowrap">Rows per page</p>
            <select
              className="h-7 sm:h-8 w-16 sm:w-[70px] rounded border border-input bg-transparent px-1 sm:px-2 py-1 text-xs sm:text-sm"
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div className="text-center sm:text-left font-medium">
            <span className="hidden sm:inline">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
            <span className="sm:hidden">
              {table.getState().pagination.pageIndex + 1}/{table.getPageCount()}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-xs"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-xs"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-xs"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-xs"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </Button>
        </div>
      </div>

      <ServerDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        editingItem={editingServer}
        onSuccess={handleDialogSuccess}
      />

      <ServerInfoDialog
        isOpen={isInfoDialogOpen}
        onOpenChange={setIsInfoDialogOpen}
        server={infoServer}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Server</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deletingServer?.serverName}? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
