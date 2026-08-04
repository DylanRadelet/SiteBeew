import { z } from "zod";

/**
 * Garde-fou des étages hauts de la pyramide SEO locale (région, province).
 *
 * Même logique que `src/content/schema.ts` pour les villes : ce schéma impose un
 * VOLUME de contenu réellement propre à la zone. Une page « région » qui se
 * contente de reformuler la page « province » est un doublon aux yeux de Google,
 * et une page province sans tissu économique décrit est une page vide qui ne
 * mérite pas d'exister. Les seuils cassent le build — ne pas les assouplir.
 *
 * Le seuil est plus haut que pour une ville (400 mots contre 250) : une zone
 * couvre plus de terrain, elle doit donc apporter plus de substance qu'une
 * commune, sinon elle n'ajoute rien au maillage.
 */

const wordCount = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

const minWords = (n: number, label: string) =>
  z.string().refine((v) => wordCount(v) >= n, {
    message: `${label} : ${n} mots minimum, spécifiques à la zone (pas du texte réutilisable ailleurs).`,
  });

export const ZoneSlugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug invalide (minuscules et tirets uniquement).");

export const ZoneMetaSchema = z.object({
  title: z.string().min(20).max(60),
  description: z.string().min(90).max(160),
});

/**
 * Lien vers une zone enfant. `slug` à `null` = la page n'existe pas encore :
 * on affiche l'entrée sans lien plutôt que de fabriquer un lien mort.
 */
export const ZoneLinkSchema = z.object({
  name: z.string().min(2),
  slug: ZoneSlugSchema.nullable().default(null),
  /** Ce que cette zone a de particulier — évite une liste de noms sans intérêt. */
  focus: minWords(12, "provinces[].focus"),
});

/** Donnée factuelle vérifiable. Aucun chiffre de performance commerciale ici. */
export const ZoneFactSchema = z.object({
  label: z.string().min(3),
  value: z.string().min(2),
});

export const ZoneSectorSchema = z.object({
  name: z.string().min(3),
  description: minWords(25, "sectors[].description"),
});

export const ZoneFaqSchema = z.object({
  question: z.string().min(15),
  answer: minWords(35, "faq[].answer"),
});

export type ZoneLink = z.infer<typeof ZoneLinkSchema>;
export type ZoneFact = z.infer<typeof ZoneFactSchema>;
export type ZoneSector = z.infer<typeof ZoneSectorSchema>;
export type ZoneFaq = z.infer<typeof ZoneFaqSchema>;

/* -------------------------------------------------------------------------- */
/*                              RÉGION / PROVINCE                              */
/* -------------------------------------------------------------------------- */

export const ZoneSchema = z
  .object({
    /** Segment d'URL racine : `wallonie`, `province-de-luxembourg`. */
    slug: ZoneSlugSchema,

    /** Étage de la pyramide. Détermine ce qui est exigé plus bas (superRefine). */
    level: z.enum(["region", "province"]),

    /** Nom affiché : « Wallonie », « Province de Luxembourg ». */
    name: z.string().min(4),
    /** Forme courte utilisée dans les phrases : « Wallonie », « Luxembourg belge ». */
    shortName: z.string().min(4),
    /** Variantes réellement écrites dans le contenu, tolérées par les contrôles. */
    aliases: z.array(z.string().min(4)).default([]),

    /**
     * Zone parente. Obligatoire pour une province : chaque page doit remonter,
     * sinon la pyramide n'est qu'une liste de pages orphelines.
     */
    parent: z.object({ slug: ZoneSlugSchema, name: z.string().min(4) }).nullable().default(null),

    meta: ZoneMetaSchema,

    hero: z.object({
      h1: z.string().min(20).max(80),
      subtitle: minWords(18, "hero.subtitle"),
      badges: z.array(z.string().min(3)).min(2).max(4),
    }),

    /** Le cœur de l'unicité : tissu économique réel, bassins d'emploi, demande. */
    economy: z.object({
      heading: z.string().min(15),
      body: minWords(400, "economy.body"),
      highlights: z.array(z.string().min(10)).min(3).max(6),
    }),

    /** Repères géographiques et administratifs — exacts et vérifiables. */
    facts: z.array(ZoneFactSchema).min(3).max(8),
    sectors: z.array(ZoneSectorSchema).min(3).max(6),

    /** Étage inférieur, pour une région uniquement. */
    provinces: z.array(ZoneLinkSchema).default([]),

    /**
     * Province uniquement : valeur du champ `province` des JSON de villes.
     * C'est la clé de jointure vers `getPublishedCities()` — on ne recopie
     * jamais la liste des villes ici, elle serait fatalement désynchronisée.
     */
    cityProvince: z.string().min(2).optional(),

    faq: z.array(ZoneFaqSchema).min(3).max(8),

    updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  })
  /* --- Cohérence interne ------------------------------------------------- */
  .refine((z0) => mentions(z0.hero.h1, z0), {
    path: ["hero", "h1"],
    message: "Le H1 doit contenir le nom de la zone.",
  })
  .refine((z0) => mentions(z0.meta.title, z0), {
    path: ["meta", "title"],
    message: "Le title doit contenir le nom de la zone.",
  })
  .refine((z0) => z0.parent?.slug !== z0.slug, {
    path: ["parent"],
    message: "Une zone ne peut pas être son propre parent.",
  })
  /* --- Seuil d'unicité --------------------------------------------------- */
  .refine((z0) => z0.faq.filter((f) => mentions(f.question + " " + f.answer, z0)).length >= 2, {
    path: ["faq"],
    message: "Au moins 2 questions de FAQ doivent nommer la zone (sinon la FAQ est générique).",
  })
  /* --- Exigences propres à chaque étage ---------------------------------- */
  .superRefine((z0, ctx) => {
    if (z0.level === "region") {
      if (z0.provinces.length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["provinces"],
          message:
            "Une page région doit décrire au moins 3 provinces : c'est elle qui distribue " +
            "l'autorité vers l'étage inférieur.",
        });
      }
      if (z0.parent) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["parent"],
          message: "Une région est la racine de la pyramide : elle n'a pas de zone parente.",
        });
      }
      return;
    }

    // level === "province"
    if (!z0.parent) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["parent"],
        message: "Une province doit remonter vers sa région (`parent`), sinon la page est orpheline.",
      });
    }
    if (!z0.cityProvince) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cityProvince"],
        message:
          "Une province doit déclarer `cityProvince` — la valeur du champ `province` des JSON " +
          "de villes — pour pouvoir lier ses communes.",
      });
    }
    if (z0.provinces.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["provinces"],
        message: "`provinces` n'a de sens que sur une page région.",
      });
    }
  });

export type Zone = z.infer<typeof ZoneSchema>;

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                   */
/* -------------------------------------------------------------------------- */

export function zoneNames(z0: { name: string; shortName: string; aliases?: string[] }): string[] {
  return [z0.name, z0.shortName, ...(z0.aliases ?? [])];
}

function normalizeText(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

function mentions(haystack: string, z0: { name: string; shortName: string; aliases?: string[] }): boolean {
  const h = normalizeText(haystack);
  return zoneNames(z0).some((n) => h.includes(normalizeText(n)));
}

/** Champs libres d'une zone — base de la détection de duplication croisée. */
export function zoneProse(z0: Zone): string[] {
  return [
    z0.hero.subtitle,
    z0.economy.heading,
    z0.economy.body,
    ...z0.economy.highlights,
    ...z0.sectors.map((s) => `${s.name} ${s.description}`),
    ...z0.provinces.map((p) => p.focus),
    ...z0.faq.map((f) => `${f.question} ${f.answer}`),
  ];
}
