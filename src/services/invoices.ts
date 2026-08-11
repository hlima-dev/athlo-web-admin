import { api, extractList } from "./api";

export interface Invoice {
  id: string;
  type: "RECEIVABLE" | "PAYABLE";
  description: string;
  amount: string | number;
  dueDate: string;
  status: "PENDING" | "PAID" | "OVERDUE" | "CANCELED";
  method?: string | null;
  paidAt?: string | null;
  notes?: string | null;
  contact?: { id: string; name: string } | null;
  createdAt: string;
}

export async function getInvoices(params?: Record<string, string>) {
  const response = await api.get("/invoices", { params });
  return extractList<Invoice>(response.data);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createInvoice(data: any) {
  const response = await api.post("/invoices", data);
  return response.data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateInvoice(id: string, data: any) {
  const response = await api.patch(`/invoices/${id}`, data);
  return response.data;
}

export async function markInvoicePaid(id: string, method?: string) {
  const response = await api.patch(`/invoices/${id}/pay`, { method });
  return response.data;
}

export async function deleteInvoice(id: string) {
  const response = await api.delete(`/invoices/${id}`);
  return response.data;
}
