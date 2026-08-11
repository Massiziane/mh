"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/ui/Reveal";

export default function Experience() {
  const [count, setCount] = useState(0);
  const counterRef = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const element = counterRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;

        started.current = true;

        const target = 30;
        const duration = 1300;
        const startTime = performance.now();

        const animate = (time: number) => {
          const progress = Math.min(
            (time - startTime) / duration,
            1
          );

          const eased = 1 - Math.pow(1 - progress, 3);

          setCount(Math.floor(eased * target));

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };

        requestAnimationFrame(animate);
        observer.unobserve(element);
      },
      {
        threshold: 0.6,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="experience" id="experience">
      <div className="container experience-grid">
        <Reveal>
          <span className="section-label section-label-dark">
            Expérience
          </span>

          <h2>
            Plus de 30 ans à rendre la technologie plus simple.
          </h2>

          <p>
            La technologie change constamment, mais une chose reste
            essentielle : pouvoir compter sur quelqu&apos;un qui prend le
            temps de comprendre votre problème et de vous
            l&apos;expliquer clairement.
          </p>

          <p>
            Mon approche privilégie la patience, l&apos;écoute et des
            solutions pratiques adaptées à vos besoins.
          </p>
        </Reveal>

        <Reveal className="stats-grid" delay={80}>
          <div className="stat-card">
            <span ref={counterRef} className="stat-number">
              {count}+
            </span>

            <span className="stat-label">
              années et plus d&apos;expérience
            </span>
          </div>

          <div className="stat-card">
            <span className="stat-number">1:1</span>
            <span className="stat-label">
              accompagnement personnalisé
            </span>
          </div>

          <div className="stat-card">
            <span className="stat-number">4+</span>
            <span className="stat-label">
              grandes catégories de services
            </span>
          </div>

          <div className="stat-card">
            <span className="stat-number">∞</span>
            <span className="stat-label">
              tranquillité technologique
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}