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
    return [
      /**
       * UNIFICATION DE L'HÔTE — `beew.agency` → `www.beew.agency`.
       *
       * Les deux noms servaient le site en 200. Search Console comptait donc
       * deux pages distinctes pour une même URL : `beew.agency/a-propos`
       * cumulait à lui seul 742 impressions et 10 clics, soit la deuxième
       * page la plus cliquée du site, sur l'hôte qui n'est pas le canonique.
       *
       * Le canonical pointait déjà vers `www`, ce qui limitait la casse, mais
       * un canonical est une indication : seule une redirection transfère
       * réellement l'autorité et supprime la duplication de crawl.
       *
       * ANCRAGE OBLIGATOIRE. Next n'ancre PAS la valeur d'un `has` de type
       * host : écrite `beew\.agency`, l'expression est satisfaite aussi par
       * `www.beew.agency`, qui se redirigerait alors vers lui-même — boucle
       * infinie, site entièrement hors ligne. Les `^` et `$` sont donc ce qui
       * sépare cette règle d'une panne totale. Ne jamais les retirer.
       *
       * Vérification après chaque build :
       *   node -e "const m=require('./.next/routes-manifest.json');
       *   const h=m.redirects.find(r=>r.has?.[0]?.type==='host').has[0].value;
       *   console.log(new RegExp(h).test('www.beew.agency') ? 'BOUCLE' : 'ok')"
       */
      {
        source: "/:chemin*",
        has: [{ type: "host", value: "^beew\\.agency$" }],
        destination: "https://www.beew.agency/:chemin*",
        permanent: true,
      },

      /**
       * PLAN DE REDIRECTIONS DE L'ANCIEN SITE.
       *
       * La refonte a changé toute l'arborescence sans que ces règles soient
       * posées : cinq adresses connues de Google renvoyaient une erreur 404,
       * dont `/services/creation-site-web`, qui portait les positions locales.
       * C'est la cause de la perte de classement, et non le contenu.
       *
       * `permanent: true` émet un 308 — l'équivalent moderne du 301 : il
       * transfère l'autorité accumulée vers la nouvelle adresse, là où un 302
       * la retiendrait sur l'ancienne.
       *
       * Ces règles ne s'enlèvent JAMAIS. Une redirection supprimée est un lien
       * externe cassé, et des liens vers ces adresses existent encore.
       */
      {
        source: "/services/creation-site-web",
        destination: "/creation-site-internet",
        permanent: true,
      },
      {
        source: "/services/developpement-application-web",
        destination: "/application-web",
        permanent: true,
      },
      {
        // Le paiement mensuel n'a pas de page dédiée : la page tarifs porte
        // l'échelonnement, c'est l'équivalent le plus proche en intention.
        source: "/services/site-web-paiement-mensuel",
        destination: "/tarifs",
        permanent: true,
      },
      {
        // L'index des services devient le pilier principal, pas l'accueil :
        // rediriger un index vers la racine est le réflexe qui dilue le signal.
        source: "/services",
        destination: "/creation-site-internet",
        permanent: true,
      },
      { source: "/legal/cgv", destination: "/conditions-generales", permanent: true },
      { source: "/legal/mentions-legales", destination: "/mentions-legales", permanent: true },
      {
        source: "/legal/confidentialite",
        destination: "/politique-de-confidentialite",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
