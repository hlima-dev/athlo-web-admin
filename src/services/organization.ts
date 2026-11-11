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

 
export async function updateOrganization(data: Record<string, unknown>) {
  const response = await api.patch("/organization/me", data);
  return response.data;
}

export async function getMembers(): Promise<Member[]> {
  const response = await api.get("/organization/members");
  return response.data.data ?? [];
}

export type OrgModule = "CONTACTS" | "INVOICES" | "PRODUCTS" | "ORDERS" | "EVENTS";

export interface ModulePermission {
  module: OrgModule;
  enabled: boolean;
}

export async function getMemberPermissions(userId: string): Promise<ModulePermission[]> {
  const response = await api.get(`/organization/members/${userId}/permissions`);
  return response.data.data ?? [];
}

export async function updateMemberPermissions(
  userId: string,
  permissions: ModulePermission[]
): Promise<ModulePermission[]> {
  const response = await api.patch(`/organization/members/${userId}/permissions`, { permissions });
  return response.data.data ?? [];
}

// LGPD — exclusão definitiva da empresa e de todos os dados associados.
// Exige a senha do usuário OWNER como confirmação.
export async function deleteOrganization(password: string) {
  const response = await api.delete("/organization/me", { data: { password } });
  return response.data;
}
