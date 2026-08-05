import type { Metadata } from "next";
import type { City, FaqItem, Home } from "@/content/schema";

/**
 * SOCLE SEO DU SITE — un seul endroit pour les métadonnées et le JSON-LD.
 *
 * Avant, chaque page réécrivait à la main le même bloc de douze lignes
 * (title, description, canonical, openGraph). Résultat : aucune n'avait de
 * carte Twitter, aucune n'avait d'image de partage, aucune ne déclarait de
 * directive `max-snippet`, et corriger un oubli demandait vingt-deux édits.
 *
 * Deux fonctions suffisent désormais :
 *   · `pageMetadata()`  — le <head> complet
 *   · `buildGraph()`    — le JSON-LD, sous forme de graphe d'entités liées
 *
 * Le graphe est la partie qui compte. Plutôt que de répéter une fiche
 * d'entreprise anonyme sur chaque page, toutes les pages référencent LA même
 * entité par son `@id`. C'est ce qui permet à Google — et aux moteurs de
 * réponse type LLM — de comprendre que ces trente-quatre pages décrivent une
 * seule agence, et non trente-quatre entreprises homonymes.
 */

export const SITE_URL = "https://www.beew.agency";
export const AGENCY_NAME = "BEEW";
export const AGENCY_LEGAL_NAME = "BEEW Agency";
export const AGENCY_EMAIL = "hello@beew.agency";
export const AGENCY_PHONE = "+32472467309";

/**
 * Profils sociaux officiels. Repris tels quels dans `sameAs` du JSON-LD :
 * c'est la propriété qui permet à Google — et aux moteurs de réponse — de
 * relier ces comptes à l'entreprise du site plutôt qu'à un homonyme.
 * N'ajouter ici qu'un profil réellement tenu : un compte mort dessert.
 */
export const AGENCY_SOCIAL = [
  { nom: "Instagram", href: "https://www.instagram.com/beew.agency/" },
  { nom: "LinkedIn", href: "https://www.linkedin.com/company/beew-agency-be" },
] as const;

/**
 * Siège réel de l'agence, tel que publié dans les mentions légales.
 * Ces valeurs DOIVENT rester identiques à celles de la fiche Google Business
 * Profile, au caractère près : une divergence entre le site et la fiche est
 * l'erreur qui coûte le plus cher en référencement local.
 */
export const AGENCY_ADDRESS = {
  street: "Chemin des Roches 13/3",
  postalCode: "6600",
  city: "Bastogne",
  region: "Province de Luxembourg",
  country: "BE",
  lat: 50.0,
  lng: 5.7167,
} as const;

/** Identifiants stables du graphe. Ne jamais les modifier après indexation. */
export const ORG_ID = `${SITE_URL}/#organization`;
export const SITE_ID = `${SITE_URL}/#website`;

/** Image de partage par défaut, remplacée page par page quand c'est pertinent. */
const OG_DEFAUT = "/images/heros/zones.jpg";

export function absolute(pathname: string): string {
  return new URL(pathname, SITE_URL).toString();
}

/* -------------------------------------------------------------------------- */
/*                                  <head>                                     */
/* -------------------------------------------------------------------------- */

export type MetaOptions = {
  /** Chemin absolu depuis la racine : "/tarifs". "/" pour la home. */
  path: string;
  title: string;
  description: string;
  /** Intention de recherche. Ignoré par Google, lu par Bing et plusieurs LLM. */
  keywords?: string[];
  /** Visuel de partage. Chemin depuis /public. */
  image?: string;
  imageAlt?: string;
  /** `article` pour le blog et les études de cas, `website` partout ailleurs. */
  type?: "website" | "article";
  /** Pages légales : hors index, mais les liens restent suivis. */
  noindex?: boolean;
  /**
   * Brouillons : hors index ET liens non suivis. Une page non publiée ne doit
   * transmettre aucun signal, c'est la règle appliquée partout dans le projet.
   */
  nofollow?: boolean;
  article?: { publishedTime?: string; modifiedTime?: string; section?: string };
};

