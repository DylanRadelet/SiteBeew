import { NextResponse } from "next/server";

/**
 * Reçoit les communes saisies dans le sélecteur sans page correspondante.
 *
 * Ce n'est pas un détail : chaque saisie est une demande réelle, mesurée, qui
 * indique quelle ville ouvrir ensuite. C'est de la recherche de mots-clés
 * gratuite et fondée sur du trafic existant plutôt que sur des estimations.
 *
 * Route exclue du crawl via robots.ts.
 */
export async function POST(request: Request) {
  const { query } = (await request.json().catch(() => ({}))) as { query?: string };
  if (!query?.trim()) return NextResponse.json({ ok: false }, { status: 400 });

  // TODO: brancher sur la destination de votre choix (base, Sheet, webhook).
  console.info("[unknown-city]", query.trim().slice(0, 80));

  return NextResponse.json({ ok: true });
}
