import type { Metadata } from "next";
import { Faq, LocalContext } from "@/components/home";
import {
  CasesFeatured,
  FinalCta,
  Method,
  Pricing,
  ServicesBento,
  TestimonialsDark,
  TrustBar,
  WhyUs,
} from "@/components/home/sections";
import { HeroSequence } from "@/components/hero/HeroSequence";
import { ZoneEnfants, type LienZone } from "@/components/region/sections";
import { JsonLd } from "@/components/seo/JsonLd";
import { getHome, getPublishedCities } from "@/lib/cities";
import { getProvinceZones } from "@/lib/regions";
import { homeJsonLd, homeMetadata } from "@/lib/seo";

/**
 * HOME — l'ordre des sections vient de PAGES.md §2, lui-même tiré de l'analyse
 * de cinq agences qui convertissent. Chaque section répond à UNE question, dans
 * l'ordre où le visiteur se la pose.
 *
 * La règle à ne pas casser : les réalisations passent AVANT les services.
 * On prouve avant de proposer.
 */

export const metadata: Metadata = homeMetadata(getHome());

export default function HomePage() {
  const home = getHome();

  // Les deux étages sous la région : provinces d'abord, communes ensuite.
  // La home ne lie pas vers `/wallonie` ici — le pied de page et le menu s'en
  // chargent, et l'intérêt de ce bloc est de descendre, pas de tourner en rond.
  const zones: LienZone[] = [
    ...getProvinceZones().map((z) => ({
      href: `/${z.slug}`,
      label: z.name,
      note: z.hero.subtitle,
    })),
    ...getPublishedCities().map((c) => ({
      href: `/${c.slug}`,
      label: c.city,
      note: `Province de ${c.province}`,
    })),
  ];

  return (
    <>
      <JsonLd data={homeJsonLd(home)} />

      {/* 1 — Hero figé, texte qui se remplace, puis zoom de sortie */}
      <HeroSequence h1={home.hero.h1} intro={home.hero.subtitle} manifesto={home.manifesto} />

      <div id="suite" className="relative z-0 -mt-[100svh] pt-[18svh]">
        {/* 2 — La preuve sociale avant tout le reste */}
        <TrustBar trust={home.trust} />

        {/* 4 — Les résultats, AVANT les services. La section n'existe que s'il
            y a quelque chose de vrai à montrer. */}
        {home.cases.length > 0 && <CasesFeatured cases={home.cases} />}

        {/* 5 — Ce qu'on fait (bloc sombre : il découpe la page en deux) */}
        <ServicesBento services={home.services} />

        {/* 6 — Comment ça se passe */}
        <Method method={home.method} />

        {/* 7 — Pourquoi nous, et pourquoi c'est sans risque */}
        <WhyUs why={home.why} />

        {/* 8 — Ce qu'en disent les clients (bloc sombre) */}
        {home.testimonials.length > 0 && <TestimonialsDark testimonials={home.testimonials} />}

        {/* 9 — Qui nous sommes et où nous intervenons */}
        <LocalContext heading={home.about.heading} body={home.about.body} />

        {/* 9b — La descente vers la pyramide locale. C'est le maillage principal
            home → provinces → communes : de vrais liens dans le HTML statique,
            jamais un sélecteur en JavaScript. */}
        <ZoneEnfants
          surtitre="Où nous intervenons"
          titre="Choisissez votre zone"
          intro="Chaque page décrit le marché réel de sa zone : concurrence locale, filières dominantes, ce que vos clients tapent réellement."
          lien={{ href: "/zones-d-intervention", label: "Toutes nos zones" }}
          items={zones}
        />

        {/* 10 — Combien ça coûte */}
        <Pricing pricing={home.pricing} />

        {/* 11 — Les objections restantes */}
        <Faq faq={home.faq} />

        {/* 13 — Dernier appel */}
        <FinalCta />
      </div>
    </>
  );
}
