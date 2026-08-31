import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, ChevronDown, ChevronRight, Search } from "lucide-react";
import { useToast } from "./Toast";
import { getErrorMessage } from "../utils/errors";
import {
  listAdminErrors,
  resolveAdminError,
  type AdminErrorLog,
} from "../services/admin";

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
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm shadow-slate-200/40 dark:shadow-none p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="text-amber-400" size={20} />
          <h2 className="font-bold text-slate-900 dark:text-white">Erros do sistema</h2>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              placeholder="Buscar por mensagem ou rota..."
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

      <div className="mt-4 flex gap-2">
        {filterOptions.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setFilter(opt.key)}
            className={`rounded-full px-3 py-1 text-xs font-bold transition ${
              filter === opt.key
                ? "bg-cyan-500 text-slate-950"
                : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {loading ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">Carregando...</p>
        ) : errors.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center">
            <CheckCircle2 className="mx-auto text-emerald-400" size={24} />
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {filter === "unresolved" ? "Nenhum erro pendente." : "Nenhum registro encontrado."}
            </p>
          </div>
        ) : (
          errors.map((log) => {
            const expanded = expandedId === log.id;
            return (
              <div
                key={log.id}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <button
                    onClick={() => setExpandedId(expanded ? null : log.id)}
                    className="flex flex-1 items-start gap-2 text-left"
                  >
                    {expanded ? (
                      <ChevronDown size={16} className="mt-0.5 shrink-0 text-slate-400" />
                    ) : (
                      <ChevronRight size={16} className="mt-0.5 shrink-0 text-slate-400" />
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 dark:text-white break-words">
                        {log.message}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span className="rounded-full bg-slate-200 dark:bg-slate-700 px-2 py-0.5 font-mono">
                          {log.method} {log.path}
                        </span>
                        <span>{formatDate(log.createdAt)}</span>
                        {log.user && <span>· {log.user.name}</span>}
                        {log.organization && <span>· {log.organization.name}</span>}
                      </div>
                    </div>
                  </button>

                  {!log.resolvedAt && (
                    <button
                      onClick={() => handleResolve(log)}
                      disabled={resolvingId === log.id}
                      className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-40"
                    >
                      <CheckCircle2 size={13} />
                      Resolver
                    </button>
                  )}
                </div>

                {expanded && log.stack && (
                  <pre className="mt-3 max-h-64 overflow-auto rounded-lg bg-slate-950 p-3 text-xs text-slate-300 whitespace-pre-wrap">
                    {log.stack}
                  </pre>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
