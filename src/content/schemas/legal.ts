import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { MetaSchema, SlugSchema } from "@/content/schema";
import { BlocSchema } from "@/content/schemas/blog";

/**
 * Schéma des pages légales (mentions légales, confidentialité, CGV).
 *
 * Ces pages n'ont aucune valeur SEO — elles sont servies en `noindex, follow`.
 * Le garde-fou ici n'est donc pas un seuil de volume mais un seuil de
 * COMPLÉTUDE : une page légale amputée d'une rubrique obligatoire est un
 * risque juridique, pas un problème de référencement.
 *
 * Le corps réutilise les blocs typés du blog : même rendu, aucun HTML brut
 * dans le JSON.
 */

export const LEGAL_SLUGS = [
  "mentions-legales",
  "politique-de-confidentialite",
  "conditions-generales",
] as const;

export type LegalSlug = (typeof LEGAL_SLUGS)[number];

/**
 * Rubriques que chaque page DOIT contenir, par slug.
 * Sources : livre XII du Code de droit économique belge (services de la
 * société de l'information), articles 13 et 14 du RGPD, livre VI du CDE pour
 * les contrats à distance.
 */
const RUBRIQUES_OBLIGATOIRES: Record<LegalSlug, string[]> = {
  "mentions-legales": ["editeur", "hebergeur", "propriete-intellectuelle", "responsabilite"],
  "politique-de-confidentialite": [
    "responsable-du-traitement",
    "donnees-collectees",
    "finalites-et-bases-legales",
    "duree-de-conservation",
    "destinataires",
    "vos-droits",
    "cookies",
  ],
  "conditions-generales": [
    "objet",
    "devis-et-commande",
    "prix-et-paiement",
    "delais-et-obligations-du-client",
    "propriete-des-livrables",
    "responsabilite",
    "droit-applicable",
  ],
};

const SectionSchema = z
  .object({
    /** Sert d'ancre et de clé de contrôle des rubriques obligatoires. */
    id: SlugSchema,
    titre: z.string().min(5),
    blocs: z.array(BlocSchema).min(1),
  })
  .superRefine((s, ctx) => {
    // Le titre de section est déjà un h2 : un h2 imbriqué casserait la
    // hiérarchie de la page.
    if (s.blocs.some((b) => b.type === "titre" && b.niveau !== 3)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["blocs"],
        message: "Dans une section légale, les titres internes sont des h3.",
      });
    }
  });

export const LegalPageSchema = z
  .object({
    slug: z.enum(LEGAL_SLUGS),
    meta: MetaSchema,
    h1: z.string().min(10).max(80),
    surtitre: z.string().min(3),
    /** Date de dernière révision, affichée en haut de page. */
    updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    intro: z.string().min(80),
    sections: z.array(SectionSchema).min(4),
  })
  .superRefine((p, ctx) => {
    const ids = p.sections.map((s) => s.id);

    if (new Set(ids).size !== ids.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["sections"],
        message: "Deux sections partagent le même id.",
      });
    }

    const manquantes = RUBRIQUES_OBLIGATOIRES[p.slug].filter((r) => !ids.includes(r));
    if (manquantes.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["sections"],
        message:
          `Rubriques légales manquantes : ${manquantes.join(", ")}. ` +
          "Ces sections sont exigées par le droit belge / le RGPD — ne les retire pas.",
      });
    }
  });

export type LegalPage = z.infer<typeof LegalPageSchema>;
export type LegalSection = z.infer<typeof SectionSchema>;

/* -------------------------------------------------------------------------- */
/*                                  Chargement                                 */
/* -------------------------------------------------------------------------- */

const PAGES_DIR = path.join(process.cwd(), "src", "content", "pages");

/** Lecture + validation au build (Server Components uniquement). */
export function getLegalPage(slug: LegalSlug): LegalPage {
  const fichier = path.join(PAGES_DIR, `legal-${slug}.json`);
  const raw: unknown = JSON.parse(fs.readFileSync(fichier, "utf-8"));

  const parsed = LegalPageSchema.safeParse(raw);
  if (!parsed.success) {
    const lignes = parsed.error.issues.map(
      (i) => `  · ${i.path.join(".") || "(racine)"} — ${i.message}`,
    );
    throw new Error(`Contenu invalide dans legal-${slug}.json :\n${lignes.join("\n")}`);
  }
  if (parsed.data.slug !== slug) {
    throw new Error(`[legal-${slug}.json] Le champ "slug" doit valoir "${slug}".`);
  }

  return parsed.data;
}
