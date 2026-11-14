import { api, extractPaginated, type PaginatedResult } from "./api";

export interface Product {
  id: string;
  name: string;
  description?: string | null;
  sku?: string | null;
  type: "PRODUCT" | "SERVICE";
  price: string | number;
  active: boolean;
  stockQty?: number | null;
  lowStockThreshold?: number | null;
  createdAt: string;
}

export interface ProductsSummary {
  total: number;
  active: number;
  services: number;
  lowStock: number;
}

export async function getProducts(params?: Record<string, string>): Promise<PaginatedResult<Product, ProductsSummary>> {
  const response = await api.get("/products", { params });
  return extractPaginated<Product, ProductsSummary>(response.data);
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
