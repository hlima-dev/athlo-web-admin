import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
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
  Shield,
  RefreshCw,
} from "lucide-react";
import { logout as logoutRequest, getStoredOrganization, getStoredUser } from "../services/auth";
import { PaymentRequiredBanner } from "../components/PaymentRequiredBanner";
import { SwitchOrganizationModal } from "../components/SwitchOrganizationModal";

const roleLabels: Record<string, string> = {
  OWNER: "Dono(a)",
  ADMIN: "Administrador(a)",
  MEMBER: "Membro",
};

const todayLabel = new Date().toLocaleDateString("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const menuItems = [
  { label: "Painel", path: "/dashboard", icon: LayoutDashboard },
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
  const [switchModalOpen, setSwitchModalOpen] = useState(false);

  const user = getStoredUser();
  const organization = getStoredOrganization();
  const isPlatformAdmin = !!user?.isPlatformAdmin;

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

  async function logout() {
    await logoutRequest();
    navigate("/login");
  }

  function Sidebar() {
    return (
      <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-black text-cyan-400">ATHLO</h1>

            <button
              onClick={() => setMenuOpen(false)}
              className="md:hidden w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              <X size={22} />
            </button>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400">
              <User size={20} />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-slate-900 dark:text-white truncate uppercase text-sm">
                {user?.name || "Usuário"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{todayLabel}</p>
            </div>
          </div>

          <div className="mt-3 rounded-xl bg-slate-100 dark:bg-slate-800 px-3 py-2">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
              {organization?.name || "Gestão para PMEs"}
            </p>
            {user?.orgRole && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {roleLabels[user.orgRole] ?? user.orgRole}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => setSwitchModalOpen(true)}
            className="mt-2 flex items-center gap-2 text-xs font-bold text-cyan-500 hover:text-cyan-400"
          >
            <RefreshCw size={13} />
            Trocar Unidade
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

          {isPlatformAdmin && (
            <NavLink
              to="/admin"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-purple-400 hover:bg-purple-500/10 transition"
            >
              <Shield size={20} />
              Admin ATHLO
            </NavLink>
          )}

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
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white flex">
      <PaymentRequiredBanner />
      <SwitchOrganizationModal open={switchModalOpen} onClose={() => setSwitchModalOpen(false)} />
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
