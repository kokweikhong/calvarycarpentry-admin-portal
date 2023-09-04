"use client";

import React from "react";

import { useToast } from "@/context/toast";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useGetProductById } from "@/lib/query/inventory-products";

import { ProductForm } from "@/components/inventory/products/product-form";

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
    data: dataProduct,
    isLoading: isLoadingProduct,
    isError: isErrorProduct,
    error: errorProduct,
  } = useGetProductById(formType === "create" ? "" : productId || "");

  const { setToastMessage } = useToast();

  React.useEffect(() => {
    if (isErrorProduct) {
      setToastMessage({
        title: "Error",
        message: `error loading product: ${errorProduct}`,
        type: "error",
      });
    }
  }, [errorProduct, isErrorProduct, setToastMessage]);

  if (isLoadingProduct) return <LoadingSkeleton />;

  if (isErrorProduct) return <div>{`${errorProduct}`}</div>;

  if (formType === "update" || formType === "delete") {
    if (!dataProduct) {
      return <div>Product not found</div>;
    }
  }

  return (
    <Card className="max-w-[500px]">
      <CardHeader>
        <CardTitle>
          Inventory Product{" "}
          <span className={`uppercase text-${formColor}-500`}>{formType}</span>{" "}
          Form
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ProductForm formType={formType} formData={dataProduct} />
      </CardContent>
    </Card>
  );
}
