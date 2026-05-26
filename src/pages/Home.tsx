export function Home() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-5xl font-black text-[#071B3A]">
          Home
        </h1>

        <p className="text-slate-500 mt-3 text-lg max-w-3xl">
          Área inicial do usuário com eventos, ações sociais,
          voluntariado e campanhas da plataforma ATHLO.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition">
          <div className="w-16 h-16 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600 text-3xl">
            ⚽
          </div>

          <h2 className="text-2xl font-black text-cyan-600 mt-6">
            Próximo evento
          </h2>

          <p className="text-slate-500 mt-3 leading-relaxed">
            Treino de futebol adaptado acontecendo sábado às 09h
            no centro esportivo da ASDA.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition">
          <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 text-3xl">
            🤝
          </div>

          <h2 className="text-2xl font-black text-green-600 mt-6">
            Voluntariado
          </h2>

          <p className="text-slate-500 mt-3 leading-relaxed">
            Participe das ações sociais e ajude atletas em
            eventos esportivos e campanhas beneficentes.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition">
          <div className="w-16 h-16 rounded-2xl bg-yellow-50 flex items-center justify-center text-yellow-500 text-3xl">
            💛
          </div>

          <h2 className="text-2xl font-black text-yellow-500 mt-6">
            Doações
          </h2>

          <p className="text-slate-500 mt-3 leading-relaxed">
            Contribua para o desenvolvimento e suporte dos
            atletas amputados da ONG ASDA.
          </p>
        </div>
      </div>
    </div>
  );
}