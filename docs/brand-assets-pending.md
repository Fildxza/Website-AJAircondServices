# Brand assets: status and what is needed

> **Update (new logo):** the owner has since supplied a **new logo** (720×1280 JPEG, brand
> orange `#fd4202`), now used across the site. The favicon analysis below was done on the
> **previous** 501 px logo. The new logo has the same design (a white band with the wordmark
> splits the AJ), so the same findings apply. A favicon test from the new, sharper file has not
> been made yet.

## 1. Favicon

**Status (2026-10-20): the Lovable heart has been removed.** On the owner's request the site now
ships the masked AJ monogram (`public/favicon.ico` with 16/32 px, `public/favicon-32.png`,
`public/apple-touch-icon.png`) and `src/routes/__root.tsx` links all three. It is legible at 32 px
and 180 px but only just at 16 px, so a designer-made square mark would still be better. The
analysis below explains why a clean crop was not possible.

The brief allowed a temporary favicon from "a clean square crop of the existing AJ monogram,
only if it remains legible at small sizes". It was tested honestly:

- The orange "AJ" occupies x 133–355, y 171–365 of the 501×501 logo JPEG (about 223×195 px).
- The logo's black "AIRCOND SERVICE" wordmark runs across the logo at x 88–411, **through the
  middle of the AJ**. Any square crop that contains the whole monogram therefore also contains
  part of that text line. Three crop sizes were tried (padded 250 px, tight 236 px, tightest
  226 px). All show text fragments such as "RCOND SERV" at the left and right edges.
- At real favicon size (16 px and 32 px) the orange AJ is recognisable, but the text line becomes
  a grey streak through the letters. At 48 px and above (shortcuts, Apple touch icon) the
  truncated words are plainly visible and look like a mistake.

Verdict: **not clean**, so it was not installed. A text-free icon would require editing the logo
pixels (masking the wordmark), which has not been approved.

Preview images of the candidates are in `docs/favicon-candidates/` (not served by the website):

- `crops-A-B.png`: the padded and tight crops, enlarged, with 16 / 32 / 48 / 64 px renderings
- `crops-C-D.png`: the two tightest crops, same layout
- `real-size-16-and-32px.png`: the chosen crop at true 16 px and 32 px, the honest view

### Options (owner to choose)

| Option                                                                                   | Effort      | Notes                                                                                           |
| ---------------------------------------------------------------------------------------- | ----------- | ----------------------------------------------------------------------------------------------- |
| **A. Designer supplies a square icon** (AJ monogram only, plus the original vector logo) | Lowest risk | Best result. Ask for SVG plus 512×512 PNG with a transparent or white background.               |
| **B. Approve masking the wordmark** to make a monogram-only icon from the existing JPEG  | Small       | This edits logo pixels, so it needs explicit approval. Quality is limited by the 501 px source. |
| **C. Remove the Lovable heart and ship no icon** until A or B is ready                   | Smallest    | Browsers show a generic icon. Avoids showing the wrong brand in tabs and search results.        |

### Files to produce once approved

- `public/favicon.ico` containing 16, 32 and 48 px images
- `public/favicon-32.png`, `public/apple-touch-icon.png` (180×180), `public/icon-192.png`,
  `public/icon-512.png`
- Update the `icon` links in `src/routes/__root.tsx` (currently only `/favicon.ico`) and add a
  test that each referenced file exists.

## 2. Original vector logo

**Status: outstanding.** The supplied "SVG" (`WhatsApp-Image-…svg`) is a single-colour auto-trace
(19 paths, all `fill="#000000"`) of the 501×501 JPEG. It is **not** an original vector, and it is
not used.

The site now uses the owner's **new logo**, a lossless margin crop of the supplied 720×1280 JPEG
(`public/brand/aj-logo.png`, 654×544) plus a downscaled copy with the same proportions for the
header and footer (`public/brand/aj-logo-web.png`, 327×272). The previous logo crop was removed.
It is still a raster image, so it is sharp up to roughly 300 px wide.

Ask the person who designed the logo for the original AI, SVG or PDF. If it was made in Canva,
an SVG export is normally available from the Canva design (a paid plan may be required). Do not
redraw or recolour the logo.

## 3. Social-sharing image (1200×630)

**Status: deferred**, as instructed. Until a suitable approved asset exists:

- No `og:image` / `twitter:image` is emitted. They would need an absolute URL anyway, which needs
  the production URL.
- When ready, the best sources are (a) the designer's vector logo on a plain background, or
  (b) a genuine job photo that has staff, customer and third-party-brand consent. Never use stock
  or generated images as if they were AJ's work.
- Once the production URL is set, `src/lib/seo.ts` will automatically emit `og:image` using the
  **full-size logo crop** (654×544). A dedicated 1200×630 image needs a small code change: add a
  `shareImage` entry to `brandAssets` in `src/content/site.ts` and point `buildPageHead()` at it,
  with a test that the file exists and matches the declared size.
