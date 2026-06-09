import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Home as HomeIcon, HeartHandshake, Users, CalendarDays,
  Trophy, ArrowUpRight, Activity, Bell, Target,
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

  const athletes = data?.athletes ?? 0
  const donations = Number(data?.donations ?? 0)
  const events = data?.events ?? 0

  function formatCurrency(value: number) {
    if (value >= 1000) return `R$ ${(value / 1000).toFixed(1)}k`
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  }

  const quickActions = [
    { label: "Cadastrar atleta", path: "/atletas" },
    { label: "Criar evento", path: "/eventos" },
    { label: "Registrar doação", path: "/doacoes" },
    { label: "Ver relatórios", path: "/relatorios" },
  ]

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] bg-gradient-to-br from-cyan-500 via-blue-600 to-slate-900 p-6 md:p-10 shadow-2xl">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white">
          <HomeIcon size={16} />
          Lar
        </span>
        <h1 className="mt-6 text-3xl font-black text-white md:text-5xl">
          Bem-vindo ao centro operacional do ATHLO.
        </h1>
        <p className="mt-4 max-w-2xl text-white/80 md:text-lg">
          Acompanhe rapidamente o impacto da ASDA, veja ações importantes e acesse os principais módulos da plataforma.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-4">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <Users className="text-cyan-400" />
          <p className="mt-5 text-sm text-slate-400">Atletas acompanhados</p>
          <h2 className="mt-2 text-3xl font-black">{loading ? "..." : athletes}</h2>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <HeartHandshake className="text-emerald-400" />
          <p className="mt-5 text-sm text-slate-400">Doações recebidas</p>
          <h2 className="mt-2 text-3xl font-black">{loading ? "..." : formatCurrency(donations)}</h2>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <CalendarDays className="text-purple-400" />
          <p className="mt-5 text-sm text-slate-400">Eventos cadastrados</p>
          <h2 className="mt-2 text-3xl font-black">{loading ? "..." : events}</h2>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <Trophy className="text-yellow-400" />
          <p className="mt-5 text-sm text-slate-400">Usuários</p>
          <h2 className="mt-2 text-3xl font-black">{loading ? "..." : data?.users ?? 0}</h2>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 xl:col-span-2">
          <div className="flex items-center gap-3">
            <Activity className="text-cyan-400" />
            <h2 className="text-2xl font-black text-white">Resumo operacional</h2>
          </div>
          <div className="mt-6 space-y-5">
            {[
              { label: "Atletas cadastrados vs meta (20)", value: Math.min(Math.round((athletes / 20) * 100), 100) },
              { label: "Eventos realizados vs meta (10)", value: Math.min(Math.round((events / 10) * 100), 100) },
              { label: "Arrecadação vs meta (R$ 5.000)", value: Math.min(Math.round((donations / 5000) * 100), 100) },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-semibold text-slate-300">{item.label}</span>
                  <span className="font-bold text-cyan-400">{loading ? "..." : `${item.value}%`}</span>
                </div>
                <div className="h-4 rounded-full bg-slate-800">
                  <div className="h-4 rounded-full bg-cyan-500 transition-all" style={{ width: loading ? "0%" : `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center gap-3">
            <Target className="text-cyan-400" />
            <h2 className="text-2xl font-black text-white">Ações rápidas</h2>
          </div>
          <div className="mt-6 space-y-3">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                className="flex w-full items-center justify-between rounded-2xl bg-slate-800 p-4 font-bold text-slate-200 hover:bg-slate-700"
              >
                {action.label}
                <ArrowUpRight size={18} />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex items-center gap-3">
          <Bell className="text-yellow-400" />
          <h2 className="text-2xl font-black text-white">Resumo do banco</h2>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-800 p-5">
            <h3 className="font-black text-white">Atletas</h3>
            <p className="mt-2 text-sm text-slate-400">
              {loading ? "Carregando..." : `${athletes} atleta${athletes !== 1 ? "s" : ""} cadastrado${athletes !== 1 ? "s" : ""} no sistema.`}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-800 p-5">
            <h3 className="font-black text-white">Arrecadação</h3>
            <p className="mt-2 text-sm text-slate-400">
              {loading ? "Carregando..." : `${formatCurrency(donations)} em doações confirmadas.`}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-800 p-5">
            <h3 className="font-black text-white">Eventos</h3>
            <p className="mt-2 text-sm text-slate-400">
              {loading ? "Carregando..." : `${events} evento${events !== 1 ? "s" : ""} registrado${events !== 1 ? "s" : ""}.`}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
