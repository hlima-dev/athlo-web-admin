import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Bell, Plus, FileCode, FileDown, FileUp, Wallet } from "lucide-react";
import {
  getInvoices,
  createInvoice,
  updateInvoice,
  markInvoicePaid,
  deleteInvoice,
  importInvoiceXml,
  type Invoice,
  type InvoicesSummary,
} from "../services/invoices";
import type { PageMeta } from "../services/api";
import { RowActionsMenu } from "../components/RowActionsMenu";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useToast } from "../components/Toast";
import { downloadFile, openPdf } from "../services/api";
import { getErrorMessage } from "../utils/errors";
import {
  Badge,
  type BadgeTone,
  Button,
  Card,
  CardHeader,
  EmptyState,
  ErrorNote,
  Field,
  Modal,
  PageContainer,
  Pagination,
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

function toCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(value?: string) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("pt-BR");
}

const statusLabels: Record<string, string> = {
  PENDING: "Pendente",
  PAID: "Paga",
  OVERDUE: "Vencida",
  CANCELED: "Cancelada",
};

const statusTones: Record<string, BadgeTone> = {
  PENDING: "warn",
  PAID: "positive",
  OVERDUE: "negative",
  CANCELED: "neutral",
};

const methodLabels: Record<string, string> = {
  PIX: "PIX",
  CREDIT_CARD: "Cartão de crédito",
  BANK_TRANSFER: "Transferência",
  BOLETO: "Boleto",
  CASH: "Dinheiro",
  OTHER: "Outro",
};

const emptyForm = {
  type: "RECEIVABLE",
  description: "",
  amount: "",
  dueDate: "",
  method: "PIX",
  notes: "",
};

