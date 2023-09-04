import React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

import inventoryImage from "../public/images/inventory_home.png";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-white">
      <h1
        className={cn(
          "text-gray-700 leading-[80px] tracking-wider text-center",
          "mt-10 mb-4"
        )}
      >
        Calvary Carpentry Admin Portal
      </h1>
      <div className="relative w-auto h-[500px] animate-bounce-slow">
        <Image
          src={inventoryImage}
          alt="Inventory"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
}
