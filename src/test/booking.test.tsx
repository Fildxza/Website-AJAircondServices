import { fireEvent, screen, within } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";

import {
  BOOKING_MAX_NOTES,
  BOOKING_MAX_UNITS,
  buildBookingMessage,
  bookingLink,
  chatLink,
  cleanNotes,
  clampQuantity,
  contactLink,
  emptyDraft,
  serviceIds,
  unitIds,
  unitName,
  unitPrice,
  validateBooking,
  type BookingDraft,
} from "@/content/booking";
import { copy } from "@/content/copy";
import { contacts, coveredAreas, pricing, unitTypes } from "@/content/site";
import { BookingForm } from "@/components/site/booking-form";
import { Pricing } from "@/components/site/sections";
import { renderInLanguage, stubIntersectionObserver } from "./page-utils";

beforeAll(stubIntersectionObserver);

const decode = (href: string) => decodeURIComponent(href.split("?text=")[1] ?? "");
const draft = (patch: Partial<BookingDraft> = {}): BookingDraft => ({
  ...emptyDraft,
  unit: "wall",
  service: "chemical",
  area: "Selangor",
  quantity: 2,
  ...patch,
});

describe("booking data", () => {
  it("unit ids line up with unit types and the approved prices", () => {
    expect(unitIds.map(unitName)).toEqual(unitTypes.map((u) => u.name));
    expect(unitIds.map(unitPrice)).toEqual(pricing.map((p) => p.price));
    expect(unitPrice("wall")).toBe(130);
    expect(unitPrice("cassette")).toBe(230);
    expect(unitPrice("exposed")).toBe(230);
  });

  it("offers the five owner-listed services plus an installation enquiry, with labels in both languages", () => {
    expect(serviceIds).toEqual(["general", "chemical", "repair", "gas", "preventive", "install"]);
    for (const lang of ["en", "ms"] as const)
      for (const id of serviceIds) expect(copy[lang].form.serviceLabels[id]).toBeTruthy();
    expect(copy.en.form.serviceLabels.install).toMatch(/Installation/);
    expect(copy.ms.form.serviceLabels.install).toMatch(/Pemasangan/);
  });

  it("areas are exactly the covered ones", () => {
    expect([...coveredAreas]).toEqual(["Kuala Lumpur", "Selangor"]);
  });
});

describe("validateBooking", () => {
  it("requires unit type, service and area", () => {
    expect(validateBooking(emptyDraft)).toEqual({ unit: true, service: true, area: true });
    expect(validateBooking(draft({ unit: null }))).toEqual({ unit: true });
    expect(validateBooking(draft({ service: null }))).toEqual({ service: true });
    expect(validateBooking(draft({ area: null }))).toEqual({ area: true });
    expect(validateBooking(draft())).toEqual({});
  });
  it("notes are optional", () => {
    expect(validateBooking(draft({ notes: "" }))).toEqual({});
  });
});

describe("quantity and notes", () => {
  it("clamps the quantity between 1 and the maximum and survives NaN", () => {
    expect(clampQuantity(0)).toBe(1);
    expect(clampQuantity(-5)).toBe(1);
    expect(clampQuantity(2.9)).toBe(2);
    expect(clampQuantity(9999)).toBe(BOOKING_MAX_UNITS);
    expect(clampQuantity(Number.NaN)).toBe(1);
    expect(clampQuantity(Infinity)).toBe(1);
  });
  it("tidies notes: collapses spaces, joins lines, caps the length", () => {
    expect(cleanNotes("  a   b \r\n\r\n c  ")).toBe("a b / c");
    expect(cleanNotes("x".repeat(BOOKING_MAX_NOTES + 50))).toHaveLength(BOOKING_MAX_NOTES);
  });
});

