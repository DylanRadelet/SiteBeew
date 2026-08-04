import fs from "node:fs";
import path from "node:path";
import { CaseSchema, serviceLabel, type Case } from "@/content/schemas/case";
import { getAllCities } from "@/lib/cities";

/**
 * Chargement + validation des études de cas au BUILD (Server Components / SSG).
 * Calqué sur `src/lib/cities.ts` : toute erreur casse volontairement le build.
 */

const CASES_DIR = path.join(process.cwd(), "src", "content", "cases");

let cache: Case[] | null = null;

export function getAllCases(): Case[] {
  if (cache) return cache;

  if (!fs.existsSync(CASES_DIR)) return (cache = []);

  const files = fs.readdirSync(CASES_DIR).filter((f) => f.endsWith(".json"));

  const cases = files.map((file) => {
    const raw = JSON.parse(fs.readFileSync(path.join(CASES_DIR, file), "utf-8"));
    const parsed = CaseSchema.safeParse(raw);
    if (!parsed.success) throw new Error(formatIssues(file, parsed.error.issues));
    if (parsed.data.slug !== file.replace(/\.json$/, "")) {
      throw new Error(`[${file}] Le nom du fichier doit correspondre au slug ("${parsed.data.slug}.json").`);
    }
    return parsed.data;
  });

  assertUniqueSlugs(cases);
  assertNoDeadCityLinks(cases);

  const drafts = cases.filter((c) => c.status === "draft");
  if (drafts.length) {
    console.warn(
      `\n[contenu] ${drafts.length} étude(s) de cas en brouillon — générées en noindex, ` +
        `hors sitemap et hors maillage :\n${drafts.map((c) => `  · ${c.slug}`).join("\n")}\n` +
        `  Passe-les en "status": "published" quand le client, le chiffre et sa source sont réels.\n`,
    );
  }

  // Les plus récentes d'abord : une étude de 2019 en tête de page vieillit le site.
  cache = cases.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return cache;
}

/**
 * Études réellement en ligne. C'est CETTE liste qui alimente le maillage interne :
 * une page indexée ne doit jamais lier vers un brouillon.
 */
export function getPublishedCases(): Case[] {
  return getAllCases().filter((c) => c.status === "published");
}

export function getCaseBySlug(slug: string): Case | undefined {
  return getAllCases().find((c) => c.slug === slug);
}

/**
 * Étude suivante, pour la navigation en bas de page.
 * On boucle à l'intérieur du même statut : depuis une étude publiée on ne peut
 * pas atterrir sur un brouillon, et l'enchaînement des brouillons reste
 * navigable en relecture.
 */
export function getNextCase(current: Case): Case | undefined {
  const pool = getAllCases().filter((c) => c.status === current.status);
  if (pool.length < 2) return undefined;
  const i = pool.findIndex((c) => c.slug === current.slug);
  return pool[(i + 1) % pool.length];
}

/**
 * Page ville liée par une étude, si elle existe.
 * Une étude publiée ne lie pas vers une ville en brouillon : ce serait
 * rouvrir depuis une page indexée un lien que tout le reste du site ferme.
 */
export function getCaseCity(c: Case): { slug: string; city: string } | undefined {
  if (!c.citySlug) return undefined;
  const city = getAllCities().find((x) => x.slug === c.citySlug);
  if (!city) return undefined;
  if (c.status === "published" && city.status !== "published") return undefined;
  return { slug: city.slug, city: city.city };
}

/** Facettes de l'index, dédupliquées et triées — jamais écrites à la main. */
export function getCaseFacets(cases: Case[]): {
  sectors: { slug: string; label: string }[];
  services: { slug: string; label: string }[];
} {
  const sectors = new Map(cases.map((c) => [c.sector.slug, c.sector.label]));
  const services = new Map(cases.map((c) => [c.service as string, serviceLabel(c.service)]));
  const toSorted = (m: Map<string, string>) =>
    [...m].map(([slug, label]) => ({ slug, label })).sort((a, b) => a.label.localeCompare(b.label, "fr"));
  return { sectors: toSorted(sectors), services: toSorted(services) };
}

/* -------------------------------------------------------------------------- */
/*                                 Garde-fous                                  */
/* -------------------------------------------------------------------------- */

function assertUniqueSlugs(cases: Case[]): void {
  const seen = new Set<string>();
  for (const c of cases) {
    if (seen.has(c.slug)) throw new Error(`Slug d'étude de cas en double : "${c.slug}".`);
    seen.add(c.slug);
  }
}

/** `citySlug` doit pointer vers une ville existante, sinon lien mort. */
function assertNoDeadCityLinks(cases: Case[]): void {
  const slugs = new Set(getAllCities().map((c) => c.slug));
  for (const c of cases) {
    if (c.citySlug && !slugs.has(c.citySlug)) {
      throw new Error(`[${c.slug}] "citySlug" pointe vers une ville inexistante : ${c.citySlug}`);
    }
  }
}

function formatIssues(file: string, issues: { path: PropertyKey[]; message: string }[]): string {
  const lines = issues.map((i) => `  · ${i.path.join(".") || "(racine)"} — ${i.message}`);
  return `Contenu invalide dans ${file} :\n${lines.join("\n")}`;
}
