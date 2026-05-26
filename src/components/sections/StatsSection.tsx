// src/components/sections/StatsSection.tsx
'use client'
import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { Monitor, Clock, Users, MapPin } from 'lucide-react'

const stats = [
  {
    value: 12,
    suffix: '+',
    label: 'Projets réalisés',
    sublabel: 'Sites, apps & landing pages',
    icon: Monitor,
    tags: ['Site vitrine', 'E-commerce', 'App web'],
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&q=80',
  },
  {
    value: 4,
    suffix: '+',
    label: "Années d'expérience",
    sublabel: 'En développement web',
    icon: Clock,
    tags: ['Next.js', 'React', 'TypeScript'],
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80',
  },
  {
    value: 18,
    suffix: '+',
    label: 'Clients accompagnés',
    sublabel: 'PME, indépendants, assos',
    icon: Users,
    tags: ['Wallonie', 'Belgique', 'Remote'],
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80',
  },
  {
    value: 7,
    suffix: '+',
    label: 'PME en Wallonie',
    sublabel: 'Basés à Bastogne',
    icon: MapPin,
    tags: ['Bastogne', 'Liège', 'Namur'],
    image: 'https://images.unsplash.com/photo-1491895200222-0fc4a4c35e18?w=600&q=80',
  },
]

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const duration = 1200
    const step = (timestamp: number, startTime: number) => {
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * value))
      if (progress < 1) requestAnimationFrame((t) => step(t, startTime))
    }
    requestAnimationFrame((t) => step(t, t))
  }, [inView, value])

  return <span ref={ref}>{count}{suffix}</span>
}

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15%' })

  return (
    <section className="px-8 md:px-14 py-20 border-b border-white/5 bg-electric-blue/5">
      <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="relative border border-white/5 rounded-sm overflow-hidden flex flex-col gap-5 hover:border-electric-blue/40 transition-all duration-300 group"
              style={{ minHeight: '220px' }}
            >
              {/* Image de fond */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${stat.image})` }}
              />

              {/* Overlay dégradé */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />
              <div className="absolute inset-0 bg-electric-blue/10" />

              {/* Contenu */}
              <div className="relative z-10 p-6 flex flex-col justify-between h-full gap-4">

                {/* Header : icône + tags */}
                <div className="flex items-start justify-between">
                  <div className="w-9 h-9 rounded-sm border border-white/20 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                    <Icon size={16} className="text-electric-blue" />
                  </div>
                  <div className="flex flex-wrap gap-1 justify-end max-w-[65%]">
                    {stat.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-[10px] font-display uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-white/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bas : nombre + labels */}
                <div>
                  <p className="font-display font-bold text-5xl tracking-tighter text-white mb-1">
                    <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="font-display font-semibold text-sm text-white">{stat.label}</p>
                  <div className="h-px bg-white/10 my-3" />
                  <p className="text-xs text-white/50">{stat.sublabel}</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}