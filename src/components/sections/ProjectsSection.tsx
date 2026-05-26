// src/components/sections/ProjectsSection.tsx
'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

const projects = [
    {
        id: 1,
        client: 'Creaphike',
        title: 'SITE VITRINE POUR UNE AGENCE CRÉATIVE',
        tag: 'Site vitrine',
        bg: '#0066FF',
        color: '#ffffff',
        image: '/projects/creaphike.png',
    },
    {
        id: 2,
        client: 'FaceAnime',
        title: 'RÉSEAU SOCIAL DÉDIÉ AUX PASSIONNÉS D\'ANIMÉS ET MANGAS',
        tag: 'App web & mobile',
        bg: '#F5F0E8',
        color: '#8E51FF',
        image: '/projects/faceanime.png',
    },
    {
        id: 3,
        client: 'Green Work Project',
        title: 'SITE VITRINE POUR UN INDÉPENDANT EN PEINTURES MINÉRALES',
        tag: 'Site vitrine',
        bg: '#fdfdfd',
        color: '#1F4E3D',
        image: '/projects/greenworkproject.png',
    },
    {
        id: 4,
        client: 'HappyLink',
        title: 'APPLICATION WEB DE MISE EN RELATION ET CRÉATION DE LIENS',
        tag: 'Application web',
        bg: '#0A2A0A',
        color: '#FFD60A',
        image: '/projects/happylink.png',
    },
    {
        id: 5,
        client: 'Moki',
        title: 'LANDING PAGE DE PRÉINSCRIPTION POUR UNE APP WEB & MOBILE',
        tag: 'Landing page',
        bg: '#2A1A0A',
        color: '#FF5C5C',
        image: '/projects/moki.png',
    },
    {
        id: 6,
        client: 'Racoon Graphics',
        title: 'PORTFOLIO EN LIGNE POUR UN ARTISTE GRAPHISTE',
        tag: 'Site vitrine',
        bg: '#1A0A2A',
        color: '#B71239',
        image: '/projects/racoon.png',
    },
]

export default function ProjectsSection() {
    const ref = useRef<HTMLElement>(null)
    const inView = useInView(ref, { once: true, margin: '-10%' })

    return (
        <section ref={ref} id="resultats" className="px-8 md:px-14 py-28 md:py-36 border-b border-white/5">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                <div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={inView ? { opacity: 1 } : {}}
                        className="text-xs uppercase tracking-[0.2em] text-electric-blue mb-4"
                    >
                        Nos résultats
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="font-display font-bold text-4xl md:text-5xl tracking-tighter"
                    >
                        Ce qu'on a construit.
                    </motion.h2>
                </div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.3 }}
                >
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 text-sm text-[#9999AA] hover:text-white transition-colors group"
                    >
                        Démarrer votre projet
                        <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.1, duration: 0.7 }}
                    className="md:col-span-7"
                >
                    <ProjectCard project={projects[0]} tall />
                </motion.div>

                <div className="md:col-span-5 flex flex-col gap-3">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.18, duration: 0.7 }} className="flex-1">
                        <ProjectCard project={projects[1]} />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.26, duration: 0.7 }} className="flex-1">
                        <ProjectCard project={projects[2]} />
                    </motion.div>
                </div>

                <div className="md:col-span-5 flex flex-col gap-3">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.34, duration: 0.7 }} className="flex-1">
                        <ProjectCard project={projects[4]} />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.42, duration: 0.7 }} className="flex-1">
                        <ProjectCard project={projects[5]} />
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.5, duration: 0.7 }}
                    className="md:col-span-7"
                >
                    <ProjectCard project={projects[3]} tall />
                </motion.div>
            </div>
        </section>
    )
}

function ProjectCard({
    project,
    tall = false,
}: {
    project: typeof projects[0]
    tall?: boolean
}) {
    return (
        <Link
            href="/contact"
            className="block relative overflow-hidden rounded-sm group cursor-pointer"
            style={{
                backgroundColor: project.bg,
                minHeight: tall ? '420px' : '200px',
                height: '100%',
            }}
        >
            {/* Image de fond — zoom au hover */}
            {project.image && (
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{ backgroundImage: `url(${project.image})` }}
                />
            )}

            {/* Overlay dégradé permanent pour lisibilité du texte */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

            {/* Overlay hover supplémentaire */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-black" />

            {/* Flèche hover */}
            <div
                className="absolute top-5 right-5 w-9 h-9 rounded-full border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 z-10"
                style={{ borderColor: project.color, color: project.color }}
            >
                <ArrowUpRight size={15} />
            </div>

            {/* Contenu */}
            <div className="absolute inset-0 p-7 flex flex-col justify-between z-10">
                {/* Badge client */}
                <div
                    className="flex items-center gap-2 w-fit px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
                >
                    <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: project.color }}
                    />
                    <span
                        className="text-xs font-display font-bold uppercase tracking-widest"
                        style={{ color: project.color }}
                    >
                        {project.client}
                    </span>
                </div>

                {/* Tag + titre */}
                <div>
                    <span
                        className="inline-block text-xs font-display uppercase tracking-widest px-2 py-1 rounded-sm mb-3 border"
                        style={{
                            color: project.color,
                            borderColor: `${project.color}50`,
                            backgroundColor: `${project.color}20`,
                        }}
                    >
                        {project.tag}
                    </span>
                    <h3 className="font-display font-bold text-lg md:text-xl tracking-tighter leading-tight text-white">
                        {project.title}
                    </h3>
                </div>
            </div>

            {/* Ligne couleur slide au hover */}
            <div
                className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 z-10"
                style={{ backgroundColor: project.color }}
            />
        </Link>
    )
}