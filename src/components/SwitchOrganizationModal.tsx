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
import { getErrorMessage } from "../utils/errors";
import { Button, inputClass } from "./ui";

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
    // eslint-disable-next-line react-hooks/set-state-in-effect -- exibe o spinner assim que o modal abre, antes da busca resolver
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
      // eslint-disable-next-line react-hooks/immutability -- navegação de página inteira de propósito, pra recarregar todo o estado da nova organização
      window.location.href = "/dashboard";
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Erro ao trocar de unidade."));
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
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Erro ao criar empresa."));
      setCreating(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/40 px-4"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-card border border-line bg-surface p-6 shadow-2xl dark:border-line-dark dark:bg-surface-dark"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-semibold tracking-tight">Trocar unidade</h2>
          <button onClick={onClose} className="text-faint transition hover:text-ink dark:text-faint-dark dark:hover:text-ink-dark">
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <p className="mt-6 text-[13px] text-muted dark:text-muted-dark">Carregando empresas...</p>
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
                  className={`flex w-full items-center gap-3 rounded-md border px-4 py-3 text-left transition disabled:opacity-50 ${
                    isCurrent
                      ? "border-forest-600 bg-forest-100 dark:border-forest-400 dark:bg-forest-900"
                      : "border-line hover:border-forest-600/50 dark:border-line-dark dark:hover:border-forest-400/50"
                  }`}
                >
                  <Building2 size={18} className="shrink-0 text-forest-600 dark:text-forest-400" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-semibold">{org.name}</p>
                    <p className="text-[12px] text-muted dark:text-muted-dark">
                      {roleLabels[org.orgRole] ?? org.orgRole}
                    </p>
                  </div>
                  {isCurrent && <Check size={16} className="shrink-0 text-forest-600 dark:text-forest-400" />}
                  {switchingId === org.id && (
                    <RefreshCw size={16} className="shrink-0 animate-spin text-forest-600 dark:text-forest-400" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-5 border-t border-line pt-5 dark:border-line-dark">
          {!showCreate ? (
            <button
              type="button"
              onClick={() => setShowCreate(true)}
              className="flex w-full items-center gap-2 rounded-md border border-dashed border-line px-4 py-3 text-[13px] font-medium text-muted transition hover:border-forest-600/50 hover:text-forest-600 dark:border-line-dark dark:text-muted-dark dark:hover:border-forest-400/50 dark:hover:text-forest-400"
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
                className={inputClass}
              />
              <div className="flex gap-2">
                <Button type="button" variant="ghost" onClick={() => setShowCreate(false)} disabled={creating} className="flex-1 justify-center">
                  Cancelar
                </Button>
                <Button type="submit" disabled={!newOrgName.trim()} loading={creating} className="flex-1 justify-center">
                  {creating ? "Criando..." : "Criar e entrar"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
