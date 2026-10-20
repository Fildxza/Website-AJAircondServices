import { ExternalLink, Quote, Star } from "lucide-react";
import { fill } from "@/content/copy";
import { googleReviews } from "@/content/site";
import { useLanguage } from "@/lib/language";
import { Reveal, SectionHeading, container } from "./primitives";

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

/**
 * Genuine Google reviews, copied from AJ's Google listing (see `googleReviews` in site.ts). It is a
 * dated snapshot, not a live Google integration. No profile or customer photos were supplied, so
 * reviewers get a plain initials badge. The "see all" button only renders once the verified Google
 * Maps link has been set.
 */
export function Reviews() {
  const { t } = useLanguage();
  const r = t.reviews;
  return (
    <section id="reviews" className="scroll-mt-24 bg-brand-soft py-20 sm:py-28">
      <div className={container}>
        <SectionHeading
          eyebrow={r.eyebrow}
          title={r.title}
          intro={fill(r.intro, { date: r.dateLabel })}
        />
        <ul className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {googleReviews.items.map((review, i) => (
            <li key={review.name}>
              <Reveal delay={i * 90} className="h-full">
                <article className="flex h-full flex-col rounded-2xl border border-border bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift sm:p-8">
                  <div className="flex items-center justify-between gap-3">
                    <div role="img" aria-label={r.stars} className="flex gap-0.5 text-amber-500">
                      {[0, 1, 2, 3, 4].map((n) => (
                        <Star key={n} className="h-5 w-5 fill-current" aria-hidden />
                      ))}
                    </div>
                    <Quote className="h-6 w-6 text-brand/40" aria-hidden />
                  </div>
                  <div className="mt-5 flex-1">
                    <blockquote className="text-base leading-relaxed text-foreground">
                      {review.text}
                    </blockquote>
                    {review.shortened && (
                      <p className="mt-3 text-xs text-muted-foreground">{r.shortened}</p>
                    )}
                  </div>
                  <footer className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                    <span
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-soft font-display text-sm font-black text-brand-ink"
                      aria-hidden
                    >
                      {initials(review.name)}
                    </span>
                    <span>
                      <span className="block font-display text-base font-bold">{review.name}</span>
                      <span className="block text-xs text-muted-foreground">
                        {review.badge ? `${r.localGuide} · ` : ""}
                        {r.source}
                      </span>
                    </span>
                  </footer>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
        {googleReviews.url && (
          <Reveal delay={120} className="mt-10">
            <a
              href={googleReviews.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-cta px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-cta transition-all duration-300 hover:-translate-y-0.5 hover:bg-cta hover:text-white active:scale-[0.98]"
            >
              {r.viewAll}
              <ExternalLink className="h-4 w-4" aria-hidden />
              <span className="sr-only"> {t.a11y.opensNewTab}</span>
            </a>
          </Reveal>
        )}
      </div>
    </section>
  );
}
