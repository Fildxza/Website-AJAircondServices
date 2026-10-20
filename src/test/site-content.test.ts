import { describe, expect, it } from "vitest";
import { contacts, navLinks, pricing, serviceMap, whatsAppLink } from "@/content/site";

describe("business rules", () => {
  it("keeps prices by unit type", () => {
    expect(pricing.map((p) => [p.unit, p.price])).toEqual([
      ["Wall Mounted", 130],
      ["Ceiling Cassette", 230],
      ["Ceiling Exposed", 230],
    ]);
  });
  it("uses correct phone and WhatsApp numbers", () => {
    expect(contacts.amirul.tel).toBe("+60182833900");
    expect(contacts.admin.tel).toBe("+60182621417");
    expect(contacts.amirul.wa).toBe("https://wa.me/60182833900");
    expect(contacts.admin.wa).toBe("https://wa.me/60182621417");
  });
  it("whatsAppLink encodes the message and never sends it", () => {
    const message = "Hi & hello?\nLine 2";
    const url = new URL(whatsAppLink(contacts.amirul.wa, message));
    expect(url.origin + url.pathname).toBe("https://wa.me/60182833900");
    expect(url.searchParams.get("text")).toBe(message);
    expect(whatsAppLink(contacts.admin.wa)).toBe("https://wa.me/60182621417");
  });
});

describe("service area map", () => {
  it("is a keyless OpenStreetMap view with one pin per area and a Google Maps fallback link", () => {
    expect(serviceMap.pins.map((p) => p.id)).toEqual(["kl", "selangor"]);
    for (const p of serviceMap.pins) {
      expect(p.lat).toBeGreaterThan(2.5);
      expect(p.lat).toBeLessThan(4);
      expect(p.lon).toBeGreaterThan(100.5);
      expect(p.lon).toBeLessThan(102);
      const url = new URL(p.href);
      expect(url.hostname).toBe("www.google.com");
      expect(url.searchParams.has("key")).toBe(false);
    }
    expect(new URL(serviceMap.openUrl).hostname).toBe("www.google.com");
    expect(serviceMap.openUrl).not.toMatch(/key=|query=/);
  });
});

describe("navigation", () => {
  it("lists Home, Services, Pricing, Units, Gallery, FAQ and Contact", () => {
    expect(navLinks.map((l) => l.href)).toEqual([
      "#top",
      "#services",
      "#pricing",
      "#units",
      "#gallery",
      "#faq",
      "#contact",
    ]);
  });
});
