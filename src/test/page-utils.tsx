import { render } from "@testing-library/react";
import type { ReactNode } from "react";
import { vi } from "vitest";
import type { Lang } from "@/content/copy";
import { BookingProvider } from "@/components/site/booking-context";
import { FloatingWhatsApp } from "@/components/site/floating-whatsapp";
import {
  Contact,
  Faq,
  Footer,
  Gallery,
  Hero,
  MobileCta,
  Navbar,
  Pricing,
  Process,
  Services,
  UnitTypes,
} from "@/components/site/sections";
import { ServiceArea } from "@/components/site/service-area";
import { LanguageProvider } from "@/lib/language";

/** jsdom has no IntersectionObserver (used by the scroll-reveal wrapper and section watchers). */
export function stubIntersectionObserver() {
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
}

/** The whole home page, in the given language, exactly as routes/index.tsx assembles it. */
export function renderWholePage(lang: Lang = "en") {
  return render(
    <LanguageProvider initial={lang}>
      <BookingProvider>
        <Navbar />
        <main id="main">
          <Hero />
          <Services />
          <Pricing />
          <UnitTypes />
          <Gallery />
          <Process />
          <ServiceArea />
          <Faq />
          <Contact />
        </main>
        <Footer />
        <MobileCta />
        <FloatingWhatsApp />
      </BookingProvider>
    </LanguageProvider>,
  );
}

export function renderInLanguage(ui: ReactNode, lang: Lang = "en") {
  return render(
    <LanguageProvider initial={lang}>
      <BookingProvider>{ui}</BookingProvider>
    </LanguageProvider>,
  );
}
