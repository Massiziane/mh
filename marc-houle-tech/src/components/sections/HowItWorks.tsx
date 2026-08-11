import Reveal from "@/components/ui/Reveal";

const steps = [
  {
    number: 1,
    title: "Vous me contactez",
    description:
      "Expliquez-moi simplement ce qui vous pose problème ou ce que vous souhaitez apprendre.",
  },
  {
    number: 2,
    title: "On règle le problème",
    description:
      "Je vous aide à configurer, comprendre ou réparer votre environnement technologique.",
  },
  {
    number: 3,
    title: "Vous restez accompagné",
    description:
      "Vous savez désormais vers qui vous tourner lorsque vous avez de nouvelles questions.",
  },
];

export default function HowItWorks() {
  return (
    <section className="how-it-works" id="fonctionnement">
      <div className="container">
        <Reveal className="section-header">
          <span className="section-label">
            Comment ça fonctionne
          </span>

          <h2 className="section-heading">
            Une approche simple, humaine et directe.
          </h2>

          <p className="section-description">
            Pas de processus compliqué. Vous expliquez votre besoin, nous
            trouvons la solution et je vous accompagne.
          </p>
        </Reveal>

        <div className="steps">
          {steps.map((step, index) => (
            <Reveal
              key={step.number}
              className="step"
              delay={index * 80}
            >
              <div className="step-number">{step.number}</div>

              <h3>{step.title}</h3>

              <p>{step.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}