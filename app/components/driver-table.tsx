"use client";

import * as React from "react";
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
  FilterFn,
  FilterFns,
} from "@tanstack/react-table";
import { ArrowUpDown, PenIcon, TrashIcon, Eye, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { IDriverData } from "../typings/interfaces/driverData";
import ConfirmationDialog from "./shared/confirmation-dialog/ConfirmationDialog";
import { useCustomNavigation } from "../hooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Spinner from "@/components/ui/spinner";

export type Driver = {
  id: string;
  uniqueId: string;
  photo: string;
  name: string;
  email: string;
  phone: string;
};

export const columns: ColumnDef<Driver>[] = [
  {
    id: "photo",
    header: "Photo",
    accessorKey: "photo",
    cell: ({ row }) => {
      const photo = row.original.photo;
      const name = row.original.name;

      return (
        <Avatar>
          {photo ? (
            <div className="flex items-center justify-center w-full h-full bg-gray-300 rounded-full text-gray-600">
              <AvatarImage src={photo} alt="photo" />
            </div>
          ) : (
            <AvatarFallback>
              <div className="flex items-center justify-center w-full h-full bg-gray-300 rounded-full text-gray-600 font-semibold">
                {name.substring(0, 2).toUpperCase()}
              </div>
            </AvatarFallback>
          )}
        </Avatar>
      );
    },
  },

  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="capitalize font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "uniqueId",
    header: "Unique ID",
    cell: ({ row }) => <div className="font-mono text-xs">{row.getValue("uniqueId")}</div>,
  },
];

export function DriversTable() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const { navigate } = useCustomNavigation();
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = React.useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = React.useState<Driver | null>(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [searchColumn, setSearchColumn] = React.useState("email");

  const handleOnClickView = (row: Driver) => {
    navigate(`/driver-details/${row.id}`);
  };

  const handleOnClickEdit = (row: Driver) => {
    navigate(`/driver/${row.id}/update`);
  };

  const handleOnClickDelete = (row: Driver) => {
    setSelectedDriver(row);
  };

  const defaultFilterFns: Partial<Record<keyof FilterFns, FilterFn<any>>> = {
    dateBetweenFilterFn: () => true,
  };

  // Custom global filter function
  const globalFilterFn: FilterFn<any> = (row, columnId, value) => {
    const searchValue = String(value).toLowerCase();
    
    if (searchColumn === "all") {
      return ["name", "email", "phone", "uniqueId"].some(field => {
        const cellValue = String(row.getValue(field) || "").toLowerCase();
        return cellValue.includes(searchValue);
      });
    } else {
      const cellValue = String(row.getValue(searchColumn) || "").toLowerCase();
      return cellValue.includes(searchValue);
    }
  };

  const table = useReactTable({
    data,
    columns: [
      ...columns,
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          return (
            <div className="flex gap-2">
              <Button 
                size="icon" 
                className="w-8 h-8 bg-blue-100 hover:bg-blue-200 text-blue-700 border-blue-300" 
                variant="outline"
                onClick={() => handleOnClickView(row.original)}
              >
                <Eye className="size-4" />
              </Button>
              <Button 
                size="icon" 
                className="w-8 h-8 bg-amber-100 hover:bg-amber-200 text-amber-700 border-amber-300" 
                variant="outline"
                onClick={() => handleOnClickEdit(row.original)}
              >
                <PenIcon className="size-4" />
              </Button>
              <Button 
                size="icon" 
                className="w-8 h-8 bg-red-100 hover:bg-red-200 text-red-700 border-red-300" 
                variant="outline"
                onClick={() => handleOnClickDelete(row.original)}
              >
                <TrashIcon className="size-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    filterFns: {
      ...defaultFilterFns,
      globalFilter: globalFilterFn,
    } as Record<keyof FilterFns, FilterFn<any>>,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter: searchTerm,
    },
    onGlobalFilterChange: setSearchTerm,
  });

  React.useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = () => {
    setIsLoading(true);

    try {
      axios.get("/api/driver").then((response) => {
        const preparedData = response.data
          .map((driver: IDriverData) => ({
            id: driver.id,
            uniqueId: driver.generalData.uniqueId,
            name: driver.generalData.displayName,
            email: driver.generalData.email,
            phone: driver.personalData?.mobileNumber,
            photo: driver.personalData?.photo,
          }))
          .reverse();
        setData(preparedData);
        setIsLoading(false);
      });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    try {
      setIsDeleting(true);

      axios.delete(`/api/driver/${selectedDriver?.id}`).then((response) => {
        fetchDrivers();
        handleOnCancelDelete();
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOnCancelDelete = () => {
    setSelectedDriver(null);
  };

  return (
    <div className="w-full">
      <ConfirmationDialog
        title={"Are you sure?"}
        description={"Do you want to delete this driver?"}
        onConfirm={handleDelete}
        onDecline={handleOnCancelDelete}
        isLoading={isDeleting}
        open={selectedDriver !== null}
      />

      <div className="flex items-center pb-4 gap-3">
        <div className="flex items-center relative max-w-sm w-full">
          <Input
            placeholder={`Search ${searchColumn === "all" ? "all fields" : searchColumn}...`}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="pr-8"
          />
          <Search className="absolute right-2 h-4 w-4 text-gray-400" />
        </div>
        {/* <Select
          value={searchColumn}
          onValueChange={setSearchColumn}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Fields</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="phone">Phone</SelectItem>
            <SelectItem value="uniqueId">Unique ID</SelectItem>
          </SelectContent>
        </Select> */}
      </div>
      <div className="rounded-md border">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="overflow-auto" style={{ maxHeight: 'calc(7 * 3.5rem)' }}>
            <Table>
              <TableHeader className="bg-gray-100">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} className="font-semibold text-gray-700">
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
                      className="hover:bg-gray-50"
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
                      colSpan={columns.length + 1}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-gray-500">
          {data.length > 0 && `Showing ${Math.min(
            table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1,
            table.getFilteredRowModel().rows.length
          )} to ${Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )} of ${table.getFilteredRowModel().rows.length} entries`}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="text-gray-700"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="text-gray-700"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}