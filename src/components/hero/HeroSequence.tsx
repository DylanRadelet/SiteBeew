"use client";

import { useEffect, useRef } from "react";
import { Manifesto } from "@/components/home/Manifesto";
import { VideoHero } from "@/components/hero/VideoHero";
import type { Home } from "@/content/schema";

/**
 * Séquence d'ouverture pilotée au scroll.
 *
 * Le principe : un conteneur haut de 3 écrans dont l'intérieur est `sticky`.
 * Le hero ne bouge donc jamais — c'est la page qui défile derrière lui pendant
 * que la scène se joue. Tout se passe sur la vidéo, sans fondu au noir :
 *
 *   0 %  →   3 %   le hero, intact
 *   3 %  →  22 %   titre et accroche s'effacent en remontant
 *  25 %  →  42 %   le manifeste apparaît à leur place
 *  42 %  →  75 %   PALIER — rien ne bouge, le temps de lire
 *  75 %  → 100 %   tout l'écran fonce sur nous et s'efface, découvrant la
 *                  section claire qui suit
 *
 * Le palier est la pièce importante : sans lui, le manifeste finissait
 * d'apparaître au moment exact où le zoom démarrait, et un cran de molette de
 * trop emportait le texte avant qu'on ait pu le lire.
 *
 * Les styles sont écrits directement sur les éléments, jamais via un state
 * React : à 60 images par seconde, un setState par frame ferait re-rendre
 * l'arbre en continu pour rien.
 */

/** Hauteur totale de la scène. 3 écrans = une course de 2 écrans. */
const HAUTEUR_SCENE = "300svh";

/** Bornes des phases, en fraction de progression. */
const SORTIE_DEBUT = 0.03;
const SORTIE_FIN = 0.22;
const ENTREE_DEBUT = 0.25;
const ENTREE_FIN = 0.42;
/** Entre ENTREE_FIN et ZOOM_DEBUT, l'écran est figé : c'est le temps de lecture. */
const ZOOM_DEBUT = 0.75;
const ZOOM_FIN = 1;
/** Facteur d'agrandissement final. 0.8 = l'écran double presque de taille. */
const ZOOM_AMPLEUR = 0.8;

/** Interpolation douce (accélère puis décélère) plutôt qu'une rampe linéaire. */
function lissage(x: number): number {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
}

export function HeroSequence({
  h1,
  intro,
  manifesto,
}: {
  h1: string;
  intro: string;
  manifesto: Home["manifesto"];
}) {
  const scene = useRef<HTMLElement>(null);
  const ecran = useRef<HTMLDivElement>(null);
  const contenuHero = useRef<HTMLDivElement>(null);
  const texte = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scene.current;
    const vue = ecran.current;
    const hero = contenuHero.current;
    const t = texte.current;
    if (!el || !vue || !hero || !t) return;

    // Seul le lien du manifeste redevient cliquable. La couche elle-même reste
    // transparente aux événements : sinon elle intercepte les mouvements de
    // souris destinés au hero, qui reçoit alors un `pointerleave` — la traînée
    // de pixels s'arrête net et le point lumineux s'éteint.
    const lienManifeste = t.querySelector("a");

    let raf = 0;

    const update = () => {
      raf = 0;
      const course = el.offsetHeight - window.innerHeight;
      if (course <= 0) return;

      const p = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / course));

      // Titre + accroche : s'effacent en remontant légèrement.
      const sortie = lissage((p - SORTIE_DEBUT) / (SORTIE_FIN - SORTIE_DEBUT));
      hero.style.opacity = String(1 - sortie);
      hero.style.transform = `translateY(${-sortie * 40}px)`;

      // Manifeste : apparaît en montant, une fois la place libérée.
      const entree = lissage((p - ENTREE_DEBUT) / (ENTREE_FIN - ENTREE_DEBUT));
      t.style.opacity = String(entree);
      t.style.transform = `translateY(${(1 - entree) * 24}px)`;
      if (lienManifeste) lienManifeste.style.pointerEvents = entree > 0.9 ? "auto" : "none";

      // Sortie : l'écran entier fonce sur le visiteur et s'efface. Ce qu'il y a
      // derrière — le fond clair grésillant de la page — apparaît par en dessous.
      const zoom = lissage((p - ZOOM_DEBUT) / (ZOOM_FIN - ZOOM_DEBUT));
      vue.style.transform = `scale(${1 + zoom * ZOOM_AMPLEUR})`;
      vue.style.opacity = String(1 - zoom);

    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section ref={scene} className="relative" style={{ height: HAUTEUR_SCENE }}>
      {/*
        Deux couches distinctes, et c'est indispensable :
        · l'extérieur découpe (`overflow-hidden`) et reste figé à la taille de
          l'écran — c'est lui qui est `sticky` ;
        · l'intérieur est celui qu'on agrandit.
        Agrandir directement le conteneur découpant ne servirait à rien :
        `overflow-hidden` rogne le contenu d'un élément, pas l'élément lui-même
        une fois mis à l'échelle — d'où la barre de défilement horizontale.
        Le `z-10` place cette couche au-dessus de la section « à propos », qui
        remonte derrière elle.
      */}
      {/*
        `pointer-events-none` sur TOUTE la couche, en dur.

        Elle occupe un écran entier et reste posée au-dessus de la section
        suivante, que `-mt-[100svh]` fait remonter sous elle. Son opacité tombe
        à zéro en fin de scène, mais un élément transparent continue de recevoir
        les événements : la première section de la page — les références —
        devenait impossible à survoler et à sélectionner.

        Le réglage est déclaratif et non piloté par la boucle de défilement :
        si le script ne s'exécutait pas, une page entière deviendrait
        inutilisable. Les seuls éléments interactifs de la scène — l'indicateur
        de défilement et le lien du manifeste — rétablissent les événements
        pour eux-mêmes.
      */}
      <div className="pointer-events-none sticky top-0 z-10 h-svh overflow-hidden">
        <div ref={ecran} className="relative h-full w-full origin-center will-change-transform">
          <VideoHero h1={h1} intro={intro} contentRef={contenuHero} />

          <div
            ref={texte}
            style={{ opacity: 0, pointerEvents: "none" }}
            className="absolute inset-0 z-36 flex items-center justify-center px-6 sm:px-10 lg:px-14"
          >
            <Manifesto manifesto={manifesto} />
          </div>
        </div>
      </div>
    </section>
  );
}
