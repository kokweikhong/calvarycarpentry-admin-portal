"use client";

import React from "react";

import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { useGetOutgoingById } from "@/lib/query/inventory-outgoing";

import { OutgoingForm } from "@/components/inventory/outgoing/outgoing-form";

import { InventoryOutgoingEmptyData } from "@/lib/empty-data";

export default function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const formType = params.slug;

  const outGoingId = searchParams.id;
  const incomingId = searchParams.incoming as string;
  console.log(incomingId);
  const formColor =
    formType === "create" ? "blue" : formType === "update" ? "orange" : "red";

  const {
    data: dataOutgoing,
    isLoading: isLoadingOutgoing,
    isError: isErrorOutgoing,
    error: errorOutgoing,
  } = useGetOutgoingById(outGoingId as string);

  if (isLoadingOutgoing) return <div>Loading...</div>;

  if (isErrorOutgoing) return <div>{`${errorOutgoing}`}</div>;

  if (formType === "delete" || formType === "update") {
    if (!dataOutgoing) return <div>{`Outgoing ${outGoingId} not found`}</div>;
  }

  return (
    <Card className="max-w-[450px]">
      <CardHeader>
        <CardTitle className="tracking-wide">
          Inventory Outgoing{" "}
          <span className={`uppercase text-${formColor}-500`}>{formType}</span>{" "}
          Form
        </CardTitle>
      </CardHeader>

      <CardContent>
        <OutgoingForm
          formType={formType}
          formData={dataOutgoing ?? InventoryOutgoingEmptyData}
          incomingIdParam={incomingId}
        />
      </CardContent>
    </Card>
  );
}
