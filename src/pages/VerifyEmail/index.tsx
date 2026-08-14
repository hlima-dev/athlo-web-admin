import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2, XCircle, Loader2, Mail } from 'lucide-react'
import { api } from '../../services/api'

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

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="mx-auto animate-spin text-cyan-400" size={40} />
            <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">Verificando seu e-mail...</h1>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle2 className="mx-auto text-emerald-400" size={40} />
            <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">E-mail verificado!</h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Sua conta foi confirmada com sucesso.
            </p>
            <Link
              to="/login"
              className="mt-6 inline-block w-full rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 transition"
            >
              Ir para o login
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="mx-auto text-red-400" size={40} />
            <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">Link inválido ou expirado</h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">{message}</p>
            <button
              onClick={handleResend}
              disabled={resending || resent}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-slate-950 font-bold py-3 transition"
            >
              <Mail size={18} />
              {resent ? 'E-mail reenviado' : resending ? 'Enviando...' : 'Reenviar e-mail de verificação'}
            </button>
            <Link to="/login" className="block text-center text-cyan-400 mt-5">
              Voltar para Login
            </Link>
          </>
        )}

        {status === 'missing-token' && (
          <>
            <Mail className="mx-auto text-cyan-400" size={40} />
            <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">Confirme seu e-mail</h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Enviamos um link de confirmação para o seu e-mail. Clique nele para ativar sua conta.
            </p>
            <button
              onClick={handleResend}
              disabled={resending || resent}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-slate-950 font-bold py-3 transition"
            >
              <Mail size={18} />
              {resent ? 'E-mail reenviado' : resending ? 'Enviando...' : 'Reenviar e-mail de verificação'}
            </button>
            {message && <p className="mt-3 text-sm text-red-400">{message}</p>}
            <Link to="/login" className="block text-center text-cyan-400 mt-5">
              Voltar para Login
            </Link>
          </>
        )}
      </div>
    </main>
  )
}
