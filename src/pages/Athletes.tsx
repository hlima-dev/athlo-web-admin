import { useState } from "react";
import { Plus, Search } from "lucide-react";

import { useAthletes } from "../hooks/useAthletes";
import { CreateAthleteModal } from "../components/CreateAthleteModal";

function formatSport(sport?: string) {
  const sports: Record<string, string> = {
    FOOTBALL_5_SIDE: "Futebol de 5",
    ATHLETICS: "Atletismo",
    SWIMMING: "Natação",
    WHEELCHAIR_BASKETBALL:
      "Basquete em cadeira de rodas",
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
  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const {
    data: athletes = [],
    isLoading,
  } = useAthletes();

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div>
          <h1 className="text-5xl font-black text-[#071B3A]">
            Atletas
          </h1>

          <p className="text-slate-500 mt-3 text-lg">
            Cadastro e acompanhamento dos atletas
            da ASDA.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-4 rounded-2xl font-black transition shadow-lg shadow-cyan-600/20"
        >
          <Plus size={20} />
          Novo Atleta
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4">
          <Search
            size={18}
            className="text-slate-400"
          />

          <input
            className="bg-transparent outline-none w-full text-slate-700 placeholder:text-slate-400"
            placeholder="Buscar atleta por nome, modalidade ou status..."
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="text-left p-5 font-black">
                  Atleta
                </th>

                <th className="text-left p-5 font-black">
                  E-mail
                </th>

                <th className="text-left p-5 font-black">
                  Modalidade
                </th>

                <th className="text-left p-5 font-black">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {isLoading && (
                <tr>
                  <td
                    className="p-5 text-slate-500"
                    colSpan={4}
                  >
                    Carregando atletas...
                  </td>
                </tr>
              )}

              {!isLoading &&
                athletes.length === 0 && (
                  <tr>
                    <td
                      className="p-5 text-slate-500"
                      colSpan={4}
                    >
                      Nenhum atleta cadastrado ainda.
                    </td>
                  </tr>
                )}

              {athletes.map((athlete) => (
                <tr
                  key={athlete.id}
                  className="border-t border-slate-100 hover:bg-slate-50 transition"
                >
                  <td className="p-5 font-bold text-[#071B3A]">
                    {athlete.user?.name ||
                      athlete.name ||
                      "Sem nome"}
                  </td>

                  <td className="p-5 text-slate-500">
                    {athlete.user?.email ||
                      "Não informado"}
                  </td>

                  <td className="p-5 text-slate-600">
                    {formatSport(
                      athlete.sport ||
                        athlete.modality
                    )}
                  </td>

                  <td className="p-5">
                    <span className="bg-cyan-50 text-cyan-600 px-4 py-2 rounded-full text-sm font-bold">
                      {formatStatus(
                        athlete.status
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <CreateAthleteModal
          onClose={() =>
            setIsModalOpen(false)
          }
        />
      )}
    </div>
  );
}