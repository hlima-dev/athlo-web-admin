import {
  Home as HomeIcon,
  HeartHandshake,
  Users,
  CalendarDays,
  Trophy,
  ArrowUpRight,
  Activity,
  Bell,
  Target,
} from "lucide-react";

const quickActions = [
  "Cadastrar atleta",
  "Criar evento",
  "Registrar doação",
  "Gerar relatório",
];

export function Home() {
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
          Acompanhe rapidamente o impacto da ASDA, veja ações importantes e
          acesse os principais módulos da plataforma.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-4">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <Users className="text-cyan-400" />
          <p className="mt-5 text-sm text-slate-400">Atletas acompanhados</p>
          <h2 className="mt-2 text-3xl font-black">127</h2>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <HeartHandshake className="text-emerald-400" />
          <p className="mt-5 text-sm text-slate-400">Doações recebidas</p>
          <h2 className="mt-2 text-3xl font-black">R$ 8,4k</h2>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <CalendarDays className="text-purple-400" />
          <p className="mt-5 text-sm text-slate-400">Eventos ativos</p>
          <h2 className="mt-2 text-3xl font-black">12</h2>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <Trophy className="text-yellow-400" />
          <p className="mt-5 text-sm text-slate-400">Conquistas</p>
          <h2 className="mt-2 text-3xl font-black">18</h2>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 xl:col-span-2">
          <div className="flex items-center gap-3">
            <Activity className="text-cyan-400" />
            <h2 className="text-2xl font-black text-white">
              Resumo operacional
            </h2>
          </div>

          <div className="mt-6 space-y-5">
            {[
              { label: "Meta de doações do mês", value: 72 },
              { label: "Participação em eventos", value: 84 },
              { label: "Voluntários ativos", value: 63 },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-semibold text-slate-300">
                    {item.label}
                  </span>
                  <span className="font-bold text-cyan-400">{item.value}%</span>
                </div>

                <div className="h-4 rounded-full bg-slate-800">
                  <div
                    className="h-4 rounded-full bg-cyan-500"
                    style={{ width: `${item.value}%` }}
                  />
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
                key={action}
                className="flex w-full items-center justify-between rounded-2xl bg-slate-800 p-4 font-bold text-slate-200 hover:bg-slate-700"
              >
                {action}
                <ArrowUpRight size={18} />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex items-center gap-3">
          <Bell className="text-yellow-400" />
          <h2 className="text-2xl font-black text-white">Avisos importantes</h2>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-800 p-5">
            <h3 className="font-black text-white">Evento próximo</h3>
            <p className="mt-2 text-sm text-slate-400">
              Treino coletivo agendado para hoje às 19h.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-800 p-5">
            <h3 className="font-black text-white">Campanha ativa</h3>
            <p className="mt-2 text-sm text-slate-400">
              Campanha de equipamentos atingiu 72% da meta.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-800 p-5">
            <h3 className="font-black text-white">Novo cadastro</h3>
            <p className="mt-2 text-sm text-slate-400">
              Um novo atleta foi cadastrado recentemente.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}