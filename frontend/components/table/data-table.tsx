"use client";

import React from "react";

import {
  Row,
  useReactTable,
  ExpandedState,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getExpandedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnDef,
  flexRender,
  VisibilityState,
  ColumnOrderState,
} from "@tanstack/react-table";

import TableFilter from "./table-filter";
import DebouncedInput from "./debounced-input";
import Pagination from "./pagination";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import {
  ChevronsUpDownIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  Columns,
} from "lucide-react";

export interface DataTableProps<T extends object> {
  data: T[];
  columns: ColumnDef<T>[];
}

const DataTable = <T extends object>({ data, columns }: DataTableProps<T>) => {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>([]);
  const [columnPinning, setColumnPinning] = React.useState({});
  const [expanded, setExpanded] = React.useState<ExpandedState>({});
  const pageSizes: number[] = [10, 20, 30, 40, 50];

  const renderSubComponent: React.FC<{ row: Row<T> }> = ({ row }) => {
    return (
      <pre className="text-xs">
        <code>{JSON.stringify(row.original, null, 2)}</code>
      </pre>
    );
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      globalFilter,
      columnPinning,
      columnVisibility,
      columnOrder,
      expanded,
    },
    getRowCanExpand: () => true,
    onExpandedChange: setExpanded,
    onColumnOrderChange: setColumnOrder,
    onColumnPinningChange: setColumnPinning,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    // debugTable: false,
    // debugHeaders: false,
    // debugColumns: false,
    // debugRows: false,
    debugAll: false,
  });

  return (
    <div className="w-full">
      {/* Search, reset, toggle, pagination */}
      <div className="flex flex-wrap justify-between w-full gap-2">
        <div className="flex items-center gap-4">
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
            placeholder="Search all columns..."
          />
          <Button
            onClick={() => {
              table.resetColumnFilters();
              table.resetGlobalFilter();
            }}
            className="uppercase"
            variant={"secondary"}
          >
            Reset
          </Button>

          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button className="whitespace-nowrap" variant="secondary">
                  <Columns size={24} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="pl-7">
                <div>
                  <Label className="flex items-center gap-1">
                    <Input
                      className="w-auto"
                      {...{
                        type: "checkbox",
                        checked: table.getIsAllColumnsVisible(),
                        onChange: table.getToggleAllColumnsVisibilityHandler(),
                      }}
                    />{" "}
                    <div>
                      <span>Toggle All</span>
                    </div>
                  </Label>
                </div>
                <Separator className="my-2" />
                <ScrollArea className="h-[300px]">
                  {table.getAllLeafColumns().map((column) => {
                    return (
                      <div key={column.id}>
                        <Label className="flex items-center gap-2">
                          <Input
                            className="w-auto"
                            {...{
                              type: "checkbox",
                              checked: column.getIsVisible(),
                              onChange: column.getToggleVisibilityHandler(),
                            }}
                          />{" "}
                          <span>{column.id}</span>
                        </Label>
                      </div>
                    );
                  })}
                </ScrollArea>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="flex justify-end">
          <Pagination table={table} pageSizes={pageSizes} />
        </div>
      </div>

      <Separator className="my-4" />

      <div className="w-full max-h-[500px] flex flex-col">
        <Table>
          {/* Table Header */}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className="p-4 align-top whitespace-nowrap"
                    >
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            {...{
                              className: `${
                                header.column.getCanSort()
                                  ? "cursor-pointer select-none"
                                  : ""
                              } flex items-center gap-1`,
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getIsSorted() === "desc" ? (
                              <ArrowDownIcon className="w-4 h-4 ml-2" />
                            ) : header.column.getIsSorted() === "asc" ? (
                              <ArrowUpIcon className="w-4 h-4 ml-2" />
                            ) : !header.column.getCanSort() ? null : (
                              <ChevronsUpDownIcon className="w-4 h-4 ml-2" />
                            )}
                          </div>
                          {header.column.getCanFilter() ? (
                            <div>
                              <TableFilter
                                key={header.id}
                                column={header.column}
                                table={table}
                              />
                            </div>
                          ) : null}
                        </>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          {/* Table Body */}
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <React.Fragment key={`row-fragment-${row.id}`}>
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-2 py-1 whitespace-nowrap"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
                {row.getIsExpanded() ? (
                  <TableRow className={`row-expand-${row.id}`}>
                    <TableCell colSpan={row.getVisibleCells().length}>
                      {renderSubComponent({ row })}
                    </TableCell>
                  </TableRow>
                ) : null}
              </React.Fragment>
            ))}
          </TableBody>

          {/* Table Footer */}
          <TableFooter>
            {table.getFooterGroups().map((footerGroup) => (
              <TableRow key={footerGroup.id}>
                {footerGroup.headers.map((footer) => (
                  <TableHead
                    key={footer.id}
                    colSpan={footer.colSpan}
                    className="text-[#F3F3F3]"
                    // className="p-2 border shadow whitespace-nowrap text-md border-block"
                  >
                    {flexRender(
                      footer.column.columnDef.footer,
                      footer.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableFooter>
        </Table>
      </div>

      <hr className="my-4" />

      <div className="flex flex-wrap items-center justify-between">
        <div className="flex justify-center w-full md:w-auto">
          <span className="font-bold">
            {table.getPrePaginationRowModel().rows.length} Rows
          </span>
        </div>
        <Pagination table={table} pageSizes={pageSizes} />
      </div>

      <Separator className="my-4" />
    </div>
  );
};
export default DataTable;
