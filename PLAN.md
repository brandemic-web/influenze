# Influenze.ai Website — Phase-by-Phase Build Plan (Astro)

## Context

Build the complete Influenze.ai marketing website (creator discovery/analytics SaaS) from the Figma file [Influenze](https://www.figma.com/design/wRKOHCAKIB0doxAmChMkM5/Influenze) (fileKey `wRKOHCAKIB0doxAmChMkM5`). The file contains **3 desktop page designs (1728px)** on Page 1 (`0:1`): Home (`143:60`), Features (`143:872`), Pricing (`143:1994`). No mobile designs exist. The frames are largely flat/ungrouped — navigate by coordinates + section screenshots, not the layer tree.

The repo is a fresh Astro 7 + Tailwind v4 scaffold: brand tokens already defined in `src/styles/global.css` (dark `#010101` bg, mint `#3AFF98`, purple `#6838FF`, Open Sauce Two self-hosted in `public/fonts/`), Cloudflare Workers static deploy via `wrangler.jsonc`. Only the stock Welcome page exists — everything else is to be built.

**Confirmed decisions:**

- **Fully responsive** — build desktop-first per Figma, adapt tablet/mobile with inferred breakpoints in the same phase.
- **Only the 3 designed pages** are built; undesigned nav/footer links (Resources, Blogs, Terms…) are placeholder `#` links.
- **CTAs (Login/Sign Up)** point to a placeholder constant, swapped for the real app URL later.
- **No UI framework** — pure Astro components + vanilla `<script>` for interactivity (accordion, tabs, nav dropdown, mobile menu).
- **Static build only — no animations.** Animations/sliders are integrated later via our standard stack (GSAP + SwiperJS), outside this plan's scope. Design sections that show scrolling strips (use-case cards, creator photo strips, testimonial band) are built as static rows/grids.
- All Figma asset exports (images, screenshots, 3D bolt renders, logos, photos) will be provided.

## Code standards (apply in every phase)

- Astro components, PascalCase filenames; pages in kebab-case. Tailwind v4 utilities only — extend tokens in the `@theme` block of `src/styles/global.css`, no `tailwind.config.js`, avoid scoped `<style>` except for keyframes/complex effects.
- **Copy lives in data files** (`src/data/*.ts`, typed), not hardcoded in markup — sections render from arrays (nav links, FAQ items, pricing plans, feature blocks, use-case cards, stats, testimonials).
- Central `src/data/site.ts` for site name, placeholder CTA URLs, social links.
- Images through `astro:assets` `<Image />` from `src/assets/` (auto-optimized); only favicons/OG images in `public/`.
- Semantic HTML (`header/nav/main/section/footer`, one `h1` per page), alt text, keyboard-accessible interactive widgets.
- Interactivity: small inline `<script>` per component (Astro processes/bundles these), no global JS framework.
- Fix the design's copy typo "Agnecy" → "Agency".

## Target structure

```
src/
├── assets/            # Figma exports (organized in Phase 0)
├── components/
│   ├── common/        # Header, MobileMenu, Footer, CtaBand, Button, SectionHeading, UseCaseCards
│   ├── home/          # HomeHero, CreatorCollage, StatsGrid, TrustedBy, FeatureTabs, Testimonials, Faq
│   ├── features/      # FeaturesHero, CreatorShowcase, FeatureBlock
│   └── pricing/       # PricingHero, PricingCards, CustomPlanStrip, CreditsExplainer
├── data/              # site.ts, nav.ts, useCases.ts, stats.ts, faqs.ts, testimonials.ts, featureBlocks.ts, pricing.ts
├── layouts/Layout.astro
├── pages/             # index.astro, features.astro, pricing.astro, 404.astro
└── styles/global.css
```

---

## Phase 0 — Foundation & assets

1. Delete `src/components/Welcome.astro` + stock `src/assets/*.svg`; blank `index.astro` shell.
2. Upgrade `src/layouts/Layout.astro`: props for `title`/`description`, canonical + OG/Twitter meta, font preloads, dark `bg-background-primary` body (base styles already in `global.css`).
3. Extend `global.css` `@theme`: purple gradient stops, card/surface colors seen in design (lavender testimonial card, glassy dark cards), container width (~1512px content on 1728 canvas).
4. **Asset intake**: create `src/assets/{brand,home,features,pricing,creators,logos}/` and an `ASSETS.md` manifest listing every required export with its Figma node ID (see reference table below) for exporting against it. Raster app screenshots (e.g. `1:1507`, `1:1506`) are exported as images, never rebuilt.
5. Scaffold all `src/data/*.ts` files with typed content extracted from Figma copy.
6. Build `Button.astro` (mint pill primary, outline/ghost variants) and `SectionHeading.astro` (two-line headings with mint/white alternating emphasis — the pattern every section uses).

## Phase 1 — Shared shell (used by all 3 pages)

1. `Header.astro` (`1:775`): logo, nav (Features, Pricing, Resources ▾ placeholder dropdown, Linkin Bio + "DotMe" badge), "Login / Sign Up" pill. Sticky, rounded dark bar.
2. `MobileMenu.astro`: hamburger + slide-down panel (inferred — no mobile design).
3. `Footer.astro` (`1:500`): 3D bolt render, link columns (Learn / Resources / Legal / Use Cases), giant "influenze.ai" watermark wordmark over purple gradient.
4. `CtaBand.astro` (`1:464`): "Ready to get influenzed?" + Sign Up button, decorative rails, floating creator photo chips + follower-count badges. Prop for button label ("Sign Up" / "Sign Up NOW").
5. `UseCaseCards.astro` (`1:705`): the 5 "Who is it for?" cards (Influencer Marketing, Talent Management, PR, Advertising, E-commerce) as a static card row — shared by Home and Features.
6. Wire into `Layout.astro`; verify on a stub page at desktop + mobile widths.

## Phase 2 — Home page (`1:3`, 9 sections)

Build top-to-bottom in `src/components/home/`, assemble in `index.astro`:

1. **HomeHero** (`1:41`): H1 "Find and analyze the right creators…", subcopy with highlighted "450M+ creators", dashboard mockup image (`1:657`) with floating "Search & Discover" callout card, purple gradient hero bg.
2. **CreatorCollage** (`1:45`): "Find & Analyze The Right Creators" heading over wave background, floating creator photo bubbles, 3D bolt, toast chips ("Added to Nykaa List"…).
3. **UseCaseCards** (reuse from Phase 1) with "Who is it for?" heading.
4. **StatsGrid** (`1:731`): 4 glassy stat cards (99.8% fraud detection, 50M+ profiles, 3hr+ saved, 99.8% historical data) over wave vector.
5. **TrustedBy** (`1:565`): partner logo row.
6. **FeatureTabs** (`1:60`): "Features that you get hooked to" — 3 tabs (Discover & Analyze / My Lists / Share) switching showcase panels; vanilla JS tab switcher.
7. **Testimonials** (`1:32`): 3 staggered lavender cards + "Real audiences. Real results." band (static).
8. **Faq** (`1:429`): "Questions we get asked a lot" — accordion (native `<details>` styled, or button+JS), 6 items.
9. Assemble with CtaBand + Footer; responsive pass on every section.

## Phase 3 — Features page (`1:815`)

1. **FeaturesHero** (`1:820`): "A product that caters to you" + full-bleed creator photo card strip (`1:826`, overflows viewport, static).
2. **CreatorShowcase** (`1:824`): "The fastest way to discover and evaluate the right creators" + creator result-card image.
3. Reuse **UseCaseCards**.
4. **FeatureBlock** component + `featureBlocks.ts` data — 7 alternating rows under "The platform that actually does the work": Targeted Discovery, Analytics & Media Kit, Contact Unlocks, Comparisons, Shortlists, Easy Sharing, Reusable Pools. Each: title, copy, screenshot asset.
5. Assemble `features.astro` with shared shell; responsive pass.

## Phase 4 — Pricing page (`1:1924`)

1. **PricingHero** (`1:2061`): "Built for teams that demand accuracy" over wave bg.
2. **PricingCards** from `pricing.ts`: Starter ₹6,000 / Growth ₹10,000 (highlighted, purple glow + 3D star) / Accelerate ₹20,000, each with users, 8 feature rows, credits, add-on note, Sign Up button.
3. **CustomPlanStrip** (`1:2304`): "Looking for More Flexibility?" + Get in Touch.
4. **CreditsExplainer** (`1:2244`): "How credits work" — credits dashboard card, cost chips (5/50/5 credits), "Your Credits Stay With You" side card, 3D bolt.
5. Assemble `pricing.astro`; responsive pass.

## Phase 5 — Polish, SEO & QA

1. `404.astro` on-brand page (wrangler is configured for `404-page` handling).
2. Cross-page pass: hover/focus states, consistent section spacing, keyboard nav through menu/tabs/accordion.
3. SEO: per-page titles/descriptions, OG image, `@astrojs/sitemap` + `robots.txt`, set `site` in `astro.config.mjs`.
4. Performance: verify image formats/sizes from `astro:assets`, font preload, no layout shift in hero.
5. Final visual comparison against Figma at 1728px, plus 1280 / 768 / 390px checks.

## Phase 6 — Deploy

`npm run build` → fix any build errors → `wrangler deploy` (existing `deploy` script) → verify live URL.

---

## Figma node reference (for per-section design context / exports)

File key: `wRKOHCAKIB0doxAmChMkM5`. Pages are flat frames — these are anchor nodes inside each region, not clean section frames.

| Page | Frame | Key anchor nodes |
|---|---|---|
| Home | `143:60` (1728×8465) | Hero copy `143:100`/`143:101`, collage heading `143:102`, use-cases `143:103` + `143:766`–`143:787`, stats `143:796`–`143:828`, trusted-by `143:116`, feature tabs `143:118`–`143:125`, testimonials `143:90` + `143:459`/`143:468`/`143:477`, FAQ `143:486`–`143:508`, CTA band `143:510`–`143:549`, footer `143:560`+ |
| Features | `143:872` (1728×7535) | Hero `143:877`–`143:880` + photo strip `143:883`, showcase `143:881`/`143:882`, use-cases `143:1005`+, 7 feature blocks `143:1290`–`143:1601`, CTA `143:1614`, footer `143:1658`+ |
| Pricing | `143:1994` (1728×4020) | Hero `143:2131`, plan cards `143:2134`/`143:2182`/`143:2227`, custom strip `143:2374`, credits explainer `143:2314`/`143:2383`, CTA `143:2017`, footer `143:2284`+, header `143:2389` |

During implementation, fetch per-section visuals with the Figma MCP (`get_screenshot` / `get_design_context` with fileKey `wRKOHCAKIB0doxAmChMkM5` + node ID).

## Verification (each phase)

1. `astro dev --background` (per CLAUDE.md), then check `astro dev logs` for errors.
2. Screenshot/browse the built section at 1728px and compare against the Figma section screenshot; check 768px and 390px for the responsive adaptation.
3. `npm run build` must pass clean before a phase is considered done.
