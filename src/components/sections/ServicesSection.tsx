// src/components/sections/ServicesSection.tsx
'use client'
import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowUpRight, Plus, Minus } from 'lucide-react'

const services = [
  {
    number: '(01)',
    title: 'Site web',
    subtitle: 'Site vitrine & E-commerce',
    description: 'Conception de sites rapides, accessibles et SEO. Vitrine, catalogue ou boutique en ligne sur mesure avec Next.js.',
    href: '/services/creation-site-web',
    tags: ['UX/UI & maquettes', 'Développement Next.js', 'Paiements & gestion produits'],
  },
  {
    number: '(02)',
    title: 'Application web',
    subtitle: 'Apps performantes & sécurisées',
    description: 'MVP, portails, tableaux de bord et outils métiers. Architecture solide, authentification, rôles et déploiement.',
    href: '/services/developpement-application-web',
    tags: ['Architecture & API', 'Authentification & rôles', 'Tests et déploiement'],
  },
  {
    number: '(03)',
    title: 'SEO technique',
    subtitle: 'Base technique solide',
    description: 'Données structurées, Core Web Vitals, indexation parfaite. Votre site visible et performant dans les résultats.',
    href: '/services#seo',
    tags: ['Audit & recommandations', 'Balisage & JSON-LD', 'Core Web Vitals'],
  },
  {
    number: '(04)',
    title: 'Maintenance',
    subtitle: 'Maintenance & évolutions',
    description: 'Mises à jour, sécurité, sauvegardes et nouvelles fonctionnalités. Vous évoluez, votre site aussi.',
    href: '/services#maintenance',
    tags: ['Mises à jour', 'Sécurité & backups', 'Support réactif'],
  },
]

export default function ServicesSection() {
  const [open, setOpen] = useState<number | null>(0)
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section ref={ref} id="services" className="px-8 md:px-14 py-28 md:py-36 border-b border-white/5">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="text-xs uppercase tracking-[0.2em] text-electric-blue mb-4"
          >
            Nos services
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-bold text-4xl md:text-5xl tracking-tighter"
          >
            Ce que nous réalisons.
          </motion.h2>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
        >
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group"
          >
            Tous les services
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </motion.div>
      </div>

      {/* Accordion */}
      <div className="border-t border-white/5">
        {services.map((service, i) => (
          <motion.div
            key={service.number}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.1 + i * 0.08 }}
            className="border-b border-white/5"
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between py-7 group text-left"
            >
              <div className="flex items-baseline gap-5">
                <span className="text-xs font-display text-gray-700 tracking-wider">{service.number}</span>
                <span className="font-display font-bold text-2xl md:text-3xl tracking-tighter group-hover:text-electric-blue transition-colors duration-200">
                  {service.title}
                </span>
                <span className="hidden md:block text-sm text-gray-400">{service.subtitle}</span>
              </div>
              <div className="text-gray-400 group-hover:text-electric-blue transition-colors">
                {open === i ? <Minus size={18} /> : <Plus size={18} />}
              </div>
            </button>

            <AnimatePresence>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pb-8 pl-0 md:pl-[calc(1rem+1.5ch+1.25rem)] grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <p className="text-base text-gray-400 leading-relaxed mb-6">{service.description}</p>
                      <ul className="flex flex-col gap-2">
                        {service.tags.map((tag, j) => (
                          <li key={j} className="flex items-center gap-3 text-sm text-gray-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-electric-blue flex-shrink-0" />
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-end">
                      <Link
                        href={service.href}
                        className="inline-flex items-center gap-2 text-sm font-display font-semibold text-white border border-white/20 px-6 py-3 rounded-sm hover:border-electric-blue hover:text-electric-blue transition-all group"
                      >
                        Voir le détail
                        <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
