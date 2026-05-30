import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password: senha,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "E-mail ou senha inválidos.");
        return;
      }

      const authData = result.data;

      localStorage.setItem("token", authData.accessToken);
      localStorage.setItem("refreshToken", authData.refreshToken);
      localStorage.setItem("user", JSON.stringify(authData.user));

      navigate("/dashboard");
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
        onSubmit={handleLogin}
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl"
      >
        <h1 className="text-3xl font-bold text-white">
          Bem-vindo ao ATHLO
        </h1>

        <p className="text-slate-400 mt-2 mb-6">
          Acesse o painel administrativo da ONG ASDA.
        </p>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="E-mail"
            className="w-full rounded-xl bg-slate-800 border border-slate-700 text-white px-4 py-3 outline-none focus:border-cyan-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Senha"
            className="w-full rounded-xl bg-slate-800 border border-slate-700 text-white px-4 py-3 outline-none focus:border-cyan-400"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-end mt-3">
          <Link
            to="/forgot-password"
            className="text-sm text-cyan-400 hover:text-cyan-300"
          >
            🚨 TESTE ATHLO LUCAS 🚨
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-slate-950 font-bold py-3 rounded-xl transition"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <p className="text-slate-400 text-sm mt-5 text-center">
          Ainda não tem conta?{" "}
          <Link
            to="/cadastro"
            className="text-cyan-400 font-semibold"
          >
            Criar cadastro
          </Link>
        </p>
      </form>
    </main>
  );
}