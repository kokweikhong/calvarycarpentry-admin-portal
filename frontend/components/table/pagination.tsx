import { Table } from "@tanstack/react-table";
import React from "react";
import { Button } from "../ui/button";
import {
  ChevronLeft,
  ChevronsLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "../ui/separator";

const Pagination: React.FC<{
  table: Table<any>;
  pageSizes: number[];
}> = ({ table, pageSizes }) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button
        className="text_small"
        onClick={() => table.setPageIndex(0)}
        disabled={!table.getCanPreviousPage()}
        variant={"outline"}
      >
        <ChevronsLeft />
      </Button>
      <Button
        className="text_small"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
        variant={"outline"}
      >
        <ChevronLeft />
      </Button>
      <Button
        className="text_small"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
        variant={"outline"}
      >
        <ChevronRight />
      </Button>
      <Button
        className="text_small"
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        disabled={!table.getCanNextPage()}
        variant={"outline"}
      >
        <ChevronsRight />
      </Button>
      <span className="flex items-center gap-1">
        <strong>
          {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </strong>
      </span>
      <Separator orientation="vertical" className="hidden md:block" />
      <span className="flex flex-wrap items-center gap-1">
        Go to page:
        <Input
          type="number"
          defaultValue={table.getState().pagination.pageIndex + 1}
          onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0;
            table.setPageIndex(page);
          }}
          className="w-16 text-sm"
        />
      </span>
      <Select
        onValueChange={(e) => {
          table.setPageSize(Number(e));
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select page sizes" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Pages</SelectLabel>
            {pageSizes.map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                Show {pageSize}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Pagination;
