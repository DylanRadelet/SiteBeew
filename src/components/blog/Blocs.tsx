import Link from "next/link";
import { Fleche } from "@/components/ui/section";
import type { Bloc } from "@/content/schemas/blog";

/**
 * Rendu des blocs typés du JSON.
 *
 * C'est le seul endroit du site qui transforme du contenu rédactionnel en
 * balises : le JSON ne contient jamais de HTML, donc aucun contenu ne peut
 * injecter de markup ni échapper au design system. Ajouter un type de bloc
 * suppose de l'ajouter au schéma ET ici — c'est voulu.
 */

/** Largeur de lecture : ~68 caractères, la limite au-delà de laquelle l'œil décroche. */
export const COLONNE_LECTURE = "max-w-[68ch]";

/**
 * Un placeholder `[À COMPLÉTER : …]` doit se voir immédiatement en relecture.
 * On le surligne au lieu de le laisser passer pour du texte courant : c'est ce
 * qui évite qu'une mention légale incomplète parte en ligne sans qu'on le voie.
 */
const DECOUPE_PLACEHOLDER = /(\[À COMPLÉTER[^\]]*\])/g;
/** Volontairement sans `g` : `test()` sur une regex globale est à état (`lastIndex`). */
const EST_PLACEHOLDER = /^\[À COMPLÉTER[^\]]*\]$/;

export function Texte({ children }: { children: string }) {
  const morceaux = children.split(DECOUPE_PLACEHOLDER);

  return (
    <>
      {morceaux.map((m, i) =>
        EST_PLACEHOLDER.test(m) ? (
          <mark
            key={i}
            className="rounded bg-beew-orange/20 px-1.5 py-0.5 font-semibold text-beew-noir"
          >
            {m}
          </mark>
        ) : (
          m
        ),
      )}
    </>
  );
}

export function Blocs({ blocs }: { blocs: Bloc[] }) {
  return (
    <div className={`${COLONNE_LECTURE} space-y-7`}>
      {blocs.map((bloc, i) => (
        <UnBloc key={i} bloc={bloc} index={i} />
      ))}
    </div>
  );
}

function UnBloc({ bloc, index }: { bloc: Bloc; index: number }) {
  switch (bloc.type) {
    case "titre":
      return bloc.niveau === 2 ? (
        <h2
          id={bloc.id}
          data-reveal
          className="scroll-mt-28 pt-8 text-[clamp(1.5rem,3vw,2.25rem)] leading-tight font-semibold tracking-tight"
        >
          <Texte>{bloc.texte}</Texte>
        </h2>
      ) : (
        <h3
          id={bloc.id}
          data-reveal
          className="scroll-mt-28 pt-3 text-[clamp(1.15rem,2vw,1.45rem)] leading-snug font-semibold tracking-tight"
        >
          <Texte>{bloc.texte}</Texte>
        </h3>
      );

    case "paragraphe":
      return (
        <p data-reveal className="text-[17px] leading-[1.75] text-beew-noir/75">
          <Texte>{bloc.texte}</Texte>
        </p>
      );

    case "liste": {
      const Balise = bloc.ordonnee ? "ol" : "ul";
      return (
        <Balise data-reveal className="space-y-3 text-[17px] leading-[1.75] text-beew-noir/75">
          {bloc.items.map((item, i) => (
            <li key={i} data-reveal-delay={i * 70} className="flex gap-4">
              <span
                aria-hidden
                className="mt-3 h-px w-4 shrink-0 bg-beew-orange"
                // La puce est purement décorative : la sémantique de liste
                // suffit aux lecteurs d'écran.
              />
              <span>
                {bloc.ordonnee && (
                  <span className="mr-2 font-semibold text-beew-noir">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                )}
                <Texte>{item}</Texte>
              </span>
            </li>
          ))}
        </Balise>
      );
    }

    case "citation":
      return (
        <figure data-reveal className="border-l-2 border-beew-orange py-2 pl-6">
          <blockquote className="text-[clamp(1.15rem,2vw,1.5rem)] leading-snug font-medium tracking-tight">
            « <Texte>{bloc.texte}</Texte> »
          </blockquote>
          {bloc.auteur && (
            <figcaption className="mt-4 text-xs tracking-[0.15em] text-beew-noir/50 uppercase">
              {bloc.auteur}
            </figcaption>
          )}
        </figure>
      );

    case "encadre":
      return (
        <aside
          data-reveal
          data-reveal-delay={index % 3 === 0 ? 0 : 70}
          className={`rounded-2xl p-7 sm:p-9 ${
            bloc.lien ? "bg-beew-noir text-beew-creme" : "border border-beew-noir/15 bg-beew-noir/[0.03]"
          }`}
        >
          <h3
            className={`text-lg font-semibold tracking-tight ${
              bloc.lien ? "text-beew-creme" : "text-beew-noir"
            }`}
          >
            <Texte>{bloc.titre}</Texte>
          </h3>
          <p
            className={`mt-4 text-[15px] leading-relaxed ${
              bloc.lien ? "text-beew-creme/70" : "text-beew-noir/65"
            }`}
          >
            <Texte>{bloc.texte}</Texte>
          </p>
          {bloc.lien && (
            <Link
              href={bloc.lien.href}
              className="group mt-7 inline-flex items-center gap-2 border-b border-beew-creme/30 pb-1 text-[11px] tracking-[0.2em] uppercase hover:border-beew-creme"
            >
              {bloc.lien.label}
              <Fleche />
            </Link>
          )}
        </aside>
      );
  }
}
