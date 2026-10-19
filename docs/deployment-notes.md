# Deployment notes

Status: **nothing has been deployed.** No domain has been bought and no hosting account has been
touched. Everything below is preparation. Last verified against the project on 2026-10-19.

## 1. What this project is

| Item                  | Detail                                                                      |
| --------------------- | --------------------------------------------------------------------------- |
| Framework             | TanStack Start (React 19, server-side rendered) on Vite 8, Tailwind v4      |
| Build wrapper         | `@lovable.dev/vite-tanstack-config`, which adds Nitro for deployment        |
| Default build target  | **Cloudflare Workers** (`cloudflare-module`), set by the Lovable config     |
| Lockfile              | `bun.lock` only. No `package-lock.json`                                     |
| Environment variables | **None required.** No secrets exist in the project                          |
| Dev / build commands  | `npm run dev`, `npm run build`, `npm test`                                  |
| Not a static site     | The page is rendered by a server function, so the host must run server code |

## 2. Hosting options

### Option A: Lovable's own hosting

The project was created in Lovable and is connected to it. Publishing there needs no code change,
but this has **not** been checked. The preferred route below assumes Netlify.

### Option B: Netlify (preferred by the owner)

The preferred temporary site name is **`ajaircondservices`**, subject to availability.

- **Availability is not confirmed.** A read-only request to `https://ajaircondservices.netlify.app/`
  on 2026-10-19 returned HTTP 404 from Netlify's servers. That is consistent with the name being
  free, but it is **not proof**: a claimed site with no deploy would look the same. The only
  reliable check is to create the site in the Netlify dashboard.
- **Do not treat any `*.netlify.app` URL as the production URL** until the site exists and the
  actual URL shown by Netlify has been opened and verified.

**The project cannot go to Netlify as it is.** It builds for Cloudflare. Two ways to target
Netlify were investigated:

|                               | A1. Nitro Netlify preset                                                                                                                                    | A2. Netlify's official Vite plugin                                                                          |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Change needed                 | One line in `vite.config.ts`: `nitro: { preset: "netlify" }`                                                                                                | Add dev dependency `@netlify/vite-plugin-tanstack-start`, add it to `vite.config.ts` and set `nitro: false` |
| New dependency                | None (Nitro is already installed)                                                                                                                           | Yes                                                                                                         |
| Tested here                   | **Yes: the production build succeeds** in a scratch copy. Output is a static `dist/` folder plus a server function in `.netlify/functions-internal/server/` | No (needs a dependency install)                                                                             |
| Runs correctly on Netlify     | **Not verified.** Needs a Netlify draft or preview deploy                                                                                                   | Documented by TanStack and Netlify as the supported path; not tried                                         |
| Recommended publish directory | `dist`                                                                                                                                                      | `dist/client` (per Netlify's docs)                                                                          |

Suggested first step, once approved: try **A1** on a Netlify _draft_ deploy (not production). If the
home page, the images and the `/favicon.ico` all load, keep it. If anything fails, switch to A2.

`netlify.toml` for A1 (not created yet; shown for reference):

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

Open questions for the first deploy log:

- **Package manager.** The repo has `bun.lock`. If Netlify does not install with Bun, use the build
  command `npm install && npm run build` (this does not write a lockfile to the repo).
- **Node version.** Local checks used Node 24.9. Set the Netlify `NODE_VERSION` environment variable
  to a version you have tested; this has not been tried on Netlify.
- **Function routing for `/`.** Nitro's Netlify output must serve `/` through the server function.
  Confirm on the draft deploy by loading the page and viewing the page source (it should contain the
  title and the JSON-LD script).

### Option C: Cloudflare (the build default)

`npm run build` already produces a Cloudflare Workers bundle in `.output/` with `wrangler.json`.
The auto-generated worker name is `tanstack-start-ts` and should be renamed before use. Deploying needs a
Cloudflare account and the `wrangler` tool, neither of which has been used.

**Preview caveat:** `vite preview` cannot serve the Cloudflare-target build (it looks for a
`dist/server/server.js` that this build does not emit). Use `vite dev`, or the host's own preview.

## 3. Pre-launch checklist

- [ ] Site created on the host; the **real** production URL opened and recorded
- [ ] `npm test`, `npx tsc --noEmit`, `npm run build` pass on the commit being deployed
- [ ] Home page loads over HTTPS; logo image loads from `/brand/aj-logo-web.png`, and all 9 gallery photos load from `/gallery/`
- [ ] Every WhatsApp button opens WhatsApp with the right number and message (tap each on a phone)
- [ ] Both `tel:` links dial the right numbers
- [ ] "Load map" loads the map; "Open in Google Maps" opens a new tab
- [ ] View page source: one `<title>`, one description, one JSON-LD block, `lang="en-MY"`
- [ ] Favicon decision made (see `brand-assets-pending.md`)
- [ ] Owner has answered, or explicitly deferred, every item in the decision register

## 4. After the production URL is confirmed

Do these only once the exact URL (including `https://`, and `www` or not) is verified live.

1. **Set `siteUrl`** in `src/content/site.ts` to the bare origin, for example
   `"https://example.com"` (no trailing slash, no path, never localhost or a preview URL). This
   automatically adds `canonical`, `og:url`, `og:image` (the cropped logo) and the JSON-LD `url` and
   `logo`. A test fails if the value is not a plain https origin.
2. **Add `public/sitemap.xml`** with the single home page:
   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url><loc>https://YOUR-VERIFIED-DOMAIN/</loc></url>
   </urlset>
   ```
3. **Add one line to `public/robots.txt`:** `Sitemap: https://YOUR-VERIFIED-DOMAIN/sitemap.xml`
4. **Pick one canonical host.** If the site is reachable on both a custom domain and the
   `*.netlify.app` address, make the custom domain primary and use it as `siteUrl`, so search engines
   do not see duplicate sites.
5. **Verify the rendered tags** (view source) and run the page through Google's Rich Results Test and
   the Schema Markup Validator. These were **not** run in the project phases because they need a live URL.
6. **Search Console:** add the property, confirm ownership, submit the sitemap. The owner or an
   authorised person does this with the owner's Google account.
7. **Business Profile:** add the verified website URL (see `google-business-profile-guide.md`). Use
   the UTM format from `utm-links.md`.
8. Test a link preview by sharing the URL in WhatsApp. Without a dedicated 1200×630 image the preview
   will be text plus the small logo.

## 5. Keep non-production copies out of search

- Netlify adds `X-Robots-Tag: noindex` to **deploy previews** automatically. Reports disagree on
  whether **branch deploys** get it too, so assume they do not, and avoid sharing branch-deploy URLs.
- The current `robots.txt` allows all crawling. That is correct for production but would also allow
  any other host serving the same files. If a staging site is ever created, give it its own
  `noindex` handling before it is shared.

## 6. Domain and DNS (when a custom domain is chosen)

- The owner buys and controls the domain, **not** the marketing operator, so the business keeps
  ownership. Use the owner's registrar account.
- In Netlify: Domain management, add the custom domain, then follow the DNS instructions it shows.
  HTTPS certificates are issued by Netlify after DNS resolves.
- Record who holds the registrar login, the renewal date and the billing contact.

## 7. Cost and account notes

No paid service has been added. Hosting, a custom domain, any analytics tool, and ads each have
their own cost and need an owner decision before they are enabled. Prices and plan limits change, so
check the provider's current pricing page at the time.
