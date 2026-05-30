import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  Users,
} from "lucide-react";

const events = [
  {
    day: 4,
    title: "Treino coletivo",
    time: "19:00",
    location: "Ginásio Municipal",
    participants: 24,
  },
  {
    day: 8,
    title: "Campanha solidária",
    time: "09:00",
    location: "Parque das Águas",
    participants: 42,
  },
  {
    day: 15,
    title: "Campeonato regional",
    time: "14:00",
    location: "Centro Esportivo",
    participants: 36,
  },
];

const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);

export function Calendar() {
  return (
    <div className="space-y-8">
      <section className="rounded-[32px] bg-gradient-to-br from-cyan-500 via-blue-600 to-slate-900 p-6 shadow-2xl md:p-10">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white">
          <CalendarDays size={16} />
          Agenda inteligente
        </span>

        <h1 className="mt-6 text-3xl font-black text-white md:text-5xl">
          Organize eventos, treinos e compromissos da ASDA.
        </h1>

        <p className="mt-4 max-w-2xl text-white/80 md:text-lg">
          Visualize rapidamente as atividades do mês, acompanhe participantes e
          mantenha toda a organização sincronizada.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 xl:col-span-2">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-white">
                Maio 2026
              </h2>

              <p className="text-sm text-slate-400">
                Agenda oficial da organização
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700">
                <ChevronLeft />
              </button>

              <button className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700">
                <ChevronRight />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-3 text-center text-sm font-bold text-slate-400">
            <div>DOM</div>
            <div>SEG</div>
            <div>TER</div>
            <div>QUA</div>
            <div>QUI</div>
            <div>SEX</div>
            <div>SAB</div>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-3">
            {calendarDays.map((day) => {
              const hasEvent = events.some((e) => e.day === day);

              return (
                <div
                  key={day}
                  className={`min-h-[90px] rounded-2xl border p-3 transition ${
                    hasEvent
                      ? "border-cyan-500 bg-cyan-500/10"
                      : "border-slate-800 bg-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm font-bold ${
                        hasEvent
                          ? "text-cyan-400"
                          : "text-slate-300"
                      }`}
                    >
                      {day}
                    </span>

                    {hasEvent && (
                      <div className="h-2 w-2 rounded-full bg-cyan-400" />
                    )}
                  </div>

                  {hasEvent && (
                    <div className="mt-3">
                      <p className="text-xs font-semibold text-white">
                        {events.find((e) => e.day === day)?.title}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-black text-white">
            Eventos do mês
          </h2>

          <div className="mt-6 space-y-4">
            {events.map((event) => (
              <div
                key={event.title}
                className="rounded-2xl bg-slate-800 p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-sm font-bold text-cyan-400">
                    Dia {event.day}
                  </span>

                  <CalendarDays
                    size={18}
                    className="text-cyan-400"
                  />
                </div>

                <h3 className="mt-4 text-lg font-black text-white">
                  {event.title}
                </h3>

                <div className="mt-4 space-y-3 text-sm text-slate-400">
                  <p className="flex items-center gap-2">
                    <Clock3 size={16} />
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
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}