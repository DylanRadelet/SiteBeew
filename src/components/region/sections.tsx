import Image from "next/image";
import { DEUX_COLONNES, EnTete, Fleche, Section, Surtitre } from "@/components/ui/section";
import Link from "next/link";
import type { ZoneFact, ZoneSector } from "@/content/schemas/region";

/**
 * Sections propres aux étages hauts de la pyramide locale (région, province).
 *
 * Elles reçoivent toutes leurs données en props, comme les composants de
 * `components/home/` : une section ne lit jamais un JSON elle-même.
 * Toute la mise en page passe par les primitives de `@/components/ui/section`.
 *
 * Ni hero ni fil d'Ariane ici : les trois pages de zone passent par `PageHero`,
 * qui porte le `<h1>` unique et le fil, comme toutes les pages hors home.
 */

/* -------------------------------------------------------------------------- */
/*  Repères factuels                                                          */
/* -------------------------------------------------------------------------- */

/** Uniquement des données géographiques et administratives vérifiables. */
export function ZoneFaits({ facts }: { facts: ZoneFact[] }) {
  return (
    <Section className="!py-16 sm:!py-20">
      {/* Filet qui se colore et se creuse au survol : même vocabulaire que les
          cartes de la home, la page était figée en comparaison. */}
      <dl className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {facts.map((f, i) => (
          <div
            key={f.label}
            data-reveal
            data-reveal-delay={i * 70}
            className="group border-t border-beew-noir/20 pt-6 transition-colors duration-500 hover:border-beew-vert"
          >
            <dt className="text-[10px] tracking-[0.25em] text-beew-noir/45 uppercase transition-colors duration-500 group-hover:text-beew-vert">
              {f.label}
            </dt>
            <dd className="mt-4 text-lg leading-snug font-semibold tracking-tight transition-transform duration-500 group-hover:translate-x-1">
              {f.value}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Tissu économique — le cœur du contenu unique de la zone                    */
/* -------------------------------------------------------------------------- */

export function ZoneEconomie({
  surtitre,
  heading,
  body,
  highlights,
}: {
  surtitre: string;
  heading: string;
  body: string;
  highlights: string[];
}) {
  return (
    <Section ton="sombre">
      <EnTete ton="sombre" surtitre={surtitre} titre={heading} intro={body.split(/\n{2,}/)} />

      <ul className="mt-14 grid gap-px overflow-hidden rounded-2xl bg-beew-creme/15 sm:grid-cols-2 lg:grid-cols-3">
        {highlights.map((h, i) => (
          <li
            key={h}
            data-reveal
            data-reveal-delay={i * 70}
            className="bg-beew-noir p-6 text-sm leading-relaxed text-beew-creme/70"
          >
            {h}
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Secteurs dominants                                                        */
/* -------------------------------------------------------------------------- */

export function ZoneSecteurs({
  titre,
  intro,
  sectors,
}: {
  titre: string;
  intro?: string;
  sectors: ZoneSector[];
}) {
  return (
    <Section>
      <EnTete surtitre="Tissu économique" titre={titre} intro={intro} />

      {/* Tuiles séparées par un filet d'1px, qui s'inversent au survol — même
          traitement que les services de la home. */}
      <div className="mt-16 grid gap-px overflow-hidden rounded-2xl bg-beew-noir/12 sm:grid-cols-2 lg:grid-cols-3">
        {sectors.map((s, i) => (
          <article
            key={s.name}
            data-reveal
            data-reveal-delay={i * 70}
            className="group bg-beew-blanc p-7 transition-colors duration-500 hover:bg-beew-noir hover:text-beew-creme sm:p-9"
          >
            <span className="text-[11px] tracking-[0.25em] text-beew-vert">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-6 text-lg leading-snug font-semibold tracking-tight transition-transform duration-500 group-hover:translate-x-1">
              {s.name}
            </h3>
            <p className="mt-3 text-sm leading-relaxed opacity-60">{s.description}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Descente vers l'étage inférieur                                           */
/* -------------------------------------------------------------------------- */

export type LienZone = {
  /** `null` = la page n'existe pas encore : on affiche l'entrée sans lien. */
  href: string | null;
  label: string;
  note?: string;
  /**
   * Photo de la commune, révélée au survol. Les listes de villes étaient de
   * simples listes de texte alors que chaque page ville a désormais sa photo :
   * la reprendre ici donne à voir la destination avant le clic.
   */
  image?: { src: string; alt: string };
};

/**
 * Liste des zones filles. Une entrée sans `href` reste affichée en texte :
 * mieux vaut annoncer une couverture réelle qu'un lien mort ou qu'un lien vers
 * une page en brouillon, qui est en `noindex` et ne doit recevoir aucun lien.
 */
export function ZoneEnfants({
  surtitre,
  titre,
  intro,
  lien,
  items,
  vide,
  ton = "clair",
}: {
  surtitre: string;
  titre: string;
  intro?: string;
  lien?: { href: string; label: string };
  items: LienZone[];
  /** Message affiché quand aucune page fille n'est publiée. */
  vide?: string;
  ton?: "clair" | "sombre";
}) {
  const sombre = ton === "sombre";

  return (
    <Section ton={ton}>
      <EnTete ton={ton} surtitre={surtitre} titre={titre} intro={intro} lien={lien} />

      {items.length === 0 ? (
        vide && (
          <p
            className={`mt-14 max-w-prose text-sm leading-relaxed ${
              sombre ? "text-beew-creme/60" : "text-beew-noir/60"
            }`}
          >
            {vide}
          </p>
        )
      ) : (
        <ul
          className={`mt-16 grid gap-px overflow-hidden rounded-2xl sm:grid-cols-2 lg:grid-cols-3 ${
            sombre ? "bg-beew-creme/15" : "bg-beew-noir/10"
          }`}
        >
          {items.map((item, i) => (
            <li
              key={item.label}
              data-reveal
              data-reveal-delay={i * 70}
              className={sombre ? "bg-beew-noir" : "bg-beew-blanc"}
            >
              {item.href ? (
                <Link
                  href={item.href}
                  className={`group relative isolate flex h-full flex-col gap-3 overflow-hidden p-8 transition-colors duration-500 ${
                    item.image
                      ? "hover:text-beew-creme"
                      : sombre
                        ? "hover:bg-beew-blanc hover:text-beew-noir"
                        : "hover:bg-beew-noir hover:text-beew-creme"
                  }`}
                >
                  {item.image && (
                    <>
                      <Image
                        src={item.image.src}
                        alt=""
                        aria-hidden
                        fill
                        sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                        className="pointer-events-none -z-10 object-cover opacity-0 transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-100"
                      />
                      {/* Voile : le libellé doit rester lisible sur n'importe
                          quelle zone de la photo. */}
                      <span
                        aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 bg-beew-noir/70 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                      />
                    </>
                  )}
                  <span className="flex items-center justify-between gap-4 text-base font-semibold tracking-tight">
                    {item.label}
                    <Fleche />
                  </span>
                  {item.note && <span className="text-sm leading-relaxed opacity-60">{item.note}</span>}
                </Link>
              ) : (
                <div className="flex h-full flex-col gap-3 p-8">
                  <span className="text-base font-semibold tracking-tight opacity-55">
                    {item.label}
                  </span>
                  {item.note && <span className="text-sm leading-relaxed opacity-40">{item.note}</span>}
                  <span className="mt-auto pt-4 text-[10px] tracking-[0.25em] uppercase opacity-40">
                    Page à venir
                  </span>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Remontée vers le parent                                                   */
/* -------------------------------------------------------------------------- */

/** Bande basse qui referme la page en renvoyant à l'étage supérieur. */
export function ZoneRemontee({ href, label, texte }: { href: string; label: string; texte: string }) {
  return (
    <Section className="!py-14">
      <div className={DEUX_COLONNES}>
        <Surtitre>Voir plus large</Surtitre>
        <div className="flex flex-col items-start gap-5">
          <p className="max-w-prose text-sm leading-relaxed text-beew-noir/60">{texte}</p>
          <Link
            href={href}
            className="group inline-flex items-center gap-2 border-b border-beew-noir/25 pb-1 text-[11px] tracking-[0.2em] uppercase hover:border-beew-noir"
          >
            {label}
            <Fleche />
          </Link>
        </div>
      </div>
    </Section>
  );
}
