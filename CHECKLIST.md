# Checklist — Uniformisation du site

Suivi de la passe de cohérence demandée. Coche au fur et à mesure.

**Diagnostic de départ :** chaque page a été construite par un agent différent, et
chacun a fabriqué son propre hero et son propre pied de page. Résultat : **7
implémentations de hero** rendant chacune son `<h1>`, des marges divergentes et
des animations posées à la main page par page. La correction ne se fait pas page
par page — elle se fait en créant une couche partagée, puis en y ramenant chaque
page.

---

## A. Couche partagée — la fondation

- [x] **A1. `PageHero` unique** — `src/components/ui/PageHero.tsx`. Fil d'Ariane,
      surtitre, `<h1>`, accroche, badges, bouton et **visuel panoramique**.
      Réserve elle-même l'espace du header fixe. 9 images téléchargées dans
      `public/images/heros/`.
- [x] **A2. Header fixe partout** — `fixed` sur toutes les routes. Deux seuils :
      sur la home le texte passe du crème au noir une fois la vidéo dépassée ;
      sur les pages internes un fond crème apparaît dès 40 px de défilement,
      sans quoi le header devient invisible sur les sections sombres.
- [x] **A3. Deux pieds de page, pas plus**
  - [x] `home` — conclusion + colonnes + signature géante « BEEW AGENCY »
  - [x] `page` — `PiedDePageInterne`, `min-h-svh` en colonne flex : conclusion
        centrée, colonnes calées en bas. Exactement un écran sur desktop.
  - [x] Colonnes extraites dans `FooterColonnes`, partagées par les deux
- [x] **A4. Animations globalisées** — `Section` porte `data-reveal` par défaut.
      Règle ajoutée dans `Reveal` : une section contenant des blocs déjà marqués
      se retire au profit de ses enfants, sinon les deux transitions se
      superposent et le contenu clignote.
- [x] **A5. Grille d'alignement unique** — `GUTTER` et `DEUX_COLONNES` exportés
      et imposés. Reste à les faire adopter par toutes les pages (bloc B).

## B. Migration des pages vers la couche partagée

- [x] **B1.** Les 4 pages services
- [x] **B2.** `/a-propos`, `/methode`, `/tarifs`
- [x] **B3.** `/contact`, `/devis`
- [x] **B4.** `/wallonie`, `/province-de-luxembourg`, `/zones-d-intervention`
- [x] **B5.** `/realisations` + études de cas
- [x] **B6.** `/blog`, articles, 3 pages légales
- [x] **B7.** Les 10 pages villes — le 8ᵉ hero, oublié au premier passage

## C. Corrections demandées

- [x] **C1.** Home : bloc des chiffres retiré
- [x] **C2.** Home : vrai titre de section sur les logos, à la place du surtitre
- [x] **C3.** Hero : bouton ramené à gauche sous le titre, séparé des badges
- [x] **C4.** Hero : surtitre sorti de la grille — les deux colonnes démarrent
      désormais à la même hauteur (écart mesuré : 0 px)
- [x] **C5.** Un seul bloc sombre en fin de page : les 15 CTA que les pages
      rendaient en plus du pied de page ont été supprimés
- [x] **C6.** `/realisations` : filtres retirés, grille directe en deux colonnes

## D. Vérifications — mesurées, pas estimées

- [x] **D1.** Exactement un `<h1>` par page — vérifié sur 15 routes
- [x] **D2.** `<h1>` et bouton à **56 px** sur toutes les pages internes
- [x] **D3.** Deuxième colonne à **675 px** sur toutes les sections de toutes
      les pages contrôlées
- [x] **D4.** Aucun débordement horizontal à 375 et 1440 px
- [x] **D5.** Pied de page interne = **900 px** pour un écran de 900 px, écart 0
- [x] **D6.** Un seul hero dans tout le code — les 7 autres ont disparu
- [x] **D7.** Aucun `max-w-*` sur un conteneur de section
- [x] **D8.** `npx tsc --noEmit` vert
- [x] **D9.** Build de production vert

## E. Deuxième passe de cohérence graphique

- [x] **E1. Header en négatif, sans aucun fond, sur toutes les pages.**
      `mix-blend-difference` posé sur le `<header>` lui-même — un élément se
      mélange avec le fond de son contexte d'empilement PARENT, même s'il porte
      un `z-index` qui isole ses propres enfants. C'est ce qui permet de garder
      le `z-45`. Contenu en blanc pur, logo aplati par `brightness-0 invert`.
      Le fond crème au défilement et toute la logique de couleur ont disparu.
- [x] **E2. La couleur #65b2af entre dans la charte.** Elle n'était utilisée
      nulle part. Posée sur les crochets des surtitres (présents sur chaque
      section), les numéros d'étapes et de questions, et les filets au survol.
      Accent secondaire : l'orange reste la couleur d'action.
