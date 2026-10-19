# UTM campaign links

UTM parameters are labels added to the end of a web address so that, **if a tool is reading
them**, a visit can be traced to the post, bio link or ad that sent it.

## Read this first: what UTM links can and cannot do

| UTM links CAN                                                                     | UTM links CANNOT                                                                                   |
| --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Label each link you share, so you know which link a visitor clicked               | Confirm that anyone **sent a WhatsApp message**, called, or became a customer                      |
| Show (in an analytics tool, once one is added) how many visits each campaign sent | Prove that a **sale or completed job** came from a campaign                                        |
| Keep your own links organised and consistently named                              | Work without a tool: **this website has no analytics installed**, so today nobody can see UTM data |
| Support a conversation with the customer ("did you come from our TikTok?")        | Replace the lead log and the question "How did you hear about AJ?"                                 |

Why they cannot confirm a WhatsApp conversation: the website's WhatsApp buttons open WhatsApp
on the customer's phone. What happens next (a message sent or not, a booking made or not)
happens inside WhatsApp, where this website cannot see it. A customer may also read a post,
close it, and WhatsApp AJ days later from a saved number, or call instead. The honest record of
a lead is the **lead log** ([lead-tracking-spec.md](lead-tracking-spec.md)), supported by asking
the customer, not by clicks.

Using UTM links gives AJ and the operator a clean, consistent naming system now, ready for the
day an analytics tool is approved. It does not change how the site behaves.

## The production URL is not confirmed

All examples use `{SITE_URL}` as a **placeholder**. Replace it only with the verified live address
(for example `https://example.com`), with no trailing slash, once the owner has confirmed it
(see `deployment-notes.md`). Do not use a `localhost`, preview or guessed address.

## Parameters

| Parameter      | Required? | Meaning                                                                                             | Rule                              |
| -------------- | --------- | --------------------------------------------------------------------------------------------------- | --------------------------------- |
| `utm_source`   | Yes       | Where the link lives: `facebook`, `instagram`, `tiktok`, `google`, `whatsapp`, `flyer`, `community` | lowercase                         |
| `utm_medium`   | Yes       | The type of placement: `social`, `bio`, `paid-social`, `organic`, `broadcast`, `qr`, `referral`     | lowercase                         |
| `utm_campaign` | Yes       | The specific effort: `chem-clean-explainer`, `area-check-launch`                                    | lowercase-with-hyphens, no spaces |
| `utm_content`  | Optional  | Tells two links in the same campaign apart: `video-1`, `story`, `poster-a`                          | lowercase                         |

Naming rules: lowercase only, hyphens not spaces, short and meaningful, the **same spelling every
time** (`facebook` is not `Facebook` or `fb`). Never put names, phone numbers or any personal data in
a UTM value, because it shows in the address bar and in shared links. Do not add UTMs to links
**inside** the website, only to links pointing at it from outside.

Template:

```
{SITE_URL}/?utm_source=SOURCE&utm_medium=MEDIUM&utm_campaign=CAMPAIGN
```

## Example links (illustrative campaign names: replace with real ones)

| Where it goes                                           | Link                                                                                                     |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Facebook page, regular post                             | `{SITE_URL}/?utm_source=facebook&utm_medium=social&utm_campaign=chem-clean-explainer`                    |
| Facebook page, "About" button                           | `{SITE_URL}/?utm_source=facebook&utm_medium=bio&utm_campaign=page-profile`                               |
| Instagram bio link                                      | `{SITE_URL}/?utm_source=instagram&utm_medium=bio&utm_campaign=profile-link`                              |
| Instagram story, one video                              | `{SITE_URL}/?utm_source=instagram&utm_medium=social&utm_campaign=chem-clean-explainer&utm_content=story` |
| TikTok bio link                                         | `{SITE_URL}/?utm_source=tiktok&utm_medium=bio&utm_campaign=profile-link`                                 |
| Facebook / Instagram paid ad (only after approval)      | `{SITE_URL}/?utm_source=facebook&utm_medium=paid-social&utm_campaign=area-check-test&utm_content=ad-a`   |
| Google Business Profile website button                  | `{SITE_URL}/?utm_source=google&utm_medium=organic&utm_campaign=business-profile`                         |
| WhatsApp status or broadcast                            | `{SITE_URL}/?utm_source=whatsapp&utm_medium=broadcast&utm_campaign=monthly-reminder`                     |
| QR code on a flyer or notice board (community outreach) | `{SITE_URL}/?utm_source=community&utm_medium=qr&utm_campaign=notice-board-a`                             |
| Business card or van sticker QR                         | `{SITE_URL}/?utm_source=print&utm_medium=qr&utm_campaign=business-card`                                  |

A tracked link opens the same page as the normal address. The page is the same, the canonical URL
is unaffected, and visitors see nothing different.

## Things to do with the examples

- Keep a list of every link you create (name, where it is used, date) in the lead sheet's `README`
  tab or a separate sheet, so campaigns stay consistent.
- Use a QR generator that does not add its own redirect or tracking, or test the code on a phone
  before printing.
- Test every link on a phone before posting.

## Getting a result when a customer messages AJ

Because UTMs cannot see inside WhatsApp, use these methods **together** (cheapest first):

1. **Ask the customer** ("How did you hear about AJ?") and record it in the lead log. This is the
   most reliable method and costs nothing. It is the basis for any commission discussion.
2. **Campaign-specific wording**, for example a short phrase in a poster ("Mention 'notice board'").
   This needs no technology but depends on customers remembering to do it.
3. **A reference in the prefilled WhatsApp message** (for example `Ref: tiktok-bio`) so the first
   message carries its source. **This needs a small code change** and an owner decision. It is not
   built.
4. **A separate WhatsApp or phone number for one campaign.** This needs an owner decision and cost.

## What would need approval before real tracking exists

None of these is done, and none should be switched on without the owner's decision on cost and privacy:

| Step                                                                                             | What it needs                                                                               |
| ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| Install a privacy-conscious analytics tool (or Google Analytics 4) to read UTMs and count visits | Owner approval, a cost and privacy review, and a consent decision (cookie notice if needed) |
| Count clicks on the WhatsApp and call buttons as events                                          | A small code change plus an analytics tool. A click is **not** a message sent               |
| Add campaign references to prefilled WhatsApp messages                                           | A small code change and an owner decision                                                   |
| Platform pixels (Meta, TikTok) for ad measurement                                                | Owner approval, privacy and consent review, and an ad account                               |

When a tool is approved, define the conversion as "WhatsApp or call button clicked" and call it
exactly that. The booked and completed jobs still come from the lead log.

## Summary

- UTM links tell you **which link was clicked**, not who became a customer.
- The lead log, completed by AJ and backed by what customers say, is the record of leads and sales.
- Do not credit a sale to the marketing operator from UTM data alone.
