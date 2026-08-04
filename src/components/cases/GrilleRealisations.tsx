import Image from "next/image";
import Link from "next/link";
import { Fleche } from "@/components/ui/section";

export type CarteRealisation = {
  slug: string;
  client: string;
  city: string;
  sectorLabel: string;
  summary: string;
  result: string;
  image?: string;
  imageAlt?: string;
  draft: boolean;
};

/**
 * Grille des réalisations — volontairement sans filtre.
 *
 * Avec une poignée d'études, un filtre par secteur et par service ajoute deux
 * rangées de contrôles pour masquer une carte sur trois : il occupe plus de
 * place qu'il n'en fait gagner. Il redeviendra utile au-delà d'une quinzaine
 * d'études, pas avant.
 *
 * Alternance de tailles : la première carte de chaque paire occupe deux tiers,
 * ce qui donne du rythme sans casser l'alignement de la grille.
 */
export function GrilleRealisations({ cartes }: { cartes: CarteRealisation[] }) {
  if (!cartes.length) {
    return (
      <p className="max-w-prose text-sm leading-relaxed text-beew-noir/55">
        Aucune étude publiée pour le moment. Nous ne mettons en ligne une réalisation qu&apos;une
        fois le résultat mesuré et validé par le client.
      </p>
    );
  }

  return (
    <div className="grid gap-x-8 gap-y-16 lg:grid-cols-2">
      {cartes.map((c, i) => (
        <Carte key={c.slug} carte={c} retard={(i % 2) * 110} />
      ))}
    </div>
  );
}

function Carte({ carte, retard }: { carte: CarteRealisation; retard: number }) {
  return (
    <article data-reveal data-reveal-delay={retard} className="group">
      <Link
        href={`/realisations/${carte.slug}`}
        // Un brouillon ne doit transmettre aucun signal : le lien reste
        // cliquable pour la relecture interne mais n'est pas suivi.
        {...(carte.draft ? { rel: "nofollow" } : {})}
        className="block"
      >
        {carte.image && (
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-beew-noir/5">
            <Image
              src={carte.image}
              alt={carte.imageAlt ?? ""}
              fill
              sizes="(min-width:1024px) 50vw, 100vw"
              className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
            />
            {carte.draft && (
              <span className="absolute top-4 left-4 rounded-full bg-beew-noir/80 px-3 py-1 text-[10px] tracking-[0.2em] text-beew-creme uppercase">
                Brouillon
              </span>
            )}
          </div>
        )}

        <div className="mt-6 flex items-start justify-between gap-6">
          <div>
            <p className="text-[10px] tracking-[0.25em] text-beew-noir/40 uppercase">
              {carte.city} · {carte.sectorLabel}
            </p>
            <h3 className="mt-3 text-[clamp(1.25rem,2.2vw,1.75rem)] font-semibold tracking-tight">
              {carte.client}
            </h3>
          </div>
          <span className="mt-1 text-beew-noir/40 transition-colors group-hover:text-beew-noir">
            <Fleche />
          </span>
        </div>

        <p className="mt-4 max-w-prose text-sm leading-relaxed text-beew-noir/60">{carte.summary}</p>

        {/* Le résultat chiffré est ce qui vend : détaché et accentué. */}
        <p className="mt-5 border-l-2 border-beew-orange pl-5 text-sm leading-relaxed font-semibold">
          {carte.result}
        </p>
      </Link>
    </article>
  );
}
