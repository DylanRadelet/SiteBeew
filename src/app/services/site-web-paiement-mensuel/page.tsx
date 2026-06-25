// src/app/services/site-web-paiement-mensuel/page.tsx
'use client'
import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { ArrowUpRight, Check, Calculator, AlertCircle, Zap, Shield, TrendingUp } from 'lucide-react'

const MINIMUMS: Record<number, number> = { 12: 2000, 24: 4000, 36: 8000 }
const SETUP: Record<number, number> = { 12: 250, 24: 300, 36: 350 }
const REMISES: Record<number, number> = { 12: 0, 24: 0.05, 36: 0.15 }

const plans = [
  {
    mois: 12,
    label: '12 mois',
    remiseLabel: null,
    desc: "L'offre la plus flexible pour démarrer rapidement.",
    minSite: 2000,
    color: '#0066FF',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
    icon: Zap,
  },
  {
    mois: 24,
    label: '24 mois',
    remiseLabel: '-5%',
    desc: 'Économisez 5% sur le prix de base du site.',
    highlight: true,
    minSite: 4000,
    color: '#A855F7',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
    icon: TrendingUp,
  },
  {
    mois: 36,
    label: '36 mois',
    remiseLabel: '-15%',
    desc: 'La remise maximale pour les projets long terme.',
    minSite: 8000,
    color: '#22C55E',
    image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&q=80',
    icon: Shield,
  },
]

const included = [
  'Site web professionnel sur mesure',
  'Design UI/UX personnalisé',
  'Développement Next.js',
  'SEO technique inclus',
  'Responsive mobile',
  'Formulaire de contact',
  'Google Analytics',
  'Mise en ligne et hébergement',
  'Mises à jour de sécurité mensuelles',
  'Support réactif inclus',
  'Sauvegardes automatiques',
  'Monitoring de disponibilité',
]

