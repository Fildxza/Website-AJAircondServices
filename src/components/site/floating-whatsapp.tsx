import { useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { chatLink, type ContactId } from "@/content/booking";
import { fill } from "@/content/copy";
import { useCopy } from "@/lib/language";
import { useSectionInView } from "@/lib/use-section-in-view";
import { WhatsAppIcon } from "./primitives";

const WELCOME_KEY = "aj-wa-welcome";
const people: ContactId[] = ["amirul", "admin"];

/**
 * Floating WhatsApp launcher (bottom-right, WhatsApp green). A click opens a small panel with two
 * choices, Amirul and Admin, shown by name only. The links go to the bare wa.me number: nothing is
 * prefilled or sent. It steps aside while the Contact section is on screen (that section has its own
 * WhatsApp buttons and the booking form) and sits above the phone "Book Now" bar on small screens.
 */
export function FloatingWhatsApp() {
  const t = useCopy();
  const panelId = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);
  const [open, setOpen] = useState(false);
  const [welcome, setWelcome] = useState(false);
  const inContact = useSectionInView("contact");
  const hidden = inContact && !open;

  // Optional welcome label (large screens only, once per visit, never stays for long).
  useEffect(() => {
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(WELCOME_KEY) === "1";
    } catch {
      seen = true;
    }
    if (seen) return;
    const show = window.setTimeout(() => setWelcome(true), 3500);
    const hide = window.setTimeout(() => {
      setWelcome(false);
      try {
        window.sessionStorage.setItem(WELCOME_KEY, "1");
      } catch {
        // Not remembered; the label may show again on the next load.
      }
    }, 11500);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    setWelcome(false);
    firstLink.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      trigger.current?.focus();
    };
    const onPointer = (e: PointerEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <div
      ref={root}
      inert={hidden}
      data-floating-whatsapp
      className={cn(
        "fixed right-4 z-40 flex flex-col items-end gap-3 transition-all duration-300 sm:right-6",
        // Above the sticky "Book Now" bar and the phone's safe area; lower on tablet and desktop.
        "bottom-[calc(5.75rem+env(safe-area-inset-bottom))] sm:bottom-6",
        hidden && "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-label={t.floating.title}
          className="fab-panel w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-border bg-white p-5 text-foreground shadow-lift"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="font-display text-lg font-black uppercase leading-tight">
              {t.floating.title}
            </p>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                trigger.current?.focus();
              }}
              aria-label={t.floating.close}
              className="-mr-2 -mt-2 grid h-11 w-11 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-brand-soft hover:text-foreground"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{t.floating.body}</p>
          <ul className="mt-4 space-y-2.5">
            {people.map((id, i) => (
              <li key={id}>
                <a
                  ref={i === 0 ? firstLink : undefined}
                  href={chatLink(id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-12 items-center gap-3 rounded-xl bg-wa px-4 py-3 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-wa-hover active:scale-[0.98]"
                >
                  <WhatsAppIcon className="h-6 w-6" />
                  {fill(t.cta.whatsappName, { name: t.contact[id] })}
                  <span className="sr-only"> {t.a11y.opensWhatsApp}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="relative">
        {welcome && !open && (
          <span
            aria-hidden
            className="fab-welcome pointer-events-none absolute right-full top-1/2 mr-3 hidden -translate-y-1/2 whitespace-nowrap rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground shadow-soft lg:block"
          >
            {t.floating.welcome}
          </span>
        )}
        <button
          ref={trigger}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={t.floating.open}
          aria-expanded={open}
          aria-controls={open ? panelId : undefined}
          aria-haspopup="dialog"
          className="fab-in grid h-14 w-14 place-items-center rounded-full bg-wa text-white shadow-[0_14px_28px_-12px_rgb(23_143_68/0.9)] ring-2 ring-white transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:bg-wa-hover active:scale-95"
        >
          {open ? <X className="h-6 w-6" aria-hidden /> : <WhatsAppIcon className="h-7 w-7" />}
        </button>
      </div>
    </div>
  );
}
