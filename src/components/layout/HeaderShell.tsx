"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MenuOverlay } from "@/components/layout/MenuOverlay";

type Option = { slug: string; city: string };
type Province = { slug: string; name: string };

/**
 * Le header flotte au-dessus du hero sur la home, et redevient opaque ailleurs.
 * Le choix se fait sur le pathname côté client : le layout serveur n'a pas
 * connaissance de la route, et un header par page dupliquerait le maillage.
 */
export function HeaderShell({ cities, provinces }: { cities: Option[]; provinces: Province[] }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  /**
   * Header fixe, sans aucun fond, sur toutes les pages.
   *
   * Le `mix-blend-mode: difference` est posé sur le header LUI-MÊME, pas sur ses
   * enfants : un élément se mélange toujours avec le fond de son contexte
   * d'empilement parent — ici la racine — même s'il porte un `z-index` qui
   * isole ses propres enfants. C'est ce qui permet de garder le `z-45`
   * nécessaire pour passer au-dessus du hero.
   *
   * Tout le contenu est donc en blanc pur : sur fond sombre la différence donne
   * du clair, sur le crème elle donne du quasi-noir. Lisible partout, sans une
   * seule ligne de logique de couleur.
   */
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-45 text-white mix-blend-difference">
        {/* Mêmes marges que le contenu du hero (px-6 / sm:px-10 / lg:px-14) et
            aucune largeur max : le logo s'aligne sur le H1, le bouton sur le
            bord droit du paragraphe. Un `max-w` ici décalait tout le header. */}
        <div className="flex items-center gap-5 px-6 py-5 sm:px-10 lg:px-14">
          {/*
            Le logo pointe TOUJOURS vers "/". C'est le lien interne le plus
            répété du site : il définit la racine de la hiérarchie pour Google,
            et les visiteurs attendent cette convention.
          */}
          {/* `min-h-11` : 44px, la cible tactile minimale recommandée. */}
        <Link href="/" className="flex min-h-11 items-center" aria-label="BEEW — accueil">
            {/* `brightness-0 invert` aplatit le logo en blanc pur : c'est le
                blend du header qui lui donne ensuite sa couleur négative. */}
            <Image
              src="/logo/logo_orange_long.webp"
              alt="BEEW"
              width={364}
              height={100}
              priority
              className="h-8 w-auto brightness-0 invert"
            />
          </Link>

          {/*
            Deux barres blanches : c'est le `mix-blend-difference` du header qui
            les rend négatives, comme le reste de son contenu. Le
            `backdrop-invert` posé ici auparavant faisait double emploi et
            annulait l'inversion une fois sur deux.
            La barre basse est plus courte et rejoint la haute au survol.
          */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Ouvrir le menu"
            aria-expanded={menuOpen}
            className="group ml-1 flex h-11 w-11 flex-col items-start justify-center gap-[6px]"
          >
            <span className="block h-0.5 w-6 bg-white transition-all duration-300" />
            <span className="block h-0.5 w-4 bg-white transition-all duration-300 group-hover:w-6" />
          </button>

          <div className="ml-auto flex items-center">
            {/* Bordure et texte en blanc : le blend du header s'occupe du reste. */}
            <Link
              href="/contact"
              aria-label="Réserver un appel"
              className="group inline-flex min-h-11 items-center gap-2.5 rounded-full border border-white/50 px-4 py-2.5 text-xs tracking-[0.15em] whitespace-nowrap uppercase transition-colors hover:border-white sm:px-5"
            >
              {/*
                Libellé court sur petit écran : « Réserver un appel » passait sur
                deux lignes et le bouton occupait presque toute la largeur, au
                détriment du logo et du menu. Le contenu accessible reste complet
                grâce au `aria-label` du lien.
              */}
              <span className="sm:hidden">Appeler</span>
              <span className="hidden sm:inline">Réserver un appel</span>
              {/* Flèche à 45° vers le haut, qui file en diagonale au survol. */}
              <svg
                viewBox="0 0 12 12"
                aria-hidden
                className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2.5 9.5 9.5 2.5" />
                <path d="M4 2.5h5.5V8" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      <MenuOverlay
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        cities={cities}
        provinces={provinces}
      />
    </>
  );
}
