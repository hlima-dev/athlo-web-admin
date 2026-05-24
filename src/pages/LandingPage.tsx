import { Heart, Eye, ArrowRight, Users, Calendar, ShieldCheck, HandHeart, Medal, Cpu } from "lucide-react";

const stats = [
  {
    label: "Atletas apoiados",
    value: "127",
    icon: Users,
    color: "text-cyan-600",
  },
  {
    label: "Eventos realizados",
    value: "24",
    icon: Calendar,
    color: "text-green-500",
  },
  {
    label: "Doações arrecadadas",
    value: "R$ 8,4 mil",
    icon: Heart,
    color: "text-yellow-500",
  },
  {
    label: "Voluntários ativos",
    value: "32",
    icon: HandHeart,
    color: "text-purple-500",
  },
];

const cards = [
  {
    title: "Campeonatos oficiais",
    text: "A ASDA participa de competições, campeonatos estaduais e ações de desenvolvimento esportivo.",
    image: "/asda/campeonato.jpeg",
  },
  {
    title: "Desempenho e superação",
    text: "Tecnologia, treino e acompanhamento para fortalecer atletas no esporte adaptado.",
    image: "/asda/proteseperformance.jpeg",
  },
  {
    title: "Campanhas sociais",
    text: "Ações solidárias que ampliam o impacto social da ASDA Sorocaba.",
    image: "/asda/campanhaagasalho.jpeg",
  },
];

