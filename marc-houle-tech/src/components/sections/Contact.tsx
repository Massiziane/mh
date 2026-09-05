import Reveal from "@/components/ui/Reveal";

type ContactProps = {
  businessName: string;
  phone: string;
  email: string;
  location: string;
};

export default function Contact({
  businessName,
  phone,
  email,
  location,
}: ContactProps) {
  const phoneHref = phone.replace(/\D/g, "");

  return (
    <section className="contact" id="contact">
      <div className="container contact-grid">
        <Reveal>
          <span className="section-label">Parlons-en</span>

          <h2>Besoin d&apos;aide avec votre technologie?</h2>

          <p className="contact-description">
            Appelez ou écrivez à {businessName} pour discuter de votre
            situation et voir comment il peut vous accompagner.
          </p>

          <div className="contact-links">
            <a
              className="contact-link"
              href={`tel:${phoneHref}`}
            >
              <span className="contact-icon">📞</span>
              <span>{phone}</span>
            </a>

            <a
              className="contact-link"
              href={`mailto:${email}`}
            >
              <span className="contact-icon">✉️</span>
              <span>{email}</span>
            </a>

            <div className="contact-link">
              <span className="contact-icon">📍</span>
              <span>{location}</span>
            </div>
          </div>
        </Reveal>

        <Reveal className="contact-card" delay={80}>
          <h3>Votre tranquillité commence ici.</h3>

          <p>
            Une conversation suffit pour comprendre vos besoins. Aucun
            jargon technique — simplement des solutions.
          </p>

          <a
            href={`tel:${phoneHref}`}
            className="btn btn-primary"
          >
            📞 Appeler maintenant
          </a>

          <a
            href={`mailto:${email}`}
            className="btn btn-secondary"
          >
            ✉️ Écrire un message
          </a>
        </Reveal>
      </div>
    </section>
  );
}