// src/components/layout/Footer.tsx
'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { ArrowUpRight, MapPin, Mail, Phone } from 'lucide-react'
import { FaLinkedinIn, FaInstagram } from 'react-icons/fa'

const services = [
  { label: 'Site web', href: '/services/creation-site-web' },
  { label: 'Application web', href: '/services/developpement-application-web' },
  { label: 'Paiement mensuel', href: '/services/site-web-paiement-mensuel' },
  { label: 'SEO technique', href: '/services#seo' },
  { label: 'Maintenance', href: '/services#maintenance' },
]

const nav = [
  { label: 'Accueil', href: '/' },
  { label: 'Résultats', href: '/#resultats' },
  { label: 'À propos', href: '/a-propos' },
  { label: 'Contact', href: '/contact' },
  { label: 'Blog', href: '/blog' },
]

const cities = [
  { name: 'Bastogne', image: '/cities/bastogne.webp' },
  { name: 'Liège', image: '/cities/liege.webp' },
  { name: 'Namur', image: '/cities/namur.webp' },
  { name: 'Bruxelles', image: '/cities/bruxelles.webp' },
  { name: 'Wallonie', image: '/cities/wallonie.webp' },
]

export default function Footer() {
  const year = new Date().getFullYear()
  const [tooltip, setTooltip] = useState<{ image: string; x: number; y: number } | null>(null)
  const tickerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent, image: string) => {
    const rect = tickerRef.current?.getBoundingClientRect()
    if (!rect) return
    setTooltip({
      image,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <footer className="bg-black border-t border-white/5">
      {/* CTA band */}
      <div className="border-b border-white/5 px-8 md:px-14 py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#9999AA] mb-3">Prêt à construire ?</p>
          <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tighter leading-none">
            Parlons de<br />votre projet.
          </h2>
        </div>
        <Link
          href="/contact"
          className="inline-flex items-center gap-3 bg-electric-blue text-white px-8 py-4 font-display font-bold text-sm uppercase tracking-widest rounded-sm hover:bg-blue-dark transition-colors"
        >
          Démarrer maintenant
          <ArrowUpRight size={16} />
        </Link>
      </div>

      {/* Scrolling ticker avec hover photo */}
      <div
        ref={tickerRef}
        className="border-b border-white/5 py-4 relative"
      >
        <div
          className="flex whitespace-nowrap"
          style={{ animation: 'marquee 25s linear infinite' }}
        >
          {[...cities, ...cities, ...cities, ...cities].map((city, i) => (
            <span key={i} className="flex items-center gap-8 mx-6">
              <span
                className="text-sm font-display uppercase tracking-widest text-[#333340] hover:text-white transition-colors duration-200 cursor-default"
                onMouseMove={(e) => handleMouseMove(e, city.image)}
                onMouseEnter={(e) => handleMouseMove(e, city.image)}
                onMouseLeave={() => setTooltip(null)}  
              >
                {city.name}
              </span>
              <span className="text-electric-blue">·</span>
            </span>
          ))}
        </div>

        {tooltip && (
          <div
            className="absolute pointer-events-none z-50"
            style={{
              left: tooltip.x + 20,
              top: tooltip.y - 60,
            }}
          >
            <div
              className="w-40 h-30 rounded-sm bg-cover bg-center border border-white/10 shadow-2xl"
              style={{ backgroundImage: `url(${tooltip.image})`, backgroundColor: '#1a1a1a' }}
            />
          </div>
        )}

        <style>{`
    @keyframes marquee {
      from { transform: translateX(0); }
      to   { transform: translateX(-33.333%); }
    }
  `}</style>
      </div>

      {/* Main grid */}
      <div className="px-8 md:px-14 py-16 grid grid-cols-1 md:grid-cols-3 gap-14">
        <div>
          <div className="font-display font-bold text-2xl tracking-tighter mb-4">
            BEEW<span className="text-electric-blue">.</span>
          </div>
          <p className="text-sm text-[#9999AA] max-w-xs leading-relaxed mb-6">
            Agence web à Bastogne. Sites vitrines, e-commerce et applications web rapides, accessibles et SEO.
          </p>
          <div className="flex flex-col gap-3">
            <a href="mailto:dra@beew.agency" className="flex items-center gap-2 text-sm text-[#9999AA] hover:text-white transition-colors">
              <Mail size={13} /> dra@beew.agency
            </a>
            <a href="tel:+32472467309" className="flex items-center gap-2 text-sm text-[#9999AA] hover:text-white transition-colors">
              <Phone size={13} /> +32 472 46 73 09
            </a>
            <span className="flex items-center gap-2 text-sm text-[#9999AA]">
              <MapPin size={13} /> Bastogne, 6600 BE
            </span>
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-[#333340] mb-6">Navigation</p>
          <nav className="flex flex-col gap-3">
            {nav.map(({ label, href }) => (
              <Link key={href} href={href} className="text-sm text-[#9999AA] hover:text-white transition-colors">
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-[#333340] mb-6">Services</p>
          <nav className="flex flex-col gap-3">
            {services.map(({ label, href }) => (
              <Link key={href} href={href} className="text-sm text-[#9999AA] hover:text-white transition-colors">
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 px-8 md:px-14 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-[#333340]">© {year} Beew Agency. Tous droits réservés.</p>
        <div className="flex items-center gap-6">
          <a href="/legal/cgv" className="text-xs text-[#333340] hover:text-white transition-colors">CGV</a>
          {/* <a href="/politique-confidentialite" className="text-xs text-[#333340] hover:text-white transition-colors">Confidentialité</a> */}
          <div className="flex items-center gap-3">
            <a href="https://www.linkedin.com/company/beew-agency-be" target="_blank" rel="noopener noreferrer" className="text-[#333340] hover:text-electric-blue transition-colors">
              <FaLinkedinIn size={13} />
            </a>
            <a href="https://www.instagram.com/beew.agency/" target="_blank" rel="noopener noreferrer" className="text-[#333340] hover:text-electric-blue transition-colors">
              <FaInstagram size={13} />
            </a>
          </div>
        </div>
      </div>

      {/* Giant wordmark */}
      <div className="overflow-hidden px-4 relative">
        <p
          className="font-display font-bold text-[18vw] text-[#333340] leading-none tracking-tighter text-center select-none pb-4"
        >
          BEEW
        </p>
      </div>
    </footer>
  )
}