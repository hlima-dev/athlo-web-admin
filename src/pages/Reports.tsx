import { useEffect, useState } from "react"
import {
  BarChart3, TrendingUp, Users, Wallet,
  CalendarDays, Clock3, Target, Download,
} from "lucide-react"
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts"
import { getDashboard } from "../services/dashboard"
import { PageHeader } from "../components/PageHeader"
import { useTheme } from "../components/Theme"

export function Reports() {
  const { theme } = useTheme()
  const gridColor = theme === "dark" ? "#1e293b" : "#e2e8f0"
  const axisColor = theme === "dark" ? "#94a3b8" : "#64748b"
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboard().then(setData).catch(console.error).finally(() => setLoading(false))
  }, [])

  const contacts = data?.contacts ?? 0
  const revenue = Number(data?.revenue ?? 0)
  const events = data?.events ?? 0
  const pendingInvoices = data?.pendingInvoices ?? 0
  const growthData = data?.growthData ?? []
  const revenueData = data?.revenueData ?? []

  const categoryData = [
    { name: "Contatos", value: contacts },
    { name: "Compromissos", value: events },
    { name: "Faturas pendentes", value: pendingInvoices },
  ]

  const goals = [
    { title: "Contatos vs meta (50)", value: Math.min(Math.round((contacts / 50) * 100), 100) },
    { title: "Compromissos vs meta (10)", value: Math.min(Math.round((events / 10) * 100), 100) },
    { title: "Receita vs meta (R$ 5.000)", value: Math.min(Math.round((revenue / 5000) * 100), 100) },
  ]

  function formatCurrency(value: number) {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  }

  return (
    <div className="space-y-8">
      <PageHeader
        icon={BarChart3}
        title="Relatórios"
        description="Dados claros para medir a evolução da sua empresa."
      />

      <section className="grid grid-cols-1 gap-5 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <Users className="text-cyan-400" size={20} />
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Contatos cadastrados</p>
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
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Crescimento de contatos</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Novos contatos cadastrados por mês.</p>
            </div>
            <TrendingUp className="text-cyan-400" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="contactsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="month" stroke={axisColor} />
                <YAxis stroke={axisColor} />
                <Tooltip />
                <Area type="monotone" dataKey="contatos" stroke="#06b6d4" fill="url(#contactsGradient)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Distribuição geral</h2>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={4}>
                  <Cell fill="#06b6d4" />
                  <Cell fill="#a855f7" />
                  <Cell fill="#eab308" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {categoryData.map((item) => (
              <div key={item.name} className="flex justify-between rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-3">
                <span className="text-slate-600 dark:text-slate-300">{item.name}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Receita por mês</h2>
          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="month" stroke={axisColor} />
                <YAxis stroke={axisColor} />
                <Tooltip />
                <Bar dataKey="valor" fill="#06b6d4" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Metas estratégicas</h2>
          <div className="mt-6 space-y-6">
            {goals.map((goal) => (
              <div key={goal.title}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-semibold text-slate-600 dark:text-slate-300">{goal.title}</span>
                  <span className="font-bold text-cyan-400">{loading ? "..." : `${goal.value}%`}</span>
                </div>
                <div className="h-4 rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className="h-4 rounded-full bg-cyan-500 transition-all" style={{ width: loading ? "0%" : `${goal.value}%` }} />
                </div>
              </div>
            ))}
          </div>
          <button className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-4 font-bold text-slate-950 hover:bg-cyan-400">
            <Download size={20} />
            Exportar relatório
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
        <div className="flex items-center gap-3">
          <Target className="text-cyan-400" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Análise de desempenho</h2>
        </div>
        <p className="mt-4 max-w-4xl text-slate-500 dark:text-slate-400 leading-relaxed">
          {loading ? "Carregando análise..." : `O sistema registra ${contacts} contato${contacts !== 1 ? "s" : ""}, ${events} compromisso${events !== 1 ? "s" : ""} e ${formatCurrency(revenue)} em receita neste mês. Esses indicadores ajudam a orientar decisões sobre vendas, cobrança e planejamento da equipe.`}
        </p>
      </section>
    </div>
  )
}
