import { api } from "./api";

export interface Event {
  id: string;
  title: string;
  description?: string | null;
  type: string;
  status: string;
  location?: string | null;
  city?: string | null;
  state?: string | null;
  startDate: string;
  endDate: string;
  maxParticipants?: number | null;
  createdBy?: {
    id: string;
    name: string;
  };
  _count?: {
    athletes: number;
  };
}

export async function getEvents() {
  const response = await api.get("/events");
  return response.data;
}

export async function createEvent(data: any) {
  const response = await api.post("/events", data);
  return response.data;
}