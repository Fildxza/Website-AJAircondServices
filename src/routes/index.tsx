import { createFileRoute } from "@tanstack/react-router";
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
import { Reviews } from "@/components/site/reviews";
import { ServiceArea } from "@/components/site/service-area";
import { buildPageHead } from "@/lib/seo";

export const Route = createFileRoute("/")({
  // Title, description, Open Graph/Twitter tags, canonical (once the domain is confirmed) and JSON-LD.
  head: () => buildPageHead(),
  component: Index,
});

function Index() {
  return (
    <BookingProvider>
      <Navbar />
      <main id="main">
        <Hero />
        <Services />
        <Pricing />
        <UnitTypes />
        <Gallery />
        <Process />
        <Reviews />
        <ServiceArea />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <MobileCta />
      <FloatingWhatsApp />
    </BookingProvider>
  );
}
