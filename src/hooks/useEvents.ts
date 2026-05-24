import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

export interface EventItem {
  id: string;
  title: string;
  description?: string;
  type: string;
  status: string;
  location?: string;
  city?: string;
  state?: string;
  startDate: string;
  endDate: string;
}

export function useEvents() {
  return useQuery<EventItem[]>({
    queryKey: ["events"],
    queryFn: async () => {
      const response = await api.get("/events");

      if (Array.isArray(response.data)) return response.data;
      if (Array.isArray(response.data.data)) return response.data.data;
      if (Array.isArray(response.data.data?.items)) return response.data.data.items;
      if (Array.isArray(response.data.data?.data)) return response.data.data.data;

      return [];
    },
  });
}