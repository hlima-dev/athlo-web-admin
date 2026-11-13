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

// Endpoints "pré-sessão": um 401 aqui é um resultado normal (senha
// errada, token de seleção expirado), não um sinal de sessão expirada —
// não deve tentar renovar nem redirecionar, só devolver o erro pro
// formulário mostrar a mensagem.
const AUTH_ENTRY_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/select-organization', '/auth/refresh']

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error
    const isAuthEntryCall = config?.url && AUTH_ENTRY_ENDPOINTS.includes(config.url)

    if (response?.status === 401 && config && !config._retry && !isAuthEntryCall) {
      config._retry = true
      const refreshed = await tryRefresh()
      if (refreshed) return api(config)
      redirectToLogin()
      return Promise.reject(error)
    }

    if (response?.status === 401 && !isAuthEntryCall) {
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

export interface PageMeta {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface PaginatedResult<T, S = undefined> {
  items: T[]
  meta?: PageMeta
  summary?: S
}

// Igual ao extractList, mas também preserva meta (total/página) e o
// resumo agregado que o backend calcula sobre a organização inteira —
// os dois ficavam descartados antes, obrigando a UI a recalcular
// indicadores só com a página de 20 itens carregada.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractPaginated<T, S = undefined>(data: any): PaginatedResult<T, S> {
  const inner = data?.data ?? data
  const items = extractList<T>(data)
  return { items, meta: inner?.meta, summary: inner?.summary }
}

// Baixa um PDF gerado pelo backend (autenticado via cookie) e abre numa
// nova aba.
export async function openPdf(path: string): Promise<void> {
  const response = await api.get(path, { responseType: 'blob' })
  const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
  window.open(url, '_blank')
  setTimeout(() => window.URL.revokeObjectURL(url), 60_000)
}

// Baixa qualquer arquivo gerado pelo backend (autenticado via cookie) e
// dispara o download — para arquivos que o navegador não sabe exibir
// direto (xlsx, por exemplo), diferente do PDF que abre numa aba.
export async function downloadFile(path: string, filename: string): Promise<void> {
  const response = await api.get(path, { responseType: 'blob' })
  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

export default api
