import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  ArrowUpRight,
  BadgeCheck,
  CheckCircle2,
  FileCheck2,
  LockKeyhole,
  Scale,
  ShieldCheck,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Conditions générales de vente — Beew Agency',
  description:
    'Conditions générales de vente de Beew Agency : prestations web, applications, paiement échelonné, maintenance, hébergement, responsabilité, propriété intellectuelle et obligations du client.',
  alternates: {
    canonical: '/legal/cgv',
  },
  openGraph: {
    title: 'Conditions générales de vente — Beew Agency',
    description:
      'CGV Beew Agency applicables aux prestations web, applications, paiements mensuels, maintenance, hébergement et support.',
    url: 'https://beew.agency/legal/cgv',
    siteName: 'Beew Agency',
    locale: 'fr_BE',
    type: 'article',
  },
}

const updatedAt = '25/06/2026'

const toc = [
  ['identification', 'Identification'],
  ['contrat', 'Nature contractuelle'],
  ['champ', 'Champ d’application'],
  ['commande', 'Commande et périmètre'],
  ['prix', 'Prix, setup et frais tiers'],
  ['mensualites', 'Paiement échelonné'],
  ['impayes', 'Impayés et suspension'],
  ['arret', 'Arrêt anticipé'],
  ['modifications', 'Modifications du contrat'],
  ['obligations-client', 'Responsabilité du client'],
  ['execution', 'Exécution du projet'],
  ['garantie', 'Garantie corrective'],
  ['maintenance', 'Maintenance'],
  ['hebergement', 'Hébergement et comptes'],
  ['rgpd', 'Données personnelles'],
  ['propriete', 'Propriété intellectuelle'],
  ['sortie', 'Reprise par un tiers'],
  ['responsabilite', 'Responsabilité de Beew'],
  ['reclamations', 'Réclamations'],
  ['retractation', 'Consommateurs'],
  ['droit', 'Droit applicable'],
]

const protectivePoints = [
  {
    icon: ShieldCheck,
    title: 'Paiement échelonné cadré',
    text: 'Le paiement mensuel d’un site ou d’une application est une facilité de paiement du prix total, pas un abonnement résiliable librement.',
  },
  {
    icon: FileCheck2,
    title: 'Périmètre verrouillé',
    text: 'Le devis, les spécifications, les validations écrites et les avenants définissent ce qui est inclus. Toute demande supplémentaire est facturable.',
  },
  {
    icon: LockKeyhole,
    title: 'Propriété réservée',
    text: 'Les livrables, accès, sources et transferts définitifs ne sont remis qu’après paiement intégral des sommes dues.',
  },
]

const clientResponsibilities = [
  'Textes, images, vidéos, logos, documents, prix, offres, promotions et informations publiées.',
  'CGV, mentions légales, politique de confidentialité, règlement de concours, conditions commerciales et communications aux utilisateurs.',
  'Conformité de son activité, de ses produits, de ses services, de ses campagnes marketing et de ses obligations fiscales, sociales ou administratives.',
  'Licences des contenus fournis : photos, polices, marques, pictogrammes, vidéos, bases de données et éléments appartenant à des tiers.',
  'Exactitude des instructions données à Beew, accès transmis, validations, tests métiers et décisions prises pendant le projet.',
  'Sauvegarde des données, documents, contenus et exports qui ne sont pas explicitement confiés à Beew dans le cadre d’une mission de maintenance ou de sauvegarde.',
]

const excludedWarranty = [
  'Modification du site ou de l’application par le client ou par un tiers.',
  'Erreur de contenu, faute d’orthographe, prix, offre, clause légale ou règlement fourni ou validé par le client.',
  'Mauvaise utilisation, manipulation incorrecte, perte d’identifiants, suppression involontaire de données ou non-respect des consignes techniques.',
  'Panne, limitation, incident, hausse de prix ou changement de politique d’un prestataire tiers : hébergeur, DNS, API, module, fournisseur de paiement, service email, Supabase, Vercel, Plesk ou équivalent.',
  'Évolution du besoin, nouvelle fonctionnalité, modification graphique, changement légal ou adaptation non prévue au devis.',
  'Incident causé par un impayé, une suspension, une absence de renouvellement, une absence de validation ou un retard de transmission d’information imputable au client.',
]

