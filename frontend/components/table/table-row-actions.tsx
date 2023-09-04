import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon } from "lucide-react";
import { Row } from "@tanstack/react-table";

export interface TableRowActionsProps<TData> {
  row?: Row<TData>;
  children: React.ReactNode;
}

// @ts-ignore
export const TableRowActions: React.FC<TableRowActionsProps<TData>> = ({
  row,
  children,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center">
        <MoreHorizontalIcon
          size={18}
          className="outline-none focus:outline-none"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {children}
        {/* <DropdownMenuItem>{row.original}</DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
