import { useState } from "react";
import {
  User,
  Mail,
  ShieldCheck,
  CalendarDays,
  Building2,
  Edit,
  Lock,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { changePassword, getStoredOrganization, getStoredUser, updateProfile } from "../services/auth";
import { PageHeader } from "../components/PageHeader";
import { useToast } from "../components/Toast";
import { maskPhone } from "../utils/masks";

const roleLabels: Record<string, string> = {
  OWNER: "Dono da empresa",
  ADMIN: "Administrador",
  MEMBER: "Membro",
};

const activities = [
  "Atualizou informações do perfil",
  "Acessou o painel administrativo",
  "Consultou relatórios da empresa",
];

const emptyPasswordForm = { currentPassword: "", newPassword: "", confirmPassword: "" };

export function Profile() {
  const toast = useToast();
  const organization = getStoredOrganization();
  const [user, setUser] = useState(getStoredUser());

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState(emptyPasswordForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", phone: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");

  function openPasswordModal() {
    setPasswordForm(emptyPasswordForm);
    setError("");
    setSuccess("");
    setShowPasswordModal(true);
  }

  function openProfileModal() {
    setProfileForm({ name: user?.name || "", phone: user?.phone || "" });
    setProfileError("");
    setShowProfileModal(true);
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileError("");

    try {
      setSavingProfile(true);
      const updated = await updateProfile(profileForm);
      const merged = { ...user, ...updated };
      setUser(merged);
      localStorage.setItem("@athlo:user", JSON.stringify(merged));
      setShowProfileModal(false);
      setSuccess("Perfil atualizado com sucesso.");
      toast.success("Perfil atualizado com sucesso.");
    } catch (err: any) {
      const fieldErrors = err?.response?.data?.errors as Record<string, string[]> | undefined;
      const firstFieldError = fieldErrors && Object.values(fieldErrors).flat()[0];
      setProfileError(firstFieldError || err?.response?.data?.message || "Erro ao atualizar perfil.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("A confirmação não bate com a nova senha.");
      return;
    }

    try {
      setSaving(true);
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setShowPasswordModal(false);
      setSuccess("Senha alterada com sucesso.");
      toast.success("Senha alterada com sucesso.");
    } catch (err: any) {
      const fieldErrors = err?.response?.data?.errors as Record<string, string[]> | undefined;
      const firstFieldError = fieldErrors && Object.values(fieldErrors).flat()[0];
      setError(firstFieldError || err?.response?.data?.message || "Erro ao alterar senha.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        icon={User}
        title="Perfil"
        description="Dados da conta, função na empresa e segurança."
      />

      {success && (
        <div className="rounded-2xl border border-emerald-700 bg-emerald-900/30 p-4 text-sm text-emerald-300">
          {success}
        </div>
      )}

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 xl:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-cyan-500/10 text-2xl font-bold text-cyan-400">
              {(user?.name || "Usuário")
                .split(" ")
                .map((n: string) => n[0])
                .slice(0, 2)
                .join("")}
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
              {user?.name || "Usuário"}
            </h2>

            <p className="mt-1 text-slate-500 dark:text-slate-400">
              {user?.email || ""}
            </p>

            <span className="mt-5 rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-400">
              {roleLabels[user?.orgRole] || "Membro"} ativo
            </span>
          </div>

          <button
            onClick={openProfileModal}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-4 font-bold text-slate-950 hover:bg-cyan-400"
          >
            <Edit size={20} />
            Editar perfil
          </button>
        </div>

        <div className="space-y-6 xl:col-span-2">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Informações da conta
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 p-5">
                <Mail className="text-cyan-400" />
                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">E-mail</p>
                <h3 className="mt-1 font-bold text-slate-900 dark:text-white">
                  {user?.email || "-"}
                </h3>
              </div>

              <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 p-5">
                <ShieldCheck className="text-emerald-400" />
                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Permissão</p>
                <h3 className="mt-1 font-bold text-slate-900 dark:text-white">
                  {roleLabels[user?.orgRole] || "Membro"}
                </h3>
              </div>

              <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 p-5">
                <Building2 className="text-purple-400" />
                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Empresa</p>
                <h3 className="mt-1 font-bold text-slate-900 dark:text-white">
                  {organization?.name || "-"}
                </h3>
              </div>

              <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 p-5">
                <CalendarDays className="text-yellow-400" />
                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Status da conta</p>
                <h3 className="mt-1 font-bold text-slate-900 dark:text-white">
                  {user?.status === "ACTIVE" ? "Ativa" : user?.status || "-"}
                </h3>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Segurança
            </h2>

            <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-slate-100 dark:bg-slate-800 p-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
                  <Lock />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Senha da conta</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Atualize sua senha periodicamente para manter a segurança.
                  </p>
                </div>
              </div>

              <button
                onClick={openPasswordModal}
                className="rounded-2xl border border-slate-300 dark:border-slate-700 px-5 py-3 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Alterar senha
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
        <div className="flex items-center gap-3">
          <Activity className="text-cyan-400" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Atividades recentes
          </h2>
        </div>

        <div className="mt-6 space-y-4">
          {activities.map((item) => (
            <div
              key={item}
              className="flex items-center gap-4 rounded-2xl bg-slate-100 dark:bg-slate-800 p-5"
            >
              <CheckCircle2 className="text-emerald-400" />
              <p className="text-slate-600 dark:text-slate-300">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <form
            onSubmit={handleChangePassword}
            className="w-full max-w-md rounded-3xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Alterar senha</h2>
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Fechar
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-red-700 bg-red-900/30 p-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <input
                type="password"
                placeholder="Senha atual"
                autoComplete="current-password"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-cyan-400"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                required
              />

              <input
                type="password"
                placeholder="Nova senha"
                autoComplete="new-password"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-cyan-400"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                minLength={8}
                pattern="(?=.*[A-Z])(?=.*[0-9]).{8,}"
                title="Mínimo 8 caracteres, com ao menos 1 letra maiúscula e 1 número"
                required
              />
              <p className="-mt-2 text-xs text-slate-400 dark:text-slate-500">
                Mínimo 8 caracteres, com ao menos 1 letra maiúscula e 1 número.
              </p>

              <input
                type="password"
                placeholder="Confirmar nova senha"
                autoComplete="new-password"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-cyan-400"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                minLength={8}
                required
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-6 w-full rounded-2xl bg-cyan-500 px-5 py-3 font-black text-slate-950 hover:bg-cyan-400 disabled:opacity-60"
            >
              {saving ? "Salvando..." : "Salvar nova senha"}
            </button>
          </form>
        </div>
      )}

      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <form
            onSubmit={handleSaveProfile}
            className="w-full max-w-md rounded-3xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Editar perfil</h2>
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Fechar
              </button>
            </div>

            {profileError && (
              <div className="mb-4 rounded-xl border border-red-700 bg-red-900/30 p-3 text-sm text-red-300">
                {profileError}
              </div>
            )}

            <div className="space-y-4">
              <input
                placeholder="Nome completo"
                autoComplete="name"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-cyan-400"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                minLength={2}
                required
              />

              <input
                placeholder="Telefone"
                autoComplete="tel"
                inputMode="tel"
                maxLength={16}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-cyan-400"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: maskPhone(e.target.value) })}
              />
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="mt-6 w-full rounded-2xl bg-cyan-500 px-5 py-3 font-black text-slate-950 hover:bg-cyan-400 disabled:opacity-60"
            >
              {savingProfile ? "Salvando..." : "Salvar alterações"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
