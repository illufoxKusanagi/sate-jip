"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  submittedBy: string;
  email: string;
  phone?: string;
  categoryId: string;
  status:
    | "terbuka"
    | "dalam_progress"
    | "menunggu_jawaban"
    | "selesai"
    | "ditutup";
  priority: "rendah" | "sedang" | "tinggi" | "urgent";
  assignedTo?: string;
  source?: string;
  createdAt: string;
  updatedAt: string;
}

const columns: ColumnDef<Ticket>[] = [
  {
    accessorKey: "ticketNumber",
    header: "Ticket #",
    cell: ({ row }) => (
      <div className="font-mono font-semibold">
        {row.getValue("ticketNumber")}
      </div>
    ),
  },
  {
    accessorKey: "subject",
    header: "Subject",
    cell: ({ row }) => (
      <div className="font-medium max-w-[300px] truncate">
        {row.getValue("subject")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusColors = {
        terbuka:
          "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
        dalam_progress:
          "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
        menunggu_jawaban:
          "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
        selesai:
          "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
        ditutup:
          "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
      };
      const statusLabels = {
        terbuka: "Terbuka",
        dalam_progress: "Dalam Progress",
        menunggu_jawaban: "Menunggu Jawaban",
        selesai: "Selesai",
        ditutup: "Ditutup",
      };
      return (
        <Badge
          variant="outline"
          className={statusColors[status as keyof typeof statusColors]}
        >
          {statusLabels[status as keyof typeof statusLabels]}
        </Badge>
      );
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string;
      const priorityColors = {
        rendah:
          "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
        sedang:
          "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
        tinggi:
          "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
        urgent:
          "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
      };
      const priorityLabels = {
        rendah: "Rendah",
        sedang: "Sedang",
        tinggi: "Tinggi",
        urgent: "Urgent",
      };
      return (
        <Badge
          variant="outline"
          className={priorityColors[priority as keyof typeof priorityColors]}
        >
          {priorityLabels[priority as keyof typeof priorityLabels]}
        </Badge>
      );
    },
  },
  {
    accessorKey: "submittedBy",
    header: "Customer",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue("submittedBy")}</div>
        <div className="text-sm text-muted-foreground">
          {row.original.email}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "assignedTo",
    header: "Assigned To",
    cell: ({ row }) => <div>{row.getValue("assignedTo") || "Unassigned"}</div>,
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div className="text-sm">
          {date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      );
    },
  },
];

interface TicketsTableProps {
  data?: Ticket[];
  onRowClick?: (ticket: Ticket) => void;
}

export function TicketsTable({
  data: externalData,
  onRowClick,
}: TicketsTableProps = {}) {
  const [data, setData] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (priorityFilter !== "all") params.append("priority", priorityFilter);
      if (debouncedSearch) params.append("search", debouncedSearch);

      const url = `/api/tickets${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("📊 Fetched tickets:", result.data?.length || 0, "tickets");
      setData(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast.error("Failed to fetch tickets");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, priorityFilter, debouncedSearch]);

  useEffect(() => {
    if (!externalData) {
      fetchTickets();
    }
  }, [fetchTickets, externalData]);
  useEffect(() => {
    if (externalData) {
      setData(externalData);
      setLoading(false);
    }
  }, [externalData]);
  const table = useReactTable({
    data: data,
    columns,
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading tickets...</div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Cari tiket (subjek, nomor, email)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
          disabled={loading}
        />

        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
          disabled={loading}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="terbuka">Terbuka</SelectItem>
            <SelectItem value="dalam_progress">Dalam Progress</SelectItem>
            <SelectItem value="menunggu_jawaban">Menunggu Jawaban</SelectItem>
            <SelectItem value="selesai">Selesai</SelectItem>
            <SelectItem value="ditutup">Ditutup</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={priorityFilter}
          onValueChange={setPriorityFilter}
          disabled={loading}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="rendah">Rendah</SelectItem>
            <SelectItem value="sedang">Sedang</SelectItem>
            <SelectItem value="tinggi">Tinggi</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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
                  onClick={() => onRowClick?.(row.original)}
                  className={
                    onRowClick ? "cursor-pointer hover:bg-muted/50" : ""
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No tickets found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              {"<<"}
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              {"<"}
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              {">"}
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              {">>"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
