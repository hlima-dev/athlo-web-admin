import { api, extractList } from "./api";

export interface Event {
  id: string;
  title: string;
  description?: string | null;
  type: "MEETING" | "TASK" | "DEADLINE" | "OTHER";
  status: "SCHEDULED" | "COMPLETED" | "CANCELED";
  location?: string | null;
  isOnline?: boolean;
  onlineUrl?: string | null;
  startDate: string;
  endDate: string;
  allDay?: boolean;
  contact?: { id: string; name: string } | null;
  createdBy?: { id: string; name: string };
  assignedTo?: { id: string; name: string } | null;
}

export async function getEvents(params?: Record<string, string>) {
  const response = await api.get("/events", { params });
  return extractList<Event>(response.data);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createEvent(data: any) {
  const response = await api.post("/events", data);
  return response.data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateEvent(id: string, data: any) {
  const response = await api.patch(`/events/${id}`, data);
  return response.data;
}

export async function deleteEvent(id: string) {
  const response = await api.delete(`/events/${id}`);
  return response.data;
}

export interface AiEventDraft {
  title: string;
  description: string;
  type: "MEETING" | "TASK" | "DEADLINE" | "OTHER";
  location: string;
  startDate: string;
  endDate: string;
  isOnline: boolean;
}

export async function parseEventWithAi(prompt: string) {
  const response = await api.post("/events/ai-parse", { prompt });
  return response.data?.data as AiEventDraft;
}
