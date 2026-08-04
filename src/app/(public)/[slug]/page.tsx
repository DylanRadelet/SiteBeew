import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Cases, Coverage, Faq, LocalContext, NearbyCities, Services, Testimonials } from "@/components/home";
import { ProvinceView } from "@/components/region/ProvinceView";
import { PageHero } from "@/components/ui/PageHero";
import { RememberCity } from "@/components/geo/RememberCity";
import { JsonLd } from "@/components/seo/JsonLd";
import { getAllCities, getCityBySlug, getHome, getNearbyCities } from "@/lib/cities";
import { getProvinceZoneBySlug, getProvinceZones, getZoneOfCity, zoneMetadata } from "@/lib/regions";
import { cityJsonLd, cityMetadata } from "@/lib/seo";

/**
 * UNE route pour toutes les villes ET toutes les provinces. Ajouter l'une ou
 * l'autre = ajouter un JSON dans src/content/cities/ ou src/content/regions/ —
 * aucun code à écrire, aucun dossier à créer.
 *
 * Les deux étages partagent la même route parce qu'ils partagent le même
 * espace d'URL : `/creation-site-internet-arlon` et `/province-de-luxembourg`
 * sont tous deux des segments racine. Next.js n'autorise qu'un seul segment
 * dynamique par niveau — c'est donc ici que l'aiguillage se fait.
 * `/wallonie`, racine de la pyramide, garde sa propre route.
 */

// SSG intégral : toutes les pages sont générées au build, aucune n'est rendue
// à la demande. Une URL inconnue renvoie un vrai 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return [
    ...getProvinceZones().map((z) => ({ slug: z.slug })),
    ...getAllCities().map((c) => ({ slug: c.slug })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const zone = getProvinceZoneBySlug(slug);
  if (zone) return zoneMetadata(zone);

  const city = getCityBySlug(slug);
  return city ? cityMetadata(city) : {};
}

export default async function ZoneOuVillePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const zone = getProvinceZoneBySlug(slug);
  if (zone) return <ProvinceView zone={zone} />;

  const city = getCityBySlug(slug);
  if (!city) notFound();

  // Les services sont mutualisés avec la home sauf si la ville en définit
  // les siens : inutile de dupliquer un contenu identique dans chaque JSON.
  const services = city.services ?? getHome().services;
  const nearby = getNearbyCities(city);

  // La province parente vient du contenu, jamais d'une valeur écrite en dur :
  // une ville hennuyère ne doit pas remonter vers la province de Luxembourg.
  const province = getZoneOfCity(city);

  // UNE seule définition du fil : le fil visible et le `BreadcrumbList` JSON-LD
  // doivent décrire le même chemin, sinon le balisage contredit la page.
  const fil = [
    { href: "/", label: "Accueil" },
    { href: "/wallonie", label: "Wallonie" },
    ...(province ? [{ href: `/${province.slug}`, label: province.name }] : []),
    { href: `/${city.slug}`, label: city.city },
  ];

  return (
    <>
      <JsonLd data={cityJsonLd(city, fil)} />
      <RememberCity slug={city.slug} />

      {/* Même hero que toutes les pages internes. Le fil d'Ariane suit la
          pyramide locale : Accueil → Wallonie → province → commune. */}
      <PageHero
        fil={fil}
        surtitre={city.city}
        h1={city.hero.h1}
        intro={city.hero.subtitle}
        badges={city.hero.badges}
        // Photo de la commune quand nous en avons une sous licence claire ;
        // sinon le visuel générique des zones. Jamais la photo d'ailleurs.
        image={city.heroImage ?? { src: "/images/heros/zones.jpg" }}
      />
      <LocalContext
        heading={city.localContext.heading}
        body={city.localContext.body}
        highlights={city.localContext.highlights}
      />
      <Services services={services} />
      {city.cases.length > 0 && (
        <Cases cases={city.cases} heading={`Nos réalisations autour de ${city.city}`} />
      )}
      {city.testimonials.length > 0 && <Testimonials testimonials={city.testimonials} />}
      <Faq faq={city.faq} />
      <NearbyCities
        cities={nearby.map((c) => ({ slug: c.slug, city: c.city, image: c.heroImage }))}
      />
      <Coverage city={city.city} communes={city.coverage} />
    </>
  );
}
