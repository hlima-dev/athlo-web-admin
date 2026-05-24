import { useState } from "react";
import { api } from "../services/api";
import { useDonations } from "../hooks/useDonations";

function formatMethod(method: string) {
  const methods: Record<string, string> = {
    PIX: "PIX",
    CREDIT_CARD: "Cartão",
    BANK_TRANSFER: "Transferência",
    BOLETO: "Boleto",
    CASH: "Dinheiro",
    OTHER: "Outro",
  };

  return methods[method] || method;
}

export function Donations() {
  const { data: donations = [], isLoading, refetch } = useDonations();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("PIX");
  const [message, setMessage] = useState("");

  const total = donations.reduce(
    (sum, donation) => sum + Number(donation.amount || 0),
    0
  );

  async function handleCreateDonation(e: React.FormEvent) {
    e.preventDefault();

    try {
      await api.post("/donations", {
        donorName,
        donorEmail,
        amount: Number(amount),
        method,
        status: "CONFIRMED",
        message,
      });

      alert("Doação cadastrada com sucesso!");

      setIsModalOpen(false);
      setDonorName("");
      setDonorEmail("");
      setAmount("");
      setMethod("PIX");
      setMessage("");

      refetch();
    } catch (error: any) {
      console.log("ERRO AO CRIAR DOAÇÃO:", error.response?.data || error);

      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Erro ao cadastrar doação"
      );
    }
  }

  return (
    <div className="fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10">
        <div>
          <h1 className="text-4xl font-black">Doações</h1>

          <p className="text-white/60 mt-2">
            Gestão de apoiadores, arrecadações e impacto social da ASDA.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-cyan-400 hover:bg-cyan-300 transition text-[#07111f] font-bold px-6 py-4 rounded-2xl"
        >
          + Nova doação
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="glass-card glow-cyan rounded-3xl p-6">
          <p className="text-white/50">Total arrecadado</p>

          <h2 className="text-4xl font-black text-cyan-400 mt-3">
            R$ {total.toLocaleString("pt-BR")}
          </h2>
        </div>

        <div className="glass-card rounded-3xl p-6">
          <p className="text-white/50">Apoiadores</p>

          <h2 className="text-4xl font-black text-green-400 mt-3">
            {donations.length}
          </h2>
        </div>

        <div className="glass-card rounded-3xl p-6">
          <p className="text-white/50">Meta mensal</p>

          <h2 className="text-4xl font-black text-yellow-400 mt-3">
            72%
          </h2>
        </div>
      </div>

      {isLoading && (
        <div className="glass-card rounded-3xl p-8 text-white/60">
          Carregando doações...
        </div>
      )}

      {!isLoading && donations.length === 0 && (
        <div className="glass-card rounded-3xl p-8 text-white/60">
          Nenhuma doação cadastrada ainda.
        </div>
      )}

      {!isLoading && donations.length > 0 && (
        <div className="glass-card rounded-3xl overflow-hidden">
          <div className="grid grid-cols-4 p-5 border-b border-white/5 text-white/50 font-semibold">
            <span>Doador</span>
            <span>Método</span>
            <span>Data</span>
            <span>Valor</span>
          </div>

          {donations.map((donation) => (
            <div
              key={donation.id}
              className="grid grid-cols-4 p-5 border-b border-white/5 items-center hover:bg-white/[0.02] transition"
            >
              <span className="font-semibold">
                {donation.donorName || "Doador anônimo"}
              </span>

              <span className="text-cyan-400">
                {formatMethod(donation.method)}
              </span>

              <span className="text-white/60">
                {new Date(donation.createdAt).toLocaleDateString("pt-BR")}
              </span>

              <span className="text-green-400 font-bold">
                R$ {Number(donation.amount).toLocaleString("pt-BR")}
              </span>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="w-full max-w-xl glass-card rounded-3xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black">Nova Doação</h2>

              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/50 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDonation} className="space-y-5">
              <input
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="Nome do doador"
                className="w-full bg-[#0B1020] border border-white/10 rounded-2xl p-4 outline-none focus:border-cyan-400"
              />

              <input
                type="email"
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
                placeholder="E-mail do doador"
                className="w-full bg-[#0B1020] border border-white/10 rounded-2xl p-4 outline-none focus:border-cyan-400"
              />

              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Valor da doação"
                className="w-full bg-[#0B1020] border border-white/10 rounded-2xl p-4 outline-none focus:border-cyan-400"
                required
              />

              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full bg-[#0B1020] border border-white/10 rounded-2xl p-4 outline-none focus:border-cyan-400"
              >
                <option value="PIX">PIX</option>
                <option value="CREDIT_CARD">Cartão</option>
                <option value="BANK_TRANSFER">Transferência</option>
                <option value="BOLETO">Boleto</option>
                <option value="CASH">Dinheiro</option>
                <option value="OTHER">Outro</option>
              </select>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Mensagem opcional"
                className="w-full bg-[#0B1020] border border-white/10 rounded-2xl p-4 outline-none focus:border-cyan-400 min-h-28"
              />

              <button
                type="submit"
                className="w-full bg-cyan-400 hover:bg-cyan-300 transition text-[#07111f] font-black py-4 rounded-2xl"
              >
                Cadastrar Doação
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}