import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";

interface ToastItem {
  id: number;
  type: "success" | "error";
  message: string;
}

interface ToastContextValue {
  success: (message: string) => void;
  error: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let nextId = 1;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const remove = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (type: ToastItem["type"], message: string) => {
      const id = nextId++;
      setToasts((current) => [...current, { id, type, message }]);
      setTimeout(() => remove(id), 5000);
    },
    [remove]
  );

  const value: ToastContextValue = {
    success: (message) => push("success", message),
    error: (message) => push("error", message),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-3 px-4 sm:items-end sm:right-4 sm:left-auto">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-card border bg-surface p-4 shadow-lg dark:bg-surface-dark ${
              toast.type === "success"
                ? "border-forest-100 dark:border-forest-900"
                : "border-[#F6E4E1] dark:border-danger-dark/30"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="mt-0.5 shrink-0 text-forest-600 dark:text-forest-400" size={20} />
            ) : (
              <XCircle className="mt-0.5 shrink-0 text-danger dark:text-danger-dark" size={20} />
            )}

            <p className="flex-1 text-[13px] font-medium text-ink dark:text-ink-dark">
              {toast.message}
            </p>

            <button
              onClick={() => remove(toast.id)}
              className="shrink-0 text-faint hover:text-ink dark:text-faint-dark dark:hover:text-ink-dark"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- hook fica junto do provider de propósito, é o par Context+hook padrão
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast deve ser usado dentro de um ToastProvider");
  }
  return ctx;
}
