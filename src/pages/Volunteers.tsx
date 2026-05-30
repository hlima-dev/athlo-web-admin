import {
  HandHeart,
  Users,
  Search,
  Plus,
  CalendarDays,
  Clock3,
  MapPin,
  CheckCircle2,
  MoreHorizontal,
  HeartHandshake,
} from "lucide-react";

const volunteers = [
  {
    name: "Fernanda Lima",
    role: "Organização de eventos",
    city: "Sorocaba/SP",
    status: "Ativo",
    hours: 42,
  },
  {
    name: "Ricardo Alves",
    role: "Apoio esportivo",
    city: "Votorantim/SP",
    status: "Ativo",
    hours: 28,
  },
  {
    name: "Juliana Souza",
    role: "Campanhas sociais",
    city: "Sorocaba/SP",
    status: "Em treinamento",
    hours: 16,
  },
];

const stats = [
  {
    title: "Voluntários ativos",
    value: "38",
    icon: Users,
    color: "text-cyan-400",
  },
  {
    title: "Horas voluntárias",
    value: "284h",
    icon: Clock3,
    color: "text-emerald-400",
  },
  {
    title: "Eventos apoiados",
    value: "24",
    icon: CalendarDays,
    color: "text-yellow-400",
  },
  {
    title: "Campanhas sociais",
    value: "8",
    icon: HeartHandshake,
    color: "text-purple-400",
  },
];

export function Volunteers() {
  return (
    <div className="space-y-8">
      <section className="rounded-[32px] bg-gradient-to-br from-cyan-500 via-blue-600 to-slate-900 p-6 shadow-2xl md:p-10">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white">
          <HandHeart size={16} />
          Gestão de voluntários
        </span>

        <h1 className="mt-6 text-3xl font-black text-white md:text-5xl">
          Conecte pessoas ao impacto social da ASDA.
        </h1>

        <p className="mt-4 max-w-2xl text-white/80 md:text-lg">
          Organize equipes, acompanhe participação em eventos e fortaleça a
          comunidade de apoio da organização.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-4">
        {stats.map((item) => {
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
              Equipe voluntária
            </h2>

            <p className="text-sm text-slate-400">
              Gerencie participantes e colaboradores da ONG.
            </p>
          </div>

          <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 font-black text-slate-950 hover:bg-cyan-400">
            <Plus size={20} />
            Novo voluntário
          </button>
        </div>

        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-800 px-4">
          <Search className="text-slate-500" size={20} />

          <input
            placeholder="Buscar voluntário..."
            className="w-full bg-transparent py-4 text-white outline-none placeholder:text-slate-500"
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5">
          {volunteers.map((volunteer) => (
            <div
              key={volunteer.name}
              className="rounded-3xl border border-slate-800 bg-slate-800 p-5"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-500/10 text-xl font-black text-cyan-400">
                    {volunteer.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-white">
                      {volunteer.name}
                    </h3>

                    <p className="text-sm text-slate-400">
                      {volunteer.role}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:items-center">
                  <div>
                    <p className="text-xs text-slate-500">Status</p>

                    <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-bold text-emerald-400">
                      <CheckCircle2 size={14} />
                      {volunteer.status}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Horas</p>

                    <p className="mt-1 font-bold text-cyan-400">
                      {volunteer.hours}h
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Cidade</p>

                    <p className="mt-1 text-sm text-white">
                      {volunteer.city}
                    </p>
                  </div>

                  <button className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-700 text-slate-300 hover:bg-slate-600">
                    <MoreHorizontal />
                  </button>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 border-t border-slate-700 pt-5 text-sm text-slate-400 md:grid-cols-2">
                <p className="flex items-center gap-2">
                  <MapPin size={16} />
                  {volunteer.city}
                </p>

                <p className="flex items-center gap-2">
                  <CalendarDays size={16} />
                  Participação ativa em eventos
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}