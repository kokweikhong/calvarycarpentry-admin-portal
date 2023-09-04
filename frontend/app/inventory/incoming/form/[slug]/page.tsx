"use client";

import React from "react";

import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { InventoryIncomingEmptyData } from "@/lib/empty-data";

import { LoadingSkeleton } from "@/components/loading-skeleton";

import { useGetIncomingById } from "@/lib/query/inventory-incoming";
import { useGetAllProducts } from "@/lib/query/inventory-products";

import { IncomingForm } from "@/components/inventory/incoming/incoming-form";
import { DataNotFound } from "@/components/data-not-found";

export default function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | undefined };
}) {
  const formType = params.slug;
  const productId = searchParams.id;
  const formColor =
    formType === "create" ? "blue" : formType === "update" ? "orange" : "red";

  const {
    data: dataProducts,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
    error: errorProducts,
  } = useGetAllProducts();

  const {
    data: dataIncoming,
    isLoading: isLoadingIncoming,
    isError: isErrorIncoming,
    error: errorIncoming,
  } = useGetIncomingById(searchParams.id);

  if (isLoadingIncoming || isLoadingProducts) return <LoadingSkeleton />;

  if (isErrorIncoming) return <div>{`${errorIncoming}`}</div>;
  if (isErrorProducts) return <div>{`${errorProducts}`}</div>;

  if (!dataProducts) return <DataNotFound />;

  return (
    <Card className="max-w-[500px]">
      <CardHeader>
        <CardTitle className="tracking-wide">
          Inventory Incoming{" "}
          <span className={`uppercase text-${formColor}-500`}>{formType}</span>{" "}
          Form
        </CardTitle>
      </CardHeader>
      <CardContent>
        <IncomingForm
          dataProducts={dataProducts}
          formData={dataIncoming ?? InventoryIncomingEmptyData}
          formType={formType}
          productId={productId}
        />
      </CardContent>
    </Card>
  );
}
