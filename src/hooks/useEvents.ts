import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../services/api'

export interface EventItem {
  id: string
  title: string
  type: string
  status: string
  startDate: string
  endDate: string
  location?: string
  maxParticipants?: number
}

function extractList(data: any): EventItem[] {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.data)) return data.data
  if (Array.isArray(data?.data?.items)) return data.data.items
  return []
}

export function useEvents(params?: Record<string, string>) {
  return useQuery<EventItem[]>({
    queryKey: ['events', params],
    queryFn: async () => {
      const response = await api.get('/events', { params })
      return extractList(response.data)
    },
  })
}

export function useCreateEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, any>) => api.post('/events', data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['events'] }) },
  })
}

export function useUpdateEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, any> }) =>
      api.patch(`/events/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['events'] }) },
  })
}

export function useDeleteEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/events/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['events'] }) },
  })
}
