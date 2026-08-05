import { AGENCY_SOCIAL } from "@/lib/seo";

/**
 * Liens vers les profils sociaux — un seul composant pour le pied de page et
 * le menu de navigation.
 *
 * La liste vient de `@/lib/seo`, la même que celle déclarée dans `sameAs` du
 * JSON-LD : un profil affiché à l'écran et un profil déclaré aux moteurs ne
 * peuvent pas diverger.
 *
 * Les pictogrammes sont dessinés en SVG plutôt qu'importés d'une librairie
 * d'icônes : deux tracés ne justifient pas une dépendance, et le nom du réseau
 * reste accessible aux lecteurs d'écran via `aria-label`.
 */

const TRACES: Record<string, React.ReactNode> = {
  Facebook: (
    <path d="M14.5 8.5h2V5.8h-2.2c-2 0-3.3 1.3-3.3 3.4v1.6H9v2.7h2v6.7h2.8v-6.7h2.1l.4-2.7h-2.5V9.6c0-.7.3-1.1.7-1.1Z" />
  ),
  Instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  LinkedIn: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="7.5" y1="10.5" x2="7.5" y2="17" />
      <circle cx="7.5" cy="7" r="1.1" fill="currentColor" stroke="none" />
      <path d="M11.5 17v-3.6a2.4 2.4 0 0 1 4.8 0V17" />
      <line x1="11.5" y1="10.5" x2="11.5" y2="17" />
    </>
  ),
};

export function Reseaux({ ton = "sombre" }: { ton?: "sombre" | "clair" }) {
  const sombre = ton === "sombre";

  return (
    <ul className="flex items-center gap-3">
      {AGENCY_SOCIAL.map((r) => (
        <li key={r.href}>
          <a
            href={r.href}
            target="_blank"
            // `noopener` ferme l'accès à la fenêtre d'origine depuis l'onglet
            // ouvert ; `noreferrer` évite de transmettre la page de départ.
            rel="noopener noreferrer"
            aria-label={`BEEW sur ${r.nom}`}
            className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-300 ${
              sombre
                ? "border-beew-creme/25 text-beew-creme/70 hover:border-beew-creme hover:text-beew-creme"
                : "border-beew-noir/20 text-beew-noir/60 hover:border-beew-noir hover:text-beew-noir"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden
              className="h-[18px] w-[18px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {TRACES[r.nom]}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
