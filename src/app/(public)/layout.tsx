import { FooterShell } from "@/components/layout/FooterShell";
import { Header } from "@/components/layout/Header";
import { Reveal } from "@/components/ui/Reveal";
import { getPublishedCities } from "@/lib/cities";
import { getProvinceZones } from "@/lib/regions";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const cities = getPublishedCities().map((c) => ({ slug: c.slug, city: c.city }));
  const provinces = getProvinceZones().map((z) => ({ slug: z.slug, name: z.name }));

  return (
    <>
      {/* Un seul observateur pour toutes les apparitions au défilement du site. */}
      <Reveal />
      <Header />
      {/*
        Ni `relative` ni `z-index` ici, volontairement : un z-index négatif
        sortait `<main>` du hit-testing — la souris n'atteignait plus le hero et
        l'effet de pixels ne recevait plus rien.
      */}
      <main className="grain">{children}</main>
      <FooterShell provinces={provinces} />
    </>
  );
}
