import Hero from "@/components/sections/Hero";
import Intro from "@/components/sections/Intro";
import Services from "@/components/sections/Services";
import Experience from "@/components/sections/Experience";
import HowItWorks from "@/components/sections/HowItWorks";
import Pricing from "@/components/sections/Pricing";
import Trust from "@/components/sections/Trust";
import Contact from "@/components/sections/Contact";

import BackToTop from "@/components/ui/BackToTop";

import { prisma } from "@/lib/prisma";

export default async function Home() {
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
    <>
      <Hero />

      <Intro />

      <Services />

      <Experience />

      <HowItWorks />

      <Pricing />

      <Trust />

      <Contact
        businessName={businessName}
        phone={phone}
        email={email}
        location={location}
      />

      <BackToTop />
    </>
  );
}