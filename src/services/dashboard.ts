import { api } from "./api";

export interface DashboardData {
  contacts: number;
  users: number;
  events: number;
  pendingInvoices: number;
  openOrders: number;
  revenue: number | string;
  growthData: { month: string; contatos: number }[];
  revenueData: { month: string; valor: number }[];
  upcomingEvents: { id: string; title: string; type: string; startDate: string }[];
}

export async function getDashboard(): Promise<DashboardData> {
  const response = await api.get("/dashboard");
  return response.data.data;
}
