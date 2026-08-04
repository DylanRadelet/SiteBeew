import { Bouton, DEUX_COLONNES, EnTete, Fleche, Section, Surtitre } from "@/components/ui/section";
import Link from "next/link";
import type { AProps } from "@/content/schemas/confiance";

/**
 * Briques partagées par les trois pages de confiance (/a-propos, /methode,
 * /tarifs). Elles ne connaissent aucun texte : tout arrive en props depuis
 * `src/content/pages/*.json`, validé par `src/content/schemas/confiance.ts`.
 *
 * Toute la mise en page passe par les primitives de `@/components/ui/section` —
 * même gouttière, même rythme vertical et même gabarit à deux colonnes que la
 * home, pour que ces pages ne ressemblent pas à un site voisin.
 */

type Ton = "clair" | "sombre";

/** Opacités du texte secondaire selon le fond. Centralisé pour éviter les dérives. */
export const doux = (ton: Ton) => (ton === "sombre" ? "text-beew-creme/60" : "text-beew-noir/60");
const filet = (ton: Ton) => (ton === "sombre" ? "border-beew-creme/20" : "border-beew-noir/15");

/* -------------------------------------------------------------------------- */
/*  Bloc de prose — titre à gauche, texte long à droite                       */
/* -------------------------------------------------------------------------- */

export function BlocProse({
  surtitre,
  titre,
  intro,
  paragraphes,
  ton = "clair",
}: {
  surtitre: string;
  titre: string;
  intro?: string;
  paragraphes: string[];
  ton?: Ton;
}) {
  // Bloc titre unique : la prose passe par `intro`, qui accepte un tableau.
  return (
    <Section ton={ton}>
      <EnTete
        ton={ton}
        surtitre={surtitre}
        titre={titre}
        intro={intro ? [intro, ...paragraphes] : paragraphes}
      />
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Grille de points — convictions, attentes client                           */
/* -------------------------------------------------------------------------- */

export function GrillePoints({
  surtitre,
  titre,
  intro,
  points,
  ton = "clair",
}: {
  surtitre: string;
  titre: string;
  intro: string;
  points: { titre: string; texte: string }[];
  ton?: Ton;
}) {
  return (
    <Section ton={ton}>
      <EnTete ton={ton} surtitre={surtitre} titre={titre} intro={intro} />

      <div className="mt-16 grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {points.map((p, i) => (
          <div key={p.titre} data-reveal data-reveal-delay={i * 70} className="border-t-2 border-beew-orange pt-6">
            <h3 className="text-lg font-semibold tracking-tight">{p.titre}</h3>
            <p className={`mt-3 text-sm leading-relaxed ${doux(ton)}`}>{p.texte}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  FAQ — le balisage FAQPage correspondant est émis à part en JSON-LD        */
/* -------------------------------------------------------------------------- */

export function FaqConfiance({
  surtitre,
  titre,
  faq,
  ton = "clair",
}: {
  surtitre: string;
  titre: string;
  faq: { question: string; reponse: string }[];
  ton?: Ton;
}) {
  return (
    <Section ton={ton}>
      <EnTete ton={ton} surtitre={surtitre} titre={titre} />

      <dl className={`mt-16 border-t ${filet(ton)}`}>
        {faq.map((f, i) => (
          <div
            key={f.question}
            data-reveal
            data-reveal-delay={i * 70}
            className={`${DEUX_COLONNES} border-b py-8 ${filet(ton)}`}
          >
            <dt className="text-[clamp(1.05rem,1.8vw,1.4rem)] font-semibold tracking-tight">{f.question}</dt>
            <dd className={`max-w-prose text-sm leading-relaxed ${doux(ton)}`}>{f.reponse}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Maillage interne                                                          */
/* -------------------------------------------------------------------------- */

export function Maillage({ maillage, ton = "clair" }: { maillage: AProps["maillage"]; ton?: Ton }) {
  return (
    <Section ton={ton}>
      <EnTete ton={ton} surtitre={maillage.surtitre} titre={maillage.titre} intro={maillage.intro} />

      {/* `gap-px` sur fond contrasté : un seul filet partagé entre les cellules
          au lieu de bordures qui se doublent aux jonctions. */}
      <ul
        className={`mt-16 grid gap-px overflow-hidden rounded-2xl sm:grid-cols-2 lg:grid-cols-4 ${
          ton === "sombre" ? "bg-beew-creme/15" : "bg-beew-noir/10"
        }`}
      >
        {maillage.liens.map((l, i) => (
          <li key={l.href} data-reveal data-reveal-delay={i * 70}>
            <Link
              href={l.href}
              className={`group flex h-full flex-col gap-3 p-7 transition-colors duration-500 ${
                ton === "sombre"
                  ? "bg-beew-noir hover:bg-beew-blanc hover:text-beew-noir"
                  : "bg-beew-blanc hover:bg-beew-noir hover:text-beew-creme"
              }`}
            >
              <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-tight">
                {l.label}
                <Fleche />
              </span>
              <span className="text-sm leading-relaxed opacity-60">{l.texte}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Conclusion                                                                */
/* -------------------------------------------------------------------------- */

export function CtaConfiance({ cta }: { cta: AProps["cta"] }) {
  return (
    <Section ton="sombre" className="text-center">
      <Surtitre ton="sombre">{cta.surtitre}</Surtitre>
      <h2 className="mx-auto mt-8 max-w-3xl text-[clamp(1.9rem,4.6vw,3.75rem)] leading-[0.98] font-semibold tracking-tight uppercase">
        {cta.titre}
      </h2>
      <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-beew-creme/60">{cta.texte}</p>
      <div className="mt-12">
        <Bouton href={cta.bouton.href} ton="sombre" taille="grand">
          {cta.bouton.label}
        </Bouton>
      </div>
    </Section>
  );
}
