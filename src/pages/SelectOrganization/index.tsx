import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Building2, ArrowRight } from 'lucide-react'
import { selectOrganization, saveSession, type OrganizationOption } from '../../services/auth'
import { getErrorMessage } from '../../utils/errors'
import { AuthLayout } from '../../components/AuthLayout'

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
    <AuthLayout
      title="Selecione a empresa"
      subtitle="Seu login tem acesso a mais de uma empresa no ATHLO. Escolha qual deseja usar agora — você pode trocar depois a qualquer momento."
      maxWidth="max-w-lg"
    >
      {error && (
        <p className="mb-4 rounded-md bg-[#F6E4E1] px-3.5 py-2.5 text-[12.5px] text-danger dark:bg-danger-dark/10 dark:text-danger-dark">
          {error}
        </p>
      )}

      <div className="space-y-2.5">
        {state.organizations.map((org) => (
          <button
            key={org.id}
            type="button"
            onClick={() => handleSelect(org.id)}
            disabled={loadingId !== null}
            className="flex w-full items-center gap-3.5 rounded-md border border-line px-4 py-3.5 text-left transition hover:border-forest-600/40 hover:bg-[#F0EEE8] disabled:opacity-50 dark:border-line-dark dark:hover:border-forest-400/50 dark:hover:bg-white/[0.06]"
          >
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-forest-100 text-forest-600 dark:bg-forest-900 dark:text-forest-400">
              <Building2 size={18} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-semibold">{org.name}</p>
              <p className="text-[12.5px] text-muted dark:text-muted-dark">
                {roleLabels[org.orgRole] ?? org.orgRole} · {org.slug}
              </p>
            </div>

            {loadingId === org.id ? (
              <span className="text-[11.5px] font-medium text-forest-600 dark:text-forest-400">Entrando...</span>
            ) : (
              <ArrowRight size={16} className="shrink-0 text-faint dark:text-faint-dark" />
            )}
          </button>
        ))}
      </div>
    </AuthLayout>
  )
}
