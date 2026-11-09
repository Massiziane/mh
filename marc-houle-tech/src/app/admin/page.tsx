
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { OrderStatus } from "@/generated/prisma/client";

const statusConfig: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  NEW: {
    label: "Nouvelle",
    className: "bg-blue-50 text-blue-700 ring-blue-100",
  },
  IN_REVIEW: {
    label: "En cours",
    className: "bg-amber-50 text-amber-700 ring-amber-100",
  },
  ACCEPTED: {
    label: "Acceptée",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  },
  OPEN: {
    label: "Ouverte",
    className: "bg-cyan-50 text-cyan-700 ring-cyan-100",
  },
  PLANNED: {
    label: "Planifiée",
    className: "bg-violet-50 text-violet-700 ring-violet-100",
  },
  COMPLETED: {
    label: "Terminée",
    className: "bg-slate-100 text-slate-600 ring-slate-200",
  },
  CANCELLED: {
    label: "Annulée",
    className: "bg-red-50 text-red-700 ring-red-100",
  },
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-CA", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "America/Toronto",
  }).format(date);
}

export default async function AdminDashboardPage() {
  const [
    newCount,
    inProgressCount,
    completedCount,
    recentOrders,
  ] = await Promise.all([
    prisma.order.count({
      where: { status: "NEW" },
    }),
    prisma.order.count({
      where: {
        status: { in: ["IN_REVIEW", "ACCEPTED", "OPEN", "PLANNED"] },
      },
    }),
    prisma.order.count({
      where: { status: "COMPLETED" },
    }),
    prisma.order.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { pricingPlan: true },
    }),
  ]);

  return (
    <main className="mx-auto w-full max-w-[1400px] pb-12">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#eaf2ff] px-3 py-1.5 text-xs font-bold text-[#2563eb]">
            <span className="h-2 w-2 rounded-full bg-[#2563eb]" />
            Espace professionnel
          </span>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#142d4e] sm:text-4xl">
            Tableau de bord
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#64748b]">
            Retrouvez vos demandes et suivez vos interventions
            au même endroit.
          </p>
        </div>

        <Link
          href="/admin/orders"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#2563eb] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#1d4ed8]"
        >
          Voir les demandes
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/admin/orders"
          className="group rounded-2xl border border-[#e5eaf1] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
              🔔
            </span>
            <span className="text-xs font-semibold text-[#94a3b8]">
              À traiter
            </span>
          </div>

          <div className="mt-5 text-4xl font-extrabold tracking-tight text-[#142d4e]">
            {newCount}
          </div>
          <p className="mt-1 text-sm font-bold text-[#142d4e]">
            Nouvelles demandes
          </p>
          <p className="mt-1 text-xs text-[#64748b]">
            En attente de votre attention
          </p>
        </Link>

        <Link
          href="/admin/orders"
          className="group rounded-2xl border border-[#e5eaf1] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-xl">
              🕒
            </span>
            <span className="text-xs font-semibold text-[#94a3b8]">
              Suivi
            </span>
          </div>

          <div className="mt-5 text-4xl font-extrabold tracking-tight text-[#142d4e]">
            {inProgressCount}
          </div>
          <p className="mt-1 text-sm font-bold text-[#142d4e]">
            En cours
          </p>
          <p className="mt-1 text-xs text-[#64748b]">
            En révision, ouvertes ou planifiées
          </p>
        </Link>

        <Link
          href="/admin/orders"
          className="group rounded-2xl border border-[#e5eaf1] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-xl">
              ✓
            </span>
            <span className="text-xs font-semibold text-[#94a3b8]">
              Historique
            </span>
          </div>

          <div className="mt-5 text-4xl font-extrabold tracking-tight text-[#142d4e]">
            {completedCount}
          </div>
          <p className="mt-1 text-sm font-bold text-[#142d4e]">
            Terminées
          </p>
          <p className="mt-1 text-xs text-[#64748b]">
            Interventions finalisées
          </p>
        </Link>
      </div>

      {/* Recent requests + quick access */}
      <div className="mt-7 grid gap-6 xl:grid-cols-[1.65fr_0.75fr]">
        <section className="overflow-hidden rounded-2xl border border-[#e5eaf1] bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf0f5] px-6 py-5">
            <div>
              <h2 className="text-lg font-extrabold text-[#142d4e]">
                Demandes récentes
              </h2>
              <p className="mt-1 text-xs text-[#64748b]">
                Cliquez sur une demande pour consulter ses détails.
              </p>
            </div>

            <Link
              href="/admin/orders"
              className="text-sm font-bold text-[#2563eb] hover:text-[#1d4ed8]"
            >
              Tout afficher →
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f1f5f9] text-3xl">
                📭
              </div>
              <h3 className="mt-5 text-base font-bold text-[#142d4e]">
                Aucune demande pour le moment
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-[#64748b]">
                Les demandes envoyées depuis votre site
                apparaîtront automatiquement ici.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#edf0f5]">
              {recentOrders.map((order) => {
                const status =
                  statusConfig[order.status] ?? {
                    label: "Statut inconnu",
                    className: "bg-slate-100 text-slate-600 ring-slate-200",
                  };

                return (
                  <Link
                    key={order.id}
                    href={`/admin/orders/${order.id}`}
                    className="group flex flex-col gap-3 px-6 py-5 transition hover:bg-[#f8faff] sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf4ff] text-sm font-extrabold text-[#2563eb]">
                        {order.name.charAt(0).toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[#142d4e] group-hover:text-[#2563eb]">
                          {order.name}
                        </p>
                        <p className="mt-1 text-xs text-[#64748b]">
                          {order.pricingPlan?.title ??
                            "Demande de service"}
                        </p>
                        <p className="mt-1 text-xs text-[#94a3b8]">
                          {order.phone}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 pl-14 sm:justify-end sm:pl-0">
                      <div className="text-left sm:text-right">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset ${status.className}`}
                        >
                          {status.label}
                        </span>
                        <p className="mt-2 text-xs text-[#94a3b8]">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>

                      <span className="text-lg text-[#94a3b8] transition group-hover:translate-x-1 group-hover:text-[#2563eb]">
                        →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Sidebar */}
        <aside className="space-y-6">
          <section
            className="rounded-2xl border border-[#e5eaf1] bg-white shadow-sm"
            style={{ padding: "24px" }}
          >
            <h2 className="text-lg font-extrabold text-[#142d4e]">
              Accès rapide
            </h2>
            <p className="mt-1 text-xs text-[#64748b]">
              Les outils dont vous avez besoin.
            </p>

            <div className="mt-5 space-y-3">
              <Link
                href="/admin/orders"
                className="group flex items-center gap-3 rounded-xl border border-[#e5eaf1] p-4 transition hover:border-blue-200 hover:bg-blue-50/50"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-xl">
                  📋
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-[#142d4e]">
                    Demandes
                  </span>
                  <span className="mt-1 block text-xs text-[#64748b]">
                    Consulter et suivre les clients
                  </span>
                </span>
                <span className="text-[#94a3b8] group-hover:text-[#2563eb]">
                  →
                </span>
              </Link>

              <Link
                href="/admin/pricing"
                className="group flex items-center gap-3 rounded-xl border border-[#e5eaf1] p-4 transition hover:border-blue-200 hover:bg-blue-50/50"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-xl">
                  🏷️
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-[#142d4e]">
                    Offres et tarifs
                  </span>
                  <span className="mt-1 block text-xs text-[#64748b]">
                    Modifier les formules et les prix
                  </span>
                </span>
                <span className="text-[#94a3b8] group-hover:text-[#2563eb]">
                  →
                </span>
              </Link>
            </div>
          </section>

          {/* Help card */}
          <section
              className="rounded-2xl bg-[#142d4e] text-white shadow-sm"
              style={{ padding: "24px" }}
            >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-2xl">
              💡
            </div>

            <h3 className="mt-5 text-lg font-extrabold">
              Tout est au même endroit
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/70">
              Consultez les demandes reçues, contactez vos
              clients et gérez vos offres en quelques clics.
            </p>

            <Link
              href="/admin/orders"
              className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white hover:underline"
            >
              Gérer mes demandes →
            </Link>
          </section>
        </aside>
      </div>
    </main>
  );
}
