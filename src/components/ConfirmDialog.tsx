import { AlertTriangle } from "lucide-react";

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
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
              danger ? "bg-red-500/10 text-red-400" : "bg-cyan-500/10 text-cyan-400"
            }`}
          >
            <AlertTriangle size={22} />
          </div>

          <div>
            <h2 className="font-bold text-white">{title}</h2>
            <p className="mt-1 text-sm text-slate-400">{description}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-bold text-slate-300 hover:bg-slate-800 disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-xl px-4 py-2 text-sm font-bold text-white disabled:opacity-60 ${
              danger ? "bg-red-600 hover:bg-red-500" : "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
            }`}
          >
            {loading ? "Aguarde..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
