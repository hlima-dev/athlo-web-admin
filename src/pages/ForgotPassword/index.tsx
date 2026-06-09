import { Link } from 'react-router-dom'
import { useState } from 'react'
import { api } from '../../services/api'

export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    try {
      setLoading(true)
      await api.post('/auth/forgot-password', { email })
      setSent(true)
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Erro ao processar solicitação.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center">
          <div className="text-5xl mb-4">📬</div>
          <h1 className="text-2xl font-bold text-white mb-3">E-mail enviado</h1>
          <p className="text-slate-400 mb-6">
            Se o endereço <strong className="text-white">{email}</strong> estiver cadastrado,
            você receberá um e-mail com o link para redefinir sua senha.
          </p>
          <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold">
            Voltar para o login
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl"
      >
        <h1 className="text-3xl font-bold text-white">Recuperar senha</h1>
        <p className="text-slate-400 mt-2 mb-6">
          Informe seu e-mail e enviaremos um link para criar uma nova senha.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-900/30 border border-red-700 text-red-300 text-sm">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Seu e-mail"
          autoComplete="email"
          className="w-full rounded-xl bg-slate-800 border border-slate-700 text-white px-4 py-3 outline-none focus:border-cyan-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-slate-950 font-bold py-3 rounded-xl transition"
        >
          {loading ? 'Enviando...' : 'Enviar link de recuperação'}
        </button>

        <Link to="/login" className="block text-center text-cyan-400 mt-5">
          Voltar para Login
        </Link>
      </form>
    </main>
  )
}
