import { api } from "./api";

export interface OrganizationDetails {
  id: string;
  name: string;
  slug: string;
  document?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  logoUrl?: string | null;
  status: string;
  subscription?: {
    status: string;
    trialEndsAt?: string | null;
    currentPeriodEnd?: string | null;
    plan: { id: string; name: string; slug: string; maxUsers: number; maxContacts: number };
  } | null;
  _count?: { users: number; contacts: number };
}

export interface Member {
  id: string;
  name: string;
  email: string;
  orgRole: "OWNER" | "ADMIN" | "MEMBER";
  status: string;
  avatar?: string | null;
  phone?: string | null;
  createdAt: string;
}

export async function getMyOrganization(): Promise<OrganizationDetails> {
  const response = await api.get("/organization/me");
  return response.data.data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateOrganization(data: any) {
  const response = await api.patch("/organization/me", data);
  return response.data;
}

export async function getMembers(): Promise<Member[]> {
  const response = await api.get("/organization/members");
  return response.data.data ?? [];
}
