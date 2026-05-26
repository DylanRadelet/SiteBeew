// src/app/services/developpement-application-web/page.tsx
'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { ArrowUpRight, Check, Layers, Lock, Wrench, Code2 } from 'lucide-react'

const types = [
  {
    title: 'MVP / Prototype',
    desc: 'Validez votre idée rapidement avec un produit fonctionnel. Stack moderne, déploiement rapide.',
    color: '#0066FF',
    icon: Layers,
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
    tags: ['Validation', 'Rapide', 'Scalable'],
  },
  {
    title: 'Portail client',
    desc: 'Espace sécurisé avec authentification, rôles, dashboards et gestion de données.',
    color: '#A855F7',
    icon: Lock,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    tags: ['Auth', 'Rôles', 'Dashboard'],
  },
  {
    title: 'Outil métier',
    desc: 'Application interne sur mesure pour automatiser vos processus et gagner du temps.',
    color: '#22C55E',
    icon: Wrench,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    tags: ['Automatisation', 'Sur mesure', 'Interne'],
  },
  {
    title: 'API & Backend',
    desc: 'API REST ou GraphQL, base de données, logique métier robuste et documentée.',
    color: '#F97316',
    icon: Code2,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    tags: ['REST', 'GraphQL', 'PostgreSQL'],
  },
]

const features = [
  { label: 'Authentification (email, OAuth, SSO)', color: '#0066FF' },
  { label: 'Gestion des rôles et permissions', color: '#A855F7' },
  { label: 'Dashboard et visualisation de données', color: '#22C55E' },
  { label: 'Notifications email & temps réel', color: '#F97316' },
  { label: 'Upload de fichiers et médias', color: '#0066FF' },
  { label: 'Paiements et abonnements (Stripe)', color: '#A855F7' },
  { label: 'Export PDF / Excel', color: '#22C55E' },
  { label: 'API REST documentée', color: '#F97316' },
  { label: 'Tests automatisés', color: '#0066FF' },
  { label: 'Déploiement CI/CD', color: '#A855F7' },
  { label: 'Monitoring et alertes', color: '#22C55E' },
  { label: 'RGPD et sécurité', color: '#F97316' },
]

const stack = [
  { label: 'Next.js', color: '#0066FF' },
  { label: 'TypeScript', color: '#3178C6' },
  { label: 'React', color: '#61DAFB' },
  { label: 'Node.js', color: '#22C55E' },
  { label: 'Prisma', color: '#A855F7' },
  { label: 'PostgreSQL', color: '#336791' },
  { label: 'Redis', color: '#F97316' },
  { label: 'Stripe', color: '#635BFF' },
  { label: 'Vercel', color: '#ffffff' },
  { label: 'Docker', color: '#2496ED' },
]