const benefits = [
  {
    icon: Medal,
    title: "Inclusão esportiva",
    text: "Apoio a atletas amputados através de treinos, eventos e competições.",
  },
  {
    icon: HandHeart,
    title: "Impacto social",
    text: "Conectamos voluntários, apoiadores e atletas em uma plataforma moderna.",
  },
  {
    icon: Cpu,
    title: "Tecnologia social",
    text: "Gestão inteligente para ampliar o alcance e o impacto da ASDA.",
  },
  {
    icon: ShieldCheck,
    title: "Transparência",
    text: "Prestação de contas e gestão clara de doações, eventos e ações.",
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F5FAFF] text-[#081B3A]">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src="/asda/logoasda.jpeg"
              className="w-16 h-16 rounded-full object-cover"
            />

            <div>
              <h1 className="text-4xl font-black text-cyan-600 leading-none">
                ATHLO
              </h1>

              <p className="text-slate-500 font-medium">
                Plataforma oficial ASDA
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-10 text-[#081B3A] font-semibold">
            <a href="#impacto" className="hover:text-cyan-600 transition">
              Impacto
            </a>

            <a href="#eventos" className="hover:text-cyan-600 transition">
              Eventos
            </a>

            <a href="#missao" className="hover:text-cyan-600 transition">
              Missão
            </a>

            <a href="#doar" className="hover:text-cyan-600 transition">
              Doar
            </a>

            <a href="#contato" className="hover:text-cyan-600 transition">
              Contato
            </a>
          </nav>

          <a
            href="/login"
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-black px-8 py-4 rounded-2xl shadow-lg shadow-cyan-600/20 transition"
          >
            Entrar
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-white to-blue-50" />

        <div className="absolute right-0 top-0 w-[60%] h-full bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.18),transparent_55%)]" />

        <div className="relative max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 xl:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-flex border border-cyan-500 text-cyan-600 rounded-full px-5 py-2 text-sm font-black uppercase">
              Associação Sorocabana Paradesporto de Amputados
            </span>

            <h1 className="text-6xl xl:text-7xl font-black leading-[1.03] mt-8 text-[#071B3A]">
              Transformando vidas através do{" "}
              <span className="text-cyan-600 italic font-black">
                esporte adaptado
              </span>
            </h1>

            <p className="text-slate-600 text-xl leading-relaxed mt-8 max-w-2xl">
              O ATHLO conecta atletas, voluntários, eventos e apoiadores em uma
              plataforma moderna criada para ampliar o impacto social da ASDA
              Sorocaba.
            </p>

            <div className="flex flex-col md:flex-row gap-5 mt-10">
              <a
                href="#doar"
                className="inline-flex items-center justify-center gap-3 bg-cyan-600 hover:bg-cyan-500 text-white font-black px-8 py-5 rounded-2xl shadow-lg shadow-cyan-600/25 transition"
              >
                <Heart size={20} />
                Apoiar projeto
              </a>

              <a
                href="#impacto"
                className="inline-flex items-center justify-center gap-3 bg-white hover:bg-slate-50 border border-slate-300 text-[#071B3A] font-black px-8 py-5 rounded-2xl transition"
              >
                <Eye size={20} />
                Ver impacto
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[36px] overflow-hidden bg-white shadow-2xl shadow-cyan-900/10 border border-slate-200">
              <div className="relative h-[420px]">
                <img
                  src="/asda/timevolei.jpeg"
                  className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/20 to-transparent" />
              </div>

              <div className="bg-cyan-600 p-7 text-white flex items-center gap-5">
                <img
                  src="/asda/logoasda.jpeg"
                  className="w-20 h-20 rounded-full object-cover bg-white"
                />

                <div>
                  <h2 className="text-3xl font-black">
                    ASDA Sorocaba
                  </h2>

                  <p className="text-white/80">
                    Associação Sorocabana Paradesporto
                  </p>
                </div>
              </div>

              <div className="p-7 grid grid-cols-2 gap-5 bg-white">
                {stats.map((stat) => {
                  const Icon = stat.icon;

                  return (
                    <div
                      key={stat.label}
                      className="rounded-3xl border border-slate-200 p-5 bg-white shadow-sm"
                    >
                      <p className="text-slate-500 font-semibold">
                        {stat.label}
                      </p>

                      <div className="flex items-center gap-3 mt-4">
                        <Icon className={stat.color} size={26} />

                        <h3 className={`text-4xl font-black ${stat.color}`}>
                          {stat.value}
                        </h3>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="eventos" className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              className="relative overflow-hidden rounded-3xl min-h-[300px] shadow-xl group"
            >
              <img
                src={card.image}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#071B3A]/90 via-[#071B3A]/35 to-transparent" />

              <div className="absolute bottom-0 p-7 text-white">
                <h2 className="text-3xl font-black mb-3">
                  {card.title}
                </h2>

                <p className="text-white/85 leading-relaxed">
                  {card.text}
                </p>

                <button className="mt-6 inline-flex items-center gap-3 bg-cyan-500 hover:bg-cyan-400 text-white font-black px-5 py-3 rounded-2xl">
                  Saiba mais
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ))}

          <div className="rounded-3xl bg-cyan-700 p-7 text-white shadow-xl min-h-[300px] flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-black mb-4">
                Impacto que transforma
              </h2>

              <p className="text-white/85 leading-relaxed">
                Cada ação gera inclusão, autonomia e novas oportunidades através
                do esporte.
              </p>
            </div>

            <button className="inline-flex items-center gap-3 bg-cyan-500 hover:bg-cyan-400 text-white font-black px-5 py-3 rounded-2xl w-fit">
              Conheça nosso impacto
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      <section id="impacto" className="max-w-7xl mx-auto px-6 py-10">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div key={benefit.title} className="flex gap-5">
                <div className="w-14 h-14 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600">
                  <Icon size={30} />
                </div>

                <div>
                  <h3 className="text-xl font-black text-[#071B3A]">
                    {benefit.title}
                  </h3>

                  <p className="text-slate-500 mt-2 leading-relaxed">
                    {benefit.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="missao" className="max-w-7xl mx-auto px-6 py-16">
        <div className="rounded-[36px] bg-gradient-to-r from-cyan-600 to-blue-700 p-12 text-white shadow-xl">
          <h2 className="text-5xl font-black max-w-4xl">
            Mais que um sistema. Uma plataforma de transformação social.
          </h2>

          <p className="text-white/85 text-xl mt-6 max-w-4xl leading-relaxed">
            O ATHLO nasceu para unir tecnologia, inclusão e gestão inteligente,
            dando à ASDA uma estrutura moderna para organizar atletas, eventos,
            doações e impacto social.
          </p>
        </div>
      </section>

      <section id="doar" className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-white rounded-[36px] border border-slate-200 shadow-xl p-12 text-center">
          <span className="inline-flex px-5 py-2 rounded-full border border-cyan-500 text-cyan-600 font-black text-sm">
            Próximo passo: PIX integrado
          </span>

          <h2 className="text-5xl font-black mt-8 text-[#071B3A]">
            Ajude a ampliar esse impacto
          </h2>

          <p className="text-slate-600 text-xl max-w-3xl mx-auto mt-5 leading-relaxed">
            Sua contribuição ajuda a financiar treinamentos, eventos, viagens,
            equipamentos e inclusão esportiva.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-5 mt-10">
            <a
              href="/login"
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-black px-10 py-5 rounded-2xl"
            >
              Entrar na plataforma
            </a>

            <button className="border border-slate-300 hover:bg-slate-50 text-[#071B3A] font-black px-10 py-5 rounded-2xl">
              Doar via PIX em breve
            </button>
          </div>
        </div>
      </section>

      <footer id="contato" className="bg-white border-t border-slate-200 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <img
              src="/asda/logoasda.jpeg"
              className="w-14 h-14 rounded-full object-cover"
            />

            <div>
              <h2 className="text-3xl font-black text-cyan-600">
                ATHLO
              </h2>

              <p className="text-slate-500">
                Plataforma oficial ASDA Sorocaba
              </p>
            </div>
          </div>

          <p className="text-slate-500 text-sm">
            © 2026 ATHLO • Tecnologia para impacto social
          </p>
        </div>
      </footer>
    </div>
  );
}