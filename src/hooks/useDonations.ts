import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

export interface Donation {
  id: string;
  amount: string | number;
  method: string;
  status: string;
  donorName?: string;
  donorEmail?: string;
  message?: string;
  createdAt: string;
}

export function useDonations() {
  return useQuery<Donation[]>({
    queryKey: ["donations"],
    queryFn: async () => {
      const response = await api.get("/donations");

      if (Array.isArray(response.data)) return response.data;
      if (Array.isArray(response.data.data)) return response.data.data;
      if (Array.isArray(response.data.data?.items)) return response.data.data.items;
      if (Array.isArray(response.data.data?.data)) return response.data.data.data;

      return [];
    },
  });
}