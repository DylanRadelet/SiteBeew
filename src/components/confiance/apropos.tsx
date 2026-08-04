import { DEUX_COLONNES, EnTete, Fleche, Section } from "@/components/ui/section";
import Image from "next/image";
import Link from "next/link";
import { doux } from "@/components/confiance/blocs";
import type { AProps } from "@/content/schemas/confiance";

/** Sections propres à /a-propos. Aucun texte ici : tout vient de a-propos.json. */

/* -------------------------------------------------------------------------- */
/*  Histoire — le bloc qui porte le contenu unique de la page                 */
/* -------------------------------------------------------------------------- */

export function Histoire({ histoire }: { histoire: AProps["histoire"] }) {
  return (
    <Section>
      <EnTete
        surtitre={histoire.surtitre}
        titre={histoire.titre}
        intro={[histoire.intro, ...histoire.paragraphes]}
        gauche={
          /* L'image accompagne le récit sous le titre, sans couper la lecture. */
          <div className="relative mt-12 hidden aspect-[4/3] overflow-hidden rounded-2xl bg-beew-noir/5 lg:block">
            <Image
              src={histoire.image.src}
              alt={histoire.image.alt}
              fill
              sizes="(min-width:1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
        }
      />
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Équipe                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * TODO : remplacer par les vraies personnes.
 *
 * Tant que l'équipe n'est pas documentée, cette section ne décrit que des
 * RÔLES : aucun prénom, aucun parcours, aucune photo de visage identifiable.
 * Inventer un membre d'équipe serait une fausse preuve, au même titre qu'un
 * faux témoignage — voir PAGES.md §4. `note` dit publiquement pourquoi la
 * section est incomplète ; elle sera retirée en même temps que ce TODO.
 */
export function Equipe({ equipe }: { equipe: AProps["equipe"] }) {
  return (
    <Section>
      <EnTete surtitre={equipe.surtitre} titre={equipe.titre} intro={equipe.intro} />

      <div className={`mt-16 ${DEUX_COLONNES}`}>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-beew-noir/5">
          <Image
            src={equipe.image.src}
            alt={equipe.image.alt}
            fill
            sizes="(min-width:1024px) 40vw, 100vw"
            className="object-cover"
          />
        </div>

        <ul className="grid gap-x-10 gap-y-9 sm:grid-cols-2">
          {equipe.roles.map((r, i) => (
            <li key={r.role} data-reveal data-reveal-delay={i * 70} className="border-t border-beew-noir/15 pt-5">
              <h3 className="text-base font-semibold tracking-tight">{r.role}</h3>
              <p className="mt-3 text-sm leading-relaxed text-beew-noir/60">{r.texte}</p>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-12 max-w-prose border-l-2 border-beew-orange pl-5 text-xs leading-relaxed text-beew-noir/50">
        {equipe.note}
      </p>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Chiffres — engagements de service, jamais des résultats commerciaux       */
/* -------------------------------------------------------------------------- */

export function Chiffres({ chiffres }: { chiffres: AProps["chiffres"] }) {
  return (
    <Section>
      <EnTete surtitre={chiffres.surtitre} titre={chiffres.titre} intro={chiffres.intro} />

      <dl className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {chiffres.items.map((s, i) => (
          <div key={s.label} data-reveal data-reveal-delay={i * 70} className="border-t border-beew-noir/20 pt-6">
            <dt className="text-[clamp(2.25rem,4.4vw,3.75rem)] leading-none font-semibold tracking-tight">
              {s.valeur}
            </dt>
            <dd className="mt-4 max-w-[24ch] text-sm leading-relaxed text-beew-noir/55">{s.label}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Zone d'intervention                                                       */
/* -------------------------------------------------------------------------- */

export function Zone({ zone }: { zone: AProps["zone"] }) {
  return (
    <Section ton="sombre">
      <EnTete
        ton="sombre"
        surtitre={zone.surtitre}
        titre={zone.titre}
        intro={zone.paragraphes}
      />

      {/* Communes en texte simple, sans lien : le maillage vers les villes est
          porté par le hub, pas par cette page. */}
      <ul className="mt-14 flex flex-wrap gap-2">
        {zone.communes.map((c, i) => (
          <li
            key={c}
            data-reveal
            data-reveal-delay={i * 70}
            className="rounded-full border border-beew-creme/25 px-4 py-1.5 text-[11px] tracking-[0.15em] uppercase"
          >
            {c}
          </li>
        ))}
      </ul>

      <div className="mt-12">
        <Link
          href={zone.lien.href}
          className="group inline-flex items-center gap-2 border-b border-beew-creme/30 pb-1 text-[11px] tracking-[0.2em] uppercase hover:border-beew-creme"
        >
          {zone.lien.label}
          <Fleche />
        </Link>
      </div>
    </Section>
  );
}
