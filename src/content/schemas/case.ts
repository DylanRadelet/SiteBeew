import { z } from "zod";
import { MetaSchema, SlugSchema, TestimonialSchema } from "@/content/schema";

/**
 * Garde-fou d'une étude de cas.
 *
 * Même logique que le schéma des villes : ce n'est pas une validation de forme,
 * c'est la condition de mise en ligne. Une étude de cas est un argument de
 * vente ; publier un argument invérifiable est un risque juridique (pratique
 * commerciale déloyale) autant qu'un risque E-E-A-T.
 *
 * Le passage en `published` exige donc, en plus du contenu :
 *  · un résultat chiffré (au moins un nombre dans le titre du résultat) ;
 *  · la méthode de mesure et la source de ce chiffre ;
 *  · le retrait explicite du drapeau `placeholder`.
 */

const wordCount = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

const minWords = (n: number, label: string) =>
  z.string().refine((v) => wordCount(v) >= n, {
    message: `${label} : ${n} mots minimum.`,
  });

/** Un chiffre, pas une impression : « ça marche mieux » n'est pas un résultat. */
const containsNumber = (s: string) => /\d/.test(s);

const DateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format attendu : AAAA-MM-JJ.");

/* -------------------------------------------------------------------------- */
/*                            Services et secteurs                             */
/* -------------------------------------------------------------------------- */

/**
 * Les quatre verticales de PAGES.md §3. Le slug EST l'URL de la page service :
 * c'est ce qui garantit qu'une étude lie toujours vers une page pilier réelle.
 */
export const SERVICES = [
  { slug: "creation-site-internet", label: "Création de site internet" },
  { slug: "refonte-site-internet", label: "Refonte de site internet" },
  { slug: "referencement-seo", label: "Référencement SEO" },
  { slug: "site-e-commerce", label: "Site e-commerce" },
] as const;

export type ServiceSlug = (typeof SERVICES)[number]["slug"];

const SERVICE_SLUGS = SERVICES.map((s) => s.slug) as [ServiceSlug, ...ServiceSlug[]];

export function serviceLabel(slug: ServiceSlug): string {
  return SERVICES.find((s) => s.slug === slug)!.label;
}

/* -------------------------------------------------------------------------- */
/*                                ÉTUDE DE CAS                                 */
/* -------------------------------------------------------------------------- */

export const CaseSchema = z
  .object({
    /** Segment d'URL sous /realisations/. Doit correspondre au nom du fichier. */
    slug: SlugSchema,

    /**
     * `draft` : la page est générée pour relecture, mais en `noindex, nofollow`,
     * hors sitemap et hors maillage interne. État par défaut.
     */
    status: z.enum(["draft", "published"]).default("draft"),

    /**
     * Contenu de démonstration : client inventé, chiffres inventés.
     * Le schéma refuse de publier tant que ce drapeau n'est pas retombé à false.
     */
    placeholder: z.boolean().default(true),

    client: z.string().min(2),
    /** Ville réelle du client — c'est elle qui porte la preuve d'ancrage local. */
    city: z.string().min(2),
    /** Slug de la page ville correspondante, si elle existe. Maillage sortant. */
    citySlug: SlugSchema.optional(),

    sector: z.object({ slug: SlugSchema, label: z.string().min(3) }),
    /** Verticale principale : détermine la page service vers laquelle on lie. */
    service: z.enum(SERVICE_SLUGS),
    /** Prestations mobilisées, affichées telles quelles. */
    deliverables: z.array(z.string().min(4)).min(3).max(8),

    year: z.number().int().min(2000).max(2100),

    meta: MetaSchema,

    hero: z.object({
      h1: z.string().min(15).max(80),
      /** Résumé d'une phrase, repris tel quel dans la carte de l'index. */
      summary: minWords(20, "hero.summary"),
      image: z.string().startsWith("/"),
      /** Alt réellement descriptif : l'image porte le contexte du projet. */
      imageAlt: z.string().min(15),
    }),

    /** Les trois temps du récit. Sans eux, la page n'est qu'une capture d'écran. */
    context: minWords(60, "context"),
    problem: minWords(50, "problem"),
    solution: minWords(70, "solution"),

    result: z.object({
      /** La phrase mise en avant en grand. Doit contenir un nombre. */
      headline: z.string().min(10).refine(containsNumber, {
        message: "Le résultat doit contenir un chiffre — sinon ce n'est pas un résultat.",
      }),
      detail: minWords(25, "result.detail"),
      /**
       * Traçabilité du chiffre. Obligatoire pour publier : un résultat dont on
       * ne sait ni d'où il vient ni comment il a été mesuré n'est pas opposable.
       */
      proof: z
        .object({
          source: z.string().min(5),
          method: minWords(12, "result.proof.method"),
          period: z.string().min(5),
          verifiedAt: DateSchema,
        })
        .optional(),
    }),

    /** Réutilise le schéma des témoignages du site : un seul format partout. */
    testimonial: TestimonialSchema.optional(),

    url: z.string().url().optional(),
    updatedAt: DateSchema,
  })
  .superRefine((c, ctx) => {
    if (c.status !== "published") return;

    if (c.placeholder) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["placeholder"],
        message:
          "Cette étude est marquée comme contenu de démonstration. " +
          'Remplace le client et les chiffres par du réel avant de passer en "published".',
      });
    }
    if (!c.result.proof) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["result", "proof"],
        message:
          "Une étude publiée exige la source, la méthode et la période de mesure du résultat chiffré. " +
          "Un chiffre non vérifiable ne part pas en ligne.",
      });
    }
  });

export type Case = z.infer<typeof CaseSchema>;
