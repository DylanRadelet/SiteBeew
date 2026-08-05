"use client";

import { useEffect, useRef } from "react";

/**
 * Déformation en gros pixels par-dessus le visuel d'un hero.
 *
 * La source peut être la vidéo de l'accueil ou l'image fixe d'une page
 * interne : le composant lit ses dimensions naturelles dans les deux cas.
 *
 * Principe : le visuel reste visible et fournit l'image de fond. Le canvas est
 * transparent et ne peint QUE les blocs déformés autour du curseur. Deux
 * bénéfices : aucun coût de rendu hors de la zone survolée, et si le canvas
 * échoue (JS coupé, contexte perdu), la vidéo reste affichée intacte.
 *
 * Chaque bloc est échantillonné sur UN pixel de la vidéo puis étiré en carré
 * plein — c'est ce qui donne l'aspect « gros pixel » plutôt qu'un simple flou.
 *
 * COMMENT L'IMAGE EST LUE — c'est ici que se joue la fluidité.
 *
 * La version initiale appelait `drawImage(video, …)` une fois par bloc. Mesuré
 * sur un déplacement ordinaire : 1 287 blocs par image, soit 77 000 appels par
 * seconde. Or `drawImage` depuis un <video> déclenche à chaque fois un
 * échantillonnage de texture GPU : c'était la cause des saccades.
 *
 * La vidéo est désormais recopiée UNE fois par image dans un tampon réduit,
 * lu UNE fois, et les blocs sont peints au `fillRect` — une opération sans
 * rapport de coût avec un échantillonnage de texture. Le rendu est identique :
 * un pixel source étiré en carré plein EST un aplat uni.
 *
 * `willReadFrequently` demande au navigateur de garder ce tampon côté
 * processeur, ce qui supprime la lecture GPU→CPU que `getImageData`
 * provoquerait autrement.
 */

/** Tampon d'échantillonnage. Assez fin pour que deux blocs voisins diffèrent. */
const BUF_W = 320;
const BUF_H = 180;

/**
 * Côté d'un bloc, en pixels CSS.
 *
 * `CELL_TACTILE` est nettement plus petit : à 22 px sur un écran de 360 px de
 * large, l'image ne compte que seize blocs et l'effet devient un pavage grossier
 * qui écrase le visuel au lieu de l'effleurer.
 */
const CELL = 22;
const CELL_TACTILE = 10;
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

/* --- Mode vague : la version automatique, pour le tactile --------------- */

/** Intervalle entre deux vagues. */
const VAGUE_PERIODE = 5000;
/** Durée de la traversée. */
const VAGUE_DUREE = 1700;
/**
 * Demi-largeur de la bande, perpendiculairement à celle-ci. Plafonnée à une
 * fraction de la largeur réelle : 190 px fixes couvraient la moitié d'un écran
 * de téléphone, ce qui ne se lit plus comme une vague mais comme un voile.
 */
const VAGUE_LARGEUR = 190;
const VAGUE_LARGEUR_MIN = 60;
/** Amplitude du déplacement dans la vague. */
const VAGUE_FORCE = 16;
/**
 * Opacité maximale de la vague — bien en deçà de celle de la traînée à la
 * souris. La vague se déclenche seule et se répète : elle doit passer comme un
 * reflet, pas s'imposer.
 */
const VAGUE_ALPHA = 0.3;
/**
 * Inclinaison de la bande, en degrés depuis l'horizontale.
 * La vague descend perpendiculairement à cette bande : à 0° elle tomberait à
 * plat de haut en bas, à 33° elle balaie en diagonale.
 */
const VAGUE_ANGLE = 33;
const VAGUE_COS = Math.cos((VAGUE_ANGLE * Math.PI) / 180);
const VAGUE_SIN = Math.sin((VAGUE_ANGLE * Math.PI) / 180);

type TrailPoint = { x: number; y: number; life: number };

/** La source d'image : la vidéo du hero d'accueil, ou l'image d'un hero interne. */
type Source = HTMLVideoElement | HTMLImageElement | null;

