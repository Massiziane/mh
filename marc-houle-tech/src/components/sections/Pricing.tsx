import {
  pricingFeatures,
  pricingPlans,
} from "@/data/pricing";

import Reveal from "@/components/ui/Reveal";

export default function Pricing() {
  return (
    <section className="pricing-section" id="tarifs">
      <div className="container">
        <Reveal className="section-header">
          <span className="section-label">Service à vie</span>

          <h2 className="section-heading">
            Une expertise sur laquelle vous pouvez compter.
          </h2>

          <p className="section-description">
            Une fois membre, vous profitez de mon expertise selon votre
            formule. Sans abonnement mensuel et sans frais cachés.
          </p>
        </Reveal>

        <div className="pricing-grid">
          {pricingPlans.map((plan, index) => (
            <Reveal key={plan.age} delay={index * 80}>
              <article
                className={`price-card ${
                  plan.featured ? "featured" : ""
                }`}
              >
                {plan.badge && (
                  <span className="popular-badge">
                    {plan.badge}
                  </span>
                )}

                <div className="price-age">{plan.age}</div>

                <div className="price">
                  {plan.price}
                  <sup>$</sup>
                </div>

                <p>{plan.description}</p>

                <ul className="price-features">
                  {pricingFeatures.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>

                <a
                  href="tel:5146622311"
                  className={`btn ${
                    plan.featured ? "btn-primary" : "btn-white"
                  }`}
                >
                  {plan.featured ? "Appeler Marc" : "En savoir plus"}
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}