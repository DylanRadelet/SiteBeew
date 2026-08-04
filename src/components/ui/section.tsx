import Link from "next/link";

/**
 * Briques de mise en page partagées par toutes les sections.
 *
 * Deux règles tenues ici, et nulle part ailleurs :
 *  · la largeur — aucune section n'a de `max-width`, elles prennent l'écran
 *    entier et ne sont bornées que par une gouttière qui grandit avec lui ;
 *  · le rythme vertical — une seule échelle d'espacement, pour que la page
 *    respire de façon régulière du haut en bas.
 */

/** Gouttière unique du site. Identique au hero et au header : tout s'aligne. */
export const GUTTER = "px-6 sm:px-10 lg:px-14";

/**
 * LA colonne de référence du site.
 *
 * Toute section à deux colonnes utilise exactement ce gabarit — titre à gauche,
 * texte à droite. C'est ce qui fait que le paragraphe d'introduction d'une
 * section tombe au même pixel que les descriptions de la liste en dessous.
 * Ne jamais redéfinir une répartition à la main dans un composant.
 */
export const DEUX_COLONNES = "grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-16";

/** Échelle d'espacement vertical unique. */
const RYTHME = "py-20 sm:py-28 lg:py-36";

type Ton = "clair" | "sombre";

export function Section({
  ton = "clair",
  className = "",
  children,
  id,
  anime = true,
}: {
  ton?: Ton;
  className?: string;
  children: React.ReactNode;
  id?: string;
  /** Passer `false` pour une section qui ne doit pas apparaître au défilement. */
  anime?: boolean;
}) {
  return (
    <section
      id={id}
      // L'apparition au défilement est portée par la section elle-même : plus
      // besoin de penser à poser `data-reveal` sur chaque bloc. Les enfants
      // peuvent toujours en ajouter un pour se décaler individuellement.
      {...(anime ? { "data-reveal": "" } : {})}
      className={`${GUTTER} ${RYTHME} ${
        ton === "sombre" ? "bg-beew-noir text-beew-creme" : "text-beew-noir"
      } ${className}`}
    >
      {children}
    </section>
  );
}

/**
 * Surtitre de section. Les crochets sont en vert : c'est la seule touche de
 * cette couleur de la charte, posée sur un élément qui revient partout — assez
 * pour l'installer, assez discrète pour ne pas concurrencer l'orange.
 */
export function Surtitre({ ton = "clair", children }: { ton?: Ton; children: React.ReactNode }) {
  return (
    <p
      className={`text-[11px] tracking-[0.3em] uppercase ${
        ton === "sombre" ? "text-beew-creme/45" : "text-beew-noir/45"
      }`}
    >
      <span className="text-beew-vert">[</span> {children} <span className="text-beew-vert">]</span>
    </p>
  );
}

/** Flèche à 45°, reprise du header pour rester cohérent partout. */
export function Fleche({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      aria-hidden
      className={`h-3 w-3 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 9.5 9.5 2.5" />
      <path d="M4 2.5h5.5V8" />
    </svg>
  );
}

/** Titre seul, sans bloc autour. À n'utiliser que dans `EnTete`. */
export function Titre({ niveau = 2, children }: { niveau?: 1 | 2; children: React.ReactNode }) {
  const classe =
    "text-[clamp(1.85rem,4.4vw,3.6rem)] leading-[0.98] font-semibold tracking-tight uppercase";
  return niveau === 1 ? <h1 className={classe}>{children}</h1> : <h2 className={classe}>{children}</h2>;
}

/**
 * LE bloc d'en-tête du site. Surtitre, titre, texte d'introduction, lien.
 *
 * C'est le SEUL endroit où ce bloc est construit. Il existait auparavant en
 * douze exemplaires écrits à la main, chacun avec ses propres marges : c'est ce
 * qui produisait des désalignements différents d'une section à l'autre.
 *
 * Point clé de l'alignement : le surtitre est posé AU-DESSUS de la grille, pas
 * dans la colonne de gauche. Tant qu'il vivait dedans, il décalait le titre vers
 * le bas alors que le texte de droite démarrait, lui, tout en haut — les deux
 * colonnes ne commençaient jamais à la même hauteur.
 *
 * Variantes, toutes optionnelles :
 *  · `intro`    — un ou plusieurs paragraphes dans la colonne de droite
 *  · `lien`     — lien de rebond sous l'introduction
 *  · `niveau`   — 1 pour un `<h1>` de page, 2 par défaut
 *  · `droite`   — contenu libre ajouté sous l'introduction (badges, chiffre…)
 *  · `gauche`   — contenu libre ajouté sous le titre (bouton…)
 *  · `nu`       — titre seul, sans colonne de droite : la grille est alors
 *                 inutile et le titre prend toute la largeur
 */
export function EnTete({
  surtitre,
  titre,
  intro,
  lien,
  ton = "clair",
  niveau = 2,
  gauche,
  droite,
  nu = false,
}: {
  surtitre: string;
  titre: string;
  intro?: string | string[];
  lien?: { href: string; label: string };
  ton?: Ton;
  niveau?: 1 | 2;
  gauche?: React.ReactNode;
  droite?: React.ReactNode;
  nu?: boolean;
}) {
  const sombre = ton === "sombre";
  const paragraphes = intro === undefined ? [] : Array.isArray(intro) ? intro : [intro];
  const colonneDroite = paragraphes.length > 0 || lien || droite;

  return (
    <div>
      <Surtitre ton={ton}>{surtitre}</Surtitre>

      {nu || !colonneDroite ? (
        <div className="mt-6 max-w-5xl">
          <Titre niveau={niveau}>{titre}</Titre>
          {gauche}
        </div>
      ) : (
        <div className={`mt-6 items-start ${DEUX_COLONNES}`}>
          <div>
            <Titre niveau={niveau}>{titre}</Titre>
            {gauche}
          </div>

          <div className="flex flex-col items-start gap-6">
            {paragraphes.length > 0 && (
              <div
                className={`space-y-5 text-base leading-relaxed ${
                  sombre ? "text-beew-creme/60" : "text-beew-noir/60"
                }`}
              >
                {paragraphes.map((p, i) => (
                  <p key={i} className="max-w-prose">
                    {p}
                  </p>
                ))}
              </div>
            )}

            {lien && (
              <Link
                href={lien.href}
                className={`group inline-flex items-center gap-2 border-b pb-1 text-[11px] tracking-[0.2em] uppercase ${
                  sombre
                    ? "border-beew-creme/30 hover:border-beew-creme"
                    : "border-beew-noir/25 hover:border-beew-noir"
                }`}
              >
                {lien.label}
                <Fleche />
              </Link>
            )}

            {droite}
          </div>
        </div>
      )}
    </div>
  );
}

/** Bouton principal. Un seul style dans tout le site, deux tons. */
export function Bouton({
  href,
  children,
  ton = "clair",
  taille = "normal",
}: {
  href: string;
  children: React.ReactNode;
  ton?: Ton;
  taille?: "normal" | "grand";
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-3 rounded-full text-[11px] tracking-[0.2em] uppercase transition-opacity hover:opacity-85 ${
        taille === "grand" ? "px-8 py-4" : "px-6 py-3"
      } ${ton === "sombre" ? "bg-beew-blanc text-beew-noir" : "bg-beew-noir text-beew-creme"}`}
    >
      {children}
      <Fleche />
    </Link>
  );
}
