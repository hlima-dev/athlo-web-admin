import { useEffect, useState } from "react";
import { CheckCircle2, ChevronDown, ChevronRight, Search } from "lucide-react";
import { useToast } from "./Toast";
import { getErrorMessage } from "../utils/errors";
import { listAdminErrors, resolveAdminError, type AdminErrorLog } from "../services/admin";
import { Button, Card, CardHeader, EmptyState, inputClass } from "./ui";

type Filter = "unresolved" | "resolved" | "all";

function formatDate(value: string) {
  return new Date(value).toLocaleString("pt-BR");
}

export function AdminErrorsPanel() {
  const toast = useToast();
  const [errors, setErrors] = useState<AdminErrorLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("unresolved");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      const data = await listAdminErrors({
        resolved: filter === "all" ? undefined : filter === "resolved",
        search: search || undefined,
      });
      setErrors(data);
    } catch (err) {
      console.error("Erro ao carregar log de erros:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- busca ao montar e sempre que o filtro muda
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    await load();
  }

  async function handleResolve(log: AdminErrorLog) {
    try {
      setResolvingId(log.id);
      await resolveAdminError(log.id);
      toast.success("Marcado como resolvido.");
      setErrors((current) => current.filter((e) => e.id !== log.id));
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Erro ao marcar como resolvido."));
    } finally {
      setResolvingId(null);
    }
  }

  const filterOptions: { key: Filter; label: string }[] = [
    { key: "unresolved", label: "Não resolvidos" },
    { key: "resolved", label: "Resolvidos" },
    { key: "all", label: "Todos" },
  ];

  return (
    <Card>
      <CardHeader
        title="Erros do sistema"
        action={
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative">
              <Search size={15} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-faint dark:text-faint-dark" />
              <input
                placeholder="Buscar por mensagem ou rota..."
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

      <div className="flex gap-1.5 border-b border-line px-5 py-3.5 dark:border-line-dark">
        {filterOptions.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setFilter(opt.key)}
            className={`rounded-md px-3 py-1.5 text-[12.5px] font-medium transition ${
              filter === opt.key
                ? "bg-forest text-white dark:bg-forest-400"
                : "text-muted hover:bg-[#F0EEE8] dark:text-muted-dark dark:hover:bg-white/[0.06]"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="space-y-2.5 p-5">
        {loading ? (
          <p className="text-[13px] text-muted dark:text-muted-dark">Carregando...</p>
        ) : errors.length === 0 ? (
          <EmptyState
            icon={<CheckCircle2 size={20} />}
            title={filter === "unresolved" ? "Nenhum erro pendente." : "Nenhum registro encontrado."}
            description="Erros reportados pelo backend aparecem aqui."
          />
        ) : (
          errors.map((log) => {
            const expanded = expandedId === log.id;
            return (
              <div key={log.id} className="rounded-md border border-line p-4 dark:border-line-dark">
                <div className="flex items-start justify-between gap-3">
                  <button
                    onClick={() => setExpandedId(expanded ? null : log.id)}
                    className="flex flex-1 items-start gap-2 text-left"
                  >
                    {expanded ? (
                      <ChevronDown size={15} className="mt-0.5 shrink-0 text-faint dark:text-faint-dark" />
                    ) : (
                      <ChevronRight size={15} className="mt-0.5 shrink-0 text-faint dark:text-faint-dark" />
                    )}
                    <div className="min-w-0">
                      <p className="break-words text-[13.5px] font-medium">{log.message}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[11.5px] text-muted dark:text-muted-dark">
                        <span className="rounded bg-[#F0EEE8] px-1.5 py-0.5 font-mono dark:bg-white/[0.06]">
                          {log.method} {log.path}
                        </span>
                        <span>{formatDate(log.createdAt)}</span>
                        {log.user && <span>· {log.user.name}</span>}
                        {log.organization && <span>· {log.organization.name}</span>}
                      </div>
                    </div>
                  </button>

                  {!log.resolvedAt && (
                    <Button
                      size="sm"
                      variant="ghost"
                      loading={resolvingId === log.id}
                      onClick={() => handleResolve(log)}
                    >
                      <CheckCircle2 size={14} />
                      Resolver
                    </Button>
                  )}
                </div>

                {expanded && log.stack && (
                  <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap rounded-md bg-[#11140F] p-3 text-[11.5px] text-[#C6D6CD]">
                    {log.stack}
                  </pre>
                )}
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
