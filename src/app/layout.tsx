import type { Metadata } from "next";
import { montserrat, werkNeue } from "@/lib/fonts";
import { SITE_URL } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "BEEW", template: "%s" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr-BE" className={`${werkNeue.variable} ${montserrat.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
