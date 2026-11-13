import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ClipboardList,
  Plus,
  Search,
  Truck,
  PackageCheck,
  Trash2,
  FileDown,
  Receipt,
} from "lucide-react";

import {
  getOrders,
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
  type Order,
  type OrdersSummary,
} from "../services/orders";
import { getProducts, type Product } from "../services/products";
import type { PageMeta } from "../services/api";
import { RowActionsMenu } from "../components/RowActionsMenu";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useToast } from "../components/Toast";
import { openPdf } from "../services/api";
import { maskPhone, maskZipCode } from "../utils/masks";
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

function toCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDateTime(value?: string | null) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

const statusLabels: Record<Order["status"], string> = {
  CREATED: "Criado",
  CONFIRMED: "Confirmado",
  IN_PREPARATION: "Em preparo",
  OUT_FOR_DELIVERY: "Saiu para entrega",
  DELIVERED: "Entregue",
  CANCELED: "Cancelado",
};

// Pedidos usa 6 status (CONFIRMED=accent, OUT_FOR_DELIVERY=purple), por
// isso o Badge ganhou esses 2 tons a mais além dos 5 da referência.
const statusSelectClasses: Record<Order["status"], string> = {
  CREATED: "bg-[#F0EEE8] text-muted dark:bg-white/[0.06] dark:text-muted-dark",
  CONFIRMED: "bg-[#E0F2FE] text-[#0E7490] dark:bg-[#0C2B33] dark:text-[#67D4F0]",
  IN_PREPARATION: "bg-[#F5EDDD] text-[#8A6414] dark:bg-[#3A2F14] dark:text-[#E8C468]",
  OUT_FOR_DELIVERY: "bg-[#F0E7FB] text-[#7E3FC2] dark:bg-[#2A1F3D] dark:text-[#C9A6F5]",
  DELIVERED: "bg-forest-100 text-forest-600 dark:bg-forest-900 dark:text-forest-400",
  CANCELED: "bg-[#F6E4E1] text-danger dark:bg-danger-dark/15 dark:text-danger-dark",
};

const typeLabels: Record<Order["type"], string> = {
  DELIVERY: "Entrega",
  PICKUP: "Retirada",
};

const originLabels: Record<Order["origin"], string> = {
  MANUAL: "Manual",
  CALLCENTER: "Call Center",
  SITE: "Site",
};

const paymentMethodLabels: Record<Order["paymentMethod"], string> = {
  PIX: "PIX",
  CREDIT_CARD: "Cartão de crédito",
  DEBIT_CARD: "Cartão de débito",
  CASH: "Dinheiro",
  BANK_TRANSFER: "Transferência",
  ONLINE: "Online",
  OTHER: "Outro",
};

const paymentStatusLabels: Record<Order["paymentStatus"], string> = {
  PENDING: "A receber",
  PAID: "Pago",
  REFUNDED: "Estornado",
};

type PeriodKey = "TODAY" | "TOMORROW" | "WEEK" | "ALL";

const periodOptions: { key: PeriodKey; label: string }[] = [
  { key: "TODAY", label: "Hoje" },
  { key: "TOMORROW", label: "Amanhã" },
  { key: "WEEK", label: "Esta semana" },
  { key: "ALL", label: "Todos" },
];

function getPeriodRange(period: PeriodKey): { from?: string; to?: string } {
  const now = new Date();
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
  const endOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);

  if (period === "TODAY") {
    return { from: startOfDay(now).toISOString(), to: endOfDay(now).toISOString() };
  }

  if (period === "TOMORROW") {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return { from: startOfDay(tomorrow).toISOString(), to: endOfDay(tomorrow).toISOString() };
  }

  if (period === "WEEK") {
    const end = new Date(now);
    end.setDate(end.getDate() + 7);
    return { from: startOfDay(now).toISOString(), to: endOfDay(end).toISOString() };
  }

  return {};
}

interface ItemForm {
  productId: string;
  name: string;
  quantity: string;
  unitPrice: string;
}

const emptyItem: ItemForm = { productId: "", name: "", quantity: "1", unitPrice: "" };

