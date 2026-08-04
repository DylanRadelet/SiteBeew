import { z } from "zod";
import { MetaSchema, SlugSchema, normalize } from "@/content/schema";
import { SERVICE_SLUGS } from "@/content/service-slugs";

/**
 * Garde-fou des pages piliers de service.
 *
 * Même philosophie que `src/content/schema.ts` pour les villes : le schéma
 * n'est pas une validation de forme, c'est un seuil de VOLUME et de PERTINENCE.
 * Une page pilier qui ne ferait pas au moins 800 mots réellement utiles casse
 * le build. Ne jamais abaisser un seuil pour faire passer une page — la bonne
 * réponse est d'écrire le contenu manquant.
 */

const wordCount = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

const minWords = (n: number, label: string) =>
  z.string().refine((v) => wordCount(v) >= n, {
    message: `${label} : ${n} mots minimum (contenu utile, pas du remplissage).`,
  });

/** Volume minimum de prose par page pilier. C'est LE seuil anti-thin-content. */
export const MIN_WORDS_PAR_PAGE = 800;

/**
 * Les six verticales. Sert aussi à valider le maillage croisé : chaque pilier
 * doit lier vers TOUS les autres, ce qui garantit un maillage complet et non
 * une chaîne où certaines pages ne reçoivent presque rien.
 */
export { SERVICE_SLUGS } from "@/content/service-slugs";

/** Pages transverses que chaque pilier DOIT lier — sinon le maillage est mort. */
const PAGES_OBLIGATOIRES = ["/tarifs", "/realisations", "/contact"] as const;

/**
 * Le mot-clé est-il présent ? On teste mot à mot et non en sous-chaîne :
 * en français les mots-clés s'insèrent avec des articles ("création DE site
 * internet"), une comparaison littérale rejetterait des titres corrects.
 */
function porteLeMotCle(texte: string, motCle: string): boolean {
  const cible = normalize(texte);
  return normalize(motCle)
    .split(/\s+/)
    .filter((m) => m.length > 2)
    .every((mot) => cible.includes(mot));
}

/* -------------------------------------------------------------------------- */
/*                              Briques de section                             */
/* -------------------------------------------------------------------------- */

const PointSchema = z.object({
  title: z.string().min(8),
  description: minWords(20, "description"),
});

const EtapeSchema = z.object({
  title: z.string().min(4),
  /** Un délai annoncé : c'est ce qui distingue une méthode d'une liste de vœux. */
  duration: z.string().min(2),
  description: minWords(25, "method.steps[].description"),
});

const FaqSchema = z.object({
  question: z.string().min(15),
  answer: minWords(40, "faq[].answer"),
});

const LienSchema = z.object({
  href: z.string().startsWith("/"),
  label: z.string().min(4),
  description: z.string().min(20).optional(),
});

/* -------------------------------------------------------------------------- */
/*                                PAGE SERVICE                                 */
/* -------------------------------------------------------------------------- */

