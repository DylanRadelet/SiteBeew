import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Blocs, COLONNE_LECTURE } from "@/components/blog/Blocs";
import { CarteArticle, dateLisible } from "@/components/blog/CarteArticle";
import { Sommaire } from "@/components/blog/Sommaire";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { Fleche, Section, Surtitre } from "@/components/ui/section";
import { libelleTheme } from "@/content/schemas/blog";
import { getAllArticles, getArticleBySlug, getArticlesLies } from "@/lib/blog";
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
 * Un article. Comme les villes : une seule route, un JSON par article, aucun
 * dossier à créer. SSG intégral — une URL inconnue renvoie un vrai 404.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  return pageMetadata({
    path: `/blog/${article.slug}`,
    title: article.meta.title,
    description: article.meta.description,
    image: article.image,
    imageAlt: article.title,
    type: "article",
    article: {
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      section: libelleTheme(article.theme),
    },
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const lies = getArticlesLies(article.slug);

  const chemin = `/blog/${article.slug}`;
  const fil = [
    { href: "/", label: "Accueil" },
    { href: "/blog", label: "Journal" },
    { href: chemin, label: article.title },
  ];

  const jsonLd = buildGraph(
    organizationNode(),
    websiteNode(),
    webPageNode({
      path: chemin,
      name: article.meta.title,
      description: article.meta.description,
      image: article.image,
      datePublished: article.publishedAt,
      dateModified: article.updatedAt,
    }),
    {
      "@type": "Article",
      "@id": `${absolute(chemin)}#article`,
      headline: article.title,
      description: article.meta.description,
      url: absolute(chemin),
      mainEntityOfPage: { "@id": `${absolute(chemin)}#webpage` },
      inLanguage: "fr-BE",
      datePublished: article.publishedAt,
      dateModified: article.updatedAt,
      image: absolute(article.image),
      wordCount: article.motsCount,
      timeRequired: `PT${article.minutesLecture}M`,
      articleSection: libelleTheme(article.theme),
      // L'auteur est l'agence, jamais une personne inventée.
      author: { "@id": ORG_ID },
      publisher: { "@id": ORG_ID },
    },
    breadcrumbNode(chemin, fil),
  );

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Fil identique au `BreadcrumbList` : Accueil → Journal → titre. */}
      <PageHero
        fil={fil}
        surtitre={libelleTheme(article.theme)}
        h1={article.title}
        intro={article.excerpt}
        cta={null}
        image={{ src: article.image }}
      />

      {/* ------------------------------------------------ Corps ----------- */}
      <Section className="!pt-0">
        <p className={`${COLONNE_LECTURE} flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] tracking-[0.15em] text-beew-noir/45 uppercase`}>
          <span>{article.author}</span>
          <span aria-hidden>·</span>
          <time dateTime={article.publishedAt}>{dateLisible(article.publishedAt)}</time>
          <span aria-hidden>·</span>
          <span>{article.minutesLecture} min de lecture</span>
        </p>

        {article.updatedAt !== article.publishedAt && (
          <p className={`${COLONNE_LECTURE} mt-3 text-[11px] text-beew-noir/40`}>
            Mis à jour le{" "}
            <time dateTime={article.updatedAt}>{dateLisible(article.updatedAt)}</time>
          </p>
        )}

        <div className="mt-12">
          <Sommaire entrees={article.sommaire} />
        </div>

        <div className="mt-16">
          <Blocs blocs={article.body} />
        </div>

        <div className={`${COLONNE_LECTURE} mt-16 border-t-2 border-beew-orange pt-10`}>
          <h2 className="text-[clamp(1.4rem,2.6vw,2rem)] leading-tight font-semibold tracking-tight">
            {article.conclusion.titre}
          </h2>
          <p className="mt-6 text-[17px] leading-[1.75] text-beew-noir/75">
            {article.conclusion.texte}
          </p>
        </div>

        <p className={`${COLONNE_LECTURE} mt-12 text-xs leading-relaxed text-beew-noir/45`}>
          Écrit par {article.author}. Les ordres de grandeur cités sont ceux que nous constatons sur
          nos propres dossiers : ce sont des observations d&apos;agence, pas des données issues
          d&apos;une étude publiée.
        </p>
      </Section>

      {/* ------------------------------------------- Articles liés --------
          Bloc sombre : il referme la lecture et rompt l'enfilade de sections
          claires du corps de l'article. */}
      {lies.length > 0 && (
        <Section ton="sombre">
          <div className="flex flex-wrap items-baseline justify-between gap-6">
            <Surtitre ton="sombre">À lire ensuite</Surtitre>
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 border-b border-beew-creme/30 pb-1 text-[11px] tracking-[0.2em] uppercase hover:border-beew-creme"
            >
              Tous les articles
              <Fleche />
            </Link>
          </div>

          <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2">
            {lies.map((a, i) => (
              <CarteArticle key={a.slug} article={a} retard={i * 90} compacte />
            ))}
          </div>
        </Section>
      )}

    </>
  );
}
