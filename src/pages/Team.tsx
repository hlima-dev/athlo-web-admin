import { useEffect, useState } from "react";
import {
  Users,
  Search,
  Plus,
  Mail,
  ShieldCheck,
  Clock3,
  CheckCircle2,
  X,
} from "lucide-react";
import { getMembers, type Member } from "../services/organization";
import { getInvites, createInvite, revokeInvite, type Invite } from "../services/invites";
import { PageHeader } from "../components/PageHeader";

const roleLabels: Record<string, string> = {
  OWNER: "Dono",
  ADMIN: "Administrador",
  MEMBER: "Membro",
};

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

export function Team() {
  const [members, setMembers] = useState<Member[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", role: "MEMBER" });

  async function load() {
    try {
      setLoading(true);
      const [membersList, invitesList] = await Promise.all([getMembers(), getInvites()]);
      setMembers(membersList);
      setInvites(invitesList.filter((i) => !i.acceptedAt));
    } catch (err) {
      console.error("Erro ao carregar equipe:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      setSaving(true);
      await createInvite(form.email, form.role);
      setShowModal(false);
      setForm({ email: "", role: "MEMBER" });
      await load();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao enviar convite.");
    } finally {
      setSaving(false);
    }
  }

  async function handleRevoke(id: string) {
    try {
      await revokeInvite(id);
      await load();
    } catch (err) {
      console.error("Erro ao revogar convite:", err);
    }
  }

  const filtered = members.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()));
  const admins = members.filter((m) => m.orgRole === "OWNER" || m.orgRole === "ADMIN").length;

  return (
    <div className="space-y-8">
      <PageHeader
        icon={Users}
        title="Equipe"
        description="Convide colaboradores e defina o papel de cada um na plataforma."
        action={
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 font-bold text-slate-950 hover:bg-cyan-400"
          >
            <Plus size={20} />
            Convidar membro
          </button>
        }
      />

      <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm shadow-slate-200/40 dark:shadow-none p-5">
          <Users className="text-cyan-400" size={20} />
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Membros ativos</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{loading ? "..." : members.length}</h2>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm shadow-slate-200/40 dark:shadow-none p-5">
          <ShieldCheck className="text-emerald-400" size={20} />
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Administradores</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{loading ? "..." : admins}</h2>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm shadow-slate-200/40 dark:shadow-none p-5">
          <Clock3 className="text-yellow-400" size={20} />
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Convites pendentes</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{loading ? "..." : invites.length}</h2>
        </div>
      </section>

      {invites.length > 0 && (
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm shadow-slate-200/40 dark:shadow-none p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Convites pendentes</h2>
          <div className="mt-4 space-y-3">
            {invites.map((invite) => (
              <div key={invite.id} className="flex items-center justify-between rounded-2xl bg-slate-100 dark:bg-slate-800 p-4">
                <div className="flex items-center gap-3">
                  <Mail className="text-cyan-400" size={18} />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{invite.email}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {roleLabels[invite.role] || invite.role} · expira em{" "}
                      {new Date(invite.expiresAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRevoke(invite.id)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-red-500/20 hover:text-red-400"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm shadow-slate-200/40 dark:shadow-none p-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Membros da equipe</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Gerencie os usuários da sua empresa.</p>
        </div>

        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4">
          <Search className="text-slate-400 dark:text-slate-500" size={20} />
          <input
            placeholder="Buscar membro..."
            className="w-full bg-transparent py-4 text-slate-900 dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="mt-6">
          {loading ? (
            <p className="text-slate-500 dark:text-slate-400">Carregando...</p>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-10 text-center">
              <Users className="mx-auto text-slate-400 dark:text-slate-500" size={40} />
              <p className="mt-4 text-slate-500 dark:text-slate-400">Nenhum membro encontrado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {filtered.map((member) => (
                <div key={member.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-800/60 p-5">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-sm font-bold text-cyan-400">
                        {getInitials(member.name)}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">{member.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{member.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:items-center">
                      <div>
                        <p className="text-xs text-slate-400 dark:text-slate-500">Papel</p>
                        <span className="mt-1 inline-flex rounded-full bg-cyan-500/10 px-3 py-1 text-sm font-bold text-cyan-400">
                          {roleLabels[member.orgRole] || member.orgRole}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 dark:text-slate-500">Status</p>
                        <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-bold text-emerald-400">
                          <CheckCircle2 size={14} />
                          {member.status === "ACTIVE" ? "Ativo" : member.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 dark:text-slate-500">Desde</p>
                        <p className="mt-1 text-sm text-slate-900 dark:text-white">
                          {new Date(member.createdAt).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <form
            onSubmit={handleInvite}
            className="w-full max-w-md rounded-3xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Convidar membro</h2>
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

            <div className="space-y-4">
              <input
                type="email"
                placeholder="E-mail do convidado"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-cyan-400"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />

              <select
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-cyan-400"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="MEMBER">Membro</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-6 w-full rounded-2xl bg-cyan-500 px-5 py-3 font-black text-slate-950 hover:bg-cyan-400 disabled:opacity-60"
            >
              {saving ? "Enviando..." : "Enviar convite"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
