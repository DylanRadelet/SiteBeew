/**
 * Les 6 pages piliers de service, source unique de vérité.
 *
 * Ce module ne contient QUE cette liste, et n'importe rien : `schema.ts` (les
 * villes) et `schemas/service.ts` (les piliers) en ont tous les deux besoin, or
 * le second importe déjà le premier. Un fichier neutre évite le cycle.
 */
export const SERVICE_SLUGS = [
  "creation-site-internet",
  "refonte-site-internet",
  "referencement-seo",
  "site-e-commerce",
  "application-web",
  "outils-internes",
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];
