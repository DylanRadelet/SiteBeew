import { ImageResponse } from "next/og";

/**
 * Favicon généré au build — le site n'en avait aucun, et l'onglet affichait
 * l'icône par défaut du navigateur.
 *
 * Généré plutôt que fourni en fichier : les logos de `public/logo` sont des
 * lettrages horizontaux, illisibles une fois réduits à 32 pixels. Un monogramme
 * dessiné pour cette taille reste identifiable dans une barre d'onglets chargée.
 */

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1d1f23",
          color: "#ed6945",
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: "-0.05em",
        }}
      >
        B
      </div>
    ),
    size,
  );
}
