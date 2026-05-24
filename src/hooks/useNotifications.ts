import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: string;
  readAt?: string | null;
  createdAt: string;
}

export function useNotifications() {
  return useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await api.get("/notifications");

      if (Array.isArray(response.data)) return response.data;
      if (Array.isArray(response.data.data)) return response.data.data;
      if (Array.isArray(response.data.data?.items)) return response.data.data.items;
      if (Array.isArray(response.data.data?.data)) return response.data.data.data;

      return [];
    },
  });
}