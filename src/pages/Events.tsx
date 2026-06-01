import { useEffect, useState } from "react";
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

import { getEvents, createEvent, type Event } from "../services/events";

export function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "TRAINING_SESSION",
    location: "",
    city: "Sorocaba",
    state: "SP",
    startDate: "",
    endDate: "",
    maxParticipants: "",
  });

  async function loadEvents() {
    try {
      setLoading(true);
      const response = await getEvents();

      const list =
        response?.data?.data ||
        response?.data?.items ||
        response?.data ||
        response?.items ||
        response ||
        [];

      setEvents(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  async function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSaving(true);

      await createEvent({
        title: form.title,
        description: form.description,
        type: form.type,
        location: form.location,
        city: form.city,
        state: form.state,
        startDate: form.startDate,
        endDate: form.endDate,
        maxParticipants: form.maxParticipants
          ? Number(form.maxParticipants)
          : undefined,
        isOnline: false,
        isPublic: true,
      });

      alert("Evento criado com sucesso!");
      setShowModal(false);

      setForm({
        title: "",
        description: "",
        type: "TRAINING_SESSION",
        location: "",
        city: "Sorocaba",
        state: "SP",
        startDate: "",
        endDate: "",
        maxParticipants: "",
      });

      await loadEvents();
    } catch (error: any) {
      console.error("Erro ao criar evento:", error);
      alert(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Erro ao criar evento."
      );
    } finally {
      setSaving(false);
    }
  }

  function formatType(type?: string) {
    const map: Record<string, string> = {
      COMPETITION: "Campeonato",
      TRAINING_SESSION: "Treino",
      WORKSHOP: "Oficina",
      MEDICAL_EVALUATION: "Avaliação médica",
      FUNDRAISING: "Campanha",
      COMMUNITY: "Comunidade",
      OTHER: "Outro",
    };

    return type ? map[type] || type : "Evento";
  }

  function formatStatus(status?: string) {
    const map: Record<string, string> = {
      DRAFT: "Rascunho",
      PUBLISHED: "Publicado",
      ONGOING: "Em andamento",
      FINISHED: "Finalizado",
      CANCELLED: "Cancelado",
    };

    return status ? map[status] || status : "Não informado";
  }

  function formatDate(date?: string) {
    if (!date) return "Data não informada";
    return new Date(date).toLocaleDateString("pt-BR");
  }

  function formatTime(date?: string) {
    if (!date) return "--:--";
    return new Date(date).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const activeEvents = events.filter((event) =>
    ["PUBLISHED", "ONGOING"].includes(event.status)
  ).length;

  const participants = events.reduce(
    (total, event) => total + (event._count?.athletes || 0),
    0
  );

  const competitions = events.filter(
    (event) => event.type === "COMPETITION"
  ).length;

  const highlights = [
    {
      title: "Eventos ativos",
      value: activeEvents,
      icon: CalendarDays,
      color: "text-cyan-400",
    },
    {
      title: "Participantes",
      value: participants,
      icon: Users,
      color: "text-emerald-400",
    },
    {
      title: "Campeonatos",
      value: competitions,
      icon: Trophy,
      color: "text-yellow-400",
    },
    {
      title: "Eventos totais",
      value: events.length,
      icon: HandHeart,
      color: "text-purple-400",
    },
  ];

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
              Eventos carregados diretamente do backend e Supabase.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 font-black text-slate-950 hover:bg-cyan-400"
          >
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
          {loading ? (
            <p className="text-slate-400">Carregando eventos...</p>
          ) : events.length === 0 ? (
            <p className="text-slate-400">Nenhum evento encontrado.</p>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                className="rounded-3xl border border-slate-800 bg-slate-800 p-5"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-sm font-bold text-cyan-400">
                        {formatType(event.type)}
                      </span>

                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-bold text-emerald-400">
                        <CheckCircle2 size={14} />
                        {formatStatus(event.status)}
                      </span>
                    </div>

                    <h3 className="mt-4 text-xl font-black text-white">
                      {event.title}
                    </h3>

                    <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-slate-400 md:grid-cols-2">
                      <p className="flex items-center gap-2">
                        <CalendarDays size={16} />
                        {formatDate(event.startDate)}
                      </p>

                      <p className="flex items-center gap-2">
                        <Clock size={16} />
                        {formatTime(event.startDate)}
                      </p>

                      <p className="flex items-center gap-2">
                        <MapPin size={16} />
                        {event.location || event.city || "Local não informado"}
                      </p>

                      <p className="flex items-center gap-2">
                        <Users size={16} />
                        {event._count?.athletes || 0} participantes
                      </p>
                    </div>
                  </div>

                  <button className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-700 text-slate-300 hover:bg-slate-600">
                    <MoreHorizontal />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <form
            onSubmit={handleCreateEvent}
            className="w-full max-w-2xl rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">Novo evento</h2>
                <p className="text-sm text-slate-400">
                  Cadastre um evento no banco de dados.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-xl bg-slate-800 px-4 py-2 text-slate-300 hover:bg-slate-700"
              >
                Fechar
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                placeholder="Título do evento"
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />

              <select
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="COMPETITION">Campeonato</option>
                <option value="TRAINING_SESSION">Treino</option>
                <option value="WORKSHOP">Oficina</option>
                <option value="MEDICAL_EVALUATION">Avaliação médica</option>
                <option value="FUNDRAISING">Campanha</option>
                <option value="COMMUNITY">Comunidade</option>
                <option value="OTHER">Outro</option>
              </select>

              <input
                placeholder="Local"
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
                value={form.location}
                onChange={(e) =>
                  setForm({ ...form, location: e.target.value })
                }
              />

              <input
                placeholder="Cidade"
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />

              <input
                placeholder="Estado"
                maxLength={2}
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
                value={form.state}
                onChange={(e) =>
                  setForm({ ...form, state: e.target.value.toUpperCase() })
                }
              />

              <input
                type="number"
                placeholder="Máximo de participantes"
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
                value={form.maxParticipants}
                onChange={(e) =>
                  setForm({ ...form, maxParticipants: e.target.value })
                }
              />

              <input
                type="datetime-local"
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
                value={form.startDate}
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
                required
              />

              <input
                type="datetime-local"
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                required
              />

              <textarea
                placeholder="Descrição"
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400 md:col-span-2"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-6 w-full rounded-2xl bg-cyan-500 px-5 py-3 font-black text-slate-950 hover:bg-cyan-400 disabled:opacity-60"
            >
              {saving ? "Salvando..." : "Cadastrar evento"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}