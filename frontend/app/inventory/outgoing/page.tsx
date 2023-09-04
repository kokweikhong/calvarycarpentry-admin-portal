"use client";

import React from "react";
import Link from "next/link";
import DataTable from "@/components/table/data-table";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { useGetOutgoingSummary } from "@/lib/query/inventory-outgoing";
import { InventoryOutgoingColumns } from "@/components/table/columns";
import { DataNotFound } from "@/components/data-not-found";

export default function Page() {
  const {
    data: dataOutgoing,
    isLoading: isLoadingOutgoing,
    isError: isErrorOutgoing,
    error: errorOutgoing,
  } = useGetOutgoingSummary();

  const columns = InventoryOutgoingColumns();

  if (isLoadingOutgoing) {
    return <LoadingSkeleton />;
  }

  if (isErrorOutgoing) {
    return <div>{`${errorOutgoing}`}</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
        <CardTitle>Inventory Outgoing Records</CardTitle>
        <Link
          href="/inventory/outgoing/form/create"
          className="px-4 py-2 font-medium uppercase rounded-md text-primary-foreground bg-primary hover:bg-primary/90"
        >
          Create New Outgoing Record
        </Link>
      </CardHeader>
      <CardContent>
        {!dataOutgoing ? (
          <DataNotFound />
        ) : (
          <DataTable data={dataOutgoing} columns={columns} />
        )}
      </CardContent>
    </Card>
  );
}
