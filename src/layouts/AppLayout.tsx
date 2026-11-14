import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  Bell,
  BarChart3,
  Calendar,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Plus,
  ScrollText,
  Search,
  Settings,
  Shield,
  Sparkles,
  User,
  Users,
  Wallet,
  X,
} from 'lucide-react'
import { logout as logoutRequest, getStoredOrganization, getStoredUser } from '../services/auth'
import { getAdminErrorsSummary } from '../services/admin'
import { getMyPermissions, type OrgModule } from '../services/organization'
import { PaymentRequiredBanner } from '../components/PaymentRequiredBanner'
import { SwitchOrganizationModal } from '../components/SwitchOrganizationModal'
import { Badge } from '../components/ui'

const roleLabels: Record<string, string> = {
  OWNER: 'Dono(a)',
  ADMIN: 'Administrador(a)',
  MEMBER: 'Membro',
}

// Navegação agrupada — mesmos 10 destinos de sempre, só organizados em
// seções (igual ao padrão do design novo) em vez de uma lista única.
// "Admin ATHLO" fica de fora daqui porque é condicional e carrega um
// badge — continua montado à parte, como já era.
const navSections: { title: string | null; items: { label: string; path: string; icon: typeof LayoutDashboard }[] }[] = [
  { title: null, items: [{ label: 'Painel', path: '/dashboard', icon: LayoutDashboard }] },
  {
    title: 'Operação',
    items: [
      { label: 'Contatos', path: '/contatos', icon: Users },
      { label: 'Financeiro', path: '/financeiro', icon: Wallet },
      { label: 'Produtos', path: '/produtos', icon: Package },
      { label: 'Pedidos', path: '/pedidos', icon: ClipboardList },
      { label: 'Agenda', path: '/eventos', icon: Calendar },
      { label: 'Calendário', path: '/calendario', icon: CalendarDays },
      { label: 'Relatórios', path: '/relatorios', icon: BarChart3 },
    ],
  },
  {
    title: 'Empresa',
    items: [
      { label: 'Equipe', path: '/equipe', icon: Users },
      { label: 'Notificações', path: '/notificacoes', icon: Bell },
      { label: 'Configurações', path: '/configuracoes', icon: Settings },
    ],
  },
]

// Só os 5 módulos com permissão granular (ver OrgModule no backend) —
// os demais itens de menu (Painel, Calendário, Equipe, etc.) não têm
// gate nenhum e aparecem pra qualquer membro autenticado.
const navItemModule: Record<string, OrgModule> = {
  '/contatos': 'CONTACTS',
  '/financeiro': 'INVOICES',
  '/produtos': 'PRODUCTS',
  '/pedidos': 'ORDERS',
  '/eventos': 'EVENTS',
}

const quickCreateItems = [
  { label: 'Novo contato', to: '/contatos?novo=1' },
  { label: 'Nova fatura', to: '/financeiro?novo=1' },
  { label: 'Novo pedido', to: '/pedidos?novo=1' },
  { label: 'Novo produto', to: '/produtos?novo=1' },
  { label: 'Novo compromisso', to: '/eventos?novo=1' },
]

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Painel', subtitle: 'Visão geral da empresa' },
  '/contatos': { title: 'Contatos', subtitle: 'Clientes e fornecedores' },
  '/financeiro': { title: 'Financeiro', subtitle: 'Faturas, recebimentos e projeção' },
  '/produtos': { title: 'Produtos', subtitle: 'Catálogo e estoque' },
  '/pedidos': { title: 'Pedidos', subtitle: 'Vendas e entregas' },
  '/eventos': { title: 'Agenda', subtitle: 'Compromissos e lembretes' },
  '/calendario': { title: 'Calendário', subtitle: 'Visão mensal da agenda' },
  '/relatorios': { title: 'Relatórios', subtitle: 'Indicadores e metas' },
  '/equipe': { title: 'Equipe', subtitle: 'Membros e permissões' },
  '/auditoria': { title: 'Auditoria', subtitle: 'Trilha de ações da empresa' },
  '/notificacoes': { title: 'Notificações', subtitle: 'Alertas e avisos' },
  '/perfil': { title: 'Perfil', subtitle: 'Seus dados de acesso' },
  '/configuracoes': { title: 'Configurações', subtitle: 'Empresa, plano e preferências' },
  '/admin': { title: 'Admin ATHLO', subtitle: 'Administração da plataforma' },
}

