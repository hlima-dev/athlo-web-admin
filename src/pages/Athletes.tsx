import { useState } from "react";
import { Plus, Search } from "lucide-react";

import { useAthletes } from "../hooks/useAthletes";
import { CreateAthleteModal } from "../components/CreateAthleteModal";

function formatSport(sport?: string) {
  const sports: Record<string, string> = {
    FOOTBALL_5_SIDE: "Futebol de 5",
    ATHLETICS: "Atletismo",
    SWIMMING: "Natação",
    WHEELCHAIR_BASKETBALL: "Basquete em cadeira de rodas",
    SITTING_VOLLEYBALL: "Vôlei sentado",
    CYCLING: "Ciclismo",
    POWERLIFTING: "Levantamento de peso",
    TABLE_TENNIS: "Tênis de mesa",
    OTHER: "Outro",
  };

  return sports[sport || ""] || "Não informado";
}

function formatStatus(status?: string) {
  const statusMap: Record<string, string> = {
    ACTIVE: "Ativo",
    INACTIVE: "Inativo",
    RECOVERING: "Em recuperação",
    RETIRED: "Aposentado",
  };

  return statusMap[status || ""] || "Ativo";
}

export function Athletes() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: athletes = [], isLoading } = useAthletes();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold">Atletas</h1>
          <p className="text-white/60 mt-1">
            Cadastro e acompanhamento dos atletas da ASDA.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-cyan-500 text-[#07111f] px-5 py-3 rounded-xl font-semibold hover:bg-cyan-400 transition"
        >
          <Plus size={20} />
          Novo Atleta
        </button>
      </div>

      <div className="bg-[#111827] rounded-2xl border border-white/5 p-5 mb-6">
        <div className="flex items-center gap-3 bg-[#0B1020] border border-white/10 rounded-xl px-4 py-3">
          <Search size={18} className="text-white/40" />
          <input
            className="bg-transparent outline-none w-full text-white placeholder:text-white/40"
            placeholder="Buscar atleta por nome, modalidade ou status..."
          />
        </div>
      </div>

      <div className="bg-[#111827] rounded-2xl border border-white/5 overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#1F2937] text-white/70">
            <tr>
              <th className="text-left p-5">Atleta</th>
              <th className="text-left p-5">E-mail</th>
              <th className="text-left p-5">Modalidade</th>
              <th className="text-left p-5">Status</th>
            </tr>
          </thead>

          <tbody>
            {isLoading && (
              <tr>
                <td className="p-5 text-white/60" colSpan={4}>
                  Carregando atletas...
                </td>
              </tr>
            )}

            {!isLoading && athletes.length === 0 && (
              <tr>
                <td className="p-5 text-white/60" colSpan={4}>
                  Nenhum atleta cadastrado ainda.
                </td>
              </tr>
            )}

            {athletes.map((athlete) => (
              <tr key={athlete.id} className="border-t border-white/5">
                <td className="p-5 font-semibold">
                  {athlete.user?.name || athlete.name || "Sem nome"}
                </td>

                <td className="p-5 text-white/60">
                  {athlete.user?.email || "Não informado"}
                </td>

                <td className="p-5 text-white/70">
                  {formatSport(athlete.sport || athlete.modality)}
                </td>

                <td className="p-5">
                  <span className="bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full text-sm">
                    {formatStatus(athlete.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <CreateAthleteModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}