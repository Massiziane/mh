"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);

    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav
      className={`navbar ${scrolled ? "scrolled" : ""}`}
      id="navbar"
    >
      <div className="container nav-inner">
        <a href="#accueil" className="logo" onClick={closeMenu}>
          <div className="logo-icon">MH</div>

          <div className="logo-text">
            Marc Houle
            <span>Votre expert technologique</span>
          </div>
        </a>

        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen((current) => !current)}
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <a href="#services" onClick={closeMenu}>
            Services
          </a>

          <a href="#experience" onClick={closeMenu}>
            Expérience
          </a>

          <a href="#fonctionnement" onClick={closeMenu}>
            Fonctionnement
          </a>

          <a href="#tarifs" onClick={closeMenu}>
            Tarifs
          </a>

          <a
            href="#contact"
            className="nav-cta"
            onClick={closeMenu}
          >
            Me contacter
          </a>
        </div>
      </div>
    </nav>
  );
}