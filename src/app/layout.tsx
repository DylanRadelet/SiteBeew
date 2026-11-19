import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { montserrat, werkNeue } from "@/lib/fonts";
import { SITE_URL } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "BEEW", template: "%s" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr-BE" className={`${werkNeue.variable} ${montserrat.variable}`}>
      <body className="antialiased">
        {children}

        {/**
         * Mesure d'audience et performances terrain.
         *
         * Ces deux outils sont retenus parce qu'ils ne déposent NI cookie NI
         * identifiant persistant : aucun bandeau de consentement n'est requis
         * pour les charger, et rien ne vient donc s'intercaler devant le
         * contenu au chargement — ce que la politique du site interdit de
         * toute façon (pas d'interstitiel).
         *
         * `SpeedInsights` remonte les Core Web Vitals réellement mesurés chez
         * les visiteurs (LCP, INP, CLS), page par page. C'est la seule source
         * fiable : les scores Lighthouse sont des mesures de laboratoire.
         *
         * Aucune donnée saisie dans les formulaires ne transite par ces
         * scripts : ils n'observent que la navigation.
         */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
