"use client";

import { useEffect, useRef } from "react";

/**
 * Rend une bande à défilement horizontal saisissable à la souris.
 *
 * Le défilement natif (`overflow-x`) couvre déjà le doigt, la molette et le
 * clavier. Il ne couvre PAS le clic-glisser à la souris : sur un ordinateur
 * sans pavé tactile horizontal, la bande paraissait figée. C'est le seul geste
 * que ce composant ajoute — tout le reste continue de fonctionner sans lui.
 *
 * Le contenu reste rendu côté serveur par le parent : ce composant ne fait
 * qu'envelopper des enfants déjà présents dans le HTML statique. Si le script
 * ne s'exécute pas, la bande défile toujours au doigt et au clavier.
 */
export function BandeGlissante({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const piste = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = piste.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let actif = false;
    let departX = 0;
    let departScroll = 0;
    let deplace = false;

    const onDown = (e: PointerEvent) => {
      // Bouton principal uniquement : un clic droit ou molette ne doit rien saisir.
      if (e.button !== 0) return;
      actif = true;
      deplace = false;
      departX = e.clientX;
      departScroll = el.scrollLeft;
      el.style.cursor = "grabbing";
      // `scroll-snap` ramènerait la bande sur un cran à chaque pixel parcouru :
      // on le suspend pendant le glissé et on le rétablit au relâchement.
      el.style.scrollSnapType = "none";
    };

    const onMove = (e: PointerEvent) => {
      if (!actif) return;
      const delta = e.clientX - departX;
      // Au-delà de quelques pixels, c'est un glissé et non un clic : on le note
      // pour annuler le lien au relâchement.
      if (Math.abs(delta) > 4) {
        deplace = true;
        el.setPointerCapture(e.pointerId);
      }
      el.scrollLeft = departScroll - delta;
    };

    const onUp = () => {
      if (!actif) return;
      actif = false;
      el.style.cursor = "";
      el.style.scrollSnapType = "";
    };

    /**
     * Un glissé qui se termine sur une vignette ne doit pas ouvrir sa page.
     * On intercepte le clic en phase de capture, avant qu'il n'atteigne le lien.
     */
    const onClick = (e: MouseEvent) => {
      if (deplace) {
        e.preventDefault();
        e.stopPropagation();
        deplace = false;
      }
    };

    el.style.cursor = "grab";
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("pointerleave", onUp);
    el.addEventListener("click", onClick, true);

    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("pointerleave", onUp);
      el.removeEventListener("click", onClick, true);
      el.style.cursor = "";
    };
  }, []);

  return (
    <div ref={piste} className={className}>
      {children}
    </div>
  );
}
