// src/components/sections/ProcessSection.tsx
'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const steps = [
  {
    number: '01',
    title: 'Audit & Cadrage',
    description: 'Objectifs, audience et concurrence. Atelier de cadrage, arborescence, backlog et planning. Base SEO posée dès le départ.',
    tags: ['Discovery', 'SEO', 'UX Research'],
  },
  {
    number: '02',
    title: 'Design & Développement',
    description: 'Maquettes UI puis intégration Next.js. Performance, accessibilité et SEO technique intégrés. Contenus prêts pour la mise en ligne.',
    tags: ['Next.js', 'UI/UX', 'Performance'],
  },
  {
    number: '03',
    title: 'Mise en ligne & Suivi',
    description: 'Recette, déploiement, analytics et correctifs. Maintenance évolutive et support depuis Bastogne pour toute la Wallonie.',
    tags: ['Déploiement', 'Analytics', 'Maintenance'],
  },
]

export default function ProcessSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section ref={ref} className="px-8 md:px-14 py-28 md:py-36 border-b border-white/5">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="text-xs uppercase tracking-[0.2em] text-electric-blue mb-4"
          >
            Notre méthode
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-bold text-4xl md:text-5xl tracking-tighter"
          >
            Un process clair,<br />de l'idée au déploiement.
          </motion.h2>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="text-sm text-gray-400 max-w-xs"
        >
          Chaque projet suit une méthode éprouvée pour livrer dans les délais et le budget.
        </motion.p>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/5">
        {steps.map((step, i) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15 + i * 0.12, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="p-8 md:p-10 group hover:bg-white/2 transition-colors duration-300"
          >
            <div className="flex items-start justify-between mb-8">
              <span className="font-display text-6xl font-bold text-white/10 group-hover:text-electric-blue/20 transition-colors duration-500 leading-none">
                {step.number}
              </span>
              <div className="w-2 h-2 rounded-full bg-electric-blue mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="font-display font-bold text-xl tracking-tight mb-4 group-hover:text-electric-blue transition-colors duration-300">
              {step.title}
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">{step.description}</p>
            <div className="flex flex-wrap gap-2">
              {step.tags.map((tag) => (
                <span key={tag} className="text-xs border border-white/10 text-gray-400 px-3 py-1 rounded-sm">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