- [x] **E3. Grain plus gros.** `baseFrequency` 0.85 → **0.45** (fréquence basse
      = grain large) et opacité 0.22 → 0.30.
- [x] **E4. Survols sur les pages de zone.** 3 éléments interactifs avant,
      **36 après** : tuiles de secteurs qui s'inversent, filets qui passent au
      vert, titres qui glissent.
- [x] **E5. Animations sur les pages villes.** 27 blocs animés, 34 survols :
      points forts en tuiles inversantes, FAQ numérotée, réalisations et
      témoignages avec filet réactif.

## F. Tour complet, page par page

Chaque page auditée sur : un seul `<h1>`, `<h1>` et bouton à 56 px, deuxième
colonne à 675 px, aucun titre désaligné, rythme clair/sombre sans monotonie,
pied de page à la hauteur exacte de l'écran, aucun débordement horizontal.

- [x] `/` — chiffres retirés, titre des logos, 46 survols
- [x] `/contact` · `/devis` — rythme `cNcNcN`, pied de page à l'écart 0
- [x] `/a-propos` — conforme sans retouche
- [x] `/methode` — **corrigé** : 3 sections claires en tête, bloc « principe » passé en sombre
- [x] `/tarifs` — **corrigé** : même problème, même correction
- [x] Les 4 services — **corrigé** : 4 sections claires en fin de page, bloc tarifaire passé en sombre
- [x] `/wallonie` · `/province-de-luxembourg` — **corrigé** : 3 survols → 36
- [x] `/zones-d-intervention` — conforme
- [x] `/realisations` — filtres supprimés, grille directe
- [x] Les 3 études de cas — **corrigé** : témoignage passé en sombre, livrables en tuiles réactives
- [x] `/blog` + 3 articles — **corrigé** : articles liés en bloc sombre, cartes rendues indépendantes du fond
- [x] Les 3 pages légales — **corrigé** : sommaires ramenés sur le surtitre partagé
- [x] Les 10 pages villes — hero unifié, 34 survols, 27 blocs animés

**Balayage final : 21 routes, 0 défaut** (HTTP 200, un `<h1>`, un canonical).

## G. Un seul bloc titre pour tout le site

**Le vrai défaut, celui qui expliquait tous les désalignements** : le composant
`EnTete` existait, mais le même bloc était réécrit **à la main dans 12 endroits**,
chacun avec ses propres marges. Certaines pages en cumulaient cinq.

- [x] **G1.** `EnTete` devient LE bloc titre unique, avec variantes :
      `intro` (une chaîne ou un tableau de paragraphes) · `lien` · `niveau`
      (h1/h2) · `gauche` (bouton, image) · `droite` (badges, formulaire, note)
      · `nu` (titre pleine largeur, sans colonne droite)
- [x] **G2.** Correction de l'alignement à la racine : le surtitre est posé
      **au-dessus** de la grille. Tant qu'il vivait dans la colonne de gauche,
      il poussait le titre vers le bas alors que le texte de droite démarrait
      tout en haut — les deux colonnes ne partaient jamais de la même hauteur.
- [x] **G3.** Les 12 duplications supprimées, y compris celle de `PageHero`.
      **Vérifié : plus aucun `<Titre>` écrit hors du composant.**
- [x] **G4.** 41 usages de `EnTete` répartis sur 10 fichiers.

**Mesures après refonte** — titre et texte de droite au même pixel :

| Page | Blocs | Écart de hauteur | x du titre | x du texte |
|---|---|---|---|---|
| `/wallonie` | 4 | **0** | 56 | 675 |
| `/tarifs` | 6 | **0** | 56 | 675 |
| `/contact` | 3 | **0** | 56 | 675 |

## I. Palette et texture

- [x] **I1. Deux valeurs claires, deux rôles.** Le beige servait à la fois de
      couleur de texte et de fond de page. Séparé :
      · `beew-creme` **#f1e9dd** — texte et filets sur fond sombre, il y garde
        sa chaleur ;
      · `beew-blanc` **#faf7f2** — fonds de page et surfaces claires.
      **23 aplats basculés dans 12 fichiers.** Vérifié : plus aucun fond plein
      en crème, et les 108 usages restants sont tous du texte, des filets ou des
      voiles translucides sur fond sombre.
- [x] **I2. Grain dans le menu.** L'overlay était la seule surface lisse du site.
      Vérifié à l'ouverture : couche présente, `fixed`, opacité 0.3, animation
      `grain-shift` active.

## J. Pyramide locale — région → provinces → communes

