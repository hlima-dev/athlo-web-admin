import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Home as HomeIcon, Wallet, Users, CalendarDays,
  Clock3, ArrowUpRight, Activity, Bell, Target,
} from "lucide-react"
import { getDashboard } from "../services/dashboard"

export function Home() {
  const navigate = useNavigate()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const contacts = data?.contacts ?? 0
  const revenue = Number(data?.revenue ?? 0)
  const events = data?.events ?? 0
  const pendingInvoices = data?.pendingInvoices ?? 0

  function formatCurrency(value: number) {
    if (value >= 1000) return `R$ ${(value / 1000).toFixed(1)}k`
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  }

  const quickActions = [
    { label: "Cadastrar contato", path: "/contatos" },
    { label: "Nova fatura", path: "/financeiro" },
    { label: "Agendar compromisso", path: "/calendario" },
    { label: "Ver relatórios", path: "/relatorios" },
  ]

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-600 to-slate-900 p-6 shadow-xl md:p-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold text-white">
          <HomeIcon size={14} />
          Início
        </span>
        <h1 className="mt-5 text-2xl font-bold text-white md:text-4xl">
          Bem-vindo ao centro operacional do ATHLO.
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-white/80 md:text-base">
          Acompanhe rapidamente a saúde da sua empresa e acesse os principais módulos da plataforma.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <Users className="text-cyan-400" size={20} />
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Contatos</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{loading ? "..." : contacts}</h2>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <Wallet className="text-emerald-400" size={20} />
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Receita do mês</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{loading ? "..." : formatCurrency(revenue)}</h2>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <CalendarDays className="text-purple-400" size={20} />
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Compromissos</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{loading ? "..." : events}</h2>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <Clock3 className="text-yellow-400" size={20} />
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Faturas pendentes</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{loading ? "..." : pendingInvoices}</h2>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 xl:col-span-2">
          <div className="flex items-center gap-3">
            <Activity className="text-cyan-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Resumo operacional</h2>
          </div>
          <div className="mt-6 space-y-5">
            {[
              { label: "Contatos cadastrados vs meta (50)", value: Math.min(Math.round((contacts / 50) * 100), 100) },
              { label: "Compromissos vs meta (10)", value: Math.min(Math.round((events / 10) * 100), 100) },
              { label: "Receita vs meta (R$ 5.000)", value: Math.min(Math.round((revenue / 5000) * 100), 100) },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-semibold text-slate-600 dark:text-slate-300">{item.label}</span>
                  <span className="font-bold text-cyan-400">{loading ? "..." : `${item.value}%`}</span>
                </div>
                <div className="h-4 rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className="h-4 rounded-full bg-cyan-500 transition-all" style={{ width: loading ? "0%" : `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <div className="flex items-center gap-3">
            <Target className="text-cyan-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Ações rápidas</h2>
          </div>
          <div className="mt-6 space-y-3">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                className="flex w-full items-center justify-between rounded-2xl bg-slate-100 dark:bg-slate-800 p-4 font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                {action.label}
                <ArrowUpRight size={18} />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
        <div className="flex items-center gap-3">
          <Bell className="text-yellow-400" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Resumo do banco</h2>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 p-5">
            <h3 className="font-bold text-slate-900 dark:text-white">Contatos</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {loading ? "Carregando..." : `${contacts} contato${contacts !== 1 ? "s" : ""} cadastrado${contacts !== 1 ? "s" : ""} no sistema.`}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 p-5">
            <h3 className="font-bold text-slate-900 dark:text-white">Financeiro</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {loading ? "Carregando..." : `${formatCurrency(revenue)} recebidos este mês.`}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 p-5">
            <h3 className="font-bold text-slate-900 dark:text-white">Agenda</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {loading ? "Carregando..." : `${events} compromisso${events !== 1 ? "s" : ""} registrado${events !== 1 ? "s" : ""}.`}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
