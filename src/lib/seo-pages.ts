import type { Metadata } from "next";
import type { ConversionPage } from "@/content/schemas/conversion";
import type { LegalPage } from "@/content/schemas/legal";
import {
  absolute,
  breadcrumbNode,
  buildGraph,
  faqNode,
  organizationNode,
  pageMetadata,
  webPageNode,
  websiteNode,
} from "@/lib/seo";

/**
 * SEO des pages qui n'ont pas de loader dédié — conversion, hub de zones,
 * blog, réalisations, mentions légales.
 *
 * Elles réécrivaient chacune le même bloc de métadonnées à la main, avec des
 * oublis différents à chaque fois : pas de carte Twitter ici, pas d'image de
 * partage là, un `ContactPage` qui redéclarait une fiche d'entreprise au lieu
 * de pointer vers l'entité du site. Tout passe désormais par `@/lib/seo`.
 */

const fil = (chemin: string, nom: string) => [
  { href: "/", label: "Accueil" },
  { href: chemin, label: nom },
];

/* -------------------------------------------------------------------------- */
/*                        /contact et /devis                                   */
/* -------------------------------------------------------------------------- */

export function conversionMetadata(page: ConversionPage): Metadata {
  return pageMetadata({
    path: `/${page.slug}`,
    title: page.meta.title,
    description: page.meta.description,
    image: "/images/heros/contact.jpg",
    imageAlt: `BEEW — ${page.hero.h1}`,
  });
}

export function conversionJsonLd(page: ConversionPage, nom: string) {
  const path = `/${page.slug}`;
  return buildGraph(
    organizationNode(),
    websiteNode(),
    webPageNode({
      path,
      type: "ContactPage",
      name: page.meta.title,
      description: page.meta.description,
      image: "/images/heros/contact.jpg",
    }),
    // La FAQ n'est balisée que si la page en rend une : le contenu balisé doit
    // être visible à l'écran, sans exception.
    page.faq ? faqNode(path, page.faq) : null,
    breadcrumbNode(path, fil(path, nom)),
  );
}

/* -------------------------------------------------------------------------- */
/*                          Pages légales                                      */
/* -------------------------------------------------------------------------- */

/**
 * `noindex, follow` : aucune valeur en recherche, mais les liens sortants
 * gardent la leur. Pas de JSON-LD — il n'y a rien à décrire à un moteur.
 */
export function legalMetadata(page: LegalPage, slug: string): Metadata {
  return pageMetadata({
    path: `/${slug}`,
    title: page.meta.title,
    description: page.meta.description,
    image: "/images/heros/legal.jpg",
    noindex: true,
  });
}

/* -------------------------------------------------------------------------- */
/*                    Pages « liste » : blog, réalisations, zones              */
/* -------------------------------------------------------------------------- */

export type ListeOptions = {
  path: string;
  nom: string;
  title: string;
  description: string;
  keywords?: string[];
  image: string;
  /** Les entrées listées, dans l'ordre d'affichage. */
  items: { href: string; label: string }[];
  noindex?: boolean;
  nofollow?: boolean;
  faq?: { question: string; answer: string }[];
};

export function listeMetadata(o: ListeOptions): Metadata {
  return pageMetadata({
    path: o.path,
    title: o.title,
    description: o.description,
    keywords: o.keywords,
    image: o.image,
    imageAlt: o.nom,
    noindex: o.noindex,
    nofollow: o.nofollow,
  });
}

/**
 * `CollectionPage` + `ItemList` : c'est la forme qui dit explicitement « cette
 * page est un index, voici ce qu'elle liste et dans quel ordre ». Sans elle,
 * une page de listing n'est qu'un paquet de liens pour un moteur.
 */
export function listeJsonLd(o: ListeOptions) {
  return buildGraph(
    organizationNode(),
    websiteNode(),
    webPageNode({
      path: o.path,
      type: "CollectionPage",
      name: o.title,
      description: o.description,
      image: o.image,
    }),
    {
      "@type": "ItemList",
      "@id": `${absolute(o.path)}#liste`,
      numberOfItems: o.items.length,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement: o.items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: it.label,
        url: absolute(it.href),
      })),
    },
    o.faq?.length ? faqNode(o.path, o.faq) : null,
    breadcrumbNode(o.path, fil(o.path, o.nom)),
  );
}
