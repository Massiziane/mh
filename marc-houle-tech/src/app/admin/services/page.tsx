import Link from "next/link";

import { prisma } from "@/lib/prisma";

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="mx-auto w-full max-w-[1400px]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="inline-flex rounded-full bg-[#eaf5ff] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#0868ad]">
            Services
          </span>

          <h1 className="mt-4 text-3xl font-black tracking-tight text-[#032f55]">
            Gestion des services
          </h1>

          <p className="mt-2 text-sm text-[#677789]">
            Gérez les services affichés sur le site.
          </p>
        </div>

      </div>

      <div className="mt-8 overflow-hidden rounded-[22px] border border-[#113b5e]/10 bg-white shadow-[0_10px_30px_rgba(0,38,70,0.06)]">
        {services.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="text-4xl">🛠</div>

            <h2 className="mt-4 text-lg font-black text-[#032f55]">
              Aucun service
            </h2>

            <p className="mt-2 text-sm text-[#677789]">
              Ajoutez votre premier service.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#113b5e]/10">
            {services.map((service) => (
              <div
                key={service.id}
                className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h2 className="font-black text-[#032f55]">
                    {service.name}
                  </h2>

                  <p className="mt-1 max-w-[650px] text-sm text-[#677789]">
                    {service.description}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      service.status === "ACTIVE"
                        ? "bg-[#e9f8ef] text-[#169454]"
                        : service.status === "PENDING"
                          ? "bg-[#fff6d8] text-[#8a6b00]"
                          : "bg-[#fcecec] text-[#b42318]"
                    }`}
                  >
                    {service.status === "ACTIVE"
                      ? "Actif"
                      : service.status === "PENDING"
                        ? "En attente"
                        : "Hors service"}
                  </span>

                  <Link
                    href={`/admin/services/${service.id}`}
                    className="rounded-[12px] border border-[#113b5e]/10 px-4 py-2 text-sm font-bold !text-[#032f55] hover:bg-[#f8fbfe]"
                  >
                    Modifier
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