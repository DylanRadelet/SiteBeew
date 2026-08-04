import type { AProps, Methode, Tarifs } from "@/content/schemas/confiance";
import {
  ORG_ID,
  absolute,
  breadcrumbNode,
  buildGraph,
  faqNode,
  organizationNode,
  webPageNode,
  websiteNode,
} from "@/lib/seo";

/**
 * Données structurées des trois pages de confiance.
 *
 * Elles reprennent le socle de `@/lib/seo` : une seule entité `Organization`
 * pour tout le site, référencée par `@id`, et jamais une affirmation qui ne
 * soit pas déjà écrite dans le contenu visible de la page.
 *
 * Les FAQ passent par `faqNode`, qui normalise la forme des questions —
 * `reponse` côté contenu français, `answer` côté schema.org.
 */

/** Fil d'Ariane commun : Accueil → page courante, sans niveau intermédiaire. */
const fil = (chemin: string, nom: string) => [
  { href: "/", label: "Accueil" },
  { href: chemin, label: nom },
];

/** Les FAQ de ces pages nomment leurs champs en français. */
const enFaq = (items: { question: string; reponse: string }[]) =>
  items.map((f) => ({ question: f.question, answer: f.reponse }));

export function aProposJsonLd(a: AProps) {
  return buildGraph(
    organizationNode(),
    websiteNode(),
    webPageNode({
      path: "/a-propos",
      type: "AboutPage",
      name: a.meta.title,
      description: a.meta.description,
      image: "/images/heros/agence.jpg",
    }),
    faqNode("/a-propos", enFaq(a.faq)),
    breadcrumbNode("/a-propos", fil("/a-propos", "À propos")),
  );
}

export function methodeJsonLd(m: Methode) {
  return buildGraph(
    organizationNode(),
    websiteNode(),
    webPageNode({
      path: "/methode",
      name: m.meta.title,
      description: m.meta.description,
      image: "/images/heros/methode.jpg",
    }),
    {
      "@type": "HowTo",
      "@id": `${absolute("/methode")}#howto`,
      name: m.etapes.titre,
      description: m.meta.description,
      inLanguage: "fr-BE",
      // `totalTime` en durée ISO 8601 : 4 semaines, le délai annoncé partout.
      totalTime: "P4W",
      step: m.etapes.items.map((e, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: e.titre,
        text: e.resume,
        image: absolute(e.image),
        url: `${absolute("/methode")}#etape-${i + 1}`,
      })),
    },
    faqNode("/methode", enFaq(m.faq)),
    breadcrumbNode("/methode", fil("/methode", "Notre méthode")),
  );
}

export function tarifsJsonLd(t: Tarifs) {
  return buildGraph(
    organizationNode(),
    websiteNode(),
    webPageNode({
      path: "/tarifs",
      name: t.meta.title,
      description: t.meta.description,
      image: "/images/heros/tarifs.jpg",
    }),
    {
      "@type": "OfferCatalog",
      "@id": `${absolute("/tarifs")}#offres`,
      name: t.formules.titre,
      url: absolute("/tarifs"),
      itemListElement: t.formules.items.map((f, i) => ({
        "@type": "Offer",
        position: i + 1,
        name: f.nom,
        description: f.pitch,
        category: "Création de site web",
        seller: { "@id": ORG_ID },
        availableAtOrFrom: { "@type": "AdministrativeArea", name: "Wallonie, Belgique" },
        priceSpecification: {
          "@type": "PriceSpecification",
          // `minPrice` et non `price` : ce sont des prix planchers, pas des
          // prix fermes. Le devis fixe est établi après le rendez-vous.
          minPrice: f.from,
          priceCurrency: f.devise,
          valueAddedTaxIncluded: false,
        },
      })),
    },
    faqNode("/tarifs", enFaq(t.faq)),
    breadcrumbNode("/tarifs", fil("/tarifs", "Tarifs")),
  );
}
