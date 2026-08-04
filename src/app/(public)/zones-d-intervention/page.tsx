import type { Metadata } from "next";
import { Faq } from "@/components/home";
import { ZoneEnfants, type LienZone } from "@/components/region/sections";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { getPublishedCitiesByProvince, getProvinceZones, getRegion } from "@/lib/regions";
import { listeJsonLd, listeMetadata, type ListeOptions } from "@/lib/seo-pages";

/**
 * Hub de maillage : la seule page qui liste TOUT — région, provinces, communes.
 * Elle absorbe les liens que le footer et les pages villes ne doivent pas porter
 * (le footer plafonne à 12, une page ville ne lie que 4 à 6 voisines).
 *
 * Elle ne double pas les pages de zone : elle ne décrit rien, elle oriente.
 */

/**
 * FAQ VISIBLE de la page. Elle est rendue à l'écran par `<Faq>` et sert de
 * source au balisage `FAQPage` : baliser des questions invisibles relève des
 * spam policies de Google, jamais l'inverse.
 */
const FAQ = [
  {
    question: "Intervenez-vous partout en Wallonie ou seulement près de votre siège ?",
    answer:
      "Dans les cinq provinces. Le premier rendez-vous se fait sur place quand la distance le permet, en visioconférence au-delà, et il n'est facturé dans aucun cas. La suite du projet se pilote de la même manière quelle que soit la province : jalons validés ensemble, maquettes commentées à distance, environnement de test accessible en permanence et mise en ligne accompagnée.",
  },
  {
    question: "Pourquoi une page par province et par commune plutôt qu'une seule page Wallonie ?",
    answer:
      "Parce que personne ne cherche « agence web Wallonie ». Les recherches réelles sont locales et nomment une ville. Une page unique pour toute la région ne répond à aucune de ces intentions et se fait dépasser par des concurrents ancrés localement. La pyramide région, province, commune reproduit la manière dont la demande se formule réellement.",
  },
  {
    question: "Ma commune n'a pas de page : travaillez-vous quand même chez moi ?",
    answer:
      "Oui. Les pages communales sont ouvertes au fur et à mesure, et leur absence ne dit rien de notre couverture : elle dit seulement que nous n'avons pas encore écrit un contenu réellement spécifique à cette commune. Nous préférons ne pas publier une page plutôt que d'en publier une qui se contente de remplacer un nom de ville par un autre.",
  },
  {
    question: "Facturez-vous le déplacement si je suis loin de la province de Luxembourg ?",
    answer:
      "Non, jamais pour le premier rendez-vous, où que vous soyez en Wallonie. C'est un choix assumé : nous préférons nous déplacer et comprendre votre activité sur place plutôt que chiffrer un projet à l'aveugle. Si le projet se fait, les échanges suivants ont lieu à distance, ce qui nous permet de garder des budgets mesurés.",
  },
  {
    question: "Le tarif change-t-il selon la commune ou la province ?",
    answer:
      "Le tarif dépend du projet, pas du code postal. En revanche le niveau d'exigence attendu diffère réellement d'un territoire à l'autre : un site B2B en Brabant wallon est comparé à ceux de groupes internationaux voisins, ce qui demande davantage de travail sur le contenu et l'exécution. C'est le périmètre qui bouge, pas notre grille.",
  },
];

/** Identité SEO de la page — partagée par le <head> et le JSON-LD. */
const LISTE = {
  path: "/zones-d-intervention",
  nom: "Zones d'intervention",
  title: "Nos zones d'intervention en Wallonie | BEEW",
  description:
    "Région, provinces, communes : toutes les zones où BEEW crée des sites internet, de la Wallonie aux cinq provinces wallonnes et à leurs communes.",
  keywords: [
    "agence web Wallonie",
    "création site internet Wallonie",
    "agence web province de Luxembourg",
    "agence web Namur",
    "agence web Hainaut",
  ],
  image: "/images/heros/zones.jpg",
  items: [] as { href: string; label: string }[],
  faq: FAQ,
} satisfies ListeOptions;

export const metadata: Metadata = listeMetadata(LISTE);

export default function ZonesPage() {
  const region = getRegion();
  const provinces = getProvinceZones();
  const groupes = getPublishedCitiesByProvince();

  const regionItem: LienZone[] = [
    { href: `/${region.slug}`, label: region.name, note: region.hero.subtitle },
  ];

  const provinceItems: LienZone[] = provinces.map((p) => ({
    href: `/${p.slug}`,
    label: p.name,
    note: p.meta.description,
  }));

  // Villes publiées uniquement — les brouillons sont en noindex et hors maillage.
  const villes: LienZone[] = groupes.flatMap((g) =>
    g.cities.map((c) => ({
      href: `/${c.slug}`,
      label: `Création de site internet à ${c.city}`,
      note: `Province de ${c.province}`,
      image: c.heroImage,
    })),
  );

  return (
    <>
      {/* `ItemList` ne référence que les entrées réellement liées : une zone
          sans page (`href` nul) est affichée sans lien, elle n'a donc rien à
          faire dans le balisage. */}
      <JsonLd
        data={listeJsonLd({
          ...LISTE,
          items: [...regionItem, ...provinceItems, ...villes]
            .filter((i): i is LienZone & { href: string } => Boolean(i.href))
            .map((i) => ({ href: i.href, label: i.label })),
        })}
      />

      <PageHero
        fil={[
          { href: "/", label: "Accueil" },
          { href: "/zones-d-intervention", label: "Zones d'intervention" },
        ]}
        surtitre="Couverture"
        h1="Nos zones d'intervention"
        intro="Trois étages : la région, la province, la commune. Chaque page descend d'un cran vers l'endroit où votre client vous cherche réellement."
        badges={["Wallonie", "Cinq provinces", "Rendez-vous sur place"]}
        image={{ src: "/images/heros/zones.jpg" }}
      />

      <ZoneEnfants
        ton="sombre"
        surtitre="Région"
        titre="Le point de départ"
        intro="La vue d'ensemble : cinq provinces, cinq économies, et ce qu'elles ont en commun."
        items={regionItem}
      />

      <ZoneEnfants
        surtitre="Provinces"
        titre="Les cinq provinces wallonnes"
        intro="Chaque province a sa page : tissu économique réel, filières dominantes, et la liste de nos communes qui s'y rattachent."
        items={provinceItems}
        vide="Aucune page de province n'est publiée pour le moment."
      />

      <ZoneEnfants
        ton="sombre"
        surtitre="Communes"
        titre="Nos pages communales"
        intro={
          villes.length
            ? "Chaque page détaille le tissu économique local : concurrence réelle, typologie de clientèle, réalisations sur place."
            : undefined
        }
        items={villes}
        vide="Les pages communales sont en cours de rédaction. Nous ne les publions qu'une fois accompagnées de réalisations et de témoignages réels : en attendant, elles ne figurent ni ici, ni dans le menu, ni dans le plan de site. Notre couverture, elle, est déjà effective — décrivez-nous votre commune, nous nous déplaçons."
      />

      <Faq faq={FAQ} />

    </>
  );
}
