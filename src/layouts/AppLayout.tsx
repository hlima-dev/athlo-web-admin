import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Home,
  Calendar,
  HeartHandshake,
  HandHeart,
  Users,
  BarChart3,
  Bell,
  LogOut,
  User,
  Settings,
} from "lucide-react";

const menuItems = [
  { label: "Painel", path: "/dashboard", icon: LayoutDashboard },
  { label: "Lar", path: "/home", icon: Home },
  { label: "Eventos", path: "/eventos", icon: Calendar },
  { label: "Calendário", path: "/calendario", icon: Calendar },
  { label: "Doações", path: "/doacoes", icon: HeartHandshake },
  { label: "Voluntários", path: "/voluntarios", icon: HandHeart },
  { label: "Atletas", path: "/atletas", icon: Users },
  { label: "Relatórios", path: "/relatorios", icon: BarChart3 },
  { label: "Notificações", path: "/notificacoes", icon: Bell },
  { label: "Perfil", path: "/perfil", icon: User },
  { label: "Configurações", path: "/configuracoes", icon: Settings },
];

export function AppLayout() {
  function logout() {
    localStorage.removeItem("@athlo:token");
    window.location.href = "/login";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/40 to-white flex">
      <aside className="fixed left-0 top-0 z-40 h-screen w-[310px] bg-white/85 backdrop-blur-xl border-r border-slate-200 shadow-xl flex flex-col">
        <div className="px-6 py-6 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-cyan-100 shadow-md bg-white">
              <img
                src="/asda/logoasda.jpeg"
                alt="ASDA"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h1 className="text-4xl font-black tracking-tight text-cyan-500 leading-none">
                ATHLO
              </h1>
              <p className="text-sm font-semibold text-slate-500 mt-1">
                Plataforma oficial
              </p>
              <span className="text-sm font-bold text-slate-700">ASDA</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-5 overflow-y-auto space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-[15px] transition-all duration-200 ${
                    isActive
                      ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/25"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`
                }
              >
                <Icon size={21} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button
            onClick={logout}
            className="w-full py-3.5 rounded-2xl border border-red-200 text-red-500 font-bold text-[15px] hover:bg-red-50 transition flex items-center justify-center gap-3"
          >
            <LogOut size={20} />
            Sair da plataforma
          </button>
        </div>
      </aside>

      <main className="ml-[310px] flex-1 min-h-screen">
        <header className="sticky top-0 z-30 h-20 bg-white/65 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between px-10">
          <div>
            <p className="text-sm font-bold text-cyan-600">
              Gestão esportiva e social
            </p>
            <h2 className="text-2xl font-black text-slate-900">
              Bem-vindo ao ATHLO
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button className="w-11 h-11 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:text-cyan-600 transition">
              <Bell size={20} />
            </button>

            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-2 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center text-cyan-600">
                <User size={20} />
              </div>
              <div className="leading-tight">
                <p className="text-sm font-black text-slate-800">Lucas</p>
                <span className="text-xs font-semibold text-slate-500">
                  Administrador
                </span>
              </div>
            </div>
          </div>
        </header>

        <section className="p-10">
          <Outlet />
        </section>
      </main>
    </div>
  );
}