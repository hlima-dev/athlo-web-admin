import { api, extractPaginated, type PaginatedResult } from "./api";

export interface Contact {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  document?: string | null;
  company?: string | null;
  type: "LEAD" | "CUSTOMER" | "SUPPLIER";
  status: "ACTIVE" | "INACTIVE";
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  tags?: string | null;
  notes?: string | null;
  createdAt: string;
}

export interface ContactsSummary {
  total: number;
  customers: number;
  leads: number;
  suppliers: number;
}

export async function getContacts(params?: Record<string, string>): Promise<PaginatedResult<Contact, ContactsSummary>> {
  const response = await api.get("/contacts", { params });
  return extractPaginated<Contact, ContactsSummary>(response.data);
}

export interface ContactInvoiceSummary {
  id: string;
  description: string;
  amount: string | number;
  dueDate: string;
  status: "PENDING" | "PAID" | "OVERDUE" | "CANCELED";
  type: "RECEIVABLE" | "PAYABLE";
}

export interface ContactOrderSummary {
  id: string;
  status: string;
  paymentStatus: string;
  total: string | number;
  createdAt: string;
}

export interface ContactEventSummary {
  id: string;
  title: string;
  status: string;
  startDate: string;
}

export interface ContactDetail extends Contact {
  balanceDue: number;
  invoices: ContactInvoiceSummary[];
  orders: ContactOrderSummary[];
  events: ContactEventSummary[];
}

export async function getContactById(id: string): Promise<ContactDetail> {
  const response = await api.get(`/contacts/${id}`);
  return response.data?.data;
}

 
export async function createContact(data: Record<string, unknown>) {
  const response = await api.post("/contacts", data);
  return response.data;
}

 
export async function updateContact(id: string, data: Record<string, unknown>) {
  const response = await api.patch(`/contacts/${id}`, data);
  return response.data;
}

export async function deleteContact(id: string) {
  const response = await api.delete(`/contacts/${id}`);
  return response.data;
}
