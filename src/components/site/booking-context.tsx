import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { ServiceId, UnitId } from "@/content/booking";

export type BookingPrefill = {
  /** Increments on every request so the form can react even to the same values. */
  seq: number;
  unit?: UnitId;
  service?: ServiceId;
  notes?: string;
};

type BookingValue = {
  prefill: BookingPrefill | null;
  /** Scrolls to the booking form, optionally pre-selecting fields. Never opens WhatsApp. */
  openBooking: (preset?: Omit<BookingPrefill, "seq">) => void;
};

function scrollToContact() {
  // Follows the page's `scroll-behavior`, which is smooth except under prefers-reduced-motion.
  document.getElementById("contact")?.scrollIntoView({ block: "start" });
}

const BookingContext = createContext<BookingValue>({
  prefill: null,
  openBooking: scrollToContact,
});

export function BookingProvider({ children }: { children: ReactNode }) {
  const [prefill, setPrefill] = useState<BookingPrefill | null>(null);
  const openBooking = useCallback((preset: Omit<BookingPrefill, "seq"> = {}) => {
    setPrefill((prev) => ({ ...preset, seq: (prev?.seq ?? 0) + 1 }));
    scrollToContact();
  }, []);
  const value = useMemo(() => ({ prefill, openBooking }), [prefill, openBooking]);
  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export const useBooking = () => useContext(BookingContext);
