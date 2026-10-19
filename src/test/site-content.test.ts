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
  it("is a standard key-free Google Maps embed with no marker or place query", () => {
    const embed = new URL(serviceMap.embedUrl);
    expect(embed.protocol).toBe("https:");
    expect(embed.hostname).toBe("maps.google.com");
    expect(embed.searchParams.get("output")).toBe("embed");
    for (const forbidden of ["key", "q", "query", "daddr", "saddr"]) {
      expect(embed.searchParams.has(forbidden)).toBe(false);
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
