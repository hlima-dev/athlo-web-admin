export function Settings() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-5xl font-black text-[#071B3A]">
          Configurações
        </h1>

        <p className="text-slate-500 mt-3 text-lg max-w-3xl">
          Preferências da plataforma ATHLO
          e configurações administrativas.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <h2 className="text-2xl font-black text-[#071B3A] mb-6">
            Conta
          </h2>

          <div className="space-y-5">
            <div>
              <label className="block mb-2 text-slate-500 font-semibold">
                Nome da organização
              </label>

              <input
                defaultValue="ASDA Sorocaba"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block mb-2 text-slate-500 font-semibold">
                E-mail administrativo
              </label>

              <input
                defaultValue="admin@asdasorocaba.org.br"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-cyan-500"
              />
            </div>

            <button className="bg-cyan-600 hover:bg-cyan-500 transition text-white font-black px-6 py-4 rounded-2xl shadow-lg shadow-cyan-600/20">
              Salvar alterações
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <h2 className="text-2xl font-black text-[#071B3A] mb-6">
            Preferências
          </h2>

          <div className="space-y-5">
            <div className="flex items-center justify-between bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div>
                <h3 className="font-black text-[#071B3A]">
                  Notificações por e-mail
                </h3>

                <p className="text-slate-500 text-sm mt-1">
                  Receber alertas administrativos
                </p>
              </div>

              <div className="w-14 h-8 bg-cyan-500 rounded-full relative">
                <div className="absolute right-1 top-1 w-6 h-6 bg-white rounded-full" />
              </div>
            </div>

            <div className="flex items-center justify-between bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div>
                <h3 className="font-black text-[#071B3A]">
                  Modo escuro
                </h3>

                <p className="text-slate-500 text-sm mt-1">
                  Tema visual da plataforma
                </p>
              </div>

              <div className="w-14 h-8 bg-cyan-500 rounded-full relative">
                <div className="absolute right-1 top-1 w-6 h-6 bg-white rounded-full" />
              </div>
            </div>

            <div className="flex items-center justify-between bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div>
                <h3 className="font-black text-[#071B3A]">
                  Acesso público
                </h3>

                <p className="text-slate-500 text-sm mt-1">
                  Permitir página pública da ONG
                </p>
              </div>

              <div className="w-14 h-8 bg-slate-300 rounded-full relative">
                <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}