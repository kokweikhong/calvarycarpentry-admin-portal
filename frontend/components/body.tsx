"use client";

import React from "react";
import Header from "./Header";
import Sidebar from "./sidebar";
import { useSidebarContext } from "@/context/sidebar";
import { cn } from "@/lib/utils";

export const Body: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setSidebarOpen, sidebarOpen } = useSidebarContext();

  React.useEffect(() => {
    if (window !== undefined) {
      if (window.innerWidth > 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    }
  }, [setSidebarOpen]);
  return (
    <main className="relative w-full h-screen bg-[#eeeef1]">
      <Header className="fixed h-[85px] top-0 left-0 z-20 w-full" />
      <Sidebar
        className={cn(
          "absolute md:fixed md:pt-[105px] top-0 left-0 z-10 h-full w-[250px]",
          "transition-all duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      />
      <div
        className={cn(
          "relative md:ml-[250px] mt-[85px] overflow-hidden",
          "transition-all duration-300 ease-in-out",
          `${sidebarOpen ? "md:ml-[250px]" : "md:ml-0"}`
        )}
      >
        <div className="w-full p-4 overflow-x-hidden overflow-y-auto">
          {children}
        </div>
      </div>
    </main>
  );
};
