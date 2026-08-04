import type { Metadata } from "next";
import { PageLegale } from "@/components/blog/PageLegale";
import { getLegalPage } from "@/content/schemas/legal";
import { legalMetadata } from "@/lib/seo-pages";

/**
 * Le JSON est lu à chaque rendu et non à l'import du module : sinon une
 * correction du contenu ne serait pas reprise sans redémarrer le serveur.
 */
export function generateMetadata(): Metadata {
  return legalMetadata(getLegalPage("politique-de-confidentialite"), "politique-de-confidentialite");
}

export default function PolitiqueDeConfidentialitePage() {
  return <PageLegale page={getLegalPage("politique-de-confidentialite")} />;
}
