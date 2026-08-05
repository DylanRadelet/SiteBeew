import type { Metadata } from "next";
import { ListeFiltrable } from "@/components/blog/ListeFiltrable";
import { Faq } from "@/components/home";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/section";
import { getAllArticles, getThemesUtilises } from "@/lib/blog";
import { listeJsonLd, listeMetadata, type ListeOptions } from "@/lib/seo-pages";

/**
 * Index du blog. Tous les articles sont dans le HTML statique ; le filtre par
 * thème est purement CSS (voir `ListeFiltrable`) pour qu'aucun contenu ne
 * dépende de JavaScript pour être crawlé.
 */

/**
 * FAQ VISIBLE. L'index ne comptait que 231 mots de contenu propre : une page de
 * listing sans texte à elle n'a rien à faire remonter. Ces réponses traitent les
 * questions que les articles développent, et servent de source au balisage.
 */
const FAQ = [
  {
    question: "Combien coûte un site internet en Belgique en 2026 ?",
    answer:
      "Un site vitrine professionnel se situe entre 2 400 et 5 000 € hors TVA selon le nombre de pages et le travail de rédaction, une boutique en ligne démarre autour de 4 000 €, et un projet sur mesure dépasse généralement 7 000 €. En dessous de 1 500 €, il s'agit presque toujours d'un gabarit acheté et rempli, ce qui peut convenir mais ne doit pas être vendu comme du sur-mesure. L'article détaillé décompose chaque poste.",
  },
  {
    question: "Au bout de combien de temps un site commence-t-il à ranker ?",
    answer:
      "Comptez trois à six mois pour des requêtes locales peu disputées, six à douze mois pour des requêtes plus larges, et à condition de soutenir l'effort par une fiche Google Business Profile active et des avis clients réguliers. Un site neuf ne dispose d'aucun historique : c'est ce qui explique l'essentiel du délai, bien plus que la qualité technique de sa construction.",
  },
  {
    question: "Le référencement local fonctionne-t-il vraiment pour une petite entreprise ?",
    answer:
      "C'est même le seul terrain où une petite structure bat structurellement les gros acteurs. Sur une recherche géographique, Google privilégie la proximité et la pertinence locale plutôt que la taille du site. Une fiche à jour, des avis récents et des pages qui nomment réellement les communes servies suffisent souvent à occuper les premières positions d'un bassin, sans budget publicitaire.",
  },
  {
    question: "Peut-on refaire son site sans perdre ses positions Google ?",
    answer:
      "Oui, à condition d'établir un plan de redirections page par page avant la bascule, et de ne pas amputer les contenus qui fonctionnaient. Les pertes durables après une refonte viennent presque toujours de là : des adresses qui changent sans redirection, ou des textes raccourcis pour aérer une maquette. Une baisse temporaire de deux à quatre semaines reste normale.",
  },
  {
    question: "Faut-il un blog pour être visible sur Google ?",
    answer:
      "Pas systématiquement, et nous déconseillons d'en ouvrir un sans avoir de quoi l'alimenter : un blog abandonné depuis deux ans dessert plus qu'il ne sert. Il devient rentable quand votre clientèle se pose des questions avant d'acheter et que vous pouvez y répondre mieux que les autres. Pour un commerce de proximité, la fiche Google Business Profile produit généralement davantage.",
  },
];

const LISTE = {
  path: "/blog",
  nom: "Blog",
  title: "Blog : prix, référencement et refonte de site internet",
  description:
    "Les articles de BEEW sur le budget d'un site internet, le référencement local en Wallonie et la refonte sans perte de positions. Sans jargon ni promesse creuse.",
  keywords: [
    "prix site internet Belgique",
    "référencement local Wallonie",
    "refonte site internet",
    "blog agence web",
  ],
  image: "/images/heros/journal-actualite.jpg",
  items: [] as { href: string; label: string }[],
  faq: FAQ,
} satisfies ListeOptions;

export const metadata: Metadata = listeMetadata(LISTE);

export default function BlogIndexPage() {
  const articles = getAllArticles();
  const themes = getThemesUtilises();

  const jsonLd = listeJsonLd({
    ...LISTE,
    items: articles.map((a) => ({ href: `/blog/${a.slug}`, label: a.title })),
  });

  return (
    <>
      <JsonLd data={jsonLd} />

      <PageHero
        fil={[
          { href: "/", label: "Accueil" },
          { href: "/blog", label: "Journal" },
        ]}
        surtitre="Blog"
        h1="Ce qu'on apprend en construisant des sites"
        intro="Des articles écrits par ceux qui font le travail : budgets réels, référencement local, refontes qui tournent mal. Aucune statistique inventée, aucune promesse de position. Ce que nous constatons sur nos propres dossiers, dit tel quel."
        cta={{ href: "/contact", label: "Parler de votre projet" }}
        image={{ src: "/images/heros/journal-actualite.jpg" }}
      />

      <Section>
        <ListeFiltrable articles={articles} themes={themes} />
      </Section>

      <Faq faq={FAQ} />

    </>
  );
}
