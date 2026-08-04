import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  /**
   * Volontairement AUCUN middleware et aucune redirection géographique.
   *
   * Toute redirection basée sur l'IP, la géolocalisation ou un cookie
   * transformerait chaque réponse en réponse unique : plus de cache CDN, plus
   * de SSG, et un comportement différent entre Googlebot et les visiteurs.
   * La personnalisation vit exclusivement côté client (voir src/lib/city-cookie.ts).
   */
  async redirects() {
    return [];
  },
};

export default nextConfig;
