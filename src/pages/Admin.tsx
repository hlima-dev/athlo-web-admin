import { useEffect, useState } from "react";
import {
  Shield,
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  Search,
  Ban,
  CheckCircle2,
} from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { useToast } from "../components/Toast";
import {
  getAdminOverview,
  listAdminOrganizations,
  setOrganizationStatus,
  type AdminOverview,
  type AdminOrganization,
} from "../services/admin";

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const statusLabels: Record<string, string> = {
  TRIAL: "Trial",
  ACTIVE: "Ativa",
  SUSPENDED: "Suspensa",
  CANCELED: "Cancelada",
};

const subscriptionStatusLabels: Record<string, string> = {
  TRIALING: "Em trial",
  ACTIVE: "Ativa",
  PAST_DUE: "Pagamento pendente",
  CANCELED: "Cancelada",
};

export function Admin() {
  const toast = useToast();
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [organizations, setOrganizations] = useState<AdminOrganization[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      const [overviewData, orgs] = await Promise.all([
        getAdminOverview(),
        listAdminOrganizations({ search: search || undefined }),
      ]);
      setOverview(overviewData);
      setOrganizations(orgs);
    } catch (err) {
      console.error("Erro ao carregar painel de administração:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    await load();
  }

  async function toggleStatus(org: AdminOrganization) {
    const nextStatus = org.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED";
    try {
      setUpdatingId(org.id);
      await setOrganizationStatus(org.id, nextStatus);
      toast.success(
        nextStatus === "SUSPENDED" ? "Empresa suspensa." : "Empresa reativada."
      );
      await load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Erro ao atualizar status da empresa.");
    } finally {
      setUpdatingId(null);
    }
  }

  const cards = overview
    ? [
        { label: "Empresas", value: overview.totalOrganizations, icon: Building2, color: "text-cyan-400" },
        { label: "Usuários", value: overview.totalUsers, icon: Users, color: "text-emerald-400" },
        { label: "MRR", value: formatCurrency(overview.mrr), icon: DollarSign, color: "text-amber-400" },
        {
          label: "Assinaturas ativas",
          value: overview.subscriptions.active,
          icon: TrendingUp,
          color: "text-purple-400",
        },
      ]
    : [];

  return (
    <div className="space-y-8">
      <PageHeader
        icon={Shield}
        title="Administração da plataforma"
        description="Visão geral de todas as empresas clientes do ATHLO — uso restrito à equipe ATHLO."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm shadow-slate-200/40 dark:shadow-none p-5"
          >
            <div className="flex items-center gap-3">
              <card.icon className={card.color} size={20} />
              <p className="text-sm text-slate-500 dark:text-slate-400">{card.label}</p>
            </div>
            <p className="mt-3 text-2xl font-black text-slate-900 dark:text-white">
              {loading ? "…" : card.value}
            </p>
          </div>
        ))}
      </div>

      {overview && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm shadow-slate-200/40 dark:shadow-none p-6">
          <h2 className="font-bold text-slate-900 dark:text-white">Assinaturas por status</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Object.entries(overview.subscriptions).map(([key, value]) => (
              <div key={key} className="rounded-xl bg-slate-100 dark:bg-slate-800 p-4">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {
                    { active: "Ativas", trialing: "Em trial", pastDue: "Pagamento pendente", canceled: "Canceladas" }[
                      key
                    ]
                  }
                </p>
                <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm shadow-slate-200/40 dark:shadow-none p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-bold text-slate-900 dark:text-white">Empresas clientes</h2>

          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                placeholder="Buscar por nome ou e-mail..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 py-2 pl-9 pr-4 text-sm text-slate-900 dark:text-white outline-none focus:border-cyan-400"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-cyan-400"
            >
              Buscar
            </button>
          </form>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                <th className="pb-3 font-semibold">Empresa</th>
                <th className="pb-3 font-semibold">Plano</th>
                <th className="pb-3 font-semibold">Assinatura</th>
                <th className="pb-3 font-semibold">Usuários</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {organizations.map((org) => (
                <tr key={org.id}>
                  <td className="py-3">
                    <p className="font-semibold text-slate-900 dark:text-white">{org.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{org.email || org.slug}</p>
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-300">
                    {org.subscription?.plan?.name || "-"}
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-300">
                    {org.subscription ? subscriptionStatusLabels[org.subscription.status] : "-"}
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-300">{org._count?.users ?? "-"}</td>
                  <td className="py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        org.status === "SUSPENDED"
                          ? "bg-red-500/10 text-red-400"
                          : "bg-emerald-500/10 text-emerald-400"
                      }`}
                    >
                      {statusLabels[org.status] || org.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => toggleStatus(org)}
                      disabled={updatingId === org.id}
                      className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-bold disabled:opacity-40 ${
                        org.status === "SUSPENDED"
                          ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                          : "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                      }`}
                    >
                      {org.status === "SUSPENDED" ? (
                        <>
                          <CheckCircle2 size={14} /> Reativar
                        </>
                      ) : (
                        <>
                          <Ban size={14} /> Suspender
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}

              {!loading && organizations.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 dark:text-slate-400">
                    Nenhuma empresa encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
