import { z } from "zod";

export const InventoryIncomingSchema = z.object({
  id: z.number(),
  productID: z.number().min(1, { message: "Product is required." }),
  status: z.string(),
  quantity: z.number().min(1, { message: "Quantity is required." }),
  length: z.number(),
  width: z.number(),
  thickness: z.number(),
  unit: z.string(),
  convertedQuantity: z.number(),
  refNo: z.string().min(5, { message: "Reference number is required." }),
  refDoc: z
    .string()
    .min(2, { message: "Reference document is required." })
    .or(
      z.any().refine((file) => file.length === 1, {
        message: "Reference document is required.",
      })
    ),
  cost: z.number().min(1, { message: "Cost is required." }),
  storeLocation: z.string(),
  storeCountry: z.string(),
  remarks: z.string(),
  createdBy: z.string(),
  createdAt: z.date().or(z.string()),
  updatedBy: z.string(),
  updatedAt: z.date().or(z.string()),
});

export type InventoryIncomingValues = z.infer<typeof InventoryIncomingSchema>;

export const InventoryIncomingSummarySchema = InventoryIncomingSchema.extend({
  productCode: z.string(),
  productName: z.string(),
  supplier: z.string(),
  standardUnit: z.string(),
  sumOutgoingQuantity: z.number(),
  sumOutgoingConvertedQuantity: z.number(),
  sumOutgoingCost: z.number(),
  availableQuantity: z.number(),
  availableConvertedQuantity: z.number(),
});

export type InventoryIncomingSummaryValues = z.infer<
  typeof InventoryIncomingSummarySchema
>;
