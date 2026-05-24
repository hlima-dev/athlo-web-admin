import { useState } from "react";
import { api } from "../services/api";

interface Props {
  onClose: () => void;
}

export function CreateAthleteModal({ onClose }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [ampLevel, setAmpLevel] = useState("TRANSTIBIAL");
  const [sport, setSport] = useState("FOOTBALL_5_SIDE");
  const [city, setCity] = useState("Sorocaba");
  const [state, setState] = useState("SP");

  async function handleCreateAthlete(e: React.FormEvent) {
    e.preventDefault();

    try {
      await api.post("/athletes", {
        name,
        email,
        password: "Athlete@2024",
        birthDate,
        ampLevel,
        sport,
        city,
        state,
      });

      alert("Atleta criado com sucesso!");
      onClose();
      window.location.reload();
    } catch (error: any) {
      console.log("ERRO AO CRIAR ATLETA:", error.response?.data || error);

      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Erro ao criar atleta"
      );
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="w-full max-w-2xl bg-[#111827] rounded-3xl p-8 border border-white/10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Novo Atleta</h2>

          <button onClick={onClose} className="text-white/50 hover:text-white">
            ✕
          </button>
        </div>

        <form onSubmit={handleCreateAthlete} className="space-y-5">
          <div>
            <label className="block mb-2 text-white/70">Nome</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0B1020] border border-white/10 rounded-xl p-4 outline-none focus:border-cyan-400"
              placeholder="Nome do atleta"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-white/70">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0B1020] border border-white/10 rounded-xl p-4 outline-none focus:border-cyan-400"
              placeholder="email@exemplo.com"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-white/70">Data de nascimento</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full bg-[#0B1020] border border-white/10 rounded-xl p-4 outline-none focus:border-cyan-400"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-white/70">Nível de amputação</label>
            <select
              value={ampLevel}
              onChange={(e) => setAmpLevel(e.target.value)}
              className="w-full bg-[#0B1020] border border-white/10 rounded-xl p-4 outline-none focus:border-cyan-400"
            >
              <option value="TRANSTIBIAL">Abaixo do joelho</option>
              <option value="TRANSFEMORAL">Acima do joelho</option>
              <option value="HIP_DISARTICULATION">Desarticulação do quadril</option>
              <option value="BILATERAL_LOWER">Bilateral inferior</option>
              <option value="TRANSRADIAL">Abaixo do cotovelo</option>
              <option value="TRANSHUMERAL">Acima do cotovelo</option>
              <option value="SHOULDER_DISARTICULATION">Desarticulação do ombro</option>
              <option value="BILATERAL_UPPER">Bilateral superior</option>
              <option value="MULTIPLE">Múltipla</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-white/70">Modalidade</label>
            <select
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              className="w-full bg-[#0B1020] border border-white/10 rounded-xl p-4 outline-none focus:border-cyan-400"
            >
              <option value="FOOTBALL_5_SIDE">Futebol de 5</option>
              <option value="ATHLETICS">Atletismo</option>
              <option value="SWIMMING">Natação</option>
              <option value="WHEELCHAIR_BASKETBALL">Basquete em cadeira de rodas</option>
              <option value="SITTING_VOLLEYBALL">Vôlei sentado</option>
              <option value="CYCLING">Ciclismo</option>
              <option value="POWERLIFTING">Levantamento de peso</option>
              <option value="TABLE_TENNIS">Tênis de mesa</option>
              <option value="OTHER">Outro</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block mb-2 text-white/70">Cidade</label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-[#0B1020] border border-white/10 rounded-xl p-4 outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block mb-2 text-white/70">Estado</label>
              <input
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full bg-[#0B1020] border border-white/10 rounded-xl p-4 outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-400 hover:bg-cyan-300 transition text-[#07111f] font-bold py-4 rounded-xl"
          >
            Cadastrar atleta
          </button>
        </form>
      </div>
    </div>
  );
}