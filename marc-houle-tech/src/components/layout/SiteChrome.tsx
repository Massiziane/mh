"use client";

import { usePathname } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

type SiteChromeProps = {
  children: React.ReactNode;
  businessName: string;
  phone: string;
  email: string;
  location: string;
};

export default function SiteChrome({
  children,
  businessName,
}: SiteChromeProps) {
  const pathname = usePathname();

  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar businessName={businessName} />

      {children}

      <Footer businessName={businessName} />
    </>
  );
}