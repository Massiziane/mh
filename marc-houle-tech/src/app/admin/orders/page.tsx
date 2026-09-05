import Link from "next/link";

import { prisma } from "@/lib/prisma";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      pricingPlan: true,
      images: true,
    },
  });

  return (
    <div className="mx-auto w-full max-w-[1400px]">
      <div>
        <span className="inline-flex rounded-full bg-[#eaf5ff] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#0868ad]">
          Demandes
        </span>

        <h1 className="mt-4 text-3xl font-black tracking-tight text-[#032f55]">
          Demandes clients
        </h1>

        <p className="mt-2 text-sm text-[#677789]">
          Consultez et traitez les demandes envoyées depuis le site.
        </p>
      </div>

      <div className="mt-8 overflow-hidden rounded-[22px] border border-[#113b5e]/10 bg-white shadow-[0_10px_30px_rgba(0,38,70,0.06)]">
        {orders.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="text-4xl">📭</div>

            <h2 className="mt-4 text-lg font-black text-[#032f55]">
              Aucune demande
            </h2>

            <p className="mt-2 text-sm text-[#677789]">
              Les demandes clients apparaîtront ici.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#113b5e]/10">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between"
              >
                <div>
                  <div className="font-black text-[#032f55]">
                    {order.name}
                  </div>

                  <div className="mt-1 text-sm text-[#677789]">
                    {order.phone}
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    {order.pricingPlan && (
                      <span className="rounded-full bg-[#eaf5ff] px-3 py-1 font-bold text-[#0868ad]">
                        {order.pricingPlan.age}
                      </span>
                    )}

                    {order.images.length > 0 && (
                      <span className="rounded-full bg-[#f4f7fb] px-3 py-1 font-bold text-[#677789]">
                        {order.images.length} image(s)
                      </span>
                    )}

                    {order.signedContractUrl && (
                      <span className="rounded-full bg-[#e9f8ef] px-3 py-1 font-bold text-[#169454]">
                        Contrat reçu
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-[#f4f7fb] px-3 py-1 text-xs font-bold text-[#032f55]">
                    {order.status}
                  </span>

                  <span className="text-xs text-[#677789]">
                    {order.createdAt.toLocaleDateString("fr-CA")}
                  </span>

                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="rounded-[12px] bg-[#0868ad] px-4 py-2 text-sm font-black !text-white hover:bg-[#075a95]"
                  >
                    Ouvrir
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}