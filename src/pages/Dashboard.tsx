import { useEffect, useState } from "react";
import { getDashboard } from "../services/dashboard";

import {
  BarChart3,
  CalendarDays,
  HeartHandshake,
  HandHeart,
  TrendingUp,
  Users,
  Activity,
  ArrowUpRight,
} from "lucide-react";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
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
  athletes: number;
  users: number;
  events: number;
  donations: number;
  growthData: { month: string; atletas: number }[];
  donationData: { month: string; valor: number }[];
}

const eventsData = [
  { name: "Treinos", value: 12 },
  { name: "Campanhas", value: 6 },
  { name: "Campeonatos", value: 4 },
  { name: "Palestras", value: 2 },
];

const activities = [
  {
    title: "Dados sincronizados",
    description: "Dashboard atualizado com informações reais do banco.",
    time: "agora",
  },
  {
    title: "Sistema online",
    description: "Frontend, backend e banco conectados com sucesso.",
    time: "hoje",
  },
  {
    title: "ATHLO em produção",
    description: "Aplicação publicada e integrada ao Supabase.",
    time: "hoje",
  },
];

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
      title: "Atletas ativos",
      value: dashboard?.athletes ?? 0,
      change: "+12%",
      icon: Users,
    },
    {
      title: "Doações",
      value: `R$ ${dashboard?.donations ?? 0}`,
      change: "+24%",
      icon: HeartHandshake,
    },
    {
      title: "Usuários",
      value: dashboard?.users ?? 0,
      change: "+8%",
      icon: HandHeart,
    },
    {
      title: "Eventos",
      value: dashboard?.events ?? 0,
      change: "+5%",
      icon: CalendarDays,
    },
  ];

  const impactData = [
    {
      name: "Atletas",
      value: dashboard?.athletes ?? 0,
    },
    {
      name: "Usuários",
      value: dashboard?.users ?? 0,
    },
    {
      name: "Eventos",
      value: dashboard?.events ?? 0,
    },
  ];

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-cyan-500 via-blue-600 to-slate-900 p-6 shadow-2xl md:p-10">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white">
            <Activity size={16} />
            Visão geral da plataforma
          </span>

          <h1 className="mt-6 text-3xl font-black leading-tight text-white md:text-5xl">
            Transformando dados em impacto social real.
          </h1>

          <p className="mt-4 max-w-2xl text-white/80 md:text-lg">
            Acompanhe atletas, doações, eventos, voluntários e resultados da
            ASDA em um painel moderno e estratégico.
          </p>

          <button className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-4 font-black text-slate-950">
            Ver relatórios
            <ArrowUpRight size={20} />
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
                  <Icon size={24} />
                </div>

                <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-bold text-emerald-400">
                  <TrendingUp size={14} />
                  {item.change}
                </span>
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
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 xl:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-white">
                Crescimento de doações
              </h2>
              <p className="text-sm text-slate-400">
                Arrecadação mensal registrada.
              </p>
            </div>

            <BarChart3 className="text-cyan-400" size={28} />
          </div>

          <div className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboard?.donationData || []}>
                <defs>
                  <linearGradient
                    id="donationGradient"
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
                  fill="url(#donationGradient)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-black text-white">Impacto geral</h2>

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
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-black text-white">Tipos de eventos</h2>

          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eventsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="value" fill="#06b6d4" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-black text-white">
            Atividades recentes
          </h2>

          <div className="mt-6 space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.title}
                className="rounded-2xl bg-slate-800 p-4"
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h3 className="font-bold text-white">{activity.title}</h3>
                  <span className="text-xs text-slate-500">
                    {activity.time}
                  </span>
                </div>

                <p className="text-sm leading-relaxed text-slate-400">
                  {activity.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}