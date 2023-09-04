"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
// React table
import DataTable from "@/components/table/data-table";

import { Separator } from "@/components/ui/separator";
import { InventoryProductColumns } from "@/components/table/columns";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

import { useGetProductsSummary } from "@/lib/query/inventory-products";

import { useToast } from "@/context/toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DataNotFound } from "@/components/data-not-found";

export default function Page() {
  const { setToastMessage } = useToast();

  const {
    data: productSummary,
    isLoading: isLoadingSummary,
    error: errorSummary,
  } = useGetProductsSummary();

  const [imageDialogOpen, setImageDialogOpen] = React.useState<boolean>(false);
  const [imageDialogData, setImageDialogData] = React.useState<{
    title: string;
    image: {
      src: string;
      alt: string;
    };
  }>({
    title: "",
    image: {
      src: "",
      alt: "",
    },
  });

  React.useEffect(() => {
    if (errorSummary) {
      setToastMessage({
        title: "Error",
        message: `error loading product summary: ${errorSummary}`,
        type: "error",
      });
    }
  }, [errorSummary, setToastMessage]);

  // columns definition for react-table
  const inventoryProductColumns = InventoryProductColumns({
    setImageDialogOpen: setImageDialogOpen,
    setImageDialogData: setImageDialogData,
  });

  if (isLoadingSummary) return <LoadingSkeleton />;
  if (errorSummary) return <div>{`Error: ${errorSummary}`}</div>;
  // if (!productSummary) return <div>No data</div>;

  console.log(productSummary);

  return (
    <Card className="bg-white">
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="w-[425px]">
          <DialogHeader>
            <DialogTitle className="capitalize">
              {imageDialogData.title}
            </DialogTitle>
          </DialogHeader>
          <div className="relative h-[300px] w-[425px]">
            <Image
              src={imageDialogData.image.src}
              alt={imageDialogData.image.alt}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        </DialogContent>
      </Dialog>

      <CardHeader className="flex flex-row flex-wrap items-center justify-between w-full gap-2">
        <CardTitle className="flex flex-wrap items-center justify-between gap-2">
          <span>Product Page</span>
          {/* <Link
              href="/inventory/products/form/create"
              className="px-4 py-2 text-base font-medium uppercase rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
            >
              create new product
            </Link> */}
        </CardTitle>
        <CardDescription>
          <Link
            href="/inventory/products/form/create"
            className="px-4 py-2 text-base font-medium uppercase rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
          >
            create new product
          </Link>
        </CardDescription>
      </CardHeader>
      {/* Button to toggle form for creating new product */}
      <Separator className="my-4" />

      <CardContent>
        {/* Product table */}
        {productSummary && productSummary.length > 0 ? (
          <div>
            <DataTable
              data={productSummary}
              columns={inventoryProductColumns}
            />
          </div>
        ) : (
          <DataNotFound />
        )}
      </CardContent>
    </Card>
  );
}
