import { api } from './api'

interface LoginData {
  email: string
  password: string
}

interface RegisterData {
  name: string
  email: string
  password: string
}

interface AuthResponse {
  user: {
    id: string
    name: string
    email: string
    role: string
    status: string
  }
  accessToken: string
  refreshToken: string
}

export async function login(data: LoginData): Promise<AuthResponse> {
  const response = await api.post('/auth/login', data)
  return response.data.data
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await api.post('/auth/register', data)
  return response.data.data
}

export function saveSession(auth: AuthResponse): void {
  localStorage.setItem('@athlo:token', auth.accessToken)
  localStorage.setItem('@athlo:refreshToken', auth.refreshToken)
  localStorage.setItem('@athlo:user', JSON.stringify(auth.user))
}

export function clearSession(): void {
  localStorage.removeItem('@athlo:token')
  localStorage.removeItem('@athlo:refreshToken')
  localStorage.removeItem('@athlo:user')
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
