"use client";

import Link from "next/link";
import { Reseaux } from "@/components/ui/Reseaux";
import { useEffect } from "react";

type Option = { slug: string; city: string };

/** Entrées principales, en gros caractères. Volontairement courtes : au-delà de
 *  sept, la colonne déborde sur un portable et perd son effet. */
const NAV = [
  { href: "/", label: "Accueil" },
  { href: "/realisations", label: "Réalisations" },
  { href: "/methode", label: "Méthode" },
  { href: "/tarifs", label: "Tarifs" },
  { href: "/a-propos", label: "L'agence" },
  { href: "/blog", label: "Journal" },
  { href: "/contact", label: "Contact" },
];

/** Les 6 piliers SEO. Ils méritent un lien direct depuis chaque page du site. */
const SERVICES = [
  { href: "/creation-site-internet", label: "Création de site internet" },
  { href: "/refonte-site-internet", label: "Refonte de site" },
  { href: "/referencement-seo", label: "Référencement SEO" },
  { href: "/site-e-commerce", label: "Site e-commerce" },
  { href: "/application-web", label: "Application web" },
  { href: "/outils-internes", label: "Outils internes" },
];

/**
 * Étage haut de la pyramide locale. Les provinces et les villes sont injectées
 * depuis le serveur : le menu ne doit jamais figer une liste que le contenu
 * fait bouger.
 */
const ZONES = [
  { href: "/wallonie", label: "Wallonie" },
  { href: "/zones-d-intervention", label: "Toutes nos zones" },
];

/**
 * Overlay de navigation — plein écran, sobre, même fond que le hero.
 *
 * Il est TOUJOURS rendu dans le DOM, jamais monté/démonté : ses liens font
 * partie du maillage interne du site et doivent rester présents dans le HTML
 * servi. La fermeture se fait par opacité + `inert`, ce qui le retire aussi de
 * l'ordre de tabulation et de l'arbre d'accessibilité.
 */
