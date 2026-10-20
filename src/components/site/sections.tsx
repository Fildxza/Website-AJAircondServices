import { useRef, useState } from "react";
import {
  ArrowRight,
  Building2,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Droplets,
  Fan,
  FileText,
  Gauge,
  MapPin,
  Phone,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { contactLink, unitIds } from "@/content/booking";
import { fill } from "@/content/copy";
import {
  BUSINESS_NAME,
  contacts,
  galleryItems,
  photoCredits,
  pricing,
  serviceArea,
  services,
  ssmRegistration,
  unitTypes,
} from "@/content/site";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLanguage } from "@/lib/language";
import { useSectionInView } from "@/lib/use-section-in-view";
import { BookingForm } from "./booking-form";
import { useBooking } from "./booking-context";
import { CommonProblems } from "./common-problems";
import { Reveal, SectionHeading, WhatsAppButton, container, Logo } from "./primitives";

export { Navbar } from "./navbar";

const heroFactIcons: LucideIcon[] = [MapPin, Building2, FileText];

/** The hero shows one of the owner-supplied job photos (the second gallery entry). */
const heroPhoto = galleryItems[1] ?? galleryItems[0];

/** Primary call to action: scrolls to the booking form. Not a WhatsApp link. */
function BookNowLink({ className }: { className?: string }) {
  const { t } = useLanguage();
  return (
    <a
      href="#contact"
      className={cn(
        "btn-shine inline-flex min-h-12 items-center justify-center rounded-full bg-cta px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-brand-foreground shadow-[0_12px_24px_-12px_rgb(217_54_0/0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-cta-hover hover:shadow-lift active:scale-[0.98]",
        className,
      )}
    >
      {t.cta.bookNow}
    </a>
  );
}

