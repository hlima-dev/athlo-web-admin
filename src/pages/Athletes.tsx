import { useState } from "react";

import {
  Plus,
  Search,
  Users,
  Activity,
  Heart,
  Eye,
  Pencil,
} from "lucide-react";

import { motion } from "framer-motion";

import { useAthletes } from "../hooks/useAthletes";

import { CreateAthleteModal } from "../components/CreateAthleteModal";

function formatSport(sport?: string) {
  const sports: Record<string, string> = {
    FOOTBALL_5_SIDE: "Futebol de 5",
    ATHLETICS: "Atletismo",
    SWIMMING: "Natação",
    WHEELCHAIR_BASKETBALL:
      "Basquete cadeira de rodas",
    SITTING_VOLLEYBALL: "Vôlei sentado",
    CYCLING: "Ciclismo",
    POWERLIFTING: "Levantamento",
    TABLE_TENNIS: "Tênis de mesa",
    OTHER: "Outro",
  };

  return sports[sport || ""] || "Não informado";
}

function formatStatus(status?: string) {
  const statusMap: Record<string, string> = {
    ACTIVE: "Ativo",
    INACTIVE: "Inativo",
    RECOVERING: "Recuperação",
    RETIRED: "Aposentado",
  };

  return statusMap[status || ""] || "Ativo";
}

function getStatusColor(status?: string) {
  switch (status) {
    case "ACTIVE":
      return "bg-green-50 text-green-600";

    case "RECOVERING":
      return "bg-yellow-50 text-yellow-600";

    case "INACTIVE":
      return "bg-red-50 text-red-500";

    default:
      return "bg-cyan-50 text-cyan-600";
  }
}

export function Athletes() {
  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const {
    data: athletes = [],
    isLoading,
  } = useAthletes();

  return (
    <div className="relative space-y-8">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-100 blur-3xl opacity-20 rounded-full -z-10" />

      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-[#071B3A]">
            Atletas
          </h1>

          <p className="text-slate-500 mt-3 text-lg">
            Cadastro e acompanhamento dos atletas da
            ASDA.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-3 bg-cyan-600 hover:bg-cyan-500 text-white px-7 py-4 rounded-2xl font-black transition shadow-lg shadow-cyan-600/20"
        >
          <Plus size={20} />
          Novo atleta
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.08)]"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 font-semibold">
                Total de atletas
              </p>

              <h2 className="text-5xl font-black mt-2 text-cyan-600">
                {athletes.length}
              </h2>
            </div>

            <div className="w-20 h-20 rounded-3xl bg-cyan-50 flex items-center justify-center">
              <Users
                size={36}
                className="text-cyan-600"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.08)]"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 font-semibold">
                Em atividade
              </p>

              <h2 className="text-5xl font-black mt-2 text-green-500">
                {
                  athletes.filter(
                    (a) => a.status === "ACTIVE"
                  ).length
                }
              </h2>
            </div>

            <div className="w-20 h-20 rounded-3xl bg-green-50 flex items-center justify-center">
              <Activity
                size={36}
                className="text-green-500"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.08)]"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 font-semibold">
                Em recuperação
              </p>

              <h2 className="text-5xl font-black mt-2 text-yellow-500">
                {
                  athletes.filter(
                    (a) =>
                      a.status === "RECOVERING"
                  ).length
                }
              </h2>
            </div>

            <div className="w-20 h-20 rounded-3xl bg-yellow-50 flex items-center justify-center">
              <Heart
                size={36}
                className="text-yellow-500"
              />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4">
          <Search
            size={18}
            className="text-slate-400"
          />

          <input
            className="bg-transparent outline-none w-full text-slate-700 placeholder:text-slate-400"
            placeholder="Buscar atleta..."
          />
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-slate-100/80 text-slate-600">
              <tr>
                <th className="text-left p-6 font-black">
                  Atleta
                </th>

                <th className="text-left p-6 font-black">
                  E-mail
                </th>

                <th className="text-left p-6 font-black">
                  Modalidade
                </th>

                <th className="text-left p-6 font-black">
                  Status
                </th>

                <th className="text-left p-6 font-black">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody>
              {isLoading && (
                <tr>
                  <td
                    className="p-6 text-slate-500"
                    colSpan={5}
                  >
                    Carregando atletas...
                  </td>
                </tr>
              )}

              {!isLoading &&
                athletes.length === 0 && (
                  <tr>
                    <td
                      className="p-6 text-slate-500"
                      colSpan={5}
                    >
                      Nenhum atleta cadastrado.
                    </td>
                  </tr>
                )}

              {athletes.map((athlete) => (
                <tr
                  key={athlete.id}
                  className="border-t border-slate-100 hover:bg-cyan-50/30 transition"
                >
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-cyan-100 flex items-center justify-center text-cyan-600 font-black text-lg">
                        {(
                          athlete.user?.name ||
                          athlete.name ||
                          "A"
                        )
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>
                        <p className="font-black text-[#071B3A]">
                          {athlete.user?.name ||
                            athlete.name ||
                            "Sem nome"}
                        </p>

                        <span className="text-sm text-slate-400">
                          ID #{athlete.id}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="p-6 text-slate-500">
                    {athlete.user?.email ||
                      "Não informado"}
                  </td>

                  <td className="p-6 text-slate-600 font-semibold">
                    {formatSport(
                      athlete.sport ||
                        athlete.modality
                    )}
                  </td>

                  <td className="p-6">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(
                        athlete.status
                      )}`}
                    >
                      {formatStatus(
                        athlete.status
                      )}
                    </span>
                  </td>

                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <button className="w-11 h-11 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center hover:bg-cyan-100 transition">
                        <Eye size={18} />
                      </button>

                      <button className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition">
                        <Pencil size={18} />
                      </button>
                    </div>
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