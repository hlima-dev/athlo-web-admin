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
  return response.data;
}

export async function createDonation(data: any) {
  const response = await api.post("/donations", data);
  return response.data;
}