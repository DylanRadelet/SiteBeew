import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { getPublishedCities } from "@/lib/cities";
import {
  breadcrumbNode,
  buildGraph,
  faqNode,
  itemListNode,
  organizationNode,
  pageMetadata,
  serviceNode,
  webPageNode,
  websiteNode,
} from "@/lib/seo";
import type { City } from "@/content/schema";
import { ZoneSchema, zoneNames, zoneProse, type Zone } from "@/content/schemas/region";

/**
 * Chargement + validation des zones (région, province) au BUILD.
 * Calqué sur `src/lib/cities.ts` : toute erreur casse le build, volontairement.
 *
 * Ce qui est vérifié ici et pas dans le schéma (parce que ça demande de voir
 * TOUTES les zones à la fois) : les liens morts entre étages et la duplication
 * croisée entre la page région et la page province.
 */

const ZONES_DIR = path.join(process.cwd(), "src", "content", "regions");

/**
 * Seuil plus strict que pour les villes (35 %) : région et province se
 * ressemblent beaucoup plus naturellement que deux communes, c'est précisément
 * là que le doublon guette.
 */
const MAX_OVERLAP = 0.25;

let cache: Zone[] | null = null;

export function getAllZones(): Zone[] {
  if (cache) return cache;

  const files = fs.readdirSync(ZONES_DIR).filter((f) => f.endsWith(".json"));
  if (files.length === 0) throw new Error("Aucune zone dans src/content/regions/.");

  const zones = files.map((file) => {
    const raw = JSON.parse(fs.readFileSync(path.join(ZONES_DIR, file), "utf-8"));
    const parsed = ZoneSchema.safeParse(raw);
    if (!parsed.success) throw new Error(formatIssues(file, parsed.error.issues));
    if (parsed.data.slug !== file.replace(/\.json$/, "")) {
      throw new Error(`[${file}] Le nom du fichier doit correspondre au slug ("${parsed.data.slug}.json").`);
    }
    return parsed.data;
  });

  assertNoDeadLinks(zones);
  assertNoDuplicateContent(zones);

  cache = zones;
  return cache;
}

export function getZoneBySlug(slug: string): Zone | undefined {
  return getAllZones().find((z) => z.slug === slug);
}

/** La zone racine de la pyramide. */
export function getRegion(): Zone {
  const region = getAllZones().find((z) => z.level === "region");
  if (!region) throw new Error("Aucune zone de niveau \"region\" : la pyramide n'a pas de racine.");
  return region;
}

/** Provinces qui ont réellement une page, dans l'ordre alphabétique. */
export function getProvinceZones(): Zone[] {
  return getAllZones()
    .filter((z) => z.level === "province")
    .sort((a, b) => a.name.localeCompare(b.name, "fr"));
}

/**
 * Province par slug. Volontairement restreint à l'étage « province » : c'est
 * `[slug]` qui appelle cette fonction, et la région a sa propre route.
 */
export function getProvinceZoneBySlug(slug: string): Zone | undefined {
  const zone = getZoneBySlug(slug);
  return zone?.level === "province" ? zone : undefined;
}

/**
 * Province parente d'une ville, retrouvée par `cityProvince`.
 * Aucun slug de province n'est écrit en dur dans les pages : une ville
 * hennuyère remonte vers le Hainaut, pas vers la province de Luxembourg.
 */
export function getZoneOfCity(city: City): Zone | undefined {
  const target = normalizeText(city.province);
  return getProvinceZones().find((z) => z.cityProvince && normalizeText(z.cityProvince) === target);
}

/**
 * Villes rattachées à une province — PUBLIÉES uniquement.
 * Une page en brouillon ne doit jamais recevoir de lien depuis une page
 * indexée : c'est la même règle que pour `nearby` et le footer.
 */
export function getPublishedCitiesOfZone(zone: Zone): City[] {
  if (!zone.cityProvince) return [];
  const target = normalizeText(zone.cityProvince);
  return getPublishedCities().filter((c) => normalizeText(c.province) === target);
}

/** Toutes les villes publiées, groupées par province, pour le hub. */
export function getPublishedCitiesByProvince(): { province: string; cities: City[] }[] {
  const groupes = new Map<string, City[]>();
  for (const c of getPublishedCities()) {
    const liste = groupes.get(c.province) ?? [];
    liste.push(c);
    groupes.set(c.province, liste);
  }
  return [...groupes.entries()]
    .map(([province, cities]) => ({ province, cities }))
    .sort((a, b) => a.province.localeCompare(b.province, "fr"));
}

/* -------------------------------------------------------------------------- */
/*                            Hiérarchie & maillage                            */
/* -------------------------------------------------------------------------- */

export type MailleZone = { href: string; label: string };

/**
 * Chemin complet depuis l'accueil jusqu'à la zone, en remontant les parents.
 * Alimente à la fois le fil d'Ariane visible et le `BreadcrumbList` JSON-LD :
 * une seule source, donc aucun risque de divergence entre les deux.
 */
export function getZoneTrail(zone: Zone): MailleZone[] {
  const chaine: MailleZone[] = [];
  let courante: Zone | undefined = zone;

  // Garde-fou : `assertNoDeadLinks` valide déjà les parents, mais une boucle
  // (A parent de B, B parent de A) bloquerait le build en boucle infinie.
  const vus = new Set<string>();
  while (courante && !vus.has(courante.slug)) {
    vus.add(courante.slug);
    chaine.unshift({ href: `/${courante.slug}`, label: courante.name });
    courante = courante.parent ? getZoneBySlug(courante.parent.slug) : undefined;
  }

  return [{ href: "/", label: "Accueil" }, ...chaine];
}

