import { useNotifications } from "../hooks/useNotifications";

function getNotificationColor(type: string) {
  switch (type) {
    case "SUCCESS":
    case "DONATION_RECEIVED":
      return "border-green-200 bg-green-50 text-green-600";

    case "WARNING":
    case "EVENT_REMINDER":
      return "border-yellow-200 bg-yellow-50 text-yellow-600";

    case "ERROR":
      return "border-red-200 bg-red-50 text-red-600";

    case "ACHIEVEMENT_UNLOCKED":
      return "border-purple-200 bg-purple-50 text-purple-600";

    default:
      return "border-cyan-200 bg-cyan-50 text-cyan-600";
  }
}

function formatType(type: string) {
  const types: Record<string, string> = {
    INFO: "Informação",
    WARNING: "Aviso",
    SUCCESS: "Sucesso",
    ERROR: "Erro",
    EVENT_REMINDER: "Evento",
    TRAINING_ASSIGNED: "Treino",
    DONATION_RECEIVED: "Doação",
    ACHIEVEMENT_UNLOCKED: "Conquista",
    SYSTEM: "Sistema",
  };

  return types[type] || type;
}

export function Notifications() {
  const {
    data: notifications = [],
    isLoading,
  } = useNotifications();

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div>
          <h1 className="text-5xl font-black text-[#071B3A]">
            Notificações
          </h1>

          <p className="text-slate-500 mt-3 text-lg max-w-3xl">
            Atualizações da plataforma ATHLO
            e atividades recentes da ASDA.
          </p>
        </div>

        <button className="bg-cyan-600 hover:bg-cyan-500 transition text-white font-black px-6 py-4 rounded-2xl shadow-lg shadow-cyan-600/20">
          Marcar todas como lidas
        </button>
      </div>

      {isLoading && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-slate-500 shadow-sm">
          Carregando notificações...
        </div>
      )}

      {!isLoading &&
        notifications.length === 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-slate-500 shadow-sm">
            Nenhuma notificação encontrada.
          </div>
        )}

      <div className="space-y-5">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`rounded-3xl border p-6 transition hover:shadow-md ${getNotificationColor(
              notification.type
            )}`}
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
              <div>
                <span className="text-xs font-bold opacity-70 uppercase">
                  {formatType(notification.type)}
                </span>

                <h2 className="text-2xl font-black mt-2">
                  {notification.title}
                </h2>

                <p className="mt-3 opacity-80 leading-relaxed">
                  {notification.body}
                </p>
              </div>

              <span className="text-sm opacity-70 whitespace-nowrap">
                {new Date(
                  notification.createdAt
                ).toLocaleString("pt-BR")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}