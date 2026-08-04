# BEEW Agency — Site web

Site de l'agence BEEW (Luxembourg belge / Wallonie). Next.js 15 (App Router) + TypeScript + Tailwind v4.
Stratégie : **pSEO local** — une page par ville, contenu réellement unique, home généraliste qui distribue l'autorité.

---

## 1. Les règles SEO non négociables

Ces règles priment sur toute autre considération. Si une demande les contredit, signale-le avant d'implémenter.

### La ligne rouge

> **Tout ce qui est personnalisation reste côté client et réversible.
> Tout ce qui est structure SEO reste statique et identique pour tous.**

Googlebot et un visiteur anonyme doivent recevoir **exactement le même HTML** pour une URL donnée.

### Interdits absolus

| Interdit | Pourquoi |
|---|---|
| Redirection serveur/middleware basée sur IP, géoloc ou cookie | Cloaking + casse le cache CDN et le SSG |
| `middleware.ts` qui varie la réponse selon un cookie | Chaque réponse devient unique → plus de edge cache → CWV effondrés |
| Logo pointant ailleurs que `/` | Le lien interne le plus répété du site ; définit la racine de la hiérarchie |
| Modale/interstitiel au chargement | Sanction Google sur mobile (intrusive interstitials) + CLS |
| Page ville générée par simple substitution `{{ville}}` | Doorway page — spam policy Google, risque sur tout le domaine |
| Contenu SEO injecté en JS après hydratation | Non fiable au crawl ; tout le contenu qui doit ranker est dans le HTML statique |
| `noindex` / `canonical` cross-page sur les pages villes | Chaque page ville est auto-canonique |

### Obligatoires

- **Toutes les pages sont SSG** (`generateStaticParams`, aucun `dynamic = 'force-dynamic'`).
- **Canonical auto-référent** sur chaque page.
- **JSON-LD** `LocalBusiness` + `Service` + `FAQPage` sur chaque page ville.
- Le **bloc sélecteur de ville du hero** et le **sélecteur du header** sont rendus en HTML statique avec de vrais `<a href>` → ce sont des liens de maillage, pas des `onClick`.
- Chaque page ville lie vers **4 à 6 villes voisines** (`nearby`) — minimum 2 tant que le réseau est petit, jamais toutes. Le hub `/zones-d-intervention` est la seule page qui les liste toutes ; le footer plafonne à 12.
- **Une seule verticale de service** tant que la première ne rank pas (création site web × villes).

---

## 2. Règle de contenu : le seuil des 40%

Une page ville doit contenir **au minimum 40% de contenu unique**, non dérivable du template.

Le schéma Zod (`src/content/schema.ts`) **impose** ce seuil et **casse le build** si une ville est bâclée :

- `localContext.body` : ≥ 250 mots réellement spécifiques à la ville
- `cases` : ≥ 2 réalisations réelles dans/près de la zone
- `testimonials` : ≥ 1 témoignage client nommé et localisé
- `faq` : ≥ 3 questions, dont ≥ 2 mentionnant explicitement la ville
- `coverage` : ≥ 5 communes environnantes
- **Détection de duplication croisée** : si deux villes partagent > 35% de phrases identiques, le build échoue.

> **Si tu ne peux pas écrire 300 mots vraiment spécifiques sur une ville, ne crée pas la page.**
> Ne contourne jamais la validation en assouplissant le schéma. Le garde-fou est le point le plus important du projet.

Le contexte local doit parler du **tissu économique réel** : Arlon = frontaliers Luxembourg, pouvoir d'achat élevé, concurrence des agences luxembourgeoises. Bastogne = tourisme mémoriel, saisonnalité, besoin multilingue EN/NL. Ce sont deux textes qui n'ont rien en commun.

---

## 3. Architecture