const monthlyDurations = [
  '11 mensualités après paiement du setup.',
  '23 mensualités après paiement du setup.',
  '35 mensualités après paiement du setup.',
  'Toute autre durée expressément prévue dans le devis, le bon de commande ou le contrat signé.',
]

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string
  eyebrow?: string
  title: string
  children: ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-white/8 py-12">
      {eyebrow && (
        <p className="mb-3 text-xs uppercase tracking-[0.24em] text-electric-blue">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-2xl font-bold tracking-tighter text-white md:text-3xl">
        {title}
      </h2>
      <div className="mt-6 space-y-5 text-sm leading-7 text-[#B9B9C8] md:text-base">
        {children}
      </div>
    </section>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-electric-blue" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function LegalNote({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-sm border border-electric-blue/25 bg-electric-blue/8 p-5 text-sm leading-7 text-white/80">
      <div className="mb-2 flex items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.22em] text-electric-blue">
        <AlertTriangle size={14} /> Point de vigilance
      </div>
      {children}
    </div>
  )
}

export default function CgvPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <section className="relative overflow-hidden border-b border-white/5 px-8 pb-20 pt-36 md:px-14 md:pt-44">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 75% 20%, rgba(0,102,255,0.14) 0%, transparent 45%), radial-gradient(ellipse at 10% 80%, rgba(168,85,247,0.08) 0%, transparent 45%)',
          }}
        />

        <div className="relative z-10 grid gap-12 lg:grid-cols-[1fr_420px] lg:items-end">
          <div>
            <p className="mb-6 text-xs uppercase tracking-[0.3em] text-electric-blue">
              Document contractuel
            </p>
            <h1 className="font-display text-5xl font-bold leading-none tracking-tighter text-white md:text-7xl lg:text-8xl">
              CONDITIONS<br />
              <span className="text-electric-blue">GÉNÉRALES.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-base leading-8 text-[#9999AA] md:text-lg">
              Ces conditions générales encadrent les prestations de Beew Agency : création de sites web,
              applications web, intégrations, maintenance, hébergement, support, SEO technique, accompagnement digital
              et paiements échelonnés.
            </p>
          </div>

          <div className="rounded-sm border border-white/8 bg-white/[0.03] p-6 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.24em] text-[#9999AA]">Beew Agency</p>
            <div className="mt-5 space-y-3 text-sm text-white/80">
              <p>Chemin des Roches 13/3, 6600 Bastogne, Belgique</p>
              <p>N° BCE : BE0666.456.316</p>
              <p>TVA non applicable — régime de franchise petites entreprises, art. 56bis CTVA.</p>
              <a className="inline-flex items-center gap-2 text-electric-blue hover:text-blue-light" href="mailto:dra@beew.agency">
                dra@beew.agency <ArrowUpRight size={13} />
              </a>
            </div>
            <div className="mt-6 border-t border-white/8 pt-5 text-xs text-[#9999AA]">
              Version : 3.0 — Dernière mise à jour : {updatedAt}
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 border-b border-white/5 md:grid-cols-3">
        {protectivePoints.map(({ icon: Icon, title, text }, index) => (
          <div key={title} className="border-white/5 p-8 md:border-r md:p-10 md:last:border-r-0">
            <div className="mb-5 flex items-center justify-between">
              <Icon className="h-6 w-6 text-electric-blue" />
              <span className="font-display text-xs text-[#333340]">0{index + 1}</span>
            </div>
            <h2 className="font-display text-xl font-bold tracking-tighter text-white">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-[#9999AA]">{text}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-12 px-8 py-14 md:px-14 lg:grid-cols-[280px_1fr] lg:gap-20">
        <aside className="hidden lg:block">
          <div className="sticky top-28 rounded-sm border border-white/8 bg-white/[0.02] p-5">
            <p className="mb-5 text-xs uppercase tracking-[0.24em] text-[#9999AA]">Sommaire</p>
            <nav className="flex flex-col gap-2">
              {toc.map(([id, label]) => (
                <a key={id} href={`#${id}`} className="text-sm text-[#9999AA] transition-colors hover:text-white">
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <article className="mx-auto w-full max-w-4xl">
          <Section id="identification" eyebrow="Article 1" title="Identification du prestataire">
            <p>
              Les présentes conditions générales de vente sont établies par Beew Agency, exploitée par Dylan Radelet,
              dont le siège est situé Chemin des Roches 13/3, 6600 Bastogne, Belgique, inscrite à la Banque-Carrefour
              des Entreprises sous le numéro BE0666.456.316.
            </p>
            <p>
              Toute demande peut être adressée par email à <a className="text-electric-blue underline" href="mailto:dra@beew.agency">dra@beew.agency</a>.
            </p>
          </Section>

          <Section id="contrat" eyebrow="Article 2" title="Nature contractuelle et acceptation des CGV">
            <p>
              Les présentes CGV constituent le socle contractuel applicable aux prestations de Beew Agency. Elles forment,
              avec le devis, le bon de commande, le contrat, les annexes, les spécifications validées et les éventuels avenants,
              le contrat conclu entre Beew Agency et le client.
            </p>
            <p>
              La signature d’un devis, l’acceptation écrite d’une offre, la signature d’un bon de commande, le paiement du setup,
              le paiement d’un acompte, la demande de démarrage ou l’utilisation des livrables vaut acceptation pleine et entière
              des présentes CGV, sauf conditions particulières écrites et acceptées par Beew Agency.
            </p>
            <p>
              Le client reconnaît avoir reçu les présentes CGV ou avoir pu en prendre connaissance avant son engagement,
              notamment via une annexe, un lien stable indiqué dans l’offre, un envoi par email ou une page dédiée du site de Beew Agency.
            </p>
            <LegalNote>
              <p>
                Pour renforcer la preuve d’acceptation, chaque devis ou bon de commande doit indiquer que le client accepte les CGV,
                leur version et leur date de mise à jour. Les conditions particulières signées prévalent sur les CGV en cas de contradiction.
              </p>
            </LegalNote>
          </Section>

          <Section id="champ" eyebrow="Article 3" title="Champ d’application et ordre de priorité">
            <p>
              Les présentes CGV s’appliquent à toutes les prestations conclues avec Beew Agency, sauf dérogation écrite
              expressément acceptée dans le devis, le bon de commande, le contrat ou l’avenant signé entre les parties.
            </p>
            <p>
              Elles couvrent notamment : sites vitrines, sites e-commerce, applications web, MVP, portails métiers,
              intégrations API, bases de données, interfaces d’administration, SEO technique, maintenance, support,
              hébergement, configuration de noms de domaine, accompagnement digital et tout service connexe.
            </p>
            <p>
              En cas de contradiction entre les documents contractuels, l’ordre de priorité est le suivant : contrat ou avenant signé,
              devis accepté, bon de commande, cahier des charges ou spécifications validées, présentes CGV, puis échanges écrits complémentaires.
            </p>
          </Section>

          <Section id="commande" eyebrow="Article 4" title="Devis, commande et périmètre">
            <p>
              Le devis précise le périmètre de la mission, les livrables, les étapes, les hypothèses de travail, les délais indicatifs,
              les conditions de paiement, la durée de l’échéancier éventuel, les mensualités, le setup et les frais tiers inclus ou exclus.
              Sauf indication contraire, un devis est valable 30 jours.
            </p>
            <p>
              La commande est ferme dès acceptation écrite du devis, signature manuscrite ou électronique, validation par email,
              paiement du setup, paiement d’un acompte ou démarrage demandé expressément par le client.
            </p>
            <p>
              Toute demande non prévue au devis constitue une demande complémentaire : nouvelle page, nouvelle fonctionnalité,
              changement d’architecture, intégration supplémentaire, modification importante de design, changement de logique métier,
              ajout de langue, migration, automatisation, import de données, adaptation réglementaire ou prestation de formation.
            </p>
            <LegalNote>
              <p>
                Une demande formulée oralement doit être confirmée par écrit pour être intégrée au projet. Beew peut refuser,
                reporter ou chiffrer séparément toute demande qui sort du périmètre initial.
              </p>
            </LegalNote>
          </Section>

          <Section id="prix" eyebrow="Article 5" title="Prix, setup, frais tiers et paiement">
            <p>
              Les prix sont indiqués en euros. La TVA n’est pas applicable sous le régime de franchise des petites entreprises,
              sauf changement de régime fiscal applicable à Beew Agency.
            </p>
            <p>
              Les modalités de paiement sont précisées dans le devis, le bon de commande ou le contrat : setup, acompte,
              paiement intermédiaire, solde avant livraison, paiement mensuel, échéancier, paiement annuel ou abonnement de maintenance.
            </p>
            <p>
              Le setup est dû à la commande, sauf mention contraire. Il couvre notamment le démarrage du projet, l’analyse,
              la réservation du planning, la configuration initiale, les frais de mise en place, les premiers travaux techniques
              et, lorsque le devis le prévoit, certains frais tiers ou frais mensuels nécessaires pendant la durée de paiement convenue.
            </p>
            <p>
              Dès que le setup est payé et que le projet a démarré, le client ne peut plus revenir unilatéralement sur sa commande
              sans application des conditions d’arrêt anticipé prévues aux présentes CGV ou dans le contrat signé.
            </p>
            <p>
              Les frais tiers restent à charge du client lorsqu’ils sont nécessaires au projet : hébergement, nom de domaine,
              email transactionnel, API, abonnement SaaS, licence, banque d’images, police payante, fournisseur de paiement,
              module externe, outil d’analyse ou service équivalent.
            </p>
            <p>
              Les frais tiers engagés pour le compte du client restent dus dès leur engagement et ne sont pas remboursables
              lorsqu’ils ne sont pas récupérables auprès du fournisseur concerné. Toute hausse de prix, dépassement de quota,
              option ajoutée ou frais non prévu au devis peut être refacturé au client.
            </p>
          </Section>

          <Section id="mensualites" eyebrow="Article 6" title="Paiement échelonné : mensualités et absence d’abonnement">
            <p>
              Lorsque le devis, le bon de commande ou le contrat prévoit un paiement mensuel pour un site, une application,
              une intégration ou un développement spécifique, ce paiement mensuel constitue une facilité d’échelonnement du prix total convenu.
              Il ne constitue pas un abonnement librement résiliable, sauf mention contraire expresse et écrite.
            </p>
            <p>
              Le prix total du projet correspond au setup, aux mensualités prévues, aux options acceptées, aux frais tiers refacturables,
              aux prestations complémentaires et à tout montant prévu dans les documents contractuels.
            </p>
            <p>
              Sauf échéancier différent prévu par écrit, la première mensualité est due un mois après le paiement du setup.
              Les mensualités suivantes sont dues chaque mois à la même date ou à la date indiquée sur la facture.
            </p>
            <div className="rounded-sm border border-white/8 bg-white/[0.02] p-5">
              <h3 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-white">Durées habituelles</h3>
              <div className="mt-4">
                <BulletList items={monthlyDurations} />
              </div>
            </div>
            <p>
              Le client reste redevable de l’intégralité du prix convenu, même en cas de non-utilisation du site,
              de changement de prestataire, de fermeture de son activité, de modification de ses besoins, de changement d’avis,
              d’arrêt du projet à son initiative ou de résiliation anticipée non imputable à Beew Agency.
            </p>
            <p>
              Les mensualités doivent être payées sans compensation, retenue, réduction unilatérale ou suspension décidée par le client,
              sauf accord écrit signé entre les parties.
            </p>
          </Section>

          <Section id="impayes" eyebrow="Article 7" title="Retards de paiement, impayés, suspension et exigibilité du solde">
            <p>
              Toute facture est payable à son échéance. En cas de retard de paiement, Beew Agency peut envoyer un rappel par email,
              courrier ou tout autre moyen écrit permettant d’établir la demande de paiement.
            </p>
            <p>
              Pour les clients professionnels, tout retard peut entraîner, de plein droit, l’application des intérêts de retard prévus par
              la législation applicable aux transactions commerciales, ainsi qu’une indemnité forfaitaire légale de recouvrement,
              sans préjudice des frais raisonnables supplémentaires justifiés.
            </p>
            <p>
              Le client dispose d’un délai de 30 jours calendrier à compter de l’échéance impayée ou du rappel écrit pour régulariser
              l’intégralité des montants échus, sauf délai plus court ou plus long prévu dans le contrat ou accord écrit signé entre les parties.
            </p>
            <p>
              À défaut de régularisation complète dans ce délai, l’intégralité du solde restant dû au titre du projet, de l’échéancier,
              des mensualités, des frais tiers, des options et des prestations complémentaires devient immédiatement exigible.
            </p>
            <p>
              Une fois le solde devenu exigible, Beew Agency peut accorder un délai de paiement maximal de 3 mois par accord écrit.
              À défaut de paiement dans ce délai ou à défaut d’accord écrit, le dossier peut être transmis à un conseil, un organisme de recouvrement,
              un huissier de justice ou toute autorité compétente, dans les limites prévues par la loi.
            </p>
            <p>
              En cas de retard de paiement, Beew Agency peut suspendre tout ou partie des prestations : développement, maintenance,
              support, corrections, évolutions, hébergement géré, mise en ligne, transfert, livraison, export, remise des accès,
              réunion, accompagnement ou intervention technique.
            </p>
            <p>
              La suspension ne constitue pas une résiliation du contrat, ne suspend pas l’obligation de paiement du client et ne donne droit
              à aucune indemnité, réduction, remboursement ou prolongation gratuite.
            </p>
            <LegalNote>
              <p>
                Pour les clients consommateurs, les rappels, délais, intérêts, indemnités et frais éventuels sont appliqués uniquement
                dans les limites impératives prévues par le droit applicable aux dettes de consommateurs.
              </p>
            </LegalNote>
          </Section>

          <Section id="arret" eyebrow="Article 8" title="Arrêt anticipé, annulation et résiliation">
            <p>
              Après paiement du setup et démarrage du projet, le client ne peut pas annuler librement la commande sans conséquence financière.
              Le setup reste acquis à Beew Agency, sauf disposition impérative contraire applicable au client consommateur.
            </p>
            <p>
              Pour les projets payables par mensualités, le client qui souhaite arrêter le projet avant son terme dispose, sauf accord écrit différent,
              de deux possibilités : poursuivre le paiement jusqu’au terme de l’échéancier ou solliciter une sortie anticipée moyennant le paiement
              immédiat d’une indemnité de dédit équivalente à 6 mensualités.
            </p>
            <p>
              Lorsque le solde restant dû est inférieur à 6 mensualités, le client doit payer uniquement le solde restant dû.
              Lorsque le projet est déjà livré, mis en ligne, substantiellement exécuté ou transféré, Beew Agency peut refuser la sortie limitée
              à 6 mensualités et réclamer le solde complet du prix convenu.
            </p>
            <p>
              Toute sortie anticipée doit être confirmée par écrit par Beew Agency. À défaut d’accord écrit, le contrat, l’échéancier
              et les obligations de paiement restent applicables jusqu’à leur terme.
            </p>
            <p>
              En cas de résiliation imputable au client, notamment en cas d’impayé persistant, de refus de collaboration, de refus de validation,
              de non-transmission des éléments nécessaires, de comportement abusif ou de changement de prestataire sans paiement complet,
              Beew Agency peut réclamer les montants échus, le solde restant dû, les frais tiers engagés et les prestations complémentaires réalisées.
            </p>
          </Section>

          <Section id="modifications" eyebrow="Article 9" title="Modifications du contrat, des CGV et du projet">
            <p>
              Toute modification du périmètre, du planning, des fonctionnalités, du design, des technologies, des intégrations,
              des contenus, des frais tiers ou de l’échéancier doit faire l’objet d’un accord écrit entre les parties.
            </p>
            <p>
              Beew Agency peut mettre à jour ses CGV pour l’avenir. La version applicable à un contrat est en principe celle acceptée
              au moment de la commande, sauf acceptation écrite d’une nouvelle version, changement légal, contrainte technique,
              exigence de sécurité, modification imposée par un prestataire tiers ou adaptation nécessaire à la poursuite du service.
            </p>
            <p>
              Si une adaptation nécessaire à la poursuite du projet ou du service est refusée par le client, ce refus ne libère pas le client
              de ses obligations de paiement relatives au prix forfaitaire convenu. Les parties peuvent convenir par écrit soit de poursuivre
              selon les conditions techniquement possibles, soit de mettre fin à la collaboration moyennant paiement du solde dû.
            </p>
            <p>
              Aucun refus de modification, aucune contestation non fondée et aucun désaccord sur une demande complémentaire ne permet au client
              de suspendre unilatéralement le paiement des factures échues ou des mensualités prévues.
            </p>
          </Section>

          <Section id="obligations-client" eyebrow="Article 10" title="Responsabilités et obligations du client">
            <p>
              Le client reste seul responsable de son activité, de ses décisions commerciales, de ses obligations légales et de tous les contenus
              ou instructions transmis à Beew Agency. Beew intervient comme prestataire technique et créatif, sauf mission juridique, comptable,
              fiscale ou réglementaire explicitement prévue dans un contrat séparé.
            </p>
            <BulletList items={clientResponsibilities} />
            <LegalNote>
              <p>
                Pour tout projet impliquant un concours, une tombola, un jeu promotionnel, un gain, une collecte de données sensibles,
                un secteur réglementé, une activité médicale, pharmaceutique, financière, assurantielle, alimentaire ou une obligation légale spécifique,
                le client doit faire valider son dispositif par un professionnel compétent. Beew ne garantit pas la conformité légale des règles,
                textes, promesses commerciales ou mécaniques métier du client.
              </p>
            </LegalNote>
            <p>
              Le client garantit Beew Agency contre toute réclamation, sanction, demande, perte ou dommage provenant d’un contenu fourni
              ou validé par le client, d’une instruction du client, d’une activité du client, d’un produit ou service du client,
              ou d’une modification réalisée après livraison par le client ou par un tiers. Cette garantie s’applique dans les limites autorisées par la loi.
            </p>
          </Section>

          <Section id="execution" eyebrow="Article 11" title="Exécution du projet, validations et délais">
            <p>
              Les délais communiqués sont indicatifs, sauf engagement écrit exprès. Ils dépendent notamment de la réception des contenus,
              accès, validations, retours, paiements, décisions et informations nécessaires.
            </p>
            <p>
              Le client s’engage à fournir les éléments nécessaires dans des délais raisonnables : textes, images, accès, comptes,
              validations, contenus, documents, règles métier, informations légales et informations techniques.
            </p>
            <p>
              Le client s’engage à tester les livrables avec attention, en particulier les parcours critiques : formulaire, paiement,
              connexion, envoi d’email, tableau d’administration, import de données, droits d’accès, génération de document ou intégration API.
            </p>
            <p>
              À chaque étape, le client dispose de 7 jours ouvrables pour signaler par écrit les anomalies constatées, avec une description précise,
              capture d’écran, navigateur, appareil utilisé et étapes permettant de reproduire le problème. En B2B, l’absence de retour dans ce délai
              vaut validation de l’étape concernée. En B2C, les droits impératifs du consommateur restent applicables.
            </p>
            <p>
              Les retards causés par le client prolongent automatiquement les délais de livraison et ne peuvent pas être imputés à Beew Agency.
            </p>
          </Section>

          <Section id="garantie" eyebrow="Article 12" title="Garantie corrective et anomalies techniques">
            <p>
              Beew Agency fournit une garantie corrective de 30 jours calendaires après mise en ligne initiale ou livraison finale,
              sauf durée supérieure prévue au devis. Cette garantie couvre uniquement les anomalies techniques reproductibles,
              directement imputables au développement réalisé par Beew et par rapport au périmètre validé.
            </p>
            <p>
              La garantie corrective n’est pas une maintenance évolutive, une assistance illimitée, une surveillance permanente,
              une astreinte, une garantie de résultat commercial ou une garantie de compatibilité avec toute modification future d’un outil tiers.
            </p>
            <h3 className="font-display text-lg font-bold tracking-tighter text-white">Sont exclus de la garantie corrective :</h3>
            <BulletList items={excludedWarranty} />
          </Section>

          <Section id="maintenance" eyebrow="Article 13" title="Maintenance, support et évolutions">
            <p>
              La maintenance n’est incluse que si elle est prévue au devis, dans un abonnement ou dans un contrat séparé.
              À défaut, toute intervention après livraison est facturable au taux horaire applicable ou sur devis.
            </p>
            <p>
              La maintenance peut couvrir, selon l’offre acceptée : mises à jour de dépendances, corrections mineures, sauvegardes,
              surveillance, support, petites adaptations, monitoring, assistance utilisateur ou évolutions planifiées.
              Les quotas, délais de réponse et niveaux de priorité sont ceux mentionnés dans l’offre acceptée.
            </p>
            <p>
              Toute évolution fonctionnelle, nouvelle page, nouveau module, refonte, migration, changement de prestataire,
              changement légal ou ajout non prévu est facturé séparément.
            </p>
            <p>
              Beew Agency peut suspendre la maintenance et le support en cas d’impayé, sans que cette suspension ne libère le client
              de son obligation de paiement.
            </p>
          </Section>

          <Section id="hebergement" eyebrow="Article 14" title="Hébergement, noms de domaine et comptes tiers">
            <p>
              Sauf mention contraire, les comptes nécessaires au projet doivent idéalement être créés au nom du client : hébergement,
              domaine, DNS, analytics, base de données, fournisseur email, outil de paiement, API ou service externe.
              Lorsque Beew gère techniquement ces comptes, le client reste responsable des frais, règles et conditions imposés par les fournisseurs concernés.
            </p>
            <p>
              Beew ne peut être tenue responsable des interruptions, limitations, pertes de service, changements de prix, suspensions,
              blocages, failles, incidents ou modifications provenant d’un prestataire tiers. Les niveaux de service applicables sont ceux des fournisseurs concernés.
            </p>
            <p>
              En cas d’impayé, Beew Agency peut suspendre ou laisser suspendre l’hébergement, les services techniques, les outils tiers,
              les domaines ou les accès liés au projet, après rappel écrit, dans les limites autorisées par la loi et selon les contraintes techniques applicables.
            </p>
            <p>
              Le client reste responsable des conséquences liées à ses propres contenus, instructions, décisions, activités, données,
              offres, prix, textes légaux et obligations métiers, y compris pendant une période de suspension ou de retard de paiement.
            </p>
          </Section>

          <Section id="rgpd" eyebrow="Article 15" title="Données personnelles et RGPD">
            <p>
              Pour les données traitées via le site ou l’application du client, le client agit en principe comme responsable du traitement.
              Beew agit comme sous-traitant lorsqu’elle traite des données personnelles pour le compte du client et sur ses instructions documentées.
            </p>
            <p>
              Le client est responsable de la base légale des traitements, de l’information des utilisateurs, des durées de conservation,
              des droits des personnes, des registres, des mentions RGPD, des consentements et de la conformité de son activité.
            </p>
            <p>
              Beew met en œuvre des mesures techniques raisonnables : accès restreints, secrets hors dépôt, bonnes pratiques de configuration,
              séparation des environnements lorsque prévue, et assistance raisonnable en cas d’incident. Aucun système connecté à Internet
              ne peut toutefois être garanti comme totalement exempt de risque.
            </p>
          </Section>

          <Section id="propriete" eyebrow="Article 16" title="Propriété intellectuelle, réserve de propriété, code et livrables">
            <p>
              Les éléments préexistants de Beew Agency restent sa propriété : méthodes, composants génériques, structures réutilisables,
              bibliothèques internes, snippets, savoir-faire, architecture type, automatisations, modèles, configurations et outils développés indépendamment du projet du client.
            </p>
            <p>
              Tant que l’intégralité des sommes dues n’a pas été payée, le site, l’application, le code source, les maquettes,
              configurations, bases techniques, automatisations, documentations, exports, accès définitifs et livrables spécifiques
              restent sous réserve de propriété ou de remise au profit de Beew Agency, dans les limites autorisées par la loi.
            </p>
            <p>
              Pendant la période de paiement échelonné, le client dispose uniquement d’un droit d’utilisation du site ou de l’application,
              à condition de respecter les échéances de paiement. Ce droit d’utilisation peut être suspendu en cas d’impayé.
            </p>
            <p>
              Après paiement intégral des sommes dues, le client reçoit les droits nécessaires pour utiliser, exploiter et faire évoluer
              les livrables spécifiques réalisés pour son projet, dans le cadre de son activité. Lorsque le devis prévoit expressément
              une cession des droits patrimoniaux ou la remise du code source, celle-ci n’intervient qu’après paiement complet.
            </p>
            <p>
              Les éléments open source ou tiers restent soumis à leurs licences respectives. Le client ne peut pas demander à Beew
              de violer une licence, une marque, un droit d’auteur, une restriction API ou les conditions d’un fournisseur tiers.
            </p>
            <p>
              Beew peut mentionner le projet dans son portfolio, sauf demande écrite contraire du client avant publication ou clause de confidentialité spécifique.
            </p>
          </Section>

          <Section id="sortie" eyebrow="Article 17" title="Reprise par un tiers, transfert et fin de collaboration">
            <p>
              Le client peut confier la suite du projet à un tiers, sous réserve du paiement complet des sommes dues à Beew Agency.
            </p>
            <p>
              Aucun transfert définitif, aucune remise de code source, aucun export complet, aucune passation technique, aucun transfert de dépôt Git,
              aucun transfert d’hébergement, aucun transfert de nom de domaine, aucune documentation technique détaillée et aucune assistance
              à un nouveau prestataire ne sera effectué tant que les sommes dues n’auront pas été intégralement payées.
            </p>
            <p>
              Toute intervention de reprise, transfert, audit, documentation détaillée, rotation de secrets, export, migration,
              réunion de passation ou assistance à un nouveau prestataire peut être facturée sur devis ou au taux horaire applicable,
              sauf si ces éléments étaient prévus dans l’offre initiale.
            </p>
            <p>
              À partir du moment où le site, l’application, le code, la base de données ou l’hébergement sont modifiés par un tiers
              ou par le client, Beew n’est plus responsable des anomalies, failles, pertes de données, régressions ou incompatibilités pouvant en résulter.
            </p>
          </Section>

          <Section id="responsabilite" eyebrow="Article 18" title="Responsabilité de Beew Agency">
            <p>
              Beew Agency est tenue à une obligation de moyens. Elle s’engage à réaliser les prestations avec sérieux,
              selon les règles de l’art raisonnablement applicables à une petite agence web, mais ne garantit aucun résultat commercial,
              référencement précis, chiffre d’affaires, taux de conversion, absence totale de bug, absence totale d’interruption ou sécurité absolue.
            </p>
            <div className="rounded-sm border border-white/8 bg-white/[0.02] p-6">
              <div className="mb-4 flex items-center gap-3 text-white">
                <Scale className="h-5 w-5 text-electric-blue" />
                <h3 className="font-display text-lg font-bold tracking-tighter">Limitation de responsabilité</h3>
              </div>
              <p className="text-sm leading-7 text-[#9999AA]">
                En B2B, sauf disposition légale impérative contraire, la responsabilité totale de Beew Agency est limitée aux montants effectivement payés
                par le client pour la prestation concernée au cours des 12 derniers mois. Les dommages indirects, pertes de chiffre d’affaires,
                pertes de données non sauvegardées par le client, pertes d’exploitation, atteintes à l’image, pertes de chance ou préjudices commerciaux indirects
                sont exclus. Aucune limitation ne s’applique en cas de dol, faute lourde ou dommage corporel lorsqu’une telle exclusion est interdite.
              </p>
            </div>
            <p>
              Beew Agency ne peut être tenue responsable des conséquences d’une instruction du client, d’un contenu fourni ou validé par le client,
              d’un choix métier du client, d’une modification réalisée par le client ou un tiers, d’un défaut de paiement, d’une suspension justifiée,
              d’un service tiers ou d’un refus du client de suivre une recommandation technique raisonnable.
            </p>
            <p>
              En B2C, les limitations ci-dessus s’appliquent uniquement dans les limites autorisées par les dispositions impératives protégeant le consommateur.
            </p>
          </Section>

          <Section id="reclamations" eyebrow="Article 19" title="Réclamations, recouvrement et frais de procédure">
            <p>
              Toute réclamation doit être adressée à <a className="text-electric-blue underline" href="mailto:dra@beew.agency">dra@beew.agency</a> avec les éléments permettant de comprendre la demande :
              facture, projet concerné, description précise, captures d’écran, contexte, navigateur, appareil et étapes de reproduction lorsque la demande concerne une anomalie technique.
            </p>
            <p>
              Une réclamation ne suspend pas l’obligation de payer les montants non contestés, les mensualités prévues ou les frais tiers engagés.
            </p>
            <p>
              En cas de procédure judiciaire, les frais de défense, frais d’avocat, frais d’expertise et frais de recouvrement pourront être réclamés
              à la partie succombante dans les limites prévues par la loi et/ou selon la décision de la juridiction compétente.
            </p>
            <p>
              Pour les consommateurs, en cas d’échec du traitement amiable, le client peut contacter le Service de Médiation pour le Consommateur,
              Boulevard du Roi Albert II 8 bte 1, 1000 Bruxelles, contact@mediationconsommateur.be.
            </p>
          </Section>

          <Section id="retractation" eyebrow="Article 20" title="Clients consommateurs, droit de rétractation et dettes de consommateurs">
            <p>
              Les présentes CGV sont principalement destinées aux clients professionnels. Lorsqu’un client agit comme consommateur,
              les dispositions impératives du droit de la consommation prévalent sur toute clause contraire.
            </p>
            <p>
              Lorsqu’un contrat est conclu à distance avec un consommateur, celui-ci dispose en principe d’un délai légal de rétractation de 14 jours,
              sauf exception légale applicable.
            </p>
            <p>
              Lorsque le consommateur demande expressément que la prestation commence avant la fin du délai de rétractation,
              il reconnaît que les prestations déjà exécutées peuvent être dues. Si le service est pleinement exécuté avant la fin du délai
              avec accord exprès et reconnaissance de la perte du droit de rétractation, ce droit peut être perdu conformément aux règles applicables.
            </p>
            <p>
              Les prestations personnalisées ou réalisées selon les spécifications du client peuvent également être soumises aux exceptions prévues par le Code de droit économique.
            </p>
            <p>
              En cas de retard de paiement d’un consommateur, Beew Agency applique les règles impératives relatives au premier rappel,
              aux délais légaux, aux intérêts, aux indemnités et aux frais de recouvrement applicables aux dettes de consommateurs.
            </p>
          </Section>

          <Section id="droit" eyebrow="Article 21" title="Force majeure, droit applicable et juridiction">
            <p>
              Aucune partie n’est responsable d’un manquement causé par un événement de force majeure ou un événement indépendant de sa volonté raisonnable :
              panne majeure fournisseur, cyberattaque externe, catastrophe naturelle, guerre, décision administrative, coupure réseau,
              indisponibilité d’un service tiers, incident DNS ou événement équivalent.
            </p>
            <p>
              Les présentes CGV sont soumises au droit belge. Pour les clients professionnels, les tribunaux compétents sont ceux de l’arrondissement judiciaire
              du siège de Beew Agency, sauf disposition impérative contraire. Pour les consommateurs, les règles légales de compétence territoriale restent applicables.
            </p>
          </Section>

          <div className="my-14 rounded-sm border border-electric-blue/30 bg-electric-blue/10 p-7">
            <div className="flex flex-col gap-5 md:flex-row md:items-start">
              <BadgeCheck className="h-7 w-7 shrink-0 text-electric-blue" />
              <div>
                <h2 className="font-display text-2xl font-bold tracking-tighter text-white">Acceptation des CGV</h2>
                <p className="mt-3 text-sm leading-7 text-white/75">
                  La signature d’un devis, l’accord écrit, le paiement du setup, le paiement d’un acompte, la demande de démarrage
                  ou l’utilisation des livrables vaut acceptation des présentes CGV. Les CGV forment, avec les documents particuliers acceptés,
                  le contrat entre Beew Agency et le client.
                </p>
                <Link href="/contact" className="mt-6 inline-flex items-center gap-2 bg-electric-blue px-5 py-3 font-display text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-blue-dark">
                  Contacter Beew <ArrowUpRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
