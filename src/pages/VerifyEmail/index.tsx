import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2, XCircle, Loader2, Mail } from 'lucide-react'
import { api } from '../../services/api'
import { AuthLayout } from '../../components/AuthLayout'
import { Button } from '../../components/ui'

type Status = 'loading' | 'success' | 'error' | 'missing-token'

export function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [status, setStatus] = useState<Status>(token ? 'loading' : 'missing-token')
  const [message, setMessage] = useState('')
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)

  useEffect(() => {
    if (!token) return

    api
      .post('/auth/verify-email', { token })
      .then(() => setStatus('success'))
      .catch((err) => {
        setStatus('error')
        setMessage(err?.response?.data?.message ?? 'Não foi possível verificar seu e-mail.')
      })
  }, [token])

  async function handleResend() {
    try {
      setResending(true)
      await api.post('/auth/resend-verification')
      setResent(true)
    } catch {
      setMessage('Faça login para reenviar o e-mail de verificação.')
    } finally {
      setResending(false)
    }
  }

  const title =
    status === 'loading'
      ? 'Verificando seu e-mail...'
      : status === 'success'
        ? 'E-mail verificado!'
        : status === 'error'
          ? 'Link inválido ou expirado'
          : 'Confirme seu e-mail'

  return (
    <AuthLayout title={title}>
      <div className="text-center">
        {status === 'loading' && (
          <Loader2 className="mx-auto animate-spin text-muted dark:text-muted-dark" size={32} />
        )}

        {status === 'success' && (
          <>
            <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-forest-100 text-forest-600 dark:bg-forest-900 dark:text-forest-400">
              <CheckCircle2 size={20} />
            </div>
            <p className="mt-4 text-[13px] text-muted dark:text-muted-dark">Sua conta foi confirmada com sucesso.</p>
            <Link to="/login">
              <Button className="mt-6 w-full justify-center">Ir para o login</Button>
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-[#F6E4E1] text-danger dark:bg-danger-dark/15 dark:text-danger-dark">
              <XCircle size={20} />
            </div>
            <p className="mt-4 text-[13px] text-muted dark:text-muted-dark">{message}</p>
            <Button className="mt-6 w-full justify-center" loading={resending} disabled={resent} onClick={handleResend}>
              <Mail size={16} />
              {resent ? 'E-mail reenviado' : resending ? 'Enviando...' : 'Reenviar e-mail de verificação'}
            </Button>
            <Link to="/login" className="mt-5 block text-center text-[12.5px] text-forest-600 dark:text-forest-400">
              Voltar para Login
            </Link>
          </>
        )}

        {status === 'missing-token' && (
          <>
            <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-forest-100 text-forest-600 dark:bg-forest-900 dark:text-forest-400">
              <Mail size={20} />
            </div>
            <p className="mt-4 text-[13px] text-muted dark:text-muted-dark">
              Enviamos um link de confirmação para o seu e-mail. Clique nele para ativar sua conta.
            </p>
            <Button className="mt-6 w-full justify-center" loading={resending} disabled={resent} onClick={handleResend}>
              <Mail size={16} />
              {resent ? 'E-mail reenviado' : resending ? 'Enviando...' : 'Reenviar e-mail de verificação'}
            </Button>
            {message && <p className="mt-3 text-[12.5px] text-danger dark:text-danger-dark">{message}</p>}
            <Link to="/login" className="mt-5 block text-center text-[12.5px] text-forest-600 dark:text-forest-400">
              Voltar para Login
            </Link>
          </>
        )}
      </div>
    </AuthLayout>
  )
}
