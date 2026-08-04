import Link from "next/link";
import { doux } from "@/components/confiance/blocs";
import { Bouton, DEUX_COLONNES, EnTete, Section } from "@/components/ui/section";
import type { Tarifs } from "@/content/schemas/confiance";

/** Sections propres à /tarifs. Aucun texte ici : tout vient de tarifs.json. */

/* -------------------------------------------------------------------------- */
/*  Les trois formules                                                        */
/* -------------------------------------------------------------------------- */

export function Formules({
  formules,
  note,
  cta,
}: {
  formules: Tarifs["formules"];
  note: string;
  cta: { href: string; label: string };
}) {
  return (
    <Section>
      <EnTete surtitre={formules.surtitre} titre={formules.titre} intro={formules.intro} />

      <div className="mt-16 grid gap-6 lg:grid-cols-3">
        {formules.items.map((t, i) => (
          <article
            key={t.nom}
            data-reveal
            data-reveal-delay={i * 70}
            className={`flex flex-col rounded-2xl p-8 sm:p-10 ${
              t.highlight ? "bg-beew-noir text-beew-creme" : "border border-beew-noir/15"
            }`}
          >
            <h3 className="text-[11px] tracking-[0.25em] uppercase opacity-60">{t.nom}</h3>

            <p className="mt-6 text-[clamp(2.25rem,3.6vw,3rem)] leading-none font-semibold tracking-tight">
              <span className="align-super text-xs font-normal opacity-50">dès </span>
              {/* Format belge : espace insécable fine avant l'euro. */}
              {t.from.toLocaleString("fr-BE")} €
              <span className="ml-2 align-super text-xs font-normal opacity-50">HTVA</span>
            </p>

            <p className="mt-6 text-sm leading-relaxed opacity-65">{t.pitch}</p>

            <p className="mt-5 text-[11px] tracking-[0.15em] uppercase opacity-45">{t.pour}</p>

            <ul className="mt-8 space-y-3 text-sm">
              {t.inclus.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden className="mt-2.5 h-px w-3.5 shrink-0 bg-beew-orange" />
                  <span className="opacity-80">{item}</span>
                </li>
              ))}
            </ul>

            {/* `mt-auto` colle le bloc de fin en bas : les trois cartes gardent
                leur bouton aligné malgré des listes de longueurs différentes. */}
            <div className="mt-auto pt-10">
              <p className="text-[10px] tracking-[0.25em] uppercase opacity-45">Délai : {t.delai}</p>
              <div className="mt-6">
                <Bouton href={cta.href} ton={t.highlight ? "sombre" : "clair"}>
                  {cta.label}
                </Bouton>
              </div>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-10 max-w-prose text-xs leading-relaxed text-beew-noir/45">
        {note}{" "}
        {/* La page tarifs est l'endroit le plus naturel pour atteindre le
            formulaire de devis — il n'était atteignable que depuis le menu. */}
        <Link href="/devis" className="text-beew-noir underline underline-offset-4">
          Demander un devis chiffré
        </Link>
        .
      </p>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Périmètre — compris / non compris, côte à côte                            */
/* -------------------------------------------------------------------------- */

export function Perimetre({ perimetre }: { perimetre: Tarifs["perimetre"] }) {
  const colonnes = [
    { ...perimetre.inclus, marque: "bg-beew-orange" },
    // La colonne des exclusions est volontairement aussi visible que l'autre.
    { ...perimetre.exclus, marque: "bg-beew-creme/40" },
  ];

  return (
    <Section ton="sombre">
      <EnTete ton="sombre" surtitre={perimetre.surtitre} titre={perimetre.titre} intro={perimetre.intro} />

      <div className={`mt-16 ${DEUX_COLONNES}`}>
        {colonnes.map((c, i) => (
          <div key={c.titre} data-reveal data-reveal-delay={i * 70} className="border-t border-beew-creme/25 pt-7">
            <h3 className="text-[clamp(1.15rem,2.2vw,1.6rem)] font-semibold tracking-tight">{c.titre}</h3>
            <ul className="mt-8 space-y-4 text-sm">
              {c.items.map((item) => (
                <li key={item} className="flex gap-4">
                  <span aria-hidden className={`mt-2.5 h-px w-4 shrink-0 ${c.marque}`} />
                  <span className={`leading-relaxed ${doux("sombre")}`}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Options                                                                   */
/* -------------------------------------------------------------------------- */

export function Options({ options }: { options: Tarifs["options"] }) {
  return (
    <Section>
      <EnTete surtitre={options.surtitre} titre={options.titre} intro={options.intro} />

      <ul className="mt-16 grid gap-px overflow-hidden rounded-2xl bg-beew-noir/10 sm:grid-cols-2 lg:grid-cols-3">
        {options.items.map((o, i) => (
          <li key={o.nom} data-reveal data-reveal-delay={i * 70} className="bg-beew-blanc p-8">
            <h3 className="text-base font-semibold tracking-tight">{o.nom}</h3>
            <p className="mt-3 text-sm leading-relaxed text-beew-noir/60">{o.texte}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
