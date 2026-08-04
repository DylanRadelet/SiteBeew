"use client";

import { useEffect } from "react";
import { writeCityCookie } from "@/lib/city-cookie";

/**
 * Mémorise la ville consultée. Rendu sur chaque page ville, n'affiche rien.
 * Écriture après hydratation uniquement : le HTML servi reste identique pour
 * tout le monde, cache CDN inclus.
 */
export function RememberCity({ slug }: { slug: string }) {
  useEffect(() => {
    writeCityCookie(slug);
  }, [slug]);

  return null;
}
