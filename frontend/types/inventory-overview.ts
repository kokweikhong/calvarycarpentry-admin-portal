import * as z from "zod";

export const InventoryCostingOverviewSchema = z.object({
  monthYear: z.string(),
  incomingCount: z.number(),
  incomingTotalCost: z.number(),
  outgoingCount: z.number(),
  outgoingTotalCost: z.number(),
});

export type InventoryCostingOverviewValues = z.infer<
  typeof InventoryCostingOverviewSchema
>;
