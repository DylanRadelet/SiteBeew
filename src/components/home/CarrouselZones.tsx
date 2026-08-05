import Image from "next/image";
import Link from "next/link";
import { EnTete, Fleche, GUTTER, Section } from "@/components/ui/section";

/**
 * Bande défilante des zones couvertes, sur l'accueil.
 *
 * Elle remplace une grille de vingt cartes qui occupait presque un écran entier
 * pour un bloc dont le rôle est seulement d'orienter. Ici : une seule rangée,
 * hauteur fixe, qui défile horizontalement.
 *
 * Défilement NATIF (`overflow-x`, `scroll-snap`) plutôt qu'un carrousel en
 * JavaScript. Trois conséquences qui comptent :
 *
 *  · aucun script, donc rien à charger ni à hydrater ;
 *  · les quinze liens restent dans le HTML statique — un carrousel qui monte
 *    ses diapositives en JS ferait disparaître ce maillage du crawl ;
 *  · le geste tactile, la molette horizontale et la tabulation clavier
 *    fonctionnent d'eux-mêmes, sans code d'accessibilité à écrire.
 */

export type ZoneCarte = {
  href: string;
  nom: string;
  note?: string;
  image?: { src: string; alt: string };
};

export function CarrouselZones({
  provinces,
  villes,
}: {
  provinces: ZoneCarte[];
  villes: ZoneCarte[];
}) {
  return (
    <Section className="!pb-20">
      <EnTete
        surtitre="Où nous intervenons"
        titre="Quinze communes, cinq provinces"
        intro="Chaque page décrit le marché réel de sa zone : concurrence locale, filières dominantes, et ce que vos clients tapent vraiment."
        lien={{ href: "/zones-d-intervention", label: "Toutes nos zones" }}
      />

      {/* Les provinces d'abord, en texte : c'est l'étage qui structure. */}
      <ul className="mt-12 flex flex-wrap gap-x-6 gap-y-3">
        {provinces.map((p) => (
          <li key={p.href}>
            <Link
              href={p.href}
              className="group inline-flex items-center gap-2 text-sm text-beew-noir/55 transition-colors hover:text-beew-noir"
            >
              <span className="h-px w-4 bg-beew-vert transition-all duration-500 group-hover:w-7" />
              {p.nom}
            </Link>
          </li>
        ))}
      </ul>

      {/*
        La bande déborde volontairement de la gouttière jusqu'au bord de
        l'écran : une rangée qui s'arrête net à la marge donne l'impression
        d'être coupée, alors qu'un débord dit qu'elle continue.
        `-mx` annule la gouttière, `px` la restitue en marge intérieure.
      */}
      <div
        className={`mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-6 sm:-mx-10 lg:-mx-14 ${GUTTER}`}
      >
        {villes.map((v, i) => (
          <Link
            key={v.href}
            href={v.href}
            data-reveal
            data-reveal-delay={Math.min(i, 6) * 60}
            className="group relative isolate flex h-56 w-52 shrink-0 snap-start flex-col justify-end overflow-hidden rounded-xl bg-beew-noir p-5 text-beew-creme sm:w-56"
          >
            {v.image && (
              <Image
                src={v.image.src}
                alt=""
                aria-hidden
                fill
                sizes="224px"
                className="-z-10 object-cover opacity-45 transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-70"
              />
            )}
            {/* Dégradé permanent : le nom doit rester lisible sur n'importe
                quelle photo, y compris les plus claires. */}
            <span
              aria-hidden
              className="absolute inset-0 -z-10 bg-gradient-to-t from-beew-noir via-beew-noir/45 to-transparent"
            />

            <span className="text-base font-semibold tracking-tight transition-transform duration-500 group-hover:translate-x-1">
              {v.nom}
            </span>
            {v.note && (
              <span className="mt-1 text-[10px] tracking-[0.18em] text-beew-creme/55 uppercase">
                {v.note}
              </span>
            )}
            <span className="mt-3 inline-flex items-center gap-2 text-[10px] tracking-[0.2em] text-beew-creme/70 uppercase">
              Voir la page
              <Fleche />
            </span>
          </Link>
        ))}
      </div>

      <p className="mt-2 text-[11px] tracking-[0.15em] text-beew-noir/35 uppercase">
        Faites défiler →
      </p>
    </Section>
  );
}