const emptyForm = {
  customerName: "",
  customerPhone: "",
  type: "DELIVERY" as Order["type"],
  origin: "MANUAL" as Order["origin"],
  status: "CREATED" as Order["status"],
  paymentMethod: "PIX" as Order["paymentMethod"],
  paymentStatus: "PENDING" as Order["paymentStatus"],
  address: "",
  city: "",
  state: "",
  zipCode: "",
  notes: "",
  scheduledAt: "",
  items: [{ ...emptyItem }] as ItemForm[],
};

export function Orders() {
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [summary, setSummary] = useState<OrdersSummary | null>(null);
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<PeriodKey>("ALL");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Order | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  const [form, setForm] = useState(emptyForm);

  async function loadOrders(targetPage = page) {
    try {
      setLoading(true);
      setError("");
      const range = getPeriodRange(period);
      const params: Record<string, string> = { page: String(targetPage) };
      if (range.from) params.from = range.from;
      if (range.to) params.to = range.to;
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;

      const result = await getOrders(params);
      setOrders(result.items);
      setMeta(result.meta ?? null);
      setSummary(result.summary ?? null);
      setPage(targetPage);
    } catch (err) {
      console.error("Erro ao carregar pedidos:", err);
      setError(getErrorMessage(err, "Erro ao carregar pedidos."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getProducts({ active: "true", limit: "100" })
      .then((result) => setProducts(result.items))
      .catch((err) => console.error("Erro ao carregar produtos:", err));
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- refaz a busca quando o período/status do filtro muda
    loadOrders(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, statusFilter]);

  useEffect(() => {
    const timeout = setTimeout(() => loadOrders(1), 400);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

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
    setError("");
    setShowModal(true);
  }

  function openEditModal(order: Order) {
    setEditingId(order.id);
    setForm({
      customerName: order.customerName,
      customerPhone: order.customerPhone || "",
      type: order.type,
      origin: order.origin,
      status: order.status,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      address: order.address || "",
      city: order.city || "",
      state: order.state || "",
      zipCode: order.zipCode || "",
      notes: order.notes || "",
      scheduledAt: order.scheduledAt ? order.scheduledAt.slice(0, 16) : "",
      items: order.items.length
        ? order.items.map((item) => ({
            productId: item.productId || "",
            name: item.name,
            quantity: String(item.quantity),
            unitPrice: String(item.unitPrice),
          }))
        : [{ ...emptyItem }],
    });
    setError("");
    setShowModal(true);
  }

  function updateItem(index: number, patch: Partial<ItemForm>) {
    setForm((current) => ({
      ...current,
      items: current.items.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }));
  }

  function handleSelectProduct(index: number, productId: string) {
    const product = products.find((p) => p.id === productId);
    updateItem(index, {
      productId,
      name: product ? product.name : "",
      unitPrice: product ? String(product.price) : "",
    });
  }

  function addItemRow() {
    setForm((current) => ({ ...current, items: [...current.items, { ...emptyItem }] }));
  }

  function removeItemRow(index: number) {
    setForm((current) => ({
      ...current,
      items: current.items.length > 1 ? current.items.filter((_, i) => i !== index) : current.items,
    }));
  }

  const formTotal = useMemo(() => {
    return form.items.reduce((sum, item) => {
      const qty = Number(item.quantity) || 0;
      const price = Number(item.unitPrice) || 0;
      return sum + qty * price;
    }, 0);
  }, [form.items]);

  async function handleSaveOrder(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const items = form.items
      .filter((item) => item.name.trim() && Number(item.quantity) > 0)
      .map((item) => ({
        productId: item.productId || undefined,
        name: item.name,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice) || 0,
      }));

    if (items.length === 0) {
      setError("Adicione ao menos um item ao pedido.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        customerName: form.customerName,
        customerPhone: form.customerPhone || undefined,
        type: form.type,
        origin: form.origin,
        status: form.status,
        paymentMethod: form.paymentMethod,
        paymentStatus: form.paymentStatus,
        address: form.type === "DELIVERY" ? form.address || undefined : undefined,
        city: form.type === "DELIVERY" ? form.city || undefined : undefined,
        state: form.type === "DELIVERY" ? form.state || undefined : undefined,
        zipCode: form.type === "DELIVERY" ? form.zipCode || undefined : undefined,
        notes: form.notes || undefined,
        scheduledAt: form.scheduledAt || undefined,
        items,
      };

      if (editingId) {
        await updateOrder(editingId, payload);
      } else {
        await createOrder(payload);
      }

      setShowModal(false);
      setForm(emptyForm);
      setEditingId(null);
      await loadOrders();
      toast.success(editingId ? "Pedido atualizado com sucesso." : "Pedido cadastrado com sucesso.");
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Erro ao salvar pedido."));
    } finally {
      setSaving(false);
    }
  }

  async function handleQuickStatusChange(order: Order, status: Order["status"]) {
    try {
      setUpdatingStatusId(order.id);
      await updateOrderStatus(order.id, status);
      await loadOrders();
      toast.success("Status do pedido atualizado.");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Erro ao atualizar status do pedido."));
    } finally {
      setUpdatingStatusId(null);
    }
  }

  async function confirmDeleteOrder() {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      await deleteOrder(deleteTarget.id);
      setDeleteTarget(null);
      await loadOrders();
      toast.success("Pedido excluído com sucesso.");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Erro ao excluir pedido."));
    } finally {
      setDeleting(false);
    }
  }

  // Vem do backend, já respeitando o filtro de período/status atual — não
  // soma só os 20 pedidos carregados na página.
  const stats = summary ?? { total: 0, open: 0, delivered: 0, revenue: 0 };

  return (
    <PageContainer>
      <StatStrip
        items={[
          { label: "Total de pedidos", value: String(stats.total) },
          { label: "Em aberto", value: String(stats.open) },
          { label: "Entregues", value: String(stats.delivered) },
          { label: "Faturamento (pago)", value: toCurrency(stats.revenue) },
        ]}
      />

      <Card>
        <CardHeader
          title="Lista de pedidos"
          subtitle="Pedidos carregados diretamente do backend."
          action={
            <Button onClick={openCreateModal}>
              <Plus size={16} />
              Novo pedido
            </Button>
          }
        />

        {error ? <ErrorNote message={error} onRetry={() => loadOrders()} /> : null}

        <div className="flex flex-wrap items-center gap-1.5 border-b border-line px-5 py-3.5 dark:border-line-dark">
          {periodOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setPeriod(option.key)}
              className={`rounded-md px-3 py-1.5 text-[12.5px] font-medium transition ${
                period === option.key
                  ? "bg-forest text-white dark:bg-forest-400"
                  : "text-muted hover:bg-[#F0EEE8] dark:text-muted-dark dark:hover:bg-white/[0.06]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 border-b border-line px-5 py-3.5 dark:border-line-dark md:flex-row md:items-center">
          <div className="flex flex-1 items-center gap-2.5">
            <Search size={16} className="text-faint dark:text-faint-dark" />
            <input
              placeholder="Buscar por cliente ou telefone..."
              className="w-full bg-transparent text-[13.5px] outline-none placeholder:text-faint dark:placeholder:text-faint-dark"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className={`${inputClass} md:w-56`}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Todos os status</option>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <SkeletonRows rows={5} cols={8} />
        ) : orders.length === 0 ? (
          <EmptyState
            icon={<ClipboardList size={20} />}
            title="Nenhum pedido encontrado"
            description="Cadastre um pedido ou ajuste os filtros de período/status/busca."
            action={
              <Button onClick={openCreateModal}>
                <Plus size={16} />
                Novo pedido
              </Button>
            }
          />
        ) : (
          <Table minWidth={1040}>
            <Thead>
              <Tr>
                <Th>Cliente</Th>
                <Th>Tipo</Th>
                <Th>Status</Th>
                <Th>Agendamento</Th>
                <Th align="right">Total</Th>
                <Th>Pagamento</Th>
                <Th>Origem</Th>
                <Th>Criado em</Th>
                <Th align="right">Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {orders.map((order) => (
                <Tr key={order.id}>
                  <Td>
                    <p className="font-medium">{order.customerName}</p>
                    {order.customerPhone && (
                      <p className="text-[12px] text-muted dark:text-muted-dark">{order.customerPhone}</p>
                    )}
                  </Td>
                  <Td>
                    <span className="inline-flex items-center gap-1.5 text-[12.5px] text-muted dark:text-muted-dark">
                      {order.type === "DELIVERY" ? <Truck size={14} /> : <PackageCheck size={14} />}
                      {typeLabels[order.type]}
                    </span>
                  </Td>
                  <Td>
                    <select
                      value={order.status}
                      disabled={updatingStatusId === order.id}
                      onChange={(e) => handleQuickStatusChange(order, e.target.value as Order["status"])}
                      className={`rounded px-2 py-1 text-[11.5px] font-medium outline-none disabled:opacity-60 ${statusSelectClasses[order.status]}`}
                    >
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <option key={value} value={value} className="bg-surface text-ink dark:bg-surface-dark dark:text-ink-dark">
                          {label}
                        </option>
                      ))}
                    </select>
                  </Td>
                  <Td>{formatDateTime(order.scheduledAt)}</Td>
                  <Td align="right" className="font-medium tabular-nums">
                    {toCurrency(Number(order.total || 0))}
                  </Td>
                  <Td>
                    <p>{paymentMethodLabels[order.paymentMethod]}</p>
                    <p className="text-[12px] text-muted dark:text-muted-dark">
                      {paymentStatusLabels[order.paymentStatus]}
                    </p>
                    {order.invoice && (
                      <Link
                        to="/financeiro"
                        className="mt-0.5 flex items-center gap-1 text-[11.5px] text-forest-600 hover:underline dark:text-forest-400"
                      >
                        <Receipt size={11} />
                        Fatura gerada
                      </Link>
                    )}
                  </Td>
                  <Td>
                    <Badge tone="neutral">{originLabels[order.origin]}</Badge>
                  </Td>
                  <Td className="text-muted dark:text-muted-dark">{formatDateTime(order.createdAt)}</Td>
                  <Td align="right">
                    <div className="flex justify-end">
                      <RowActionsMenu
                        onEdit={() => openEditModal(order)}
                        onDelete={() => setDeleteTarget(order)}
                        extraActions={[
                          {
                            label: "Baixar PDF",
                            icon: FileDown,
                            onClick: () =>
                              openPdf(`/orders/${order.id}/pdf`).catch(() =>
                                toast.error("Erro ao gerar o PDF do pedido.")
                              ),
                          },
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
          <Pagination page={meta.page} totalPages={meta.totalPages} total={meta.total} onPageChange={loadOrders} />
        )}
      </Card>

      <Modal
        open={showModal}
        size="lg"
        onClose={() => setShowModal(false)}
        title={editingId ? "Editar pedido" : "Novo pedido"}
        subtitle={editingId ? "Atualize os dados do pedido." : "Cadastre um pedido manualmente."}
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button type="submit" form="order-form" loading={saving}>
              {editingId ? "Salvar alterações" : "Cadastrar pedido"}
            </Button>
          </>
        }
      >
        <form id="order-form" onSubmit={handleSaveOrder} className="space-y-4">
          {error && <p className="rounded-md bg-[#F6E4E1] px-3.5 py-2.5 text-[12.5px] text-danger dark:bg-danger-dark/10 dark:text-danger-dark">{error}</p>}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Nome do cliente">
              <input
                className={inputClass}
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                required
              />
            </Field>

            <Field label="Telefone">
              <input
                inputMode="tel"
                maxLength={16}
                className={inputClass}
                value={form.customerPhone}
                onChange={(e) => setForm({ ...form, customerPhone: maskPhone(e.target.value) })}
              />
            </Field>

            <Field label="Tipo">
              <select
                className={inputClass}
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as Order["type"] })}
              >
                <option value="DELIVERY">Entrega</option>
                <option value="PICKUP">Retirada</option>
              </select>
            </Field>

            <Field label="Origem">
              <select
                className={inputClass}
                value={form.origin}
                onChange={(e) => setForm({ ...form, origin: e.target.value as Order["origin"] })}
              >
                <option value="MANUAL">Manual</option>
                <option value="CALLCENTER">Call Center</option>
                <option value="SITE">Site</option>
              </select>
            </Field>

            {editingId && (
              <Field label="Status">
                <select
                  className={inputClass}
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as Order["status"] })}
                >
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>
            )}

            <Field label="Agendamento">
              <input
                type="datetime-local"
                className={inputClass}
                value={form.scheduledAt}
                onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
              />
            </Field>

            <Field label="Forma de pagamento">
              <select
                className={inputClass}
                value={form.paymentMethod}
                onChange={(e) => setForm({ ...form, paymentMethod: e.target.value as Order["paymentMethod"] })}
              >
                {Object.entries(paymentMethodLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Status do pagamento">
              <select
                className={inputClass}
                value={form.paymentStatus}
                onChange={(e) => setForm({ ...form, paymentStatus: e.target.value as Order["paymentStatus"] })}
              >
                {Object.entries(paymentStatusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {form.type === "DELIVERY" && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Endereço" className="sm:col-span-2">
                <input
                  className={inputClass}
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </Field>
              <Field label="Cidade">
                <input
                  className={inputClass}
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </Field>
              <Field label="Estado">
                <input
                  className={inputClass}
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                />
              </Field>
              <Field label="CEP" className="sm:col-span-2">
                <input
                  inputMode="numeric"
                  maxLength={9}
                  className={inputClass}
                  value={form.zipCode}
                  onChange={(e) => setForm({ ...form, zipCode: maskZipCode(e.target.value) })}
                />
              </Field>
            </div>
          )}

          <Field label="Observações">
            <textarea
              className={inputClass}
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </Field>

          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] font-semibold">Itens do pedido</h3>
              <button
                type="button"
                onClick={addItemRow}
                className="text-[12.5px] font-medium text-forest-600 hover:underline dark:text-forest-400"
              >
                + Adicionar item
              </button>
            </div>

            <div className="mt-3 space-y-2.5">
              {form.items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 gap-2 rounded-md border border-line p-2.5 dark:border-line-dark md:grid-cols-12">
                  <select
                    className={`${inputClass} md:col-span-4`}
                    value={item.productId}
                    onChange={(e) => handleSelectProduct(index, e.target.value)}
                  >
                    <option value="">Item avulso...</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>

                  <input
                    placeholder="Descrição"
                    className={`${inputClass} md:col-span-3`}
                    value={item.name}
                    onChange={(e) => updateItem(index, { name: e.target.value })}
                  />

                  <input
                    type="number"
                    min="1"
                    placeholder="Qtd"
                    className={`${inputClass} md:col-span-2`}
                    value={item.quantity}
                    onChange={(e) => updateItem(index, { quantity: e.target.value })}
                  />

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Preço"
                    className={`${inputClass} md:col-span-2`}
                    value={item.unitPrice}
                    onChange={(e) => updateItem(index, { unitPrice: e.target.value })}
                  />

                  <button
                    type="button"
                    onClick={() => removeItemRow(index)}
                    className="flex items-center justify-center rounded-md bg-[#F6E4E1] px-2 py-2 text-danger hover:bg-[#F0D8D3] dark:bg-danger-dark/15 dark:text-danger-dark dark:hover:bg-danger-dark/25 md:col-span-1"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-end gap-3 border-t border-line pt-3 dark:border-line-dark">
              <span className="text-[12.5px] text-muted dark:text-muted-dark">Total do pedido</span>
              <span className="font-display text-[22px] tabular-nums">{toCurrency(formTotal)}</span>
            </div>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Excluir pedido"
        description={`Tem certeza que deseja excluir o pedido de "${deleteTarget?.customerName}"? Essa ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        loading={deleting}
        onConfirm={confirmDeleteOrder}
        onCancel={() => setDeleteTarget(null)}
      />
    </PageContainer>
  );
}
