import {
  Bell,
  CheckCircle2,
  CalendarDays,
  HeartHandshake,
  Users,
  AlertCircle,
  Clock3,
  Filter,
  MailCheck,
} from "lucide-react";

const notifications = [
  {
    title: "Nova doação recebida",
    description: "Uma contribuição de R$ 300,00 foi registrada via PIX.",
    time: "há 8 min",
    type: "Doação",
    icon: HeartHandshake,
    color: "text-emerald-400",
  },
  {
    title: "Evento próximo",
    description: "O treino coletivo de vôlei sentado acontece hoje às 19h.",
    time: "há 25 min",
    type: "Evento",
    icon: CalendarDays,
    color: "text-cyan-400",
  },
  {
    title: "Novo atleta cadastrado",
    description: "Um novo atleta foi adicionado ao acompanhamento da ASDA.",
    time: "há 1h",
    type: "Atleta",
    icon: Users,
    color: "text-purple-400",
  },
  {
    title: "Meta de campanha atingiu 72%",
    description: "A campanha de equipamentos esportivos avançou na arrecadação.",
    time: "há 2h",
    type: "Campanha",
    icon: CheckCircle2,
    color: "text-yellow-400",
  },
  {
    title: "Atenção necessária",
    description: "Existem eventos sem voluntários suficientes cadastrados.",
    time: "ontem",
    type: "Alerta",
    icon: AlertCircle,
    color: "text-red-400",
  },
];

const summary = [
  {
    title: "Notificações",
    value: "18",
    icon: Bell,
    color: "text-cyan-400",
  },
  {
    title: "Não lidas",
    value: "5",
    icon: MailCheck,
    color: "text-yellow-400",
  },
  {
    title: "Alertas",
    value: "2",
    icon: AlertCircle,
    color: "text-red-400",
  },
  {
    title: "Hoje",
    value: "9",
    icon: Clock3,
    color: "text-emerald-400",
  },
];

export function Notifications() {
  return (
    <div className="space-y-8">
      <section className="rounded-[32px] bg-gradient-to-br from-cyan-500 via-blue-600 to-slate-900 p-6 shadow-2xl md:p-10">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white">
          <Bell size={16} />
          Central de notificações
        </span>

        <h1 className="mt-6 text-3xl font-black text-white md:text-5xl">
          Acompanhe tudo que acontece na plataforma.
        </h1>

        <p className="mt-4 max-w-2xl text-white/80 md:text-lg">
          Receba alertas sobre doações, eventos, atletas, campanhas, metas e
          atividades importantes da ASDA.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-4">
        {summary.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-3xl border border-slate-800 bg-slate-900 p-6"
            >
              <Icon className={item.color} />
              <p className="mt-5 text-sm text-slate-400">{item.title}</p>
              <h2 className="mt-2 text-3xl font-black">{item.value}</h2>
            </div>
          );
        })}
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-black text-white">
              Atividades recentes
            </h2>

            <p className="text-sm text-slate-400">
              Histórico de avisos e atualizações da plataforma.
            </p>
          </div>

          <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-800 px-5 py-3 font-black text-slate-300 hover:bg-slate-700">
            <Filter size={20} />
            Filtrar
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {notifications.map((notification) => {
            const Icon = notification.icon;

            return (
              <div
                key={notification.title}
                className="rounded-3xl border border-slate-800 bg-slate-800 p-5"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div className="flex gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-900">
                      <Icon className={notification.color} size={26} />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-black text-white">
                          {notification.title}
                        </h3>

                        <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-400">
                          {notification.type}
                        </span>
                      </div>

                      <p className="mt-2 leading-relaxed text-slate-400">
                        {notification.description}
                      </p>
                    </div>
                  </div>

                  <span className="text-sm font-semibold text-slate-500">
                    {notification.time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}