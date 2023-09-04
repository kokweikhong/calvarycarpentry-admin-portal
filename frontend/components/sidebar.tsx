"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Warehouse, Users, FormInput, X, ChevronRight } from "lucide-react";
import { useSidebarContext } from "@/context/sidebar";

import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";

import { cn } from "@/lib/utils";

const ToggleableMenu: React.FC<{
  children?: React.ReactNode;
  icon?: JSX.Element;
  title: string;
  className?: string;
}> = ({ children, icon, title, className }) => {
  const [show, setShow] = React.useState(false);
  return (
    <li className="px-3 py-2 list-none">
      <Link
        href="#"
        onClick={() => setShow(!show)}
        className={cn(
          "hover:text-primary",
          "transition-all duration-300",
          "flex gap-2 items-center relative w-full",
          className
        )}
      >
        {icon}
        <span className="inline-block font-medium text-[16px]">{title}</span>
        <ChevronRight
          size={18}
          className={cn(
            "absolute right-0 -translate-y-1/2 top-1/2",
            "transition-all duration-300",
            show && "transform rotate-90"
          )}
        />
      </Link>
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          "pl-4 overflow-hidden",
          show ? "h-auto opacity-100" : "h-0 opacity-0"
        )}
      >
        {children}
      </div>
    </li>
  );
};

const MenuItem: React.FC<{
  children?: React.ReactNode;
  href: string;
}> = ({ children, href }) => {
  const pathname = usePathname();
  return (
    <li className="w-full px-3 py-2">
      <Link
        href={href}
        className={cn(
          "hover:text-primary hover:pl-5",
          "transition-all duration-300",
          "text-[14px]",
          pathname === href && "text-primary"
        )}
      >
        {children}
      </Link>
    </li>
  );
};

export default function Sidebar(props: { className?: string }) {
  const { sidebarOpen, setSidebarOpen } = useSidebarContext();
  const pathname = usePathname();

  return (
    <div className={cn("border-r shadow-md bg-white", props.className)}>
      <div className="w-full h-full">
        <div className="relative flex items-center px-5 pt-4 md:pt-0">
          <h5 className="">Menu</h5>
          <Button
            variant={"ghost"}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={cn(
              "absolute right-0 pt-4 md:pt-0 pr-3 pb-0 -translate-y-1/2",
              "hover:bg-transparent hover top-1/2",
              "group"
            )}
          >
            <X size={18} className="group-hover:animate-spin" />
          </Button>
        </div>
        <Separator className="my-2" />
        <ul className="h-full overflow-y-auto">
          <ScrollArea>
            <ToggleableMenu
              title="Inventory"
              icon={<Warehouse size={20} />}
              className={cn(
                pathname.match("/inventory(?!.*form)") && "text-primary"
              )}
            >
              <ul className="flex flex-col w-full">
                <MenuItem href="/inventory">Dashboard</MenuItem>
                <MenuItem href="/inventory/products">Products</MenuItem>
                <MenuItem href="/inventory/incoming">Incoming</MenuItem>
                <MenuItem href="/inventory/outgoing">Outgoing</MenuItem>
              </ul>
            </ToggleableMenu>
            <ToggleableMenu
              title="Users"
              icon={<Users size={20} />}
              className={cn(
                pathname.match("^/users(?!.*form)") && "text-primary"
              )}
            >
              <ul className="flex flex-col w-full">
                <MenuItem href="/users">Dashboard</MenuItem>
              </ul>
            </ToggleableMenu>
            <ToggleableMenu
              title="Form"
              icon={<FormInput size={20} />}
              className={cn(pathname.includes("form") && "text-primary")}
            >
              <ul className="flex flex-col w-full">
                <MenuItem href="/users/form/create">Create User</MenuItem>
                <MenuItem href="/inventory/products/form/create">
                  Create Products
                </MenuItem>
                <MenuItem href="/inventory/incoming/form/create">
                  Create Incoming
                </MenuItem>
                <MenuItem href="/inventory/outgoing/form/create">
                  Create Outgoing
                </MenuItem>
              </ul>
            </ToggleableMenu>
          </ScrollArea>
        </ul>
      </div>
    </div>
  );
}
