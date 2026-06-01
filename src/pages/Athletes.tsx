import { useEffect, useState } from "react";
import {
  Users,
  Search,
  Plus,
  Medal,
  Activity,
  HeartPulse,
  MapPin,
  CalendarDays,
  MoreHorizontal,
} from "lucide-react";

import {
  getAthletes,
  createAthlete,
  type Athlete,
} from "../services/athletes";

export function Athletes() {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "Athlete@2024",
    birthDate: "",
    ampLevel: "TRANSTIBIAL",
    sport: "ATHLETICS",
    city: "",
    state: "SP",
  });

  async function loadAthletes() {
    try {
      setLoading(true);
      const response = await getAthletes();

      const list =
  response?.data?.data ||
  response?.data?.items ||
  response?.data ||
  response?.items ||
  response ||
  [];

      setAthletes(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error("Erro ao carregar atletas:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAthletes();
  }, []);

  async function handleCreateAthlete(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSaving(true);

      await createAthlete({
        name: form.name,
        email: form.email,
        password: form.password,
        birthDate: form.birthDate,
        ampLevel: form.ampLevel,
        sport: form.sport,
        city: form.city,
        state: form.state,
      });

      alert("Atleta cadastrado com sucesso!");
      setShowModal(false);

      setForm({
        name: "",
        email: "",
        password: "Athlete@2024",
        birthDate: "",
        ampLevel: "TRANSTIBIAL",
        sport: "ATHLETICS",
        city: "",
        state: "SP",
      });

      await loadAthletes();
    } catch (error: any) {
      console.error("Erro ao cadastrar atleta:", error);

      alert(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Erro ao cadastrar atleta."
      );
    } finally {
      setSaving(false);
    }
  }

  const activeAthletes = athletes.filter(
    (athlete) => athlete.status === "ACTIVE"
  ).length;

  const recoveringAthletes = athletes.filter(
    (athlete) => athlete.status === "RECOVERING"
  ).length;

  const sportsCount = new Set(
    athletes.map((athlete) => athlete.sport).filter(Boolean)
  ).size;

  function getInitials(name?: string) {
    if (!name) return "AT";

    return name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  function formatStatus(status?: string) {
    const statusMap: Record<string, string> = {
      ACTIVE: "Ativo",
      INACTIVE: "Inativo",
      RECOVERING: "Em recuperação",
      RETIRED: "Aposentado",
    };

    return status ? statusMap[status] || status : "Não informado";
  }

  function formatSport(sport?: string) {
    const sportMap: Record<string, string> = {
      ATHLETICS: "Atletismo",
      SWIMMING: "Natação",
      WHEELCHAIR_BASKETBALL: "Basquete em cadeira",
      SITTING_VOLLEYBALL: "Vôlei sentado",
      CYCLING: "Ciclismo",
      POWERLIFTING: "Levantamento de peso",
      FOOTBALL_5_SIDE: "Futebol de 5",
      TABLE_TENNIS: "Tênis de mesa",
      OTHER: "Outro",
    };

    return sport ? sportMap[sport] || sport : "Não informado";
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] bg-gradient-to-br from-cyan-500 via-blue-600 to-slate-900 p-6 shadow-2xl md:p-10">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white">
          <Users size={16} />
          Gestão de atletas
        </span>

        <h1 className="mt-6 text-3xl font-black text-white md:text-5xl">
          Acompanhe atletas, modalidades e evolução esportiva.
        </h1>

        <p className="mt-4 max-w-2xl text-white/80 md:text-lg">
          Centralize informações dos atletas atendidos pela ASDA, acompanhe
          desempenho, participação e histórico dentro da plataforma.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-4">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <Users className="text-cyan-400" />
          <p className="mt-5 text-sm text-slate-400">Atletas cadastrados</p>
          <h2 className="mt-2 text-3xl font-black">{athletes.length}</h2>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <Activity className="text-emerald-400" />
          <p className="mt-5 text-sm text-slate-400">Ativos no mês</p>
          <h2 className="mt-2 text-3xl font-black">{activeAthletes}</h2>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <Medal className="text-yellow-400" />
          <p className="mt-5 text-sm text-slate-400">Modalidades</p>
          <h2 className="mt-2 text-3xl font-black">{sportsCount}</h2>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <HeartPulse className="text-red-400" />
          <p className="mt-5 text-sm text-slate-400">Em acompanhamento</p>
          <h2 className="mt-2 text-3xl font-black">{recoveringAthletes}</h2>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-black text-white">
              Lista de atletas
            </h2>
            <p className="text-sm text-slate-400">
              Dados carregados diretamente do backend e do Supabase.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 font-black text-slate-950 hover:bg-cyan-400"
          >
            <Plus size={20} />
            Novo atleta
          </button>
        </div>

        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-800 px-4">
          <Search className="text-slate-500" size={20} />
          <input
            placeholder="Buscar atleta..."
            className="w-full bg-transparent py-4 text-white outline-none placeholder:text-slate-500"
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5">
          {loading ? (
            <p className="text-slate-400">Carregando atletas...</p>
          ) : athletes.length === 0 ? (
            <p className="text-slate-400">Nenhum atleta encontrado.</p>
          ) : (
            athletes.map((athlete) => {
              const name = athlete.user?.name || "Atleta sem nome";

              return (
                <div
                  key={athlete.id}
                  className="rounded-3xl border border-slate-800 bg-slate-800 p-5"
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-500/10 text-xl font-black text-cyan-400">
                        {getInitials(name)}
                      </div>

                      <div>
                        <h3 className="text-xl font-black text-white">
                          {name}
                        </h3>
                        <p className="text-sm text-slate-400">
                          {formatSport(athlete.sport)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:items-center">
                      <div>
                        <p className="text-xs text-slate-500">Status</p>
                        <span className="mt-1 inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-bold text-emerald-400">
                          {formatStatus(athlete.status)}
                        </span>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">Estado</p>
                        <p className="mt-1 font-bold text-white">
                          {athlete.state || "N/I"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">Modalidade</p>
                        <p className="mt-1 font-bold text-cyan-400">
                          {formatSport(athlete.sport)}
                        </p>
                      </div>

                      <button className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-700 text-slate-300 hover:bg-slate-600">
                        <MoreHorizontal />
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-3 border-t border-slate-700 pt-5 text-sm text-slate-400 md:grid-cols-2">
                    <p className="flex items-center gap-2">
                      <MapPin size={16} />
                      {athlete.city || "Cidade não informada"}
                    </p>

                    <p className="flex items-center gap-2">
                      <CalendarDays size={16} />
                      Dados sincronizados com o banco
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <form
            onSubmit={handleCreateAthlete}
            className="w-full max-w-2xl rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">Novo atleta</h2>
                <p className="text-sm text-slate-400">
                  Cadastre um atleta no banco de dados.
                </p>
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
                placeholder="Nome completo"
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />

              <input
                type="email"
                placeholder="E-mail"
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />

              <input
                type="password"
                placeholder="Senha padrão"
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
              />

              <input
                type="date"
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
                value={form.birthDate}
                onChange={(e) =>
                  setForm({ ...form, birthDate: e.target.value })
                }
                required
              />

              <select
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
                value={form.ampLevel}
                onChange={(e) =>
                  setForm({ ...form, ampLevel: e.target.value })
                }
              >
                <option value="TRANSTIBIAL">Transtibial</option>
                <option value="TRANSFEMORAL">Transfemoral</option>
                <option value="TRANSRADIAL">Transradial</option>
                <option value="TRANSHUMERAL">Transhumeral</option>
                <option value="BILATERAL_LOWER">Bilateral inferior</option>
                <option value="BILATERAL_UPPER">Bilateral superior</option>
                <option value="MULTIPLE">Múltipla</option>
              </select>

              <select
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
                value={form.sport}
                onChange={(e) => setForm({ ...form, sport: e.target.value })}
              >
                <option value="ATHLETICS">Atletismo</option>
                <option value="SWIMMING">Natação</option>
                <option value="SITTING_VOLLEYBALL">Vôlei sentado</option>
                <option value="CYCLING">Ciclismo</option>
                <option value="POWERLIFTING">Levantamento de peso</option>
                <option value="FOOTBALL_5_SIDE">Futebol de 5</option>
                <option value="TABLE_TENNIS">Tênis de mesa</option>
                <option value="OTHER">Outro</option>
              </select>

              <input
                placeholder="Cidade"
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />

              <input
                placeholder="Estado"
                maxLength={2}
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
                value={form.state}
                onChange={(e) =>
                  setForm({ ...form, state: e.target.value.toUpperCase() })
                }
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-6 w-full rounded-2xl bg-cyan-500 px-5 py-3 font-black text-slate-950 hover:bg-cyan-400 disabled:opacity-60"
            >
              {saving ? "Salvando..." : "Cadastrar atleta"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}