// src/components/sections/AboutSection.tsx
'use client'

import { motion, useInView } from 'framer-motion'
import { ArrowUpRight, MapPin, Rocket, Search, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { useRef } from 'react'

const highlights = [
  {
    icon: Search,
    title: 'Audit & stratégie',
    description:
      'Analyse de vos objectifs, de votre audience, de vos contenus et de votre positionnement avant de développer.',
  },
  {
    icon: Rocket,
    title: 'Déploiement rapide',
    description:
      'Sites et applications performants, responsives et prêts à être mis en ligne rapidement.',
  },
  {
    icon: ShieldCheck,
    title: 'Suivi durable',
    description:
      'Maintenance, corrections, évolutions, sécurité et accompagnement après la mise en ligne.',
  },
]

const tags = [
  'SITE VITRINE',
  'E-COMMERCE',
  'APPLICATION WEB',
  'SEO TECHNIQUE',
  'MAINTENANCE',
  'BASTOGNE',
]

export default function AboutSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-12%' })

  return (
    <section
      ref={ref}
      id="a-propos"
      className="relative overflow-hidden border-b border-white/10 px-5 py-24 sm:px-8 md:px-14 lg:py-32"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-electric-blue/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[320px] w-[320px] translate-x-1/3 rounded-full bg-white/5 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1500px]">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 xl:gap-28">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mb-6 flex items-center gap-3"
            >
              <span className="h-px w-10 bg-electric-blue" />
              <span className="font-display text-xs font-semibold uppercase tracking-[0.28em] text-electric-blue">
                À propos
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 26 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.08,
              }}
              className="max-w-4xl font-display text-[clamp(3rem,6vw,6rem)] font-bold leading-[0.92] tracking-[-0.07em] text-white"
            >
              Agence web
              <br />
              à Bastogne.
              <br />
              <span className="text-white/35">Sites et apps</span>
              <br />
              en Wallonie.
            </motion.h2>
          </div>

          <div className="flex flex-col gap-6 lg:pt-16">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: 0.16,
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="border border-white/10 bg-white/[0.025] p-6 backdrop-blur-sm sm:p-8 md:p-10"
            >
              <div className="mb-6 flex items-center gap-3 text-white/45">
                <MapPin size={16} className="text-electric-blue" />
                <span className="font-display text-xs font-semibold uppercase tracking-[0.22em]">
                  Bastogne · Wallonie
                </span>
              </div>

              <p className="max-w-3xl text-base leading-relaxed text-white/65 sm:text-lg md:text-xl md:leading-relaxed">
                Nous concevons des sites vitrines, e-commerce et applications web
                rapides, accessibles et optimisés SEO. Basés à Bastogne, nous
                accompagnons PME, indépendants et associations partout en Wallonie,
                de l’idée jusqu’au déploiement, puis à la maintenance.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/contact"
                  className="group inline-flex items-center justify-center gap-2 bg-electric-blue px-5 py-3 font-display text-xs font-bold uppercase tracking-[0.18em] text-white transition-all hover:bg-white hover:text-black"
                >
                  Demander un devis
                  <ArrowUpRight
                    size={15}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>

                <Link
                  href="/a-propos"
                  className="group inline-flex items-center justify-center gap-2 border border-white/15 px-5 py-3 font-display text-xs font-bold uppercase tracking-[0.18em] text-white transition-all hover:border-electric-blue hover:text-electric-blue"
                >
                  Notre histoire
                  <ArrowUpRight
                    size={15}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {highlights.map((item, index) => {
                const Icon = item.icon

                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 18 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{
                      delay: 0.28 + index * 0.08,
                      duration: 0.6,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="border border-white/10 bg-white/[0.02] p-5 transition-colors hover:bg-white/[0.04] sm:p-6"
                  >
                    <div className="mb-5 flex h-10 w-10 items-center justify-center border border-electric-blue/35 bg-electric-blue/10 text-electric-blue">
                      <Icon size={18} />
                    </div>

                    <h3 className="font-display text-lg font-bold tracking-tight text-white">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-white/45">
                      {item.description}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{
            delay: 0.48,
            duration: 0.85,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ transformOrigin: 'left' }}
          className="mt-14 h-px bg-white/10 md:mt-16"
        />

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{
            delay: 0.6,
            duration: 0.65,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mt-6 flex flex-wrap gap-2"
        >
          {tags.map((tag) => (
            <Link
              key={tag}
              href="/services"
              className="group inline-flex items-center gap-2 border border-white/10 bg-white/[0.015] px-3 py-2 font-display text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45 transition-all hover:border-electric-blue hover:text-electric-blue sm:px-4 sm:text-xs"
            >
              {tag}
              <ArrowUpRight
                size={11}
                className="opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
              />
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  )
}