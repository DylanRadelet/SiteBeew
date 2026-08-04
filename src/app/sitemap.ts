import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/blog";
import { getPublishedCases } from "@/lib/cases";
import { getHome, getPublishedCities } from "@/lib/cities";
import { getAllZones } from "@/lib/regions";
import { getAllServices } from "@/lib/services";
import { SITE_URL } from "@/lib/seo";

/**
 * Plan de site.
 *
 * Ne contient QUE ce qui doit être indexé. Sont volontairement absents :
 *  · les pages villes et études de cas en `draft` — elles sont en noindex ;
 *  · les pages légales — elles sont en noindex et ne feraient que diluer le crawl.
 *
 * Règle tenue ici : une page indexable est soumise, une page soumise est
 * indexable. Toute exception crée un signal contradictoire pour Google.
 *
 * Les priorités reflètent la pyramide réelle du site : home et piliers de
 * service en tête, puis les zones, puis le reste.
 */

type Entree = MetadataRoute.Sitemap[number];

export default function sitemap(): MetadataRoute.Sitemap {
  const aujourdhui = getHome().updatedAt;

  const home: Entree = {
    // Sans barre finale : Next rend le canonical de la home sous cette forme.
    // Sitemap et canonical doivent déclarer exactement la même URL, sinon on
    // envoie deux versions de la page d'accueil au crawl.
    url: SITE_URL,
    lastModified: aujourdhui,
    changeFrequency: "monthly",
    priority: 1,
  };

  // Les 4 piliers : ce sont eux qui portent les requêtes commerciales.
  const services: Entree[] = getAllServices().map((s) => ({
    url: `${SITE_URL}/${s.slug}`,
    lastModified: s.updatedAt ?? aujourdhui,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  // Pyramide locale : région et provinces.
  const zones: Entree[] = getAllZones().map((z) => ({
    url: `${SITE_URL}/${z.slug}`,
    lastModified: z.updatedAt ?? aujourdhui,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Villes publiées uniquement.
  const villes: Entree[] = getPublishedCities().map((c) => ({
    url: `${SITE_URL}/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const confiance: Entree[] = [
    "/a-propos",
    "/methode",
    "/tarifs",
    "/contact",
    "/devis",
    "/zones-d-intervention",
  ].map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: aujourdhui,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // L'index des réalisations n'est soumis que s'il a quelque chose à montrer :
  // tant que toutes les études sont en brouillon, il se met lui-même en noindex.
  const casPublies = getPublishedCases();
  const realisations: Entree[] =
    casPublies.length > 0
      ? [
          {
            url: `${SITE_URL}/realisations`,
            lastModified: aujourdhui,
            changeFrequency: "monthly",
            priority: 0.7,
          },
          ...casPublies.map((c) => ({
            url: `${SITE_URL}/realisations/${c.slug}`,
            lastModified: c.updatedAt ?? aujourdhui,
            changeFrequency: "yearly" as const,
            priority: 0.6,
          })),
        ]
      : [];

  const articles = getAllArticles();
  const blog: Entree[] =
    articles.length > 0
      ? [
          {
            url: `${SITE_URL}/blog`,
            lastModified: aujourdhui,
            changeFrequency: "weekly",
            priority: 0.6,
          },
          ...articles.map((a) => ({
            url: `${SITE_URL}/blog/${a.slug}`,
            lastModified: a.updatedAt ?? a.publishedAt ?? aujourdhui,
            changeFrequency: "yearly" as const,
            priority: 0.5,
          })),
        ]
      : [];

  return [home, ...services, ...zones, ...villes, ...confiance, ...realisations, ...blog];
}
