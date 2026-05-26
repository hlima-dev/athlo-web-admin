export function Profile() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-5xl font-black text-[#071B3A]">
          Perfil
        </h1>

        <p className="text-slate-500 mt-3 text-lg max-w-3xl">
          Informações, permissões e dados do
          usuário logado na plataforma ATHLO.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="w-28 h-28 rounded-full bg-cyan-50 border border-cyan-100 flex items-center justify-center text-5xl font-black text-cyan-600 mb-6">
            A
          </div>

          <h2 className="text-3xl font-black text-[#071B3A]">
            Administrador ASDA
          </h2>

          <p className="text-slate-500 mt-2">
            admin@asdasorocaba.org.br
          </p>

          <span className="inline-block mt-5 bg-cyan-50 text-cyan-600 px-4 py-2 rounded-full text-sm font-bold">
            Administrador
          </span>
        </div>

        <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <h2 className="text-2xl font-black text-[#071B3A] mb-6">
            Dados da conta
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <p className="text-slate-500">
                Organização
              </p>

              <p className="text-green-500 font-black mt-2">
                ASDA Sorocaba
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <p className="text-slate-500">
                Permissão
              </p>

              <p className="text-cyan-600 font-black mt-2">
                Acesso administrativo
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <p className="text-slate-500">
                Status
              </p>

              <p className="text-green-500 font-black mt-2">
                Ativo
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <p className="text-slate-500">
                Último acesso
              </p>

              <p className="text-[#071B3A] font-black mt-2">
                Hoje
              </p>
            </div>
          </div>

          <div className="mt-8 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <h3 className="text-xl font-black text-[#071B3A] mb-3">
              Sobre
            </h3>

            <p className="text-slate-500 leading-relaxed">
              Usuário responsável pela gestão
              da plataforma ATHLO, com acesso
              ao painel administrativo,
              acompanhamento de atletas,
              eventos, doações, voluntários,
              relatórios e indicadores da ONG
              ASDA Sorocaba.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}