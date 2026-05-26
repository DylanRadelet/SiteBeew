// src/app/services/creation-site-web/page.tsx
'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { ArrowUpRight, Check, Monitor, ShoppingCart, Sparkles } from 'lucide-react'

const offres = [
  {
    titre: 'Site Vitrine',
    prix: 'Dès 1 500€',
    description: 'Idéal pour présenter votre activité, vos services et générer des contacts.',
    color: '#0066FF',
    icon: Monitor,
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80',
    features: [
      "Jusqu'à 6 pages",
      'Design sur mesure',
      'SEO technique inclus',
      'Formulaire de contact',
      'Google Analytics',
      'Responsive mobile',
      'Mise en ligne incluse',
    ],
  },
  {
    titre: 'E-Commerce',
    prix: 'Dès 3 500€',
    description: 'Boutique en ligne complète avec gestion produits, paiements et commandes.',
    color: '#A855F7',
    icon: ShoppingCart,
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    highlight: true,
    features: [
      'Catalogue produits illimité',
      'Paiement Stripe / Mollie',
      'Gestion des stocks',
      'Espace client',
      'Emails transactionnels',
      'SEO e-commerce',
      'Dashboard admin',
    ],
  },
  {
    titre: 'Site Premium',
    prix: 'Sur devis',
    description: 'Pour les projets complexes avec CMS, multilingue, animations avancées.',
    color: '#22C55E',
    icon: Sparkles,
    image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80',
    features: [
      'CMS headless (Sanity)',
      'Multilingue',
      'Animations Framer Motion',
      'Blog / actualités',
      'Optimisation Core Web Vitals',
      'A/B testing',
      'Support prioritaire',
    ],
  },
]

const process = [
  {
    n: '01',
    title: 'Découverte',
    desc: 'Appel de cadrage pour comprendre vos objectifs, votre cible et votre budget.',
    color: '#0066FF',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80',
  },
  {
    n: '02',
    title: 'Maquettes',
    desc: 'Design des pages clés sur Figma. Validation avant développement.',
    color: '#A855F7',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80',
  },
  {
    n: '03',
    title: 'Développement',
    desc: 'Intégration Next.js, responsive, SEO technique et performance.',
    color: '#22C55E',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80',
  },
  {
    n: '04',
    title: 'Recette',
    desc: 'Tests cross-browser, mobile, accessibilité. Corrections incluses.',
    color: '#F97316',
    image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&q=80',
  },
  {
    n: '05',
    title: 'Mise en ligne',
    desc: 'Déploiement sur Vercel, configuration DNS, analytics activés.',
    color: '#EAB308',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
  },
  {
    n: '06',
    title: 'Suivi',
    desc: 'Maintenance évolutive et support depuis Bastogne.',
    color: '#06B6D4',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
  },
]

