"use client";

import { useRef } from "react";
import { PixelDistortion } from "./PixelDistortion";
import { ScrollCue } from "./ScrollCue";

/**
 * Hero pleine hauteur : vidéo en fond, texte en bas à gauche, accroche à droite.
 *
 * Le H1 vient du contenu (global.json / ville) et n'est jamais réécrit ici :
 * c'est un composant de présentation, la charge SEO reste dans le JSON.
 */
export function VideoHero({
  h1,
  intro,
  children,
  contentRef,
}: {
  h1: string;
  intro: string;
  children?: React.ReactNode;
  /** Bloc titre + accroche, pour que la séquence de scroll puisse le faire disparaître. */
  contentRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Coupe en deux lignes équilibrées sans toucher au contenu : le <br> est
  // normalisé en espace par les moteurs, le H1 reste une seule phrase pour le SEO.
  const words = h1.split(" ");
  const mid = Math.ceil(words.length / 2);
  const line1 = words.slice(0, mid).join(" ");
  const line2 = words.slice(mid).join(" ");

  return (
    <section className="relative h-svh w-full overflow-hidden bg-beew-noir">
      {/*
        Trois sources, dans l'ordre de préférence du navigateur.

        Le fichier d'origine était un `.mov` de 50 Mo servi en
        `video/quicktime` : Chrome et Firefox ne lisent pas ce conteneur de
        façon fiable, et 50 Mo se téléchargeaient à chaque visite de l'accueil.
        Le même plan réencodé pèse 0,20 Mo en WebM et 0,57 Mo en MP4 — soit
        250 fois moins — sans différence visible, la vidéo étant un fond
        assombri et partiellement pixelisé.

        `poster` évite le rectangle noir avant la première image décodée, et
        `preload="metadata"` laisse le navigateur décider du moment de charger.
      */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/images/heros/agence.jpg"
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/videos/hero-video.webm" type="video/webm" />
        <source src="/videos/hero-video.mp4" type="video/mp4" />
      </video>

      {/* Voile sombre : sans lui, le texte blanc devient illisible sur les
          passages clairs de la vidéo. Le dégradé garde le haut plus lisible. */}
      <div
        aria-hidden
        className="absolute inset-0 z-20 bg-gradient-to-t from-beew-noir/85 via-beew-noir/35 to-beew-noir/55"
      />

      <PixelDistortion videoRef={videoRef} />

      <ScrollCue targetId="suite" />

      <div
        ref={contentRef}
        className="relative z-30 flex h-full flex-col justify-end px-6 pb-16 sm:px-10 lg:px-14"
      >
        {/*
          Côte à côte seulement à partir de xl. En dessous, le titre partageait
          la largeur avec le paragraphe et se cassait en trois lignes au lieu de deux.
        */}
        <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between xl:gap-16">
          {/*
            Aucune compensation de marge : avec `leading-none` sur le titre,
            l'alignement des bas de boîtes fait déjà coïncider les deux lignes de
            base (mesuré à 0px d'écart). Toute marge ajoutée ici les décale.
          */}
          <h1 className="text-[clamp(2.2rem,5.2vw,4rem)] font-semibold uppercase leading-none tracking-tight text-beew-creme">
            {line1}
            {line2 && (
              <>
                {/* L'espace explicite garde « ... située en ... » intact dans le
                    textContent : sans lui, les deux lignes se collent pour les
                    moteurs et les lecteurs d'écran. */}
                {" "}
                <br />
                {line2}
              </>
            )}
          </h1>

          {/* Élargi à 27rem : en dessous, la justification créait des blancs
              béants entre les mots au lieu d'un bloc net. */}
          <div className="max-w-md shrink-0 xl:max-w-[27rem]">
            <p className="text-justify text-sm leading-relaxed text-beew-creme/85">{intro}</p>
          </div>
        </div>

        {children && <div className="mt-12 max-w-2xl">{children}</div>}
      </div>
    </section>
  );
}
