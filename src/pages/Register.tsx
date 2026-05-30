import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
  });

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/v1/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.nome,
          email: form.email,
          password: form.senha,
          role: "ADMIN",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.log("Erro cadastro:", result);

        const message =
          result.message ||
          result.error ||
          result.errors?.[0]?.message ||
          result.errors?.[0] ||
          "Erro ao criar cadastro.";

        alert(message);
        return;
      }

      alert("Cadastro realizado com sucesso!");
      navigate("/login");
    } catch (error) {
      alert("Erro ao conectar com o servidor.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl"
      >
        <h1 className="text-3xl font-bold text-white">Criar conta</h1>

        <p className="text-slate-400 mt-2 mb-6">
          Cadastre-se para acessar o sistema da ONG.
        </p>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nome completo"
            className="w-full rounded-xl bg-slate-800 border border-slate-700 text-white px-4 py-3 outline-none focus:border-cyan-400"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            required
          />

          <input
            type="email"
            placeholder="E-mail"
            className="w-full rounded-xl bg-slate-800 border border-slate-700 text-white px-4 py-3 outline-none focus:border-cyan-400"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            type="password"
            placeholder="Senha: mínimo 8 caracteres, 1 maiúscula e 1 número"
            className="w-full rounded-xl bg-slate-800 border border-slate-700 text-white px-4 py-3 outline-none focus:border-cyan-400"
            value={form.senha}
            onChange={(e) => setForm({ ...form, senha: e.target.value })}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-slate-950 font-bold py-3 rounded-xl transition"
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>

        <p className="text-slate-400 text-sm mt-5 text-center">
          Já tem conta?{" "}
          <Link to="/login" className="text-cyan-400 font-semibold">
            Entrar
          </Link>
        </p>
      </form>
    </main>
  );
}