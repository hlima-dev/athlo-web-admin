import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Home,
  Calendar,
  CalendarDays,
  Wallet,
  Package,
  ClipboardList,
  Users,
  BarChart3,
  Bell,
  LogOut,
  User,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { clearSession, getStoredOrganization, getStoredUser } from "../services/auth";

const menuItems = [
  { label: "Painel", path: "/dashboard", icon: LayoutDashboard },
  { label: "Início", path: "/home", icon: Home },
  { label: "Contatos", path: "/contatos", icon: Users },
  { label: "Pedidos", path: "/pedidos", icon: ClipboardList },
  { label: "Financeiro", path: "/financeiro", icon: Wallet },
  { label: "Produtos", path: "/produtos", icon: Package },
  { label: "Agenda", path: "/eventos", icon: Calendar },
  { label: "Calendário", path: "/calendario", icon: CalendarDays },
  { label: "Equipe", path: "/equipe", icon: Users },
  { label: "Relatórios", path: "/relatorios", icon: BarChart3 },
  { label: "Notificações", path: "/notificacoes", icon: Bell },
];

export function AppLayout() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const user = getStoredUser();
  const organization = getStoredOrganization();

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function logout() {
    clearSession();
    navigate("/login");
  }

  function Sidebar() {
    return (
      <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-cyan-400">ATHLO</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-[160px]">
              {organization?.name || "Gestão para PMEs"}
            </p>
          </div>

          <button
            onClick={() => setMenuOpen(false)}
            className="md:hidden w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    isActive
                      ? "bg-cyan-500 text-slate-950 font-bold"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`
                }
              >
                <Icon size={20} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <NavLink
            to="/perfil"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <User size={20} />
            Perfil
          </NavLink>

          <NavLink
            to="/configuracoes"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Settings size={20} />
            Configurações
          </NavLink>

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut size={20} />
            Sair
          </button>
        </div>
      </aside>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {menuOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden overflow-hidden"
          onTouchMove={(e) => e.preventDefault()}
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />

          <div className="relative z-10 h-full w-72 shadow-2xl">
            <Sidebar />
          </div>
        </div>
      )}

      <main className="flex-1 min-h-screen">
        <header className="h-20 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur flex items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen(true)}
              className="md:hidden w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              <Menu size={24} />
            </button>

            <div>
              <h2 className="text-lg md:text-xl font-bold">
                {organization?.name || "Painel Administrativo"}
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Bem-vindo{user?.name ? `, ${user.name}` : ""}!
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="hidden sm:flex items-center gap-2 text-red-400 hover:text-red-300 transition"
          >
            <LogOut size={20} />
            Sair
          </button>
        </header>

        <section className="p-5 md:p-8">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
