import axios from "axios";
import {
  InventoryProductValues,
  InventoryProductsSummaryValues,
} from "@/types/inventory-products";
import { useQuery, useMutation, useQueryClient } from "react-query";

const BASE_URL = process.env.NEXT_PUBLIC_API_HOST;
const INVENTORY_PRODUCTS_URL = `${BASE_URL}/${process.env.NEXT_PUBLIC_API_INVENTORY_PATH}/products`;

const inventoryProductsAPI = axios.create({
  baseURL: INVENTORY_PRODUCTS_URL,
});

// get all products
export async function getAllProducts(): Promise<InventoryProductValues[]> {
  // const url = `${INVENTORY_PRODUCTS_URL}`;
  return inventoryProductsAPI.get("").then((response) => response.data);
}

// get products summary
export async function getProductsSummary(): Promise<
  InventoryProductsSummaryValues[]
> {
  return inventoryProductsAPI.get("/summary").then((response) => response.data);
}

// create product
export async function createProduct(
  formData: FormData
): Promise<InventoryProductValues> {
  return inventoryProductsAPI
    .post("/create", formData)
    .then((response) => response.data);
}

// get product by id
export async function getProductById(
  productId: string
): Promise<InventoryProductValues> {
  return inventoryProductsAPI
    .get(`/${productId}`)
    .then((response) => response.data);
}

// update product
export async function updateProduct(
  productId: number,
  formData: FormData
): Promise<InventoryProductValues> {
  return inventoryProductsAPI
    .post(`/update/${productId}`, formData)
    .then((response) => response.data);
}

// delete product
export async function deleteProduct(productId: number): Promise<any> {
  return inventoryProductsAPI
    .post(`/delete/${productId}`)
    .then((response) => response.data);
}

export const useGetAllProducts = () => {
  return useQuery("products", getAllProducts);
};

export const useGetProductsSummary = () => {
  return useQuery("products-summary", getProductsSummary);
};

export const useGetProductById = (productId: string) => {
  return useQuery(["products", productId], () => getProductById(productId), {
    enabled: !!productId,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const createProductMutation = useMutation({
    mutationFn: (formData: FormData) => createProduct(formData),
    onSuccess: (newProduct) => {
      queryClient.invalidateQueries("products");
      queryClient.setQueryData(["products", newProduct.id], newProduct);
    },
  });
  return createProductMutation;
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const updateProductMutation = useMutation({
    // @ts-ignore
    mutationFn: (formData: FormData) =>
      updateProduct(formData.get("id") as unknown as number, formData),
    onSuccess: (updatedProduct) => {
      queryClient.invalidateQueries("products");
      queryClient.setQueryData(["products", updatedProduct.id], updatedProduct);
    },
  });
  return updateProductMutation;
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const deleteProductMutation = useMutation({
    // @ts-ignore
    mutationFn: (productId: number) => deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries("products");
    },
  });
  return deleteProductMutation;
};
