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

/** Pilier SEO — mot-clé principal : « création site e-commerce ». */

const service = getService("site-e-commerce");

export const metadata: Metadata = serviceMetadata(service);

export default function SiteECommercePage() {
  return (
    <>
      <JsonLd data={serviceJsonLd(service)} />

      <PageHero
        fil={[
          { href: "/", label: "Accueil" },
          { href: "/site-e-commerce", label: "Site e-commerce" },
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
