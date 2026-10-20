// Central business content. Edit here to update copy, prices and contacts site-wide.
export const BUSINESS_NAME = "AJ Airconditioning Services";

export const contacts = {
  amirul: {
    label: "Amirul",
    phone: "018-283 3900",
    tel: "+60182833900",
    wa: "https://wa.me/60182833900",
  },
  admin: {
    label: "Admin",
    phone: "018-262 1417",
    tel: "+60182621417",
    wa: "https://wa.me/60182621417",
  },
} as const;

/** Builds a wa.me link with a prefilled (not auto-sent) message. */
export function whatsAppLink(base: string, message?: string) {
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/**
 * Map for the Service Area section: a neutral Google Maps view (no search query, so no
 * marker, place card or boundary). The centre point is only a viewport over Kuala Lumpur and
 * Selangor — it is NOT a business location. Standard embed: no API key, no billing.
 */
export const serviceMap = {
  embedUrl: "https://maps.google.com/maps?ll=3.30,101.55&z=9&output=embed",
  openUrl: "https://www.google.com/maps/@3.30,101.55,9z",
  title: "Google Map: general view of Kuala Lumpur and Selangor",
} as const;

/** In-page anchors for the header. Labels come from the active language (copy.nav, same order). */
export const navLinks = [
  { href: "#top" },
  { href: "#services" },
  { href: "#pricing" },
  { href: "#units" },
  { href: "#gallery" },
  { href: "#faq" },
  { href: "#contact" },
] as const;

export const services = [
  {
    code: "01",
    title: "Chemical Cleaning",
    body: "Deep cleaning of the indoor unit's coil, blower and drain to remove built-up dirt, odour and blockages.",
    points: ["Coil & blower wash", "Drain tray flush", "Filter cleaning"],
  },
  {
    code: "02",
    title: "Gas Top-Up",
    body: "Pressure check and refrigerant top-up when your unit is running but not cooling the way it should.",
    points: ["Pressure reading", "Refrigerant top-up", "Cooling test"],
  },
  {
    code: "03",
    title: "Repair",
    body: "Troubleshooting for common faults such as water leaking, noise, no cooling or the unit not switching on.",
    points: ["Fault diagnosis", "Clear explanation", "Quote before work"],
  },
  {
    code: "04",
    title: "General Servicing",
    body: "Routine servicing of indoor and outdoor units, with filter and coil cleaning, drain inspection and a cooling-performance check.",
    points: ["Indoor & outdoor cleaning", "Filter & coil cleaning", "Drain inspection"],
  },
  {
    code: "05",
    title: "Preventive Maintenance",
    body: "Routine maintenance and system inspection, with service recommendations to help keep your aircond performing.",
    points: ["System inspection", "Drainage checks", "Service recommendations"],
  },
] as const;

/** Confirmed general coverage (company profile). No neighbourhoods are claimed until the owner verifies them. */
export const serviceArea = "Kuala Lumpur & Selangor";
/** SSM registration number as printed in the company profile. */
export const ssmRegistration = "003889227-D";

/** Confirmed general coverage, one entry per area. Used by the Service Area section and structured data. */
export const coveredAreas = ["Kuala Lumpur", "Selangor"] as const;

/**
 * Production origin, e.g. "https://www.example.com" (https, no trailing slash, no path).
 *
 * Set to the verified live Netlify address (opened and checked 2026-10-20). Change it to the custom
 * domain if one is bought later. While this is null the site
 * omits everything that needs an absolute URL: canonical link, og:url, og:image and the
 * url/logo fields of the structured data. Set it once, only to the verified live domain
 * (never localhost or a preview URL). See the SEO notes in the Phase D report.
 */
export const siteUrl: string | null = "https://ajaircondservices.netlify.app";

/**
 * Approved brand asset: the owner's new logo (supplied 720x1280 JPEG), lossless margin crop.
 * Raster, so swap in the designer's vector file when it is available. Never redraw or recolour it.
 */
export const brandAssets = {
  logo: {
    /** Full-resolution crop: for sharing (og:image), the Business Profile and print. */
    path: "/brand/aj-logo.png",
    width: 654,
    height: 544,
    /** Same proportions, downscaled for the header and footer (about a third of the weight). */
    webPath: "/brand/aj-logo-web.png",
    webWidth: 327,
    webHeight: 272,
  },
} as const;

/** Search/social copy. Title is kept near 60 characters; description under 160. */
export const seo = {
  title: "Aircond Servicing in KL & Selangor | AJ Airconditioning Services",
  description:
    "Aircond servicing, chemical cleaning, gas top-up and repair for homes and businesses in Kuala Lumpur and Selangor. Priced by unit type. Book on WhatsApp.",
  /** Description used in structured data; every item comes from the company profile. */
  businessDescription:
    "Air-conditioning servicing, chemical cleaning, refrigerant gas services, troubleshooting, repair and preventive maintenance for residential, commercial and business premises in Kuala Lumpur and Selangor.",
  locale: "en_MY",
} as const;

export const pricing = [
  { unit: "Wall Mounted", price: 130 },
  { unit: "Ceiling Cassette", price: 230 },
  { unit: "Ceiling Exposed", price: 230 },
] as const;

export type UnitPhoto = {
  src: string;
  /** Responsive candidates, e.g. "/units/a-640.jpg 640w, /units/a-960.jpg 960w". */
  srcSet: string;
  /** Intrinsic size of `src` (reserves space so the page does not shift while it loads). */
  width: number;
  height: number;
  alt: string;
  /**
   * "aj"    = owner-supplied photo of a real AJ job.
   * "stock" = licensed illustrative photo. It is NOT an AJ job and is labelled as such on the page.
   */
  source: "aj" | "stock";
};

export type UnitType = { name: string; note: string; photo?: UnitPhoto };

/**
 * A unit without `photo` falls back to its line illustration. Wall Mounted and Ceiling Exposed
 * use licensed photos (see `photoCredits` and docs/image-credits.md); the owner's own photo of a
 * real Ceiling Exposed unit would be the best replacement when one is available.
 */
export const unitTypes: readonly UnitType[] = [
  {
    name: "Wall Mounted",
    note: "The most common split unit in homes and offices.",
    photo: {
      src: "/units/wall-mounted-640.jpg",
      srcSet: "/units/wall-mounted-640.jpg 640w, /units/wall-mounted-960.jpg 960w",
      width: 640,
      height: 480,
      alt: "White wall-mounted split air conditioner indoor unit fitted high on a wall",
      source: "stock",
    },
  },
  {
    name: "Ceiling Cassette",
    note: "Recessed into the ceiling with four-way airflow.",
    photo: {
      src: "/units/ceiling-cassette-640.jpg",
      srcSet: "/units/ceiling-cassette-640.jpg 640w, /units/ceiling-cassette-810.jpg 810w",
      width: 640,
      height: 480,
      alt: "Ceiling cassette air conditioner fitted in the ceiling of a commercial space while an AJ technician removes its filter panel",
      source: "aj",
    },
  },
  {
    name: "Ceiling Exposed",
    note: "Ceiling-hung unit for larger open spaces.",
    photo: {
      src: "/units/ceiling-exposed-640.jpg",
      srcSet: "/units/ceiling-exposed-640.jpg 640w, /units/ceiling-exposed-960.jpg 960w",
      width: 640,
      height: 480,
      alt: "White exposed air conditioner unit mounted at ceiling level under a suspended ceiling",
      source: "stock",
    },
  },
];

/**
 * Credits for photos that are not AJ's own. They are shown in the footer's "Photo credits"
 * dialog, not on the cards. The Wikimedia photo is CC BY-SA 4.0, which REQUIRES credit, a
 * licence link and a note that it was changed. Do not remove it while that photo is in use.
 */
export const photoCredits = [
  {
    use: "Ceiling Exposed photo",
    title: "Condizionatore a soffitto 3",
    author: "Nuorese 95",
    via: "Wikimedia Commons",
    licence: "CC BY-SA 4.0",
    changes:
      "Cropped, resized and brightened; this adapted image is shared under the same licence.",
    href: "https://commons.wikimedia.org/wiki/File:Condizionatore_a_soffitto_3.jpg",
    licenceHref: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  {
    use: "Wall Mounted photo",
    title: "Wall-mounted air conditioner in modern interior",
    author: "NEOSiAM 18+",
    via: "Pexels",
    licence: "Pexels licence (credit not required)",
    changes: "Cropped and resized.",
    href: "https://www.pexels.com/photo/wall-mounted-air-conditioner-in-modern-interior-38788452/",
    licenceHref: "https://www.pexels.com/license/",
  },
] as const;

export const processSteps = [
  { title: "WhatsApp us", body: "Tell us your unit type, quantity and location." },
  { title: "Confirm slot", body: "We agree on a date and time that suits you." },
  { title: "On-site service", body: "Our technician inspects and services your unit." },
  { title: "Check & pay", body: "We test the cooling with you before you pay." },
] as const;

export const faqs = [
  {
    q: "Is the price based on horsepower (HP)?",
    a: "No. Our prices are based on the unit type — Wall Mounted, Ceiling Cassette or Ceiling Exposed — not on horsepower.",
  },
  {
    q: "What does chemical cleaning include?",
    a: "A deep wash of the indoor unit's coil, blower and drain to remove dirt, odour and blockages that a normal clean can't reach.",
  },
  {
    q: "My aircond is not cold. Do I need a gas top-up?",
    a: "Not always. Weak cooling can come from dirt, blockages or low refrigerant. We check first and explain what's needed before any work.",
  },
  {
    q: "How do I book?",
    a: "Send us a WhatsApp message with your unit type, number of units and location, and we'll confirm a slot with you.",
  },
  {
    q: "Which areas do you cover?",
    a: "We serve Kuala Lumpur and Selangor. Not sure if your location is covered? Send us a WhatsApp message and we'll let you know.",
  },
  {
    q: "Do you service homes and business premises?",
    a: "Yes. We serve residential, commercial and business premises in Kuala Lumpur and Selangor.",
  },
  {
    q: "Do you offer preventive maintenance?",
    a: "Yes. Preventive maintenance covers routine maintenance, system inspection, drainage checks and service recommendations to help maintain system performance.",
  },
  {
    q: "Do you install air conditioners?",
    a: "Yes. As well as servicing, chemical cleaning, maintenance, refrigerant gas services, troubleshooting and repair, we also install air conditioners. Send us a WhatsApp message with your unit type and location to ask about installation.",
  },
] as const;

export type GalleryItem = {
  /** Short caption shown on the tile and in the lightbox. Describes only what is visible. */
  label: string;
  /** Literal description for screen readers. */
  alt: string;
  /** Full-size image (lightbox). Files live in public/gallery/. */
  src: string;
  /** Smaller image for the grid tile. */
  thumb: string;
  width: number;
  height: number;
  thumbWidth: number;
  thumbHeight: number;
  /** CSS object-position that keeps the subject in frame when the grid tile crops the photo. */
  position: string;
};

/**
 * Genuine AJ job photos supplied by the owner. All metadata (EXIF/GPS) is stripped.
 * Several show staff faces, customers' premises or third-party equipment brands (Acson, Sharp)
 * and a shop's artwork. The owner supplied them for the site; keep confirming consent and remove
 * an entry here if anyone objects.
 */
export const galleryItems: readonly GalleryItem[] = [
  {
    label: "Ceiling cassette servicing",
    alt: "Technician removing the filter panel of a ceiling cassette air conditioner during servicing",
    src: "/gallery/cassette-filter-service.jpg",
    thumb: "/gallery/cassette-filter-service-thumb.jpg",
    width: 810,
    height: 1080,
    thumbWidth: 640,
    thumbHeight: 853,
    position: "50% 45%",
  },
  {
    label: "Ceiling cassette inspection",
    alt: "Technician using a cordless drill to open the panel of a ceiling cassette unit",
    src: "/gallery/cassette-panel-drill.jpg",
    thumb: "/gallery/cassette-panel-drill-thumb.jpg",
    width: 810,
    height: 1080,
    thumbWidth: 640,
    thumbHeight: 853,
    position: "50% 25%",
  },
  {
    label: "Wall unit cleaning",
    alt: "Technician cleaning a wall mounted aircond with a protective cover and water-catch bag",
    src: "/gallery/wall-unit-cleaning-cover.jpg",
    thumb: "/gallery/wall-unit-cleaning-cover-thumb.jpg",
    width: 1080,
    height: 812,
    thumbWidth: 800,
    thumbHeight: 601,
    position: "30% 50%",
  },
  {
    label: "Outdoor unit servicing",
    alt: "Technician on a ladder working on outdoor aircond units mounted on a building wall",
    src: "/gallery/outdoor-units-ladder.jpg",
    thumb: "/gallery/outdoor-units-ladder-thumb.jpg",
    width: 960,
    height: 1280,
    thumbWidth: 640,
    thumbHeight: 853,
    position: "50% 40%",
  },
  {
    label: "Wall unit wash",
    alt: "Technician wearing a headlamp washing a wall mounted unit under a protective sheet with a drain hose",
    src: "/gallery/wall-unit-wash-headlamp.jpg",
    thumb: "/gallery/wall-unit-wash-headlamp-thumb.jpg",
    width: 810,
    height: 1080,
    thumbWidth: 640,
    thumbHeight: 853,
    position: "60% 30%",
  },
  {
    label: "Wall unit rinse",
    alt: "Technician rinsing a wall mounted aircond with a spray gun over a protective cover",
    src: "/gallery/wall-unit-rinse.jpg",
    thumb: "/gallery/wall-unit-rinse-thumb.jpg",
    width: 930,
    height: 1280,
    thumbWidth: 640,
    thumbHeight: 881,
    position: "50% 35%",
  },
  {
    label: "Outdoor unit check",
    alt: "Technician checking an outdoor aircond unit mounted on a window ledge",
    src: "/gallery/outdoor-unit-check.jpg",
    thumb: "/gallery/outdoor-unit-check-thumb.jpg",
    width: 1280,
    height: 963,
    thumbWidth: 800,
    thumbHeight: 602,
    position: "65% 50%",
  },
  {
    label: "Wall unit service in a commercial space",
    alt: "Technician servicing a wall mounted aircond high on the wall inside a commercial space",
    src: "/gallery/wall-unit-service-commercial.jpg",
    thumb: "/gallery/wall-unit-service-commercial-thumb.jpg",
    width: 960,
    height: 1280,
    thumbWidth: 640,
    thumbHeight: 853,
    position: "45% 45%",
  },
  {
    label: "Handling an outdoor unit",
    alt: "Two technicians handling an outdoor aircond unit inside an apartment",
    src: "/gallery/outdoor-unit-apartment.jpg",
    thumb: "/gallery/outdoor-unit-apartment-thumb.jpg",
    width: 810,
    height: 1080,
    thumbWidth: 640,
    thumbHeight: 853,
    position: "50% 55%",
  },
];
