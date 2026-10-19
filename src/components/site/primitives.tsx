import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { brandAssets } from "@/content/site";

/** Shared page-width wrapper classes for site sections. */
export const container = "mx-auto w-full max-w-6xl px-5 sm:px-8";

export const LOGO_SRC = brandAssets.logo.webPath;

/**
 * Official AJ logo (the owner's new logo, lossless margin crop of the supplied JPEG), shown at
 * its natural ratio on its own white background. Swap LOGO_SRC for the designer's vector file
 * when it is supplied. Never redraw or recolour this mark.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <img
      src={LOGO_SRC}
      width={brandAssets.logo.webWidth}
      height={brandAssets.logo.webHeight}
      alt="AJ Airconditioning Services"
      // mix-blend-multiply lets the file's near-white background (#fefefe) blend into any light
      // surface without editing the logo's pixels.
      className={cn("h-14 w-auto mix-blend-multiply sm:h-[4.5rem]", className)}
    />
  );
}

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      // Reveal just before the element is fully in view; fires once, so nothing re-animates on scroll-back.
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn("reveal", shown && "is-visible", className)}
    >
      {children}
    </div>
  );
}

/** `invert` = for solid orange sections (white text). */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  invert,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  invert?: boolean;
}) {
  return (
    <Reveal className="max-w-2xl">
      <p
        className={cn(
          "flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em]",
          invert ? "text-white" : "text-brand-ink",
        )}
      >
        <span
          className={cn("heading-rule h-0.5 w-8", invert ? "bg-white" : "bg-brand")}
          aria-hidden
        />
        {eyebrow}
      </p>
      <h2
        className={cn(
          "mt-4 font-display text-3xl font-black uppercase leading-[1.02] tracking-tight sm:text-5xl",
          invert && "text-white",
        )}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={cn(
            "mt-4 text-base sm:text-lg",
            invert ? "text-white" : "text-muted-foreground",
          )}
        >
          {intro}
        </p>
      )}
    </Reveal>
  );
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cn("h-5 w-5", className)} aria-hidden>
      <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3 2.4 1 2.9.8 3.4.7.5-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
    </svg>
  );
}

/**
 * brand   = solid orange, white text (4.7:1)
 * outline = orange outline on white
 * light   = white button for solid orange sections
 */
export function WhatsAppButton({
  href,
  children,
  variant = "brand",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: "brand" | "outline" | "light";
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-bold uppercase tracking-wider transition-all duration-300 active:scale-[0.98]",
        variant === "brand" &&
          "bg-cta text-brand-foreground shadow-[0_12px_24px_-12px_rgb(217_54_0/0.8)] hover:-translate-y-0.5 hover:bg-cta-hover hover:shadow-lift",
        variant === "outline" &&
          "border-2 border-cta text-cta hover:-translate-y-0.5 hover:bg-cta hover:text-brand-foreground",
        variant === "light" &&
          "bg-white text-brand-ink shadow-soft hover:-translate-y-0.5 hover:bg-brand-soft",
        className,
      )}
    >
      <WhatsAppIcon />
      {children}
    </a>
  );
}

/** Reusable image slot. Renders a labelled placeholder when no `src` is given. */
export function WorkImage({
  src,
  alt,
  label,
  width,
  height,
  position,
}: {
  src?: string | undefined;
  alt?: string | undefined;
  label: string;
  width?: number | undefined;
  height?: number | undefined;
  position?: string | undefined;
}) {
  if (src)
    return (
      <img
        src={src}
        alt={alt ?? label}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        style={position ? { objectPosition: position } : undefined}
        className="h-full w-full object-cover"
      />
    );
  return (
    <div
      role="img"
      aria-label={`Placeholder: ${label}. Genuine AJ photo coming soon.`}
      className="photo-pending relative flex h-full w-full flex-col justify-between p-5 text-muted-foreground"
    >
      <span className="self-start rounded-full border border-brand-ink/30 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-brand-ink">
        Photo coming soon
      </span>
      <svg
        viewBox="0 0 24 24"
        className="h-8 w-8 self-center text-brand opacity-50"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden
      >
        <rect x="3" y="5" width="18" height="14" rx="1" />
        <circle cx="9" cy="10" r="2" />
        <path d="M21 16l-5-5-8 8" />
      </svg>
      <div>
        <span className="mb-2 block h-0.5 w-6 bg-brand" aria-hidden />
        <p className="font-display text-sm font-bold uppercase text-foreground">{label}</p>
      </div>
    </div>
  );
}
