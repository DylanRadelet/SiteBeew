import { CarteArticle } from "@/components/blog/CarteArticle";
import { libelleTheme, type BlogTheme } from "@/content/schemas/blog";
import type { ArticleRendu } from "@/content/schemas/blog";

/**
 * Index filtrable par thème, SANS JavaScript.
 *
 * Des boutons radio masqués pilotent l'affichage en CSS. Deux raisons de ne
 * pas passer par un composant client :
 *  · tous les articles restent dans le HTML statique, donc tous crawlables —
 *    un filtre JS qui ne rendrait que la sélection ferait disparaître du
 *    contenu au crawl ;
 *  · le filtre continue de fonctionner sans JS et sans coût d'hydratation.
 *
 * Le CSS est généré ici plutôt que dans `globals.css` : il dépend de la liste
 * des thèmes réellement présents, que seul le contenu connaît.
 */

const TOUS = "tous";

export function ListeFiltrable({
  articles,
  themes,
}: {
  articles: ArticleRendu[];
  themes: BlogTheme[];
}) {
  const options = [TOUS, ...themes];

  const css = themes
    .map(
      (t) => `
#filtre-${t}:checked ~ [data-liste] li:not([data-theme="${t}"]) { display: none; }
#filtre-${t}:checked ~ [data-onglets] label[for="filtre-${t}"] {
  background: var(--color-beew-noir); color: var(--color-beew-creme); border-color: var(--color-beew-noir);
}
#filtre-${t}:focus-visible ~ [data-onglets] label[for="filtre-${t}"] { outline: 2px solid var(--color-beew-orange); outline-offset: 3px; }`,
    )
    .join("\n");

  const base = `
#blog-filtre input[name="theme-blog"] { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
#filtre-${TOUS}:checked ~ [data-onglets] label[for="filtre-${TOUS}"] {
  background: var(--color-beew-noir); color: var(--color-beew-creme); border-color: var(--color-beew-noir);
}
#filtre-${TOUS}:focus-visible ~ [data-onglets] label[for="filtre-${TOUS}"] { outline: 2px solid var(--color-beew-orange); outline-offset: 3px; }`;

  return (
    <div id="blog-filtre">
      {/* `dangerouslySetInnerHTML` : React échapperait les `>` du CSS en `&gt;`. */}
      <style dangerouslySetInnerHTML={{ __html: base + css }} />

      {options.map((o) => (
        <input
          key={o}
          type="radio"
          name="theme-blog"
          id={`filtre-${o}`}
          defaultChecked={o === TOUS}
        />
      ))}

      <div data-onglets className="flex flex-wrap gap-3">
        {options.map((o) => (
          <label
            key={o}
            htmlFor={`filtre-${o}`}
            className="cursor-pointer rounded-full border border-beew-noir/20 px-5 py-2.5 text-[11px] tracking-[0.2em] uppercase transition-colors hover:border-beew-noir/50"
          >
            {o === TOUS ? "Tous les sujets" : libelleTheme(o as BlogTheme)}
            <span className="ml-2 opacity-45">
              {o === TOUS ? articles.length : articles.filter((a) => a.theme === o).length}
            </span>
          </label>
        ))}
      </div>

      <ul data-liste className="mt-14 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((a, i) => (
          <li key={a.slug} data-theme={a.theme}>
            <CarteArticle article={a} retard={i * 70} />
          </li>
        ))}
      </ul>
    </div>
  );
}