describe("buildBookingMessage", () => {
  it("English message lists every detail", () => {
    expect(buildBookingMessage("en", draft({ notes: "Near the park" }))).toBe(
      [
        "Hi AJ Airconditioning, I would like to request an aircond service booking.",
        "",
        "Service: Chemical Cleaning",
        "Unit type: Wall Mounted",
        "Number of units: 2",
        "Location: Selangor",
        "Notes: Near the park",
        "",
        "Please confirm the slot. Thank you.",
      ].join("\n"),
    );
  });

  it("Bahasa Melayu message uses Malay labels and the same facts", () => {
    const text = buildBookingMessage("ms", draft({ unit: "cassette", area: "Kuala Lumpur" }));
    expect(text).toContain("Hai AJ Airconditioning, saya nak buat tempahan");
    expect(text).toContain("Servis: Cuci Kimia");
    expect(text).toContain("Jenis unit: Ceiling Cassette");
    expect(text).toContain("Bilangan unit: 2");
    expect(text).toContain("Lokasi: Kuala Lumpur");
    expect(text).not.toContain("Notes");
    expect(text).toContain("Tolong sahkan slot. Terima kasih.");
  });

  it("omits the notes line when there are none, and never states an appointment is confirmed", () => {
    for (const lang of ["en", "ms"] as const) {
      const text = buildBookingMessage(lang, draft());
      expect(text).not.toMatch(/Notes:|Nota:/);
      expect(text).not.toMatch(
        /confirmed|has been booked|telah disahkan|sudah disahkan|telah ditempah|sudah ditempah/i,
      );
      expect(text).not.toMatch(/RM\s?\d|total|jumlah/i);
    }
  });

  it("installation is an enquiry: its own greeting and no price", () => {
    const en = buildBookingMessage("en", draft({ service: "install" }));
    expect(en).toContain("enquire about aircond installation");
    expect(en).toContain("Service: Installation (enquiry)");
    expect(en).not.toMatch(/RM\s?\d/);
    const ms = buildBookingMessage("ms", draft({ service: "install" }));
    expect(ms).toContain("tanya pasal pemasangan aircond");
    expect(ms).toContain("Servis: Pemasangan aircond (pertanyaan)");
  });

  it("is URL-encoded for wa.me, including newlines, symbols and Malay text", () => {
    const d = draft({ notes: "R&D #2 100% 50% + café?" });
    for (const lang of ["en", "ms"] as const) {
      const message = buildBookingMessage(lang, d);
      for (const who of ["amirul", "admin"] as const) {
        const link = bookingLink(who, message);
        expect(link.startsWith(`${contacts[who].wa}?text=`)).toBe(true);
        expect(link).not.toMatch(/[\s\n]/);
        const url = new URL(link);
        expect([...url.searchParams.keys()]).toEqual(["text"]);
        expect(url.searchParams.get("text")).toBe(message);
        expect(decode(link)).toBe(message);
      }
    }
  });

  it("contact and chat links use the approved numbers only", () => {
    expect(chatLink("amirul")).toBe("https://wa.me/60182833900");
    expect(chatLink("admin")).toBe("https://wa.me/60182621417");
    expect(decode(contactLink("amirul", "en"))).toBe(copy.en.contact.greeting);
    expect(decode(contactLink("admin", "ms"))).toBe(copy.ms.contact.greeting);
  });
});

function form(lang: "en" | "ms" = "en") {
  return renderInLanguage(<BookingForm />, lang);
}
const choose = (name: string | RegExp) => fireEvent.click(screen.getByLabelText(name));