export default function PaiementMensuelPage() {
  const [duree, setDuree] = useState(12)
  const [base, setBase] = useState(MINIMUMS[12])
  const ref = useRef<HTMLDivElement>(null)
  const inclRef = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const inclInView = useInView(inclRef, { once: true, margin: '-10%' })

  const minimum = MINIMUMS[duree]
  const setup = SETUP[duree]
  const remise = REMISES[duree]
  const activePlan = plans.find(p => p.mois === duree)!

  const handleDuree = (d: number) => {
    setDuree(d)
    if (base < MINIMUMS[d]) setBase(MINIMUMS[d])
  }

  const baseRemise = base * (1 - remise)
  const mensualite = Math.round(baseRemise / (duree - 1))
  const totalPaye = setup + baseRemise
  const economie = remise > 0 ? Math.round(base * remise) : 0
  const isBelowMin = base < minimum

  return (
    <div className="min-h-screen bg-[#0A0A0A]">

      {/* Hero */}
      <section className="px-8 md:px-14 pt-32 pb-24 border-b border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(0,102,255,0.07) 0%, transparent 60%)' }}
        />
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
          <div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-xs uppercase tracking-[0.3em] text-electric-blue mb-6">
              Service · Financement
            </motion.p>
            <div className="overflow-hidden">
              <motion.h1 initial={{ y: 80 }} animate={{ y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="font-display font-bold text-5xl md:text-7xl tracking-tighter leading-none">
                SITE WEB EN<br />
                <span className="text-electric-blue">MENSUEL.</span>
              </motion.h1>
            </div>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="max-w-xs md:text-right">
            <p className="text-base text-[#9999AA] leading-relaxed mb-4">
              Votre site professionnel dès le premier mois. Payez progressivement, sans intérêts, sans surprise.
            </p>
            {/* Pills des 3 formules */}
            <div className="flex gap-2 md:justify-end flex-wrap">
              {plans.map(p => (
                <span key={p.mois} className="text-xs px-3 py-1 rounded-full border font-display font-bold"
                  style={{ borderColor: p.color + '60', color: p.color, backgroundColor: p.color + '15' }}>
                  {p.label}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Plans */}
      <section className="px-8 md:px-14 py-24 border-b border-white/5">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-xs uppercase tracking-[0.2em] text-electric-blue mb-4">
          Choisissez votre durée
        </motion.p>
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="font-display font-bold text-4xl md:text-5xl tracking-tighter mb-4">
          3 formules, 0 intérêt.
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-sm text-[#9999AA] mb-16 max-w-xl">
          Le setup couvre la mise en place du projet. Les mensualités suivantes couvrent développement + maintenance + support.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan, i) => {
            const Icon = plan.icon
            return (
              <motion.div key={plan.mois}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="relative border rounded-sm flex flex-col overflow-hidden group"
                style={{ borderColor: plan.highlight ? plan.color : 'rgba(255,255,255,0.1)' }}
              >
                {/* Image de fond */}
                <div className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                  style={{ backgroundImage: `url(${plan.image})` }} />
                <div className="absolute inset-0"
                  style={{ background: `linear-gradient(to bottom, ${plan.color}20, #0A0A0A 60%)` }} />
                <div className="absolute inset-0 bg-[#0A0A0A]/70" />

                {plan.highlight && (
                  <span className="hidden md:block absolute top-10 left-20 text-xs px-3 py-1 rounded-full font-bold z-10"
                    style={{ backgroundColor: plan.color, color: 'white' }}>
                    Recommandé
                  </span>
                )}

                <div className="relative z-10 p-8 flex flex-col gap-5 h-full">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-sm border flex items-center justify-center"
                      style={{ borderColor: plan.color + '40', backgroundColor: plan.color + '15' }}>
                      <Icon size={18} style={{ color: plan.color }} />
                    </div>
                    {plan.remiseLabel && (
                      <span className="text-xs px-2 py-1 rounded-sm font-bold"
                        style={{ backgroundColor: plan.color + '20', color: plan.color }}>
                        {plan.remiseLabel}
                      </span>
                    )}
                  </div>

                  {/* Label + setup */}
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[#9999AA] mb-2">{plan.label}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm text-[#9999AA]">setup à partir de</span>
                      <p className="font-display font-bold text-4xl tracking-tighter" style={{ color: plan.color }}>
                        {SETUP[plan.mois]}€
                      </p>
                    </div>
                  </div>

                  <div className="h-px" style={{ backgroundColor: plan.color + '20' }} />

                  <div className="flex flex-col gap-2">
                    <p className="text-xs text-[#9999AA] uppercase tracking-wider">Puis {plan.mois - 1} mensualités</p>
                    <p className="text-sm text-[#9999AA]">calculées sur le prix du site</p>
                  </div>

                  <div className="border rounded-sm p-4" style={{ borderColor: plan.color + '30', backgroundColor: plan.color + '08' }}>
                    <p className="text-xs text-[#9999AA] mb-1">Site minimum</p>
                    <p className="font-display font-bold text-xl text-white">{plan.minSite.toLocaleString()}€</p>
                    <p className="text-xs text-[#9999AA] mt-1">{plan.desc}</p>
                  </div>

                  <Link href="/contact"
                    className="mt-auto inline-flex items-center justify-center gap-2 py-3.5 font-display font-bold text-xs uppercase tracking-widest rounded-sm transition-all text-white"
                    style={{ backgroundColor: plan.highlight ? plan.color : 'transparent', border: `1px solid ${plan.color}60` }}
                  >
                    Choisir cette formule
                    <ArrowUpRight size={12} />
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Simulateur */}
      <section ref={ref} className="px-8 md:px-14 py-24 border-b border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div>
            <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
              className="text-xs uppercase tracking-[0.2em] text-electric-blue mb-4">
              Simulateur
            </motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }} className="font-display font-bold text-4xl tracking-tighter mb-6">
              Calculez vos mensualités.
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.2 }} className="text-sm text-[#9999AA] leading-relaxed mb-8">
              Estimez le coût mensuel selon votre projet. Le setup est dû le premier mois, les mensualités suivent ensuite.
            </motion.p>
            <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 }} className="flex flex-col gap-4">
              {[
                { label: 'Setup inclus', desc: 'Frais de démarrage couvrant la mise en place', color: '#0066FF' },
                { label: 'Maintenance incluse', desc: 'Mises à jour et support durant toute la durée', color: '#A855F7' },
                { label: 'Aucun intérêt', desc: 'Vous payez exactement le prix du site, pas plus', color: '#22C55E' },
              ].map(({ label, desc, color }) => (
                <div key={label} className="flex gap-3 items-start">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: color }} />
                  <div>
                    <span className="text-white text-sm font-medium">{label} — </span>
                    <span className="text-sm text-[#9999AA]">{desc}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="border rounded-sm flex flex-col gap-6 overflow-hidden"
            style={{ borderColor: activePlan.color + '40' }}
          >
            {/* Header coloré */}
            <div className="p-6 pb-4 flex items-center gap-3"
              style={{ background: `linear-gradient(135deg, ${activePlan.color}20, transparent)` }}>
              <Calculator size={16} style={{ color: activePlan.color }} />
              <span className="text-sm font-display font-semibold uppercase tracking-wider">Simulateur</span>
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-bold"
                style={{ backgroundColor: activePlan.color + '20', color: activePlan.color }}>
                {duree} mois
              </span>
            </div>

            <div className="px-6 pb-6 flex flex-col gap-6">
              {/* Durée */}
              <div className="flex flex-col gap-3">
                <label className="text-xs uppercase tracking-widest text-[#9999AA]">Durée du contrat</label>
                <div className="grid grid-cols-3 gap-2">
                  {[12, 24, 36].map(d => {
                    const p = plans.find(pl => pl.mois === d)!
                    return (
                      <button key={d} onClick={() => handleDuree(d)}
                        className="py-3 text-sm font-display font-bold rounded-sm border transition-all"
                        style={{
                          backgroundColor: duree === d ? p.color : 'transparent',
                          borderColor: duree === d ? p.color : 'rgba(255,255,255,0.1)',
                          color: duree === d ? 'white' : '#9999AA',
                        }}>
                        {d} mois
                      </button>
                    )
                  })}
                </div>
                {remise > 0 && (
                  <p className="text-xs" style={{ color: activePlan.color }}>
                    Remise de {remise * 100}% appliquée sur le prix du site
                  </p>
                )}
              </div>

              {/* Slider */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs uppercase tracking-widest text-[#9999AA]">Prix du site</label>
                  <span className="font-display font-bold text-white">{base.toLocaleString()}€</span>
                </div>
                <input type="range"
                  min={minimum}
                  max={minimum === 2000 ? 10000 : minimum === 4000 ? 20000 : 40000}
                  step={100} value={base}
                  onChange={e => setBase(Number(e.target.value))}
                  className="w-full"
                  style={{ accentColor: activePlan.color }}
                />
                <div className="flex justify-between text-xs text-[#333340]">
                  <span>Min. {minimum.toLocaleString()}€</span>
                  <span>Max. {(minimum === 2000 ? 10000 : minimum === 4000 ? 20000 : 40000).toLocaleString()}€</span>
                </div>
                {isBelowMin && (
                  <div className="flex items-start gap-2 text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-sm p-3">
                    <AlertCircle size={12} className="flex-shrink-0 mt-0.5" />
                    Minimum {minimum.toLocaleString()}€ pour {duree} mois
                  </div>
                )}
              </div>

              {/* Résultat */}
              <div className="border-t border-white/5 pt-5 flex flex-col gap-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#9999AA]">Setup à partir de (mois 1)</span>
                  <span className="text-white font-bold">{setup}€</span>
                </div>
                {remise > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#9999AA]">Économie ({remise * 100}%)</span>
                    <span className="font-bold" style={{ color: activePlan.color }}>−{economie.toLocaleString()}€</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-[#9999AA]">Prix après remise</span>
                  <span className="text-white">{Math.round(baseRemise).toLocaleString()}€</span>
                </div>
                <div className="h-px bg-white/5 my-1" />

                {/* Big number */}
                <div className="flex justify-between items-end p-4 rounded-sm"
                  style={{ backgroundColor: activePlan.color + '10', border: `1px solid ${activePlan.color}30` }}>
                  <div>
                    <p className="text-xs text-[#9999AA] mb-1">Puis {duree - 1} mensualités de</p>
                    <p className="text-xs text-[#9999AA]">Total : {Math.round(totalPaye).toLocaleString()}€</p>
                  </div>
                  <span className="font-display font-bold text-4xl tracking-tighter"
                    style={{ color: activePlan.color }}>
                    {mensualite}€
                  </span>
                </div>
              </div>

              <Link href="/contact"
                className="inline-flex items-center justify-center gap-2 py-4 font-display font-bold text-xs uppercase tracking-widest rounded-sm transition-colors text-white"
                style={{ backgroundColor: activePlan.color }}
              >
                Obtenir un devis précis
                <ArrowUpRight size={13} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Inclus */}
      <section ref={inclRef} className="px-8 md:px-14 py-24 border-b border-white/5">
        <motion.p initial={{ opacity: 0 }} animate={inclInView ? { opacity: 1 } : {}}
          className="text-xs uppercase tracking-widest text-electric-blue mb-4">
          Inclus dans toutes les formules
        </motion.p>
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={inclInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }} className="font-display font-bold text-3xl tracking-tighter mb-10">
          Tout ce qu'il faut pour démarrer et durer.
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {included.map((f, i) => (
            <motion.div key={f}
              initial={{ opacity: 0, x: -10 }}
              animate={inclInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-3 text-sm text-[#9999AA] py-2.5 border-b border-white/5 last:border-0 hover:text-white transition-colors group"
            >
              <Check size={13} className="flex-shrink-0 group-hover:scale-110 transition-transform" style={{ color: '#0066FF' }} />
              {f}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Conditions */}
      <section className="px-8 md:px-14 py-16 border-b border-white/5">
        <p className="text-xs uppercase tracking-widest text-[#9999AA] mb-8">Conditions claires</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Setup = frais de démarrage', desc: "Dû le mois 1. Couvre l'audit, le cadrage, les maquettes et la mise en place.", color: '#0066FF' },
            { title: 'Mensualités = prix du site', desc: 'Les mensualités couvrent uniquement le prix du site après remise. Aucun intérêt ajouté.', color: '#A855F7' },
            { title: 'Remise sur le prix de base', desc: 'La remise (5% ou 15%) s\'applique sur le site, pas sur le setup. TVA 21% en sus.', color: '#22C55E' },
          ].map(({ title, desc, color }) => (
            <div key={title} className="border rounded-sm p-6"
              style={{ borderColor: color + '30', background: color + '08' }}>
              <div className="w-1.5 h-1.5 rounded-full mb-4" style={{ backgroundColor: color }} />
              <p className="text-white font-display font-semibold text-sm mb-2">{title}</p>
              <p className="text-sm text-[#9999AA]">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 md:px-14 py-24 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <p className="text-xs uppercase tracking-widest text-electric-blue mb-4">Sans mauvaise surprise</p>
          <h2 className="font-display font-bold text-4xl tracking-tighter">Votre site dès ce mois-ci.</h2>
        </div>
        <Link href="/contact"
          className="inline-flex items-center gap-3 bg-electric-blue text-white px-10 py-5 font-display font-bold text-sm uppercase tracking-widest rounded-sm hover:bg-blue-dark transition-colors group">
          Démarrer maintenant
          <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </section>
    </div>
  )
}