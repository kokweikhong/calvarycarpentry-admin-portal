import axios from "axios";
import { InventoryCostingOverviewValues } from "@/types/inventory-overview";
import { useQuery, useMutation, useQueryClient } from "react-query";

const BASE_URL = process.env.NEXT_PUBLIC_API_HOST;
const INVENTORY_OVERVIEW_URL = `${BASE_URL}/${process.env.NEXT_PUBLIC_API_INVENTORY_PATH}/overview`;

const inventoryOverviewAPI = axios.create({
  baseURL: INVENTORY_OVERVIEW_URL,
});

// get inventory costing overview
export async function getInventoryCostingOverview(): Promise<
  InventoryCostingOverviewValues[]
> {
  // const url = `${INVENTORY_OVERVIEW_URL}`;
  return inventoryOverviewAPI.get("/costing").then((response) => response.data);
}

export function useInventoryCostingOverview() {
  return useQuery("inventoryCostingOverview", getInventoryCostingOverview);
}
