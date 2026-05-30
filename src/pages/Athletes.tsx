import {
  Users,
  Search,
  Plus,
  Medal,
  Activity,
  HeartPulse,
  MapPin,
  CalendarDays,
  MoreHorizontal,
} from "lucide-react";

const athletes = [
  {
    name: "Rafael Mendes",
    sport: "Vôlei sentado",
    status: "Ativo",
    city: "Sorocaba/SP",
    age: 28,
    performance: "92%",
  },
  {
    name: "Mariana Alves",
    sport: "Atletismo adaptado",
    status: "Em acompanhamento",
    city: "Votorantim/SP",
    age: 24,
    performance: "84%",
  },
  {
    name: "João Pedro",
    sport: "Futebol amputados",
    status: "Ativo",
    city: "Sorocaba/SP",
    age: 31,
    performance: "88%",
  },
];

export function Athletes() {
  return (
    <div className="space-y-8">
      <section className="rounded-[32px] bg-gradient-to-br from-cyan-500 via-blue-600 to-slate-900 p-6 md:p-10 shadow-2xl">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white">
          <Users size={16} />
          Gestão de atletas
        </span>

        <h1 className="mt-6 text-3xl font-black text-white md:text-5xl">
          Acompanhe atletas, modalidades e evolução esportiva.
        </h1>

        <p className="mt-4 max-w-2xl text-white/80 md:text-lg">
          Centralize informações dos atletas atendidos pela ASDA, acompanhe
          desempenho, participação e histórico dentro da plataforma.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-4">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <Users className="text-cyan-400" />
          <p className="mt-5 text-sm text-slate-400">Atletas cadastrados</p>
          <h2 className="mt-2 text-3xl font-black">127</h2>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <Activity className="text-emerald-400" />
          <p className="mt-5 text-sm text-slate-400">Ativos no mês</p>
          <h2 className="mt-2 text-3xl font-black">94</h2>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <Medal className="text-yellow-400" />
          <p className="mt-5 text-sm text-slate-400">Modalidades</p>
          <h2 className="mt-2 text-3xl font-black">6</h2>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <HeartPulse className="text-red-400" />
          <p className="mt-5 text-sm text-slate-400">Em acompanhamento</p>
          <h2 className="mt-2 text-3xl font-black">18</h2>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-black text-white">
              Lista de atletas
            </h2>
            <p className="text-sm text-slate-400">
              Gerencie cadastro, status e informações esportivas.
            </p>
          </div>

          <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 font-black text-slate-950 hover:bg-cyan-400">
            <Plus size={20} />
            Novo atleta
          </button>
        </div>

        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-800 px-4">
          <Search className="text-slate-500" size={20} />
          <input
            placeholder="Buscar atleta..."
            className="w-full bg-transparent py-4 text-white outline-none placeholder:text-slate-500"
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5">
          {athletes.map((athlete) => (
            <div
              key={athlete.name}
              className="rounded-3xl border border-slate-800 bg-slate-800 p-5"
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-500/10 text-xl font-black text-cyan-400">
                    {athlete.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-white">
                      {athlete.name}
                    </h3>
                    <p className="text-sm text-slate-400">{athlete.sport}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:items-center">
                  <div>
                    <p className="text-xs text-slate-500">Status</p>
                    <span className="mt-1 inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-bold text-emerald-400">
                      {athlete.status}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Idade</p>
                    <p className="mt-1 font-bold text-white">
                      {athlete.age} anos
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Desempenho</p>
                    <p className="mt-1 font-bold text-cyan-400">
                      {athlete.performance}
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
                  {athlete.city}
                </p>

                <p className="flex items-center gap-2">
                  <CalendarDays size={16} />
                  Última atualização: Maio/2026
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}