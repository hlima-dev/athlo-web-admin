import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Mail } from 'lucide-react'
import { api } from '../../services/api'
import { getErrorMessage } from '../../utils/errors'
import { AuthLayout } from '../../components/AuthLayout'
import { Button, Field, inputClass } from '../../components/ui'

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
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Erro ao processar solicitação.'))
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <AuthLayout title="E-mail enviado">
        <div className="text-center">
          <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-forest-100 text-forest-600 dark:bg-forest-900 dark:text-forest-400">
            <Mail size={20} />
          </div>
          <p className="mt-4 text-[13px] leading-relaxed text-muted dark:text-muted-dark">
            Se o endereço <strong className="text-ink dark:text-ink-dark">{email}</strong> estiver cadastrado, você
            receberá um e-mail com o link para redefinir sua senha.
          </p>
          <Link to="/login" className="mt-5 inline-block text-[12.5px] font-medium text-forest-600 dark:text-forest-400">
            Voltar para o login
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Recuperar senha" subtitle="Informe seu e-mail e enviaremos um link para criar uma nova senha.">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="rounded-md bg-[#F6E4E1] px-3.5 py-2.5 text-[12.5px] text-danger dark:bg-danger-dark/10 dark:text-danger-dark">
            {error}
          </p>
        )}

        <Field label="Seu e-mail">
          <input
            type="email"
            placeholder="Seu e-mail"
            autoComplete="email"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Field>

        <Button type="submit" className="w-full justify-center" loading={loading}>
          {loading ? 'Enviando...' : 'Enviar link de recuperação'}
        </Button>

        <Link to="/login" className="block text-center text-[12.5px] text-forest-600 dark:text-forest-400">
          Voltar para Login
        </Link>
      </form>
    </AuthLayout>
  )
}
