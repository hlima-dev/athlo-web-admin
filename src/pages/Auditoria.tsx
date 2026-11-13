import { useEffect, useState } from "react";
import { ScrollText, Search, ShieldAlert } from "lucide-react";
import { getAuditLogs, type AuditAction, type AuditLog } from "../services/auditLogs";
import { getStoredUser } from "../services/auth";
import {
  Badge,
  type BadgeTone,
  Card,
  CardHeader,
  EmptyState,
  PageContainer,
  SkeletonRows,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "../components/ui";

const actionLabels: Record<AuditAction, string> = {
  CREATE: "Criação",
  UPDATE: "Atualização",
  DELETE: "Exclusão",
};

const actionTones: Record<AuditAction, BadgeTone> = {
  CREATE: "positive",
  UPDATE: "info",
  DELETE: "negative",
};

const entityTypeLabels: Record<string, string> = {
  Contact: "Contato",
  Invoice: "Fatura",
  Product: "Produto",
  Order: "Pedido",
  Event: "Agenda",
  Permission: "Permissões",
  Organization: "Empresa",
  Invite: "Convite",
};

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function Auditoria() {
  const user = getStoredUser();
  const canView = user?.orgRole === "OWNER" || user?.orgRole === "ADMIN";

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function loadLogs(term: string) {
    try {
      setLoading(true);
      const list = await getAuditLogs(term ? { search: term } : undefined);
      setLogs(list);
    } catch (err) {
      console.error("Erro ao carregar auditoria:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!canView) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- busca inicial ao montar a tela
    loadLogs(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!canView) return;
    const timeout = setTimeout(() => loadLogs(search), 400);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  if (!canView) {
    return (
      <PageContainer>
        <Card>
          <EmptyState
            icon={<ShieldAlert size={20} />}
            title="Acesso restrito"
            description="A trilha de auditoria é visível apenas para donos e administradores da empresa."
          />
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Card>
        <CardHeader
          title="Trilha de auditoria"
          subtitle="Registro de criação, atualização e exclusão de registros da empresa."
        />

        <div className="flex items-center gap-2.5 border-b border-line px-5 py-3.5 dark:border-line-dark">
          <Search size={16} className="text-faint dark:text-faint-dark" />
          <input
            placeholder="Buscar por descrição ou tipo de registro..."
            className="w-full bg-transparent text-[13.5px] outline-none placeholder:text-faint dark:placeholder:text-faint-dark"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <SkeletonRows rows={6} cols={4} />
        ) : logs.length === 0 ? (
          <EmptyState
            icon={<ScrollText size={20} />}
            title="Nenhum registro encontrado"
            description="Ações de criação, atualização e exclusão feitas na empresa aparecem aqui."
          />
        ) : (
          <Table minWidth={720}>
            <Thead>
              <Tr>
                <Th>Quando</Th>
                <Th>Usuário</Th>
                <Th>Ação</Th>
                <Th>Registro</Th>
                <Th>Resumo</Th>
              </Tr>
            </Thead>
            <Tbody>
              {logs.map((log) => (
                <Tr key={log.id}>
                  <Td className="whitespace-nowrap text-muted dark:text-muted-dark">
                    {formatDateTime(log.createdAt)}
                  </Td>
                  <Td>{log.user?.name || "—"}</Td>
                  <Td>
                    <Badge tone={actionTones[log.action]}>{actionLabels[log.action]}</Badge>
                  </Td>
                  <Td>
                    <Badge tone="neutral">{entityTypeLabels[log.entityType] || log.entityType}</Badge>
                  </Td>
                  <Td>{log.summary}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Card>
    </PageContainer>
  );
}
