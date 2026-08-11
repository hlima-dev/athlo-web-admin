import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL ?? ''

export const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@athlo:token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('@athlo:token')
      localStorage.removeItem('@athlo:refreshToken')
      localStorage.removeItem('@athlo:user')
      localStorage.removeItem('@athlo:organization')

      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Normaliza as diferentes formas de envelope que a API pode devolver
// (paginado, lista simples, etc.) para sempre extrair um array.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractList<T>(data: any): T[] {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.data)) return data.data
  if (Array.isArray(data?.data?.data)) return data.data.data
  if (Array.isArray(data?.data?.items)) return data.data.items
  if (Array.isArray(data?.items)) return data.items
  return []
}

export default api
