import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { login, saveSession } from '../services/auth'
import { getErrorMessage } from '../utils/errors'
import { AuthLayout } from '../components/AuthLayout'
import { Button, Field, inputClass } from '../components/ui'

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
      const result = await login({ email, password: senha })

      if ('requiresOrgSelection' in result) {
        navigate('/selecionar-empresa', {
          replace: true,
          state: { preAuthToken: result.preAuthToken, organizations: result.organizations },
        })
        return
      }

      saveSession(result)
      navigate(from, { replace: true })
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'E-mail ou senha inválidos.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Bem-vindo ao ATHLO" subtitle="Acesse o painel de gestão da sua empresa.">
      <form onSubmit={handleLogin} className="space-y-4">
        {error && (
          <p className="rounded-md bg-[#F6E4E1] px-3.5 py-2.5 text-[12.5px] text-danger dark:bg-danger-dark/10 dark:text-danger-dark">
            {error}
          </p>
        )}

        <Field label="E-mail">
          <input
            type="email"
            placeholder="E-mail"
            autoComplete="email"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Field>

        <Field label="Senha">
          <input
            type="password"
            placeholder="Senha"
            autoComplete="current-password"
            className={inputClass}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </Field>

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-[12.5px] text-forest-600 hover:underline dark:text-forest-400">
            Esqueci minha senha
          </Link>
        </div>

        <Button type="submit" className="w-full justify-center" loading={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>

        <p className="text-center text-[12.5px] text-muted dark:text-muted-dark">
          Ainda não tem conta?{' '}
          <Link to="/cadastro" className="font-medium text-forest-600 dark:text-forest-400">
            Criar cadastro
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
