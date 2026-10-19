# Premium feature ideas

What is already built, and what could come next. Anything marked **needs owner** depends on a real
photo, number, claim or decision, so it has not been invented.

## Built (2026-10-20)

| Feature                                                       | Where                              | Notes                                                                                                                  |
| ------------------------------------------------------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Booking request (now also in Bahasa Melayu; see [bilingual-and-booking.md](bilingual-and-booking.md)) | Contact section | Replaces the earlier enquiry builder. Shows the exact message, lets the customer pick Amirul or Admin. Nothing is stored or sent until they press Send in WhatsApp. |
| "Having a problem?" shortcuts (6 symptoms)                    | Under the Services cards           | One tap opens WhatsApp with a ready message ("my aircond is leaking water. Can you check it?"). No diagnosis or price is claimed. |
| Floating WhatsApp launcher (green, Amirul / Admin panel) | Bottom-right, all screen sizes | Steps aside in the Contact section; sits above the phone Book Now bar. No pulsing. |
| Active-section highlight + thin scroll-progress line          | Header                             | Uses `aria-current="location"`. The progress line is decorative.                                                       |
| Photo cards for all three unit types, no on-card labels       | Supported Units                    | Licence credit moved to the footer "Photo credits" dialog.                                                             |

All motion respects `prefers-reduced-motion`, and the content is in the server-rendered HTML.

## Ideas that need the owner

| Idea                                    | Why it would help                                                              | What is needed                                                                                          |
| --------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| Real customer reviews / Google rating   | The strongest trust signal for a local service business                        | Real reviews with the customers' permission, or the Google Business Profile link. Nothing is invented.  |
| Before / after slider                   | Shows what chemical cleaning achieves                                          | Paired photos of the same unit from a real job, with consent.                                           |
| Short job video (10 to 20 s, no sound)  | Makes the hero feel alive                                                      | A real clip from a job, compressed. Autoplay would be muted and respect reduced motion.                 |
| Installation service card + estimator   | Installation is offered but not shown as a service                             | Which unit types, what is included, and prices. Added only after the owner confirms the scope.          |
| Team / "meet Amirul" block              | People hire people                                                             | Owner's photo and consent, and the wording he wants.                                                    |
| Maintenance plan (yearly visits)        | Repeat business                                                                | Whether AJ offers one, how often and at what price.                                                     |
| Gallery filter (by service or unit)     | Easier browsing as photos grow                                                 | Needs each photo tagged by the owner; worth it past about 15 photos.                                    |
| Tips / "when to service" short guide    | Helpful content that also supports search                                      | Owner-approved guidance (for example how often to service a home unit).                                 |
| Share image (1200 x 630) and favicon    | The link looks professional on WhatsApp and Facebook                           | Already on the owner-decision list.                                                                     |

## Ideas that need no owner input

- Curved or slanted section dividers between white and tinted sections (pure CSS).
- Subtle parallax on the hero photo (kept off for reduced motion).
- Animated number counters: **not recommended** unless the owner supplies verified figures.
- Dark-footer variant, or a "back to top" button after the FAQ.
