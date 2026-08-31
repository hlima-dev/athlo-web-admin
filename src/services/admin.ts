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

export interface AdminErrorLog {
  id: string;
  message: string;
  stack: string | null;
  statusCode: number;
  method: string;
  path: string;
  resolvedAt: string | null;
  createdAt: string;
  user: { id: string; name: string; email: string } | null;
  organization: { id: string; name: string } | null;
}

export async function listAdminErrors(params?: {
  resolved?: boolean;
  search?: string;
  page?: number;
}): Promise<AdminErrorLog[]> {
  const response = await api.get("/admin/errors", { params });
  return extractList<AdminErrorLog>(response.data);
}

export async function getAdminErrorsSummary(): Promise<{ unresolvedCount: number }> {
  const response = await api.get("/admin/errors/summary");
  return response.data.data;
}

export async function resolveAdminError(id: string): Promise<AdminErrorLog> {
  const response = await api.patch(`/admin/errors/${id}/resolve`);
  return response.data.data;
}
