import {
  faqs,
  galleryItems,
  processSteps,
  serviceArea,
  serviceMap,
  services,
  ssmRegistration,
  unitTypes,
} from "./site";

/** Widens a literal type (site.ts uses `as const`) to plain `string`, so the Malay copy can match the shape. */
const s = (value: string): string => value;

/**
 * English copy. Where the text already lives in `site.ts` (services, FAQ, gallery captions, process),
 * it is read from there so there is one source of truth; Bahasa Melayu lives in `copy.ms.ts` and must
 * keep exactly the same shape (a test checks this). Facts that are not text (prices, numbers, photos,
 * coverage names) stay in `site.ts` and are shared by both languages.
 */
export const en = {
  htmlLang: "en-MY",
  langName: "English",
  a11y: {
    skip: "Skip to content",
    mainNav: "Main",
    home: "AJ Airconditioning Services, back to top",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    language: "Language",
    languageGroup: "Choose language",
    opensWhatsApp: "(opens WhatsApp in a new tab)",
    opensNewTab: "(opens in a new tab)",
  },
  nav: ["Home", "Services", "Pricing", "Unit Types", "Gallery", "FAQ", "Contact"],
  cta: {
    bookNow: "Book Now",
    viewServices: "View Services",
    whatsappName: "WhatsApp {name}",
    call: "Call",
  },
  hero: {
    eyebrow: "Aircond service · Kuala Lumpur & Selangor",
    titleA: "Cold air,",
    titleB: "done right.",
    body: "Servicing, chemical cleaning, gas top-up and repair for wall mounted, ceiling cassette and ceiling exposed units in Kuala Lumpur and Selangor. Clear pricing by unit type — not by horsepower.",
    startingFrom: "Starting from",
    startingNote: "Wall mounted chemical cleaning",
    facts: [
      { title: s(serviceArea), note: "Service coverage" },
      { title: "Homes & business premises", note: "Residential and commercial" },
      { title: "SSM registered", note: s(ssmRegistration) },
    ],
  },
  services: {
    eyebrow: "Services",
    title: "What we do",
    intro:
      "Servicing, cleaning, gas and repair for homes and business premises in Kuala Lumpur and Selangor.",
    items: services.map((x) => ({ title: s(x.title), body: s(x.body), points: x.points.map(s) })),
  },
  problems: {
    title: "Having a problem with your aircond?",
    intro: "Tap what you are noticing and we will fill in the booking form for you.",
    items: {
      cooling: { label: "Weak cooling", note: "My aircond is not cooling well." },
      airflow: { label: "Weak airflow", note: "My aircond has weak airflow." },
      leak: { label: "Water leaking", note: "My aircond is leaking water." },
      noise: { label: "Unusual noise", note: "My aircond is making an unusual noise." },
      smell: { label: "Bad smell", note: "My aircond has a bad smell." },
      power: { label: "Won't switch on", note: "My aircond will not switch on." },
    },
  },
  pricing: {
    eyebrow: "Pricing",
    title: "Priced by unit type",
    lead: "Not based on horsepower.",
    rest: "One clear price per unit, whatever the HP.",
    perUnit: "per unit · any HP",
    mostCommon: "Most common",
    choose: "Choose this unit",
  },
  units: {
    eyebrow: "Unit types",
    title: "Air-conditioner types we service",
    intro: "For homes, offices and other business premises.",
    notes: unitTypes.map((u) => u.note),
    alts: unitTypes.map((u) => u.photo?.alt ?? u.name),
  },
  gallery: {
    eyebrow: "Work gallery",
    title: "Our work",
    intro: "Photos from real AJ jobs. Tap a photo to see it larger.",
    viewLarger: "View larger: {label}",
    previous: "Previous photo",
    next: "Next photo",
    labels: galleryItems.map((g) => g.label),
    alts: galleryItems.map((g) => g.alt),
  },
  process: {
    eyebrow: "How it works",
    title: "Simple from booking to cooling",
    intro:
      "We inspect your unit, explain what is needed, then service it and test the cooling with you before you pay.",
    steps: processSteps.map((x) => ({ title: s(x.title), body: s(x.body) })),
  },
  reviews: {
    eyebrow: "Reviews",
    title: "What customers say on Google",
    intro:
      "Real reviews copied from AJ's Google listing on {date}. They are shown as written, in the customer's own words. This is a snapshot and does not update automatically.",
    stars: "5 out of 5 stars",
    localGuide: "Google Local Guide",
    shortened: "Shortened here. Read the full review on Google.",
    source: "Source: Google reviews",
    viewAll: "See all reviews on Google",
    dateLabel: "20 Oct 2026",
  },
  area: {
    eyebrow: "Service area",
    title: "Kuala Lumpur & Selangor",
    intro: "We currently serve Kuala Lumpur and Selangor only.",
    note: "Coverage is by general area. We can't guarantee every neighbourhood, so please check with us before booking.",
    ctaLead: "Not sure if we cover your area?",
    ctaTail: "Ask us before you book.",
    ctaBody: "Tell us your area and we'll let you know if we can help.",
    ctaButton: "Ask about my area",
    ctaNote: "Please confirm whether you cover my area: ",
    mapHeading: "Map of Kuala Lumpur & Selangor",
    loadMap: "Load map",
    mapPrivacy:
      "Loads Google Maps. Google may set cookies and collect data under its own privacy policy. Nothing loads until you choose to.",
    mapCaption:
      "General map view of Kuala Lumpur and Selangor. It does not show a shop or office location.",
    openMap: "Open in Google Maps",
    mapTitle: s(serviceMap.title),
  },
  faq: {
    eyebrow: "FAQ",
    title: "Common questions",
    items: faqs.map((f) => ({ q: s(f.q), a: s(f.a) })),
  },
  contact: {
    eyebrow: "Contact",
    title: "Book your service today",
    intro: "WhatsApp us your unit type, number of units and location.",
    amirul: "Amirul",
    admin: "Admin",
    greeting: "Hi AJ Airconditioning, I would like to book an aircond service.",
  },
  form: {
    title: "Booking request",
    intro:
      "Fill in the details, check the message, then send it on WhatsApp. This is a request, not a confirmed appointment. AJ will confirm a slot with you.",
    required: "Required",
    optional: "Optional",
    unit: "Unit type",
    quantity: "Number of units",
    quantityLess: "Fewer units",
    quantityMore: "More units",
    service: "Service required",
    area: "Location / area",
    areaHelp: "Add your town or neighbourhood in the notes.",
    notes: "Additional notes",
    notesPlaceholder: "e.g. your town or neighbourhood, preferred day",
    notesCount: "{n} / {max}",
    serviceLabels: {
      general: "General Servicing",
      chemical: "Chemical Cleaning",
      repair: "Repair & troubleshooting",
      gas: "Refrigerant gas services",
      preventive: "Preventive Maintenance",
      install: "Installation (enquiry)",
    },
    priceNote:
      "Listed price for {unit}: RM{price} per unit (by unit type, not by HP). AJ will confirm what your unit needs.",
    installNote: "Installation details are confirmed with AJ on WhatsApp.",
    errors: {
      summary: "Please complete the highlighted fields.",
      unit: "Please choose a unit type.",
      service: "Please choose a service.",
      area: "Please choose your area.",
    },
    review: "Check my request",
    reviewTitle: "Your request is ready",
    reviewIntro:
      "Nothing has been sent yet. Choose who to message, then press Send inside WhatsApp. AJ will confirm the slot with you.",
    messageLabel: "Your message",
    sendVia: "Send to",
    edit: "Edit details",
    startOver: "Start over",
    stepDetails: "Details",
    stepCheck: "Check",
    stepSend: "Send",
    msg: {
      greet: "Hi AJ Airconditioning, I would like to request an aircond service booking.",
      greetInstall: "Hi AJ Airconditioning, I would like to enquire about aircond installation.",
      service: "Service",
      unit: "Unit type",
      quantity: "Number of units",
      area: "Location",
      notes: "Notes",
      closing: "Please confirm the slot. Thank you.",
      closingInstall: "Please let me know the details. Thank you.",
    },
  },
  floating: {
    open: "Chat with AJ on WhatsApp",
    welcome: "Need help? Chat with us",
    title: "Chat with AJ on WhatsApp",
    body: "Choose who you would like to message. WhatsApp opens in a new tab and nothing is sent until you press Send.",
    close: "Close chat options",
  },
  footer: {
    tagline:
      "Servicing, chemical cleaning, gas top-up, repair and preventive maintenance in Kuala Lumpur and Selangor. Priced by unit type, not horsepower.",
    pricing: "Pricing",
    contact: "Contact",
    contactNote: "Phone and WhatsApp details are in the Contact section.",
    contactLink: "Go to Contact",
    area: "Service area: {area}",
    ssm: "SSM Reg. No. {no}",
    credits: "Photo credits",
  },
  credits: {
    title: "Photo credits",
    intro: "Most photos on this site are AJ's own. These two are used under open licences.",
    by: "by",
    via: "via",
    items: [
      {
        use: "Ceiling Exposed photo",
        changes:
          "Cropped, resized and brightened; this adapted image is shared under the same licence.",
      },
      { use: "Wall Mounted photo", changes: "Cropped and resized." },
    ],
  },
};

export type Copy = typeof en;
