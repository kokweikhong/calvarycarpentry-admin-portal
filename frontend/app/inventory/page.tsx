"use client";

import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { CostingOverview } from "@/components/inventory/costing-overview";
import { InventoryOverview } from "@/components/inventory/inventory-overview";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetProductsSummary } from "@/lib/query/inventory-products";
import { Badge } from "@/components/ui/badge";

import { ProductTable } from "@/components/inventory/product-table";

export default function Page() {
  const {
    data: dataSummary,
    isLoading,
    isError,
    error,
  } = useGetProductsSummary();
  return (
    <div className="w-full space-y-2">
      <h1 className="tracking-wider">Inventory Overview</h1>
      <Separator className="my-4" />
      <div className="grid grid-cols-12 space-y-2 md:space-x-2 md:space-y-0">
        <Card className="p-2 col-span-full md:col-span-8">
          <CardHeader>
            <CardTitle>Costing Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-full min-h-[300px]">
              <CostingOverview />
            </div>
          </CardContent>
        </Card>
        <Card className="p-2 col-span-full md:col-span-4">
          <CardHeader>
            <CardTitle>Inventory Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-full min-h-[300px]">
              <InventoryOverview />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Stock</CardTitle>
          {/* <CardDescription>{`Total ${
          dataSummary?.filter((item) => item.isExist).length
        } Available Products`}</CardDescription> */}
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <ProductTable />
        </CardContent>
      </Card>
    </div>
  );
}
