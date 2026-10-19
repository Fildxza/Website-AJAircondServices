import {
  BUSINESS_NAME,
  brandAssets,
  coveredAreas,
  seo,
  services,
  siteUrl,
  ssmRegistration,
} from "@/content/site";

/**
 * Builds an absolute URL from the verified production origin. Returns null while no domain
 * is confirmed, so callers omit the tag instead of emitting a wrong or placeholder URL.
 */
export function absoluteUrl(path: string, base: string | null = siteUrl): string | null {
  return base ? `${base}${path}` : null;
}

/**
 * schema.org LocalBusiness (HVACBusiness) data built only from verified company details.
 * Deliberately NOT included: street address, coordinates, opening hours, ratings, reviews,
 * service radius, neighbourhoods, founding date, price range, email, social profiles, and phone
 * numbers (they appear only in the page's Contact section).
 */
export function buildLocalBusinessJsonLd(base: string | null = siteUrl) {
  const url = absoluteUrl("/", base);
  const logo = absoluteUrl(brandAssets.logo.path, base);
  return {
    "@context": "https://schema.org",
    "@type": "HVACBusiness",
    ...(url ? { "@id": `${url}#business`, url } : {}),
    name: BUSINESS_NAME,
    description: seo.businessDescription,
    ...(logo ? { logo } : {}),
    areaServed: coveredAreas.map((name) => ({ "@type": "AdministrativeArea", name })),
    identifier: {
      "@type": "PropertyValue",
      propertyID: "SSM registration number",
      value: ssmRegistration,
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Air-conditioning services",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.title },
      })),
    },
  };
}

/** JSON for an inline <script type="application/ld+json">; "<" is escaped so it can never close the tag. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/** Head tags for the home page. Tags that need an absolute URL appear only once siteUrl is set. */
export function buildPageHead(base: string | null = siteUrl) {
  const canonical = absoluteUrl("/", base);
  const image = absoluteUrl(brandAssets.logo.path, base);
  const imageAlt = `${BUSINESS_NAME} logo`;

  const meta = [
    { title: seo.title },
    { name: "description", content: seo.description },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: BUSINESS_NAME },
    { property: "og:locale", content: seo.locale },
    { property: "og:title", content: seo.title },
    { property: "og:description", content: seo.description },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: seo.title },
    { name: "twitter:description", content: seo.description },
    ...(canonical ? [{ property: "og:url", content: canonical }] : []),
    ...(image
      ? [
          { property: "og:image", content: image },
          { property: "og:image:width", content: String(brandAssets.logo.width) },
          { property: "og:image:height", content: String(brandAssets.logo.height) },
          { property: "og:image:alt", content: imageAlt },
          { name: "twitter:image", content: image },
          { name: "twitter:image:alt", content: imageAlt },
        ]
      : []),
  ];

  const links = canonical ? [{ rel: "canonical", href: canonical }] : [];

  const scripts = [
    {
      type: "application/ld+json",
      children: serializeJsonLd(buildLocalBusinessJsonLd(base)),
    },
  ];

  return { meta, links, scripts };
}
