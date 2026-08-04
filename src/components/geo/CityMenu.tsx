"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readCityCookie, writeCityCookie } from "@/lib/city-cookie";

type Option = { slug: string; city: string };

/**
 * Sélecteur « 📍 Ville ▾ » du header. Remplace l'idée d'un logo qui pointerait
 * vers la ville mémorisée : on récupère le bénéfice (accès direct à sa ville)
 * sans sacrifier le lien racine.
 *
 * `<details>` natif : le menu est dans le HTML servi, donc ses liens comptent
 * comme maillage interne sitewide, et il fonctionne sans JavaScript.
 */
export function CityMenu({ cities, overlay = false }: { cities: Option[]; overlay?: boolean }) {
  const [current, setCurrent] = useState<Option | null>(null);

  useEffect(() => {
    const slug = readCityCookie();
    setCurrent(cities.find((c) => c.slug === slug) ?? null);
  }, [cities]);

  // Aucune ville publiée : on n'affiche pas un menu vide.
  if (!cities.length) return null;

  return (
    <details className="relative hidden text-sm sm:block">
      <summary
        className={`cursor-pointer list-none rounded-full border px-4 py-1.5 ${
          overlay ? "border-beew-creme/40" : "border-beew-noir/20"
        }`}
      >
        📍 {current?.city ?? "Votre ville"} ▾
      </summary>
      <ul className="absolute left-0 z-20 mt-2 min-w-56 rounded-xl border border-beew-noir/10 bg-beew-blanc p-2 text-beew-noir shadow-xl">
        {cities.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/${c.slug}`}
              onClick={() => writeCityCookie(c.slug)}
              className="block rounded px-3 py-2 hover:bg-beew-noir/5"
            >
              {c.city}
            </Link>
          </li>
        ))}
        <li className="mt-1 border-t border-beew-noir/10 pt-1">
          <Link href="/zones-d-intervention" className="block rounded px-3 py-2 hover:bg-beew-noir/5">
            Toutes nos zones d&apos;intervention
          </Link>
        </li>
      </ul>
    </details>
  );
}
