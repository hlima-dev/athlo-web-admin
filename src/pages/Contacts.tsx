import { useEffect, useState } from "react";
import {
  Users,
  Search,
  Plus,
  Briefcase,
  Building2,
  Mail,
  Phone,
  MoreHorizontal,
} from "lucide-react";

import {
  getContacts,
  createContact,
  type Contact,
} from "../services/contacts";

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
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    type: "LEAD",
    city: "",
    state: "SP",
  });

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

  async function handleCreateContact(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      setSaving(true);
      await createContact(form);
      setShowModal(false);
      setForm({ name: "", email: "", phone: "", company: "", type: "LEAD", city: "", state: "SP" });
      await loadContacts();
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err?.response?.data?.error || "Erro ao cadastrar contato."
      );
    } finally {
      setSaving(false);
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
      <section className="rounded-[32px] bg-gradient-to-br from-cyan-500 via-blue-600 to-slate-900 p-6 shadow-2xl md:p-10">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white">
          <Users size={16} />
          Contatos
        </span>

        <h1 className="mt-6 text-3xl font-black text-white md:text-5xl">
          Centralize leads, clientes e fornecedores.
        </h1>

        <p className="mt-4 max-w-2xl text-white/80 md:text-lg">
          Acompanhe o relacionamento da sua empresa com cada contato em um só
          lugar.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-4">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <Users className="text-cyan-400" />
          <p className="mt-5 text-sm text-slate-400">Contatos cadastrados</p>
          <h2 className="mt-2 text-3xl font-black">{contacts.length}</h2>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <Briefcase className="text-emerald-400" />
          <p className="mt-5 text-sm text-slate-400">Clientes</p>
          <h2 className="mt-2 text-3xl font-black">{customers}</h2>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <Building2 className="text-yellow-400" />
          <p className="mt-5 text-sm text-slate-400">Fornecedores</p>
          <h2 className="mt-2 text-3xl font-black">{suppliers}</h2>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <Users className="text-purple-400" />
          <p className="mt-5 text-sm text-slate-400">Leads</p>
          <h2 className="mt-2 text-3xl font-black">{leads}</h2>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-black text-white">Lista de contatos</h2>
            <p className="text-sm text-slate-400">Dados carregados diretamente do backend.</p>
          </div>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 font-black text-slate-950 hover:bg-cyan-400"
          >
            <Plus size={20} />
            Novo contato
          </button>
        </div>

        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-800 px-4">
          <Search className="text-slate-500" size={20} />
          <input
            placeholder="Buscar contato..."
            className="w-full bg-transparent py-4 text-white outline-none placeholder:text-slate-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5">
          {loading ? (
            <p className="text-slate-400">Carregando contatos...</p>
          ) : contacts.length === 0 ? (
            <p className="text-slate-400">Nenhum contato encontrado.</p>
          ) : (
            contacts.map((contact) => (
              <div key={contact.id} className="rounded-3xl border border-slate-800 bg-slate-800 p-5">
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-500/10 text-xl font-black text-cyan-400">
                      {getInitials(contact.name)}
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-white">{contact.name}</h3>
                      <p className="text-sm text-slate-400">{contact.company || "Empresa não informada"}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:items-center">
                    <div>
                      <p className="text-xs text-slate-500">Tipo</p>
                      <span className="mt-1 inline-flex rounded-full bg-cyan-500/10 px-3 py-1 text-sm font-bold text-cyan-400">
                        {typeLabels[contact.type] || contact.type}
                      </span>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">Status</p>
                      <span className="mt-1 inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-bold text-emerald-400">
                        {statusLabels[contact.status] || contact.status}
                      </span>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">Cidade</p>
                      <p className="mt-1 font-bold text-white">{contact.city || "N/I"}</p>
                    </div>

                    <button className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-700 text-slate-300 hover:bg-slate-600">
                      <MoreHorizontal />
                    </button>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 border-t border-slate-700 pt-5 text-sm text-slate-400 md:grid-cols-2">
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
            onSubmit={handleCreateContact}
            className="w-full max-w-2xl rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">Novo contato</h2>
                <p className="text-sm text-slate-400">Cadastre um contato no banco de dados.</p>
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
                placeholder="Nome completo"
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />

              <input
                type="email"
                placeholder="E-mail"
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <input
                placeholder="Telefone"
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />

              <input
                placeholder="Empresa"
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />

              <select
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="LEAD">Lead</option>
                <option value="CUSTOMER">Cliente</option>
                <option value="SUPPLIER">Fornecedor</option>
              </select>

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
                onChange={(e) => setForm({ ...form, state: e.target.value.toUpperCase() })}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-6 w-full rounded-2xl bg-cyan-500 px-5 py-3 font-black text-slate-950 hover:bg-cyan-400 disabled:opacity-60"
            >
              {saving ? "Salvando..." : "Cadastrar contato"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
