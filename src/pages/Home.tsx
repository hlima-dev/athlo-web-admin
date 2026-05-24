export function Home() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Home</h1>

      <p className="text-white/60 mb-8">
        Área inicial do usuário comum com eventos, avisos, doações e ações de voluntariado.
      </p>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-[#111827] p-6 rounded-2xl border border-white/5">
          <h2 className="text-2xl font-bold text-cyan-400">Próximo evento</h2>
          <p className="text-white/60 mt-3">
            Treino de futebol adaptado — sábado às 09h.
          </p>
        </div>

        <div className="bg-[#111827] p-6 rounded-2xl border border-white/5">
          <h2 className="text-2xl font-bold text-green-400">Voluntariado</h2>
          <p className="text-white/60 mt-3">
            Inscreva-se para apoiar eventos e ações sociais da ASDA.
          </p>
        </div>

        <div className="bg-[#111827] p-6 rounded-2xl border border-white/5">
          <h2 className="text-2xl font-bold text-yellow-400">Doações</h2>
          <p className="text-white/60 mt-3">
            Contribua para o desenvolvimento de atletas amputados.
          </p>
        </div>
      </div>
    </div>
  );
}