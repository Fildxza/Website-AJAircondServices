import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { DEFAULT_LANG, LANG_STORAGE_KEY, copy, fill } from "@/content/copy";
import { LanguageProvider, useLanguage } from "@/lib/language";
import { pricing } from "@/content/site";
import { Navbar } from "@/components/site/navbar";
import { renderWholePage, stubIntersectionObserver } from "./page-utils";

beforeAll(stubIntersectionObserver);
afterEach(() => {
  window.localStorage.clear();
  document.documentElement.lang = "";
});

/** Every key path of a value; arrays contribute their length and each index. */
function shape(value: unknown, path = "", out: string[] = []): string[] {
  if (Array.isArray(value)) {
    out.push(`${path}[len=${value.length}]`);
    value.forEach((v, i) => shape(v, `${path}[${i}]`, out));
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) shape(v, path ? `${path}.${k}` : k, out);
  } else out.push(`${path}:${typeof value}`);
  return out;
}

function strings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => strings(v, out));
  else if (value && typeof value === "object") Object.values(value).forEach((v) => strings(v, out));
  return out;
}

describe("copy", () => {
  it("Bahasa Melayu is the default language", () => {
    expect(DEFAULT_LANG).toBe("ms");
  });

  it("English and Bahasa Melayu have exactly the same structure", () => {
    expect(shape(copy.ms)).toEqual(shape(copy.en));
  });

  it("no string is empty and every placeholder exists in both languages", () => {
    const en = strings(copy.en);
    const ms = strings(copy.ms);
    expect(en).toHaveLength(ms.length);
    en.forEach((text, i) => {
      expect(text.trim(), text).not.toBe("");
      expect(ms[i]!.trim()).not.toBe("");
      const holes = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort().join(",");
      expect(holes(ms[i]!), `${text} / ${ms[i]}`).toBe(holes(text));
    });
  });

  it("Bahasa Melayu really is translated (not copied) for the headline copy", () => {
    expect(copy.ms.nav).toEqual([
      "Utama",
      "Servis",
      "Harga",
      "Jenis Unit",
      "Galeri",
      "Soalan Lazim",
      "Hubungi Kami",
    ]);
    expect(copy.en.nav).toEqual([
      "Home",
      "Services",
      "Pricing",
      "Unit Types",
      "Gallery",
      "FAQ",
      "Contact",
    ]);
    expect(copy.ms.cta.bookNow).toBe("Tempah Sekarang");
    expect(copy.en.cta.bookNow).toBe("Book Now");
    expect(copy.ms.cta.viewServices).toBe("Lihat Servis");
    expect(copy.ms.contact.title).not.toBe(copy.en.contact.title);
    expect(copy.ms.faq.items[0]!.q).not.toBe(copy.en.faq.items[0]!.q);
  });

  it("neither language invents prices, guarantees or testimonials", () => {
    for (const lang of ["en", "ms"] as const) {
      // The coverage disclaimer ("can't guarantee every neighbourhood") is the one allowed mention.
      const text = strings(copy[lang])
        .join("\n")
        .replace(/can't guarantee every neighbourhood/i, "");
      const prices = [...text.matchAll(/RM\s?\d+/g)].map((m) => m[0].replace(/\s/g, ""));
      for (const p of prices) expect(["RM130", "RM230"]).toContain(p);
      expect(text).not.toMatch(/guarantee|jaminan|warranty|waranti|testimonial|terbaik|\bbest\b/i);
    }
    expect(pricing.map((p) => p.price)).toEqual([130, 230, 230]);
  });

  it("fill replaces known placeholders and leaves unknown ones", () => {
    expect(fill("a {x} b {y}", { x: 1 })).toBe("a 1 b {y}");
  });
});

function Probe() {
  const { lang } = useLanguage();
  return <p data-testid="lang">{lang}</p>;
}

describe("<LanguageProvider />", () => {
  it("starts in Bahasa Melayu and sets the document language", () => {
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>,
    );
    expect(screen.getByTestId("lang")).toHaveTextContent("ms");
    expect(document.documentElement.lang).toBe("ms-MY");
  });

  it("restores a saved language after mount", () => {
    window.localStorage.setItem(LANG_STORAGE_KEY, "en");
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>,
    );
    expect(screen.getByTestId("lang")).toHaveTextContent("en");
    expect(document.documentElement.lang).toBe("en-MY");
  });

  it("ignores a corrupted saved value", () => {
    window.localStorage.setItem(LANG_STORAGE_KEY, "fr");
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>,
    );
    expect(screen.getByTestId("lang")).toHaveTextContent("ms");
  });
});

