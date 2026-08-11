import { api, extractList } from "./api";

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

export async function getContacts(params?: Record<string, string>) {
  const response = await api.get("/contacts", { params });
  return extractList<Contact>(response.data);
}

export async function getContactById(id: string) {
  const response = await api.get(`/contacts/${id}`);
  return response.data?.data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createContact(data: any) {
  const response = await api.post("/contacts", data);
  return response.data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateContact(id: string, data: any) {
  const response = await api.patch(`/contacts/${id}`, data);
  return response.data;
}

export async function deleteContact(id: string) {
  const response = await api.delete(`/contacts/${id}`);
  return response.data;
}
