import { z } from "zod";
import aProposJson from "@/content/pages/a-propos.json";
import methodeJson from "@/content/pages/methode.json";
import tarifsJson from "@/content/pages/tarifs.json";

/**
 * Schéma des trois pages de confiance : /a-propos, /methode, /tarifs.
 *
 * Il est volontairement séparé de `src/content/schema.ts`, qui garde les pages
 * villes : les seuils ne portent pas sur les mêmes risques. Ici il n'y a pas de
 * duplication croisée à craindre, mais un enjeu de VOLUME — une page de
 * confiance trop courte ne lève aucune objection et ne ranke sur rien. D'où le
 * plancher de mots imposé sur les blocs de prose.
 *
 * Tout le texte affiché vient d'ici. Aucun composant de `components/confiance/`
 * n'écrit de contenu en dur.
 */

const compteMots = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

const minMots = (n: number, label: string) =>
  z.string().refine((v) => compteMots(v) >= n, {
    message: `${label} : ${n} mots minimum.`,
  });

/* -------------------------------------------------------------------------- */
/*  Briques communes aux trois pages                                          */
/* -------------------------------------------------------------------------- */

/** Contraintes SERP : au-delà de 60 caractères Google tronque le titre. */
const MetaSchema = z.object({
  title: z.string().min(20).max(60),
  description: z.string().min(90).max(160),
});

const HeroSchema = z.object({
  h1: z.string().min(20),
  intro: minMots(30, "hero.intro"),
  badges: z.array(z.string().min(3)).min(3).max(5),
});

const ImageSchema = z.object({
  src: z.string().startsWith("/"),
  /** Jamais vide : ces images sont porteuses de sens, pas décoratives. */
  alt: z.string().min(10),
});

const PointSchema = z.object({
  titre: z.string().min(5),
  texte: minMots(15, "point.texte"),
});

const LienSchema = z.object({
  href: z.string().startsWith("/"),
  label: z.string().min(3),
  texte: z.string().min(20),
});

const FaqSchema = z
  .array(
    z.object({
      question: z.string().min(15),
      reponse: minMots(45, "faq[].reponse"),
    }),
  )
  .min(5);

/** Le maillage interne est obligatoire : une page de confiance orpheline ne sert à rien. */
const MaillageSchema = z.object({
  surtitre: z.string().min(3),
  titre: z.string().min(5),
  intro: z.string().min(20),
  liens: z.array(LienSchema).min(6),
});

const CtaSchema = z.object({
  surtitre: z.string().min(3),
  titre: z.string().min(10),
  texte: minMots(20, "cta.texte"),
  bouton: z.object({ href: z.string().startsWith("/"), label: z.string().min(5) }),
});

/* -------------------------------------------------------------------------- */
/*  /a-propos                                                                 */
/* -------------------------------------------------------------------------- */

export const AProposSchema = z.object({
  meta: MetaSchema,
  hero: HeroSchema,
  histoire: z.object({
    surtitre: z.string().min(3),
    titre: z.string().min(10),
    intro: z.string().min(30),
    /** Le récit de l'agence porte l'essentiel du contenu unique de la page. */
    paragraphes: z.array(minMots(40, "histoire.paragraphes[]")).min(4),
    image: ImageSchema,
  }),
  convictions: z.object({
    surtitre: z.string().min(3),
    titre: z.string().min(10),
    intro: z.string().min(30),
    points: z.array(PointSchema).min(5),
  }),
  /**
   * Aucun nom, aucune photo de personne réelle tant que l'équipe n'est pas
   * documentée : seuls les RÔLES sont décrits. `note` explique publiquement
   * pourquoi la page est incomplète — c'est plus honnête qu'un profil inventé.
   */
  equipe: z.object({
    surtitre: z.string().min(3),
    titre: z.string().min(10),
    intro: z.string().min(20),
    note: z.string().min(40),
    image: ImageSchema,
    roles: z.array(z.object({ role: z.string().min(5), texte: minMots(15, "equipe.roles[].texte") })).min(3),
  }),
  /**
   * Engagements de service, jamais de résultats commerciaux : les valeurs
   * autorisées sont exclusivement celles déjà publiées dans `global.json`.
   */
  chiffres: z.object({
    surtitre: z.string().min(3),
    titre: z.string().min(10),
    intro: z.string().min(30),
    items: z.array(z.object({ valeur: z.string().min(1), label: z.string().min(10) })).length(4),
  }),
  zone: z.object({
    surtitre: z.string().min(3),
    titre: z.string().min(5),
    paragraphes: z.array(minMots(30, "zone.paragraphes[]")).min(2),
    communes: z.array(z.string().min(3)).min(6),
    lien: z.object({ href: z.string().startsWith("/"), label: z.string().min(5) }),
  }),
  /**
   * FAQ VISIBLE. Le balisage `FAQPage` de cette page en découle directement :
   * baliser des questions que le visiteur ne voit pas relève des spam policies
   * de Google et expose à une action manuelle sur tout le domaine.
   */
  faqEntete: z.object({ surtitre: z.string().min(3), titre: z.string().min(10) }),
  faq: FaqSchema,
  maillage: MaillageSchema,
  cta: CtaSchema,
});

