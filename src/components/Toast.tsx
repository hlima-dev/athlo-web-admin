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
            className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border p-4 shadow-2xl backdrop-blur ${
              toast.type === "success"
                ? "border-emerald-700 bg-emerald-950/90"
                : "border-red-700 bg-red-950/90"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-400" size={20} />
            ) : (
              <XCircle className="mt-0.5 shrink-0 text-red-400" size={20} />
            )}

            <p
              className={`flex-1 text-sm font-semibold ${
                toast.type === "success" ? "text-emerald-200" : "text-red-200"
              }`}
            >
              {toast.message}
            </p>

            <button
              onClick={() => remove(toast.id)}
              className="shrink-0 text-slate-400 hover:text-white"
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
