export type PeriodKey = "TODAY" | "TOMORROW" | "WEEK" | "ALL";

export const periodOptions: { key: PeriodKey; label: string }[] = [
  { key: "TODAY", label: "Hoje" },
  { key: "TOMORROW", label: "Amanhã" },
  { key: "WEEK", label: "Esta semana" },
  { key: "ALL", label: "Todos" },
];

export function getPeriodRange(period: PeriodKey): { from?: string; to?: string } {
  const now = new Date();
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
  const endOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);

  if (period === "TODAY") {
    return { from: startOfDay(now).toISOString(), to: endOfDay(now).toISOString() };
  }

  if (period === "TOMORROW") {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return { from: startOfDay(tomorrow).toISOString(), to: endOfDay(tomorrow).toISOString() };
  }

  if (period === "WEEK") {
    const end = new Date(now);
    end.setDate(end.getDate() + 7);
    return { from: startOfDay(now).toISOString(), to: endOfDay(end).toISOString() };
  }

  return {};
}
