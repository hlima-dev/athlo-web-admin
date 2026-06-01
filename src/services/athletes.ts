import { api } from "./api";

export interface Athlete {
  id: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  sport?: string;
  city?: string;
  state?: string;
  status?: string;
}

export async function getAthletes() {
  const response = await api.get("/athletes");

  console.log("ATLETAS API =>", response.data);

  return response.data;
}

export async function getAthleteById(id: string) {
  const response = await api.get(`/athletes/${id}`);

  return response.data;
}

export async function createAthlete(data: any) {
  const response = await api.post("/athletes", data);

  return response.data;
}

export async function updateAthlete(
  id: string,
  data: any
) {
  const response = await api.patch(
    `/athletes/${id}`,
    data
  );

  return response.data;
}

export async function deleteAthlete(id: string) {
  const response = await api.delete(
    `/athletes/${id}`
  );

  return response.data;
}