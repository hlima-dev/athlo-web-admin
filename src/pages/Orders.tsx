import { useEffect, useMemo, useState } from "react";
import {
  ClipboardList,
  Plus,
  Search,
  Truck,
  PackageCheck,
  Clock3,
  Wallet,
  Trash2,
} from "lucide-react";

import {
  getOrders,
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
  type Order,
} from "../services/orders";
import { getProducts, type Product } from "../services/products";
import { RowActionsMenu } from "../components/RowActionsMenu";
import { PageHeader } from "../components/PageHeader";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useToast } from "../components/Toast";

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

const statusColors: Record<Order["status"], string> = {
  CREATED: "bg-slate-500/10 text-slate-600 dark:text-slate-300",
  CONFIRMED: "bg-cyan-500/10 text-cyan-400",
  IN_PREPARATION: "bg-yellow-500/10 text-yellow-400",
  OUT_FOR_DELIVERY: "bg-purple-500/10 text-purple-400",
  DELIVERED: "bg-emerald-500/10 text-emerald-400",
  CANCELED: "bg-red-500/10 text-red-400",
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
  const [orders, setOrders] = useState<Order[]>([]);
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

  async function loadOrders() {
    try {
      setLoading(true);
      const range = getPeriodRange(period);
      const params: Record<string, string> = {};
      if (range.from) params.from = range.from;
      if (range.to) params.to = range.to;
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;

      const list = await getOrders(params);
      setOrders(list);
    } catch (err) {
      console.error("Erro ao carregar pedidos:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getProducts({ active: "true" })
      .then(setProducts)
      .catch((err) => console.error("Erro ao carregar produtos:", err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, statusFilter]);

  useEffect(() => {
    const timeout = setTimeout(loadOrders, 400);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

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
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao salvar pedido.");
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
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Erro ao atualizar status do pedido.");
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
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Erro ao excluir pedido.");
    } finally {
      setDeleting(false);
    }
  }

  const stats = useMemo(() => {
    const open = orders.filter((o) => o.status !== "DELIVERED" && o.status !== "CANCELED").length;
    const delivered = orders.filter((o) => o.status === "DELIVERED").length;
    const revenue = orders
      .filter((o) => o.paymentStatus === "PAID")
      .reduce((sum, o) => sum + Number(o.total || 0), 0);

    return { total: orders.length, open, delivered, revenue };
  }, [orders]);

  return (
    <div className="space-y-8">
      <PageHeader
        icon={ClipboardList}
        title="Pedidos"
        description="Acompanhe pedidos de entrega e retirada, do cadastro até a conclusão."
        action={
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 font-bold text-slate-950 hover:bg-cyan-400"
          >
            <Plus size={20} />
            Novo pedido
          </button>
        }
      />

      <section className="grid grid-cols-1 gap-5 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <ClipboardList className="text-cyan-400" size={20} />
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Total de pedidos</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</h2>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <Clock3 className="text-yellow-400" size={20} />
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Em aberto</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{stats.open}</h2>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <PackageCheck className="text-emerald-400" size={20} />
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Entregues</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{stats.delivered}</h2>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <Wallet className="text-purple-400" size={20} />
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Faturamento (pago)</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{toCurrency(stats.revenue)}</h2>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Lista de pedidos</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Pedidos carregados diretamente do backend.</p>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {periodOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setPeriod(option.key)}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                period === option.key
                  ? "bg-cyan-500 text-slate-950"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-3 md:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4">
            <Search className="text-slate-400 dark:text-slate-500" size={20} />
            <input
              placeholder="Buscar por cliente ou telefone..."
              className="w-full bg-transparent py-4 text-slate-900 dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-cyan-400 md:w-56"
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

        <div className="mt-6 overflow-x-auto">
          {loading ? (
            <p className="text-slate-500 dark:text-slate-400">Carregando pedidos...</p>
          ) : orders.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400">Nenhum pedido encontrado.</p>
          ) : (
            <table className="w-full min-w-[900px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-left text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  <th className="pb-3 pr-4">Cliente</th>
                  <th className="pb-3 pr-4">Tipo</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4">Agendamento</th>
                  <th className="pb-3 pr-4">Total</th>
                  <th className="pb-3 pr-4">Pagamento</th>
                  <th className="pb-3 pr-4">Origem</th>
                  <th className="pb-3 pr-4">Criado em</th>
                  <th className="pb-3 pr-4" />
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-slate-200/60 dark:border-slate-800/60 align-top">
                    <td className="py-4 pr-4">
                      <p className="font-bold text-slate-900 dark:text-white">{order.customerName}</p>
                      {order.customerPhone && (
                        <p className="text-xs text-slate-400 dark:text-slate-500">{order.customerPhone}</p>
                      )}
                    </td>
                    <td className="py-4 pr-4 text-slate-600 dark:text-slate-300">
                      <span className="inline-flex items-center gap-1">
                        {order.type === "DELIVERY" ? <Truck size={14} /> : <PackageCheck size={14} />}
                        {typeLabels[order.type]}
                      </span>
                    </td>
                    <td className="py-4 pr-4">
                      <select
                        value={order.status}
                        disabled={updatingStatusId === order.id}
                        onChange={(e) => handleQuickStatusChange(order, e.target.value as Order["status"])}
                        className={`rounded-full border-0 px-3 py-1 text-xs font-bold outline-none disabled:opacity-60 ${statusColors[order.status]}`}
                      >
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <option key={value} value={value} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                            {label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-4 pr-4 text-slate-600 dark:text-slate-300">{formatDateTime(order.scheduledAt)}</td>
                    <td className="py-4 pr-4 font-bold text-cyan-400">
                      {toCurrency(Number(order.total || 0))}
                    </td>
                    <td className="py-4 pr-4 text-slate-600 dark:text-slate-300">
                      <p>{paymentMethodLabels[order.paymentMethod]}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{paymentStatusLabels[order.paymentStatus]}</p>
                    </td>
                    <td className="py-4 pr-4">
                      <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-bold text-slate-600 dark:text-slate-300">
                        {originLabels[order.origin]}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-slate-500 dark:text-slate-400">{formatDateTime(order.createdAt)}</td>
                    <td className="py-4 pr-4">
                      <RowActionsMenu
                        onEdit={() => openEditModal(order)}
                        onDelete={() => setDeleteTarget(order)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8 overflow-y-auto">
          <form
            onSubmit={handleSaveOrder}
            className="w-full max-w-3xl rounded-3xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  {editingId ? "Editar pedido" : "Novo pedido"}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {editingId ? "Atualize os dados do pedido." : "Cadastre um pedido manualmente."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                placeholder="Nome do cliente"
                className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-cyan-400"
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                required
              />

              <input
                placeholder="Telefone"
                className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-cyan-400"
                value={form.customerPhone}
                onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
              />

              <select
                className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-cyan-400"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as Order["type"] })}
              >
                <option value="DELIVERY">Entrega</option>
                <option value="PICKUP">Retirada</option>
              </select>

              <select
                className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-cyan-400"
                value={form.origin}
                onChange={(e) => setForm({ ...form, origin: e.target.value as Order["origin"] })}
              >
                <option value="MANUAL">Manual</option>
                <option value="CALLCENTER">Call Center</option>
                <option value="SITE">Site</option>
              </select>

              {editingId && (
                <select
                  className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-cyan-400"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as Order["status"] })}
                >
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              )}

              <input
                type="datetime-local"
                className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-cyan-400"
                value={form.scheduledAt}
                onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
              />

              <select
                className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-cyan-400"
                value={form.paymentMethod}
                onChange={(e) => setForm({ ...form, paymentMethod: e.target.value as Order["paymentMethod"] })}
              >
                {Object.entries(paymentMethodLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>

              <select
                className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-cyan-400"
                value={form.paymentStatus}
                onChange={(e) => setForm({ ...form, paymentStatus: e.target.value as Order["paymentStatus"] })}
              >
                {Object.entries(paymentStatusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {form.type === "DELIVERY" && (
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  placeholder="Endereço"
                  className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-cyan-400 md:col-span-2"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
                <input
                  placeholder="Cidade"
                  className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-cyan-400"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
                <input
                  placeholder="Estado"
                  className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-cyan-400"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                />
                <input
                  placeholder="CEP"
                  className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-cyan-400 md:col-span-2"
                  value={form.zipCode}
                  onChange={(e) => setForm({ ...form, zipCode: e.target.value })}
                />
              </div>
            )}

            <textarea
              placeholder="Observações"
              className="mt-4 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-cyan-400"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white">Itens do pedido</h3>
                <button
                  type="button"
                  onClick={addItemRow}
                  className="rounded-xl bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-bold text-cyan-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  + Adicionar item
                </button>
              </div>

              <div className="mt-3 space-y-3">
                {form.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-800/60 p-3 md:grid-cols-12">
                    <select
                      className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white outline-none focus:border-cyan-400 md:col-span-5"
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
                      className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white outline-none focus:border-cyan-400 md:col-span-3"
                      value={item.name}
                      onChange={(e) => updateItem(index, { name: e.target.value })}
                    />

                    <input
                      type="number"
                      min="1"
                      placeholder="Qtd"
                      className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white outline-none focus:border-cyan-400 md:col-span-1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, { quantity: e.target.value })}
                    />

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Preço"
                      className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white outline-none focus:border-cyan-400 md:col-span-2"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(index, { unitPrice: e.target.value })}
                    />

                    <button
                      type="button"
                      onClick={() => removeItemRow(index)}
                      className="flex items-center justify-center rounded-lg bg-red-500/10 px-3 py-2 text-red-400 hover:bg-red-500/20 md:col-span-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800 pt-4">
                <span className="text-sm text-slate-500 dark:text-slate-400">Total do pedido</span>
                <span className="text-2xl font-black text-cyan-400">{toCurrency(formTotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-6 w-full rounded-2xl bg-cyan-500 px-5 py-3 font-black text-slate-950 hover:bg-cyan-400 disabled:opacity-60"
            >
              {saving ? "Salvando..." : editingId ? "Salvar alterações" : "Cadastrar pedido"}
            </button>
          </form>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Excluir pedido"
        description={`Tem certeza que deseja excluir o pedido de "${deleteTarget?.customerName}"? Essa ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        loading={deleting}
        onConfirm={confirmDeleteOrder}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
