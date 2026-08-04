import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  ServiceFaq,
  ServiceIncluded,
  ServiceLinks,
  ServiceMethod,
  ServicePricing,
  ServiceProblem,
  ServiceProof,
} from "@/components/service/sections";
import { PageHero } from "@/components/ui/PageHero";
import { getService, serviceJsonLd, serviceMetadata } from "@/lib/services";

/** Pilier SEO — mot-clé principal : « outil interne sur mesure ». */

const service = getService("outils-internes");

export const metadata: Metadata = serviceMetadata(service);

export default function OutilsInternesPage() {
  return (
    <>
      <JsonLd data={serviceJsonLd(service)} />

      <PageHero
        fil={[
          { href: "/", label: "Accueil" },
          { href: "/outils-internes", label: "Outils internes" },
        ]}
        surtitre="Service"
        h1={service.hero.h1}
        intro={service.hero.subtitle}
        badges={service.hero.badges}
        image={{ src: "/images/heros/services.jpg" }}
      />
      <ServiceProblem problem={service.problem} />
      <ServiceIncluded included={service.included} />
      <ServiceMethod method={service.method} />
      <ServiceProof proof={service.proof} />
      <ServicePricing pricing={service.pricing} />
      <ServiceFaq faq={service.faq} />
      <ServiceLinks links={service.links} />
    </>
  );
}
