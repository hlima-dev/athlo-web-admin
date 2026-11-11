import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CalendarDays, Plus, MapPin, Wand2 } from "lucide-react";

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
  type BadgeTone,
  Button,
  Card,
  CardHeader,
  EmptyState,
  Field,
  Modal,
  PageContainer,
  SkeletonRows,
  StatStrip,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  inputClass,
} from "../components/ui";

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

const statusTones: Record<string, BadgeTone> = {
  SCHEDULED: "info",
  COMPLETED: "positive",
  CANCELED: "neutral",
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

      <Card>
        <CardHeader
          title="Próximos compromissos"
          subtitle="Itens carregados diretamente do backend."
          action={
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
          }
        />

        {loading ? (
          <SkeletonRows rows={5} cols={5} />
        ) : events.length === 0 ? (
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
        ) : (
          <Table minWidth={760}>
            <Thead>
              <Tr>
                <Th>Título</Th>
                <Th>Tipo</Th>
                <Th>Status</Th>
                <Th>Data</Th>
                <Th>Local</Th>
                <Th align="right">Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {events.map((event) => (
                <Tr key={event.id}>
                  <Td className="font-medium">{event.title}</Td>
                  <Td>
                    <Badge tone="neutral">{typeLabels[event.type] || event.type}</Badge>
                  </Td>
                  <Td>
                    <Badge tone={statusTones[event.status] ?? "neutral"}>
                      {statusLabels[event.status] || event.status}
                    </Badge>
                  </Td>
                  <Td>
                    <p>{formatDate(event.startDate)}</p>
                    <p className="text-[12px] text-muted dark:text-muted-dark">{formatTime(event.startDate)}</p>
                  </Td>
                  <Td>
                    <p className="flex items-center gap-1.5 text-[12.5px] text-muted dark:text-muted-dark">
                      <MapPin size={13} />
                      {event.location || (event.isOnline ? "Online" : "Não informado")}
                    </p>
                  </Td>
                  <Td align="right">
                    <div className="flex justify-end">
                      <RowActionsMenu
                        onEdit={() => openEditModal(event)}
                        onDelete={() => setDeleteTarget(event)}
                      />
                    </div>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Card>

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
