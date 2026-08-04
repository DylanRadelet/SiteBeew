import { HeaderShell } from "@/components/layout/HeaderShell";
import { getPublishedCities } from "@/lib/cities";
import { getProvinceZones } from "@/lib/regions";

/** Charge villes et provinces côté serveur (accès disque) et délègue le rendu au shell client. */
export function Header() {
  const cities = getPublishedCities().map((c) => ({ slug: c.slug, city: c.city }));
  const provinces = getProvinceZones().map((z) => ({ slug: z.slug, name: z.name }));
  return <HeaderShell cities={cities} provinces={provinces} />;
}
