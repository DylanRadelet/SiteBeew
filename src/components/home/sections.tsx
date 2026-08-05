import { Bouton, EnTete, Fleche, GUTTER, Section, Surtitre } from "@/components/ui/section";
import Image from "next/image";
import Link from "next/link";
import { MethodList } from "@/components/home/MethodList";
import { Reseaux } from "@/components/ui/Reseaux";
import type { CaseStudy, Home, Testimonial } from "@/content/schema";

/**
 * Sections de la home, dans l'ordre défini par PAGES.md §2.
 *
 * L'ordre vient de l'analyse de cinq agences qui convertissent : la preuve
 * précède toujours la proposition. Ne pas réordonner sans relire PAGES.md.
 *
 * Le rythme visuel alterne clair et sombre pour découper la page :
 * confiance · chiffres · réalisations (clair) → services (sombre) →
 * méthode · convictions (clair) → témoignages (sombre) →
 * tarifs · questions (clair) → conclusion (sombre).
 */

/* -------------------------------------------------------------------------- */
/*  2. Bandeau de confiance — défilement continu des logos                    */
/* -------------------------------------------------------------------------- */

export function TrustBar({ trust }: { trust: Home["trust"] }) {
  const [premier, ...suivants] = trust.logos;

  return (
    <Section className="!pt-20 !pb-16 sm:!pt-28 sm:!pb-20" anime={false}>
      <EnTete
        surtitre="Références"
        titre={trust.label}
        droite={
          <p className="max-w-sm text-sm leading-relaxed text-beew-noir/55">
            Six projets livrés, du site vitrine à l'application web. Les études
            de cas détaillées arrivent au fur et à mesure des accords clients.
          </p>
        }
      />

      {/*
        Mosaïque asymétrique plutôt qu'une grille de six cases identiques : la
        première réalisation occupe deux colonnes et une hauteur double, les
        autres se rangent autour. Un damier régulier n'accroche pas le regard,
        et six cartes de même taille se lisent comme un tableau, pas comme un
        portfolio.

        Les captures sont visibles EN PERMANENCE, en noir et blanc, et
        reviennent en couleur au survol : cachées jusqu'au survol, elles ne
        servaient à rien sur mobile, où il n'y a pas de survol.
      */}
      <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {premier && <CarteProjet projet={premier} large />}
        {suivants.map((p, i) => (
          <CarteProjet key={p.name} projet={p} retard={(i + 1) * 60} />
        ))}
      </div>
    </Section>
  );
}

