import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AlertTriangle, Package, Plus, Search, CheckCircle2, Trash2, Wheat } from "lucide-react";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  updateProductRecipe,
  deleteProduct,
  type Product,
  type ProductsSummary,
} from "../services/products";
import { getInsumos, type Insumo } from "../services/insumos";
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

function toCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const emptyForm = {
  name: "",
  description: "",
  sku: "",
  type: "PRODUCT",
  price: "",
  active: true,
  stockQty: "",
  lowStockThreshold: "",
  taxPercent: "",
  paymentFeePercent: "",
  shippingCost: "",
};

interface RecipeRowForm {
  insumoId: string;
  quantity: string;
  insumoName?: string;
  unit?: string;
}

const MARGIN_HEALTHY_THRESHOLD = 15;

function isLowStock(product: Product) {
  return (
    product.stockQty !== null &&
    product.stockQty !== undefined &&
    product.lowStockThreshold !== null &&
    product.lowStockThreshold !== undefined &&
    product.stockQty <= product.lowStockThreshold
  );
}

export function Products() {
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [summary, setSummary] = useState<ProductsSummary | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState(emptyForm);

  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [recipeItems, setRecipeItems] = useState<RecipeRowForm[]>([]);
  const [recipeLoading, setRecipeLoading] = useState(false);
  const [recipeSaving, setRecipeSaving] = useState(false);
  const [recipeError, setRecipeError] = useState("");

  async function loadProducts(targetPage = page) {
    try {
      setLoading(true);
      setError("");
      const params: Record<string, string> = { page: String(targetPage) };
      if (search) params.search = search;
      const result = await getProducts(params);
      setProducts(result.items);
      setMeta(result.meta ?? null);
      setSummary(result.summary ?? null);
      setPage(targetPage);
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
      setError(getErrorMessage(err, "Erro ao carregar produtos."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- busca inicial ao montar a tela
    loadProducts();
    getInsumos({ limit: "100" })
      .then((result) => setInsumos(result.items))
      .catch((err) => console.error("Erro ao carregar insumos:", err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => loadProducts(1), 400);
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
    setRecipeItems([]);
    setRecipeError("");
    setShowModal(true);
  }

  async function openEditModal(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description || "",
      sku: product.sku || "",
      type: product.type,
      price: String(product.price ?? ""),
      active: product.active,
      stockQty: product.stockQty !== null && product.stockQty !== undefined ? String(product.stockQty) : "",
      lowStockThreshold:
        product.lowStockThreshold !== null && product.lowStockThreshold !== undefined
          ? String(product.lowStockThreshold)
          : "",
      taxPercent: product.taxPercent !== null && product.taxPercent !== undefined ? String(product.taxPercent) : "",
      paymentFeePercent:
        product.paymentFeePercent !== null && product.paymentFeePercent !== undefined
          ? String(product.paymentFeePercent)
          : "",
      shippingCost:
        product.shippingCost !== null && product.shippingCost !== undefined ? String(product.shippingCost) : "",
    });
    setError("");
    setShowModal(true);

    setRecipeItems([]);
    setRecipeError("");
    setRecipeLoading(true);
    try {
      const detail = await getProductById(product.id);
      setRecipeItems(
        (detail.recipeItems ?? []).map((item) => ({
          insumoId: item.insumoId,
          quantity: String(item.quantity),
          insumoName: item.insumoName,
          unit: item.unit,
        })),
      );
    } catch (err) {
      setRecipeError(getErrorMessage(err, "Erro ao carregar a ficha técnica."));
    } finally {
      setRecipeLoading(false);
    }
  }

  function addRecipeRow() {
    setRecipeItems((current) => [...current, { insumoId: "", quantity: "1" }]);
  }

  function updateRecipeRow(index: number, patch: Partial<RecipeRowForm>) {
    setRecipeItems((current) => current.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function removeRecipeRow(index: number) {
    setRecipeItems((current) => current.filter((_, i) => i !== index));
  }

  async function handleSaveRecipe() {
    if (!editingId) return;
    setRecipeError("");

    try {
      setRecipeSaving(true);
      const items = recipeItems
        .filter((item) => item.insumoId && Number(item.quantity) > 0)
        .map((item) => ({ insumoId: item.insumoId, quantity: Number(item.quantity) }));
      await updateProductRecipe(editingId, items);
      await loadProducts();
      toast.success("Ficha técnica atualizada com sucesso.");
    } catch (err: unknown) {
      setRecipeError(getErrorMessage(err, "Erro ao salvar a ficha técnica."));
    } finally {
      setRecipeSaving(false);
    }
  }

  const liveMargin = useMemo(() => {
    const price = Number(form.price) || 0;
    const productionCost = recipeItems.reduce((sum, item) => {
      const insumo = insumos.find((i) => i.id === item.insumoId);
      const qty = Number(item.quantity) || 0;
      return sum + (insumo?.bestPrice?.price ?? 0) * qty;
    }, 0);
    const taxAmount = price * ((Number(form.taxPercent) || 0) / 100);
    const paymentFeeAmount = price * ((Number(form.paymentFeePercent) || 0) / 100);
    const shippingCost = Number(form.shippingCost) || 0;
    const netMargin = price - productionCost - taxAmount - paymentFeeAmount - shippingCost;
    const netMarginPercent = price > 0 ? (netMargin / price) * 100 : 0;
    return { price, productionCost, taxAmount, paymentFeeAmount, shippingCost, netMargin, netMarginPercent };
  }, [form.price, form.taxPercent, form.paymentFeePercent, form.shippingCost, recipeItems, insumos]);

  async function handleSaveProduct(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      setSaving(true);
      const payload = {
        ...form,
        price: Number(form.price),
        stockQty: form.stockQty === "" ? null : Number(form.stockQty),
        lowStockThreshold: form.lowStockThreshold === "" ? null : Number(form.lowStockThreshold),
        taxPercent: form.taxPercent === "" ? null : Number(form.taxPercent),
        paymentFeePercent: form.paymentFeePercent === "" ? null : Number(form.paymentFeePercent),
        shippingCost: form.shippingCost === "" ? null : Number(form.shippingCost),
      };
      if (editingId) {
        await updateProduct(editingId, payload);
      } else {
        await createProduct(payload);
      }
      setShowModal(false);
      setForm(emptyForm);
      setEditingId(null);
      await loadProducts();
      toast.success(editingId ? "Item atualizado com sucesso." : "Item cadastrado com sucesso.");
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Erro ao salvar produto."));
    } finally {
      setSaving(false);
    }
  }

  async function confirmDeleteProduct() {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      await deleteProduct(deleteTarget.id);
      setDeleteTarget(null);
      await loadProducts();
      toast.success("Item excluído com sucesso.");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Erro ao excluir produto."));
    } finally {
      setDeleting(false);
    }
  }

  // Vem do backend (agregado da organização inteira) — não some quando a
  // busca filtra a lista, nem fica errado quando há mais de 20 produtos.
  const {
    total: totalCount,
    active: activeCount,
    services: servicesCount,
    lowStock: lowStockCount,
  } = summary ?? {
    total: 0,
    active: 0,
    services: 0,
    lowStock: 0,
  };

  return (
    <PageContainer>
      <StatStrip
        items={[
          { label: "Itens cadastrados", value: String(totalCount) },
          { label: "Ativos", value: String(activeCount) },
          { label: "Serviços", value: String(servicesCount) },
          { label: "Estoque baixo", value: String(lowStockCount), tone: lowStockCount > 0 ? "danger" : "default" },
        ]}
      />

      <Card>
        <CardHeader
          title="Catálogo"
          subtitle="Produtos e serviços salvos no banco."
          action={
            <Button onClick={openCreateModal}>
              <Plus size={16} />
              Novo item
            </Button>
          }
        />

        {error ? <ErrorNote message={error} onRetry={() => loadProducts()} /> : null}

        <div className="flex items-center gap-2.5 border-b border-line px-5 py-3.5 dark:border-line-dark">
          <Search size={16} className="text-faint dark:text-faint-dark" />
          <input
            placeholder="Buscar produto ou serviço..."
            className="w-full bg-transparent text-[13.5px] outline-none placeholder:text-faint dark:placeholder:text-faint-dark"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <SkeletonRows rows={5} cols={5} />
        ) : products.length === 0 ? (
          <EmptyState
            icon={<Package size={20} />}
            title="Nenhum item cadastrado"
            description="Cadastre um produto ou serviço, ou ajuste os termos da busca."
            action={
              <Button onClick={openCreateModal}>
                <Plus size={16} />
                Novo item
              </Button>
            }
          />
        ) : (
          <Table minWidth={680}>
            <Thead>
              <Tr>
                <Th>Nome</Th>
                <Th>Tipo</Th>
                <Th>SKU</Th>
                <Th align="right">Preço</Th>
                <Th>Estoque</Th>
                <Th>Status</Th>
                <Th align="right">Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {products.map((product) => (
                <Tr key={product.id}>
                  <Td>
                    <p className="font-medium">{product.name}</p>
                    {product.description && (
                      <p className="mt-0.5 max-w-xs truncate text-[12px] text-muted dark:text-muted-dark">
                        {product.description}
                      </p>
                    )}
                  </Td>
                  <Td>
                    <Badge tone={product.type === "SERVICE" ? "accent" : "info"}>
                      {product.type === "SERVICE" ? "Serviço" : "Produto"}
                    </Badge>
                  </Td>
                  <Td>{product.sku || "—"}</Td>
                  <Td align="right" className="font-medium tabular-nums">
                    {toCurrency(Number(product.price || 0))}
                  </Td>
                  <Td>
                    {product.stockQty === null || product.stockQty === undefined ? (
                      <span className="text-faint dark:text-faint-dark">—</span>
                    ) : (
                      <span className="flex items-center gap-1.5 tabular-nums">
                        {product.stockQty}
                        {isLowStock(product) && (
                          <span title="Estoque baixo">
                            <AlertTriangle size={13} className="text-danger dark:text-danger-dark" />
                          </span>
                        )}
                      </span>
                    )}
                  </Td>
                  <Td>
                    {product.active ? (
                      <Badge tone="positive">Ativo</Badge>
                    ) : (
                      <Badge tone="neutral">Inativo</Badge>
                    )}
                  </Td>
                  <Td align="right">
                    <div className="flex justify-end">
                      <RowActionsMenu
                        onEdit={() => openEditModal(product)}
                        onDelete={() => setDeleteTarget(product)}
                      />
                    </div>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
        {meta && (
          <Pagination page={meta.page} totalPages={meta.totalPages} total={meta.total} onPageChange={loadProducts} />
        )}
      </Card>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editingId ? "Editar item" : "Novo item"}
        subtitle={editingId ? "Atualize os dados do produto ou serviço." : "Cadastre um produto ou serviço."}
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button type="submit" form="product-form" loading={saving}>
              {editingId ? "Salvar alterações" : "Cadastrar item"}
            </Button>
          </>
        }
      >
        <form id="product-form" onSubmit={handleSaveProduct} className="space-y-4">
          {error && <p className="rounded-md bg-[#F6E4E1] px-3.5 py-2.5 text-[12.5px] text-danger dark:bg-danger-dark/10 dark:text-danger-dark">{error}</p>}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Nome" className="sm:col-span-2">
              <input
                className={inputClass}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </Field>

            <Field label="Tipo">
              <select
                className={inputClass}
                value={form.type}
                onChange={(e) =>
                  setForm({
                    ...form,
                    type: e.target.value,
                    ...(e.target.value === "SERVICE" ? { stockQty: "", lowStockThreshold: "" } : {}),
                  })
                }
              >
                <option value="PRODUCT">Produto</option>
                <option value="SERVICE">Serviço</option>
              </select>
            </Field>

            <Field label="Preço">
              <input
                type="number"
                min="0"
                step="0.01"
                className={inputClass}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
            </Field>

            <Field label="SKU (opcional)" className="sm:col-span-2">
              <input
                className={inputClass}
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
              />
            </Field>

            {form.type === "PRODUCT" && (
              <>
                <Field label="Estoque atual (opcional)" hint="Deixe em branco pra não controlar estoque deste item.">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    className={inputClass}
                    value={form.stockQty}
                    onChange={(e) => setForm({ ...form, stockQty: e.target.value })}
                  />
                </Field>

                <Field label="Avisar quando chegar em (opcional)">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    className={inputClass}
                    value={form.lowStockThreshold}
                    onChange={(e) => setForm({ ...form, lowStockThreshold: e.target.value })}
                  />
                </Field>
              </>
            )}

            <Field label="Descrição" className="sm:col-span-2">
              <textarea
                className={inputClass}
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
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
                Item ativo
              </label>
            )}
          </div>

          {editingId && (
            <div className="border-t border-line pt-4 dark:border-line-dark">
              <div className="mb-3 flex items-center gap-2">
                <Wheat size={16} className="text-forest-600 dark:text-forest-400" />
                <h3 className="text-[13.5px] font-semibold">Ficha técnica e margem</h3>
              </div>

              {recipeError && (
                <p className="mb-3 rounded-md bg-[#F6E4E1] px-3.5 py-2.5 text-[12.5px] text-danger dark:bg-danger-dark/10 dark:text-danger-dark">
                  {recipeError}
                </p>
              )}

              {recipeLoading ? (
                <p className="text-[12.5px] text-muted dark:text-muted-dark">Carregando ficha técnica...</p>
              ) : (
                <>
                  <div className="space-y-2">
                    {recipeItems.map((item, index) => {
                      const insumoInList = insumos.some((i) => i.id === item.insumoId);
                      return (
                        <div key={index} className="grid grid-cols-1 gap-2 sm:grid-cols-12">
                          <select
                            className={`${inputClass} sm:col-span-7`}
                            value={item.insumoId}
                            onChange={(e) => updateRecipeRow(index, { insumoId: e.target.value })}
                          >
                            <option value="">Selecione o insumo...</option>
                            {!insumoInList && item.insumoId && (
                              <option value={item.insumoId}>
                                {item.insumoName} ({item.unit})
                              </option>
                            )}
                            {insumos.map((insumo) => (
                              <option key={insumo.id} value={insumo.id}>
                                {insumo.name} ({insumo.unit})
                              </option>
                            ))}
                          </select>

                          <input
                            type="number"
                            min="0"
                            step="0.0001"
                            placeholder="Quantidade"
                            className={`${inputClass} sm:col-span-4`}
                            value={item.quantity}
                            onChange={(e) => updateRecipeRow(index, { quantity: e.target.value })}
                          />

                          <button
                            type="button"
                            onClick={() => removeRecipeRow(index)}
                            className="flex items-center justify-center rounded-md bg-[#F6E4E1] px-2 py-2 text-danger hover:bg-[#F0D8D3] dark:bg-danger-dark/15 dark:text-danger-dark dark:hover:bg-danger-dark/25 sm:col-span-1"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={addRecipeRow}
                    className="mt-2.5 text-[12.5px] font-medium text-forest-600 hover:underline dark:text-forest-400"
                  >
                    + Adicionar insumo
                  </button>

                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Field label="Imposto % (opcional)">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        className={inputClass}
                        value={form.taxPercent}
                        onChange={(e) => setForm({ ...form, taxPercent: e.target.value })}
                      />
                    </Field>
                    <Field label="Taxa de pagamento % (opcional)">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        className={inputClass}
                        value={form.paymentFeePercent}
                        onChange={(e) => setForm({ ...form, paymentFeePercent: e.target.value })}
                      />
                    </Field>
                    <Field label="Frete (R$, opcional)">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className={inputClass}
                        value={form.shippingCost}
                        onChange={(e) => setForm({ ...form, shippingCost: e.target.value })}
                      />
                    </Field>
                  </div>

                  <div className="mt-4 rounded-md border border-line p-3.5 dark:border-line-dark">
                    <p className="mb-2 text-[12px] font-medium text-muted dark:text-muted-dark">
                      Decomposição do preço
                    </p>
                    <div className="space-y-1 text-[12.5px]">
                      <div className="flex justify-between">
                        <span>Preço de venda</span>
                        <span className="tabular-nums">{toCurrency(liveMargin.price)}</span>
                      </div>
                      <div className="flex justify-between text-muted dark:text-muted-dark">
                        <span>− Custo de produção</span>
                        <span className="tabular-nums">{toCurrency(liveMargin.productionCost)}</span>
                      </div>
                      <div className="flex justify-between text-muted dark:text-muted-dark">
                        <span>− Imposto</span>
                        <span className="tabular-nums">{toCurrency(liveMargin.taxAmount)}</span>
                      </div>
                      <div className="flex justify-between text-muted dark:text-muted-dark">
                        <span>− Taxa de pagamento</span>
                        <span className="tabular-nums">{toCurrency(liveMargin.paymentFeeAmount)}</span>
                      </div>
                      <div className="flex justify-between text-muted dark:text-muted-dark">
                        <span>− Frete</span>
                        <span className="tabular-nums">{toCurrency(liveMargin.shippingCost)}</span>
                      </div>
                      <div className="mt-1.5 flex justify-between border-t border-line pt-1.5 font-semibold dark:border-line-dark">
                        <span>Margem líquida</span>
                        <span className="tabular-nums">
                          {toCurrency(liveMargin.netMargin)} ({liveMargin.netMarginPercent.toFixed(1)}%)
                        </span>
                      </div>
                    </div>

                    {form.price &&
                      (liveMargin.netMarginPercent >= MARGIN_HEALTHY_THRESHOLD ? (
                        <p className="mt-2.5 flex items-center gap-1.5 text-[12px] font-medium text-forest-600 dark:text-forest-400">
                          <CheckCircle2 size={14} /> Margem saudável
                        </p>
                      ) : (
                        <p className="mt-2.5 flex items-center gap-1.5 text-[12px] font-medium text-[#8A6414] dark:text-[#E8C468]">
                          <AlertTriangle size={14} /> Margem apertada
                        </p>
                      ))}
                  </div>

                  <div className="mt-3 flex justify-end">
                    <Button type="button" variant="ghost" onClick={handleSaveRecipe} loading={recipeSaving}>
                      Salvar ficha técnica
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Excluir item"
        description={`Tem certeza que deseja excluir "${deleteTarget?.name}"? Essa ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        loading={deleting}
        onConfirm={confirmDeleteProduct}
        onCancel={() => setDeleteTarget(null)}
      />
    </PageContainer>
  );
}
