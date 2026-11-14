import { api } from "./api";

export type TaxRegime = "MEI" | "SIMPLES_NACIONAL" | "LUCRO_PRESUMIDO" | "LUCRO_REAL";

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
  taxRegime?: TaxRegime | null;
  contactsGoal?: number | null;
  eventsGoal?: number | null;
  revenueGoal?: number | string | null;
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

// Permissões do próprio usuário logado — usado pra filtrar menu/atalhos
// sem exigir papel de OWNER/ADMIN (diferente de getMemberPermissions,
// que só eles podem consultar sobre outra pessoa).
export async function getMyPermissions(): Promise<ModulePermission[]> {
  const response = await api.get("/organization/me/permissions");
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
