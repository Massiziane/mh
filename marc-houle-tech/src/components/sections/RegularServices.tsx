const regularServices = [
  {
    title: "Service 1",
    description: "Description du service.",
  },
  {
    title: "Service 2",
    description: "Description du service.",
  },
  {
    title: "Service 3",
    description: "Description du service.",
  },
];

export default function RegularServices() {
  return (
    <section className="regular-services" id="services-reguliers">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Services réguliers</span>

          <h2>Services réguliers</h2>

          <p>
            Découvrez nos services disponibles pour vos besoins technologiques
            du quotidien.
          </p>
        </div>

        <div className="regular-services-grid">
          {regularServices.map((service) => (
            <article className="regular-service-card" key={service.title}>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}