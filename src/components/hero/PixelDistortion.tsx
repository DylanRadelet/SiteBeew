"use client";

import { useEffect, useRef } from "react";

/**
 * Déformation en gros pixels suivant la souris, par-dessus la vidéo du hero.
 *
 * Principe : le <video> reste visible et fournit l'image de fond. Le canvas est
 * transparent et ne peint QUE les blocs déformés autour du curseur. Deux
 * bénéfices : aucun coût de rendu hors de la zone survolée, et si le canvas
 * échoue (JS coupé, contexte perdu), la vidéo reste affichée intacte.
 *
 * Chaque bloc est échantillonné sur UN pixel de la vidéo puis étiré en carré
 * plein — c'est ce qui donne l'aspect « gros pixel » plutôt qu'un simple flou.
 * On échantillonne directement depuis l'élément <video> : pas de getImageData,
 * donc pas de lecture GPU→CPU à chaque frame.
 */

/** Côté d'un bloc, en pixels CSS. */
const CELL = 22;
/** Rayon d'influence d'un point de la traînée — large, l'effet couvre du terrain. */
const RADIUS = 300;
/** Amplitude du déplacement. C'est le réglage qui rend l'effet plus ou moins franc. */
const STRENGTH = 42;
/** Opacité maximale des blocs. Le plafond empêche l'effet de « trouer » la vidéo. */
const MAX_ALPHA = 0.66;
/** Longueur de la traînée — c'est elle qui étire l'effet en comète. */
const TRAIL_LENGTH = 20;
/** Vitesse de disparition de la traînée quand la souris s'arrête. */
const TRAIL_DECAY = 0.94;
/** Rayon du point lumineux bleuté. */
const DOT_RADIUS = 11;

type TrailPoint = { x: number; y: number; life: number };

