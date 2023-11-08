"use client";

import ProductForm from "@/components/inventory/ProductForm";
import { emptyInventoryProduct, InventoryProduct } from "@/types/inventory";

export default function Page({ params }: { params: { slug: string } }) {
  console.log(params.slug);
  const formType = params.slug[0];
  if (formType === "update") {
    console.log(params.slug[1]);
  }
  return (
    <div>
      <h1>Hi</h1>
      <ProductForm />
    </div>
  );
}
