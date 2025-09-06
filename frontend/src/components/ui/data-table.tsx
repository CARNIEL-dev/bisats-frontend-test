import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { DataTablePagination } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Input } from "./input";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  paginated?: boolean;
  enableFiltering?: boolean;
  filterColumns?: string[];
  sortColumns?: SortingState;
  filteredValue?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  paginated = true,
  enableFiltering = false,
  filterColumns = [],
  sortColumns = [],
  filteredValue = "",
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>(sortColumns);
  const [globalFilter, setGlobalFilter] = useState<string>(filteredValue);

  const customGlobalFilter: FilterFn<TData> = (row, columnId, filterValue) => {
    const text = String(filterValue).toLowerCase();

    if (filterColumns.length > 0 && !filterColumns.includes(columnId)) {
      return false;
    }

    // Otherwise do a case-insensitive contains check:
    const cellValue = row.getValue(columnId);
    const result = String(cellValue).toLowerCase().includes(text);

    return result;
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    ...(paginated && { getPaginationRowModel: getPaginationRowModel() }),
    ...(enableFiltering && {
      getFilteredRowModel: getFilteredRowModel(),
      onColumnFiltersChange: setColumnFilters,
      onGlobalFilterChange: setGlobalFilter,
      globalFilterFn: customGlobalFilter,
      enableGlobalFilter: true,
    }),
    onSortingChange: setSorting,
    state: {
      columnFilters,
      globalFilter,
      sorting,
    },
  });

  const topHeaders = table.getHeaderGroups()[0].headers;

  return (
    <div className="flex flex-col gap-y-8 border-t lg:border-t-0 pt-4 lg:pt-0">
      {/* ─────────────────────────────────────── 
         SUB: Filtering 
      ─────────────────────────────────────── */}
      {enableFiltering && (
        <div className="flex items-center py-4 -mt-4 -mb-8">
          <Input
            value={globalFilter}
            onChange={(e) => {
              const v = e.target.value;
              setGlobalFilter(v);
            }}
            placeholder={
              filterColumns.length > 0
                ? `Search ${filterColumns.join(", ")}...`
                : "Search..."
            }
            className="max-w-sm h-10"
          />
        </div>
      )}
      {/* ─────────────────────────────────────── 
         SUB: Desktop: full grid table 
      ─────────────────────────────────────── */}
      <div className="hidden lg:block rounded-md overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-100 ">
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-gray-600 font-medium"
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
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row, i) => (
                <TableRow
                  key={row.id}
                  className={i % 2 === 1 ? "bg-gray-50" : ""}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-4 text-gray-600">
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
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ─────────────────────────────────────── 
         SUB: Mobile: card list layout 
      ─────────────────────────────────────── */}
      <div className="lg:hidden space-y-3">
        {table.getRowModel().rows.map((row) => (
          <div
            key={row.id}
            className="bg-white p-4 rounded-lg shadow-sm border"
          >
            {row.getVisibleCells().map((cell) => {
              const header = topHeaders.find((h) => h.id === cell.column.id);

              return (
                <div key={cell.id} className="flex justify-between py-1">
                  <span className="text-sm font-medium text-gray-500">
                    {header
                      ? flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )
                      : cell.column.id}
                  </span>
                  <span className="text-sm text-gray-800">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {paginated && table.getRowModel().rows.length > 0 && (
        <DataTablePagination table={table} />
      )}
    </div>
  );
}