export const ServicePageSchema = z
  .object({
    slug: z.enum(SERVICE_SLUGS),

    intent: z.object({
      primaryKeyword: z.string().min(8),
      secondaryKeywords: z.array(z.string().min(4)).min(3).max(8),
    }),

    meta: MetaSchema,

    hero: z.object({
      h1: z.string().min(20).max(80),
      subtitle: minWords(30, "hero.subtitle"),
      badges: z.array(z.string().min(3)).min(2).max(4),
    }),

    /** « Le problème que ça résout » — la section qui capte la longue traîne. */
    problem: z.object({
      heading: z.string().min(20),
      body: minWords(180, "problem.body"),
      pains: z.array(PointSchema).min(3).max(6),
    }),

    /** « Ce qui est inclus » — répond à l'objection « qu'est-ce que j'achète ? ». */
    included: z.object({
      heading: z.string().min(15),
      intro: minWords(20, "included.intro"),
      items: z.array(PointSchema).min(4).max(8),
    }),

    method: z.object({
      heading: z.string().min(15),
      intro: minWords(20, "method.intro"),
      steps: z.array(EtapeSchema).min(3).max(5),
    }),

    /**
     * Bloc de preuve. `cases` reste VIDE tant qu'il n'y a pas de références
     * réelles et vérifiables : un faux résultat chiffré est une pratique
     * commerciale déloyale au sens du droit belge, pas seulement un risque SEO.
     */
    proof: z.object({
      heading: z.string().min(15),
      intro: minWords(20, "proof.intro"),
      cases: z
        .array(
          z.object({
            client: z.string().min(2),
            city: z.string().min(2),
            sector: z.string().min(3),
            summary: minWords(25, "proof.cases[].summary"),
            result: z.string().min(10),
          }),
        )
        .default([]),
    }),

    pricing: z.object({
      heading: z.string().min(15),
      label: z.string().min(4),
      from: z.number().int().positive(),
      currency: z.literal("EUR"),
      pitch: minWords(20, "pricing.pitch"),
      includes: z.array(z.string().min(10)).min(4),
      note: minWords(25, "pricing.note"),
    }),

    faq: z.array(FaqSchema).min(5).max(8),

    cta: z.object({
      title: z.string().min(20).max(90),
      subtitle: minWords(20, "cta.subtitle"),
    }),

    /** Maillage interne : TOUS les services frères + les pages transverses. */
    links: z.object({
      heading: z.string().min(15),
      intro: minWords(20, "links.intro"),
      services: z
        .array(LienSchema.required({ description: true }))
        .length(SERVICE_SLUGS.length - 1),
      pages: z.array(LienSchema).min(3).max(6),
    }),

    updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  })
  /* --- Placement du mot-clé principal ------------------------------------ */
  .refine((s) => porteLeMotCle(s.hero.h1, s.intent.primaryKeyword), {
    path: ["hero", "h1"],
    message: "Le H1 doit porter le mot-clé principal.",
  })
  .refine((s) => porteLeMotCle(s.meta.title, s.intent.primaryKeyword), {
    path: ["meta", "title"],
    message: "Le title doit porter le mot-clé principal (il est affiché tel quel dans la SERP).",
  })
  /* --- Maillage interne --------------------------------------------------- */
  .superRefine((s, ctx) => {
    const attendus = SERVICE_SLUGS.filter((x) => x !== s.slug).map((x) => `/${x}`);
    const fournis = s.links.services.map((l) => l.href);
    const manquants = attendus.filter((h) => !fournis.includes(h));
    if (manquants.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["links", "services"],
        message: `Chaque pilier lie vers tous les autres. Manque : ${manquants.join(", ")}.`,
      });
    }
    if (fournis.includes(`/${s.slug}`)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["links", "services"],
        message: "Une page ne peut pas se lier à elle-même.",
      });
    }

    const pages = s.links.pages.map((l) => l.href);
    const oubliees = PAGES_OBLIGATOIRES.filter((h) => !pages.includes(h));
    if (oubliees.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["links", "pages"],
        message: `Pages transverses obligatoires manquantes : ${oubliees.join(", ")}.`,
      });
    }
  })
  /* --- Pertinence de la FAQ ---------------------------------------------- */
  .refine(
    (s) => s.faq.filter((f) => porteLeMotCle(`${f.question} ${f.answer}`, s.intent.primaryKeyword)).length >= 2,
    {
      path: ["faq"],
      message:
        "Au moins 2 questions doivent porter sur le service lui-même (mot-clé principal), " +
        "pas seulement sur des généralités d'agence.",
    },
  )
  /* --- LE seuil : 800 mots utiles ---------------------------------------- */
  .superRefine((s, ctx) => {
    const total = wordCount(proseOfService(s).join(" "));
    if (total < MIN_WORDS_PAR_PAGE) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["(racine)"],
        message:
          `Page trop mince : ${total} mots de contenu réel pour un minimum de ${MIN_WORDS_PAR_PAGE}. ` +
          "Une page pilier qui ne fait pas 800 mots ne rankera sur rien. Écris le contenu manquant, " +
          "n'abaisse pas le seuil.",
      });
    }
  });

export type ServicePage = z.infer<typeof ServicePageSchema>;
export type ServicePoint = z.infer<typeof PointSchema>;
export type ServiceStep = z.infer<typeof EtapeSchema>;
export type ServiceFaqItem = z.infer<typeof FaqSchema>;
export type ServiceLink = z.infer<typeof LienSchema>;

/**
 * Champs de prose d'une page — sert au comptage de mots ET à la détection de
 * duplication croisée dans `src/lib/services.ts`. Les libellés courts (titres,
 * badges, labels) en sont exclus : ils ne comptent pas comme du contenu.
 */
export function proseOfService(s: {
  hero: { subtitle: string };
  problem: { body: string; pains: { description: string }[] };
  included: { intro: string; items: { description: string }[] };
  method: { intro: string; steps: { description: string }[] };
  proof: { intro: string; cases: { summary: string; result: string }[] };
  pricing: { pitch: string; note: string; includes: string[] };
  faq: { question: string; answer: string }[];
  cta: { subtitle: string };
  links: { intro: string; services: { description?: string }[] };
}): string[] {
  return [
    s.hero.subtitle,
    s.problem.body,
    ...s.problem.pains.map((p) => p.description),
    s.included.intro,
    ...s.included.items.map((p) => p.description),
    s.method.intro,
    ...s.method.steps.map((e) => e.description),
    s.proof.intro,
    ...s.proof.cases.map((c) => `${c.summary} ${c.result}`),
    s.pricing.pitch,
    s.pricing.note,
    ...s.pricing.includes,
    ...s.faq.map((f) => `${f.question} ${f.answer}`),
    s.cta.subtitle,
    s.links.intro,
    ...s.links.services.map((l) => l.description ?? ""),
  ].filter(Boolean);
}
