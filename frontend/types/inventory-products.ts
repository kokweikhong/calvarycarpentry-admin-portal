import * as z from "zod";

export const InventoryProductSchema = z.object({
  id: z.number(),
  productCode: z.string().min(2, { message: "Product code is required." }),
  productName: z.string().min(2, { message: "Product Name is required." }),
  brand: z.string().min(2, { message: "Brand is required." }),
  standardUnit: z.string().min(1, { message: "Standard unit is required." }),
  productThumbnail: z
    .string()
    .min(2, "Thumbnail is required")
    .or(
      z.any().refine((file) => file.length === 1, {
        message: "Thumbnail is required.",
      })
    ),
  supplier: z.string().min(2, { message: "Supplier is required." }),
  remarks: z.string(),
  isExist: z.boolean(),
  createdBy: z.string(),
  createdAt: z.date().or(z.string()),
  updatedBy: z.string(),
  updatedAt: z.date().or(z.string()),
});

export type InventoryProductValues = z.infer<typeof InventoryProductSchema>;

export const InventoryProductsSummarySchema = InventoryProductSchema.extend({
  sumIncomingConvertedQuantity: z.number(),
  sumIncomingCost: z.number(),
  sumOutgoingConvertedQuantity: z.number(),
  sumOutgoingCost: z.number(),
  availableQuantity: z.number(),
});

export type InventoryProductsSummaryValues = z.infer<
  typeof InventoryProductsSummarySchema
>;

export interface IInventoryProduct {
  id?: number;
  productCode: string;
  productName: string;
  brand: string;
  standardUnit: string;
  productThumbnail: string | FileList;
  supplier: string;
  remarks?: string;
  isExist: boolean;
  createdBy: string;
  createdAt: Date | string;
  updatedBy: string;
  updatedAt?: Date | string;
}

export interface IInventoryProductsSummary extends IInventoryProduct {
  sumIncomingConvertedQuantity: number;
  sumIncomingCost: number;
  sumOutgoingConvertedQuantity: number;
  sumOutgoingCost: number;
  availableQuantity: number;
}
