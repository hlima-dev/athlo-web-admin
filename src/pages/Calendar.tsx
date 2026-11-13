import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  Plus,
} from "lucide-react"
import { getEvents, type Event } from "../services/events"
import { Badge, Button, Card, CardHeader, EmptyState, PageContainer } from "../components/ui"

const MONTHS = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
]

const WEEKDAYS = ["DOM","SEG","TER","QUA","QUI","SEX","SAB"]

const typeLabels: Record<string, string> = {
  MEETING: "Reunião",
  TASK: "Tarefa",
  DEADLINE: "Prazo",
  OTHER: "Outro",
}

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
        // Calendário mostra o mês inteiro — pede o teto de itens por página
        // (100) em vez do padrão de 20, senão meses com mais compromissos
        // ficam com dias faltando no grid sem nenhum aviso.
        const result = await getEvents({ limit: "100" })
        setEvents(result.items)
      } catch (err) {
        console.error("Erro ao carregar agenda:", err)
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

  return (
    <PageContainer>
      <section className="relative overflow-hidden rounded-card border border-line bg-forest p-6 text-white dark:border-line-dark md:p-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11.5px] font-medium">
          <CalendarDays size={14} />
          Agenda inteligente
        </span>
        <h1 className="mt-5 font-display text-2xl leading-tight md:text-4xl">
          Visualize compromissos da sua empresa.
        </h1>
        <p className="mt-3 max-w-2xl text-[13.5px] text-white/75 md:text-[14.5px]">
          Acompanhe rapidamente as atividades do mês com dados reais do banco.
        </p>

        <Link
          to="/eventos"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-white px-4 py-2.5 text-[13px] font-medium text-forest"
        >
          <Plus size={16} />
          Novo compromisso
        </Link>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title={`${MONTHS[currentMonth]} ${currentYear}`}
            subtitle="Agenda da sua empresa"
            action={
              <div className="flex items-center gap-1.5">
                <Button variant="ghost" size="sm" onClick={prevMonth}>
                  <ChevronLeft size={16} />
                </Button>
                <Button variant="ghost" size="sm" onClick={nextMonth}>
                  <ChevronRight size={16} />
                </Button>
              </div>
            }
          />

          <div className="p-5">
            <div className="grid grid-cols-7 gap-2 text-center text-[11.5px] font-medium text-faint dark:text-faint-dark">
              {WEEKDAYS.map((d) => <div key={d}>{d}</div>)}
            </div>

            <div className="mt-2.5 grid grid-cols-7 gap-2">
              {Array.from({ length: firstWeekday }).map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[76px]" />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                const dayEvents = eventsOnDay(day)
                const hasEvent = dayEvents.length > 0
                const isToday = today.getFullYear() === currentYear && today.getMonth() === currentMonth && today.getDate() === day

                return (
                  <div
                    key={day}
                    className={`min-h-[76px] rounded-md border p-2 transition ${
                      isToday
                        ? "border-forest-600/40 bg-forest-100 dark:border-forest-400/40 dark:bg-forest-900"
                        : hasEvent
                          ? "border-line bg-[#F0EEE8] dark:border-line-dark dark:bg-white/[0.06]"
                          : "border-line bg-surface dark:border-line-dark dark:bg-surface-dark"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[12.5px] font-medium ${
                          isToday ? "text-forest-600 dark:text-forest-400" : ""
                        }`}
                      >
                        {day}
                      </span>
                      {hasEvent && <div className="h-1.5 w-1.5 rounded-full bg-forest-600 dark:bg-forest-400" />}
                    </div>
                    {hasEvent && (
                      <p className="mt-1.5 truncate text-[11px] font-medium leading-tight">
                        {dayEvents[0].title}
                        {dayEvents.length > 1 && (
                          <span className="text-faint dark:text-faint-dark"> +{dayEvents.length - 1}</span>
                        )}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Compromissos do mês" />

          <div className="space-y-3 p-5">
            {loading ? (
              <p className="text-[13px] text-muted dark:text-muted-dark">Carregando agenda...</p>
            ) : monthEvents.length === 0 ? (
              <EmptyState
                icon={<CalendarDays size={20} />}
                title="Nenhum item neste mês"
                description="Compromissos agendados para este mês aparecem aqui."
              />
            ) : (
              monthEvents.map((event) => (
                <div key={event.id} className="rounded-md bg-[#F0EEE8] px-4 py-3 dark:bg-white/[0.06]">
                  <div className="flex items-center justify-between">
                    <Badge tone="neutral">{typeLabels[event.type] || event.type}</Badge>
                    <CalendarDays size={16} className="text-faint dark:text-faint-dark" />
                  </div>

                  <h3 className="mt-3 text-[14px] font-semibold">{event.title}</h3>

                  <div className="mt-2.5 space-y-1.5 text-[12.5px] text-muted dark:text-muted-dark">
                    <p className="flex items-center gap-1.5">
                      <Clock3 size={14} />
                      {formatTime(event.startDate)}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin size={14} />
                      {event.location || (event.isOnline ? "Online" : "Local não informado")}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </section>
    </PageContainer>
  )
}