/* -------------------------------------------------------------------------- */
/*                              SEO — metadata                                 */
/* -------------------------------------------------------------------------- */

/** Tout passe par le socle de `@/lib/seo` : une seule définition du <head>. */
export function zoneMetadata(zone: Zone): Metadata {
  return pageMetadata({
    path: `/${zone.slug}`,
    title: zone.meta.title,
    description: zone.meta.description,
    keywords: [
      `création site internet ${zone.shortName}`,
      `agence web ${zone.shortName}`,
      ...zone.sectors.slice(0, 3).map((s) => `${s.name} ${zone.shortName}`),
    ],
    image: "/images/heros/zones.jpg",
    imageAlt: `BEEW — création de site internet en ${zone.shortName}`,
  });
}

/**
 * Le `Service` porte la zone administrative couverte et pointe vers l'entité
 * unique du site. Le `BreadcrumbList` reproduit la pyramide réelle
 * (Accueil → région → province), à partir de la MÊME source que le fil visible.
 */
export function zoneJsonLd(zone: Zone, areaServed: string[]) {
  const path = `/${zone.slug}`;

  /**
   * Les pages filles réellement liées : les provinces qui ont une page pour la
   * région, les communes publiées pour une province. Une entrée sans page n'y
   * figure pas — le balisage ne doit décrire que des liens qui existent.
   */
  const enfants =
    zone.level === "region"
      ? zone.provinces
          .filter((p) => p.slug)
          .map((p) => ({ href: `/${p.slug}`, label: p.name }))
      : getPublishedCitiesOfZone(zone).map((c) => ({
          href: `/${c.slug}`,
          label: `Création de site internet à ${c.city}`,
        }));

  return buildGraph(
    organizationNode(),
    websiteNode(),
    webPageNode({
      path,
      name: zone.meta.title,
      description: zone.meta.description,
      image: "/images/heros/zones.jpg",
      dateModified: zone.updatedAt,
    }),
    serviceNode({
      path,
      name: `Création de site internet — ${zone.name}`,
      serviceType: "Création de site internet",
      description: zone.meta.description,
      areaServed: [zone.name, ...areaServed],
    }),
    itemListNode(
      path,
      enfants,
      zone.level === "region" ? "Provinces couvertes" : `Communes couvertes en ${zone.shortName}`,
    ),
    faqNode(path, zone.faq),
    breadcrumbNode(path, getZoneTrail(zone)),
  );
}

/* -------------------------------------------------------------------------- */
/*                          Garde-fous de maillage                             */
/* -------------------------------------------------------------------------- */

/**
 * Un lien mort dans la pyramide est plus grave qu'ailleurs : ces pages n'ont
 * qu'une raison d'être, distribuer l'autorité vers l'étage du dessous.
 */
function assertNoDeadLinks(zones: Zone[]): void {
  const slugs = new Set(zones.map((z) => z.slug));

  for (const z of zones) {
    if (z.parent && !slugs.has(z.parent.slug)) {
      throw new Error(`[${z.slug}] "parent" pointe vers une zone inexistante : ${z.parent.slug}`);
    }
    const dead = z.provinces
      .map((p) => p.slug)
      .filter((s): s is string => Boolean(s))
      .filter((s) => !slugs.has(s));
    if (dead.length) {
      throw new Error(
        `[${z.slug}] "provinces" pointe vers des zones inexistantes : ${dead.join(", ")}. ` +
          `Mets leur "slug" à null tant que la page n'existe pas.`,
      );
    }
  }
}

function assertNoDuplicateContent(zones: Zone[]): void {
  const fingerprints = new Map(zones.map((z) => [z.slug, sentenceSet(z)]));

  for (let i = 0; i < zones.length; i++) {
    for (let j = i + 1; j < zones.length; j++) {
      const a = zones[i];
      const b = zones[j];
      const setA = fingerprints.get(a.slug)!;
      const setB = fingerprints.get(b.slug)!;
      if (setA.size === 0 || setB.size === 0) continue;

      const shared = [...setA].filter((s) => setB.has(s));
      const ratio = shared.length / Math.min(setA.size, setB.size);

      if (ratio > MAX_OVERLAP) {
        throw new Error(
          `Contenu dupliqué : "${a.slug}" et "${b.slug}" partagent ${Math.round(ratio * 100)}% de leurs ` +
            `phrases (maximum toléré ${MAX_OVERLAP * 100}%).\n` +
            `Phrases en cause :\n${shared.slice(0, 5).map((s) => `  · ${s}`).join("\n")}\n` +
            `Réécris l'une des deux zones — n'assouplis pas le seuil.`,
        );
      }
    }
  }
}

/**
 * Découpe la prose en phrases normalisées, noms de zone retirés : sinon deux
 * paragraphes identiques passeraient pour uniques parce que « Wallonie » y
 * remplace « province de Luxembourg ». C'est exactement la substitution que
 * Google identifie comme une doorway page.
 */
function sentenceSet(zone: Zone): Set<string> {
  return new Set(
    zoneProse(zone)
      .join(" ")
      .split(/(?<=[.!?])\s+/)
      .map((s) => normalizeText(s).replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim())
      .map((s) => {
        for (const name of zoneNames(zone)) s = s.replaceAll(normalizeText(name), "");
        return s.replace(/\s+/g, " ").trim();
      })
      .filter((s) => s.split(" ").length >= 6),
  );
}

function normalizeText(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

function formatIssues(file: string, issues: { path: PropertyKey[]; message: string }[]): string {
  const lines = issues.map((i) => `  · ${i.path.join(".") || "(racine)"} — ${i.message}`);
  return `Contenu invalide dans ${file} :\n${lines.join("\n")}`;
}
