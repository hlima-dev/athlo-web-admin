import { api } from './api'

interface LoginData {
  email: string
  password: string
}

interface RegisterData {
  name: string
  email: string
  password: string
  phone?: string
  organizationName?: string
  inviteToken?: string
}

interface Organization {
  id: string
  name: string
  slug: string
  status: string
}

interface AuthResponse {
  user: {
    id: string
    name: string
    email: string
    orgRole: string
    status: string
    isPlatformAdmin?: boolean
    organization?: Organization
  }
  // Os tokens de sessão em si não vêm mais no corpo — o backend os manda
  // como cookies httpOnly. O csrfToken é o único valor que o front
  // precisa guardar, para ecoar como header nas escritas (proteção CSRF).
  csrfToken: string
}

export async function login(data: LoginData): Promise<AuthResponse> {
  const response = await api.post('/auth/login', data)
  return response.data.data
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await api.post('/auth/register', data)
  return response.data.data
}

export async function changePassword(currentPassword: string, newPassword: string) {
  const response = await api.post('/auth/change-password', { currentPassword, newPassword })
  return response.data
}

export async function updateProfile(data: { name?: string; phone?: string }) {
  const response = await api.patch('/auth/me', data)
  return response.data.data
}

// Os tokens agora são cookies httpOnly — só limpar o localStorage não os
// invalida no navegador. Precisa chamar o backend para ele mandar o
// Set-Cookie de expiração.
export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout')
  } catch {
    // segue o fluxo de limpeza local mesmo se a chamada falhar
    // (ex.: sessão já expirada)
  } finally {
    clearSession()
  }
}

export function saveSession(auth: AuthResponse): void {
  localStorage.setItem('@athlo:csrf', auth.csrfToken)
  localStorage.setItem('@athlo:user', JSON.stringify(auth.user))
  if (auth.user.organization) {
    localStorage.setItem('@athlo:organization', JSON.stringify(auth.user.organization))
  }
}

export function clearSession(): void {
  localStorage.removeItem('@athlo:csrf')
  localStorage.removeItem('@athlo:user')
  localStorage.removeItem('@athlo:organization')
}

// Sinal do lado do cliente de que provavelmente existe uma sessão ativa
// (usado só para decidir rotas no front). A segurança de verdade está no
// cookie httpOnly, que o JS não enxerga — se ele tiver expirado, a
// primeira chamada à API vai devolver 401 e redirecionar pro login.
export function hasStoredSession(): boolean {
  return !!localStorage.getItem('@athlo:csrf')
}

export function getStoredUser() {
  const raw = localStorage.getItem('@athlo:user')
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function getStoredOrganization(): Organization | null {
  const raw = localStorage.getItem('@athlo:organization')
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}
