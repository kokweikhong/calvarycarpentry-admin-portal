import { z } from "zod";

export const InventoryOutgoingSchema = z.object({
  id: z.number(),
  incomingID: z.number().min(1, { message: "Record is required." }),
  status: z.string(),
  quantity: z.number().min(1, { message: "Quantity is required." }),
  convertedQuantity: z
    .number()
    .min(1, { message: "Converted quantity is required." }),
  cost: z.number(),
  refNo: z.string().min(5, { message: "Reference number is required." }),
  refDoc: z
    .string()
    .min(2, { message: "Reference document is required." })
    .or(
      z.any().refine((file) => file.length === 1, {
        message: "Reference document is required.",
      })
    ),
  remarks: z.string(),
  createdBy: z.string(),
  createdAt: z.date().or(z.string()),
  updatedBy: z.string(),
  updatedAt: z.date().or(z.string()),
});

export type InventoryOutgoingValues = z.infer<typeof InventoryOutgoingSchema>;

export const InventoryOutgoingSummarySchema = InventoryOutgoingSchema.extend({
  productCode: z.string(),
  productName: z.string(),
  supplier: z.string(),
  standardUnit: z.string(),
  length: z.number(),
  width: z.number(),
  thickness: z.number(),
  unit: z.string(),
});

export type InventoryOutgoingSummaryValues = z.infer<
  typeof InventoryOutgoingSummarySchema
>;
