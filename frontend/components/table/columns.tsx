import React from "react";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { InventoryProductsSummaryValues } from "@/types/inventory-products";
import { InventoryIncomingSummaryValues } from "@/types/inventory-incoming";
import {
  InventoryOutgoingValues,
  InventoryOutgoingSummaryValues,
} from "@/types/inventory-outgoing";

import { TableRowActions } from "./table-row-actions";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

import {
  Trash2Icon,
  EditIcon,
  PlusIcon,
  ToggleRightIcon,
  ToggleLeftIcon,
  AlertTriangleIcon,
  ImageIcon,
  PaperclipIcon,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { HOST_UPLOADS } from "@/types/environment-variables";

export interface InventoryProductColumnsProps {
  setImageDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setImageDialogData?: React.Dispatch<React.SetStateAction<any>>;
}

export const InventoryProductColumns = ({
  setImageDialogOpen,
  setImageDialogData,
}: InventoryProductColumnsProps): ColumnDef<InventoryProductsSummaryValues>[] => {
  return React.useMemo<ColumnDef<InventoryProductsSummaryValues>[]>(
    () => [
      {
        id: "row-menu",
        header: () => null,
        cell: ({ row }) => {
          return (
            <TableRowActions row={row}>
              <Link
                href={`/inventory/products/form/update?id=${row.original.id}`}
                className="flex gap-2 p-0 hover:text-blue-500"
              >
                <EditIcon
                  size={18}
                  className="cursor-pointer hover:text-blue-500"
                />
                <span>Edit</span>
              </Link>
              <Link
                href={`/inventory/products/form/delete?id=${row.original.id}`}
                className="flex gap-2 p-0 hover:text-red-500"
              >
                <Trash2Icon
                  size={18}
                  className="cursor-pointer hover:text-red-500"
                />
                <span>Delete</span>
              </Link>
              <Separator className="my-2" />
              <Link
                href={`/inventory/incoming/form/create?product=${row.original.id}`}
                passHref
                className="flex gap-2 p-0 bg-transparent border-none outline-none hover:bg-transparent hover:text-blue-500"
              >
                <PlusIcon size={18} />
                <span>Incoming</span>
              </Link>
            </TableRowActions>
          );
        },
      },
      {
        id: "expander",
        header: () => null,
        cell: ({ row }) => {
          return row.getCanExpand() ? (
            <Button
              {...{
                variant: "outline",
                className:
                  "p-0 border-none outline-none bg-transparent hover:bg-transparent flex",
                onClick: row.getToggleExpandedHandler(),
              }}
            >
              {row.getIsExpanded() ? (
                <ToggleRightIcon color="#0000FF" size={18} />
              ) : (
                <ToggleLeftIcon color="#FF0000" size={18} />
              )}
            </Button>
          ) : (
            <AlertTriangleIcon color="#FFFF00" size={18} />
          );
        },
      },

      {
        id: "product-thumbnail",
        header: () => null,
        cell: ({ cell }) => (
          // <Button
          //   variant={"link"}
          //   className="p-0 hover:text-blue-500"
          //   onClick={() => {
          //     setImageDialogOpen(true);
          //     if (setImageDialogData) {
          //       console.log(HOST_UPLOADS, cell.row.original.productThumbnail);
          //       setImageDialogData({
          //         title: "Product Thumbnail",
          //         image: {
          //           src: `${HOST_UPLOADS}/${cell.row.original.productThumbnail}`,
          //           alt: "thumbnail",
          //         },
          //       });
          //     }
          //   }}
          // >
          <Link href={`${HOST_UPLOADS}/${cell.row.original.productThumbnail}`}>
            <ImageIcon size={18} />
          </Link>
          // </Button>
        ),
      },
      {
        header: "Code",
        accessorKey: "productCode",
        footer: "Code",
      },
      {
        header: "Name",
        accessorKey: "productName",
        footer: "Name",
      },
      {
        header: "Brand",
        accessorKey: "brand",
        footer: "Brand",
      },
      {
        header: "Std Unit",
        accessorKey: "standardUnit",
        footer: "Std Unit",
      },
      {
        header: "Available Qty",
        accessorKey: "availableQuantity",
        footer: "Available Qty",
      },
      {
        accessorKey: "sumIncomingConvertedQuantity",
        header: "Sum Incoming Qty",
        footer: "Sum Incoming Qty",
      },
      {
        accessorKey: "sumOutgoingConvertedQuantity",
        header: "Sum Outgoing Qty",
        footer: "Sum Outgoing Qty",
      },
      {
        accessorKey: "sumIncomingCost",
        header: "Sum Incoming Cost",
        footer: "Sum Incoming Cost",
      },
      {
        accessorKey: "sumOutgoingCost",
        header: "Sum Outgoing Cost",
        footer: "Sum Outgoing Cost",
      },
      {
        header: "IsExist",
        accessorKey: "isExist",
        footer: "IsExist",
      },
      {
        header: "Remarks",
        accessorKey: "remarks",
        footer: "Remarks",
      },
      {
        header: "Created By",
        footer: "Created By",
        accessorKey: "createdBy",
      },
      {
        header: "Created At",
        footer: "Created At",
        cell: ({ cell }) => (
          <span>{new Date(cell.row.original.createdAt).toDateString()}</span>
        ),
      },
      {
        header: "Updated By",
        footer: "Updated By",
        accessorKey: "updatedBy",
      },
      {
        header: "Updated At",
        footer: "Updated At",
        cell: ({ cell }) => (
          <span>{new Date(cell.row.original.updatedAt).toDateString()}</span>
        ),
      },
    ],
    [setImageDialogData, setImageDialogOpen]
  );
};

export const InventoryIncomingColumns =
  (): ColumnDef<InventoryIncomingSummaryValues>[] => {
    return React.useMemo<ColumnDef<InventoryIncomingSummaryValues>[]>(
      () => [
        {
          id: "row-menu",
          header: () => null,
          cell: ({ row }) => {
            return (
              <TableRowActions row={row}>
                <Link
                  href={`/inventory/incoming/form/update?id=${row.original.id}`}
                  className="flex gap-2 p-0 hover:text-blue-500"
                >
                  <EditIcon
                    size={18}
                    className="cursor-pointer hover:text-blue-500"
                  />
                  <span>Edit</span>
                </Link>
                <Link
                  href={`/inventory/incoming/form/delete?id=${row.original.id}`}
                  className="flex gap-2 p-0 hover:text-red-500"
                >
                  <Trash2Icon
                    size={18}
                    className="cursor-pointer hover:text-red-500"
                  />
                  <span>Delete</span>
                </Link>
                <Separator className="my-2" />
                <Link
                  href={`/inventory/outgoing/form/create?incoming=${row.original.id}`}
                  passHref
                  className="flex gap-2 p-0 bg-transparent border-none outline-none hover:bg-transparent hover:text-blue-500"
                >
                  <PlusIcon size={18} />
                  <span>Outgoing</span>
                </Link>
              </TableRowActions>
            );
          },
        },
        {
          id: "expander",
          header: () => null,
          cell: ({ row }) => {
            return row.getCanExpand() ? (
              <button
                {...{
                  onClick: row.getToggleExpandedHandler(),
                }}
              >
                {row.getIsExpanded() ? (
                  <ToggleRightIcon size={18} color="#0000FF" />
                ) : (
                  <ToggleLeftIcon color="#FF0000" size={18} />
                )}
              </button>
            ) : (
              <AlertTriangleIcon color="#FFFF00" size={18} />
            );
          },
        },

        {
          header: "Ref No",
          accessorKey: "refNo",
          footer: "Ref No",
        },
        {
          header: "Ref Doc",
          accessorKey: "refDoc",
          cell: ({ cell }) => (
            <Link
              href={`${HOST_UPLOADS}/${cell.row.original.refDoc}`}
              className="text-blue-500"
            >
              <PaperclipIcon size={18} />
            </Link>
          ),
          footer: "Ref Doc",
        },
        {
          header: "Product",
          accessorKey: "productID",
          footer: "Product",
        },
        {
          header: "Product Code",
          accessorKey: "productCode",
          footer: "Product Code",
        },
        {
          header: "Product Name",
          accessorKey: "productName",
          footer: "Product Name",
        },
        {
          header: "Status",
          accessorKey: "status",
          footer: "Status",
        },
        {
          header: "Quantity",
          accessorKey: "quantity",
          footer: "Quantity",
        },
        {
          header: "Unit",
          footer: "Unit",
          accessorKey: "unit",
        },
        {
          header: "Length",
          accessorKey: "length",
          footer: "Length",
        },
        {
          header: "Width",
          accessorKey: "width",
          footer: "Width",
        },
        {
          header: "Thickness",
          accessorKey: "thickness",
          footer: "Thickness",
        },
        {
          header: "Converted Qty",
          accessorKey: "convertedQuantity",
          footer: "Converted Qty",
        },

        {
          header: "Converted Unit",
          accessorKey: "standardUnit",
          footer: "Converted Unit",
        },

        {
          header: "Cost",
          accessorKey: "cost",
          footer: "Cost",
        },

        {
          header: "Store Country",
          accessorKey: "storeCountry",
          footer: "Store Country",
        },
        {
          header: "Store Loc",
          accessorKey: "storeLocation",
          footer: "Store Loc",
        },
        {
          header: "Remarks",
          accessorKey: "remarks",
          footer: "Remarks",
        },
        {
          header: "Sum Outgoing Qty",
          accessorKey: "sumOutgoingConvertedQuantity",
          footer: "Sum Outgoing Qty",
        },
        {
          header: "Sum Outgoing Quantity",
          footer: "Sum Outgoing Quantity",
          accessorKey: "sumOutgoingQuantity",
        },
        {
          header: "Sum Outgoing Cost",
          accessorKey: "sumOutgoingCost",
          footer: "Sum Outgoing Cost",
        },
        {
          header: "Available Qty",
          accessorKey: "availableQuantity",
          footer: "Available Qty",
        },
        {
          header: "Available Converted Qty",
          footer: "Available Converted Qty",
          accessorKey: "availableConvertedQuantity",
        },
        {
          header: "Created By",
          footer: "Created By",
          accessorKey: "createdBy",
        },
        {
          header: "Created At",
          footer: "Created At",
          cell: ({ cell }) => (
            <span>{new Date(cell.row.original.createdAt).toDateString()}</span>
          ),
        },
        {
          header: "Updated By",
          footer: "Updated By",
          accessorKey: "updatedBy",
        },
        {
          header: "Updated At",
          footer: "Updated At",
          cell: ({ cell }) => (
            <span>{new Date(cell.row.original.updatedAt).toDateString()}</span>
          ),
        },
      ],
      []
    );
  };

export const InventoryOutgoingColumns =
  (): ColumnDef<InventoryOutgoingSummaryValues>[] => {
    return React.useMemo<ColumnDef<InventoryOutgoingSummaryValues>[]>(
      () => [
        {
          id: "row-menu",
          header: () => null,
          cell: ({ row }) => {
            return (
              <TableRowActions row={row}>
                <Link
                  href={`/inventory/outgoing/form/update?id=${row.original.id}`}
                  className="flex gap-2 p-0 hover:text-blue-500"
                >
                  <EditIcon
                    size={18}
                    className="cursor-pointer hover:text-blue-500"
                  />
                  <span>Edit</span>
                </Link>
                <Link
                  href={`/inventory/outgoing/form/delete?id=${row.original.id}`}
                  className="flex gap-2 p-0 hover:text-red-500"
                >
                  <Trash2Icon
                    size={18}
                    className="cursor-pointer hover:text-red-500"
                  />
                  <span>Delete</span>
                </Link>
                <Separator className="my-2" />
                <Link
                  href={`/inventory/outgoing/form/create?id=${row.original.incomingID}`}
                  passHref
                  className="flex gap-2 p-0 bg-transparent border-none outline-none hover:bg-transparent hover:text-blue-500"
                >
                  <PlusIcon size={18} />
                  <span>Outgoing</span>
                </Link>
              </TableRowActions>
            );
          },
        },
        {
          id: "expander",
          header: () => null,
          cell: ({ row }) => {
            return row.getCanExpand() ? (
              <button
                {...{
                  onClick: row.getToggleExpandedHandler(),
                }}
              >
                {row.getIsExpanded() ? (
                  <ToggleRightIcon size={18} color="#0000FF" />
                ) : (
                  <ToggleLeftIcon color="#FF0000" size={18} />
                )}
              </button>
            ) : (
              <AlertTriangleIcon color="#FFFF00" size={18} />
            );
          },
        },
        {
          header: "Incoming ID",
          accessorKey: "incomingID",
          footer: "Incoming ID",
        },
        {
          header: "Ref No",
          accessorKey: "refNo",
          footer: "Ref No",
        },
        {
          header: "Ref Doc",
          accessorKey: "refDoc",
          cell: ({ cell }) => (
            <Link
              href={`${HOST_UPLOADS}/${cell.row.original.refDoc}`}
              className="text-blue-500"
            >
              <PaperclipIcon size={18} />
            </Link>
          ),
          footer: "Ref Doc",
        },
        {
          header: "Product Code",
          accessorKey: "productCode",
          footer: "Product Code",
        },
        {
          header: "Product Name",
          accessorKey: "productName",
          footer: "Product Name",
        },
        {
          header: "Supplier",
          footer: "Supplier",
          accessorKey: "supplier",
        },
        {
          header: "Status",
          accessorKey: "status",
          footer: "Status",
        },
        {
          header: "Quantity",
          accessorKey: "quantity",
          footer: "Quantity",
        },

        {
          header: "Length",
          accessorKey: "length",
          footer: "Length",
        },
        {
          header: "Width",
          accessorKey: "width",
          footer: "Width",
        },
        {
          header: "Thickness",
          accessorKey: "thickness",
          footer: "Thickness",
        },
        {
          header: "Unit",
          footer: "Unit",
          accessorKey: "unit",
        },

        {
          header: "Converted Qty",
          accessorKey: "convertedQuantity",
          footer: "Converted Qty",
        },

        {
          header: "Standard Unit",
          accessorKey: "standardUnit",
          footer: "Unit",
        },

        {
          header: "Cost",
          accessorKey: "cost",
          footer: "Cost",
        },

        {
          header: "Remarks",
          accessorKey: "remarks",
          footer: "Remarks",
        },
        {
          header: "Created By",
          footer: "Created By",
          accessorKey: "createdBy",
        },
        {
          header: "Created At",
          footer: "Created At",
          cell: ({ cell }) => (
            <span>{new Date(cell.row.original.createdAt).toDateString()}</span>
          ),
        },
        {
          header: "Updated By",
          footer: "Updated By",
          accessorKey: "updatedBy",
        },
        {
          header: "Updated At",
          footer: "Updated At",
          cell: ({ cell }) => (
            <span>{new Date(cell.row.original.updatedAt).toDateString()}</span>
          ),
        },
      ],
      []
    );
  };
