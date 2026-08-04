import fs from "node:fs";
import path from "node:path";
import {
  ArticleSchema,
  compterMots,
  minutesDeLecture,
  type ArticleRendu,
  type BlogTheme,
} from "@/content/schemas/blog";

/**
 * Chargement + validation des articles au BUILD (Server Components / SSG).
 * Toute erreur ici casse volontairement le rendu : un article publié est un
 * article qui a passé le seuil de volume et le contrôle de maillage.
 */

const BLOG_DIR = path.join(process.cwd(), "src", "content", "blog");

let cache: ArticleRendu[] | null = null;

export function getAllArticles(): ArticleRendu[] {
  if (cache) return cache;

  const fichiers = fs.existsSync(BLOG_DIR)
    ? fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".json"))
    : [];

  const articles = fichiers.map((fichier) => {
    const raw: unknown = JSON.parse(fs.readFileSync(path.join(BLOG_DIR, fichier), "utf-8"));
    const parsed = ArticleSchema.safeParse(raw);
    if (!parsed.success) {
      const lignes = parsed.error.issues.map(
        (i) => `  · ${i.path.join(".") || "(racine)"} — ${i.message}`,
      );
      throw new Error(`Contenu invalide dans blog/${fichier} :\n${lignes.join("\n")}`);
    }
    if (parsed.data.slug !== fichier.replace(/\.json$/, "")) {
      throw new Error(
        `[blog/${fichier}] Le nom du fichier doit correspondre au slug ("${parsed.data.slug}.json").`,
      );
    }

    const article = parsed.data;
    const mots = compterMots(article);

    return {
      ...article,
      motsCount: mots,
      // Calculé, jamais saisi : un temps de lecture écrit à la main dérive dès
      // la première correction du texte.
      minutesLecture: minutesDeLecture(mots),
      sommaire: article.body.flatMap((b) =>
        b.type === "titre" && b.niveau === 2 ? [{ id: b.id, texte: b.texte }] : [],
      ),
    } satisfies ArticleRendu;
  });

  assertSlugsUniques(articles);

  // Le plus récent d'abord : c'est l'ordre attendu sur un index de blog.
  cache = articles.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return cache;
}

export function getArticleBySlug(slug: string): ArticleRendu | undefined {
  return getAllArticles().find((a) => a.slug === slug);
}

/** Thèmes réellement représentés, dans l'ordre d'apparition des articles. */
export function getThemesUtilises(): BlogTheme[] {
  return [...new Set(getAllArticles().map((a) => a.theme))];
}

/**
 * Articles liés : on privilégie le même thème, puis on complète avec les plus
 * récents. Les liens sont calculés et non saisis dans le JSON — un slug écrit
 * à la main devient un lien mort dès qu'un article est renommé.
 */
export function getArticlesLies(slug: string, limite = 2): ArticleRendu[] {
  const tous = getAllArticles();
  const courant = tous.find((a) => a.slug === slug);
  if (!courant) return [];

  const autres = tous.filter((a) => a.slug !== slug);
  const memeTheme = autres.filter((a) => a.theme === courant.theme);
  const reste = autres.filter((a) => a.theme !== courant.theme);

  return [...memeTheme, ...reste].slice(0, limite);
}

function assertSlugsUniques(articles: { slug: string }[]): void {
  const vus = new Set<string>();
  for (const a of articles) {
    if (vus.has(a.slug)) throw new Error(`Slug d'article dupliqué : "${a.slug}".`);
    vus.add(a.slug);
  }
}