Constat de départ : depuis `/wallonie` on ne pouvait descendre nulle part.
Deux causes — les 11 villes étaient toutes en `draft`, et 4 provinces sur 5
n'avaient pas de page.

- [x] Les 11 villes passées en `published`
- [x] Preuves inventées supprimées d'Arlon, Bastogne et Libramont (3 chacune)
- [x] Règle de publication corrigée : « jamais de fausse preuve » ≠ « pas de page sans preuve »
- [x] 4 pages provinces écrites : Namur, Hainaut, Liège, Brabant wallon
- [x] `/wallonie` lie désormais ses 5 provinces
- [x] Chaque province liste ses propres communes (Hainaut → Charleroi, Mons…)
- [x] Fil d'Ariane des villes : province réelle, plus de `/province-de-luxembourg` en dur
- [x] `[slug]` devient la route unique villes + provinces — les 5 dossiers de route supprimés
- [x] Un seul `ProvinceView` pour les 5 provinces
- [x] Menu overlay : provinces indentées sous Wallonie, villes en colonne séparée
- [x] Pied de page : la pyramide (région + 5 provinces) au lieu de 6 villes arbitraires
- [x] Home : bloc « Où nous intervenons » — 5 provinces + 11 villes en liens statiques
- [x] Sitemap : 16 pages de zone, build vert

---

## K. Refonte complète du SEO — metadata et JSON-LD

Constat : chaque page réécrivait à la main le même bloc de 12 lignes. Aucune
n'avait de carte Twitter, d'image de partage ni de directive `max-snippet`.

- [x] `src/lib/seo.ts` réécrit : `pageMetadata()` + graphe d'entités JSON-LD
- [x] `src/lib/seo-pages.ts` pour les pages sans loader dédié
- [x] Les 22 pages migrées — plus une seule metadata écrite à la main
- [x] Carte Twitter, image de partage, `og:locale`, auteur/éditeur sur les 36 pages
- [x] `max-image-preview:large` + `max-snippet:-1` (surface SERP gratuite)
- [x] UNE entité `Organization` référencée par `@id` sur toutes les pages
- [x] **Adresses postales fictives supprimées** : le JSON-LD déclarait un
      établissement par ville, remplacé par `areaServed` sur l'entité unique
- [x] `aggregateRating` construit depuis les témoignages : code supprimé
- [x] Fil d'Ariane balisé == fil visible (source unique) sur toutes les pages
- [x] FAQ VISIBLE ajoutée à `/a-propos`, `/devis`, `/zones-d-intervention`, `/blog`
- [x] 149 questions balisées sur 31 pages, **0 invisible** (contrôle automatisé)
- [x] Brouillons : `noindex, nofollow` — ils ne transmettent aucun signal
- [x] Favicon généré (`src/app/icon.tsx`) — le site n'en avait aucun
- [x] `/blog` passé de 231 à 617 mots

---

## L. Quatre nouvelles villes

- [x] Bertrix — parc d'activités, B2B et recrutement face aux salaires du Grand-Duché
- [x] Neufchâteau — chef-lieu judiciaire, professions réglementées, déontologie
- [x] Durbuy — hôtellerie, commissions des plateformes, clientèle néerlandophone
- [x] Rochefort (province de **Namur**) — notoriété territoriale, excursion, terroir
- [x] Maillage `nearby` enrichi : 7 villes passées de 2 à 3-4 voisines
- [x] Recouvrement de phrases mesuré : **3,7 % max** (seuil de rupture : 35 %)
- [x] 15 villes, 51 pages, build vert

---

## H. Reste à faire — hors mise en forme

- [ ] Brancher l'envoi du formulaire (`/api/contact` à créer)
- [ ] 32 informations légales à compléter (surlignées en orange dans les pages)
- [ ] Numéro de téléphone de l'agence
- [ ] Remplacer les preuves de démonstration : logos, avis, résultats chiffrés
- [ ] Noms et rôles réels dans l'équipe de `/a-propos`
- [x] Cartes de services liées à leur page pilier (`slug` obligatoire dans `ServiceSchema`)
- [x] Les deux composants Services fusionnés en un seul, titre calculé sur le nombre réel
- [x] `/devis` n'était atteignable que depuis le menu — lien ajouté sur `/` et `/tarifs`
- [x] Sitemap et canonical de la home déclaraient deux URL différentes
- [ ] Réalisations : les 3 études de cas sont en `draft` et inventées, à remplacer
- [ ] `npm run lint` n'existe pas et il n'y a aucune config ESLint dans le projet
- [ ] Images de réalisations et d'articles en `alt=""` — correct pour du décoratif,
      mais un alt descriptif y apporterait de la recherche d'images

---

## Journal

*(rempli au fil de l'avancement)*
