import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

export interface Athlete {
  id: string;
  name?: string;
  sport?: string;
  modality?: string;
  status?: string;
  createdAt?: string;
  user?: {
    id?: string;
    name?: string;
    email?: string;
    avatar?: string;
  };
}

export function useAthletes() {
  return useQuery<Athlete[]>({
    queryKey: ["athletes"],
    queryFn: async (): Promise<Athlete[]> => {
      const response = await api.get("/athletes");

      console.log("RESPOSTA ATHLETES:", response.data);

      if (Array.isArray(response.data)) {
        return response.data as Athlete[];
      }

      if (Array.isArray(response.data.data)) {
        return response.data.data as Athlete[];
      }

      if (Array.isArray(response.data.data?.items)) {
        return response.data.data.items as Athlete[];
      }

      if (Array.isArray(response.data.data?.data)) {
        return response.data.data.data as Athlete[];
      }

      if (Array.isArray(response.data.athletes)) {
        return response.data.athletes as Athlete[];
      }

      return [];
    },
  });
}