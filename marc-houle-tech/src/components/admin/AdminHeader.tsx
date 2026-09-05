export default function AdminHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[#113b5e]/10 bg-white/90 backdrop-blur-xl">
      <div className="flex min-h-[72px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-lg font-black text-[#032f55]">
            Administration
          </h1>

          <p className="text-xs text-[#677789]">
            Gestion du site et des demandes
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <div className="text-sm font-bold text-[#032f55]">
              Marc Houle
            </div>

            <div className="text-xs text-[#677789]">
              Administrateur
            </div>
          </div>

          <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#d4af37] to-[#efca55] font-black text-[#10283d]">
            MH
          </div>
        </div>
      </div>
    </header>
  );
}