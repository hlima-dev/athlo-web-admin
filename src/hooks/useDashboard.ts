import { useQuery } from "@tanstack/react-query";

import { api } from "../services/api";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],

    queryFn: async () => {
      const response = await api.get("/dashboard");

      return response.data;
    },

    staleTime: 1000 * 60 * 5,

    retry: 2,

    refetchOnWindowFocus: false,
  });
}