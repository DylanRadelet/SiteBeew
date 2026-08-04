import { z } from "zod";
import { MetaSchema, SlugSchema } from "@/content/schema";

/**
 * Garde-fou du blog.
 *
 * Même philosophie que les villes et les pages piliers : le schéma impose un
 * VOLUME et un MAILLAGE, pas seulement une forme. Un article de blog qui ne
 * fait pas 900 mots ne rankera sur rien et n'apporte rien au lecteur — il
 * casse donc le rendu au lieu de partir en ligne.
 *
 * Le corps de l'article vit en BLOCS TYPÉS, jamais en HTML brut : le JSON de
 * contenu ne doit pas pouvoir injecter de balises, et le rendu reste sous le
 * contrôle du design system (aucune dépendance markdown ajoutée).
 */

const wordCount = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

/** Volume minimum et maximum d'un article. */
export const MIN_MOTS_ARTICLE = 900;
export const MAX_MOTS_ARTICLE = 1400;

/** Vitesse de lecture retenue pour l'estimation affichée. */
const MOTS_PAR_MINUTE = 200;

/** Thèmes du blog. Sert aussi de valeur de filtre sur l'index. */
export const BLOG_THEMES = {
  "budget-et-projet": "Budget & projet",
  referencement: "Référencement",
  refonte: "Refonte",
} as const;

export type BlogTheme = keyof typeof BLOG_THEMES;

const ThemeSchema = z.enum(
  Object.keys(BLOG_THEMES) as [BlogTheme, ...BlogTheme[]],
);

/* -------------------------------------------------------------------------- */
/*                              Blocs de contenu                               */
/* -------------------------------------------------------------------------- */

const LienSchema = z.object({
  href: z.string().startsWith("/", "Maillage interne uniquement."),
  label: z.string().min(4),
});

const ParagrapheSchema = z.object({
  type: z.literal("paragraphe"),
  texte: z.string().min(60),
});

/**
 * Les titres portent leur propre `id` : c'est lui qui sert d'ancre au sommaire.
 * On ne le dérive pas du texte — un titre réécrit casserait silencieusement
 * tous les liens entrants vers l'ancre.
 */
const TitreSchema = z.object({
  type: z.literal("titre"),
  niveau: z.union([z.literal(2), z.literal(3)]),
  texte: z.string().min(8),
  id: SlugSchema,
});

const ListeSchema = z.object({
  type: z.literal("liste"),
  ordonnee: z.boolean().default(false),
  items: z.array(z.string().min(15)).min(2),
});

const CitationSchema = z.object({
  type: z.literal("citation"),
  texte: z.string().min(40),
  /** Absent = propos de l'agence, jamais attribué à un tiers inventé. */
  auteur: z.string().min(2).optional(),
});

/** Encadré : mise en garde, point de repère, ou CTA quand il porte un lien. */
const EncadreSchema = z.object({
  type: z.literal("encadre"),
  titre: z.string().min(8),
  texte: z.string().min(60),
  lien: LienSchema.optional(),
});

export const BlocSchema = z.discriminatedUnion("type", [
  ParagrapheSchema,
  TitreSchema,
  ListeSchema,
  CitationSchema,
  EncadreSchema,
]);

export type Bloc = z.infer<typeof BlocSchema>;
export type BlocTitre = z.infer<typeof TitreSchema>;

/* -------------------------------------------------------------------------- */
/*                                   ARTICLE                                   */
/* -------------------------------------------------------------------------- */

/** Préfixes des pages services : un article doit en lier au moins une. */
const PREFIXES_SERVICE = [
  "/creation-site-internet",
  "/refonte-site-internet",
  "/referencement-seo",
  "/site-e-commerce",
];

const DATE = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format attendu : AAAA-MM-JJ.");

