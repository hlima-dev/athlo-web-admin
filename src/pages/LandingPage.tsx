import { useEffect, useState } from "react";
import {
  Rocket,
  ArrowRight,
  Users,
  Wallet,
  Calendar,
  Package,
  ShieldCheck,
  Zap,
  BarChart3,
  Check,
} from "lucide-react";
import { getPlans, type Plan } from "../services/plans";

const features = [
  {
    icon: Users,
    title: "Contatos e CRM",
    text: "Centralize leads, clientes e fornecedores com histórico completo de interações.",
  },
  {
    icon: Wallet,
    title: "Financeiro",
    text: "Controle contas a pagar e a receber, marque faturas como pagas e acompanhe o caixa.",
  },
  {
    icon: Calendar,
    title: "Agenda",
    text: "Organize reuniões, tarefas e prazos da equipe em um calendário único.",
  },
  {
    icon: Package,
    title: "Produtos e serviços",
    text: "Cadastre seu catálogo e use nas faturas em segundos.",
  },
];

const benefits = [
  {
    icon: Zap,
    title: "Comece em minutos",
    text: "Crie sua empresa, convide a equipe e comece a usar sem instalar nada.",
  },
  {
    icon: ShieldCheck,
    title: "Dados isolados por empresa",
    text: "Cada empresa tem seus próprios dados, usuários e permissões — com segurança de ponta a ponta.",
  },
  {
    icon: BarChart3,
    title: "Relatórios em tempo real",
    text: "Acompanhe receita, contatos e agenda com painéis visuais e atualizados.",
  },
  {
    icon: Users,
    title: "Equipe colaborativa",
    text: "Convide colaboradores com papéis de acesso (dono, admin, membro) conforme seu plano.",
  },
];

