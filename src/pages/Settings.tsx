export function Settings() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-4xl font-bold">
          Configurações
        </h1>

        <p className="text-white/60 mt-2">
          Preferências da plataforma ATHLO e configurações administrativas.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <div className="bg-[#111827] rounded-3xl border border-white/5 p-8">
          <h2 className="text-2xl font-bold mb-6">
            Conta
          </h2>

          <div className="space-y-5">

            <div>
              <label className="block mb-2 text-white/50">
                Nome da organização
              </label>

              <input
                defaultValue="ASDA Sorocaba"
                className="w-full bg-[#0B1020] border border-white/10 rounded-2xl p-4 outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block mb-2 text-white/50">
                E-mail administrativo
              </label>

              <input
                defaultValue="admin@asdasorocaba.org.br"
                className="w-full bg-[#0B1020] border border-white/10 rounded-2xl p-4 outline-none focus:border-cyan-400"
              />
            </div>

            <button className="bg-cyan-400 hover:bg-cyan-300 transition text-[#07111f] font-bold px-6 py-4 rounded-2xl">
              Salvar alterações
            </button>

          </div>
        </div>

        <div className="bg-[#111827] rounded-3xl border border-white/5 p-8">
          <h2 className="text-2xl font-bold mb-6">
            Preferências
          </h2>

          <div className="space-y-5">

            <div className="flex items-center justify-between bg-[#0B1020] p-5 rounded-2xl border border-white/5">
              <div>
                <h3 className="font-bold">
                  Notificações por e-mail
                </h3>

                <p className="text-white/50 text-sm mt-1">
                  Receber alertas administrativos
                </p>
              </div>

              <div className="w-14 h-8 bg-cyan-400 rounded-full relative">
                <div className="absolute right-1 top-1 w-6 h-6 bg-white rounded-full" />
              </div>
            </div>

            <div className="flex items-center justify-between bg-[#0B1020] p-5 rounded-2xl border border-white/5">
              <div>
                <h3 className="font-bold">
                  Modo escuro
                </h3>

                <p className="text-white/50 text-sm mt-1">
                  Tema visual da plataforma
                </p>
              </div>

              <div className="w-14 h-8 bg-cyan-400 rounded-full relative">
                <div className="absolute right-1 top-1 w-6 h-6 bg-white rounded-full" />
              </div>
            </div>

            <div className="flex items-center justify-between bg-[#0B1020] p-5 rounded-2xl border border-white/5">
              <div>
                <h3 className="font-bold">
                  Acesso público
                </h3>

                <p className="text-white/50 text-sm mt-1">
                  Permitir página pública da ONG
                </p>
              </div>

              <div className="w-14 h-8 bg-[#1F2937] rounded-full relative">
                <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full" />
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}