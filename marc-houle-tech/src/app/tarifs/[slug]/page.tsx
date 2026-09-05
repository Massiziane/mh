import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import OrderForm from "@/components/order/OrderForm";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PricingDetailPage({
  params,
}: Props) {
  const { slug } = await params;

  const plan = await prisma.pricingPlan.findUnique({
    where: {
      slug,
    },
  });

  if (!plan || !plan.active) {
    notFound();
  }

  const isRegularService =
    plan.slug === "service-regulier";

  return (
    <main>
      <section className="pricing-section">
        <div className="container">
          <div className="mx-auto flex max-w-[600px] flex-col items-center px-4 py-16 text-center md:py-24">
            {/* Back */}
            <Link
              href="/#tarifs"
              className="mb-10 inline-flex items-center justify-center text-sm opacity-70 transition hover:opacity-100"
            >
              ← Retour aux tarifs
            </Link>

            {/* Header */}
            <div className="section-header !mb-12 flex w-full flex-col items-center text-center">
              <span className="section-label">
                {isRegularService
                  ? "Service régulier"
                  : "Service à vie"}
              </span>

              <h1 className="section-heading">
                {plan.title}
              </h1>

              <div className="price mt-5">
                {Number(plan.price)}
                <sup>$</sup>

                {isRegularService && (
                  <span className="ml-2 text-base font-semibold opacity-60">
                    / heure
                  </span>
                )}
              </div>

              <p className="section-description mx-auto">
                {plan.description}
              </p>
            </div>

            {/* Description */}
            <article className="price-card w-full text-center">
              <h2 className="mb-5 text-2xl font-bold">
                {isRegularService
                  ? "À propos du service"
                  : "À propos de cette formule"}
              </h2>

              <div className="mx-auto max-w-[480px]">
                <p>
                  {plan.description}
                </p>

                {plan.additionalDescription && (
                  <p className="mt-5 whitespace-pre-line">
                    {plan.additionalDescription}
                  </p>
                )}
              </div>
            </article>

            {/* Main image */}
            <article className="price-card mt-8 w-full overflow-hidden text-center">
              {plan.mainImageUrl ? (
                <img
                  src={plan.mainImageUrl}
                  alt={plan.title}
                  className="mx-auto aspect-[4/3] w-full rounded-2xl object-cover"
                />
              ) : (
                <div className="flex min-h-[260px] w-full items-center justify-center">
                  <div className="text-center opacity-40">
                    <div className="mb-3 text-4xl">
                      🖼️
                    </div>

                    <p>Image à venir</p>
                  </div>
                </div>
              )}
            </article>

            {/* Additional information */}
            <article className="price-card mt-8 w-full text-center">
              <h2 className="mb-5 text-2xl font-bold">
                Informations supplémentaires
              </h2>

              <p className="mx-auto max-w-[480px] whitespace-pre-line">
                {plan.additionalDescription ||
                  (isRegularService
                    ? "Le service régulier est facturé à l’heure et ne nécessite aucun contrat à vie. L’intervention est adaptée selon les besoins du client."
                    : "Les informations supplémentaires concernant cette formule seront ajoutées prochainement.")}
              </p>
            </article>

            {/* Gallery */}
            <div className="mt-12 w-full text-center">
              <h2 className="mb-6 text-2xl font-bold">
                Photos
              </h2>

              {plan.galleryUrls.length > 0 ? (
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                  {plan.galleryUrls.map(
                    (image, index) => (
                      <img
                        key={`${image}-${index}`}
                        src={image}
                        alt={`${plan.title} - ${index + 1}`}
                        className="mx-auto aspect-[4/3] w-full rounded-2xl object-cover"
                      />
                    )
                  )}
                </div>
              ) : (
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                  {[1, 2].map((item) => (
                    <div
                      key={item}
                      className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl border border-white/10"
                    >
                      <span className="opacity-40">
                        Image {item}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Contract - lifetime plans only */}
            {!isRegularService && (
              <article className="price-card mt-12 w-full text-center">
                <h2 className="text-2xl font-bold">
                  Contrat de service
                </h2>

                <p className="mx-auto mt-5 max-w-[460px]">
                  Consultez le contrat complet associé à
                  cette formule de service à vie.
                </p>

                <div className="mt-7 flex justify-center">
                  {plan.contractUrl ? (
                    <a
                      href={plan.contractUrl}
                      download
                      className="btn btn-primary"
                    >
                      Télécharger le contrat
                    </a>
                  ) : (
                    <button
                      disabled
                      className="btn btn-primary cursor-not-allowed opacity-40"
                    >
                      Contrat bientôt disponible
                    </button>
                  )}
                </div>
              </article>
            )}

            {/* Order */}
            <section className="mt-16 w-full">
              <div className="mb-8 text-center">
                <span className="section-label">
                  Demande de service
                </span>

                <h2 className="mt-5 text-2xl font-bold md:text-3xl">
                  Faire une demande
                </h2>

                <p className="mx-auto mt-4 max-w-[480px] opacity-70">
                  {isRegularService
                    ? "Remplissez le formulaire avec vos coordonnées, vos disponibilités et une description de vos besoins. Vous pouvez également joindre des photos."
                    : "Remplissez le formulaire avec vos coordonnées, vos disponibilités et une description de vos besoins. Vous pouvez également joindre des photos et votre contrat signé."}
                </p>
              </div>

              <OrderForm />
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}