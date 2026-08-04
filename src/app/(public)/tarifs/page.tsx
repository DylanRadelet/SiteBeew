import type { Metadata } from "next";
import { BlocProse,  FaqConfiance, Maillage } from "@/components/confiance/blocs";
import { tarifsJsonLd } from "@/components/confiance/jsonld";
import { Formules, Options, Perimetre } from "@/components/confiance/tarifs";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { getTarifs } from "@/content/schemas/confiance";
import { pageMetadata } from "@/lib/seo";

/**
 * /tarifs — troisième page de confiance (PAGES.md §3).
 *
 * Elle répond à « combien, et qu'est-ce qui va s'ajouter après ? ». D'où la
 * section « périmètre » : afficher ce qui n'est PAS compris est ce qui lève
 * réellement l'objection du devis qui gonfle — bien plus qu'une liste
 * d'inclusions de plus.
 */

const t = getTarifs();

export const metadata: Metadata = pageMetadata({
  path: "/tarifs",
  title: t.meta.title,
  description: t.meta.description,
  keywords: [
    "prix site internet Belgique",
    "tarif création site web",
    "combien coûte un site internet",
  ],
  image: "/images/heros/tarifs.jpg",
});

export default function TarifsPage() {
  return (
    <>
      <JsonLd data={tarifsJsonLd(t)} />

      {/* Unique <h1> de la page — porté par le hero commun à tout le site. */}
      <PageHero
        fil={[
          { href: "/", label: "Accueil" },
          { href: "/tarifs", label: "Tarifs" },
        ]}
        surtitre="Tarifs"
        h1={t.hero.h1}
        intro={t.hero.intro}
        badges={t.hero.badges}
        cta={t.cta.bouton}
        image={{ src: "/images/heros/tarifs.jpg" }}
      />

      {/* Bloc sombre : trois sections claires s'enchaînaient en début de page. */}
      <BlocProse
        ton="sombre"
        surtitre={t.principe.surtitre}
        titre={t.principe.titre}
        paragraphes={t.principe.paragraphes}
      />

      <Formules formules={t.formules} note={t.note} cta={t.cta.bouton} />

      <Perimetre perimetre={t.perimetre} />

      <Options options={t.options} />

      <FaqConfiance ton="sombre" surtitre={t.faqEntete.surtitre} titre={t.faqEntete.titre} faq={t.faq} />

      <Maillage maillage={t.maillage} />

    </>
  );
}
