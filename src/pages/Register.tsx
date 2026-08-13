import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { register, saveSession } from '../services/auth'

export function Register() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const inviteToken = searchParams.get('invite') ?? undefined

  const [form, setForm] = useState({ nome: '', empresa: '', email: '', senha: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    try {
      setLoading(true)
      const auth = await register({
        name: form.nome,
        email: form.email,
        password: form.senha,
        organizationName: inviteToken ? undefined : form.empresa,
        inviteToken,
      })
      saveSession(auth)
      navigate('/dashboard', { replace: true })
    } catch (err: any) {
      const fieldErrors = err?.response?.data?.errors as Record<string, string[]> | undefined
      const firstFieldError = fieldErrors && Object.values(fieldErrors).flat()[0]
      const msg = firstFieldError ?? err?.response?.data?.message ?? 'Erro ao criar cadastro.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl"
      >
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          {inviteToken ? 'Aceitar convite' : 'Criar sua empresa no ATHLO'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 mb-6">
          {inviteToken
            ? 'Complete seu cadastro para entrar na equipe.'
            : 'Comece grátis e gerencie contatos, financeiro e agenda em um só lugar.'}
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-900/30 border border-red-700 text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {!inviteToken && (
            <input
              type="text"
              placeholder="Nome da empresa"
              autoComplete="organization"
              className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white px-4 py-3 outline-none focus:border-cyan-400"
              value={form.empresa}
              onChange={(e) => setForm({ ...form, empresa: e.target.value })}
              required
            />
          )}
          <input
            type="text"
            placeholder="Seu nome completo"
            autoComplete="name"
            className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white px-4 py-3 outline-none focus:border-cyan-400"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="E-mail"
            autoComplete="email"
            className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white px-4 py-3 outline-none focus:border-cyan-400"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            autoComplete="new-password"
            className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white px-4 py-3 outline-none focus:border-cyan-400"
            value={form.senha}
            onChange={(e) => setForm({ ...form, senha: e.target.value })}
            minLength={8}
            pattern="(?=.*[A-Z])(?=.*[0-9]).{8,}"
            title="Mínimo 8 caracteres, com ao menos 1 letra maiúscula e 1 número"
            required
          />
          <p className="text-xs text-slate-400 dark:text-slate-500 -mt-2">
            Mínimo 8 caracteres, com ao menos 1 letra maiúscula e 1 número.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-slate-950 font-bold py-3 rounded-xl transition"
        >
          {loading ? 'Cadastrando...' : inviteToken ? 'Entrar na equipe' : 'Criar minha empresa'}
        </button>

        <p className="text-slate-500 dark:text-slate-400 text-sm mt-5 text-center">
          Já tem conta?{' '}
          <Link to="/login" className="text-cyan-400 font-semibold">
            Entrar
          </Link>
        </p>
      </form>
    </main>
  )
}
