import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { api } from '../../services/api'
import { getErrorMessage } from '../../utils/errors'
import { AuthLayout } from '../../components/AuthLayout'
import { Button, Field, inputClass } from '../../components/ui'

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
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Erro ao redefinir senha.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Redefinir senha" subtitle="Crie uma nova senha para sua conta.">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="rounded-md bg-[#F6E4E1] px-3.5 py-2.5 text-[12.5px] text-danger dark:bg-danger-dark/10 dark:text-danger-dark">
            {error}
          </p>
        )}

        {!searchParams.get('token') && (
          <Field label="Token">
            <input
              type="text"
              placeholder="Cole o token recebido por e-mail"
              className={inputClass}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
          </Field>
        )}

        <Field label="Nova senha">
          <input
            type="password"
            placeholder="Nova senha"
            autoComplete="new-password"
            className={inputClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
        </Field>

        <Field label="Confirme a nova senha">
          <input
            type="password"
            placeholder="Confirme a nova senha"
            autoComplete="new-password"
            className={inputClass}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            minLength={8}
            required
          />
        </Field>

        <Button type="submit" className="w-full justify-center" loading={loading}>
          {loading ? 'Salvando...' : 'Atualizar senha'}
        </Button>

        <Link to="/login" className="block text-center text-[12.5px] text-forest-600 dark:text-forest-400">
          Voltar para Login
        </Link>
      </form>
    </AuthLayout>
  )
}
