import Link from "next/link";
import { Blocs, COLONNE_LECTURE } from "@/components/blog/Blocs";
import { PageHero } from "@/components/ui/PageHero";
import { Fleche, Section, Surtitre } from "@/components/ui/section";
import type { LegalPage } from "@/content/schemas/legal";

/**
 * Gabarit commun aux trois pages légales.
 *
 * Il vit à côté du rendu des blocs plutôt que dans un dossier à lui : c'est
 * exactement le même moteur de rendu que le corps d'un article, seul le
 * gabarit autour change. Une seule implémentation à maintenir.
 *
 * Ces pages sont servies en `noindex, follow` : elles n'ont aucune valeur de
 * référencement et dilueraient le budget de crawl, mais les liens qu'elles
 * portent doivent continuer d'être suivis.
 */

/** Date lisible sans dépendre du fuseau du serveur. */
function dateLisible(iso: string): string {
  const [annee, mois, jour] = iso.split("-").map(Number);
  return new Date(Date.UTC(annee, mois - 1, jour)).toLocaleDateString("fr-BE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function PageLegale({ page }: { page: LegalPage }) {
  return (
    <>
      {/* Pas de bouton : une page légale n'est pas une page de conversion. */}
      <PageHero
        fil={[
          { href: "/", label: "Accueil" },
          { href: `/${page.slug}`, label: page.h1 },
        ]}
        surtitre={page.surtitre}
        h1={page.h1}
        intro={page.intro}
        cta={null}
        image={{ src: "/images/heros/legal.jpg" }}
      />

      <Section className="!pt-0">
        <p className={`${COLONNE_LECTURE} text-[11px] tracking-[0.15em] text-beew-noir/45 uppercase`}>
          Dernière mise à jour :{" "}
          <time dateTime={page.updatedAt}>{dateLisible(page.updatedAt)}</time>
        </p>

        {/* Sommaire : les sections légales sont longues, on doit pouvoir sauter
            directement à la rubrique cherchée. */}
        <nav
          aria-labelledby="sommaire-legal"
          className={`${COLONNE_LECTURE} mt-10 rounded-2xl border border-beew-noir/15 p-7 sm:p-9`}
        >
          {/* Composant partagé : les crochets verts sont la signature des
              surtitres sur tout le site, ils ne doivent pas être réécrits. */}
          <div id="sommaire-legal">
            <Surtitre>Sommaire</Surtitre>
          </div>
          <ol className="mt-6 space-y-3">
            {page.sections.map((s, i) => (
              <li key={s.id} className="group flex gap-4 text-[15px] leading-snug">
                <span className="shrink-0 text-beew-vert tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <a
                  href={`#${s.id}`}
                  className="border-b border-transparent pb-0.5 text-beew-noir/75 transition-colors hover:border-beew-noir/40 hover:text-beew-noir"
                >
                  {s.titre}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </Section>

      <Section className="!pt-0">
        <div className="space-y-20">
          {page.sections.map((section, i) => (
            <section key={section.id} id={section.id} className="scroll-mt-28">
              <h2
                data-reveal
                data-reveal-delay={i * 40}
                className={`${COLONNE_LECTURE} text-[clamp(1.4rem,2.6vw,2rem)] leading-tight font-semibold tracking-tight`}
              >
                {section.titre}
              </h2>
              <div className="mt-8">
                <Blocs blocs={section.blocs} />
              </div>
            </section>
          ))}
        </div>

        <div className={`${COLONNE_LECTURE} mt-20 border-t border-beew-noir/15 pt-8`}>
          <p className="text-xs leading-relaxed text-beew-noir/45">
            Une question sur ce document ? Écrivez-nous à{" "}
            <a href="mailto:hello@beew.agency" className="underline underline-offset-4">
              hello@beew.agency
            </a>
            .
          </p>
          <Link
            href="/contact"
            className="group mt-6 inline-flex items-center gap-2 border-b border-beew-noir/25 pb-1 text-[11px] tracking-[0.2em] uppercase hover:border-beew-noir"
          >
            Nous contacter
            <Fleche />
          </Link>
        </div>
      </Section>
    </>
  );
}
