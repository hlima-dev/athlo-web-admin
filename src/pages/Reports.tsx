import {
  BarChart3,
  TrendingUp,
  Users,
  HeartHandshake,
  CalendarDays,
  Trophy,
  Target,
  Download,
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

const monthlyImpact = [
  { month: "Jan", atletas: 72, doacoes: 1200, eventos: 3 },
  { month: "Fev", atletas: 81, doacoes: 1800, eventos: 5 },
  { month: "Mar", atletas: 93, doacoes: 2600, eventos: 7 },
  { month: "Abr", atletas: 105, doacoes: 3400, eventos: 8 },
  { month: "Mai", atletas: 127, doacoes: 8450, eventos: 12 },
];

const categoryData = [
  { name: "Atletas", value: 127 },
  { name: "Voluntários", value: 32 },
  { name: "Eventos", value: 24 },
  { name: "Campanhas", value: 8 },
];

const goals = [
  { title: "Meta de doações", value: 72 },
  { title: "Participação em eventos", value: 84 },
  { title: "Voluntários ativos", value: 63 },
];

export function Reports() {
  return (
    <div className="space-y-8">
      <section className="rounded-[32px] bg-gradient-to-br from-cyan-500 via-blue-600 to-slate-900 p-6 shadow-2xl md:p-10">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white">
          <BarChart3 size={16} />
          Relatórios e indicadores
        </span>

        <h1 className="mt-6 text-3xl font-black text-white md:text-5xl">
          Dados claros para medir impacto e evolução.
        </h1>

        <p className="mt-4 max-w-2xl text-white/80 md:text-lg">
          Acompanhe crescimento, campanhas, doações, eventos e resultados da
          ASDA com relatórios visuais e estratégicos.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-4">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <Users className="text-cyan-400" />
          <p className="mt-5 text-sm text-slate-400">Atletas impactados</p>
          <h2 className="mt-2 text-3xl font-black">127</h2>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <HeartHandshake className="text-emerald-400" />
          <p className="mt-5 text-sm text-slate-400">Doações no ano</p>
          <h2 className="mt-2 text-3xl font-black">R$ 17,4k</h2>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <CalendarDays className="text-purple-400" />
          <p className="mt-5 text-sm text-slate-400">Eventos realizados</p>
          <h2 className="mt-2 text-3xl font-black">24</h2>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <Trophy className="text-yellow-400" />
          <p className="mt-5 text-sm text-slate-400">Conquistas</p>
          <h2 className="mt-2 text-3xl font-black">18</h2>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 xl:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-white">
                Evolução mensal
              </h2>
              <p className="text-sm text-slate-400">
                Crescimento de atletas acompanhados.
              </p>
            </div>

            <TrendingUp className="text-cyan-400" />
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyImpact}>
                <defs>
                  <linearGradient id="athletesGradient" x1="0" y1="0" x2="0" y2="1">
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
                  dataKey="atletas"
                  stroke="#06b6d4"
                  fill="url(#athletesGradient)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-black text-white">
            Distribuição geral
          </h2>

          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                >
                  <Cell fill="#06b6d4" />
                  <Cell fill="#22c55e" />
                  <Cell fill="#a855f7" />
                  <Cell fill="#eab308" />
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            {categoryData.map((item) => (
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
          <h2 className="text-2xl font-black text-white">
            Doações por mês
          </h2>

          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyImpact}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="doacoes" fill="#06b6d4" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-black text-white">
            Metas estratégicas
          </h2>

          <div className="mt-6 space-y-6">
            {goals.map((goal) => (
              <div key={goal.title}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-semibold text-slate-300">
                    {goal.title}
                  </span>

                  <span className="font-bold text-cyan-400">
                    {goal.value}%
                  </span>
                </div>

                <div className="h-4 rounded-full bg-slate-800">
                  <div
                    className="h-4 rounded-full bg-cyan-500"
                    style={{ width: `${goal.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <button className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-4 font-black text-slate-950 hover:bg-cyan-400">
            <Download size={20} />
            Exportar relatório
          </button>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex items-center gap-3">
          <Target className="text-cyan-400" />
          <h2 className="text-2xl font-black text-white">
            Análise de impacto
          </h2>
        </div>

        <p className="mt-4 max-w-4xl text-slate-400 leading-relaxed">
          Os dados indicam crescimento contínuo no número de atletas
          acompanhados, aumento nas doações e maior participação em eventos.
          Esses indicadores demonstram a evolução da estrutura da ASDA e ajudam
          a orientar decisões futuras sobre campanhas, treinos, voluntariado e
          captação de recursos.
        </p>
      </section>
    </div>
  );
}