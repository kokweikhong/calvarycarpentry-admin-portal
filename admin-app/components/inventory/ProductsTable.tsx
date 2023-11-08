"use client";

import React from "react";
import { InventoryProduct, mockInventoryProducts } from "@/types/inventory";

import {
  createColumnHelper,
  useReactTable,
  flexRender,
  SortingState,
  ColumnFiltersState,
  FilterFn,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  RankingInfo,
  rankItem,
  compareItems,
} from "@tanstack/match-sorter-utils";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { Menu, Transition } from "@headlessui/react";

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

const columnHelper = createColumnHelper<InventoryProduct>();

const columns = [
  columnHelper.display({
    id: "checkbox",
    header: "",
    cell: () => (
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="flex items-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
            <span className="sr-only">Open options</span>
            <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
          </Menu.Button>
        </div>

        <Transition
          as={React.Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm"
                    )}
                  >
                    Account settings
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm"
                    )}
                  >
                    Support
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm"
                    )}
                  >
                    License
                  </a>
                )}
              </Menu.Item>
              <form method="POST" action="#">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      type="submit"
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block w-full px-4 py-2 text-left text-sm"
                      )}
                    >
                      Sign out
                    </button>
                  )}
                </Menu.Item>
              </form>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    ),
  }),
  columnHelper.accessor("productCode", {
    header: "Product",
    cell: (info) => (
      <div className="flex items-center">
        <div className="flex-shrink-0 h-10 w-10">
          <img
            className="h-10 w-10 rounded-full"
            src={info.row.original.productThumbnail}
            alt=""
          />
        </div>
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-900">
            {info.row.original.productName}
          </div>
          <div className="text-sm text-gray-500">
            {info.row.original.productCode}
          </div>
        </div>
      </div>
    ),
  }),
  columnHelper.accessor("productName", {
    id: "productName",
  }),
  columnHelper.accessor("brand", {
    header: "Brand",
    cell: (info) => (
      <React.Fragment>
        <div className="text-gray-900">{info.row.original.brand}</div>
        <div className="mt-1 text-gray-500">{info.row.original.supplier}</div>
      </React.Fragment>
    ),
  }),
  columnHelper.accessor("supplier", {
    id: "supplier",
  }),
  columnHelper.accessor("standardUnit", {
    header: "Std Unit",
  }),
  columnHelper.accessor("isExist", {
    header: "Status",
    cell: (info) => (
      <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
        {info.row.original.isExist ? "Active" : "Inactive"}
      </span>
    ),
  }),
  columnHelper.accessor("createdBy", {
    header: "Created",
    cell: (info) => (
      <React.Fragment>
        <div className="text-gray-900">{info.row.original.createdBy}</div>
        <div className="mt-1 text-gray-500">
          {new Date(info.row.original.createdAt).toISOString().slice(0, 10)}
        </div>
      </React.Fragment>
    ),
  }),
  columnHelper.accessor("updatedBy", {
    header: "Updated",
    cell: (info) => (
      <React.Fragment>
        <div className="text-gray-900">{info.row.original.updatedBy}</div>
        <div className="mt-1 text-gray-500">
          {new Date(info.row.original.updatedAt).toISOString().slice(0, 10)}
        </div>
      </React.Fragment>
    ),
  }),
  columnHelper.accessor("remarks", {
    header: "Remarks",
  }),
];

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const ProductsTable = () => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState<string>("");
  const table = useReactTable({
    data: mockInventoryProducts,
    columns,
    initialState: {
      columnVisibility: {
        productName: false,
        supplier: false,
      },
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      sorting,
      globalFilter,
      columnFilters,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Inventory Products
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the products in the inventory.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add Product
          </button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <DebouncedInput
          type="text"
          value={globalFilter ?? ""}
          onChange={(value) => setGlobalFilter(String(value))}
          className="block w-full md:w-[350px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Search all columns..."
        />
        <div className="-mx-4 overflow-auto max-h-[500px] sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        scope="col"
                        className={cn(
                          "sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 px-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter",
                          header.index === 1 ? "px-1" : "",
                          header.index > 3 ? "hidden sm:table-cell" : ""
                        )}
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? "cursor-pointer select-none flex items-center"
                                : "",
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: (
                                <span className="ml-2 rounded text-gray-400">
                                  <ChevronUpIcon className="h-5 w-5" />
                                </span>
                              ),
                              desc: (
                                <span className="ml-2 rounded text-gray-400">
                                  <ChevronDownIcon className="h-5 w-5" />
                                </span>
                              ),
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell, cellIndex) => (
                      <td
                        key={cell.id}
                        className={cn(
                          "whitespace-nowrap py-3.5 px-4 text-sm",
                          cellIndex === 0 ? "px-2" : "",
                          cellIndex > 3 ? "hidden sm:table-cell" : ""
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <nav
          className="flex flex-col lg:flex-row items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
          aria-label="Pagination"
        >
          <div className="">
            <p className="text-sm text-gray-700">
              Showing {""}
              <span className="font-medium">
                {table.getState().pagination.pageIndex + 1}
              </span>{" "}
              of <span className="font-medium">{table.getPageCount()}</span>{" "}
              pages
            </p>
          </div>
          <div className="flex flex-1 justify-between sm:justify-end">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className={cn(
                "relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0",
                !table.getCanPreviousPage() ? "opacity-50" : ""
              )}
            >
              <ChevronDoubleLeftIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className={cn(
                "relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0",
                !table.getCanPreviousPage() ? "opacity-50" : ""
              )}
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className={cn(
                "relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0",
                !table.getCanNextPage() ? "opacity-50" : ""
              )}
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className={cn(
                "relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0",
                !table.getCanNextPage() ? "opacity-50" : ""
              )}
            >
              <ChevronDoubleRightIcon className="w-4 h-4" />
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default ProductsTable;
