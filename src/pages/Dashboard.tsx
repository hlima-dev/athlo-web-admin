import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  Calendar,
  Heart,
  UserRound,
  TrendingUp,
  Trophy,
  ChevronDown,
} from "lucide-react";

import { useDashboard } from "../hooks/useDashboard";

export function Dashboard() {
  const { data, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="bg-white border border-slate-200 rounded-3xl p-10 w-[400px] shadow-xl">
          <div className="h-3 bg-cyan-50 rounded-full overflow-hidden">
            <div className="h-full w-32 bg-cyan-500 animate-pulse rounded-full" />
          </div>

          <p className="text-slate-500 mt-5">Carregando painel...</p>
        </div>
      </div>
    );
  }

  const cards = [
    {
      title: "Atletas ativos",
      value: data?.athletes || 0,
      icon: Users,
      color: "text-cyan-600",
      bg: "bg-cyan-50",
      info: "↑ 18% este mês",
    },
    {
      title: "Eventos realizados",
      value: data?.events || 0,
      icon: Calendar,
      color: "text-green-500",
      bg: "bg-green-50",
      info: "↑ 6 novos eventos",
    },
    {
      title: "Doações arrecadadas",
      value: `R$ ${data?.donations || 0}`,
      icon: Heart,
      color: "text-yellow-500",
      bg: "bg-yellow-50",
      info: "↑ Crescimento de 32%",
    },
    {
      title: "Usuários ativos",
      value: data?.users || 0,
      icon: UserRound,
      color: "text-purple-500",
      bg: "bg-purple-50",
      info: "↑ 14% este mês",
    },
  ];

  return (
    <div className="relative fade-in text-[#071B3A]">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-100 rounded-full blur-3xl opacity-20 -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-100 rounded-full blur-3xl opacity-20 -z-10" />

      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-5xl font-black">Painel</h1>

          <p className="text-slate-500 mt-2 text-lg">
            Plataforma ATHLO • ASDA Sorocaba
          </p>
        </div>

        <button className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-4 rounded-2xl font-black shadow-lg shadow-cyan-600/20 flex items-center gap-3 transition">
          <Calendar size={20} />
          Maio de 2026
          <ChevronDown size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {cards.map((card, index) => {
          const Icon = card.icon;

          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="relative overflow-hidden bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.08)]"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-100 blur-3xl opacity-40 rounded-full" />

              <div className="relative z-10">
                <p className="text-[#071B3A] font-black">{card.title}</p>

                <div className="flex items-center gap-5 mt-5">
                  <div
                    className={`w-20 h-20 rounded-3xl ${card.bg} flex items-center justify-center`}
                  >
                    <Icon className={card.color} size={36} />
                  </div>

                  <h2 className={`text-5xl font-black ${card.color}`}>
                    {card.value}
                  </h2>
                </div>

                <p className="text-green-500 font-bold mt-6">{card.info}</p>

                <div className="mt-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />

                  <span className="text-sm font-semibold text-slate-500">
                    Atualizado em tempo real
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="xl:col-span-2 bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl p-7 shadow-[0_10px_40px_rgba(0,0,0,0.08)]"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-black">Crescimento de doações</h2>

            <button className="border border-slate-200 bg-white px-5 py-3 rounded-2xl font-bold text-slate-600">
              Últimos 5 meses
            </button>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.donationData || []}>
                <XAxis dataKey="month" stroke="#64748B" />
                <YAxis stroke="#64748B" />

                <Tooltip
                  contentStyle={{
                    borderRadius: "18px",
                    border: "none",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="valor"
                  stroke="#06B6D4"
                  strokeWidth={5}
                  dot={{
                    r: 5,
                    fill: "#06B6D4",
                  }}
                  activeDot={{
                    r: 8,
                    fill: "#0891B2",
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 bg-cyan-50 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-100 flex items-center justify-center text-cyan-600">
              <TrendingUp size={24} />
            </div>

            <p className="text-slate-600">
              Crescimento de <strong className="text-cyan-600">32%</strong> nas
              doações em relação ao mês anterior.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl p-7 shadow-[0_10px_40px_rgba(0,0,0,0.08)]"
        >
          <h2 className="text-3xl font-black mb-6">Atividade recente</h2>

          <div className="space-y-5">
            {[
              ["Novo atleta cadastrado", "Sistema conectado ao backend", Users],
              ["Nova doação recebida", "Painel em tempo real", Heart],
              ["Evento agendado", "Campeonato regional", Calendar],
            ].map(([title, desc, Icon]: any) => (
              <div
                key={title}
                className="border border-slate-200 rounded-3xl p-5 flex items-center gap-4 hover:bg-cyan-50/40 transition"
              >
                <div className="w-16 h-16 rounded-3xl bg-cyan-50 flex items-center justify-center text-cyan-600">
                  <Icon size={28} />
                </div>

                <div>
                  <p className="font-black text-cyan-600">{title}</p>
                  <p className="text-slate-500 mt-1">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="mt-8 bg-cyan-50/80 border border-cyan-100 rounded-3xl p-7 flex items-center justify-between shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-3xl bg-cyan-600 text-white flex items-center justify-center shadow-lg shadow-cyan-600/20">
            <Trophy size={32} />
          </div>

          <div>
            <h2 className="text-2xl font-black">Juntos somos mais fortes!</h2>
            <p className="text-slate-500 mt-1">
              Cada ação faz a diferença na vida de nossos atletas.
            </p>
          </div>
        </div>

        <button className="bg-cyan-600 hover:bg-cyan-500 text-white font-black px-6 py-4 rounded-2xl transition shadow-lg shadow-cyan-600/20">
          Ver impacto completo
        </button>
      </div>
    </div>
  );
}