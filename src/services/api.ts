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

// Evento global disparado quando a API recusa uma escrita por falta de
// assinatura ativa (trial encerrado / pagamento pendente). Um componente
// no topo da árvore (veja PaymentRequiredBanner) escuta esse evento e
// mostra um aviso — sem redirecionar, para não perder o que o usuário
// estava fazendo.
export const PAYMENT_REQUIRED_EVENT = 'athlo:payment-required'

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

    if (error.response?.status === 402) {
      window.dispatchEvent(
        new CustomEvent(PAYMENT_REQUIRED_EVENT, {
          detail: { message: error.response?.data?.message },
        })
      )
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

// Baixa um PDF gerado pelo backend (autenticado) e abre numa nova aba.
// Não dá para usar um <a href> simples porque o endpoint exige o header
// Authorization — por isso o fetch via axios com responseType blob.
export async function openPdf(path: string): Promise<void> {
  const response = await api.get(path, { responseType: 'blob' })
  const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
  window.open(url, '_blank')
  setTimeout(() => window.URL.revokeObjectURL(url), 60_000)
}

export default api
