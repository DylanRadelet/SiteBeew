// src/app/services/page.tsx
'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

const services = [
    {
        number: '01',
        title: 'Création site web',
        subtitle: 'Site vitrine & E-commerce',
        href: '/services/creation-site-web',
        tags: ['Next.js', 'UI/UX', 'SEO', 'E-commerce'],
        description: 'Sites vitrines, catalogues et boutiques en ligne sur mesure. Rapides, accessibles et bien référencés dès le lancement.',
        prix: 'Dès 1 500€',
        color: '#0066FF',
        image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80',
    },
    {
        number: '02',
        title: 'Application web',
        subtitle: 'MVP, portails & outils métiers',
        href: '/services/developpement-application-web',
        tags: ['React', 'Node.js', 'API', 'Auth'],
        description: 'Applications web performantes et sécurisées. MVP pour valider votre idée, portail client, dashboard ou outil interne.',
        prix: 'Sur devis',
        color: '#A855F7',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    },
    {
        number: '03',
        title: 'SEO technique',
        subtitle: 'Visibilité & performance',
        href: '/services#seo',
        tags: ['Audit', 'JSON-LD', 'Core Web Vitals', 'Indexation'],
        description: 'Audit complet, balisage sémantique, données structurées et optimisation Core Web Vitals pour dominer les résultats de recherche.',
        prix: 'Dès 500€',
        color: '#22C55E',
        image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80',
    },
    {
        number: '04',
        title: 'Maintenance',
        subtitle: 'Suivi & évolutions',
        href: '/services#maintenance',
        tags: ['Mises à jour', 'Sécurité', 'Support', 'Évolutions'],
        description: 'Votre site évolue avec votre activité. Mises à jour, sécurité, sauvegardes et nouvelles fonctionnalités en continu.',
        prix: 'Dès 80€/mois',
        color: '#F97316',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    },
    {
        number: '05',
        title: 'Paiement mensuel',
        subtitle: 'Votre site sans effort de trésorerie',
        href: '/services/site-web-paiement-mensuel',
        tags: ['12 mois', '24 mois', '36 mois', '0% intérêt'],
        description: 'Obtenez votre site professionnel dès ce mois-ci et étalez le paiement sur 12, 24 ou 36 mois. Sans intérêts, sans surprise.',
        prix: 'Dès 250€/mois',
        color: '#EAB308',
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
    },
]

const faqs = [
    {
        q: 'Combien de temps pour livrer un site ?',
        a: 'Entre 3 et 6 semaines selon la complexité. Un site vitrine simple peut être en ligne en 2 semaines. Nous fixons le planning avant de démarrer.',
    },
    {
        q: 'Vous travaillez pour toute la Belgique ?',
        a: 'Basés à Bastogne, nous intervenons partout en Wallonie et en Belgique. La majorité de nos échanges se font à distance, avec des appels réguliers.',
    },
    {
        q: 'Je peux modifier mon site moi-même ?',
        a: 'Oui. Selon le projet, nous intégrons un CMS (Sanity, Contentful) pour que vous puissiez gérer vos contenus sans toucher au code.',
    },
    {
        q: 'Que comprend la maintenance ?',
        a: 'Mises à jour des dépendances, surveillance de sécurité, sauvegardes, corrections de bugs et petites évolutions selon le forfait choisi.',
    },
]

