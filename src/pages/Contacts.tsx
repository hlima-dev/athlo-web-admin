import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, Plus, Mail, Phone } from "lucide-react";

import {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
  type Contact,
  type ContactsSummary,
} from "../services/contacts";
import type { PageMeta } from "../services/api";
import { RowActionsMenu } from "../components/RowActionsMenu";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useToast } from "../components/Toast";
import { maskPhone } from "../utils/masks";
import { getErrorMessage } from "../utils/errors";
import {
  Badge,
  Button,
  Card,
  CardHeader,
  EmptyState,
  ErrorNote,
  Field,
  Modal,
  PageContainer,
  Pagination,
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

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
  type: "LEAD",
  city: "",
  state: "SP",
};

const typeLabels: Record<string, string> = {
  LEAD: "Lead",
  CUSTOMER: "Cliente",
  SUPPLIER: "Fornecedor",
};

const statusLabels: Record<string, string> = {
  ACTIVE: "Ativo",
  INACTIVE: "Inativo",
};

export function Contacts() {
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [summary, setSummary] = useState<ContactsSummary | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [lastQ, setLastQ] = useState(searchParams.get("q") ?? "");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState(emptyForm);

  // a busca do header navega pra /contatos?q=... — sincroniza sem useEffect
  // (padrão de ajuste de estado durante a renderização, React Hooks docs)
  const currentQ = searchParams.get("q") ?? "";
  if (currentQ !== lastQ) {
    setLastQ(currentQ);
    setSearch(currentQ);
  }

  async function loadContacts(term: string, targetPage = page) {
    try {
      setLoading(true);
      setError("");
      const params: Record<string, string> = { page: String(targetPage) };
      if (term) params.search = term;
      const result = await getContacts(params);
      setContacts(result.items);
      setMeta(result.meta ?? null);
      setSummary(result.summary ?? null);
      setPage(targetPage);
    } catch (err) {
      console.error("Erro ao carregar contatos:", err);
      setError(getErrorMessage(err, "Erro ao carregar contatos."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- busca inicial ao montar a tela
    loadContacts(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => loadContacts(search, 1), 400);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

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

  function openEditModal(contact: Contact) {
    setEditingId(contact.id);
    setForm({
      name: contact.name,
      email: contact.email || "",
      phone: contact.phone || "",
      company: contact.company || "",
      type: contact.type,
      city: contact.city || "",
      state: contact.state || "SP",
    });
    setError("");
    setShowModal(true);
  }

  async function handleSaveContact(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      setSaving(true);
      if (editingId) {
        await updateContact(editingId, form);
      } else {
        await createContact(form);
      }
      setShowModal(false);
      setForm(emptyForm);
      setEditingId(null);
      await loadContacts(search);
      toast.success(editingId ? "Contato atualizado com sucesso." : "Contato cadastrado com sucesso.");
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Erro ao salvar contato."));
    } finally {
      setSaving(false);
    }
  }

  async function confirmDeleteContact() {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      await deleteContact(deleteTarget.id);
      setDeleteTarget(null);
      await loadContacts(search);
      toast.success("Contato excluído com sucesso.");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Erro ao excluir contato."));
    } finally {
      setDeleting(false);
    }
  }

  // Vem do backend (agregado da organização inteira) — não some quando a
  // busca filtra a lista, nem fica errado quando há mais de 20 contatos.
  const { total: totalCount, customers, leads, suppliers } = summary ?? {
    total: 0,
    customers: 0,
    leads: 0,
    suppliers: 0,
  };

  const typeTones: Record<string, "info" | "positive" | "accent"> = {
    LEAD: "info",
    CUSTOMER: "positive",
    SUPPLIER: "accent",
  };

  return (
    <PageContainer>
      <StatStrip
        items={[
          { label: "Contatos cadastrados", value: String(totalCount) },
          { label: "Clientes", value: String(customers) },
          { label: "Fornecedores", value: String(suppliers) },
          { label: "Leads", value: String(leads) },
        ]}
      />

      <Card>
        <CardHeader
          title="Lista de contatos"
          subtitle="Leads, clientes e fornecedores cadastrados na empresa."
          action={
            <Button onClick={openCreateModal}>
              <Plus size={16} />
              Novo contato
            </Button>
          }
        />

        {error ? <ErrorNote message={error} onRetry={() => loadContacts(search)} /> : null}

        <div className="flex items-center gap-2.5 border-b border-line px-5 py-3.5 dark:border-line-dark">
          <Search size={16} className="text-faint dark:text-faint-dark" />
          <input
            placeholder="Buscar contato..."
            className="w-full bg-transparent text-[13.5px] outline-none placeholder:text-faint dark:placeholder:text-faint-dark"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <SkeletonRows rows={5} cols={5} />
        ) : contacts.length === 0 ? (
          <EmptyState
            icon={<Mail size={20} />}
            title="Nenhum contato encontrado"
            description="Cadastre um contato ou ajuste os termos da busca."
            action={
              <Button onClick={openCreateModal}>
                <Plus size={16} />
                Novo contato
              </Button>
            }
          />
        ) : (
          <Table minWidth={760}>
            <Thead>
              <Tr>
                <Th>Nome</Th>
                <Th>Contato</Th>
                <Th>Tipo</Th>
                <Th>Status</Th>
                <Th>Cidade</Th>
                <Th align="right">Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {contacts.map((contact) => (
                <Tr key={contact.id} onClick={() => navigate(`/contatos/${contact.id}`)}>
                  <Td>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-[12px] text-muted dark:text-muted-dark">
                      {contact.company || "Empresa não informada"}
                    </p>
                  </Td>
                  <Td>
                    <p className="flex items-center gap-1.5 text-[12.5px] text-muted dark:text-muted-dark">
                      <Mail size={13} />
                      {contact.email || "—"}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-[12.5px] text-muted dark:text-muted-dark">
                      <Phone size={13} />
                      {contact.phone || "—"}
                    </p>
                  </Td>
                  <Td>
                    <Badge tone={typeTones[contact.type] ?? "neutral"}>
                      {typeLabels[contact.type] || contact.type}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge tone={contact.status === "ACTIVE" ? "positive" : "neutral"}>
                      {statusLabels[contact.status] || contact.status}
                    </Badge>
                  </Td>
                  <Td>{contact.city || "N/I"}</Td>
                  <Td align="right">
                    <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
                      <RowActionsMenu
                        onEdit={() => openEditModal(contact)}
                        onDelete={() => setDeleteTarget(contact)}
                      />
                    </div>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
        {meta && (
          <Pagination
            page={meta.page}
            totalPages={meta.totalPages}
            total={meta.total}
            onPageChange={(p) => loadContacts(search, p)}
          />
        )}
      </Card>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editingId ? "Editar contato" : "Novo contato"}
        subtitle={editingId ? "Atualize os dados do contato." : "Cadastre um contato no banco de dados."}
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button type="submit" form="contact-form" loading={saving}>
              {editingId ? "Salvar alterações" : "Cadastrar contato"}
            </Button>
          </>
        }
      >
        <form id="contact-form" onSubmit={handleSaveContact} className="space-y-4">
          {error && <p className="rounded-md bg-[#F6E4E1] px-3.5 py-2.5 text-[12.5px] text-danger dark:bg-danger-dark/10 dark:text-danger-dark">{error}</p>}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Nome completo" className="sm:col-span-2">
              <input
                className={inputClass}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </Field>

            <Field label="E-mail">
              <input
                type="email"
                className={inputClass}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </Field>

            <Field label="Telefone">
              <input
                inputMode="tel"
                maxLength={16}
                className={inputClass}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: maskPhone(e.target.value) })}
              />
            </Field>

            <Field label="Empresa">
              <input
                className={inputClass}
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />
            </Field>

            <Field label="Tipo">
              <select
                className={inputClass}
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="LEAD">Lead</option>
                <option value="CUSTOMER">Cliente</option>
                <option value="SUPPLIER">Fornecedor</option>
              </select>
            </Field>

            <Field label="Cidade">
              <input
                className={inputClass}
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </Field>

            <Field label="Estado">
              <input
                maxLength={2}
                className={inputClass}
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value.toUpperCase() })}
              />
            </Field>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Excluir contato"
        description={`Tem certeza que deseja excluir "${deleteTarget?.name}"? Essa ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        loading={deleting}
        onConfirm={confirmDeleteContact}
        onCancel={() => setDeleteTarget(null)}
      />
    </PageContainer>
  );
}
