import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../services/api'

export interface Donation {
  id: string
  amount: string | number
  method: string
  status: string
  donorName?: string
  donorEmail?: string
  message?: string
  createdAt: string
}

function extractList(data: any): Donation[] {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.data)) return data.data
  if (Array.isArray(data?.data?.items)) return data.data.items
  return []
}

export function useDonations() {
  return useQuery<Donation[]>({
    queryKey: ['donations'],
    queryFn: async () => {
      const response = await api.get('/donations')
      return extractList(response.data)
    },
  })
}

export function useCreateDonation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { amount: number; method: string; donorName?: string; donorEmail?: string; message?: string }) =>
      api.post('/donations', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donations'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
