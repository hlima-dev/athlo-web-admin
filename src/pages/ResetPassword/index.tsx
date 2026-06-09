import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { api } from '../../services/api'

export function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [token, setToken] = useState(searchParams.get('token') ?? '')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('As senhas não coincidem.')
      return
    }

    try {
      setLoading(true)
      await api.post('/auth/reset-password', { token, password })
      navigate('/login', {
        state: { message: 'Senha redefinida com sucesso! Faça login com a nova senha.' },
      })
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Erro ao redefinir senha.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl"
      >
        <h1 className="text-3xl font-bold text-white">Redefinir senha</h1>
        <p className="text-slate-400 mt-2 mb-6">Crie uma nova senha para sua conta.</p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-900/30 border border-red-700 text-red-300 text-sm">
            {error}
          </div>
        )}

        {!searchParams.get('token') && (
          <input
            type="text"
            placeholder="Cole o token recebido por e-mail"
            className="w-full rounded-xl bg-slate-800 border border-slate-700 text-white px-4 py-3 outline-none focus:border-cyan-400 mb-4"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
          />
        )}

        <div className="space-y-4">
          <input
            type="password"
            placeholder="Nova senha"
            autoComplete="new-password"
            className="w-full rounded-xl bg-slate-800 border border-slate-700 text-white px-4 py-3 outline-none focus:border-cyan-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
          <input
            type="password"
            placeholder="Confirme a nova senha"
            autoComplete="new-password"
            className="w-full rounded-xl bg-slate-800 border border-slate-700 text-white px-4 py-3 outline-none focus:border-cyan-400"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            minLength={8}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-slate-950 font-bold py-3 rounded-xl transition"
        >
          {loading ? 'Salvando...' : 'Atualizar senha'}
        </button>

        <Link to="/login" className="block text-center text-cyan-400 mt-5">
          Voltar para Login
        </Link>
      </form>
    </main>
  )
}