export function MenuOverlay({
  open,
  onClose,
  cities,
  provinces,
}: {
  open: boolean;
  onClose: () => void;
  cities: Option[];
  provinces: { slug: string; name: string }[];
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    // Empêche la page de défiler derrière l'overlay.
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open, onClose]);

  /** Apparition en cascade : chaque bloc entre après le précédent. */
  const cascade = (rang: number) => ({
    className: `transition-all duration-500 ease-out ${
      open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
    }`,
    style: { transitionDelay: open ? `${240 + rang * 70}ms` : "0ms" },
  });

  return (
    <div
      // React 19 accepte `inert` en booléen. Fermé, l'overlay sort de l'ordre
      // de tabulation et de l'arbre d'accessibilité tout en restant dans le HTML.
      inert={!open}
      // Le panneau descend depuis le haut avec une courbe sèche (expo out) :
      // départ rapide, arrivée amortie. Pas de fondu — le mouvement suffit.
      // `grain` : le grésillement du site couvre aussi le menu, sinon l'overlay
      // apparaît comme une surface lisse posée sur une page texturée.
      className={`fixed inset-0 z-50 overflow-y-auto bg-beew-noir text-beew-creme transition-transform duration-[650ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${
        open ? "translate-y-0" : "pointer-events-none -translate-y-full"
      }`}
    >
      {/* Mêmes marges que le header et le hero : tout reste sur la même grille.
          Le grain est porté ICI et non sur le conteneur défilant : ce dernier a
          la hauteur de l'écran, alors que ce bloc grandit avec son contenu.
          Sur mobile, où le menu défile, c'est la seule façon que la texture
          couvre aussi la partie qu'on atteint en défilant. */}
      <div className="grain grain-defilant relative flex min-h-full flex-col px-6 py-3 sm:px-10 lg:px-14">
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le menu"
            className="flex min-h-11 items-center gap-3 text-sm tracking-[0.2em] text-beew-creme/70 uppercase transition-colors hover:text-beew-creme"
          >
            Fermer
            <span aria-hidden className="relative block h-4 w-4">
              <span className="absolute top-1/2 left-0 block h-px w-4 rotate-45 bg-current" />
              <span className="absolute top-1/2 left-0 block h-px w-4 -rotate-45 bg-current" />
            </span>
          </button>
        </div>

        <div className="grid flex-1 content-center gap-8 py-4 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16">
          <nav aria-label="Navigation principale">
            <ul>
              {NAV.map((item, i) => (
                // Chaque entrée monte en décalé une fois le panneau posé : le
                // regard descend la liste au lieu de tout recevoir d'un bloc.
                <li
                  key={item.href}
                  className={`overflow-hidden transition-all duration-500 ease-out ${
                    open ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  }`}
                  style={{ transitionDelay: open ? `${240 + i * 60}ms` : "0ms" }}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="group flex items-baseline gap-4 py-0.5 font-[family-name:var(--font-display)] text-[clamp(1.3rem,min(3.9vw,4.7vh),3.25rem)] leading-[1.1] font-semibold tracking-tight uppercase transition-colors hover:text-beew-saumon"
                  >
                    <span className="text-[10px] font-normal tracking-[0.2em] text-beew-creme/30 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Sous la navigation principale, dans la colonne de gauche. */}
            <div
              className={`mt-8 transition-all duration-500 ease-out ${
                open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
              style={{ transitionDelay: open ? "660ms" : "0ms" }}
            >
              <Reseaux />
            </div>
          </nav>

          <div className="grid gap-6 text-sm sm:grid-cols-2 lg:gap-8">
            <section {...cascade(5)}>
              <h2 className="text-[10px] tracking-[0.25em] text-beew-creme/40 uppercase">Services</h2>
              <ul className="mt-4 space-y-2">
                {SERVICES.map((s) => (
                  <li key={s.href}>
                    <Link
                      href={s.href}
                      onClick={onClose}
                      className="text-beew-creme/70 transition-colors hover:text-beew-creme"
                    >
                      {s.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section {...cascade(6)}>
              <h2 className="text-[10px] tracking-[0.25em] text-beew-creme/40 uppercase">Zones</h2>
              <ul className="mt-4 space-y-2">
                {ZONES.map((z) => (
                  <li key={z.href}>
                    <Link
                      href={z.href}
                      onClick={onClose}
                      className="text-beew-creme/70 transition-colors hover:text-beew-creme"
                    >
                      {z.label}
                    </Link>
                  </li>
                ))}
                {/* Étage intermédiaire, décalé pour que la hiérarchie région →
                    province se lise sans avoir à cliquer. */}
                {provinces.map((p) => (
                  <li key={p.slug} className="pl-3">
                    <Link
                      href={`/${p.slug}`}
                      onClick={onClose}
                      className="text-beew-creme/50 transition-colors hover:text-beew-creme"
                    >
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            {/* Sur toute la largeur : 15 communes tiennent en 3 colonnes courtes
                plutôt qu'en 2 colonnes de 8 rangées, qui faisaient déborder le
                panneau et forçaient un défilement dans un menu de navigation. */}
            <section {...cascade(7)} className={`${cascade(7).className} sm:col-span-2`}>
              <h2 className="text-[10px] tracking-[0.25em] text-beew-creme/40 uppercase">Villes</h2>
              {/* Villes publiées uniquement : un brouillon ne reçoit jamais de
                  lien depuis une page indexée, et le menu est sur toutes. */}
              <ul className="mt-5 grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
                {cities.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/${c.slug}`}
                      onClick={onClose}
                      className="text-beew-creme/70 transition-colors hover:text-beew-creme"
                    >
                      {c.city}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section {...cascade(8)} className={`${cascade(8).className} sm:col-span-2`}>
              <h2 className="text-[10px] tracking-[0.25em] text-beew-creme/40 uppercase">
                Informations pratiques
              </h2>
              {/* Coordonnées réelles, reprises des mentions légales. Disposées sur
                  une seule rangée : empilées, elles faisaient déborder le
                  panneau sur les écrans de 700 px de haut. */}
              <dl className="mt-4 grid gap-x-8 gap-y-2 text-beew-creme/70 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <dt className="sr-only">E-mail</dt>
                  <dd>
                    <a href="mailto:hello@beew.agency" className="hover:text-beew-creme">
                      hello@beew.agency
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="sr-only">Téléphone</dt>
                  <dd>
                    <a href="tel:+32472467309" className="hover:text-beew-creme">
                      +32 472 46 73 09
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="sr-only">Siège</dt>
                  <dd>Chemin des Roches 13/3, 6600 Bastogne</dd>
                </div>
                <div>
                  <dt className="sr-only">Disponibilité</dt>
                  <dd>Du lundi au vendredi, 9h — 18h</dd>
                </div>
              </dl>

              <Link
                href="/devis"
                onClick={onClose}
                className="group mt-6 inline-flex items-center gap-3 rounded-full bg-beew-blanc px-6 py-3 text-[11px] tracking-[0.2em] text-beew-noir uppercase transition-opacity hover:opacity-85"
              >
                Demander un devis
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
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
