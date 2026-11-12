import { api, extractList } from "./api";

export type AuditAction = "CREATE" | "UPDATE" | "DELETE";

export interface AuditLog {
  id: string;
  organizationId: string | null;
  userId: string | null;
  entityType: string;
  entityId: string;
  action: AuditAction;
  summary: string;
  createdAt: string;
  user: { id: string; name: string; email: string } | null;
}

export async function getAuditLogs(params?: {
  entityType?: string;
  search?: string;
  page?: number;
}): Promise<AuditLog[]> {
  const response = await api.get("/audit-logs", { params });
  return extractList<AuditLog>(response.data);
}
