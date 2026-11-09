
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Prisma, OrderStatus } from "@/generated/prisma/client";

type Props = {
  searchParams: Promise<{
    q?: string;
    status?: string;
  }>;
};

const filters = [
  { value: "ALL", label: "Toutes" },
  { value: "NEW", label: "Nouvelles" },
  { value: "OPEN", label: "Ouvertes" },
  { value: "PLANNED", label: "Planifiées" },
  { value: "COMPLETED", label: "Terminées" },
  { value: "CANCELLED", label: "Annulées" },
] as const;

const statusStyles: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  NEW: {
    label: "Nouvelle",
    className: "bg-blue-50 text-blue-700 ring-blue-100",
  },
  IN_REVIEW: {
    label: "En révision",
    className: "bg-amber-50 text-amber-700 ring-amber-100",
  },
  ACCEPTED: {
    label: "Acceptée",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  },
  OPEN: {
    label: "Ouverte",
    className: "bg-amber-50 text-amber-700 ring-amber-100",
  },
  PLANNED: {
    label: "Planifiée",
    className: "bg-violet-50 text-violet-700 ring-violet-100",
  },
  COMPLETED: {
    label: "Terminée",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  },
  CANCELLED: {
    label: "Annulée",
    className: "bg-red-50 text-red-700 ring-red-100",
  },
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-CA", {
    dateStyle: "medium",
    timeZone: "America/Toronto",
  }).format(date);
}

function formatAppointment(date: Date) {
  return new Intl.DateTimeFormat("fr-CA", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Toronto",
  }).format(date);
}

function buildUrl(q: string, status: string) {
  const params = new URLSearchParams();

  if (q) params.set("q", q);
  if (status !== "ALL") params.set("status", status);

  const query = params.toString();
  return query ? `/admin/orders?${query}` : "/admin/orders";
}

