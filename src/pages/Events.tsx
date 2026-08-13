import { useEffect, useState } from "react";
import {
  CalendarDays,
  Plus,
  Search,
  MapPin,
  Clock,
  ListChecks,
  Flag,
  CheckCircle2,
} from "lucide-react";

import { getEvents, createEvent, updateEvent, deleteEvent, type Event } from "../services/events";
import { RowActionsMenu } from "../components/RowActionsMenu";

const typeLabels: Record<string, string> = {
  MEETING: "Reunião",
  TASK: "Tarefa",
  DEADLINE: "Prazo",
  OTHER: "Outro",
};

const statusLabels: Record<string, string> = {
  SCHEDULED: "Agendado",
  COMPLETED: "Concluído",
  CANCELED: "Cancelado",
};

const emptyForm = {
  title: "",
  description: "",
  type: "MEETING",
  status: "SCHEDULED",
  location: "",
  startDate: "",
  endDate: "",
};

// Converte um ISO do backend para o formato aceito por <input type="datetime-local">
function toDatetimeLocal(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState(emptyForm);

  async function loadEvents() {
    try {
      setLoading(true);
      const list = await getEvents();
      setEvents(list);
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  function openCreateModal() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setShowModal(true);
  }

  function openEditModal(event: Event) {
    setEditingId(event.id);
    setForm({
      title: event.title,
      description: event.description || "",
      type: event.type,
      status: event.status,
      location: event.location || "",
      startDate: toDatetimeLocal(event.startDate),
      endDate: toDatetimeLocal(event.endDate),
    });
    setError("");
    setShowModal(true);
  }

  async function handleSaveEvent(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      setSaving(true);

      const payload = {
        title: form.title,
        description: form.description,
        type: form.type,
        status: form.status,
        location: form.location,
        startDate: form.startDate,
        endDate: form.endDate,
      };

      if (editingId) {
        await updateEvent(editingId, payload);
      } else {
        await createEvent(payload);
      }

      setShowModal(false);
      setForm(emptyForm);
      setEditingId(null);
      await loadEvents();
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Erro ao salvar item da agenda."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteEvent(event: Event) {
    if (!window.confirm(`Excluir "${event.title}"? Essa ação não pode ser desfeita.`)) {
      return;
    }

    try {
      await deleteEvent(event.id);
      await loadEvents();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Erro ao excluir item da agenda.");
    }
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

  const scheduled = events.filter((event) => event.status === "SCHEDULED").length;
  const tasks = events.filter((event) => event.type === "TASK").length;
  const deadlines = events.filter((event) => event.type === "DEADLINE").length;

  const highlights = [
    { title: "Agendados", value: scheduled, icon: CalendarDays, color: "text-cyan-400" },
    { title: "Tarefas", value: tasks, icon: ListChecks, color: "text-emerald-400" },
    { title: "Prazos", value: deadlines, icon: Flag, color: "text-yellow-400" },
    { title: "Total de itens", value: events.length, icon: CalendarDays, color: "text-purple-400" },
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] bg-gradient-to-br from-cyan-500 via-blue-600 to-slate-900 p-6 shadow-2xl md:p-10">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white">
          <CalendarDays size={16} />
          Agenda
        </span>

        <h1 className="mt-6 text-3xl font-black text-white md:text-5xl">
          Organize reuniões, tarefas e prazos da equipe.
        </h1>

        <p className="mt-4 max-w-2xl text-white/80 md:text-lg">
          Controle datas, responsáveis e status de cada compromisso em uma
          visão clara e profissional.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-4">
        {highlights.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.title} className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
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
            <h2 className="text-2xl font-black text-white">Próximos compromissos</h2>
            <p className="text-sm text-slate-400">Itens carregados diretamente do backend.</p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 font-black text-slate-950 hover:bg-cyan-400"
          >
            <Plus size={20} />
            Novo item
          </button>
        </div>

        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-800 px-4">
          <Search className="text-slate-500" size={20} />
          <input
            placeholder="Buscar na agenda..."
            className="w-full bg-transparent py-4 text-white outline-none placeholder:text-slate-500"
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5">
          {loading ? (
            <p className="text-slate-400">Carregando agenda...</p>
          ) : events.length === 0 ? (
            <p className="text-slate-400">Nenhum item encontrado.</p>
          ) : (
            events.map((event) => (
              <div key={event.id} className="rounded-3xl border border-slate-800 bg-slate-800 p-5">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-sm font-bold text-cyan-400">
                        {typeLabels[event.type] || event.type}
                      </span>

                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-bold text-emerald-400">
                        <CheckCircle2 size={14} />
                        {statusLabels[event.status] || event.status}
                      </span>
                    </div>

                    <h3 className="mt-4 text-xl font-black text-white">{event.title}</h3>

                    <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-slate-400 md:grid-cols-3">
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
                        {event.location || (event.isOnline ? "Online" : "Local não informado")}
                      </p>
                    </div>
                  </div>

                  <RowActionsMenu
                    onEdit={() => openEditModal(event)}
                    onDelete={() => handleDeleteEvent(event)}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <form
            onSubmit={handleSaveEvent}
            className="w-full max-w-2xl rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">
                  {editingId ? "Editar item da agenda" : "Novo item da agenda"}
                </h2>
                <p className="text-sm text-slate-400">
                  {editingId ? "Atualize os dados do compromisso." : "Cadastre um compromisso no banco de dados."}
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

            {error && (
              <div className="mb-4 rounded-xl border border-red-700 bg-red-900/30 p-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                placeholder="Título"
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400 md:col-span-2"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />

              <select
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="MEETING">Reunião</option>
                <option value="TASK">Tarefa</option>
                <option value="DEADLINE">Prazo</option>
                <option value="OTHER">Outro</option>
              </select>

              {editingId && (
                <select
                  className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="SCHEDULED">Agendado</option>
                  <option value="COMPLETED">Concluído</option>
                  <option value="CANCELED">Cancelado</option>
                </select>
              )}

              <input
                placeholder="Local"
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />

              <input
                type="datetime-local"
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
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
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-6 w-full rounded-2xl bg-cyan-500 px-5 py-3 font-black text-slate-950 hover:bg-cyan-400 disabled:opacity-60"
            >
              {saving ? "Salvando..." : editingId ? "Salvar alterações" : "Cadastrar item"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