```
src/
  app/
    (public)/
      layout.tsx              Header + Footer
      page.tsx                HOME — SEO large, distribue vers les villes
      [slug]/page.tsx         Pages villes — SSG via generateStaticParams
    sitemap.ts  robots.ts  globals.css
  components/
    home/                     Composants partagés home + villes (Hero, LocalContext, Cases…)
    layout/                   Header (logo → `/`), Footer
    geo/                      CitySelector, CityBanner — client-side uniquement
  content/
    schema.ts                 Zod : LE garde-fou anti-thin-content
    global.json               Contenu de la home
    cities/<slug>.json        Un fichier = une ville = une page
  lib/
    cities.ts                 Loader + validation + détection de duplication (build time)
    seo.ts                    Metadata + JSON-LD
    city-cookie.ts            Cookie `beew_city` — client only
```

**Ajouter une ville = ajouter un JSON.** Aucun code à écrire. Si une tâche demande de créer un dossier de route par ville, c'est une erreur : la route `[slug]` couvre tout.

### URLs

Format : **`/creation-site-internet-<ville>`**.

« Site internet » et non « site web » : sur la SERP belge francophone, les concurrents titrent massivement
« site internet » (6 sur 7 sur la requête Arlon). Le terme est le belgicisme dominant pour cette intention
commerciale. Ne pas revenir en arrière sans données Keyword Planner contradictoires — et jamais après
indexation sans plan de redirections 301.

Verticales futures (à n'ouvrir qu'après ranking de la première) : `/refonte-site-internet-<ville>`,
`/referencement-seo-<ville>`, `/site-e-commerce-<ville>`.

### Cycle de vie d'une page ville : `draft` → `published`

`status` vaut `draft` par défaut. Une ville en brouillon est générée pour relecture mais :
`noindex, nofollow`, absente du sitemap, absente du sélecteur, du header, du footer et des `nearby`.

Passer en `published` exige **des preuves réelles** — le schéma le refuse sinon :
≥ 2 réalisations et ≥ 1 témoignage client vérifiable.

> ⚠️ Les réalisations et témoignages des villes de départ (Arlon, Bastogne, Libramont) sont des
> **placeholders de développement**. Ce sont des entreprises et des personnes inventées.
> Ils doivent être remplacés par de vrais clients avant toute publication : un faux avis est une
> pratique commerciale déloyale au sens du droit belge et européen, indépendamment du risque SEO.
> C'est précisément pour cela que ces trois villes sont en `draft`.

---

## 4. Comportement géo côté client

Trois mécanismes, tous **client-side**, tous **réversibles** :

1. **Sélecteur du hero (home)** — HTML statique, `<a href>` vers chaque ville. Crawlable. C'est le maillage principal home → villes.
2. **Sélecteur `📍 Ville ▾` du header** — présent sitewide, liens réels vers les villes.
3. **Cookie `beew_city`** (1 an) — écrit à la visite d'une page ville ou au choix explicite.
   - Sur `/`, il affiche un **bandeau** « Vous consultiez notre offre à Arlon → y retourner ».
   - **Jamais de redirection automatique.** Si elle est un jour demandée : client-side, 1× par session (flag `sessionStorage`), jamais après un retour arrière, et sessions exclues des analytics.

**Ville saisie et inconnue** → on reste sur `/`, on affiche le formulaire de contact, **et on logge la saisie**. Ces logs sont la roadmap des prochaines pages : demande réelle et mesurée.

---

## 5. Conventions de code

- TypeScript strict, aucun `any`. Les types de contenu sont **inférés depuis Zod** (`z.infer`), jamais écrits à la main en double.
- Server Components par défaut. `"use client"` uniquement dans `components/geo/` et le sélecteur du header.
- Aucun accès `document` / `localStorage` / `navigator` hors d'un `useEffect`.
- Les composants de `components/home/` sont partagés entre la home et les pages villes : ils reçoivent leurs données en props, ne lisent jamais un JSON directement.
- Tailwind v4, pas de fichier de config — les tokens vivent dans `@theme` dans `globals.css`.

## 6. Commandes

```bash
npm run dev
npm run build      # exécute la validation Zod de toutes les villes — doit passer avant tout commit
npm run lint
```

Le build **est** le test de qualité du contenu. Un build vert = aucune page thin, aucune duplication croisée.