export function Hero() {
  const { t } = useLanguage();
  return (
    <section id="top" className="hero-glow relative overflow-hidden">
      {/* Decorative "cool air" lines. They drift very slowly and stay still when motion is reduced. */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full text-brand opacity-[0.22]"
        viewBox="0 0 1200 600"
        preserveAspectRatio="none"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden
      >
        <path className="hero-wave" d="M-50 150C200 60 420 250 680 150S1080 70 1260 170" />
        <path className="hero-wave" d="M-50 250C220 170 460 350 720 250S1100 190 1260 280" />
        <path className="hero-wave" d="M-50 350C240 280 480 450 760 350S1120 300 1260 390" />
      </svg>
      <div
        className={cn(
          container,
          "relative grid grid-cols-1 gap-12 pb-14 pt-10 sm:pb-20 sm:pt-16 lg:grid-cols-12 lg:items-center",
        )}
      >
        <div className="lg:col-span-7">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-ink shadow-soft">
              <span className="h-2 w-2 rounded-full bg-brand" /> {t.hero.eyebrow}
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-6 font-display text-[2.5rem] font-black uppercase leading-[0.98] tracking-tight sm:text-6xl lg:text-[3.6rem]">
              {t.hero.titleA}
              <br />
              <span className="text-brand">{t.hero.titleB}</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
              {t.hero.body}
            </p>
          </Reveal>
          <Reveal delay={240} className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <BookNowLink />
            <a
              href="#services"
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-3 text-sm font-bold uppercase tracking-wider text-foreground transition-colors hover:text-brand-ink"
            >
              <span className="link-underline">{t.cta.viewServices}</span>
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              />
            </a>
          </Reveal>
        </div>
        <Reveal delay={320} className="lg:col-span-5">
          <div className="relative mx-auto max-w-md lg:max-w-none">
            {heroPhoto && (
              <>
                <div
                  className="absolute -right-3 -top-3 h-full w-full rounded-[2rem] bg-brand sm:-right-5 sm:-top-5"
                  aria-hidden
                />
                <figure className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-white shadow-soft">
                  <img
                    src={heroPhoto.src}
                    alt={t.gallery.alts[1] ?? heroPhoto.alt}
                    width={heroPhoto.width}
                    height={heroPhoto.height}
                    fetchPriority="high"
                    style={{ objectPosition: heroPhoto.position }}
                    className="h-full w-full object-cover"
                  />
                </figure>
              </>
            )}
            <div
              className={cn(
                "relative z-10 rounded-2xl border border-border bg-white p-6 shadow-lift",
                heroPhoto && "-mt-24 ml-3 mr-3 sm:ml-6 sm:mr-6",
              )}
            >
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {t.hero.startingFrom}
              </p>
              <p className="mt-2 font-display text-6xl font-black text-brand">
                RM{pricing[0]?.price}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{t.hero.startingNote}</p>
            </div>
          </div>
        </Reveal>
        <Reveal delay={400} className="lg:col-span-12">
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {t.hero.facts.map((fact, i) => {
              const Icon = heroFactIcons[i] ?? MapPin;
              return (
                <li
                  key={fact.title}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-ink">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span>
                    <span className="block font-display text-base font-bold">
                      {i === 0 ? (
                        <a href="#service-area" className="transition-colors hover:text-brand-ink">
                          {fact.title}
                        </a>
                      ) : (
                        fact.title
                      )}
                    </span>
                    <span className="block text-sm text-muted-foreground">{fact.note}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

export function Services() {
  const { t } = useLanguage();
  return (
    <section id="services" className="scroll-mt-24 py-20 sm:py-28">
      <div className={container}>
        <SectionHeading
          eyebrow={t.services.eyebrow}
          title={t.services.title}
          intro={t.services.intro}
        />
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-6">
          {t.services.items.map((s, i) => (
            <Reveal
              key={services[i]?.code ?? i}
              delay={(i % 3) * 90}
              className={cn("h-full", i < 3 ? "md:col-span-2" : "md:col-span-3")}
            >
              <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand/50 hover:shadow-lift sm:p-8">
                <span
                  className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-brand transition-transform duration-500 group-hover:scale-x-100"
                  aria-hidden
                />
                <div className="flex items-center justify-between">
                  <ServiceIcon i={i} />
                  <span className="font-display text-sm font-bold text-brand-ink">
                    {services[i]?.code}
                  </span>
                </div>
                <h3 className="mt-7 break-words font-display text-xl font-black uppercase sm:text-2xl">
                  {s.title}
                </h3>
                <p className="mt-3 text-muted-foreground">{s.body}</p>
                <ul className="mt-6 space-y-2 text-sm font-medium">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-brand-deep" aria-hidden />
                      {p}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
        <CommonProblems />
      </div>
    </section>
  );
}

export function Pricing() {
  const { t } = useLanguage();
  const { openBooking } = useBooking();
  return (
    <section id="pricing" className="scroll-mt-24 bg-surface py-20 sm:py-28">
      <div className={container}>
        <Reveal className="max-w-2xl">
          <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-brand-ink">
            <span className="heading-rule h-0.5 w-8 bg-brand" aria-hidden />
            {t.pricing.eyebrow}
          </p>
          <h2 className="mt-4 font-display text-3xl font-black uppercase leading-[1.02] tracking-tight sm:text-5xl">
            {t.pricing.title}
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            <strong className="text-foreground">{t.pricing.lead}</strong> {t.pricing.rest}
          </p>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {pricing.map((p, i) => (
            <Reveal key={p.unit} delay={i * 90}>
              <article
                className={cn(
                  "flex h-full flex-col rounded-2xl border p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift sm:p-8",
                  i === 0 ? "border-cta bg-cta text-white" : "border-border bg-white shadow-soft",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-base font-black uppercase tracking-wide">
                    {p.unit}
                  </h3>
                  {i === 0 && (
                    <span className="rounded-full bg-white px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-brand-ink">
                      {t.pricing.mostCommon}
                    </span>
                  )}
                </div>
                <p className="mt-6 flex items-start font-display font-black">
                  <span className={cn("mt-2 text-xl", i === 0 ? "text-white" : "text-brand-ink")}>
                    RM
                  </span>
                  <span
                    className={cn(
                      "text-7xl leading-none tracking-tight",
                      i === 0 ? "text-white" : "text-brand",
                    )}
                  >
                    {p.price}
                  </span>
                </p>
                <p className={cn("mt-2 text-sm", i === 0 ? "text-white" : "text-muted-foreground")}>
                  {t.pricing.perUnit}
                </p>
                <div className="mt-auto pt-8">
                  {/* A quieter secondary button: the one primary "Book Now" lives in the header and hero. */}
                  <button
                    type="button"
                    onClick={() => {
                      const unit = unitIds[i];
                      openBooking(unit ? { unit } : {});
                    }}
                    className={cn(
                      "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border-2 px-7 py-3.5 text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]",
                      i === 0
                        ? "border-white text-white hover:bg-white hover:text-brand-ink"
                        : "border-cta text-cta hover:bg-cta hover:text-white",
                    )}
                  >
                    {t.pricing.choose}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                    <span className="sr-only">
                      {" "}
                      — {p.unit} RM{p.price}
                    </span>
                  </button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function UnitTypes() {
  const { t } = useLanguage();
  return (
    <section id="units" className="scroll-mt-24 py-20 sm:py-28">
      <div className={container}>
        <SectionHeading eyebrow={t.units.eyebrow} title={t.units.title} intro={t.units.intro} />
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {unitTypes.map((u, i) => (
            <Reveal key={u.name} delay={i * 90}>
              <article className="group flex h-full flex-col rounded-2xl bg-brand-soft p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift sm:p-4">
                {/* Every card uses the same 4:3 frame, so the grid stays even and nothing shifts while images load. */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-white">
                  {u.photo ? (
                    <img
                      src={u.photo.src}
                      srcSet={u.photo.srcSet}
                      sizes="(min-width: 1152px) 360px, (min-width: 768px) 33vw, 92vw"
                      width={u.photo.width}
                      height={u.photo.height}
                      alt={t.units.alts[i] ?? u.photo.alt}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="grid h-full place-items-center">
                      <UnitGlyph kind={i} />
                    </div>
                  )}
                </div>
                <div className="p-4 pb-3 sm:p-5 sm:pb-4">
                  <h3 className="font-display text-xl font-black uppercase">{u.name}</h3>
                  <p className="mt-2 text-muted-foreground">{t.units.notes[i] ?? u.note}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function UnitGlyph({ kind }: { kind: number }) {
  const cls =
    "h-24 w-full max-w-[12rem] text-brand-ink transition-transform duration-500 group-hover:-translate-y-1";
  if (kind === 0)
    return (
      <svg
        viewBox="0 0 120 50"
        className={cls}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        aria-hidden
      >
        <rect x="4" y="6" width="112" height="30" rx="6" />
        <path d="M14 28h92" />
        <path d="M30 42v4M60 42v6M90 42v4" stroke="var(--brand)" />
      </svg>
    );
  if (kind === 1)
    return (
      <svg
        viewBox="0 0 120 50"
        className={cls}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        aria-hidden
      >
        <path d="M0 6h120" />
        <rect x="22" y="6" width="76" height="18" rx="3" />
        <rect x="40" y="10" width="40" height="10" />
        <path d="M30 32l-6 8M90 32l6 8M60 32v10" stroke="var(--brand)" />
      </svg>
    );
  return (
    <svg
      viewBox="0 0 120 50"
      className={cls}
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      aria-hidden
    >
      <path d="M0 4h120M20 4v6M100 4v6" />
      <rect x="10" y="10" width="100" height="20" rx="5" />
      <path d="M20 24h80" />
      <path d="M35 38v6M60 38v8M85 38v6" stroke="var(--brand)" />
    </svg>
  );
}

export function Gallery() {
  const { t } = useLanguage();
  const [active, setActive] = useState<number | null>(null);
  // The tile that opened the lightbox, so keyboard focus can return to it when it closes.
  const opener = useRef<HTMLButtonElement | null>(null);
  const count = galleryItems.length;
  const item = active === null ? undefined : galleryItems[active];
  const labelOf = (i: number) => t.gallery.labels[i] ?? galleryItems[i]?.label ?? "";
  const altOf = (i: number) => t.gallery.alts[i] ?? galleryItems[i]?.alt ?? "";
  const step = (d: number) => setActive((i) => (i === null ? i : (i + d + count) % count));
  return (
    <section id="gallery" className="scroll-mt-24 bg-surface py-20 sm:py-28">
      <div className={container}>
        <SectionHeading
          eyebrow={t.gallery.eyebrow}
          title={t.gallery.title}
          intro={t.gallery.intro}
        />
        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {galleryItems.map((g, i) => {
            const orphan = count % 2 === 1 && i === count - 1;
            return (
              <Reveal
                key={g.src}
                delay={(i % 3) * 80}
                className={cn(orphan && "col-span-2 lg:col-span-1")}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    opener.current = e.currentTarget;
                    setActive(i);
                  }}
                  aria-label={fill(t.gallery.viewLarger, { label: labelOf(i) })}
                  className={cn(
                    "group relative block w-full overflow-hidden rounded-2xl bg-white text-left shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift",
                    orphan ? "aspect-[16/10] lg:aspect-[4/5]" : "aspect-[4/5]",
                  )}
                >
                  <img
                    src={g.thumb}
                    alt={altOf(i)}
                    width={g.thumbWidth}
                    height={g.thumbHeight}
                    loading="lazy"
                    decoding="async"
                    style={{ objectPosition: g.position }}
                    className="h-full w-full object-cover"
                  />
                  <span
                    className="pointer-events-none absolute inset-0 bg-brand/0 transition-colors duration-300 group-hover:bg-brand/10"
                    aria-hidden
                  />
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent p-4 pt-14 text-sm font-semibold text-white">
                    {labelOf(i)}
                  </span>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>
      <Dialog open={active !== null} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent
          className="max-w-[min(96vw,56rem)] gap-0 overflow-hidden rounded-2xl border-0 bg-white p-0 sm:rounded-2xl"
          onCloseAutoFocus={(e) => {
            // Radix only restores focus to a <Trigger>; return it to the tile the user opened.
            e.preventDefault();
            opener.current?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") step(1);
            if (e.key === "ArrowLeft") step(-1);
          }}
        >
          {item && active !== null && (
            <>
              <div className="flex items-center gap-3 border-b border-border py-3 pl-5 pr-14">
                <DialogTitle className="font-display text-base font-black uppercase leading-snug sm:text-lg">
                  {labelOf(active)}
                </DialogTitle>
                <span className="ml-auto shrink-0 text-xs font-semibold text-muted-foreground">
                  {active + 1} / {count}
                </span>
              </div>
              <DialogDescription className="sr-only">{altOf(active)}</DialogDescription>
              <div className="relative flex items-center justify-center bg-brand-soft">
                <img
                  src={item.src}
                  alt={altOf(active)}
                  width={item.width}
                  height={item.height}
                  className="max-h-[68vh] w-auto max-w-full object-contain"
                />
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label={t.gallery.previous}
                  className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white text-foreground shadow-soft transition-colors hover:bg-brand-soft"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label={t.gallery.next}
                  className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white text-foreground shadow-soft transition-colors hover:bg-brand-soft"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

export function Process() {
  const { t } = useLanguage();
  const steps = t.process.steps;
  return (
    <section id="process" className="scroll-mt-24 py-20 sm:py-28">
      <div className={container}>
        <SectionHeading
          eyebrow={t.process.eyebrow}
          title={t.process.title}
          intro={t.process.intro}
        />
        <ol className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 120}>
              <li className="relative">
                {i < steps.length - 1 && (
                  <span
                    className="draw-line absolute left-16 right-[-1rem] top-6 hidden border-t-2 border-dashed border-brand/45 lg:block"
                    aria-hidden
                  />
                )}
                <span className="step-dot relative grid h-12 w-12 place-items-center rounded-full bg-cta font-display text-lg font-black text-white shadow-[0_10px_20px_-10px_rgb(217_54_0/0.8)]">
                  {i + 1}
                </span>
                <h3 className="mt-5 font-display text-lg font-black uppercase">{s.title}</h3>
                <p className="mt-2 text-muted-foreground">{s.body}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Faq() {
  const { t } = useLanguage();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="scroll-mt-24 border-t border-border py-20 sm:py-28">
      <div className={cn(container, "grid grid-cols-1 gap-10 lg:grid-cols-12")}>
        <div className="lg:col-span-4">
          <SectionHeading eyebrow={t.faq.eyebrow} title={t.faq.title} />
        </div>
        <div className="space-y-3 lg:col-span-7">
          {t.faq.items.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className={cn(
                  "rounded-2xl border px-5 transition-colors duration-300",
                  isOpen ? "border-brand/40 bg-brand-soft" : "border-border bg-white shadow-soft",
                )}
              >
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left font-display text-base font-bold sm:text-lg"
                  >
                    {f.q}
                    <span
                      className={cn(
                        "grid h-8 w-8 shrink-0 place-items-center rounded-full transition-all duration-300",
                        isOpen ? "rotate-180 bg-cta text-white" : "bg-brand-soft text-brand-ink",
                      )}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </button>
                </h3>
                <div
                  id={`faq-${i}`}
                  role="region"
                  className={cn(
                    "grid transition-[grid-template-rows] duration-300",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <p className="overflow-hidden pb-0 text-muted-foreground">
                    <span className="block pb-5">{f.a}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** The only place on the page that shows the two phone numbers. */
export function Contact() {
  const { lang, t } = useLanguage();
  const cards = (["amirul", "admin"] as const).map((id) => ({
    id,
    name: t.contact[id],
    ...contacts[id],
    waLink: contactLink(id, lang),
  }));
  return (
    <section
      id="contact"
      className="relative scroll-mt-24 overflow-hidden bg-cta py-20 text-white sm:py-28"
    >
      <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden />
      <div className={cn(container, "relative")}>
        <SectionHeading
          invert
          eyebrow={t.contact.eyebrow}
          title={t.contact.title}
          intro={t.contact.intro}
        />
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-5 lg:items-start">
          <div className="space-y-5 lg:col-span-2">
            {cards.map((c, i) => (
              <Reveal key={c.id} delay={i * 90}>
                <article className="rounded-2xl bg-white p-7 text-foreground shadow-lift transition-transform duration-300 hover:-translate-y-1 sm:p-8">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-brand-ink">
                    {c.name}
                  </h3>
                  <a
                    href={`tel:${c.tel}`}
                    className="mt-3 block font-display text-3xl font-black transition-colors hover:text-brand-ink sm:text-4xl"
                  >
                    {c.phone}
                  </a>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                    <WhatsAppButton href={c.waLink}>
                      {fill(t.cta.whatsappName, { name: c.name })}
                    </WhatsAppButton>
                    <a
                      href={`tel:${c.tel}`}
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-cta px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-cta transition-all duration-300 hover:-translate-y-0.5 hover:bg-cta hover:text-white active:scale-[0.98]"
                    >
                      <Phone className="h-4 w-4" aria-hidden /> {t.cta.call}
                      <span className="sr-only"> {c.name}</span>
                    </a>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal delay={120} className="lg:col-span-3">
            <BookingForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="border-t-4 border-brand bg-white pb-24 pt-14 sm:pb-10">
      <div className={cn(container, "grid grid-cols-1 gap-10 md:grid-cols-3")}>
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">{t.footer.tagline}</p>
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-brand-ink">
            {t.footer.pricing}
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {pricing.map((p) => (
              <li key={p.unit} className="flex max-w-xs justify-between">
                <span>{p.unit}</span>
                <span className="font-bold text-brand-ink">RM{p.price}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-brand-ink">
            {t.footer.contact}
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="text-muted-foreground">{t.footer.contactNote}</li>
            <li>
              <a
                href="#contact"
                className="font-semibold text-brand-ink underline-offset-4 transition-colors hover:underline"
              >
                {t.footer.contactLink}
              </a>
            </li>
            <li>
              <a
                href="#service-area"
                className="text-muted-foreground transition-colors hover:text-brand-ink"
              >
                {fill(t.footer.area, { area: serviceArea })}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <p
        className={cn(
          container,
          "mt-12 flex flex-col gap-1 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:justify-between",
        )}
      >
        <span>
          © {new Date().getFullYear()} {BUSINESS_NAME}.
        </span>
        <PhotoCredits />
        <span>{fill(t.footer.ssm, { no: ssmRegistration })}</span>
      </p>
    </footer>
  );
}

/** Credit dialog. CC BY-SA photos require credit, a licence link and a note of changes. */
function PhotoCredits() {
  const { t } = useLanguage();
  return (
    <Dialog>
      <DialogTrigger className="self-start rounded-sm underline-offset-4 transition-colors hover:text-brand-ink hover:underline sm:self-auto">
        {t.footer.credits}
      </DialogTrigger>
      <DialogContent className="max-w-lg rounded-2xl sm:rounded-2xl">
        <DialogTitle className="font-display text-xl font-black uppercase">
          {t.credits.title}
        </DialogTitle>
        <DialogDescription>{t.credits.intro}</DialogDescription>
        <ul className="space-y-4 text-sm">
          {photoCredits.map((c, i) => (
            <li key={c.title}>
              <p className="font-bold">{t.credits.items[i]?.use ?? c.use}</p>
              <p className="mt-1 text-muted-foreground">
                &ldquo;
                <a
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-brand-ink underline-offset-4 hover:underline"
                >
                  {c.title}
                </a>
                &rdquo; {t.credits.by} {c.author} {t.credits.via} {c.via},{" "}
                <a
                  href={c.licenceHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-brand-ink underline-offset-4 hover:underline"
                >
                  {c.licence}
                </a>
                . {t.credits.items[i]?.changes ?? c.changes}
              </p>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}

/** Sticky "Book Now" bar for phones. It slides away while the booking section is on screen. */
export function MobileCta() {
  const inContact = useSectionInView("contact");
  return (
    <div
      inert={inContact}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/95 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-10px_30px_-18px_rgb(35_31_29/0.35)] backdrop-blur-md transition-transform duration-300 sm:hidden",
        inContact && "translate-y-full",
      )}
    >
      <BookNowLink className="w-full" />
    </div>
  );
}

function ServiceIcon({ i }: { i: number }) {
  const Icon = [Droplets, Gauge, Wrench, Fan, ClipboardCheck][i] ?? Wrench;
  return (
    <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-soft text-brand-ink transition-colors duration-300 group-hover:bg-cta group-hover:text-white">
      <Icon className="h-5 w-5" aria-hidden />
    </span>
  );
}
