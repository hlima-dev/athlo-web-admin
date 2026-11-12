import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { isAxiosError } from 'axios'
import { register, saveSession } from '../services/auth'
import { getErrorMessage } from '../utils/errors'
import { AuthLayout } from '../components/AuthLayout'
import { Button, Field, inputClass } from '../components/ui'

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
    } catch (err: unknown) {
      const fieldErrors = isAxiosError(err)
        ? (err.response?.data?.errors as Record<string, string[]> | undefined)
        : undefined
      const firstFieldError = fieldErrors && Object.values(fieldErrors).flat()[0]
      setError(firstFieldError ?? getErrorMessage(err, 'Erro ao criar cadastro.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title={inviteToken ? 'Aceitar convite' : 'Criar sua empresa no ATHLO'}
      subtitle={
        inviteToken
          ? 'Complete seu cadastro para entrar na equipe.'
          : 'Comece grátis e gerencie contatos, financeiro e agenda em um só lugar.'
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="rounded-md bg-[#F6E4E1] px-3.5 py-2.5 text-[12.5px] text-danger dark:bg-danger-dark/10 dark:text-danger-dark">
            {error}
          </p>
        )}

        {!inviteToken && (
          <Field label="Nome da empresa">
            <input
              type="text"
              placeholder="Nome da empresa"
              autoComplete="organization"
              className={inputClass}
              value={form.empresa}
              onChange={(e) => setForm({ ...form, empresa: e.target.value })}
              required
            />
          </Field>
        )}

        <Field label="Seu nome completo">
          <input
            type="text"
            placeholder="Seu nome completo"
            autoComplete="name"
            className={inputClass}
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            required
          />
        </Field>

        <Field label="E-mail">
          <input
            type="email"
            placeholder="E-mail"
            autoComplete="email"
            className={inputClass}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </Field>

        <Field label="Senha" hint="Mínimo 8 caracteres, com ao menos 1 letra maiúscula e 1 número.">
          <input
            type="password"
            placeholder="Senha"
            autoComplete="new-password"
            className={inputClass}
            value={form.senha}
            onChange={(e) => setForm({ ...form, senha: e.target.value })}
            minLength={8}
            pattern="(?=.*[A-Z])(?=.*[0-9]).{8,}"
            title="Mínimo 8 caracteres, com ao menos 1 letra maiúscula e 1 número"
            required
          />
        </Field>

        <Button type="submit" className="w-full justify-center" loading={loading}>
          {loading ? 'Cadastrando...' : inviteToken ? 'Entrar na equipe' : 'Criar minha empresa'}
        </Button>

        <p className="text-center text-[12.5px] text-muted dark:text-muted-dark">
          Já tem conta?{' '}
          <Link to="/login" className="font-medium text-forest-600 dark:text-forest-400">
            Entrar
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
