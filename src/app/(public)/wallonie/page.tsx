import type { Metadata } from "next";
import { Faq } from "@/components/home";
import {
  ZoneEconomie,
  ZoneEnfants,
  ZoneFaits,
  ZoneSecteurs,
  type LienZone,
} from "@/components/region/sections";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { getZoneBySlug, getZoneTrail, zoneJsonLd, zoneMetadata } from "@/lib/regions";

/**
 * Étage 1 de la pyramide SEO locale : la région.
 * Elle ne cible aucune commune — son rôle est de recevoir les liens larges et
 * de les redistribuer vers les provinces, qui redistribuent vers les villes.
 */

const SLUG = "wallonie";

/** Le contenu est validé au build ; une zone absente est une erreur de build, pas un 404. */
function zone() {
  const z = getZoneBySlug(SLUG);
  if (!z) throw new Error(`Zone "${SLUG}" introuvable dans src/content/regions/.`);
  return z;
}

export function generateMetadata(): Metadata {
  return zoneMetadata(zone());
}

export default function WalloniePage() {
  const z = zone();
  const fil = getZoneTrail(z);

  const provinces: LienZone[] = z.provinces.map((p) => ({
    href: p.slug ? `/${p.slug}` : null,
    label: p.name,
    note: p.focus,
  }));

  return (
    <>
      <JsonLd data={zoneJsonLd(z, z.provinces.map((p) => p.name))} />

      <PageHero
        fil={fil}
        surtitre="Région"
        h1={z.hero.h1}
        intro={z.hero.subtitle}
        badges={z.hero.badges}
        image={{ src: "/images/heros/zones.jpg" }}
      />

      <ZoneFaits facts={z.facts} />

      <ZoneEconomie
        surtitre="La région"
        heading={z.economy.heading}
        body={z.economy.body}
        highlights={z.economy.highlights}
      />

      <ZoneSecteurs
        titre="Les secteurs qui nous sollicitent le plus en Wallonie"
        intro="Cinq familles de clients, cinq façons différentes d'être cherché sur Google. Le site n'a pas le même travail à faire dans chacune."
        sectors={z.sectors}
      />

      {/* Descente d'un étage : c'est la raison d'être de cette page. */}
      <ZoneEnfants
        ton="sombre"
        surtitre="Les cinq provinces"
        titre="Descendre au niveau où la décision se prend"
        intro="Chaque province a sa page : son tissu économique réel, ses filières dominantes, et les communes que nous y couvrons."
        lien={{ href: "/zones-d-intervention", label: "Toutes nos zones" }}
        items={provinces}
      />

      <Faq faq={z.faq} />

    </>
  );
}
