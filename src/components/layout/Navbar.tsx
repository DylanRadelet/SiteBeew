// src/components/layout/Navbar.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react'
import { FaInstagram, FaLinkedinIn } from 'react-icons/fa'

const navLinks = [
  { label: 'Résultats', href: '/#resultats' },
  { label: 'Services', href: '/services' },
  { label: 'À propos', href: '/a-propos' },
  { label: 'Contact', href: '/contact' },
]

const megaLinks = [
  { label: 'Site web', href: '/services/creation-site-web' },
  { label: 'Application web', href: '/services/developpement-application-web' },
  { label: 'Paiement mensuel', href: '/services/site-web-paiement-mensuel' },
  { label: 'SEO technique', href: '/services#seo' },
  { label: 'Maintenance', href: '/services#maintenance' },
]

const socialLinks = [
  {
    label: 'LinkedIn',
    icon: FaLinkedinIn,
    href: 'https://www.linkedin.com/company/beew-agency-be',
  },
  {
    label: 'Instagram',
    icon: FaInstagram,
    href: 'https://www.instagram.com/beew.agency/',
  },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    onScroll()
    window.addEventListener('scroll', onScroll)

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''

    if (!menuOpen) {
      setServicesOpen(false)
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const closeMenu = () => {
    setMenuOpen(false)
  }

  return (
    <>
      {/* ───────────────── TOP BAR ───────────────── */}
      <header
        className={`fixed left-0 right-0 top-0 z-[100] w-full transition-all duration-300 ${scrolled ? 'border-b border-white/5 bg-black/90 backdrop-blur-md' : ''
          }`}
      >
        <div className="relative mx-auto box-border flex w-full max-w-[100vw] items-center justify-between gap-3 px-4 py-4 md:max-w-full md:px-14">
          {/* Logo */}
          <Link
            href="/"
            className="relative z-10 shrink-0 font-display text-xl font-bold tracking-tighter text-white"
          >
            BEEW<span className="text-electric-blue">.</span>
          </Link>

          {/* Center ticker — desktop seulement */}
          <div className="pointer-events-none absolute left-1/2 hidden -translate-x-1/2 whitespace-nowrap text-xs uppercase tracking-widest text-[#9999AA] md:block">
            Agence web — Bastogne, Wallonie
          </div>

          {/* Right */}
          <div className="flex shrink-0 items-center justify-end gap-3">
            <Link
              href="/contact"
              className="hidden items-center gap-2 rounded-full bg-electric-blue px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-dark md:flex"
            >
              Démarrer un projet
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:text-electric-blue md:h-auto md:w-auto md:gap-2 md:rounded-none"
              aria-label="Ouvrir le menu"
            >
              <Menu size={22} />
              <span className="hidden text-xs uppercase tracking-widest md:inline">
                Menu
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ───────────────── MEGA MENU ───────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[9000] isolate w-full overflow-x-hidden overflow-y-auto"
            style={{ backgroundColor: 'rgba(250,250,248,0.98)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Header du menu */}
            <div className="sticky top-0 z-20 box-border flex w-full max-w-[100dvw] items-center justify-between gap-3 border-b border-black/10 bg-[rgba(250,250,248,0.98)] px-4 py-4 md:max-w-full md:px-14">
              <Link
                href="/"
                onClick={closeMenu}
                className="shrink-0 font-display text-xl font-bold tracking-tighter text-black"
              >
                BEEW<span className="text-electric-blue">.</span>
              </Link>

              <div className="flex shrink-0 items-center justify-end gap-3">
                <Link
                  href="/contact"
                  onClick={closeMenu}
                  className="hidden items-center gap-2 rounded-full bg-electric-blue px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-dark md:flex"
                >
                  Démarrer un projet
                </Link>

                <button
                  type="button"
                  onClick={closeMenu}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-black transition-colors hover:text-electric-blue md:h-auto md:w-auto md:gap-2 md:rounded-none"
                  aria-label="Fermer le menu"
                >
                  <X size={22} />
                  <span className="hidden text-xs uppercase tracking-widest md:inline">
                    Fermer
                  </span>
                </button>
              </div>
            </div>

            {/* ───────────────── MOBILE ───────────────── */}
            <div className="flex w-full max-w-[100dvw] flex-col gap-2 overflow-x-hidden px-4 py-8 md:hidden">
              {navLinks.map((link, index) =>
                link.label === 'Services' ? (
                  <div key={link.href} className="w-full max-w-full">
                    <button
                      type="button"
                      onClick={() => setServicesOpen((open) => !open)}
                      className="flex w-full items-center justify-between gap-4 border-b border-black/8 py-4 text-left"
                    >
                      <span className="min-w-0 break-words font-display text-3xl font-bold tracking-tighter text-black">
                        {link.label}
                      </span>

                      <ChevronDown
                        size={20}
                        className={`shrink-0 text-black transition-transform duration-300 ${servicesOpen ? 'rotate-180' : ''
                          }`}
                      />
                    </button>

                    <AnimatePresence>
                      {servicesOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="w-full overflow-hidden"
                        >
                          <div className="flex w-full flex-col gap-1 py-3 pl-4">
                            {megaLinks.map((megaLink) => (
                              <Link
                                key={megaLink.href}
                                href={megaLink.href}
                                onClick={closeMenu}
                                className="flex w-full items-center justify-between gap-3 py-2.5 font-display text-base font-semibold text-black/60 transition-colors hover:text-electric-blue"
                              >
                                <span className="min-w-0 break-words">
                                  {megaLink.label}
                                </span>
                                <ArrowUpRight size={14} className="shrink-0 opacity-50" />
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <motion.div
                    key={link.href}
                    className="w-full"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      onClick={closeMenu}
                      className="block w-full break-words border-b border-black/8 py-4 font-display text-3xl font-bold tracking-tighter text-black transition-colors hover:text-electric-blue"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                )
              )}

              <div className="mt-6 flex w-full flex-col gap-4 overflow-hidden">
                <a
                  href="mailto:dra@beew.agency"
                  className="break-words font-display text-sm font-semibold text-black transition-colors hover:text-electric-blue"
                >
                  dra@beew.agency
                </a>

                <a
                  href="tel:+32472467309"
                  className="text-sm text-black/50 transition-colors hover:text-black"
                >
                  +32 472 46 73 09
                </a>

                <div className="mt-2 flex w-full flex-wrap items-center gap-4">
                  {socialLinks.map(({ icon: Icon, href, label }) => (
                    <a
                      key={href}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-w-0 items-center gap-2 text-sm text-black/60 transition-colors hover:text-electric-blue"
                    >
                      <Icon size={14} className="shrink-0" />
                      <span>{label}</span>
                    </a>
                  ))}
                </div>
              </div>

              <Link
                href="/contact"
                onClick={closeMenu}
                className="mt-6 block w-full rounded-sm bg-electric-blue py-4 text-center font-display text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-blue-dark"
              >
                Démarrer un projet
              </Link>
            </div>

            {/* ───────────────── DESKTOP ───────────────── */}
            <div className="hidden h-[calc(100vh-73px)] w-full max-w-full grid-cols-3 divide-x divide-black/10 overflow-hidden md:grid">
              {/* Colonne 1 */}
              <div className="flex min-w-0 flex-col justify-between p-14">
                <nav className="flex min-w-0 flex-col gap-1">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      className="min-w-0"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: index * 0.06,
                        duration: 0.4,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <Link
                        href={link.href}
                        onClick={closeMenu}
                        className="block break-words py-3 font-display text-5xl font-bold leading-none tracking-tighter text-black transition-colors hover:text-electric-blue lg:text-6xl"
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
                >
                  <Link
                    href="/contact"
                    onClick={closeMenu}
                    className="block w-full rounded-sm bg-electric-blue py-5 text-center font-display text-base font-bold uppercase tracking-widest text-white transition-colors hover:bg-blue-dark"
                  >
                    DÉMARRER UN PROJET
                  </Link>
                </motion.div>
              </div>

              {/* Colonne 2 */}
              <div className="flex min-w-0 flex-col justify-center p-14">
                <p className="mb-8 text-xs uppercase tracking-widest text-[#9999AA]">
                  Nos services
                </p>

                <nav className="flex min-w-0 flex-col gap-5">
                  {megaLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      className="min-w-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.15 + index * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={closeMenu}
                        className="group flex min-w-0 items-center justify-between gap-4 font-display text-lg font-semibold text-black transition-colors hover:text-electric-blue"
                      >
                        <span className="min-w-0 break-words">{link.label}</span>
                        <ArrowUpRight
                          size={16}
                          className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                        />
                      </Link>
                    </motion.div>
                  ))}
                </nav>
              </div>

              {/* Colonne 3 */}
              <div className="flex min-w-0 flex-col justify-between p-14">
                <div className="min-w-0">
                  <p className="mb-6 text-xs uppercase tracking-widest text-[#9999AA]">
                    Contact
                  </p>

                  <a
                    href="mailto:dra@beew.agency"
                    className="mb-2 block break-words font-display text-lg font-semibold text-black transition-colors hover:text-electric-blue"
                  >
                    dra@beew.agency
                  </a>

                  <a
                    href="tel:+32472467309"
                    className="block text-sm text-[#9999AA] transition-colors hover:text-black"
                  >
                    +32 472 46 73 09
                  </a>

                  <p className="mt-2 text-sm text-[#9999AA]">
                    Bastogne, Wallonie — BE
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="mb-4 text-xs uppercase tracking-widest text-[#9999AA]">
                    Suivez-nous
                  </p>

                  <div className="flex min-w-0 flex-col gap-3">
                    {socialLinks.map(({ label, icon: Icon, href }) => (
                      <a
                        key={href}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex min-w-0 items-center gap-2 text-sm text-black transition-colors hover:text-electric-blue"
                      >
                        <Icon size={13} className="shrink-0" />
                        <span>{label}</span>
                        <ArrowUpRight
                          size={12}
                          className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                        />
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