export default function DevAppWebPage() {
  const ref1 = useRef<HTMLDivElement>(null)
  const ref2 = useRef<HTMLDivElement>(null)
  const ref3 = useRef<HTMLDivElement>(null)
  const inView1 = useInView(ref1, { once: true, margin: '-10%' })
  const inView2 = useInView(ref2, { once: true, margin: '-10%' })
  const inView3 = useInView(ref3, { once: true, margin: '-10%' })

  return (
    <div className="min-h-screen bg-[#0A0A0A]">

      {/* Hero */}
      <section className="px-8 md:px-14 pt-32 pb-24 border-b border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(168,85,247,0.07) 0%, transparent 60%)' }}
        />
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
          <div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-xs uppercase tracking-[0.3em] text-electric-blue mb-6">
              Service · Application web
            </motion.p>
            <div className="overflow-hidden">
              <motion.h1 initial={{ y: 80 }} animate={{ y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="font-display font-bold text-5xl md:text-7xl tracking-tighter leading-none">
                APPLICATION<br />
                <span className="text-electric-blue">WEB SUR MESURE.</span>
              </motion.h1>
            </div>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="max-w-xs md:text-right">
            <p className="text-base text-[#9999AA] leading-relaxed mb-4">
              MVP, portails clients, outils métiers et dashboards. Architecture solide, sécurité, scalabilité.
            </p>
            <div className="flex gap-2 md:justify-end flex-wrap">
              {types.map(t => (
                <span key={t.title} className="text-xs px-3 py-1 rounded-full border font-display font-bold"
                  style={{ borderColor: t.color + '60', color: t.color, backgroundColor: t.color + '15' }}>
                  {t.title.split(' ')[0]}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Types */}
      <section ref={ref1} className="px-8 md:px-14 py-24 border-b border-white/5">
        <motion.p initial={{ opacity: 0 }} animate={inView1 ? { opacity: 1 } : {}}
          className="text-xs uppercase tracking-[0.2em] text-electric-blue mb-4">
          Ce que nous construisons
        </motion.p>
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={inView1 ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="font-display font-bold text-4xl md:text-5xl tracking-tighter mb-16">
          Tout type d'application.
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {types.map((type, i) => {
            const Icon = type.icon
            return (
              <motion.div key={type.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView1 ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="relative border rounded-sm overflow-hidden group"
                style={{ borderColor: 'rgba(255,255,255,0.05)', minHeight: '200px' }}
              >
                {/* Image fond */}
                <div className="absolute inset-0 bg-cover bg-center opacity-15 group-hover:opacity-25 transition-opacity duration-500 group-hover:scale-105 transition-transform"
                  style={{ backgroundImage: `url(${type.image})` }} />
                <div className="absolute inset-0"
                  style={{ background: `linear-gradient(135deg, ${type.color}15, #0A0A0A 70%)` }} />
                <div className="absolute inset-0 bg-[#0A0A0A]/60" />
                {/* Barre couleur gauche */}
                <div className="absolute left-0 top-0 bottom-0 w-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: type.color }} />

                <div className="relative z-10 p-8 flex flex-col justify-between h-full gap-6">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-sm border flex items-center justify-center"
                      style={{ borderColor: type.color + '40', backgroundColor: type.color + '15' }}>
                      <Icon size={18} style={{ color: type.color }} />
                    </div>
                    <div className="flex gap-1.5 flex-wrap justify-end max-w-[60%]">
                      {type.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-display uppercase tracking-wider px-2 py-0.5 rounded-full border"
                          style={{ borderColor: type.color + '40', color: type.color, backgroundColor: type.color + '10' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl tracking-tight mb-3 transition-colors duration-300 group-hover:text-white"
                      style={{ color: 'white' }}>
                      {type.title}
                    </h3>
                    <p className="text-sm text-[#9999AA] leading-relaxed group-hover:text-white/70 transition-colors">
                      {type.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Features */}
      <section ref={ref2} className="px-8 md:px-14 py-24 border-b border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div>
            <motion.p initial={{ opacity: 0 }} animate={inView2 ? { opacity: 1 } : {}}
              className="text-xs uppercase tracking-[0.2em] text-electric-blue mb-4">
              Fonctionnalités
            </motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={inView2 ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="font-display font-bold text-4xl tracking-tighter mb-6">
              Tout ce qu'il faut pour un produit solide.
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={inView2 ? { opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
              className="text-sm text-[#9999AA] leading-relaxed mb-8">
              Chaque fonctionnalité est développée proprement, testée et documentée. Pas de code jetable.
            </motion.p>
            <motion.div initial={{ opacity: 0 }} animate={inView2 ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 }}>
              <Link href="/contact"
                className="inline-flex items-center gap-2 bg-electric-blue text-white px-7 py-4 font-display font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-blue-dark transition-colors group">
                Discuter de votre projet
                <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </motion.div>
          </div>

          <motion.ul initial={{ opacity: 0 }} animate={inView2 ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }} className="grid grid-cols-1 gap-1">
            {features.map((f, i) => (
              <motion.li key={f.label}
                initial={{ opacity: 0, x: 10 }}
                animate={inView2 ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.04 }}
                className="flex items-center gap-3 text-sm text-[#9999AA] py-2.5 border-b border-white/5 last:border-0 hover:text-white transition-colors group"
              >
                <Check size={13} className="flex-shrink-0 group-hover:scale-110 transition-transform"
                  style={{ color: f.color }} />
                {f.label}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* Stack */}
      <section ref={ref3} className="px-8 md:px-14 py-20 border-b border-white/5">
        <motion.p initial={{ opacity: 0 }} animate={inView3 ? { opacity: 1 } : {}}
          className="text-xs uppercase tracking-widest text-[#333340] mb-8">
          Stack technique
        </motion.p>
        <div className="flex flex-wrap gap-3">
          {stack.map((t, i) => (
            <motion.span key={t.label}
              initial={{ opacity: 0, y: 10 }}
              animate={inView3 ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.05 }}
              className="px-4 py-2 border text-xs font-display font-semibold rounded-sm transition-all hover:scale-105 cursor-default"
              style={{
                borderColor: t.color + '40',
                color: t.color,
                backgroundColor: t.color + '10',
              }}
            >
              {t.label}
            </motion.span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 md:px-14 py-24 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(0,102,255,0.06) 0%, transparent 60%)' }} />
        <div className="relative z-10">
          <p className="text-xs uppercase tracking-widest text-electric-blue mb-4">Votre idée mérite mieux qu'un template</p>
          <h2 className="font-display font-bold text-4xl tracking-tighter">Construisons votre app.</h2>
        </div>
        <Link href="/contact"
          className="relative z-10 inline-flex items-center gap-3 bg-electric-blue text-white px-10 py-5 font-display font-bold text-sm uppercase tracking-widest rounded-sm hover:bg-blue-dark transition-colors group">
          Démarrer le projet
          <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </section>
    </div>
  )
}