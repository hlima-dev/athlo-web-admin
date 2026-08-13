import { useEffect, useState } from "react";
import {
  Settings as SettingsIcon,
  Building2,
  CreditCard,
  Bell,
  ShieldCheck,
  Database,
  Save,
  CheckCircle2,
  Users,
} from "lucide-react";
import { getMyOrganization, updateOrganization, type OrganizationDetails } from "../services/organization";
import { getPlans, changePlan, type Plan } from "../services/plans";
import { PageHeader } from "../components/PageHeader";

function formatPrice(value: string | number) {
  const n = Number(value);
  if (n === 0) return "Grátis";
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function Settings() {
  const [organization, setOrganization] = useState<OrganizationDetails | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPlan, setChangingPlan] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ name: "", document: "", email: "", phone: "" });

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
      });
    } catch (err) {
      console.error("Erro ao carregar configurações:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSaveOrganization(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    try {
      setSaving(true);
      await updateOrganization(form);
      setMessage("Dados da empresa atualizados com sucesso.");
      await load();
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Erro ao salvar dados da empresa.");
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePlan(slug: string) {
    try {
      setChangingPlan(true);
      await changePlan(slug);
      await load();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Erro ao trocar de plano.");
    } finally {
      setChangingPlan(false);
    }
  }

  const currentPlanSlug = organization?.subscription?.plan?.slug;

  return (
    <div className="space-y-8">
      <PageHeader
        icon={SettingsIcon}
        title="Configurações"
        description="Gerencie os dados da empresa, o plano de assinatura e preferências."
      />

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex items-center gap-3">
          <Building2 className="text-cyan-400" />
          <h2 className="text-lg font-bold text-white">Dados da empresa</h2>
        </div>

        {message && (
          <div className="mt-4 rounded-xl border border-cyan-700 bg-cyan-900/20 p-3 text-sm text-cyan-300">
            {message}
          </div>
        )}

        <form onSubmit={handleSaveOrganization} className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            placeholder="Nome da empresa"
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            placeholder="CNPJ/CPF"
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
            value={form.document}
            onChange={(e) => setForm({ ...form, document: e.target.value })}
          />
          <input
            type="email"
            placeholder="E-mail da empresa"
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            placeholder="Telefone"
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <button
            type="submit"
            disabled={saving || loading}
            className="md:col-span-2 inline-flex items-center justify-center gap-3 rounded-2xl bg-cyan-500 px-8 py-4 font-bold text-slate-950 hover:bg-cyan-400 disabled:opacity-60"
          >
            <Save size={20} />
            {saving ? "Salvando..." : "Salvar alterações"}
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex items-center gap-3">
          <CreditCard className="text-emerald-400" />
          <h2 className="text-lg font-bold text-white">Plano e assinatura</h2>
        </div>

        {loading ? (
          <p className="mt-6 text-slate-400">Carregando plano atual...</p>
        ) : (
          <>
            <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-slate-800 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-400">Plano atual</p>
                <h3 className="text-lg font-bold text-white">
                  {organization?.subscription?.plan?.name || "Sem plano"}
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Status: {organization?.subscription?.status || "-"}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Users size={16} />
                {organization?._count?.users ?? 0} / {organization?.subscription?.plan?.maxUsers ?? "-"} usuários
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`rounded-2xl border p-5 ${
                    plan.slug === currentPlanSlug
                      ? "border-cyan-500 bg-cyan-500/10"
                      : "border-slate-700 bg-slate-800"
                  }`}
                >
                  <h3 className="font-bold text-white">{plan.name}</h3>
                  <p className="mt-1 text-2xl font-black text-cyan-400">
                    {formatPrice(plan.priceMonthly)}
                  </p>
                  <p className="mt-2 text-xs text-slate-400">
                    Até {plan.maxUsers} usuários · {plan.maxContacts.toLocaleString("pt-BR")} contatos
                  </p>

                  <button
                    disabled={plan.slug === currentPlanSlug || changingPlan}
                    onClick={() => handleChangePlan(plan.slug)}
                    className="mt-4 w-full rounded-xl bg-cyan-500 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-cyan-400 disabled:opacity-40"
                  >
                    {plan.slug === currentPlanSlug ? "Plano atual" : "Selecionar"}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center gap-3">
            <Bell className="text-yellow-400" />
            <h2 className="text-lg font-bold text-white">
              Notificações
            </h2>
          </div>

          <div className="mt-6 space-y-5">
            {[
              "Receber alertas de agenda",
              "Receber avisos financeiros",
              "Atualizações administrativas",
              "Convites de equipe",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between rounded-2xl bg-slate-800 p-5"
              >
                <span className="font-semibold text-slate-200">
                  {item}
                </span>

                <div className="h-7 w-14 rounded-full bg-cyan-500 p-1">
                  <div className="ml-auto h-5 w-5 rounded-full bg-white" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-emerald-400" />
            <h2 className="text-lg font-bold text-white">
              Segurança
            </h2>
          </div>

          <div className="mt-6 space-y-5">
            <div className="rounded-2xl bg-slate-800 p-5">
              <h3 className="font-bold text-white">
                Autenticação
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Sua conta usa autenticação JWT com tokens de acesso e
                renovação segura.
              </p>

              <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-400">
                <CheckCircle2 size={16} />
                Segurança ativa
              </span>
            </div>

            <div className="rounded-2xl bg-slate-800 p-5">
              <h3 className="font-bold text-white">
                Controle de acesso
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Papéis de dono, administrador e membro controlam o que cada
                usuário pode fazer na sua empresa.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex items-center gap-3">
          <Database className="text-purple-400" />
          <h2 className="text-lg font-bold text-white">
            Sistema
          </h2>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-800 p-5">
            <h3 className="font-bold text-white">
              Banco de dados
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Backend Node.js com Prisma ORM e PostgreSQL, isolado por
              empresa (multi-tenant).
            </p>
          </div>

          <div className="rounded-2xl bg-slate-800 p-5">
            <h3 className="font-bold text-white">
              Deploy
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Plataforma hospedada em produção na Vercel + Render.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
