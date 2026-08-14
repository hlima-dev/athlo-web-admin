import { api, extractList } from "./api";

export interface AdminOrganization {
  id: string;
  name: string;
  slug: string;
  email?: string | null;
  status: string;
  createdAt: string;
  subscription?: {
    status: string;
    plan: { name: string; slug: string; priceMonthly: string | number };
  } | null;
  _count?: { users: number; contacts: number };
}

export interface AdminOverview {
  totalOrganizations: number;
  totalUsers: number;
  subscriptions: {
    active: number;
    trialing: number;
    pastDue: number;
    canceled: number;
  };
  mrr: number;
  recentOrganizations: AdminOrganization[];
}

export async function getAdminOverview(): Promise<AdminOverview> {
  const response = await api.get("/admin/overview");
  return response.data.data;
}

export async function listAdminOrganizations(params?: {
  search?: string;
  status?: string;
  page?: number;
}): Promise<AdminOrganization[]> {
  const response = await api.get("/admin/organizations", { params });
  return extractList<AdminOrganization>(response.data);
}

export async function setOrganizationStatus(id: string, status: "ACTIVE" | "SUSPENDED") {
  const response = await api.patch(`/admin/organizations/${id}/status`, { status });
  return response.data.data;
}
