import { Faq } from "@/components/home";
import {
  ZoneEconomie,
  ZoneEnfants,
  ZoneFaits,
  ZoneRemontee,
  ZoneSecteurs,
  type LienZone,
} from "@/components/region/sections";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { getPublishedCitiesOfZone, getZoneTrail, zoneJsonLd } from "@/lib/regions";
import type { Zone } from "@/content/schemas/region";

/**
 * Étage 2 de la pyramide : la province. Elle remonte vers `/wallonie` et
 * descend vers les pages communales.
 *
 * UN seul composant pour les cinq provinces. Tout ce qui change d'une province
 * à l'autre vient du JSON — il n'y a rien à écrire en TSX pour en ajouter une.
 */
export function ProvinceView({ zone }: { zone: Zone }) {
  const fil = getZoneTrail(zone);

  // Uniquement les villes PUBLIÉES : une page en brouillon est en noindex et ne
  // doit recevoir aucun lien depuis une page indexée.
  const villes = getPublishedCitiesOfZone(zone);
  const communes: LienZone[] = villes.map((c) => ({
    href: `/${c.slug}`,
    label: `Création de site internet à ${c.city}`,
    note: c.coverage.slice(0, 4).join(", "),
  }));

  return (
    <>
      <JsonLd data={zoneJsonLd(zone, villes.map((c) => c.city))} />

      <PageHero
        fil={fil}
        surtitre="Province"
        h1={zone.hero.h1}
        intro={zone.hero.subtitle}
        badges={zone.hero.badges}
        image={{ src: "/images/heros/zones.jpg" }}
      />

      <ZoneFaits facts={zone.facts} />

      <ZoneEconomie
        surtitre="La province"
        heading={zone.economy.heading}
        body={zone.economy.body}
        highlights={zone.economy.highlights}
      />

      <ZoneSecteurs
        titre="Les filières que nous y rencontrons le plus"
        intro="Elles n'ont ni la même clientèle, ni la même saisonnalité, ni les mêmes mots-clés. C'est la raison pour laquelle nous ne réutilisons jamais une stratégie d'un secteur à l'autre."
        sectors={zone.sectors}
      />

      <ZoneEnfants
        ton="sombre"
        surtitre="Communes"
        // Le nom en tête plutôt qu'après une préposition : « en Brabant wallon »
        // et « en Province de Liège » ne peuvent pas cohabiter dans un gabarit.
        titre={`${zone.name} : nos pages communales`}
        intro={
          communes.length
            ? "Chaque page détaille la concurrence réelle et la typologie de clientèle de la commune."
            : undefined
        }
        lien={{ href: "/zones-d-intervention", label: "Toutes nos zones" }}
        items={communes}
        vide={`Aucune page communale n'est encore en ligne pour cette province : elles sont en cours de rédaction. Nous y intervenons dès aujourd'hui, et le premier rendez-vous se fait sur place.`}
      />

      <Faq faq={zone.faq} />

      {/* Le maillage doit fonctionner dans les deux sens, pas seulement du
          général vers le particulier. */}
      {zone.parent && (
        <ZoneRemontee
          href={`/${zone.parent.slug}`}
          label={`Notre couverture en ${zone.parent.name}`}
          texte={`${zone.name} est l'une des cinq provinces wallonnes. La page ${zone.parent.name} présente le profil économique de chacune et l'approche que nous y appliquons.`}
        />
      )}
    </>
  );
}
