import { services } from "@/data/services";
import Reveal from "@/components/ui/Reveal";

export default function Services() {
  return (
    <section className="services" id="services">
      <div className="container">
        <Reveal className="section-header">
          <span className="section-label">Mes services</span>

          <h2 className="section-heading">
            Une seule personne pour votre univers technologique.
          </h2>

          <p className="section-description">
            Que vous ayez besoin d&apos;aide avec votre téléphone, votre
            ordinateur, votre Internet ou votre télévision,
            l&apos;objectif demeure le même : vous simplifier la vie.
          </p>
        </Reveal>

        <div className="services-grid">
          {services.map((service, index) => (
            <Reveal key={service.title} delay={index * 80}>
              <article className="service-card">
                <div className="service-icon">{service.icon}</div>

                <h3>{service.title}</h3>

                <p>{service.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}