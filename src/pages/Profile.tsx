import {
  User,
  Mail,
  ShieldCheck,
  CalendarDays,
  MapPin,
  Edit,
  Lock,
  Activity,
  CheckCircle2,
} from "lucide-react";

const activities = [
  "Atualizou informações do dashboard",
  "Registrou nova doação",
  "Cadastrou evento de treino coletivo",
];

export function Profile() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] bg-gradient-to-br from-cyan-500 via-blue-600 to-slate-900 p-6 shadow-2xl md:p-10">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white">
          <User size={16} />
          Perfil do usuário
        </span>

        <h1 className="mt-6 text-3xl font-black text-white md:text-5xl">
          Gerencie suas informações e acesso ao ATHLO.
        </h1>

        <p className="mt-4 max-w-2xl text-white/80 md:text-lg">
          Visualize dados da conta, função administrativa, segurança e histórico
          recente de atividades na plataforma.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 xl:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-[32px] bg-cyan-500/10 text-4xl font-black text-cyan-400">
              {(user?.nome || "Administrador")
                .split(" ")
                .map((n: string) => n[0])
                .slice(0, 2)
                .join("")}
            </div>

            <h2 className="mt-5 text-2xl font-black text-white">
              {user?.nome || "Administrador"}
            </h2>

            <p className="mt-1 text-slate-400">
              {user?.email || "admin@athlo.com"}
            </p>

            <span className="mt-5 rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-400">
              Administrador ativo
            </span>
          </div>

          <button className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-4 font-black text-slate-950 hover:bg-cyan-400">
            <Edit size={20} />
            Editar perfil
          </button>
        </div>

        <div className="space-y-6 xl:col-span-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-black text-white">
              Informações da conta
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-800 p-5">
                <Mail className="text-cyan-400" />
                <p className="mt-4 text-sm text-slate-400">E-mail</p>
                <h3 className="mt-1 font-bold text-white">
                  {user?.email || "admin@athlo.com"}
                </h3>
              </div>

              <div className="rounded-2xl bg-slate-800 p-5">
                <ShieldCheck className="text-emerald-400" />
                <p className="mt-4 text-sm text-slate-400">Permissão</p>
                <h3 className="mt-1 font-bold text-white">Administrador</h3>
              </div>

              <div className="rounded-2xl bg-slate-800 p-5">
                <MapPin className="text-purple-400" />
                <p className="mt-4 text-sm text-slate-400">Unidade</p>
                <h3 className="mt-1 font-bold text-white">ASDA Sorocaba</h3>
              </div>

              <div className="rounded-2xl bg-slate-800 p-5">
                <CalendarDays className="text-yellow-400" />
                <p className="mt-4 text-sm text-slate-400">Membro desde</p>
                <h3 className="mt-1 font-bold text-white">Maio de 2026</h3>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-black text-white">
              Segurança
            </h2>

            <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-slate-800 p-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
                  <Lock />
                </div>

                <div>
                  <h3 className="font-black text-white">Senha da conta</h3>
                  <p className="text-sm text-slate-400">
                    Atualize sua senha periodicamente para manter a segurança.
                  </p>
                </div>
              </div>

              <button className="rounded-2xl border border-slate-700 px-5 py-3 font-bold text-slate-300 hover:bg-slate-700">
                Alterar senha
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex items-center gap-3">
          <Activity className="text-cyan-400" />
          <h2 className="text-2xl font-black text-white">
            Atividades recentes
          </h2>
        </div>

        <div className="mt-6 space-y-4">
          {activities.map((item) => (
            <div
              key={item}
              className="flex items-center gap-4 rounded-2xl bg-slate-800 p-5"
            >
              <CheckCircle2 className="text-emerald-400" />
              <p className="text-slate-300">{item}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}