// src/components/sections/CtaSection.tsx
'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

const images = [
  '/projects/creaphike.png',
  '/projects/faceanime.png',
  '/projects/greenworkproject.png',
  '/projects/happylink.png',
  '/projects/moki.png',
  '/projects/racoon.png',
]

// 3 copies pour que le cut soit invisible
const row = [...images, ...images, ...images]

const rows = [
  { dir: 'left', speed: '60s' },
  { dir: 'right', speed: '75s' },
  { dir: 'left', speed: '50s' },
  { dir: 'right', speed: '80s' },
  { dir: 'left', speed: '65s' },
  { dir: 'right', speed: '55s' },
]

export default function CtaSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15%' })

  return (
    <section ref={ref} className="relative overflow-hidden py-36 md:py-48">

      {/* ── BACKGROUND ── */}
      <div className="absolute inset-0 flex flex-col gap-3 -rotate-3 scale-110 pointer-events-none">
        {rows.map((row_cfg, rowIdx) => (
          <div
            key={rowIdx}
            className="flex gap-3 flex-shrink-0"
            style={{
              width: 'max-content',
              animation: `slide${row_cfg.dir === 'left' ? 'Left' : 'Right'} ${row_cfg.speed} linear infinite`,
            }}
          >
            {row.map((src, i) => (
              <div
                key={i}
                className="w-52 h-32 rounded-sm flex-shrink-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${src})`, backgroundColor: '#111' }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* ── OVERLAYS ── */}
      <div className="absolute inset-0 backdrop-blur-sm bg-black/65 pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 20%, #0A0A0A 75%)' }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 79px, #0066FF 80px)' }}
      />

      {/* ── CONTENU ── */}
      <div className="relative z-10 text-center flex flex-col items-center gap-10 px-8 md:px-14">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="text-xs uppercase tracking-[0.3em] text-electric-blue"
        >
          Prêt pour l'engagement ?
        </motion.p>

        <div className="overflow-hidden">
          <motion.h2
            initial={{ y: 80 }}
            animate={inView ? { y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="font-display font-bold text-5xl md:text-7xl lg:text-8xl tracking-tighter leading-none max-w-4xl"
          >
            Construisons<br />
            <span className="text-electric-blue">ensemble.</span>
          </motion.h2>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          className="text-base text-[#9999AA] max-w-lg"
        >
          Parlez-nous de votre projet. Audit gratuit, devis en 48h, lancement rapide.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 bg-electric-blue text-white px-10 py-5 font-display font-bold text-sm uppercase tracking-widest rounded-sm hover:bg-blue-dark transition-colors group"
          >
            Démarrer maintenant
            <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
          <a
            href="tel:+32472467309"
            className="inline-flex items-center gap-2 text-sm text-[#9999AA] hover:text-white transition-colors"
          >
            +32 472 46 73 09
          </a>
        </motion.div>
      </div>

      <style>{`
        @keyframes slideLeft {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
        @keyframes slideRight {
          from { transform: translateX(-33.333%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </section >
  )
}