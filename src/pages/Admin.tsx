import { useEffect, useState } from "react";
import { Search, Ban, CheckCircle2 } from "lucide-react";
import { useToast } from "../components/Toast";
import { AdminErrorsPanel } from "../components/AdminErrorsPanel";
import { getErrorMessage } from "../utils/errors";
import {
  getAdminOverview,
  listAdminOrganizations,
  setOrganizationStatus,
  type AdminOverview,
  type AdminOrganization,
} from "../services/admin";
import {
  Badge,
  Button,
  Card,
  CardHeader,
  PageContainer,
  StatStrip,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  inputClass,
} from "../components/ui";

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

const subscriptionGroupLabels: Record<string, string> = {
  active: "Ativas",
  trialing: "Em trial",
  pastDue: "Pagamento pendente",
  canceled: "Canceladas",
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
    // eslint-disable-next-line react-hooks/set-state-in-effect -- busca inicial ao montar a tela
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
      toast.success(nextStatus === "SUSPENDED" ? "Empresa suspensa." : "Empresa reativada.");
      await load();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Erro ao atualizar status da empresa."));
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <PageContainer>
      <StatStrip
        items={[
          { label: "Empresas", value: loading ? "…" : String(overview?.totalOrganizations ?? 0) },
          { label: "Usuários", value: loading ? "…" : String(overview?.totalUsers ?? 0) },
          { label: "MRR", value: loading ? "…" : formatCurrency(overview?.mrr ?? 0) },
          { label: "Assinaturas ativas", value: loading ? "…" : String(overview?.subscriptions.active ?? 0) },
        ]}
      />

      {overview && (
        <Card>
          <CardHeader title="Assinaturas por status" />
          <div className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-4">
            {Object.entries(overview.subscriptions).map(([key, value]) => (
              <div key={key} className="rounded-md bg-[#F0EEE8] p-4 dark:bg-white/[0.06]">
                <p className="text-[12px] text-muted dark:text-muted-dark">
                  {subscriptionGroupLabels[key] ?? key}
                </p>
                <p className="mt-1 text-[20px] font-semibold tabular-nums">{value}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <CardHeader
          title="Empresas clientes"
          action={
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative">
                <Search size={15} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-faint dark:text-faint-dark" />
                <input
                  placeholder="Buscar por nome ou e-mail..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`${inputClass} py-1.5 pl-8`}
                />
              </div>
              <Button type="submit" size="sm">
                Buscar
              </Button>
            </form>
          }
        />

        <Table minWidth={760}>
          <Thead>
            <Tr>
              <Th>Empresa</Th>
              <Th>Plano</Th>
              <Th>Assinatura</Th>
              <Th>Usuários</Th>
              <Th>Status</Th>
              <Th align="right">Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {organizations.map((org) => (
              <Tr key={org.id}>
                <Td>
                  <p className="font-medium">{org.name}</p>
                  <p className="text-[12px] text-muted dark:text-muted-dark">{org.email || org.slug}</p>
                </Td>
                <Td>{org.subscription?.plan?.name || "-"}</Td>
                <Td>{org.subscription ? subscriptionStatusLabels[org.subscription.status] : "-"}</Td>
                <Td>{org._count?.users ?? "-"}</Td>
                <Td>
                  <Badge tone={org.status === "SUSPENDED" ? "negative" : "positive"}>
                    {statusLabels[org.status] || org.status}
                  </Badge>
                </Td>
                <Td align="right">
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      variant={org.status === "SUSPENDED" ? "ghost" : "danger"}
                      loading={updatingId === org.id}
                      onClick={() => toggleStatus(org)}
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
                    </Button>
                  </div>
                </Td>
              </Tr>
            ))}

            {!loading && organizations.length === 0 && (
              <Tr>
                <Td colSpan={6} className="py-8 text-center text-muted dark:text-muted-dark" align="center">
                  Nenhuma empresa encontrada.
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Card>

      <AdminErrorsPanel />
    </PageContainer>
  );
}
