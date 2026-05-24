export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-[#070B17] flex flex-col items-center justify-center z-[9999]">

      <div className="w-28 h-28 rounded-[32px] bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center glow-cyan animate-pulse">

        <h1 className="text-5xl font-black text-cyan-400">
          A
        </h1>

      </div>

      <h2 className="text-4xl font-black mt-8 tracking-wide">
        ATHLO
      </h2>

      <p className="text-white/40 mt-3">
        Plataforma ASDA Sorocaba
      </p>

      <div className="w-52 h-2 bg-[#111827] rounded-full overflow-hidden mt-10">
        <div className="h-full bg-cyan-400 animate-[loading_2s_linear_infinite] w-1/2 rounded-full" />
      </div>

    </div>
  );
}