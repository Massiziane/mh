import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import Hero from "@/components/sections/Hero";
import Intro from "@/components/sections/Intro";
import Services from "@/components/sections/Services";
import Experience from "@/components/sections/Experience";
import HowItWorks from "@/components/sections/HowItWorks";
import Pricing from "@/components/sections/Pricing";
import Trust from "@/components/sections/Trust";
import Contact from "@/components/sections/Contact";

import BackToTop from "@/components/ui/BackToTop";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Intro />
        <Services />
        <Experience />
        <HowItWorks />
        <Pricing />
        <Trust />
        <Contact />
      </main>

      <Footer />
      <BackToTop />
    </>
  );
}