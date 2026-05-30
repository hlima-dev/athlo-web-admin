import {
  CalendarDays,
  Plus,
  Search,
  MapPin,
  Users,
  Clock,
  Trophy,
  HandHeart,
  MoreHorizontal,
  CheckCircle2,
} from "lucide-react";

const events = [
  {
    title: "Treino coletivo de vôlei sentado",
    type: "Treino",
    date: "28/05/2026",
    time: "19:00",
    location: "Ginásio Municipal de Sorocaba",
    status: "Confirmado",
    participants: 24,
  },
  {
    title: "Campanha solidária ASDA",
    type: "Campanha",
    date: "01/06/2026",
    time: "09:00",
    location: "Parque das Águas",
    status: "Aberto",
    participants: 42,
  },
  {
    title: "Campeonato regional adaptado",
    type: "Campeonato",
    date: "08/06/2026",
    time: "14:00",
    location: "Centro Esportivo Sorocaba",
    status: "Planejamento",
    participants: 36,
  },
];

const highlights = [
  {
    title: "Eventos ativos",
    value: "12",
    icon: CalendarDays,
    color: "text-cyan-400",
  },
  {
    title: "Participantes",
    value: "284",
    icon: Users,
    color: "text-emerald-400",
  },
  {
    title: "Campeonatos",
    value: "4",
    icon: Trophy,
    color: "text-yellow-400",
  },
  {
    title: "Voluntários envolvidos",
    value: "38",
    icon: HandHeart,
    color: "text-purple-400",
  },
];

export function Events() {
  return (
    <div className="space-y-8">
      <section className="rounded-[32px] bg-gradient-to-br from-cyan-500 via-blue-600 to-slate-900 p-6 shadow-2xl md:p-10">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white">
          <CalendarDays size={16} />
          Gestão de eventos
        </span>

        <h1 className="mt-6 text-3xl font-black text-white md:text-5xl">
          Organize treinos, campanhas, ações sociais e campeonatos.
        </h1>

        <p className="mt-4 max-w-2xl text-white/80 md:text-lg">
          Controle datas, participantes, locais, voluntários e status de cada
          evento da ASDA em uma visão clara e profissional.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-4">
        {highlights.map((item) => {
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
              Próximos eventos
            </h2>
            <p className="text-sm text-slate-400">
              Acompanhe e gerencie a agenda da organização.
            </p>
          </div>

          <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 font-black text-slate-950 hover:bg-cyan-400">
            <Plus size={20} />
            Novo evento
          </button>
        </div>

        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-800 px-4">
          <Search className="text-slate-500" size={20} />
          <input
            placeholder="Buscar evento..."
            className="w-full bg-transparent py-4 text-white outline-none placeholder:text-slate-500"
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5">
          {events.map((event) => (
            <div
              key={event.title}
              className="rounded-3xl border border-slate-800 bg-slate-800 p-5"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-sm font-bold text-cyan-400">
                      {event.type}
                    </span>

                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-bold text-emerald-400">
                      <CheckCircle2 size={14} />
                      {event.status}
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-black text-white">
                    {event.title}
                  </h3>

                  <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-slate-400 md:grid-cols-2">
                    <p className="flex items-center gap-2">
                      <CalendarDays size={16} />
                      {event.date}
                    </p>

                    <p className="flex items-center gap-2">
                      <Clock size={16} />
                      {event.time}
                    </p>

                    <p className="flex items-center gap-2">
                      <MapPin size={16} />
                      {event.location}
                    </p>

                    <p className="flex items-center gap-2">
                      <Users size={16} />
                      {event.participants} participantes
                    </p>
                  </div>
                </div>

                <button className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-700 text-slate-300 hover:bg-slate-600">
                  <MoreHorizontal />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}