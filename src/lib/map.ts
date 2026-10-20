/** Web-Mercator maths for placing pins on a grid of OpenStreetMap tiles (256px tiles). */
export const TILE = 256;

export function project(lat: number, lon: number, zoom: number) {
  const n = 2 ** zoom;
  const x = ((lon + 180) / 360) * n;
  const sin = Math.sin((lat * Math.PI) / 180);
  const y = (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * n;
  return { x, y };
}

export const tileUrl = (zoom: number, x: number, y: number) =>
  `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`;

/**
 * A (2r+1) x (2r+1) block of tiles around `center`, plus pixel positions (inside that block) of the
 * centre and of each point.
 */
export function layoutTiles(
  center: { lat: number; lon: number },
  zoom: number,
  points: readonly { id: string; lat: number; lon: number }[],
  radius = 1,
) {
  const c = project(center.lat, center.lon, zoom);
  const x0 = Math.floor(c.x) - radius;
  const y0 = Math.floor(c.y) - radius;
  const size = radius * 2 + 1;
  const tiles = [];
  for (let row = 0; row < size; row++)
    for (let col = 0; col < size; col++)
      tiles.push({ x: x0 + col, y: y0 + row, left: col * TILE, top: row * TILE });
  const toPx = (p: { x: number; y: number }) => ({
    left: (p.x - x0) * TILE,
    top: (p.y - y0) * TILE,
  });
  return {
    tiles,
    sizePx: size * TILE,
    center: toPx(c),
    pins: points.map((p) => ({ id: p.id, ...toPx(project(p.lat, p.lon, zoom)) })),
  };
}
