import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { pricingFeatures } from "@/data/pricing";

import Reveal from "@/components/ui/Reveal";

export default async function Pricing() {
  const pricingPlans = await prisma.pricingPlan.findMany({
    where: {
      active: true,
    },
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        price: "asc",
      },
    ],
  });

  const regularService = pricingPlans.find(
    (plan) => plan.slug === "service-regulier"
  );

  const lifetimePlans = pricingPlans.filter(
    (plan) => plan.slug !== "service-regulier"
  );

  return (
    <section className="pricing-section" id="tarifs">
      <div className="container">
        <Reveal className="section-header">
          <span className="section-label">Tarifs</span>

          <h2 className="section-heading">
            Une expertise sur laquelle vous pouvez compter.
          </h2>

          <p className="section-description">
            Choisissez le service régulier à l&apos;heure ou profitez
            d&apos;une formule de service à vie, sans abonnement mensuel
            et sans frais cachés.
          </p>
        </Reveal>

        {/* Service régulier */}
        {regularService && (
          <Reveal>
            <div className="flex w-full justify-center">
              <article className="price-card w-full max-w-[340px]">
                {regularService.badge && (
                  <span className="popular-badge">
                    {regularService.badge}
                  </span>
                )}

                <div className="price-age">
                  {regularService.age}
                </div>

                <div className="price">
                  {Number(regularService.price)}
                  <sup>$</sup>
                </div>

                <p>
                  {regularService.description}
                </p>

                <ul className="price-features">
                  <li>
                    {Number(regularService.price).toFixed(2)} $ / heure
                  </li>
                  <li>Aucun contrat à vie requis</li>
                  <li>Service selon vos besoins</li>
                </ul>

                <Link
                  href={`/tarifs/${regularService.slug}`}
                  className="btn btn-white"
                >
                  En savoir plus
                </Link>
              </article>
            </div>
          </Reveal>
        )}

        {/* Contrats à vie */}
        {lifetimePlans.length > 0 && (
          <>
            <Reveal className="section-header lifetime-pricing-header">
              <span className="section-label">
                Service à vie
              </span>

              <h2 className="section-heading">
                Nos formules de service à vie
              </h2>

              <p className="section-description">
                Pour ceux qui souhaitent une assistance à long terme,
                choisissez la formule qui vous convient.
              </p>
            </Reveal>

            <div className="pricing-grid">
              {lifetimePlans.map((plan, index) => (
                <Reveal
                  key={plan.id}
                  delay={index * 80}
                >
                  <Link
                    href={`/tarifs/${plan.slug}`}
                    className="block h-full"
                  >
                    <article
                      className={`price-card h-full cursor-pointer transition-transform duration-200 hover:-translate-y-1 ${
                        plan.featured ? "featured" : ""
                      }`}
                    >
                      {plan.badge && (
                        <span className="popular-badge">
                          {plan.badge}
                        </span>
                      )}

                      <div className="price-age">
                        {plan.age}
                      </div>

                      <div className="price">
                        {Number(plan.price)}
                        <sup>$</sup>
                      </div>

                      <p>
                        {plan.description}
                      </p>

                      <ul className="price-features">
                        {pricingFeatures.map((feature) => (
                          <li key={feature}>
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <div
                        className={`btn ${
                          plan.featured
                            ? "btn-primary"
                            : "btn-white"
                        }`}
                      >
                        En savoir plus
                      </div>
                    </article>
                  </Link>
                </Reveal>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}