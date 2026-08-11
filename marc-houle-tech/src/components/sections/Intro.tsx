import Reveal from "@/components/ui/Reveal";

export default function Intro() {
  return (
    <section className="intro">
      <div className="container intro-grid">
        <Reveal className="intro-visual">
          <div className="intro-floating-card">
            <strong>La technologie, sans stress.</strong>

            <p>
              Des réponses claires, une aide humaine et une personne que
              vous connaissez.
            </p>
          </div>
        </Reveal>

        <Reveal className="intro-content" delay={80}>
          <span className="section-label">
            Votre tranquillité technologique
          </span>

          <h2 className="section-heading">
            Pas besoin de devenir un expert.
          </h2>

          <p className="section-description">
            Vous avez simplement besoin d&apos;une personne de confiance
            qui peut vous guider lorsque la technologie devient
            frustrante ou difficile à comprendre.
          </p>

          <ul className="check-list">
            <li>
              <span className="check-icon">✓</span>
              <span>
                Un service humain et adapté à votre niveau de connaissance.
              </span>
            </li>

            <li>
              <span className="check-icon">✓</span>
              <span>
                Des explications simples, sans jargon technique inutile.
              </span>
            </li>

            <li>
              <span className="check-icon">✓</span>
              <span>
                Une personne de confiance que vous pouvez contacter lorsque
                vous en avez besoin.
              </span>
            </li>

            <li>
              <span className="check-icon">✓</span>
              <span>
                Une expertise acquise durant plus de trois décennies.
              </span>
            </li>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}