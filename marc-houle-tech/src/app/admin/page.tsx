import Link from "next/link";

import StatCard from "@/components/admin/StatCard";
import { prisma } from "@/lib/prisma";

import type { Prisma } from "@/generated/prisma/client";

type RecentOrder = Prisma.OrderGetPayload<{
  include: {
    pricingPlan: true;
  };
}>;

export default async function AdminDashboardPage() {
  const [
    serviceCount,
    activeServices,
    pricingCount,
    orderCount,
    newOrderCount,
    recentOrders,
  ]: [
    number,
    number,
    number,
    number,
    number,
    RecentOrder[]
  ] = await Promise.all([
    prisma.service.count(),

    prisma.service.count({
      where: {
        status: "ACTIVE",
      },
    }),

    prisma.pricingPlan.count(),

    prisma.order.count(),

    prisma.order.count({
      where: {
        status: "NEW",
      },
    }),

    prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        pricingPlan: true,
      },
    }),
  ]);

  return (
    <div className="mx-auto w-full max-w-[1400px]">
      {/* Heading */}
      <div className="mb-8">
        <span className="inline-flex rounded-full bg-[#eaf5ff] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#0868ad]">
          Tableau de bord
        </span>

        <h2 className="mt-4 text-3xl font-black tracking-tight text-[#032f55] sm:text-4xl">
          Vue d&apos;ensemble
        </h2>

        <p className="mt-2 max-w-[650px] text-sm leading-6 text-[#677789]">
          Gérez vos services, vos formules de prix et les demandes reçues
          depuis le site.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Services"
          value={serviceCount}
          description={`${activeServices} actifs`}
          icon="🛠"
        />

        <StatCard
          title="Formules"
          value={pricingCount}
          description="Formules de service à vie"
          icon="💰"
        />

        <StatCard
          title="Demandes"
          value={orderCount}
          description="Demandes reçues au total"
          icon="📋"
        />

        <StatCard
          title="À traiter"
          value={newOrderCount}
          description="Nouvelles demandes"
          icon="🔔"
        />
      </div>

      {/* Bottom area */}
      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        {/* Recent orders */}
        <section className="overflow-hidden rounded-[22px] border border-[#113b5e]/10 bg-white shadow-[0_10px_30px_rgba(0,38,70,0.06)]">
          <div className="flex items-center justify-between gap-4 border-b border-[#113b5e]/10 px-6 py-5">
            <div>
              <h3 className="text-lg font-black text-[#032f55]">
                Demandes récentes
              </h3>

              <p className="mt-1 text-xs text-[#677789]">
                Les dernières demandes envoyées par les clients
              </p>
            </div>

            <Link
              href="/admin/orders"
              className="text-sm font-bold text-[#0868ad] transition hover:opacity-70"
            >
              Voir tout
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <div className="text-4xl">
                📭
              </div>

              <h4 className="mt-4 font-bold text-[#032f55]">
                Aucune demande
              </h4>

              <p className="mt-2 text-sm text-[#677789]">
                Les nouvelles demandes apparaîtront ici.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#113b5e]/10">
              {recentOrders.map((order: RecentOrder) => (
                <div
                  key={order.id}
                  className="flex flex-col gap-4 px-6 py-5 transition hover:bg-[#f8fbfe] sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="font-bold text-[#032f55]">
                      {order.name}
                    </div>

                    <div className="mt-1 text-xs text-[#677789]">
                      {order.phone}
                    </div>

                    {order.pricingPlan && (
                      <div className="mt-2 text-xs font-semibold text-[#0868ad]">
                        {order.pricingPlan.age}
                      </div>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        order.status === "NEW"
                          ? "bg-[#eaf5ff] text-[#0868ad]"
                          : order.status === "IN_REVIEW"
                            ? "bg-[#fff6d8] text-[#8a6b00]"
                            : order.status === "ACCEPTED"
                              ? "bg-[#e9f8ef] text-[#169454]"
                              : order.status === "COMPLETED"
                                ? "bg-[#edf7f1] text-[#137a48]"
                                : "bg-[#fcecec] text-[#b42318]"
                      }`}
                    >
                      {formatOrderStatus(order.status)}
                    </span>

                    <span className="text-xs text-[#677789]">
                      {order.createdAt.toLocaleDateString("fr-CA")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Quick actions */}
        <section className="rounded-[22px] border border-[#113b5e]/10 bg-white p-6 shadow-[0_10px_30px_rgba(0,38,70,0.06)]">
          <h3 className="text-lg font-black text-[#032f55]">
            Actions rapides
          </h3>

          <p className="mt-1 text-xs text-[#677789]">
            Accès aux sections principales.
          </p>

          <div className="mt-6 space-y-3">
            <Link
              href="/admin/services"
              className="flex items-center justify-between rounded-[14px] border border-[#113b5e]/10 px-4 py-4 text-sm font-bold text-[#032f55] transition hover:border-[#0868ad]/30 hover:bg-[#f8fbfe]"
            >
              <span>Gérer les services</span>
              <span>→</span>
            </Link>

            <Link
              href="/admin/pricing"
              className="flex items-center justify-between rounded-[14px] border border-[#113b5e]/10 px-4 py-4 text-sm font-bold text-[#032f55] transition hover:border-[#0868ad]/30 hover:bg-[#f8fbfe]"
            >
              <span>Gérer les tarifs</span>
              <span>→</span>
            </Link>

            <Link
              href="/admin/orders"
              className="flex items-center justify-between rounded-[14px] border border-[#113b5e]/10 px-4 py-4 text-sm font-bold text-[#032f55] transition hover:border-[#0868ad]/30 hover:bg-[#f8fbfe]"
            >
              <span>Voir les demandes</span>
              <span>→</span>
            </Link>

            <Link
              href="/admin/settings"
              className="flex items-center justify-between rounded-[14px] border border-[#113b5e]/10 px-4 py-4 text-sm font-bold text-[#032f55] transition hover:border-[#0868ad]/30 hover:bg-[#f8fbfe]"
            >
              <span>Paramètres du site</span>
              <span>→</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

function formatOrderStatus(status: RecentOrder["status"]) {
  switch (status) {
    case "NEW":
      return "Nouvelle";

    case "IN_REVIEW":
      return "En révision";

    case "ACCEPTED":
      return "Acceptée";

    case "COMPLETED":
      return "Terminée";

    case "CANCELLED":
      return "Annulée";

    default:
      return status;
  }
}