import type { Metadata } from "next";
import { PageLegale } from "@/components/blog/PageLegale";
import { getLegalPage } from "@/content/schemas/legal";
import { legalMetadata } from "@/lib/seo-pages";

/**
 * Le JSON est lu à chaque rendu et non à l'import du module : sinon une
 * correction du contenu ne serait pas reprise sans redémarrer le serveur.
 */
export function generateMetadata(): Metadata {
  return legalMetadata(getLegalPage("mentions-legales"), "mentions-legales");
}

export default function MentionsLegalesPage() {
  return <PageLegale page={getLegalPage("mentions-legales")} />;
}
