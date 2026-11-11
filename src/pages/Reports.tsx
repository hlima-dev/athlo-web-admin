import { useEffect, useState } from "react"
import { Download, Target } from "lucide-react"
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts"
import { getDashboard, type DashboardData } from "../services/dashboard"
import { useTheme } from "../components/Theme"
import { downloadFile } from "../services/api"
import { useToast } from "../components/Toast"
import { Button, Card, CardHeader, PageContainer, StatStrip } from "../components/ui"

export function Reports() {
  const { theme } = useTheme()
  const toast = useToast()
  const gridColor = theme === "dark" ? "#2B2F27" : "#E4E0D6"
  const axisColor = theme === "dark" ? "#74766B" : "#9C9A90"
  const primaryColor = theme === "dark" ? "#2E6B54" : "#12352A"
  const secondaryColor = theme === "dark" ? "#D97A43" : "#B4531F"
  const tertiaryColor = theme === "dark" ? "#8CB3D9" : "#3B5B7A"
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)

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

  async function handleExport() {
    try {
      setExporting(true);
      const filename = `relatorio-athlo-${new Date().toISOString().slice(0, 10)}.xlsx`;
      await downloadFile("/dashboard/export", filename);
    } catch {
      toast.error("Erro ao gerar o relatório. Tente novamente.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <PageContainer>
      <StatStrip
        items={[
          { label: "Contatos cadastrados", value: loading ? "..." : String(contacts) },
          { label: "Receita do mês", value: loading ? "..." : formatCurrency(revenue) },
          { label: "Compromissos", value: loading ? "..." : String(events) },
          { label: "Faturas pendentes", value: loading ? "..." : String(pendingInvoices) },
        ]}
      />

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Crescimento de contatos" subtitle="Novos contatos cadastrados por mês." />
          <div className="h-80 p-5">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="reportsContactsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={primaryColor} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={primaryColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="month" stroke={axisColor} fontSize={12} />
                <YAxis stroke={axisColor} fontSize={12} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="contatos"
                  stroke={primaryColor}
                  fill="url(#reportsContactsGradient)"
                  strokeWidth={2.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Distribuição geral" />
          <div className="p-5">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={4}>
                    <Cell fill={primaryColor} />
                    <Cell fill={secondaryColor} />
                    <Cell fill={tertiaryColor} />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {categoryData.map((item) => (
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
          <CardHeader title="Receita por mês" />
          <div className="h-80 p-5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="month" stroke={axisColor} fontSize={12} />
                <YAxis stroke={axisColor} fontSize={12} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="valor" fill={primaryColor} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Metas estratégicas" />
          <div className="space-y-5 p-5">
            {goals.map((goal) => (
              <div key={goal.title}>
                <div className="mb-1.5 flex justify-between text-[12.5px]">
                  <span className="font-medium text-muted dark:text-muted-dark">{goal.title}</span>
                  <span className="font-semibold">{loading ? "..." : `${goal.value}%`}</span>
                </div>
                <div className="h-2 rounded-full bg-[#F0EEE8] dark:bg-white/[0.06]">
                  <div
                    className="h-2 rounded-full bg-forest transition-all dark:bg-forest-400"
                    style={{ width: loading ? "0%" : `${goal.value}%` }}
                  />
                </div>
              </div>
            ))}

            <Button className="w-full justify-center" loading={exporting} disabled={loading} onClick={handleExport}>
              <Download size={16} />
              {exporting ? "Gerando..." : "Exportar relatório (Excel)"}
            </Button>
          </div>
        </Card>
      </section>

      <Card>
        <CardHeader title="Análise de desempenho" action={<Target size={18} className="text-muted dark:text-muted-dark" />} />
        <p className="max-w-4xl p-5 text-[13px] leading-relaxed text-muted dark:text-muted-dark">
          {loading
            ? "Carregando análise..."
            : `O sistema registra ${contacts} contato${contacts !== 1 ? "s" : ""}, ${events} compromisso${events !== 1 ? "s" : ""} e ${formatCurrency(revenue)} em receita neste mês. Esses indicadores ajudam a orientar decisões sobre vendas, cobrança e planejamento da equipe.`}
        </p>
      </Card>
    </PageContainer>
  )
}