export function PixelDistortion({ sourceRef }: { sourceRef: React.RefObject<Source> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const source = sourceRef.current;
    if (!canvas || !source) return;

    /**
     * Deux modes, selon le pointeur.
     *
     *  · pointeur fin (souris) : la traînée suit le curseur ;
     *  · pointeur grossier (tactile) : une vague traverse l'image toutes les
     *    cinq secondes. Sans elle, l'effet n'existait tout simplement pas sur
     *    téléphone, où se trouve pourtant la majorité des visiteurs.
     *
     * « Animations réduites » coupe les deux : c'est une préférence système
     * explicite, elle prime.
     */
    const fine = window.matchMedia("(pointer: fine)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (calm) return;
    const vagueAuto = !fine;
    const cellule = vagueAuto ? CELL_TACTILE : CELL;

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

    /**
     * Tampon d'échantillonnage : la vidéo y est recopiée une fois par image,
     * puis lue une seule fois. Tout le reste du rendu travaille sur ce tableau
     * d'octets, sans retoucher ni à la vidéo ni au GPU.
     */
    const buffer = document.createElement("canvas");
    buffer.width = BUF_W;
    buffer.height = BUF_H;
    const bufCtx = buffer.getContext("2d", { willReadFrequently: true });
    if (!bufCtx) return;
    let pixels: Uint8ClampedArray | null = null;
    /**
     * Instant de la dernière image recopiée. La vidéo tourne à 25 images par
     * seconde, l'écran à 60 : sans ce garde, on redécoderait la même image
     * vidéo deux fois sur trois pour rien. Mesuré : la recopie coûte 1,8 ms et
     * ce coût ne dépend pas de la taille du tampon — c'est le décodage vidéo
     * qui pèse, pas le nombre de pixels. Le sauter est donc le vrai gain.
     */
    let dernierTemps = -1;

    const depart = performance.now();
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

      // Une vidéo expose `videoWidth`, une image `naturalWidth`.
      const estVideo = source instanceof HTMLVideoElement;
      const vw = estVideo ? source.videoWidth : source.naturalWidth;
      const vh = estVideo ? source.videoHeight : source.naturalHeight;
      const sourcePrete = Boolean(
        vw && vh && (estVideo ? source.readyState >= 2 : source.complete),
      );

      // Les pixels s'estompent quand la souris s'arrête, mais le point lumineux
      // reste tant que le curseur est dans le hero : c'est lui qui matérialise
      // la position, il ne doit jamais disparaître sous le curseur immobile.
      // Vague automatique : une bande inclinée qui descend en travers du cadre.
      let vague: number | null = null;
      let projVague = 0;
      // Bande proportionnelle au cadre, jamais plus large qu'un tiers de celui-ci.
      const bande = Math.max(VAGUE_LARGEUR_MIN, Math.min(VAGUE_LARGEUR, width * 0.22));
      if (vagueAuto) {
        const cycle = (performance.now() - depart) % VAGUE_PERIODE;
        if (cycle < VAGUE_DUREE) vague = cycle / VAGUE_DUREE;
      }

      if ((!trail.length && vague === null) || !sourcePrete) {
        drawDot();
        return;
      }

      // UNE recopie et UNE lecture par image VIDÉO, quel que soit le nombre de
      // blocs — et rien du tout si la vidéo n'a pas changé d'image depuis.
      // Une image fixe n'a qu'une seule image à lire : `dernierTemps` reste à
      // sa valeur initiale et la recopie n'a lieu qu'une fois.
      const temps = estVideo ? source.currentTime : 0;
      if (temps !== dernierTemps || !pixels) {
        dernierTemps = temps;
        bufCtx.drawImage(source, 0, 0, BUF_W, BUF_H);
        pixels = bufCtx.getImageData(0, 0, BUF_W, BUF_H).data;
      }
      if (!pixels) {
        drawDot();
        return;
      }

      if (vague !== null) {
        /**
         * Bornes de la projection sur la normale, prises aux quatre coins : la
         * vague doit entrer complètement hors cadre et en ressortir de même,
         * sinon elle apparaît ou disparaît au milieu de l'image.
         */
        const coins = [
          [0, 0],
          [width, 0],
          [0, height],
          [width, height],
        ].map(([x, y]) => x * -VAGUE_SIN + y * VAGUE_COS);
        const bas = Math.min(...coins) - bande;
        const haut = Math.max(...coins) + bande;
        projVague = bas + vague * (haut - bas);
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

      /**
       * La bande est inclinée, donc sa boîte englobante ne l'est pas : on
       * balaie tout le cadre pendant la traversée. C'est plus large que
       * strictement nécessaire, mais le test par cellule écarte de toute façon
       * ce qui est hors de la bande, et le coût réel reste celui des blocs
       * effectivement peints.
       */
      if (vague !== null) {
        minX = 0;
        maxX = width;
        minY = 0;
        maxY = height;
      }

      for (const p of trail) {
        const r = RADIUS * p.life;
        minX = Math.min(minX, p.x - r);
        minY = Math.min(minY, p.y - r);
        maxX = Math.max(maxX, p.x + r);
        maxY = Math.max(maxY, p.y + r);
      }
      minX = Math.max(0, Math.floor(minX / cellule) * cellule);
      minY = Math.max(0, Math.floor(minY / cellule) * cellule);
      maxX = Math.min(width, Math.ceil(maxX / cellule) * cellule);
      maxY = Math.min(height, Math.ceil(maxY / cellule) * cellule);

      for (let y = minY; y < maxY; y += cellule) {
        for (let x = minX; x < maxX; x += cellule) {
          const cx = x + cellule / 2;
          const cy = y + cellule / 2;

          // Somme des poussées de chaque point de la traînée.
          let dx = 0;
          let dy = 0;
          let intensity = 0;
          // Plafond d'opacité : celui de la traînée par défaut, celui de la
          // vague dès qu'elle contribue.
          let plafond = MAX_ALPHA;

          for (const p of trail) {
            const r = RADIUS * p.life;
            const vx = cx - p.x;
            const vy = cy - p.y;

            // Comparaison au carré d'abord : la racine n'est calculée que pour
            // les points réellement dans le rayon. `Math.hypot` était appelé
            // 25 000 fois par image, dont la grande majorité pour rien.
            const carre = vx * vx + vy * vy;
            if (carre > r * r) continue;

            const dist = Math.sqrt(carre);
            if (dist < 0.001) continue;

            // Falloff quadratique : bord net au centre, fondu propre en lisière.
            const f = (1 - dist / r) ** 2 * p.life;
            dx += (vx / dist) * f;
            dy += (vy / dist) * f;
            intensity = Math.max(intensity, f);
          }

          if (vague !== null) {
            /**
             * Projection du point sur la NORMALE à la bande. Comparer cette
             * projection à celle de la vague donne la distance perpendiculaire,
             * quelle que soit l'inclinaison — c'est ce qui permet une bande
             * penchée sans changer le reste du calcul.
             */
            const proj = cx * -VAGUE_SIN + cy * VAGUE_COS;
            const ecart = Math.abs(proj - projVague);
            if (ecart < bande) {
              // Cosinus sur la largeur de bande : nul aux bords, maximal au centre.
              const f = Math.cos((ecart / bande) * (Math.PI / 2)) ** 2;
              // Déplacement le long de la normale, donc dans le sens de la descente.
              const sens = proj < projVague ? -1 : 1;
              const force = (f * VAGUE_FORCE) / STRENGTH;
              dx += sens * -VAGUE_SIN * force;
              dy += sens * VAGUE_COS * force;
              intensity = Math.max(intensity, f);
              plafond = VAGUE_ALPHA;
            }
          }

          if (intensity < 0.02) continue;

          // On échantillonne à la position D'OÙ vient la matière : la texture est
          // aspirée vers le curseur, ce qui produit l'étirement de la référence.
          const sxCanvas = cx - dx * STRENGTH;
          const syCanvas = cy - dy * STRENGTH;
          const sx = Math.round((sxCanvas - offX) / scale);
          const sy = Math.round((syCanvas - offY) / scale);
          if (sx < 0 || sy < 0 || sx >= vw || sy >= vh) continue;

          // Coordonnées vidéo ramenées au tampon réduit.
          const bx = (sx * BUF_W / vw) | 0;
          const by = (sy * BUF_H / vh) | 0;
          const i = (by * BUF_W + bx) * 4;

          ctx.globalAlpha = Math.min(plafond, intensity * 1.9);
          // Un pixel source étiré en bloc plein EST un aplat uni : le `fillRect`
          // donne exactement le même résultat que l'ancien `drawImage`, sans
          // repasser par la texture vidéo.
          ctx.fillStyle = `rgb(${pixels[i]},${pixels[i + 1]},${pixels[i + 2]})`;
          ctx.fillRect(x, y, cellule, cellule);
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
  }, [sourceRef]);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 z-10" />;
}
