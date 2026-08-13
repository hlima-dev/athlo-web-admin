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
  Wand2,
} from "lucide-react";

import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  parseEventFromText,
  type Event,
} from "../services/events";
import { RowActionsMenu } from "../components/RowActionsMenu";
import { PageHeader } from "../components/PageHeader";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useToast } from "../components/Toast";

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
  const toast = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [quickPrompt, setQuickPrompt] = useState("");
  const [quickLoading, setQuickLoading] = useState(false);

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

  async function handleQuickParse(e: React.FormEvent) {
    e.preventDefault();
    if (!quickPrompt.trim()) return;

    try {
      setQuickLoading(true);
      const draft = await parseEventFromText(quickPrompt.trim());
      setEditingId(null);
      setForm({
        title: draft.title,
        description: draft.description || "",
        type: draft.type,
        status: "SCHEDULED",
        location: draft.location || "",
        startDate: toDatetimeLocal(draft.startDate),
        endDate: toDatetimeLocal(draft.endDate),
      });
      setError("");
      setShowModal(true);
      setQuickPrompt("");
      toast.success("Sugestão pronta! Revise os dados e salve.");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Não foi possível interpretar o texto.");
    } finally {
      setQuickLoading(false);
    }
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
      toast.success(editingId ? "Item atualizado com sucesso." : "Item cadastrado com sucesso.");
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

  async function confirmDeleteEvent() {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      await deleteEvent(deleteTarget.id);
      setDeleteTarget(null);
      await loadEvents();
      toast.success("Item excluído com sucesso.");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Erro ao excluir item da agenda.");
    } finally {
      setDeleting(false);
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
      <PageHeader
        icon={CalendarDays}
        title="Agenda"
        description="Organize reuniões, tarefas e prazos da equipe."
        action={
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 font-bold text-slate-950 hover:bg-cyan-400"
          >
            <Plus size={20} />
            Novo item
          </button>
        }
      />

      <section className="rounded-2xl border border-cyan-300 bg-gradient-to-br from-cyan-50 to-white p-6 dark:border-cyan-800/60 dark:from-cyan-950/40 dark:to-slate-900">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
            <Wand2 size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Cadastro rápido por texto</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Descreva o compromisso em uma frase (data, horário e local) e preenchemos o formulário para você revisar.
            </p>
          </div>
        </div>

        <form onSubmit={handleQuickParse} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            placeholder='Ex: "Reunião com o cliente Ana amanhã às 15h no escritório" ou "Entrega para a Padaria Central sexta-feira de manhã"'
            className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-cyan-400"
            value={quickPrompt}
            onChange={(e) => setQuickPrompt(e.target.value)}
          />
          <button
            type="submit"
            disabled={quickLoading || !quickPrompt.trim()}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 font-bold text-slate-950 hover:bg-cyan-400 disabled:opacity-60"
          >
            <Wand2 size={18} />
            {quickLoading ? "Interpretando..." : "Preencher automaticamente"}
          </button>
        </form>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-4">
        {highlights.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.title} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <Icon className={item.color} size={20} />
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{item.title}</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{item.value}</h2>
            </div>
          );
        })}
      </section>

      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Próximos compromissos</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Itens carregados diretamente do backend.</p>
        </div>

        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4">
          <Search className="text-slate-400 dark:text-slate-500" size={20} />
          <input
            placeholder="Buscar na agenda..."
            className="w-full bg-transparent py-4 text-slate-900 dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5">
          {loading ? (
            <p className="text-slate-500 dark:text-slate-400">Carregando agenda...</p>
          ) : events.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400">Nenhum item encontrado.</p>
          ) : (
            events.map((event) => (
              <div key={event.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-800/60 p-5">
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

                    <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">{event.title}</h3>

                    <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-slate-500 dark:text-slate-400 md:grid-cols-3">
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
                    onDelete={() => setDeleteTarget(event)}
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
            className="w-full max-w-2xl rounded-3xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  {editingId ? "Editar item da agenda" : "Novo item da agenda"}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {editingId ? "Atualize os dados do compromisso." : "Cadastre um compromisso no banco de dados."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
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
                className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-cyan-400 md:col-span-2"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />

              <select
                className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-cyan-400"
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
                  className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-cyan-400"
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
                className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-cyan-400"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />

              <input
                type="datetime-local"
                className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-cyan-400"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                required
              />

              <input
                type="datetime-local"
                className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-cyan-400"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                required
              />

              <textarea
                placeholder="Descrição"
                className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-cyan-400 md:col-span-2"
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

      <ConfirmDialog
        open={!!deleteTarget}
        title="Excluir item da agenda"
        description={`Tem certeza que deseja excluir "${deleteTarget?.title}"? Essa ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        loading={deleting}
        onConfirm={confirmDeleteEvent}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
