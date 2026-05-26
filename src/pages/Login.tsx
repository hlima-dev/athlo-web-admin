import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { api } from "../services/api";
import { LoadingScreen } from "../components/LoadingScreen";

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || "/dashboard";

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !password) {
      alert("Preencha e-mail e senha.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const token =
        response.data.accessToken ||
        response.data.token ||
        response.data.data?.accessToken ||
        response.data.data?.token ||
        response.data.data?.tokens?.accessToken ||
        response.data.tokens?.accessToken;

      if (!token) {
        alert("Token não encontrado na resposta do servidor.");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("@athlo:token", token);

      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1800);
    } catch (error: any) {
      alert(error.response?.data?.message || "Erro ao realizar login.");
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-[#070B17] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10" />

      <div className="absolute w-[420px] h-[420px] bg-cyan-500/10 rounded-full blur-3xl -top-32 -left-32" />
      <div className="absolute w-[420px] h-[420px] bg-purple-500/10 rounded-full blur-3xl -bottom-32 -right-32" />

      <div className="relative w-full max-w-md bg-[#111827]/90 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-2xl">
        <div className="mb-10">
          <h1 className="text-5xl font-black text-cyan-400 mb-3">
            ATHLO
          </h1>

          <p className="text-white/50 leading-relaxed">
            Plataforma oficial da ASDA Sorocaba para gestão de atletas,
            eventos, voluntários e impacto social.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block mb-2 text-white/70">
              E-mail
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0B1020] text-white border border-white/10 rounded-2xl p-4 outline-none focus:border-cyan-400 transition"
              placeholder="Digite seu e-mail"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block mb-2 text-white/70">
              Senha
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0B1020] text-white border border-white/10 rounded-2xl p-4 outline-none focus:border-cyan-400 transition"
              placeholder="Digite sua senha"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-cyan-400 hover:bg-cyan-300 disabled:opacity-60 disabled:cursor-not-allowed transition text-[#07111f] font-black py-4 rounded-2xl mt-4"
          >
            Entrar na plataforma
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5">
          <p className="text-white/40 text-sm text-center">
            © 2026 ATHLO • ASDA Sorocaba
          </p>
        </div>
      </div>
    </div>
  );
}