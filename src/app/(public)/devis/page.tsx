import type { Metadata } from "next";
import { BlocCoordonnees, BlocEtapes, BlocLiens, SectionFormulaire } from "@/components/forms/blocs";
import { Faq } from "@/components/home";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { getConversionPage } from "@/content/schemas/conversion";
import { conversionJsonLd, conversionMetadata } from "@/lib/seo-pages";

/**
 * /devis — intention haute (PAGES.md §3).
 *
 * Différence avec /contact : ici les rappels passent AVANT le formulaire. Le
 * formulaire est long, on ne demande cet effort qu'après avoir dit ce qu'il
 * rapporte — devis fixe sous 48 h, rendez-vous sans frais ni engagement.
 *
 * Aucun témoignage sur cette page : ceux qui existent dans le contenu du site
 * sont des placeholders de développement (PAGES.md §4). Ils seront ajoutés ici
 * le jour où il y aura de vrais avis clients vérifiables.
 */

const page = getConversionPage("devis");

export const metadata: Metadata = conversionMetadata(page);

const jsonLd = conversionJsonLd(page, "Devis");

export default function DevisPage() {
  return (
    <>
      <JsonLd data={jsonLd} />

      <PageHero
        fil={[
          { href: "/", label: "Accueil" },
          { href: "/devis", label: "Devis" },
        ]}
        surtitre={page.hero.surtitre}
        h1={page.hero.h1}
        intro={page.hero.intro}
        cta={{ href: "#formulaire", label: "Aller au formulaire" }}
        image={{ src: "/images/heros/contact.jpg" }}
      />

      {page.rappels && <BlocEtapes bloc={page.rappels} ton="sombre" />}

      <SectionFormulaire id="formulaire" formulaire={page.formulaire} />

      {page.etapes && <BlocEtapes bloc={page.etapes} ton="sombre" />}

      {page.coordonnees && <BlocCoordonnees bloc={page.coordonnees} ton="clair" />}

      {/* FAQ VISIBLE — source du balisage `FAQPage` de la page. */}
      {page.faq && <Faq faq={page.faq} />}

      <BlocLiens bloc={page.liens} ton="sombre" />
    </>
  );
}
