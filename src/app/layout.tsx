// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CustomCursor from '@/components/ui/CustomCursor'

export const metadata: Metadata = {
  title: 'Beew Agency — Agence web à Bastogne, Wallonie',
  description: 'Création de sites vitrines, e-commerce et applications web. Basé à Bastogne, actifs partout en Wallonie. Performance, SEO, accessibilité.',
  keywords: 'agence web, Bastogne, Wallonie, site vitrine, e-commerce, app web, SEO, Next.js',
  metadataBase: new URL('https://beew.agency'),
  openGraph: {
    title: 'Beew Agency — Agence web à Bastogne',
    description: 'Sites et apps rapides et SEO-friendly pour PME en Wallonie.',
    url: 'https://beew.agency',
    siteName: 'Beew Agency',
    locale: 'fr_BE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Beew Agency',
    description: 'Création de sites et applications web en Wallonie.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth overflow-x-hidden">
      <body className="overflow-x-hidden">
        <CustomCursor />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}