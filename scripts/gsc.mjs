/**
 * Lecture de l'API Google Search Console.
 *
 * Aucune dépendance npm : le jeton OAuth est un JWT signé en RS256 avec le
 * module `crypto` de Node. Ajouter `googleapis` pour ça représenterait une
 * centaine de mégaoctets de dépendances pour deux appels HTTP.
 *
 * La clé de service vit dans secrets/, ignoré par git. Elle donne un accès
 * EN LECTURE SEULE (« accès limité » côté Search Console) aux données de
 * performance de beew.agency.
 *
 *   node scripts/gsc.mjs <dimension> [jours] [options]
 *
 *   dimension : query | page | country | device | date | page,query
 *   jours     : fenêtre glissante, 90 par défaut
 *   --pays=BEL        filtre sur un pays (code ISO-3166-1 alpha-3)
 *   --page=/chemin    filtre sur une page
 *   --limit=n         nombre de lignes, 25 par défaut
 */
import { createSign } from "node:crypto";
import { readFileSync } from "node:fs";

const SITE = "sc-domain:beew.agency";
const CLE = JSON.parse(readFileSync("secrets/gsc-service-account.json", "utf8"));

const b64 = (o) => Buffer.from(typeof o === "string" ? o : JSON.stringify(o)).toString("base64url");

async function jeton() {
  const maintenant = Math.floor(Date.now() / 1000);
  const entete = b64({ alg: "RS256", typ: "JWT" });
  const charge = b64({
    iss: CLE.client_email,
    scope: "https://www.googleapis.com/auth/webmasters.readonly",
    aud: "https://oauth2.googleapis.com/token",
    exp: maintenant + 3600,
    iat: maintenant,
  });
  const signature = createSign("RSA-SHA256").update(`${entete}.${charge}`).sign(CLE.private_key, "base64url");

  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${entete}.${charge}.${signature}`,
    }),
  });
  const j = await r.json();
  if (!j.access_token) throw new Error("Jeton refusé : " + JSON.stringify(j));
  return j.access_token;
}

export async function requete(corps) {
  const t = await jeton();
  const r = await fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${t}`, "Content-Type": "application/json" },
      body: JSON.stringify(corps),
    },
  );
  const j = await r.json();
  if (j.error) throw new Error(`${j.error.code} ${j.error.message}`);
  return j.rows ?? [];
}

const jour = (decalage) => new Date(Date.now() - decalage * 864e5).toISOString().slice(0, 10);

if (process.argv[1] && process.argv[1].includes("gsc.mjs")) {
  const args = process.argv.slice(2);
  const opt = (n) => (args.find((a) => a.startsWith(`--${n}=`)) ?? "=").split("=")[1];
  const dims = (args[0] ?? "query").split(",");
  const jours = Number(args[1]) || 90;

  const filtres = [];
  if (opt("pays")) filtres.push({ dimension: "country", expression: opt("pays") });
  if (opt("page")) filtres.push({ dimension: "page", expression: `https://www.beew.agency${opt("page")}` });

  const limite = Number(opt("limit")) || 25;
  // L'API renvoie au plus 1000 lignes triées par clics, puis par ordre
  // alphabétique. On en demande beaucoup plus que nécessaire pour pouvoir
  // trier nous-mêmes : sans ça, les pages à fortes impressions et zéro clic —
  // exactement celles qu'on cherche — n'apparaissent jamais.
  const brut = await requete({
    startDate: jour(jours + 2),
    endDate: jour(2),
    dimensions: dims,
    rowLimit: 5000,
    ...(filtres.length && { dimensionFilterGroups: [{ filters: filtres }] }),
  });

  const tri = opt("tri") || "impr";
  const cle = { clics: "clicks", impr: "impressions", pos: "position" }[tri] ?? "impressions";
  brut.sort((a, b) => (tri === "pos" ? a[cle] - b[cle] : b[cle] - a[cle]));
  const lignes = brut.slice(0, limite);

  const total = brut.reduce((a, l) => ({ c: a.c + l.clicks, i: a.i + l.impressions }), { c: 0, i: 0 });
  console.log(`\n${SITE} · ${jours} jours · ${dims.join(" + ")}${filtres.length ? " · filtré" : ""}`);
  console.log(`${brut.length} lignes au total — ${total.c} clics / ${total.i} impressions\n`);
  console.log(["clé".padEnd(52), "clics", " impr.", "  CTR", "  pos."].join(" "));
  for (const l of lignes) {
    const cle = l.keys.join(" | ").replace("https://www.beew.agency", "").slice(0, 52);
    console.log(
      [
        cle.padEnd(52),
        String(l.clicks).padStart(5),
        String(l.impressions).padStart(6),
        (l.ctr * 100).toFixed(1).padStart(5) + "%",
        l.position.toFixed(1).padStart(6),
      ].join(" "),
    );
  }
}
