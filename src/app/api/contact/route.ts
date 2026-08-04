import { NextResponse } from "next/server";
import { Resend } from "resend";
import { AGENCY_EMAIL } from "@/lib/seo";

/**
 * Réception des formulaires de /contact et /devis.
 *
 * Reprise du système de l'ancien site (Resend, domaine beew.agency vérifié),
 * avec trois différences qui manquaient et qui comptent en production :
 *
 *  · le corps est VALIDÉ avant envoi — l'ancienne version faisait confiance au
 *    JSON reçu, ce qui laissait passer des requêtes vides ou forgées ;
 *  · les valeurs sont ÉCHAPPÉES avant d'entrer dans le HTML de l'e-mail —
 *    sans quoi n'importe qui pouvait injecter du balisage dans ta boîte ;
 *  · un champ piège (`entreprise_site`) arrête les robots sans CAPTCHA.
 *
 * La route est dynamique par nature (POST) : elle n'entre pas dans le SSG.
 */

const resend = new Resend(process.env.RESEND_API_KEY);

/** Adresse d'expédition : doit rester un domaine vérifié chez Resend. */
const EXPEDITEUR = "contact@beew.agency";
const DESTINATAIRE = process.env.CONTACT_TO ?? AGENCY_EMAIL;

/** Longueur maximale par champ : au-delà, c'est un robot, pas un prospect. */
const MAX = 5000;

const EMAIL_VALIDE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Empêche l'injection de balisage dans l'e-mail reçu. */
function echapper(valeur: unknown): string {
  return String(valeur ?? "")
    .slice(0, MAX)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Libellés lisibles pour les champs connus ; les autres passent tels quels. */
const LIBELLES: Record<string, string> = {
  prenom: "Prénom",
  nom: "Nom",
  email: "E-mail",
  telephone: "Téléphone",
  entreprise: "Entreprise",
  ville: "Ville",
  service: "Service",
  budget: "Budget",
  delai: "Délai",
  site: "Site actuel",
  website: "Site actuel",
  message: "Message",
};

export async function POST(req: Request) {
  let corps: Record<string, unknown>;

  try {
    corps = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête illisible." }, { status: 400 });
  }

  // Champ piège : invisible à l'écran, jamais rempli par un humain.
  if (typeof corps.entreprise_site === "string" && corps.entreprise_site.trim() !== "") {
    // On répond 200 : un robot informé de son échec réessaie autrement.
    return NextResponse.json({ success: true });
  }

  const email = String(corps.email ?? "").trim();
  const message = String(corps.message ?? "").trim();

  if (!EMAIL_VALIDE.test(email)) {
    return NextResponse.json({ error: "Adresse e-mail invalide." }, { status: 400 });
  }
  if (message.length < 10) {
    return NextResponse.json({ error: "Message trop court." }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY) {
    // Explicite plutôt que silencieux : une clé absente doit se voir dans les
    // logs, pas se traduire par une demande perdue et un visiteur rassuré.
    console.error("[contact] RESEND_API_KEY absente — aucune demande transmise.");
    return NextResponse.json({ error: "Service d'envoi indisponible." }, { status: 500 });
  }

  const lignes = Object.entries(corps)
    .filter(([cle, valeur]) => cle !== "message" && cle !== "entreprise_site" && String(valeur ?? "").trim())
    .map(([cle, valeur]) => {
      const libelle = LIBELLES[cle] ?? cle;
      return `
        <tr>
          <td style="padding:10px 0;color:#8a8a8a;font-size:12px;text-transform:uppercase;letter-spacing:.1em;width:140px">${echapper(libelle)}</td>
          <td style="padding:10px 0;color:#f1e9dd;font-size:14px">${echapper(valeur)}</td>
        </tr>`;
    })
    .join("");

  const qui = [corps.prenom, corps.nom].filter(Boolean).map(echapper).join(" ") || email;
  const objet = `[BEEW] ${qui}${corps.service ? ` — ${echapper(corps.service)}` : ""}`;

  try {
    const { error } = await resend.emails.send({
      from: `BEEW <${EXPEDITEUR}>`,
      to: DESTINATAIRE,
      replyTo: email,
      subject: objet,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:640px;margin:auto;background:#1d1f23;color:#f1e9dd;padding:32px;border-radius:12px">
          <p style="color:#65b2af;font-size:11px;letter-spacing:.25em;text-transform:uppercase;margin:0 0 24px">
            Nouvelle demande via beew.agency
          </p>
          <table style="width:100%;border-collapse:collapse">${lignes}</table>
          <div style="margin-top:24px;padding:20px;background:#141619;border-radius:8px;border-left:3px solid #ed6945">
            <p style="color:#8a8a8a;font-size:12px;letter-spacing:.1em;text-transform:uppercase;margin:0 0 12px">Message</p>
            <p style="color:#f1e9dd;font-size:14px;line-height:1.6;white-space:pre-wrap;margin:0">${echapper(message)}</p>
          </div>
          <p style="margin-top:24px;color:#5a5a5a;font-size:12px">
            Réponds directement à cet e-mail pour contacter ${qui}.
          </p>
        </div>`,
    });

    if (error) {
      console.error("[contact] Resend a refusé l'envoi :", error);
      return NextResponse.json({ error: "Envoi impossible." }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact] Échec de l'envoi :", err);
    return NextResponse.json({ error: "Envoi impossible." }, { status: 500 });
  }
}
