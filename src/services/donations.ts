import { api } from "./api";

export interface Donation {
  id: string;
  amount: string | number;
  method: string;
  status: string;
  donorName?: string | null;
  donorEmail?: string | null;
  donorCpf?: string | null;
  message?: string | null;
  createdAt: string;
}

export async function getDonations() {
  const response = await api.get("/donations");
  const body = response.data;
  if (Array.isArray(body)) return body;
  if (Array.isArray(body?.data)) return body.data;
  if (Array.isArray(body?.data?.data)) return body.data.data;
  return [];
}

export async function createDonation(data: any) {
  const response = await api.post("/donations", data);
  return response.data;
}
