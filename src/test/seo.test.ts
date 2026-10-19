import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  BUSINESS_NAME,
  brandAssets,
  coveredAreas,
  faqs,
  seo,
  services,
  siteUrl,
  ssmRegistration,
} from "@/content/site";
import { absoluteUrl, buildLocalBusinessJsonLd, buildPageHead, serializeJsonLd } from "@/lib/seo";

// A syntactically valid origin used ONLY to exercise the "domain confirmed" code path.
const TEST_ORIGIN = "https://www.example.com";

type Tag = { title?: string; name?: string; property?: string; content?: string };
const tags = (head: ReturnType<typeof buildPageHead>) => head.meta as Tag[];
const find = (head: ReturnType<typeof buildPageHead>, key: "name" | "property", value: string) =>
  tags(head).find((t) => t[key] === value);

function allKeys(value: unknown, keys: string[] = []): string[] {
  if (Array.isArray(value)) value.forEach((v) => allKeys(v, keys));
  else if (value && typeof value === "object")
    for (const [k, v] of Object.entries(value)) {
      keys.push(k);
      allKeys(v, keys);
    }
  return keys;
}

describe("production domain handling", () => {
  it("siteUrl is either pending (null) or a bare https origin — never localhost or a path", () => {
    if (siteUrl === null) return;
    expect(siteUrl).toMatch(/^https:\/\/[a-z0-9-]+(\.[a-z0-9-]+)+$/i);
    expect(siteUrl).not.toMatch(/localhost|127\.0\.0\.1|\.local|lovable/i);
  });

  it("emits no absolute-URL tags while the domain is unconfirmed", () => {
    const head = buildPageHead(null);
    expect(head.links).toEqual([]);
    expect(find(head, "property", "og:url")).toBeUndefined();
    expect(find(head, "property", "og:image")).toBeUndefined();
    expect(find(head, "name", "twitter:image")).toBeUndefined();
    const ld = buildLocalBusinessJsonLd(null) as Record<string, unknown>;
    expect(ld).not.toHaveProperty("url");
    expect(ld).not.toHaveProperty("@id");
    expect(ld).not.toHaveProperty("logo");
    expect(absoluteUrl("/", null)).toBeNull();
  });

  it("adds canonical, og:url, og:image and JSON-LD url/logo once a domain is supplied", () => {
    const head = buildPageHead(TEST_ORIGIN);
    expect(head.links).toEqual([{ rel: "canonical", href: `${TEST_ORIGIN}/` }]);
    expect(find(head, "property", "og:url")?.content).toBe(`${TEST_ORIGIN}/`);
    expect(find(head, "property", "og:image")?.content).toBe(
      `${TEST_ORIGIN}${brandAssets.logo.path}`,
    );
    expect(find(head, "name", "twitter:image")?.content).toBe(
      `${TEST_ORIGIN}${brandAssets.logo.path}`,
    );
    const ld = buildLocalBusinessJsonLd(TEST_ORIGIN) as unknown as { url?: string; logo?: string };
    expect(ld.url).toBe(`${TEST_ORIGIN}/`);
    expect(ld.logo).toBe(`${TEST_ORIGIN}${brandAssets.logo.path}`);
  });
});

