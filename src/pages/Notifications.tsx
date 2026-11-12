import { useEffect, useState } from "react";
import {
  Bell,
  CheckCircle2,
  CalendarDays,
  Wallet,
  Users,
  AlertCircle,
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
import { useToast } from "../components/Toast";
import {
  Badge,
  Button,
  Card,
  CardHeader,
  EmptyState,
  PageContainer,
  SkeletonRows,
  StatStrip,
} from "../components/ui";

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
    (notification) => notification.type === "WARNING" || notification.type === "ERROR"
  ).length;

  const todayCount = notifications.filter((notification) => {
    const created = new Date(notification.createdAt);
    const today = new Date();
    return created.toDateString() === today.toDateString();
  }).length;

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

  function getTone(type: string): "positive" | "warn" | "negative" | "info" | "purple" | "neutral" {
    if (type === "WARNING") return "warn";
    if (type === "ERROR") return "negative";
    if (type === "SUCCESS" || type === "INVOICE_PAID") return "positive";
    if (type === "TEAM_INVITE") return "purple";
    if (type === "SYSTEM") return "neutral";
    return "info";
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
    <PageContainer>
      <StatStrip
        items={[
          { label: "Notificações", value: String(notifications.length) },
          { label: "Não lidas", value: String(unreadCount), tone: unreadCount > 0 ? "warn" : "default" },
          { label: "Alertas", value: String(alertsCount), tone: alertsCount > 0 ? "danger" : "default" },
          { label: "Hoje", value: String(todayCount) },
        ]}
      />

      <Card>
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-forest-100 text-forest-600 dark:bg-forest-900 dark:text-forest-400">
              <Smartphone size={18} />
            </div>
            <div>
              <h2 className="text-[14px] font-semibold">Notificações neste dispositivo</h2>
              <p className="text-[12.5px] text-muted dark:text-muted-dark">
                {pushSupported
                  ? "Receba um aviso mesmo com o ATHLO fechado, quando um compromisso da agenda estiver chegando."
                  : "Este navegador não suporta notificações push."}
              </p>
            </div>
          </div>

          {pushSupported && (
            <Button variant={pushEnabled ? "ghost" : "primary"} loading={pushBusy} onClick={handleTogglePush}>
              {pushEnabled ? <BellOff size={16} /> : <BellRing size={16} />}
              {pushEnabled ? "Desativar" : "Ativar notificações"}
            </Button>
          )}
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Atividades recentes"
          subtitle="Histórico de avisos e atualizações da plataforma."
          action={
            <Button variant="ghost" onClick={handleMarkAllRead}>
              <MailCheck size={16} />
              Marcar todas como lidas
            </Button>
          }
        />

        <div className="space-y-2.5 p-5">
          {loading ? (
            <SkeletonRows rows={4} cols={1} />
          ) : notifications.length === 0 ? (
            <EmptyState
              icon={<Bell size={20} />}
              title="Nenhuma notificação encontrada"
              description="Avisos sobre faturas, agenda e equipe aparecem aqui."
            />
          ) : (
            notifications.map((notification) => {
              const Icon = getIcon(notification.type);
              const isUnread = !notification.readAt;

              return (
                <div
                  key={notification.id}
                  className={`rounded-md border p-4 ${
                    isUnread
                      ? "border-forest-600/30 bg-[#F0EEE8] dark:border-forest-400/30 dark:bg-white/[0.06]"
                      : "border-line bg-surface dark:border-line-dark dark:bg-surface-dark"
                  }`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex gap-3.5">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-[#F0EEE8] dark:bg-white/[0.06]">
                        <Icon size={18} className="text-muted dark:text-muted-dark" />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-[14px] font-semibold">{notification.title}</h3>
                          <Badge tone={getTone(notification.type)}>{formatType(notification.type)}</Badge>
                          {isUnread && <Badge tone="positive">Nova</Badge>}
                        </div>

                        <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted dark:text-muted-dark">
                          {notification.body}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-start gap-2 sm:items-end">
                      <span className="whitespace-nowrap text-[11.5px] text-faint dark:text-faint-dark">
                        {formatDate(notification.createdAt)}
                      </span>

                      {isUnread && (
                        <Button size="sm" variant="ghost" onClick={() => handleMarkRead(notification.id)}>
                          Marcar como lida
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </PageContainer>
  );
}
