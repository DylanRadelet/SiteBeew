# Provenance et licences des images

Fichier de traçabilité. **À tenir à jour** : sur un site commercial, une image
dont on ne peut pas justifier l'origine est un risque juridique, et le fait
qu'elle soit « trouvée sur internet » n'est pas une défense.

---

## `services/` — Unsplash

Six photographies, une par page pilier, affichées au survol des cartes de la
section Services de l'accueil.

| Fichier | Sujet | Identifiant Unsplash |
|---|---|---|
| `creation-site-internet.webp` | Poste de travail, code et site à l'écran | `photo-1467232004584-a241de8bcf5d` |
| `refonte-site-internet.webp` | Maquettes épinglées et reliées au mur | `photo-1531403009284-440f080d1e12` |
| `referencement-seo.webp` | Tableau de bord d'analyse d'audience | `photo-1460925895917-afdab827c52f` |
| `site-e-commerce.webp` | Commerce, paiement sans contact | `photo-1556742049-0cfed4f6a45d` |
| `application-web.webp` | Code source à l'écran | `photo-1461749280684-dccba630e2f6` |
| `outils-internes.webp` | Travail sur plan papier et ordinateurs | `photo-1454165804606-c3d57bc86b40` |

**Licence Unsplash** — utilisation commerciale et non commerciale autorisée,
sans demande d'autorisation ni attribution obligatoire. Interdiction de
revendre les photos telles quelles ou de constituer un service concurrent.
Aucun de ces usages n'est fait ici. Voir <https://unsplash.com/license>.

Adresse de récupération : `https://images.unsplash.com/<identifiant>?w=1600&q=80`,
puis redimensionnement à 1200 px de large et conversion en WebP (qualité 78).
Poids total des six : 288 Ko.

---

## `cases/` — captures de projets réels

Captures des six projets livrés par l'agence, reprises de l'ancien site
(`Desktop/beewagency/public/projects/`). Ce sont des **travaux de l'agence**,
pas des photographies sous licence tierce.

`creaphike` · `faceanime` · `greenworkproject` · `happylink` · `moki` · `racoon`

Sources d'origine en 4000×3000 pour 2,9 Mo pièce, soit 17 Mo au total :
redimensionnées à 1400 px de large, 1,1 Mo au total.

> ⚠️ Si l'un de ces clients demande le retrait de sa capture, elle doit être
> supprimée de `global.json` **et** du dossier. Une réalisation se montre avec
> l'accord du client.

---

## `villes/` — Wikimedia Commons

Photographies des communes, affichées dans le hero de leur page.

| Fichier | Sujet | Licence | Auteur |
|---|---|---|---|
| `dinant.webp` | Citadelle et collégiale, depuis la rive gauche | CC BY-SA 4.0 | Manjiro5 |
| `durbuy.webp` | Rue pavée du vieux Durbuy | **Domaine public** | Alf van Beem |
| `namur.webp` | Vue aérienne des toits et du beffroi | CC BY-SA 4.0 | Giles Laurent |

Les deux photos sous CC BY-SA affichent leur crédit sous l'image, avec un lien
vers la page Commons : le schéma rend ce crédit **obligatoire** dès qu'une
licence l'exige, et le build échoue s'il manque.

### Les douze autres communes n'ont pas de photo

Elles retombent sur le visuel générique `heros/zones.jpg`. C'est délibéré.

Le fonds libre disponible pour les petites communes wallonnes est très pauvre,
et surtout trompeur : une recherche sur « Virton » ne renvoie que des tableaux
de musée, « Neufchâteau » une carte de Ferraris du XVIIIᵉ siècle, « Liège » des
destructions de 1914. Mettre une forêt ardennaise générique en la présentant
comme la photo de Bertrix serait une image fausse sur une page qui vend
justement l'ancrage local.

Options, par ordre de qualité :

1. **Photographier soi-même** — c'est l'agence qui vend la proximité, et une
   photo prise sur place vaut mieux que n'importe quelle banque d'images.
   Une matinée par commune couvre plusieurs villes.
2. Acheter sur une banque payante (Adobe Stock, Getty) — couverture correcte
   pour Liège, Mons, Charleroi, moins pour l'Ardenne.
3. Laisser le visuel générique, ce qui reste honnête.

---

## `heros/`, `method/`, `misc/`, `blog/`

Images en place avant la constitution de ce fichier, dont la provenance n'a
pas été consignée à l'époque.

- [ ] **À vérifier** — retrouver l'origine et la licence de chacune, ou les
      remplacer par des visuels dont la provenance est établie.

Tant que ce point n'est pas levé, ces images restent en ligne mais leur statut
n'est pas documenté. C'est le seul endroit du projet où c'est encore le cas.
