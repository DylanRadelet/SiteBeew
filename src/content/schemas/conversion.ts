import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { FaqItemSchema, MetaSchema } from "@/content/schema";

/**
 * Schéma des pages de conversion (/contact, /devis).
 *
 * Même principe que le garde-fou des villes : tout le texte vit dans un JSON
 * validé, aucun libellé n'est écrit en dur dans un composant. Une page de
 * conversion mal remplie (titre trop long pour la SERP, champ sans message
 * d'erreur, maillage interne absent) casse le rendu au lieu de partir en ligne.
 *
 * Ce schéma est volontairement séparé de `content/schema.ts`, qui reste dédié
 * aux pages villes et à la home.
 */

/* -------------------------------------------------------------------------- */
/*                              Champs du formulaire                           */
/* -------------------------------------------------------------------------- */

export const TypeChampSchema = z.enum(["text", "email", "tel", "url", "textarea", "select"]);

export const ChampSchema = z
  .object({
    /** Utilisé comme `name` HTML et comme clé de la charge utile envoyée. */
    name: z.string().regex(/^[a-z][a-zA-Z0-9]*$/, "name : camelCase, sans accent ni espace."),
    /** Toujours visible : jamais de placeholder en guise d'étiquette. */
    label: z.string().min(3),
    type: TypeChampSchema,
    requis: z.boolean(),
    placeholder: z.string().optional(),
    /** Précision affichée sous l'étiquette, liée par `aria-describedby`. */
    aide: z.string().optional(),
    /** Obligatoire pour un `select`, interdit ailleurs. */
    options: z.array(z.string().min(1)).min(2).optional(),
    autoComplete: z.string().optional(),
    /** Le champ n'occupe qu'une demi-largeur à partir de `sm`. */
    demiLargeur: z.boolean().optional(),
    /**
     * Message affiché quand la validation native échoue. On remplace le message
     * par défaut du navigateur, qui est générique et souvent mal traduit.
     */
    erreur: z.string().min(10),
  })
  .superRefine((champ, ctx) => {
    if (champ.type === "select" && !champ.options) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["options"],
        message: "Un champ de type select doit lister ses options.",
      });
    }
    if (champ.type !== "select" && champ.options) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["options"],
        message: "Seul un champ de type select accepte des options.",
      });
    }
  });

export const FormulaireSchema = z.object({
  surtitre: z.string().min(3),
  titre: z.string().min(10),
  intro: z.string().min(40),
  champs: z.array(ChampSchema).min(4),
  /** Case à cocher obligatoire, rendue en fin de formulaire. */
  consentement: z.object({
    label: z.string().min(40),
    erreur: z.string().min(10),
  }),
  bouton: z.string().min(5),
  etats: z.object({
    envoi: z.string().min(5),
    /** Surtitre du panneau de confirmation, une fois le formulaire remplacé. */
    succesTitre: z.string().min(5),
    succes: z.string().min(30),
    erreur: z.string().min(30),
  }),
  /** Mention discrète sous le bouton (délai de réponse, confidentialité…). */
  note: z.string().min(20),
});

/* -------------------------------------------------------------------------- */
/*                                 Blocs de page                               */
/* -------------------------------------------------------------------------- */

/** Bloc « ce qui se passe ensuite », « rappels » : un titre et des points. */
export const BlocListeSchema = z.object({
  surtitre: z.string().min(3),
  titre: z.string().min(10),
  intro: z.string().min(40).optional(),
  items: z
    .array(
      z.object({
        titre: z.string().min(5),
        description: z.string().min(40),
      }),
    )
    .min(2),
});

export const CoordonneesSchema = z.object({
  surtitre: z.string().min(3),
  titre: z.string().min(10),
  items: z
    .array(
      z.object({
        label: z.string().min(3),
        valeur: z.string().min(3),
        /** Absent = information non cliquable (adresse, horaires). */
        href: z.string().optional(),
      }),
    )
    .min(2),
});

/** Maillage interne. Deux liens minimum, tous internes et absolus. */
export const LiensSchema = z.object({
  surtitre: z.string().min(3),
  titre: z.string().min(10),
  items: z
    .array(
      z.object({
        href: z.string().startsWith("/", "Maillage interne uniquement."),
        label: z.string().min(3),
        description: z.string().min(30),
      }),
    )
    .min(2),
});

/* -------------------------------------------------------------------------- */
/*                                    Page                                     */
/* -------------------------------------------------------------------------- */

export const ConversionPageSchema = z.object({
  slug: z.enum(["contact", "devis"]),
  meta: MetaSchema,
  hero: z.object({
    surtitre: z.string().min(3),
    /** LE h1 de la page — il n'y en a qu'un, il vient d'ici. */
    h1: z.string().min(10).max(80),
    intro: z.string().min(80),
  }),
  formulaire: FormulaireSchema,
  rappels: BlocListeSchema.optional(),
  etapes: BlocListeSchema.optional(),
  coordonnees: CoordonneesSchema.optional(),
  faq: z.array(FaqItemSchema).min(3).optional(),
  liens: LiensSchema,
});

export type Champ = z.infer<typeof ChampSchema>;
export type Formulaire = z.infer<typeof FormulaireSchema>;
export type BlocListe = z.infer<typeof BlocListeSchema>;
export type Coordonnees = z.infer<typeof CoordonneesSchema>;
export type Liens = z.infer<typeof LiensSchema>;
export type ConversionPage = z.infer<typeof ConversionPageSchema>;

/* -------------------------------------------------------------------------- */
/*                                  Chargement                                 */
/* -------------------------------------------------------------------------- */

const PAGES_DIR = path.join(process.cwd(), "src", "content", "pages");

/** Lecture + validation au build (Server Components uniquement). */
export function getConversionPage(slug: ConversionPage["slug"]): ConversionPage {
  const fichier = path.join(PAGES_DIR, `${slug}.json`);
  const raw: unknown = JSON.parse(fs.readFileSync(fichier, "utf-8"));

  const parsed = ConversionPageSchema.safeParse(raw);
  if (!parsed.success) {
    const lignes = parsed.error.issues.map((i) => `  · ${i.path.join(".") || "(racine)"} — ${i.message}`);
    throw new Error(`Contenu invalide dans ${slug}.json :\n${lignes.join("\n")}`);
  }
  if (parsed.data.slug !== slug) {
    throw new Error(`[${slug}.json] Le champ "slug" doit valoir "${slug}".`);
  }

  return parsed.data;
}
