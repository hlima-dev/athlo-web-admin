import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Building2, ArrowRight } from 'lucide-react'
import { selectOrganization, saveSession, type OrganizationOption } from '../../services/auth'
import { getErrorMessage } from '../../utils/errors'

interface LocationState {
  preAuthToken?: string
  organizations?: OrganizationOption[]
}

const roleLabels: Record<string, string> = {
  OWNER: 'Dono(a)',
  ADMIN: 'Administrador(a)',
  MEMBER: 'Membro',
}

export function SelectOrganization() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = (location.state as LocationState) ?? {}

  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [error, setError] = useState('')

  // Chegou aqui sem os dados do login (ex.: recarregou a página) —
  // não tem como continuar, volta pro login.
  if (!state.preAuthToken || !state.organizations?.length) {
    navigate('/login', { replace: true })
    return null
  }

  async function handleSelect(organizationId: string) {
    setError('')
    try {
      setLoadingId(organizationId)
      const auth = await selectOrganization(state.preAuthToken!, organizationId)
      saveSession(auth)
      navigate('/dashboard', { replace: true })
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Não foi possível acessar essa empresa.'))
      setLoadingId(null)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 px-4">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Selecione a empresa</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 mb-6">
          Seu login tem acesso a mais de uma empresa no ATHLO. Escolha qual deseja usar agora —
          você pode trocar depois a qualquer momento.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-900/30 border border-red-700 text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-3">
          {state.organizations.map((org) => (
            <button
              key={org.id}
              type="button"
              onClick={() => handleSelect(org.id)}
              disabled={loadingId !== null}
              className="w-full flex items-center gap-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-5 py-4 text-left hover:border-cyan-400 hover:bg-cyan-500/5 transition disabled:opacity-50"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                <Building2 size={20} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 dark:text-white truncate">{org.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {roleLabels[org.orgRole] ?? org.orgRole} · {org.slug}
                </p>
              </div>

              {loadingId === org.id ? (
                <span className="text-xs text-cyan-400 font-semibold">Entrando...</span>
              ) : (
                <ArrowRight size={18} className="text-slate-400 shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}
