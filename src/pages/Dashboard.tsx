import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboard, type DashboardData } from "../services/dashboard";
import { useTheme } from "../components/Theme";
import { Card, CardHeader, PageContainer, StatStrip, EmptyState } from "../components/ui";

import {
  CalendarDays,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
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

const typeLabels: Record<string, string> = {
  MEETING: "Reunião",
  TASK: "Tarefa",
  DEADLINE: "Prazo",
  OTHER: "Outro",
};

const quickActions = [
  { label: "Cadastrar contato", path: "/contatos" },
  { label: "Nova fatura", path: "/financeiro" },
  { label: "Agendar compromisso", path: "/eventos" },
  { label: "Ver relatórios", path: "/relatorios" },
];

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function formatShortDate(iso: string) {
  const [, month, day] = iso.split("-");
  return `${day}/${month}`;
}

export function Dashboard() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const gridColor = theme === "dark" ? "#2B2F27" : "#E4E0D6";
  const axisColor = theme === "dark" ? "#74766B" : "#9C9A90";
  const primaryColor = theme === "dark" ? "#2E6B54" : "#12352A";
  const secondaryColor = theme === "dark" ? "#D97A43" : "#B4531F";
  const tertiaryColor = theme === "dark" ? "#8CB3D9" : "#3B5B7A";

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
      <PageContainer>
        <div className="flex h-[480px] items-center justify-center">
          <p className="text-[13px] text-muted dark:text-muted-dark">Carregando dashboard...</p>
        </div>
      </PageContainer>
    );
  }

  const stats = [
    { label: "Contatos", value: String(dashboard?.contacts ?? 0) },
    { label: "Receita do mês", value: formatBRL(Number(dashboard?.revenue ?? 0)) },
    {
      label: "Faturas pendentes",
      value: String(dashboard?.pendingInvoices ?? 0),
      tone: (dashboard?.pendingInvoices ?? 0) > 0 ? ("warn" as const) : ("default" as const),
    },
    { label: "Pedidos em aberto", value: String(dashboard?.openOrders ?? 0) },
    { label: "Compromissos", value: String(dashboard?.events ?? 0) },
  ];

  const impactData = [
    { name: "Contatos", value: dashboard?.contacts ?? 0 },
    { name: "Usuários", value: dashboard?.users ?? 0 },
    { name: "Compromissos", value: dashboard?.events ?? 0 },
  ];

  const cashFlowProjection = dashboard?.cashFlowProjection ?? [];

  return (
    <PageContainer>
      <section className="relative overflow-hidden rounded-card border border-line bg-forest p-6 text-white dark:border-line-dark md:p-8">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11.5px] font-medium">
            <Sparkles size={14} />
            Visão geral da empresa
          </span>

          <h1 className="mt-5 font-display text-2xl leading-tight md:text-4xl">
            Sua empresa organizada em um painel só.
          </h1>

          <p className="mt-3 max-w-2xl text-[13.5px] text-white/75 md:text-[14.5px]">
            Acompanhe contatos, financeiro, agenda e equipe em um painel moderno e estratégico.
          </p>

          <a
            href="/relatorios"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-white px-4 py-2.5 text-[13px] font-medium text-forest"
          >
            Ver relatórios
            <ArrowUpRight size={16} />
          </a>
        </div>
      </section>

      <StatStrip items={stats} />

      <Card>
        <CardHeader title="Ações rápidas" />
        <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={() => navigate(action.path)}
              className="flex items-center justify-between rounded-md border border-line px-4 py-3 text-left text-[13px] font-medium text-ink transition hover:border-forest-600/40 hover:text-forest-600 dark:border-line-dark dark:text-ink-dark dark:hover:border-forest-400/50 dark:hover:text-forest-400"
            >
              {action.label}
              <ArrowUpRight size={16} />
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Fluxo de caixa projetado"
          subtitle="Saldo acumulado das faturas pendentes nos próximos 90 dias — não é saldo bancário real."
          action={<TrendingUp className="text-muted dark:text-muted-dark" size={20} />}
        />
        <div className="p-5">
          {cashFlowProjection.length === 0 ? (
            <EmptyState
              icon={<TrendingUp size={20} />}
              title="Nenhuma fatura pendente"
              description="Quando houver faturas a receber ou a pagar em aberto, a projeção dos próximos 90 dias aparece aqui."
            />
          ) : (
            <div className="h-80 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cashFlowProjection}>
                  <defs>
                    <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={primaryColor} stopOpacity={0.35} />
                      <stop offset="95%" stopColor={primaryColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="date" tickFormatter={formatShortDate} stroke={axisColor} fontSize={12} />
                  <YAxis stroke={axisColor} fontSize={12} />
                  <Tooltip
                    labelFormatter={(value) => formatShortDate(String(value))}
                    formatter={(value, name) => {
                      const labels: Record<string, string> = {
                        balance: "Saldo acumulado",
                        in: "A receber no dia",
                        out: "A pagar no dia",
                      };
                      return [formatBRL(Number(value)), labels[String(name)] ?? String(name)];
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="balance"
                    stroke={primaryColor}
                    fill="url(#balanceGradient)"
                    strokeWidth={2.5}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </Card>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Receita mensal" subtitle="Faturas recebidas por mês." />
          <div className="h-80 w-full min-w-0 p-5">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboard?.revenueData || []}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={primaryColor} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={primaryColor} stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="month" stroke={axisColor} fontSize={12} />
                <YAxis stroke={axisColor} fontSize={12} />
                <Tooltip formatter={(value) => formatBRL(Number(value))} />
                <Area
                  type="monotone"
                  dataKey="valor"
                  stroke={primaryColor}
                  fill="url(#revenueGradient)"
                  strokeWidth={2.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Visão geral" />
          <div className="p-5">
            <div className="h-64 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={impactData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={4}
                  >
                    <Cell fill={primaryColor} />
                    <Cell fill={secondaryColor} />
                    <Cell fill={tertiaryColor} />
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 space-y-2">
              {impactData.map((item) => (
                <div
                  key={item.name}
                  className="flex justify-between rounded-md bg-[#F0EEE8] px-3.5 py-2.5 text-[13px] dark:bg-white/[0.06]"
                >
                  <span className="text-muted dark:text-muted-dark">{item.name}</span>
                  <strong className="tabular-nums">{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Crescimento de contatos" subtitle="Novos contatos por mês." />
          <div className="h-80 p-5">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboard?.growthData || []}>
                <defs>
                  <linearGradient id="contactsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={secondaryColor} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={secondaryColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="month" stroke={axisColor} fontSize={12} />
                <YAxis stroke={axisColor} fontSize={12} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="contatos"
                  stroke={secondaryColor}
                  fill="url(#contactsGradient)"
                  strokeWidth={2.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Próximos compromissos" />
          <div className="space-y-3 p-5">
            {(dashboard?.upcomingEvents ?? []).length === 0 ? (
              <EmptyState
                icon={<CalendarDays size={20} />}
                title="Nenhum compromisso agendado"
                description="Compromissos futuros aparecem aqui conforme forem criados na Agenda."
              />
            ) : (
              dashboard?.upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-md bg-[#F0EEE8] px-4 py-3 dark:bg-white/[0.06]"
                >
                  <div className="mb-1 flex items-start justify-between gap-3">
                    <h3 className="text-[13.5px] font-medium">{event.title}</h3>
                    <span className="whitespace-nowrap text-[11.5px] text-faint dark:text-faint-dark">
                      {new Date(event.startDate).toLocaleDateString("pt-BR")}
                    </span>
                  </div>

                  <p className="text-[12.5px] text-muted dark:text-muted-dark">
                    {typeLabels[event.type] || event.type}
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>
      </section>
    </PageContainer>
  );
}