function toDateInput(value?: string) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export function Financeiro() {
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [summary, setSummary] = useState<InvoicesSummary | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Invoice | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [markingPaidId, setMarkingPaidId] = useState<string | null>(null);
  const [importingXml, setImportingXml] = useState(false);
  const [importedAccessKey, setImportedAccessKey] = useState<string | null>(null);
  const [importedXml, setImportedXml] = useState<string | null>(null);
  const xmlInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState(emptyForm);

  async function loadInvoices(targetPage = page) {
    try {
      setLoading(true);
      setError("");
      const result = await getInvoices({ page: String(targetPage) });
      setInvoices(result.items);
      setMeta(result.meta ?? null);
      setSummary(result.summary ?? null);
      setPage(targetPage);
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err, "Erro ao carregar faturas."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- busca inicial ao montar a tela
    loadInvoices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ?novo=1 (link de criação rápida do header) abre o modal de criação —
  // só na montagem, de propósito (searchParams muda de identidade a cada
  // render e não deve reexecutar isso)
  useEffect(() => {
    if (searchParams.get("novo") === "1") {
      openCreateModal();
      const next = new URLSearchParams(searchParams);
      next.delete("novo");
      setSearchParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openCreateModal() {
    setEditingId(null);
    setForm(emptyForm);
    setImportedAccessKey(null);
    setImportedXml(null);
    setError("");
    setShowModal(true);
  }

  function openEditModal(invoice: Invoice) {
    setEditingId(invoice.id);
    setForm({
      type: invoice.type,
      description: invoice.description,
      amount: String(invoice.amount ?? ""),
      dueDate: invoice.dueDate ? invoice.dueDate.slice(0, 10) : "",
      method: invoice.method || "PIX",
      notes: invoice.notes || "",
    });
    setImportedAccessKey(null);
    setImportedXml(null);
    setError("");
    setShowModal(true);
  }

  async function handleImportXmlFile(file: File) {
    setError("");
    try {
      setImportingXml(true);
      const xmlText = await file.text();
      const draft = await importInvoiceXml(xmlText);

      setEditingId(null);
      setForm({
        type: draft.suggestedType,
        description: `NF-e ${draft.issuerName}`,
        amount: String(draft.totalValue),
        dueDate: toDateInput(draft.issueDate) || new Date().toISOString().slice(0, 10),
        method: "PIX",
        notes: draft.itemsSummary ? `Itens: ${draft.itemsSummary}` : "",
      });
      setImportedAccessKey(draft.accessKey);
      setImportedXml(xmlText);
      setShowModal(true);
      toast.success("Nota fiscal lida com sucesso! Revise os dados e salve.");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Erro ao ler o XML da nota fiscal."));
    } finally {
      setImportingXml(false);
    }
  }

  async function handleSaveInvoice(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      setSaving(true);
      const payload = {
        type: form.type,
        description: form.description,
        amount: Number(form.amount),
        dueDate: form.dueDate,
        method: form.method,
        notes: form.notes,
        ...(!editingId && importedAccessKey ? { accessKey: importedAccessKey } : {}),
        ...(!editingId && importedXml ? { xmlRaw: importedXml } : {}),
      };

      if (editingId) {
        await updateInvoice(editingId, payload);
      } else {
        await createInvoice(payload);
      }

      setShowModal(false);
      setForm(emptyForm);
      setEditingId(null);
      setImportedAccessKey(null);
      setImportedXml(null);
      await loadInvoices();
      toast.success(editingId ? "Fatura atualizada com sucesso." : "Fatura cadastrada com sucesso.");
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Erro ao salvar fatura."));
    } finally {
      setSaving(false);
    }
  }

  async function handleMarkPaid(id: string) {
    try {
      setMarkingPaidId(id);
      await markInvoicePaid(id);
      await loadInvoices();
      toast.success("Fatura marcada como paga.");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Erro ao marcar fatura como paga."));
    } finally {
      setMarkingPaidId(null);
    }
  }

  async function confirmDeleteInvoice() {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      await deleteInvoice(deleteTarget.id);
      setDeleteTarget(null);
      await loadInvoices();
      toast.success("Fatura excluída com sucesso.");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Erro ao excluir fatura."));
    } finally {
      setDeleting(false);
    }
  }

  // Vem do backend (agregado da organização inteira) — não soma só os
  // 20 itens carregados na página atual, ao contrário do que a UI fazia antes.
  const stats = summary ?? { totalReceivable: 0, totalPayable: 0, pending: 0, overdue: 0 };

  return (
    <PageContainer>
      <StatStrip
        items={[
          { label: "Recebido", value: loading ? "..." : toCurrency(stats.totalReceivable) },
          { label: "Pago", value: loading ? "..." : toCurrency(stats.totalPayable) },
          { label: "Faturas pendentes", value: loading ? "..." : String(stats.pending) },
          {
            label: "Faturas vencidas",
            value: loading ? "..." : String(stats.overdue),
            tone: stats.overdue > 0 ? "danger" : "default",
          },
        ]}
      />

      <Card>
        <CardHeader
          title="Faturas"
          subtitle="Contas a pagar e a receber salvas no banco."
          action={
            <div className="flex items-center gap-2">
              <input
                ref={xmlInputRef}
                type="file"
                accept=".xml,text/xml,application/xml"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImportXmlFile(file);
                  e.target.value = "";
                }}
              />
              <Button
                variant="ghost"
                loading={importingXml}
                onClick={() => xmlInputRef.current?.click()}
              >
                <FileUp size={16} />
                {importingXml ? "Lendo XML..." : "Importar NF-e (XML)"}
              </Button>
              <Button onClick={openCreateModal}>
                <Plus size={16} />
                Nova fatura
              </Button>
            </div>
          }
        />

        {error ? <ErrorNote message={error} onRetry={loadInvoices} /> : null}

        {loading ? (
          <SkeletonRows rows={5} cols={5} />
        ) : invoices.length === 0 ? (
          <EmptyState
            icon={<Wallet size={20} />}
            title="Nenhuma fatura encontrada"
            description="Cadastre uma conta a pagar ou a receber para começar."
            action={
              <Button onClick={openCreateModal}>
                <Plus size={16} />
                Nova fatura
              </Button>
            }
          />
        ) : (
          <Table minWidth={760}>
            <Thead>
              <Tr>
                <Th>Descrição</Th>
                <Th>Tipo</Th>
                <Th>Status</Th>
                <Th>Vencimento</Th>
                <Th align="right">Valor</Th>
                <Th align="right">Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {invoices.map((invoice) => (
                <Tr key={invoice.id}>
                  <Td>
                    <p className="font-medium">{invoice.description}</p>
                    {invoice.method && (
                      <p className="mt-0.5 text-[12px] text-muted dark:text-muted-dark">
                        {methodLabels[invoice.method] || invoice.method}
                      </p>
                    )}
                    {invoice.accessKey && (
                      <p className="mt-0.5 truncate font-mono text-[11px] text-faint dark:text-faint-dark">
                        NF-e: {invoice.accessKey}
                      </p>
                    )}
                  </Td>
                  <Td>
                    <Badge tone={invoice.type === "RECEIVABLE" ? "info" : "neutral"}>
                      {invoice.type === "RECEIVABLE" ? "A receber" : "A pagar"}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge tone={statusTones[invoice.status] ?? "neutral"}>
                      {statusLabels[invoice.status] || invoice.status}
                    </Badge>
                    {(invoice.reminderSentAt || invoice.dueSoonReminderSentAt) && (
                      <p className="mt-1 flex items-center gap-1 text-[11px] text-muted dark:text-muted-dark">
                        <Bell size={11} />
                        Lembrete em{" "}
                        {formatDate(
                          [invoice.reminderSentAt, invoice.dueSoonReminderSentAt]
                            .filter((d): d is string => !!d)
                            .sort()
                            .pop()
                        )}
                      </p>
                    )}
                  </Td>
                  <Td>{formatDate(invoice.dueDate)}</Td>
                  <Td
                    align="right"
                    className={`font-medium tabular-nums ${
                      invoice.type === "RECEIVABLE"
                        ? "text-forest-600 dark:text-forest-400"
                        : "text-danger dark:text-danger-dark"
                    }`}
                  >
                    {toCurrency(Number(invoice.amount || 0))}
                  </Td>
                  <Td align="right">
                    <div className="flex items-center justify-end gap-2">
                      {invoice.status === "PENDING" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          loading={markingPaidId === invoice.id}
                          onClick={() => handleMarkPaid(invoice.id)}
                        >
                          Marcar paga
                        </Button>
                      )}
                      <RowActionsMenu
                        onEdit={() => openEditModal(invoice)}
                        onDelete={() => setDeleteTarget(invoice)}
                        extraActions={[
                          {
                            label: "Baixar PDF",
                            icon: FileDown,
                            onClick: () =>
                              openPdf(`/invoices/${invoice.id}/pdf`).catch(() =>
                                toast.error("Erro ao gerar o PDF da fatura.")
                              ),
                          },
                          ...(invoice.accessKey
                            ? [
                                {
                                  label: "Baixar XML da nota",
                                  icon: FileCode,
                                  onClick: () =>
                                    downloadFile(`/invoices/${invoice.id}/xml`, `nfe-${invoice.accessKey}.xml`).catch(
                                      () => toast.error("Erro ao baixar o XML da nota fiscal.")
                                    ),
                                },
                              ]
                            : []),
                        ]}
                      />
                    </div>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
        {meta && (
          <Pagination page={meta.page} totalPages={meta.totalPages} total={meta.total} onPageChange={loadInvoices} />
        )}
      </Card>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editingId ? "Editar fatura" : "Nova fatura"}
        subtitle={editingId ? "Atualize os dados da fatura." : "Registre uma conta a pagar ou a receber."}
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button type="submit" form="invoice-form" loading={saving}>
              {editingId ? "Salvar alterações" : "Cadastrar fatura"}
            </Button>
          </>
        }
      >
        <form id="invoice-form" onSubmit={handleSaveInvoice} className="space-y-4">
          {error && <p className="rounded-md bg-[#F6E4E1] px-3.5 py-2.5 text-[12.5px] text-danger dark:bg-danger-dark/10 dark:text-danger-dark">{error}</p>}

          {importedAccessKey && (
            <p className="rounded-md bg-forest-100 px-3.5 py-2.5 text-[12px] text-forest-600 dark:bg-forest-900 dark:text-forest-400">
              Importado da nota fiscal — chave de acesso:{" "}
              <span className="font-mono">{importedAccessKey}</span>
            </p>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Tipo">
              <select
                className={inputClass}
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="RECEIVABLE">A receber</option>
                <option value="PAYABLE">A pagar</option>
              </select>
            </Field>

            <Field label="Valor">
              <input
                type="number"
                min="0.01"
                step="0.01"
                className={inputClass}
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
              />
            </Field>

            <Field label="Descrição" className="sm:col-span-2">
              <input
                className={inputClass}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </Field>

            <Field label="Vencimento">
              <input
                type="date"
                className={inputClass}
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                required
              />
            </Field>

            <Field label="Forma de pagamento">
              <select
                className={inputClass}
                value={form.method}
                onChange={(e) => setForm({ ...form, method: e.target.value })}
              >
                <option value="PIX">PIX</option>
                <option value="CREDIT_CARD">Cartão de crédito</option>
                <option value="BANK_TRANSFER">Transferência</option>
                <option value="BOLETO">Boleto</option>
                <option value="CASH">Dinheiro</option>
                <option value="OTHER">Outro</option>
              </select>
            </Field>

            <Field label="Observações" className="sm:col-span-2">
              <textarea
                className={inputClass}
                rows={2}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </Field>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Excluir fatura"
        description={`Tem certeza que deseja excluir "${deleteTarget?.description}"? Essa ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        loading={deleting}
        onConfirm={confirmDeleteInvoice}
        onCancel={() => setDeleteTarget(null)}
      />
    </PageContainer>
  );
}
