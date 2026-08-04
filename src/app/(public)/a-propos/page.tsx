import type { Metadata } from "next";
import { Chiffres, Equipe, Histoire, Zone } from "@/components/confiance/apropos";
import { FaqConfiance, GrillePoints, Maillage } from "@/components/confiance/blocs";
import { aProposJsonLd } from "@/components/confiance/jsonld";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { getAPropos } from "@/content/schemas/confiance";
import { pageMetadata } from "@/lib/seo";

/**
 * /a-propos — première des trois pages de confiance (PAGES.md §3).
 *
 * Elle répond à « à qui je confie mon argent ? ». L'ordre suit celui des
 * objections : d'abord pourquoi l'agence existe, ensuite ce qu'elle s'engage à
 * faire, puis qui travaille, ce qui est mesurable et enfin où elle se déplace.
 */

const a = getAPropos();

export const metadata: Metadata = pageMetadata({
  path: "/a-propos",
  title: a.meta.title,
  description: a.meta.description,
  keywords: [
    "agence web province de Luxembourg",
    "qui sommes-nous agence web",
    "agence web indépendante Wallonie",
  ],
  image: "/images/heros/agence.jpg",
});

export default function AProposPage() {
  return (
    <>
      <JsonLd data={aProposJsonLd(a)} />

      {/* Unique <h1> de la page — porté par le hero commun à tout le site. */}
      <PageHero
        fil={[
          { href: "/", label: "Accueil" },
          { href: "/a-propos", label: "L'agence" },
        ]}
        surtitre="L'agence"
        h1={a.hero.h1}
        intro={a.hero.intro}
        badges={a.hero.badges}
        cta={a.cta.bouton}
        image={{ src: "/images/heros/agence.jpg" }}
      />

      <Histoire histoire={a.histoire} />

      <GrillePoints
        ton="sombre"
        surtitre={a.convictions.surtitre}
        titre={a.convictions.titre}
        intro={a.convictions.intro}
        points={a.convictions.points}
      />

      <Equipe equipe={a.equipe} />

      <Chiffres chiffres={a.chiffres} />

      <Zone zone={a.zone} />

      {/* FAQ VISIBLE — elle est la source du balisage `FAQPage` de la page.
          Baliser des questions absentes de l'écran est interdit par Google. */}
      <FaqConfiance
        ton="sombre"
        surtitre={a.faqEntete.surtitre}
        titre={a.faqEntete.titre}
        faq={a.faq}
      />

      <Maillage maillage={a.maillage} />

    </>
  );
}
