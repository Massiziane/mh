
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

import OrderManagement from "./OrderManagement";

type Props = {
  params: Promise<{ id: string }>;
};

const statusLabels: Record<string, string> = {
  NEW: "Nouvelle",
  IN_REVIEW: "En révision",
  ACCEPTED: "Acceptée",
  OPEN: "Ouverte",
  PLANNED: "Planifiée",
  COMPLETED: "Terminée",
  CANCELLED: "Annulée",
};

const statusColors: Record<string, string> = {
  NEW: "bg-blue-50 text-blue-700",
  IN_REVIEW: "bg-amber-50 text-amber-700",
  ACCEPTED: "bg-emerald-50 text-emerald-700",
  OPEN: "bg-amber-50 text-amber-700",
  PLANNED: "bg-violet-50 text-violet-700",
  COMPLETED: "bg-emerald-50 text-emerald-700",
  CANCELLED: "bg-red-50 text-red-700",
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-CA", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Toronto",
  }).format(date);
}

function appointmentParts(date: Date | null) {
  if (!date) {
    return { date: "", time: "" };
  }

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const value = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return {
    date: `${value("year")}-${value("month")}-${value("day")}`,
    time: `${value("hour")}:${value("minute")}`,
  };
}

export default async function AdminOrderDetailPage({
  params,
}: Props) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      pricingPlan: true,
      images: true,
    },
  });

  if (!order) notFound();

  const appointment = appointmentParts(order.scheduledAt);

  return (
    <main className="mx-auto w-full max-w-[1400px] pb-16">
      <Link
        href="/admin/orders"
        className="text-sm font-bold text-[#2563eb] hover:underline"
      >
        ← Retour aux demandes
      </Link>

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
            Fiche client
          </span>

          <h1 className="mt-4 text-3xl font-extrabold text-[#142d4e]">
            {order.name}
          </h1>

          <p className="mt-2 text-sm text-[#64748b]">
            Demande reçue le {formatDate(order.createdAt)}
          </p>

          <p className="mt-2 break-all text-xs text-[#94a3b8]">
            Référence : {order.id}
          </p>
        </div>

        <span
          className={`self-start rounded-full px-4 py-2 text-sm font-bold ${
            statusColors[order.status] ??
            "bg-slate-100 text-slate-700"
          }`}
        >
          {statusLabels[order.status] ?? order.status}
        </span>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        {/* Left: customer details */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-[#e5eaf1] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-extrabold text-[#142d4e]">
              Informations du client
            </h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-bold text-[#94a3b8]">
                  Nom
                </p>
                <p className="mt-2 font-semibold text-[#142d4e]">
                  {order.name}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-[#94a3b8]">
                  Téléphone
                </p>
                <a
                  href={`tel:${order.phone.replace(/[^\d+]/g, "")}`}
                  className="mt-2 inline-block font-semibold text-[#2563eb] hover:underline"
                >
                  {order.phone}
                </a>
              </div>

              <div className="sm:col-span-2">
                <p className="text-xs font-bold text-[#94a3b8]">
                  Courriel
                </p>
                {order.email ? (
                  <a
                    href={`mailto:${order.email}`}
                    className="mt-2 inline-block break-all font-semibold text-[#2563eb] hover:underline"
                  >
                    {order.email}
                  </a>
                ) : (
                  <p className="mt-2 text-sm text-amber-700">
                    Aucun courriel enregistré
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <p className="text-xs font-bold text-[#94a3b8]">
                  Adresse du client
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm font-semibold text-[#142d4e]">
                  {order.address}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-[#e5eaf1] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-extrabold text-[#142d4e]">
              Demande du client
            </h2>

            <div className="mt-5 rounded-xl bg-[#f8fafc] p-5">
              <p className="whitespace-pre-wrap break-words text-sm leading-7 text-[#475569]">
                {order.description}
              </p>
            </div>

            <h3 className="mt-6 text-sm font-bold text-[#142d4e]">
              Disponibilités indiquées
            </h3>

            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#64748b]">
              {order.availability}
            </p>
          </section>

          <section className="rounded-2xl border border-[#e5eaf1] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-extrabold text-[#142d4e]">
              Service demandé
            </h2>

            {order.pricingPlan ? (
              <div className="mt-5">
                <p className="text-xl font-extrabold text-[#142d4e]">
                  {order.pricingPlan.title}
                </p>

                <p className="mt-2 text-sm text-[#64748b]">
                  {order.pricingPlan.description}
                </p>

                <p className="mt-5 text-2xl font-extrabold text-[#142d4e]">
                  {Number(order.pricingPlan.price).toLocaleString(
                    "fr-CA",
                    {
                      style: "currency",
                      currency: "CAD",
                    }
                  )}
                  {order.pricingPlan.slug ===
                    "service-regulier" && (
                    <span className="ml-2 text-sm font-normal text-[#64748b]">
                      / heure
                    </span>
                  )}
                </p>
              </div>
            ) : (
              <p className="mt-4 text-sm text-[#64748b]">
                Aucun service associé.
              </p>
            )}
          </section>

          <section className="rounded-2xl border border-[#e5eaf1] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-extrabold text-[#142d4e]">
              Documents et photos
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#64748b]">
              Les fichiers transmis avec la demande sont
              envoyés à l'adresse courriel de l'entreprise.
            </p>

            {order.images.length > 0 && (
              <div className="mt-5 space-y-2">
                {order.images.map((image) => (
                  <a
                    key={image.id}
                    href={image.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block break-all text-sm font-semibold text-[#2563eb] hover:underline"
                  >
                    Consulter une photo →
                  </a>
                ))}
              </div>
            )}

            {order.signedContractUrl && (
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={`/api/admin/contracts/${order.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-xl bg-[#142d4e] px-4 py-3 text-sm font-bold text-white hover:bg-[#23476f]"
                >
                  Voir le contrat signé
                </a>
                <a
                  href={`/api/admin/contracts/${order.id}?download=1`}
                  className="inline-flex items-center rounded-xl border border-[#dbe3ed] bg-white px-4 py-3 text-sm font-bold text-[#142d4e] hover:bg-[#f8fafc]"
                >
                  Télécharger le contrat
                </a>
              </div>
            )}

            {order.images.length === 0 &&
              !order.signedContractUrl && (
                <p className="mt-4 rounded-xl bg-[#f8fafc] p-4 text-sm text-[#64748b]">
                  Aucun fichier stocké sur le site.
                  Consultez Gmail pour les pièces jointes.
                </p>
              )}
          </section>
        </div>

        {/* Right: technician tools */}
        <div className="space-y-6">
          <OrderManagement
            order={{
              id: order.id,
              email: order.email,
              status: order.status,
              address: order.address,
              scheduledDate: appointment.date,
              scheduledTime: appointment.time,
              appointmentAddress:
                order.appointmentAddress ?? "",
              appointmentNotes:
                order.appointmentNotes ?? "",
              confirmationSentAt:
                order.confirmationSentAt?.toISOString() ??
                null,
            }}
          />

          <section className="rounded-2xl border border-[#e5eaf1] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-extrabold text-[#142d4e]">
              Informations de suivi
            </h2>

            <div className="mt-5 space-y-4 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-[#64748b]">
                  Création
                </span>
                <span className="text-right font-semibold text-[#142d4e]">
                  {formatDate(order.createdAt)}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-[#64748b]">
                  Dernière modification
                </span>
                <span className="text-right font-semibold text-[#142d4e]">
                  {formatDate(order.updatedAt)}
                </span>
              </div>

              {order.confirmationSentAt && (
                <div className="flex justify-between gap-4">
                  <span className="text-[#64748b]">
                    Confirmation envoyée
                  </span>
                  <span className="text-right font-semibold text-emerald-700">
                    {formatDate(order.confirmationSentAt)}
                  </span>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
