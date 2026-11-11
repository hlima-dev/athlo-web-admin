import { useState } from "react";
import { Mail, ShieldCheck, CalendarDays, Building2, Edit, Lock, Activity, CheckCircle2 } from "lucide-react";
import { changePassword, getStoredOrganization, getStoredUser, updateProfile } from "../services/auth";
import { useToast } from "../components/Toast";
import { maskPhone } from "../utils/masks";
import { getErrorMessage, getFirstFieldError } from "../utils/errors";
import { Badge, Button, Card, CardHeader, Field, Modal, PageContainer, inputClass } from "../components/ui";

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

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", phone: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");

  function openPasswordModal() {
    setPasswordForm(emptyPasswordForm);
    setError("");
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
      toast.success("Perfil atualizado com sucesso.");
    } catch (err: unknown) {
      const firstFieldError = getFirstFieldError(err);
      setProfileError(firstFieldError || getErrorMessage(err, "Erro ao atualizar perfil."));
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
      toast.success("Senha alterada com sucesso.");
    } catch (err: unknown) {
      const firstFieldError = getFirstFieldError(err);
      setError(firstFieldError || getErrorMessage(err, "Erro ao alterar senha."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <PageContainer>
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-1">
          <div className="flex flex-col items-center p-6 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-forest-100 font-display text-xl text-forest-600 dark:bg-forest-900 dark:text-forest-400">
              {(user?.name || "Usuário")
                .split(" ")
                .map((n: string) => n[0])
                .slice(0, 2)
                .join("")}
            </div>

            <h2 className="mt-4 text-[16px] font-semibold">{user?.name || "Usuário"}</h2>
            <p className="mt-0.5 text-[12.5px] text-muted dark:text-muted-dark">{user?.email || ""}</p>

            <div className="mt-4">
              <Badge tone="positive">{roleLabels[user?.orgRole] || "Membro"} ativo</Badge>
            </div>

            <Button className="mt-6 w-full" onClick={openProfileModal}>
              <Edit size={16} />
              Editar perfil
            </Button>
          </div>
        </Card>

        <div className="space-y-6 xl:col-span-2">
          <Card>
            <CardHeader title="Informações da conta" />
            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
              <div className="rounded-md bg-[#F0EEE8] p-4 dark:bg-white/[0.06]">
                <Mail size={18} className="text-muted dark:text-muted-dark" />
                <p className="mt-3 text-[12px] text-muted dark:text-muted-dark">E-mail</p>
                <h3 className="mt-0.5 text-[13.5px] font-medium">{user?.email || "-"}</h3>
              </div>

              <div className="rounded-md bg-[#F0EEE8] p-4 dark:bg-white/[0.06]">
                <ShieldCheck size={18} className="text-muted dark:text-muted-dark" />
                <p className="mt-3 text-[12px] text-muted dark:text-muted-dark">Permissão</p>
                <h3 className="mt-0.5 text-[13.5px] font-medium">{roleLabels[user?.orgRole] || "Membro"}</h3>
              </div>

              <div className="rounded-md bg-[#F0EEE8] p-4 dark:bg-white/[0.06]">
                <Building2 size={18} className="text-muted dark:text-muted-dark" />
                <p className="mt-3 text-[12px] text-muted dark:text-muted-dark">Empresa</p>
                <h3 className="mt-0.5 text-[13.5px] font-medium">{organization?.name || "-"}</h3>
              </div>

              <div className="rounded-md bg-[#F0EEE8] p-4 dark:bg-white/[0.06]">
                <CalendarDays size={18} className="text-muted dark:text-muted-dark" />
                <p className="mt-3 text-[12px] text-muted dark:text-muted-dark">Status da conta</p>
                <h3 className="mt-0.5 text-[13.5px] font-medium">
                  {user?.status === "ACTIVE" ? "Ativa" : user?.status || "-"}
                </h3>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Segurança" />
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3.5">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-forest-100 text-forest-600 dark:bg-forest-900 dark:text-forest-400">
                  <Lock size={18} />
                </div>
                <div>
                  <h3 className="text-[14px] font-semibold">Senha da conta</h3>
                  <p className="text-[12.5px] text-muted dark:text-muted-dark">
                    Atualize sua senha periodicamente para manter a segurança.
                  </p>
                </div>
              </div>

              <Button variant="ghost" onClick={openPasswordModal}>
                Alterar senha
              </Button>
            </div>
          </Card>
        </div>
      </section>

      <Card>
        <CardHeader
          title="Atividades recentes"
          action={<Activity size={18} className="text-muted dark:text-muted-dark" />}
        />
        <div className="space-y-2.5 p-5">
          {activities.map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-md bg-[#F0EEE8] px-4 py-3 dark:bg-white/[0.06]">
              <CheckCircle2 size={16} className="text-forest-600 dark:text-forest-400" />
              <p className="text-[13px]">{item}</p>
            </div>
          ))}
        </div>
      </Card>

      <Modal
        open={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Alterar senha"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowPasswordModal(false)}>
              Cancelar
            </Button>
            <Button type="submit" form="password-form" loading={saving}>
              Salvar nova senha
            </Button>
          </>
        }
      >
        <form id="password-form" onSubmit={handleChangePassword} className="space-y-4">
          {error && <p className="rounded-md bg-[#F6E4E1] px-3.5 py-2.5 text-[12.5px] text-danger dark:bg-danger-dark/10 dark:text-danger-dark">{error}</p>}

          <Field label="Senha atual">
            <input
              type="password"
              autoComplete="current-password"
              className={inputClass}
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              required
            />
          </Field>

          <Field label="Nova senha" hint="Mínimo 8 caracteres, com ao menos 1 letra maiúscula e 1 número.">
            <input
              type="password"
              autoComplete="new-password"
              className={inputClass}
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              minLength={8}
              pattern="(?=.*[A-Z])(?=.*[0-9]).{8,}"
              title="Mínimo 8 caracteres, com ao menos 1 letra maiúscula e 1 número"
              required
            />
          </Field>

          <Field label="Confirmar nova senha">
            <input
              type="password"
              autoComplete="new-password"
              className={inputClass}
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              minLength={8}
              required
            />
          </Field>
        </form>
      </Modal>

      <Modal
        open={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        title="Editar perfil"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowProfileModal(false)}>
              Cancelar
            </Button>
            <Button type="submit" form="profile-form" loading={savingProfile}>
              Salvar alterações
            </Button>
          </>
        }
      >
        <form id="profile-form" onSubmit={handleSaveProfile} className="space-y-4">
          {profileError && <p className="rounded-md bg-[#F6E4E1] px-3.5 py-2.5 text-[12.5px] text-danger dark:bg-danger-dark/10 dark:text-danger-dark">{profileError}</p>}

          <Field label="Nome completo">
            <input
              autoComplete="name"
              className={inputClass}
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              minLength={2}
              required
            />
          </Field>

          <Field label="Telefone">
            <input
              autoComplete="tel"
              inputMode="tel"
              maxLength={16}
              className={inputClass}
              value={profileForm.phone}
              onChange={(e) => setProfileForm({ ...profileForm, phone: maskPhone(e.target.value) })}
            />
          </Field>
        </form>
      </Modal>
    </PageContainer>
  );
}
