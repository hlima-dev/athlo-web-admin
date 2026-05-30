import {
  HeartHandshake,
  TrendingUp,
  QrCode,
  Wallet,
  Users,
  CalendarDays,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

const campaigns = [
  {
    title: "Equipamentos esportivos",
    goal: 5000,
    raised: 3650,
    status: "Em andamento",
  },
  {
    title: "Viagem para campeonato",
    goal: 8000,
    raised: 4200,
    status: "Prioridade",
  },
  {
    title: "Treinos e estrutura",
    goal: 3000,
    raised: 2100,
    status: "Ativa",
  },
];

const donations = [
  { donor: "Ana Souza", amount: "R$ 150,00", date: "Hoje", method: "PIX" },
  { donor: "Carlos Lima", amount: "R$ 300,00", date: "Ontem", method: "PIX" },
  { donor: "Empresa parceira", amount: "R$ 1.200,00", date: "12/05", method: "Transferência" },
];

export function Donations() {
  return (
    <div className="space-y-8">
      <section className="rounded-[32px] bg-gradient-to-br from-cyan-500 via-blue-600 to-slate-900 p-6 md:p-10 shadow-2xl">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white">
          <HeartHandshake size={16} />
          Gestão de doações
        </span>

        <h1 className="mt-6 text-3xl font-black text-white md:text-5xl">
          Controle campanhas, metas e contribuições da ASDA.
        </h1>

        <p className="mt-4 max-w-2xl text-white/80 md:text-lg">
          Acompanhe arrecadações, visualize campanhas ativas e mantenha a
          transparência sobre o impacto de cada doação.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-4">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <Wallet className="text-cyan-400" />
          <p className="mt-5 text-sm text-slate-400">Total arrecadado</p>
          <h2 className="mt-2 text-3xl font-black">R$ 8.450</h2>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <TrendingUp className="text-emerald-400" />
          <p className="mt-5 text-sm text-slate-400">Crescimento mensal</p>
          <h2 className="mt-2 text-3xl font-black">+24%</h2>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <Users className="text-purple-400" />
          <p className="mt-5 text-sm text-slate-400">Doadores</p>
          <h2 className="mt-2 text-3xl font-black">86</h2>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <CalendarDays className="text-yellow-400" />
          <p className="mt-5 text-sm text-slate-400">Campanhas ativas</p>
          <h2 className="mt-2 text-3xl font-black">3</h2>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 xl:col-span-2">
          <h2 className="text-2xl font-black">Campanhas de arrecadação</h2>

          <div className="mt-6 space-y-5">
            {campaigns.map((campaign) => {
              const progress = Math.round((campaign.raised / campaign.goal) * 100);

              return (
                <div key={campaign.title} className="rounded-2xl bg-slate-800 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-black">{campaign.title}</h3>
                      <p className="mt-1 text-sm text-slate-400">
                        R$ {campaign.raised.toLocaleString("pt-BR")} de R${" "}
                        {campaign.goal.toLocaleString("pt-BR")}
                      </p>
                    </div>

                    <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-sm font-bold text-cyan-400">
                      {campaign.status}
                    </span>
                  </div>

                  <div className="mt-5">
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-slate-400">Progresso</span>
                      <strong className="text-cyan-400">{progress}%</strong>
                    </div>

                    <div className="h-3 rounded-full bg-slate-700">
                      <div
                        className="h-3 rounded-full bg-cyan-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-500/10 text-cyan-400">
            <QrCode size={34} />
          </div>

          <h2 className="mt-6 text-2xl font-black">PIX da campanha</h2>

          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Espaço preparado para integrar QR Code PIX, chave de doação e
            confirmação automática futuramente.
          </p>

          <div className="mt-6 rounded-2xl border border-dashed border-slate-700 bg-slate-800 p-6 text-center">
            <QrCode className="mx-auto text-slate-500" size={96} />
            <p className="mt-4 text-sm text-slate-400">QR Code em breve</p>
          </div>

          <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-4 font-black text-slate-950">
            Configurar doação
            <ArrowUpRight size={20} />
          </button>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-2xl font-black">Histórico de doações</h2>

        <div className="mt-6 space-y-4">
          {donations.map((donation) => (
            <div
              key={`${donation.donor}-${donation.amount}`}
              className="flex flex-col gap-4 rounded-2xl bg-slate-800 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                  <CheckCircle2 />
                </div>

                <div>
                  <h3 className="font-black">{donation.donor}</h3>
                  <p className="text-sm text-slate-400">
                    {donation.method} • {donation.date}
                  </p>
                </div>
              </div>

              <strong className="text-xl text-cyan-400">{donation.amount}</strong>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}