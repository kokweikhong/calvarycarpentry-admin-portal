import axios from "axios";

import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  InventoryIncomingSummaryValues,
  InventoryIncomingValues,
} from "@/types/inventory-incoming";

const BASE_URL = process.env.NEXT_PUBLIC_API_HOST;
const INVENTORY_INCOMING_URL = `${BASE_URL}/${process.env.NEXT_PUBLIC_API_INVENTORY_PATH}/incoming`;

// get incoming summary
export async function getIncomingSummary(
  availableQty: string
): Promise<InventoryIncomingSummaryValues[]> {
  const url = `${INVENTORY_INCOMING_URL}/summary${
    availableQty != "" && "?availableqty=" + availableQty
  }`;
  return axios.get(url).then((response) => response.data);
}

// get all incoming
export async function getIncoming(): Promise<InventoryIncomingValues[]> {
  const url = `${INVENTORY_INCOMING_URL}`;
  return axios.get(url).then((response) => response.data);
}

// get incoming by id
export async function getIncomingById(
  id: string
): Promise<InventoryIncomingValues> {
  const url = `${INVENTORY_INCOMING_URL}/${id}`;
  return axios.get(url).then((response) => response.data);
}

// create incoming
export async function createIncoming(
  data: FormData
): Promise<InventoryIncomingValues> {
  const url = `${INVENTORY_INCOMING_URL}/create`;
  return axios.post(url, data).then((response) => response.data);
}

// update incoming
export async function updateIncoming(
  id: number,
  data: FormData
): Promise<InventoryIncomingValues> {
  const url = `${INVENTORY_INCOMING_URL}/update/${id}`;
  return axios.post(url, data).then((response) => response.data);
}

// delete incoming
export async function deleteIncoming(id: number): Promise<any> {
  const url = `${INVENTORY_INCOMING_URL}/delete/${id}`;
  return axios.post(url).then((response) => response.data);
}

export const useGetIncomingSummary = (availableQty: string) => {
  return useQuery({
    queryKey: ["incoming", "summary", "availableQty"],
    queryFn: () => getIncomingSummary(availableQty),
  });
};

export const useGetIncoming = () => {
  return useQuery("incoming", getIncoming);
};

export const useGetIncomingById = (id: string | undefined) => {
  return useQuery({
    queryKey: ["incoming", id],
    queryFn: () => getIncomingById(id as string),
    enabled: !!id,
  });
};

export const useCreateIncoming = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => createIncoming(data),
    onSuccess: () => {
      queryClient.invalidateQueries("incoming");
    },
  });
};

export const useUpdateIncoming = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) =>
      updateIncoming(data.get("id") as unknown as number, data),
    onSuccess: () => {
      queryClient.invalidateQueries("incoming");
    },
  });
};

export const useDeleteIncoming = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteIncoming(id),
    onSuccess: () => {
      queryClient.invalidateQueries("incoming");
    },
  });
};
