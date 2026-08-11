import { useEffect, useMemo, useState } from "react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Clock3,
  Plus,
} from "lucide-react";
import { getInvoices, createInvoice, markInvoicePaid, type Invoice } from "../services/invoices";

function toCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(value?: string) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("pt-BR");
}

const statusLabels: Record<string, string> = {
  PENDING: "Pendente",
  PAID: "Paga",
  OVERDUE: "Vencida",
  CANCELED: "Cancelada",
};

const methodLabels: Record<string, string> = {
  PIX: "PIX",
  CREDIT_CARD: "Cartão de crédito",
  BANK_TRANSFER: "Transferência",
  BOLETO: "Boleto",
  CASH: "Dinheiro",
  OTHER: "Outro",
};

export function Financeiro() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    type: "RECEIVABLE",
    description: "",
    amount: "",
    dueDate: "",
    method: "PIX",
  });

  async function loadInvoices() {
    try {
      setLoading(true);
      setError("");
      const list = await getInvoices();
      setInvoices(list);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar faturas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInvoices();
  }, []);

  async function handleCreateInvoice(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      setSaving(true);
      await createInvoice({
        type: form.type,
        description: form.description,
        amount: Number(form.amount),
        dueDate: form.dueDate,
        method: form.method,
      });

      setShowModal(false);
      setForm({ type: "RECEIVABLE", description: "", amount: "", dueDate: "", method: "PIX" });
      await loadInvoices();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao cadastrar fatura.");
    } finally {
      setSaving(false);
    }
  }

  async function handleMarkPaid(id: string) {
    try {
      await markInvoicePaid(id);
      await loadInvoices();
    } catch (err) {
      console.error("Erro ao marcar fatura como paga:", err);
    }
  }

  const stats = useMemo(() => {
    const receivable = invoices.filter((i) => i.type === "RECEIVABLE");
    const payable = invoices.filter((i) => i.type === "PAYABLE");
    const totalReceivable = receivable
      .filter((i) => i.status === "PAID")
      .reduce((sum, i) => sum + Number(i.amount || 0), 0);
    const totalPayable = payable
      .filter((i) => i.status === "PAID")
      .reduce((sum, i) => sum + Number(i.amount || 0), 0);
    const pending = invoices.filter((i) => i.status === "PENDING").length;

    return { totalReceivable, totalPayable, pending };
  }, [invoices]);

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] bg-gradient-to-br from-cyan-500 via-blue-600 to-slate-900 p-6 shadow-2xl md:p-10">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white">
          <Wallet size={16} /> Financeiro
        </span>
        <h1 className="mt-6 text-3xl font-black text-white md:text-5xl">
          Controle contas a pagar e a receber.
        </h1>
        <p className="mt-4 max-w-2xl text-white/80 md:text-lg">
          Acompanhe faturas, prazos e o fluxo de caixa da sua empresa em um só lugar.
        </p>
      </section>

      {error ? (
        <div className="rounded-2xl border border-red-700 bg-red-900/30 p-4 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <TrendingUp className="text-emerald-400" />
          <p className="mt-5 text-sm text-slate-400">Recebido</p>
          <h2 className="mt-2 text-3xl font-black text-white">
            {loading ? "..." : toCurrency(stats.totalReceivable)}
          </h2>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <TrendingDown className="text-red-400" />
          <p className="mt-5 text-sm text-slate-400">Pago</p>
          <h2 className="mt-2 text-3xl font-black text-white">
            {loading ? "..." : toCurrency(stats.totalPayable)}
          </h2>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <Clock3 className="text-yellow-400" />
          <p className="mt-5 text-sm text-slate-400">Faturas pendentes</p>
          <h2 className="mt-2 text-3xl font-black text-white">{loading ? "..." : stats.pending}</h2>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-black text-white">Faturas</h2>
            <p className="text-sm text-slate-400">Contas a pagar e a receber salvas no banco.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 font-black text-slate-950 hover:bg-cyan-400"
          >
            <Plus size={20} /> Nova fatura
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {loading ? (
            <p className="text-slate-400">Carregando faturas...</p>
          ) : invoices.length === 0 ? (
            <p className="text-slate-400">Nenhuma fatura encontrada.</p>
          ) : (
            invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex flex-col gap-4 rounded-2xl bg-slate-800 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                      invoice.status === "PAID"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-yellow-500/10 text-yellow-400"
                    }`}
                  >
                    {invoice.status === "PAID" ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}
                  </div>
                  <div>
                    <h3 className="font-black text-white">{invoice.description}</h3>
                    <p className="text-sm text-slate-400">
                      {invoice.type === "RECEIVABLE" ? "A receber" : "A pagar"} ·{" "}
                      {statusLabels[invoice.status] || invoice.status} · Vence em {formatDate(invoice.dueDate)}
                      {invoice.method ? ` · ${methodLabels[invoice.method] || invoice.method}` : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <strong
                    className={`text-xl ${
                      invoice.type === "RECEIVABLE" ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {toCurrency(Number(invoice.amount || 0))}
                  </strong>

                  {invoice.status === "PENDING" && (
                    <button
                      onClick={() => handleMarkPaid(invoice.id)}
                      className="rounded-xl bg-cyan-500 px-3 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400"
                    >
                      Marcar paga
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {showModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <form
            onSubmit={handleCreateInvoice}
            className="w-full max-w-2xl rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">Nova fatura</h2>
                <p className="text-sm text-slate-400">Registre uma conta a pagar ou a receber.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-xl bg-slate-800 px-4 py-2 text-slate-300 hover:bg-slate-700"
              >
                Fechar
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <select
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="RECEIVABLE">A receber</option>
                <option value="PAYABLE">A pagar</option>
              </select>

              <input
                type="number"
                min="0.01"
                step="0.01"
                placeholder="Valor"
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
              />

              <input
                placeholder="Descrição"
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400 md:col-span-2"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />

              <input
                type="date"
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                required
              />

              <select
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
                value={form.method}
                onChange={(e) => setForm({ ...form, method: e.target.value })}
              >
                <option value="PIX">PIX</option>
                <option value="CREDIT_CARD">Cartão de crédito</option>
                <option value="BANK_TRANSFER">Transferência</option>
                <option value="BOLETO">Boleto</option>
                <option value="CASH">Dinheiro</option>
                <option value="OTHER">Outro</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-6 w-full rounded-2xl bg-cyan-500 px-5 py-3 font-black text-slate-950 hover:bg-cyan-400 disabled:opacity-60"
            >
              {saving ? "Salvando..." : "Cadastrar fatura"}
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
