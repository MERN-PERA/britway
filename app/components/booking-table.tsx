"use client";

import * as React from "react";
import axios from "axios";
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { format, addDays, parse, isValid } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Booking } from "../typings";
import { GetServerSideProps } from "next";
import DriverCell from "./DriverCell";

import Spinner from "@/components/ui/spinner"; // Import a Spinner component

declare module "@tanstack/table-core" {
  interface FilterFns {
    dateBetweenFilterFn: FilterFn<unknown>;
  }
}

// Updated filter function to handle various date formats
const dateBetweenFilterFn: FilterFn<any> = (row, columnId, value) => {
  const dateTimeString = row.getValue(columnId) as string;
  if (!dateTimeString) return false; // Skip if no date
  
  // Try parsing the date in multiple formats
  let rowDate;
  
  // First attempt: MM/DD/YYYY format (like 3/2/2025)
  const formatAttempts = [
    // American format (month first)
    "M/d/yyyy HH:mm",
    "MM/dd/yyyy HH:mm",
    // European format (day first)
    "dd/MM/yyyy HH:mm",
    // Try without time component
    "M/d/yyyy",
    "MM/dd/yyyy",
    "dd/MM/yyyy"
  ];
  
  for (const formatString of formatAttempts) {
    try {
      const parsedDate = parse(dateTimeString, formatString, new Date());
      if (isValid(parsedDate)) {
        rowDate = parsedDate;
        break;
      }
    } catch (e) {
      // Continue trying other formats
    }
  }
  
  if (!rowDate) {
    console.warn(`Could not parse date: ${dateTimeString}`);
    return false;
  }

  // Get start and end dates
  const [start, end] = value;
  
  if (start && end) {
    return rowDate >= start && rowDate <= end;
  }
  if (start) {
    return rowDate >= start;
  }
  if (end) {
    return rowDate <= end;
  }
  return true;
};

export function BookingTable({ data = [] }: { data: Booking[] }) {
  const [loading, setLoading] = React.useState(true);
  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "journeyDate", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns: ColumnDef<Booking>[] = [
    {
      accessorKey: "journeyDate",
      header: "Journey Date",
      filterFn: "dateBetweenFilterFn",
      cell: ({ getValue }) => {
        // Format the date consistently for display
        const dateTimeString = getValue() as string;
        let displayDate = dateTimeString;
        
        // Try to parse and format consistently
        try {
          const formatAttempts = [
            "M/d/yyyy HH:mm",
            "MM/dd/yyyy HH:mm",
            "dd/MM/yyyy HH:mm",
            "M/d/yyyy",
            "MM/dd/yyyy", 
            "dd/MM/yyyy"
          ];
          
          for (const formatString of formatAttempts) {
            const parsedDate = parse(dateTimeString, formatString, new Date());
            if (isValid(parsedDate)) {
              displayDate = format(parsedDate, "dd/MM/yyyy HH:mm");
              break;
            }
          }
        } catch (e) {
          // Keep original if parsing fails
        }
        
        return <span>{displayDate}</span>;
      }
    },
    { accessorKey: "refId", header: "Reference ID" },
    {
      accessorKey: "driver",
      header: "Driver",
      cell: ({ getValue }) => {
        const driver = getValue() as string;
        return <DriverCell driver={driver} />;
      },
    },
    { accessorKey: "status", header: "Status" },
    { accessorKey: "driverIncome", header: "Driver Income" },
    { accessorKey: "total", header: "Total" },
    { accessorKey: "payments", header: "Payments" },
    { accessorKey: "fleetOperator", header: "Fleet operator" },
    { accessorKey: "passengerName", header: "Passenger Name" },
    { accessorKey: "phoneNumber", header: "Phone Number" },
    { accessorKey: "pickup", header: "Pickup" },
    { accessorKey: "dropoff", header: "Dropoff" },
    { accessorKey: "via", header: "Via" },
    { accessorKey: "passengers", header: "Passengers" },
    { accessorKey: "waitingTime", header: "Waiting Time" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "meetGreet", header: "Meet & Greet" },
    { accessorKey: "source", header: "Source" },
    { accessorKey: "customer", header: "Customer" },
    { accessorKey: "leadName", header: "Lead Name" },
    { accessorKey: "leadEmail", header: "Lead Email" },
    { accessorKey: "leadPhoneNumber", header: "Lead Phone Number" },
    { accessorKey: "createdAt", header: "Created At" },
    { accessorKey: "updatedAt", header: "Updated At" },
    { accessorKey: "id", header: "ID" },
    {
      accessorKey: "trackingHistory",
      header: "Tracking History",
      cell: ({ getValue }) => (
        <span className="whitespace-nowrap">{`${getValue()}`}</span>
      ),
    },
    { accessorKey: "action", header: "Action" },
  ];

  const table = useReactTable({
    data,
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
    filterFns: {
      dateBetweenFilterFn: dateBetweenFilterFn,
    },
    initialState: {
      pagination: {
        pageSize: 25, // Default page size
      },
    },
  });

  React.useEffect(() => {
    table
      .getColumn("journeyDate")
      ?.setFilterValue([
        dateRange?.from || null,
        dateRange?.to || null
      ]);
  }, [dateRange, table]);

  React.useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="w-full">
      {/* Filter controls - full width without horizontal scroll */}
      <div className="flex flex-wrap items-center gap-4 pb-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left font-normal",
                !dateRange?.from && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                    {format(dateRange.to, "dd/MM/yyyy")}
                  </>
                ) : (
                  format(dateRange.from, "dd/MM/yyyy")
                )
              ) : (
                <span>Filter by date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        <Button
          onClick={() => {
            setDateRange(undefined);
          }}
          variant="outline"
        >
          Clear Filter
        </Button>

        <p className="ml-auto">
          {table.getFilteredRowModel().rows.length} Bookings
        </p>
      </div>

      {/* Table container with contained horizontal and vertical scrolling */}
      <div ref={tableContainerRef} className="relative border rounded-md w-full">
        <div className="overflow-auto" style={{ maxHeight: 'calc(7 * 3.5rem)' }}> {/* 8 rows with a row height of 3.5rem */}
          <Table>
            <TableHeader className="sticky top-0 z-20">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-gray-200">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="px-4 py-3 font-medium text-sm sticky top-0 z-20 bg-gray-200 shadow-sm"
                      style={{
                        whiteSpace: 'nowrap',
                        position: 'sticky',
                        top: 0,
                        backgroundColor: 'rgb(229, 231, 235)', // Matching bg-gray-200
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'} className="hover:bg-gray-50">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="px-4 py-3"
                        style={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '300px',
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>


      {/* Pagination controls - full width without horizontal scroll */}
      <div className="w-full flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing {table.getState().pagination.pageSize * table.getState().pagination.pageIndex + 1} to{" "}
          {Math.min(
            table.getState().pagination.pageSize * (table.getState().pagination.pageIndex + 1),
            table.getFilteredRowModel().rows.length
          )}{" "}
          of {table.getFilteredRowModel().rows.length} entries
        </div>
        
        <div className="flex items-center space-x-6">
          <select
            value={table.getState().pagination.pageSize}
            onChange={e => {
              table.setPageSize(Number(e.target.value));
            }}
            className="border p-1 rounded text-sm"
          >
            {[10, 25, 50, 100].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
          
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}