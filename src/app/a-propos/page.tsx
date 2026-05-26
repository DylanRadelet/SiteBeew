// src/app/a-propos/page.tsx
'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { ArrowUpRight, MapPin, Code2, Zap } from 'lucide-react'

const values = [
  { number: '01', title: "Performance d'abord", desc: 'Chaque ligne de code est pensée pour la vitesse. Core Web Vitals verts, Lighthouse > 90, pas de compromis.', color: '#0066FF' },
  { number: '02', title: 'SEO natif', desc: "Le référencement n'est pas une option. Il est intégré dès la première ligne de code, pas ajouté après coup.", color: '#A855F7' },
  { number: '03', title: 'Accessibilité', desc: 'Un site accessible est un site meilleur pour tout le monde. WCAG 2.1, contraste, navigation clavier.', color: '#22C55E' },
  { number: '04', title: 'Transparence totale', desc: 'Devis fixe, planning respecté, communication claire. Pas de mauvaises surprises.', color: '#F97316' },
]

const stack = [
  { label: 'Next.js', color: '#0066FF' },
  { label: 'TypeScript', color: '#3178C6' },
  { label: 'React', color: '#61DAFB' },
  { label: 'Tailwind CSS', color: '#06B6D4' },
  { label: 'Framer Motion', color: '#A855F7' },
  { label: 'Prisma', color: '#A855F7' },
  { label: 'PostgreSQL', color: '#336791' },
  { label: 'Vercel', color: '#ffffff' },
  { label: 'Stripe', color: '#635BFF' },
  { label: 'Sanity CMS', color: '#F97316' },
  { label: 'Figma', color: '#F24E1E' },
  { label: 'Node.js', color: '#22C55E' },
]

const projectImages = [
  '/projects/creaphike.webp',
  '/projects/faceanime.webp',
  '/projects/greenworkproject.webp',
  '/projects/happylink.webp',
  '/projects/moki.webp',
  '/projects/racoon.webp',
]

// 6 rangées avec hauteurs variables pour remplir toute la section
const ctaRows = [
  { speed: '65s', dir: 'right', h: 'h-28' },
  { speed: '55s', dir: 'left', h: 'h-28' },
  { speed: '70s', dir: 'right', h: 'h-32' },
  { speed: '45s', dir: 'left', h: 'h-24' },
  { speed: '80s', dir: 'right', h: 'h-28' },
  { speed: '60s', dir: 'left', h: 'h-32' },
  { speed: '50s', dir: 'right', h: 'h-24' },
]

