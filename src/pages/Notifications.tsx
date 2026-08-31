import { useEffect, useState } from "react";
import {
  Bell,
  CheckCircle2,
  CalendarDays,
  Wallet,
  Users,
  AlertCircle,
  Clock3,
  Filter,
  MailCheck,
  BellRing,
  BellOff,
  Smartphone,
} from "lucide-react";

import {
  getMyNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  type NotificationItem,
} from "../services/notifications";
import {
  isPushSupported,
  isSubscribedOnThisDevice,
  enablePushNotifications,
  disablePushNotifications,
} from "../services/push";
import { PageHeader } from "../components/PageHeader";
import { useToast } from "../components/Toast";

export function Notifications() {
  const toast = useToast();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushBusy, setPushBusy] = useState(false);
  const pushSupported = isPushSupported();

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
    // eslint-disable-next-line react-hooks/set-state-in-effect -- busca inicial ao montar a tela
    loadNotifications();
    if (pushSupported) {
      isSubscribedOnThisDevice().then(setPushEnabled).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleTogglePush() {
    try {
      setPushBusy(true);
      if (pushEnabled) {
        await disablePushNotifications();
        setPushEnabled(false);
        toast.success("Notificações push desativadas neste dispositivo.");
      } else {
        await enablePushNotifications();
        setPushEnabled(true);
        toast.success("Notificações push ativadas neste dispositivo!");
      }
    } catch (err: unknown) {
      // Erro do navegador (ex: permissão de notificação negada) — não é uma
      // resposta da API, por isso não usa getErrorMessage aqui.
      toast.error(err instanceof Error ? err.message : "Não foi possível alterar as notificações push.");
    } finally {
      setPushBusy(false);
    }
  }

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
      EVENT_REMINDER: "Agenda",
      INVOICE_DUE: "Fatura a vencer",
      INVOICE_PAID: "Fatura paga",
      TEAM_INVITE: "Convite de equipe",
      SYSTEM: "Sistema",
    };

    return typeMap[type] || type;
  }

  function getIcon(type: string) {
    if (type === "INVOICE_DUE" || type === "INVOICE_PAID") return Wallet;
    if (type === "EVENT_REMINDER") return CalendarDays;
    if (type === "TEAM_INVITE") return Users;
    if (type === "WARNING" || type === "ERROR") return AlertCircle;
    if (type === "SUCCESS") return CheckCircle2;

    return Bell;
  }

  function getColor(type: string) {
    const colorMap: Record<string, string> = {
      INFO: "text-cyan-400",
      WARNING: "text-yellow-400",
      SUCCESS: "text-emerald-400",
      ERROR: "text-red-400",
      EVENT_REMINDER: "text-cyan-400",
      TEAM_INVITE: "text-purple-400",
      INVOICE_DUE: "text-yellow-400",
      INVOICE_PAID: "text-emerald-400",
      SYSTEM: "text-slate-500 dark:text-slate-400",
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
      <PageHeader
        icon={Bell}
        title="Notificações"
        description="Receba alertas sobre faturas, agenda, equipe e atividades da empresa."
        action={
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-100 dark:bg-slate-800 px-5 py-3 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <Filter size={20} />
            Marcar todas como lidas
          </button>
        }
      />

      <section className="grid grid-cols-1 gap-5 md:grid-cols-4">
        {summary.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm shadow-slate-200/40 dark:shadow-none p-5"
            >
              <Icon className={item.color} size={20} />
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{item.title}</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{item.value}</h2>
            </div>
          );
        })}
      </section>

      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm shadow-slate-200/40 dark:shadow-none p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
              <Smartphone size={22} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">
                Notificações neste dispositivo
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {pushSupported
                  ? "Receba um aviso mesmo com o ATHLO fechado, quando um compromisso da agenda estiver chegando."
                  : "Este navegador não suporta notificações push."}
              </p>
            </div>
          </div>

          {pushSupported && (
            <button
              type="button"
              onClick={handleTogglePush}
              disabled={pushBusy}
              className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl px-5 py-3 font-bold disabled:opacity-60 ${
                pushEnabled
                  ? "border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  : "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
              }`}
            >
              {pushEnabled ? <BellOff size={18} /> : <BellRing size={18} />}
              {pushBusy ? "Aguarde..." : pushEnabled ? "Desativar" : "Ativar notificações"}
            </button>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm shadow-slate-200/40 dark:shadow-none p-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Atividades recentes
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Histórico de avisos e atualizações da plataforma.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          {loading ? (
            <p className="text-slate-500 dark:text-slate-400">Carregando notificações...</p>
          ) : notifications.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400">Nenhuma notificação encontrada.</p>
          ) : (
            notifications.map((notification) => {
              const Icon = getIcon(notification.type);
              const isUnread = !notification.readAt;

              return (
                <div
                  key={notification.id}
                  className={`rounded-3xl border p-5 ${
                    isUnread
                      ? "border-cyan-500/40 bg-slate-100 dark:bg-slate-800"
                      : "border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/70"
                  }`}
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                    <div className="flex gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white dark:bg-slate-900">
                        <Icon className={getColor(notification.type)} size={26} />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-base font-bold text-slate-900 dark:text-white">
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

                        <p className="mt-2 leading-relaxed text-slate-500 dark:text-slate-400">
                          {notification.body}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-start gap-2 md:items-end">
                      <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">
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