import { useNotifications } from "../hooks/useNotifications";

function getNotificationColor(type: string) {
  switch (type) {
    case "SUCCESS":
    case "DONATION_RECEIVED":
      return "border-green-500/20 bg-green-500/10 text-green-400";

    case "WARNING":
    case "EVENT_REMINDER":
      return "border-yellow-500/20 bg-yellow-500/10 text-yellow-400";

    case "ERROR":
      return "border-red-500/20 bg-red-500/10 text-red-400";

    case "ACHIEVEMENT_UNLOCKED":
      return "border-purple-500/20 bg-purple-500/10 text-purple-400";

    default:
      return "border-cyan-500/20 bg-cyan-500/10 text-cyan-400";
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
  const { data: notifications = [], isLoading } = useNotifications();

  return (
    <div className="fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-black">Notificações</h1>

          <p className="text-white/60 mt-2">
            Atualizações reais da plataforma ATHLO e atividades recentes da ASDA.
          </p>
        </div>

        <button className="bg-cyan-400 hover:bg-cyan-300 transition text-[#07111f] font-bold px-6 py-4 rounded-2xl">
          Marcar todas como lidas
        </button>
      </div>

      {isLoading && (
        <div className="glass-card rounded-3xl p-8 text-white/60">
          Carregando notificações...
        </div>
      )}

      {!isLoading && notifications.length === 0 && (
        <div className="glass-card rounded-3xl p-8 text-white/60">
          Nenhuma notificação encontrada.
        </div>
      )}

      <div className="space-y-5">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`rounded-3xl border p-6 transition hover:scale-[1.01] ${getNotificationColor(
              notification.type
            )}`}
          >
            <div className="flex items-start justify-between gap-5">
              <div>
                <span className="text-xs opacity-70">
                  {formatType(notification.type)}
                </span>

                <h2 className="text-2xl font-bold mt-2">
                  {notification.title}
                </h2>

                <p className="mt-3 opacity-80 leading-relaxed">
                  {notification.body}
                </p>
              </div>

              <span className="text-sm opacity-70 whitespace-nowrap">
                {new Date(notification.createdAt).toLocaleString("pt-BR")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}