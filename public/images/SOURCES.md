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

## `blog/` et `heros/journal.jpg` — Openverse, toutes en CC0

Les visuels précédents étaient des photos génériques recyclées à la hâte —
un atelier, une équipe, des paysages — sans rapport avec le sujet traité.
Remplacés par des images qui montrent réellement ce dont l'article parle.

| Fichier | Sujet | Licence |
|---|---|---|
| `facturation-electronique-peppol.jpg` | Tableur et calculatrice — comptabilité | CC0 |
| `accessibilite-obligation-europeenne.jpg` | Mains sur un clavier — navigation clavier | CC0 |
| `ia-recherche-generative.jpg` | Page de résultats sur tablette | CC0 |
| `aides-wallonnes-numerique.jpg` | Calculatrice, stylo, notes — budget | CC0 |
| `fiche-google-business-profile.jpg` | Carte sur téléphone, en extérieur | CC0 |
| `heros/journal.jpg` | Lecture d'actualité sur téléphone | CC0 |

**Toutes en CC0, donc sans obligation d'attribution.** Le choix est
délibéré : le champ `imageCredit` du schéma d'article n'est affiché nulle
part dans le rendu. Une image sous CC BY ou CC BY-SA serait donc publiée
sans attribution visible, ce qui ne respecte pas sa licence. Tant que ce
champ n'est pas rendu à l'écran, n'utiliser ici que des images CC0 ou du
domaine public.

---

## `villes/` — Wikimedia Commons

Une photographie par commune, affichée dans le hero de sa page. **Chaque image
a été regardée avant d'être retenue** : la recherche automatique renvoyait la
surface de Mars pour Charleroi, des icebergs pour Mons, le Belvédère de Vienne
pour Liège, et — le plus dangereux — l'église de Neufchâteau à **Dalhem**, en
province de Liège, pour notre Neufchâteau luxembourgeois.

| Commune | Sujet | Licence | Auteur |
|---|---|---|---|
| Arlon | Vue aérienne du centre et de l'église Saint-Martin | CC BY-SA 4.0 | Les Meloures |
| Bastogne | La Porte de Trèves et une maison ancienne | CC BY 4.0 | Tournasol7 |
| Bertrix | Vue depuis la clairière | **Domaine public** | Kinderfloke Plainchamp Florence |
| Charleroi | Place Vauban et hôtel de ville | CC BY-SA 4.0 | Jmh2o |
| Dinant | Citadelle et collégiale depuis la rive gauche | CC BY-SA 4.0 | Manjiro5 |
| Durbuy | Rue pavée du vieux bourg | **Domaine public** | Alf van Beem |
| Libramont-Chevigny | Le rond-point et son monument | CC BY-SA 3.0 | Jean-Pol Grandmont |
| Liège | Vue aérienne des quais de la Meuse | CC BY-SA 3.0 | A. Savin |
| Marche-en-Famenne | Édifice public néoclassique | CC BY 2.5 | Jean-Pol Grandmont |
| Mons | Hôtel de ville sur la Grand-Place | CC BY-SA 3.0 | Jean-Pol Grandmont |
| Namur | Vue aérienne des toits et du beffroi | CC BY-SA 4.0 | Giles Laurent |
| Neufchâteau | Édifice public au centre | CC BY-SA 3.0 | Jean-Pol Grandmont |
| Rochefort | Le pont sur la Lomme | CC BY-SA 4.0 | Krzysztof Golik |
| Virton | Hôtel de ville, daté de 1888 | CC BY-SA 3.0 | Jean-Pol Grandmont |
| Wavre | Tour de l'église Saint-Jean-Baptiste | CC BY-SA 3.0 | EmDee |

Les treize photos sous CC BY ou CC BY-SA affichent leur crédit sous l'image,
avec un lien vers la page Commons. **Le schéma rend ce crédit obligatoire** dès
qu'une licence l'exige : sans lui, le build échoue.

Toutes redimensionnées en 1600x900 et converties en WebP. 3,2 Mo au total.

> Ces photos restent des images d'illustration libres. Des photos prises par
> l'agence elle-même vaudraient mieux — c'est elle qui vend la proximité — et
> le champ `heroImage` de chaque JSON permet de les remplacer une par une.

---

## `heros/`, `method/`, `misc/`, `blog/`

Images en place avant la constitution de ce fichier, dont la provenance n'a
pas été consignée à l'époque.

- [ ] **À vérifier** — retrouver l'origine et la licence de chacune, ou les
      remplacer par des visuels dont la provenance est établie.

Tant que ce point n'est pas levé, ces images restent en ligne mais leur statut
n'est pas documenté. C'est le seul endroit du projet où c'est encore le cas.