describe("title, description and social tags", () => {
  const head = buildPageHead(null);

  it("title targets KL & Selangor and stays a sensible length", () => {
    expect(seo.title).toMatch(/Kuala Lumpur|KL/);
    expect(seo.title).toMatch(/Selangor/);
    expect(seo.title).toContain(BUSINESS_NAME);
    expect(seo.title.length).toBeLessThanOrEqual(65);
  });

  it("description names both areas, core services, and fits the snippet length", () => {
    expect(seo.description).toMatch(/Kuala Lumpur/);
    expect(seo.description).toMatch(/Selangor/);
    expect(seo.description).toMatch(/servicing/i);
    expect(seo.description).toMatch(/chemical cleaning/i);
    expect(seo.description.length).toBeLessThanOrEqual(160);
    expect(seo.description.length).toBeGreaterThanOrEqual(110);
  });

  it("makes no superlative, licence or guarantee claims", () => {
    const copy = [seo.title, seo.description, seo.businessDescription].join(" ");
    expect(copy).not.toMatch(/\bbest\b|#1|cheapest|guarantee|licen[cs]ed|certified|award|years/i);
  });

  it("has exactly one title and no duplicated meta tags", () => {
    expect(tags(head).filter((t) => "title" in t)).toHaveLength(1);
    const ids = tags(head)
      .map((t) => t.name ?? t.property)
      .filter(Boolean);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("sets Open Graph and Twitter text tags from the same copy", () => {
    expect(find(head, "property", "og:title")?.content).toBe(seo.title);
    expect(find(head, "property", "og:description")?.content).toBe(seo.description);
    expect(find(head, "property", "og:type")?.content).toBe("website");
    expect(find(head, "property", "og:site_name")?.content).toBe(BUSINESS_NAME);
    expect(find(head, "property", "og:locale")?.content).toBe("en_MY");
    expect(find(head, "name", "twitter:card")?.content).toBe("summary");
    expect(find(head, "name", "twitter:title")?.content).toBe(seo.title);
    expect(find(head, "name", "description")?.content).toBe(seo.description);
  });

  it("og:image points at a real project asset whose size matches the declared size", () => {
    const file = path.join(process.cwd(), "public", brandAssets.logo.path);
    expect(fs.existsSync(file)).toBe(true);
    const png = fs.readFileSync(file);
    expect(png.subarray(1, 4).toString("ascii")).toBe("PNG");
    expect(png.readUInt32BE(16)).toBe(brandAssets.logo.width);
    expect(png.readUInt32BE(20)).toBe(brandAssets.logo.height);
  });
});

describe("LocalBusiness JSON-LD", () => {
  const ld = buildLocalBusinessJsonLd(null) as Record<string, unknown>;

  it("is valid JSON with the schema.org context and a LocalBusiness subtype", () => {
    const parsed = JSON.parse(serializeJsonLd(ld));
    expect(parsed).toEqual(JSON.parse(JSON.stringify(ld)));
    expect(parsed["@context"]).toBe("https://schema.org");
    expect(parsed["@type"]).toBe("HVACBusiness");
    expect(parsed.name).toBe("AJ Airconditioning Services");
  });

  it("carries the SSM number and no phone numbers (they live only in the Contact section)", () => {
    const parsed = JSON.parse(serializeJsonLd(ld));
    expect(parsed.identifier.value).toBe(ssmRegistration);
    expect(parsed).not.toHaveProperty("telephone");
    expect(parsed).not.toHaveProperty("contactPoint");
    const everything = JSON.stringify(buildPageHead(TEST_ORIGIN));
    expect(everything).not.toMatch(/60182833900|60182621417|018-?283|018-?262/);
  });

  it("declares KL and Selangor as the service area and nothing else", () => {
    const parsed = JSON.parse(serializeJsonLd(ld));
    expect(parsed.areaServed.map((a: { name: string }) => a.name)).toEqual([...coveredAreas]);
    expect(coveredAreas).toEqual(["Kuala Lumpur", "Selangor"]);
  });

  it("lists exactly the site's services, without prices", () => {
    const parsed = JSON.parse(serializeJsonLd(ld));
    const names = parsed.hasOfferCatalog.itemListElement.map(
      (o: { itemOffered: { name: string } }) => o.itemOffered.name,
    );
    expect(names).toEqual(services.map((s) => s.title));
    expect(JSON.stringify(parsed)).not.toMatch(/price|RM\s?\d/i);
  });

  it("contains no unverified fields (address, geo, hours, ratings, reviews, radius, email, social)", () => {
    const keys = allKeys(JSON.parse(serializeJsonLd(buildLocalBusinessJsonLd(TEST_ORIGIN))));
    for (const forbidden of [
      "address",
      "streetAddress",
      "geo",
      "latitude",
      "longitude",
      "hasMap",
      "openingHours",
      "openingHoursSpecification",
      "aggregateRating",
      "review",
      "reviews",
      "priceRange",
      "foundingDate",
      "email",
      "sameAs",
      "GeoCircle",
      "geoRadius",
    ]) {
      expect(keys, forbidden).not.toContain(forbidden);
    }
    expect(serializeJsonLd(ld)).not.toMatch(/GeoCircle|radius/i);
  });

  it("is embedded safely: '<' is escaped so it cannot close the script tag", () => {
    expect(serializeJsonLd({ a: "</script><b>x" })).not.toContain("<");
    const script = buildPageHead(null).scripts[0]!;
    expect(script.type).toBe("application/ld+json");
    expect(script.children).not.toContain("<");
    expect(() => JSON.parse(script.children)).not.toThrow();
  });
});

describe("local copy", () => {
  const answers = faqs.map((f) => `${f.q} ${f.a}`).join("\n");

  it("covers residential/commercial use and preventive maintenance from the profile", () => {
    expect(answers).toMatch(/residential, commercial and business premises/);
    expect(answers).toMatch(/preventive maintenance/i);
  });

  it("FAQ says AJ installs air conditioners (owner's correction) and no longer says it does not", () => {
    const install = faqs.find((f) => /install air conditioners/i.test(f.q));
    expect(install, "installation FAQ exists").toBeDefined();
    expect(install!.a).toMatch(/^Yes\./);
    expect(install!.a).toMatch(/we also install air conditioners/i);
    expect(answers).not.toMatch(/installation is not offered|not offered/i);
    expect(answers).not.toMatch(/^No\./m);
  });

  it("installation answer invents no price, brand, warranty or timeframe", () => {
    const a = faqs.find((f) => /install air conditioners/i.test(f.q))!.a;
    expect(a).not.toMatch(
      /RM\s?\d|warrant|guarantee|same day|within \d|free|brand|daikin|panasonic/i,
    );
  });

  it("names no neighbourhood-level coverage", () => {
    const text = [answers, seo.description, seo.businessDescription].join(" ");
    expect(text).not.toMatch(
      /Bangsar|Petaling|Shah Alam|Subang|Klang|Cheras|Kepong|Ampang|Puchong|Cyberjaya|Putrajaya|Damansara|Kajang|Rawang/i,
    );
  });
});
