import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CaseDeliverables,
  CaseNarrative,
  CaseNext,
  CaseResult,
  CaseTestimonial,
} from "@/components/cases/CaseSections";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import type { Case } from "@/content/schemas/case";
import { serviceLabel } from "@/content/schemas/case";
import { getAllCases, getCaseBySlug, getCaseCity, getNextCase } from "@/lib/cases";
import {
  ORG_ID,
  absolute,
  breadcrumbNode,
  buildGraph,
  organizationNode,
  pageMetadata,
  webPageNode,
  websiteNode,
} from "@/lib/seo";

/**
 * UNE route pour toutes les études de cas. Ajouter une étude = ajouter un JSON
 * dans src/content/cases/ — aucun code à écrire.
 */

// SSG intégral, comme les pages villes : une URL inconnue renvoie un vrai 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllCases().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cas = getCaseBySlug(slug);
  if (!cas) return {};

  return pageMetadata({
    path: `/realisations/${cas.slug}`,
    title: cas.meta.title,
    description: cas.meta.description,
    keywords: [serviceLabel(cas.service), cas.city, cas.sector.label],
    image: cas.hero.image,
    imageAlt: cas.client,
    type: "article",
    article: { modifiedTime: cas.updatedAt, section: serviceLabel(cas.service) },
    // Une étude en brouillon est consultable pour relecture, jamais indexée,
    // et ne transmet aucun signal.
    noindex: cas.status === "draft",
    nofollow: cas.status === "draft",
  });
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cas = getCaseBySlug(slug);
  if (!cas) notFound();

  const ville = getCaseCity(cas);
  const suivante = getNextCase(cas);

  return (
    <>
      <JsonLd data={jsonLd(cas, ville)} />

      {/* Le fil reprend exactement la hiérarchie du `BreadcrumbList` ci-dessus. */}
      <PageHero
        fil={[
          { href: "/", label: "Accueil" },
          { href: "/realisations", label: "Réalisations" },
          { href: `/realisations/${cas.slug}`, label: cas.client },
        ]}
        surtitre={`${cas.city} · ${cas.sector.label} · ${cas.year}`}
        h1={cas.hero.h1}
        intro={cas.hero.summary}
        badges={[cas.sector.label, serviceLabel(cas.service), cas.city]}
        image={{ src: cas.hero.image, alt: cas.hero.imageAlt }}
      />
      <CaseNarrative cas={cas} />
      <CaseResult cas={cas} />
      <CaseTestimonial cas={cas} />
      <CaseDeliverables cas={cas} ville={ville} />
      <CaseNext suivante={suivante} />
    </>
  );
}

function jsonLd(cas: Case, ville?: { slug: string; city: string }) {
  const chemin = `/realisations/${cas.slug}`;

  return buildGraph(
    organizationNode(),
    websiteNode(),
    webPageNode({
      path: chemin,
      type: "ItemPage",
      name: cas.meta.title,
      description: cas.meta.description,
      image: cas.hero.image,
      dateModified: cas.updatedAt,
    }),
    {
      "@type": "CreativeWork",
      "@id": `${absolute(chemin)}#case`,
      url: absolute(chemin),
      name: cas.meta.title,
      headline: cas.hero.h1,
      description: cas.meta.description,
      inLanguage: "fr-BE",
      image: absolute(cas.hero.image),
      dateModified: cas.updatedAt,
      genre: serviceLabel(cas.service),
      about: {
        "@type": "Organization",
        name: cas.client,
        address: { "@type": "PostalAddress", addressLocality: cas.city, addressCountry: "BE" },
      },
      author: { "@id": ORG_ID },
      publisher: { "@id": ORG_ID },
      // Le maillage déclaré doit refléter celui de la page : une étude sans
      // page ville liée ne cite pas cette page ville.
      mentions: [
        { "@type": "WebPage", url: absolute(`/${cas.service}`) },
        ...(ville ? [{ "@type": "WebPage", url: absolute(`/${ville.slug}`) }] : []),
      ],
      ...(cas.testimonial && {
        review: {
          "@type": "Review",
          reviewBody: cas.testimonial.quote,
          author: { "@type": "Person", name: cas.testimonial.author },
          reviewRating: {
            "@type": "Rating",
            ratingValue: cas.testimonial.rating,
            bestRating: 5,
          },
        },
      }),
    },
    breadcrumbNode(chemin, [
      { href: "/", label: "Accueil" },
      { href: "/realisations", label: "Réalisations" },
      { href: chemin, label: cas.client },
    ]),
  );
}
