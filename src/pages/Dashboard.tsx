import { useEffect, useState } from "react";
import { getDashboard } from "../services/dashboard";

import {
  BarChart3,
  CalendarDays,
  Wallet,
  Clock3,
  Users,
  Activity,
  ArrowUpRight,
  ClipboardList,
} from "lucide-react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DashboardData {
  contacts: number;
  users: number;
  events: number;
  pendingInvoices: number;
  openOrders: number;
  revenue: number | string;
  growthData: { month: string; contatos: number }[];
  revenueData: { month: string; valor: number }[];
  upcomingEvents: { id: string; title: string; type: string; startDate: string }[];
}

const typeLabels: Record<string, string> = {
  MEETING: "Reunião",
  TASK: "Tarefa",
  DEADLINE: "Prazo",
  OTHER: "Outro",
};

export function Dashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await getDashboard();
        setDashboard(data);
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[500px] items-center justify-center">
        <p className="text-slate-400">Carregando dashboard...</p>
      </div>
    );
  }

  const stats = [
    {
      title: "Contatos",
      value: dashboard?.contacts ?? 0,
      icon: Users,
    },
    {
      title: "Receita do mês",
      value: `R$ ${dashboard?.revenue ?? 0}`,
      icon: Wallet,
    },
    {
      title: "Faturas pendentes",
      value: dashboard?.pendingInvoices ?? 0,
      icon: Clock3,
    },
    {
      title: "Pedidos em aberto",
      value: dashboard?.openOrders ?? 0,
      icon: ClipboardList,
    },
    {
      title: "Compromissos",
      value: dashboard?.events ?? 0,
      icon: CalendarDays,
    },
  ];

  const impactData = [
    { name: "Contatos", value: dashboard?.contacts ?? 0 },
    { name: "Usuários", value: dashboard?.users ?? 0 },
    { name: "Compromissos", value: dashboard?.events ?? 0 },
  ];

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-600 to-slate-900 p-6 shadow-xl md:p-8">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold text-white">
            <Activity size={14} />
            Visão geral da empresa
          </span>

          <h1 className="mt-5 text-2xl font-bold leading-tight text-white md:text-4xl">
            Sua empresa organizada em um painel só.
          </h1>

          <p className="mt-3 max-w-2xl text-sm text-white/80 md:text-base">
            Acompanhe contatos, financeiro, agenda e equipe em um painel
            moderno e estratégico.
          </p>

          <a
            href="/relatorios"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950"
          >
            Ver relatórios
            <ArrowUpRight size={18} />
          </a>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
                <Icon size={24} />
              </div>

              <p className="mt-6 text-sm font-semibold text-slate-400">
                {item.title}
              </p>

              <h2 className="mt-2 text-3xl font-black text-white">
                {item.value}
              </h2>
            </div>
          );
        })}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 xl:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">
                Receita mensal
              </h2>
              <p className="text-sm text-slate-400">
                Faturas recebidas por mês.
              </p>
            </div>

            <BarChart3 className="text-cyan-400" size={28} />
          </div>

          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboard?.revenueData || []}>
                <defs>
                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="valor"
                  stroke="#06b6d4"
                  fill="url(#revenueGradient)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-lg font-bold text-white">Visão geral</h2>

          <div className="mt-6 h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={impactData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                >
                  <Cell fill="#06b6d4" />
                  <Cell fill="#22c55e" />
                  <Cell fill="#a855f7" />
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            {impactData.map((item) => (
              <div
                key={item.name}
                className="flex justify-between rounded-xl bg-slate-800 px-4 py-3"
              >
                <span className="text-slate-300">{item.name}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-lg font-bold text-white">
            Crescimento de contatos
          </h2>
          <p className="text-sm text-slate-400">Novos contatos por mês.</p>

          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboard?.growthData || []}>
                <defs>
                  <linearGradient id="contactsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Area type="monotone" dataKey="contatos" stroke="#22c55e" fill="url(#contactsGradient)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-lg font-bold text-white">
            Próximos compromissos
          </h2>

          <div className="mt-6 space-y-4">
            {(dashboard?.upcomingEvents ?? []).length === 0 ? (
              <p className="text-slate-400">Nenhum compromisso agendado.</p>
            ) : (
              dashboard?.upcomingEvents.map((event) => (
                <div key={event.id} className="rounded-2xl bg-slate-800 p-4">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <h3 className="font-bold text-white">{event.title}</h3>
                    <span className="text-xs text-slate-500">
                      {new Date(event.startDate).toLocaleDateString("pt-BR")}
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed text-slate-400">
                    {typeLabels[event.type] || event.type}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
