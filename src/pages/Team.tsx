import { useEffect, useState } from "react";
import { Users, Search, Plus, Mail, X, ShieldCheck } from "lucide-react";
import {
  getMembers,
  getMemberPermissions,
  updateMemberPermissions,
  type Member,
  type ModulePermission,
  type OrgModule,
} from "../services/organization";
import { getInvites, createInvite, revokeInvite, type Invite } from "../services/invites";
import { useToast } from "../components/Toast";
import { getErrorMessage } from "../utils/errors";
import {
  Badge,
  Button,
  Card,
  CardHeader,
  EmptyState,
  Field,
  Modal,
  PageContainer,
  SkeletonRows,
  StatStrip,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  inputClass,
} from "../components/ui";

const roleLabels: Record<string, string> = {
  OWNER: "Dono",
  ADMIN: "Administrador",
  MEMBER: "Membro",
};

const moduleLabels: Record<OrgModule, string> = {
  CONTACTS: "Contatos",
  INVOICES: "Financeiro",
  PRODUCTS: "Produtos",
  ORDERS: "Pedidos",
  EVENTS: "Agenda",
};

const ALL_MODULES: OrgModule[] = ["CONTACTS", "INVOICES", "PRODUCTS", "ORDERS", "EVENTS"];

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

export function Team() {
  const toast = useToast();
  const [members, setMembers] = useState<Member[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", role: "MEMBER" });

  const [permMember, setPermMember] = useState<Member | null>(null);
  const [permLoading, setPermLoading] = useState(false);
  const [permSaving, setPermSaving] = useState(false);
  const [permissions, setPermissions] = useState<ModulePermission[]>([]);

  async function load() {
    try {
      setLoading(true);
      const [membersList, invitesList] = await Promise.all([getMembers(), getInvites()]);
      setMembers(membersList);
      setInvites(invitesList.filter((i) => !i.acceptedAt));
    } catch (err) {
      console.error("Erro ao carregar equipe:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- busca inicial ao montar a tela
    load();
  }, []);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      setSaving(true);
      await createInvite(form.email, form.role);
      setShowModal(false);
      setForm({ email: "", role: "MEMBER" });
      await load();
      toast.success("Convite enviado com sucesso.");
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Erro ao enviar convite."));
    } finally {
      setSaving(false);
    }
  }

  async function handleRevoke(id: string) {
    try {
      await revokeInvite(id);
      await load();
      toast.success("Convite revogado.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao revogar convite."));
    }
  }

  async function openPermissionsModal(member: Member) {
    setPermMember(member);
    setPermLoading(true);
    setPermissions(ALL_MODULES.map((module) => ({ module, enabled: false })));
    try {
      const list = await getMemberPermissions(member.id);
      setPermissions(list);
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao carregar permissões do membro."));
    } finally {
      setPermLoading(false);
    }
  }

  function toggleModule(module: OrgModule) {
    setPermissions((current) =>
      current.map((p) => (p.module === module ? { ...p, enabled: !p.enabled } : p))
    );
  }

  async function handleSavePermissions() {
    if (!permMember) return;

    try {
      setPermSaving(true);
      await updateMemberPermissions(permMember.id, permissions);
      toast.success("Permissões atualizadas com sucesso.");
      setPermMember(null);
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao salvar permissões."));
    } finally {
      setPermSaving(false);
    }
  }

  const filtered = members.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()));
  const admins = members.filter((m) => m.orgRole === "OWNER" || m.orgRole === "ADMIN").length;

  return (
    <PageContainer>
      <StatStrip
        items={[
          { label: "Membros ativos", value: loading ? "..." : String(members.length) },
          { label: "Administradores", value: loading ? "..." : String(admins) },
          { label: "Convites pendentes", value: loading ? "..." : String(invites.length) },
        ]}
      />

      {invites.length > 0 && (
        <Card>
          <CardHeader title="Convites pendentes" />
          <div className="space-y-2.5 p-5">
            {invites.map((invite) => (
              <div
                key={invite.id}
                className="flex items-center justify-between rounded-md bg-[#F0EEE8] px-4 py-3 dark:bg-white/[0.06]"
              >
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-muted dark:text-muted-dark" />
                  <div>
                    <p className="text-[13px] font-medium">{invite.email}</p>
                    <p className="text-[12px] text-muted dark:text-muted-dark">
                      {roleLabels[invite.role] || invite.role} · expira em{" "}
                      {new Date(invite.expiresAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRevoke(invite.id)}
                  className="grid h-8 w-8 place-items-center rounded-md text-muted transition hover:bg-[#F6E4E1] hover:text-danger dark:text-muted-dark dark:hover:bg-danger-dark/10 dark:hover:text-danger-dark"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <CardHeader
          title="Membros da equipe"
          subtitle="Gerencie os usuários da sua empresa."
          action={
            <Button onClick={() => setShowModal(true)}>
              <Plus size={16} />
              Convidar membro
            </Button>
          }
        />

        <div className="flex items-center gap-2.5 border-b border-line px-5 py-3.5 dark:border-line-dark">
          <Search size={16} className="text-faint dark:text-faint-dark" />
          <input
            placeholder="Buscar membro..."
            className="w-full bg-transparent text-[13.5px] outline-none placeholder:text-faint dark:placeholder:text-faint-dark"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <SkeletonRows rows={5} cols={5} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Users size={20} />}
            title="Nenhum membro encontrado"
            description="Convide um colaborador ou ajuste os termos da busca."
          />
        ) : (
          <Table minWidth={700}>
            <Thead>
              <Tr>
                <Th>Nome</Th>
                <Th>Papel</Th>
                <Th>Status</Th>
                <Th>Desde</Th>
                <Th align="right">Permissões</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filtered.map((member) => (
                <Tr key={member.id}>
                  <Td>
                    <div className="flex items-center gap-3">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-forest-100 text-[11.5px] font-semibold text-forest-600 dark:bg-forest-900 dark:text-forest-400">
                        {getInitials(member.name)}
                      </span>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-[12px] text-muted dark:text-muted-dark">{member.email}</p>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <Badge tone={member.orgRole === "MEMBER" ? "neutral" : "positive"}>
                      {roleLabels[member.orgRole] || member.orgRole}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge tone={member.status === "ACTIVE" ? "positive" : "neutral"}>
                      {member.status === "ACTIVE" ? "Ativo" : member.status}
                    </Badge>
                  </Td>
                  <Td>{new Date(member.createdAt).toLocaleDateString("pt-BR")}</Td>
                  <Td align="right">
                    {member.orgRole === "MEMBER" ? (
                      <Button size="sm" variant="ghost" onClick={() => openPermissionsModal(member)}>
                        <ShieldCheck size={14} />
                        Gerenciar
                      </Button>
                    ) : (
                      <span className="text-[12px] text-faint dark:text-faint-dark">Acesso total</span>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Card>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Convidar membro"
        subtitle="Envie um convite por e-mail para um novo colaborador."
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button type="submit" form="invite-form" loading={saving}>
              Enviar convite
            </Button>
          </>
        }
      >
        <form id="invite-form" onSubmit={handleInvite} className="space-y-4">
          {error && <p className="rounded-md bg-[#F6E4E1] px-3.5 py-2.5 text-[12.5px] text-danger dark:bg-danger-dark/10 dark:text-danger-dark">{error}</p>}

          <Field label="E-mail do convidado">
            <input
              type="email"
              className={inputClass}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </Field>

          <Field label="Papel">
            <select
              className={inputClass}
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="MEMBER">Membro</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </Field>
        </form>
      </Modal>

      <Modal
        open={!!permMember}
        onClose={() => setPermMember(null)}
        title="Permissões por módulo"
        subtitle={permMember ? `${permMember.name} — acesso liberado a cada módulo.` : undefined}
        footer={
          <>
            <Button variant="ghost" onClick={() => setPermMember(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSavePermissions} loading={permSaving} disabled={permLoading}>
              Salvar permissões
            </Button>
          </>
        }
      >
        {permLoading ? (
          <p className="text-[13px] text-muted dark:text-muted-dark">Carregando...</p>
        ) : (
          <div className="space-y-2">
            {ALL_MODULES.map((module) => {
              const entry = permissions.find((p) => p.module === module);
              const enabled = entry?.enabled ?? false;
              return (
                <label
                  key={module}
                  className="flex items-center justify-between rounded-md border border-line px-3.5 py-2.5 dark:border-line-dark"
                >
                  <span className="text-[13px] font-medium">{moduleLabels[module]}</span>
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={() => toggleModule(module)}
                    className="h-4 w-4 accent-forest dark:accent-forest-400"
                  />
                </label>
              );
            })}
          </div>
        )}
      </Modal>
    </PageContainer>
  );
}
