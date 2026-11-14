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
  // Fluxo líquido projetado (90 dias) a partir das faturas pendentes —
  // não é saldo bancário real, ver DashboardController.buildCashFlowProjection.
  cashFlowProjection: { date: string; in: number; out: number; balance: number }[];
  attention: {
    overdueInvoices: { id: string; description: string; amount: number; dueDate: string; type: string }[];
    overdueInvoicesTotal: number;
    todayEvents: { id: string; title: string; type: string; startDate: string }[];
    lowStockProducts: { id: string; name: string; stockQty: number; lowStockThreshold: number }[];
    lowStockTotal: number;
  };
}

export async function getDashboard(): Promise<DashboardData> {
  const response = await api.get("/dashboard");
  return response.data.data;
}
