import { Bouton, DEUX_COLONNES, EnTete, Fleche, Section, Surtitre } from "@/components/ui/section";
import Link from "next/link";
import type { CaseStudy, FaqItem, Service, Testimonial } from "@/content/schema";

/**
 * Composants partagés entre la home et les pages villes.
 *
 * Règle : ils reçoivent TOUJOURS leurs données en props et ne lisent jamais un
 * JSON directement. C'est ce qui permet à une page ville d'être structurellement
 * identique à la home tout en portant un contenu entièrement différent.
 *
 * Toute la mise en page passe par les primitives de `@/components/ui/section` :
 * une seule gouttière, une seule échelle d'espacement, un seul style de titre.
 */

/** Bloc de contexte local : le cœur de l'unicité d'une page ville. */
export function LocalContext({
  heading,
  body,
  highlights,
}: {
  heading: string;
  body: string;
  highlights?: string[];
}) {
  return (
    <Section>
      <EnTete surtitre="L'agence" titre={heading} intro={body.split(/\n{2,}/)} />

      {highlights && (
        <ul className="mt-14 grid gap-px overflow-hidden rounded-2xl bg-beew-noir/12 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((h, i) => (
            <li
              key={h}
              data-reveal
              data-reveal-delay={i * 70}
              className="group flex gap-4 bg-beew-blanc p-7 text-sm leading-relaxed transition-colors duration-500 hover:bg-beew-noir hover:text-beew-creme"
            >
              <span className="mt-2 h-px w-4 shrink-0 bg-beew-vert transition-all duration-500 group-hover:w-7" />
              <span className="opacity-75">{h}</span>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}

/**
 * Le bloc services des pages villes EST celui de la home.
 *
 * Il en existait deux copies quasi identiques — l'une sans lien, l'autre avec
 * un titre figé à « Quatre » alors qu'il y a six services. Un seul composant,
 * un seul endroit à corriger.
 */
export { ServicesBento as Services } from "@/components/home/sections";

export function Cases({ cases, heading = "Réalisations" }: { cases: CaseStudy[]; heading?: string }) {
  return (
    <Section>
      <div data-reveal>
        <EnTete surtitre="Preuves" titre={heading} lien={{ href: "/realisations", label: "Tout voir" }} />
      </div>

      <div className="mt-16 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
        {cases.map((c, i) => (
          <article
            key={c.client}
            data-reveal
            data-reveal-delay={i * 70}
            className="group border-t border-beew-noir/20 pt-6 transition-colors duration-500 hover:border-beew-vert"
          >
            <p className="text-[10px] tracking-[0.25em] text-beew-noir/40 uppercase">
              {c.city} · {c.sector}
            </p>
            <h3 className="mt-3 text-xl font-semibold tracking-tight transition-transform duration-500 group-hover:translate-x-1">
              {c.client}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-beew-noir/60">{c.summary}</p>
            <p className="mt-5 border-l-2 border-beew-orange pl-4 text-sm font-semibold">{c.result}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <Section ton="sombre">
      <div data-reveal>
        <EnTete ton="sombre" surtitre="Témoignages" titre="Ce qu'en disent nos clients" />
      </div>

      <div className="mt-16 grid gap-x-12 gap-y-14 lg:grid-cols-2">
        {testimonials.map((t, i) => (
          <figure
            key={`${t.company}-${t.author}`}
            data-reveal
            data-reveal-delay={i * 70}
            className="border-t border-beew-creme/20 pt-8 transition-colors duration-500 hover:border-beew-vert"
          >
            <blockquote className="text-[clamp(1.15rem,2.1vw,1.6rem)] leading-snug font-medium tracking-tight">
              « {t.quote} »
            </blockquote>
            <figcaption className="mt-8 flex flex-wrap items-baseline gap-x-3 text-sm">
              <span className="font-semibold">{t.author}</span>
              <span className="text-beew-creme/50">
                {t.role}, {t.company} — {t.city}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}

/** Le balisage FAQPage correspondant est émis séparément dans le JSON-LD. */
export function Faq({ faq }: { faq: FaqItem[] }) {
  return (
    <Section>
      <div data-reveal>
        <EnTete surtitre="Questions" titre="Ce que l'on nous demande le plus souvent" />
      </div>

      <dl className="mt-16 border-t border-beew-noir/15">
        {faq.map((f, i) => (
          <div
            key={f.question}
            data-reveal
            data-reveal-delay={i * 70}
            className={`${DEUX_COLONNES} group border-b border-beew-noir/15 py-8`}
          >
            <dt className="flex items-baseline gap-5 text-[clamp(1.05rem,1.8vw,1.4rem)] font-semibold tracking-tight">
              <span className="text-xs font-normal text-beew-vert tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="transition-transform duration-500 group-hover:lg:translate-x-2">
                {f.question}
              </span>
            </dt>
            <dd className="max-w-prose text-sm leading-relaxed text-beew-noir/60">{f.answer}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

/** Maillage vers 2 à 6 villes voisines — jamais la liste complète. */
export function NearbyCities({ cities }: { cities: { slug: string; city: string }[] }) {
  if (!cities.length) return null;
  return (
    <Section className="!py-16">
      <Surtitre>À proximité</Surtitre>
      <ul className="mt-8 grid gap-px overflow-hidden rounded-2xl bg-beew-noir/10 sm:grid-cols-2 lg:grid-cols-3">
        {cities.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/${c.slug}`}
              className="group flex items-center justify-between gap-4 bg-beew-blanc p-6 transition-colors hover:bg-beew-noir hover:text-beew-creme"
            >
              <span className="text-sm font-semibold">Création de site internet à {c.city}</span>
              <Fleche />
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/** Longue traîne : les communes environnantes, en texte, sans lien. */
export function Coverage({ city, communes }: { city: string; communes: string[] }) {
  return (
    <Section className="!py-10">
      <p className="max-w-4xl text-xs leading-relaxed text-beew-noir/45">
        Nous intervenons à {city} et dans les communes de {communes.join(", ")}.
      </p>
    </Section>
  );
}

export function Cta({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <Section ton="sombre" className="text-center">
      <h2 className="mx-auto max-w-3xl text-[clamp(1.9rem,4.6vw,3.75rem)] leading-[0.98] font-semibold tracking-tight uppercase">
        {title}
      </h2>
      <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-beew-creme/60">{subtitle}</p>
      <div className="mt-12">
        <Bouton href="/contact" ton="sombre" taille="grand">
          Réserver un appel
        </Bouton>
      </div>
    </Section>
  );
}
