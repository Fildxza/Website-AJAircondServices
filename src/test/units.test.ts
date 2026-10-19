import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { photoCredits, unitTypes } from "@/content/site";

const publicFile = (p: string) => path.join(process.cwd(), "public", p);

function jpegSize(buf: Buffer): { width: number; height: number } {
  let i = 2;
  while (i < buf.length - 9) {
    const marker = buf[i + 1]!;
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    }
    i += 2 + buf.readUInt16BE(i + 2);
  }
  throw new Error("No JPEG frame header found");
}

describe("supported unit types", () => {
  it("keeps the three supported units and their existing descriptions", () => {
    expect(unitTypes.map((u) => [u.name, u.note])).toEqual([
      ["Wall Mounted", "The most common split unit in homes and offices."],
      ["Ceiling Cassette", "Recessed into the ceiling with four-way airflow."],
      ["Ceiling Exposed", "Ceiling-hung unit for larger open spaces."],
    ]);
  });

  const withPhotos = unitTypes.filter((u) => u.photo);

  it("has a real photo for every supported unit, including Ceiling Exposed", () => {
    expect(withPhotos.map((u) => u.name)).toEqual([
      "Wall Mounted",
      "Ceiling Cassette",
      "Ceiling Exposed",
    ]);
  });

  it("the Ceiling Exposed photo describes an exposed unit at ceiling level, not a wall split or a cassette", () => {
    const alt = unitTypes.find((u) => u.name === "Ceiling Exposed")!.photo!.alt;
    expect(alt).toMatch(/exposed/i);
    expect(alt).toMatch(/ceiling/i);
    expect(alt).not.toMatch(/wall-mounted|cassette|recessed/i);
  });

  it.each(withPhotos.map((u) => [u.name, u.photo!] as const))(
    "%s: every image file exists, is a 4:3 JPEG with no EXIF/GPS, and matches its declared size",
    (_name, photo) => {
      const candidates = photo.srcSet.split(",").map((s) => s.trim().split(/\s+/));
      expect(candidates.length).toBeGreaterThanOrEqual(2);
      for (const [file, descriptor] of candidates) {
        expect(fs.existsSync(publicFile(file!)), file).toBe(true);
        const buf = fs.readFileSync(publicFile(file!));
        expect(buf.subarray(0, 2).toString("hex")).toBe("ffd8");
        const size = jpegSize(buf);
        expect(`${size.width}w`, file).toBe(descriptor);
        expect(size.width / size.height, file).toBeCloseTo(4 / 3, 1);
        const text = buf.toString("latin1");
        expect(
          text.includes("Exif") || text.includes("GPS") || text.includes("xmpmeta"),
          file,
        ).toBe(false);
        expect(buf.length, `${file} stays lightweight`).toBeLessThan(120 * 1024);
      }
      // the declared size must match the `src` file so the browser can reserve its space
      const main = jpegSize(fs.readFileSync(publicFile(photo.src)));
      expect({ width: main.width, height: main.height }).toEqual({
        width: photo.width,
        height: photo.height,
      });
      expect(photo.alt.length).toBeGreaterThan(30);
    },
  );

  it("never presents a stock photo as an AJ job", () => {
    for (const u of withPhotos) {
      if (u.photo!.source === "stock") {
        expect(u.photo!.alt, u.name).not.toMatch(/\bAJ\b/);
      }
    }
    expect(unitTypes.find((u) => u.name === "Wall Mounted")!.photo!.source).toBe("stock");
    expect(unitTypes.find((u) => u.name === "Ceiling Exposed")!.photo!.source).toBe("stock");
    expect(unitTypes.find((u) => u.name === "Ceiling Cassette")!.photo!.source).toBe("aj");
  });

  it("every licensed (stock) photo has a credit entry, and the CC BY-SA photo meets its licence terms", () => {
    const stock = withPhotos.filter((u) => u.photo!.source === "stock");
    expect(photoCredits).toHaveLength(stock.length);
    const exposed = photoCredits.find((c) => /Ceiling Exposed/.test(c.use))!;
    // CC BY-SA 4.0 requires: author, a link to the source, a link to the licence, and a note of changes
    expect(exposed.author).toBe("Nuorese 95");
    expect(exposed.licence).toBe("CC BY-SA 4.0");
    expect(exposed.href).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
    expect(exposed.licenceHref).toBe("https://creativecommons.org/licenses/by-sa/4.0/");
    expect(exposed.changes).toMatch(/cropped/i);
    expect(exposed.changes).toMatch(/same licence/i);
    const wall = photoCredits.find((c) => /Wall Mounted/.test(c.use))!;
    expect(wall.href).toMatch(/^https:\/\/www\.pexels\.com\/photo\/[a-z0-9-]+-\d+\/$/);
  });

  it("makes no invented specification, capacity, brand or efficiency claims", () => {
    const text = unitTypes.map((u) => `${u.note} ${u.photo?.alt ?? ""}`).join(" ");
    expect(text).not.toMatch(
      /\bBTU\b|\bHP\b|horsepower|inverter|kW|energy|R32|R410|daikin|panasonic|westpoint|hitachi/i,
    );
  });
});
