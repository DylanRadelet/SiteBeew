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

/**
 * Pilier SEO — mot-clé principal : « création site internet ».
 *
 * Ordre des sections figé par PAGES.md §3. Tout le texte vient du JSON validé
 * par `src/content/schemas/service.ts` : rien n'est écrit en dur ici.
 */

const service = getService("creation-site-internet");

export const metadata: Metadata = serviceMetadata(service);

export default function CreationSiteInternetPage() {
  return (
    <>
      <JsonLd data={serviceJsonLd(service)} />

      <PageHero
        fil={[
          { href: "/", label: "Accueil" },
          { href: "/creation-site-internet", label: "Création de site internet" },
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
