const events = [
  { day: "22", title: "Treino coletivo", time: "09:00", type: "Futebol Adaptado" },
  { day: "25", title: "Palestra de inclusão", time: "19:00", type: "Evento Social" },
  { day: "29", title: "Avaliação esportiva", time: "14:00", type: "Acompanhamento" },
];

export function CalendarPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Calendário</h1>

      <p className="text-white/60 mb-8">
        Organização de treinos, eventos, encontros e atividades da ONG.
      </p>

      <div className="grid grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event.title}
            className="bg-[#111827] p-6 rounded-2xl border border-white/5"
          >
            <span className="text-5xl font-bold text-cyan-400">{event.day}</span>

            <h2 className="text-2xl font-bold mt-4">{event.title}</h2>

            <p className="text-white/50 mt-2">{event.type}</p>

            <p className="text-green-400 mt-4">{event.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}