export default async function AdminOrdersPage({
  searchParams,
}: Props) {
  const params = await searchParams;

  const q =
    typeof params.q === "string"
      ? params.q.trim().slice(0, 100)
      : "";

  const requestedStatus =
    typeof params.status === "string"
      ? params.status.toUpperCase()
      : "ALL";

  const activeStatus = filters.some(
    (filter) => filter.value === requestedStatus
  )
    ? requestedStatus
    : "ALL";

  const where: Prisma.OrderWhereInput = {};

  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { phone: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      {
        pricingPlan: {
          is: {
            title: {
              contains: q,
              mode: "insensitive",
            },
          },
        },
      },
    ];
  }

  if (activeStatus !== "ALL") {
    where.status = activeStatus as OrderStatus;
  }

  const [orders, statusCounts, totalCount] =
    await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          pricingPlan: true,
        },
      }),
      prisma.order.groupBy({
        by: ["status"],
        _count: {
          _all: true,
        },
      }),
      prisma.order.count(),
    ]);

  const countByStatus = Object.fromEntries(
    statusCounts.map((item) => [
      item.status,
      item._count._all,
    ])
  ) as Record<string, number>;

  return (
    <main className="mx-auto w-full max-w-[1400px] pb-12">
      {/* Header */}
      <div className="mb-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#eaf2ff] px-3 py-1.5 text-xs font-bold text-[#2563eb]">
          <span className="h-2 w-2 rounded-full bg-[#2563eb]" />
          Gestion des demandes
        </span>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#142d4e] sm:text-4xl">
          Demandes clients
        </h1>

        <p className="mt-2 text-sm leading-6 text-[#64748b]">
          Consultez vos clients, suivez les demandes et
          retrouvez vos interventions planifiées.
        </p>
      </div>

      {/* Search and filters */}
      <section className="rounded-2xl border border-[#e5eaf1] bg-white p-5 shadow-sm sm:p-6">
        <form
          action="/admin/orders"
          method="GET"
          className="flex flex-col gap-3 sm:flex-row"
        >
          <div className="relative flex-1">
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[#94a3b8]">
              ⌕
            </span>

            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Rechercher un client, téléphone ou service..."
              className="h-12 w-full rounded-xl border border-[#e5eaf1] bg-[#f8fafc] pl-11 pr-4 text-sm text-[#142d4e] outline-none transition placeholder:text-[#94a3b8] focus:border-[#2563eb] focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {activeStatus !== "ALL" && (
            <input
              type="hidden"
              name="status"
              value={activeStatus}
            />
          )}

          <button
            type="submit"
            className="h-12 rounded-xl bg-[#2563eb] px-6 text-sm font-bold text-white transition hover:bg-[#1d4ed8]"
          >
            Rechercher
          </button>

          {(q || activeStatus !== "ALL") && (
            <Link
              href="/admin/orders"
              className="flex h-12 items-center justify-center rounded-xl border border-[#e5eaf1] px-5 text-sm font-bold text-[#64748b] hover:bg-[#f8fafc]"
            >
              Réinitialiser
            </Link>
          )}
        </form>

        <div className="mt-5 flex flex-wrap gap-2">
          {filters.map((filter) => {
            const selected =
              activeStatus === filter.value;

            const count =
              filter.value === "ALL"
                ? totalCount
                : countByStatus[filter.value] ?? 0;

            return (
              <Link
                key={filter.value}
                href={buildUrl(q, filter.value)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition ${
                  selected
                    ? "bg-[#2563eb] text-white shadow-sm"
                    : "bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]"
                }`}
              >
                {filter.label}
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] ${
                    selected
                      ? "bg-white/20 text-white"
                      : "bg-white text-[#64748b]"
                  }`}
                >
                  {count}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Results header */}
      <div className="mb-4 mt-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-[#142d4e]">
            Liste des demandes
          </h2>
          <p className="mt-1 text-xs text-[#64748b]">
            {orders.length} résultat
            {orders.length !== 1 ? "s" : ""}
            {q ? ` pour « ${q} »` : ""}
          </p>
        </div>

        <span className="text-xs font-medium text-[#94a3b8]">
          Plus récentes en premier
        </span>
      </div>

      {/* Orders list */}
      <section className="overflow-hidden rounded-2xl border border-[#e5eaf1] bg-white shadow-sm">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f1f5f9] text-3xl">
              📭
            </div>

            <h3 className="mt-5 text-base font-bold text-[#142d4e]">
              Aucune demande trouvée
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-[#64748b]">
              {q || activeStatus !== "ALL"
                ? "Essayez une autre recherche ou modifiez les filtres."
                : "Les demandes envoyées depuis votre site apparaîtront ici."}
            </p>

            {(q || activeStatus !== "ALL") && (
              <Link
                href="/admin/orders"
                className="mt-5 text-sm font-bold text-[#2563eb] hover:underline"
              >
                Voir toutes les demandes
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-[#edf0f5]">
            {orders.map((order) => {
              const status = statusStyles[order.status];

              return (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="group flex flex-col gap-4 px-5 py-5 transition hover:bg-[#f8faff] sm:px-6 lg:flex-row lg:items-center lg:justify-between"
                >
                  {/* Customer */}
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#edf4ff] text-base font-extrabold text-[#2563eb]">
                      {order.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-bold text-[#142d4e] group-hover:text-[#2563eb]">
                        {order.name}
                      </h3>

                      <p className="mt-1 text-xs text-[#64748b]">
                        {order.phone}
                      </p>

                      {order.email && (
                        <p className="mt-1 truncate text-xs text-[#94a3b8]">
                          {order.email}
                        </p>
                      )}

                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="rounded-full bg-[#f1f5f9] px-3 py-1 text-xs font-semibold text-[#475569]">
                          {order.pricingPlan?.title ??
                            "Service non précisé"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status and date */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pl-15 lg:justify-end lg:pl-0">
                    <div className="text-left lg:text-right">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset ${status.className}`}
                      >
                        {status.label}
                      </span>

                      {order.scheduledAt ? (
                        <p className="mt-2 text-xs font-semibold text-[#7c3aed]">
                          📅 {formatAppointment(order.scheduledAt)}
                        </p>
                      ) : (
                        <p className="mt-2 text-xs text-[#94a3b8]">
                          Reçue le {formatDate(order.createdAt)}
                        </p>
                      )}
                    </div>

                    <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e5eaf1] text-[#94a3b8] transition group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-[#2563eb]">
                      →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
