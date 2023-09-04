"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

import { MenuIcon } from "lucide-react";

import { Button } from "./ui/button";
import { UserBadge } from "./user-badge";

import { useSidebarContext } from "@/context/sidebar";
import { cn } from "@/lib/utils";

export default function Header(props: { className?: string }) {
  const { sidebarOpen, setSidebarOpen } = useSidebarContext();
  const className = cn(
    "flex justify-between items-center p-4 border-b shadow-md bg-white",
    props.className
  );
  return (
    <header className={className}>
      <div className="flex items-center w-full gap-4">
        <div className="flex items-center md:gap-4">
          <Link
            href={"/"}
            className="flex items-center p-2 w-[70px] md:w-[180px] h-[50px] relative"
          >
            <Image
              src="/admin_system.png"
              alt="logo"
              fill
              sizes="(max-width: 180px)"
              priority
              className="hidden md:block"
            />
            <Image
              src="/admin_system_minimal.png"
              alt="logo"
              fill
              sizes="(max-width: 180px)"
              priority
              className="md:hidden"
            />
          </Link>
          <Button
            variant={"ghost"}
            className="bg-transparent border-none outline-none focus:outline-none focus:border-none hover:bg-transparent"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <MenuIcon />
          </Button>
        </div>
        <nav className="flex items-center gap-4 ml-auto">
          <UserBadge />
        </nav>
      </div>
    </header>
  );
}
