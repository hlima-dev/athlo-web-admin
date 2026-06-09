import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../services/api'

export interface Athlete {
  id: string
  registrationCode?: string
  sport?: string
  ampLevel?: string
  status?: string
  city?: string
  state?: string
  createdAt?: string
  user?: { id?: string; name?: string; email?: string; avatar?: string }
}

function extractList(data: any): Athlete[] {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.data)) return data.data
  if (Array.isArray(data?.data?.items)) return data.data.items
  return []
}

export function useAthletes(params?: Record<string, string>) {
  return useQuery<Athlete[]>({
    queryKey: ['athletes', params],
    queryFn: async () => {
      const response = await api.get('/athletes', { params })
      return extractList(response.data)
    },
  })
}

export function useCreateAthlete() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, any>) => api.post('/athletes', data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['athletes'] }) },
  })
}

export function useDeleteAthlete() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/athletes/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['athletes'] }) },
  })
}
