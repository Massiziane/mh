import Reveal from "@/components/ui/Reveal";

export default function Trust() {
  return (
    <section className="trust">
      <div className="container">
        <Reveal className="trust-box">
          <div>
            <span className="section-label section-label-dark">
              Une relation de confiance
            </span>

            <h2>
              Plus qu&apos;un technicien : votre référence technologique.
            </h2>

            <p>
              Plus besoin de chercher une nouvelle personne chaque fois
              qu&apos;un appareil vous cause des problèmes. Vous savez
              déjà qui appeler.
            </p>
          </div>

          <a href="tel:5146622311" className="btn btn-primary">
            📞 514-662-2311
          </a>
        </Reveal>
      </div>
    </section>
  );
}