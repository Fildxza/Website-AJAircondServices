import { screen } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";

import { Reviews } from "@/components/site/reviews";
import { copy } from "@/content/copy";
import { googleReviews } from "@/content/site";
import { renderInLanguage, stubIntersectionObserver } from "./page-utils";

beforeAll(stubIntersectionObserver);

describe("Google reviews section", () => {
  it("shows exactly the three genuine customer reviews, verbatim", () => {
    const { container } = renderInLanguage(<Reviews />, "en");
    const quotes = [...container.querySelectorAll("blockquote")].map((q) => q.textContent);
    expect(quotes).toEqual([
      "First time using AJ Conditioning Services, and I’m genuinely impressed by how detailed and professional the whole service was. This wasn’t the usual quick aircond cleaning and leave. …",
      "best service",
      "Tip top service! Check condition before proceed service and make sure run smooth after service. 👍🏻",
    ]);
    const names = [...container.querySelectorAll("footer span.font-bold")].map(
      (n) => n.textContent,
    );
    expect(names).toEqual(["Zac Kwek", "vera kong", "Zho Du"]);
  });

  it("does not include the website operator's own review", () => {
    const { container } = renderInLanguage(<Reviews />, "en");
    expect(container.textContent).not.toMatch(/fildxza|All the best to AJ/i);
  });

  it("every card shows 5 stars with an accessible label", () => {
    renderInLanguage(<Reviews />, "en");
    expect(screen.getAllByRole("img", { name: copy.en.reviews.stars })).toHaveLength(3);
  });

  it("uses no photos or screenshots (none were supplied) and does not claim a live feed", () => {
    const { container } = renderInLanguage(<Reviews />, "en");
    expect(container.querySelectorAll("img")).toHaveLength(0);
    expect(container.textContent).toMatch(/does not update automatically/);
    expect(container.textContent).not.toMatch(/live|real-time/i);
  });

  it("is bilingual: frame text changes, review text stays as written", () => {
    const { container } = renderInLanguage(<Reviews />, "ms");
    expect(container.querySelector("h2")?.textContent).toBe(copy.ms.reviews.title);
    expect(container.textContent).toContain("tidak dikemas kini secara automatik");
    expect(container.textContent).toContain("best service");
  });

  it("the see-all button appears only with a verified Google link and opens safely", () => {
    const { container } = renderInLanguage(<Reviews />, "en");
    if (googleReviews.url === null) {
      expect(container.querySelector("a")).toBeNull();
    } else {
      const a = container.querySelector("a") as HTMLAnchorElement;
      expect(new URL(a.href).hostname).toMatch(/google\.com|goo\.gl|g\.page|maps\.app\.goo\.gl/);
      expect(a.target).toBe("_blank");
      expect(a.rel).toContain("noopener");
    }
  });
});
