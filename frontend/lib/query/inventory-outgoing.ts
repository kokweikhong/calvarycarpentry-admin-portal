import axios from "axios";

import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  InventoryOutgoingValues,
  InventoryOutgoingSummaryValues,
} from "@/types/inventory-outgoing";

const BASE_URL = process.env.NEXT_PUBLIC_API_HOST;
const INVENTORY_OUTGOING_URL = `${BASE_URL}/${process.env.NEXT_PUBLIC_API_INVENTORY_PATH}/outgoing`;

const inventoryOutgoingAPI = axios.create({ baseURL: INVENTORY_OUTGOING_URL });

// get all outgoing
export async function getOutgoing(): Promise<InventoryOutgoingValues[]> {
  return inventoryOutgoingAPI.get("").then((response) => response.data);
}

// get outgoing summary
export async function getOutgoingSummary(): Promise<
  InventoryOutgoingSummaryValues[]
> {
  return inventoryOutgoingAPI.get("/summary").then((response) => response.data);
}

// get outgoing by id
export async function getOutgoingById(
  id: string
): Promise<InventoryOutgoingValues> {
  return inventoryOutgoingAPI.get(`/${id}`).then((response) => response.data);
}

// create outgoing
export async function createOutgoing(
  formData: FormData
): Promise<InventoryOutgoingValues> {
  return inventoryOutgoingAPI
    .post("/create", formData)
    .then((response) => response.data);
}

// update outgoing
export async function updateOutgoing(
  id: string,
  formData: FormData
): Promise<InventoryOutgoingValues> {
  return inventoryOutgoingAPI
    .post(`/update/${id}`, formData)
    .then((response) => response.data);
}

// delete outgoing
export async function deleteOutgoing(
  id: string
): Promise<InventoryOutgoingValues> {
  return inventoryOutgoingAPI
    .post(`/delete/${id}`)
    .then((response) => response.data);
}

export function useGetAllOutgoing() {
  return useQuery<InventoryOutgoingValues[]>("outgoing", getOutgoing);
}

export function useGetOutgoingById(id: string) {
  return useQuery<InventoryOutgoingValues>(
    ["outgoing", id],
    () => getOutgoingById(id),
    {
      enabled: !!id,
    }
  );
}

export function useGetOutgoingSummary() {
  return useQuery<InventoryOutgoingSummaryValues[]>(
    "outgoing-summary",
    getOutgoingSummary
  );
}

export function useCreateOutgoing() {
  const queryClient = useQueryClient();
  return useMutation((formData: FormData) => createOutgoing(formData), {
    onSuccess: () => {
      queryClient.invalidateQueries("outgoing");
    },
  });
}

export function useUpdateOutgoing() {
  const queryClient = useQueryClient();
  return useMutation(
    (formData: FormData) =>
      updateOutgoing(formData.get("id") as string, formData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("outgoing");
      },
    }
  );
}

export function useDeleteOutgoing() {
  const queryClient = useQueryClient();
  return useMutation((id: string) => deleteOutgoing(id), {
    onSuccess: () => {
      queryClient.invalidateQueries("outgoing");
    },
    onError: (error) => {
      console.log(error);
    },
  });
}
