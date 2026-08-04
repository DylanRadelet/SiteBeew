import Image from "next/image";
import Link from "next/link";
import { Bouton, EnTete, Fleche, GUTTER } from "@/components/ui/section";

/**
 * LE hero de toutes les pages hors home.
 *
 * Il remplace les sept implémentations qui existaient auparavant — une par
 * agent, chacune avec son propre `<h1>`, ses propres marges et son propre
 * rythme. C'est ce qui rendait les alignements incohérents d'une page à l'autre.
 *
 * Structure figée : fil d'Ariane, surtitre, titre, accroche, badges, bouton, et
 * un visuel à droite. Seul le contenu change. Toute page qui a besoin d'autre
 * chose doit l'ajouter APRÈS le hero, pas en fabriquer un autre.
 */

export type Miette = { href: string; label: string };

export function PageHero({
  fil,
  surtitre,
  h1,
  intro,
  badges,
  cta = { href: "/contact", label: "Réserver un appel" },
  image,
}: {
  fil: Miette[];
  surtitre: string;
  h1: string;
  intro: string;
  badges?: string[];
  cta?: { href: string; label: string } | null;
  /** Visuel de droite. Sans lui le hero paraît vide — c'est le défaut corrigé ici. */
  image?: { src: string; alt?: string };
}) {
  return (
    // `pt-32` dégage le header fixe : sans cette réserve, le fil d'Ariane passe
    // dessous. La valeur suit la hauteur réelle du header (78px) plus l'air.
    <section className={`${GUTTER} pt-32 pb-16 sm:pt-40 sm:pb-20 lg:pb-24`}>
      <nav aria-label="Fil d'Ariane" data-reveal>
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] tracking-[0.15em] text-beew-noir/40 uppercase">
          {fil.map((m, i) => (
            <li key={m.href} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden>/</span>}
              {i === fil.length - 1 ? (
                <span aria-current="page" className="text-beew-noir/70">
                  {m.label}
                </span>
              ) : (
                <Link href={m.href} className="transition-colors hover:text-beew-noir">
                  {m.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/*
        Même bloc titre que toutes les sections du site — `EnTete`, en niveau 1.
        Il n'existe plus de version maison ici : c'est ce qui garantit que le
        `<h1>` et l'accroche démarrent à la même hauteur, comme partout ailleurs.
      */}
      <div data-reveal className="mt-10">
        <EnTete
          niveau={1}
          surtitre={surtitre}
          titre={h1}
          intro={intro}
          gauche={
            // Le bouton reste à gauche, sous le titre : accolé aux badges dans
            // la colonne de droite, l'ensemble faisait un empilement disgracieux.
            cta ? (
              <div className="mt-10">
                <Bouton href={cta.href}>{cta.label}</Bouton>
              </div>
            ) : undefined
          }
          droite={
            badges && badges.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {badges.map((b) => (
                  <li
                    key={b}
                    className="rounded-full border border-beew-noir/20 px-4 py-1.5 text-[11px] tracking-[0.15em] uppercase"
                  >
                    {b}
                  </li>
                ))}
              </ul>
            ) : undefined
          }
        />
      </div>

      {image && (
        <div
          data-reveal
          data-reveal-delay={200}
          className="relative mt-14 aspect-[21/9] overflow-hidden rounded-2xl bg-beew-noir/5 sm:mt-16"
        >
          <Image
            src={image.src}
            alt={image.alt ?? ""}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Voile léger : le visuel doit rester un fond, pas capter l'attention. */}
          <div aria-hidden className="absolute inset-0 bg-beew-noir/15" />
        </div>
      )}
    </section>
  );
}

/** Lien de remontée, à placer en fin de page pour boucler le maillage. */
export function Remontee({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 border-b border-beew-noir/25 pb-1 text-[11px] tracking-[0.2em] uppercase transition-colors hover:border-beew-noir"
    >
      {label}
      <Fleche />
    </Link>
  );
}
