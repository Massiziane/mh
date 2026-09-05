import Link from "next/link";

import { prisma } from "@/lib/prisma";

export default async function AdminPricingPage() {
  const plans = await prisma.pricingPlan.findMany({
    orderBy: {
      price: "asc",
    },
  });

  return (
    <div className="mx-auto w-full max-w-[1400px]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="inline-flex rounded-full bg-[#fff6d8] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#8a6b00]">
            Tarifs
          </span>

          <h1 className="mt-4 text-3xl font-black tracking-tight text-[#032f55]">
            Gestion des tarifs
          </h1>

          <p className="mt-2 text-sm text-[#677789]">
            Modifiez les formules, prix et contrats associés.
          </p>
        </div>

        <Link
          href="/admin/pricing/new"
          className="inline-flex items-center justify-center rounded-[14px] bg-[#0868ad] px-5 py-3 text-sm font-black !text-white transition hover:bg-[#075a95]"
        >
          + Ajouter une formule
        </Link>
      </div>

      {plans.length === 0 ? (
        <div className="mt-8 rounded-[22px] border border-[#113b5e]/10 bg-white px-6 py-16 text-center shadow-[0_10px_30px_rgba(0,38,70,0.06)]">
          <div className="text-4xl">💰</div>

          <h2 className="mt-4 text-lg font-black text-[#032f55]">
            Aucune formule
          </h2>

          <p className="mt-2 text-sm text-[#677789]">
            Vos formules de service à vie apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className="rounded-[22px] border border-[#113b5e]/10 bg-white p-6 shadow-[0_10px_30px_rgba(0,38,70,0.06)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-[#0868ad]">
                    {plan.age}
                  </p>

                  <div className="mt-3 text-3xl font-black text-[#032f55]">
                    {plan.price.toString()} $
                  </div>
                </div>

                {plan.featured && (
                  <span className="rounded-full bg-[#fff6d8] px-3 py-1 text-xs font-black text-[#8a6b00]">
                    Vedette
                  </span>
                )}
              </div>

              <p className="mt-5 text-sm leading-6 text-[#677789]">
                {plan.description}
              </p>

              {plan.contractUrl && (
                <div className="mt-4 text-xs font-bold text-[#169454]">
                  ✓ Contrat disponible
                </div>
              )}

              <Link
                href={`/admin/pricing/${plan.id}`}
                className="mt-6 flex items-center justify-center rounded-[13px] border border-[#113b5e]/10 px-4 py-3 text-sm font-black !text-[#032f55] hover:bg-[#f8fbfe]"
              >
                Modifier la formule
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}