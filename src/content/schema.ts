import { z } from "zod";
import { SERVICE_SLUGS } from "@/content/service-slugs";

/**
 * Garde-fou anti-doorway-page.
 *
 * Ce schéma n'est pas une simple validation de forme : il impose un VOLUME
 * de contenu réellement unique par ville. Si une page est trop mince, le build
 * échoue. Ne jamais assouplir ces seuils pour "faire passer" une ville —
 * la bonne réponse est d'écrire le contenu, ou de ne pas créer la page.
 */

const wordCount = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

const minWords = (n: number, label: string) =>
  z.string().refine((v) => wordCount(v) >= n, {
    message: `${label} : ${n} mots minimum (contenu spécifique à la ville, pas du template).`,
  });

/** Slug d'URL : minuscules, tirets, pas d'accents. */
export const SlugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug invalide (minuscules et tirets uniquement).");

export const MetaSchema = z.object({
  /** Affiché tel quel dans la SERP — au-delà de 60 caractères Google tronque. */
  title: z.string().min(20).max(60),
  description: z.string().min(90).max(160),
});

export const CaseStudySchema = z.object({
  client: z.string().min(2),
  /** Visuel de la réalisation. Placeholder libre de droit tant qu'il n'y a pas la vraie capture. */
  image: z.string().startsWith("/").optional(),
  /** Ville réelle du client — sert à prouver l'ancrage local. */
  city: z.string().min(2),
  sector: z.string().min(3),
  summary: minWords(25, "cases[].summary"),
  /** Résultat chiffré. Un case sans résultat mesurable ne convainc personne. */
  result: z.string().min(10),
  url: z.string().url().optional(),
});

export const TestimonialSchema = z.object({
  author: z.string().min(2),
  role: z.string().min(2),
  company: z.string().min(2),
  city: z.string().min(2),
  quote: minWords(15, "testimonials[].quote"),
  rating: z.number().int().min(1).max(5),
});

export const FaqItemSchema = z.object({
  question: z.string().min(15),
  answer: minWords(30, "faq[].answer"),
});

export const ServiceSchema = z.object({
  title: z.string().min(3),
  description: minWords(15, "services[].description"),
  /**
   * Page pilier vers laquelle la carte pointe. Obligatoire : une carte de
   * service qui affiche « En savoir plus » sans lien est une impasse pour le
   * visiteur, et un lien interne perdu pour la home et les pages villes.
   */
  slug: z.enum(SERVICE_SLUGS),
  icon: z.string().optional(),
});

export type CaseStudy = z.infer<typeof CaseStudySchema>;
export type Testimonial = z.infer<typeof TestimonialSchema>;
export type FaqItem = z.infer<typeof FaqItemSchema>;
export type Service = z.infer<typeof ServiceSchema>;

/* -------------------------------------------------------------------------- */
/*                                    VILLE                                    */
/* -------------------------------------------------------------------------- */

