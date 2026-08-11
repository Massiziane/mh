export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer>
      <div className="container footer-inner">
        <div>
          <strong>Marc Houle</strong>
          <br />
          Votre Expert Tech à Vie
        </div>

        <div className="footer-links">
          <a href="#services">Services</a>
          <a href="#tarifs">Tarifs</a>
          <a href="#contact">Contact</a>
        </div>

        <div>© {year} Marc Houle</div>
      </div>
    </footer>
  );
}