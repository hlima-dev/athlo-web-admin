import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { login, saveSession } from '../services/auth'

export function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/dashboard'

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    try {
      setLoading(true)
      const auth = await login({ email, password: senha })
      saveSession(auth)
      navigate(from, { replace: true })
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'E-mail ou senha inválidos.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl"
      >
        <h1 className="text-3xl font-bold text-white">Bem-vindo ao ATHLO</h1>
        <p className="text-slate-400 mt-2 mb-6">Acesse o painel administrativo da ONG ASDA.</p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-900/30 border border-red-700 text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <input
            type="email"
            placeholder="E-mail"
            autoComplete="email"
            className="w-full rounded-xl bg-slate-800 border border-slate-700 text-white px-4 py-3 outline-none focus:border-cyan-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            autoComplete="current-password"
            className="w-full rounded-xl bg-slate-800 border border-slate-700 text-white px-4 py-3 outline-none focus:border-cyan-400"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-end mt-3">
          <Link to="/forgot-password" className="text-sm text-cyan-400 hover:text-cyan-300">
            Esqueci minha senha
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-slate-950 font-bold py-3 rounded-xl transition"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>

        <p className="text-slate-400 text-sm mt-5 text-center">
          Ainda não tem conta?{' '}
          <Link to="/cadastro" className="text-cyan-400 font-semibold">
            Criar cadastro
          </Link>
        </p>
      </form>
    </main>
  )
}