function ServiceRow({ service, index }: { service: typeof services[0]; index: number }) {
    const ref = useRef<HTMLDivElement>(null)
    const inView = useInView(ref, { once: true, margin: '-10%' })

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: index * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="border-b border-white/5 group relative overflow-hidden"
        >
            {/* Image de fond qui apparaît au hover */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-105 group-hover:scale-100 transition-transform"
                style={{ backgroundImage: `url(${service.image})` }}
            />
            {/* Overlay couleur au hover */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-90 transition-opacity duration-500"
                style={{ background: `linear-gradient(135deg, ${service.color}22 0%, #0A0A0A 60%)` }}
            />
            {/* Overlay noir de base */}
            <div className="absolute inset-0 bg-[#0A0A0A] group-hover:bg-[#0A0A0A]/80 transition-colors duration-500" />

            {/* Barre couleur à gauche au hover */}
            <div
                className="absolute left-0 top-0 bottom-0 w-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: service.color }}
            />

            <Link
                href={service.href}
                className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 py-12 px-4 md:px-6 transition-all duration-300"
            >
                {/* Numéro */}
                <div className="md:col-span-1 flex items-start">
                    <span
                        className="text-xs font-display tracking-wider transition-colors duration-300"
                        style={{ color: '#333340' }}
                    >
                        {service.number}
                    </span>
                </div>

                {/* Titre */}
                <div className="md:col-span-3">
                    <h2
                        className="font-display font-bold text-2xl md:text-3xl tracking-tighter transition-colors duration-300"
                        style={{ color: 'white' }}
                    >
                        <span className="group-hover:text-transparent group-hover:bg-clip-text transition-all duration-300"
                            style={{
                                backgroundImage: `linear-gradient(135deg, white 0%, ${service.color} 100%)`,
                                WebkitBackgroundClip: 'text',
                            }}
                        >
                            {service.title}
                        </span>
                    </h2>
                    <p className="text-sm text-[#9999AA] mt-1">{service.subtitle}</p>
                </div>

                {/* Description + tags */}
                <div className="md:col-span-4">
                    <p className="text-sm text-[#9999AA] leading-relaxed group-hover:text-white/70 transition-colors duration-300">
                        {service.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                        {service.tags.map(tag => (
                            <span
                                key={tag}
                                className="text-xs border px-3 py-1 rounded-sm transition-all duration-300 border-white/10 text-[#9999AA] group-hover:border-white/20 group-hover:text-white/60"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Prix + CTA */}
                <div className="md:col-span-4 flex items-start md:items-center justify-between md:justify-end gap-6">
                    <span
                        className="font-display font-bold text-lg transition-colors duration-300 group-hover:text-white"
                        style={{ color: 'white' }}
                    >
                        {service.prix}
                    </span>
                    <span
                        className="inline-flex items-center gap-2 border text-xs font-display font-bold uppercase tracking-widest px-5 py-3 rounded-sm transition-all duration-300"
                        style={{
                            borderColor: 'rgba(255,255,255,0.2)',
                            color: 'white',
                        }}
                    >
                        <span className="group-hover:hidden">Voir le détail</span>
                        <span
                            className="hidden group-hover:inline"
                            style={{ color: service.color }}
                        >
                            Voir le détail
                        </span>
                        <ArrowUpRight
                            size={12}
                            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            style={{ color: 'inherit' }}
                        />
                    </span>
                </div>
            </Link>
        </motion.div>
    )
}

export default function ServicesPage() {
    const faqRef = useRef<HTMLDivElement>(null)
    const faqInView = useInView(faqRef, { once: true, margin: '-10%' })
    const whyRef = useRef<HTMLDivElement>(null)
    const whyInView = useInView(whyRef, { once: true, margin: '-10%' })

    return (
        <div className="min-h-screen bg-[#0A0A0A]">

            {/* Hero */}
            <section className="px-8 md:px-14 pt-32 pb-24 border-b border-white/5 relative overflow-hidden">
                {/* Fond coloré subtil */}
                <div className="absolute inset-0 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse at 70% 50%, rgba(0,102,255,0.06) 0%, transparent 70%)' }}
                />
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 relative z-10">
                    <div>
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs uppercase tracking-[0.3em] text-electric-blue mb-6">
                            Ce que nous réalisons
                        </motion.p>
                        <div className="overflow-hidden">
                            <motion.h1
                                initial={{ y: 80 }} animate={{ y: 0 }}
                                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                className="font-display font-bold text-5xl md:text-7xl lg:text-8xl tracking-tighter leading-none"
                            >
                                NOS<br /><span className="text-electric-blue">SERVICES.</span>
                            </motion.h1>
                        </div>
                    </div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="max-w-sm">
                        <p className="text-base text-[#9999AA] leading-relaxed mb-6">
                            Du site vitrine à l'application complexe, nous couvrons l'ensemble du spectre digital pour les PME en Wallonie.
                        </p>
                        <Link href="/contact" className="inline-flex items-center gap-2 bg-electric-blue text-white px-6 py-3 font-display font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-blue-dark transition-colors group">
                            Discuter de votre projet
                            <ArrowUpRight size={13} />
                        </Link>
                    </motion.div>
                </div>

                {/* Services counter */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center gap-6 mt-12 relative z-10"
                >
                    {services.map((s) => (
                        <div key={s.number} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
                            <span className="text-xs text-[#9999AA] hidden md:block">{s.title}</span>
                        </div>
                    ))}
                </motion.div>
            </section>

            {/* Liste services */}
            <section className="px-8 md:px-14 py-8">
                {services.map((service, i) => (
                    <ServiceRow key={service.number} service={service} index={i} />
                ))}
            </section>

            {/* Pourquoi Beew */}
            <section ref={whyRef} className="px-8 md:px-14 py-28 border-t border-white/5 border-b">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={whyInView ? { opacity: 1 } : {}}
                            className="text-xs uppercase tracking-[0.2em] text-electric-blue mb-6"
                        >
                            Pourquoi Beew
                        </motion.p>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={whyInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.1 }}
                            className="font-display font-bold text-4xl md:text-5xl tracking-tighter leading-tight"
                        >
                            Pas un freelance,<br />pas une grande agence.<br />
                            <span className="text-electric-blue">Le juste milieu.</span>
                        </motion.h2>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {[
                            { label: 'Stack moderne', desc: 'Next.js, TypeScript, Vercel. Pas de WordPress ou de page builder limité.', color: '#0066FF' },
                            { label: 'Interlocuteur unique', desc: 'Un seul contact du brief à la mise en ligne. Pas de délégataires.', color: '#A855F7' },
                            { label: 'Prix transparent', desc: 'Devis fixe validé avant démarrage. Aucune surprise en cours de route.', color: '#22C55E' },
                            { label: 'Basé en Wallonie', desc: 'Bastogne. Disponible pour vous rencontrer, pas juste un chat bot.', color: '#F97316' },
                        ].map(({ label, desc, color }, i) => (
                            <motion.div
                                key={label}
                                initial={{ opacity: 0, x: 20 }}
                                animate={whyInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ delay: 0.1 + i * 0.08 }}
                                className="flex gap-4 border-b border-white/5 pb-4 last:border-0 last:pb-0"
                            >
                                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2" style={{ backgroundColor: color }} />
                                <div>
                                    <p className="font-display font-semibold text-sm mb-1">{label}</p>
                                    <p className="text-sm text-[#9999AA]">{desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section ref={faqRef} className="px-8 md:px-14 py-28 border-b border-white/5">
                <motion.p initial={{ opacity: 0 }} animate={faqInView ? { opacity: 1 } : {}} className="text-xs uppercase tracking-[0.2em] text-electric-blue mb-4">
                    Questions fréquentes
                </motion.p>
                <motion.h2 initial={{ opacity: 0, y: 20 }} animate={faqInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }} className="font-display font-bold text-4xl tracking-tighter mb-16">
                    On vous répond.
                </motion.h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {faqs.map((faq, i) => (
                        <motion.div
                            key={faq.q}
                            initial={{ opacity: 0, y: 20 }}
                            animate={faqInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.1 + i * 0.08 }}
                            className="border border-white/5 p-8 rounded-sm hover:border-electric-blue/30 transition-colors group"
                        >
                            <div className="flex items-start gap-3 mb-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-electric-blue flex-shrink-0 mt-1.5" />
                                <h3 className="font-display font-bold text-base tracking-tight group-hover:text-electric-blue transition-colors">{faq.q}</h3>
                            </div>
                            <p className="text-sm text-[#9999AA] leading-relaxed pl-4">{faq.a}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="px-8 md:px-14 py-28 flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                    <p className="text-xs uppercase tracking-widest text-electric-blue mb-4">Audit gratuit</p>
                    <h2 className="font-display font-bold text-4xl md:text-5xl tracking-tighter">
                        Démarrons par<br />un appel de 30 min.
                    </h2>
                </div>
                <div className="flex flex-col gap-3">
                    <Link href="/contact" className="inline-flex items-center gap-3 bg-electric-blue text-white px-10 py-5 font-display font-bold text-sm uppercase tracking-widest rounded-sm hover:bg-blue-dark transition-colors group">
                        Prendre contact
                        <ArrowUpRight size={16} />
                    </Link>
                    <a href="tel:+32472467309" className="text-center text-sm text-[#9999AA] hover:text-white transition-colors">
                        +32 472 46 73 09
                    </a>
                </div>
            </section>
        </div>
    )
}