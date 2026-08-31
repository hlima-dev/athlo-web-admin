import { api, extractList } from "./api";

export interface OrderItem {
  id?: string;
  productId?: string | null;
  name: string;
  quantity: number;
  unitPrice: string | number;
  total?: string | number;
  product?: { id: string; name: string } | null;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone?: string | null;
  contactId?: string | null;
  contact?: { id: string; name: string; phone?: string | null } | null;
  type: "DELIVERY" | "PICKUP";
  status: "CREATED" | "CONFIRMED" | "IN_PREPARATION" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELED";
  origin: "MANUAL" | "CALLCENTER" | "SITE";
  paymentMethod: "PIX" | "CREDIT_CARD" | "DEBIT_CARD" | "CASH" | "BANK_TRANSFER" | "ONLINE" | "OTHER";
  paymentStatus: "PENDING" | "PAID" | "REFUNDED";
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  notes?: string | null;
  scheduledAt?: string | null;
  total: string | number;
  operator?: { id: string; name: string } | null;
  items: OrderItem[];
  createdAt: string;
}

export async function getOrders(params?: Record<string, string>) {
  const response = await api.get("/orders", { params });
  return extractList<Order>(response.data);
}

export async function getOrderById(id: string) {
  const response = await api.get(`/orders/${id}`);
  return response.data?.data as Order;
}

 
export async function createOrder(data: Record<string, unknown>) {
  const response = await api.post("/orders", data);
  return response.data;
}

 
export async function updateOrder(id: string, data: Record<string, unknown>) {
  const response = await api.patch(`/orders/${id}`, data);
  return response.data;
}

export async function updateOrderStatus(id: string, status: Order["status"]) {
  const response = await api.patch(`/orders/${id}/status`, { status });
  return response.data;
}

export async function deleteOrder(id: string) {
  const response = await api.delete(`/orders/${id}`);
  return response.data;
}
