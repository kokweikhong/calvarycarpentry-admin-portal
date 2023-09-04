"use client";

import React from "react";
import Link from "next/link";
import DataTable from "@/components/table/data-table";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { useGetIncomingSummary } from "@/lib/query/inventory-incoming";
import { InventoryIncomingColumns } from "@/components/table/columns";
import { DataNotFound } from "@/components/data-not-found";

export default function Page() {
  const {
    data: dataIncomingSummary,
    isLoading: isLoadingIncomingSummary,
    isError: isErrorIncomingSummary,
    error: errorIncomingSummary,
  } = useGetIncomingSummary("-9999");

  const columns = InventoryIncomingColumns();

  if (isLoadingIncomingSummary) {
    return <LoadingSkeleton />;
  }

  if (isErrorIncomingSummary) {
    return <div>{`${errorIncomingSummary}`}</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between w-full gap-2">
        <CardTitle>Inventory Incoming Records</CardTitle>
        <Link
          href="/inventory/incoming/form/create"
          className="px-4 py-2 font-medium uppercase rounded-md text-primary-foreground bg-primary hover:bg-primary/90"
        >
          Create New Incoming Record
        </Link>
      </CardHeader>
      <CardContent>
        {dataIncomingSummary && dataIncomingSummary.length > 0 ? (
          <DataTable data={dataIncomingSummary} columns={columns} />
        ) : (
          <DataNotFound />
        )}
      </CardContent>
    </Card>
  );
}
