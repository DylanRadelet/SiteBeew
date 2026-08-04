import { Bouton, DEUX_COLONNES, EnTete, Fleche, Section } from "@/components/ui/section";
import Link from "next/link";
import type { ServicePage } from "@/content/schemas/service";

/**
 * Sections des 4 pages piliers de service, dans l'ordre figé par PAGES.md §3 :
 * Hero · Problème · Ce qui est inclus · Méthode · Réalisations · Tarif ·
 * FAQ · CTA · Maillage interne.
 *
 * Le hero n'est plus fabriqué ici : les pages utilisent `PageHero`, le hero
 * unique du site. C'est lui qui porte le `<h1>`.
 *
 * Aucun texte n'est écrit ici : tout vient du JSON validé par
 * `src/content/schemas/service.ts`. Ces composants ne sont que de la mise en page.
 *
 * L'alternance clair / sombre découpe la page : hero et inclus en clair,
 * problème et méthode en sombre, preuve et tarif en clair, FAQ en clair,
 * conclusion en sombre.
 */

/* -------------------------------------------------------------------------- */
/*  1. Le problème que ça résout                                               */
/* -------------------------------------------------------------------------- */

export function ServiceProblem({ problem }: { problem: ServicePage["problem"] }) {
  return (
    <Section ton="sombre">
      {/* Le corps est découpé sur les doubles sauts de ligne du JSON : c'est
          la seule mise en forme que le contenu peut piloter. */}
      <EnTete
        ton="sombre"
        surtitre="Le problème"
        titre={problem.heading}
        intro={problem.body.split(/\n{2,}/)}
      />

      <ul className="mt-16 grid gap-px overflow-hidden rounded-2xl bg-beew-creme/15 sm:grid-cols-2">
        {problem.pains.map((p, i) => (
          <li
            key={p.title}
            data-reveal
            data-reveal-delay={i * 70}
            className="bg-beew-noir p-8 sm:p-10"
          >
            <h3 className="text-lg font-semibold tracking-tight">{p.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-beew-creme/60">{p.description}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  2. Ce qui est inclus                                                       */
/* -------------------------------------------------------------------------- */

export function ServiceIncluded({ included }: { included: ServicePage["included"] }) {
  return (
    <Section>
      <EnTete surtitre="Ce qui est inclus" titre={included.heading} intro={included.intro} />

      <div className="mt-16 grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {included.items.map((item, i) => (
          <article
            key={item.title}
            data-reveal
            data-reveal-delay={i * 70}
            className="border-t-2 border-beew-orange pt-6"
          >
            <h3 className="text-lg font-semibold tracking-tight">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-beew-noir/60">{item.description}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  3. Méthode                                                                 */
/* -------------------------------------------------------------------------- */

export function ServiceMethod({ method }: { method: ServicePage["method"] }) {
  return (
    <Section ton="sombre">
      <EnTete ton="sombre" surtitre="Méthode" titre={method.heading} intro={method.intro} />

      <ol className="mt-16 border-t border-beew-creme/20">
        {method.steps.map((step, i) => (
          <li
            key={step.title}
            data-reveal
            data-reveal-delay={i * 70}
            className={`${DEUX_COLONNES} border-b border-beew-creme/20 py-8`}
          >
            <div className="flex items-baseline gap-6">
              <span className="text-[11px] tracking-[0.25em] text-beew-creme/40">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-[clamp(1.15rem,2vw,1.6rem)] font-semibold tracking-tight">
                {step.title}
              </h3>
            </div>
            <div className="lg:pt-1">
              <p className="text-[11px] tracking-[0.2em] text-beew-creme/40 uppercase">
                {step.duration}
              </p>
              <p className="mt-3 max-w-prose text-sm leading-relaxed text-beew-creme/60">
                {step.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  4. Réalisations liées                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Tant que `proof.cases` est vide, on n'affiche AUCUNE carte : ni logo, ni
 * chiffre, ni nom de client. Un résultat inventé est une pratique commerciale
 * déloyale au sens du droit belge, indépendamment du risque SEO (PAGES.md §4).
 */
export function ServiceProof({ proof }: { proof: ServicePage["proof"] }) {
  return (
    <Section>
      <EnTete
        surtitre="Réalisations"
        titre={proof.heading}
        intro={proof.intro}
        lien={{ href: "/realisations", label: "Voir les réalisations" }}
      />

      {/* TODO : remplacer par des références réelles — nom du client, secteur,
          ville et résultat vérifiable. Ne rien afficher tant que ce n'est pas le cas. */}
      {proof.cases.length > 0 && (
        <div className="mt-16 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {proof.cases.map((c, i) => (
            <article
              key={c.client}
              data-reveal
              data-reveal-delay={i * 70}
              className="border-t border-beew-noir/15 pt-6"
            >
              <p className="text-[10px] tracking-[0.25em] text-beew-noir/40 uppercase">
                {c.city} · {c.sector}
              </p>
              <h3 className="mt-3 text-xl font-semibold tracking-tight">{c.client}</h3>
              <p className="mt-4 text-sm leading-relaxed text-beew-noir/60">{c.summary}</p>
              <p className="mt-5 border-l-2 border-beew-orange pl-4 text-sm font-semibold">
                {c.result}
              </p>
            </article>
          ))}
        </div>
      )}
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  5. Tarif de départ                                                         */
/* -------------------------------------------------------------------------- */

export function ServicePricing({ pricing }: { pricing: ServicePage["pricing"] }) {
  return (
    // Bloc sombre : sans lui, la fin de page enchaînait quatre sections claires
    // d'affilée et le rythme visuel s'effondrait.
    <Section ton="sombre">
      <EnTete
        ton="sombre"
        surtitre="Tarif de départ"
        titre={pricing.heading}
        lien={{ href: "/tarifs", label: "Voir tous les tarifs" }}
      />

      <div className={`mt-16 ${DEUX_COLONNES}`}>
        <div className="rounded-2xl border border-beew-creme/20 p-8 sm:p-10">
          <h3 className="text-[11px] tracking-[0.25em] uppercase opacity-60">{pricing.label}</h3>
          <p className="mt-6 text-[clamp(2.25rem,3.6vw,3rem)] leading-none font-semibold tracking-tight">
            <span className="align-super text-xs font-normal opacity-50">dès </span>
            {pricing.from.toLocaleString("fr-BE")} €
            <span className="ml-2 align-super text-xs font-normal opacity-50">HTVA</span>
          </p>
          <p className="mt-6 text-sm leading-relaxed opacity-65">{pricing.pitch}</p>
          <div className="mt-10">
            <Bouton href="/contact" ton="sombre">
              Réserver un appel
            </Bouton>
          </div>
        </div>

        <div className="lg:pt-3">
          <ul className="space-y-4 text-sm">
            {pricing.includes.map((inclus, i) => (
              <li
                key={inclus}
                data-reveal
                data-reveal-delay={i * 70}
                className="flex gap-4 border-b border-beew-creme/15 pb-4"
              >
                <span aria-hidden className="mt-2.5 h-px w-4 shrink-0 bg-beew-orange" />
                <span className="text-beew-creme/75">{inclus}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-prose text-xs leading-relaxed text-beew-creme/45">{pricing.note}</p>
        </div>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  6. FAQ — le balisage FAQPage est émis séparément dans le JSON-LD           */
/* -------------------------------------------------------------------------- */

export function ServiceFaq({ faq }: { faq: ServicePage["faq"] }) {
  return (
    <Section>
      <EnTete surtitre="Questions" titre="Les questions qu'on nous pose sur ce service" />

      <dl className="mt-16 border-t border-beew-noir/15">
        {faq.map((f, i) => (
          <div
            key={f.question}
            data-reveal
            data-reveal-delay={i * 70}
            className={`${DEUX_COLONNES} border-b border-beew-noir/15 py-8`}
          >
            <dt className="text-[clamp(1.05rem,1.8vw,1.4rem)] font-semibold tracking-tight">
              {f.question}
            </dt>
            <dd className="max-w-prose text-sm leading-relaxed text-beew-noir/60">{f.answer}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  7. CTA                                                                     */
/* -------------------------------------------------------------------------- */

export function ServiceCta({ cta }: { cta: ServicePage["cta"] }) {
  return (
    <Section ton="sombre" className="text-center">
      <h2 className="mx-auto max-w-3xl text-[clamp(1.9rem,4.6vw,3.75rem)] leading-[0.98] font-semibold tracking-tight uppercase">
        {cta.title}
      </h2>
      <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-beew-creme/60">
        {cta.subtitle}
      </p>
      <div className="mt-12">
        <Bouton href="/contact" ton="sombre" taille="grand">
          Réserver un appel
        </Bouton>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  8. Maillage interne                                                        */
/* -------------------------------------------------------------------------- */

export function ServiceLinks({ links }: { links: ServicePage["links"] }) {
  return (
    <Section>
      <EnTete surtitre="Aller plus loin" titre={links.heading} intro={links.intro} />

      <ul className="mt-16 grid gap-px overflow-hidden rounded-2xl bg-beew-noir/10 lg:grid-cols-3">
        {links.services.map((l, i) => (
          <li key={l.href} data-reveal data-reveal-delay={i * 70}>
            <Link
              href={l.href}
              className="group flex h-full flex-col bg-beew-blanc p-8 transition-colors duration-500 hover:bg-beew-noir hover:text-beew-creme sm:p-10"
            >
              <span className="inline-flex items-center gap-2 text-lg font-semibold tracking-tight">
                {l.label}
                <Fleche />
              </span>
              <span className="mt-3 text-sm leading-relaxed opacity-60">{l.description}</span>
            </Link>
          </li>
        ))}
      </ul>

      <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
        {links.pages.map((l, i) => (
          <li key={l.href} data-reveal data-reveal-delay={i * 70}>
            <Link
              href={l.href}
              className="group inline-flex items-center gap-2 border-b border-beew-noir/25 pb-1 text-[11px] tracking-[0.2em] uppercase hover:border-beew-noir"
            >
              {l.label}
              <Fleche />
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
