import { useState } from "react";
import { ArrowRight, Check, ExternalLink, Map as MapIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { coveredAreas, serviceMap } from "@/content/site";
import { useLanguage } from "@/lib/language";
import { useBooking } from "./booking-context";
import { Reveal, SectionHeading, container } from "./primitives";

/**
 * Click-to-load Google Maps. Nothing is requested from Google until the visitor presses
 * "Load map", so the page stays light and no Google cookies are set on first load.
 * The view is neutral: no marker, no boundary, no business address.
 */
export function ServiceAreaMap() {
  const { t } = useLanguage();
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-soft">
      <div className="relative h-[22rem] sm:aspect-[16/10] sm:h-auto">
        {loaded ? (
          <iframe
            src={serviceMap.embedUrl}
            title={t.area.mapTitle}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <div className="photo-pending absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
            <span className="relative grid h-14 w-14 place-items-center rounded-2xl bg-cta text-white shadow-lift">
              <MapIcon className="h-6 w-6" aria-hidden />
            </span>
            <p className="relative font-display text-lg font-black uppercase">
              {t.area.mapHeading}
            </p>
            <button
              type="button"
              onClick={() => setLoaded(true)}
              className="relative inline-flex min-h-12 items-center justify-center rounded-full bg-cta px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-brand-foreground shadow-[0_12px_24px_-12px_rgb(217_54_0/0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-cta-hover hover:shadow-lift active:scale-[0.98]"
            >
              {t.area.loadMap}
            </button>
            <p className="relative max-w-xs text-xs text-muted-foreground">{t.area.mapPrivacy}</p>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 border-t border-border p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground">{t.area.mapCaption}</p>
        <a
          href={serviceMap.openUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 font-semibold text-brand-ink underline-offset-4 transition-colors hover:underline"
        >
          {t.area.openMap}
          <ExternalLink className="h-4 w-4" aria-hidden />
          <span className="sr-only"> {t.a11y.opensNewTab}</span>
        </a>
      </div>
    </div>
  );
}

export function ServiceArea() {
  const { t } = useLanguage();
  const { openBooking } = useBooking();
  return (
    <section id="service-area" className="scroll-mt-24 bg-surface py-20 sm:py-28">
      <div className={cn(container, "grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start")}>
        <div className="lg:col-span-5">
          <SectionHeading eyebrow={t.area.eyebrow} title={t.area.title} intro={t.area.intro} />
          <Reveal delay={90}>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {coveredAreas.map((area) => (
                <li
                  key={area}
                  className="flex items-center gap-2.5 whitespace-nowrap rounded-xl border border-border bg-white px-3.5 py-3.5 font-display text-sm font-black uppercase shadow-soft sm:text-base lg:text-sm xl:text-base"
                >
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-cta text-white">
                    <Check className="h-4 w-4" aria-hidden />
                  </span>
                  {area}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">{t.area.note}</p>
          </Reveal>
          <Reveal delay={180}>
            <div className="mt-8 rounded-2xl bg-cta p-6 text-white shadow-lift sm:p-7">
              <p className="font-display text-xl font-black leading-snug sm:text-2xl">
                {t.area.ctaLead}{" "}
                <span className="underline decoration-white/60 decoration-2 underline-offset-4">
                  {t.area.ctaTail}
                </span>
              </p>
              <p className="mt-2 text-sm text-white">{t.area.ctaBody}</p>
              <button
                type="button"
                onClick={() => openBooking({ notes: t.area.ctaNote })}
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-brand-ink shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-soft active:scale-[0.98] sm:w-auto"
              >
                {t.area.ctaButton}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </Reveal>
        </div>
        <Reveal delay={120} className="lg:col-span-7">
          <ServiceAreaMap />
        </Reveal>
      </div>
    </section>
  );
}
