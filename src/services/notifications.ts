import { api } from "./api";

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  body: string;
  data?: string | null;
  readAt?: string | null;
  sentAt?: string | null;
  createdAt: string;
}

export async function getMyNotifications() {
  const response = await api.get("/notifications/me");
  return response.data;
}

export async function getUnreadCount() {
  const response = await api.get("/notifications/me/unread-count");
  return response.data;
}

export async function markNotificationAsRead(id: string) {
  const response = await api.patch(`/notifications/${id}/read`);
  return response.data;
}

export async function markAllNotificationsAsRead() {
  const response = await api.patch("/notifications/me/read-all");
  return response.data;
}