import Image from "next/image";
import { doux } from "@/components/confiance/blocs";
import { DEUX_COLONNES, EnTete, Section } from "@/components/ui/section";
import type { Methode } from "@/content/schemas/confiance";

/** Sections propres à /methode. Aucun texte ici : tout vient de methode.json. */

/* -------------------------------------------------------------------------- */
/*  Les quatre étapes, en détail                                              */
/* -------------------------------------------------------------------------- */

export function EtapesDetail({ etapes }: { etapes: Methode["etapes"] }) {
  return (
    <Section>
      <EnTete surtitre={etapes.surtitre} titre={etapes.titre} intro={etapes.intro} />

      <ol className="mt-16 border-t border-beew-noir/15">
        {etapes.items.map((e, i) => (
          <li
            key={e.titre}
            // Ancre reprise par les `HowToStep` du JSON-LD.
            id={`etape-${i + 1}`}
            data-reveal
            data-reveal-delay={i * 70}
            className={`${DEUX_COLONNES} border-b border-beew-noir/15 py-14`}
          >
            {/* Colonne de gauche : le repère — numéro, titre, durée, visuel. */}
            <div>
              <div className="flex items-baseline gap-6">
                <span className="text-sm font-semibold text-beew-orange tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-[clamp(1.15rem,2.2vw,1.75rem)] font-semibold tracking-tight">{e.titre}</h3>
                  <p className="mt-1.5 text-[11px] tracking-[0.2em] text-beew-noir/40 uppercase">{e.duree}</p>
                </div>
              </div>

              <div className="relative mt-8 aspect-[16/10] overflow-hidden rounded-2xl bg-beew-noir/5">
                <Image
                  src={e.image}
                  alt=""
                  fill
                  sizes="(min-width:1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Colonne de droite : le détail, les livrables, la part du client. */}
            <div className="lg:pt-2">
              <p className="max-w-prose text-base leading-relaxed text-beew-noir/70">{e.resume}</p>

              <div className="mt-6 space-y-4 text-sm leading-relaxed text-beew-noir/60">
                {e.details.map((d, j) => (
                  <p key={j}>{d}</p>
                ))}
              </div>

              <div className="mt-10 grid gap-8 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] tracking-[0.25em] text-beew-noir/40 uppercase">Ce que vous recevez</p>
                  <ul className="mt-4 space-y-2.5 text-sm">
                    {e.livrables.map((l) => (
                      <li key={l} className="flex gap-3">
                        <span aria-hidden className="mt-2.5 h-px w-3.5 shrink-0 bg-beew-orange" />
                        <span className="text-beew-noir/70">{l}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-[10px] tracking-[0.25em] text-beew-noir/40 uppercase">Ce qu&apos;on attend de vous</p>
                  <p className="mt-4 text-sm leading-relaxed text-beew-noir/70">{e.vous}</p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Délais annoncés                                                           */
/* -------------------------------------------------------------------------- */

export function Delais({ delais }: { delais: Methode["delais"] }) {
  return (
    <Section ton="sombre">
      <EnTete ton="sombre" surtitre={delais.surtitre} titre={delais.titre} intro={delais.intro} />

      {/* Une liste de définitions plutôt qu'un tableau : la structure reste
          lisible sur mobile sans défilement horizontal. Le gabarit est celui de
          toutes les listes du site — le projet à gauche, le détail à droite. */}
      <dl className="mt-16 border-t border-beew-creme/20">
        {delais.lignes.map((l, i) => (
          <div
            key={l.projet}
            data-reveal
            data-reveal-delay={i * 70}
            className={`${DEUX_COLONNES} border-b border-beew-creme/20 py-7`}
          >
            <dt className="text-[clamp(1.05rem,1.8vw,1.4rem)] font-semibold tracking-tight">{l.projet}</dt>
            <dd className="lg:pt-1">
              <span className="block text-sm font-semibold tracking-[0.15em] text-beew-orange uppercase tabular-nums">
                {l.duree}
              </span>
              <span className={`mt-3 block max-w-prose text-sm leading-relaxed ${doux("sombre")}`}>
                {l.precision}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
