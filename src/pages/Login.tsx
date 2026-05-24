import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { api } from "../services/api";

export function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      const response = await api.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      console.log(
        "RESPOSTA LOGIN:",
        response.data
      );

      const token =
        response.data.accessToken ||
        response.data.token ||
        response.data.data?.accessToken ||
        response.data.data?.token ||
        response.data.data?.tokens?.accessToken ||
        response.data.tokens?.accessToken;

      console.log("TOKEN:", token);

      if (!token) {
        alert("Token não encontrado");
        return;
      }

      localStorage.setItem(
        "@athlo:token",
        token
      );

      console.log(
        "TOKEN SALVO:",
        localStorage.getItem("@athlo:token")
      );

      alert("Login realizado!");

      navigate("/dashboard");

    } catch (error: any) {
      console.log(
        "ERRO LOGIN:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Erro no login"
      );
    }
  }

  return (
    <div className="min-h-screen bg-[#070B17] flex items-center justify-center p-6">

      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10" />

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

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          <div>
            <label className="block mb-2 text-white/70">
              E-mail
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full bg-[#0B1020] border border-white/10 rounded-2xl p-4 outline-none focus:border-cyan-400 transition"
              placeholder="Digite seu e-mail"
            />
          </div>

          <div>
            <label className="block mb-2 text-white/70">
              Senha
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full bg-[#0B1020] border border-white/10 rounded-2xl p-4 outline-none focus:border-cyan-400 transition"
              placeholder="Digite sua senha"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-400 hover:bg-cyan-300 transition text-[#07111f] font-black py-4 rounded-2xl mt-4"
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