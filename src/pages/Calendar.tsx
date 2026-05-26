const events = [
  {
    day: "22",
    title: "Treino coletivo",
    time: "09:00",
    type: "Futebol Adaptado",
  },
  {
    day: "25",
    title: "Palestra de inclusão",
    time: "19:00",
    type: "Evento Social",
  },
  {
    day: "29",
    title: "Avaliação esportiva",
    time: "14:00",
    type: "Acompanhamento",
  },
];

export function CalendarPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-5xl font-black text-[#071B3A]">
          Calendário
        </h1>

        <p className="text-slate-500 mt-3 text-lg max-w-3xl">
          Organização de treinos, eventos,
          encontros e atividades da ONG.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event.title}
            className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition"
          >
            <div className="w-20 h-20 rounded-3xl bg-cyan-50 flex items-center justify-center">
              <span className="text-4xl font-black text-cyan-600">
                {event.day}
              </span>
            </div>

            <h2 className="text-2xl font-black text-[#071B3A] mt-6">
              {event.title}
            </h2>

            <p className="text-slate-500 mt-3">
              {event.type}
            </p>

            <div className="mt-6 flex items-center justify-between">
              <span className="bg-green-50 text-green-600 px-4 py-2 rounded-full font-bold text-sm">
                {event.time}
              </span>

              <button className="text-cyan-600 font-bold hover:text-cyan-500 transition">
                Ver detalhes
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}