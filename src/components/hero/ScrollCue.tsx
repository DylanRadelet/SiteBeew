"use client";

import { useEffect, useState } from "react";

/** Nombre de carrés de la colonne. Le dernier est le plus gros : il « pèse » vers le bas. */
const PIXELS = 5;

/**
 * Indicateur de scroll, bord droit du hero.
 *
 * Plutôt qu'une flèche générique, une colonne de pixels qui s'allument de haut
 * en bas — le même vocabulaire que la déformation du hero, donc l'affordance
 * fait partie de l'identité au lieu d'être un élément d'interface plaqué.
 *
 * C'est un vrai <button> : cliquable, focusable au clavier, et il disparaît dès
 * que le visiteur a compris (premier scroll).
 */
export function ScrollCue({ targetId }: { targetId: string }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goNext = () => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <button
      type="button"
      onClick={goNext}
      aria-label="Faire défiler vers la suite"
      // Visible dès 640px : le seuil lg (1024px) le masquait sur la plupart des
      // portables. Caché sous 640px seulement, où la hauteur manque.
      // Mêmes marges latérales que le hero et le header : l'indicateur rentre
      // dans la grille au lieu de déborder sur le bord de l'écran.
      className={`absolute top-1/2 right-6 z-30 hidden -translate-y-1/2 flex-col items-center gap-5 transition-opacity duration-500 sm:right-10 sm:flex lg:right-14 ${
        scrolled ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <span
        className="text-[10px] uppercase tracking-[0.35em] text-beew-creme/60"
        style={{ writingMode: "vertical-rl" }}
      >
        Scroll
      </span>

      {/* Carrés tous identiques et sur un même axe : une colonne nette plutôt
          qu'un empilement de tailles qui donnait un rendu bancal. */}
      <span aria-hidden className="flex flex-col items-center gap-[7px]">
        {Array.from({ length: PIXELS }).map((_, i) => (
          <span
            key={i}
            className="pixel-drop block size-[6px] bg-beew-saumon"
            style={{ animationDelay: `${i * 0.16}s` }}
          />
        ))}
      </span>
    </button>
  );
}