export function PixelDistortion({ videoRef }: { videoRef: React.RefObject<HTMLVideoElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    // Pas d'effet au clavier/tactile ni en mode « animations réduites ».
    const fine = window.matchMedia("(pointer: fine)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || calm) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      // `offsetWidth/Height` et non `getBoundingClientRect` : ce sont les
      // dimensions de mise en page, insensibles au `scale` appliqué par la
      // séquence de scroll. Sinon le canvas se redimensionnerait pendant le zoom.
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = parent.offsetWidth;
      height = parent.offsetHeight;
      if (!width || !height) return;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(parent);
    // Ceinture et bretelles : dans certains contextes le ResizeObserver est
    // différé ou étranglé, et le canvas garderait une taille périmée.
    window.addEventListener("resize", resize);

    const trail: TrailPoint[] = [];
    let pointer: { x: number; y: number } | null = null;
    let raf = 0;

    /**
     * Écoute sur `window`, pas sur le hero.
     *
     * Le hero est recouvert par d'autres couches (manifeste, voile, indicateur
     * de scroll). Écouter sur lui rendait l'effet dépendant de qui se trouve
     * au-dessus : dès qu'une couche interceptait le survol, le hero recevait un
     * `pointerleave` et tout s'éteignait. En écoutant la fenêtre et en testant
     * nous-mêmes si le curseur est dans le cadre, plus rien ne peut le couper.
     */
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      // Rapport rect/canvas : compense un éventuel `scale` d'un parent.
      const x = ((e.clientX - rect.left) / rect.width) * width;
      const y = ((e.clientY - rect.top) / rect.height) * height;

      if (x < 0 || y < 0 || x > width || y > height) {
        pointer = null;
        return;
      }

      pointer = { x, y };
      trail.push({ x, y, life: 1 });
      if (trail.length > TRAIL_LENGTH) trail.shift();
    };
    const onLeave = () => {
      pointer = null;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);

    /**
     * Bille de lumière bleutée sous le curseur. Dessinée à chaque frame tant que
     * le pointeur est dans le hero, indépendamment de la traînée de pixels : les
     * pixels retombent quand la souris s'arrête, le point reste.
     */
    const drawDot = () => {
      if (!pointer) return;
      const dot = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, DOT_RADIUS);
      dot.addColorStop(0, "rgba(214, 232, 247, 0.85)");
      dot.addColorStop(0.45, "rgba(138, 180, 216, 0.4)");
      dot.addColorStop(1, "rgba(138, 180, 216, 0)");
      ctx.fillStyle = dot;
      ctx.beginPath();
      ctx.arc(pointer.x, pointer.y, DOT_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    };

    const render = () => {
      raf = requestAnimationFrame(render);
      ctx.clearRect(0, 0, width, height);

      // La traînée s'estompe même souris immobile : l'effet retombe doucement.
      for (const p of trail) p.life *= TRAIL_DECAY;
      while (trail.length && trail[0].life < 0.02) trail.shift();

      const vw = video.videoWidth;
      const vh = video.videoHeight;
      const videoPrete = Boolean(vw && vh && video.readyState >= 2);

      // Les pixels s'estompent quand la souris s'arrête, mais le point lumineux
      // reste tant que le curseur est dans le hero : c'est lui qui matérialise
      // la position, il ne doit jamais disparaître sous le curseur immobile.
      if (!trail.length || !videoPrete) {
        drawDot();
        return;
      }

      // Transformation object-fit: cover, pour convertir canvas -> pixels vidéo.
      const scale = Math.max(width / vw, height / vh);
      const drawW = vw * scale;
      const drawH = vh * scale;
      const offX = (width - drawW) / 2;
      const offY = (height - drawH) / 2;

      // On ne balaie que la boîte englobante de la traînée : le reste de l'écran
      // n'est jamais parcouru, ce qui garde le coût constant quelle que soit la
      // taille du hero.
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      for (const p of trail) {
        const r = RADIUS * p.life;
        minX = Math.min(minX, p.x - r);
        minY = Math.min(minY, p.y - r);
        maxX = Math.max(maxX, p.x + r);
        maxY = Math.max(maxY, p.y + r);
      }
      minX = Math.max(0, Math.floor(minX / CELL) * CELL);
      minY = Math.max(0, Math.floor(minY / CELL) * CELL);
      maxX = Math.min(width, Math.ceil(maxX / CELL) * CELL);
      maxY = Math.min(height, Math.ceil(maxY / CELL) * CELL);

      for (let y = minY; y < maxY; y += CELL) {
        for (let x = minX; x < maxX; x += CELL) {
          const cx = x + CELL / 2;
          const cy = y + CELL / 2;

          // Somme des poussées de chaque point de la traînée.
          let dx = 0;
          let dy = 0;
          let intensity = 0;

          for (const p of trail) {
            const r = RADIUS * p.life;
            const vx = cx - p.x;
            const vy = cy - p.y;
            const dist = Math.hypot(vx, vy);
            if (dist > r || dist < 0.001) continue;

            // Falloff quadratique : bord net au centre, fondu propre en lisière.
            const f = (1 - dist / r) ** 2 * p.life;
            dx += (vx / dist) * f;
            dy += (vy / dist) * f;
            intensity = Math.max(intensity, f);
          }

          if (intensity < 0.02) continue;

          // On échantillonne à la position D'OÙ vient la matière : la texture est
          // aspirée vers le curseur, ce qui produit l'étirement de la référence.
          const sxCanvas = cx - dx * STRENGTH;
          const syCanvas = cy - dy * STRENGTH;
          const sx = Math.round((sxCanvas - offX) / scale);
          const sy = Math.round((syCanvas - offY) / scale);
          if (sx < 0 || sy < 0 || sx >= vw || sy >= vh) continue;

          ctx.globalAlpha = Math.min(MAX_ALPHA, intensity * 1.9);
          // 1 pixel source étiré sur tout le bloc = aplat uni, pas d'interpolation.
          ctx.drawImage(video, sx, sy, 1, 1, x, y, CELL, CELL);
        }
      }

      ctx.globalAlpha = 1;
      drawDot();
    };

    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, [videoRef]);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 z-10" />;
}
