import { DEUX_COLONNES, EnTete, Fleche, Section, Surtitre } from "@/components/ui/section";
import Link from "next/link";
import type { Case } from "@/content/schemas/case";
import { serviceLabel } from "@/content/schemas/case";

/**
 * Sections de la page d'étude de cas, dans l'ordre de PAGES.md §3 :
 * contexte · problème · solution · résultat chiffré · témoignage · CTA.
 *
 * Le récit précède le chiffre : un résultat annoncé avant qu'on ait compris le
 * point de départ ne prouve rien.
 *
 * Le hero n'est plus ici : la page passe par `PageHero`, qui porte le `<h1>`
 * unique, le fil d'Ariane et le visuel de l'étude.
 */

/** Contexte · problème · solution, sur le gabarit à deux colonnes du site. */
export function CaseNarrative({ cas }: { cas: Case }) {
  const blocs = [
    { surtitre: "Contexte", titre: "Le point de départ", corps: cas.context },
    { surtitre: "Problème", titre: "Ce qui bloquait", corps: cas.problem },
    { surtitre: "Solution", titre: "Ce que nous avons fait", corps: cas.solution },
  ];

  return (
    <Section>
      <div className="grid gap-16">
        {blocs.map((b, i) => (
          <div key={b.surtitre} data-reveal data-reveal-delay={i * 70}>
            <EnTete surtitre={b.surtitre} titre={b.titre} intro={b.corps.split(/\n{2,}/)} />
          </div>
        ))}
      </div>
    </Section>
  );
}

/**
 * Le résultat chiffré, en grand et sur fond sombre : c'est la seule information
 * de la page qu'un visiteur pressé doit retenir.
 */
export function CaseResult({ cas }: { cas: Case }) {
  const { headline, detail, proof } = cas.result;

  return (
    <Section ton="sombre">
      <div className={DEUX_COLONNES}>
        <div>
          <Surtitre ton="sombre">Résultat</Surtitre>
          <p className="mt-6 text-[clamp(1.9rem,4.6vw,3.75rem)] leading-[0.98] font-semibold tracking-tight uppercase">
            {headline}
          </p>
        </div>

        <div className="space-y-6 text-sm leading-relaxed text-beew-creme/60 lg:pt-3">
          <p>{detail}</p>

          {proof ? (
            <dl className="grid gap-4 border-t border-beew-creme/20 pt-6 sm:grid-cols-2">
              <Preuve terme="Source" valeur={proof.source} />
              <Preuve terme="Période" valeur={proof.period} />
              <Preuve terme="Mesure" valeur={proof.method} />
              <Preuve terme="Vérifié le" valeur={proof.verifiedAt} />
            </dl>
          ) : (
            /* Sans traçabilité, on le dit — le schéma interdit de toute façon
               de publier une étude dans cet état. */
            <p className="border-t border-beew-creme/20 pt-6 text-xs text-beew-creme/45">
              Source et méthode de mesure non renseignées : cette étude est un contenu de
              démonstration, elle n&apos;est pas publiée.
            </p>
          )}
        </div>
      </div>
    </Section>
  );
}

function Preuve({ terme, valeur }: { terme: string; valeur: string }) {
  return (
    <div>
      <dt className="text-[10px] tracking-[0.25em] text-beew-creme/40 uppercase">{terme}</dt>
      <dd className="mt-2 text-sm text-beew-creme/70">{valeur}</dd>
    </div>
  );
}

export function CaseTestimonial({ cas }: { cas: Case }) {
  const t = cas.testimonial;
  if (!t) return null;

  return (
    // Bloc sombre : la citation est le second temps fort de la page après le
    // résultat, et sans lui trois sections claires s'enchaînaient.
    <Section ton="sombre">
      <figure className="border-t border-beew-creme/20 pt-10">
        <Surtitre ton="sombre">Le mot du client</Surtitre>
        <blockquote className="mt-8 max-w-4xl text-[clamp(1.35rem,3vw,2.4rem)] leading-snug font-medium tracking-tight">
          « {t.quote} »
        </blockquote>
        <figcaption className="mt-10 flex flex-wrap items-baseline gap-x-3 text-sm">
          <span className="font-semibold">{t.author}</span>
          <span className="text-beew-creme/50">
            {t.role}, {t.company} — {t.city}
          </span>
        </figcaption>
      </figure>
    </Section>
  );
}

/**
 * Services mobilisés + maillage sortant.
 * Chaque étude renvoie vers sa page service et vers sa page ville : c'est ce
 * qui transforme la preuve en autorité pour les pages qui doivent ranker.
 */
export function CaseDeliverables({
  cas,
  ville,
}: {
  cas: Case;
  ville?: { slug: string; city: string };
}) {
  return (
    <Section>
      <EnTete surtitre="Services mobilisés" titre="Ce que couvrait la mission" />

      <ul className="mt-14 grid gap-px overflow-hidden rounded-2xl bg-beew-noir/12 sm:grid-cols-2 lg:grid-cols-3">
        {cas.deliverables.map((d, i) => (
          <li
            key={d}
            data-reveal
            data-reveal-delay={i * 70}
            className="group flex gap-4 bg-beew-blanc p-7 text-sm leading-relaxed transition-colors duration-500 hover:bg-beew-noir hover:text-beew-creme"
          >
            <span className="mt-2 h-px w-4 shrink-0 bg-beew-vert transition-all duration-500 group-hover:w-7" />
            <span className="opacity-75">{d}</span>
          </li>
        ))}
      </ul>

      <div className="mt-14 grid gap-px overflow-hidden rounded-2xl bg-beew-noir/10 sm:grid-cols-2">
        <LienContexte
          href={`/${cas.service}`}
          surtitre="Prestation"
          libelle={serviceLabel(cas.service)}
        />
        {ville && (
          <LienContexte
            href={`/${ville.slug}`}
            surtitre="Zone"
            libelle={`Création de site internet à ${ville.city}`}
          />
        )}
      </div>
    </Section>
  );
}

function LienContexte({
  href,
  surtitre,
  libelle,
}: {
  href: string;
  surtitre: string;
  libelle: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-6 bg-beew-blanc p-8 transition-colors hover:bg-beew-noir hover:text-beew-creme"
    >
      <span>
        <span className="block text-[10px] tracking-[0.25em] uppercase opacity-40">{surtitre}</span>
        <span className="mt-2 block text-base font-semibold tracking-tight">{libelle}</span>
      </span>
      <Fleche />
    </Link>
  );
}

/** Navigation vers l'étude suivante — on ne laisse pas le lecteur en cul-de-sac. */
export function CaseNext({ suivante }: { suivante?: Case }) {
  if (!suivante) return null;

  return (
    <Section className="!py-16">
      <Link
        href={`/realisations/${suivante.slug}`}
        rel={suivante.status === "draft" ? "nofollow" : undefined}
        className="group grid gap-8 border-t border-beew-noir/15 pt-10 sm:grid-cols-[1fr_auto] sm:items-end"
      >
        <div>
          <Surtitre>Étude suivante</Surtitre>
          <p className="mt-6 text-[clamp(1.5rem,3.4vw,2.75rem)] leading-[1] font-semibold tracking-tight uppercase">
            {suivante.client}
          </p>
          <p className="mt-4 text-sm text-beew-noir/55">
            {suivante.city} · {suivante.sector.label}
          </p>
        </div>
        <span className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase opacity-60">
          Lire
          <Fleche />
        </span>
      </Link>
    </Section>
  );
}
