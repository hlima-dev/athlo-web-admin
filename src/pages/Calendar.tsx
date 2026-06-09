import { useEffect, useState } from "react"
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  Users,
} from "lucide-react"
import { getEvents, type Event } from "../services/events"

const MONTHS = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
]

const WEEKDAYS = ["DOM","SEG","TER","QUA","QUI","SEX","SAB"]

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstWeekday(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

export function Calendar() {
  const today = new Date()
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const response = await getEvents()
        const list =
          response?.data?.data ||
          response?.data?.items ||
          response?.data ||
          response?.items ||
          response ||
          []
        setEvents(Array.isArray(list) ? list : [])
      } catch (err) {
        console.error("Erro ao carregar eventos:", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  function prevMonth() {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1) }
    else setCurrentMonth(m => m - 1)
  }

  function nextMonth() {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1) }
    else setCurrentMonth(m => m + 1)
  }

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstWeekday = getFirstWeekday(currentYear, currentMonth)

  function eventsOnDay(day: number) {
    return events.filter((e) => {
      const d = new Date(e.startDate)
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth && d.getDate() === day
    })
  }

  const monthEvents = events.filter((e) => {
    const d = new Date(e.startDate)
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth
  })

  function formatTime(date?: string) {
    if (!date) return "--:--"
    return new Date(date).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  }

  function formatType(type?: string) {
    const map: Record<string, string> = {
      COMPETITION: "Campeonato", TRAINING_SESSION: "Treino",
      WORKSHOP: "Oficina", MEDICAL_EVALUATION: "Avaliação médica",
      FUNDRAISING: "Campanha", COMMUNITY: "Comunidade", OTHER: "Outro",
    }
    return type ? map[type] || type : "Evento"
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] bg-gradient-to-br from-cyan-500 via-blue-600 to-slate-900 p-6 shadow-2xl md:p-10">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white">
          <CalendarDays size={16} />
          Agenda inteligente
        </span>
        <h1 className="mt-6 text-3xl font-black text-white md:text-5xl">
          Organize eventos, treinos e compromissos da ASDA.
        </h1>
        <p className="mt-4 max-w-2xl text-white/80 md:text-lg">
          Visualize rapidamente as atividades do mês com dados reais do banco.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 xl:col-span-2">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-white">
                {MONTHS[currentMonth]} {currentYear}
              </h2>
              <p className="text-sm text-slate-400">Agenda oficial da organização</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={prevMonth} className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700">
                <ChevronLeft />
              </button>
              <button onClick={nextMonth} className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700">
                <ChevronRight />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-3 text-center text-sm font-bold text-slate-400">
            {WEEKDAYS.map((d) => <div key={d}>{d}</div>)}
          </div>

          <div className="mt-4 grid grid-cols-7 gap-3">
            {Array.from({ length: firstWeekday }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[90px]" />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const dayEvents = eventsOnDay(day)
              const hasEvent = dayEvents.length > 0
              const isToday = today.getFullYear() === currentYear && today.getMonth() === currentMonth && today.getDate() === day

              return (
                <div
                  key={day}
                  className={`min-h-[90px] rounded-2xl border p-3 transition ${
                    isToday ? "border-cyan-400 bg-cyan-500/20" :
                    hasEvent ? "border-cyan-500 bg-cyan-500/10" :
                    "border-slate-800 bg-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-bold ${isToday ? "text-cyan-300" : hasEvent ? "text-cyan-400" : "text-slate-300"}`}>
                      {day}
                    </span>
                    {hasEvent && <div className="h-2 w-2 rounded-full bg-cyan-400" />}
                  </div>
                  {hasEvent && (
                    <p className="mt-2 text-xs font-semibold text-white leading-tight">
                      {dayEvents[0].title}
                      {dayEvents.length > 1 && <span className="text-cyan-400"> +{dayEvents.length - 1}</span>}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-black text-white">Eventos do mês</h2>

          <div className="mt-6 space-y-4">
            {loading ? (
              <p className="text-slate-400">Carregando eventos...</p>
            ) : monthEvents.length === 0 ? (
              <p className="text-slate-400">Nenhum evento neste mês.</p>
            ) : (
              monthEvents.map((event) => (
                <div key={event.id} className="rounded-2xl bg-slate-800 p-5">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-sm font-bold text-cyan-400">
                      {formatType(event.type)}
                    </span>
                    <CalendarDays size={18} className="text-cyan-400" />
                  </div>

                  <h3 className="mt-4 text-lg font-black text-white">{event.title}</h3>

                  <div className="mt-4 space-y-3 text-sm text-slate-400">
                    <p className="flex items-center gap-2">
                      <Clock3 size={16} />
                      {formatTime(event.startDate)}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin size={16} />
                      {event.location || event.city || "Local não informado"}
                    </p>
                    <p className="flex items-center gap-2">
                      <Users size={16} />
                      {event._count?.athletes || 0} participantes
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
