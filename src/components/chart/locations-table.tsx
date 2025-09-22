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
import { Checkbox } from "../ui/checkbox";

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
        className="font-medium w-[200px] text-wrap px-3"
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
    accessorKey: "longitude",
    header: "Garis Bujur",
    cell: ({ row }) => (
      <div className="w-[150px] text-wrap" title="Koordinat">
        {row.getValue("longitude")}
      </div>
    ),
  },
  {
    accessorKey: "latitude",
    header: "Garis Lintang",
    cell: ({ row }) => (
      <div className="w-[150px] text-wrap" title="Koordinat">
        {row.getValue("latitude")}
      </div>
    ),
  },
  {
    accessorKey: "opdPengampu",
    header: "OPD Pengampu",
    cell: ({ row }) => (
      <div className="w-[150px] text-wrap" title={row.getValue("opdPengampu")}>
        {row.getValue("opdPengampu")}
      </div>
    ),
  },
  {
    accessorKey: "ispName",
    header: "ISP Provider",
    cell: ({ row }) => (
      <div className="font-medium ">{row.getValue("ispName")}</div>
    ),
  },
  {
    accessorKey: "internetSpeed",
    header: "Speed",
    cell: ({ row }) => (
      <div className="text-left font-mono">{row.getValue("internetSpeed")}</div>
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
    cell: ({ row }) => {
      const raw = row.getValue("jip");
      const checked =
        String(raw).trim().toLowerCase() === "true" ||
        ["1", "yes", "ya", "checked"].includes(
          String(raw).trim().toLowerCase()
        );
      return <Checkbox checked={checked} disabled aria-readonly />;
    },
  },

  {
    accessorKey: "dropPoint",
    header: "Drop point",
    cell: ({ row }) => {
      const raw = row.getValue("dropPoint");
      const dp =
        typeof raw === "string" && raw.trim().length > 0 ? raw.trim() : null;
      const classes =
        dp === "MMR"
          ? "bg-green-100 text-green-800 border-green-300"
          : dp === "MPP"
          ? "bg-yellow-100 text-yellow-800 border-yellow-300"
          : "bg-gray-100 text-gray-800 border-gray-300 w-12 h-6";
      return <Badge className={classes}>{dp ?? ""}</Badge>;
    },
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

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch("/api/locations");
        if (response.ok) {
          const data = await response.json();
          setlocationData(data);
          console.log(data);
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

  if (loading) {
    return (
      <>
        <p>Loading...</p>
      </>
    );
  }
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
                    <TableHead key={header.id} className="font-semibold p-2">
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

      <div className="flex items-center justify-end space-x-2">
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
