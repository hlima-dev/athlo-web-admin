import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

const donationsData = [
  { month: "Jan", value: 1200 },
  { month: "Fev", value: 2400 },
  { month: "Mar", value: 4100 },
  { month: "Abr", value: 6200 },
  { month: "Mai", value: 8400 },
];

const engagementData = [
  { month: "Jan", value: 42 },
  { month: "Fev", value: 51 },
  { month: "Mar", value: 63 },
  { month: "Abr", value: 69 },
  { month: "Mai", value: 73 },
];

export function Reports() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-5xl font-black text-[#071B3A]">
          Relatórios
        </h1>

        <p className="text-slate-500 mt-3 text-lg max-w-3xl">
          Indicadores sobre eventos, doações,
          voluntários e engajamento da plataforma.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-slate-500">
            Eventos no mês
          </p>

          <h2 className="text-4xl font-black text-cyan-600 mt-3">
            24
          </h2>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-slate-500">
            Voluntários ativos
          </p>

          <h2 className="text-4xl font-black text-green-500 mt-3">
            32
          </h2>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-slate-500">
            Doações
          </p>

          <h2 className="text-4xl font-black text-yellow-500 mt-3">
            R$ 8,4k
          </h2>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-slate-500">
            Engajamento
          </p>

          <h2 className="text-4xl font-black text-purple-500 mt-3">
            73%
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-2xl font-black text-[#071B3A] mb-6">
            Evolução de doações
          </h2>

          <div className="h-72">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart data={donationsData}>
                <XAxis
                  dataKey="month"
                  stroke="#64748B"
                />

                <Tooltip />

                <Bar
                  dataKey="value"
                  fill="#22C55E"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-2xl font-black text-[#071B3A] mb-6">
            Engajamento da plataforma
          </h2>

          <div className="h-72">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart data={engagementData}>
                <XAxis
                  dataKey="month"
                  stroke="#64748B"
                />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#00D4FF"
                  strokeWidth={4}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <h2 className="text-2xl font-black text-[#071B3A] mb-4">
          Resumo mensal
        </h2>

        <p className="text-slate-500 leading-relaxed text-lg">
          No mês atual, a plataforma ATHLO
          apresentou crescimento nas ações da
          ASDA, com aumento no número de eventos
          cadastrados, maior participação de
          voluntários, evolução nas doações e
          fortalecimento do engajamento dos
          usuários com o esporte adaptado.
        </p>
      </div>
    </div>
  );
}