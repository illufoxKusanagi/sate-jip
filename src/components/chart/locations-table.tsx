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
  Edit,
  Trash2,
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
import { Badge } from "../ui/badge";
import { LocationData } from "@/lib/types";
import { useEffect, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { toast } from "sonner";
import { LocationDialog } from "../location-dialog";

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
        className="font-medium text-wrap px-3"
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
    accessorKey: "latitude",
    header: "Garis Lintang",
    cell: ({ row }) => (
      <div className="text-wrap" title="Koordinat">
        {row.getValue("latitude")}
      </div>
    ),
  },
  {
    accessorKey: "longitude",
    header: "Garis Bujur",
    cell: ({ row }) => (
      <div className="text-wrap" title="Koordinat">
        {row.getValue("longitude")}
      </div>
    ),
  },
  {
    accessorKey: "opdPengampu",
    header: "OPD Pengampu",
    cell: ({ row }) => (
      <div className="text-wrap" title={row.getValue("opdPengampu")}>
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
  const [editingLocation, setEditingLocation] = useState<LocationData | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deletingLocation, setDeletingLocation] = useState<LocationData | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const fetchLocation = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/locations");
      if (response.ok) {
        const data = await response.json();
        setlocationData(data);
      } else {
        console.error("Failed to fetch locations");
        toast.error("Failed to fetch locations");
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
      toast.error("Error fetching locations");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (location: LocationData) => {
    setEditingLocation(location);
    setIsDialogOpen(true);
  };

  const handleDelete = (location: LocationData) => {
    setDeletingLocation(location);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingLocation) return;

    try {
      const response = await fetch(`/api/locations/${deletingLocation.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP Error! status: ${response.status}`);
      }

      await fetchLocation();
      toast.success("Location deleted successfully!");
    } catch (error) {
      console.error("Delete error: ", error);
      toast.error("Failed to delete location");
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingLocation(null);
    }
  };

  const handleDialogSuccess = () => {
    fetchLocation();
  };

  useEffect(() => {
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
              <DropdownMenuItem onClick={() => handleEdit(location)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Location
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDelete(location)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
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
      <div className="flex items-center justify-center p-6 sm:p-8">
        <div className="text-sm sm:text-base">Loading locations...</div>
      </div>
    );
  }
  return (
    <div className="w-full space-y-3 sm:space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Filter locations..."
          value={
            (table.getColumn("locationName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("locationName")?.setFilterValue(event.target.value)
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
                    {column.id.replace(/([A-Z])/g, " $1").trim()}
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
                    <TableCell
                      key={cell.id}
                      className="p-1 sm:p-2 text-xs sm:text-sm"
                    >
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

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:space-x-6 lg:space-x-8">
          <div className="flex items-center justify-between sm:justify-start space-x-2">
            <p className="text-xs sm:text-sm font-medium">Rows per page</p>
            <select
              className="h-8 w-[70px] rounded border border-input bg-transparent px-2 py-1 text-xs sm:text-sm"
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
          <div className="flex items-center justify-center text-xs sm:text-sm font-medium">
            <span className="hidden sm:inline">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
            <span className="sm:hidden">
              {table.getState().pagination.pageIndex + 1}/{table.getPageCount()}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-center space-x-1 sm:space-x-2">
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

      {/* Edit Dialog */}
      <LocationDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingItem={editingLocation}
        onSuccess={handleDialogSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Location</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deletingLocation?.locationName}?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
