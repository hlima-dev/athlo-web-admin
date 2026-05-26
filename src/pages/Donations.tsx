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
  const {
    data: donations = [],
    isLoading,
    refetch,
  } = useDonations();

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [donorName, setDonorName] =
    useState("");

  const [donorEmail, setDonorEmail] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [method, setMethod] =
    useState("PIX");

  const [message, setMessage] =
    useState("");

  const total = donations.reduce(
    (sum, donation) =>
      sum + Number(donation.amount || 0),
    0
  );

  async function handleCreateDonation(
    e: React.FormEvent
  ) {
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
      alert(
        error.response?.data?.message ||
          "Erro ao cadastrar doação"
      );
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div>
          <h1 className="text-5xl font-black text-[#071B3A]">
            Doações
          </h1>

          <p className="text-slate-500 mt-3 text-lg">
            Gestão de apoiadores, arrecadações e
            impacto social da ASDA.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-cyan-600 hover:bg-cyan-500 transition text-white font-black px-6 py-4 rounded-2xl shadow-lg shadow-cyan-600/20"
        >
          + Nova doação
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <p className="text-slate-500">
            Total arrecadado
          </p>

          <h2 className="text-4xl font-black text-cyan-600 mt-3">
            R${" "}
            {total.toLocaleString("pt-BR")}
          </h2>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <p className="text-slate-500">
            Apoiadores
          </p>

          <h2 className="text-4xl font-black text-green-500 mt-3">
            {donations.length}
          </h2>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <p className="text-slate-500">
            Meta mensal
          </p>

          <h2 className="text-4xl font-black text-yellow-500 mt-3">
            72%
          </h2>
        </div>
      </div>

      {isLoading && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-slate-500 shadow-sm">
          Carregando doações...
        </div>
      )}

      {!isLoading &&
        donations.length === 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-slate-500 shadow-sm">
            Nenhuma doação cadastrada ainda.
          </div>
        )}

      {!isLoading &&
        donations.length > 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <div className="min-w-[700px]">
                <div className="grid grid-cols-4 p-5 bg-slate-100 text-slate-600 font-bold">
                  <span>Doador</span>
                  <span>Método</span>
                  <span>Data</span>
                  <span>Valor</span>
                </div>

                {donations.map((donation) => (
                  <div
                    key={donation.id}
                    className="grid grid-cols-4 p-5 border-t border-slate-100 items-center hover:bg-slate-50 transition"
                  >
                    <span className="font-bold text-[#071B3A]">
                      {donation.donorName ||
                        "Doador anônimo"}
                    </span>

                    <span className="text-cyan-600 font-semibold">
                      {formatMethod(
                        donation.method
                      )}
                    </span>

                    <span className="text-slate-500">
                      {new Date(
                        donation.createdAt
                      ).toLocaleDateString(
                        "pt-BR"
                      )}
                    </span>

                    <span className="text-green-500 font-black">
                      R${" "}
                      {Number(
                        donation.amount
                      ).toLocaleString(
                        "pt-BR"
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5">
          <div className="w-full max-w-xl bg-white rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black text-[#071B3A]">
                Nova Doação
              </h2>

              <button
                onClick={() =>
                  setIsModalOpen(false)
                }
                className="text-slate-400 hover:text-slate-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleCreateDonation}
              className="space-y-5"
            >
              <input
                value={donorName}
                onChange={(e) =>
                  setDonorName(e.target.value)
                }
                placeholder="Nome do doador"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-cyan-500"
              />

              <input
                type="email"
                value={donorEmail}
                onChange={(e) =>
                  setDonorEmail(
                    e.target.value
                  )
                }
                placeholder="E-mail do doador"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-cyan-500"
              />

              <input
                type="number"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value)
                }
                placeholder="Valor da doação"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-cyan-500"
                required
              />

              <select
                value={method}
                onChange={(e) =>
                  setMethod(e.target.value)
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-cyan-500"
              >
                <option value="PIX">PIX</option>

                <option value="CREDIT_CARD">
                  Cartão
                </option>

                <option value="BANK_TRANSFER">
                  Transferência
                </option>

                <option value="BOLETO">
                  Boleto
                </option>

                <option value="CASH">
                  Dinheiro
                </option>

                <option value="OTHER">
                  Outro
                </option>
              </select>

              <textarea
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                placeholder="Mensagem opcional"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-cyan-500 min-h-28"
              />

              <button
                type="submit"
                className="w-full bg-cyan-600 hover:bg-cyan-500 transition text-white font-black py-4 rounded-2xl"
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