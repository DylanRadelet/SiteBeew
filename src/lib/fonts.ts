import { Montserrat } from "next/font/google";
import localFont from "next/font/local";

/**
 * Deux polices, deux rôles :
 *  · Werk Neue   → titres et signature de marque (--font-display)
 *  · Montserrat  → repli du texte courant tant que PP Neue Montreal est absente
 *
 * Toutes self-hosted : aucun appel externe au runtime.
 * On ne déclare que les graisses réellement utilisées — chaque graisse
 * supplémentaire est un fichier téléchargé en plus par le visiteur.
 */

export const werkNeue = localFont({
  src: [
    { path: "../../public/fonts/Webfonts/Werk-Neue-Light.woff2", weight: "300", style: "normal" },
    { path: "../../public/fonts/Webfonts/Werk-Neue-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/Webfonts/Werk-Neue-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/Webfonts/Werk-Neue-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../../public/fonts/Webfonts/Werk-Neue-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-werk",
  display: "swap",
});

export const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-montserrat",
  display: "swap",
});
