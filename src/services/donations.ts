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
  const data = response.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.items)) return data.data.items;
  return [];
}

export async function createDonation(data: any) {
  const response = await api.post("/donations", data);
  return response.data;
}
