import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CalendarDays, Check, Plus, MapPin, Wand2 } from "lucide-react";

import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  parseEventFromText,
  type Event,
} from "../services/events";
import { RowActionsMenu } from "../components/RowActionsMenu";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useToast } from "../components/Toast";
import { getErrorMessage } from "../utils/errors";
import {
  Badge,
  Button,
  Card,
  CardHeader,
  EmptyState,
  Field,
  Modal,
  PageContainer,
  SkeletonRows,
  StatStrip,
  inputClass,
} from "../components/ui";

const typeLabels: Record<string, string> = {
  MEETING: "Reunião",
  TASK: "Tarefa",
  DEADLINE: "Prazo",
  OTHER: "Outro",
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
  const [searchParams, setSearchParams] = useSearchParams();
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
    // eslint-disable-next-line react-hooks/set-state-in-effect -- busca inicial ao montar a tela
    loadEvents();
  }, []);

  // ?novo=1 (link de criação rápida do header) abre o modal de criação —
  // só na montagem, de propósito (searchParams muda de identidade a cada
  // render e não deve reexecutar isso)
  useEffect(() => {
    if (searchParams.get("novo") === "1") {
      openCreateModal();
      const next = new URLSearchParams(searchParams);
      next.delete("novo");
      setSearchParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Não foi possível interpretar o texto."));
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
    } catch (error: unknown) {
      setError(getErrorMessage(error, "Erro ao salvar item da agenda."));
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
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Erro ao excluir item da agenda."));
    } finally {
      setDeleting(false);
    }
  }

  function formatTime(date?: string) {
    if (!date) return "--:--";
    return new Date(date).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const todayKey = new Date().toISOString().slice(0, 10);

  const groupedEvents = useMemo(() => {
    const map = new Map<string, Event[]>();
    for (const event of events) {
      const key = (event.startDate || "").slice(0, 10);
      const bucket = map.get(key) ?? [];
      bucket.push(event);
      map.set(key, bucket);
    }
    for (const bucket of map.values()) {
      bucket.sort((a, b) => a.startDate.localeCompare(b.startDate));
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [events]);

  function formatDayHeader(key: string) {
    const date = new Date(`${key}T00:00:00`);
    if (Number.isNaN(date.getTime())) return "Data não informada";
    const label = date.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" });
    return label.charAt(0).toUpperCase() + label.slice(1);
  }

  async function toggleEventStatus(event: Event) {
    if (event.status === "CANCELED") return;
    const nextStatus = event.status === "COMPLETED" ? "SCHEDULED" : "COMPLETED";
    try {
      await updateEvent(event.id, { status: nextStatus });
      await loadEvents();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Erro ao atualizar o status do compromisso."));
    }
  }

  const scheduled = events.filter((event) => event.status === "SCHEDULED").length;
  const tasks = events.filter((event) => event.type === "TASK").length;
  const deadlines = events.filter((event) => event.type === "DEADLINE").length;

  return (
    <PageContainer>
      <Card>
        <div className="flex items-start gap-3.5 border-b border-line px-5 py-4 dark:border-line-dark">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-forest-100 text-forest-600 dark:bg-forest-900 dark:text-forest-400">
            <Wand2 size={18} />
          </div>
          <div>
            <h2 className="text-[15px] font-semibold tracking-tight">Cadastro rápido por texto</h2>
            <p className="mt-0.5 text-[12.5px] text-muted dark:text-muted-dark">
              Descreva o compromisso em uma frase (data, horário e local) e preenchemos o formulário para você revisar.
            </p>
          </div>
        </div>

        <form onSubmit={handleQuickParse} className="flex flex-col gap-3 p-5 sm:flex-row">
          <input
            placeholder='Ex: "Reunião com o cliente Ana amanhã às 15h no escritório"'
            className={`${inputClass} flex-1`}
            value={quickPrompt}
            onChange={(e) => setQuickPrompt(e.target.value)}
          />
          <Button type="submit" loading={quickLoading} disabled={!quickPrompt.trim()}>
            <Wand2 size={16} />
            {quickLoading ? "Interpretando..." : "Preencher automaticamente"}
          </Button>
        </form>
      </Card>

      <StatStrip
        items={[
          { label: "Agendados", value: String(scheduled) },
          { label: "Tarefas", value: String(tasks) },
          { label: "Prazos", value: String(deadlines) },
          { label: "Total de itens", value: String(events.length) },
        ]}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-semibold tracking-tight">Próximos compromissos</h2>
          <p className="mt-0.5 text-[12.5px] text-muted dark:text-muted-dark">
            Itens carregados diretamente do backend.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/calendario">
            <Button variant="ghost">
              <CalendarDays size={16} />
              Ver calendário
            </Button>
          </Link>
          <Button onClick={openCreateModal}>
            <Plus size={16} />
            Novo item
          </Button>
        </div>
      </div>

      {loading ? (
        <Card>
          <SkeletonRows rows={5} cols={5} />
        </Card>
      ) : events.length === 0 ? (
        <Card>
          <EmptyState
            icon={<CalendarDays size={20} />}
            title="Nenhum item encontrado"
            description="Cadastre um compromisso manualmente ou use o cadastro rápido por texto acima."
            action={
              <Button onClick={openCreateModal}>
                <Plus size={16} />
                Novo item
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="space-y-5">
          {groupedEvents.map(([dayKeyValue, dayEvents]) => (
            <Card key={dayKeyValue}>
              <CardHeader
                title={formatDayHeader(dayKeyValue)}
                subtitle={
                  dayKeyValue === todayKey
                    ? "Hoje"
                    : `${dayEvents.length} compromisso${dayEvents.length > 1 ? "s" : ""}`
                }
              />
              <ul className="divide-y divide-line dark:divide-line-dark">
                {dayEvents.map((event) => (
                  <li key={event.id} className="flex items-center gap-3 px-5 py-3">
                    <button
                      type="button"
                      onClick={() => toggleEventStatus(event)}
                      disabled={event.status === "CANCELED"}
                      aria-label={event.status === "COMPLETED" ? "Marcar como agendado" : "Marcar como concluído"}
                      className={`grid h-5 w-5 shrink-0 place-items-center rounded border transition disabled:opacity-40 ${
                        event.status === "COMPLETED"
                          ? "border-forest-600 bg-forest-600 text-white dark:border-forest-400 dark:bg-forest-400"
                          : "border-line bg-surface text-transparent hover:border-forest-600/50 dark:border-line-dark dark:bg-surface-dark dark:hover:border-forest-400/50"
                      }`}
                    >
                      <Check size={12} />
                    </button>

                    <span className="w-12 shrink-0 text-[12.5px] font-medium text-muted dark:text-muted-dark tabular-nums">
                      {formatTime(event.startDate)}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p
                        className={`truncate text-[13px] font-medium ${
                          event.status === "COMPLETED" ? "text-faint dark:text-faint-dark line-through" : ""
                        }`}
                      >
                        {event.title}
                      </p>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12px] text-muted dark:text-muted-dark">
                        <Badge tone="neutral">{typeLabels[event.type] || event.type}</Badge>
                        {event.status === "CANCELED" && <Badge tone="negative">Cancelado</Badge>}
                        {(event.location || event.isOnline) && (
                          <span className="flex items-center gap-1">
                            <MapPin size={11} />
                            {event.location || "Online"}
                          </span>
                        )}
                      </div>
                    </div>

                    <RowActionsMenu onEdit={() => openEditModal(event)} onDelete={() => setDeleteTarget(event)} />
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editingId ? "Editar item da agenda" : "Novo item da agenda"}
        subtitle={editingId ? "Atualize os dados do compromisso." : "Cadastre um compromisso no banco de dados."}
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button type="submit" form="event-form" loading={saving}>
              {editingId ? "Salvar alterações" : "Cadastrar item"}
            </Button>
          </>
        }
      >
        <form id="event-form" onSubmit={handleSaveEvent} className="space-y-4">
          {error && <p className="rounded-md bg-[#F6E4E1] px-3.5 py-2.5 text-[12.5px] text-danger dark:bg-danger-dark/10 dark:text-danger-dark">{error}</p>}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Título" className="sm:col-span-2">
              <input
                className={inputClass}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </Field>

            <Field label="Tipo">
              <select
                className={inputClass}
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="MEETING">Reunião</option>
                <option value="TASK">Tarefa</option>
                <option value="DEADLINE">Prazo</option>
                <option value="OTHER">Outro</option>
              </select>
            </Field>

            {editingId && (
              <Field label="Status">
                <select
                  className={inputClass}
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="SCHEDULED">Agendado</option>
                  <option value="COMPLETED">Concluído</option>
                  <option value="CANCELED">Cancelado</option>
                </select>
              </Field>
            )}

            <Field label="Local" className={editingId ? "" : "sm:col-span-2"}>
              <input
                className={inputClass}
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </Field>

            <Field label="Início">
              <input
                type="datetime-local"
                className={inputClass}
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                required
              />
            </Field>

            <Field label="Fim">
              <input
                type="datetime-local"
                className={inputClass}
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                required
              />
            </Field>

            <Field label="Descrição" className="sm:col-span-2">
              <textarea
                className={inputClass}
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </Field>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Excluir item da agenda"
        description={`Tem certeza que deseja excluir "${deleteTarget?.title}"? Essa ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        loading={deleting}
        onConfirm={confirmDeleteEvent}
        onCancel={() => setDeleteTarget(null)}
      />
    </PageContainer>
  );
}
