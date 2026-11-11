import { useEffect, useState } from "react";
import { Save, CheckCircle2, Users, Sun, Moon } from "lucide-react";
import {
  getMyOrganization,
  updateOrganization,
  deleteOrganization,
  type OrganizationDetails,
  type TaxRegime,
} from "../services/organization";
import { getPlans, changePlan, checkoutPlan, openBillingPortal, type Plan } from "../services/plans";
import { useToast } from "../components/Toast";
import { useTheme } from "../components/Theme";
import { clearSession, getStoredUser } from "../services/auth";
import { maskCpfCnpj, maskPhone } from "../utils/masks";
import { getErrorMessage } from "../utils/errors";
import { Button, Card, CardHeader, Field, Modal, PageContainer, inputClass } from "../components/ui";

function formatPrice(value: string | number) {
  const n = Number(value);
  if (n === 0) return "Grátis";
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const taxRegimeLabels: Record<TaxRegime, string> = {
  MEI: "MEI",
  SIMPLES_NACIONAL: "Simples Nacional",
  LUCRO_PRESUMIDO: "Lucro Presumido",
  LUCRO_REAL: "Lucro Real",
};

export function Settings() {
  const toast = useToast();
  const { theme, toggleTheme } = useTheme();
  const [organization, setOrganization] = useState<OrganizationDetails | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPlan, setChangingPlan] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ name: "", document: "", email: "", phone: "", taxRegime: "" });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleting, setDeleting] = useState(false);
  const currentUser = getStoredUser();
  const isOwner = currentUser?.orgRole === "OWNER";

  async function load() {
    try {
      setLoading(true);
      const [org, planList] = await Promise.all([getMyOrganization(), getPlans()]);
      setOrganization(org);
      setPlans(planList);
      setForm({
        name: org.name || "",
        document: org.document || "",
        email: org.email || "",
        phone: org.phone || "",
        taxRegime: org.taxRegime || "",
      });
    } catch (err) {
      console.error("Erro ao carregar configurações:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- busca inicial dos dados da empresa/planos ao montar a tela
    load();

    const params = new URLSearchParams(window.location.search);
    const checkout = params.get("checkout");
    if (checkout === "sucesso") {
      toast.success("Pagamento confirmado! Seu plano será atualizado em instantes.");
      window.history.replaceState({}, "", "/configuracoes");
    } else if (checkout === "cancelado") {
      toast.error("Checkout cancelado. Nenhuma cobrança foi feita.");
      window.history.replaceState({}, "", "/configuracoes");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSaveOrganization(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    try {
      setSaving(true);
      await updateOrganization({ ...form, taxRegime: form.taxRegime || null });
      setMessage("Dados da empresa atualizados com sucesso.");
      await load();
    } catch (err: unknown) {
      setMessage(getErrorMessage(err, "Erro ao salvar dados da empresa."));
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePlan(slug: string) {
    // Plano Free não passa pelo Stripe — troca direta. Planos pagos
    // exigem checkout no Stripe (o webhook ativa a assinatura depois).
    if (slug === "free") {
      try {
        setChangingPlan(true);
        await changePlan(slug);
        await load();
        toast.success("Plano alterado com sucesso.");
      } catch (err: unknown) {
        toast.error(getErrorMessage(err, "Erro ao trocar de plano."));
      } finally {
        setChangingPlan(false);
      }
      return;
    }

    try {
      setChangingPlan(true);
      const url = await checkoutPlan(slug);
      // eslint-disable-next-line react-hooks/immutability -- redireciona pro checkout do Stripe, fora da SPA
      window.location.href = url;
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Erro ao iniciar checkout do plano."));
      setChangingPlan(false);
    }
  }

  async function handleOpenPortal() {
    try {
      setChangingPlan(true);
      const url = await openBillingPortal();
      window.location.href = url;
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Erro ao abrir o portal de cobrança."));
      setChangingPlan(false);
    }
  }

  async function handleDeleteOrganization() {
    try {
      setDeleting(true);
      await deleteOrganization(deletePassword);
      toast.success("Empresa excluída. Você será desconectado.");
      clearSession();
      setTimeout(() => {
        window.location.href = "/";
      }, 1200);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Erro ao excluir a empresa."));
      setDeleting(false);
    }
  }

  const currentPlanSlug = organization?.subscription?.plan?.slug;

  return (
    <PageContainer>
      <Card>
        <CardHeader title="Dados da empresa" />
        <div className="p-5">
          {message && (
            <p className="mb-4 rounded-md bg-forest-100 px-3.5 py-2.5 text-[12.5px] text-forest-600 dark:bg-forest-900 dark:text-forest-400">
              {message}
            </p>
          )}

          <form onSubmit={handleSaveOrganization} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Nome da empresa">
              <input
                className={inputClass}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </Field>

            <Field label="CNPJ/CPF">
              <input
                inputMode="numeric"
                maxLength={18}
                className={inputClass}
                value={form.document}
                onChange={(e) => setForm({ ...form, document: maskCpfCnpj(e.target.value) })}
              />
            </Field>

            <Field label="E-mail da empresa">
              <input
                type="email"
                className={inputClass}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </Field>

            <Field label="Telefone">
              <input
                inputMode="tel"
                maxLength={16}
                className={inputClass}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: maskPhone(e.target.value) })}
              />
            </Field>

            <Field label="Regime tributário" hint="Usado para lembretes de obrigações fiscais (ex.: DAS).">
              <select
                className={inputClass}
                value={form.taxRegime}
                onChange={(e) => setForm({ ...form, taxRegime: e.target.value })}
              >
                <option value="">Não informado</option>
                {Object.entries(taxRegimeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>

            <div className="flex items-end sm:col-span-2">
              <Button type="submit" loading={saving || loading}>
                <Save size={16} />
                {saving ? "Salvando..." : "Salvar alterações"}
              </Button>
            </div>
          </form>
        </div>
      </Card>

      <Card>
        <CardHeader title="Aparência" />
        <div className="p-5">
          <div className="flex items-center justify-between rounded-md bg-[#F0EEE8] p-4 dark:bg-white/[0.06]">
            <div className="flex items-center gap-3">
              {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
              <div>
                <h3 className="text-[14px] font-semibold">Modo escuro</h3>
                <p className="text-[12.5px] text-muted dark:text-muted-dark">
                  {theme === "dark" ? "Interface escura ativada." : "Interface clara ativada."}
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={theme === "dark"}
              onClick={toggleTheme}
              className={`relative h-6 w-11 shrink-0 rounded-full p-0.5 transition-colors ${
                theme === "dark" ? "bg-forest-600 dark:bg-forest-400" : "bg-[#D8D4C8] dark:bg-white/20"
              }`}
            >
              <div
                className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  theme === "dark" ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Plano e assinatura"
          action={
            organization?.subscription?.status && currentPlanSlug !== "free" ? (
              <Button variant="ghost" loading={changingPlan} onClick={handleOpenPortal}>
                Gerenciar cobrança
              </Button>
            ) : undefined
          }
        />

        <div className="p-5">
          {loading ? (
            <p className="text-[13px] text-muted dark:text-muted-dark">Carregando plano atual...</p>
          ) : (
            <>
              <div className="flex flex-col gap-4 rounded-md bg-[#F0EEE8] p-4 dark:bg-white/[0.06] sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[12px] text-muted dark:text-muted-dark">Plano atual</p>
                  <h3 className="text-[16px] font-semibold">{organization?.subscription?.plan?.name || "Sem plano"}</h3>
                  <p className="mt-0.5 text-[12.5px] text-muted dark:text-muted-dark">
                    Status: {organization?.subscription?.status || "-"}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[12.5px] text-muted dark:text-muted-dark">
                  <Users size={15} />
                  {organization?._count?.users ?? 0} / {organization?.subscription?.plan?.maxUsers ?? "-"} usuários
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`rounded-md border p-4 ${
                      plan.slug === currentPlanSlug
                        ? "border-forest-600/40 bg-forest-100 dark:border-forest-400/40 dark:bg-forest-900"
                        : "border-line bg-surface dark:border-line-dark dark:bg-surface-dark"
                    }`}
                  >
                    <h3 className="text-[14px] font-semibold">{plan.name}</h3>
                    <p className="mt-1 font-display text-[24px]">{formatPrice(plan.priceMonthly)}</p>
                    <p className="mt-1.5 text-[12px] text-muted dark:text-muted-dark">
                      Até {plan.maxUsers} usuários · {plan.maxContacts.toLocaleString("pt-BR")} contatos
                    </p>

                    <Button
                      className="mt-3 w-full justify-center"
                      size="sm"
                      disabled={plan.slug === currentPlanSlug || changingPlan}
                      onClick={() => handleChangePlan(plan.slug)}
                    >
                      {plan.slug === currentPlanSlug ? "Plano atual" : "Selecionar"}
                    </Button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </Card>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Notificações" />
          <div className="space-y-2.5 p-5">
            {[
              "Receber alertas de agenda",
              "Receber avisos financeiros",
              "Atualizações administrativas",
              "Convites de equipe",
            ].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-md bg-[#F0EEE8] p-4 dark:bg-white/[0.06]">
                <span className="text-[13px] font-medium">{item}</span>
                <div className="h-6 w-11 rounded-full bg-forest-600 p-0.5 dark:bg-forest-400">
                  <div className="ml-auto h-5 w-5 rounded-full bg-white" />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Segurança" />
          <div className="space-y-4 p-5">
            <div className="rounded-md bg-[#F0EEE8] p-4 dark:bg-white/[0.06]">
              <h3 className="text-[14px] font-semibold">Autenticação</h3>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted dark:text-muted-dark">
                Sua conta usa autenticação JWT com tokens de acesso e renovação segura.
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 rounded px-2 py-1 text-[11.5px] font-medium">
                <CheckCircle2 size={14} className="text-forest-600 dark:text-forest-400" />
                <span className="text-forest-600 dark:text-forest-400">Segurança ativa</span>
              </span>
            </div>

            <div className="rounded-md bg-[#F0EEE8] p-4 dark:bg-white/[0.06]">
              <h3 className="text-[14px] font-semibold">Controle de acesso</h3>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted dark:text-muted-dark">
                Papéis de dono, administrador e membro controlam o que cada usuário pode fazer na sua empresa.
              </p>
            </div>
          </div>
        </Card>
      </section>

      <Card>
        <CardHeader title="Sistema" />
        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
          <div className="rounded-md bg-[#F0EEE8] p-4 dark:bg-white/[0.06]">
            <h3 className="text-[14px] font-semibold">Banco de dados</h3>
            <p className="mt-1.5 text-[12.5px] text-muted dark:text-muted-dark">
              Backend Node.js com Prisma ORM e PostgreSQL, isolado por empresa (multi-tenant).
            </p>
          </div>

          <div className="rounded-md bg-[#F0EEE8] p-4 dark:bg-white/[0.06]">
            <h3 className="text-[14px] font-semibold">Deploy</h3>
            <p className="mt-1.5 text-[12.5px] text-muted dark:text-muted-dark">
              Plataforma hospedada em produção na Vercel + Render.
            </p>
          </div>
        </div>
      </Card>

      {isOwner && (
        <Card className="border-[#E7C9C4] dark:border-danger-dark/40">
          <CardHeader title="Zona de risco" />
          <div className="p-5">
            <div className="flex flex-col gap-4 rounded-md bg-[#F6E4E1] p-4 dark:bg-danger-dark/10 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-[14px] font-semibold">Excluir empresa</h3>
                <p className="mt-1 text-[12.5px] text-muted dark:text-muted-dark">
                  Remove permanentemente sua empresa e todos os dados associados (contatos, financeiro,
                  produtos, pedidos, agenda e equipe). Essa ação não pode ser desfeita.
                </p>
              </div>
              <Button variant="danger" onClick={() => setDeleteModalOpen(true)}>
                Excluir empresa
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Modal
        open={deleteModalOpen}
        onClose={() => {
          if (!deleting) {
            setDeleteModalOpen(false);
            setDeletePassword("");
          }
        }}
        title="Excluir empresa"
        subtitle={`Essa ação é permanente. Digite sua senha para confirmar a exclusão de ${organization?.name ?? ""} e de todos os seus dados.`}
        footer={
          <>
            <Button
              variant="ghost"
              disabled={deleting}
              onClick={() => {
                setDeleteModalOpen(false);
                setDeletePassword("");
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              loading={deleting}
              disabled={!deletePassword}
              onClick={handleDeleteOrganization}
            >
              {deleting ? "Excluindo..." : "Excluir permanentemente"}
            </Button>
          </>
        }
      >
        <Field label="Sua senha">
          <input
            type="password"
            autoFocus
            className={inputClass}
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
          />
        </Field>
      </Modal>
    </PageContainer>
  );
}
