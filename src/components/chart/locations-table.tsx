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
  MapPin,
  Eye,
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
import { Badge } from "../ui/badge";
import { LocationData } from "@/lib/types";
import { useEffect, useState } from "react";
import { locationData } from "@/lib/data/locations";

interface LocationsTableProps {
  onViewLocation?: (location: LocationData) => void;
}

export const columns: ColumnDef<LocationData>[] = [
  {
    accessorKey: "locationName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Location Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div
        className="font-medium max-w-[200px] truncate"
        title={row.getValue("locationName")}
      >
        {row.getValue("locationName")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const variants = {
        active: "bg-green-100 text-green-800 border-green-300",
        inactive: "bg-red-100 text-red-800 border-red-300",
        maintenance: "bg-yellow-100 text-yellow-800 border-yellow-300",
      };

      return (
        <Badge
          variant="outline"
          className={variants[status as keyof typeof variants]}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "opdPengampu",
    header: "OPD Pengampu",
    cell: ({ row }) => (
      <div
        className="max-w-[150px] truncate"
        title={row.getValue("opdPengampu")}
      >
        {row.getValue("opdPengampu")}
      </div>
    ),
  },
  {
    accessorKey: "ispName",
    header: "ISP Provider",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("ispName")}</div>
    ),
  },
  {
    accessorKey: "internetSpeed",
    header: "Speed",
    cell: ({ row }) => (
      <div className="text-center font-mono">
        {row.getValue("internetSpeed")}
      </div>
    ),
  },
  {
    accessorKey: "internetInfrastructure",
    header: "Infrastructure",
    cell: ({ row }) => <div>{row.getValue("internetInfrastructure")}</div>,
  },
  {
    accessorKey: "jip",
    header: "JIP",
    cell: ({ row }) => (
      <div className="font-mono text-sm">{row.getValue("jip")}</div>
    ),
  },
  {
    accessorKey: "eCat",
    header: "Category",
    cell: ({ row }) => (
      <Badge variant="secondary">{row.getValue("eCat")}</Badge>
    ),
  },
];

export function LocationsTable({ onViewLocation }: LocationsTableProps) {
  const [locationData, setlocationData] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch admin data from API
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch("/api/locations");
        if (response.ok) {
          const data = await response.json();
          setlocationData(data);
        } else {
          console.error("Failed to fetch locations");
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const columnsWithActions: ColumnDef<LocationData>[] = [
    ...columns,
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const location = row.original;

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
                onClick={() => navigator.clipboard.writeText(location.id)}
              >
                Copy Location ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {onViewLocation && (
                <DropdownMenuItem onClick={() => onViewLocation(location)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View on Map
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => {
                  window.open(
                    `https://www.google.com/maps/@${location.latitude},${location.longitude},15z`,
                    "_blank"
                  );
                }}
              >
                <MapPin className="mr-2 h-4 w-4" />
                Open in Google Maps
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Edit Location</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                Delete Location
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: locationData,
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
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Filter locations..."
          value={
            (table.getColumn("locationName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("locationName")?.setFilterValue(event.target.value)
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
                    {column.id.replace(/([A-Z])/g, " $1").trim()}
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
                    <TableHead key={header.id} className="font-semibold">
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
                  className="hover:bg-muted/50"
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
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <select
              className="h-8 w-[70px] rounded border border-input bg-transparent px-3 py-1 text-sm"
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
