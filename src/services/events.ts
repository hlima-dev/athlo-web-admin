import { api, extractPaginated, type PaginatedResult } from "./api";

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
  reminderSentAt?: string | null;
}

export interface EventsSummary {
  scheduled: number;
  tasks: number;
  deadlines: number;
  total: number;
}

export async function getEvents(params?: Record<string, string>): Promise<PaginatedResult<Event, EventsSummary>> {
  const response = await api.get("/events", { params });
  return extractPaginated<Event, EventsSummary>(response.data);
}

 
export async function createEvent(data: Record<string, unknown>) {
  const response = await api.post("/events", data);
  return response.data;
}

 
export async function updateEvent(id: string, data: Record<string, unknown>) {
  const response = await api.patch(`/events/${id}`, data);
  return response.data;
}

export async function deleteEvent(id: string) {
  const response = await api.delete(`/events/${id}`);
  return response.data;
}

export interface QuickEventDraft {
  title: string;
  description: string;
  type: "MEETING" | "TASK" | "DEADLINE" | "OTHER";
  location: string;
  startDate: string;
  endDate: string;
  isOnline: boolean;
}

export async function parseEventFromText(prompt: string) {
  const response = await api.post("/events/quick-parse", { prompt });
  return response.data?.data as QuickEventDraft;
}
