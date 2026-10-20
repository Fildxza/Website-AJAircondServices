import { ArrowRight, Check, ExternalLink, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { fill } from "@/content/copy";
import { coveredAreas, serviceMap } from "@/content/site";
import { TILE, layoutTiles, tileUrl } from "@/lib/map";
import { useLanguage } from "@/lib/language";
import { useBooking } from "./booking-context";
import { Reveal, SectionHeading, container } from "./primitives";

/**
 * A small static map made from OpenStreetMap tiles, shown straight away (nothing to click, no Google
 * cookies, no API key). It marks the two covered AREAS with a pin each; it does not show a shop or
 * office. Each pin links to that area on Google Maps, and "Open in Google Maps" is always offered.
 */
export function ServiceAreaMap() {
  const { t } = useLanguage();
  const layout = layoutTiles(serviceMap.center, serviceMap.zoom, serviceMap.pins);
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-soft">
      <div
        role="group"
        aria-label={t.area.mapTitle}
        className="photo-pending relative h-[22rem] overflow-hidden sm:aspect-[16/10] sm:h-auto"
      >
        {/* The tile block is centred on the map centre, so it never needs to know the frame size. */}
        <div
          className="absolute"
          style={{
            width: layout.sizePx,
            height: layout.sizePx,
            left: `calc(50% - ${layout.center.left}px)`,
            top: `calc(50% - ${layout.center.top}px)`,
          }}
        >
          {layout.tiles.map((tile) => (
            <img
              key={`${tile.x}-${tile.y}`}
              src={tileUrl(serviceMap.zoom, tile.x, tile.y)}
              alt=""
              width={TILE}
              height={TILE}
              loading="lazy"
              decoding="async"
              draggable={false}
              className="absolute select-none"
              style={{ left: tile.left, top: tile.top }}
            />
          ))}
          {layout.pins.map((pin) => {
            const area = serviceMap.pins.find((p) => p.id === pin.id);
            if (!area) return null;
            return (
              <a
                key={pin.id}
                href={area.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={fill(t.area.pinLabel, { name: area.name })}
                className="group absolute -translate-x-1/2 -translate-y-full"
                style={{ left: pin.left, top: pin.top }}
              >
                <span className="flex flex-col items-center">
                  <span className="mb-1 whitespace-nowrap rounded-full bg-white px-3 py-1 font-display text-xs font-black uppercase shadow-soft ring-1 ring-black/5 transition-colors group-hover:bg-brand-soft">
                    {area.name}
                  </span>
                  <MapPin
                    className="h-9 w-9 fill-cta text-white drop-shadow-md transition-transform duration-300 group-hover:-translate-y-1"
                    aria-hidden
                  />
                </span>
              </a>
            );
          })}
        </div>
        <p className="pointer-events-none absolute bottom-0 right-0 bg-white/85 px-2 py-0.5 text-[0.65rem] text-muted-foreground">
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto underline-offset-2 hover:underline"
          >
            {t.area.mapAttribution}
          </a>
        </p>
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
