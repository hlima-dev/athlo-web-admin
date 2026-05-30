import { Link } from "react-router-dom";
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      setResetToken("");

      const response = await fetch(
        `${API_URL}/api/v1/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Erro ao solicitar recuperação.");
        return;
      }

      const token = result.data?.resetToken;

      if (token) {
        setResetToken(token);
      }

      alert("Solicitação enviada com sucesso.");
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
        <h1 className="text-3xl font-bold text-white">
          Recuperar senha
        </h1>

        <p className="text-slate-400 mt-2 mb-6">
          Informe seu e-mail para gerar um token de recuperação.
        </p>

        <input
          type="email"
          placeholder="Seu e-mail"
          className="w-full rounded-xl bg-slate-800 border border-slate-700 text-white px-4 py-3 outline-none focus:border-cyan-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-slate-950 font-bold py-3 rounded-xl transition"
        >
          {loading ? "Gerando..." : "Gerar Token"}
        </button>

        {resetToken && (
          <div className="mt-5 p-4 rounded-xl bg-slate-800 border border-cyan-500">
            <p className="text-sm text-slate-300 mb-2">
              Token gerado:
            </p>

            <p className="break-all text-cyan-400 text-sm font-mono">
              {resetToken}
            </p>
          </div>
        )}

        <Link
          to="/login"
          className="block text-center text-cyan-400 mt-5"
        >
          Voltar para Login
        </Link>
      </form>
    </main>
  );
}