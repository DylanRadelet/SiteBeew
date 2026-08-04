import type { Metadata } from "next";
import {
  BlocProse,
  
  FaqConfiance,
  GrillePoints,
  Maillage,
} from "@/components/confiance/blocs";
import { methodeJsonLd } from "@/components/confiance/jsonld";
import { Delais, EtapesDetail } from "@/components/confiance/methode";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { getMethode } from "@/content/schemas/confiance";
import { pageMetadata } from "@/lib/seo";

/**
 * /methode — deuxième page de confiance (PAGES.md §3).
 *
 * Elle répond à « comment ça va se passer, concrètement ? ». Les quatre étapes
 * sont détaillées avec, à chaque fois, ce que le client reçoit et ce qu'on
 * attend de lui : c'est cette symétrie qui désamorce la peur du projet qui
 * s'enlise.
 */

const m = getMethode();

export const metadata: Metadata = pageMetadata({
  path: "/methode",
  title: m.meta.title,
  description: m.meta.description,
  keywords: [
    "méthode création site internet",
    "étapes création site web",
    "délai création site internet",
  ],
  image: "/images/heros/methode.jpg",
});

export default function MethodePage() {
  return (
    <>
      <JsonLd data={methodeJsonLd(m)} />

      {/* Unique <h1> de la page — porté par le hero commun à tout le site. */}
      <PageHero
        fil={[
          { href: "/", label: "Accueil" },
          { href: "/methode", label: "Méthode" },
        ]}
        surtitre="Méthode"
        h1={m.hero.h1}
        intro={m.hero.intro}
        badges={m.hero.badges}
        cta={m.cta.bouton}
        image={{ src: "/images/heros/methode.jpg" }}
      />

      {/* Bloc sombre : trois sections claires s'enchaînaient en début de page. */}
      <BlocProse
        ton="sombre"
        surtitre={m.principe.surtitre}
        titre={m.principe.titre}
        paragraphes={m.principe.paragraphes}
      />

      <EtapesDetail etapes={m.etapes} />

      <Delais delais={m.delais} />

      <GrillePoints
        surtitre={m.attentes.surtitre}
        titre={m.attentes.titre}
        intro={m.attentes.intro}
        points={m.attentes.points}
      />

      <FaqConfiance
        ton="sombre"
        surtitre={m.faqEntete.surtitre}
        titre={m.faqEntete.titre}
        faq={m.faq}
      />

      <Maillage maillage={m.maillage} />

    </>
  );
}