describe("language switch in the header", () => {
  it("offers BM and EN as toggle buttons; the active one is pressed", () => {
    render(
      <LanguageProvider>
        <Navbar />
      </LanguageProvider>,
    );
    const bm = screen.getByRole("button", { name: "Bahasa Melayu" });
    const en = screen.getByRole("button", { name: "English" });
    expect(bm).toHaveTextContent("BM");
    expect(en).toHaveTextContent("EN");
    expect(bm).toHaveAttribute("aria-pressed", "true");
    expect(en).toHaveAttribute("aria-pressed", "false");
  });

  it("switching updates navigation, the Book Now label, <html lang> and storage; and back again", () => {
    render(
      <LanguageProvider>
        <Navbar />
      </LanguageProvider>,
    );
    const nav = () =>
      screen
        .getAllByRole("link")
        .filter((a) => a.closest("ul.hidden"))
        .map((a) => a.textContent);
    expect(nav()).toEqual(copy.ms.nav);
    expect(screen.getAllByRole("link", { name: "Tempah Sekarang" }).length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "English" }));
    expect(nav()).toEqual(copy.en.nav);
    expect(screen.getAllByRole("link", { name: "Book Now" }).length).toBeGreaterThan(0);
    expect(document.documentElement.lang).toBe("en-MY");
    expect(window.localStorage.getItem(LANG_STORAGE_KEY)).toBe("en");

    fireEvent.click(screen.getByRole("button", { name: "Bahasa Melayu" }));
    expect(nav()).toEqual(copy.ms.nav);
    expect(document.documentElement.lang).toBe("ms-MY");
    expect(window.localStorage.getItem(LANG_STORAGE_KEY)).toBe("ms");
  });
});

describe("the whole page follows the selected language", () => {
  it("renders Bahasa Melayu content and no leftover English section copy", () => {
    const { container } = renderWholePage("ms");
    const text = container.textContent ?? "";
    for (const expected of [
      copy.ms.hero.titleA,
      copy.ms.services.title,
      copy.ms.pricing.title,
      copy.ms.units.title,
      copy.ms.gallery.title,
      copy.ms.process.title,
      copy.ms.area.title,
      copy.ms.faq.items[0]!.q,
      copy.ms.contact.title,
      copy.ms.form.title,
      copy.ms.footer.tagline,
    ]) {
      expect(text, expected).toContain(expected);
    }
    for (const leaked of [
      copy.en.hero.body,
      copy.en.services.intro,
      copy.en.pricing.title,
      copy.en.process.title,
      copy.en.contact.title,
      copy.en.footer.tagline,
      copy.en.faq.items[0]!.q,
    ]) {
      expect(text, leaked).not.toContain(leaked);
    }
    expect(container.querySelectorAll("img[alt]").length).toBeGreaterThan(5);
    for (const img of container.querySelectorAll("img")) {
      expect(img.getAttribute("alt"), img.src).not.toMatch(
        /^(Technician|White|Ceiling cassette air)/,
      );
    }
  });

  it("renders English content when English is selected", () => {
    const { container } = renderWholePage("en");
    const text = container.textContent ?? "";
    for (const expected of [copy.en.hero.titleA, copy.en.contact.title, copy.en.footer.tagline]) {
      expect(text).toContain(expected);
    }
    expect(text).not.toContain(copy.ms.contact.title);
  });

  it("switching language on the full page changes headings, buttons and image descriptions", () => {
    const { container } = renderWholePage("ms");
    expect(container.querySelector("h2")?.textContent).toBe(copy.ms.services.title);
    act(() => {
      fireEvent.click(screen.getByRole("button", { name: "English" }));
    });
    expect(container.querySelector("h2")?.textContent).toBe(copy.en.services.title);
    expect(screen.getByRole("button", { name: /Check my request/ })).toBeInTheDocument();
    expect(container.querySelector("#top img")?.getAttribute("alt")).toBe(copy.en.gallery.alts[1]);
  });

  it("keeps the approved prices in both languages", () => {
    for (const lang of ["en", "ms"] as const) {
      const { container, unmount } = renderWholePage(lang);
      const pricingSection = container.querySelector("#pricing")!.textContent ?? "";
      const amounts = new Set([...pricingSection.matchAll(/RM(\d+)/g)].map((m) => m[1]));
      expect([...amounts].sort()).toEqual(["130", "230"]);
      unmount();
    }
  });
});