/** Une réalisation. `large` occupe deux colonnes et deux rangées. */
function CarteProjet({
  projet,
  large = false,
  retard = 0,
}: {
  projet: Home["trust"]["logos"][number];
  large?: boolean;
  retard?: number;
}) {
  return (
    <article
      data-reveal
      data-reveal-delay={retard}
      className={`group relative isolate flex flex-col justify-end overflow-hidden rounded-xl bg-beew-noir p-6 text-beew-creme ${
        large ? "min-h-[19rem] sm:col-span-2 sm:row-span-2 lg:min-h-[26rem]" : "min-h-[12.5rem]"
      }`}
    >
      {projet.file && (
        <Image
          src={projet.file}
          alt={`${projet.name} — ${projet.projet ?? "projet réalisé par BEEW"}`}
          fill
          sizes={large ? "(min-width:1024px) 50vw, 100vw" : "(min-width:1024px) 25vw, 50vw"}
          className="pointer-events-none -z-10 object-cover grayscale transition-all duration-700 ease-out group-hover:scale-[1.04] group-hover:grayscale-0"
        />
      )}
      <span
        aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-beew-noir via-beew-noir/55 to-beew-noir/20 transition-opacity duration-700 group-hover:opacity-80"
      />

      <h3
        className={`font-semibold tracking-tight transition-transform duration-500 group-hover:translate-x-1 ${
          large ? "text-[clamp(1.5rem,2.8vw,2.25rem)]" : "text-lg"
        }`}
      >
        {projet.name}
      </h3>
      {projet.projet && (
        <p
          className={`mt-2 leading-relaxed text-beew-creme/60 ${
            large ? "max-w-sm text-sm" : "text-[11px] tracking-[0.12em] uppercase"
          }`}
        >
          {projet.projet}
        </p>
      )}
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/*  4. Réalisations — AVANT les services. Point non négociable.               */
/* -------------------------------------------------------------------------- */

export function CasesFeatured({ cases }: { cases: CaseStudy[] }) {
  const [premier, ...autres] = cases;

  return (
    <Section>
      <div data-reveal>
        <EnTete
          surtitre="Réalisations"
          titre="Des résultats mesurés, pas des captures d'écran"
          lien={{ href: "/realisations", label: "Tout voir" }}
        />
      </div>

      {/* Grille asymétrique : la première réalisation occupe deux fois la place.
          Un damier régulier de trois cartes égales n'accroche pas le regard. */}
      <div className="mt-16 grid gap-x-8 gap-y-14 lg:grid-cols-3">
        {premier && <CarteCas cas={premier} large />}
        <div className="flex flex-col gap-14">
          {autres.map((c, i) => (
            <CarteCas key={c.client} cas={c} retard={(i + 1) * 110} />
          ))}
        </div>
      </div>
    </Section>
  );
}

function CarteCas({
  cas,
  large = false,
  retard = 0,
}: {
  cas: CaseStudy;
  large?: boolean;
  retard?: number;
}) {
  return (
    <article
      data-reveal
      data-reveal-delay={retard}
      className={`group ${large ? "lg:col-span-2" : ""}`}
    >
      {cas.image && (
        <div
          className={`relative overflow-hidden rounded-2xl bg-beew-noir/5 ${
            large ? "aspect-[16/10]" : "aspect-[16/11]"
          }`}
        >
          <Image
            src={cas.image}
            alt=""
            fill
            sizes={large ? "(min-width:1024px) 66vw, 100vw" : "(min-width:1024px) 33vw, 100vw"}
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
          />
        </div>
      )}

      <div className={large ? "mt-8 grid gap-6 sm:grid-cols-[1.2fr_1fr]" : "mt-6"}>
        <div>
          <p className="text-[10px] tracking-[0.25em] text-beew-noir/40 uppercase">
            {cas.city} · {cas.sector}
          </p>
          <h3
            className={`mt-3 font-semibold tracking-tight ${
              large ? "text-[clamp(1.4rem,2.4vw,2rem)]" : "text-xl"
            }`}
          >
            {cas.client}
          </h3>
          <p className="mt-4 max-w-prose text-sm leading-relaxed text-beew-noir/60">{cas.summary}</p>
        </div>

        {/* Le résultat chiffré est ce qui vend : il est détaché et accentué. */}
        <p
          className={`border-l-2 border-beew-orange pl-5 text-sm leading-relaxed font-semibold ${
            large ? "sm:self-center" : "mt-5"
          }`}
        >
          {cas.result}
        </p>
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/*  5. Services — bloc sombre, grille en bento                                */
/* -------------------------------------------------------------------------- */

/**
 * LE bloc services — un seul pour la home ET pour les pages villes.
 *
 * Chaque carte est un lien entier vers sa page pilier : c'est le maillage
 * home/villes → services, et le seul endroit du site où ces six pages sont
 * atteignables depuis le corps d'une page plutôt que depuis le menu.
 */
export function ServicesBento({ services }: { services: Home["services"] }) {
  return (
    <Section ton="sombre">
      <div data-reveal>
        <EnTete
          ton="sombre"
          surtitre="Services"
          titre={`${MOTS[services.length] ?? services.length} façons de vous rendre visible`}
        />
      </div>

      <div className="mt-16 grid gap-px overflow-hidden rounded-2xl bg-beew-creme/15 sm:grid-cols-2">
        {services.map((s, i) => (
          <article key={s.slug} data-reveal data-reveal-delay={i * 80}>
            <Link
              href={`/${s.slug}`}
              className="group relative isolate flex h-full flex-col overflow-hidden bg-beew-noir p-8 transition-colors duration-500 sm:p-12"
            >
              {/* L'image du service se révèle au survol, derrière le texte.
                  Au repos la grille reste sobre : six visuels affichés en
                  permanence transformeraient la section en catalogue. */}
              <Image
                src={`/images/services/${s.slug}.webp`}
                alt=""
                aria-hidden
                fill
                sizes="(min-width:640px) 50vw, 100vw"
                className="pointer-events-none -z-10 object-cover opacity-0 transition-all duration-[900ms] ease-out group-hover:scale-105 group-hover:opacity-100"
              />
              {/* Voile : le texte crème doit rester lisible sur n'importe
                  quelle zone de la photo, y compris les plus claires. */}
              <span
                aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 bg-beew-noir/72 opacity-0 transition-opacity duration-[900ms] group-hover:opacity-100"
              />
              <span className="text-[11px] tracking-[0.25em] text-beew-vert">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-8 text-[clamp(1.3rem,2.2vw,1.9rem)] font-semibold tracking-tight transition-transform duration-500 group-hover:translate-x-1">
                {s.title}
              </h3>
              <p className="mt-4 max-w-md text-sm leading-relaxed opacity-60">{s.description}</p>
              {/* `mt-auto` : la flèche est calée en bas quelle que soit la
                  longueur de la description, sinon les six cartes se décalent. */}
              <span className="mt-10 inline-flex items-center gap-2 pt-2 text-[11px] tracking-[0.2em] uppercase opacity-70 mt-auto">
                En savoir plus
                <Fleche />
              </span>
            </Link>
          </article>
        ))}
      </div>
    </Section>
  );
}

/** Le titre annonce un nombre : il doit suivre le contenu, pas être écrit en dur. */
const MOTS: Record<number, string> = { 3: "Trois", 4: "Quatre", 5: "Cinq", 6: "Six", 7: "Sept" };

/* -------------------------------------------------------------------------- */
/*  6. Méthode                                                                */
/* -------------------------------------------------------------------------- */

export function Method({ method }: { method: Home["method"] }) {
  return (
    <Section>
      <div data-reveal>
        <div data-reveal>
          <EnTete surtitre="Méthode" titre={method.heading} intro={method.intro} />
        </div>
      </div>
      <MethodList steps={method.steps} />
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  7. Convictions — différenciation et renversement du risque                */
/* -------------------------------------------------------------------------- */

export function WhyUs({ why }: { why: Home["why"] }) {
  return (
    <Section>
      <div data-reveal>
        <EnTete surtitre="Pourquoi BEEW" titre={why.heading} />
      </div>

      <div className="mt-16 grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {why.points.map((p, i) => (
          <div
            key={p.title}
            data-reveal
            data-reveal-delay={i * 70}
            className="border-t-2 border-beew-orange pt-6"
          >
            <h3 className="text-lg font-semibold tracking-tight">{p.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-beew-noir/60">{p.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  8. Témoignages — bloc sombre, citations en grand                          */
/* -------------------------------------------------------------------------- */

export function TestimonialsDark({ testimonials }: { testimonials: Testimonial[] }) {
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
            data-reveal-delay={i * 90}
            className="border-t border-beew-creme/20 pt-8"
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

/* -------------------------------------------------------------------------- */
/* 10. Tarifs                                                                 */
/* -------------------------------------------------------------------------- */

export function Pricing({ pricing }: { pricing: Home["pricing"] }) {
  return (
    <Section>
      <div data-reveal>
        <EnTete surtitre="Tarifs" titre={pricing.heading} />
      </div>

      <div className="mt-16 grid gap-6 lg:grid-cols-3">
        {pricing.tiers.map((t, i) => (
          <article
            key={t.name}
            data-reveal
            data-reveal-delay={i * 90}
            className={`flex flex-col rounded-2xl p-8 sm:p-10 ${
              t.highlight ? "bg-beew-noir text-beew-creme" : "border border-beew-noir/15"
            }`}
          >
            <h3 className="text-[11px] tracking-[0.25em] uppercase opacity-60">{t.name}</h3>
            <p className="mt-6 text-[clamp(2.25rem,3.6vw,3rem)] leading-none font-semibold tracking-tight">
              <span className="align-super text-xs font-normal opacity-50">dès </span>
              {t.from.toLocaleString("fr-BE")} €
            </p>
            <p className="mt-6 text-sm leading-relaxed opacity-65">{t.pitch}</p>

            <ul className="mt-8 space-y-3 text-sm">
              {t.includes.map((i) => (
                <li key={i} className="flex gap-3">
                  <span aria-hidden className="mt-2.5 h-px w-3.5 shrink-0 bg-beew-orange" />
                  <span className="opacity-80">{i}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 pt-2">
              <Bouton href="/contact" ton={t.highlight ? "sombre" : "clair"}>
                Réserver un appel
              </Bouton>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-10 max-w-2xl text-xs leading-relaxed text-beew-noir/45">
        {pricing.note}{" "}
        {/* `/devis` n'était atteignable que depuis le menu : une page de
            conversion sans lien dans le corps du site ne reçoit ni visiteurs,
            ni autorité interne. */}
        <Link href="/devis" className="text-beew-noir underline underline-offset-4">
          Obtenir un devis chiffré
        </Link>
        .
      </p>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* 13. Conclusion + signature géante                                          */
/* -------------------------------------------------------------------------- */

export function FinalCta() {
  return (
    <div className="relative isolate flex flex-1 flex-col justify-center overflow-hidden py-6">
      {/* Le bandeau passe DERRIÈRE la conclusion : c'est une texture de fond,
          pas un bloc de contenu. Il n'ajoute donc plus de hauteur à la page. */}
      <Bandeau />

      <div className="relative mx-auto max-w-4xl text-center">
        <Surtitre ton="sombre">Parlons-en</Surtitre>
        {/* Titre volontairement contenu : conclusion et colonnes partagent un
            seul écran, et les colonnes en occupent déjà 438 px. Chaque rem
            gagné ici est un rem qui ne pousse pas le pied de page dehors. */}
        <h2 className="mt-4 text-[clamp(1.5rem,3.2vw,2.4rem)] leading-[1] font-semibold tracking-tight uppercase">
          Votre projet mérite mieux qu&apos;un devis à l&apos;aveugle
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-beew-creme/60">
          Premier rendez-vous sur place, sans frais ni engagement. Vous repartez avec un devis fixe
          sous 48 h, que vous nous confiiez le projet ou non.
        </p>
        <div className="mt-6">
          <Bouton href="/contact" ton="sombre" taille="grand">
            Réserver un appel
          </Bouton>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Pied de page                                                              */
/* -------------------------------------------------------------------------- */

/** Termes du bandeau. Ce sont les six services, pas des mots-clés décoratifs. */
const BANDEAU = [
  "BEEW AGENCY",
  "Création de site internet",
  "Site e-commerce",
  "Référencement local",
  "Refonte de site",
  "Application web",
  "Outils internes",
];

/**
 * Bande défilante en FOND de la conclusion.
 *
 * Elle remplace la signature « BEEW AGENCY » composée en 10,5 vw, qui mangeait
 * un tiers de la hauteur d'écran pour répéter un nom déjà présent partout.
 * Posée derrière le texte, elle ne coûte plus aucune hauteur : le pied de page
 * de l'accueil tient de nouveau sur une seule vue.
 *
 * Très grande et très pâle — `text-beew-creme/[0.06]` : elle doit se deviner,
 * pas se lire. Au-delà, elle entrerait en concurrence avec le titre qu'elle est
 * censée porter.
 *
 * L'animation est en CSS et ne dépend d'aucun script. La liste est rendue DEUX
 * fois et la translation s'arrête à -50 % : au moment où la première copie sort
 * de l'écran, la seconde occupe exactement sa place de départ, ce qui rend la
 * boucle invisible. Une seule copie produirait un saut à chaque cycle.
 *
 * `aria-hidden` : ces mots figurent déjà dans la navigation et les titres de la
 * page. Les faire relire par une synthèse vocale n'ajouterait que du bruit.
 */
function Bandeau() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 overflow-hidden select-none"
    >
      <div className="flex w-max animate-[bandeau_60s_linear_infinite] motion-reduce:animate-none">
        {[0, 1].map((copie) => (
          <ul key={copie} className="flex shrink-0 items-center">
            {BANDEAU.map((mot) => (
              <li
                key={mot}
                className="flex items-center gap-10 pr-10 text-[clamp(4rem,13vw,11rem)] leading-none font-bold tracking-tighter whitespace-nowrap text-beew-creme/[0.06] uppercase"
              >
                {mot}
                <span className="h-3 w-3 shrink-0 rounded-full bg-beew-vert/25" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

/**
 * Conclusion compacte des pages internes.
 *
 * Même promesse que `FinalCta` mais sans la signature géante : celle-ci est
 * réservée à la home, sinon elle perd sa valeur de signature.
 */
/**
 * Conclusion des pages internes. Même contrainte que celle de l'accueil : elle
 * partage un écran avec les colonnes du pied de page, qui en occupent déjà
 * 437 px. Les mesures sont calées sur un écran de 720 px, la hauteur utile la
 * plus courante sur un portable.
 */
export function ConclusionCompacte() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-6 text-center">
      <Surtitre ton="sombre">Parlons-en</Surtitre>
      <h2 className="mt-4 max-w-3xl text-[clamp(1.5rem,3.2vw,2.4rem)] leading-[1] font-semibold tracking-tight uppercase">
        Un devis fixe sous 48 h, sans engagement
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-beew-creme/60">
        Une heure sur place pour comprendre votre projet, puis un chiffrage détaillé poste par
        poste. Le document vous appartient, que vous nous confiiez le projet ou non.
      </p>
      <div className="mt-6">
        <Bouton href="/contact" ton="sombre" taille="grand">
          Réserver un appel
        </Bouton>
      </div>
    </div>
  );
}

/**
 * Pied de page de l'accueil : conclusion ET colonnes dans UN SEUL bloc calé sur
 * la hauteur de l'écran, exactement comme `PiedDePageInterne`.
 *
 * Les deux étaient auparavant séparés — la conclusion rendue par la page, les
 * colonnes par le layout — et s'additionnaient : 720 px pour l'une, 438 pour
 * les autres, soit 1 157 px là où les pages internes tiennent en 720.
 */
export function Footer({ provinces }: FooterProps) {
  return (
    <footer className={`flex min-h-svh flex-col bg-beew-noir pb-12 text-beew-creme ${GUTTER}`}>
      <FinalCta />
      <FooterColonnes provinces={provinces} />
    </footer>
  );
}

/**
 * Le pied de page ne porte que les étages structurels de la pyramide locale.
 * Les communes sont distribuées par les pages provinces, le menu et le hub —
 * les répéter ici n'ajoutait aucun signal et allongeait la colonne pour rien.
 */
export type FooterProps = {
  provinces: { slug: string; name: string }[];
};

/**
 * Colonnes du pied de page, partagées par les deux variantes.
 *
 * Extraites pour qu'il n'existe QUE deux pieds de page sur le site : celui de
 * la home, avec la signature géante, et celui des pages internes, calé sur la
 * hauteur de l'écran. Toute troisième variante serait une régression.
 */
export function FooterColonnes({ provinces }: FooterProps) {
  const colonnes = [
    {
      titre: "Services",
      liens: [
        { href: "/creation-site-internet", label: "Création de site internet" },
        { href: "/refonte-site-internet", label: "Refonte de site" },
        { href: "/referencement-seo", label: "Référencement SEO" },
        { href: "/site-e-commerce", label: "Site e-commerce" },
        { href: "/application-web", label: "Application web" },
        { href: "/outils-internes", label: "Outils internes" },
      ],
    },
    {
      titre: "Agence",
      liens: [
        { href: "/realisations", label: "Réalisations" },
        { href: "/methode", label: "Notre méthode" },
        { href: "/tarifs", label: "Tarifs" },
        { href: "/a-propos", label: "À propos" },
      ],
    },
  ];

  return (
    <>
      <div className="grid gap-12 border-t border-beew-creme/15 pt-12 sm:grid-cols-2 lg:grid-cols-4">
        {colonnes.map((c) => (
          <div key={c.titre}>
            <p className="text-[10px] tracking-[0.25em] text-beew-creme/40 uppercase">{c.titre}</p>
            <ul className="mt-5 space-y-2.5 text-sm">
              {c.liens.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-beew-creme/70 transition-colors hover:text-beew-creme">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <p className="text-[10px] tracking-[0.25em] text-beew-creme/40 uppercase">
            Zones d&apos;intervention
          </p>
          {/* La pyramide, pas une liste de villes : le pied de page porte les
              étages structurels (région, provinces) et laisse aux provinces le
              soin de distribuer vers leurs communes. Les villes restent
              accessibles depuis le menu et le hub. */}
          <ul className="mt-5 space-y-2.5 text-sm">
            <li>
              <Link href="/wallonie" className="text-beew-creme/70 transition-colors hover:text-beew-creme">
                Wallonie
              </Link>
            </li>
            {provinces.map((p) => (
              <li key={p.slug} className="pl-3">
                <Link href={`/${p.slug}`} className="text-beew-creme/60 transition-colors hover:text-beew-creme">
                  {p.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/zones-d-intervention" className="group inline-flex items-center gap-2 text-beew-creme">
                Toutes nos zones
                <Fleche />
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-[10px] tracking-[0.25em] text-beew-creme/40 uppercase">Contact</p>
          <ul className="mt-5 space-y-2.5 text-sm text-beew-creme/70">
            <li>
              <a href="mailto:hello@beew.agency" className="transition-colors hover:text-beew-creme">
                hello@beew.agency
              </a>
            </li>
            <li>
              <a href="tel:+32472467309" className="transition-colors hover:text-beew-creme">
                +32 472 46 73 09
              </a>
            </li>
            <li>Chemin des Roches, 6600 Bastogne</li>
            <li>Du lundi au vendredi, 9h — 18h</li>
          </ul>

          {/* Les mêmes profils que ceux déclarés en `sameAs` dans le JSON-LD. */}
          <div className="mt-6">
            <Reseaux />
          </div>
        </div>
      </div>

      <div className="mt-14 flex flex-col gap-4 border-t border-beew-creme/15 pt-8 text-[11px] text-beew-creme/40 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} BEEW — Agence web indépendante</p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          <li>
            <Link href="/mentions-legales" className="hover:text-beew-creme">
              Mentions légales
            </Link>
          </li>
          <li>
            <Link href="/politique-de-confidentialite" className="hover:text-beew-creme">
              Confidentialité
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}

/**
 * Pied de page des pages internes.
 *
 * Contrainte demandée : l'ensemble occupe EXACTEMENT la hauteur de l'écran, pas
 * plus. `min-h-svh` + colonne flex : la conclusion prend l'espace disponible au
 * centre, les colonnes se calent en bas. Sur mobile le contenu peut dépasser un
 * écran — c'est voulu, sinon le texte deviendrait illisible.
 */
export function PiedDePageInterne({ provinces }: FooterProps) {
  return (
    <footer className={`flex min-h-svh flex-col bg-beew-noir pb-12 text-beew-creme ${GUTTER}`}>
      <ConclusionCompacte />
      <FooterColonnes provinces={provinces} />
    </footer>
  );
}
