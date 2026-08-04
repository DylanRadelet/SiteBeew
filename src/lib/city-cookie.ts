/**
 * Mémorisation de la ville consultée — CÔTÉ CLIENT UNIQUEMENT.
 *
 * Ce cookie ne doit JAMAIS être lu dans un middleware ni dans un Server
 * Component : la réponse deviendrait unique par visiteur, ce qui casse le cache
 * CDN et le SSG. Il ne sert qu'à afficher un bandeau après hydratation.
 *
 * Googlebot n'ayant jamais de cookie, il voit toujours la home canonique.
 */

export const CITY_COOKIE = "beew_city";
const ONE_YEAR = 60 * 60 * 24 * 365;

export function readCityCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${CITY_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function writeCityCookie(slug: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${CITY_COOKIE}=${encodeURIComponent(slug)}; path=/; max-age=${ONE_YEAR}; SameSite=Lax`;
}

export function clearCityCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${CITY_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

/**
 * Ville saisie mais inexistante : on reste sur la home et on enregistre la
 * demande. Ces logs sont la roadmap des prochaines pages à créer — de la
 * recherche de mots-clés fondée sur de la demande réelle et mesurée.
 */
export function logUnknownCity(input: string): void {
  if (typeof navigator === "undefined" || !input.trim()) return;
  const payload = JSON.stringify({ query: input.trim(), path: location.pathname });
  navigator.sendBeacon?.("/api/unknown-city", new Blob([payload], { type: "application/json" }));
}
