import { copy, type Lang } from "./copy";
import { contacts, coveredAreas, pricing, unitTypes, whatsAppLink } from "./site";

// ---------------------------------------------------------------------------------------------
// Booking request. A WhatsApp-assisted request, NOT a confirmed appointment: the customer fills in
// the details, reviews the exact message, picks Amirul or Admin and presses Send inside WhatsApp.
// Nothing is sent, stored or tracked by this site, and no total is calculated.
// ---------------------------------------------------------------------------------------------

export const BOOKING_MAX_UNITS = 20;
export const BOOKING_MAX_NOTES = 300;

/** Index into `unitTypes` / `pricing` (same order). */
export const unitIds = ["wall", "cassette", "exposed"] as const;
export type UnitId = (typeof unitIds)[number];

/** Order follows the owner's brief. "install" is an enquiry only: no price, scope or service card. */
export const serviceIds = [
  "general",
  "chemical",
  "repair",
  "gas",
  "preventive",
  "install",
] as const;
export type ServiceId = (typeof serviceIds)[number];

export const areaIds = coveredAreas;
export type AreaId = (typeof coveredAreas)[number];

export type ContactId = "amirul" | "admin";

export const symptomIds = ["cooling", "airflow", "leak", "noise", "smell", "power"] as const;
export type SymptomId = (typeof symptomIds)[number];

export type BookingDraft = {
  unit: UnitId | null;
  quantity: number;
  service: ServiceId | null;
  area: AreaId | null;
  notes: string;
};

export const emptyDraft: BookingDraft = {
  unit: null,
  quantity: 1,
  service: null,
  area: null,
  notes: "",
};

export function unitName(id: UnitId): string {
  return unitTypes[unitIds.indexOf(id)]?.name ?? id;
}

/** Listed price per unit type (RM). Never multiplied: no total is shown. */
export function unitPrice(id: UnitId): number | undefined {
  return pricing[unitIds.indexOf(id)]?.price;
}

export function clampQuantity(value: number): number {
  const whole = Math.floor(value);
  return Number.isFinite(whole) ? Math.min(BOOKING_MAX_UNITS, Math.max(1, whole)) : 1;
}

export type BookingErrors = Partial<Record<"unit" | "service" | "area", true>>;

/** Unit type, service and area are required. Quantity is always valid (clamped); notes are optional. */
export function validateBooking(draft: BookingDraft): BookingErrors {
  const errors: BookingErrors = {};
  if (!draft.unit) errors.unit = true;
  if (!draft.service) errors.service = true;
  if (!draft.area) errors.area = true;
  return errors;
}

/** Collapses stray whitespace and caps the length. Notes stay on one line each. */
export function cleanNotes(raw: string): string {
  return raw
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join(" / ")
    .slice(0, BOOKING_MAX_NOTES);
}

/** The exact message shown to the customer and put into the wa.me link. Language follows the page. */
export function buildBookingMessage(lang: Lang, draft: BookingDraft): string {
  const t = copy[lang].form;
  const install = draft.service === "install";
  const lines: string[] = [install ? t.msg.greetInstall : t.msg.greet, ""];
  if (draft.service) lines.push(`${t.msg.service}: ${t.serviceLabels[draft.service]}`);
  if (draft.unit) lines.push(`${t.msg.unit}: ${unitName(draft.unit)}`);
  lines.push(`${t.msg.quantity}: ${clampQuantity(draft.quantity)}`);
  if (draft.area) lines.push(`${t.msg.area}: ${draft.area}`);
  const notes = cleanNotes(draft.notes);
  if (notes) lines.push(`${t.msg.notes}: ${notes}`);
  lines.push("", install ? t.msg.closingInstall : t.msg.closing);
  return lines.join("\n");
}

export function bookingLink(contact: ContactId, message: string): string {
  return whatsAppLink(contacts[contact].wa, message);
}

/** Plain greeting link used by the Contact cards. */
export function contactLink(contact: ContactId, lang: Lang): string {
  return whatsAppLink(contacts[contact].wa, copy[lang].contact.greeting);
}

/** The floating assistant links to the bare number: no text, nothing prefilled. */
export function chatLink(contact: ContactId): string {
  return contacts[contact].wa;
}