export default function AProposPage() {
  const ref1 = useRef<HTMLDivElement>(null)
  const ref2 = useRef<HTMLDivElement>(null)
  const ref3 = useRef<HTMLDivElement>(null)
  const ref4 = useRef<HTMLDivElement>(null)
  const inView1 = useInView(ref1, { once: true, margin: '-10%' })
  const inView2 = useInView(ref2, { once: true, margin: '-10%' })
  const inView3 = useInView(ref3, { once: true, margin: '-10%' })
  const inView4 = useInView(ref4, { once: true, margin: '-5%' })

  return (
    <div className="min-h-screen bg-[#0A0A0A]">

      {/* Hero */}
      <section className="px-8 md:px-14 pt-32 pb-24 border-b border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 80% 30%, rgba(0,102,255,0.07) 0%, transparent 60%)' }} />
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-xs uppercase tracking-[0.3em] text-electric-blue mb-6 relative z-10">
          À propos
        </motion.p>
        <div className="overflow-hidden relative z-10">
          <motion.h1 initial={{ y: 80 }} animate={{ y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-bold text-5xl md:text-7xl lg:text-8xl tracking-tighter leading-none">
            OÙ LES MARQUES<br />
            <span className="text-electric-blue">SONT BÂTIES.</span>
          </motion.h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-16 relative z-10">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-lg text-[#9999AA] leading-relaxed">
            Beew Agency est une agence web indépendante basée à Bastogne, au cœur des Ardennes belges. Sites vitrines, e-commerce et applications web rapides, accessibles et bien référencés.
          </motion.p>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="text-base text-[#9999AA] leading-relaxed">
            PME, indépendants et associations partout en Wallonie. De l'audit au déploiement, puis à la maintenance évolutive. Un interlocuteur unique, un process clair, des résultats mesurables.
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-white/5">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {[
            { value: '12+', label: 'Projets réalisés', color: '#0066FF' },
            { value: '4+', label: "Années d'expérience", color: '#A855F7' },
            { value: '18+', label: 'Clients accompagnés', color: '#22C55E' },
            { value: '7+', label: 'PME en Wallonie', color: '#F97316' },
          ].map(({ value, label, color }, i) => (
            <motion.div key={label}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="border-r border-white/5 last:border-r-0 px-8 md:px-12 py-12 group hover:bg-white/2 transition-colors"
            >
              <p className="font-display font-bold text-5xl tracking-tighter mb-2" style={{ color }}>{value}</p>
              <p className="text-sm text-[#9999AA] group-hover:text-white transition-colors">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Story + photo — section signature */}
      <section ref={ref1} className="border-b border-white/5 relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[700px]">

          {/* Colonne gauche : texte */}
          <div className="px-8 md:px-14 py-20 flex flex-col justify-center border-r border-white/5 relative z-10">
            <motion.p initial={{ opacity: 0 }} animate={inView1 ? { opacity: 1 } : {}}
              className="text-xs uppercase tracking-[0.2em] text-electric-blue mb-6">
              Notre histoire
            </motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={inView1 ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-bold text-4xl md:text-5xl tracking-tighter leading-tight mb-10">
              Nés en Wallonie,<br />pensés pour<br />le web de demain.
            </motion.h2>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={inView1 ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="flex flex-col gap-5 text-[#9999AA] text-sm leading-relaxed mb-10">
              <p>Beew Agency naît d'un constat simple : trop de PME wallonnes ont des sites lents, mal référencés et difficiles à maintenir. Nous avons décidé de changer ça depuis Bastogne.</p>
              <p>Avec une stack moderne — Next.js, TypeScript, Vercel — nous construisons des sites qui performent réellement, pas seulement en démo.</p>
              <p>Un process rigoureux, une communication honnête, et un suivi long terme. Pas de template revendu. Du vrai développement sur mesure.</p>
            </motion.div>

            {/* Infos fondateur */}
            <motion.div initial={{ opacity: 0 }} animate={inView1 ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 }}
              className="flex flex-col gap-3">
              {[
                { icon: Code2, label: 'Développeur full-stack', color: '#0066FF' },
                { icon: MapPin, label: 'Bastogne, Wallonie — BE', color: '#22C55E' },
                { icon: Zap, label: '4 ans d\'expérience web', color: '#F97316' },
              ].map(({ icon: Icon, label, color }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-sm border flex items-center justify-center flex-shrink-0"
                    style={{ borderColor: color + '40', backgroundColor: color + '15' }}>
                    <Icon size={13} style={{ color }} />
                  </div>
                  <span className="text-sm text-[#9999AA]">{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Colonne droite : photo pleine hauteur */}
          <motion.div initial={{ opacity: 0 }} animate={inView1 ? { opacity: 1 } : {}}
            transition={{ delay: 0.2, duration: 1 }}
            className="relative min-h-[500px] md:min-h-0"
          >
            {/* Image pleine colonne */}
            <img
              src="/worker/dra.webp"
              alt="Dylan Radelet — Fondateur Beew Agency"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />

            {/* Overlay dégradé gauche pour transition avec le texte */}
            <div className="absolute inset-0"
              style={{ background: 'linear-gradient(to right, #0A0A0A 0%, transparent 25%)' }} />
            {/* Overlay dégradé bas */}
            <div className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, #0A0A0A 0%, transparent 40%)' }} />
            {/* Teinte bleue subtile */}
            <div className="absolute inset-0 bg-electric-blue/8" />

            {/* Badge nom en bas */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={inView1 ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
              className="absolute bottom-8 left-8 right-8 z-10">
              <div className="border border-white/10 rounded-sm p-5 backdrop-blur-md"
                style={{ backgroundColor: 'rgba(10,10,10,0.75)' }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-display font-bold text-base text-white">Dylan Renard Arnould</p>
                    <p className="text-xs text-[#9999AA] mt-0.5">Fondateur & Développeur — Beew Agency</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-400 mt-1 flex-shrink-0" />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {['Next.js', 'TypeScript', 'Bastogne', 'Full-stack'].map(tag => (
                    <span key={tag}
                      className="text-[10px] px-2.5 py-1 rounded-sm border border-electric-blue/30 text-electric-blue bg-electric-blue/10 font-display uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Numéro décoratif */}
            <div className="absolute top-8 right-8 font-display font-bold text-[120px] leading-none text-white/3 select-none pointer-events-none">
              01
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section ref={ref2} className="px-8 md:px-14 py-28 border-b border-white/5">
        <motion.p initial={{ opacity: 0 }} animate={inView2 ? { opacity: 1 } : {}}
          className="text-xs uppercase tracking-[0.2em] text-electric-blue mb-6">
          Nos principes
        </motion.p>
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={inView2 ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-bold text-4xl md:text-5xl tracking-tighter mb-16">
          Ce dont on ne<br />se lasse jamais.
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {values.map((v, i) => (
            <motion.div key={v.number}
              initial={{ opacity: 0, y: 20 }}
              animate={inView2 ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.1 }}
              className="border rounded-sm p-8 transition-all duration-300 group relative overflow-hidden"
              style={{ borderColor: 'rgba(255,255,255,0.05)' }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 0% 100%, ${v.color}15, transparent 70%)` }} />
              <div className="absolute left-0 top-0 bottom-0 w-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: v.color }} />
              <span className="font-display text-5xl font-bold leading-none block mb-6"
                style={{ color: 'rgba(255,255,255,0.06)' }}>
                {v.number}
              </span>
              <h3 className="font-display font-bold text-lg tracking-tight mb-3 group-hover:text-white transition-colors"
                style={{ color: 'white' }}>
                {v.title}
              </h3>
              <p className="text-sm text-[#9999AA] leading-relaxed relative z-10">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stack */}
      <section ref={ref3} className="px-8 md:px-14 py-28 border-b border-white/5">
        <motion.p initial={{ opacity: 0 }} animate={inView3 ? { opacity: 1 } : {}}
          className="text-xs uppercase tracking-[0.2em] text-electric-blue mb-6">
          Notre stack
        </motion.p>
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={inView3 ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="font-display font-bold text-4xl md:text-5xl tracking-tighter mb-16">
          Les outils qu'on<br />maîtrise vraiment.
        </motion.h2>
        <div className="flex flex-wrap gap-3">
          {stack.map((tech, i) => (
            <motion.span key={tech.label}
              initial={{ opacity: 0, y: 10 }}
              animate={inView3 ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.05 }}
              className="px-5 py-2.5 border text-sm font-display font-semibold transition-all cursor-default rounded-sm hover:scale-105"
              style={{ borderColor: tech.color + '40', color: tech.color, backgroundColor: tech.color + '10' }}
            >
              {tech.label}
            </motion.span>
          ))}
        </div>
      </section>

      {/* CTA — images qui remplissent TOUTE la section */}
      <section ref={ref4} className="relative overflow-hidden" style={{ minHeight: '600px' }}>

        {/* Grille d'images qui couvre tout */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="flex flex-col gap-2 -rotate-3 scale-[1.35] h-full"
            style={{ marginTop: '-8%', marginBottom: '-8%' }}>
            {ctaRows.map((row, rowIdx) => (
              <div key={rowIdx}
                className={`flex gap-2 flex-shrink-0 ${row.h}`}
                style={{
                  width: 'max-content',
                  animation: `slide${row.dir === 'left' ? 'Left' : 'Right'} ${row.speed} linear infinite`,
                }}
              >
                {[...projectImages, ...projectImages, ...projectImages].map((src, i) => (
                  <div key={i}
                    className="flex-shrink-0 h-full rounded-sm bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${src})`,
                      backgroundColor: '#111',
                      aspectRatio: '16/9',
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Overlays */}
        <div className="absolute inset-0 backdrop-blur-[2px] bg-black/70 pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, rgba(10,10,10,0.95) 80%)' }} />

        {/* Contenu centré */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center gap-10 px-8 md:px-14 py-36 md:py-48">
          <motion.p initial={{ opacity: 0 }} animate={inView4 ? { opacity: 1 } : {}}
            className="text-xs uppercase tracking-[0.3em] text-electric-blue">
            Prêt à construire ?
          </motion.p>

          <div className="overflow-hidden">
            <motion.h2 initial={{ y: 80 }} animate={inView4 ? { y: 0 } : {}}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="font-display font-bold text-5xl md:text-7xl lg:text-8xl tracking-tighter leading-none max-w-4xl">
              Travaillons<br />
              <span className="text-electric-blue">ensemble.</span>
            </motion.h2>
          </div>

          <motion.p initial={{ opacity: 0 }} animate={inView4 ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
            className="text-base text-[#9999AA] max-w-lg">
            Audit gratuit, devis en 48h, lancement rapide depuis Bastogne.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView4 ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/contact"
              className="inline-flex items-center gap-3 bg-electric-blue text-white px-10 py-5 font-display font-bold text-sm uppercase tracking-widest rounded-sm hover:bg-blue-dark transition-colors group">
              Démarrer un projet
              <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
            <a href="tel:+32472467309"
              className="inline-flex items-center gap-2 text-sm text-[#9999AA] hover:text-white transition-colors">
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
      </section>
    </div>
  )
}