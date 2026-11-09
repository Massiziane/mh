
import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const statusLabels: Record<string, string> = {
  NEW: "Nouvelle demande",
  IN_REVIEW: "En cours d'analyse",
  ACCEPTED: "Acceptée",
  COMPLETED: "Terminée",
  CANCELLED: "Annulée",
};

const statusColors: Record<string, string> = {
  NEW: "bg-[#eaf5ff] text-[#0868ad]",
  IN_REVIEW: "bg-[#fff4d6] text-[#946200]",
  ACCEPTED: "bg-[#e9f8ef] text-[#169454]",
  COMPLETED: "bg-[#edf7ed] text-[#267a36]",
  CANCELLED: "bg-[#fff0f0] text-[#c0392b]",
};

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

  if (!order) {
    notFound();
  }

  const formattedDate = new Intl.DateTimeFormat(
    "fr-CA",
    {
      dateStyle: "long",
      timeStyle: "short",
      timeZone: "America/Toronto",
    }
  ).format(order.createdAt);

  const statusLabel =
    statusLabels[order.status] ?? order.status;

  const statusColor =
    statusColors[order.status] ??
    "bg-gray-100 text-gray-700";

  return (
    <div className="mx-auto w-full max-w-[1100px] pb-16">

      {/* Back navigation */}
      <div className="mb-8">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#0868ad] transition hover:opacity-70"
        >
          ← Retour aux demandes
        </Link>
      </div>

      {/* Page Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="inline-flex rounded-full bg-[#eaf5ff] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#0868ad]">
            Demande client
          </span>

          <h1 className="mt-4 text-3xl font-black tracking-tight text-[#032f55]">
            Détails de la demande
          </h1>

          <p className="mt-2 text-sm text-[#677789]">
            Reçue le {formattedDate}
          </p>

          <p className="mt-2 break-all text-xs text-[#677789]">
            Référence : {order.id}
          </p>
        </div>

        <div>
          <span
            className={`inline-flex rounded-full px-4 py-2 text-sm font-black ${statusColor}`}
          >
            {statusLabel}
          </span>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">

        {/* Main content */}
        <div className="space-y-6 lg:col-span-2">

          {/* Customer Information */}
          <section className="rounded-[22px] border border-[#113b5e]/10 bg-white p-6 shadow-[0_10px_30px_rgba(0,38,70,0.06)] sm:p-8">
            <h2 className="text-xl font-black text-[#032f55]">
              Informations du client
            </h2>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#677789]">
                  Nom complet
                </p>

                <p className="mt-2 font-semibold text-[#032f55]">
                  {order.name}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#677789]">
                  Téléphone
                </p>

                <a
                  href={`tel:${order.phone.replace(/[^\d+]/g, "")}`}
                  className="mt-2 inline-block font-semibold text-[#0868ad] hover:underline"
                >
                  {order.phone}
                </a>
              </div>

              <div className="sm:col-span-2">
                <p className="text-xs font-bold uppercase tracking-wide text-[#677789]">
                  Adresse
                </p>

                <p className="mt-2 whitespace-pre-line font-semibold text-[#032f55]">
                  {order.address}
                </p>
              </div>
            </div>
          </section>

          {/* Service Description */}
          <section className="rounded-[22px] border border-[#113b5e]/10 bg-white p-6 shadow-[0_10px_30px_rgba(0,38,70,0.06)] sm:p-8">
            <h2 className="text-xl font-black text-[#032f55]">
              Description de la demande
            </h2>

            <div className="mt-6 rounded-[16px] bg-[#f8fbfe] p-5">
              <p className="whitespace-pre-wrap break-words text-sm leading-7 text-[#435365]">
                {order.description}
              </p>
            </div>
          </section>

          {/* Availability */}
          <section className="rounded-[22px] border border-[#113b5e]/10 bg-white p-6 shadow-[0_10px_30px_rgba(0,38,70,0.06)] sm:p-8">
            <h2 className="text-xl font-black text-[#032f55]">
              Disponibilités du client
            </h2>

            <div className="mt-6 rounded-[16px] border border-[#0868ad]/10 bg-[#eaf5ff]/40 p-5">
              <p className="whitespace-pre-wrap break-words text-sm leading-7 text-[#435365]">
                {order.availability}
              </p>
            </div>
          </section>

          {/* Attachments */}
          <section className="rounded-[22px] border border-[#113b5e]/10 bg-white p-6 shadow-[0_10px_30px_rgba(0,38,70,0.06)] sm:p-8">
            <h2 className="text-xl font-black text-[#032f55]">
              Documents et photos
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#677789]">
              Les documents envoyés avec les nouvelles
              demandes sont transmis à l'adresse courriel
              de l'entreprise.
            </p>

            {order.images.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-4 font-bold text-[#032f55]">
                  Photos enregistrées
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  {order.images.map((image) => (
                    <a
                      key={image.id}
                      href={image.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block overflow-hidden rounded-[16px] border border-[#113b5e]/10"
                    >
                      <img
                        src={image.url}
                        alt="Photo de la demande"
                        className="aspect-[4/3] w-full object-cover"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {order.signedContractUrl && (
              <div className="mt-6 rounded-[16px] border border-[#169454]/20 bg-[#e9f8ef] p-5">
                <p className="font-bold text-[#169454]">
                  ✓ Contrat signé enregistré
                </p>

                <a
                  href={order.signedContractUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-sm font-bold text-[#0868ad] hover:underline"
                >
                  Consulter le contrat
                </a>
              </div>
            )}

            {order.images.length === 0 &&
              !order.signedContractUrl && (
                <div className="mt-6 rounded-[16px] bg-[#f8fbfe] p-5">
                  <p className="text-sm text-[#677789]">
                    Aucun fichier enregistré dans la base
                    de données. Consultez le courriel de
                    notification pour retrouver les
                    pièces jointes, si elles ont été envoyées.
                  </p>
                </div>
              )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">

          {/* Pricing Plan */}
          <section className="rounded-[22px] border border-[#113b5e]/10 bg-white p-6 shadow-[0_10px_30px_rgba(0,38,70,0.06)]">
            <h2 className="text-lg font-black text-[#032f55]">
              Formule sélectionnée
            </h2>

            {order.pricingPlan ? (
              <div className="mt-5">
                <span className="inline-flex rounded-full bg-[#eaf5ff] px-3 py-1 text-xs font-bold text-[#0868ad]">
                  {order.pricingPlan.age}
                </span>

                <h3 className="mt-4 text-xl font-black text-[#032f55]">
                  {order.pricingPlan.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#677789]">
                  {order.pricingPlan.description}
                </p>

                <div className="mt-5 border-t border-[#113b5e]/10 pt-5">
                  <span className="text-3xl font-black text-[#032f55]">
                    {Number(order.pricingPlan.price).toLocaleString(
                      "fr-CA"
                    )} $
                  </span>

                  {order.pricingPlan.slug ===
                    "service-regulier" && (
                    <span className="ml-2 text-sm text-[#677789]">
                      / heure
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <p className="mt-5 text-sm text-[#677789]">
                Aucune formule associée.
              </p>
            )}
          </section>

          {/* Order Information */}
          <section className="rounded-[22px] border border-[#113b5e]/10 bg-white p-6 shadow-[0_10px_30px_rgba(0,38,70,0.06)]">
            <h2 className="text-lg font-black text-[#032f55]">
              Informations de suivi
            </h2>

            <div className="mt-5 space-y-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#677789]">
                  Statut
                </p>

                <p className="mt-2 font-bold text-[#032f55]">
                  {statusLabel}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#677789]">
                  Date de réception
                </p>

                <p className="mt-2 text-sm font-semibold text-[#032f55]">
                  {formattedDate}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#677789]">
                  Dernière modification
                </p>

                <p className="mt-2 text-sm font-semibold text-[#032f55]">
                  {new Intl.DateTimeFormat("fr-CA", {
                    dateStyle: "long",
                    timeStyle: "short",
                    timeZone: "America/Toronto",
                  }).format(order.updatedAt)}
                </p>
              </div>
            </div>
          </section>

          {/* Quick Action */}
          <section className="rounded-[22px] border border-[#113b5e]/10 bg-white p-6 shadow-[0_10px_30px_rgba(0,38,70,0.06)]">
            <h2 className="text-lg font-black text-[#032f55]">
              Contacter le client
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#677789]">
              Contactez le client pour discuter de sa
              demande ou confirmer ses disponibilités.
            </p>

            <a
              href={`tel:${order.phone.replace(/[^\d+]/g, "")}`}
              className="mt-5 flex min-h-[48px] items-center justify-center rounded-[12px] bg-[#0868ad] px-5 text-sm font-black text-white transition hover:bg-[#075a95]"
            >
              Appeler le client
            </a>
          </section>

        </div>
      </div>
    </div>
  );
}
