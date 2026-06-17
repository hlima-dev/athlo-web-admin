import { useEffect, useMemo, useState } from "react";
import {
  HeartHandshake,
  TrendingUp,
  QrCode,
  Wallet,
  Users,
  CalendarDays,
  ArrowUpRight,
  CheckCircle2,
  Plus,
} from "lucide-react";
import { getDonations, createDonation, type Donation } from "../services/donations";

function toCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(value?: string) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("pt-BR");
}

function methodLabel(method?: string) {
  const map: Record<string, string> = {
    PIX: "PIX",
    CREDIT_CARD: "Cartão de crédito",
    BANK_TRANSFER: "Transferência",
    BOLETO: "Boleto",
    CASH: "Dinheiro",
    OTHER: "Outro",
  };

  return map[method || ""] || method || "Outro";
}

export function Donations() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    amount: "",
    method: "PIX",
    donorName: "",
    donorEmail: "",
    donorCpf: "",
    message: "",
    status: "CONFIRMED",
  });

  async function loadDonations() {
    try {
      setLoading(true);
      setError("");
      const list = await getDonations();
      setDonations(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar doações.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDonations();
  }, []);

  async function handleCreateDonation(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      setSaving(true);
      await createDonation({
        amount: Number(form.amount),
        method: form.method,
        donorName: form.donorName,
        donorEmail: form.donorEmail,
        donorCpf: form.donorCpf,
        message: form.message,
        status: form.status,
      });

      setShowModal(false);
      setForm({
        amount: "",
        method: "PIX",
        donorName: "",
        donorEmail: "",
        donorCpf: "",
        message: "",
        status: "CONFIRMED",
      });

      await loadDonations();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao cadastrar doação.");
    } finally {
      setSaving(false);
    }
  }

  const stats = useMemo(() => {
    const confirmed = donations.filter((d) => d.status === "CONFIRMED");
    const donors = new Set(
      donations.map((d) => d.donorEmail || d.donorName).filter(Boolean)
    ).size;
    const totalRaised = donations.reduce((sum, d) => sum + Number(d.amount || 0), 0);

    return { confirmed, donors, totalRaised };
  }, [donations]);

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] bg-gradient-to-br from-cyan-500 via-blue-600 to-slate-900 p-6 shadow-2xl md:p-10">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white">
          <HeartHandshake size={16} /> Gestão de doações
        </span>
        <h1 className="mt-6 text-3xl font-black text-white md:text-5xl">
          Controle campanhas, metas e contribuições da ASDA.
        </h1>
        <p className="mt-4 max-w-2xl text-white/80 md:text-lg">
          Acompanhe arrecadações e mantenha a transparência sobre o impacto de cada doação.
        </p>
      </section>

      {error ? (
        <div className="rounded-2xl border border-red-700 bg-red-900/30 p-4 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      <section className="grid grid-cols-1 gap-5 md:grid-cols-4">
        {[
          {
            icon: Wallet,
            color: "text-cyan-400",
            label: "Total arrecadado",
            value: loading ? "..." : toCurrency(stats.totalRaised),
          },
          {
            icon: TrendingUp,
            color: "text-emerald-400",
            label: "Doações confirmadas",
            value: loading ? "..." : stats.confirmed.length,
          },
          {
            icon: Users,
            color: "text-purple-400",
            label: "Doadores",
            value: loading ? "..." : stats.donors,
          },
          {
            icon: CalendarDays,
            color: "text-yellow-400",
            label: "Registros",
            value: loading ? "..." : donations.length,
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <Icon className={item.color} />
              <p className="mt-5 text-sm text-slate-400">{item.label}</p>
              <h2 className="mt-2 text-3xl font-black text-white">{item.value}</h2>
            </div>
          );
        })}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 xl:col-span-2">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-black text-white">Campanhas de arrecadação</h2>
              <p className="text-sm text-slate-400">Contribuições reais salvas no banco.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 font-black text-slate-950 hover:bg-cyan-400"
            >
              <Plus size={20} /> Nova doação
            </button>
          </div>

          <div className="mt-6 space-y-5">
            <div className="rounded-2xl bg-slate-800 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black text-white">Arrecadação geral</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Total registrado {toCurrency(stats.totalRaised)}
                  </p>
                </div>
                <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-sm font-bold text-cyan-400">
                  Ativa
                </span>
              </div>

              <div className="mt-5">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-400">Registros</span>
                  <strong className="text-cyan-400">{donations.length} doações</strong>
                </div>
                <div className="h-3 rounded-full bg-slate-700">
                  <div
                    className="h-3 rounded-full bg-cyan-500"
                    style={{ width: `${Math.min(donations.length * 10, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {loading ? (
              <p className="text-slate-400">Carregando doações...</p>
            ) : donations.length === 0 ? (
              <p className="text-slate-400">Nenhuma doação encontrada.</p>
            ) : (
              donations.map((donation) => (
                <div
                  key={donation.id}
                  className="flex flex-col gap-4 rounded-2xl bg-slate-800 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                      <CheckCircle2 size={18} />
                    </div>
                    <div>
                      <h3 className="font-black text-white">
                        {donation.donorName || "Doador não informado"}
                      </h3>
                      <p className="text-sm text-slate-400">
                        {methodLabel(donation.method)} - {formatDate(donation.createdAt)}
                      </p>
                    </div>
                  </div>
                  <strong className="text-xl text-cyan-400">
                    {toCurrency(Number(donation.amount || 0))}
                  </strong>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-500/10 text-cyan-400">
            <QrCode size={34} />
          </div>
          <h2 className="mt-6 text-2xl font-black text-white">PIX ATHLO</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Espaço preparado para integrar QR Code PIX, chave de doação e confirmação automatizada futuramente.
          </p>
          <div className="mt-6 rounded-2xl border border-dashed border-slate-700 bg-slate-800 p-6 text-center">
            <QrCode className="mx-auto text-slate-500" size={96} />
            <p className="mt-4 text-sm text-slate-400">QR Code em breve</p>
          </div>
          <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-4 font-black text-slate-950 hover:bg-cyan-400">
            Configurar doação <ArrowUpRight size={20} />
          </button>
        </div>
      </section>

      {showModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <form
            onSubmit={handleCreateDonation}
            className="w-full max-w-2xl rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">Nova doação</h2>
                <p className="text-sm text-slate-400">Registre uma contribuição no banco.</p>
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
              <input
                type="number"
                min="1"
                step="0.01"
                placeholder="Valor da doação"
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
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
              <input
                placeholder="Nome do doador"
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
                value={form.donorName}
                onChange={(e) => setForm({ ...form, donorName: e.target.value })}
              />
              <input
                type="email"
                placeholder="E-mail do doador"
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
                value={form.donorEmail}
                onChange={(e) => setForm({ ...form, donorEmail: e.target.value })}
              />
              <input
                placeholder="CPF do doador"
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
                value={form.donorCpf}
                onChange={(e) => setForm({ ...form, donorCpf: e.target.value })}
              />
              <select
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="CONFIRMED">Confirmada</option>
                <option value="PENDING">Pendente</option>
                <option value="CANCELLED">Cancelada</option>
                <option value="REFUNDED">Reembolsada</option>
              </select>
              <textarea
                placeholder="Mensagem"
                className="min-h-28 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400 md:col-span-2"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-6 w-full rounded-2xl bg-cyan-500 px-5 py-3 font-black text-slate-950 hover:bg-cyan-400 disabled:opacity-60"
            >
              {saving ? "Salvando..." : "Cadastrar doação"}
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}