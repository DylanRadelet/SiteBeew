// src/components/sections/PricingSection.tsx
'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Check } from 'lucide-react'

const plans = [
  {
    id: 'comptant',
    label: 'Paiement comptant',
    badge: 'Recommandé',
    price: 'Sur devis',
    priceNote: "Remise jusqu'à −15%",
    features: [
      'Démarrage prioritaire',
      'Mise en ligne rapide',
      'Devis fixe & planning validés',
      'Cession intégrale des droits',
      'Aucun frais récurrent',
    ],
    cta: 'Demander un devis',
    href: '/contact',
    highlight: true,
  },
  {
    id: 'mensuel',
    label: 'Paiement mensuel',
    badge: null,
    price: 'Dès 250€/mois',
    priceNote: 'Sur 12, 24 ou 36 mois',
    features: [
      '12 mois : 250€ + 11 mensualités',
      '24 mois : 300€ + 23 mensualités (−5%)',
      '36 mois : 350€ + 35 mensualités (−15%)',
      'Démarrage dès le 1er versement',
      'Support inclus',
    ],
    cta: 'Voir les détails',
    href: '/services/site-web-paiement-mensuel',
    highlight: false,
  },
]

export default function PricingSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section ref={ref} className="px-8 md:px-14 py-28 md:py-36 border-b border-white/5">

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="text-xs uppercase tracking-[0.2em] text-electric-blue mb-4"
          >
            Financement
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-bold text-4xl md:text-5xl tracking-tighter"
          >
            Choisissez votre<br />mode de paiement.
          </motion.h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.7 }}
            className={`relative border p-8 md:p-10 rounded-sm flex flex-col gap-6 ${
              plan.highlight
                ? 'border-electric-blue bg-electric-blue/5'
                : 'border-white/10 bg-white/[0.02]'
            }`}
          >
            {plan.badge && (
              <span className="absolute top-6 right-6 text-xs bg-electric-blue text-white px-3 py-1 rounded-full font-medium">
                {plan.badge}
              </span>
            )}

            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">{plan.label}</p>
              <p className="font-display font-bold text-3xl tracking-tighter text-white">{plan.price}</p>
              <p className="text-sm text-gray-400 mt-1">{plan.priceNote}</p>
            </div>

            <div className="h-[1px] bg-white/5" />

            <ul className="flex flex-col gap-3">
              {plan.features.map((feat) => (
                <li key={feat} className="flex items-start gap-3 text-sm text-gray-400">
                  <Check size={14} className="text-electric-blue flex-shrink-0 mt-0.5" />
                  {feat}
                </li>
              ))}
            </ul>

            <Link
              href={plan.href}
              className={`mt-auto inline-flex items-center justify-center gap-2 py-4 font-display font-bold text-sm uppercase tracking-widest rounded-sm transition-all group ${
                plan.highlight
                  ? 'bg-electric-blue text-white hover:bg-blue-dark'
                  : 'border border-white/20 text-white hover:border-electric-blue hover:text-electric-blue'
              }`}
            >
              {plan.cta}
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