export const CitySchema = z
  .object({
    /** Segment d'URL complet : `creation-site-web-arlon`. */
    slug: SlugSchema,

    /**
     * `draft` : la page est générée pour relecture mais reste en noindex,
     * hors sitemap et hors maillage interne. C'est l'état par défaut.
     *
     * `published` exige des preuves réelles (réalisations + témoignage) :
     * on ne met pas en ligne une page ville sans rien à montrer. C'est une
     * règle E-E-A-T autant qu'une règle d'honnêteté commerciale.
     */
    status: z.enum(["draft", "published"]).default("draft"),

    /** Nom officiel de la commune. */
    city: z.string().min(2),
    /**
     * Variantes réellement tapées dans Google ("Libramont" pour
     * "Libramont-Chevigny"). Les contrôles d'unicité acceptent ces variantes.
     */
    aliases: z.array(z.string().min(2)).default([]),
    province: z.string().min(2),
    region: z.string().min(2),
    postalCodes: z.array(z.string().regex(/^\d{4}$/)).min(1),
    geo: z.object({ lat: z.number(), lng: z.number() }),

    /** Intention de recherche ciblée. Un seul mot-clé principal par page. */
    intent: z.object({
      service: z.enum(["creation-site-web", "refonte", "seo", "ecommerce"]),
      primaryKeyword: z.string().min(5),
      secondaryKeywords: z.array(z.string().min(4)).min(2).max(8),
    }),

    meta: MetaSchema,

    hero: z.object({
      h1: z.string().min(20).max(80),
      subtitle: minWords(18, "hero.subtitle"),
      badges: z.array(z.string().min(3)).min(2).max(4),
    }),

    /**
     * Le cœur de l'unicité. Doit parler du tissu économique RÉEL de la ville :
     * secteurs dominants, typologie de clients, contraintes locales.
     * Deux villes ne peuvent pas avoir le même texte ici.
     */
    localContext: z.object({
      heading: z.string().min(15),
      body: minWords(250, "localContext.body"),
      highlights: z.array(z.string().min(10)).min(3).max(6),
    }),

    services: z.array(ServiceSchema).min(3).optional(),
    /** Vides tolérées en `draft`, obligatoires en `published` (voir superRefine). */
    cases: z.array(CaseStudySchema).default([]),
    testimonials: z.array(TestimonialSchema).default([]),

    pricing: z
      .object({ from: z.number().positive(), currency: z.literal("EUR"), note: z.string().min(20) })
      .optional(),

    faq: z.array(FaqItemSchema).min(3).max(8),

    /**
     * Slugs des villes voisines. Cible : 4 à 6 une fois le réseau constitué —
     * au-delà de 6, c'est du footer spam. Minimum 2 au démarrage.
     */
    nearby: z.array(SlugSchema).min(2).max(6),
    /** Communes couvertes — capte la longue traîne des villages. */
    coverage: z.array(z.string().min(2)).min(5),

    updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  })
  /* --- Cohérence interne ------------------------------------------------- */
  .refine((c) => cityNames(c).some((n) => c.slug.endsWith(slugify(n))), {
    path: ["slug"],
    message: "Le slug doit se terminer par le nom de la ville (ex. creation-site-web-arlon).",
  })
  .refine((c) => mentions(c.hero.h1, c), {
    path: ["hero", "h1"],
    message: "Le H1 doit contenir le nom de la ville.",
  })
  .refine((c) => mentions(c.meta.title, c), {
    path: ["meta", "title"],
    message: "Le title doit contenir le nom de la ville.",
  })
  /* --- Seuil d'unicité --------------------------------------------------- */
  .refine((c) => c.faq.filter((f) => mentions(f.question + f.answer, c)).length >= 2, {
    path: ["faq"],
    message: "Au moins 2 questions de FAQ doivent être spécifiques à la ville (pas des questions génériques).",
  })
  .refine((c) => !c.nearby.includes(c.slug), {
    path: ["nearby"],
    message: "Une ville ne peut pas se lier à elle-même.",
  })
  /* --- Conditions de mise en ligne --------------------------------------- */
  /**
   * La règle exigeait auparavant 2 réalisations et 1 témoignage pour publier.
   * Elle confondait deux choses différentes : « ne jamais publier de fausse
   * preuve » — non négociable — et « ne pas publier sans preuve », qui bloquait
   * inutilement des pages parfaitement légitimes.
   *
   * Une page ville tient debout sur son contenu local : tissu économique réel,
   * FAQ spécifique, communes couvertes. Les seuils qui garantissent cela sont
   * déjà appliqués plus haut. Ce qui reste interdit, c'est d'AFFICHER une preuve
   * qui n'en est pas.
   */
  .superRefine((c, ctx) => {
    if (c.status !== "published") return;

    if (
      c.cases.length &&
      !c.cases.some((cs) => mentions(cs.city, c) || c.coverage.some((z) => includesCity(cs.city, z)))
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cases"],
        message:
          "Une réalisation affichée sur une page ville doit se situer dans cette ville " +
          "ou dans une commune qu'elle couvre. Sinon elle n'y a pas sa place.",
      });
    }
  });

export type City = z.infer<typeof CitySchema>;

/* -------------------------------------------------------------------------- */
/*                                    HOME                                     */
/* -------------------------------------------------------------------------- */

/**
 * La home partage les mêmes composants que les villes, mais avec un contenu
 * volontairement LARGE ("agence web Belgique / Luxembourg belge").
 * Elle ne cible aucune ville : c'est elle qui capte les backlinks et
 * redistribue l'autorité vers les pages villes.
 */