export default function CreationSiteWebPage() {
  const ref1 = useRef<HTMLDivElement>(null)
  const ref2 = useRef<HTMLDivElement>(null)
  const inView1 = useInView(ref1, { once: true, margin: '-10%' })
  const inView2 = useInView(ref2, { once: true, margin: '-10%' })

  return (
    <div className="min-h-screen bg-[#0A0A0A]">

      {/* Hero */}
      <section className="px-8 md:px-14 pt-32 pb-24 border-b border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(0,102,255,0.07) 0%, transparent 60%)' }} />
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
          <div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-xs uppercase tracking-[0.3em] text-electric-blue mb-6">
              Service · Site web
            </motion.p>
            <div className="overflow-hidden">
              <motion.h1 initial={{ y: 80 }} animate={{ y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="font-display font-bold text-5xl md:text-7xl tracking-tighter leading-none">
                CRÉATION<br />
                <span className="text-electric-blue">SITE WEB.</span>
              </motion.h1>
            </div>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="max-w-xs md:text-right">
            <p className="text-base text-[#9999AA] leading-relaxed mb-4">
              Sites vitrines, e-commerce et portails sur mesure. Rapides, accessibles, bien référencés.
            </p>
            <div className="flex gap-2 md:justify-end flex-wrap">
              {offres.map(o => (
                <span key={o.titre} className="text-xs px-3 py-1 rounded-full border font-display font-bold"
                  style={{ borderColor: o.color + '60', color: o.color, backgroundColor: o.color + '15' }}>
                  {o.titre}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Offres */}
      <section ref={ref1} className="px-8 md:px-14 py-24 border-b border-white/5">
        <motion.p initial={{ opacity: 0 }} animate={inView1 ? { opacity: 1 } : {}}
          className="text-xs uppercase tracking-[0.2em] text-electric-blue mb-4">
          Nos formules
        </motion.p>
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={inView1 ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="font-display font-bold text-4xl md:text-5xl tracking-tighter mb-16">
          Choisissez votre formule.
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {offres.map((offre, i) => {
            const Icon = offre.icon
            return (
              <motion.div key={offre.titre}
                initial={{ opacity: 0, y: 20 }}
                animate={inView1 ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="relative border rounded-sm flex flex-col overflow-hidden group"
                style={{ borderColor: offre.highlight ? offre.color : 'rgba(255,255,255,0.1)' }}
              >
                {offre.highlight && (
                  <span className="hidden md:block absolute top-10 left-20 text-xs px-3 py-1 rounded-full font-bold z-20"
                    style={{ backgroundColor: offre.color, color: 'white' }}>
                    Populaire
                  </span>
                )}

                {/* Image fond */}
                <div className="absolute inset-0 bg-cover bg-center opacity-15 group-hover:opacity-25 transition-opacity duration-500"
                  style={{ backgroundImage: `url(${offre.image})` }} />
                <div className="absolute inset-0"
                  style={{ background: `linear-gradient(to bottom, ${offre.color}20, #0A0A0A 65%)` }} />
                <div className="absolute inset-0 bg-[#0A0A0A]/65" />

                <div className="relative z-10 p-8 flex flex-col gap-5 h-full">
                  {/* Icône + prix */}
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-sm border flex items-center justify-center"
                      style={{ borderColor: offre.color + '40', backgroundColor: offre.color + '15' }}>
                      <Icon size={18} style={{ color: offre.color }} />
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-widest text-[#9999AA] mb-1">{offre.titre}</p>
                      <p className="font-display font-bold text-2xl tracking-tighter"
                        style={{ color: offre.color }}>
                        {offre.prix}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-[#9999AA] group-hover:text-white/70 transition-colors">
                    {offre.description}
                  </p>

                  <div className="h-px" style={{ backgroundColor: offre.color + '20' }} />

                  <ul className="flex flex-col gap-2.5 flex-1">
                    {offre.features.map(f => (
                      <li key={f} className="flex items-start gap-3 text-sm text-[#9999AA] hover:text-white transition-colors">
                        <Check size={13} className="mt-0.5 flex-shrink-0" style={{ color: offre.color }} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link href="/contact"
                    className="mt-auto inline-flex items-center justify-center gap-2 py-3.5 font-display font-bold text-xs uppercase tracking-widest rounded-sm transition-all text-white"
                    style={{
                      backgroundColor: offre.highlight ? offre.color : 'transparent',
                      border: `1px solid ${offre.color}60`,
                    }}
                  >
                    Demander un devis
                    <ArrowUpRight size={12} />
                  </Link>
                </div>

                {/* Barre couleur bas au hover */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 w-0 group-hover:w-full transition-all duration-500"
                  style={{ backgroundColor: offre.color }} />
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Process */}
      <section ref={ref2} className="px-8 md:px-14 py-24 border-b border-white/5">
        <motion.p initial={{ opacity: 0 }} animate={inView2 ? { opacity: 1 } : {}}
          className="text-xs uppercase tracking-[0.2em] text-electric-blue mb-4">
          Notre process
        </motion.p>
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={inView2 ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="font-display font-bold text-4xl md:text-5xl tracking-tighter mb-16">
          De l'idée au site en ligne.
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {process.map((step, i) => (
            <motion.div key={step.n}
              initial={{ opacity: 0, y: 20 }}
              animate={inView2 ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="relative border rounded-sm overflow-hidden group"
              style={{ borderColor: 'rgba(255,255,255,0.05)', minHeight: '160px' }}
            >
              {/* Image fond */}
              <div className="absolute inset-0 bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity duration-500"
                style={{ backgroundImage: `url(${step.image})` }} />
              <div className="absolute inset-0"
                style={{ background: `linear-gradient(135deg, ${step.color}15, #0A0A0A 70%)` }} />
              <div className="absolute inset-0 bg-[#0A0A0A]/70" />
              {/* Barre gauche */}
              <div className="absolute left-0 top-0 bottom-0 w-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: step.color }} />

              <div className="relative z-10 p-8">
                <span className="font-display font-bold text-5xl leading-none block mb-4 transition-colors duration-300"
                  style={{ color: 'rgba(255,255,255,0.08)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = step.color + '40')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.08)')}
                >
                  {step.n}
                </span>
                <h3 className="font-display font-bold text-lg tracking-tight mb-2 transition-colors duration-300 group-hover:text-white"
                  style={{ color: 'white' }}>
                  {step.title}
                </h3>
                <p className="text-sm text-[#9999AA] group-hover:text-white/60 transition-colors">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 md:px-14 py-24 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(0,102,255,0.06) 0%, transparent 60%)' }} />
        <div className="relative z-10">
          <p className="text-xs uppercase tracking-widest text-electric-blue mb-4">Prêt ?</p>
          <h2 className="font-display font-bold text-4xl tracking-tighter">Démarrons votre projet.</h2>
        </div>
        <Link href="/contact"
          className="relative z-10 inline-flex items-center gap-3 bg-electric-blue text-white px-10 py-5 font-display font-bold text-sm uppercase tracking-widest rounded-sm hover:bg-blue-dark transition-colors group">
          Demander un devis gratuit
          <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </section>
    </div>
  )
}