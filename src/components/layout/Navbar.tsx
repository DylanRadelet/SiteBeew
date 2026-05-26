// src/components/layout/Navbar.tsx
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from "framer-motion"
import { X, Menu, ArrowUpRight } from 'lucide-react'
import { FaLinkedinIn, FaInstagram } from 'react-icons/fa'

const navLinks = [
  { label: 'Résultats',  href: '/#resultats' },
  { label: 'Services',   href: '/services'    },
  { label: 'À propos',   href: '/a-propos'    },
  { label: 'Contact',    href: '/contact'     },
]

const megaLinks = [
  { label: 'Site web',            href: '/services/creation-site-web' },
  { label: 'Application web',     href: '/services/developpement-application-web' },
  { label: 'Paiement mensuel',    href: '/services/site-web-paiement-mensuel' },
  { label: 'SEO technique',       href: '/services#seo' },
  { label: 'Maintenance',         href: '/services#maintenance' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
  }, [menuOpen])

  return (
    <>
      {/* Top bar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-black/90 backdrop-blur-md border-b border-white/5' : ''
        }`}
      >
        <div className="flex items-center justify-between px-8 py-4 md:px-14">
          {/* Logo */}
          <Link href="/" className="font-display font-bold text-xl tracking-tighter text-white z-50 relative">
            BEEW<span className="text-electric-blue">.</span>
          </Link>

          {/* Center ticker (desktop) */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 text-xs tracking-widest text-gray-400 uppercase">
            Agence web — Bastogne, Wallonie
          </div>

          {/* Right CTAs */}
          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className="hidden md:flex items-center gap-2 bg-electric-blue text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-light transition-colors duration-200"
            >
              Démarrer un projet
            </Link>
            <button
              onClick={() => setMenuOpen(true)}
              className="flex items-center gap-2 text-sm font-medium text-white hover:text-electric-blue transition-colors"
              aria-label="Ouvrir le menu"
            >
              <Menu size={18} />
              <span className="hidden md:inline">MENU</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mega Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-white/95"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header inside menu */}
            <div className="flex items-center justify-between px-8 py-4 md:px-14 border-b border-black/10">
              <Link href="/" onClick={() => setMenuOpen(false)} className="font-display font-bold text-xl tracking-tighter text-black">
                BEEW<span className="text-electric-blue">.</span>
              </Link>
              <div className="flex items-center gap-4">
                <Link
                  href="/contact"
                  onClick={() => setMenuOpen(false)}
                  className="hidden md:flex items-center gap-2 bg-electric-blue text-white px-5 py-2 rounded-full text-sm font-medium"
                >
                  Démarrer un projet
                </Link>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 text-sm font-medium text-black"
                  aria-label="Fermer le menu"
                >
                  <X size={18} />
                  <span>FERMER</span>
                </button>
              </div>
            </div>

            {/* Menu grid: 3 columns */}
            <div className="h-[calc(100vh-70px)] grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-black/10">

              {/* Col 1: Main links */}
              <div className="p-10 md:p-14 flex flex-col justify-between">
                <nav className="flex flex-col gap-2">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className="block text-5xl md:text-6xl font-display font-bold tracking-tighter text-black hover:text-electric-blue transition-colors duration-200 leading-none py-3"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-8"
                >
                  <Link
                    href="/contact"
                    onClick={() => setMenuOpen(false)}
                    className="block w-full bg-electric-blue text-white text-center py-5 font-display font-bold text-base tracking-widest uppercase rounded-sm hover:bg-blue-dark transition-colors"
                  >
                    DÉMARRER UN PROJET
                  </Link>
                </motion.div>
              </div>

              {/* Col 2: Services */}
              <div className="p-10 md:p-14 flex flex-col justify-center">
                <p className="text-xs tracking-widest uppercase text-gray-400 mb-8">Nos services</p>
                <nav className="flex flex-col gap-4">
                  {megaLinks.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.15 + i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-between text-lg font-display font-semibold text-black hover:text-electric-blue transition-colors group"
                      >
                        {link.label}
                        <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </motion.div>
                  ))}
                </nav>
              </div>

              {/* Col 3: Contact info + socials */}
              <div className="p-10 md:p-14 flex flex-col justify-between">
                <div>
                  <p className="text-xs tracking-widest uppercase text-gray-400 mb-6">Contact</p>
                  <a href="mailto:dra@beew.agency" className="block text-lg font-display font-semibold text-black hover:text-electric-blue transition-colors mb-2">
                    dra@beew.agency
                  </a>
                  <a href="tel:+32472467309" className="block text-sm text-gray-400 hover:text-black transition-colors">
                    +32 472 46 73 09
                  </a>
                  <p className="text-sm text-gray-400 mt-2">Bastogne, Wallonie — BE</p>
                </div>

                <div>
                  <p className="text-xs tracking-widest uppercase text-gray-400 mb-4">Suivez-nous</p>
                  <div className="flex flex-col gap-3">
                    {[
                      { label: 'LinkedIn', icon: FaLinkedinIn, href: 'https://www.linkedin.com/company/beew-agency-be' },
                      { label: 'Instagram', icon: FaInstagram, href: 'https://www.instagram.com/beew.agency/' },
                    ].map(({ label, icon: Icon, href }) => (
                      <a
                        key={href}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-black hover:text-electric-blue transition-colors group"
                      >
                        <Icon size={13} />
                        {label}
                        <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
