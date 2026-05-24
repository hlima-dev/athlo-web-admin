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
      return "bg-green-500/10 text-green-400";

    case "Pendente":
      return "bg-yellow-500/10 text-yellow-400";

    default:
      return "bg-white/10 text-white";
  }
}

export function Volunteers() {
  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold">
            Voluntários
          </h1>

          <p className="text-white/60 mt-2">
            Gestão de pessoas que apoiam eventos, ações sociais e projetos da ASDA.
          </p>
        </div>

        <button className="bg-cyan-400 hover:bg-cyan-300 transition text-[#07111f] px-6 py-4 rounded-2xl font-bold">
          + Novo voluntário
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="bg-[#111827] border border-white/5 rounded-3xl p-6">
          <p className="text-white/50">
            Voluntários ativos
          </p>

          <h2 className="text-4xl font-bold text-cyan-400 mt-3">
            32
          </h2>
        </div>

        <div className="bg-[#111827] border border-white/5 rounded-3xl p-6">
          <p className="text-white/50">
            Horas de apoio
          </p>

          <h2 className="text-4xl font-bold text-green-400 mt-3">
            428h
          </h2>
        </div>

        <div className="bg-[#111827] border border-white/5 rounded-3xl p-6">
          <p className="text-white/50">
            Eventos apoiados
          </p>

          <h2 className="text-4xl font-bold text-yellow-400 mt-3">
            18
          </h2>
        </div>
      </div>

      <div className="bg-[#111827] rounded-3xl border border-white/5 overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#1F2937] text-white/70">
            <tr>
              <th className="text-left p-5">
                Nome
              </th>

              <th className="text-left p-5">
                Área
              </th>

              <th className="text-left p-5">
                Horas
              </th>

              <th className="text-left p-5">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {volunteers.map((volunteer) => (
              <tr
                key={volunteer.name}
                className="border-t border-white/5 hover:bg-white/[0.02] transition"
              >
                <td className="p-5 font-semibold">
                  {volunteer.name}
                </td>

                <td className="p-5 text-white/70">
                  {volunteer.area}
                </td>

                <td className="p-5 text-cyan-400 font-semibold">
                  {volunteer.hours}h
                </td>

                <td className="p-5">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
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
  );
}