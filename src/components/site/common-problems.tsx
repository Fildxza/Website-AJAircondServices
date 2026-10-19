import { Cloud, Droplet, Power, Snowflake, Volume2, Wind, type LucideIcon } from "lucide-react";
import { symptomIds, type SymptomId } from "@/content/booking";
import { useCopy } from "@/lib/language";
import { useBooking } from "./booking-context";
import { Reveal } from "./primitives";

const icons: Record<SymptomId, LucideIcon> = {
  cooling: Snowflake,
  airflow: Wind,
  leak: Droplet,
  noise: Volume2,
  smell: Cloud,
  power: Power,
};

/**
 * Shortcuts for the problems customers notice most. A tap pre-selects "Repair & troubleshooting"
 * and adds the symptom to the booking form's notes, then scrolls to the form. It does not open
 * WhatsApp and claims no diagnosis.
 */
export function CommonProblems() {
  const t = useCopy();
  const { openBooking } = useBooking();
  return (
    <Reveal delay={120} className="mt-10 rounded-2xl bg-brand-soft p-6 sm:p-8">
      <h3 className="font-display text-xl font-black uppercase leading-tight sm:text-2xl">
        {t.problems.title}
      </h3>
      <p className="mt-2 max-w-2xl text-muted-foreground">{t.problems.intro}</p>
      <ul className="mt-5 flex flex-wrap gap-3">
        {symptomIds.map((id) => {
          const Icon = icons[id];
          const item = t.problems.items[id];
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => openBooking({ service: "repair", notes: item.note })}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-brand/30 bg-white px-4 py-2 text-sm font-semibold shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-cta hover:bg-cta hover:text-white active:scale-[0.97]"
              >
                <Icon className="h-4 w-4" aria-hidden />
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
    </Reveal>
  );
}