function trialDaysLeft(trialEndsAt?: string | null): number | null {
  if (!trialEndsAt) return null
  const diff = new Date(trialEndsAt).getTime() - Date.now()
  if (diff <= 0) return 0
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

// Quanto menos dias faltam, mais chamativo o aviso fica — "calm" ainda dá
// tempo de decidir com calma, "warning" já é hora de agir, "critical" é
// hoje ou já acabou.
type TrialUrgency = 'calm' | 'warning' | 'critical'

function trialUrgency(daysLeft: number): TrialUrgency {
  if (daysLeft === 0) return 'critical'
  if (daysLeft <= 3) return 'warning'
  return 'calm'
}

const trialBannerStyles: Record<TrialUrgency, { box: string; icon: string; title: string; subtitle: string; button: string }> = {
  calm: {
    box: 'bg-forest-700/70',
    icon: 'text-[#F1C9AE]',
    title: 'text-[#C6D6CD]',
    subtitle: 'text-[#8FA99B]',
    button: 'bg-[#DCE7E0] text-forest hover:bg-white',
  },
  warning: {
    box: 'border border-clay-dark/40 bg-[#3A2F14]',
    icon: 'text-[#E8C468]',
    title: 'text-[#E8C468]',
    subtitle: 'text-[#C9A868]',
    button: 'bg-[#E8C468] text-[#3A2A0E] hover:bg-[#F0D37E]',
  },
  critical: {
    box: 'border border-danger-dark/50 bg-[#3E1C19]',
    icon: 'text-danger-dark',
    title: 'text-danger-dark',
    subtitle: 'text-[#C98D85]',
    button: 'bg-danger-dark text-[#2A0E0C] hover:bg-[#E07A6D]',
  },
}

type StoredUser = ReturnType<typeof getStoredUser>
type StoredOrganization = ReturnType<typeof getStoredOrganization>

interface SidebarProps {
  user: StoredUser
  organization: StoredOrganization
  isPlatformAdmin: boolean
  canViewAudit: boolean
  enabledModules: Set<OrgModule> | null
  unresolvedErrorCount: number
  onNavigate: () => void
  onClose: () => void
  onSwitchOrganization: () => void
}

function SidebarContent({
  user,
  organization,
  isPlatformAdmin,
  canViewAudit,
  enabledModules,
  unresolvedErrorCount,
  onNavigate,
  onClose,
  onSwitchOrganization,
}: SidebarProps) {
  const daysLeft = trialDaysLeft(organization?.subscription?.trialEndsAt)
  const showTrialBanner = organization?.subscription?.status === 'TRIALING' && daysLeft !== null

  // Auditoria só aparece pra OWNER/ADMIN (o endpoint já é gated assim no
  // backend — isso só evita mostrar um link que levaria a um 403).
  const sectionsWithAudit = navSections.map((section) =>
    section.title === 'Empresa' && canViewAudit
      ? {
          ...section,
          items: [
            section.items[0],
            { label: 'Auditoria', path: '/auditoria', icon: ScrollText },
            ...section.items.slice(1),
          ],
        }
      : section
  )

  // Esconde do menu os módulos que o MEMBER não tem liberado — enquanto
  // a permissão ainda não carregou (enabledModules === null), mostra
  // tudo pra não "piscar" itens somem-e-voltam.
  const sections = sectionsWithAudit
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        const module = navItemModule[item.path]
        return !module || !enabledModules || enabledModules.has(module)
      }),
    }))
    .filter((section) => section.items.length > 0)

  return (
    <div className="flex h-full flex-col bg-forest text-[#DCE7E0] dark:bg-forest-900">
      <div className="flex items-center justify-between px-6 pb-6 pt-7">
        <Link to="/dashboard" onClick={onNavigate} className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-[#DCE7E0] font-display text-lg leading-none text-forest">
            a
          </span>
          <span className="text-[17px] font-semibold tracking-[0.14em] text-white">ATHLO</span>
        </Link>
        <button
          onClick={onClose}
          className="grid h-8 w-8 place-items-center rounded text-emerald-100/70 hover:bg-white/10 hover:text-white md:hidden"
          aria-label="Fechar menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <button
        type="button"
        onClick={onSwitchOrganization}
        className="mx-4 mb-6 flex items-center gap-3 rounded-card border border-white/10 bg-forest-700/60 px-3 py-2.5 text-left transition hover:border-white/20 hover:bg-forest-700"
      >
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-clay/20 text-[13px] font-semibold text-[#F1C9AE]">
          {(organization?.name ?? 'AT').slice(0, 2).toUpperCase()}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-medium text-white">
            {organization?.name ?? 'Minha empresa'}
          </span>
          <span className="block text-[11px] text-[#9FB8AC]">
            {user?.orgRole ? roleLabels[user.orgRole] ?? user.orgRole : ''}
          </span>
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-[#9FB8AC]" />
      </button>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3">
        {sections.map((section, index) => (
          <div key={section.title ?? index}>
            {section.title ? (
              <p className="px-3 pb-2 text-[11px] uppercase tracking-wider text-[#7E9B8D]">{section.title}</p>
            ) : null}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      onClick={onNavigate}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-md px-3 py-2 text-[13.5px] transition ${
                          isActive
                            ? 'bg-[#DCE7E0] font-medium text-forest'
                            : 'text-[#C6D6CD] hover:bg-white/[0.07] hover:text-white'
                        }`
                      }
                    >
                      <Icon className="h-[17px] w-[17px] shrink-0" strokeWidth={1.75} />
                      {item.label}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}

        {isPlatformAdmin ? (
          <div>
            <p className="px-3 pb-2 text-[11px] uppercase tracking-wider text-[#7E9B8D]">Plataforma</p>
            <NavLink
              to="/admin"
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center justify-between gap-3 rounded-md px-3 py-2 text-[13.5px] transition ${
                  isActive ? 'bg-[#DCE7E0] font-medium text-forest' : 'text-[#F1C9AE] hover:bg-white/[0.07] hover:text-white'
                }`
              }
            >
              <span className="flex items-center gap-3">
                <Shield className="h-[17px] w-[17px] shrink-0" strokeWidth={1.75} />
                Admin ATHLO
              </span>
              {unresolvedErrorCount > 0 ? <Badge tone="negative">{unresolvedErrorCount}</Badge> : null}
            </NavLink>
          </div>
        ) : null}
      </nav>

      {showTrialBanner && daysLeft !== null ? (
        (() => {
          const urgency = trialUrgency(daysLeft)
          const style = trialBannerStyles[urgency]
          const Icon = urgency === 'calm' ? Sparkles : AlertTriangle
          return (
            <div className={`mx-4 mb-4 rounded-card p-3 ${style.box}`}>
              <div className={`flex items-center gap-2 text-[12px] font-medium ${style.title}`}>
                <Icon className={`h-4 w-4 shrink-0 ${style.icon}`} />
                <span>{daysLeft === 0 ? 'Trial encerrado' : `Trial termina em ${daysLeft} dia${daysLeft === 1 ? '' : 's'}`}</span>
              </div>
              <p className={`mt-1.5 text-[11.5px] leading-relaxed ${style.subtitle}`}>
                {urgency === 'critical'
                  ? 'Escolha um plano agora para não perder o acesso aos seus dados.'
                  : 'Escolha um plano para continuar usando o ATHLO sem interrupção.'}
              </p>
              <Link
                to="/configuracoes"
                onClick={onNavigate}
                className={`mt-3 block w-full rounded-md py-1.5 text-center text-[12.5px] font-medium transition ${style.button}`}
              >
                Ver planos
              </Link>
            </div>
          )
        })()
      ) : null}

      <Link
        to="/perfil"
        onClick={onNavigate}
        className="flex items-center gap-3 border-t border-white/10 px-4 py-3 transition hover:bg-white/[0.04]"
      >
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10 text-[12px] font-medium text-white">
          <User className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[12.5px] text-white">{user?.name ?? 'Usuário'}</span>
          <span className="block text-[11px] text-[#8FA99B]">Ver perfil</span>
        </span>
      </Link>
    </div>
  )
}

export function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [switchModalOpen, setSwitchModalOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const user = getStoredUser()
  const organization = getStoredOrganization()
  const isPlatformAdmin = !!user?.isPlatformAdmin
  const canViewAudit = user?.orgRole === 'OWNER' || user?.orgRole === 'ADMIN'
  const [unresolvedErrorCount, setUnresolvedErrorCount] = useState(0)
  const [enabledModules, setEnabledModules] = useState<Set<OrgModule> | null>(null)

  useEffect(() => {
    getMyPermissions()
      .then((permissions) => {
        setEnabledModules(new Set(permissions.filter((p) => p.enabled).map((p) => p.module)))
      })
      .catch(() => {})
  }, [])

  const meta = pageTitles[location.pathname] ?? { title: 'ATHLO', subtitle: 'Gestão' }

  useEffect(() => {
    if (!isPlatformAdmin) return

    function refresh() {
      getAdminErrorsSummary()
        .then(({ unresolvedCount }) => setUnresolvedErrorCount(unresolvedCount))
        .catch(() => {})
    }

    refresh()
    const interval = setInterval(refresh, 60_000)
    return () => clearInterval(interval)
  }, [isPlatformAdmin])

  // Fecha o drawer mobile quando a rota muda (ex.: botão voltar do
  // navegador) — ajuste de estado durante a renderização em vez de
  // useEffect, igual ao padrão que o próprio React recomenda pra
  // "resetar estado quando uma prop muda" (useState pra guardar o valor
  // anterior, não useRef — ref não pode ser lido/escrito durante o
  // render).
  const [lastPath, setLastPath] = useState(location.pathname)
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname)
    if (mobileOpen) setMobileOpen(false)
  }

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const typing = target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
      if (e.key === '/' && !typing) {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [menuOpen])

  async function handleLogout() {
    await logoutRequest()
    navigate('/login')
  }

  const sidebarProps: SidebarProps = {
    user,
    organization,
    isPlatformAdmin,
    canViewAudit,
    enabledModules,
    unresolvedErrorCount,
    onNavigate: () => setMobileOpen(false),
    onClose: () => setMobileOpen(false),
    onSwitchOrganization: () => setSwitchModalOpen(true),
  }

  return (
    <div className="min-h-screen bg-canvas font-sans text-ink antialiased dark:bg-canvas-dark dark:text-ink-dark">
      <PaymentRequiredBanner />
      <SwitchOrganizationModal open={switchModalOpen} onClose={() => setSwitchModalOpen(false)} />

      <div className="flex">
        <aside className="sticky top-0 hidden h-screen w-[264px] shrink-0 md:block">
          <SidebarContent {...sidebarProps} />
        </aside>

        {mobileOpen ? (
          <div className="fixed inset-0 z-40 md:hidden">
            <button
              aria-label="Fechar menu"
              className="absolute inset-0 bg-ink/45"
              onClick={() => setMobileOpen(false)}
            />
            <div className="relative h-full w-[272px] max-w-[85vw] shadow-xl">
              <SidebarContent {...sidebarProps} />
            </div>
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-line bg-canvas/95 backdrop-blur dark:border-line-dark dark:bg-canvas-dark/95">
            <div className="flex items-center gap-3 px-4 py-3.5 sm:px-8">
              <button
                onClick={() => setMobileOpen(true)}
                className="grid h-9 w-9 place-items-center rounded-md border border-line bg-surface text-muted transition hover:text-ink dark:border-line-dark dark:bg-surface-dark dark:text-muted-dark md:hidden"
                aria-label="Abrir menu"
              >
                <Menu className="h-4 w-4" />
              </button>

              <div className="min-w-0 flex-1">
                <h1 className="truncate text-[19px] font-semibold tracking-tight">{meta.title}</h1>
                <p className="truncate text-[12.5px] text-muted dark:text-muted-dark">{meta.subtitle}</p>
              </div>

              <label className="hidden items-center gap-2 rounded-md border border-line bg-surface px-3 py-2 dark:border-line-dark dark:bg-surface-dark md:flex">
                <Search className="h-4 w-4 shrink-0 text-faint dark:text-faint-dark" />
                <input
                  ref={searchRef}
                  onChange={(e) => {
                    if (e.target.value.trim()) navigate(`/contatos?q=${encodeURIComponent(e.target.value.trim())}`)
                  }}
                  className="w-40 bg-transparent text-[13px] outline-none transition-[width] placeholder:text-faint focus:w-56 dark:placeholder:text-faint-dark"
                  placeholder="Buscar contato…"
                  aria-label="Buscar"
                />
                <kbd className="rounded border border-line px-1.5 py-0.5 text-[10px] text-faint dark:border-line-dark dark:text-faint-dark">
                  /
                </kbd>
              </label>

              <Link
                to="/notificacoes"
                className="grid h-9 w-9 place-items-center rounded-md border border-line bg-surface text-muted transition hover:text-ink dark:border-line-dark dark:bg-surface-dark dark:text-muted-dark"
                aria-label="Notificações"
              >
                <Bell className="h-4 w-4" />
              </Link>

              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-1.5 rounded-md bg-forest px-3 py-2 text-[13px] font-medium text-white transition hover:bg-forest-600 dark:bg-forest-400 dark:hover:bg-forest-500"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Novo</span>
                  <ChevronDown className="hidden h-3.5 w-3.5 sm:block" />
                </button>
                {menuOpen ? (
                  <div
                    role="menu"
                    className="absolute right-0 top-[calc(100%+6px)] w-52 overflow-hidden rounded-card border border-line bg-surface py-1 shadow-lg dark:border-line-dark dark:bg-surface-dark"
                  >
                    {quickCreateItems
                      .filter((item) => {
                        const module = navItemModule[item.to.split('?')[0]]
                        return !module || !enabledModules || enabledModules.has(module)
                      })
                      .map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          role="menuitem"
                          onClick={() => setMenuOpen(false)}
                          className="block px-3.5 py-2 text-[13px] transition hover:bg-[#F7F5EF] dark:hover:bg-white/[0.06]"
                        >
                          {item.label}
                        </Link>
                      ))}
                  </div>
                ) : null}
              </div>
            </div>
          </header>

          <main className="min-w-0 flex-1">
            <Outlet />
          </main>

          <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-5 py-4 text-[11.5px] text-faint dark:border-line-dark dark:text-faint-dark sm:px-8">
            <span>
              ATHLO · {organization?.name ?? ''}
              {organization?.subscription?.plan?.name ? ` · Plano ${organization.subscription.plan.name}` : ''}
            </span>
            <button onClick={handleLogout} className="flex items-center gap-1 transition hover:text-ink dark:hover:text-ink-dark">
              <LogOut className="h-3 w-3" /> Sair
            </button>
          </footer>
        </div>
      </div>
    </div>
  )
}
