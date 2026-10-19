import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { LANGS, copy, type Lang } from "@/content/copy";
import { navLinks } from "@/content/site";
import { useLanguage } from "@/lib/language";
import { Logo, container } from "./primitives";

/** Sections the header watches. Only those listed in `navLinks` get a highlighted link. */
const watched = [
  "top",
  "services",
  "pricing",
  "units",
  "gallery",
  "process",
  "service-area",
  "faq",
  "contact",
];

const shortName: Record<Lang, string> = { ms: "BM", en: "EN" };

/** BM / EN switch. Two toggle buttons, so it works with keyboard and screen readers out of the box. */
export function LanguageSwitch({ className }: { className?: string }) {
  const { lang, setLang, t } = useLanguage();
  return (
    <div
      role="group"
      aria-label={t.a11y.languageGroup}
      className={cn("inline-flex rounded-full border border-border bg-white p-0.5", className)}
    >
      {LANGS.map((code) => (
        <button
          key={code}
          type="button"
          lang={code === "ms" ? "ms" : "en"}
          aria-pressed={lang === code}
          aria-label={copy[code].langName}
          onClick={() => setLang(code)}
          className={cn(
            "min-h-10 min-w-11 rounded-full px-3 text-xs font-bold tracking-wider transition-colors duration-200",
            lang === code ? "bg-cta text-white" : "text-foreground/75 hover:text-brand-ink",
          )}
        >
          {shortName[code]}
        </button>
      ))}
    </div>
  );
}

export function Navbar() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>("top");
  const progress = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // One passive, rAF-throttled scroll handler: toggles the header shadow and grows the thin
    // progress line by writing to the element directly (no React re-render per frame).
    let raf = 0;
    const update = () => {
      raf = 0;
      setScrolled(window.scrollY > 12);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress.current)
        progress.current.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on, { passive: true });
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    // Highlight the nav link of the section that is crossing the middle of the viewport.
    const sections = watched
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!sections.length || typeof IntersectionObserver === "undefined") return;
    const linked = new Set(navLinks.map((l) => l.href.slice(1)));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting) setActive(linked.has(e.target.id) ? e.target.id : null);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <a href="#main" className="skip-link">
        {t.a11y.skip}
      </a>
      <header
        className={cn(
          // The bottom hairline is a shadow (not a border) so the header stays exactly 72/96px tall.
          "sticky top-0 z-50 bg-white/95 shadow-[0_1px_0_0_var(--border)] backdrop-blur-md transition-shadow",
          scrolled && "shadow-[0_1px_0_0_var(--border),0_10px_30px_-14px_rgb(35_31_29/0.18)]",
        )}
      >
        <nav
          className={cn(container, "flex h-[4.5rem] items-center justify-between gap-3 sm:h-24")}
          aria-label={t.a11y.mainNav}
        >
          <a href="#top" aria-label={t.a11y.home} className="shrink-0">
            <Logo />
          </a>
          <ul className="hidden items-center gap-6 lg:flex xl:gap-7">
            {navLinks.map((l, i) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  aria-current={active === l.href.slice(1) ? "location" : undefined}
                  className="link-underline text-sm font-semibold text-foreground/80 transition-colors hover:text-brand-ink"
                >
                  {t.nav[i]}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <LanguageSwitch />
            <a
              href="#contact"
              className="btn-shine hidden min-h-11 items-center justify-center rounded-full bg-cta px-6 py-2.5 text-sm font-bold uppercase tracking-wider text-brand-foreground shadow-[0_12px_24px_-12px_rgb(217_54_0/0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-cta-hover hover:shadow-lift active:scale-[0.98] sm:inline-flex"
            >
              {t.cta.bookNow}
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t.a11y.closeMenu : t.a11y.openMenu}
              className="grid h-11 w-11 place-items-center rounded-full border border-border text-foreground lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
        <div
          id="mobile-menu"
          inert={!open}
          className={cn(
            // Overlays the page instead of pushing it down, so anchor links land correctly.
            "absolute inset-x-0 top-full border-t border-border bg-white transition-[max-height] duration-300 lg:hidden",
            open
              ? "max-h-[min(40rem,calc(100dvh-4.5rem))] overflow-y-auto shadow-lift"
              : "max-h-0 overflow-hidden border-transparent",
          )}
        >
          <ul className={cn(container, "flex flex-col py-3")}>
            {navLinks.map((l, i) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  aria-current={active === l.href.slice(1) ? "location" : undefined}
                  className={cn(
                    "block border-b border-border py-3.5 font-display text-lg font-bold uppercase transition-colors",
                    active === l.href.slice(1) && "text-brand-ink",
                  )}
                >
                  {t.nav[i]}
                </a>
              </li>
            ))}
            <li className="py-4">
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="btn-shine inline-flex min-h-12 w-full items-center justify-center rounded-full bg-cta px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-brand-foreground shadow-[0_12px_24px_-12px_rgb(217_54_0/0.8)] transition-all duration-300 active:scale-[0.98]"
              >
                {t.cta.bookNow}
              </a>
            </li>
          </ul>
        </div>
        {/* Reading-progress line: decorative, updated by the scroll handler above. */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] overflow-hidden"
          aria-hidden
        >
          <div
            ref={progress}
            className="h-full origin-left bg-brand will-change-transform"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </header>
    </>
  );
}
