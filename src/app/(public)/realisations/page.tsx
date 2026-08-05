import type { Metadata } from "next";
import { GrilleRealisations, type CarteRealisation } from "@/components/cases/GrilleRealisations";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { CarteProjet } from "@/components/home/sections";
import { EnTete, Section } from "@/components/ui/section";
import type { Case } from "@/content/schemas/case";
import { getAllCases, getPublishedCases } from "@/lib/cases";
import { getHome } from "@/lib/cities";
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
 * La page est indexable : elle présente six projets réellement livrés, avec
 * leur capture. Elle était en `noindex` tant qu'elle ne montrait que des études
 * de démonstration ; ces études ont été retirées et remplacées par du réel.
 */
export function generateMetadata(): Metadata {
  return listeMetadata(LISTE);
}

export default function RealisationsPage() {
  const publiees = getPublishedCases();
  const affichees = publiees.length ? publiees : getAllCases();
  const cartes = affichees.map(enCarte);

  // Les six projets réellement livrés, avec leur capture. Même source que le
  // bandeau de l'accueil : une seule liste, donc aucune divergence possible.
  const projets = getHome().trust.logos;

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
        intro="Les projets que nous avons livrés, et le détail de ce qu'ils ont changé quand le client nous autorise à le publier. Aucun chiffre que nous ne puissions justifier."
        badges={["Projets réels", "Aucun chiffre inventé", "Wallonie"]}
        image={{ src: "/images/heros/realisations.jpg" }}
      />

      {/*
        Les projets livrés, avec leur capture. La page n'avait aucun visuel :
        les six clients réels n'apparaissaient que sur l'accueil, et les études
        détaillées ayant été retirées faute de résultats vérifiables, il ne
        restait ici qu'une grille vide sous un titre qui promettait des preuves.
      */}
      <Section>
        <EnTete
          surtitre="Projets livrés"
          titre="Six projets, du site vitrine à l'application web"
          intro="Ce que nous avons construit et mis en ligne. Les études détaillées — contexte, blocage, solution, résultat mesuré — sont publiées au fur et à mesure des accords clients."
        />
        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {projets.map((p, i) =>
            i === 0 ? (
              <CarteProjet key={p.name} projet={p} large />
            ) : (
              <CarteProjet key={p.name} projet={p} retard={i * 60} />
            ),
          )}
        </div>
      </Section>

      {/* Études détaillées, quand il y en a. Pas de filtres : à ce nombre,
          ils prendraient plus de place qu'ils n'en font gagner. */}
      {cartes.length > 0 && (
        <Section ton="sombre">
          <EnTete
            ton="sombre"
            surtitre="Études de cas"
            titre="Le détail de ce qui a changé"
            intro="Point de départ, ce qui bloquait, ce que nous avons construit, et le résultat mesuré."
          />
          <div className="mt-12">
            <GrilleRealisations cartes={cartes} />
          </div>
        </Section>
      )}
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
