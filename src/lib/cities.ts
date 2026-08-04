import fs from "node:fs";
import path from "node:path";
import { CitySchema, HomeSchema, cityNames, normalize, proseOf, type City, type Home } from "@/content/schema";

/**
 * Chargement + validation du contenu au BUILD (Server Components / SSG uniquement).
 * Toute erreur ici casse volontairement le build : un build vert garantit
 * qu'aucune page ville n'est thin et qu'aucune n'est le clone d'une autre.
 */

const CITIES_DIR = path.join(process.cwd(), "src", "content", "cities");

/** Seuil de duplication croisée toléré entre deux villes. */
const MAX_OVERLAP = 0.35;

let cache: City[] | null = null;

export function getAllCities(): City[] {
  if (cache) return cache;

  const files = fs.readdirSync(CITIES_DIR).filter((f) => f.endsWith(".json"));
  if (files.length === 0) throw new Error("Aucune ville dans src/content/cities/.");

  const cities = files.map((file) => {
    const raw = JSON.parse(fs.readFileSync(path.join(CITIES_DIR, file), "utf-8"));
    const parsed = CitySchema.safeParse(raw);
    if (!parsed.success) throw new Error(formatIssues(file, parsed.error.issues));
    if (parsed.data.slug !== file.replace(/\.json$/, "")) {
      throw new Error(`[${file}] Le nom du fichier doit correspondre au slug ("${parsed.data.slug}.json").`);
    }
    return parsed.data;
  });

  assertNoDeadLinks(cities);
  assertNoDuplicateContent(cities);

  const drafts = cities.filter((c) => c.status === "draft");
  if (drafts.length) {
    console.warn(
      `\n[contenu] ${drafts.length} ville(s) en brouillon — générées en noindex, ` +
        `hors sitemap et hors maillage :\n${drafts.map((c) => `  · ${c.slug}`).join("\n")}\n` +
        `  Passe-les en "status": "published" quand tu as des réalisations et un témoignage réels.\n`,
    );
  }

  cache = cities.sort((a, b) => a.city.localeCompare(b.city, "fr"));
  return cache;
}

/**
 * Villes réellement en ligne. C'est CETTE liste qui alimente le sitemap, le
 * sélecteur, le footer et le maillage interne : une page en brouillon ne doit
 * jamais recevoir de lien depuis une page indexée.
 */
export function getPublishedCities(): City[] {
  return getAllCities().filter((c) => c.status === "published");
}

export function getCityBySlug(slug: string): City | undefined {
  return getAllCities().find((c) => c.slug === slug);
}

/** Voisines : brouillons exclus, plafonné à 6. */
export function getNearbyCities(city: City): City[] {
  const published = getPublishedCities();
  return city.nearby
    .map((s) => published.find((c) => c.slug === s))
    .filter((c): c is City => Boolean(c))
    .slice(0, 6);
}

export function getHome(): Home {
  const raw = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src", "content", "global.json"), "utf-8"));
  const parsed = HomeSchema.safeParse(raw);
  if (!parsed.success) throw new Error(formatIssues("global.json", parsed.error.issues));
  return parsed.data;
}

/* -------------------------------------------------------------------------- */
/*                        Garde-fou anti-doorway-page                          */
/* -------------------------------------------------------------------------- */

/**
 * Compare les champs libres de chaque paire de villes.
 * Deux pages qui partagent plus de MAX_OVERLAP de leurs phrases sont, aux yeux
 * de Google, la même page dupliquée — c'est exactement le pattern "doorway".
 */
function assertNoDuplicateContent(cities: City[]): void {
  const fingerprints = new Map(cities.map((c) => [c.slug, sentenceSet(c)]));

  for (let i = 0; i < cities.length; i++) {
    for (let j = i + 1; j < cities.length; j++) {
      const a = cities[i];
      const b = cities[j];
      const setA = fingerprints.get(a.slug)!;
      const setB = fingerprints.get(b.slug)!;
      if (setA.size === 0 || setB.size === 0) continue;

      const shared = [...setA].filter((s) => setB.has(s));
      const ratio = shared.length / Math.min(setA.size, setB.size);

      if (ratio > MAX_OVERLAP) {
        throw new Error(
          `Contenu dupliqué : "${a.slug}" et "${b.slug}" partagent ${Math.round(ratio * 100)}% de leurs phrases ` +
            `(maximum toléré ${MAX_OVERLAP * 100}%).\n` +
            `Ce sont des doorway pages aux yeux de Google.\n` +
            `Phrases en cause :\n${shared.slice(0, 5).map((s) => `  · ${s}`).join("\n")}\n` +
            `Réécris le contenu de l'une des deux villes — n'assouplis pas le seuil.`,
        );
      }
    }
  }
}

/** Chaque `nearby` doit pointer vers une ville qui existe, sinon lien mort sitewide. */
function assertNoDeadLinks(cities: City[]): void {
  const slugs = new Set(cities.map((c) => c.slug));
  for (const c of cities) {
    const dead = c.nearby.filter((s) => !slugs.has(s));
    if (dead.length) {
      throw new Error(`[${c.slug}] "nearby" pointe vers des villes inexistantes : ${dead.join(", ")}`);
    }
  }
}

/** Découpe la prose en phrases normalisées ; ignore les phrases trop courtes (bruit). */
function sentenceSet(city: City): Set<string> {
  const sentences = proseOf(city)
    .join(" ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => normalize(s).replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim())
    // On retire les noms de la ville : sinon deux phrases identiques passeraient
    // pour uniques juste parce que "Arlon" y remplace "Bastogne". C'est
    // exactement la substitution que Google identifie comme doorway page.
    .map((s) => {
      for (const name of cityNames(city)) s = s.replaceAll(normalize(name), "");
      return s.replace(/\s+/g, " ").trim();
    })
    .filter((s) => s.split(" ").length >= 6);

  return new Set(sentences);
}

function formatIssues(file: string, issues: { path: PropertyKey[]; message: string }[]): string {
  const lines = issues.map((i) => `  · ${i.path.join(".") || "(racine)"} — ${i.message}`);
  return `Contenu invalide dans ${file} :\n${lines.join("\n")}`;
}
