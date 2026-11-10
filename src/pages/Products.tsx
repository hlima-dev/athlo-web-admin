import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Package, Plus, Search, CheckCircle2 } from "lucide-react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  type Product,
} from "../services/products";
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
};

export function Products() {
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState(emptyForm);

  async function loadProducts() {
    try {
      setLoading(true);
      const list = await getProducts(search ? { search } : undefined);
      setProducts(list);
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- busca inicial ao montar a tela
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timeout = setTimeout(loadProducts, 400);
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

  function openEditModal(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description || "",
      sku: product.sku || "",
      type: product.type,
      price: String(product.price ?? ""),
      active: product.active,
    });
    setError("");
    setShowModal(true);
  }

  async function handleSaveProduct(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      setSaving(true);
      const payload = { ...form, price: Number(form.price) };
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

  const activeCount = products.filter((p) => p.active).length;
  const servicesCount = products.filter((p) => p.type === "SERVICE").length;

  return (
    <PageContainer>
      <StatStrip
        items={[
          { label: "Itens cadastrados", value: String(products.length) },
          { label: "Ativos", value: String(activeCount) },
          { label: "Serviços", value: String(servicesCount) },
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
                onChange={(e) => setForm({ ...form, type: e.target.value })}
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