export function pageMetadata(o: MetaOptions): Metadata {
  const url = absolute(o.path);
  const image = absolute(o.image ?? OG_DEFAUT);
  const alt = o.imageAlt ?? o.title;

  return {
    title: o.title,
    description: o.description,
    ...(o.keywords?.length && { keywords: o.keywords }),
    alternates: { canonical: url },

    /**
     * `max-image-preview: large` et `max-snippet: -1` autorisent explicitement
     * Google à afficher une grande vignette et un extrait de longueur libre.
     * Sans ces directives, la miniature reste petite et l'extrait plafonne —
     * c'est un gain de surface en SERP, gratuit, que la plupart des sites
     * oublient parce que le comportement par défaut est déjà « correct ».
     */
    robots: o.noindex
      ? {
          index: false,
          follow: !o.nofollow,
          googleBot: { index: false, follow: !o.nofollow },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },

    openGraph: {
      type: o.type ?? "website",
      locale: "fr_BE",
      url,
      siteName: AGENCY_NAME,
      title: o.title,
      description: o.description,
      images: [{ url: image, width: 1600, height: 1200, alt }],
      ...(o.article?.publishedTime && { publishedTime: o.article.publishedTime }),
      ...(o.article?.modifiedTime && { modifiedTime: o.article.modifiedTime }),
      ...(o.article?.section && { section: o.article.section }),
    },

    twitter: {
      card: "summary_large_image",
      title: o.title,
      description: o.description,
      images: [image],
    },

    // Signaux d'entité repris par plusieurs agrégateurs et par les moteurs de
    // réponse. Coût nul, et ils lèvent l'ambiguïté sur l'auteur du contenu.
    authors: [{ name: AGENCY_LEGAL_NAME, url: SITE_URL }],
    creator: AGENCY_LEGAL_NAME,
    publisher: AGENCY_LEGAL_NAME,
  };
}

/* -------------------------------------------------------------------------- */
/*                              Graphe JSON-LD                                 */
/* -------------------------------------------------------------------------- */

type Node = Record<string, unknown>;

/** Assemble un graphe. Les `undefined` et les nœuds vides sont éliminés. */
export function buildGraph(...nodes: (Node | null | undefined)[]) {
  return { "@context": "https://schema.org", "@graph": nodes.filter(Boolean) as Node[] };
}

/**
 * L'ENTITÉ. Une seule pour tout le site, référencée par `@id` partout ailleurs.
 *
 * UNE seule adresse, celle du siège réel à Bastogne, déclarée une seule fois.
 * C'est la différence entre un ancrage local vérifiable et un réseau de pages
 * satellites : le JSON-LD déclarait auparavant un établissement fictif par
 * ville, ce qui est précisément le signal qui fait requalifier un site local
 * en spam. Une adresse vraie vaut infiniment mieux que quinze fausses.
 *
 * Ces valeurs doivent correspondre exactement à la fiche Google Business
 * Profile — c'est l'appariement des deux qui produit le signal.
 */
export function organizationNode(): Node {
  return {
    "@type": ["Organization", "ProfessionalService"],
    "@id": ORG_ID,
    name: AGENCY_NAME,
    legalName: AGENCY_LEGAL_NAME,
    url: `${SITE_URL}/`,
    email: AGENCY_EMAIL,
    telephone: AGENCY_PHONE,
    address: {
      "@type": "PostalAddress",
      streetAddress: AGENCY_ADDRESS.street,
      postalCode: AGENCY_ADDRESS.postalCode,
      addressLocality: AGENCY_ADDRESS.city,
      addressRegion: AGENCY_ADDRESS.region,
      addressCountry: AGENCY_ADDRESS.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: AGENCY_ADDRESS.lat,
      longitude: AGENCY_ADDRESS.lng,
    },
    vatID: "BE 0666.456.316",
    description:
      "Agence web indépendante établie en province de Luxembourg. Création de sites internet, " +
      "e-commerce, référencement local et outils métier pour les PME et indépendants de Wallonie.",
    logo: {
      "@type": "ImageObject",
      "@id": `${SITE_URL}/#logo`,
      url: absolute("/logo/logo_orange_long.webp"),
      contentUrl: absolute("/logo/logo_orange_long.webp"),
      caption: AGENCY_NAME,
    },
    image: { "@id": `${SITE_URL}/#logo` },
    knowsLanguage: ["fr-BE", "en", "nl"],
    sameAs: AGENCY_SOCIAL.map((r) => r.href),
    /**
     * `areaServed` remplace l'adresse : c'est la propriété prévue pour une
     * entreprise qui se déplace au lieu de recevoir. Elle rattache toutes les
     * pages locales à une seule et même entité.
     */
    areaServed: [
      { "@type": "AdministrativeArea", name: "Wallonie" },
      { "@type": "Country", name: "Belgique" },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: AGENCY_EMAIL,
      telephone: AGENCY_PHONE,
      areaServed: "BE",
      availableLanguage: ["fr", "en", "nl"],
    },
  };
}

