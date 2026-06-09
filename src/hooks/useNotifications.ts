import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../services/api'

export interface Notification {
  id: string
  title: string
  body: string
  type: string
  readAt?: string | null
  createdAt: string
}

function extractList(data: any): Notification[] {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.data)) return data.data
  if (Array.isArray(data?.data?.items)) return data.data.items
  return []
}

export function useNotifications() {
  return useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await api.get('/notifications/me')
      return extractList(response.data)
    },
  })
}

export function useUnreadCount() {
  return useQuery<number>({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async () => {
      const response = await api.get('/notifications/me/unread-count')
      return response.data?.data?.count ?? 0
    },
    refetchInterval: 60_000,
  })
}

export function useMarkAllRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => api.patch('/notifications/me/read-all'),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['notifications'] }) },
  })
}

export function useMarkRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.patch(`/notifications/${id}/read`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['notifications'] }) },
  })
}
