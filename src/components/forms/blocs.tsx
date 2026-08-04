import { EnTete, Fleche, Section } from "@/components/ui/section";
import Link from "next/link";
import { FormulaireConversion } from "@/components/forms/FormulaireConversion";
import type { BlocListe, ConversionPage, Coordonnees, Liens } from "@/content/schemas/conversion";

/**
 * Blocs des pages de conversion (/contact, /devis).
 *
 * Ils ne portent aucun texte : tout arrive en props depuis le JSON validé,
 * comme les composants de `components/home`. Toute la mise en page passe par les
 * primitives de `@/components/ui/section` — même gouttière, même rythme, même
 * gabarit de colonnes que la home.
 *
 * Le hero n'est plus ici : les deux pages passent par `PageHero`, comme toutes
 * les pages hors home. C'est lui, et lui seul, qui porte le `<h1>`.
 */

type Ton = "clair" | "sombre";

/* -------------------------------------------------------------------------- */
/*  Formulaire — titre à gauche, champs à droite, sur la colonne de référence   */
/* -------------------------------------------------------------------------- */

export function SectionFormulaire({
  formulaire,
  ton = "clair",
  id,
}: {
  formulaire: ConversionPage["formulaire"];
  ton?: Ton;
  id?: string;
}) {
  return (
    <Section ton={ton} id={id}>
      {/* Le formulaire occupe la colonne de droite via `droite` : c'est ce que
          le bloc titre prévoit pour tout contenu qui accompagne le titre. */}
      <EnTete
        ton={ton}
        surtitre={formulaire.surtitre}
        titre={formulaire.titre}
        gauche={
          <p
            className={`mt-8 max-w-prose text-base leading-relaxed ${
              ton === "sombre" ? "text-beew-creme/60" : "text-beew-noir/60"
            }`}
          >
            {formulaire.intro}
          </p>
        }
        droite={<FormulaireConversion formulaire={formulaire} ton={ton} />}
      />
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Liste numérotée — « ce qui se passe ensuite », rappels                      */
/* -------------------------------------------------------------------------- */

export function BlocEtapes({ bloc, ton = "clair" }: { bloc: BlocListe; ton?: Ton }) {
  const sombre = ton === "sombre";

  return (
    <Section ton={ton}>
      <EnTete ton={ton} surtitre={bloc.surtitre} titre={bloc.titre} intro={bloc.intro} />

      <ol className="mt-16 grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {bloc.items.map((item, i) => (
          <li
            key={item.titre}
            data-reveal
            data-reveal-delay={i * 70}
            className="border-t-2 border-beew-orange pt-6"
          >
            <span className={`text-[11px] tracking-[0.25em] ${sombre ? "text-beew-creme/40" : "text-beew-noir/40"}`}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-6 text-lg font-semibold tracking-tight">{item.titre}</h3>
            <p
              className={`mt-3 text-sm leading-relaxed ${
                sombre ? "text-beew-creme/60" : "text-beew-noir/60"
              }`}
            >
              {item.description}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Coordonnées                                                                */
/* -------------------------------------------------------------------------- */

export function BlocCoordonnees({ bloc, ton = "sombre" }: { bloc: Coordonnees; ton?: Ton }) {
  const sombre = ton === "sombre";

  return (
    <Section ton={ton}>
      <EnTete ton={ton} surtitre={bloc.surtitre} titre={bloc.titre} />

      {/* Filets d'un pixel dessinés par `gap-px` sur fond contrasté, comme le
          bandeau de confiance de la home : un seul trait partagé entre cellules. */}
      <dl
        className={`mt-14 grid gap-px overflow-hidden rounded-2xl sm:grid-cols-3 ${
          sombre ? "bg-beew-creme/15" : "bg-beew-noir/10"
        }`}
      >
        {bloc.items.map((item, i) => (
          <div
            key={item.label}
            data-reveal
            data-reveal-delay={i * 70}
            className={`p-8 ${sombre ? "bg-beew-noir" : "bg-beew-blanc"}`}
          >
            <dt className={`text-[10px] tracking-[0.25em] uppercase ${sombre ? "text-beew-creme/40" : "text-beew-noir/40"}`}>
              {item.label}
            </dt>
            <dd className="mt-4 text-base leading-relaxed">
              {item.href ? (
                <a
                  href={item.href}
                  className={`inline-flex min-h-[44px] items-center border-b transition-colors ${
                    sombre
                      ? "border-beew-creme/30 hover:border-beew-creme"
                      : "border-beew-noir/25 hover:border-beew-noir"
                  }`}
                >
                  {item.valeur}
                </a>
              ) : (
                <span className={sombre ? "text-beew-creme/70" : "text-beew-noir/70"}>{item.valeur}</span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Maillage interne                                                           */
/* -------------------------------------------------------------------------- */

export function BlocLiens({ bloc, ton = "clair" }: { bloc: Liens; ton?: Ton }) {
  const sombre = ton === "sombre";

  return (
    <Section ton={ton}>
      <EnTete ton={ton} surtitre={bloc.surtitre} titre={bloc.titre} />

      <ul className={`mt-14 grid gap-px overflow-hidden rounded-2xl sm:grid-cols-2 ${sombre ? "bg-beew-creme/15" : "bg-beew-noir/10"}`}>
        {bloc.items.map((item, i) => (
          <li key={item.href} data-reveal data-reveal-delay={i * 70}>
            <Link
              href={item.href}
              className={`group flex h-full flex-col gap-4 p-8 transition-colors duration-500 sm:p-10 ${
                sombre
                  ? "bg-beew-noir hover:bg-beew-blanc hover:text-beew-noir"
                  : "bg-beew-blanc hover:bg-beew-noir hover:text-beew-creme"
              }`}
            >
              <span className="inline-flex items-center gap-2 text-[clamp(1.15rem,2vw,1.6rem)] font-semibold tracking-tight">
                {item.label}
                <Fleche />
              </span>
              <span className="text-sm leading-relaxed opacity-60">{item.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
