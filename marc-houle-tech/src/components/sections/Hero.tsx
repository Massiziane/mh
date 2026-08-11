export default function Hero() {
  return (
    <header className="hero" id="accueil">
      <div className="container hero-content">
        <div className="hero-copy">
          <div className="hero-badge">
            <span className="badge-dot" />
            Grand Montréal & Lanaudière
          </div>

          <h1>
            Votre expert
            <span>tech à vie.</span>
          </h1>

          <p className="hero-subtitle">
            La technologie ne devrait jamais être compliquée. Avec{" "}
            <strong>plus de 30 ans d&apos;expérience</strong>, Marc
            Houle vous accompagne personnellement pour simplifier vos
            appareils, votre informatique et votre quotidien numérique.
          </p>

          <div className="hero-actions">
            <a href="tel:5146622311" className="btn btn-primary">
              📞 Appeler Marc
            </a>

            <a href="#services" className="btn btn-secondary">
              Découvrir les services ↓
            </a>
          </div>

          <div className="hero-meta">
            <div className="hero-meta-item">
              <strong>30+</strong>
              <span>années d&apos;expérience</span>
            </div>

            <div className="hero-meta-item">
              <strong>1 à 1</strong>
              <span>service personnalisé</span>
            </div>

            <div className="hero-meta-item">
              <strong>À vie</strong>
              <span>selon votre forfait</span>
            </div>
          </div>
        </div>

        <div className="hero-card">
          <div className="profile-circle">MH</div>

          <h3>Marc Houle</h3>

          <p className="hero-card-role">
            Technicien & accompagnateur technologique
          </p>

          <div className="hero-card-list">
            <div>
              <span>✓</span>
              Explications simples et patientes
            </div>

            <div>
              <span>✓</span>
              Assistance personnalisée
            </div>

            <div>
              <span>✓</span>
              Ordinateurs, cellulaires et tablettes
            </div>

            <div>
              <span>✓</span>
              Technologie résidentielle
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}