"use client";

import { useEffect } from "react";

/**
 * Apparition au défilement, pour toute la page.
 *
 * Un seul observateur pour tous les éléments marqués `data-reveal`, plutôt qu'un
 * composant React par bloc : moins de code client, et les éléments ajoutés plus
 * tard sont pris en compte automatiquement.
 *
 * Le décalage en cascade vient de `data-reveal-delay`, posé côté serveur : les
 * enfants d'une même grille apparaissent l'un après l'autre au lieu d'un bloc.
 *
 * La classe `js-reveal` n'est ajoutée que si ce composant s'exécute — sans JS,
 * aucun élément n'est masqué. Le contenu reste intégralement visible pour les
 * moteurs de recherche.
 */
export function Reveal() {
  useEffect(() => {
    const racine = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    racine.classList.add("js-reveal");

    /**
     * Deux animations imbriquées se superposent et font clignoter le contenu.
     * Quand une section contient des blocs déjà marqués, ce sont EUX qui
     * s'animent — en cascade — et la section se retire. Une section sans enfant
     * marqué s'anime d'un bloc. C'est ce qui permet de poser l'animation par
     * défaut sur `Section` sans casser les cascades existantes.
     */
    for (const el of document.querySelectorAll<HTMLElement>("[data-reveal]")) {
      if (el.querySelector("[data-reveal]")) el.removeAttribute("data-reveal");
    }

    const observateur = new IntersectionObserver(
      (entrees) => {
        for (const e of entrees) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          const retard = Number(el.dataset.revealDelay ?? 0);
          el.style.transitionDelay = `${retard}ms`;
          el.classList.add("est-visible");
          // Une fois apparu, l'élément n'a plus rien à observer.
          observateur.unobserve(el);
        }
      },
      // Déclenche un peu avant l'entrée dans l'écran : l'animation est déjà
      // finie quand le bloc arrive vraiment sous les yeux.
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );

    const cibles = [...document.querySelectorAll<HTMLElement>("[data-reveal]")];
    let auMoinsUn = false;

    for (const c of cibles) {
      // Ce qui est DÉJÀ à l'écran au chargement s'affiche tout de suite, sans
      // attendre l'observateur : sinon le haut de page reste vide une fraction
      // de seconde, ce qui se voit et dégrade le ressenti de vitesse.
      const r = c.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        c.classList.add("est-visible");
        auMoinsUn = true;
        continue;
      }
      observateur.observe(c);
    }

    /**
     * Filet de sécurité. Si l'observateur ne rend jamais la main — navigateur
     * exotique, onglet en arrière-plan au chargement, extension qui interfère —
     * on désactive tout le système au bout de 4 s. Mieux vaut perdre l'animation
     * que laisser une page blanche.
     */
    const secours = window.setTimeout(() => {
      const apparus = document.querySelectorAll("[data-reveal].est-visible").length;
      if (apparus === 0 && !auMoinsUn) racine.classList.remove("js-reveal");
    }, 4000);

    return () => {
      window.clearTimeout(secours);
      observateur.disconnect();
      racine.classList.remove("js-reveal");
    };
  }, []);

  return null;
}
