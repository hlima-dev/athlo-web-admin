import { useEffect, useState } from "react"
import {
  HandHeart, Users, Search, Plus, CalendarDays,
  Clock3, MapPin, CheckCircle2, MoreHorizontal, HeartHandshake,
} from "lucide-react"
import { api } from "../services/api"

interface Volunteer {
  id: string
  name: string
  email: string
  phone?: string
  status: string
  createdAt: string
  avatar?: string
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
}

export function Volunteers() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    api.get("/auth/me").catch(() => {})
    api.get("/athletes")
      .then(() => {})
      .catch(() => {})

    api.get("/dashboard")
      .then((res) => {
        const users = res.data?.data?.users ?? 0
        setVolunteers([])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = volunteers.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] bg-gradient-to-br from-cyan-500 via-blue-600 to-slate-900 p-6 shadow-2xl md:p-10">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white">
          <HandHeart size={16} />
          Gestão de voluntários
        </span>
        <h1 className="mt-6 text-3xl font-black text-white md:text-5xl">
          Conecte pessoas ao impacto social da ASDA.
        </h1>
        <p className="mt-4 max-w-2xl text-white/80 md:text-lg">
          Organize equipes, acompanhe participação em eventos e fortaleça a comunidade de apoio da organização.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-4">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <Users className="text-cyan-400" />
          <p className="mt-5 text-sm text-slate-400">Voluntários cadastrados</p>
          <h2 className="mt-2 text-3xl font-black">{loading ? "..." : volunteers.length}</h2>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <Clock3 className="text-emerald-400" />
          <p className="mt-5 text-sm text-slate-400">Em desenvolvimento</p>
          <h2 className="mt-2 text-3xl font-black">—</h2>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <CalendarDays className="text-yellow-400" />
          <p className="mt-5 text-sm text-slate-400">Em desenvolvimento</p>
          <h2 className="mt-2 text-3xl font-black">—</h2>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <HeartHandshake className="text-purple-400" />
          <p className="mt-5 text-sm text-slate-400">Em desenvolvimento</p>
          <h2 className="mt-2 text-3xl font-black">—</h2>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-black text-white">Equipe voluntária</h2>
            <p className="text-sm text-slate-400">Gerencie participantes e colaboradores da ONG.</p>
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 font-black text-slate-950 hover:bg-cyan-400">
            <Plus size={20} />
            Novo voluntário
          </button>
        </div>

        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-800 px-4">
          <Search className="text-slate-500" size={20} />
          <input
            placeholder="Buscar voluntário..."
            className="w-full bg-transparent py-4 text-white outline-none placeholder:text-slate-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="mt-6">
          {loading ? (
            <p className="text-slate-400">Carregando...</p>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-800 p-10 text-center">
              <HandHeart className="mx-auto text-slate-500" size={40} />
              <p className="mt-4 text-slate-400">Nenhum voluntário cadastrado ainda.</p>
              <p className="mt-2 text-sm text-slate-500">
                Voluntários são usuários cadastrados com a função "Voluntário" no sistema.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {filtered.map((volunteer) => (
                <div key={volunteer.id} className="rounded-3xl border border-slate-800 bg-slate-800 p-5">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-500/10 text-xl font-black text-cyan-400">
                        {getInitials(volunteer.name)}
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-white">{volunteer.name}</h3>
                        <p className="text-sm text-slate-400">{volunteer.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:items-center">
                      <div>
                        <p className="text-xs text-slate-500">Status</p>
                        <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-bold text-emerald-400">
                          <CheckCircle2 size={14} />
                          {volunteer.status === "ACTIVE" ? "Ativo" : volunteer.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Cadastro</p>
                        <p className="mt-1 text-sm text-white">
                          {new Date(volunteer.createdAt).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <button className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-700 text-slate-300 hover:bg-slate-600">
                        <MoreHorizontal />
                      </button>
                    </div>
                  </div>
                  <div className="mt-5 grid grid-cols-1 gap-3 border-t border-slate-700 pt-5 text-sm text-slate-400 md:grid-cols-2">
                    <p className="flex items-center gap-2"><MapPin size={16} />Localização não informada</p>
                    <p className="flex items-center gap-2"><CalendarDays size={16} />Participação ativa em eventos</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
