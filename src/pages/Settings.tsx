import {
  Settings as SettingsIcon,
  Moon,
  Bell,
  ShieldCheck,
  Database,
  Palette,
  Globe,
  Save,
  CheckCircle2,
} from "lucide-react";

export function Settings() {
  return (
    <div className="space-y-8">
      <section className="rounded-[32px] bg-gradient-to-br from-cyan-500 via-blue-600 to-slate-900 p-6 shadow-2xl md:p-10">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white">
          <SettingsIcon size={16} />
          Configurações da plataforma
        </span>

        <h1 className="mt-6 text-3xl font-black text-white md:text-5xl">
          Personalize e controle o funcionamento do ATHLO.
        </h1>

        <p className="mt-4 max-w-2xl text-white/80 md:text-lg">
          Gerencie notificações, aparência, segurança, integrações e preferências
          da plataforma administrativa da ASDA.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center gap-3">
            <Palette className="text-cyan-400" />
            <h2 className="text-2xl font-black text-white">
              Aparência
            </h2>
          </div>

          <div className="mt-6 space-y-5">
            <div className="flex items-center justify-between rounded-2xl bg-slate-800 p-5">
              <div className="flex items-center gap-4">
                <Moon className="text-cyan-400" />

                <div>
                  <h3 className="font-black text-white">
                    Tema escuro
                  </h3>

                  <p className="text-sm text-slate-400">
                    Interface moderna em modo dark.
                  </p>
                </div>
              </div>

              <div className="h-7 w-14 rounded-full bg-cyan-500 p-1">
                <div className="ml-auto h-5 w-5 rounded-full bg-white" />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-slate-800 p-5">
              <div className="flex items-center gap-4">
                <Globe className="text-emerald-400" />

                <div>
                  <h3 className="font-black text-white">
                    Idioma da plataforma
                  </h3>

                  <p className="text-sm text-slate-400">
                    Português Brasil.
                  </p>
                </div>
              </div>

              <select className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-white outline-none">
                <option>Português</option>
                <option>English</option>
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center gap-3">
            <Bell className="text-yellow-400" />
            <h2 className="text-2xl font-black text-white">
              Notificações
            </h2>
          </div>

          <div className="mt-6 space-y-5">
            {[
              "Receber alertas de eventos",
              "Receber novas doações",
              "Atualizações administrativas",
              "Campanhas e metas",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between rounded-2xl bg-slate-800 p-5"
              >
                <span className="font-semibold text-slate-200">
                  {item}
                </span>

                <div className="h-7 w-14 rounded-full bg-cyan-500 p-1">
                  <div className="ml-auto h-5 w-5 rounded-full bg-white" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-emerald-400" />
            <h2 className="text-2xl font-black text-white">
              Segurança
            </h2>
          </div>

          <div className="mt-6 space-y-5">
            <div className="rounded-2xl bg-slate-800 p-5">
              <h3 className="font-black text-white">
                Autenticação
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Em breve será integrada autenticação JWT segura com controle
                administrativo completo.
              </p>

              <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-400">
                <CheckCircle2 size={16} />
                Segurança ativa
              </span>
            </div>

            <div className="rounded-2xl bg-slate-800 p-5">
              <h3 className="font-black text-white">
                Controle de acesso
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Níveis de permissão e gerenciamento de usuários serão integrados
                nas próximas versões.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center gap-3">
            <Database className="text-purple-400" />
            <h2 className="text-2xl font-black text-white">
              Sistema
            </h2>
          </div>

          <div className="mt-6 space-y-5">
            <div className="rounded-2xl bg-slate-800 p-5">
              <h3 className="font-black text-white">
                Banco de dados
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Estrutura preparada para integração com backend Node.js e MySQL.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-800 p-5">
              <h3 className="font-black text-white">
                Deploy
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Plataforma preparada para hospedagem em produção na Vercel +
                Render.
              </p>
            </div>
          </div>
        </div>
      </section>

      <button className="inline-flex items-center gap-3 rounded-2xl bg-cyan-500 px-8 py-4 font-black text-slate-950 hover:bg-cyan-400">
        <Save size={20} />
        Salvar alterações
      </button>
    </div>
  );
}