export function websiteNode(): Node {
  return {
    "@type": "WebSite",
    "@id": SITE_ID,
    url: `${SITE_URL}/`,
    name: AGENCY_NAME,
    inLanguage: "fr-BE",
    publisher: { "@id": ORG_ID },
  };
}

/**
 * Le nœud de page : il relie la page au site, au fil d'Ariane et à l'entité.
 * C'est lui qui transforme une collection de nœuds isolés en un vrai graphe.
 */
export function webPageNode(o: {
  path: string;
  name: string;
  description: string;
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage" | "ItemPage" | "FAQPage";
  image?: string;
  dateModified?: string;
  datePublished?: string;
}): Node {
  const url = absolute(o.path);
  return {
    "@type": o.type ?? "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: o.name,
    description: o.description,
    inLanguage: "fr-BE",
    isPartOf: { "@id": SITE_ID },
    about: { "@id": ORG_ID },
    ...(o.image && {
      primaryImageOfPage: { "@type": "ImageObject", url: absolute(o.image) },
    }),
    ...(o.datePublished && { datePublished: o.datePublished }),
    ...(o.dateModified && { dateModified: o.dateModified }),
    breadcrumb: { "@id": `${url}#breadcrumb` },
  };
}

export function breadcrumbNode(path: string, trail: { href: string; label: string }[]): Node {
  return {
    "@type": "BreadcrumbList",
    "@id": `${absolute(path)}#breadcrumb`,
    itemListElement: trail.map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: e.label,
      item: absolute(e.href),
    })),
  };
}

/**
 * FAQ.
 *
 * Google a cessé d'afficher les résultats enrichis FAQ en mai 2026 : ce balisage
 * ne gagne plus de surface en SERP. Il reste lu — par Google pour comprendre la
 * page, et surtout par les moteurs de réponse, qui citent volontiers une paire
 * question/réponse explicitement structurée.
 *
 * Règle absolue : ces questions DOIVENT être visibles à l'écran. Baliser une FAQ
 * que le visiteur ne voit pas relève des spam policies et expose à une action
 * manuelle sur tout le domaine. `faqNode` n'est donc jamais appelé seul : il
 * accompagne toujours un composant `<Faq>` rendu dans la page.
 */
