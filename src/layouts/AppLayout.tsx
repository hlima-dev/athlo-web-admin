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
  {
    label: "Painel",
    path: "/dashboard",
    icon: LayoutDashboard,
  },

  {
    label: "Lar",
    path: "/home",
    icon: Home,
  },

  {
    label: "Eventos",
    path: "/eventos",
    icon: Calendar,
  },

  {
    label: "Calendário",
    path: "/calendario",
    icon: Calendar,
  },

  {
    label: "Doações",
    path: "/doacoes",
    icon: HeartHandshake,
  },

  {
    label: "Voluntários",
    path: "/voluntarios",
    icon: HandHeart,
  },

  {
    label: "Atletas",
    path: "/atletas",
    icon: Users,
  },

  {
    label: "Relatórios",
    path: "/relatorios",
    icon: BarChart3,
  },

  {
    label: "Notificações",
    path: "/notificacoes",
    icon: Bell,
  },

  {
    label: "Perfil",
    path: "/perfil",
    icon: User,
  },

  {
    label: "Configurações",
    path: "/configuracoes",
    icon: Settings,
  },
];

export function AppLayout() {
  function logout() {
    localStorage.removeItem("@athlo:token");

    window.location.href = "/login";
  }

  return (
    <div className="min-h-screen bg-transparent flex">
      <aside className="w-[320px] min-w-[320px] h-screen bg-white/75 backdrop-blur-xl border-r border-slate-200 flex flex-col fixed left-0 top-0 shadow-xl">

        <div className="px-7 py-6 border-b border-slate-200">
          <div className="flex items-center gap-4">

            <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-cyan-100 shadow-md bg-white">
              <img
                src="/asda/logoasda.jpeg"
                alt="ASDA"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="leading-tight">
              <h1 className="text-[42px] font-black text-cyan-500 leading-none">
                ATHLO
              </h1>

              <p className="text-slate-500 text-[16px] mt-1">
                Plataforma oficial
              </p>

              <span className="text-slate-600 text-[16px]">
                ASDA
              </span>
            </div>

          </div>
        </div>

        <nav className="flex-1 px-5 py-6 overflow-y-auto space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-lg transition ${
                    isActive
                      ? "bg-cyan-50 text-cyan-600"
                      : "hover:bg-slate-100 text-slate-600"
                  }`
                }
              >
                <Icon size={22} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-5 border-t border-slate-200">
          <button
            onClick={logout}
            className="w-full py-4 rounded-2xl border border-red-200 text-red-500 font-bold text-lg hover:bg-red-50 transition flex items-center justify-center gap-3"
          >
            <LogOut size={20} />
            Sair da plataforma
          </button>
        </div>
      </aside>

      <main className="ml-[320px] flex-1 min-h-screen p-10">
        <Outlet />
      </main>
    </div>
  );
}