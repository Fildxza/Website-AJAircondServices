import { fireEvent, render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";

import { FloatingWhatsApp } from "@/components/site/floating-whatsapp";
import { MobileCta } from "@/components/site/sections";
import { LanguageProvider } from "@/lib/language";
import { stubIntersectionObserver } from "./page-utils";

beforeAll(stubIntersectionObserver);

const mount = (lang: "en" | "ms" = "en") =>
  render(
    <LanguageProvider initial={lang}>
      <FloatingWhatsApp />
    </LanguageProvider>,
  );

describe("<FloatingWhatsApp />", () => {
  it("is a named button, collapsed by default, with a 56px touch target", () => {
    mount("en");
    const button = screen.getByRole("button", { name: "Chat with AJ on WhatsApp" });
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveAttribute("aria-haspopup", "dialog");
    expect(button.className).toContain("h-14");
    expect(button.className).toContain("w-14");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("is named in Bahasa Melayu when BM is selected", () => {
    mount("ms");
    expect(screen.getByRole("button", { name: "Hubungi AJ melalui WhatsApp" })).toBeInTheDocument();
  });

  it("is green (not the orange brand button) and sits clear of the phone Book Now bar", () => {
    const { container } = mount("en");
    const root = container.querySelector("[data-floating-whatsapp]") as HTMLElement;
    const button = screen.getByRole("button", { name: "Chat with AJ on WhatsApp" });
    expect(button.className).toContain("bg-wa");
    expect(button.className).not.toContain("bg-cta");
    expect(root.className).toContain("env(safe-area-inset-bottom)");
    expect(root.className).toContain("right-4");
  });

  it("opens a panel with Amirul and Admin by name, using the exact wa.me links and no phone numbers", () => {
    const { container } = mount("en");
    fireEvent.click(screen.getByRole("button", { name: "Chat with AJ on WhatsApp" }));
    const dialog = screen.getByRole("dialog", { name: "Chat with AJ on WhatsApp" });
    const links = [...dialog.querySelectorAll("a")];
    expect(links.map((a) => a.getAttribute("href"))).toEqual([
      "https://wa.me/60182833900",
      "https://wa.me/60182621417",
    ]);
    expect(links.map((a) => a.textContent)).toEqual([
      "WhatsApp Amirul (opens WhatsApp in a new tab)",
      "WhatsApp Admin (opens WhatsApp in a new tab)",
    ]);
    for (const a of links) {
      expect(a).toHaveAttribute("target", "_blank");
      expect(a.getAttribute("rel")).toBe("noopener noreferrer");
    }
    expect(container.textContent).not.toMatch(/018[-\s]?\d|\+?60\s?18/);
    expect(screen.getByRole("button", { name: "Chat with AJ on WhatsApp" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("moves focus into the panel, and Escape closes it and returns focus to the button", () => {
    mount("en");
    const trigger = screen.getByRole("button", { name: "Chat with AJ on WhatsApp" });
    fireEvent.click(trigger);
    expect(screen.getByRole("link", { name: /WhatsApp Amirul/ })).toHaveFocus();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(trigger).toHaveFocus();
  });

  it("has a clear close button and closes when clicking outside", () => {
    mount("en");
    const trigger = screen.getByRole("button", { name: "Chat with AJ on WhatsApp" });
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole("button", { name: "Close chat options" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(trigger).toHaveFocus();

    fireEvent.click(trigger);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.pointerDown(document.body);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("never opens WhatsApp by itself: nothing is a link until the panel is opened", () => {
    const { container } = mount("en");
    expect(container.querySelectorAll("a")).toHaveLength(0);
  });
});

describe("<MobileCta /> (phones)", () => {
  it("is a single Book Now link to the booking section, not a WhatsApp link", () => {
    const { container } = render(
      <LanguageProvider initial="en">
        <MobileCta />
      </LanguageProvider>,
    );
    const link = screen.getByRole("link", { name: "Book Now" });
    expect(link).toHaveAttribute("href", "#contact");
    expect(link).not.toHaveAttribute("target");
    expect(container.querySelector("a[href*='wa.me']")).toBeNull();
    expect(container.firstElementChild?.className).toContain("sm:hidden");
  });
});
