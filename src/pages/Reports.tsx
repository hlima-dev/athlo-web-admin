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
    <div>
      <h1 className="text-4xl font-bold mb-4">Relatórios</h1>

      <p className="text-white/60 mb-8">
        Indicadores sobre eventos, doações, voluntários e engajamento da plataforma.
      </p>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-[#111827] p-6 rounded-3xl border border-white/5">
          <p className="text-white/50">Eventos no mês</p>
          <h2 className="text-4xl font-bold text-cyan-400 mt-3">24</h2>
        </div>

        <div className="bg-[#111827] p-6 rounded-3xl border border-white/5">
          <p className="text-white/50">Voluntários ativos</p>
          <h2 className="text-4xl font-bold text-green-400 mt-3">32</h2>
        </div>

        <div className="bg-[#111827] p-6 rounded-3xl border border-white/5">
          <p className="text-white/50">Doações</p>
          <h2 className="text-4xl font-bold text-yellow-400 mt-3">R$ 8,4k</h2>
        </div>

        <div className="bg-[#111827] p-6 rounded-3xl border border-white/5">
          <p className="text-white/50">Engajamento</p>
          <h2 className="text-4xl font-bold text-purple-400 mt-3">73%</h2>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-[#111827] rounded-3xl border border-white/5 p-6">
          <h2 className="text-2xl font-bold mb-6">Evolução de doações</h2>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={donationsData}>
                <XAxis dataKey="month" stroke="#ffffff50" />
                <Tooltip />
                <Bar dataKey="value" fill="#22C55E" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#111827] rounded-3xl border border-white/5 p-6">
          <h2 className="text-2xl font-bold mb-6">Engajamento da plataforma</h2>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engagementData}>
                <XAxis dataKey="month" stroke="#ffffff50" />
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

      <div className="bg-[#111827] rounded-3xl border border-white/5 p-6">
        <h2 className="text-2xl font-bold mb-4">Resumo mensal</h2>

        <p className="text-white/60 leading-relaxed">
          No mês atual, a plataforma ATHLO apresentou crescimento nas ações da
          ASDA, com aumento no número de eventos cadastrados, maior participação
          de voluntários, evolução nas doações e fortalecimento do engajamento
          dos usuários com o esporte adaptado.
        </p>
      </div>
    </div>
  );
}