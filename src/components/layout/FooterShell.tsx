"use client";

import { usePathname } from "next/navigation";
import { Footer, PiedDePageInterne } from "@/components/home/sections";

/**
 * Sélectionne l'un des DEUX pieds de page du site — il ne doit jamais y en
 * avoir un troisième.
 *
 *  · home  — la conclusion et la signature géante « BEEW AGENCY » sont rendues
 *            par la page elle-même ; ici on n'ajoute que les colonnes.
 *  · pages internes — conclusion + colonnes, calées sur la hauteur de l'écran.
 *
 * Le choix se fait sur le pathname côté client : le layout serveur ne connaît
 * pas la route, et dupliquer le pied de page dans chaque page casserait la
 * garantie « deux variantes, pas plus ».
 */
export function FooterShell({ provinces }: { provinces: { slug: string; name: string }[] }) {
  const pathname = usePathname();

  if (pathname === "/") return <Footer provinces={provinces} />;
  return <PiedDePageInterne provinces={provinces} />;
}
