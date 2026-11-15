import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle2, ClipboardList, Plus, Search, Wheat } from "lucide-react";
import {
  getInsumos,
  createInsumo,
  updateInsumo,
  deleteInsumo,
  getInsumoPrices,
  addInsumoPrice,
  type Insumo,
  type InsumoPrice,
  type InsumosSummary,
} from "../services/insumos";
import { getContacts, type Contact } from "../services/contacts";
import type { PageMeta } from "../services/api";
import { RowActionsMenu } from "../components/RowActionsMenu";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useToast } from "../components/Toast";
import { getErrorMessage } from "../utils/errors";
import {
  Badge,
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

const UNIT_SUGGESTIONS = ["kg", "g", "L", "mL", "unidade", "pacote", "dúzia"];

function toCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function toDate(value: string) {
  return new Date(value).toLocaleDateString("pt-BR");
}

// Espelha o cálculo do backend (InsumoService) só pra destacar o mais
// barato ao vivo enquanto o modal está aberto — a lista principal de
// Insumos sempre confia no bestPrice vindo do servidor.
function findBestPrice(prices: InsumoPrice[]): InsumoPrice | null {
  const now = new Date();
  const latestByContact = new Map<string, InsumoPrice>();
  for (const p of prices) {
    const current = latestByContact.get(p.contactId);
    if (!current || new Date(p.recordedAt) > new Date(current.recordedAt)) {
      latestByContact.set(p.contactId, p);
    }
  }
  const valid = [...latestByContact.values()].filter(
    (p) => !p.isPromo || !p.validUntil || new Date(p.validUntil) >= now,
  );
  if (valid.length === 0) return null;
  return valid.reduce((min, p) => (Number(p.price) < Number(min.price) ? p : min));
}

const emptyForm = { name: "", unit: "", active: true };
const emptyPriceForm = { contactId: "", price: "", isPromo: false, validUntil: "" };

export function Insumos() {
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [summary, setSummary] = useState<InsumosSummary | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Insumo | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const [suppliers, setSuppliers] = useState<Contact[]>([]);
  const [priceTarget, setPriceTarget] = useState<Insumo | null>(null);
  const [prices, setPrices] = useState<InsumoPrice[]>([]);
  const [pricesLoading, setPricesLoading] = useState(false);
  const [priceForm, setPriceForm] = useState(emptyPriceForm);
  const [priceSaving, setPriceSaving] = useState(false);
  const [priceError, setPriceError] = useState("");

  async function loadInsumos(targetPage = page) {
    try {
      setLoading(true);
      setError("");
      const params: Record<string, string> = { page: String(targetPage) };
      if (search) params.search = search;
      const result = await getInsumos(params);
      setInsumos(result.items);
      setMeta(result.meta ?? null);
      setSummary(result.summary ?? null);
      setPage(targetPage);
    } catch (err) {
      console.error("Erro ao carregar insumos:", err);
      setError(getErrorMessage(err, "Erro ao carregar insumos."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- busca inicial ao montar a tela
    loadInsumos();
    getContacts({ type: "SUPPLIER", limit: "100" })
      .then((result) => setSuppliers(result.items))
      .catch((err) => console.error("Erro ao carregar fornecedores:", err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => loadInsumos(1), 400);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // ?novo=1 (link de criação rápida do header) abre o modal de criação —
  // só na montagem, de propósito.
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
    setError("");
    setShowModal(true);
  }

  function openEditModal(insumo: Insumo) {
    setEditingId(insumo.id);
    setForm({ name: insumo.name, unit: insumo.unit, active: insumo.active });
    setError("");
    setShowModal(true);
  }

  async function handleSaveInsumo(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      setSaving(true);
      if (editingId) {
        await updateInsumo(editingId, form);
      } else {
        await createInsumo(form);
      }
      setShowModal(false);
      setForm(emptyForm);
      setEditingId(null);
      await loadInsumos();
      toast.success(editingId ? "Insumo atualizado com sucesso." : "Insumo cadastrado com sucesso.");
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Erro ao salvar insumo."));
    } finally {
      setSaving(false);
    }
  }

  async function confirmDeleteInsumo() {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      await deleteInsumo(deleteTarget.id);
      setDeleteTarget(null);
      await loadInsumos();
      toast.success("Insumo excluído com sucesso.");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Erro ao excluir insumo."));
    } finally {
      setDeleting(false);
    }
  }

  async function openPriceModal(insumo: Insumo) {
    setPriceTarget(insumo);
    setPriceForm(emptyPriceForm);
    setPriceError("");
    setPricesLoading(true);
    try {
      const result = await getInsumoPrices(insumo.id);
      setPrices(result);
    } catch (err) {
      setPriceError(getErrorMessage(err, "Erro ao carregar cotações."));
    } finally {
      setPricesLoading(false);
    }
  }

  async function handleAddPrice(e: React.FormEvent) {
    e.preventDefault();
    if (!priceTarget) return;
    setPriceError("");

    try {
      setPriceSaving(true);
      await addInsumoPrice(priceTarget.id, {
        contactId: priceForm.contactId,
        price: Number(priceForm.price),
        isPromo: priceForm.isPromo,
        ...(priceForm.isPromo && priceForm.validUntil ? { validUntil: priceForm.validUntil } : {}),
      });
      const updatedPrices = await getInsumoPrices(priceTarget.id);
      setPrices(updatedPrices);
      setPriceForm(emptyPriceForm);
      await loadInsumos();
      toast.success("Cotação registrada com sucesso.");
    } catch (err: unknown) {
      setPriceError(getErrorMessage(err, "Erro ao registrar cotação."));
    } finally {
      setPriceSaving(false);
    }
  }

  const { total: totalCount, active: activeCount } = summary ?? { total: 0, active: 0 };

  return (
    <PageContainer>
      <StatStrip
        items={[
          { label: "Insumos cadastrados", value: String(totalCount) },
          { label: "Ativos", value: String(activeCount) },
        ]}
      />

      <Card>
        <CardHeader
          title="Insumos"
          subtitle="Matéria-prima e cotações de fornecedores."
          action={
            <Button onClick={openCreateModal}>
              <Plus size={16} />
              Novo insumo
            </Button>
          }
        />

        {error ? <ErrorNote message={error} onRetry={() => loadInsumos()} /> : null}

        <div className="flex items-center gap-2.5 border-b border-line px-5 py-3.5 dark:border-line-dark">
          <Search size={16} className="text-faint dark:text-faint-dark" />
          <input
            placeholder="Buscar insumo..."
            className="w-full bg-transparent text-[13.5px] outline-none placeholder:text-faint dark:placeholder:text-faint-dark"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <SkeletonRows rows={5} cols={5} />
        ) : insumos.length === 0 ? (
          <EmptyState
            icon={<Wheat size={20} />}
            title="Nenhum insumo cadastrado"
            description="Cadastre a matéria-prima usada na produção, ou ajuste os termos da busca."
            action={
              <Button onClick={openCreateModal}>
                <Plus size={16} />
                Novo insumo
              </Button>
            }
          />
        ) : (
          <Table minWidth={640}>
            <Thead>
              <Tr>
                <Th>Nome</Th>
                <Th>Unidade</Th>
                <Th align="right">Melhor preço</Th>
                <Th>Status</Th>
                <Th align="right">Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {insumos.map((insumo) => (
                <Tr key={insumo.id}>
                  <Td className="font-medium">{insumo.name}</Td>
                  <Td>{insumo.unit}</Td>
                  <Td align="right">
                    {insumo.bestPrice ? (
                      <>
                        <p className="font-medium tabular-nums">{toCurrency(insumo.bestPrice.price)}</p>
                        <p className="mt-0.5 text-[12px] text-muted dark:text-muted-dark">
                          {insumo.bestPrice.contactName}
                        </p>
                      </>
                    ) : (
                      <span className="text-faint dark:text-faint-dark">Sem cotação</span>
                    )}
                  </Td>
                  <Td>
                    {insumo.active ? <Badge tone="positive">Ativo</Badge> : <Badge tone="neutral">Inativo</Badge>}
                  </Td>
                  <Td align="right">
                    <div className="flex justify-end">
                      <RowActionsMenu
                        onEdit={() => openEditModal(insumo)}
                        onDelete={() => setDeleteTarget(insumo)}
                        extraActions={[
                          { label: "Cotações", icon: ClipboardList, onClick: () => openPriceModal(insumo) },
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
          <Pagination page={meta.page} totalPages={meta.totalPages} total={meta.total} onPageChange={loadInsumos} />
        )}
      </Card>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editingId ? "Editar insumo" : "Novo insumo"}
        subtitle={editingId ? "Atualize os dados do insumo." : "Cadastre um insumo (matéria-prima)."}
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button type="submit" form="insumo-form" loading={saving}>
              {editingId ? "Salvar alterações" : "Cadastrar insumo"}
            </Button>
          </>
        }
      >
        <form id="insumo-form" onSubmit={handleSaveInsumo} className="space-y-4">
          {error && (
            <p className="rounded-md bg-[#F6E4E1] px-3.5 py-2.5 text-[12.5px] text-danger dark:bg-danger-dark/10 dark:text-danger-dark">
              {error}
            </p>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Nome" className="sm:col-span-2">
              <input
                className={inputClass}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ex.: Chocolate em barra"
                required
              />
            </Field>

            <Field label="Unidade" hint="Use a mesma unidade na cotação e na ficha técnica.">
              <input
                className={inputClass}
                list="unit-suggestions"
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                placeholder="kg, g, L, unidade..."
                required
              />
              <datalist id="unit-suggestions">
                {UNIT_SUGGESTIONS.map((unit) => (
                  <option key={unit} value={unit} />
                ))}
              </datalist>
            </Field>

            {editingId && (
              <label className="flex items-center gap-2.5 text-[13px] sm:col-span-2">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="h-4 w-4 accent-forest dark:accent-forest-400"
                />
                <CheckCircle2 size={15} className="text-muted dark:text-muted-dark" />
                Insumo ativo
              </label>
            )}
          </div>
        </form>
      </Modal>

      <Modal
        open={!!priceTarget}
        onClose={() => setPriceTarget(null)}
        title={`Cotações — ${priceTarget?.name ?? ""}`}
        subtitle="Registre o preço visto em cada fornecedor. O mais barato vigente aparece na lista."
        size="lg"
        footer={
          <Button variant="ghost" onClick={() => setPriceTarget(null)}>
            Fechar
          </Button>
        }
      >
        <div className="space-y-5">
          <form id="price-form" onSubmit={handleAddPrice} className="space-y-4">
            {priceError && (
              <p className="rounded-md bg-[#F6E4E1] px-3.5 py-2.5 text-[12.5px] text-danger dark:bg-danger-dark/10 dark:text-danger-dark">
                {priceError}
              </p>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="Fornecedor" className="sm:col-span-1">
                <select
                  className={inputClass}
                  value={priceForm.contactId}
                  onChange={(e) => setPriceForm({ ...priceForm, contactId: e.target.value })}
                  required
                >
                  <option value="">Selecione...</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label={`Preço (${priceTarget?.unit ?? ""})`}>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className={inputClass}
                  value={priceForm.price}
                  onChange={(e) => setPriceForm({ ...priceForm, price: e.target.value })}
                  required
                />
              </Field>

              <div className="flex flex-col gap-2.5">
                <label className="flex items-center gap-2.5 text-[13px]">
                  <input
                    type="checkbox"
                    checked={priceForm.isPromo}
                    onChange={(e) => setPriceForm({ ...priceForm, isPromo: e.target.checked, validUntil: "" })}
                    className="h-4 w-4 accent-forest dark:accent-forest-400"
                  />
                  É promoção
                </label>
                {priceForm.isPromo && (
                  <input
                    type="date"
                    className={inputClass}
                    value={priceForm.validUntil}
                    onChange={(e) => setPriceForm({ ...priceForm, validUntil: e.target.value })}
                    required
                  />
                )}
              </div>
            </div>

            {suppliers.length === 0 && (
              <p className="text-[12.5px] text-muted dark:text-muted-dark">
                Nenhum fornecedor cadastrado ainda — crie um contato do tipo Fornecedor primeiro.
              </p>
            )}

            <div className="flex justify-end">
              <Button type="submit" loading={priceSaving} disabled={suppliers.length === 0}>
                Registrar cotação
              </Button>
            </div>
          </form>

          <div className="border-t border-line pt-4 dark:border-line-dark">
            {pricesLoading ? (
              <SkeletonRows rows={3} cols={4} />
            ) : prices.length === 0 ? (
              <p className="text-[12.5px] text-muted dark:text-muted-dark">Nenhuma cotação registrada ainda.</p>
            ) : (
              <Table minWidth={520}>
                <Thead>
                  <Tr>
                    <Th>Fornecedor</Th>
                    <Th align="right">Preço</Th>
                    <Th>Promoção</Th>
                    <Th>Registrado em</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {(() => {
                    const bestPrice = findBestPrice(prices);
                    return prices.map((price) => {
                      const isBest = bestPrice?.id === price.id;
                      return (
                        <Tr key={price.id}>
                          <Td className="font-medium">
                            {price.contact.name}
                            {isBest && (
                              <Badge tone="positive">
                                <span className="ml-1">mais barato</span>
                              </Badge>
                            )}
                          </Td>
                          <Td align="right" className="tabular-nums">
                            {toCurrency(Number(price.price))}
                          </Td>
                          <Td>
                            {price.isPromo ? (
                              <Badge tone="warn">
                                Até {price.validUntil ? toDate(price.validUntil) : "—"}
                              </Badge>
                            ) : (
                              <span className="text-faint dark:text-faint-dark">—</span>
                            )}
                          </Td>
                          <Td>{toDate(price.recordedAt)}</Td>
                        </Tr>
                      );
                    });
                  })()}
                </Tbody>
              </Table>
            )}
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Excluir insumo"
        description={`Tem certeza que deseja excluir "${deleteTarget?.name}"? Essa ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        loading={deleting}
        onConfirm={confirmDeleteInsumo}
        onCancel={() => setDeleteTarget(null)}
      />
    </PageContainer>
  );
}
