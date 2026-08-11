import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Votre Expert Tech à Vie | Marc Houle",
  description:
    "Marc Houle, expert technologique avec plus de 30 ans d'expérience. Assistance personnalisée pour cellulaires, ordinateurs, tablettes, Wi-Fi et technologie résidentielle.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}