import { AlertTriangle } from "lucide-react";
import { Button } from "./ui";

interface Props {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  danger = true,
  loading = false,
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/40 px-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-card border border-line bg-surface p-5 shadow-lg dark:border-line-dark dark:bg-surface-dark"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3.5">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${
              danger
                ? "bg-[#F6E4E1] text-danger dark:bg-danger-dark/15 dark:text-danger-dark"
                : "bg-forest-100 text-forest-600 dark:bg-forest-900 dark:text-forest-400"
            }`}
          >
            <AlertTriangle size={20} />
          </div>

          <div>
            <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>
            <p className="mt-1 text-[12.5px] text-muted dark:text-muted-dark">{description}</p>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={danger ? "danger" : "primary"} onClick={onConfirm} loading={loading}>
            {loading ? "Aguarde..." : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
