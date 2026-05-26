import { useState } from "react";
import { api } from "../services/api";
import { useEvents } from "../hooks/useEvents";

function formatType(type: string) {
  const types: Record<string, string> = {
    COMPETITION: "Competição",
    TRAINING_SESSION: "Treino",
    WORKSHOP: "Workshop",
    MEDICAL_EVALUATION: "Avaliação médica",
    FUNDRAISING: "Arrecadação",
    COMMUNITY: "Comunidade",
    OTHER: "Outro",
  };

  return types[type] || type;
}

function formatStatus(status: string) {
  const statusMap: Record<string, string> = {
    DRAFT: "Rascunho",
    PUBLISHED: "Publicado",
    ONGOING: "Em andamento",
    FINISHED: "Finalizado",
    CANCELLED: "Cancelado",
  };

  return statusMap[status] || status;
}

export function Events() {
  const {
    data: events = [],
    isLoading,
    refetch,
  } = useEvents();

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [title, setTitle] = useState("");
  const [type, setType] =
    useState("TRAINING_SESSION");
  const [location, setLocation] =
    useState("");
  const [startDate, setStartDate] =
    useState("");
  const [endDate, setEndDate] =
    useState("");

  async function handleCreateEvent(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      await api.post("/events", {
        title,
        type,
        status: "PUBLISHED",
        location,
        city: "Sorocaba",
        state: "SP",
        startDate,
        endDate,
        isPublic: true,
      });

      alert("Evento criado com sucesso!");

      setIsModalOpen(false);

      setTitle("");
      setLocation("");
      setStartDate("");
      setEndDate("");

      refetch();
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          "Erro ao criar evento"
      );
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div>
          <h1 className="text-5xl font-black text-[#071B3A]">
            Eventos
          </h1>

          <p className="text-slate-500 mt-3 text-lg">
            Gestão completa de eventos, treinos e
            atividades da ASDA.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-cyan-600 hover:bg-cyan-500 transition text-white font-black px-6 py-4 rounded-2xl shadow-lg shadow-cyan-600/20"
        >
          + Novo Evento
        </button>
      </div>

      {isLoading && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-slate-500 shadow-sm">
          Carregando eventos...
        </div>
      )}

      {!isLoading && events.length === 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-slate-500 shadow-sm">
          Nenhum evento cadastrado ainda.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="bg-cyan-50 text-cyan-600 px-4 py-2 rounded-xl text-sm font-bold">
                {formatType(event.type)}
              </span>

              <span className="text-green-500 text-sm font-bold">
                {formatStatus(event.status)}
              </span>
            </div>

            <h2 className="text-2xl font-black text-[#071B3A] mb-4">
              {event.title}
            </h2>

            <div className="space-y-3 text-slate-500">
              <p>
                📅{" "}
                {new Date(
                  event.startDate
                ).toLocaleDateString("pt-BR")}
              </p>

              <p>
                ⏰{" "}
                {new Date(
                  event.startDate
                ).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>

              <p>
                📍{" "}
                {event.location ||
                  "Local não informado"}
              </p>
            </div>

            <button className="w-full mt-8 bg-slate-100 hover:bg-slate-200 transition rounded-2xl py-3 font-bold text-slate-700">
              Ver detalhes
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5">
          <div className="w-full max-w-xl bg-white rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black text-[#071B3A]">
                Novo Evento
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
              onSubmit={handleCreateEvent}
              className="space-y-5"
            >
              <input
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="Nome do evento"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-cyan-500"
                required
              />

              <select
                value={type}
                onChange={(e) =>
                  setType(e.target.value)
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-cyan-500"
              >
                <option value="TRAINING_SESSION">
                  Treino
                </option>

                <option value="COMPETITION">
                  Competição
                </option>

                <option value="WORKSHOP">
                  Workshop
                </option>

                <option value="MEDICAL_EVALUATION">
                  Avaliação médica
                </option>

                <option value="FUNDRAISING">
                  Arrecadação
                </option>

                <option value="COMMUNITY">
                  Comunidade
                </option>

                <option value="OTHER">
                  Outro
                </option>
              </select>

              <input
                value={location}
                onChange={(e) =>
                  setLocation(e.target.value)
                }
                placeholder="Local do evento"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-cyan-500"
                required
              />

              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) =>
                  setStartDate(e.target.value)
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-cyan-500"
                required
              />

              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) =>
                  setEndDate(e.target.value)
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-cyan-500"
                required
              />

              <button
                type="submit"
                className="w-full bg-cyan-600 hover:bg-cyan-500 transition text-white font-black py-4 rounded-2xl"
              >
                Criar Evento
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}