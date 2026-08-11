import { api } from "./api";

export interface Invite {
  id: string;
  email: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  expiresAt: string;
  acceptedAt?: string | null;
  createdAt: string;
}

export async function getInvites(): Promise<Invite[]> {
  const response = await api.get("/invites");
  return response.data.data ?? [];
}

export async function createInvite(email: string, role?: string) {
  const response = await api.post("/invites", { email, role });
  return response.data;
}

export async function revokeInvite(id: string) {
  const response = await api.delete(`/invites/${id}`);
  return response.data;
}
