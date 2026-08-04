"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { logUnknownCity, writeCityCookie } from "@/lib/city-cookie";
import { normalize } from "@/content/schema";

type Option = { slug: string; city: string; coverage: string[] };

/**
 * Sélecteur de ville du hero — remplace l'idée de la modale « D'où venez-vous ? ».
 *
 * Points clés :
 *  · la liste complète est rendue en HTML (composant client pré-rendu côté
 *    serveur), donc ce sont de VRAIS liens crawlables : c'est le maillage
 *    principal de la home vers les pages villes ;
 *  · aucun interstitiel bloquant — Google sanctionne les modales au chargement
 *    sur mobile, et elles dégradent le CLS ;
 *  · le filtre n'est qu'un confort ; sans JavaScript, tous les liens restent là.
 */
export function CitySelector({ label, options }: { label: string; options: Option[] }) {
  const [query, setQuery] = useState("");

  const matches = useMemo(() => {
    const q = normalize(query).trim();
    if (!q) return options;
    return options.filter(
      (o) =>
        normalize(o.city).includes(q) || o.coverage.some((c) => normalize(c).includes(q)),
    );
  }, [options, query]);

  const noMatch = query.trim().length > 2 && matches.length === 0;

  return (
    <section aria-labelledby="city-selector" className="rounded-xl border border-neutral-200 p-5">
      <h2 id="city-selector" className="text-base font-semibold">
        {label}
      </h2>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onBlur={() => noMatch && logUnknownCity(query)}
        placeholder="Votre commune…"
        aria-label="Filtrer par commune"
        className="mt-3 w-full rounded-md border border-neutral-300 px-3 py-2"
      />

      {/* Liens réels : présents dans le HTML même sans interaction. */}
      <ul className="mt-4 flex flex-wrap gap-2">
        {matches.map((o) => (
          <li key={o.slug}>
            <Link
              href={`/${o.slug}`}
              onClick={() => writeCityCookie(o.slug)}
              className="inline-block rounded-full border border-neutral-300 px-3 py-1.5 text-sm hover:border-neutral-900"
            >
              {o.city}
            </Link>
          </li>
        ))}
      </ul>

      {/*
        Ville inconnue : on NE redirige pas et on ne bricole pas une page à la
        volée. On reste sur la home, on propose le contact, et la saisie est
        loggée — c'est la roadmap des prochaines villes à ouvrir.
      */}
      {noMatch && (
        <p className="mt-4 text-sm text-neutral-600">
          Nous n&apos;avons pas encore de page dédiée à « {query} », mais nous intervenons partout en
          Wallonie.{" "}
          <Link href="/contact" className="font-semibold underline underline-offset-2">
            Parlons de votre projet
          </Link>
          .
        </p>
      )}
    </section>
  );
}
