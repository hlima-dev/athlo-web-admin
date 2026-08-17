import { useEffect, useState } from "react";
import { Building2, Check, Plus, RefreshCw, X } from "lucide-react";
import {
  listMyOrganizations,
  switchOrganization,
  createOrganization,
  saveSession,
  getStoredOrganization,
  type OrganizationOption,
} from "../services/auth";
import { useToast } from "./Toast";

interface Props {
  open: boolean;
  onClose: () => void;
}

const roleLabels: Record<string, string> = {
  OWNER: "Dono(a)",
  ADMIN: "Administrador(a)",
  MEMBER: "Membro",
};

export function SwitchOrganizationModal({ open, onClose }: Props) {
  const toast = useToast();
  const [organizations, setOrganizations] = useState<OrganizationOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [switchingId, setSwitchingId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [creating, setCreating] = useState(false);

  const currentOrg = getStoredOrganization();

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    listMyOrganizations()
      .then(setOrganizations)
      .catch(() => toast.error("Erro ao carregar suas empresas."))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  async function handleSwitch(organizationId: string) {
    if (organizationId === currentOrg?.id) {
      onClose();
      return;
    }

    try {
      setSwitchingId(organizationId);
      const auth = await switchOrganization(organizationId);
      saveSession(auth);
      window.location.href = "/dashboard";
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Erro ao trocar de unidade.");
      setSwitchingId(null);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newOrgName.trim()) return;

    try {
      setCreating(true);
      const auth = await createOrganization(newOrgName.trim());
      saveSession(auth);
      window.location.href = "/dashboard";
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Erro ao criar empresa.");
      setCreating(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-2xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-slate-900 dark:text-white">Trocar unidade</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">Carregando empresas...</p>
        ) : (
          <div className="mt-5 space-y-2">
            {organizations.map((org) => {
              const isCurrent = org.id === currentOrg?.id;
              return (
                <button
                  key={org.id}
                  type="button"
                  onClick={() => handleSwitch(org.id)}
                  disabled={switchingId !== null}
                  className={`w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition disabled:opacity-50 ${
                    isCurrent
                      ? "border-cyan-500 bg-cyan-500/10"
                      : "border-slate-200 dark:border-slate-700 hover:border-cyan-400"
                  }`}
                >
                  <Building2 size={18} className="shrink-0 text-cyan-400" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white truncate">{org.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {roleLabels[org.orgRole] ?? org.orgRole}
                    </p>
                  </div>
                  {isCurrent && <Check size={16} className="shrink-0 text-cyan-400" />}
                  {switchingId === org.id && (
                    <RefreshCw size={16} className="shrink-0 animate-spin text-cyan-400" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-5 border-t border-slate-200 dark:border-slate-800 pt-5">
          {!showCreate ? (
            <button
              type="button"
              onClick={() => setShowCreate(true)}
              className="flex w-full items-center gap-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:border-cyan-400 hover:text-cyan-500"
            >
              <Plus size={16} />
              Criar nova empresa
            </button>
          ) : (
            <form onSubmit={handleCreate} className="space-y-3">
              <input
                autoFocus
                placeholder="Nome da nova empresa"
                value={newOrgName}
                onChange={(e) => setNewOrgName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-cyan-400"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  disabled={creating}
                  className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creating || !newOrgName.trim()}
                  className="flex-1 rounded-xl bg-cyan-500 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
                >
                  {creating ? "Criando..." : "Criar e entrar"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