function formatPrice(value: string | number) {
  const n = Number(value);
  if (n === 0) return "Grátis";
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function LandingPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  useEffect(() => {
    getPlans()
      .then(setPlans)
      .catch(() => setPlans([]))
      .finally(() => setLoadingPlans(false));
  }, []);

  return (
    <div className="min-h-screen text-[#081B3A] overflow-x-hidden">
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center shadow-lg shadow-cyan-600/20">
              <Rocket className="text-white" size={26} />
            </div>

            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-cyan-600 leading-none">
                ATHLO
              </h1>

              <p className="text-slate-500 font-medium text-xs sm:text-base">
                Gestão para pequenas e médias empresas
              </p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-10 text-[#081B3A] font-semibold">
            <a href="#recursos" className="hover:text-cyan-600 transition">
              Recursos
            </a>
            <a href="#planos" className="hover:text-cyan-600 transition">
              Planos
            </a>
            <a href="#vantagens" className="hover:text-cyan-600 transition">
              Vantagens
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="hidden sm:inline-flex text-[#081B3A] font-bold px-4 py-3 hover:text-cyan-600 transition"
            >
              Entrar
            </a>
            <a
              href="/cadastro"
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-black px-5 sm:px-8 py-3 sm:py-4 rounded-2xl shadow-lg shadow-cyan-600/20 transition text-sm sm:text-base"
            >
              Começar grátis
            </a>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 grid grid-cols-1 xl:grid-cols-2 gap-12 xl:gap-16 items-center">
          <div>
            <span className="inline-flex border border-cyan-500 text-cyan-600 rounded-full px-4 py-2 text-xs sm:text-sm font-black uppercase bg-white/70 backdrop-blur-sm">
              SaaS para pequenas e médias empresas
            </span>

            <h1 className="text-4xl sm:text-5xl xl:text-7xl font-black leading-tight mt-8 text-[#071B3A]">
              Sua empresa organizada em{" "}
              <span className="text-cyan-600 italic font-black">
                um só lugar
              </span>
            </h1>

            <p className="text-slate-700 text-base sm:text-xl leading-relaxed mt-6 sm:mt-8 max-w-2xl">
              O ATHLO reúne contatos, financeiro, agenda, produtos e equipe em
              uma plataforma simples e moderna — para você parar de gerenciar
              seu negócio em planilhas soltas.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 mt-8 sm:mt-10">
              <a
                href="/cadastro"
                className="inline-flex items-center justify-center gap-3 bg-cyan-600 hover:bg-cyan-500 text-white font-black px-6 sm:px-8 py-4 sm:py-5 rounded-2xl shadow-lg shadow-cyan-600/25 transition"
              >
                <Rocket size={20} />
                Criar minha empresa grátis
              </a>

              <a
                href="#planos"
                className="inline-flex items-center justify-center gap-3 bg-white/85 backdrop-blur-sm hover:bg-white border border-slate-300 text-[#071B3A] font-black px-6 sm:px-8 py-4 sm:py-5 rounded-2xl transition"
              >
                Ver planos
                <ArrowRight size={20} />
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[28px] sm:rounded-[36px] overflow-hidden bg-slate-900 shadow-2xl shadow-cyan-900/10 border border-white/10 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                  <BarChart3 size={20} />
                </div>
                <div>
                  <h2 className="text-white font-black">Painel ATHLO</h2>
                  <p className="text-slate-400 text-sm">Visão geral da sua empresa</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={feature.title}
                      className="rounded-2xl border border-slate-800 bg-slate-800/60 p-4"
                    >
                      <Icon className="text-cyan-400" size={22} />
                      <p className="mt-3 text-sm font-bold text-white leading-tight">
                        {feature.title}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="recursos" className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl sm:text-4xl font-black text-[#071B3A]">
            Tudo que sua empresa precisa, em um painel só
          </h2>
          <p className="text-slate-600 mt-4 text-base sm:text-lg">
            Módulos pensados para o dia a dia de pequenas e médias empresas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-3xl bg-white/90 backdrop-blur-md border border-white/40 shadow-sm p-6 sm:p-7"
              >
                <div className="w-14 h-14 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600">
                  <Icon size={28} />
                </div>
                <h3 className="mt-5 text-lg sm:text-xl font-black text-[#071B3A]">
                  {feature.title}
                </h3>
                <p className="mt-2 text-slate-500 leading-relaxed text-sm sm:text-base">
                  {feature.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="vantagens" className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-white/40 shadow-sm p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div key={benefit.title} className="flex gap-5">
                <div className="w-14 h-14 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600 shrink-0">
                  <Icon size={30} />
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-black text-[#071B3A]">
                    {benefit.title}
                  </h3>

                  <p className="text-slate-500 mt-2 leading-relaxed text-sm sm:text-base">
                    {benefit.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="planos" className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl sm:text-4xl font-black text-[#071B3A]">
            Planos para cada fase da sua empresa
          </h2>
          <p className="text-slate-600 mt-4 text-base sm:text-lg">
            Comece grátis e faça upgrade quando precisar de mais espaço para
            crescer.
          </p>
        </div>

        {loadingPlans ? (
          <p className="text-center text-slate-500">Carregando planos...</p>
        ) : plans.length === 0 ? (
          <p className="text-center text-slate-500">
            Planos indisponíveis no momento — crie sua conta e comece no plano
            gratuito.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, index) => {
              const highlighted = index === 1;
              return (
                <div
                  key={plan.id}
                  className={`rounded-[28px] p-6 sm:p-8 shadow-xl border ${
                    highlighted
                      ? "bg-gradient-to-br from-cyan-600 to-blue-700 text-white border-transparent scale-[1.02]"
                      : "bg-white/90 backdrop-blur-md border-white/40 text-[#071B3A]"
                  }`}
                >
                  <h3 className="text-2xl font-black">{plan.name}</h3>
                  <p
                    className={`mt-3 text-3xl font-black ${
                      highlighted ? "text-white" : "text-cyan-600"
                    }`}
                  >
                    {formatPrice(plan.priceMonthly)}
                    {Number(plan.priceMonthly) > 0 && (
                      <span className="text-base font-semibold opacity-70">/mês</span>
                    )}
                  </p>

                  <ul className="mt-6 space-y-3">
                    <li className="flex items-center gap-2 text-sm sm:text-base">
                      <Check size={18} className={highlighted ? "text-white" : "text-cyan-600"} />
                      Até {plan.maxUsers} usuários
                    </li>
                    <li className="flex items-center gap-2 text-sm sm:text-base">
                      <Check size={18} className={highlighted ? "text-white" : "text-cyan-600"} />
                      Até {plan.maxContacts.toLocaleString("pt-BR")} contatos
                    </li>
                    {(plan.features ?? []).map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm sm:text-base">
                        <Check size={18} className={highlighted ? "text-white" : "text-cyan-600"} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <a
                    href="/cadastro"
                    className={`mt-8 inline-flex w-full items-center justify-center gap-2 font-black px-6 py-4 rounded-2xl transition ${
                      highlighted
                        ? "bg-white text-cyan-700 hover:bg-slate-100"
                        : "bg-cyan-600 text-white hover:bg-cyan-500"
                    }`}
                  >
                    Começar com {plan.name}
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="rounded-[28px] sm:rounded-[36px] bg-gradient-to-r from-cyan-600 to-blue-700 p-6 sm:p-12 text-white shadow-xl text-center">
          <h2 className="text-3xl sm:text-5xl font-black max-w-3xl mx-auto leading-tight">
            Pronto para organizar sua empresa?
          </h2>

          <p className="text-white/85 text-base sm:text-xl mt-6 max-w-2xl mx-auto leading-relaxed">
            Crie sua conta gratuita agora e comece a usar o ATHLO em poucos
            minutos.
          </p>

          <a
            href="/cadastro"
            className="mt-8 inline-flex items-center justify-center gap-3 bg-white text-cyan-700 hover:bg-slate-100 font-black px-8 sm:px-10 py-4 sm:py-5 rounded-2xl transition"
          >
            <Rocket size={20} />
            Criar minha empresa grátis
          </a>
        </div>
      </section>

      <footer className="bg-white border-t border-slate-200 py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center">
                <Rocket className="text-white" size={22} />
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-cyan-600">
                  ATHLO
                </h2>

                <p className="text-slate-500 text-sm sm:text-base">
                  Gestão para pequenas e médias empresas
                </p>
              </div>
            </div>

            <p className="text-slate-500 text-sm">
              © 2026 ATHLO • Todos os direitos reservados
            </p>
          </div>

          <div className="border-t border-slate-200 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              Desenvolvido por Lucas Lima Santos
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
