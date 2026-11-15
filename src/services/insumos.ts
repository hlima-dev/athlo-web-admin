import { api, extractList, extractPaginated, type PaginatedResult } from "./api";

export interface InsumoBestPrice {
  price: number;
  contactId: string;
  contactName: string;
}

export interface Insumo {
  id: string;
  name: string;
  unit: string;
  active: boolean;
  bestPrice?: InsumoBestPrice | null;
  createdAt: string;
}

export interface InsumoPrice {
  id: string;
  insumoId: string;
  contactId: string;
  contact: { id: string; name: string };
  price: string | number;
  isPromo: boolean;
  validUntil?: string | null;
  recordedAt: string;
}

export interface InsumosSummary {
  total: number;
  active: number;
}

export async function getInsumos(params?: Record<string, string>): Promise<PaginatedResult<Insumo, InsumosSummary>> {
  const response = await api.get("/insumos", { params });
  return extractPaginated<Insumo, InsumosSummary>(response.data);
}

export async function createInsumo(data: Record<string, unknown>) {
  const response = await api.post("/insumos", data);
  return response.data;
}

export async function updateInsumo(id: string, data: Record<string, unknown>) {
  const response = await api.patch(`/insumos/${id}`, data);
  return response.data;
}

export async function deleteInsumo(id: string) {
  const response = await api.delete(`/insumos/${id}`);
  return response.data;
}

export async function getInsumoPrices(id: string): Promise<InsumoPrice[]> {
  const response = await api.get(`/insumos/${id}/prices`);
  return extractList<InsumoPrice>(response.data);
}

export async function addInsumoPrice(id: string, data: Record<string, unknown>) {
  const response = await api.post(`/insumos/${id}/prices`, data);
  return response.data;
}
