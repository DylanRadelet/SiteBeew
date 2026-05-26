// src/app/page.tsx

import AboutSection from "@/components/sections/AboutSection";
import CtaSection from "@/components/sections/CtaSection";
import HeroSection from "@/components/sections/HeroSection";
import MarqueeSection from "@/components/sections/MarqueeSection";
import PricingSection from "@/components/sections/PricingSection";
import ProcessSection from "@/components/sections/ProcessSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ServicesSection from "@/components/sections/ServicesSection";
import StatsSection from "@/components/sections/StatsSection";


export default function Home() {
  return (
    <>
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <StatsSection />
      <ProcessSection />
      <ServicesSection />
      <ProjectsSection />
      <PricingSection />
      <CtaSection />
    </>
  )
}
