# BEEW — Architecture des pages

Document d'alignement. Il fige **quelles pages existent** et **dans quel ordre les sections
apparaissent**. La structure vient de l'analyse de cinq agences qui vendent réellement :
Hallam (UK), Supple (AU), WebFX (US), Rogerwilco (ZA), First Page Digital (SG).

---

## 1. Ce que ces cinq agences font pareil

Malgré des styles opposés, leur ordre d'argumentation est presque identique. Sept mécaniques
reviennent partout :

| Mécanique | Ce qu'elles font | Ce qu'on en garde |
|---|---|---|
| **Preuve avant pitch** | Les logos clients arrivent AVANT les services, les réalisations souvent aussi | Bandeau de confiance juste sous le hero, réalisations avant les services |
| **Un seul CTA, répété** | WebFX répète « Get My Free Proposal » 6 fois. Supple : « Book a Free Consultation » | **Un seul** CTA principal, décliné 5 à 6 fois : *Réserver un appel* |
| **CTA à engagement nul** | Gratuit, sans engagement, personnalisé | « Premier rendez-vous sur place, sans frais ni engagement » |
| **Chiffres partout** | WebFX : 10 Md$ générés, 750 marketeurs, 30 ans. Supple : 428 avis, 4,9/5 | Chiffres vrais uniquement — voir §4 |
| **Méthode nommée** | Hallam « Elements », Supple « Trafic → Conversion → Mesure » | Une méthode en 4 étapes, nommée et illustrée |
| **Renversement du risque** | First Page : *si on n'y arrive pas en 90 j, on travaille gratuitement* | Devis fixe, site qui vous appartient, aucune sous-traitance |
| **Ancrage local en pied de page** | Supple affiche 3 adresses avec liens Maps | Zone d'intervention + commune, pour le SEO local |

**Deux choses qu'on ne copie pas** : les garanties de position (interdites en pratique, Google ne
les permet pas honnêtement) et les bannières d'urgence type « premier mois offert », qui abîment
le positionnement sur un marché de PME où la confiance prime sur la promo.

---

## 2. La home, section par section

L'ordre est le cœur du sujet. Chaque section répond à **une** question que le visiteur se pose,
dans l'ordre où il se la pose.

| # | Section | Question à laquelle elle répond | Contenu |
|---|---|---|---|
| 1 | **Hero vidéo** | *Je suis où, ils font quoi ?* | H1, accroche, séquence de scroll, CTA |
| 2 | **Bandeau de confiance** | *D'autres leur font confiance ?* | Logos clients + note d'avis |
| 3 | **Chiffres** | *Ils pèsent quoi ?* | 3 à 4 chiffres vérifiables |
| 4 | **Réalisations** | *Ça donne quoi concrètement ?* | 3 cas avec résultat chiffré |
| 5 | **Services** | *Est-ce qu'ils font ce dont j'ai besoin ?* | 4 services formulés en résultats |
| 6 | **Méthode** | *Comment ça se passe ?* | 4 étapes, délais annoncés |
| 7 | **Pourquoi BEEW** | *Pourquoi eux et pas un autre ?* | Différenciateurs + renversement du risque |
| 8 | **Témoignages** | *Les clients sont contents ?* | 3 avis nominatifs + note |
| 9 | **Zones** | *Ils interviennent chez moi ?* | Province, région, villes |
| 10 | **Tarifs** | *Ça coûte combien ?* | Prix de départ, ce qui est inclus |
| 11 | **FAQ** | *Et si… ?* | 6 objections traitées |
| 12 | **Insights** | *Ils s'y connaissent vraiment ?* | 3 articles |
| 13 | **CTA final** | *Bon, je fais quoi ?* | Rappel de l'offre sans risque |
| 14 | **Footer** | — | Zone, contact, plan de site |

> **Le point non négociable** : les réalisations (4) passent AVANT les services (5).
> Les cinq agences le font. On prouve avant de proposer.

---

## 3. Toutes les pages du site

### Conversion
| URL | Rôle | Sections |
|---|---|---|
| `/` | Capter le large, orienter | Voir §2 |
| `/contact` | Convertir | Formulaire qualifiant · Ce qui se passe ensuite (3 étapes) · Coordonnées · FAQ courte |
| `/devis` | Convertir (intention haute) | Formulaire long · Rappel du devis fixe · Témoignages |

### Services — une page par verticale (piliers SEO)
| URL | Mot-clé principal |
|---|---|
| `/creation-site-internet` | création site internet |
| `/refonte-site-internet` | refonte site internet |
| `/referencement-seo` | référencement naturel / agence SEO |
| `/site-e-commerce` | création site e-commerce |

**Structure commune à toutes** : Hero · Problème que ça résout · Ce qui est inclus · Méthode ·
Réalisations filtrées sur ce service · Tarifs · FAQ spécifique · CTA · Maillage vers les villes.

### Preuve
| URL | Rôle |
|---|---|
| `/realisations` | Index filtrable par secteur et par service |
| `/realisations/[slug]` | Étude de cas : contexte · problème · solution · **résultat chiffré** · témoignage · CTA |

### Confiance
| URL | Sections |
|---|---|
| `/a-propos` | Histoire · Convictions · Équipe · Chiffres · Zone · CTA |
| `/methode` | Les 4 étapes en détail · Délais · Ce qu'on attend du client · FAQ |
| `/tarifs` | 3 formules · Ce qui est inclus / exclu · Options · FAQ tarifaire · CTA |

### SEO local — la pyramide
```
/wallonie                                    ← région
  └── /province-de-luxembourg                ← province
        └── /creation-site-internet-arlon    ← ville  (×10)
/zones-d-intervention                        ← hub qui liste tout
```
Chaque niveau lie vers le niveau inférieur et vers son parent. C'est ce maillage qui remplace le
sélecteur de ville retiré de la home.

### Contenu
| URL | Rôle |
|---|---|
| `/blog` | Index, filtrable par thème |
| `/blog/[slug]` | Article — autorité + longue traîne |

### Légal
`/mentions-legales` · `/politique-de-confidentialite` · `/conditions-generales`

---

## 4. Règle sur les preuves — à lire avant de publier

Les cinq agences analysées carburent aux chiffres. **Aucun chiffre ne doit être inventé.**

Tout ce qui est actuellement en place — logos clients, témoignages, résultats chiffrés, notes
d'avis — est du **remplissage de développement** : entreprises inventées, photos de banque
d'images, logos fictifs. Rien de tout cela ne peut partir en ligne tel quel.

Avant mise en ligne, chaque élément de preuve doit être :
- soit remplacé par du réel et vérifiable,
- soit supprimé de la page.

Un faux avis client est une pratique commerciale déloyale au sens du droit belge et européen,
indépendamment du risque SEO. C'est la raison d'être du drapeau `status: "draft"` sur les villes,
et la même règle s'applique aux sections de preuve de la home.

---

## 5. Ordre de construction

1. Home complète — c'est le gabarit dont tout le reste hérite
2. `/contact` — sans lui, tous les CTA tombent dans le vide
3. `/realisations` + 3 études de cas
4. Les 4 pages services
5. `/a-propos`, `/methode`, `/tarifs`
6. Pyramide locale : `/wallonie`, `/province-de-luxembourg`, puis publication des villes
7. Blog
8. Légal
