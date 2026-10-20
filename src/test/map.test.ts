import { describe, expect, it } from "vitest";
import { TILE, layoutTiles, project, tileUrl } from "@/lib/map";
import { serviceMap } from "@/content/site";

describe("map maths", () => {
  it("projects known points to the right OpenStreetMap tile", () => {
    // Kuala Lumpur at zoom 9 is tile 400/251.
    const kl = project(3.139, 101.687, 9);
    expect(Math.floor(kl.x)).toBe(400);
    expect(Math.floor(kl.y)).toBe(251);
    const origin = project(0, 0, 1);
    expect(origin.x).toBeCloseTo(1, 6);
    expect(origin.y).toBeCloseTo(1, 6);
  });

  it("builds a 3x3 block of tiles with pins inside it", () => {
    const l = layoutTiles(serviceMap.center, serviceMap.zoom, serviceMap.pins);
    expect(l.tiles).toHaveLength(9);
    expect(l.sizePx).toBe(3 * TILE);
    for (const p of [l.center, ...l.pins]) {
      expect(p.left).toBeGreaterThan(0);
      expect(p.left).toBeLessThan(l.sizePx);
      expect(p.top).toBeGreaterThan(0);
      expect(p.top).toBeLessThan(l.sizePx);
    }
    const [kl, sel] = l.pins;
    expect(kl!.left).toBeGreaterThan(sel!.left); // KL is east of the Selangor pin
    expect(kl!.top).toBeGreaterThan(sel!.top); // and south of it
    expect(Math.abs(kl!.left - sel!.left)).toBeGreaterThan(40); // pins do not overlap
  });

  it("tile URLs follow the OSM scheme", () => {
    expect(tileUrl(9, 400, 251)).toBe("https://tile.openstreetmap.org/9/400/251.png");
  });
});
