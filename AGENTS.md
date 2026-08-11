# Influenze.ai marketing site

Astro 7 static site, Tailwind v4, GSAP. Deployed to Cloudflare Workers Assets.
Three routes — `/`, `/features`, `/pricing` — plus a 404.

## Commands

```
astro dev --background     # start dev server (also: astro dev stop|status|logs)
npm run build              # astro build → dist/
npm run deploy             # build + wrangler deploy
npx astro check            # typecheck; must stay at 0 errors
```

## Layout

```
src/
  pages/          one file per route; each wraps layouts/Layout.astro
  layouts/        Layout.astro — head, SEO meta, JSON-LD, header/CTA/footer
  components/
    common/       site chrome: Header, Footer, Button, CtaBand, MobileMenu, …
    home/         features/  pricing/    one folder per route's sections
    app/          reproductions of the product UI — read APP-SPEC.md first
  data/           all copy and content, one file per section
  scripts/        client behaviour, one file per section; gsap/ holds helpers
  styles/         global.css (brand tokens) + app-tokens.css (product palette)
  assets/         images and icons, processed by astro:assets
public/           fonts, favicons, robots.txt, _headers (cache policy)
```

## Conventions

**Content lives in `src/data/`, never in markup.** Every section reads its copy,
figures and links from a data file. Editing wording should never mean opening a
component. `data/site.ts` holds the CTA URLs and meta copy.

**Components hold no content decisions.** They take props and render; a value
that appears in two places is defined once in `data/` and read twice.

**Scripts are progressive enhancement.** Every section renders correct and
readable with no JavaScript — animations only ever move markup that is already
there. Every script guards `prefers-reduced-motion`, re-inits on
`astro:page-load`, and bails silently if its markup is missing.

**Desktop is drawn on a 1728px grid.** Above `lg`, `1rem` is pinned to
`100vw / 108` (see `global.css`), so anything sized in rem scales with the
window. Use rem for layout; the design's px values divide by 16.

**Breakpoints come from `scripts/breakpoints.ts`,** so a script that switches
behaviour agrees with the CSS it animates. Components switch layout at `lg`.

**Comments explain *why*, in one or two lines.** Geometry, palette and per-beat
reasoning belong in `components/app/APP-SPEC.md`, not repeated in file headers.

## The product mockups — `src/components/app/`

The hero's workflow animation and the CreatorsAI collage are the real product UI
rebuilt as markup, not screenshots, so GSAP can drive them.

**`src/components/app/APP-SPEC.md` is the source of truth for all of it** — the
`screens/` vs `elements/` split, every colour and dimension with its Dart origin,
the eleven animation beats, and the `data-wf-*` hook contract. Read it before
changing anything under `components/app/` or `scripts/home-page/workflow/`.

The one rule to carry into any change: **the Flutter app wins, not Figma.**
Where the design file and the product disagree, reproduce the product.

Every `data-wf-*` attribute in the mockup is load-bearing — grep for one before
removing it. Beats read the values they animate *to* off the markup (computed
styles, `data-*`, `textContent`), so components stay the single source.

## Before going live

Open items, all content rather than code:

- **`data/site.ts`** — `SIGNUP_URL` points at `https://influenze.ai/login`, which
  is not a route on this site, and `LOGIN_URL` points at this site's own homepage.
  Both need the real app URLs.
- **`data/footer.ts`** — 8 links are `href: "#"` (Resources and Legal columns).
  These are the only source of the dev toolbar's `a11y-invalid-href` findings.
- **`data/pricing.ts`** — Scale's ₹50,000 threshold and +20% bonus, and
  Enterprise's threshold, are placeholders. Confirm before pricing goes public.
- **`data/testimonials.ts`** — all placeholders, so the section is commented out
  in `pages/index.astro`. Re-enable both lines once real quotes land.
- **`data/nav.ts`** — the Resources dropdown is commented out pending destinations.

Known and accepted:

- `perf-use-image-component` × 7 in the dev toolbar — all SVGs, which Astro's
  image service rejects outright. The real fix is asset-side (SVGO, and
  `iplix_media_logo.svg` is a base64 raster that should be a `.webp`).
- The homepage HTML is ~650 KB because the mockup renders ten app screens inline.
  It gzips well, but it is the thing to look at first if LCP needs work.
- Mock UI text carries real business email addresses (`ShareModal.astro`,
  `data/pricing.ts`, `data/faqs.ts`), so they are scrapeable from page source.
