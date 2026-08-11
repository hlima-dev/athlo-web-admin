import { useEffect, useState } from "react";
import { Package, Plus, Search, Tag, CheckCircle2, XCircle } from "lucide-react";
import { getProducts, createProduct, type Product } from "../services/products";

function toCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    sku: "",
    type: "PRODUCT",
    price: "",
  });

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
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timeout = setTimeout(loadProducts, 400);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  async function handleCreateProduct(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      setSaving(true);
      await createProduct({ ...form, price: Number(form.price) });
      setShowModal(false);
      setForm({ name: "", description: "", sku: "", type: "PRODUCT", price: "" });
      await loadProducts();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao cadastrar produto.");
    } finally {
      setSaving(false);
    }
  }

  const activeCount = products.filter((p) => p.active).length;
  const servicesCount = products.filter((p) => p.type === "SERVICE").length;

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] bg-gradient-to-br from-cyan-500 via-blue-600 to-slate-900 p-6 shadow-2xl md:p-10">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white">
          <Package size={16} />
          Catálogo
        </span>

        <h1 className="mt-6 text-3xl font-black text-white md:text-5xl">
          Organize produtos e serviços da sua empresa.
        </h1>

        <p className="mt-4 max-w-2xl text-white/80 md:text-lg">
          Use o catálogo para agilizar orçamentos e faturas.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <Package className="text-cyan-400" />
          <p className="mt-5 text-sm text-slate-400">Itens cadastrados</p>
          <h2 className="mt-2 text-3xl font-black">{products.length}</h2>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <CheckCircle2 className="text-emerald-400" />
          <p className="mt-5 text-sm text-slate-400">Ativos</p>
          <h2 className="mt-2 text-3xl font-black">{activeCount}</h2>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <Tag className="text-purple-400" />
          <p className="mt-5 text-sm text-slate-400">Serviços</p>
          <h2 className="mt-2 text-3xl font-black">{servicesCount}</h2>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-black text-white">Catálogo</h2>
            <p className="text-sm text-slate-400">Produtos e serviços salvos no banco.</p>
          </div>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 font-black text-slate-950 hover:bg-cyan-400"
          >
            <Plus size={20} />
            Novo item
          </button>
        </div>

        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-800 px-4">
          <Search className="text-slate-500" size={20} />
          <input
            placeholder="Buscar produto ou serviço..."
            className="w-full bg-transparent py-4 text-white outline-none placeholder:text-slate-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <p className="text-slate-400">Carregando...</p>
          ) : products.length === 0 ? (
            <p className="text-slate-400">Nenhum item cadastrado.</p>
          ) : (
            products.map((product) => (
              <div key={product.id} className="rounded-3xl border border-slate-800 bg-slate-800 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-400">
                      {product.type === "SERVICE" ? "Serviço" : "Produto"}
                    </span>
                    <h3 className="mt-3 text-lg font-black text-white">{product.name}</h3>
                    {product.sku && <p className="text-xs text-slate-500">SKU: {product.sku}</p>}
                  </div>

                  {product.active ? (
                    <CheckCircle2 className="text-emerald-400 shrink-0" size={20} />
                  ) : (
                    <XCircle className="text-slate-600 shrink-0" size={20} />
                  )}
                </div>

                {product.description && (
                  <p className="mt-3 text-sm text-slate-400 leading-relaxed">{product.description}</p>
                )}

                <p className="mt-4 text-2xl font-black text-cyan-400">
                  {toCurrency(Number(product.price || 0))}
                </p>
              </div>
            ))
          )}
        </div>
      </section>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <form
            onSubmit={handleCreateProduct}
            className="w-full max-w-2xl rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">Novo item</h2>
                <p className="text-sm text-slate-400">Cadastre um produto ou serviço.</p>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-xl bg-slate-800 px-4 py-2 text-slate-300 hover:bg-slate-700"
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
                placeholder="Nome"
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400 md:col-span-2"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />

              <select
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="PRODUCT">Produto</option>
                <option value="SERVICE">Serviço</option>
              </select>

              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Preço"
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />

              <input
                placeholder="SKU (opcional)"
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400 md:col-span-2"
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
              />

              <textarea
                placeholder="Descrição"
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400 md:col-span-2"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-6 w-full rounded-2xl bg-cyan-500 px-5 py-3 font-black text-slate-950 hover:bg-cyan-400 disabled:opacity-60"
            >
              {saving ? "Salvando..." : "Cadastrar item"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
