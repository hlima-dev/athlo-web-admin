import { useEffect, useState } from "react";
import {
  Users,
  Search,
  Plus,
  Briefcase,
  Building2,
  Mail,
  Phone,
} from "lucide-react";

import {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
  type Contact,
} from "../services/contacts";
import { RowActionsMenu } from "../components/RowActionsMenu";
import { PageHeader } from "../components/PageHeader";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useToast } from "../components/Toast";

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
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState(emptyForm);

  async function loadContacts() {
    try {
      setLoading(true);
      const list = await getContacts(search ? { search } : undefined);
      setContacts(list);
    } catch (err) {
      console.error("Erro ao carregar contatos:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timeout = setTimeout(loadContacts, 400);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

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
      await loadContacts();
      toast.success(editingId ? "Contato atualizado com sucesso." : "Contato cadastrado com sucesso.");
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err?.response?.data?.error || "Erro ao salvar contato."
      );
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
      await loadContacts();
      toast.success("Contato excluído com sucesso.");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Erro ao excluir contato.");
    } finally {
      setDeleting(false);
    }
  }

  const customers = contacts.filter((c) => c.type === "CUSTOMER").length;
  const leads = contacts.filter((c) => c.type === "LEAD").length;
  const suppliers = contacts.filter((c) => c.type === "SUPPLIER").length;

  function getInitials(name?: string) {
    if (!name) return "CT";
    return name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        icon={Users}
        title="Contatos"
        description="Centralize leads, clientes e fornecedores em um só lugar."
        action={
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 font-bold text-slate-950 hover:bg-cyan-400"
          >
            <Plus size={20} />
            Novo contato
          </button>
        }
      />

      <section className="grid grid-cols-1 gap-5 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <Users className="text-cyan-400" size={20} />
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Contatos cadastrados</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{contacts.length}</h2>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <Briefcase className="text-emerald-400" size={20} />
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Clientes</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{customers}</h2>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <Building2 className="text-yellow-400" size={20} />
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Fornecedores</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{suppliers}</h2>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <Users className="text-purple-400" size={20} />
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Leads</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{leads}</h2>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Lista de contatos</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Dados carregados diretamente do backend.</p>
        </div>

        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4">
          <Search className="text-slate-400 dark:text-slate-500" size={20} />
          <input
            placeholder="Buscar contato..."
            className="w-full bg-transparent py-4 text-slate-900 dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5">
          {loading ? (
            <p className="text-slate-500 dark:text-slate-400">Carregando contatos...</p>
          ) : contacts.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400">Nenhum contato encontrado.</p>
          ) : (
            contacts.map((contact) => (
              <div key={contact.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-800/60 p-5">
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-sm font-bold text-cyan-400">
                      {getInitials(contact.name)}
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{contact.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{contact.company || "Empresa não informada"}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:items-center">
                    <div>
                      <p className="text-xs text-slate-400 dark:text-slate-500">Tipo</p>
                      <span className="mt-1 inline-flex rounded-full bg-cyan-500/10 px-3 py-1 text-sm font-bold text-cyan-400">
                        {typeLabels[contact.type] || contact.type}
                      </span>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400 dark:text-slate-500">Status</p>
                      <span className="mt-1 inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-bold text-emerald-400">
                        {statusLabels[contact.status] || contact.status}
                      </span>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400 dark:text-slate-500">Cidade</p>
                      <p className="mt-1 font-bold text-slate-900 dark:text-white">{contact.city || "N/I"}</p>
                    </div>

                    <RowActionsMenu
                      onEdit={() => openEditModal(contact)}
                      onDelete={() => setDeleteTarget(contact)}
                    />
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 border-t border-slate-300 dark:border-slate-700 pt-5 text-sm text-slate-500 dark:text-slate-400 md:grid-cols-2">
                  <p className="flex items-center gap-2">
                    <Mail size={16} />
                    {contact.email || "E-mail não informado"}
                  </p>

                  <p className="flex items-center gap-2">
                    <Phone size={16} />
                    {contact.phone || "Telefone não informado"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <form
            onSubmit={handleSaveContact}
            className="w-full max-w-2xl rounded-3xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  {editingId ? "Editar contato" : "Novo contato"}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {editingId ? "Atualize os dados do contato." : "Cadastre um contato no banco de dados."}
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
                placeholder="Nome completo"
                className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-cyan-400"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />

              <input
                type="email"
                placeholder="E-mail"
                className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-cyan-400"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <input
                placeholder="Telefone"
                className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-cyan-400"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />

              <input
                placeholder="Empresa"
                className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-cyan-400"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />

              <select
                className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-cyan-400"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="LEAD">Lead</option>
                <option value="CUSTOMER">Cliente</option>
                <option value="SUPPLIER">Fornecedor</option>
              </select>

              <input
                placeholder="Cidade"
                className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-cyan-400"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />

              <input
                placeholder="Estado"
                maxLength={2}
                className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-cyan-400"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value.toUpperCase() })}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-6 w-full rounded-2xl bg-cyan-500 px-5 py-3 font-black text-slate-950 hover:bg-cyan-400 disabled:opacity-60"
            >
              {saving ? "Salvando..." : editingId ? "Salvar alterações" : "Cadastrar contato"}
            </button>
          </form>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Excluir contato"
        description={`Tem certeza que deseja excluir "${deleteTarget?.name}"? Essa ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        loading={deleting}
        onConfirm={confirmDeleteContact}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
