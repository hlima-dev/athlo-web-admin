import { useEffect, useState } from "react";
import {
  Bell,
  CheckCircle2,
  CalendarDays,
  HeartHandshake,
  Users,
  AlertCircle,
  Clock3,
  Filter,
  MailCheck,
} from "lucide-react";

import {
  getMyNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  type NotificationItem,
} from "../services/notifications";

export function Notifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  async function loadNotifications() {
    try {
      setLoading(true);

      const response = await getMyNotifications();
      const unreadResponse = await getUnreadCount();

      const list =
        response?.data?.data ||
        response?.data?.items ||
        response?.data ||
        response?.items ||
        response ||
        [];

      const count =
        unreadResponse?.data?.count ||
        unreadResponse?.count ||
        0;

      setNotifications(Array.isArray(list) ? list : []);
      setUnreadCount(count);
    } catch (error) {
      console.error("Erro ao carregar notificações:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  async function handleMarkRead(id: string) {
    try {
      await markNotificationAsRead(id);
      await loadNotifications();
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error);
    }
  }

  async function handleMarkAllRead() {
    try {
      await markAllNotificationsAsRead();
      await loadNotifications();
    } catch (error) {
      console.error("Erro ao marcar todas como lidas:", error);
    }
  }

  const alertsCount = notifications.filter(
    (notification) =>
      notification.type === "WARNING" ||
      notification.type === "ERROR"
  ).length;

  const todayCount = notifications.filter((notification) => {
    const created = new Date(notification.createdAt);
    const today = new Date();

    return created.toDateString() === today.toDateString();
  }).length;

  const summary = [
    {
      title: "Notificações",
      value: notifications.length,
      icon: Bell,
      color: "text-cyan-400",
    },
    {
      title: "Não lidas",
      value: unreadCount,
      icon: MailCheck,
      color: "text-yellow-400",
    },
    {
      title: "Alertas",
      value: alertsCount,
      icon: AlertCircle,
      color: "text-red-400",
    },
    {
      title: "Hoje",
      value: todayCount,
      icon: Clock3,
      color: "text-emerald-400",
    },
  ];

  function formatType(type: string) {
    const typeMap: Record<string, string> = {
      INFO: "Informação",
      WARNING: "Alerta",
      SUCCESS: "Sucesso",
      ERROR: "Erro",
      EVENT_REMINDER: "Evento",
      TRAINING_ASSIGNED: "Treino",
      DONATION_RECEIVED: "Doação",
      ACHIEVEMENT_UNLOCKED: "Conquista",
      SYSTEM: "Sistema",
    };

    return typeMap[type] || type;
  }

  function getIcon(type: string) {
    if (type === "DONATION_RECEIVED") return HeartHandshake;
    if (type === "EVENT_REMINDER") return CalendarDays;
    if (type === "TRAINING_ASSIGNED") return Users;
    if (type === "WARNING" || type === "ERROR") return AlertCircle;
    if (type === "SUCCESS" || type === "ACHIEVEMENT_UNLOCKED") {
      return CheckCircle2;
    }

    return Bell;
  }

  function getColor(type: string) {
    const colorMap: Record<string, string> = {
      INFO: "text-cyan-400",
      WARNING: "text-yellow-400",
      SUCCESS: "text-emerald-400",
      ERROR: "text-red-400",
      EVENT_REMINDER: "text-cyan-400",
      TRAINING_ASSIGNED: "text-purple-400",
      DONATION_RECEIVED: "text-emerald-400",
      ACHIEVEMENT_UNLOCKED: "text-yellow-400",
      SYSTEM: "text-slate-400",
    };

    return colorMap[type] || "text-cyan-400";
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] bg-gradient-to-br from-cyan-500 via-blue-600 to-slate-900 p-6 shadow-2xl md:p-10">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white">
          <Bell size={16} />
          Central de notificações
        </span>

        <h1 className="mt-6 text-3xl font-black text-white md:text-5xl">
          Acompanhe tudo que acontece na plataforma.
        </h1>

        <p className="mt-4 max-w-2xl text-white/80 md:text-lg">
          Receba alertas sobre doações, eventos, atletas, campanhas, metas e
          atividades importantes da ASDA.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-4">
        {summary.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-3xl border border-slate-800 bg-slate-900 p-6"
            >
              <Icon className={item.color} />
              <p className="mt-5 text-sm text-slate-400">{item.title}</p>
              <h2 className="mt-2 text-3xl font-black">{item.value}</h2>
            </div>
          );
        })}
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-black text-white">
              Atividades recentes
            </h2>

            <p className="text-sm text-slate-400">
              Histórico de avisos e atualizações da plataforma.
            </p>
          </div>

          <button
            type="button"
            onClick={handleMarkAllRead}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-800 px-5 py-3 font-black text-slate-300 hover:bg-slate-700"
          >
            <Filter size={20} />
            Marcar todas como lidas
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {loading ? (
            <p className="text-slate-400">Carregando notificações...</p>
          ) : notifications.length === 0 ? (
            <p className="text-slate-400">Nenhuma notificação encontrada.</p>
          ) : (
            notifications.map((notification) => {
              const Icon = getIcon(notification.type);
              const isUnread = !notification.readAt;

              return (
                <div
                  key={notification.id}
                  className={`rounded-3xl border p-5 ${
                    isUnread
                      ? "border-cyan-500/40 bg-slate-800"
                      : "border-slate-800 bg-slate-800/70"
                  }`}
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                    <div className="flex gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-900">
                        <Icon className={getColor(notification.type)} size={26} />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-black text-white">
                            {notification.title}
                          </h3>

                          <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-400">
                            {formatType(notification.type)}
                          </span>

                          {isUnread && (
                            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
                              Nova
                            </span>
                          )}
                        </div>

                        <p className="mt-2 leading-relaxed text-slate-400">
                          {notification.body}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-start gap-2 md:items-end">
                      <span className="text-sm font-semibold text-slate-500">
                        {formatDate(notification.createdAt)}
                      </span>

                      {isUnread && (
                        <button
                          type="button"
                          onClick={() => handleMarkRead(notification.id)}
                          className="rounded-xl bg-cyan-500 px-3 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400"
                        >
                          Marcar como lida
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}