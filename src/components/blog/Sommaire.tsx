import { COLONNE_LECTURE } from "@/components/blog/Blocs";
import { Surtitre } from "@/components/ui/section";

/**
 * Sommaire de l'article, construit à partir des h2 du corps.
 * Ce sont de vrais liens d'ancre en HTML statique : ils servent à la fois la
 * navigation du lecteur et les sitelinks d'ancrage de Google.
 */
export function Sommaire({ entrees }: { entrees: { id: string; texte: string }[] }) {
  if (entrees.length < 2) return null;

  return (
    <nav
      aria-labelledby="sommaire-titre"
      className={`${COLONNE_LECTURE} rounded-2xl border border-beew-noir/15 p-7 sm:p-9`}
    >
      {/* Composant partagé : les crochets verts sont la signature des
          surtitres du site, ils ne doivent pas être réécrits ici. */}
      <div id="sommaire-titre">
        <Surtitre>Sommaire</Surtitre>
      </div>
      <ol className="mt-6 space-y-3">
        {entrees.map((e, i) => (
          <li key={e.id} className="flex gap-4 text-[15px] leading-snug">
            <span className="shrink-0 text-beew-vert tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            <a
              href={`#${e.id}`}
              className="border-b border-transparent pb-0.5 text-beew-noir/75 transition-colors hover:border-beew-noir/40 hover:text-beew-noir"
            >
              {e.texte}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
