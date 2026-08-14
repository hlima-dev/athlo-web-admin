import { useEffect, useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PAYMENT_REQUIRED_EVENT } from "../services/api";

// Escuta o evento global disparado pelo interceptor de resposta da API
// sempre que o backend recusa uma escrita com HTTP 402 (assinatura
// inativa ou trial encerrado). Mostra um aviso persistente sem
// interromper a navegação — o usuário decide quando ir assinar um plano.
export function PaymentRequiredBanner() {
  const navigate = useNavigate();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    function handler(event: Event) {
      const detail = (event as CustomEvent<{ message?: string }>).detail;
      setMessage(
        detail?.message || "Sua assinatura está inativa. Algumas ações estão bloqueadas."
      );
    }

    window.addEventListener(PAYMENT_REQUIRED_EVENT, handler);
    return () => window.removeEventListener(PAYMENT_REQUIRED_EVENT, handler);
  }, []);

  if (!message) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[90] flex items-center justify-center gap-4 border-b border-amber-700 bg-amber-950/95 px-4 py-3 text-sm text-amber-200 backdrop-blur">
      <AlertTriangle size={18} className="shrink-0" />
      <p className="flex-1 text-center font-semibold sm:flex-none">{message}</p>
      <button
        onClick={() => {
          setMessage(null);
          navigate("/configuracoes");
        }}
        className="shrink-0 rounded-lg bg-amber-500 px-3 py-1.5 font-bold text-amber-950 hover:bg-amber-400"
      >
        Ver planos
      </button>
      <button onClick={() => setMessage(null)} className="shrink-0 text-amber-400 hover:text-amber-200">
        <X size={16} />
      </button>
    </div>
  );
}
