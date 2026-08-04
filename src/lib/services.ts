import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { normalize } from "@/content/schema";
import {
  SERVICE_SLUGS,
  ServicePageSchema,
  proseOfService,
  type ServicePage,
} from "@/content/schemas/service";
import {
  ORG_ID,
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
 * Chargement + validation des 4 pages piliers au BUILD.
 * Calqué sur `src/lib/cities.ts` : toute erreur casse volontairement le build.
 * Un build vert garantit qu'aucun pilier n'est thin ni le clone d'un autre.
 */

const SERVICES_DIR = path.join(process.cwd(), "src", "content", "services");

/** Même seuil que pour les villes : au-delà, Google voit une page dupliquée. */
const MAX_OVERLAP = 0.35;

let cache: Map<string, ServicePage> | null = null;

function loadAll(): Map<string, ServicePage> {
  if (cache) return cache;

  const services = SERVICE_SLUGS.map((slug) => {
    const file = `${slug}.json`;
    const full = path.join(SERVICES_DIR, file);
    if (!fs.existsSync(full)) {
      throw new Error(`[services] Fichier manquant : src/content/services/${file}`);
    }
    const raw = JSON.parse(fs.readFileSync(full, "utf-8"));
    const parsed = ServicePageSchema.safeParse(raw);
    if (!parsed.success) throw new Error(formatIssues(file, parsed.error.issues));
    if (parsed.data.slug !== slug) {
      throw new Error(`[${file}] Le nom du fichier doit correspondre au slug ("${parsed.data.slug}.json").`);
    }
    return parsed.data;
  });

  assertNoDuplicateContent(services);

  cache = new Map(services.map((s) => [s.slug, s]));
  return cache;
}

export function getService(slug: (typeof SERVICE_SLUGS)[number]): ServicePage {
  const found = loadAll().get(slug);
  if (!found) throw new Error(`[services] Service inconnu : ${slug}`);
  return found;
}

export function getAllServices(): ServicePage[] {
  return [...loadAll().values()];
}

/** Nombre de mots de contenu réel — utile en debug et dans les rapports. */
export function wordCountOf(service: ServicePage): number {
  return proseOfService(service).join(" ").trim().split(/\s+/).filter(Boolean).length;
}

/* -------------------------------------------------------------------------- */
/*                            Metadata & JSON-LD                               */
/* -------------------------------------------------------------------------- */

export function serviceMetadata(service: ServicePage): Metadata {
  return pageMetadata({
    path: `/${service.slug}`,
    title: service.meta.title,
    description: service.meta.description,
    keywords: [service.intent.primaryKeyword, ...service.intent.secondaryKeywords],
    image: "/images/heros/services.jpg",
    imageAlt: `BEEW — ${service.pricing.label}`,
  });
}

/**
 * Le pilier décrit une OFFRE : `Service` + `Offer` avec le prix plancher réel,
 * rattachés à l'entité unique du site. Le prix est un minimum honnête, déclaré
 * comme tel (`minPrice`), pas un tarif ferme.
 */
export function serviceJsonLd(service: ServicePage) {
  const path = `/${service.slug}`;
  const url = absolute(path);

  const offre = {
    "@type": "Service",
    "@id": `${url}#service`,
    name: service.intent.primaryKeyword,
    serviceType: service.pricing.label,
    description: service.meta.description,
    url,
    provider: { "@id": ORG_ID },
    areaServed: [
      { "@type": "AdministrativeArea", name: "Province de Luxembourg" },
      { "@type": "AdministrativeArea", name: "Wallonie" },
      { "@type": "Country", name: "Belgique" },
    ],
    offers: {
      "@type": "Offer",
      priceCurrency: service.pricing.currency,
      availability: "https://schema.org/InStock",
      seller: { "@id": ORG_ID },
      priceSpecification: {
        "@type": "PriceSpecification",
        minPrice: service.pricing.from,
        priceCurrency: service.pricing.currency,
        valueAddedTaxIncluded: false,
      },
    },
  };

  return buildGraph(
    organizationNode(),
    websiteNode(),
    webPageNode({
      path,
      name: service.meta.title,
      description: service.meta.description,
      image: "/images/heros/services.jpg",
      dateModified: service.updatedAt,
    }),
    offre,
    faqNode(path, service.faq),
    breadcrumbNode(path, [
      { href: "/", label: "Accueil" },
      { href: path, label: service.pricing.label },
    ]),
  );
}

/* -------------------------------------------------------------------------- */
/*                          Garde-fous de contenu                              */
/* -------------------------------------------------------------------------- */

/**
 * Détection de duplication croisée entre piliers.
 *
 * Six pages qui parlent toutes de « création de site » se ressemblent
 * naturellement. C'est précisément pour ça que le contrôle existe : au-delà du
 * seuil, Google ne voit plus six offres distinctes mais une page recopiée cinq
 * fois. Le build échoue — on réécrit la page, on ne relève pas le seuil.
 */
function assertNoDuplicateContent(services: ServicePage[]): void {
  const empreintes = new Map(services.map((s) => [s.slug, sentenceSet(s)]));

  for (let i = 0; i < services.length; i++) {
    for (let j = i + 1; j < services.length; j++) {
      const a = services[i];
      const b = services[j];
      const setA = empreintes.get(a.slug)!;
      const setB = empreintes.get(b.slug)!;
      if (!setA.size || !setB.size) continue;

      const communes = [...setA].filter((p) => setB.has(p));
      const ratio = communes.length / Math.min(setA.size, setB.size);

      if (ratio > MAX_OVERLAP) {
        throw new Error(
          `Contenu dupliqué : "${a.slug}" et "${b.slug}" partagent ${Math.round(ratio * 100)}% ` +
            `de leurs phrases (maximum toléré ${MAX_OVERLAP * 100}%).\n` +
            `Phrases en cause :\n${communes.slice(0, 5).map((p) => `  · ${p}`).join("\n")}\n` +
            `Réécris l'un des deux piliers — n'assouplis pas le seuil.`,
        );
      }
    }
  }
}

/** Phrases normalisées d'un pilier ; les trop courtes sont ignorées. */
function sentenceSet(service: ServicePage): Set<string> {
  return new Set(
    proseOfService(service)
      .join(" ")
      .split(/(?<=[.!?])\s+/)
      .map((p) => normalize(p).replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim())
      .filter((p) => p.split(" ").length >= 6),
  );
}

function formatIssues(file: string, issues: { path: PropertyKey[]; message: string }[]): string {
  const lignes = issues.map((i) => `  · ${i.path.join(".") || "(racine)"} — ${i.message}`);
  return `Contenu invalide dans ${file} :\n${lignes.join("\n")}`;
}
