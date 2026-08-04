import type { Metadata } from "next";
import { BlocCoordonnees, BlocEtapes, BlocLiens, SectionFormulaire } from "@/components/forms/blocs";
import { Faq } from "@/components/home";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { getConversionPage } from "@/content/schemas/conversion";
import { conversionJsonLd, conversionMetadata } from "@/lib/seo-pages";

/**
 * /contact — page de conversion (PAGES.md §3).
 *
 * Ordre : formulaire d'abord, explications ensuite. Le visiteur qui arrive ici
 * a déjà décidé de nous écrire ; lui faire lire trois sections avant le
 * formulaire ne ferait que le perdre. Les blocs qui suivent servent à rassurer
 * ceux qui hésitent encore.
 *
 * Tout le texte vient de `src/content/pages/contact.json`, validé par Zod.
 */

const page = getConversionPage("contact");

export const metadata: Metadata = conversionMetadata(page);

const jsonLd = conversionJsonLd(page, "Contact");

export default function ContactPage() {
  return (
    <>
      <JsonLd data={jsonLd} />

      <PageHero
        fil={[
          { href: "/", label: "Accueil" },
          { href: "/contact", label: "Contact" },
        ]}
        surtitre={page.hero.surtitre}
        h1={page.hero.h1}
        intro={page.hero.intro}
        cta={{ href: "#formulaire", label: "Aller au formulaire" }}
        image={{ src: "/images/heros/contact.jpg" }}
      />

      <SectionFormulaire id="formulaire" formulaire={page.formulaire} ton="sombre" />

      {page.etapes && <BlocEtapes bloc={page.etapes} />}

      {page.coordonnees && <BlocCoordonnees bloc={page.coordonnees} ton="sombre" />}

      {page.faq && <Faq faq={page.faq} />}

      <BlocLiens bloc={page.liens} ton="sombre" />
    </>
  );
}
