"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { clearCityCookie, readCityCookie } from "@/lib/city-cookie";

type Option = { slug: string; city: string };

/**
 * Bandeau affiché sur la home au visiteur qui a déjà consulté une ville.
 *
 * Volontairement une SUGGESTION et non une redirection :
 *  · aucune surprise pour le visiteur, aucun piège au bouton retour ;
 *  · les statistiques de la home restent lisibles ;
 *  · rendu après hydratation, donc sans effet sur le HTML vu par les moteurs.
 */
export function CityBanner({ cities }: { cities: Option[] }) {
  const [remembered, setRemembered] = useState<Option | null>(null);

  useEffect(() => {
    const slug = readCityCookie();
    if (!slug) return;
    setRemembered(cities.find((c) => c.slug === slug) ?? null);
  }, [cities]);

  if (!remembered) return null;

  return (
    <aside className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm">
      <p>
        📍 Vous consultiez notre offre à <strong>{remembered.city}</strong>.
      </p>
      <div className="flex items-center gap-3">
        <Link href={`/${remembered.slug}`} className="font-semibold underline underline-offset-2">
          Y retourner
        </Link>
        <button
          type="button"
          onClick={() => {
            clearCityCookie();
            setRemembered(null);
          }}
          className="text-neutral-500 hover:text-neutral-800"
        >
          Ignorer
        </button>
      </div>
    </aside>
  );
}
