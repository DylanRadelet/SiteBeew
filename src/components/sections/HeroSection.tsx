// src/components/sections/HeroSection.tsx
'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowDownRight } from 'lucide-react'

const words = ['SITES', 'APPS', 'RÉSULTATS']

const bgImages = [
  '/projects/creaphike.webp',
  '/projects/faceanime.webp',
  '/projects/greenworkproject.webp',
  '/projects/happylink.webp',
  '/projects/moki.webp',
  '/projects/racoon.webp',
]

export default function HeroSection() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % bgImages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col justify-between pt-24 pb-12 px-8 md:px-14 overflow-hidden bg-[#0A0A0A]">

      {/* ── IMAGE DE FOND QUI CHANGE ── */}
      <AnimatePresence>
        <motion.div
          key={current}
          className="absolute inset-0 bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: `url(${bgImages[current]})` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />
      </AnimatePresence>

      {/* ── OVERLAYS ── */}
      <div className="absolute inset-0 bg-[#0A0A0A]/70 pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 40%, #0A0A0A 85%)' }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 79px, #0066FF 80px), repeating-linear-gradient(90deg, transparent, transparent 79px, #0066FF 80px)',
        }}
      />

      {/* Blue glow blob */}
      <motion.div
        className="absolute top-1/3 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,102,255,0.12) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── CONTENU ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="relative z-10 flex items-center justify-between"
      >
        <span className="text-xs uppercase tracking-[0.2em] text-[#9999AA]">
          Agence web · Bastogne, Wallonie
        </span>
        <span className="hidden md:block text-xs uppercase tracking-[0.2em] text-[#9999AA]">
          Sites web · Apps · SEO
        </span>
      </motion.div>

      <div className="relative z-10 flex-1 flex flex-col justify-center mt-8">
        <div className="overflow-hidden">
          <motion.p
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="text-xs uppercase tracking-[0.3em] text-[#0066FF] mb-6"
          >
            L'agence web qui livre des résultats
          </motion.p>
        </div>

        {words.map((word, i) => (
          <div key={word} className="overflow-hidden">
            <motion.h1
              initial={{ y: 120 }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.2 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="[font-family:'Syne',sans-serif] font-bold text-[13vw] md:text-[11vw] text-[#F5F4F0]"
              style={{ lineHeight: 0.92, letterSpacing: '-0.04em' }}
            >
              {i === 1 ? <span className="text-[#0066FF]">{word}</span> : word}
            </motion.h1>
          </div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex flex-col md:flex-row items-start md:items-end justify-between mt-10 gap-8"
        >
          <p className="text-base text-[#9999AA] max-w-sm leading-relaxed">
            Création de sites et d'applications web rapides, accessibles et bien référencés. Basés à Bastogne, actifs partout en Wallonie.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className="border inline-flex items-center gap-3 bg-[#0066FF] text-[#F5F4F0] px-7 py-4 [font-family:'Syne',sans-serif] font-bold text-sm uppercase tracking-widest hover:bg-[#0047B3] transition-all duration-200 group"
            >
              Parler de votre projet
              <ArrowDownRight size={16} className="group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
            </Link>
            <Link
              href="/#resultats"
              className="text-sm text-[#9999AA] hover:text-[#F5F4F0] transition-colors underline underline-offset-4"
            >
              Voir nos résultats
            </Link>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="relative z-10 flex items-center gap-3 self-start"
      >
        <div className="w-8 h-[1px] bg-[#333340]" />
        <span className="text-xs text-[#333340] uppercase tracking-widest">Défiler</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDownRight size={12} className="text-[#333340] rotate-45" />
        </motion.div>
      </motion.div>
    </section>
  )
}