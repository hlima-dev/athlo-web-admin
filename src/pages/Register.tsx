import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { register, saveSession } from '../services/auth'

export function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ nome: '', email: '', senha: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    try {
      setLoading(true)
      const auth = await register({ name: form.nome, email: form.email, password: form.senha })
      saveSession(auth)
      navigate('/dashboard', { replace: true })
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Erro ao criar cadastro.'
      setError(msg)
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
        <h1 className="text-3xl font-bold text-white">Criar conta</h1>
        <p className="text-slate-400 mt-2 mb-6">Cadastre-se para acessar o sistema da ONG.</p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-900/30 border border-red-700 text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nome completo"
            autoComplete="name"
            className="w-full rounded-xl bg-slate-800 border border-slate-700 text-white px-4 py-3 outline-none focus:border-cyan-400"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="E-mail"
            autoComplete="email"
            className="w-full rounded-xl bg-slate-800 border border-slate-700 text-white px-4 py-3 outline-none focus:border-cyan-400"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Senha — mín. 8 caracteres"
            autoComplete="new-password"
            className="w-full rounded-xl bg-slate-800 border border-slate-700 text-white px-4 py-3 outline-none focus:border-cyan-400"
            value={form.senha}
            onChange={(e) => setForm({ ...form, senha: e.target.value })}
            minLength={8}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-slate-950 font-bold py-3 rounded-xl transition"
        >
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>

        <p className="text-slate-400 text-sm mt-5 text-center">
          Já tem conta?{' '}
          <Link to="/login" className="text-cyan-400 font-semibold">
            Entrar
          </Link>
        </p>
      </form>
    </main>
  )
}
