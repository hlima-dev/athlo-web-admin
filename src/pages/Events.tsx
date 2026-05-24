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
  const { data: events = [], isLoading, refetch } = useEvents();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("TRAINING_SESSION");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  async function handleCreateEvent(e: React.FormEvent) {
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
      console.log("ERRO AO CRIAR EVENTO:", error.response?.data || error);

      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Erro ao criar evento"
      );
    }
  }

  return (
    <div className="fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10">
        <div>
          <h1 className="text-4xl font-black">Eventos</h1>

          <p className="text-white/60 mt-2">
            Gestão completa de eventos, treinos e atividades da ASDA.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-cyan-400 hover:bg-cyan-300 transition text-[#07111f] font-bold px-6 py-4 rounded-2xl"
        >
          + Novo Evento
        </button>
      </div>

      {isLoading && (
        <div className="glass-card rounded-3xl p-8 text-white/60">
          Carregando eventos...
        </div>
      )}

      {!isLoading && events.length === 0 && (
        <div className="glass-card rounded-3xl p-8 text-white/60">
          Nenhum evento cadastrado ainda.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="glass-card rounded-3xl p-6 hover:border-cyan-400/30 transition"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="bg-cyan-400/10 text-cyan-400 px-4 py-2 rounded-xl text-sm">
                {formatType(event.type)}
              </span>

              <span className="text-green-400 text-sm">
                {formatStatus(event.status)}
              </span>
            </div>

            <h2 className="text-2xl font-bold mb-3">{event.title}</h2>

            <div className="space-y-2 text-white/60">
              <p>
                📅{" "}
                {new Date(event.startDate).toLocaleDateString("pt-BR")}
              </p>

              <p>
                ⏰{" "}
                {new Date(event.startDate).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>

              <p>📍 {event.location || "Local não informado"}</p>
            </div>

            <button className="w-full mt-8 bg-white/5 hover:bg-white/10 transition border border-white/10 rounded-2xl py-3">
              Ver detalhes
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="w-full max-w-xl glass-card rounded-3xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black">Novo Evento</h2>

              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/50 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-5">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nome do evento"
                className="w-full bg-[#0B1020] border border-white/10 rounded-2xl p-4 outline-none focus:border-cyan-400"
                required
              />

              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-[#0B1020] border border-white/10 rounded-2xl p-4 outline-none focus:border-cyan-400"
              >
                <option value="TRAINING_SESSION">Treino</option>
                <option value="COMPETITION">Competição</option>
                <option value="WORKSHOP">Workshop</option>
                <option value="MEDICAL_EVALUATION">Avaliação médica</option>
                <option value="FUNDRAISING">Arrecadação</option>
                <option value="COMMUNITY">Comunidade</option>
                <option value="OTHER">Outro</option>
              </select>

              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Local do evento"
                className="w-full bg-[#0B1020] border border-white/10 rounded-2xl p-4 outline-none focus:border-cyan-400"
                required
              />

              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-[#0B1020] border border-white/10 rounded-2xl p-4 outline-none focus:border-cyan-400"
                required
              />

              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-[#0B1020] border border-white/10 rounded-2xl p-4 outline-none focus:border-cyan-400"
                required
              />

              <button
                type="submit"
                className="w-full bg-cyan-400 hover:bg-cyan-300 transition text-[#07111f] font-black py-4 rounded-2xl"
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