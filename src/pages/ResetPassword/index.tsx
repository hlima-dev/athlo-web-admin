import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [token, setToken] = useState(searchParams.get("token") || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/v1/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Erro ao redefinir senha.");
        return;
      }

      alert("Senha redefinida com sucesso!");
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
        <h1 className="text-3xl font-bold text-white">Redefinir senha</h1>

        <p className="text-slate-400 mt-2 mb-6">
          Cole o token gerado e informe sua nova senha.
        </p>

        <input
          type="text"
          placeholder="Token"
          className="w-full rounded-xl bg-slate-800 border border-slate-700 text-white px-4 py-3 outline-none focus:border-cyan-400 mb-4"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Nova senha"
          className="w-full rounded-xl bg-slate-800 border border-slate-700 text-white px-4 py-3 outline-none focus:border-cyan-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <p className="text-xs text-slate-500 mt-3">
          A senha deve ter pelo menos 8 caracteres, uma letra maiúscula e um número.
        </p>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-slate-950 font-bold py-3 rounded-xl transition"
        >
          {loading ? "Salvando..." : "Atualizar senha"}
        </button>

        <Link to="/login" className="block text-center text-cyan-400 mt-5">
          Voltar para Login
        </Link>
      </form>
    </main>
  );
}