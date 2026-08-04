import type { Metadata } from "next";
import { GrilleRealisations, type CarteRealisation } from "@/components/cases/GrilleRealisations";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/section";
import type { Case } from "@/content/schemas/case";
import { getAllCases, getPublishedCases } from "@/lib/cases";
import { listeJsonLd, listeMetadata, type ListeOptions } from "@/lib/seo-pages";

/**
 * Index des réalisations.
 *
 * Règle de publication : seules les études `published` sont listées et
 * indexables. Tant qu'aucune ne l'est, la page affiche quand même les
 * brouillons — pour que la relecture soit possible — mais passe elle-même en
 * `noindex, nofollow` : on ne soumet pas à Google un index de preuves qui
 * n'en sont pas encore, et aucun lien suivi ne part vers un brouillon.
 */

const LISTE = {
  path: "/realisations",
  nom: "Réalisations",
  title: "Nos réalisations en province de Luxembourg | BEEW",
  description:
    "Études de cas détaillées de l'agence BEEW : contexte, problème, solution et résultat chiffré pour chaque site que nous avons conçu en Wallonie.",
  keywords: [
    "réalisations agence web Wallonie",
    "études de cas site internet",
    "portfolio agence web Belgique",
  ],
  image: "/images/heros/realisations.jpg",
  items: [] as { href: string; label: string }[],
} satisfies ListeOptions;

/**
 * Tant qu'aucune étude n'est publiée, la page reste consultable pour relecture
 * mais sort de l'index : on ne soumet pas à Google un index de preuves qui n'en
 * sont pas encore.
 */
export function generateMetadata(): Metadata {
  const vide = getPublishedCases().length === 0;
  return listeMetadata({ ...LISTE, noindex: vide, nofollow: vide });
}

export default function RealisationsPage() {
  const publiees = getPublishedCases();
  const indexable = publiees.length > 0;
  const affichees = indexable ? publiees : getAllCases();

  const cartes = affichees.map(enCarte);

  return (
    <>
      <JsonLd data={jsonLd(affichees)} />

      <PageHero
        fil={[
          { href: "/", label: "Accueil" },
          { href: "/realisations", label: "Réalisations" },
        ]}
        surtitre="Preuves"
        h1="Réalisations : ce que nos clients ont obtenu"
        intro="Chaque étude raconte le point de départ, ce qui bloquait, ce que nous avons construit et le résultat mesuré. Pas de galerie de captures d'écran."
        badges={["Résultat chiffré", "Contexte réel", "Province de Luxembourg"]}
        image={{ src: "/images/heros/realisations.jpg" }}
      />

      {!indexable && (
        <Section className="!py-6">
          <p className="border-l-2 border-beew-orange py-2 pl-5 text-sm leading-relaxed text-beew-noir/60">
            <strong className="font-semibold text-beew-noir">Contenu de démonstration.</strong> Les
            études ci-dessous reprennent des clients et des chiffres inventés pendant le
            développement du site. Elles sont toutes en brouillon, exclues de l&apos;index des
            moteurs de recherche, et le resteront tant qu&apos;elles ne reposeront pas sur des
            résultats réels et vérifiables.
          </p>
        </Section>
      )}

      {/* Pas de filtres : à ce nombre d'études, ils prendraient plus de place
          qu'ils n'en font gagner. La grille va droit au but. */}
      <Section>
        <GrilleRealisations cartes={cartes} />
      </Section>
    </>
  );
}

function enCarte(c: Case): CarteRealisation {
  return {
    slug: c.slug,
    client: c.client,
    city: c.city,
    sectorLabel: c.sector.label,
    summary: c.hero.summary,
    result: c.result.headline,
    image: c.hero.image,
    imageAlt: c.hero.imageAlt,
    draft: c.status === "draft",
  };
}

function jsonLd(cases: Case[]) {
  return listeJsonLd({
    ...LISTE,
    items: cases.map((c) => ({ href: `/realisations/${c.slug}`, label: c.client })),
  });
}
