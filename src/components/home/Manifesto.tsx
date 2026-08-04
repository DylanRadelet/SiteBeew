import Link from "next/link";
import type { Home } from "@/content/schema";

/**
 * Bloc d'accroche révélé au bout de la séquence de scroll du hero.
 *
 * Purement présentationnel : ni fond, ni hauteur, ni positionnement. C'est
 * `HeroSequence` qui le place et pilote son apparition.
 *
 * Les deux lignes forment un seul <h2> : c'est un titre de section pour les
 * moteurs, la nuance de couleur entre les deux lignes est purement visuelle.
 */
export function Manifesto({ manifesto }: { manifesto: Home["manifesto"] }) {
  return (
    <div className="max-w-4xl text-center">
      <p className="text-[11px] tracking-[0.3em] text-beew-creme/45 uppercase">{manifesto.eyebrow}</p>

      <h2 className="mt-8 text-[clamp(1.75rem,3.6vw,3rem)] leading-[1.15] font-semibold tracking-tight text-balance">
        <span className="text-beew-creme">{manifesto.line1}</span>{" "}
        <span className="text-beew-creme/35">{manifesto.line2}</span>
      </h2>

      <Link
        href={manifesto.ctaHref}
        className="group mt-10 inline-flex items-center gap-2 text-xs tracking-[0.15em] text-beew-creme uppercase"
      >
        {manifesto.ctaLabel}
        <svg
          viewBox="0 0 12 12"
          aria-hidden
          className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2.5 9.5 9.5 2.5" />
          <path d="M4 2.5h5.5V8" />
        </svg>
      </Link>
    </div>
  );
}
