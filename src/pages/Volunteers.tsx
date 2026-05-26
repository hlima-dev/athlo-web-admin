const volunteers = [
  {
    name: "Mariana Alves",
    area: "Eventos",
    status: "Ativo",
    hours: 42,
  },
  {
    name: "João Pedro",
    area: "Comunicação",
    status: "Pendente",
    hours: 12,
  },
  {
    name: "Carlos Lima",
    area: "Apoio Esportivo",
    status: "Ativo",
    hours: 58,
  },
];

function getStatusColor(status: string) {
  switch (status) {
    case "Ativo":
      return "bg-green-50 text-green-600";

    case "Pendente":
      return "bg-yellow-50 text-yellow-600";

    default:
      return "bg-slate-100 text-slate-600";
  }
}

export function Volunteers() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div>
          <h1 className="text-5xl font-black text-[#071B3A]">
            Voluntários
          </h1>

          <p className="text-slate-500 mt-3 text-lg max-w-3xl">
            Gestão de pessoas que apoiam eventos,
            ações sociais e projetos da ASDA.
          </p>
        </div>

        <button className="bg-cyan-600 hover:bg-cyan-500 transition text-white px-6 py-4 rounded-2xl font-black shadow-lg shadow-cyan-600/20">
          + Novo voluntário
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <p className="text-slate-500">
            Voluntários ativos
          </p>

          <h2 className="text-4xl font-black text-cyan-600 mt-3">
            32
          </h2>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <p className="text-slate-500">
            Horas de apoio
          </p>

          <h2 className="text-4xl font-black text-green-500 mt-3">
            428h
          </h2>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <p className="text-slate-500">
            Eventos apoiados
          </p>

          <h2 className="text-4xl font-black text-yellow-500 mt-3">
            18
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="text-left p-5 font-black">
                  Nome
                </th>

                <th className="text-left p-5 font-black">
                  Área
                </th>

                <th className="text-left p-5 font-black">
                  Horas
                </th>

                <th className="text-left p-5 font-black">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {volunteers.map((volunteer) => (
                <tr
                  key={volunteer.name}
                  className="border-t border-slate-100 hover:bg-slate-50 transition"
                >
                  <td className="p-5 font-bold text-[#071B3A]">
                    {volunteer.name}
                  </td>

                  <td className="p-5 text-slate-500">
                    {volunteer.area}
                  </td>

                  <td className="p-5 text-cyan-600 font-bold">
                    {volunteer.hours}h
                  </td>

                  <td className="p-5">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(
                        volunteer.status
                      )}`}
                    >
                      {volunteer.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}