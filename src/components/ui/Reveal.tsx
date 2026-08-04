"use client";

import { usePathname } from "next/navigation";
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
 *
 * POURQUOI CE COMPOSANT ÉCOUTE LA ROUTE ET LE DOM
 *
 * Il vit dans le layout, donc il n'est monté qu'une fois. Avec un effet à
 * dépendances vides, une navigation côté client remplaçait le contenu de la
 * page sans que le nouvel arbre soit jamais observé : `js-reveal` restait posé
 * sur la racine, et les blocs de la page d'arrivée gardaient `opacity: 0`.
 * Des sections entières disparaissaient — le défaut le plus visible du site.
 *
 * Deux garde-fous s'ajoutent donc à l'observateur d'intersection : un balayage
 * à chaque changement de route, et un `MutationObserver` pour tout ce qui est
 * rendu après coup.
 */
export function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    const racine = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    racine.classList.add("js-reveal");

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

    /**
     * Prend en charge tout élément marqué et pas encore apparu. Idempotent :
     * le filtre `:not(.est-visible)` garantit qu'un même bloc n'est traité
     * qu'une fois, quel que soit le nombre d'appels.
     */
    const enregistrer = () => {
      for (const el of document.querySelectorAll<HTMLElement>("[data-reveal]:not(.est-visible)")) {
        /**
         * Deux animations imbriquées se superposent et font clignoter le
         * contenu. Quand une section contient des blocs déjà marqués, ce sont
         * EUX qui s'animent — en cascade — et la section se retire. C'est ce
         * qui permet de poser l'animation par défaut sur `Section` sans casser
         * les cascades existantes.
         */
        if (el.querySelector("[data-reveal]")) {
          el.removeAttribute("data-reveal");
          continue;
        }

        // Ce qui est DÉJÀ à l'écran s'affiche tout de suite, sans attendre
        // l'observateur : sinon le haut de page reste vide une fraction de
        // seconde, ce qui se voit et dégrade le ressenti de vitesse.
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) {
          el.classList.add("est-visible");
          continue;
        }

        observateur.observe(el);
      }
    };

    enregistrer();

    /**
     * Le contenu d'une page d'arrivée peut être monté après cet effet, et
     * certaines sections n'apparaissent qu'à la première interaction. On
     * surveille donc les ajouts au DOM plutôt que de parier sur le timing.
     */
    const mutations = new MutationObserver(enregistrer);
    mutations.observe(document.body, { childList: true, subtree: true });

    /**
     * Filet de sécurité. Si l'observateur ne rend jamais la main — navigateur
     * exotique, onglet en arrière-plan, extension qui interfère — on révèle ce
     * qui est resté bloqué DANS l'écran. Volontairement limité à la zone
     * visible : tout révéler d'un coup supprimerait l'animation du reste de la
     * page. Mieux vaut perdre l'animation qu'afficher une section vide.
     */
    const secours = window.setInterval(() => {
      for (const el of document.querySelectorAll<HTMLElement>("[data-reveal]:not(.est-visible)")) {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("est-visible");
      }
    }, 1200);

    return () => {
      window.clearInterval(secours);
      mutations.disconnect();
      observateur.disconnect();
      // `js-reveal` n'est PAS retirée ici : entre deux routes, la retirer puis
      // la remettre ferait apparaître toute la page d'un bloc avant de la
      // masquer à nouveau — un clignotement à chaque navigation.
    };
  }, [pathname]);

  return null;
}
