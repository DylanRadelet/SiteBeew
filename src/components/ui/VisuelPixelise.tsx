"use client";

import Image from "next/image";
import { useRef } from "react";
import { PixelDistortion } from "@/components/hero/PixelDistortion";

/**
 * Visuel de hero avec la déformation en gros pixels par-dessus.
 *
 * `PageHero` est un composant serveur : il ne peut ni tenir une référence, ni
 * monter un effet. Cet enrobage client fait les deux et ne contient rien
 * d'autre — l'image reste rendue par `next/image`, donc optimisée et
 * dimensionnée comme avant.
 *
 * L'effet lit l'image via un canvas de même origine (`/_next/image`), ce qui
 * évite le marquage « tainted » qui interdirait la lecture des pixels.
 */
export function VisuelPixelise({
  src,
  alt,
  className,
  priority = true,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  const imageRef = useRef<HTMLImageElement>(null);

  return (
    <>
      <Image
        ref={imageRef}
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="100vw"
        className={className}
      />
      <PixelDistortion sourceRef={imageRef} />
    </>
  );
}
