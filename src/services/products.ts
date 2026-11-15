import { api, extractPaginated, type PaginatedResult } from "./api";

export interface RecipeItem {
  id: string;
  insumoId: string;
  insumoName: string;
  unit: string;
  quantity: string | number;
  unitCost: number | null;
}

export interface ProductMargin {
  productionCost: number;
  taxAmount: number;
  paymentFeeAmount: number;
  shippingCost: number;
  netMargin: number;
  netMarginPercent: number;
}

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
  taxPercent?: string | number | null;
  paymentFeePercent?: string | number | null;
  shippingCost?: string | number | null;
  recipeItems?: RecipeItem[];
  margin?: ProductMargin;
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

export async function getProductById(id: string): Promise<Product> {
  const response = await api.get(`/products/${id}`);
  return response.data?.data as Product;
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

export async function updateProductRecipe(id: string, items: { insumoId: string; quantity: number }[]) {
  const response = await api.put(`/products/${id}/recipe`, { items });
  return response.data;
}
