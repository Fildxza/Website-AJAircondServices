# Bilingual site, booking request and floating WhatsApp

How the BM/EN switch, the booking request and the floating assistant work, and where to edit them.

## Bahasa Melayu / English

- **Default: Bahasa Melayu.** The server renders BM; the header switch (BM | EN) changes the language
  in place. There is one page, not two.
- **Where the words live:** `src/content/copy.en.ts` and `src/content/copy.ms.ts` (same shape; a test
  fails if they drift apart). English reads services, FAQ, gallery captions and process steps from
  `src/content/site.ts`, so they exist once. Prices, phone numbers, photos and area names are not
  text and are shared by both languages in `site.ts`.
- **Persistence:** the choice is stored in `localStorage` under `aj-lang` (`ms` or `en`) and restored
  after the first render, so the server and browser markup match. If storage is blocked, the default
  language is used. The `<html lang>` attribute switches between `ms-MY` and `en-MY`.
- **WhatsApp messages follow the page language** (booking request and the Contact-card greeting).
- Unit-type names (Wall Mounted, Ceiling Cassette, Ceiling Exposed), "aircond" and place names are
  kept as customers know them.
- **Owner to proof-read the Malay** before launch. It is written in natural Malaysian usage but is
  customer-facing and should be checked by a native speaker.
- **Not translated:** the page title and description in the search/social tags (SEO is unchanged and
  stays English), the licence names in the photo credits, and the generic 404 / error screens.

## Calls to action

| Where                    | What                                                                                         |
| ------------------------ | -------------------------------------------------------------------------------------------- |
| Header, hero, phone bar  | **Book Now / Tempah Sekarang**: scrolls to the booking form. It is not a WhatsApp link.       |
| Hero                     | Subtle "View Services / Lihat Servis" text link.                                              |
| Price cards              | Quiet "Choose this unit" buttons: pre-select the unit in the booking form and scroll to it.   |
| "Having a problem?" chips | Pre-select "Repair & troubleshooting", add the symptom to the notes, scroll to the form.      |
| Service area             | "Ask about my area": scrolls to the form with a note started.                                 |
| Contact section          | The **only** place with phone numbers, WhatsApp Amirul / Admin and Call.                      |
| Floating launcher        | Green WhatsApp button: Amirul or Admin by name (no numbers).                                  |

Removed: the WhatsApp button in the header, hero and mobile bar, the three "Book this" WhatsApp
buttons on the price cards, the "Quick enquiry on WhatsApp" row, the six WhatsApp symptom links, the
WhatsApp area button, and every phone number in the hero card, footer and structured data.

## Booking request (Contact section)

- Fields: unit type, number of units, service, location (KL / Selangor), optional notes.
  Required: unit type, service, location. Errors are shown per field and in a summary that takes focus.
- Services: General Servicing, Chemical Cleaning, Repair & troubleshooting, Refrigerant gas services,
  Preventive Maintenance, and **Installation (enquiry)**. Installation is an enquiry only: no price,
  scope, service card or structured-data entry (owner decision #12).
- Step 2 shows the exact message and offers **WhatsApp Amirul** and **WhatsApp Admin**. Nothing is sent
  until the customer presses Send in WhatsApp. The form says it is a request, not a confirmed
  appointment. "Edit details" keeps the answers; "Start over" clears them.
- The listed price for the chosen unit type is shown as information ("RM130 per unit, by unit type,
  not by HP; AJ will confirm what your unit needs"). **No total is calculated** and the price is not
  put into the WhatsApp message.
- No data is stored or sent anywhere by the site, and there is no backend.
- Code: `src/content/booking.ts` (rules, validation, message), `src/components/site/booking-form.tsx`.

## Floating WhatsApp launcher

- Fixed bottom-right, WhatsApp green (`--wa`, white glyph 3.1:1), 56px, above the phone "Book Now" bar
  and the safe area. One short entrance animation, hover/focus lift, no pulsing.
- Click opens a small panel (Amirul / Admin) with the exact `wa.me` links, a close button, Escape,
  click-outside, and focus returned to the launcher.
- It steps aside while the Contact section is on screen (that section has the form and its own
  WhatsApp buttons). On large screens an optional "Need help?" label shows once per visit for about
  eight seconds, then disappears.
- Code: `src/components/site/floating-whatsapp.tsx`.

## Motion

Scroll reveal, card and button hover lifts, a light sweep on primary buttons, the process timeline
line that draws in, a very slow "cool air" line drift behind the hero, and the launcher entrance.
`prefers-reduced-motion` turns the drift, entrance, sweep, timeline and smooth scrolling off.
Content stays visible without JavaScript.
