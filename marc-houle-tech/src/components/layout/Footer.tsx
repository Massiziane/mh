type FooterProps = {
  businessName: string;
};

export default function Footer({
  businessName,
}: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer>
      <div className="container footer-inner">
        <div>
          <strong>{businessName}</strong>
          <br />
          Votre Expert Tech à Vie
        </div>

        <div className="footer-links">
          <a href="#services">
            Services
          </a>

          <a href="#tarifs">
            Tarifs
          </a>

          <a href="#contact">
            Contact
          </a>
        </div>

        <div>
          © {year} {businessName}
        </div>
      </div>
    </footer>
  );
}