export const ArticleSchema = z
  .object({
    slug: SlugSchema,
    theme: ThemeSchema,
    meta: MetaSchema,

    /** LE h1 de la page. Il n'y en a qu'un et il vient d'ici. */
    title: z.string().min(20).max(90),
    /** Résumé affiché sur l'index et en chapeau de l'article. */
    excerpt: z.string().min(90).max(260),

    publishedAt: DATE,
    updatedAt: DATE,

    image: z.string().startsWith("/"),
    /** Illustration décorative : alt vide assumé, décrit ici pour la relecture. */
    imageCredit: z.string().min(4),

    /** Auteur unique et honnête : l'agence, jamais une personne inventée. */
    author: z.literal("L'équipe BEEW"),

    body: z.array(BlocSchema).min(8),

    conclusion: z.object({
      titre: z.string().min(8),
      texte: z.string().min(120),
    }),
  })
  /* --- Cohérence des dates ------------------------------------------------ */
  .refine((a) => a.updatedAt >= a.publishedAt, {
    path: ["updatedAt"],
    message: "dateModified ne peut pas précéder datePublished.",
  })
  /* --- Structure du corps -------------------------------------------------- */
  .superRefine((a, ctx) => {
    const titresH2 = a.body.filter((b) => b.type === "titre" && b.niveau === 2);
    if (titresH2.length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["body"],
        message: "Un article a besoin d'au moins 3 h2 : c'est ce qui alimente le sommaire.",
      });
    }

    const ids = a.body.filter((b) => b.type === "titre").map((b) => b.id);
    if (new Set(ids).size !== ids.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["body"],
        message: "Deux titres partagent le même id : les ancres du sommaire seraient ambiguës.",
      });
    }

    // Un premier h3 avant tout h2 casse la hiérarchie de titres lue par Google
    // comme par un lecteur d'écran.
    const premierTitre = a.body.find((b) => b.type === "titre");
    if (premierTitre && premierTitre.type === "titre" && premierTitre.niveau === 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["body"],
        message: "Le premier titre du corps doit être un h2.",
      });
    }
  })
  /* --- Maillage interne ---------------------------------------------------- */
  .superRefine((a, ctx) => {
    const liens = a.body.flatMap((b) => (b.type === "encadre" && b.lien ? [b.lien.href] : []));

    if (!liens.some((h) => PREFIXES_SERVICE.some((p) => h === p || h.startsWith(`${p}-`)))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["body"],
        message: "Chaque article doit lier vers au moins une page service (encadré avec lien).",
      });
    }
    if (!liens.includes("/contact")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["body"],
        message: "Chaque article doit lier vers /contact.",
      });
    }
  })
  /* --- LE seuil de volume -------------------------------------------------- */
  .superRefine((a, ctx) => {
    const total = compterMots(a);
    if (total < MIN_MOTS_ARTICLE) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["(racine)"],
        message:
          `Article trop mince : ${total} mots pour un minimum de ${MIN_MOTS_ARTICLE}. ` +
          "Écris le contenu manquant, n'abaisse pas le seuil.",
      });
    }
    if (total > MAX_MOTS_ARTICLE * 1.15) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["(racine)"],
        message:
          `Article trop long : ${total} mots pour une cible de ${MAX_MOTS_ARTICLE}. ` +
          "Découpe-le en deux articles plutôt que de tout empiler.",
      });
    }
  });

export type Article = z.infer<typeof ArticleSchema>;

/** Article enrichi des informations calculées au chargement. */
export type ArticleRendu = Article & {
  motsCount: number;
  minutesLecture: number;
  /** Sommaire : uniquement les h2, dans l'ordre du corps. */
  sommaire: { id: string; texte: string }[];
};

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                   */
/* -------------------------------------------------------------------------- */

/** Prose réelle de l'article — les titres et libellés courts en sont exclus. */
export function proseOfArticle(a: Pick<Article, "excerpt" | "body" | "conclusion">): string[] {
  return [
    a.excerpt,
    ...a.body.flatMap((b) => {
      switch (b.type) {
        case "paragraphe":
          return [b.texte];
        case "liste":
          return b.items;
        case "citation":
          return [b.texte];
        case "encadre":
          return [b.texte];
        default:
          return [];
      }
    }),
    a.conclusion.texte,
  ];
}

export function compterMots(a: Pick<Article, "excerpt" | "body" | "conclusion">): number {
  return wordCount(proseOfArticle(a).join(" "));
}

export function minutesDeLecture(mots: number): number {
  return Math.max(1, Math.round(mots / MOTS_PAR_MINUTE));
}

export function libelleTheme(theme: BlogTheme): string {
  return BLOG_THEMES[theme];
}
