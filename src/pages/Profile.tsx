export function Profile() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Perfil</h1>

      <p className="text-white/60 mb-8">
        Informações, permissões e dados do usuário logado na plataforma ATHLO.
      </p>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 bg-[#111827] rounded-3xl border border-white/5 p-8">
          <div className="w-28 h-28 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-5xl font-bold text-cyan-400 mb-6">
            A
          </div>

          <h2 className="text-3xl font-bold">Administrador ASDA</h2>

          <p className="text-white/50 mt-2">admin@asdasorocaba.org.br</p>

          <span className="inline-block mt-5 bg-cyan-500/10 text-cyan-400 px-4 py-2 rounded-full text-sm">
            Administrador
          </span>
        </div>

        <div className="xl:col-span-2 bg-[#111827] rounded-3xl border border-white/5 p-8">
          <h2 className="text-2xl font-bold mb-6">Dados da conta</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-[#0B1020] p-5 rounded-2xl border border-white/5">
              <p className="text-white/50">Organização</p>
              <p className="text-green-400 font-bold mt-2">ASDA Sorocaba</p>
            </div>

            <div className="bg-[#0B1020] p-5 rounded-2xl border border-white/5">
              <p className="text-white/50">Permissão</p>
              <p className="text-cyan-400 font-bold mt-2">
                Acesso administrativo
              </p>
            </div>

            <div className="bg-[#0B1020] p-5 rounded-2xl border border-white/5">
              <p className="text-white/50">Status</p>
              <p className="text-green-400 font-bold mt-2">Ativo</p>
            </div>

            <div className="bg-[#0B1020] p-5 rounded-2xl border border-white/5">
              <p className="text-white/50">Último acesso</p>
              <p className="text-white font-bold mt-2">Hoje</p>
            </div>
          </div>

          <div className="mt-8 bg-[#0B1020] p-6 rounded-2xl border border-white/5">
            <h3 className="text-xl font-bold mb-3">Sobre</h3>

            <p className="text-white/60 leading-relaxed">
              Usuário responsável pela gestão da plataforma ATHLO, com acesso ao
              painel administrativo, acompanhamento de atletas, eventos, doações,
              voluntários, relatórios e indicadores da ONG ASDA Sorocaba.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}