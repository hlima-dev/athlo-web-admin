import { api, extractList } from "./api";

export interface Product {
  id: string;
  name: string;
  description?: string | null;
  sku?: string | null;
  type: "PRODUCT" | "SERVICE";
  price: string | number;
  active: boolean;
  createdAt: string;
}

export async function getProducts(params?: Record<string, string>) {
  const response = await api.get("/products", { params });
  return extractList<Product>(response.data);
}

 
export async function createProduct(data: Record<string, unknown>) {
  const response = await api.post("/products", data);
  return response.data;
}

 
export async function updateProduct(id: string, data: Record<string, unknown>) {
  const response = await api.patch(`/products/${id}`, data);
  return response.data;
}

export async function deleteProduct(id: string) {
  const response = await api.delete(`/products/${id}`);
  return response.data;
}
