import Reveal from "@/components/ui/Reveal";

export default function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="container contact-grid">
        <Reveal>
          <span className="section-label">Parlons-en</span>

          <h2>Besoin d&apos;aide avec votre technologie?</h2>

          <p className="contact-description">
            Appelez ou écrivez à Marc Houle pour discuter de votre
            situation et voir comment il peut vous accompagner.
          </p>

          <div className="contact-links">
            <a
              className="contact-link"
              href="tel:5146622311"
            >
              <span className="contact-icon">📞</span>
              <span>514-662-2311</span>
            </a>

            <a
              className="contact-link"
              href="mailto:marchoule23@gmail.com"
            >
              <span className="contact-icon">✉️</span>
              <span>marchoule23@gmail.com</span>
            </a>

            <div className="contact-link">
              <span className="contact-icon">📍</span>
              <span>Grand Montréal & Lanaudière</span>
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
            href="tel:5146622311"
            className="btn btn-primary"
          >
            📞 Appeler maintenant
          </a>

          <a
            href="mailto:marchoule23@gmail.com"
            className="btn btn-secondary"
          >
            ✉️ Écrire un message
          </a>
        </Reveal>
      </div>
    </section>
  );
}