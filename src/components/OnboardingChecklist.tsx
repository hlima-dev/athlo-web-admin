import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Circle, Rocket, X } from "lucide-react";

import { getStoredOrganization } from "../services/auth";
import { getDashboard } from "../services/dashboard";
import { getMyOrganization } from "../services/organization";
import { getProducts } from "../services/products";
import { getInvoices } from "../services/invoices";
import { Card, CardHeader } from "./ui";

interface ChecklistItem {
  key: string;
  label: string;
  done: boolean;
  path: string;
}

function dismissKey(organizationId: string) {
  return `@athlo:onboarding-dismissed:${organizationId}`;
}

// Nudge de primeiros passos — some sozinho quando todo item já foi feito,
// ou se a própria empresa dispensar (guardado por empresa, não global).
export function OnboardingChecklist() {
  const navigate = useNavigate();
  const organization = getStoredOrganization();
  const [items, setItems] = useState<ChecklistItem[] | null>(null);
  const [dismissed, setDismissed] = useState(() => {
    if (!organization) return true;
    try {
      return localStorage.getItem(dismissKey(organization.id)) === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (!organization) return;

    Promise.all([
      getDashboard(),
      getMyOrganization(),
      getProducts({ limit: "1" }),
      getInvoices({ limit: "1" }),
    ])
      .then(([dashboard, org, products, invoices]) => {
        setItems([
          { key: "contact", label: "Cadastre seu primeiro contato", done: dashboard.contacts > 0, path: "/contatos?novo=1" },
          { key: "product", label: "Cadastre um produto ou serviço", done: (products.meta?.total ?? 0) > 0, path: "/produtos?novo=1" },
          { key: "invoice", label: "Registre uma fatura ou conta", done: (invoices.meta?.total ?? 0) > 0, path: "/financeiro?novo=1" },
          { key: "event", label: "Agende um compromisso", done: dashboard.events > 0, path: "/eventos?novo=1" },
          { key: "team", label: "Convide um membro da equipe", done: dashboard.users > 1, path: "/equipe" },
          { key: "tax", label: "Configure o regime tributário da empresa", done: !!org.taxRegime, path: "/configuracoes" },
        ]);
      })
      .catch((err) => console.error("Erro ao carregar o checklist de primeiros passos:", err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleDismiss() {
    if (!organization) return;
    try {
      localStorage.setItem(dismissKey(organization.id), "1");
    } catch {
      // localStorage pode estar bloqueado (aba anônima) — ignora, o
      // dismiss só não persiste entre sessões.
    }
    setDismissed(true);
  }

  if (!organization || dismissed || !items) return null;

  const doneCount = items.filter((item) => item.done).length;
  if (doneCount === items.length) return null;

  return (
    <Card>
      <CardHeader
        title="Primeiros passos"
        subtitle={`${doneCount} de ${items.length} concluídos — monte a base do seu catálogo e equipe.`}
        action={
          <div className="flex items-center gap-2">
            <Rocket size={18} className="text-muted dark:text-muted-dark" />
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Dispensar checklist de primeiros passos"
              className="text-faint transition hover:text-muted dark:text-faint-dark dark:hover:text-muted-dark"
            >
              <X size={16} />
            </button>
          </div>
        }
      />
      <ul className="divide-y divide-line p-2 dark:divide-line-dark">
        {items.map((item) => (
          <li key={item.key}>
            <button
              type="button"
              onClick={() => navigate(item.path)}
              disabled={item.done}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-[13px] transition hover:bg-[#F0EEE8] disabled:cursor-default disabled:hover:bg-transparent dark:hover:bg-white/[0.04]"
            >
              {item.done ? (
                <CheckCircle2 size={17} className="shrink-0 text-forest-600 dark:text-forest-400" />
              ) : (
                <Circle size={17} className="shrink-0 text-faint dark:text-faint-dark" />
              )}
              <span className={item.done ? "text-faint line-through dark:text-faint-dark" : ""}>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}