export const HomeSchema = z.object({
  meta: MetaSchema,
  hero: z.object({
    h1: z.string().min(20).max(80),
    subtitle: minWords(18, "hero.subtitle"),
    badges: z.array(z.string().min(3)).min(2).max(4),
    /** Libellé du sélecteur de ville — rendu en HTML statique, crawlable. */
    citySelectorLabel: z.string().min(10),
  }),
  about: z.object({ heading: z.string().min(15), body: minWords(200, "about.body") }),

  /**
   * Bandeau de confiance, juste sous le hero.
   * Les cinq agences analysées placent la preuve sociale AVANT toute proposition.
   */
  trust: z.object({
    label: z.string().min(10).max(70),
    /**
     * Clients RÉELS uniquement. `file` est optionnel : tant qu'on n'a pas le
     * logo d'un client, on affiche son nom en toutes lettres. Un faux logo est
     * une fausse référence, et une fausse référence est une pratique
     * commerciale déloyale — pas seulement un risque SEO.
     */
    logos: z
      .array(
        z.object({
          name: z.string().min(2),
          file: z.string().startsWith("/").optional(),
          /** Ce qui a été livré. Vérifiable, donc opposable. */
          projet: z.string().min(8).optional(),
        }),
      )
      .min(3),
    rating: z
      .object({ value: z.number().min(1).max(5), count: z.number().int().positive(), source: z.string().min(2) })
      .optional(),
  }),

  /** 3 ou 4 chiffres. Aucun ne doit être inventé — voir PAGES.md §4. */
  stats: z.array(z.object({ value: z.string().min(1), label: z.string().min(6) })).min(3).max(4),

  /** La méthode nommée : chaque agence analysée en a une. */
  method: z.object({
    heading: z.string().min(10),
    intro: minWords(20, "method.intro"),
    steps: z
      .array(
        z.object({
          title: z.string().min(3),
          description: minWords(15, "method.steps[].description"),
          duration: z.string().min(2),
          /** Visuel affiché au survol de l'étape, sur grand écran uniquement. */
          image: z.string().startsWith("/"),
        }),
      )
      .min(3)
      .max(5),
  }),

  /** Différenciation + renversement du risque. */
  why: z.object({
    heading: z.string().min(10),
    points: z
      .array(z.object({ title: z.string().min(4), description: minWords(15, "why.points[].description") }))
      .min(3)
      .max(6),
  }),

  /** Transparence tarifaire : l'objection n°1 d'une PME. */
  pricing: z.object({
    heading: z.string().min(10),
    note: z.string().min(20),
    tiers: z
      .array(
        z.object({
          name: z.string().min(3),
          from: z.number().positive(),
          currency: z.literal("EUR"),
          pitch: z.string().min(20),
          includes: z.array(z.string().min(5)).min(3),
          highlight: z.boolean().default(false),
        }),
      )
      .min(2)
      .max(3),
  }),

  /** Bloc d'accroche qui suit le hero : surtitre entre crochets + deux lignes. */
  manifesto: z.object({
    eyebrow: z.string().min(6).max(48),
    line1: z.string().min(20).max(80),
    line2: z.string().min(15).max(80),
    ctaLabel: z.string().min(5).max(40),
    ctaHref: z.string().startsWith("/"),
  }),
  services: z.array(ServiceSchema).min(3),
  /**
   * Vides tant qu'il n'y a pas de preuve réelle — et les sections
   * correspondantes disparaissent de la page.
   *
   * Ces champs exigeaient auparavant 3 réalisations et 2 témoignages. Un seuil
   * qui rend une preuve OBLIGATOIRE ne produit pas de la preuve : il produit de
   * l'invention. C'est exactement ce qui s'était passé — trois clients et deux
   * témoignages fabriqués, présentés comme réels sur la page d'accueil.
   */
  cases: z.array(CaseStudySchema).default([]),
  testimonials: z.array(TestimonialSchema).default([]),
  faq: z.array(FaqItemSchema).min(3).max(8),
  updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export type Home = z.infer<typeof HomeSchema>;

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                   */
/* -------------------------------------------------------------------------- */

export function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

export function slugify(s: string): string {
  return normalize(s)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function includesCity(haystack: string, city: string): boolean {
  return normalize(haystack).includes(normalize(city));
}

/** Le texte mentionne-t-il la ville, sous son nom officiel ou l'un de ses alias ? */
function mentions(haystack: string, city: { city: string; aliases?: string[] }): boolean {
  return [city.city, ...(city.aliases ?? [])].some((name) => includesCity(haystack, name));
}

/** Tous les noms sous lesquels une ville peut apparaître dans le contenu. */
export function cityNames(c: { city: string; aliases?: string[] }): string[] {
  return [c.city, ...(c.aliases ?? [])];
}

/** Champs libres d'une ville, utilisés pour la détection de duplication croisée. */
export function proseOf(c: City): string[] {
  return [
    c.hero.subtitle,
    c.localContext.heading,
    c.localContext.body,
    ...c.localContext.highlights,
    ...(c.services ?? []).map((s) => s.description),
    ...c.cases.map((x) => `${x.summary} ${x.result}`),
    ...c.testimonials.map((t) => t.quote),
    ...c.faq.map((f) => `${f.question} ${f.answer}`),
  ];
}
