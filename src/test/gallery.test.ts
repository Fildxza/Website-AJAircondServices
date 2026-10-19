import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { brandAssets, galleryItems } from "@/content/site";

const publicFile = (p: string) => path.join(process.cwd(), "public", p);

/** Reads width/height from a JPEG's start-of-frame marker. */
function jpegSize(buf: Buffer): { width: number; height: number } {
  let i = 2;
  while (i < buf.length - 9) {
    if (buf[i] !== 0xff) throw new Error("Not a valid JPEG marker stream");
    const marker = buf[i + 1]!;
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    }
    i += 2 + buf.readUInt16BE(i + 2);
  }
  throw new Error("No JPEG frame header found");
}

describe("gallery photos", () => {
  it("has the nine supplied job photos, each with a unique file", () => {
    expect(galleryItems).toHaveLength(9);
    expect(new Set(galleryItems.map((g) => g.src)).size).toBe(9);
  });

  it.each(galleryItems.map((g) => [g.label, g] as const))(
    "%s: files exist, match declared sizes, and carry no EXIF/GPS metadata",
    (_label, g) => {
      for (const [file, w, h] of [
        [g.src, g.width, g.height],
        [g.thumb, g.thumbWidth, g.thumbHeight],
      ] as const) {
        expect(fs.existsSync(publicFile(file)), file).toBe(true);
        const buf = fs.readFileSync(publicFile(file));
        expect(buf.subarray(0, 2).toString("hex"), file).toBe("ffd8");
        expect(jpegSize(buf), file).toEqual({ width: w, height: h });
        const text = buf.toString("latin1");
        // A phone photo's location lives in an EXIF/GPS block. None may ever ship.
        expect(text.includes("Exif"), `${file} has an EXIF block`).toBe(false);
        expect(text.includes("GPS"), `${file} has GPS data`).toBe(false);
        expect(text.includes("xmpmeta"), `${file} has XMP metadata`).toBe(false);
      }
      // The thumbnail keeps the full image's aspect ratio (no distortion).
      expect(g.thumbWidth / g.thumbHeight).toBeCloseTo(g.width / g.height, 2);
      expect(g.thumbWidth).toBeLessThanOrEqual(g.width);
    },
  );

  it("every photo has a caption and a descriptive alt text", () => {
    for (const g of galleryItems) {
      expect(g.label.length).toBeGreaterThan(5);
      expect(g.alt.length).toBeGreaterThan(30);
      expect(g.position).toMatch(/^\d+% \d+%$/);
    }
  });

  it("alt text and captions only describe what is visible: no claims or names", () => {
    const text = galleryItems.map((g) => `${g.label} ${g.alt}`).join(" ");
    expect(text).not.toMatch(/best|guarantee|certified|licen[cs]ed|award/i);
  });
});

describe("new logo", () => {
  it.each([
    ["full", brandAssets.logo.path, brandAssets.logo.width, brandAssets.logo.height],
    ["web", brandAssets.logo.webPath, brandAssets.logo.webWidth, brandAssets.logo.webHeight],
  ] as const)("%s version is a real PNG with the declared size", (_n, p, w, h) => {
    const file = publicFile(p);
    expect(fs.existsSync(file)).toBe(true);
    const png = fs.readFileSync(file);
    expect(png.subarray(1, 4).toString("ascii")).toBe("PNG");
    expect(png.readUInt32BE(16)).toBe(w);
    expect(png.readUInt32BE(20)).toBe(h);
  });

  it("the web version keeps the full logo's proportions (no distortion)", () => {
    const { width, height, webWidth, webHeight } = brandAssets.logo;
    expect(webWidth / webHeight).toBeCloseTo(width / height, 2);
  });

  it("the superseded logo file is no longer shipped", () => {
    expect(fs.existsSync(publicFile("/brand/aj-logo-cropped.png"))).toBe(false);
  });
});