/* -------------------------------------------------------------------------- */
/*  /methode                                                                  */
/* -------------------------------------------------------------------------- */

export const MethodeSchema = z.object({
  meta: MetaSchema,
  hero: HeroSchema,
  principe: z.object({
    surtitre: z.string().min(3),
    titre: z.string().min(10),
    paragraphes: z.array(minMots(40, "principe.paragraphes[]")).min(3),
  }),
  etapes: z.object({
    surtitre: z.string().min(3),
    titre: z.string().min(10),
    intro: z.string().min(30),
    /** Exactement quatre : la méthode est annoncée en quatre étapes partout ailleurs. */
    items: z
      .array(
        z.object({
          titre: z.string().min(5),
          duree: z.string().min(3),
          resume: minMots(20, "etapes.items[].resume"),
          image: z.string().startsWith("/"),
          details: z.array(minMots(25, "etapes.items[].details[]")).min(3),
          livrables: z.array(z.string().min(10)).min(3),
          vous: z.string().min(20),
        }),
      )
      .length(4),
  }),
  delais: z.object({
    surtitre: z.string().min(3),
    titre: z.string().min(10),
    intro: z.string().min(30),
    lignes: z
      .array(
        z.object({
          projet: z.string().min(5),
          duree: z.string().min(3),
          precision: z.string().min(20),
        }),
      )
      .min(3),
  }),
  attentes: z.object({
    surtitre: z.string().min(3),
    titre: z.string().min(10),
    intro: z.string().min(30),
    points: z.array(PointSchema).min(5),
  }),
  faqEntete: z.object({ surtitre: z.string().min(3), titre: z.string().min(10) }),
  faq: FaqSchema,
  maillage: MaillageSchema,
  cta: CtaSchema,
});

/* -------------------------------------------------------------------------- */
/*  /tarifs                                                                   */
/* -------------------------------------------------------------------------- */

export const TarifsSchema = z.object({
  meta: MetaSchema,
  note: z.string().min(60),
  hero: HeroSchema,
  principe: z.object({
    surtitre: z.string().min(3),
    titre: z.string().min(10),
    paragraphes: z.array(minMots(40, "principe.paragraphes[]")).min(3),
  }),
  formules: z.object({
    surtitre: z.string().min(3),
    titre: z.string().min(10),
    intro: z.string().min(30),
    items: z
      .array(
        z.object({
          nom: z.string().min(3),
          /** Prix plancher réel, en euros HTVA. Doit rester aligné sur global.json. */
          from: z.number().int().positive(),
          devise: z.literal("EUR"),
          pour: z.string().min(20),
          pitch: minMots(12, "formules.items[].pitch"),
          inclus: z.array(z.string().min(10)).min(5),
          delai: z.string().min(5),
          highlight: z.boolean(),
        }),
      )
      .length(3),
  }),
  /**
   * La colonne « non compris » est aussi obligatoire que la colonne « compris ».
   * C'est elle qui lève l'objection du devis qui gonfle.
   */
  perimetre: z.object({
    surtitre: z.string().min(3),
    titre: z.string().min(10),
    intro: z.string().min(30),
    inclus: z.object({ titre: z.string().min(5), items: z.array(z.string().min(15)).min(6) }),
    exclus: z.object({ titre: z.string().min(5), items: z.array(z.string().min(15)).min(6) }),
  }),
  options: z.object({
    surtitre: z.string().min(3),
    titre: z.string().min(10),
    intro: z.string().min(30),
    /**
     * Pas de prix sur les options, volontairement : nous n'avons pas de grille
     * publique fiable pour elles. Mieux vaut renvoyer au devis qu'afficher un
     * montant approximatif que le client considérerait comme un engagement.
     */
    items: z.array(z.object({ nom: z.string().min(5), texte: minMots(20, "options.items[].texte") })).min(5),
  }),
  faqEntete: z.object({ surtitre: z.string().min(3), titre: z.string().min(10) }),
  faq: FaqSchema,
  maillage: MaillageSchema,
  cta: CtaSchema,
});

/* -------------------------------------------------------------------------- */
/*  Chargement validé                                                         */
/* -------------------------------------------------------------------------- */

/** Toute erreur casse le rendu de la page : un contenu incomplet ne part pas en ligne. */
function valider<T>(schema: z.ZodType<T>, donnees: unknown, fichier: string): T {
  const resultat = schema.safeParse(donnees);
  if (!resultat.success) {
    const details = resultat.error.issues
      .map((i) => `  · ${i.path.join(".") || "(racine)"} — ${i.message}`)
      .join("\n");
    throw new Error(`[contenu] ${fichier} invalide :\n${details}`);
  }
  return resultat.data;
}

export type AProps = z.infer<typeof AProposSchema>;
export type Methode = z.infer<typeof MethodeSchema>;
export type Tarifs = z.infer<typeof TarifsSchema>;

export const getAPropos = (): AProps => valider(AProposSchema, aProposJson, "a-propos.json");
export const getMethode = (): Methode => valider(MethodeSchema, methodeJson, "methode.json");
export const getTarifs = (): Tarifs => valider(TarifsSchema, tarifsJson, "tarifs.json");
