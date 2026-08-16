import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL ?? ''

export const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
  // Os tokens de autenticação vivem em cookies httpOnly do backend — o
  // navegador precisa ser instruído a enviá-los (e recebê-los) em toda
  // chamada, já que o JS não consegue lê-los diretamente (por design).
  withCredentials: true,
})

const MUTATING_METHODS = new Set(['post', 'put', 'patch', 'delete'])

api.interceptors.request.use((config) => {
  // Proteção CSRF por dupla submissão: o backend valida que este header
  // bate com o valor do cookie athlo_csrf. Só importa em métodos que
  // alteram estado — GET não precisa.
  if (config.method && MUTATING_METHODS.has(config.method)) {
    const csrfToken = localStorage.getItem('@athlo:csrf')
    if (csrfToken) config.headers['X-CSRF-Token'] = csrfToken
  }
  return config
})

function clearClientSession() {
  localStorage.removeItem('@athlo:csrf')
  localStorage.removeItem('@athlo:user')
  localStorage.removeItem('@athlo:organization')
}

function redirectToLogin() {
  clearClientSession()
  if (window.location.pathname !== '/login') {
    window.location.href = '/login'
  }
}

// Evento global disparado quando a API recusa uma escrita por falta de
// assinatura ativa (trial encerrado / pagamento pendente). Um componente
// no topo da árvore (veja PaymentRequiredBanner) escuta esse evento e
// mostra um aviso — sem redirecionar, para não perder o que o usuário
// estava fazendo.
export const PAYMENT_REQUIRED_EVENT = 'athlo:payment-required'

let refreshInFlight: Promise<boolean> | null = null

// Chamado quando um 401 chega — tenta renovar a sessão via o cookie de
// refresh (também httpOnly) antes de desistir e mandar pro login. Evita
// derrubar o usuário só porque o access token de curta duração expirou.
async function tryRefresh(): Promise<boolean> {
  if (!refreshInFlight) {
    refreshInFlight = api
      .post('/auth/refresh')
      .then((response) => {
        const csrfToken = response.data?.data?.csrfToken
        if (csrfToken) localStorage.setItem('@athlo:csrf', csrfToken)
        return true
      })
      .catch(() => false)
      .finally(() => {
        refreshInFlight = null
      })
  }
  return refreshInFlight
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error

    if (response?.status === 401 && config && !config._retry && config.url !== '/auth/refresh') {
      config._retry = true
      const refreshed = await tryRefresh()
      if (refreshed) return api(config)
      redirectToLogin()
      return Promise.reject(error)
    }

    if (response?.status === 401) {
      redirectToLogin()
    }

    if (response?.status === 402) {
      window.dispatchEvent(
        new CustomEvent(PAYMENT_REQUIRED_EVENT, {
          detail: { message: response?.data?.message },
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

// Baixa um PDF gerado pelo backend (autenticado via cookie) e abre numa
// nova aba.
export async function openPdf(path: string): Promise<void> {
  const response = await api.get(path, { responseType: 'blob' })
  const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
  window.open(url, '_blank')
  setTimeout(() => window.URL.revokeObjectURL(url), 60_000)
}

export default api