export function faqNode(path: string, faq: FaqItem[]): Node | null {
  if (!faq.length) return null;
  const url = absolute(path);
  return {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    inLanguage: "fr-BE",
    isPartOf: { "@id": SITE_ID },
    mainEntity: faq.map((f, i) => ({
      "@type": "Question",
      "@id": `${url}#question-${i + 1}`,
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

/**
 * Liste ordonnée des pages filles d'un index.
 *
 * C'est ce qui distingue, pour un moteur, une page qui EST un index d'une page
 * qui contient des liens. Sans ce nœud, `/wallonie` et les pages provinces ne
 * déclaraient rien de leur descendance : le fil d'Ariane dit d'où l'on vient,
 * pas où l'on peut aller.
 */
export function itemListNode(
  path: string,
  items: { href: string; label: string }[],
  nom?: string,
): Node | null {
  if (!items.length) return null;
  return {
    "@type": "ItemList",
    "@id": `${absolute(path)}#liste`,
    ...(nom && { name: nom }),
    numberOfItems: items.length,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.label,
      url: absolute(it.href),
    })),
  };
}

/**
 * Navigation principale du site, déclarée sur l'accueil.
 *
 * `SiteNavigationElement` décrit explicitement les sections de tête. C'est le
 * signal que Google utilise pour composer des liens de site sous le résultat
 * principal — un plan du site lisible par une machine, en somme.
 */
export function navigationNode(items: { href: string; label: string }[]): Node {
  return {
    "@type": "ItemList",
    "@id": `${SITE_URL}/#navigation`,
    name: "Navigation principale",
    itemListElement: items.map((it, i) => ({
      "@type": "SiteNavigationElement",
      position: i + 1,
      name: it.label,
      url: absolute(it.href),
    })),
  };
}

export function serviceNode(o: {
  path: string;
  name: string;
  description: string;
  serviceType?: string;
  areaServed?: string[];
  offers?: { price: number; currency: string; description?: string };
}): Node {
  const url = absolute(o.path);
  return {
    "@type": "Service",
    "@id": `${url}#service`,
    name: o.name,
    ...(o.serviceType && { serviceType: o.serviceType }),
    description: o.description,
    provider: { "@id": ORG_ID },
    ...(o.areaServed?.length && {
      areaServed: o.areaServed.map((name) => ({ "@type": "AdministrativeArea", name })),
    }),
    ...(o.offers && {
      offers: {
        "@type": "Offer",
        price: o.offers.price,
        priceCurrency: o.offers.currency,
        ...(o.offers.description && { description: o.offers.description }),
        availability: "https://schema.org/InStock",
        seller: { "@id": ORG_ID },
      },
    }),
  };
}

/* -------------------------------------------------------------------------- */
/*                          Raccourcis par type de page                        */
/* -------------------------------------------------------------------------- */

export function cityMetadata(city: City): Metadata {
  return pageMetadata({
    path: `/${city.slug}`,
    title: city.meta.title,
    description: city.meta.description,
    keywords: [city.intent.primaryKeyword, ...city.intent.secondaryKeywords],
    image: "/images/heros/zones.jpg",
    imageAlt: `BEEW — création de site internet à ${city.city}`,
    // Une ville en brouillon est consultable pour relecture, jamais indexée,
    // et ne transmet aucun signal vers les pages qu'elle lie.
    noindex: city.status === "draft",
    nofollow: city.status === "draft",
  });
}

export function homeMetadata(home: Home): Metadata {
  return pageMetadata({
    path: "/",
    title: home.meta.title,
    description: home.meta.description,
    keywords: [
      "agence web Wallonie",
      "création site internet Belgique",
      "agence web province de Luxembourg",
      "référencement local Wallonie",
    ],
    image: "/images/heros/agence.jpg",
    imageAlt: "BEEW — agence web en Wallonie",
  });
}

/**
 * Page ville. Le `Service` est rattaché à l'entité unique et porte la zone
 * couverte ; il n'y a PAS de fiche d'entreprise locale distincte, parce qu'il
 * n'existe pas d'établissement dans chacune de ces communes.
 */
export function cityJsonLd(city: City, trail: { href: string; label: string }[]) {
  const path = `/${city.slug}`;

  return buildGraph(
    organizationNode(),
    websiteNode(),
    webPageNode({
      path,
      name: city.meta.title,
      description: city.meta.description,
      image: "/images/heros/zones.jpg",
      dateModified: city.updatedAt,
    }),
    serviceNode({
      path,
      name: city.intent.primaryKeyword,
      serviceType: "Création de site internet",
      description: city.meta.description,
      areaServed: [city.city, ...city.coverage, `Province de ${city.province}`],
      ...(city.pricing && {
        offers: {
          price: city.pricing.from,
          currency: city.pricing.currency,
          description: city.pricing.note,
        },
      }),
    }),
    faqNode(path, city.faq),
    breadcrumbNode(path, trail),
  );
}

/** Sections de tête du site, telles qu'elles figurent dans le menu. */
const NAVIGATION = [
  { href: "/creation-site-internet", label: "Création de site internet" },
  { href: "/refonte-site-internet", label: "Refonte de site internet" },
  { href: "/referencement-seo", label: "Référencement SEO" },
  { href: "/site-e-commerce", label: "Site e-commerce" },
  { href: "/application-web", label: "Application web" },
  { href: "/outils-internes", label: "Outils internes" },
  { href: "/realisations", label: "Réalisations" },
  { href: "/methode", label: "Notre méthode" },
  { href: "/tarifs", label: "Tarifs" },
  { href: "/a-propos", label: "L'agence" },
  { href: "/zones-d-intervention", label: "Zones d'intervention" },
  { href: "/blog", label: "Journal" },
  { href: "/contact", label: "Contact" },
];

export function homeJsonLd(home: Home) {
  return buildGraph(
    organizationNode(),
    websiteNode(),
    navigationNode(NAVIGATION),
    webPageNode({
      path: "/",
      name: home.meta.title,
      description: home.meta.description,
      image: "/images/heros/agence.jpg",
      dateModified: home.updatedAt,
    }),
    faqNode("/", home.faq),
    breadcrumbNode("/", [{ href: "/", label: "Accueil" }]),
  );
}
