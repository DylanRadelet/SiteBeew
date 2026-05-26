// src/components/sections/MarqueeSection.tsx
export default function MarqueeSection() {
  const items = ['Site Vitrine', 'E-Commerce', 'Application Web', 'SEO Technique', 'Next.js', 'Maintenance', 'UI/UX Design', 'Performance']

  return (
    <div className="border-y border-white/5 py-5 overflow-hidden bg-black">
      <div
        className="flex whitespace-nowrap"
        style={{
          animation: 'marquee 25s linear infinite',
        }}
      >
        {[...items, ...items, ...items].map((item, i) => (
          <span key={i} className="flex items-center gap-6 mx-8">
            <span className="text-sm font-display uppercase tracking-[0.15em] text-gray-400">{item}</span>
            <span className="text-electric-blue text-lg leading-none">—</span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  )
}
