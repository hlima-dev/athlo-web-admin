export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-forest dark:bg-forest-900">
      <div className="grid h-20 w-20 place-items-center rounded-[22px] bg-[#DCE7E0] shadow-[0_0_40px_-8px_rgba(220,231,224,0.45)]">
        <span className="font-display text-4xl leading-none text-forest">a</span>
      </div>

      <h2 className="mt-8 text-2xl font-semibold tracking-[0.14em] text-white">ATHLO</h2>

      <p className="mt-3 text-[13px] text-[#8FA99B]">
        Gestão para pequenas e médias empresas
      </p>

      <div className="mt-10 h-1.5 w-48 overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-1/2 animate-[loading_2s_linear_infinite] rounded-full bg-forest-400" />
      </div>
    </div>
  );
}
