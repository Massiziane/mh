import "./globals.css";

import SiteChrome from "@/components/layout/SiteChrome";
import { prisma } from "@/lib/prisma";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await prisma.siteSettings.findFirst();

  const businessName =
    settings?.businessName ?? "Marc Houle";

  const phone =
    settings?.phone ?? "514-662-2311";

  const email =
    settings?.email ?? "marchoule23@gmail.com";

  const location =
    settings?.address ?? "Grand Montréal & Lanaudière";

  return (
    <html lang="fr">
      <body>
        <SiteChrome
          businessName={businessName}
          phone={phone}
          email={email}
          location={location}
        >
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}