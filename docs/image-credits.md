# Image credits and provenance

Every image on the site that is **not** a photo supplied by the owner is listed here, with its
licence. The Supported Units cards carry no on-card label or credit text. Credit for the two
licensed photos is shown in the footer "Photo credits" dialog (`photoCredits` in
`src/content/site.ts`).

## Images in use

| Where                                 | File(s)                                                | Source                                                                                                                                                                  | Licence                                                                                      |
| ------------------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Supported Units: **Wall Mounted**     | `public/units/wall-mounted-640.jpg`, `…-960.jpg`       | Photo by **NEOSiAM 18+** on Pexels, [photo 38788452](https://www.pexels.com/photo/wall-mounted-air-conditioner-in-modern-interior-38788452/)                            | Pexels licence: free to use including advertising, no attribution required, edits allowed    |
| Supported Units: **Ceiling Cassette** | `public/units/ceiling-cassette-640.jpg`, `…-810.jpg`   | **Owner-supplied AJ job photo** (also used in the Work gallery), cropped to 4:3                                                                                         | Owner's own photo                                                                            |
| Supported Units: **Ceiling Exposed**  | `public/units/ceiling-exposed-640.jpg`, `…-960.jpg`    | "[Condizionatore a soffitto 3](https://commons.wikimedia.org/wiki/File:Condizionatore_a_soffitto_3.jpg)" by **Nuorese 95**, Wikimedia Commons; cropped, resized, brightened | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/): credit required (see below) |
| Work gallery, hero                    | `public/gallery/*`                                     | Owner-supplied AJ job photos                                                                                                                                            | Owner's own photos                                                                           |
| Logo                                  | `public/brand/aj-logo*.png`                            | Owner-supplied logo                                                                                                                                                     | Owner's own                                                                                  |

All site images were re-encoded locally; metadata (EXIF/GPS/XMP) is stripped, and a test checks
this. The Pexels licence says not to imply endorsement by brands or people shown in the image, so
the Wall Mounted photo must stay a generic image and never be presented as an AJ job. The same
applies to the Ceiling Exposed photo.

## Ceiling Exposed: why there is still a credit

The owner's job photos include no exposed ceiling-hung unit, and no CC0, public-domain or Pexels
photo of that type was found. The photo in use is CC BY-SA 4.0, which **requires**:

- credit to the author, the title, the licence name and a link to the licence;
- a note that the image was changed (done: "Cropped, resized and brightened");
- that the adapted image is shared under the same licence (stated in the credit).

This is satisfied by the footer "Photo credits" dialog, so no text sits on the card. **Do not delete
that dialog while this photo is on the site.** Replacing it removes the obligation:

**Best fix:** one clear photo of an exposed ceiling unit from a real AJ job (with the same consent
as the other job photos). Put it in `public/units/` as 4:3 JPEGs (640 and about 960 px wide), update
the `photo` entry of "Ceiling Exposed" in `unitTypes`, and delete its entry from `photoCredits`
(`src/content/site.ts`). The tests in `src/test/units.test.ts` check the image size, format, alt
text and metadata.

## Options that were evaluated and not used

- Daikin ceiling suspended air conditioner.jpg (Nameless245, CC BY-SA 4.0): cluttered ceiling with
  pipes and scaffolding, an old beige unit and a visible Daikin logo.
- Westpoint four-way cassette in a suspended ceiling, and "Office room with Westpoint ceiling
  cassette air conditioners" (CFEE/Westpoint, CC BY-SA 4.0): cassette type, with a manufacturer logo.
- Hitachi, Daikin, Panasonic indoor-unit photos by Dinkun Chen (CC BY-SA 4.0): several show old or
  stained units.
