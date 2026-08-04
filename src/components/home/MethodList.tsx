"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { DEUX_COLONNES } from "@/components/ui/section";
import type { Home } from "@/content/schema";

/**
 * Liste des étapes, avec un visuel qui suit le curseur au survol.
 *
 * Les images sont toutes montées et empilées, seule leur opacité change : le
 * survol ne déclenche aucun chargement, donc aucun clignotement à la première
 * fois. `priority={false}` + `sizes` réduits pour ne pas peser sur le LCP.
 *
 * Désactivé au tactile et en mode « animations réduites » : la position du
 * curseur n'a alors aucun sens.
 */
export function MethodList({ steps }: { steps: Home["method"]["steps"] }) {
  const zone = useRef<HTMLOListElement>(null);
  const vignette = useRef<HTMLDivElement>(null);
  const [actif, setActif] = useState<number | null>(null);
  const [survolActif, setSurvolActif] = useState(false);

  useEffect(() => {
    const fin = window.matchMedia("(pointer: fine)").matches;
    const calme = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setSurvolActif(fin && !calme);
  }, []);

  useEffect(() => {
    if (!survolActif) return;
    const liste = zone.current;
    const v = vignette.current;
    if (!liste || !v) return;

    let raf = 0;
    let cibleX = 0;
    let cibleY = 0;
    let x = 0;
    let y = 0;

    const onMove = (e: PointerEvent) => {
      const r = liste.getBoundingClientRect();
      cibleX = e.clientX - r.left;
      cibleY = e.clientY - r.top;
      if (!raf) raf = requestAnimationFrame(suivre);
    };

    // Interpolation : la vignette rattrape le curseur avec un léger retard,
    // ce qui donne le glissé caractéristique plutôt qu'un collage rigide.
    const suivre = () => {
      x += (cibleX - x) * 0.14;
      y += (cibleY - y) * 0.14;
      v.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      if (Math.abs(cibleX - x) > 0.4 || Math.abs(cibleY - y) > 0.4) {
        raf = requestAnimationFrame(suivre);
      } else {
        raf = 0;
      }
    };

    liste.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      liste.removeEventListener("pointermove", onMove);
    };
  }, [survolActif]);

  return (
    <div className="relative mt-16">
      <ol ref={zone} className="relative border-t border-beew-noir/15">
        {steps.map((s, i) => (
          <li
            key={s.title}
            data-reveal
            data-reveal-delay={i * 70}
            onPointerEnter={() => setActif(i)}
            onPointerLeave={() => setActif(null)}
            className={`${DEUX_COLONNES} group border-b border-beew-noir/15 py-9 transition-opacity duration-500 ${
              actif !== null && actif !== i ? "lg:opacity-35" : "opacity-100"
            }`}
          >
            <div className="flex items-baseline gap-6">
              <span className="text-sm font-semibold text-beew-vert tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-[clamp(1.15rem,2.2vw,1.75rem)] font-semibold tracking-tight transition-transform duration-500 group-hover:lg:translate-x-2">
                  {s.title}
                </h3>
                <p className="mt-1.5 text-[11px] tracking-[0.2em] text-beew-noir/40 uppercase">
                  {s.duration}
                </p>
              </div>
            </div>

            <p className="max-w-prose text-sm leading-relaxed text-beew-noir/60">{s.description}</p>
          </li>
        ))}

        {/* Vignette qui suit le curseur. Hors flux, jamais cliquable. */}
        {survolActif && (
          <div
            ref={vignette}
            aria-hidden
            className={`pointer-events-none absolute top-0 left-0 z-20 hidden h-64 w-48 overflow-hidden rounded-xl shadow-2xl transition-opacity duration-300 lg:block ${
              actif === null ? "opacity-0" : "opacity-100"
            }`}
          >
            {steps.map((s, i) => (
              <Image
                key={s.image}
                src={s.image}
                alt=""
                fill
                sizes="192px"
                className={`object-cover transition-opacity duration-300 ${
                  actif === i ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>
        )}
      </ol>
    </div>
  );
}