describe("<BookingForm />", () => {
  it("states that this is a request, not a confirmed appointment", () => {
    form("en");
    expect(screen.getByText(/not a confirmed appointment/)).toBeInTheDocument();
    form("ms");
    expect(screen.getByText(/bukan temu janji yang sudah disahkan/)).toBeInTheDocument();
  });

  it("marks required and optional fields", () => {
    form("en");
    expect(screen.getAllByText("Required")).toHaveLength(4);
    expect(screen.getByText("Optional")).toBeInTheDocument();
  });

  it("shows bilingual validation messages and moves focus to the summary", () => {
    for (const lang of ["en", "ms"] as const) {
      const { unmount } = form(lang);
      fireEvent.click(screen.getByRole("button", { name: copy[lang].form.review }));
      const alert = screen.getByRole("alert");
      expect(alert).toHaveTextContent(copy[lang].form.errors.summary);
      expect(screen.getByText(copy[lang].form.errors.unit)).toBeInTheDocument();
      expect(screen.getByText(copy[lang].form.errors.service)).toBeInTheDocument();
      expect(screen.getByText(copy[lang].form.errors.area)).toBeInTheDocument();
      expect(screen.queryByTestId("booking-message")).toBeNull();
      unmount();
    }
  });

  it("clears an error once that field is answered", () => {
    form("en");
    fireEvent.click(screen.getByRole("button", { name: "Check my request" }));
    choose("Wall Mounted");
    expect(screen.queryByText(copy.en.form.errors.unit)).toBeNull();
    expect(screen.getByText(copy.en.form.errors.service)).toBeInTheDocument();
  });

  it("walks through details, review, and offers Amirul and Admin links with the same message", () => {
    form("en");
    choose("Wall Mounted");
    fireEvent.click(screen.getByRole("button", { name: "More units" }));
    choose("Chemical Cleaning");
    choose("Selangor");
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Level 3, no lift" } });
    fireEvent.click(screen.getByRole("button", { name: "Check my request" }));

    const message = screen.getByTestId("booking-message").textContent ?? "";
    expect(message).toContain("Service: Chemical Cleaning");
    expect(message).toContain("Unit type: Wall Mounted");
    expect(message).toContain("Number of units: 2");
    expect(message).toContain("Location: Selangor");
    expect(message).toContain("Notes: Level 3, no lift");

    const amirul = screen.getByRole("link", { name: /WhatsApp Amirul/ });
    const admin = screen.getByRole("link", { name: /WhatsApp Admin/ });
    expect(amirul.getAttribute("href")!.startsWith("https://wa.me/60182833900?text=")).toBe(true);
    expect(admin.getAttribute("href")!.startsWith("https://wa.me/60182621417?text=")).toBe(true);
    expect(decode(amirul.getAttribute("href")!)).toBe(message);
    expect(decode(admin.getAttribute("href")!)).toBe(message);
    for (const a of [amirul, admin]) {
      expect(a).toHaveAttribute("target", "_blank");
      expect(a.getAttribute("rel")).toContain("noopener");
      expect(a.getAttribute("rel")).toContain("noreferrer");
    }
    expect(screen.getByText(/Nothing has been sent yet/)).toBeInTheDocument();
  });

  it("keeps the answers when the customer goes back to edit, and Start over clears them", () => {
    form("en");
    choose("Ceiling Cassette");
    choose("Repair & troubleshooting");
    choose("Kuala Lumpur");
    fireEvent.click(screen.getByRole("button", { name: "Check my request" }));
    fireEvent.click(screen.getByRole("button", { name: /Edit details/ }));
    expect(screen.getByLabelText("Ceiling Cassette")).toBeChecked();
    expect(screen.getByLabelText("Repair & troubleshooting")).toBeChecked();
    expect(screen.getByLabelText("Kuala Lumpur")).toBeChecked();

    fireEvent.click(screen.getByRole("button", { name: "Check my request" }));
    fireEvent.click(screen.getByRole("button", { name: /Start over/ }));
    expect(screen.getByLabelText("Ceiling Cassette")).not.toBeChecked();
  });

  it("shows the listed price per unit type as information, never a total", () => {
    form("en");
    choose("Ceiling Cassette");
    fireEvent.click(screen.getByRole("button", { name: "More units" }));
    fireEvent.click(screen.getByRole("button", { name: "More units" }));
    const note = screen.getByText(/Listed price for Ceiling Cassette/);
    expect(note).toHaveTextContent("RM230 per unit (by unit type, not by HP)");
    expect(note.textContent).not.toMatch(/690|total/i);
  });

  it("installation shows a WhatsApp-confirmation note instead of a price", () => {
    form("en");
    choose("Wall Mounted");
    expect(screen.getByText(/Listed price for Wall Mounted/)).toBeInTheDocument();
    choose("Installation (enquiry)");
    expect(screen.queryByText(/Listed price/)).toBeNull();
    expect(
      screen.getByText(/Installation details are confirmed with AJ on WhatsApp/),
    ).toBeInTheDocument();
  });

  it("the stepper stays within 1 and the maximum", () => {
    form("en");
    const more = screen.getByRole("button", { name: "More units" }) as HTMLButtonElement;
    const fewer = screen.getByRole("button", { name: "Fewer units" }) as HTMLButtonElement;
    expect(fewer.disabled).toBe(true);
    for (let i = 0; i < BOOKING_MAX_UNITS + 5; i++) fireEvent.click(more);
    expect(more.disabled).toBe(true);
    expect(
      within(screen.getByRole("group", { name: /Number of units/ })).getByText(
        String(BOOKING_MAX_UNITS),
      ),
    ).toBeTruthy();
  });

  it("uses labelled native radios and a labelled textarea, and has no text inputs or payment fields", () => {
    const { container } = form("en");
    expect(container.querySelectorAll("input[type=radio]")).toHaveLength(3 + 6 + 2);
    expect(screen.getByLabelText(/Additional notes/)).toBeInstanceOf(HTMLTextAreaElement);
    expect(
      container.querySelector(
        "input[type=text], input[type=tel], input[type=email], input[type=password]",
      ),
    ).toBeNull();
    expect(container.textContent).not.toMatch(/card|payment|pembayaran kad/i);
  });

  it("Bahasa Melayu labels and the review message", () => {
    form("ms");
    choose("Wall Mounted");
    choose("Cuci Kimia");
    choose("Selangor");
    fireEvent.click(screen.getByRole("button", { name: "Semak permintaan saya" }));
    expect(screen.getByTestId("booking-message").textContent).toContain("Servis: Cuci Kimia");
    expect(screen.getByRole("link", { name: /WhatsApp Amirul/ })).toBeInTheDocument();
    expect(screen.getByText(/Belum ada apa-apa yang dihantar/)).toBeInTheDocument();
  });

  it("price cards pre-select the unit and the problem shortcuts pre-select repair", () => {
    renderInLanguage(
      <>
        <Pricing />
        <section id="contact">
          <BookingForm />
        </section>
      </>,
      "en",
    );
    fireEvent.click(screen.getByRole("button", { name: /Choose this unit.*Ceiling Exposed/ }));
    expect(screen.getByLabelText("Ceiling Exposed")).toBeChecked();
  });
});
