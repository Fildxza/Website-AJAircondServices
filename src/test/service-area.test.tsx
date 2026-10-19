import { fireEvent, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";

import { ServiceArea } from "@/components/site/service-area";
import { BookingForm } from "@/components/site/booking-form";
import { contacts, navLinks, serviceMap } from "@/content/site";
import { renderInLanguage, renderWholePage, stubIntersectionObserver } from "./page-utils";

beforeAll(stubIntersectionObserver);

const verifiedWaBases = [contacts.amirul.wa, contacts.admin.wa];

describe("Service Area section", () => {
  it("states coverage without inventing neighbourhoods, addresses or radius", () => {
    const { container } = renderInLanguage(<ServiceArea />);
    const text = container.textContent ?? "";
    expect(text).toContain("We currently serve Kuala Lumpur and Selangor only.");
    expect(text).toContain("Not sure if we cover your area? Ask us before you book.");
    expect(text).toMatch(/can.t guarantee every neighbourhood/);
    expect(text).toMatch(/does not show a shop or office location/);
    expect(text).not.toMatch(/\bkm\b|radius|Jalan|Taman|Bangsar|Petaling|Shah Alam/i);
  });

  it("does not load Google Maps until the visitor asks for it", () => {
    const { container } = renderInLanguage(<ServiceArea />);
    expect(container.querySelector("iframe")).toBeNull();
    expect(screen.getByRole("button", { name: "Load map" })).toBeInTheDocument();
  });

  it("loads the neutral, sandboxed embed after clicking Load map", () => {
    const { container } = renderInLanguage(<ServiceArea />);
    fireEvent.click(screen.getByRole("button", { name: "Load map" }));
    const frame = container.querySelector("iframe");
    expect(frame).not.toBeNull();
    expect(frame).toHaveAttribute("src", serviceMap.embedUrl);
    expect(frame).toHaveAttribute("title", serviceMap.title);
    expect(frame).toHaveAttribute("loading", "lazy");
    expect(frame).toHaveAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    expect(frame?.getAttribute("sandbox")).toContain("allow-scripts");
    expect(screen.queryByRole("button", { name: "Load map" })).toBeNull();
  });

  it("always offers a plain Open in Google Maps link as a fallback", () => {
    renderInLanguage(<ServiceArea />);
    const link = screen.getByRole("link", { name: /Open in Google Maps/ });
    expect(link).toHaveAttribute("href", serviceMap.openUrl);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link.getAttribute("rel")).toMatch(/noopener/);
  });

  it("the map still works in Bahasa Melayu", () => {
    const { container } = renderInLanguage(<ServiceArea />, "ms");
    fireEvent.click(screen.getByRole("button", { name: "Muat peta" }));
    expect(container.querySelector("iframe")).toHaveAttribute("src", serviceMap.embedUrl);
    expect(screen.getByRole("link", { name: /Buka dalam Google Maps/ })).toHaveAttribute(
      "href",
      serviceMap.openUrl,
    );
  });

  it("the area question pre-fills the booking notes instead of opening WhatsApp", () => {
    renderInLanguage(
      <>
        <ServiceArea />
        <section id="contact">
          <BookingForm />
        </section>
      </>,
    );
    fireEvent.click(screen.getByRole("button", { name: /Ask about my area/ }));
    const notes = screen.getByRole("textbox") as HTMLTextAreaElement;
    expect(notes.value).toMatch(/whether you cover my area/);
  });
});

describe("Every WhatsApp, phone and external link on the page", () => {
  it("WhatsApp links use a verified number, a greeting text and safe new-tab attributes", () => {
    const { container } = renderWholePage("en");
    const links = [...container.querySelectorAll<HTMLAnchorElement>('a[href*="wa.me"]')];
    // The two Contact-card buttons; the floating panel is closed and the form is on its first step.
    expect(links).toHaveLength(2);
    for (const a of links) {
      const url = new URL(a.href);
      expect(verifiedWaBases).toContain(url.origin + url.pathname);
      expect(url.searchParams.get("text")).toMatch(/^Hi AJ Airconditioning/);
      expect(a.target).toBe("_blank");
      expect(a.rel).toContain("noopener");
      expect(a.rel).toContain("noreferrer");
    }
  });

  it("tel links use the two verified numbers and appear only in the Contact section", () => {
    const { container } = renderWholePage("en");
    const tels = [...container.querySelectorAll<HTMLAnchorElement>('a[href^="tel:"]')];
    expect(tels).toHaveLength(4);
    const allowed = [`tel:${contacts.amirul.tel}`, `tel:${contacts.admin.tel}`];
    const contact = container.querySelector("#contact");
    for (const a of tels) {
      expect(allowed).toContain(a.getAttribute("href"));
      expect(contact?.contains(a)).toBe(true);
    }
  });

  it("the phone numbers are printed only in the Contact section, in both languages", () => {
    for (const lang of ["en", "ms"] as const) {
      const { container, unmount } = renderWholePage(lang);
      (container.querySelector("#contact") as HTMLElement).remove();
      expect(container.textContent ?? "").not.toMatch(
        /018[-\s]?28|018[-\s]?26|0182833900|0182621417/,
      );
      unmount();
    }
  });

  it("every external link opens safely", () => {
    const { container } = renderWholePage("en");
    const external = [...container.querySelectorAll<HTMLAnchorElement>('a[href^="http"]')];
    for (const a of external) {
      expect(a.target).toBe("_blank");
      expect(a.rel).toContain("noopener");
    }
  });

  it("every navigation anchor points at a section that exists", () => {
    const { container } = renderWholePage("en");
    for (const link of navLinks) {
      expect(container.querySelector(link.href), link.href).not.toBeNull();
    }
    expect(container.querySelector("#main")).not.toBeNull();
    expect(container.querySelector("#top")).not.toBeNull();
  });

  it("every in-page anchor (nav, hero, footer, skip link) resolves to an element", () => {
    const { container } = renderWholePage("en");
    const anchors = [...container.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')];
    expect(anchors.length).toBeGreaterThan(navLinks.length);
    for (const a of anchors) {
      const id = a.getAttribute("href")!.slice(1);
      expect(container.querySelector(`#${id}`), `#${id}`).not.toBeNull();
    }
  });
});
